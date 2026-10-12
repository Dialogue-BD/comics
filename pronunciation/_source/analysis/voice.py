"""Which voice the scripts are working on.

Alice (UK) is the original set: audio in ../../audio, data in ../src/data/clips.json.
Every other voice keeps the same clip ids in its own folder and data file:
audio in ../../audio/<voice>/, data in ../src/data/clips-<voice>.json.

    VOICELAB_VOICE=brian VOICELAB_WORK=/path/to/brian-work python3 analyse.py
"""
import os

HERE = os.path.dirname(os.path.abspath(__file__))
VOICE = os.environ.get('VOICELAB_VOICE', 'alice')
DEFAULT = 'alice'
_AUDIO = os.path.join(HERE, '..', '..', 'audio')
_DATA = os.path.join(HERE, '..', 'src', 'data')


# Praat pitch search range (Hz): a deep male voice needs a lower floor and ceiling.
F0_RANGE = {'alice': (75, 500), 'brian': (60, 300)}.get(VOICE, (75, 500))


def audio_dir(voice=VOICE):
    return _AUDIO if voice == DEFAULT else os.path.join(_AUDIO, voice)


def app_json(voice=VOICE):
    return os.path.join(_DATA, 'clips.json' if voice == DEFAULT else f'clips-{voice}.json')
