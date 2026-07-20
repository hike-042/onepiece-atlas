import * as THREE from 'three';
import { LOCATIONS } from './data/locations.js';
import { setupScene, GLOBE_RADIUS } from './scene/setupScene.js';
import { buildMarkers, updateLabelPositions } from './scene/markers.js';
import { attachLandmarks } from './scene/landmarks.js';
import { setupInteraction } from './interaction.js';
import { renderSagaChips, setupSearch, renderPanel, updateLogPose } from './ui.js';
import { latLonToVec3 } from './utils/geo.js';
import { tween, easeOutCubic, prefersReducedMotion } from './utils/tween.js';
import { makeShipIconTexture } from './scene/texture.js';
import { openCharacterGraph, openCrewGraph, openOrganizationGraph, resizeCharacterGraph } from './scene/characterGraph.js';
import { findCharacterById } from './data/characters/index.js';
import { CREWS, crewsForCharacter, findCrewById } from './data/crews.js';
import { ORGANIZATIONS, organizationsForCharacter, findOrganizationById } from './data/organizations.js';
import { swordsForCharacter } from './data/swords.js';
import { shipsForCrew } from './data/ships.js';
import { ORIGINS } from './data/origins.js';
import { GLOSSARY } from './data/glossary.js';
import { generateQuestion } from './trivia.js';
import { startAmbientBackdrop } from './scene/ambientBackdrop.js';

// Two organizations.js entries (Revolutionary Army, Cross Guild) are
// deliberately cross-listed from crews.js because they function more like a
// military/business than a pirate crew — but that means showing them again
// here as a *second* affiliation chip would just duplicate the crew chip
// already on screen. Filtered out wherever organizations are rendered.
const DUPLICATE_ORG_IDS = new Set(['revolutionary-army-ref', 'cross-guild-ref']);

const ambient = startAmbientBackdrop(document.getElementById('ambientBackdrop'));

// Saga-themed weather in the ambient backdrop — a light seasonal touch tied
// to whichever island is currently selected, not a new data field (kept out
// of locations.js/timeline.js on purpose; this is presentation, not fact).
const WEATHER_BY_SAGA = {
  'Alabasta Saga': 'sand',
  'Thriller Bark Saga': 'fog',
};

// --- DOM references ---
const stage = document.getElementById('stage');
const canvas = document.getElementById('globeCanvas');
const labelLayer = document.getElementById('labelLayer');
const tooltip = document.getElementById('tooltip');
const panel = document.getElementById('panel');
const panelInner = document.getElementById('panelInner');
const needle = document.getElementById('needle');
const readoutName = document.getElementById('readoutName');
const sealStamp = document.getElementById('sealStamp');
const searchInput = document.getElementById('search');
const sagaChipsContainer = document.getElementById('sagaChips');
const charModal = document.getElementById('charModal');
const charModalTitle = document.getElementById('charModalTitle');
const charModalSubtitle = document.getElementById('charModalSubtitle');
const charCrewBar = document.getElementById('charCrewBar');
const charOrgBar = document.getElementById('charOrgBar');
const charBladeBar = document.getElementById('charBladeBar');
const charCrossRef = document.getElementById('charCrossRef');
const charModalClose = document.getElementById('charModalClose');
const charGraphContainer = document.getElementById('charGraphContainer');
const charDossier = document.getElementById('charDossier');
const charDossierAmount = document.getElementById('charDossierAmount');
const charModalInner = document.getElementById('charModalInner');

// --- scene, markers, landmarks ---
const { renderer, scene, camera, controls, updateOcean, stopAutoRotate, scheduleIdleResume } = setupScene(canvas, stage);
const clock = new THREE.Clock();
const { markerObjects, labelEls } = buildMarkers(scene, labelLayer, LOCATIONS, GLOBE_RADIUS);
const updateLandmarks = attachLandmarks(scene, LOCATIONS, GLOBE_RADIUS);
const reducedMotion = prefersReducedMotion();

// --- Thousand Sunny tracker ---
// Automatically follows whichever location is currently marked
// status:"current" in data/locations.js. When Elbaf's status flips to
// "explored" and a new island becomes "current", this marker moves there
// on its own — no other code needs to change.
const shipLocation = LOCATIONS.find(l => l.status === 'current');
let shipSprite = null, shipBasePos = null, shipNormal = null;
if (shipLocation){
  const shipPos = latLonToVec3(shipLocation.lat, shipLocation.lon + 4, GLOBE_RADIUS + 0.09);
  shipSprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeShipIconTexture('#C99A3A'), transparent: true,
  }));
  shipSprite.position.copy(shipPos);
  shipSprite.scale.set(0.42, 0.42, 0.42);
  scene.add(shipSprite);
  shipBasePos = shipPos.clone();
  shipNormal = shipPos.clone().normalize();

  const shipLabelEl = document.createElement('div');
  shipLabelEl.className = 'island-label ship-label';
  shipLabelEl.textContent = '⛵ Thousand Sunny, currently here';
  labelLayer.appendChild(shipLabelEl);
  labelEls.push({ el: shipLabelEl, loc: shipLocation, worldPos: shipPos, priority: true });
}

// --- filter state ---
let activeSaga = 'all';
let searchTerm = '';
let selectedId = null;

function isVisible(loc){
  const sagaOk = activeSaga === 'all' || loc.saga === activeSaga;
  const term = searchTerm.trim().toLowerCase();
  const haystack = [loc.name, loc.saga, loc.sea, ...(loc.characters || []).map(c => c.name)]
    .join(' ').toLowerCase();
  return sagaOk && (!term || haystack.includes(term));
}

function refreshVisibility(){
  markerObjects.forEach(sprite => {
    const ok = isVisible(sprite.userData.loc);
    const targetOpacity = ok ? 1 : 0.15;
    const targetScale = sprite.userData.loc.id === selectedId ? 0.46 : 0.32;
    const fromOpacity = sprite.material.opacity;
    const fromScale = sprite.scale.x;
    if (fromOpacity === targetOpacity && fromScale === targetScale) return;
    if (sprite.userData.cancelTween) sprite.userData.cancelTween();
    sprite.userData.cancelTween = tween(220, p => {
      sprite.material.opacity = fromOpacity + (targetOpacity - fromOpacity) * p;
      sprite.scale.setScalar(fromScale + (targetScale - fromScale) * p);
    }, easeOutCubic);
  });
  labelEls.forEach(({ el, loc }) => {
    el.classList.toggle('dimmed', !isVisible(loc));
  });
}
refreshVisibility();

// --- selection ---
function selectLocation(id, shouldFly){
  const loc = LOCATIONS.find(l => l.id === id);
  if (!loc) return;
  selectedId = id;
  refreshVisibility();
  if (shouldFly) flyTo(loc.lat, loc.lon);
  ambient.setWeather(WEATHER_BY_SAGA[loc.saga] || 'none');
  updateLogPose(needle, readoutName, loc);
  sealStamp.classList.remove('stamp');
  void sealStamp.offsetWidth; // force reflow so re-adding the class replays the keyframe
  sealStamp.classList.add('stamp');
  renderPanel({
    panel, panelInner, loc,
    onLinkClick: (nextId) => selectLocation(nextId, true),
    onCharacterClick: (charId) => openCharModal(charId),
  });
}

// Both modals mount into the same graph container and fade it in only once
// the force layout settles — shared here so opening either kind doesn't
// duplicate the reset/rAF/onSettle wiring.
function mountGraph(builder, id, onNodeClick){
  charGraphContainer.classList.remove('settled');
  requestAnimationFrame(() => {
    builder(charGraphContainer, id, onNodeClick, () => charGraphContainer.classList.add('settled'));
  });
}

function openCharModal(charId){
  const character = findCharacterById(charId);
  if (!character) return;
  charModalTitle.textContent = character.name;

  const bits = [];
  if (character.epithet) bits.push(`"${character.epithet}"`);
  if (character.devilFruit) bits.push(`Devil Fruit: ${character.devilFruit.name} (${character.devilFruit.type})`);
  charModalSubtitle.textContent = bits.join('  ·  ');

  if (character.bounty){
    charDossierAmount.textContent = character.bounty;
    charDossier.classList.add('show');
  } else {
    charDossier.classList.remove('show');
  }

  charModalInner.classList.remove('memorial');
  if (character.status === 'deceased'){
    void charModalInner.offsetWidth; // force reflow so re-adding replays the keyframe
    charModalInner.classList.add('memorial');
  }

  renderCrewButtons(crewsForCharacter(charId));
  renderOrgButtons(organizationsForCharacter(charId));
  renderBladeButtons(swordsForCharacter(charId));
  renderCrossRefLinks(character);

  charModal.classList.add('open');
  mountGraph(openCharacterGraph, charId, (nextId) => openCharModal(nextId));
}

function renderCrewButtons(crews){
  charCrewBar.innerHTML = crews.map(crew => {
    const statusTag = crew.status === 'disbanded' ? ' (disbanded)' : '';
    return `<button class="crewchip" data-crewid="${crew.id}">⚑ ${crew.name}${statusTag}</button>`;
  }).join('');
  charCrewBar.querySelectorAll('.crewchip').forEach(btn => {
    btn.addEventListener('click', () => openCrewModal(btn.dataset.crewid));
  });
}

function renderOrgButtons(orgs){
  charOrgBar.innerHTML = orgs.filter(o => !DUPLICATE_ORG_IDS.has(o.id)).map(org => {
    const statusTag = org.status === 'disbanded' ? ' (disbanded)' : '';
    return `<button class="orgchip" data-orgid="${org.id}">⚓ ${org.name}${statusTag}</button>`;
  }).join('');
  charOrgBar.querySelectorAll('.orgchip').forEach(btn => {
    btn.addEventListener('click', () => openOrgModal(btn.dataset.orgid));
  });
}

// Blades aren't clickable — swords.js only tracks a current owner, not a
// browsable network of their own — but showing them here surfaces a dataset
// (src/data/swords.js) that previously had no UI anywhere in the atlas.
function renderBladeButtons(blades){
  charBladeBar.innerHTML = blades.map(s => `<span class="bladechip" title="${s.note}">🗡 ${s.name}</span>`).join('');
}

// Jump-out links to whichever standalone tools actually have this
// character in their dataset, deep-linked straight to them instead of
// dropping the visitor on that tool's unfiltered landing view.
function renderCrossRefLinks(character){
  const links = [
    { href: `./tools/family-tree/?char=${character.id}`, label: '🧬 Family Tree' },
    { href: `./tools/story-graph/?node=char:${character.id}`, label: '🌐 Story Graph' },
  ];
  if (ORIGINS.some(o => o.characterId === character.id)) links.push({ href: `./tools/origins/?char=${character.id}`, label: '🌳 Origin' });
  if (character.bounty) links.push({ href: `./tools/bounty-chart/?char=${character.id}`, label: '💰 Bounty Chart' });
  charCrossRef.innerHTML = links
    .map(l => `<a class="crossref-link" href="${l.href}" target="_blank" rel="noopener">${l.label} ↗</a>`)
    .join('');
}

function openCrewModal(crewId){
  const crew = findCrewById(crewId);
  charDossier.classList.remove('show');
  charModalInner.classList.remove('memorial');
  charBladeBar.innerHTML = '';
  charCrossRef.innerHTML = '';
  mountGraph(openCrewGraph, crewId, (nextCharId) => openCharModal(nextCharId));
  if (crew){
    charModalTitle.textContent = crew.name;
    // a crew can outlive more than one ship (the Straw Hats' Merry, then the
    // Sunny) — prefer whichever one is still active over array order
    const ships = shipsForCrew(crewId);
    const ship = ships.find(s => s.status === 'active') || ships[0];
    const shipTag = ship ? `  ·  ⛵ ${ship.name} (${ship.status})` : '';
    charModalSubtitle.textContent = (crew.status === 'disbanded'
      ? `Disbanded: ${crew.disbandedContext || 'no longer active'}`
      : 'Active crew') + shipTag;
  }
}

function openOrgModal(orgId){
  const org = findOrganizationById(orgId);
  charDossier.classList.remove('show');
  charModalInner.classList.remove('memorial');
  charBladeBar.innerHTML = '';
  charCrossRef.innerHTML = '';
  mountGraph(openOrganizationGraph, orgId, (nextCharId) => openCharModal(nextCharId));
  if (org){
    charModalTitle.textContent = org.name;
    charModalSubtitle.textContent = `${org.type}${org.status === 'disbanded' ? ' (disbanded)' : ''}`;
  }
}

/** Entry point for the standalone "Graph" tab — browse every crew's or
 *  organization's relationship graph without having to click into an
 *  island or character first. */
function openGraphOverview(){
  charModal.classList.add('open');
  renderCrewButtons(CREWS);
  renderOrgButtons(ORGANIZATIONS);
  openCrewModal('strawhats');
}
charModalClose.addEventListener('click', () => {
  charModal.classList.remove('open');
  charGraphContainer.classList.remove('settled');
});
window.addEventListener('resize', () => resizeCharacterGraph(charGraphContainer));

// --- interaction (raycasting + camera fly-to) ---
const { flyTo } = setupInteraction({
  canvas, camera, controls, markerObjects, tooltip,
  onSelect: (id) => selectLocation(id, true),
});

// --- UI wiring ---
renderSagaChips(sagaChipsContainer, (saga) => {
  activeSaga = saga;
  refreshVisibility();
  const target = saga !== 'all' && LOCATIONS.find(l => l.saga === saga);
  if (target) flyTo(target.lat, target.lon);
});
setupSearch(searchInput, (term) => { searchTerm = term; refreshVisibility(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel.classList.remove('open'); });

// --- zoom controls ---
const zoomInBtn = document.getElementById('zoomIn');
const zoomOutBtn = document.getElementById('zoomOut');
const locateShipBtn = document.getElementById('locateShip');
const glossaryBtn = document.getElementById('glossaryBtn');
const glossModal = document.getElementById('glossModal');
const glossModalClose = document.getElementById('glossModalClose');
const glossaryList = document.getElementById('glossaryList');

function renderGlossary(){
  glossaryList.innerHTML = GLOSSARY.map(g => `
    <div class="gloss-term">
      <h3>${g.term}</h3>
      <p>${g.definition}</p>
    </div>
  `).join('');
}
glossaryBtn.addEventListener('click', () => {
  renderGlossary();
  glossModal.classList.add('open');
});
glossModalClose.addEventListener('click', () => glossModal.classList.remove('open'));

// --- new-here guide ---
const guideBtn = document.getElementById('guideBtn');
const guideModal = document.getElementById('guideModal');
const guideModalClose = document.getElementById('guideModalClose');
guideBtn.addEventListener('click', () => guideModal.classList.add('open'));
guideModalClose.addEventListener('click', () => guideModal.classList.remove('open'));

// --- quiz ---
const quizBtn = document.getElementById('quizBtn');
const quizModal = document.getElementById('quizModal');
const quizModalClose = document.getElementById('quizModalClose');
const quizBody = document.getElementById('quizBody');

function renderQuiz(){
  const q = generateQuestion();
  if (!q){
    quizBody.innerHTML = '<p>Not enough data yet for a question, add more characters or fruits!</p>';
    return;
  }
  quizBody.innerHTML = `
    <p style="font-size:16px;margin-bottom:14px;">${q.prompt}</p>
    ${q.options.map(opt => `<button class="quiz-option" data-value="${opt}">${opt}</button>`).join('')}
  `;
  quizBody.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const isCorrect = btn.dataset.value === q.answer;
      quizBody.querySelectorAll('.quiz-option').forEach(b => {
        b.disabled = true;
        if (b.dataset.value === q.answer) b.classList.add('correct');
        else if (b === btn) b.classList.add('wrong');
      });
      const next = document.createElement('button');
      next.className = 'quiz-next';
      next.textContent = isCorrect ? '✓ Correct · next question' : `✗ It was "${q.answer}" · next question`;
      next.addEventListener('click', renderQuiz);
      quizBody.appendChild(next);
    });
  });
}
quizBtn.addEventListener('click', () => {
  quizModal.classList.add('open');
  renderQuiz();
});
quizModalClose.addEventListener('click', () => quizModal.classList.remove('open'));

// --- let every modal be closed by clicking its backdrop or pressing Escape ---
const overlayModals = [charModal, guideModal, glossModal, quizModal];
overlayModals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target !== modal) return;
    modal.classList.remove('open');
    if (modal === charModal) charGraphContainer.classList.remove('settled');
  });
});
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  overlayModals.forEach(modal => modal.classList.remove('open'));
  charGraphContainer.classList.remove('settled');
});

// --- graph tab ---
const graphBtn = document.getElementById('graphBtn');
graphBtn.addEventListener('click', openGraphOverview);

let cancelZoom = () => {};
function zoomBy(factor){
  stopAutoRotate();
  cancelZoom();
  const dir = camera.position.clone().normalize();
  const startDist = camera.position.length();
  const targetDist = THREE.MathUtils.clamp(startDist * factor, controls.minDistance, controls.maxDistance);
  cancelZoom = tween(260, p => {
    const dist = startDist + (targetDist - startDist) * p;
    camera.position.copy(dir.clone().multiplyScalar(dist));
    controls.update();
  }, easeOutCubic);
  scheduleIdleResume();
}
zoomInBtn.addEventListener('click', () => zoomBy(0.82));
zoomOutBtn.addEventListener('click', () => zoomBy(1.22));
if (shipLocation){
  locateShipBtn.addEventListener('click', () => selectLocation(shipLocation.id, true));
} else {
  locateShipBtn.disabled = true;
}

// --- render loop ---
function animate(){
  requestAnimationFrame(animate);
  controls.update();
  const elapsed = clock.getElapsedTime();
  updateOcean(clock.getDelta());
  if (!reducedMotion){
    updateLandmarks(elapsed);
    if (shipSprite){
      shipSprite.position.copy(shipBasePos).addScaledVector(shipNormal, Math.sin(elapsed * 0.8) * 0.015);
    }
  }
  updateLabelPositions(labelEls, camera, stage, GLOBE_RADIUS, selectedId);
  renderer.render(scene, camera);
}
animate();
