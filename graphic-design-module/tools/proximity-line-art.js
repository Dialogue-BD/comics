// Line drawings make the image/caption relationship visible without adding prose to the picture.
function prxRiver(){return `<g fill="none" stroke="#3c695b" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
 <path class="prx-ink" pathLength="1" d="M20 92Q50 73 83 90Q112 73 151 93Q196 69 235 86L280 87M25 103Q84 98 144 105T281 103"/>
 <path class="prx-ink" pathLength="1" d="M161 94C110 106 218 123 169 135C104 153 121 178 63 198M187 93C156 110 238 123 211 141C182 163 218 183 270 201"/>
 <path class="prx-ink" pathLength="1" d="M51 79V36M35 48L51 33L67 49M34 64L51 48L71 66M237 73V37M221 49L237 32L252 49M216 65L237 47L259 65"/>
 <path class="prx-ink" pathLength="1" d="M28 173L29 147M28 163L16 153M29 157L40 143M36 197L40 168M40 183L51 170M275 158L277 134M277 147L266 135M277 145L287 131"/>
 <path class="prx-water" d="M166 119h24M133 145h31M161 159h25M128 181h25" stroke="#63968f" stroke-width="1.8"/>
 <path class="prx-mist" d="M70 82Q130 74 208 83M90 88Q154 81 220 89" opacity=".45" stroke-width="3"/>
 <circle class="prx-ink" pathLength="1" cx="178" cy="37" r="14" stroke="#b68b48"/>
 </g>`}
function prxBoat(){return `<g fill="none" stroke="#244331" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
 <path class="prx-ink" pathLength="1" d="M28 127Q134 88 283 123L247 163Q126 182 60 164ZM28 127Q143 151 283 123M60 164L66 139M245 163L253 133"/>
 <path class="prx-ink" pathLength="1" d="M57 124Q144 103 248 124M77 130L91 115M111 136L128 110M201 135L209 114M63 148Q144 168 253 147" stroke="#477b83"/>
 <path class="prx-ink" pathLength="1" d="M84 54L235 159M78 48L99 44L123 61L115 75ZM178 119L190 126M186 124C156 86 197 78 192 101C183 124 152 101 168 89C177 82 192 94 176 101" stroke="#a27a42"/>
 <path class="prx-ink" pathLength="1" d="M80 150l12 -5 11 5 -4 9 -17 -1ZM133 154l10 -3 8 7 -9 6 -12 -2M215 141l13 -4 9 8 -14 5" stroke="#477b83" stroke-width="1.5"/>
 <path class="prx-water" d="M21 190Q44 184 71 190T129 190T190 190T270 190M64 201Q119 195 181 201" stroke="#63968f" stroke-width="1.7"/>
 </g>`}
function prxVisual(kind,prefix){
 const mixed=kind==='proximity-mixed',groups=kind==='proximity-groups';
 const caption=(x,text,cls)=>`<g class="prx-caption ${cls}" transform="translate(${x} 274)"><path d="M0 0L298 2L301 53L3 55Z" fill="#fff8e7" filter="url(#${prefix}-shadow)"/><text x="150" y="33" text-anchor="middle" fill="#244331" font-family="Georgia,serif" font-size="22">${esc(text)}</text></g>`;
 return `<svg class="mc-svg prx-line-art" viewBox="0 0 720 380" role="img" aria-label="${mixed?'The river and boat captions are far from their matching images.':groups?'Two groups keep river details and boat details together.':'Line drawings of a misty river and a boat with peeling blue paint. Each caption moves close to its matching picture.'}" data-prx-mode="${mixed?'mixed':groups?'groups':'captions'}"><defs><filter id="${prefix}-shadow" x="-10%" y="-15%" width="125%" height="140%"><feDropShadow dx="2" dy="4" stdDeviation="2" flood-color="#73542a" flood-opacity=".15"/></filter></defs>
 ${groups?'<path d="M19 24L338 20L341 343L19 341ZM377 22L698 24L699 342L375 345Z" fill="#e1e8d7" opacity=".7"/>':''}
 <g transform="translate(28 25)"><path d="M0 0L297 2L300 216L3 219Z" fill="#fff8e7" filter="url(#${prefix}-shadow)"/>${prxRiver()}</g>
 <g transform="translate(389 25)"><path d="M0 0L298 1L300 218L2 216Z" fill="#fff8e7" filter="url(#${prefix}-shadow)"/>${prxBoat()}</g>
 ${caption(mixed?389:28,'Mist covers the water.','prx-caption-river')}${caption(mixed?28:389,'Blue paint is peeling.','prx-caption-boat')}
 <path class="prx-tether" d="M178 248V266M539 248V266" fill="none" stroke="#b48a40" stroke-width="1.5" stroke-dasharray="2 5"/>
 </svg>`;
}
const prxBaseVisual=mcVisual;
mcVisual=function(id,kind,value=50,prefix='mc'){
 if(id==='proximity'&&['proximity-captions','proximity-groups','proximity-mixed'].includes(kind))return prxVisual(kind,prefix);
 if(id==='shape'&&kind==='application'&&prefix==='mc-notice-shape')return mcSvg(`<defs><filter id="${prefix}-shadow"><feDropShadow dx="2" dy="4" stdDeviation="2" flood-opacity=".13"/></filter></defs><text x="360" y="48" font-family="Georgia,serif" font-size="28" text-anchor="middle">A gentle, welcoming reading club</text>${[45,268,491].map((x,i)=>`<path d="M${x} 76l184 -3 3 223-185 3Z" fill="#f0e7cf" filter="url(#${prefix}-shadow)"/><text x="${x+92}" y="323" font-size="22" text-anchor="middle">${['A','B','C'][i]}</text>`).join('')}<path d="M107 224C70 185 86 130 129 126C158 100 202 140 198 175C218 220 172 254 144 237C127 248 112 239 107 224Z" fill="#244331"/><path d="M360 108l17 41 42 -21 -16 42 39 23 -44 9 10 44 -40 -24 -31 33 -2 -44 -45 -6 36 -25 -22 -40 42 15Z" fill="#244331"/><path d="M525 214l42 -94 76 9 28 94 -47 26 -83 -3Z" fill="#244331"/>`,'Three outlines for a reading-club symbol: A has round flowing curves, B has jagged points, C has firm straight edges.');
 return prxBaseVisual(id,kind,value,prefix);
};
const prxBaseRecord=mcRecord;
mcRecord=function(id){const r=prxBaseRecord(id);if(id==='shape'&&!r.shapeBriefVersion){const old=r.states.notice;if(old&&old.id!==MERGED.shape.challenges.notice.id){r.previous=r.previous||[];r.previous.push({...old,practised:!!r.done.notice});delete r.states.notice;delete r.done.notice;}r.shapeBriefVersion=1;}return r};
