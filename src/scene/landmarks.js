import * as THREE from 'three';
import { latLonToVec3, surfaceNormal, orientToNormal } from '../utils/geo.js';

/* ============================================================
   LANDMARK REGISTRY
   Each entry is a builder function that returns a THREE.Group.
   To give another island its own shape (Wano's torii gate,
   Skypiea's cloud platform, etc.), write a new builder below
   and register it in LANDMARK_BUILDERS. Then set
   `landmark: "yourKey"` on that location in data/locations.js.
   ============================================================ */

function buildElephant(){
  const group = new THREE.Group();
  const hide = new THREE.MeshStandardMaterial({ color: 0x6b6459, roughness: 0.9 });
  const tusk = new THREE.MeshStandardMaterial({ color: 0xEDE3CF, roughness: 0.5 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 16), hide);
  body.scale.set(1.5, 1, 1.15);
  body.position.set(0, 0.42, 0);
  group.add(body);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.1, 0.42, 8);
  const legPositions = [[-0.32, 0.18, 0.2], [0.32, 0.18, 0.2], [-0.32, 0.18, -0.2], [0.32, 0.18, -0.2]];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, hide);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 14), hide);
  head.position.set(0.56, 0.5, 0);
  group.add(head);

  const earGeo = new THREE.CircleGeometry(0.16, 12);
  const earL = new THREE.Mesh(earGeo, hide);
  earL.position.set(0.58, 0.52, 0.2); earL.rotation.y = Math.PI / 2.4;
  const earR = earL.clone(); earR.position.z = -0.2; earR.rotation.y = -Math.PI / 2.4;
  group.add(earL, earR);

  const trunkGeo = new THREE.CylinderGeometry(0.05, 0.03, 0.5, 8);
  const trunk = new THREE.Mesh(trunkGeo, hide);
  trunk.position.set(0.72, 0.28, 0);
  trunk.rotation.z = Math.PI / 2.6;
  group.add(trunk);

  const tuskGeo = new THREE.ConeGeometry(0.025, 0.22, 6);
  const tuskL = new THREE.Mesh(tuskGeo, tusk);
  tuskL.position.set(0.68, 0.38, 0.08); tuskL.rotation.z = Math.PI / 2.2;
  const tuskR = tuskL.clone(); tuskR.position.z = -0.08;
  group.add(tuskL, tuskR);

  group.scale.setScalar(1.3);
  return group;
}

function buildTieredCake(){
  const group = new THREE.Group();
  const icing = new THREE.MeshStandardMaterial({ color: 0xF3D9E8, roughness: 0.7 });
  const trim = new THREE.MeshStandardMaterial({ color: 0xC94F7C, roughness: 0.6 });
  const tiers = [
    { r: 0.4, h: 0.16, y: 0.08 },
    { r: 0.3, h: 0.14, y: 0.24 },
    { r: 0.2, h: 0.12, y: 0.38 },
  ];
  tiers.forEach(t => {
    const tier = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r, t.h, 20), icing);
    tier.position.y = t.y;
    group.add(tier);
    const band = new THREE.Mesh(new THREE.TorusGeometry(t.r, 0.015, 8, 24), trim);
    band.rotation.x = Math.PI / 2;
    band.position.y = t.y - t.h / 2;
    group.add(band);
  });
  group.scale.setScalar(1.3);
  return group;
}

function buildShipFuneral(){
  // A small, generic sailing-ship silhouette (not any specific ship's design)
  // with a warm ember glow, marking a memorial rather than a place to visit.
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x4a3323, roughness: 0.85 });
  const emberMat = new THREE.MeshStandardMaterial({ color: 0xE8944A, emissive: 0xC1502E, emissiveIntensity: 0.9, roughness: 0.6 });

  const hull = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.22, 0.14, 8, 1, false, 0, Math.PI), wood);
  hull.rotation.z = Math.PI;
  hull.position.set(0, 0.1, 0);
  group.add(hull);

  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.4, 6), wood);
  mast.position.set(0, 0.34, 0);
  group.add(mast);

  const sail = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.28), emberMat);
  sail.position.set(0.02, 0.36, 0);
  group.add(sail);

  const glow = new THREE.PointLight(0xC1502E, 0.8, 1.2);
  glow.position.set(0, 0.3, 0);
  group.add(glow);
  group.userData.emberLight = glow;
  group.userData.emberBaseIntensity = 0.8;

  group.scale.setScalar(1.4);
  return group;
}

function buildToriiGate(){
  const group = new THREE.Group();
  const wood = new THREE.MeshStandardMaterial({ color: 0x8C3B26, roughness: 0.7 });
  const postGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.5, 8);
  const postL = new THREE.Mesh(postGeo, wood); postL.position.set(-0.22, 0.25, 0);
  const postR = new THREE.Mesh(postGeo, wood); postR.position.set(0.22, 0.25, 0);
  group.add(postL, postR);

  const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.52, 8), wood);
  topBar.rotation.z = Math.PI / 2;
  topBar.position.set(0, 0.48, 0);
  const underBar = topBar.clone();
  underBar.position.y = 0.4;
  underBar.scale.set(0.9, 1, 1);
  group.add(topBar, underBar);

  group.scale.setScalar(1.3);
  return group;
}

function buildCloudDais(){
  const group = new THREE.Group();
  const cloud = new THREE.MeshStandardMaterial({ color: 0xF3EAD6, roughness: 0.95, transparent: true, opacity: 0.9 });
  const gold = new THREE.MeshStandardMaterial({ color: 0xC99A3A, roughness: 0.4, metalness: 0.5 });

  const base = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), cloud);
  group.add(base);

  const puff1 = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), cloud);
  puff1.position.set(0.2, 0.06, 0.1);
  const puff2 = puff1.clone(); puff2.position.set(-0.18, 0.05, -0.12);
  group.add(puff1, puff2);

  const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8), gold);
  pillar.position.set(0, 0.25, 0);
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), gold);
  orb.position.set(0, 0.42, 0);
  group.add(pillar, orb);

  group.scale.setScalar(1.3);
  return group;
}

function buildGlassDome(){
  // A generic bubble-habitat shape (a glass dome ringed by coral spires) for
  // an undersea settlement — an original silhouette, not a reproduction of
  // any specific location's actual copyrighted architecture.
  const group = new THREE.Group();
  const glass = new THREE.MeshStandardMaterial({ color: 0x8ecbc4, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 });
  const coral = new THREE.MeshStandardMaterial({ color: 0xC1502E, roughness: 0.8 });

  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2), glass);
  group.add(dome);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.018, 8, 24), coral);
  ring.rotation.x = Math.PI / 2;
  group.add(ring);

  const spireGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.16, 6);
  const spirePositions = [[0.09, 0.08, 0.05], [-0.11, 0.07, -0.06], [0.02, 0.09, -0.13]];
  spirePositions.forEach(([x, y, z]) => {
    const spire = new THREE.Mesh(spireGeo, coral);
    spire.position.set(x, y, z);
    group.add(spire);
  });

  group.scale.setScalar(1.3);
  return group;
}

export const LANDMARK_BUILDERS = {
  elephant: buildElephant,
  tieredCake: buildTieredCake,
  shipFuneral: buildShipFuneral,
  toriiGate: buildToriiGate,
  cloudDais: buildCloudDais,
  glassDome: buildGlassDome,
};

/** Attaches any registered landmark models to the globe for locations
 *  that declare a `landmark` key in data/locations.js. Returns an
 *  updateLandmarks(elapsed) function — call it once per animation frame
 *  (mirroring updateOcean(dt)'s convention) to drive each landmark's gentle
 *  idle bob and, where present, its ember light's pulse. */
export function attachLandmarks(scene, locations, globeRadius){
  const animated = [];
  locations.forEach(loc => {
    const builder = loc.landmark && LANDMARK_BUILDERS[loc.landmark];
    if (!builder) return;
    const model = builder();
    const pos = latLonToVec3(loc.lat, loc.lon, globeRadius + 0.05);
    model.position.copy(pos);
    orientToNormal(model, surfaceNormal(loc.lat, loc.lon));
    scene.add(model);
    animated.push({
      model,
      basePosition: pos.clone(),
      normal: surfaceNormal(loc.lat, loc.lon),
      phase: Math.random() * Math.PI * 2,
    });
  });

  return function updateLandmarks(elapsed){
    animated.forEach(({ model, basePosition, normal, phase }) => {
      const bob = Math.sin(elapsed * 0.6 + phase) * 0.005;
      model.position.copy(basePosition).addScaledVector(normal, bob);
      const emberLight = model.userData.emberLight;
      if (emberLight){
        emberLight.intensity = model.userData.emberBaseIntensity + Math.sin(elapsed * 1.4 + phase) * 0.25;
      }
    });
  };
}
