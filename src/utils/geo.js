import * as THREE from 'three';

/** Converts lat/lon (degrees) to a 3D position on a sphere of radius r. */
export function latLonToVec3(lat, lon, r){
  const phi = (90 - lat) * Math.PI / 180;
  const theta = lon * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

/** Returns the outward surface normal at a given lat/lon (unit vector). */
export function surfaceNormal(lat, lon){
  return latLonToVec3(lat, lon, 1).normalize();
}

/** Orients an Object3D so its local +Y axis points along the given normal
 *  (used to make landmarks "stand up" off the curved globe surface). */
export function orientToNormal(object3D, normal){
  const up = new THREE.Vector3(0, 1, 0);
  const quat = new THREE.Quaternion().setFromUnitVectors(up, normal.clone().normalize());
  object3D.setRotationFromQuaternion(quat);
}
