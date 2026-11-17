"""Pre-recorded speech clips (Phonon TTS) for activities such as Busy Pictures.

Clips are made offline (busy-pictures/tools/make_phonon_clips.py on a Mac),
uploaded once, and served to phones as small MP3s:

    GET  /api/tts/<voice>/<key>.mp3   a clip, cached by the phone for a year
    GET  /api/tts/status              which storage is in use, for checking setup
    POST /api/tts/upload              a zip of clips; needs TTS_UPLOAD_TOKEN

<voice> is a short id such as "v1"; <key> is a hash of the exact spoken text
(see clipKey() in busy-pictures/index.html), so a corrected sentence gets a
new clip automatically and a stale one is never played.

Storage
-------
Published site: Replit App Storage — create a bucket in the App Storage tool;
no package install is needed. Locally, or if App Storage is not set up yet:
the folder named by TTS_LOCAL_DIR (default ./tts-clips).
If neither has a clip, the route answers 404 and the page falls back to the
phone's own voice, so missing clips never break an activity.
"""

import io
import json
import os
import re
import secrets
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import zipfile
from collections import OrderedDict

ROOT = os.path.dirname(os.path.abspath(__file__))
IS_DEPLOYMENT = os.environ.get("REPLIT_DEPLOYMENT") == "1"
LOCAL_DIR = os.environ.get("TTS_LOCAL_DIR", os.path.join(ROOT, "tts-clips"))
UPLOAD_TOKEN = os.environ.get("TTS_UPLOAD_TOKEN", "").strip()

CLIP_PATH_RE = re.compile(r"^/api/tts/(v[0-9]{1,2})/([0-9a-z]{1,16})\.mp3$")
ZIP_NAME_RE = re.compile(r"^(v[0-9]{1,2})/([0-9a-z]{1,16})\.mp3$")
MAX_CLIP_BYTES = 400 * 1024
MAX_UPLOAD_BYTES = 40 * 1024 * 1024
MEMORY_CACHE_CLIPS = 2000          # ~30 MB of the most-played clips
MISSING_RECHECK_SECONDS = 600      # ask storage again about a missing clip after this


def _object_name(voice, key):
    return "tts/%s/%s.mp3" % (voice, key)


class _BucketStore:
    """Replit App Storage through Google Cloud Storage's JSON API.

    Replit's own `replit-object-storage` package does not support Python 3.13
    (this Repl's Python), so this talks to the same services directly, using
    only the standard library. Credentials come from the Replit sidecar the
    same way the official SDK gets them: fetch a subject token, exchange it
    for a Google access token (RFC 8693), then call storage.googleapis.com.
    """

    name = "replit-app-storage"
    SIDECAR = os.environ.get("REPLIT_SIDECAR_ENDPOINT", "http://127.0.0.1:1106")
    SCOPES = " ".join([
        "https://www.googleapis.com/auth/devstorage.full_control",
        "https://www.googleapis.com/auth/devstorage.read_only",
        "https://www.googleapis.com/auth/devstorage.read_write",
    ])
    GCS = os.environ.get("TTS_GCS_ENDPOINT", "https://storage.googleapis.com")

    def __init__(self):
        self._token = ""
        self._token_expires = 0.0
        self._token_lock = threading.Lock()
        self.bucket = self._default_bucket()
        self._access_token()  # fail now, not on the first student's tap

    def _http(self, method, url, data=None, headers=None, timeout=10):
        request = urllib.request.Request(url, data=data, method=method, headers=headers or {})
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.read()

    def _default_bucket(self):
        for var in ("TTS_BUCKET_ID", "REPLIT_DEFAULT_BUCKET_ID", "DEFAULT_OBJECT_STORAGE_BUCKET_ID"):
            if os.environ.get(var, "").strip():
                return os.environ[var].strip()
        raw = self._http("GET", self.SIDECAR + "/object-storage/default-bucket", timeout=3)
        bucket = json.loads(raw or b"{}").get("bucketId", "")
        if not bucket:
            raise RuntimeError("No App Storage bucket. Create one in the Replit App Storage tool.")
        return bucket

    def _access_token(self):
        with self._token_lock:
            if self._token and time.time() < self._token_expires:
                return self._token
            subject = json.loads(self._http("GET", self.SIDECAR + "/credential", timeout=3))["access_token"]
            body = urllib.parse.urlencode({
                "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
                "audience": "replit",
                "scope": self.SCOPES,
                "requested_token_type": "urn:ietf:params:oauth:token-type:access_token",
                "subject_token": subject,
                "subject_token_type": "access_token",
            }).encode("utf-8")
            raw = self._http("POST", self.SIDECAR + "/token", data=body, timeout=5,
                             headers={"Content-Type": "application/x-www-form-urlencoded"})
            reply = json.loads(raw)
            self._token = reply["access_token"]
            self._token_expires = time.time() + max(60, int(reply.get("expires_in", 3600)) - 120)
            return self._token

    def _auth(self, extra=None):
        headers = {"Authorization": "Bearer " + self._access_token()}
        headers.update(extra or {})
        return headers

    def get(self, voice, key):
        url = "%s/storage/v1/b/%s/o/%s?alt=media" % (
            self.GCS, urllib.parse.quote(self.bucket, safe=""),
            urllib.parse.quote(_object_name(voice, key), safe=""))
        try:
            return self._http("GET", url, headers=self._auth())
        except urllib.error.HTTPError as exc:
            if exc.code == 404:
                return None
            raise

    def put(self, voice, key, data):
        url = "%s/upload/storage/v1/b/%s/o?uploadType=media&name=%s" % (
            self.GCS, urllib.parse.quote(self.bucket, safe=""),
            urllib.parse.quote(_object_name(voice, key), safe=""))
        self._http("POST", url, data=data, timeout=30,
                   headers=self._auth({"Content-Type": "audio/mpeg"}))


class _LocalStore:
    name = "local-folder"

    def __init__(self, folder):
        self._folder = folder

    def _path(self, voice, key):
        return os.path.join(self._folder, voice, key + ".mp3")

    def get(self, voice, key):
        try:
            with open(self._path(voice, key), "rb") as f:
                return f.read()
        except FileNotFoundError:
            return None

    def put(self, voice, key, data):
        path = self._path(voice, key)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        tmp = path + ".part"
        with open(tmp, "wb") as f:
            f.write(data)
        os.replace(tmp, path)


class TtsClips:
    def __init__(self):
        self._lock = threading.Lock()
        self._store = None
        self._store_error = ""
        self._resolved = False
        self._memory = OrderedDict()
        self._missing = {}

    # -- storage -----------------------------------------------------------
    def _get_store(self):
        with self._lock:
            if self._resolved:
                return self._store
            self._resolved = True
            try:
                self._store = _BucketStore()
            except Exception as exc:  # package missing or no bucket configured
                self._store_error = "%s: %s" % (type(exc).__name__, exc)
                # A deployment's disk is temporary, so never keep clips there.
                self._store = None if IS_DEPLOYMENT else _LocalStore(LOCAL_DIR)
            return self._store

    def status(self):
        store = self._get_store()
        return {
            "storage": store.name if store else "none",
            "storageError": self._store_error if not isinstance(store, _BucketStore) else "",
            "bucket": store.bucket if isinstance(store, _BucketStore) else "",
            "uploadsEnabled": bool(UPLOAD_TOKEN) or not IS_DEPLOYMENT,
            "cachedClips": len(self._memory),
        }

    def _lookup(self, voice, key):
        ident = voice + "/" + key
        with self._lock:
            data = self._memory.get(ident)
            if data is not None:
                self._memory.move_to_end(ident)
                return data
            missing_at = self._missing.get(ident)
            if missing_at and time.time() - missing_at < MISSING_RECHECK_SECONDS:
                return None
        store = self._get_store()
        if store is None:
            return None
        data = store.get(voice, key)
        with self._lock:
            if data is None:
                self._missing[ident] = time.time()
                if len(self._missing) > 50000:
                    self._missing.clear()
            else:
                self._missing.pop(ident, None)
                self._memory[ident] = data
                while len(self._memory) > MEMORY_CACHE_CLIPS:
                    self._memory.popitem(last=False)
        return data

    # -- HTTP --------------------------------------------------------------
    def serve(self, handler, path, head=False):
        """Answer GET/HEAD for a clip URL. Returns False if the path is not a clip."""
        match = CLIP_PATH_RE.match(path)
        if not match:
            return False
        try:
            data = self._lookup(match.group(1), match.group(2))
        except Exception as exc:
            handler.log_error("tts clip lookup failed: %s", exc)
            data = None
        if data is None:
            handler._cache_policy = "no-store"
            handler.send_response(404)
            handler.send_header("Content-Type", "text/plain; charset=utf-8")
            handler.send_header("Content-Length", "0")
            handler.send_header("Access-Control-Allow-Origin", "*")
            handler.end_headers()
            return True
        handler._cache_policy = "public, max-age=31536000, immutable"
        handler.send_response(200)
        handler.send_header("Content-Type", "audio/mpeg")
        handler.send_header("Content-Length", str(len(data)))
        handler.send_header("Access-Control-Allow-Origin", "*")
        handler.end_headers()
        if not head:
            try:
                handler.wfile.write(data)
            except (BrokenPipeError, ConnectionResetError):
                pass
        return True

    def upload(self, handler):
        """POST /api/tts/upload — body is a zip of <voice>/<key>.mp3 entries."""
        if IS_DEPLOYMENT or UPLOAD_TOKEN:
            supplied = handler.headers.get("Authorization", "")
            supplied = supplied[7:].strip() if supplied.lower().startswith("bearer ") else ""
            if not UPLOAD_TOKEN or not secrets.compare_digest(supplied, UPLOAD_TOKEN):
                return 403, {"error": "Uploads need the TTS_UPLOAD_TOKEN secret."}
        store = self._get_store()
        if store is None:
            return 503, {"error": "No clip storage. Create a bucket in Replit's App Storage tool, then republish.",
                         "detail": self._store_error}
        length = int(handler.headers.get("Content-Length", 0) or 0)
        if length <= 0 or length > MAX_UPLOAD_BYTES:
            return 400, {"error": "Upload must be a zip under %d MB." % (MAX_UPLOAD_BYTES // (1024 * 1024))}
        body = handler.rfile.read(length)
        try:
            archive = zipfile.ZipFile(io.BytesIO(body))
        except zipfile.BadZipFile:
            return 400, {"error": "Body is not a zip file."}
        stored, skipped = 0, []
        for info in archive.infolist():
            match = ZIP_NAME_RE.match(info.filename)
            if not match or info.file_size > MAX_CLIP_BYTES:
                skipped.append(info.filename)
                continue
            data = archive.read(info)
            if not (data[:3] == b"ID3" or data[:1] == b"\xff"):
                skipped.append(info.filename)
                continue
            voice, key = match.group(1), match.group(2)
            store.put(voice, key, data)
            with self._lock:
                self._missing.pop(voice + "/" + key, None)
            stored += 1
        return 200, {"stored": stored, "skipped": skipped[:20], "storage": store.name}
