#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const dir = path.join(process.cwd(), 'public/illustrations');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

function writeSvg(name, content) {
  fs.writeFileSync(path.join(dir, name), content);
}

// Norwood stages - simplified head top-view SVGs
for (let i = 1; i <= 7; i++) {
  const recession = Math.min((i - 1) * 8, 45);
  const crown = i >= 4 ? Math.min((i - 3) * 12, 50) : 0;
  writeSvg(`norwood-${i}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <ellipse cx="50" cy="55" rx="38" ry="42" fill="#F5DEB3" stroke="#D4A574" stroke-width="1"/>
  <ellipse cx="50" cy="30" rx="${32 - recession/2}" ry="22" fill="#4A3728"/>
  ${crown > 0 ? `<ellipse cx="50" cy="45" rx="${crown/2}" ry="${crown/3}" fill="#F5DEB3"/>` : ''}
  ${i >= 2 ? `<path d="M${20 + recession/2},35 Q50,${25 - recession/4} ${80 - recession/2},35" fill="none" stroke="#F5DEB3" stroke-width="3"/>` : ''}
  <text x="50" y="95" text-anchor="middle" font-size="8" fill="#666">Stage ${i}</text>
</svg>`);
}

// Gender icons
writeSvg('gender-male.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <circle cx="40" cy="28" r="16" fill="#60A5FA"/><rect x="30" y="46" width="20" height="28" rx="4" fill="#60A5FA"/>
  <text x="40" y="78" text-anchor="middle" font-size="8" fill="#666">Male</text>
</svg>`);
writeSvg('gender-female.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <circle cx="40" cy="28" r="16" fill="#F472B6"/><path d="M25,46 Q40,70 55,46 L55,72 L25,72 Z" fill="#F472B6"/>
  <text x="40" y="78" text-anchor="middle" font-size="8" fill="#666">Female</text>
</svg>`);

// Hair volume
writeSvg('hair-volume-normal.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect x="20" y="50" width="40" height="20" rx="4" fill="#E5E7EB"/>
  ${[0,1,2,3,4].map(i => `<line x1="${28+i*5}" y1="45" x2="${30+i*5}" y2="52" stroke="#8B6914" stroke-width="1"/>`).join('')}
  <text x="40" y="72" text-anchor="middle" font-size="7" fill="#666">~20 strands</text>
</svg>`);
writeSvg('hair-volume-medium.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <ellipse cx="40" cy="55" rx="18" ry="12" fill="#D1D5DB"/>
  ${Array.from({length:15}, (_,i) => `<line x1="${25+i*2}" y1="${40+Math.random()*5}" x2="${26+i*2}" y2="50" stroke="#8B6914" stroke-width="1"/>`).join('')}
  <text x="40" y="72" text-anchor="middle" font-size="7" fill="#666">40-50 strands</text>
</svg>`);
writeSvg('hair-volume-large.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <ellipse cx="40" cy="52" rx="24" ry="16" fill="#9CA3AF"/>
  ${Array.from({length:30}, (_,i) => `<line x1="${18+i*1.5}" y1="${35+Math.random()*8}" x2="${19+i*1.5}" y2="48" stroke="#8B6914" stroke-width="0.8"/>`).join('')}
  <text x="40" y="72" text-anchor="middle" font-size="7" fill="#666">100+ strands</text>
</svg>`);

// Female hair patterns
const patterns = [
  { name: 'pattern-volume', label: 'Volume reduced', hair: 'M20,30 Q40,15 60,30 L60,55 Q40,65 20,55 Z' },
  { name: 'pattern-side', label: 'Side thinning', hair: 'M20,30 Q40,15 60,30 L60,55 Q40,50 20,55 Z M20,40 L25,55' },
  { name: 'pattern-partition', label: 'Widening part', hair: 'M20,30 Q40,15 60,30 L60,55 Q40,65 20,55 Z M38,25 L42,55' },
  { name: 'pattern-patch', label: 'Coin patch', hair: 'M20,30 Q40,15 60,30 L60,55 Q40,65 20,55 Z' },
];
patterns.forEach(p => {
  writeSvg(`${p.name}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <ellipse cx="40" cy="42" rx="22" ry="26" fill="#F5DEB3"/>
  <path d="${p.hair}" fill="#4A3728" opacity="0.8"/>
  ${p.name === 'pattern-patch' ? '<circle cx="40" cy="38" r="8" fill="#F5DEB3"/>' : ''}
  ${p.name === 'pattern-partition' ? '<line x1="40" y1="22" x2="40" y2="55" stroke="#F5DEB3" stroke-width="3"/>' : ''}
  <text x="40" y="75" text-anchor="middle" font-size="6" fill="#666">${p.label}</text>
</svg>`);
});

console.log('SVG illustrations generated');
