/* Crafted 2.5D / Isometric Wordless Vector Illustrations for the GPA Vocabulary Lab */
(function () {
  'use strict';

  window.GPA_SHARED_DEFS_SVG = `
<svg class="gpa-defs-svg" id="gpa-defs-svg" width="0" height="0" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="ga-stage-bg" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="#1b5832"/>
      <stop offset="58%" stop-color="#103820"/>
      <stop offset="100%" stop-color="#071d10"/>
    </radialGradient>

    <linearGradient id="ga-gold-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff0bd"/>
      <stop offset="45%" stop-color="#f2d68c"/>
      <stop offset="100%" stop-color="#a87c36"/>
    </linearGradient>

    <linearGradient id="ga-gold-h" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbe4a2"/>
      <stop offset="55%" stop-color="#c99f53"/>
      <stop offset="100%" stop-color="#7c5920"/>
    </linearGradient>

    <linearGradient id="ga-jade-top" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#357d4e"/>
      <stop offset="100%" stop-color="#1e5332"/>
    </linearGradient>

    <linearGradient id="ga-jade-left" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#225e39"/>
      <stop offset="100%" stop-color="#11361f"/>
    </linearGradient>

    <linearGradient id="ga-jade-right" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18472a"/>
      <stop offset="100%" stop-color="#0a2414"/>
    </linearGradient>

    <linearGradient id="ga-emerald-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86efac"/>
      <stop offset="45%" stop-color="#22c55e"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>

    <linearGradient id="ga-sky-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bae6fd"/>
      <stop offset="45%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#1d4ed8"/>
    </linearGradient>

    <linearGradient id="ga-coral-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fecaca"/>
      <stop offset="50%" stop-color="#ef4444"/>
      <stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>

    <linearGradient id="ga-cream-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fffef9"/>
      <stop offset="100%" stop-color="#ddd6be"/>
    </linearGradient>

    <linearGradient id="ga-cloud-v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="65%" stop-color="#e3ead9"/>
      <stop offset="100%" stop-color="#b4c8b4"/>
    </linearGradient>

    <linearGradient id="ga-metal-deck" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e5ebe3"/>
      <stop offset="100%" stop-color="#9fb09e"/>
    </linearGradient>

    <linearGradient id="ga-dark-slab" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1c2f24"/>
      <stop offset="100%" stop-color="#0a160f"/>
    </linearGradient>

    <linearGradient id="ga-beam-teal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgba(125,211,252,0.55)"/>
      <stop offset="50%" stop-color="rgba(74,222,128,0.32)"/>
      <stop offset="100%" stop-color="rgba(74,222,128,0.02)"/>
    </linearGradient>

    <filter id="ga-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
</svg>`.trim();

  const STAGE_BASE = `
    <rect x="0" y="0" width="240" height="160" fill="url(#ga-stage-bg)"/>
    <g fill="none" stroke="rgba(242,214,140,0.09)" stroke-width="1">
      <path d="M12 132 L120 82 L228 132"/>
      <path d="M40 148 L120 110 L200 148"/>
      <line x1="20" y1="138" x2="220" y2="138"/>
    </g>`;

  window.GPA_VOCAB_WORDS = [
    {
      id: 'vibecoding',
      word: 'Vibecoding',
      spokenWord: 'Vibe coding',
      phonetic: 'VIBE-co-ding',
      say: 'Vibe coding. Building an app by telling AI what you want in plain language.',
      analogy: 'Building apps by talking to AI in plain language — no syntax memorized.',
      bn: 'ভাইব-কোডিং (ভ-আই-ব + কোডিং) — হাতে কোড না লিখে এআই-কে বুঝিয়ে বলে অ্যাপ তৈরি করা।',
      svg: `
        ${STAGE_BASE}
        <!-- Left: Plain-Language Voice Prompt Bubble -->
        <ellipse cx="52" cy="126" rx="28" ry="7" fill="rgba(0,0,0,0.36)"/>
        <circle cx="27" cy="121" r="6" fill="url(#ga-emerald-v)" stroke="#d1fae5" stroke-width="1.3"/>
        <path d="M22 55 H78 A7 7 0 0 1 85 62 V96 A7 7 0 0 1 78 103 H44 L33 114 L36 103 H22 A7 7 0 0 1 15 96 V62 A7 7 0 0 1 22 55 Z" fill="#9fb09e" transform="translate(2,3)"/>
        <path d="M22 55 H78 A7 7 0 0 1 85 62 V96 A7 7 0 0 1 78 103 H44 L33 114 L36 103 H22 A7 7 0 0 1 15 96 V62 A7 7 0 0 1 22 55 Z" fill="url(#ga-cream-v)" stroke="#f2d68c" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- Animated Voice Waveform Bars -->
        <rect class="ga-vibe-w1" x="30" y="72" width="6" height="16" rx="3" fill="#1b5832"/>
        <rect class="ga-vibe-w2" x="41" y="65" width="6" height="30" rx="3" fill="#16a34a"/>
        <rect class="ga-vibe-w3" x="52" y="69" width="6" height="22" rx="3" fill="#1b5832"/>
        <rect class="ga-vibe-w4" x="63" y="73" width="6" height="14" rx="3" fill="#b9924f"/>

        <!-- Center: Flowing Beam & AI Spark -->
        <path class="ga-vibe-beam" d="M84 80 C98 68, 120 92, 139 80" fill="none" stroke="url(#ga-gold-v)" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="6 5" filter="url(#ga-glow)"/>
        <g class="ga-vibe-spark">
          <circle cx="111" cy="80" r="14" fill="rgba(242,214,140,0.16)"/>
          <polygon points="111,61 116,75 129,80 116,85 111,99 106,85 93,80 106,75" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1.1" filter="url(#ga-glow)"/>
          <circle cx="96" cy="58" r="2.6" fill="#86efac"/>
          <circle cx="126" cy="60" r="2.2" fill="#f2d68c"/>
          <circle cx="125" cy="100" r="2.4" fill="#7dd3fc"/>
        </g>

        <!-- Right: 2.5D App Window Assembling Live -->
        <ellipse cx="182" cy="133" rx="38" ry="8" fill="rgba(0,0,0,0.42)"/>
        <rect x="145" y="40" width="78" height="86" rx="9" fill="#06140c" stroke="#255437" stroke-width="1.2"/>
        <rect x="141" y="36" width="78" height="86" rx="9" fill="url(#ga-dark-slab)" stroke="#4c8c62" stroke-width="1.6"/>
        <rect x="141" y="36" width="78" height="17" rx="8" fill="url(#ga-jade-top)" stroke="#4c8c62" stroke-width="1.2"/>
        <circle cx="151" cy="44.5" r="2.4" fill="#ef4444"/>
        <circle cx="159" cy="44.5" r="2.4" fill="#f2d68c"/>
        <circle cx="167" cy="44.5" r="2.4" fill="#4ade80"/>
        <!-- Assembling UI Blocks -->
        <rect class="ga-vibe-ui1" x="150" y="60" width="60" height="14" rx="4" fill="url(#ga-gold-h)" stroke="#fff0bd" stroke-width="0.9"/>
        <g class="ga-vibe-ui2">
          <rect x="150" y="79" width="60" height="18" rx="4" fill="url(#ga-cream-v)" stroke="#9fb09e" stroke-width="0.9"/>
          <rect x="155" y="84" width="28" height="3.5" rx="1.7" fill="#103d21"/>
          <rect x="155" y="90" width="44" height="3" rx="1.5" fill="#94a3b8"/>
        </g>
        <g class="ga-vibe-ui3">
          <rect x="156" y="102" width="48" height="13" rx="6.5" fill="url(#ga-emerald-v)" stroke="#d1fae5" stroke-width="1.1"/>
          <path d="M174 108.5 L178 112 L186 105" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `
    },
    {
      id: 'apikey',
      word: 'API Key',
      spokenWord: 'API key',
      phonetic: 'A-P-I KEY',
      say: 'API key. Your secret digital password that lets your app talk to AI. Keep it private like a PIN.',
      analogy: 'Secret digital PIN letting your app talk to AI — keep private!',
      bn: 'এপিআই কী — গোপন পাসওয়ার্ড বা বিকাশ পিনের মতো, যা দিয়ে অ্যাপ এআই-এর সাথে কথা বলে (গোপন রাখুন)!',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="134" rx="84" ry="10" fill="rgba(0,0,0,0.4)"/>
        <!-- Conduit Beam Between App and AI Hub -->
        <rect x="64" y="73" width="114" height="16" rx="8" fill="url(#ga-beam-teal)" opacity="0.45"/>
        <line x1="68" y1="81" x2="176" y2="81" stroke="#7dd3fc" stroke-width="2.2" stroke-dasharray="5 4" stroke-opacity="0.7"/>
        <!-- Left Mini App Window -->
        <rect x="18" y="54" width="48" height="54" rx="8" fill="url(#ga-dark-slab)" stroke="#4c8c62" stroke-width="1.6"/>
        <rect x="18" y="54" width="48" height="12" rx="7" fill="url(#ga-jade-top)" stroke="#4c8c62" stroke-width="1.1"/>
        <circle cx="25.5" cy="60" r="2" fill="#f2d68c"/>
        <rect x="25" y="73" width="34" height="7" rx="3" fill="url(#ga-cream-v)"/>
        <rect x="25" y="85" width="24" height="4" rx="2" fill="#86efac"/>
        <rect x="25" y="93" width="34" height="8" rx="4" fill="url(#ga-emerald-v)"/>
        <!-- Secret Privacy Badge Bottom Left -->
        <g transform="translate(22,114)">
          <rect x="0" y="7" width="16" height="12" rx="3" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1.2"/>
          <path d="M4 7 V4.5 A4 4 0 0 1 12 4.5 V7" fill="none" stroke="#f2d68c" stroke-width="2" stroke-linecap="round"/>
          <circle cx="8" cy="13" r="1.8" fill="#103d21"/>
        </g>
        <!-- Sliding Golden API Key -->
        <g class="ga-key-slide" filter="url(#ga-glow)">
          <circle cx="68" cy="81" r="13.5" fill="url(#ga-gold-v)" stroke="#fffdf7" stroke-width="1.8"/>
          <circle cx="68" cy="81" r="5" fill="#0d2b19" stroke="#fff0bd" stroke-width="1.1"/>
          <rect x="80" y="77" width="34" height="8" rx="3" fill="url(#ga-gold-v)" stroke="#fffdf7" stroke-width="1.4"/>
          <rect x="97" y="85" width="5" height="6" rx="1.5" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="0.8"/>
          <rect x="106" y="85" width="5" height="8" rx="1.5" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="0.8"/>
        </g>
        <!-- Center Emerald Gate Lock -->
        <g class="ga-key-lock" filter="url(#ga-glow)">
          <path d="M124 54 L145 62 V81 C145 96 135 106 124 111 C113 106 103 96 103 81 V62 Z" fill="url(#ga-emerald-v)" stroke="#d1fae5" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="124" cy="78" r="5.5" fill="#07190e" stroke="#f2d68c" stroke-width="1.4"/>
          <polygon points="121.5,82 126.5,82 128,93 120,93" fill="#07190e"/>
        </g>
        <!-- Right Cloud AI Hub Lighting Up -->
        <g class="ga-key-spark">
          <circle cx="192" cy="81" r="24" fill="url(#ga-sky-v)" opacity="0.24"/>
          <circle cx="192" cy="81" r="18" fill="url(#ga-dark-slab)" stroke="#7dd3fc" stroke-width="2" filter="url(#ga-glow)"/>
          <polygon points="192,67 195.5,77.5 206,81 195.5,84.5 192,95 188.5,84.5 178,81 188.5,77.5" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1"/>
          <circle cx="177" cy="63" r="2.4" fill="#86efac"/>
          <circle cx="208" cy="65" r="2.2" fill="#f2d68c"/>
        </g>
      `
    },
    {
      id: 'repo',
      word: 'Repository (Repo)',
      spokenWord: 'Repository, or repo',
      phonetic: 're-POS-i-to-ry · RE-po',
      say: 'Repository, also called a repo. The master vault folder on GitHub.',
      analogy: 'Also called a Repo — master vault folder holding files + full history.',
      bn: 'রিপোজিটরি (সংক্ষেপে রিপো / Repo) — গিটহাবে আপনার প্রজেক্টের মূল ভল্ট ফোল্ডার।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="140" rx="64" ry="11" fill="rgba(0,0,0,0.42)"/>
        <!-- Open Lid Underside (BEHIND cavity & dropping files) -->
        <g transform="matrix(-0.58 0.26 0.58 0.26 120 62)">
          <g class="ga-repo-lid-open">
            <rect x="0" y="0" width="100" height="100" rx="5" fill="#133a22" stroke="url(#ga-gold-h)" stroke-width="2.4" vector-effect="non-scaling-stroke"/>
            <rect x="12" y="12" width="76" height="76" rx="3" fill="#0b2415" stroke="rgba(242,214,140,0.45)" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
            <line x1="26" y1="50" x2="74" y2="50" stroke="rgba(242,214,140,0.28)" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
          </g>
        </g>
        <!-- Vault Cavity Back & Inner Depth Walls -->
        <polygon points="62,88 120,62 178,88 120,114" fill="#07190e" stroke="#427a57" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="64,88 120,63 120,84 82,101" fill="#0b2415"/>
        <polygon points="120,63 176,88 158,101 120,84" fill="#0d2c1a"/>
        <!-- Animated Code File Cards Gliding Fully Inside Cavity -->
        <g class="ga-repo-f1">
          <rect x="84" y="64" width="24" height="28" rx="3.5" fill="url(#ga-cream-v)" stroke="#94a3b8" stroke-width="1.1"/>
          <rect x="89" y="70" width="13" height="3.2" rx="1.5" fill="#103d21"/>
          <rect x="89" y="76" width="15" height="2.4" rx="1.2" fill="#94a3b8"/>
          <rect x="89" y="81" width="10" height="2.4" rx="1.2" fill="#94a3b8"/>
        </g>
        <g class="ga-repo-f2">
          <rect x="107" y="60" width="26" height="30" rx="3.5" fill="#d1fae5" stroke="#16a34a" stroke-width="1.3"/>
          <rect x="112" y="66" width="16" height="3.2" rx="1.5" fill="#16a34a"/>
          <rect x="112" y="72" width="12" height="2.4" rx="1.2" fill="#6ee7b7"/>
          <rect x="112" y="77" width="15" height="2.4" rx="1.2" fill="#6ee7b7"/>
        </g>
        <g class="ga-repo-f3">
          <rect x="132" y="64" width="24" height="28" rx="3.5" fill="url(#ga-gold-v)" stroke="#8a6423" stroke-width="1.2"/>
          <rect x="137" y="70" width="14" height="3.2" rx="1.5" fill="#78350f"/>
          <rect x="137" y="76" width="10" height="2.4" rx="1.2" fill="#a16207"/>
        </g>
        <!-- Isometric Armor Vault Base Front Faces -->
        <polygon points="62,88 120,114 120,146 62,120" fill="url(#ga-jade-left)" stroke="#4c8c62" stroke-width="1.4" stroke-linejoin="round"/>
        <polygon points="120,114 178,88 178,120 120,146" fill="url(#ga-jade-right)" stroke="#3a724d" stroke-width="1.4" stroke-linejoin="round"/>
        <!-- Metallic Trim Band -->
        <polyline points="62,98 120,124 178,98" fill="none" stroke="url(#ga-gold-h)" stroke-width="2.8" stroke-linejoin="round"/>
        <!-- Corner Rivets -->
        <circle cx="70" cy="116" r="2" fill="#f2d68c"/>
        <circle cx="112" cy="135" r="2" fill="#f2d68c"/>
        <circle cx="128" cy="135" r="2" fill="#b9924f"/>
        <circle cx="170" cy="116" r="2" fill="#b9924f"/>
        <!-- Back-Left Brass Hinge Barrels -->
        <ellipse cx="105" cy="68.5" rx="3.4" ry="2" transform="rotate(-24 105 68.5)" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="0.9"/>
        <ellipse cx="77" cy="81.2" rx="3.4" ry="2" transform="rotate(-24 77 81.2)" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="0.9"/>
        <!-- Closing / Closed Lid Top Face (IN FRONT OF walls) -->
        <g transform="matrix(-0.58 0.26 0.58 0.26 120 62)">
          <g class="ga-repo-lid-closed">
            <rect x="0" y="0" width="100" height="100" rx="5" fill="url(#ga-jade-top)" stroke="url(#ga-gold-h)" stroke-width="2.6" vector-effect="non-scaling-stroke"/>
            <rect x="16" y="16" width="68" height="68" rx="3" fill="none" stroke="rgba(242,214,140,0.5)" stroke-width="1.4" vector-effect="non-scaling-stroke"/>
            <circle cx="50" cy="50" r="14" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
          </g>
        </g>
        <!-- Solid 3D Closed Lid Overhang Rim -->
        <g class="ga-repo-lid-rim">
          <polygon points="62,88 120,114 120,119 62,93" fill="#28663f" stroke="url(#ga-gold-h)" stroke-width="1" stroke-linejoin="round"/>
          <polygon points="120,114 178,88 178,93 120,119" fill="#18472a" stroke="url(#ga-gold-h)" stroke-width="1" stroke-linejoin="round"/>
        </g>
        <!-- Brass Front Clasp & Lock Flash -->
        <rect x="115" y="112" width="10" height="15" rx="3" fill="url(#ga-gold-v)" stroke="#0d2917" stroke-width="1.4"/>
        <circle cx="120" cy="119.5" r="2.2" fill="#0d2917"/>
        <circle class="ga-repo-seal" cx="120" cy="119.5" r="14" fill="none" stroke="#f2d68c" stroke-width="2.5" filter="url(#ga-glow)"/>
      `
    },
    {
      id: 'commit',
      word: 'Commit',
      say: 'Commit. Save a named checkpoint.',
      analogy: 'Labeled photo snapshot of your working app on your device.',
      bn: 'কমিট — কাজের সঠিক অবস্থায় নামসহ একটি সেভ-পয়েন্ট বা স্ন্যাপশট নেওয়া।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="128" rx="82" ry="11" fill="rgba(0,0,0,0.38)"/>
        <!-- 3D Steel Track Rail -->
        <rect x="26" y="109" width="188" height="10" rx="5" fill="#183f27" stroke="#39754f" stroke-width="1.5"/>
        <line x1="34" y1="114" x2="206" y2="114" stroke="#4ade80" stroke-width="2.5" stroke-opacity="0.45" stroke-linecap="round"/>
        <!-- Past Green Checkpoint -->
        <circle cx="58" cy="114" r="11" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="1.8"/>
        <path d="M53.5 114 L56.5 117 L62.5 111" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Target Brass Socket -->
        <circle cx="120" cy="114" r="15" fill="#091f11" stroke="#b9924f" stroke-width="2.2"/>
        <!-- Future Empty Slot -->
        <circle cx="182" cy="114" r="10" fill="#091f11" stroke="rgba(255,255,255,0.32)" stroke-width="2" stroke-dasharray="3 3"/>
        <!-- Flash Halo -->
        <circle class="ga-commit-ring" cx="120" cy="114" r="24" fill="none" stroke="#f2d68c" stroke-width="3" filter="url(#ga-glow)"/>
        <!-- Newly Stamped Faceted Checkpoint -->
        <g class="ga-commit-dot">
          <circle cx="120" cy="114" r="14" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="2"/>
          <path d="M113 114 L118 119 L128 109" fill="none" stroke="#0c3319" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- Overhead Brass Camera / Stamp Press -->
        <g class="ga-commit-head">
          <rect x="115" y="10" width="10" height="20" rx="2" fill="#476c54" stroke="#85a68e" stroke-width="1.2"/>
          <rect x="86" y="28" width="68" height="36" rx="9" fill="url(#ga-jade-top)" stroke="url(#ga-gold-h)" stroke-width="2.2"/>
          <rect x="108" y="22" width="24" height="8" rx="3" fill="url(#ga-gold-v)"/>
          <circle cx="120" cy="46" r="12" fill="#0a1f12" stroke="url(#ga-gold-v)" stroke-width="2.6"/>
          <circle cx="120" cy="46" r="6" fill="url(#ga-sky-v)"/>
          <circle cx="117.5" cy="43.5" r="2" fill="#fff" opacity="0.85"/>
          <circle cx="142" cy="36" r="2.5" fill="#4ade80"/>
        </g>
      `
    },
    {
      id: 'push',
      word: 'Push',
      say: 'Push. Upload commits up to the cloud.',
      analogy: 'Send your saved checkpoints up to GitHub.com cloud.',
      bn: 'পুশ — আপনার সেভ করা কমিটগুলো ইন্টারনেটের গিটহাব ক্লাউডে পাঠানো।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="144" rx="56" ry="7" fill="rgba(0,0,0,0.42)"/>
        <!-- Sculpted Cloud Server Hub -->
        <g filter="url(#ga-glow)">
          <path d="M74 52 C65 52 58 45 60 36 C62 27 72 24 80 28 C87 14 111 11 122 23 C131 16 146 21 149 32 C158 31 168 37 167 46 C167 51 162 52 156 52 Z" fill="url(#ga-cloud-v)" stroke="#ffffff" stroke-width="1.5"/>
          <rect x="92" y="34" width="56" height="11" rx="4" fill="#103d21" opacity="0.85"/>
          <circle class="ga-push-led" cx="101" cy="39.5" r="2.6" fill="#4ade80"/>
          <circle cx="109" cy="39.5" r="2.2" fill="#f2d68c"/>
          <rect x="118" y="38" width="22" height="3" rx="1.5" fill="#8fd3a4"/>
        </g>
        <!-- Vertical Transfer Conduit (strictly between cloud y=52 and laptop y=90) -->
        <rect x="108" y="53" width="24" height="37" rx="6" fill="url(#ga-beam-teal)" opacity="0.5"/>
        <line x1="120" y1="89" x2="120" y2="55" stroke="#86efac" stroke-width="2" stroke-dasharray="4 4" stroke-opacity="0.6"/>
        <!-- Precision 2.5D Open Laptop -->
        <rect x="78" y="90" width="84" height="36" rx="5" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2"/>
        <rect x="81" y="93" width="78" height="31" rx="3" fill="#0d2418" stroke="#2d5a3f" stroke-width="1"/>
        <circle cx="120" cy="95.5" r="1.2" fill="#94a3b8"/>
        <rect x="84" y="98" width="72" height="23" rx="2" fill="#081a10"/>
        <rect class="ga-push-glow" x="84" y="98" width="72" height="23" rx="2" fill="#4ade80"/>
        <rect x="90" y="102" width="26" height="3.5" rx="1.5" fill="#4ade80"/>
        <rect x="90" y="108" width="44" height="2.8" rx="1.4" fill="#f2d68c" opacity="0.85"/>
        <rect x="90" y="114" width="60" height="3.5" rx="1.75" fill="#173b26"/>
        <rect class="ga-push-bar" x="90" y="114" width="60" height="3.5" rx="1.75" fill="url(#ga-emerald-v)"/>
        <rect x="88" y="124.5" width="64" height="3" rx="1.5" fill="#1e293b"/>
        <polygon points="80,126 160,126 172,140 68,140" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="86,128.5 154,128.5 159,134.5 81,134.5" fill="#334155" opacity="0.62"/>
        <polygon points="108,135.8 132,135.8 134,139 106,139" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.6"/>
        <path d="M68 140 H172 L170 143.5 H70 Z" fill="#64748b" stroke="#475569" stroke-width="0.8" stroke-linejoin="round"/>
        <rect x="112" y="140.5" width="16" height="1.5" rx="0.75" fill="#334155"/>
        <!-- Rising Glowing Upward Packets -->
        <g class="ga-push-pkt" filter="url(#ga-glow)">
          <circle cx="120" cy="84" r="9.5" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="1.8"/>
          <path d="M120 88.5 V79.5 M115.5 83.5 L120 79 L124.5 83.5" fill="none" stroke="#062814" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g class="ga-push-pkt2">
          <circle cx="120" cy="84" r="6.5" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="1.4"/>
          <path d="M120 87 V81 M117.2 83.8 L120 81 L122.8 83.8" fill="none" stroke="#103d21" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `
    },
    {
      id: 'pull',
      word: 'Pull',
      say: 'Pull. Download updates down to your laptop.',
      analogy: 'Download newer updates from GitHub down to your laptop.',
      bn: 'পুল — গিটহাব ক্লাউড থেকে নতুন আপডেট নিজের ল্যাপটপে নামিয়ে আনা।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="144" rx="56" ry="7" fill="rgba(0,0,0,0.42)"/>
        <!-- Sculpted Cloud Server Hub -->
        <g filter="url(#ga-glow)">
          <path d="M74 52 C65 52 58 45 60 36 C62 27 72 24 80 28 C87 14 111 11 122 23 C131 16 146 21 149 32 C158 31 168 37 167 46 C167 51 162 52 156 52 Z" fill="url(#ga-cloud-v)" stroke="#bae6fd" stroke-width="1.8"/>
          <rect x="92" y="34" width="56" height="11" rx="4" fill="#0f2942"/>
          <circle cx="101" cy="39.5" r="2.6" fill="#38bdf8"/>
          <rect x="109" y="38" width="32" height="3" rx="1.5" fill="#7dd3fc"/>
        </g>
        <!-- Conduit Beam -->
        <rect x="108" y="53" width="24" height="37" rx="6" fill="url(#ga-beam-teal)" opacity="0.5"/>
        <line x1="120" y1="55" x2="120" y2="89" stroke="#7dd3fc" stroke-width="2" stroke-dasharray="4 4" stroke-opacity="0.65"/>
        <!-- Precision 2.5D Open Laptop -->
        <rect x="78" y="90" width="84" height="36" rx="5" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2"/>
        <rect x="81" y="93" width="78" height="31" rx="3" fill="#0f283a" stroke="#7dd3fc" stroke-width="1.1"/>
        <circle cx="120" cy="95.5" r="1.2" fill="#94a3b8"/>
        <rect x="84" y="98" width="72" height="23" rx="2" fill="#091d2c"/>
        <rect class="ga-pull-glow" x="84" y="98" width="72" height="23" rx="2" fill="#38bdf8"/>
        <rect x="90" y="102" width="36" height="3.5" rx="1.5" fill="#38bdf8"/>
        <rect x="90" y="108" width="26" height="2.8" rx="1.4" fill="#86efac"/>
        <rect x="90" y="114" width="60" height="3.5" rx="1.75" fill="#13334a"/>
        <rect class="ga-pull-bar" x="90" y="114" width="60" height="3.5" rx="1.75" fill="url(#ga-sky-v)"/>
        <rect x="88" y="124.5" width="64" height="3" rx="1.5" fill="#1e293b"/>
        <polygon points="80,126 160,126 172,140 68,140" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="86,128.5 154,128.5 159,134.5 81,134.5" fill="#334155" opacity="0.62"/>
        <polygon points="108,135.8 132,135.8 134,139 106,139" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.6"/>
        <path d="M68 140 H172 L170 143.5 H70 Z" fill="#64748b" stroke="#475569" stroke-width="0.8" stroke-linejoin="round"/>
        <rect x="112" y="140.5" width="16" height="1.5" rx="0.75" fill="#334155"/>
        <!-- Descending Update Capsules -->
        <g class="ga-pull-pkt" filter="url(#ga-glow)">
          <circle cx="120" cy="58" r="9.5" fill="url(#ga-sky-v)" stroke="#fff" stroke-width="1.8"/>
          <path d="M120 53.5 V62.5 M115.5 58.5 L120 63 L124.5 58.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <g class="ga-pull-pkt2">
          <circle cx="120" cy="58" r="6.5" fill="url(#ga-cream-v)" stroke="#38bdf8" stroke-width="1.7"/>
          <path d="M120 55 V61 M117.2 58.2 L120 61 L122.8 58.2" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
      `
    },
    {
      id: 'main',
      word: 'main',
      spokenWord: 'Main',
      phonetic: 'MAIN',
      say: 'Main. Your official live track that always stays working.',
      analogy: 'Your official live highway track — always keep it green and working.',
      bn: 'মেইন — আপনার মূল নিরাপদ লাইন, যেখানে ভালো চালু অ্যাপ থাকে।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="134" rx="86" ry="10" fill="rgba(0,0,0,0.36)"/>
        <!-- Dimmed Secondary Side Track Below -->
        <path d="M62 84 C88 84, 92 120, 118 120 H198" fill="none" stroke="rgba(159,176,158,0.28)" stroke-width="4" stroke-dasharray="6 5" stroke-linecap="round"/>
        <circle cx="142" cy="120" r="6" fill="#254732" stroke="#64748b" stroke-width="1.4"/>
        <circle cx="186" cy="120" r="6" fill="#254732" stroke="#64748b" stroke-width="1.4"/>
        <!-- Main Gleaming Express Track Foundation -->
        <rect x="20" y="72" width="200" height="16" rx="8" fill="#0d311c" stroke="url(#ga-gold-h)" stroke-width="2"/>
        <line x1="28" y1="80" x2="212" y2="80" stroke="url(#ga-emerald-v)" stroke-width="7" stroke-linecap="round"/>
        <!-- Moving Golden Express Energy Pulse Along Main -->
        <rect class="ga-main-pulse" x="34" y="76.5" width="38" height="7" rx="3.5" fill="url(#ga-gold-v)" filter="url(#ga-glow)"/>
        <!-- 3 Verified Green Stations -->
        <circle cx="54" cy="80" r="12" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <path d="M49 80 L53 84 L60 76" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="120" cy="80" r="13" fill="url(#ga-emerald-v)" stroke="#f2d68c" stroke-width="2.4"/>
        <path d="M114.5 80 L118.5 84 L126 76" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="186" cy="80" r="12" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <path d="M181 80 L185 84 L192 76" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Golden Sovereign Crown Above Main Station -->
        <g class="ga-main-crown" filter="url(#ga-glow)">
          <polygon points="103,48 107,30 115,39 120,25 125,39 133,30 137,48" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1.5" stroke-linejoin="round"/>
          <rect x="103" y="48" width="34" height="6" rx="2.5" fill="url(#ga-gold-h)" stroke="#103d21" stroke-width="1.2"/>
          <circle cx="120" cy="24" r="2.6" fill="#fff0bd"/>
        </g>
      `
    },
    {
      id: 'head',
      word: 'HEAD',
      spokenWord: 'Head',
      phonetic: 'HEAD',
      say: 'Head. The marker showing which save point you are standing on right now.',
      analogy: 'The glowing “You Are Here” pointer showing your active save point.',
      bn: 'হেড — লোকেশন পিন যা দেখায় আপনি ঠিক এখন কোন সেভ-পয়েন্টে আছেন।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="134" rx="84" ry="10" fill="rgba(0,0,0,0.4)"/>
        <!-- 3-Station Metallic Railway Track -->
        <rect x="26" y="106" width="188" height="12" rx="6" fill="#173a25" stroke="#39754f" stroke-width="1.6"/>
        <line x1="34" y1="112" x2="206" y2="112" stroke="#4ade80" stroke-width="3" stroke-opacity="0.55" stroke-linecap="round"/>
        <!-- Station 1 -->
        <circle cx="62" cy="112" r="11" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <circle cx="62" cy="112" r="4" fill="#fff"/>
        <!-- Station 2 -->
        <circle cx="120" cy="112" r="11" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <circle cx="120" cy="112" r="4" fill="#fff"/>
        <!-- Station 3 -->
        <circle cx="178" cy="112" r="11" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <circle cx="178" cy="112" r="4" fill="#fff"/>
        <!-- Gliding Active Spotlight Beacon Pin -->
        <g class="ga-head-pin" filter="url(#ga-glow)">
          <polygon class="ga-head-beam" points="120,66 100,110 140,110" fill="url(#ga-beam-teal)" opacity="0.72"/>
          <circle class="ga-head-ring" cx="120" cy="112" r="18" fill="none" stroke="#f2d68c" stroke-width="2.6"/>
          <path d="M120 22 C104 22 94 34 94 48 C94 64 120 82 120 82 C120 82 146 64 146 48 C146 34 136 22 120 22 Z" fill="url(#ga-gold-v)" stroke="#fffdf7" stroke-width="2.2" stroke-linejoin="round"/>
          <circle cx="120" cy="46" r="10" fill="#103d21" stroke="#fff0bd" stroke-width="1.6"/>
          <circle cx="120" cy="46" r="4.5" fill="#4ade80"/>
        </g>
      `
    },
    {
      id: 'branch',
      word: 'Branch',
      say: 'Branch. Open a parallel safe track.',
      analogy: 'A parallel sandbox track so AI never breaks your live main track.',
      bn: 'ব্রাঞ্চ — মূল অ্যাপ নিরাপদ রেখে পরীক্ষার জন্য পাশের আলাদা রাস্তা খোলা।',
      svg: `
        ${STAGE_BASE}
        <!-- Safe Green Main Railway -->
        <rect x="24" y="45" width="192" height="12" rx="6" fill="#0d311c" stroke="#2f6e47" stroke-width="1.4"/>
        <line x1="28" y1="51" x2="212" y2="51" stroke="url(#ga-emerald-v)" stroke-width="6" stroke-linecap="round"/>
        <!-- Main Track Safe Checkpoints -->
        <circle cx="58" cy="51" r="10" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <circle cx="120" cy="51" r="9" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="1.8"/>
        <circle cx="192" cy="51" r="10" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <!-- Branch Conduit Bed -->
        <path d="M58 51 C96 51, 98 112, 134 112 H194" fill="none" stroke="rgba(242,214,140,0.22)" stroke-width="14" stroke-linecap="round"/>
        <!-- Drawing Gold Experiment Branch Rail -->
        <path class="ga-branch-path" d="M58 51 C96 51, 98 112, 134 112 H194" fill="none" stroke="url(#ga-gold-v)" stroke-width="6" stroke-linecap="round"/>
        <!-- Switch Junction Collar -->
        <circle cx="58" cy="51" r="5" fill="#fff"/>
        <!-- Experiment Nodes Appearing on Sandbox Rail -->
        <g class="ga-branch-n1">
          <circle cx="136" cy="112" r="11" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="2"/>
          <circle cx="136" cy="112" r="4.5" fill="#103d21"/>
        </g>
        <g class="ga-branch-n2">
          <circle cx="192" cy="112" r="11" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="2" filter="url(#ga-glow)"/>
          <polygon points="192,106 196,112 192,118 188,112" fill="#103d21"/>
        </g>
      `
    },
    {
      id: 'merge',
      word: 'Merge',
      say: 'Merge. Join the tested branch back into main.',
      analogy: 'Combine tested branch changes smoothly into your main line.',
      bn: 'মার্জ — পরীক্ষিত ব্রাঞ্চের ভালো কাজগুলো মূল অ্যাপে যুক্ত করা।',
      svg: `
        ${STAGE_BASE}
        <!-- Track Beds -->
        <line x1="24" y1="54" x2="216" y2="54" stroke="#184d2c" stroke-width="12" stroke-linecap="round"/>
        <line x1="28" y1="54" x2="212" y2="54" stroke="#4ade80" stroke-width="5" stroke-opacity="0.7" stroke-linecap="round"/>
        <path d="M48 114 H92 C122 114, 132 54, 166 54" fill="none" stroke="rgba(242,214,140,0.35)" stroke-width="10" stroke-linecap="round"/>
        <path d="M48 114 H92 C122 114, 132 54, 166 54" fill="none" stroke="#f2d68c" stroke-width="4.5" stroke-linecap="round"/>
        <!-- Fixed Origin Nodes -->
        <circle cx="48" cy="54" r="9" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="1.8"/>
        <circle cx="48" cy="114" r="9" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="1.8"/>
        <!-- Converging Moving Checkpoints -->
        <circle class="ga-merge-a" cx="166" cy="54" r="10.5" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
        <circle class="ga-merge-b" cx="166" cy="54" r="10.5" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="2"/>
        <!-- Unified Merge Burst & Verified Node -->
        <circle class="ga-merge-glow" cx="166" cy="54" r="24" fill="none" stroke="#f2d68c" stroke-width="3.2" filter="url(#ga-glow)"/>
        <g class="ga-merge-result">
          <circle cx="166" cy="54" r="15" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2.4"/>
          <path d="M159 54 L164 59 L174 49" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- Downstream Safe Node -->
        <circle cx="206" cy="54" r="7" fill="#4ade80" opacity="0.6"/>
      `
    },
    {
      id: 'revert',
      word: 'Revert',
      say: 'Revert. Rewind safely to a working save point.',
      analogy: 'Time-travel back from a broken crash to a working green commit.',
      bn: 'রিভার্ট — ভেঙে যাওয়া অবস্থা থেকে আগের সুস্থ সেভ-পয়েন্টে ফিরে আসা।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="120" cy="128" rx="82" ry="10" fill="rgba(0,0,0,0.4)"/>
        <!-- Timeline Beam -->
        <rect x="30" y="102" width="180" height="12" rx="6" fill="#173a25" stroke="#366c49" stroke-width="1.4"/>
        <!-- Calming Safe Ripple Behind Green Commit -->
        <circle class="ga-rev-safe" cx="68" cy="108" r="24" fill="none" stroke="#4ade80" stroke-width="2.5"/>
        <!-- Healthy Working Green Commit -->
        <circle cx="68" cy="108" r="15" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2.2"/>
        <path d="M61 108 L66 113 L76 103" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        <!-- Broken Crash Node on Right -->
        <circle cx="174" cy="108" r="15" fill="url(#ga-coral-v)" stroke="#fecaca" stroke-width="2"/>
        <line x1="168" y1="102" x2="180" y2="114" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <line x1="180" y1="102" x2="168" y2="114" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
        <!-- Rewind Arc Over Top -->
        <path class="ga-rev-arc" d="M174 86 C152 30, 88 30, 68 84" fill="none" stroke="url(#ga-gold-v)" stroke-width="5.5" stroke-linecap="round" filter="url(#ga-glow)"/>
        <polygon class="ga-rev-arrow" points="58,74 68,89 79,79" fill="#f2d68c" stroke="#0c3319" stroke-width="1.6" stroke-linejoin="round"/>
        <!-- Brass HEAD Ring Snapping Back -->
        <circle class="ga-rev-ring" cx="68" cy="108" r="21" fill="none" stroke="#f2d68c" stroke-width="3.2"/>
      `
    },
    {
      id: 'conflict',
      word: 'Conflict',
      say: 'Conflict. Two edits clash on the same line.',
      analogy: 'Two AI prompts or teammates edited the same line differently.',
      bn: 'কনফ্লিক্ট — একই কোডের লাইনে একসাথে দুই দিক থেকে বিপরীত পরিবর্তন আসা।',
      svg: `
        ${STAGE_BASE}
        <!-- Recessed Dark Arena Tray -->
        <rect x="24" y="28" width="192" height="104" rx="14" fill="url(#ga-dark-slab)" stroke="#355e45" stroke-width="1.8"/>
        <!-- Central Contested Slot & Shock Waves -->
        <rect x="115" y="42" width="10" height="76" rx="4" fill="rgba(242,214,140,0.12)" stroke="#f2d68c" stroke-width="1" stroke-dasharray="3 3"/>
        <circle class="ga-conf-warn" cx="120" cy="80" r="28" fill="none" stroke="#ef4444" stroke-width="2.5"/>
        <!-- Left Blue Edit Block -->
        <g class="ga-conf-l">
          <rect x="38" y="54" width="66" height="52" rx="9" fill="url(#ga-sky-v)" stroke="#fff" stroke-width="2"/>
          <rect x="48" y="66" width="38" height="6" rx="3" fill="#fff"/>
          <rect x="48" y="77" width="46" height="5" rx="2.5" fill="rgba(255,255,255,0.75)"/>
          <rect x="48" y="87" width="28" height="5" rx="2.5" fill="rgba(255,255,255,0.55)"/>
        </g>
        <!-- Right Coral Edit Block -->
        <g class="ga-conf-r">
          <rect x="136" y="54" width="66" height="52" rx="9" fill="url(#ga-coral-v)" stroke="#fff" stroke-width="2"/>
          <rect x="148" y="66" width="26" height="6" rx="3" fill="#fff"/>
          <rect x="148" y="77" width="44" height="5" rx="2.5" fill="rgba(255,255,255,0.75)"/>
          <rect x="158" y="87" width="34" height="5" rx="2.5" fill="rgba(255,255,255,0.55)"/>
        </g>
        <!-- Collision Lightning Bolt -->
        <g class="ga-conf-bolt" filter="url(#ga-glow)">
          <polygon points="126,38 107,81 121,81 112,122 136,74 121,74" fill="url(#ga-gold-v)" stroke="#0d2917" stroke-width="2.2" stroke-linejoin="round"/>
        </g>
      `
    },
    {
      id: 'clone',
      word: 'Clone',
      say: 'Clone. Copy a full GitHub repo onto your laptop.',
      analogy: 'Download a full copy of a GitHub repository onto your own computer.',
      bn: 'ক্লোন — গিটহাব থেকে পুরো রিপোজিটরি নিজের কম্পিউটারে হুবহু কপি করে নামানো।',
      svg: `
        ${STAGE_BASE}
        <ellipse cx="172" cy="142" rx="52" ry="7" fill="rgba(0,0,0,0.42)"/>
        <!-- Upper-Left Cloud & Master Vault Stack -->
        <path d="M40 50 C32 50 28 44 30 37 C32 29 40 27 47 31 C53 19 74 17 83 28 C91 22 103 27 104 36 C111 36 118 41 117 48 C117 50 112 50 107 50 Z" fill="url(#ga-cloud-v)"/>
        <rect x="46" y="42" width="46" height="32" rx="6" fill="url(#ga-jade-top)" stroke="url(#ga-gold-h)" stroke-width="2"/>
        <rect x="53" y="49" width="32" height="5" rx="2.5" fill="#4ade80"/>
        <rect x="53" y="57" width="24" height="4" rx="2" fill="#fffdf7"/>
        <rect x="53" y="64" width="28" height="4" rx="2" fill="#f2d68c"/>
        <!-- Diagonal Holographic Clone Beam into Laptop Screen -->
        <polygon class="ga-clone-beam" points="92,46 150,93 150,116 92,72" fill="url(#ga-beam-teal)"/>
        <!-- Lower-Right Precision 2.5D Laptop -->
        <rect x="132" y="84" width="80" height="40" rx="5" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2"/>
        <rect x="135" y="87" width="74" height="35" rx="3" fill="#0d2418" stroke="#7dd3fc" stroke-width="1.2"/>
        <circle cx="172" cy="88.8" r="1.1" fill="#94a3b8"/>
        <rect x="138" y="90" width="68" height="29" rx="2" fill="#081a10"/>
        <rect x="142" y="122.5" width="60" height="3" rx="1.5" fill="#1e293b"/>
        <polygon points="132,124 212,124 223,138 121,138" fill="url(#ga-metal-deck)" stroke="#64748b" stroke-width="1.2" stroke-linejoin="round"/>
        <polygon points="138,126.5 206,126.5 211,132.5 133,132.5" fill="#334155" opacity="0.62"/>
        <polygon points="160,133.8 184,133.8 186,137 158,137" fill="#cbd5e1" stroke="#94a3b8" stroke-width="0.6"/>
        <path d="M121 138 H223 L221 141.5 H123 Z" fill="#64748b" stroke="#475569" stroke-width="0.8" stroke-linejoin="round"/>
        <rect x="164" y="138.5" width="16" height="1.5" rx="0.75" fill="#334155"/>
        <!-- Blueprint Outline Inside Laptop Screen -->
        <rect x="150" y="93" width="44" height="23" rx="4" fill="none" stroke="rgba(125,211,252,0.5)" stroke-width="1.3" stroke-dasharray="3 2.5"/>
        <!-- Materializing Cloned Repo Block Inside Laptop Screen -->
        <g class="ga-clone-copy" filter="url(#ga-glow)">
          <rect x="150" y="93" width="44" height="23" rx="4" fill="url(#ga-jade-top)" stroke="#4ade80" stroke-width="1.7"/>
          <rect x="156" y="98" width="28" height="3.8" rx="1.8" fill="#4ade80"/>
          <rect x="156" y="104" width="21" height="3" rx="1.5" fill="#fffdf7"/>
          <rect x="156" y="109.5" width="25" height="3" rx="1.5" fill="#f2d68c"/>
        </g>
      `
    },
    {
      id: 'fork',
      word: 'Fork',
      say: 'Fork. Make your own copy of a repository on GitHub.',
      analogy: 'Create your own independent copy of someone else’s repo in your GitHub account.',
      bn: 'ফর্ক — অন্য কারো গিটহাব প্রজেক্টের একটি নিজস্ব স্বাধীন কপি নিজের অ্যাকাউন্টে নেওয়া।',
      svg: `
        ${STAGE_BASE}
        <!-- Y-Splitter Brass Rails -->
        <line x1="120" y1="48" x2="120" y2="74" stroke="#64748b" stroke-width="7" stroke-linecap="round"/>
        <path d="M120 74 C120 88, 66 86, 66 106" fill="none" stroke="#64748b" stroke-width="7" stroke-linecap="round"/>
        <path d="M120 74 C120 88, 174 86, 174 106" fill="none" stroke="url(#ga-gold-h)" stroke-width="7" stroke-linecap="round"/>
        <!-- Top Cloud Origin Repo -->
        <g>
          <rect x="92" y="20" width="56" height="36" rx="8" fill="url(#ga-jade-top)" stroke="#94a3b8" stroke-width="2"/>
          <rect x="102" y="29" width="36" height="5" rx="2.5" fill="#cbd5e1"/>
          <rect x="102" y="38" width="24" height="4" rx="2" fill="#94a3b8"/>
          <circle cx="120" cy="56" r="5" fill="#cbd5e1"/>
        </g>
        <!-- Left Locked Original Repo -->
        <rect x="38" y="102" width="56" height="36" rx="8" fill="#1b3326" stroke="#64748b" stroke-width="2"/>
        <rect x="48" y="111" width="32" height="5" rx="2.5" fill="#94a3b8"/>
        <rect x="48" y="120" width="22" height="4" rx="2" fill="#64748b"/>
        <!-- Traveling Duplicate Sliding to Personal Account -->
        <g class="ga-fork-travel">
          <rect x="106" y="54" width="28" height="20" rx="5" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="1.6"/>
        </g>
        <!-- Right Illuminated Personal Forked Vault -->
        <g class="ga-fork-new" filter="url(#ga-glow)">
          <rect x="146" y="102" width="58" height="38" rx="9" fill="url(#ga-jade-top)" stroke="url(#ga-gold-v)" stroke-width="2.5"/>
          <rect x="156" y="112" width="36" height="5" rx="2.5" fill="#4ade80"/>
          <rect x="156" y="121" width="26" height="4" rx="2" fill="#f2d68c"/>
          <circle cx="195" cy="107" r="7" fill="url(#ga-gold-v)" stroke="#103d21" stroke-width="1.5"/>
          <polygon points="195,103 196.4,106 199.6,106.4 197.2,108.6 197.8,111.8 195,110.2 192.2,111.8 192.8,108.6 190.4,106.4 193.6,106" fill="#103d21"/>
        </g>
      `
    },
    {
      id: 'diff',
      word: 'Diff',
      say: 'Diff. Compare red removed lines and green added lines.',
      analogy: 'Red vs. green line X-ray showing every single line AI added or deleted.',
      bn: 'ডিফ — এআই কোডের কোন লাইন মুছেছে (লাল) এবং কী নতুন লিখেছে (সবুজ), তার তুলনা।',
      svg: `
        ${STAGE_BASE}
        <!-- Dark Glass Code Sheet -->
        <rect x="44" y="20" width="152" height="122" rx="12" fill="url(#ga-dark-slab)" stroke="#3e6e4f" stroke-width="2"/>
        <!-- Neutral Line 1 -->
        <rect x="58" y="34" width="14" height="8" rx="3" fill="#2c4a38"/>
        <rect x="78" y="35" width="84" height="6" rx="3" fill="#3a5d48"/>
        <!-- Red Deleted Line 2 -->
        <g class="ga-diff-del">
          <rect x="52" y="52" width="136" height="22" rx="6" fill="rgba(239,68,68,0.28)" stroke="#f87171" stroke-width="1.4"/>
          <rect x="58" y="59" width="14" height="8" rx="3" fill="#ef4444"/>
          <rect x="61" y="62.2" width="8" height="2" rx="1" fill="#fff"/>
          <rect x="78" y="60" width="90" height="6" rx="3" fill="#fecaca"/>
        </g>
        <!-- Green Added Line 3 -->
        <g class="ga-diff-add">
          <rect x="52" y="80" width="136" height="22" rx="6" fill="rgba(34,197,94,0.28)" stroke="#4ade80" stroke-width="1.4"/>
          <rect x="58" y="87" width="14" height="8" rx="3" fill="#22c55e"/>
          <path d="M65 88.5 V93.5 M62.5 91 H67.5" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
          <rect x="78" y="88" width="98" height="6" rx="3" fill="#bbf7d0"/>
        </g>
        <!-- Neutral Line 4 -->
        <rect x="58" y="112" width="14" height="8" rx="3" fill="#2c4a38"/>
        <rect x="78" y="113" width="68" height="6" rx="3" fill="#3a5d48"/>
        <!-- Sweeping Brass Magnifying Loupe -->
        <g class="ga-diff-lens" filter="url(#ga-glow)">
          <line x1="168" y1="88" x2="198" y2="118" stroke="url(#ga-gold-h)" stroke-width="8" stroke-linecap="round"/>
          <circle cx="146" cy="66" r="28" fill="rgba(186,230,253,0.14)" stroke="url(#ga-gold-v)" stroke-width="4.5"/>
          <path d="M128 56 C133 46, 145 43, 155 46" fill="none" stroke="rgba(255,255,255,0.65)" stroke-width="3" stroke-linecap="round"/>
        </g>
      `
    },
    {
      id: 'pr',
      word: 'Pull Request (PR)',
      spokenWord: 'Pull Request, or PR',
      phonetic: 'PULL re-QUEST · P-R',
      say: 'Pull Request, often called a P R. Ask to review and merge your branch into main.',
      analogy: 'Often called a PR — a safety review gate checking your branch before joining main.',
      bn: 'পুল রিকোয়েস্ট (সংক্ষেপে PR) — মূল অ্যাপে (main) যুক্ত করার আগে নিরাপদ রিভিউ অনুরোধ।',
      svg: `
        ${STAGE_BASE}
        <!-- Left Amber Branch Track -->
        <line x1="20" y1="112" x2="110" y2="112" stroke="#f2d68c" stroke-width="7" stroke-linecap="round"/>
        <!-- Right Emerald Main Track -->
        <line x1="126" y1="112" x2="220" y2="112" stroke="#4ade80" stroke-width="7" stroke-linecap="round"/>
        <!-- Feature Parcel Sliding Across Review Gate -->
        <g class="ga-pr-pkg" filter="url(#ga-glow)">
          <rect x="44" y="88" width="32" height="24" rx="6" fill="url(#ga-gold-v)" stroke="#fff" stroke-width="1.8"/>
          <rect x="51" y="95" width="18" height="4" rx="2" fill="#103d21"/>
          <rect x="51" y="102" width="12" height="3" rx="1.5" fill="#78350f"/>
        </g>
        <!-- Review Gate Pillar & Signal Beacon -->
        <rect x="108" y="42" width="22" height="78" rx="6" fill="url(#ga-jade-top)" stroke="url(#ga-gold-h)" stroke-width="2"/>
        <circle class="ga-pr-light" cx="119" cy="57" r="7" fill="#f2d68c" stroke="#fff" stroke-width="1.5"/>
        <!-- Approval Check Medallion -->
        <g class="ga-pr-stamp" filter="url(#ga-glow)">
          <circle cx="119" cy="26" r="14" fill="url(#ga-emerald-v)" stroke="#fff" stroke-width="2"/>
          <path d="M113 26 L117 30 L126 21" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
        </g>
        <!-- Hinged Boom Barrier Arm -->
        <g class="ga-pr-arm">
          <rect x="119" y="84" width="6" height="42" rx="3" fill="url(#ga-coral-v)" stroke="#fff" stroke-width="1.4"/>
          <circle cx="122" cy="86" r="5" fill="url(#ga-gold-v)" stroke="#0d2917" stroke-width="1.5"/>
        </g>
      `
    }
  ];
})();
