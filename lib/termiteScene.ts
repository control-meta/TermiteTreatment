import * as THREE from 'three';
import { advanceTermite, createTermiteMotion, insideReadingArea, type TermiteMotion } from './termiteMotion';

type Limb = { side: number; index: number; bones: THREE.Mesh[]; joints: THREE.Mesh[] };
type Insect = { group: THREE.Group; body: THREE.Group; legs: Limb[]; antennae: THREE.Group[]; size: number; motion: TermiteMotion };

/** Articulated worker termite: broad waist, nine abdominal plates, six jointed
 * legs, mandibles and straight, beaded antennae. All visible insects are meshes. */
export function createTermiteScene(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 1, 0, .1, 2000);
  camera.position.z = 800;
  scene.add(new THREE.HemisphereLight(0xfffbef, 0x77755b, 2.4));
  const key = new THREE.DirectionalLight(0xffeed2, 3.5);
  key.position.set(-150, 300, 600); scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 1.7);
  rim.position.set(400, -100, 300); scene.add(rim);

  const sphere = new THREE.SphereGeometry(1, 32, 20);
  const boneGeometry = new THREE.CylinderGeometry(1, .75, 1, 10, 1);
  const noise = new Uint8Array(128 * 128 * 4);
  let seed = 47;
  for (let i = 0; i < noise.length; i += 4) { seed = (seed * 16807) % 2147483647; const value = 160 + seed % 70; noise[i] = value; noise[i + 1] = value; noise[i + 2] = value; noise[i + 3] = 255; }
  const bump = new THREE.DataTexture(noise, 128, 128); bump.needsUpdate = true;
  const ivory = new THREE.MeshPhysicalMaterial({ color: 0xe5cf98, roughness: .39, metalness: 0, clearcoat: .48, clearcoatRoughness: .3, transmission: .12, thickness: .25, ior: 1.4, bumpMap: bump, bumpScale: .013 });
  const plates = Array.from({ length: 9 }, (_, i) => new THREE.MeshPhysicalMaterial({ color: new THREE.Color().setHSL(.105, .33, .68 + i % 2 * .04), roughness: .43, clearcoat: .42, transmission: .09, thickness: .2, bumpMap: bump, bumpScale: .012 }));
  const amber = new THREE.MeshPhysicalMaterial({ color: 0xa76a29, roughness: .31, clearcoat: .8, clearcoatRoughness: .2, bumpMap: bump, bumpScale: .009 });
  const legMaterial = new THREE.MeshPhysicalMaterial({ color: 0xc69850, roughness: .43, clearcoat: .3 });
  const jawMaterial = new THREE.MeshPhysicalMaterial({ color: 0x5f3515, roughness: .35, clearcoat: .4 });
  const shadowCanvas = document.createElement('canvas'); shadowCanvas.width = 96; shadowCanvas.height = 128;
  const context = shadowCanvas.getContext('2d')!;
  const gradient = context.createRadialGradient(48, 64, 4, 48, 64, 48);
  gradient.addColorStop(0, 'rgba(48,30,8,.27)'); gradient.addColorStop(.5, 'rgba(48,30,8,.13)'); gradient.addColorStop(1, 'rgba(48,30,8,0)');
  context.fillStyle = gradient; context.fillRect(0, 0, 96, 128);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
  const shadowGeometry = new THREE.PlaneGeometry(2.7, 4.8);
  const shadowMaterial = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: .8 });
  const yAxis = new THREE.Vector3(0, 1, 0);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), direction = new THREE.Vector3();
  function ellipsoid(parent: THREE.Object3D, material: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number) {
    const mesh = new THREE.Mesh(sphere, material); mesh.position.set(x, y, z); mesh.scale.set(sx, sy, sz); parent.add(mesh); return mesh;
  }
  function connect(mesh: THREE.Mesh, from: THREE.Vector3, to: THREE.Vector3, radius: number) {
    direction.subVectors(to, from); mesh.position.copy(from).addScaledVector(direction, .5); mesh.quaternion.setFromUnitVectors(yAxis, direction.clone().normalize()); mesh.scale.set(radius, direction.length(), radius);
  }
  function createInsect(index: number): Insect {
    const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial); shadow.position.set(.12, -.42, -1); group.add(shadow);
    ellipsoid(body, ivory, 0, .19, .3, .28, .51, .24);
    ellipsoid(body, ivory, 0, .56, .36, .31, .25, .23);
    ellipsoid(body, amber, 0, .98, .36, .345, .395, .29);
    // Abdominal segments overlap without an ant-like pinched waist.
    for (let i = 0; i < 9; i++) {
      const radius = .32 + Math.sin((i + 1) / 10 * Math.PI) * .15;
      ellipsoid(body, plates[i], 0, -.25 - i * .172, .28, radius, .19, .24 + Math.sin(i / 9 * Math.PI) * .07);
    }
    // Tiny paired cerci and curved chewing mandibles.
    for (const side of [-1, 1]) {
      ellipsoid(body, legMaterial, side * .12, -1.81, .2, .035, .13, .03).rotation.z = side * -.3;
      const jawPath = new THREE.CatmullRomCurve3([new THREE.Vector3(side * .16, 1.25, .25), new THREE.Vector3(side * .24, 1.43, .26), new THREE.Vector3(side * .08, 1.51, .29)]);
      body.add(new THREE.Mesh(new THREE.TubeGeometry(jawPath, 12, .035, 8, false), jawMaterial));
      ellipsoid(body, amber, side * .09, 1.31, .39, .05, .08, .04);
    }
    const antennae: THREE.Group[] = [];
    for (const side of [-1, 1]) {
      const antenna = new THREE.Group(); antenna.position.set(side * .23, 1.18, .42); body.add(antenna); antennae.push(antenna);
      const beads = new THREE.InstancedMesh(sphere, legMaterial, 14);
      const matrix = new THREE.Matrix4(), scale = new THREE.Vector3(), quaternion = new THREE.Quaternion();
      for (let i = 0; i < 14; i++) { const t = i / 13; const radius = .032 * (1 - .28 * t); scale.setScalar(radius); matrix.compose(new THREE.Vector3(side * (.065 + t * .49), .04 + t * .88, -.08 * t * t), quaternion, scale); beads.setMatrixAt(i, matrix); }
      antenna.add(beads);
    }
    // Fine surface setae catch the light along the body silhouette.
    const hairs: number[] = [];
    for (let i = 0; i < 27; i++) { const side = i % 2 ? 1 : -1; const y = -1.6 + i / 27 * 2.75; const x = side * (y > .6 ? .3 : .38); hairs.push(x, y, .42, x + side * .06, y + .035, .48); }
    const hairGeometry = new THREE.BufferGeometry(); hairGeometry.setAttribute('position', new THREE.Float32BufferAttribute(hairs, 3));
    body.add(new THREE.LineSegments(hairGeometry, new THREE.LineBasicMaterial({ color: 0xa17943, transparent: true, opacity: .42 })));
    const legs: Limb[] = [];
    for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
      const bones = Array.from({ length: 4 }, () => { const mesh = new THREE.Mesh(boneGeometry, legMaterial); body.add(mesh); return mesh; });
      const joints = Array.from({ length: 3 }, () => { const mesh = new THREE.Mesh(sphere, legMaterial); mesh.scale.setScalar(.047); body.add(mesh); return mesh; });
      legs.push({ side, index: i, bones, joints });
    }
    scene.add(group);
    return { group, body, legs, antennae, size: 10 + index, motion: createTermiteMotion(index) };
  }
  const insects = Array.from({ length: 2 }, (_, index) => createInsect(index));
  let width = 1, height = 1, frame = 0, last = 0, elapsed = 0, disposed = false;
  renderer.domElement.dataset.termiteCount = String(insects.length);
  let obstacles: DOMRect[] = [], nextObstacleCheck = 0;
  function resize() {
    const previousWidth = width, previousHeight = height;
    width = window.innerWidth; height = window.innerHeight;
    camera.right = width; camera.top = height; camera.updateProjectionMatrix(); renderer.setSize(width, height, false);
    insects.forEach((insect, index) => {
      insect.motion.x = Number.isFinite(insect.motion.x) ? Math.max(22, Math.min(width - 22, insect.motion.x / previousWidth * width)) : index === 0 ? 26 : width - 26;
      insect.motion.y = Number.isFinite(insect.motion.y) ? Math.max(82, Math.min(height - 85, insect.motion.y / previousHeight * height)) : height * (index === 0 ? .32 : .7);
    });
    nextObstacleCheck = 0;
  }
  resize(); window.addEventListener('resize', resize, { passive: true });
  function animate(now: number) {
    if (disposed) return;
    frame = requestAnimationFrame(animate);
    if (now - last < 1000 / 30) return;
    const delta = Math.min((now - last) / 1000, .1); last = now;
    if (document.hidden) return;
    elapsed += delta;
    if (elapsed >= nextObstacleCheck) {
      obstacles = Array.from(document.querySelectorAll('.hero-copy, .quote-card, .review-story, .faq-list')).map(element => element.getBoundingClientRect()).filter(box => box.width > 0 && box.bottom > 0 && box.top < height);
      nextObstacleCheck = elapsed + .4;
    }
    for (let index = 0; index < insects.length; index++) {
      const insect = insects[index];
      const motion = insect.motion;
      advanceTermite(motion, width, height, delta, elapsed, obstacles);
      insect.group.visible = !obstacles.some(box => insideReadingArea(motion.x, motion.y, box));
      insect.group.position.set(motion.x, height - motion.y, 0);
      insect.group.scale.setScalar(width < 700 ? 8 : insect.size);
      insect.group.rotation.z = Math.atan2(-Math.cos(motion.heading), -Math.sin(motion.heading));
      insect.body.position.z = Math.sin(motion.gait + motion.phase) * .009;
      for (let j = 0; j < insect.antennae.length; j++) insect.antennae[j].rotation.z = Math.sin(elapsed * 3 + motion.phase + j * 2) * .09;
      for (const limb of insect.legs) {
        const phase = motion.gait + limb.index * Math.PI * .67 + (limb.side > 0 ? Math.PI : 0);
        const swing = Math.sin(phase) * .18, lift = Math.max(0, Math.cos(phase)) * .11;
        const hipY = .46 - limb.index * .32;
        a.set(limb.side * .23, hipY, .27);
        b.set(limb.side * (.61 + Math.cos(phase) * .035), hipY + .3 - limb.index * .23 + swing * .35, .16);
        connect(limb.bones[0], a, b, .037); limb.joints[0].position.copy(b);
        a.copy(b); b.set(limb.side * .91, hipY + .48 - limb.index * .45 + swing, .04 + lift);
        connect(limb.bones[1], a, b, .022); limb.joints[1].position.copy(b);
        a.copy(b); b.x += limb.side * .1; b.y += .075; b.z = .025 + lift;
        connect(limb.bones[2], a, b, .014); limb.joints[2].position.copy(b);
        a.copy(b); b.y += .07; b.x += limb.side * .04;
        connect(limb.bones[3], a, b, .009);
      }
    }
    renderer.render(scene, camera);
  }
  frame = requestAnimationFrame(animate);
  return () => {
    disposed = true; cancelAnimationFrame(frame); window.removeEventListener('resize', resize);
    const geometries = new Set<THREE.BufferGeometry>(), materials = new Set<THREE.Material>();
    scene.traverse(object => { if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) { geometries.add(object.geometry); for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material); } });
    geometries.forEach(geometry => geometry.dispose()); materials.forEach(material => material.dispose()); bump.dispose(); shadowTexture.dispose(); renderer.dispose(); renderer.domElement.remove();
  };
}
