import { SAGAS, LOCATIONS } from './data/locations.js';
import { findCharacterByName } from './data/characters/index.js';
import { poneglyphsAtLocation } from './data/poneglyphs.js';
import { creaturesAtLocation } from './data/creatures.js';
import { shipsAtLocation } from './data/ships.js';
import { ancientWeaponAtLocation, ancientWeaponForCharacter } from './data/ancientWeapons.js';

/** Builds the saga filter chips once, into #sagaChips. */
export function renderSagaChips(container, onChange){
  const allChip = makeChip('All', 'all', true);
  container.appendChild(allChip);
  SAGAS.forEach(saga => container.appendChild(makeChip(shortLabel(saga), saga, false)));

  container.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    container.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    onChange(chip.dataset.saga);
  });

  function makeChip(label, value, active){
    const b = document.createElement('button');
    b.className = 'chip' + (active ? ' active' : '');
    b.textContent = label;
    b.dataset.saga = value;
    return b;
  }
  function shortLabel(saga){ return saga.replace(' Saga', ''); }
}

/** Sets up the search box; calls onChange(term) on every keystroke. */
export function setupSearch(input, onChange){
  input.addEventListener('input', (e) => onChange(e.target.value));
}

/** Renders location detail into the side panel and wires up close +
 *  "follow the story onward" link buttons. */
export function renderPanel({ panel, panelInner, loc, onLinkClick, onCharacterClick }){
  const statusLine = loc.status === 'current'
    ? '⚑ This is where the story currently stands.'
    : loc.status === 'upcoming'
      ? "⚑ Not yet visited, reserved for what's ahead."
      : '';

  const charHtml = (loc.characters || [])
    .map(c => {
      const match = findCharacterByName(c.name);
      const cls = match ? 'charchip clickable' : 'charchip';
      const attr = match ? ` data-charid="${match.id}"` : '';
      const fruitTag = match?.devilFruit ? ` <span title="Devil Fruit: ${match.devilFruit.name}">🍈</span>` : '';
      const weapon = match && ancientWeaponForCharacter(match.id);
      const weaponTag = weapon ? ` <span title="Ancient Weapon: ${weapon.name}">⚔️</span>` : '';
      return `<span class="${cls}"${attr}><b>${c.name}</b>${fruitTag}${weaponTag}: ${c.role}</span>`;
    }).join('');

  const shipHtml = shipsAtLocation(loc.id)
    .map(s => `<li><b>${s.name}</b>: ${s.note}</li>`).join('');

  const creatureHtml = creaturesAtLocation(loc.id)
    .map(c => `<li><b>${c.name}</b> (${c.species}): ${c.note}</li>`).join('');

  const poneglyphHtml = poneglyphsAtLocation(loc.id)
    .map(p => `<li class="${p.color === 'red' ? 'poneglyph-red' : ''}"><b>${p.name}</b>${p.color === 'red' ? ' 🔴' : ''}: ${p.summary}</li>`).join('');

  const weapon = ancientWeaponAtLocation(loc.id);

  const linkHtml = (loc.links || [])
    .map(id => LOCATIONS.find(l => l.id === id))
    .filter(Boolean)
    .map(l => `<button class="linkchip" data-goto="${l.id}">→ ${l.name}</button>`)
    .join('');

  const narrativeHtml = ['problem', 'resolution', 'outcome']
    .filter(key => loc[key])
    .map(key => {
      const label = key === 'problem' ? 'The problem' : key === 'resolution' ? 'How it was resolved' : 'What it left behind';
      return `<p class="section-label">${label}</p><p class="summary">${loc[key]}</p>`;
    }).join('');

  panelInner.innerHTML = `
    <button class="panel-close" aria-label="Close">&times;</button>
    <p class="panel-eyebrow">${loc.sea}</p>
    <h2>${loc.name}</h2>
    <span class="saga-tag">${loc.saga}</span>
    <p class="summary">${loc.summary}</p>
    ${narrativeHtml}
    <p class="section-label">What happened here</p>
    <ul class="events">${loc.events.map(e => `<li>${e}</li>`).join('')}</ul>
    ${loc.foreshadowing ? `<div class="foreshadow-note"><b>Looking back:</b> ${loc.foreshadowing}</div>` : ''}
    <p class="section-label">Characters tied to this island</p>
    <div class="chargrid">${charHtml || '<em>Not yet recorded</em>'}</div>
    ${shipHtml ? `<p class="section-label">Notable vessels here</p><ul class="events">${shipHtml}</ul>` : ''}
    ${creatureHtml ? `<p class="section-label">Wildlife</p><ul class="events">${creatureHtml}</ul>` : ''}
    ${poneglyphHtml ? `<p class="section-label">Poneglyphs recorded here</p><ul class="events">${poneglyphHtml}</ul>` : ''}
    ${weapon ? `<div class="foreshadow-note"><b>Ancient Weapon</b>⚔️ ${weapon.name}: ${weapon.note}</div>` : ''}
    <p class="section-label">Follow the story onward</p>
    <div>${linkHtml}</div>
    ${statusLine ? `<div class="status-note">${statusLine}</div>` : ''}
  `;

  panel.classList.add('open');
  panelInner.querySelector('.panel-close').addEventListener('click', () => panel.classList.remove('open'));
  panelInner.querySelectorAll('.linkchip').forEach(btn => {
    btn.addEventListener('click', () => onLinkClick(btn.dataset.goto));
  });
  panelInner.querySelectorAll('.charchip.clickable').forEach(chip => {
    chip.addEventListener('click', () => onCharacterClick && onCharacterClick(chip.dataset.charid));
  });
}

/** Rotates the Log Pose needle to point at a location's longitude and
 *  updates the readout text next to it. */
export function updateLogPose(needle, readoutEl, loc){
  const angle = loc.lon % 360;
  needle.style.transform = `translate(-50%,-100%) rotate(${angle}deg)`;
  readoutEl.textContent = loc.name;
}
