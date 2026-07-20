import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { buildWorldTexture, buildOceanShimmerTexture } from './texture.js';
import { tween, easeOutCubic, prefersReducedMotion } from '../utils/tween.js';

export const GLOBE_RADIUS = 5;
const IDLE_ROTATE_SPEED = 0.4;

/** Builds the full base scene: renderer, camera, controls, lights, stars,
 *  and the textured globe itself. Returns everything main.js needs to wire
 *  markers, landmarks, and interaction on top of. */
export function setupScene(canvas, stage){
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  // left transparent on purpose — the ambient-backdrop canvas behind this
  // one (see src/scene/ambientBackdrop.js) shows through around the globe

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 1.4, 16);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 9.5;
  controls.maxDistance = 24;
  controls.autoRotate = !prefersReducedMotion();
  controls.autoRotateSpeed = IDLE_ROTATE_SPEED;

  // Auto-rotate eases out on interaction (rather than hard-cutting) and
  // resumes, ramped back up, after a period of idle. OrbitControls already
  // emits 'start'/'end' around every drag/zoom — this is the one place that
  // needs to hook them, so manual dragging gets the same idle-resume as the
  // zoom buttons and fly-to.
  let idleTimer = null;
  let cancelRamp = () => {};
  function stopAutoRotate(){
    clearTimeout(idleTimer);
    cancelRamp();
    if (prefersReducedMotion() || controls.autoRotateSpeed <= 0){
      controls.autoRotate = false;
      return;
    }
    const startSpeed = controls.autoRotateSpeed;
    cancelRamp = tween(400, p => {
      controls.autoRotateSpeed = startSpeed * (1 - p);
      if (p >= 1){ controls.autoRotate = false; controls.autoRotateSpeed = IDLE_ROTATE_SPEED; }
    }, easeOutCubic);
  }
  function scheduleIdleResume(delayMs = 8000){
    clearTimeout(idleTimer);
    if (prefersReducedMotion()) return;
    idleTimer = setTimeout(() => {
      cancelRamp();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0;
      cancelRamp = tween(800, p => {
        controls.autoRotateSpeed = IDLE_ROTATE_SPEED * easeOutCubic(p);
      });
    }, delayMs);
  }
  controls.addEventListener('start', () => stopAutoRotate());
  controls.addEventListener('end', () => scheduleIdleResume());

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sun = new THREE.DirectionalLight(0xfff3d8, 1.1);
  sun.position.set(6, 4, 8);
  scene.add(sun);

  addStarfield(scene);

  const globeTexture = buildWorldTexture();
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS, 96, 96),
    new THREE.MeshStandardMaterial({ map: globeTexture, roughness: 0.85, metalness: 0.05 })
  );
  scene.add(globe);

  const atmo = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x6fd0c4, transparent: true, opacity: 0.06, side: THREE.BackSide })
  );
  scene.add(atmo);

  // Ocean shimmer: a faint scrolling current-line texture layered just
  // above the globe surface, so the water reads as moving rather than
  // a static painted texture. Call the returned updateOcean(dt) once
  // per animation frame from each page's own render loop.
  const oceanTexture = buildOceanShimmerTexture();
  const oceanShimmer = new THREE.Mesh(
    new THREE.SphereGeometry(GLOBE_RADIUS * 1.008, 96, 96),
    new THREE.MeshBasicMaterial({ map: oceanTexture, transparent: true, opacity: 0.5, depthWrite: false })
  );
  scene.add(oceanShimmer);
  function updateOcean(dt){
    oceanTexture.offset.x += dt * 0.015;
  }

  function resize(){
    const w = stage.clientWidth, h = stage.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  return { renderer, scene, camera, controls, globe, resize, updateOcean, stopAutoRotate, scheduleIdleResume };
}

function addStarfield(scene){
  const N = 900;
  const positions = new Float32Array(N * 3);
  for (let i = 0; i < N; i++){
    const r = 40 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ color: 0xE8DCC0, size: 0.09, transparent: true, opacity: 0.65 });
  scene.add(new THREE.Points(geo, mat));
}
