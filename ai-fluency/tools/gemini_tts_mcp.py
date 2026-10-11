#!/usr/bin/env python3
"""A small MCP server so Claude can record the AI Fluency Lab's voice lines itself, on your Mac (which can reach
the Gemini API). It wraps tools/gemini_tts.py; the key comes from the server's environment, so Claude never sees it.

Add to Claude Desktop's config (Settings → Developer → Edit Config), then restart the app:

  "mcpServers": {
    "ai-fluency-voice": {
      "command": "python3",
      "args": ["<repo>/ai-fluency/tools/gemini_tts_mcp.py"],
      "env": { "GEMINI_API_KEY": "your-key" }
    }
  }

Needs:  pip3 install mcp google-genai   and ffmpeg.
Tools: voice_status, voice_audition, voice_record_start, voice_record_progress."""
import json, os, subprocess, sys, time
try:
    from mcp.server.fastmcp import FastMCP            # mcp 1.x
except ImportError:
    from mcp.server.mcpserver import MCPServer as FastMCP   # mcp 2.x

HERE = os.path.dirname(os.path.abspath(__file__)); AUD = os.path.join(HERE, '..', 'audio')
SCRIPT = os.path.join(HERE, 'gemini_tts.py'); LOG = os.path.join(AUD, '_record.log')
mcp = FastMCP('ai-fluency-voice')

def run(args, timeout=180):
    r = subprocess.run([sys.executable, SCRIPT] + args, capture_output=True, text=True, timeout=timeout, cwd=os.path.join(HERE, '..'))
    return (r.stdout + r.stderr).strip()[-3000:]

@mcp.tool()
def voice_status() -> str:
    """How many spoken lines are recorded and how many are still missing (reads audio/lines.json and manifest.json)."""
    lines = json.load(open(os.path.join(AUD, 'lines.json'))); man = json.load(open(os.path.join(AUD, 'manifest.json')))
    have = set(man.get('keys', [])); miss = [l for l in lines if l['key'] not in have or not os.path.exists(os.path.join(AUD, l['key'] + '.mp3'))]
    return json.dumps({'lines': len(lines), 'recorded': len(lines) - len(miss), 'missing': len(miss),
                       'first_missing': [l['text'][:70] for l in miss[:5]], 'key_present': bool(os.environ.get('GEMINI_API_KEY'))})

@mcp.tool()
def voice_audition(coach: str = 'Sulafat', ayesha: str = 'Leda', model: str = 'gemini-3.8-flash-tts') -> str:
    """Record one sample line per voice into audio/_audition/ so the voices can be judged by ear."""
    return run(['--audition', '--coach', coach, '--ayesha', ayesha, '--model', model])

@mcp.tool()
def voice_record_start(coach: str = 'Sulafat', ayesha: str = 'Leda', limit: int = 0, only: str = '', model: str = 'gemini-3.8-flash-tts') -> str:
    """Start recording the missing lines in the background (limit 0 = all). Returns at once; poll voice_record_progress."""
    args = ['--coach', coach, '--ayesha', ayesha, '--model', model] + (['--limit', str(limit)] if limit else []) + (['--only', only] if only else [])
    os.makedirs(AUD, exist_ok=True)
    subprocess.Popen([sys.executable, '-u', SCRIPT] + args, stdout=open(LOG, 'w'), stderr=subprocess.STDOUT, cwd=os.path.join(HERE, '..'), start_new_session=True)
    return 'started — call voice_record_progress to watch it'

@mcp.tool()
def voice_record_progress(tail: int = 12) -> str:
    """The last lines of the background recording's log."""
    if not os.path.exists(LOG): return 'no recording has been started'
    age = int(time.time() - os.path.getmtime(LOG))
    return f'(log last written {age}s ago)\n' + '\n'.join(open(LOG).read().splitlines()[-tail:])

if __name__ == '__main__':
    mcp.run()
