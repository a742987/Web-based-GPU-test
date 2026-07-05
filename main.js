import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

// ── Scene, Camera, Renderer ───────────────────────────────────────
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111118);
scene.fog = new THREE.FogExp2(0x111118, 0.006);

const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0, 10, 50);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.9;
document.body.appendChild(renderer.domElement);

// ── Controls ──────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 300;
controls.autoRotate = false;

// ── Lighting (minimal, no specular) ──────────────────────────────
const ambientLight = new THREE.AmbientLight(0x222233, 1.0);
scene.add(ambientLight);

// ── Center TorusKnot (wireframe only, no gloss) ───────────────────
const knotGeo = new THREE.TorusKnotGeometry(4, 1.0, 128, 32);
const knotMat = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.06,
});
const knot = new THREE.Mesh(knotGeo, knotMat);
knot.position.y = 4;
scene.add(knot);

// ── Palette ───────────────────────────────────────────────────────
const palette = [0xffd0e8, 0xd8b0ff, 0xb0ffd8, 0xe8e8f0];

// ── Geometry definitions (low-poly, clean wireframes) ─────────────
const geoDefs = [
  () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
  () => new THREE.SphereGeometry(1.0, 16, 16),
  () => new THREE.ConeGeometry(0.7, 2.0, 5),
  () => new THREE.OctahedronGeometry(1.1),
  () => new THREE.TorusGeometry(0.8, 0.35, 8, 24),
  () => new THREE.IcosahedronGeometry(1.0),
  () => new THREE.DodecahedronGeometry(0.95),
  () => new THREE.CylinderGeometry(0.6, 0.6, 2.0, 8),
  () => new THREE.TetrahedronGeometry(1.1),
  () => new THREE.TorusKnotGeometry(0.7, 0.25, 32, 8, 2, 3),
];

// ── Generate instance data ────────────────────────────────────────
const TOTAL_ORBITERS = 30000;
const instances = [];

for (let i = 0; i < TOTAL_ORBITERS; i++) {
  instances.push({
    geoIndex: i % geoDefs.length,
    colorIndex: i % palette.length,
    // Spread wide: radius 15 ~ 120
    radius: 15 + Math.random() * 105,
    speed: 0.03 + Math.random() * 0.15,
    offset: Math.random() * Math.PI * 2,
    yOffset: -5 + Math.random() * 20,
    floatAmp: 0.3 + Math.random() * 1.0,
    floatSpeed: 0.2 + Math.random() * 0.6,
    scale: 0.3 + Math.random() * 1.0,
  });
}

// ── Group by (color, geo) for InstancedMesh ───────────────────────
const groups = {};
instances.forEach((inst) => {
  const key = `${inst.colorIndex}:${inst.geoIndex}`;
  if (!groups[key]) groups[key] = { instances: [], geo: geoDefs[inst.geoIndex](), colorIdx: inst.colorIndex, geoIdx: inst.geoIndex };
  groups[key].instances.push(inst);
});

// Create InstancedMesh (wireframe only, MeshBasicMaterial = no highlights)
const wireMeshes = [];
for (const key in groups) {
  const g = groups[key];
  const count = g.instances.length;
  const mat = new THREE.MeshBasicMaterial({
    color: palette[g.colorIdx],
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });
  const mesh = new THREE.InstancedMesh(g.geo, mat, count);

  const dummy = new THREE.Object3D();
  g.instances.forEach((inst, i) => {
    dummy.position.set(0, 0, 0);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(inst.scale);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh._instances = g.instances;
  scene.add(mesh);
  wireMeshes.push(mesh);
}

// ── Starfield Particles ──────────────────────────────────────────
const PARTICLE_COUNT = 20000;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const pColors = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  const i3 = i * 3;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 80 + Math.random() * 300;
  positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
  positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  positions[i3 + 2] = r * Math.cos(phi);
  const ci = i % palette.length;
  const c = new THREE.Color(palette[ci]);
  const brightness = 0.3 + Math.random() * 0.7;
  pColors[i3]     = c.r * brightness;
  pColors[i3 + 1] = c.g * brightness;
  pColors[i3 + 2] = c.b * brightness;
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

const particleMat = new THREE.PointsMaterial({
  size: 0.3,
  vertexColors: true,
  transparent: true,
  opacity: 0.7,
  sizeAttenuation: true,
});

const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ── Post-Processing (Bloom) ──────────────────────────────────────
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(innerWidth, innerHeight),
  0.5, 0.5, 0.6,
);
composer.addPass(bloomPass);

// ── Animation ─────────────────────────────────────────────────────
const clock = new THREE.Clock();
const dummy = new THREE.Object3D();

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Center knot
  knot.rotation.x = t * 0.08;
  knot.rotation.y = t * 0.12;

  // Update wireframe InstancedMeshes
  wireMeshes.forEach((mesh) => {
    const insts = mesh._instances;
    const count = insts.length;
    for (let i = 0; i < count; i++) {
      const d = insts[i];
      const angle = t * d.speed + d.offset;
      dummy.position.set(
        Math.cos(angle) * d.radius,
        d.yOffset + Math.sin(t * d.floatSpeed) * d.floatAmp,
        Math.sin(angle) * d.radius,
      );
      dummy.rotation.set(t * 0.15, t * 0.25, 0);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  // Particles
  particles.rotation.y = t * 0.004;
  particles.rotation.x = t * 0.002;

  controls.update();
  composer.render();
}

animate();

// ── Responsive Resize ─────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  composer.setSize(innerWidth, innerHeight);
});
