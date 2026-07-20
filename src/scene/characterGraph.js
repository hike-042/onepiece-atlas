import * as THREE from 'three';
import ForceGraph3D from '3d-force-graph';
import { CHARACTERS, findCharacterById } from '../data/characters/index.js';
import { CREWS, findCrewById } from '../data/crews.js';
import { findOrganizationById } from '../data/organizations.js';

const STATUS_COLORS = {
  active: "#1F5C56",
  deceased: "#8C3B26",
  left: "#A67C27",
  defected: "#A67C27",
};

const AFFILIATION_COLORS = {
  "Straw Hat Pirates": "#1F5C56",
  "Marines": "#33455e",
  "Revolutionary Army": "#8C3B26",
};
function colorFor(character){
  return AFFILIATION_COLORS[character.affiliation] || "#A67C27";
}

// Generic pennant mark by allegiance — an original crossbones/cross/star
// glyph, not a reproduction of any crew's actual copyrighted emblem.
function markFor(name){
  if (!name) return 'plain';
  if (name.includes('Revolutionary')) return 'star';
  if (name.includes('Marine')) return 'cross';
  return 'crossbones';
}

const flagTextureCache = new Map();
function flagTexture(color, mark){
  const key = color + '|' + mark;
  if (flagTextureCache.has(key)) return flagTextureCache.get(key);

  const canvas = document.createElement('canvas');
  canvas.width = 64; canvas.height = 48;
  const ctx = canvas.getContext('2d');

  ctx.strokeStyle = '#2a1c0f'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(5, 3); ctx.lineTo(5, 45); ctx.stroke();

  ctx.fillStyle = color;
  ctx.beginPath(); ctx.moveTo(5, 5); ctx.lineTo(58, 15); ctx.lineTo(5, 25); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1; ctx.stroke();

  const cx = 26, cy = 15;
  ctx.strokeStyle = '#E8DCC0'; ctx.fillStyle = '#E8DCC0'; ctx.lineWidth = 2;
  if (mark === 'crossbones'){
    ctx.beginPath();
    ctx.moveTo(cx - 7, cy - 5); ctx.lineTo(cx + 7, cy + 5);
    ctx.moveTo(cx + 7, cy - 5); ctx.lineTo(cx - 7, cy + 5);
    ctx.stroke();
  } else if (mark === 'cross'){
    ctx.beginPath();
    ctx.moveTo(cx, cy - 6); ctx.lineTo(cx, cy + 6);
    ctx.moveTo(cx - 6, cy); ctx.lineTo(cx + 6, cy);
    ctx.stroke();
  } else if (mark === 'star'){
    ctx.beginPath();
    for (let i = 0; i < 5; i++){
      const ang = -Math.PI / 2 + i * (2 * Math.PI / 5);
      const x = cx + Math.cos(ang) * 6, y = cy + Math.sin(ang) * 6;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  flagTextureCache.set(key, texture);
  return texture;
}

function makeFlagSprite(node){
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
    map: flagTexture(node.color, node.mark || 'plain'), transparent: true, depthWrite: false,
  }));
  const scale = 3 + (node.val || 5) * 0.6;
  sprite.scale.set(scale * (64 / 48), scale, 1);
  return sprite;
}

/** Builds the node/link dataset for a character's local neighborhood:
 *  the character itself, everyone in `related`, and everyone who shares
 *  their affiliation (as lighter "crewmate" links). */
function buildGraphData(centerId){
  const center = findCharacterById(centerId);
  if (!center) return { nodes: [], links: [] };

  const nodeIds = new Set([center.id]);
  const links = [];

  (center.related || []).forEach(rel => {
    const other = findCharacterById(rel.id);
    if (!other) return;
    nodeIds.add(other.id);
    links.push({ source: center.id, target: other.id, type: rel.type });
  });

  CHARACTERS
    .filter(c => c.affiliation === center.affiliation && c.id !== center.id)
    .slice(0, 8)
    .forEach(c => {
      nodeIds.add(c.id);
      if (!links.some(l => (l.source === center.id && l.target === c.id))) {
        links.push({ source: center.id, target: c.id, type: 'crewmate' });
      }
    });

  const nodes = [...nodeIds].map(id => {
    const c = findCharacterById(id);
    return {
      id: c.id,
      label: c.name,
      val: c.id === center.id ? 10 : 5,
      color: colorFor(c),
      mark: markFor(c.affiliation),
    };
  });

  return { nodes, links };
}

// One shared ForceGraph3D instance for both character and crew views — they
// render into the same #charGraphContainer and only one is ever visible at
// a time, so reusing a single instance (instead of the old openCrewGraph
// behavior of creating a brand-new ForceGraph3D()(container) every call)
// avoids leaking a WebGL context/renderer each time the crew modal reopens.
let sharedGraph = null;
function getOrCreateGraph(container, onSettle){
  if (!sharedGraph){
    sharedGraph = ForceGraph3D()(container)
      .backgroundColor('#0b1622')
      .linkColor(() => 'rgba(232,220,192,0.35)')
      .linkWidth(1.2)
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(1.5)
      // these small graphs visually settle in well under a second; the
      // library's own default cooldownTime (~15s) is tuned for much larger
      // force layouts and would leave the fade-in waiting far longer than
      // the simulation actually needs
      .cooldownTime(1500);
  }
  sharedGraph.onEngineStop(() => onSettle && onSettle());
  return sharedGraph;
}

/** Builds node/link data for an entire crew: captain and roster, each
 *  colored by their status within that crew (active/deceased/left). */
function buildCrewGraphData(crewId){
  const crew = findCrewById(crewId);
  if (!crew) return { nodes: [], links: [], crew: null };

  const crewMark = markFor(crew.name);
  const nodes = crew.members.map(m => {
    const c = findCharacterById(m.id);
    return {
      id: m.id,
      label: c ? c.name : m.id,
      val: m.id === crew.captain ? 10 : 5,
      color: STATUS_COLORS[m.status] || "#A67C27",
      mark: crewMark,
      memberStatus: m.status,
      memberRole: m.role,
    };
  });

  const links = crew.members
    .filter(m => m.id !== crew.captain)
    .map(m => ({ source: crew.captain, target: m.id, type: m.role }));

  return { nodes, links, crew };
}

/** Builds node/link data for a non-crew organization (Marines, CP9, the
 *  World Government, ...): a leader plus its notable members, radiating
 *  out star/cross/plain-marked flags the same way a crew graph does. */
function buildOrganizationGraphData(orgId){
  const org = findOrganizationById(orgId);
  if (!org) return { nodes: [], links: [], org: null };

  const orgMark = markFor(org.name);
  const memberIds = org.leader && !org.notableMembers.includes(org.leader)
    ? [org.leader, ...org.notableMembers]
    : org.notableMembers;

  const nodes = memberIds.map(id => {
    const c = findCharacterById(id);
    return {
      id,
      label: c ? c.name : id,
      val: id === org.leader ? 10 : 5,
      color: id === org.leader ? '#C99A3A' : '#33455e',
      mark: orgMark,
    };
  });

  const links = org.leader
    ? nodes.filter(n => n.id !== org.leader).map(n => ({ source: org.leader, target: n.id, type: 'member' }))
    : [];

  return { nodes, links, org };
}

/** Opens (or re-centers) the 3D organization graph inside the given
 *  container. Node color encodes rank: gold = leader, steel = member. */
export function openOrganizationGraph(container, orgId, onNodeClick, onSettle){
  const { nodes, links } = buildOrganizationGraphData(orgId);

  const g = getOrCreateGraph(container, onSettle);
  g.nodeLabel(n => n.label)
   .nodeVal('val')
   .nodeColor('color')
   .nodeThreeObject(makeFlagSprite)
   .nodeThreeObjectExtend(false)
   .onNodeClick(node => onNodeClick && onNodeClick(node.id));

  g.graphData({ nodes, links });
  g.width(container.clientWidth);
  g.height(container.clientHeight);
  return g;
}

/** Opens (or re-centers) the 3D crew graph inside the given container.
 *  Node color encodes membership status: teal = active, rust = deceased,
 *  gold = left/defected. */
export function openCrewGraph(container, crewId, onNodeClick, onSettle){
  const { nodes, links } = buildCrewGraphData(crewId);

  const g = getOrCreateGraph(container, onSettle);
  g.nodeLabel(n => `${n.label}: ${n.memberRole}${n.memberStatus !== 'active' ? ` (${n.memberStatus})` : ''}`)
   .nodeVal('val')
   .nodeColor('color')
   .nodeThreeObject(makeFlagSprite)
   .nodeThreeObjectExtend(false)
   .onNodeClick(node => onNodeClick && onNodeClick(node.id));

  g.graphData({ nodes, links });
  g.width(container.clientWidth);
  g.height(container.clientHeight);
  return g;
}

/** Opens (or re-centers) the 3D character graph inside the given
 *  container element. */
export function openCharacterGraph(container, centerId, onNodeClick, onSettle){
  const data = buildGraphData(centerId);

  const g = getOrCreateGraph(container, onSettle);
  g.nodeLabel(n => n.label)
   .nodeVal('val')
   .nodeColor('color')
   .nodeThreeObject(makeFlagSprite)
   .nodeThreeObjectExtend(false)
   .onNodeClick(node => onNodeClick && onNodeClick(node.id));

  g.graphData(data);
  g.width(container.clientWidth);
  g.height(container.clientHeight);
  return g;
}

export function resizeCharacterGraph(container){
  if (sharedGraph) {
    sharedGraph.width(container.clientWidth);
    sharedGraph.height(container.clientHeight);
  }
}
