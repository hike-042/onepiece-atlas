import * as THREE from 'three';
import { latLonToVec3 } from '../utils/geo.js';
import { makeDotTexture } from './texture.js';

const DOT_COLORS = { explored: '#1B2A41', current: '#8C3B26', upcoming: '#C99A3A', memorial: '#C1502E' };

/** Creates one clickable dot sprite per location, plus one DOM label per
 *  location that stays anchored to the marker's screen position every
 *  frame — so island names stay readable at any zoom level instead of
 *  becoming illegible canvas text. */
export function buildMarkers(scene, labelLayer, locations, globeRadius){
  const dotTextures = {
    explored: makeDotTexture(DOT_COLORS.explored),
    current: makeDotTexture(DOT_COLORS.current),
    upcoming: makeDotTexture(DOT_COLORS.upcoming),
    memorial: makeDotTexture(DOT_COLORS.memorial),
  };

  const markerObjects = [];
  const labelEls = [];
  const group = new THREE.Group();
  scene.add(group);

  locations.forEach(loc => {
    const pos = latLonToVec3(loc.lat, loc.lon, globeRadius + 0.04);

    const textureKey = loc.kind === 'memorial' ? 'memorial' : loc.status;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: dotTextures[textureKey], depthTest: true, transparent: true,
    }));
    sprite.position.copy(pos);
    sprite.scale.set(0.32, 0.32, 0.32);
    sprite.userData = { loc };
    group.add(sprite);
    markerObjects.push(sprite);

    const el = document.createElement('div');
    el.className = 'island-label' + (loc.status === 'current' ? ' current' : loc.status === 'upcoming' ? ' upcoming' : '');
    el.textContent = loc.name;
    labelLayer.appendChild(el);
    labelEls.push({ el, loc, worldPos: pos });
  });

  return { markerObjects, labelEls, group };
}

/** Projects each label's 3D anchor to 2D screen space every frame, hides
 *  labels wrapping around the far side of the globe, and skips any label
 *  that would visually overlap one already placed — closer-to-center-of-view
 *  (and selected/priority) labels win, so names near the horizon don't pile
 *  up into an unreadable stack.
 *  Call this once per animation tick, after camera/controls update. */
export function updateLabelPositions(labelEls, camera, stage, globeRadius, selectedId){
  const halfW = stage.clientWidth / 2, halfH = stage.clientHeight / 2;
  const camDir = camera.position.clone().normalize();

  const candidates = labelEls.map(entry => {
    const toMarker = entry.worldPos.clone().normalize();
    const facing = toMarker.dot(camDir);
    const projected = entry.worldPos.clone().project(camera);
    const isPriority = Boolean(entry.priority) || Boolean(entry.loc && entry.loc.id === selectedId);
    return { entry, projected, facing, isPriority };
  });

  // priority labels (selected island, the ship marker) always win a spot;
  // among the rest, whichever is most centered toward the camera wins ties
  candidates.sort((a, b) => {
    if (a.isPriority !== b.isPriority) return a.isPriority ? -1 : 1;
    return b.facing - a.facing;
  });

  const placedRects = [];
  candidates.forEach(({ entry, projected, facing, isPriority }) => {
    const { el } = entry;
    // hysteresis: a label already visible only drops out below HIDE_AT, and
    // one already hidden only appears above SHOW_AT — the dead zone between
    // them stops rapid flicker for markers sitting right at the horizon edge
    const wasVisible = entry.wasVisible !== false;
    const facingOk = wasVisible ? facing > 0.14 : facing > 0.20;
    const visible = facingOk && projected.z < 1;
    entry.wasVisible = visible;
    if (!visible){
      setHidden(el, entry);
      return;
    }

    if (entry.width === undefined){
      entry.width = el.offsetWidth || 90;
      entry.height = el.offsetHeight || 20;
    }

    const x = projected.x * halfW + halfW;
    const stageW = halfW * 2;
    // flip to the anchor's left when placing to the right would overflow the stage
    const left = (x + 10 + entry.width > stageW) ? x - entry.width - 10 : x + 10;
    const top = -projected.y * halfH + halfH - 8;
    const rect = { left, top, right: left + entry.width, bottom: top + entry.height };

    const overlaps = !isPriority && placedRects.some(r =>
      rect.left < r.right && rect.right > r.left && rect.top < r.bottom && rect.bottom > r.top
    );
    if (overlaps){
      setHidden(el, entry);
      return;
    }

    placedRects.push(rect);
    setVisible(el, entry);
    el.style.transform = `translate(${left}px, ${top}px)`;
  });
}

// only touch classList when the rendered state actually flips, so we don't
// force a style recalc on every label every frame during camera movement
function setHidden(el, entry){
  if (entry.lastRenderedVisible === false) return;
  entry.lastRenderedVisible = false;
  el.classList.add('label-hidden');
}
function setVisible(el, entry){
  if (entry.lastRenderedVisible === true) return;
  entry.lastRenderedVisible = true;
  el.classList.remove('label-hidden');
}
