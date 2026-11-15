#!/bin/bash
# Record Voice Lab clips with ElevenLabs, in both voices, a few takes each.
#
#   ./eleven_tts.sh tts/linking.tsv          # 3 takes per clip per voice
#   ./eleven_tts.sh tts/linking.tsv 5        # 5 takes
#
# Run it on your own computer (it needs your ElevenLabs key; the key is asked for and never
# saved). It writes   tts-takes/<voice>/<clip-id>-<take>.mp3   next to this script and skips
# takes that already exist, so it is safe to run again after a network hiccup.
# Short phrases come out a little different every time, so the best take of each is chosen
# afterwards (the one with no gap at the joins), then brought into ../../audio/ and measured
# like every other clip (see README.md).
#
# The voices are the ElevenLabs library voices the Voice Lab recordings use. Override with
#   ALICE_VOICE_ID=... BRIAN_VOICE_ID=... ELEVEN_MODEL=... ./eleven_tts.sh ...
set -u
cd "$(dirname "$0")"

LIST="${1:-}"
TAKES="${2:-3}"
if [ -z "$LIST" ] || [ ! -f "$LIST" ]; then
  echo "Usage: $0 <lines.tsv> [takes]"; exit 1
fi

ALICE="${ALICE_VOICE_ID:-Xb7hH8MSUJpSbSDYk0k2}"   # Alice — British
BRIAN="${BRIAN_VOICE_ID:-nPczCjzI2devNBz1zQrb}"   # Brian — American
MODEL="${ELEVEN_MODEL:-eleven_multilingual_v2}"

KEY="${ELEVENLABS_API_KEY:-}"
if [ -z "$KEY" ]; then
  printf "ElevenLabs API key (typing stays hidden): "
  read -rs KEY; echo
fi
[ -z "$KEY" ] && { echo "No key, nothing to do."; exit 1; }

made=0; kept=0; failed=0; streak=0; said=""
mkdir -p tts-takes; LOG="tts-takes/errors.log"
TMP="$(mktemp -t eleven.XXXXXX)"

record() {   # voice-name voice-id clip-id text take
  local out="tts-takes/$1/$3-$5.mp3"
  if [ -s "$out" ]; then kept=$((kept+1)); return 0; fi
  mkdir -p "tts-takes/$1"
  local text; text=$(printf '%s' "$4" | sed 's/\\/\\\\/g; s/"/\\"/g')
  local body
  body=$(printf '{"text":"%s","model_id":"%s","seed":%d,"voice_settings":{"stability":0.5,"similarity_boost":0.75,"style":0,"use_speaker_boost":true}}' "$text" "$MODEL" "$5")
  local code
  code=$(curl -sS -o "$TMP" -w '%{http_code}' -X POST \
    "https://api.elevenlabs.io/v1/text-to-speech/$2?output_format=mp3_44100_128" \
    -H "xi-api-key: $KEY" -H "Content-Type: application/json" -H "Accept: audio/mpeg" \
    --data "$body")
  if [ "$code" = "200" ]; then
    mv "$TMP" "$out"; made=$((made+1)); printf "  ✓ %-6s %-24s take %s\n" "$1" "$3" "$5"
  else
    failed=$((failed+1)); streak=$((streak+1))
    printf "  ✗ %-6s %-24s take %s  (HTTP %s) " "$1" "$3" "$5" "$code"
    head -c 300 "$TMP"; echo
    { printf '%s  %s %s take %s  HTTP %s  ' "$(date '+%F %T')" "$1" "$3" "$5" "$code"; head -c 1000 "$TMP"; echo; } >> "$LOG"
    explain "$code" "$TMP"
    if [ "$streak" -ge 4 ]; then
      echo; echo "Four failures in a row, so I stopped. The replies are saved in $(pwd)/$LOG"
      rm -f "$TMP"; exit 1
    fi
    return 0
  fi
  streak=0
}

explain() {   # http-code reply-file: say what a failure usually means, once per kind
  local reply; reply=$(head -c 2000 "$2" 2>/dev/null)
  local why=""
  case "$1:$reply" in
    000:*) why="curl could not reach ElevenLabs at all (no internet, a VPN or a firewall).";;
    *missing_permissions*) why="The key works but is not allowed to make speech. On the API keys page, edit the key and turn on Text to Speech access (or make a new key with no restrictions).";;
    *paid_plan_required*|*payment_required*|402:*) why="Your ElevenLabs plan does not allow this through the API (for example, library voices on the free plan).";;
    *quota_exceeded*|*insufficient*credit*) why="The account is out of credits for this month.";;
    *voice_not_found*|404:*) why="ElevenLabs does not know that voice id. Set ALICE_VOICE_ID / BRIAN_VOICE_ID to the voices you used before.";;
    429:*) why="Too many requests at once; wait a minute and run it again.";;
    401:*) why="The key was refused: check it was copied whole, with no space before or after.";;
  esac
  if [ -n "$why" ] && [ "$why" != "$said" ]; then echo "    → $why"; said="$why"; fi
}

while IFS=$'\t' read -r id text; do
  case "$id" in ''|\#*) continue;; esac
  [ -z "${text:-}" ] && continue
  echo "$id — \"$text\""
  for n in $(seq 1 "$TAKES"); do
    record alice "$ALICE" "$id" "$text" "$n"
    record brian "$BRIAN" "$id" "$text" "$n"
  done
done < "$LIST"
rm -f "$TMP"

echo
echo "New takes: $made   already there: $kept   failed: $failed"
echo "Takes are in: $(pwd)/tts-takes"
[ "$failed" -gt 0 ] && echo "Run the same command again to retry the ones that failed. Replies saved in $(pwd)/$LOG"
exit 0
