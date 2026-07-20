import * as THREE from 'three';
import { latLonToVec3 } from './utils/geo.js';
import { tween, easeOutCubic } from './utils/tween.js';

/** Wires pointer hover/click detection against the marker sprites, and
 *  provides a camera "fly-to" animation used when an island is selected. */
export function setupInteraction({ canvas, camera, controls, markerObjects, tooltip, onSelect }){
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  let hovered = null;

  function onPointerMove(e){
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(markerObjects);

    if (hits.length){
      hovered = hits[0].object.userData.loc;
      tooltip.textContent = hovered.name;
      tooltip.style.left = (e.clientX - rect.left) + 'px';
      tooltip.style.top = (e.clientY - rect.top) + 'px';
      tooltip.classList.add('show');
      canvas.style.cursor = 'pointer';
    } else {
      hovered = null;
      tooltip.classList.remove('show');
      canvas.style.cursor = 'grab';
    }
  }

  function onClick(){
    if (hovered) onSelect(hovered.id, true);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('click', onClick);

  return { flyTo: (lat, lon) => flyCameraTo(camera, controls, lat, lon) };
}

let cancelFlight = () => {};

/** Eases the camera to look at a given lat/lon on the globe, keeping its
 *  current distance from center. Exported directly (not just via
 *  setupInteraction) so other pages — e.g. the route animation — can
 *  reuse the exact same fly-to behavior as the main atlas.
 *
 *  Arcs the camera outward slightly at the midpoint (a slerp of direction,
 *  eased independently from a radius "altitude bump") rather than a flat
 *  lerp between start/target points, so long-haul flights swoop over the
 *  globe's surface instead of cutting a straight chord through it. Riding
 *  on the shared tween() helper means a new flight cancels any in-progress
 *  one for free, and prefers-reduced-motion collapses to the t=1 pose
 *  (identical math, just one frame) with no special-cased branch. */
export function flyCameraTo(camera, controls, lat, lon){
  cancelFlight();
  controls.autoRotate = false;
  const dist = camera.position.length();
  const startDir = camera.position.clone().normalize();
  const targetDir = latLonToVec3(lat, lon, 1).normalize();

  // setFromUnitVectors degenerates when start/target point in ~opposite
  // directions (undefined rotation axis) — nudge off-axis so antipodal
  // hops still resolve to a well-defined arc instead of a random spin.
  let safeTargetDir = targetDir;
  if (startDir.dot(targetDir) < -0.999){
    const nudgeAxis = Math.abs(startDir.x) < 0.9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    safeTargetDir = targetDir.clone().addScaledVector(nudgeAxis, 0.001).normalize();
  }

  const qEnd = new THREE.Quaternion().setFromUnitVectors(startDir, safeTargetDir);
  const qStep = new THREE.Quaternion();
  const ALT_BUMP = 1.15; // 15% altitude gain at the flight's midpoint

  cancelFlight = tween(900, t => {
    qStep.slerpQuaternions(qStep.identity(), qEnd, easeOutCubic(t));
    const dir = startDir.clone().applyQuaternion(qStep);
    const radiusFactor = 1 + Math.sin(Math.PI * t) * (ALT_BUMP - 1);
    camera.position.copy(dir.multiplyScalar(dist * radiusFactor));
    camera.lookAt(0, 0, 0);
  });
}
