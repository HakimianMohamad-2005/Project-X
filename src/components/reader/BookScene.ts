/**
 * The WebGL book. A rigid hardcover board that swings open in one piece, and thin
 * paper leaves whose surface is bent every frame along a curve, so a turning page
 * curls from the corner you grab, lifts out of the gutter and settles flat.
 *
 * Coordinates: the book lies in the XY plane facing +Z (towards the camera).
 * The spine is the line x = 0; a Persian book binds on the right, so the closed
 * book extends to −X and pages turn from left to right.
 */

import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

/* ---------------- Dimensions (cover width = 1) ---------------- */

const CW = 1; // cover board width
const CH = 1280 / 901; // cover board height (real cover ratio)
const PW = 0.965; // paper width
const PH = CH - 0.032; // paper height
const B = 0.03; // board thickness
const EPS = 0.0028; // gap between stacked sheets
const SEG_X = 44;
const SEG_Y = 10;
const CURL = 1.15; // how much a turning page bends (radians at the free edge)
const BOW = 0.13; // rest curve of a page as it rises out of the gutter
const BOW_LEN = 0.06;

export interface BookTextures {
  cover: THREE.Texture;
  endpaper: THREE.Texture;
  back: THREE.Texture;
  spine: THREE.Texture;
  edgeV: THREE.Texture;
  edgeH: THREE.Texture;
  /** Faces of each paper leaf: [front, back]. */
  leaves: [THREE.Texture, THREE.Texture][];
  /** The page left showing once every leaf is turned. */
  last: THREE.Texture;
}

type Item = {
  kind: 'cover' | 'leaf';
  t: number; // 0 = lying on the left, 1 = turned to the right
  from: number;
  to: number;
  start: number;
  dur: number;
  animating: boolean;
  dir: 1 | -1;
  grabY: number;
  peel: number; // hover lift
  peelTarget: number;
  onDone?: () => void;
};

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
/** A heavy board: accelerates, lands, and settles with a tiny rebound. */
const easeBoard = (x: number) => {
  const c = 1.15;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};
const smooth = (x: number) => x * x * (3 - 2 * x);

export class BookScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(28, 1, 0.05, 60);
  readonly root = new THREE.Group(); // flight transform
  private sway = new THREE.Group(); // idle float while the book is closed
  private book = new THREE.Group(); // shifts so the closed book / open spread is centred
  private coverPivot = new THREE.Group();
  private leafMeshes: { geo: THREE.PlaneGeometry; group: THREE.Group }[] = [];
  private items: Item[] = [];
  private T: number;
  private zTop: number;
  private zHinge: number;
  private disposables: { dispose: () => void }[] = [];
  private raf = 0;
  private last = performance.now();
  private dust: THREE.Points;
  private shadowPlane: THREE.Mesh;
  private contact: THREE.Mesh;

  // Camera framing
  private aspect = 1;
  private viewH = 1;
  /** Screen space taken by the top and bottom UI bars, in px. */
  private insets = { top: 84, bottom: 110 };
  private parallax = new THREE.Vector2();
  private parallaxTarget = new THREE.Vector2();
  private focus = 0; // −1 left page, 0 spread, +1 right page
  private focusTarget = 0;
  private zoom = 1;
  private zoomTarget = 1;

  // Flight
  private flight: { from: THREE.Matrix4Tuple; start: number; dur: number; reverse: boolean; done?: () => void } | null = null;
  private fromPos = new THREE.Vector3();
  private fromQuat = new THREE.Quaternion();
  private fromScale = 1;
  private flightT = 1;

  onLand?: (kind: 'cover' | 'leaf') => void;

  constructor(canvas: HTMLCanvasElement, tex: BookTextures, opts: { thickness: number }) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.95;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const pmrem = new THREE.PMREMGenerator(this.renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environment = env;
    this.scene.environmentIntensity = 0.14;
    this.disposables.push(env, pmrem);

    this.T = opts.thickness;
    const leafCount = tex.leaves.length;
    this.zTop = this.T / 2;
    this.zHinge = this.zTop + (leafCount + 1) * EPS + B / 2;

    this.lights();
    this.build(tex);

    this.scene.add(this.root);
    this.root.add(this.sway);
    this.sway.add(this.book);

    // Soft contact shadow + real shadows cast onto an invisible "desk".
    const contactTex = radialTexture();
    this.disposables.push(contactTex);
    this.contact = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: contactTex, transparent: true, depthWrite: false, opacity: 0.85 }),
    );
    this.contact.position.z = -this.T / 2 - B - 0.04;
    this.root.add(this.contact);

    this.shadowPlane = new THREE.Mesh(new THREE.PlaneGeometry(8, 8), new THREE.ShadowMaterial({ opacity: 0.32 }));
    this.shadowPlane.position.z = -this.T / 2 - B - 0.035;
    this.shadowPlane.receiveShadow = true;
    this.root.add(this.shadowPlane);

    this.dust = makeDust();
    this.scene.add(this.dust);

    this.items = [
      { kind: 'cover', t: 0, from: 0, to: 0, start: 0, dur: 1, animating: false, dir: 1, grabY: 0, peel: 0, peelTarget: 0 },
      ...tex.leaves.map(
        (): Item => ({ kind: 'leaf', t: 0, from: 0, to: 0, start: 0, dur: 1, animating: false, dir: 1, grabY: 0, peel: 0, peelTarget: 0 }),
      ),
    ];
    this.updateGeometry(true);
  }

  /* ---------------- Construction ---------------- */

  private lights() {
    this.scene.add(new THREE.HemisphereLight(0xfff1e0, 0x1a1410, 0.38));
    // Desk lamp: warm, from the upper left, grazing enough to model the paper curl.
    const key = new THREE.DirectionalLight(0xffe2c0, 2.3);
    key.position.set(-2.4, 2.8, 3.1);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.left = -2.4;
    key.shadow.camera.right = 2.4;
    key.shadow.camera.top = 2.4;
    key.shadow.camera.bottom = -2.4;
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.015;
    key.shadow.radius = 4;
    this.scene.add(key);
    const rim = new THREE.PointLight(0xd9894a, 5, 9, 1.6);
    rim.position.set(2.6, -1.4, 1.6);
    this.scene.add(rim);
    const fill = new THREE.PointLight(0xffd9b0, 0.6, 10, 2);
    fill.position.set(0, 1.5, 3);
    this.scene.add(fill);
  }

  private mat<T extends THREE.Material>(m: T): T {
    this.disposables.push(m);
    return m;
  }

  private build(tex: BookTextures) {
    const board = this.mat(new THREE.MeshStandardMaterial({ color: 0x17120e, roughness: 0.62 }));
    const paperSide = this.mat(new THREE.MeshStandardMaterial({ color: 0xf3ebde, roughness: 0.9 }));

    // Back board
    const backGeo = new THREE.BoxGeometry(CW, CH, B);
    this.disposables.push(backGeo);
    const backMats = [
      board,
      board,
      board,
      board,
      this.mat(new THREE.MeshStandardMaterial({ color: 0x15110e, roughness: 0.7 })), // +z: hidden under the block
      this.mat(new THREE.MeshStandardMaterial({ map: tex.back, roughness: 0.68 })),
    ];
    const back = new THREE.Mesh(backGeo, backMats);
    back.position.set(-CW / 2, 0, -this.T / 2 - B / 2);
    back.castShadow = back.receiveShadow = true;
    this.book.add(back);

    // Page block
    const blockGeo = new THREE.BoxGeometry(PW, PH, this.T);
    this.disposables.push(blockGeo);
    const edgeV = this.mat(new THREE.MeshStandardMaterial({ map: tex.edgeV, roughness: 0.92 }));
    const edgeH = this.mat(new THREE.MeshStandardMaterial({ map: tex.edgeH, roughness: 0.92 }));
    const lastPage = this.mat(new THREE.MeshStandardMaterial({ map: tex.last, roughness: 0.88 }));
    const block = new THREE.Mesh(blockGeo, [paperSide, edgeV, edgeH, edgeH, lastPage, paperSide]);
    block.position.set(-PW / 2 - 0.004, 0, 0);
    block.castShadow = block.receiveShadow = true;
    this.book.add(block);

    // Rounded spine (half cylinder bulging to +X)
    const spineGeo = new THREE.CylinderGeometry(1, 1, CH, 28, 1, true, 0, Math.PI);
    this.disposables.push(spineGeo);
    const spine = new THREE.Mesh(spineGeo, this.mat(new THREE.MeshStandardMaterial({ map: tex.spine, roughness: 0.55, side: THREE.DoubleSide })));
    spine.scale.set(0.045, 1, this.T / 2 + B);
    spine.castShadow = true;
    this.book.add(spine);

    // Front board on its hinge
    this.coverPivot.position.set(0, 0, this.zHinge);
    const coverGeo = new THREE.BoxGeometry(CW, CH, B);
    this.disposables.push(coverGeo);
    const coverMats = [
      board,
      board,
      board,
      board,
      this.mat(
        new THREE.MeshPhysicalMaterial({
          map: tex.cover,
          roughness: 0.5,
          clearcoat: 0.3,
          clearcoatRoughness: 0.4,
        }),
      ),
      this.mat(new THREE.MeshStandardMaterial({ map: tex.endpaper, roughness: 0.8 })),
    ];
    const cover = new THREE.Mesh(coverGeo, coverMats);
    cover.position.set(-CW / 2, 0, 0);
    cover.castShadow = cover.receiveShadow = true;
    this.coverPivot.add(cover);
    this.book.add(this.coverPivot);

    // Paper leaves
    tex.leaves.forEach(([front, backTex]) => {
      const geo = new THREE.PlaneGeometry(PW, PH, SEG_X, SEG_Y);
      this.disposables.push(geo);
      const flipped = backTex;
      flipped.wrapS = THREE.RepeatWrapping;
      flipped.repeat.x = -1;
      flipped.offset.x = 1;
      const fm = this.mat(new THREE.MeshStandardMaterial({ map: front, roughness: 0.86, side: THREE.FrontSide }));
      const bm = this.mat(new THREE.MeshStandardMaterial({ map: flipped, roughness: 0.86, side: THREE.BackSide }));
      const group = new THREE.Group();
      const a = new THREE.Mesh(geo, fm);
      const b = new THREE.Mesh(geo, bm);
      for (const m of [a, b]) {
        m.castShadow = m.receiveShadow = true;
        m.frustumCulled = false;
      }
      group.add(a, b);
      this.book.add(group);
      this.leafMeshes.push({ geo, group });
    });
  }

  /* ---------------- Page physics ---------------- */

  /** Bends one leaf. `t` 0..1 across the spine, `dir` the motion direction, `grabY` where it was grabbed. */
  private bendLeaf(index: number, it: Item) {
    const { geo } = this.leafMeshes[index];
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const n = this.leafMeshes.length;
    const t = Math.min(1, Math.max(0, it.t + it.peel));
    const theta = t * Math.PI;
    const amp = CURL * Math.sin(Math.PI * t) * it.dir;
    const side = 1 - 2 * smooth(t); // +1 resting left, −1 resting right
    const zL = this.zTop + (n - index) * EPS;
    const zR = this.zHinge + B / 2 + (index + 1) * EPS;
    // The root sits on the surface below so no part of the sheet sinks into it.
    const zRoot = zL + (zR - zL) * smooth(t);
    const ds = PW / SEG_X;
    const xs = new Float32Array(SEG_X + 1);
    const zs = new Float32Array(SEG_X + 1);

    for (let row = 0; row <= SEG_Y; row++) {
      const y = PH / 2 - (row / SEG_Y) * PH;
      const yn = y / (PH / 2);
      const rowFactor = 1 + 0.55 * it.grabY * yn;
      let x = 0;
      let z = zRoot;
      xs[0] = x;
      zs[0] = z;
      for (let k = 0; k < SEG_X; k++) {
        const s = (k + 0.5) * ds;
        const u = s / PW;
        const phi = theta + amp * rowFactor * Math.pow(u, 1.5) + side * BOW * Math.exp(-s / BOW_LEN);
        x -= Math.cos(phi) * ds;
        z += Math.sin(phi) * ds;
        xs[k + 1] = x;
        zs[k + 1] = z;
      }
      // Plane columns run left→right; the spine is the right-most column.
      for (let c = 0; c <= SEG_X; c++) {
        const k = SEG_X - c;
        const vi = row * (SEG_X + 1) + c;
        pos.setXYZ(vi, xs[k], y, zs[k]);
      }
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  }

  private updateGeometry(force = false) {
    const cover = this.items[0];
    const tc = Math.min(1, Math.max(0, cover.t + cover.peel));
    this.coverPivot.rotation.y = tc * Math.PI;
    // Closed: the book is centred. Open: the spread is centred on the spine.
    this.book.position.x = (CW / 2) * (1 - smooth(Math.min(1, tc * 1.15)));
    const open = smooth(Math.min(1, tc * 1.15));
    this.contact.scale.set(CW * (1.25 + open * 1.05), CH * 1.2, 1);
    this.contact.position.x = -CW / 2 + open * (CW / 2) + this.book.position.x;
    // A few hundred vertices per leaf: cheap enough to bend every frame.
    void force;
    for (let i = 1; i < this.items.length; i++) this.bendLeaf(i - 1, this.items[i]);
  }

  /* ---------------- Public controls ---------------- */

  get count() {
    return this.items.length;
  }

  /** Index of the item a forward / backward turn would move from state `state`. */
  turn(index: number, to: 0 | 1, opts: { from?: number; grabY?: number; onDone?: () => void } = {}) {
    const it = this.items[index];
    if (!it) return;
    it.from = opts.from ?? it.t;
    it.to = to;
    it.dir = to > it.from ? 1 : -1;
    if (opts.grabY !== undefined) it.grabY = opts.grabY;
    it.start = performance.now();
    const dist = Math.abs(to - it.from);
    it.dur = (it.kind === 'cover' ? 1150 : 950) * Math.max(0.35, dist);
    it.animating = true;
    it.peelTarget = 0;
    it.onDone = opts.onDone;
  }

  /** Follow the pointer while dragging (t in 0..1). */
  drag(index: number, t: number, grabY: number, dir: 1 | -1) {
    const it = this.items[index];
    if (!it) return;
    it.animating = false;
    it.t += (Math.min(1, Math.max(0, t)) - it.t) * 0.5;
    it.grabY = grabY;
    it.dir = dir;
    it.peelTarget = 0;
    this.bendLeafIfLeaf(index);
  }

  private bendLeafIfLeaf(index: number) {
    if (index > 0) this.bendLeaf(index - 1, this.items[index]);
    else this.updateGeometry();
  }

  getT(index: number) {
    return this.items[index]?.t ?? 0;
  }

  /** Lift the corner of the page under the pointer a little. */
  peel(index: number | null, grabY = -0.8) {
    this.items.forEach((it, i) => {
      it.peelTarget = i === index && !it.animating ? (it.kind === 'cover' ? 0.03 : 0.045) : 0;
      if (i === index) it.grabY = grabY;
    });
  }

  setParallax(x: number, y: number) {
    this.parallaxTarget.set(x, y);
  }

  setFocus(f: number) {
    this.focusTarget = f;
  }

  setZoom(z: number) {
    this.zoomTarget = Math.min(2.2, Math.max(0.8, z));
  }

  get zoomLevel() {
    return this.zoomTarget;
  }

  /** Screen-space x of the spine and the book's horizontal extent, for hit testing. */
  screenLayout(width: number, height: number) {
    const p = (x: number, y = 0) => {
      const v = new THREE.Vector3(x, y, this.zTop).applyMatrix4(this.book.matrixWorld).project(this.camera);
      return { x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height };
    };
    const spine = p(0);
    const left = p(-PW);
    const right = p(PW);
    const top = p(-PW / 2, PH / 2);
    const bottom = p(-PW / 2, -PH / 2);
    return { spine: spine.x, left: left.x, right: right.x, top: top.y, bottom: bottom.y };
  }

  /* ---------------- Flight (from the hero book to centre stage) ---------------- */

  /** Place the closed book where the DOM book is (screen rect) and fly it to the centre. */
  flyFrom(rect: { x: number; y: number; w: number; h: number }, viewport: { w: number; h: number }, done?: () => void) {
    this.frame(true);
    const fov = (this.camera.fov * Math.PI) / 180;
    const target = new THREE.Vector3(0, 0, 0);
    const camDist = this.camera.position.distanceTo(target);
    // Distance from the camera at which the book appears as tall as the DOM rect.
    const d = (CH * viewport.h) / (2 * Math.tan(fov / 2) * Math.max(40, rect.h));
    const ndc = new THREE.Vector3(((rect.x + rect.w / 2) / viewport.w) * 2 - 1, -(((rect.y + rect.h / 2) / viewport.h) * 2 - 1), 0.5);
    ndc.unproject(this.camera);
    const dir = ndc.sub(this.camera.position).normalize();
    this.fromPos.copy(this.camera.position).addScaledVector(dir, d);
    this.fromQuat.setFromEuler(new THREE.Euler(0.18, 0.52, -0.02));
    this.fromScale = 1;
    void camDist;
    this.flight = { from: this.root.matrix.toArray() as THREE.Matrix4Tuple, start: performance.now(), dur: 1250, reverse: false, done };
    this.flightT = 0;
    this.applyFlight(0);
  }

  /** Re-aim the return flight (the page may have scrolled while reading). */
  setOrigin(rect: { x: number; y: number; w: number; h: number }, viewport: { w: number; h: number }) {
    const fov = (this.camera.fov * Math.PI) / 180;
    const d = (CH * viewport.h) / (2 * Math.tan(fov / 2) * Math.max(40, rect.h));
    const ndc = new THREE.Vector3(((rect.x + rect.w / 2) / viewport.w) * 2 - 1, -(((rect.y + rect.h / 2) / viewport.h) * 2 - 1), 0.5);
    ndc.unproject(this.camera);
    const dir = ndc.sub(this.camera.position).normalize();
    this.fromPos.copy(this.camera.position).addScaledVector(dir, d);
  }

  /** Exit target when the hero book is no longer on screen: sink away below. */
  setOriginBelow() {
    this.fromPos.set(0, -2.6, 0.4);
    this.fromQuat.setFromEuler(new THREE.Euler(-0.5, 0.2, 0.05));
  }

  /** Enter from below the screen (used when switching volumes). */
  rise(done?: () => void) {
    this.frame(true);
    this.fromPos.set(0, -2.6, 0.4);
    this.fromQuat.setFromEuler(new THREE.Euler(-0.5, 0.2, 0.05));
    this.flight = { from: this.root.matrix.toArray() as THREE.Matrix4Tuple, start: performance.now(), dur: 1000, reverse: false, done };
    this.applyFlight(0);
  }

  /** Fly back to where the book came from. */
  flyBack(done?: () => void) {
    this.flight = { from: this.root.matrix.toArray() as THREE.Matrix4Tuple, start: performance.now(), dur: 900, reverse: true, done };
  }

  private applyFlight(k: number) {
    const e = easeInOut(k);
    this.root.position.lerpVectors(this.fromPos, new THREE.Vector3(0, 0, 0), e);
    this.root.quaternion.slerpQuaternions(this.fromQuat, new THREE.Quaternion(), e);
    this.root.scale.setScalar(this.fromScale);
  }

  /* ---------------- Loop ---------------- */

  resize(w: number, h: number) {
    this.renderer.setSize(w, h, false);
    this.aspect = w / Math.max(1, h);
    this.viewH = Math.max(1, h);
    this.insets = w < 640 ? { top: 76, bottom: 150 } : { top: 84, bottom: 110 };
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
    this.frame(true);
  }

  /** Position the camera so the open spread (or the focused page) fills the view. */
  private frame(snap = false) {
    const k = snap ? 1 : 0.08;
    this.parallax.lerp(this.parallaxTarget, snap ? 1 : 0.05);
    this.focus += (this.focusTarget - this.focus) * k;
    this.zoom += (this.zoomTarget - this.zoom) * k;
    const fov = (this.camera.fov * Math.PI) / 180;
    const tilt = 0.4; // radians the desk leans away from the reader
    // Fit inside the area between the UI bars, then nudge the target so the book sits centred in it.
    const usable = Math.max(0.35, 1 - (this.insets.top + this.insets.bottom) / this.viewH);
    const spanW = Math.abs(this.focus) > 0.5 ? PW * 1.1 : CW * 2.2;
    const spanH = CH * 1.08;
    const distH = spanH / 2 / (Math.tan(fov / 2) * usable);
    const distW = spanW / 2 / (Math.tan(fov / 2) * this.aspect);
    const dist = Math.max(distH, distW) / this.zoom;
    const tx = this.focus * (PW / 2);
    const shiftPx = (this.insets.bottom - this.insets.top) / 2;
    const ty = (shiftPx / this.viewH) * 2 * dist * Math.tan(fov / 2) * 0.92;
    this.camera.position.set(tx + this.parallax.x * 0.18, -Math.sin(tilt) * dist + this.parallax.y * 0.12 - ty, Math.cos(tilt) * dist);
    this.camera.lookAt(tx, 0.03 - ty, 0);
  }

  start() {
    const loop = (now: number) => {
      this.raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      this.tick(now, dt);
      this.renderer.render(this.scene, this.camera);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private tick(now: number, dt: number) {
    this.frame();

    if (this.flight) {
      const f = this.flight;
      const k = Math.min(1, (now - f.start) / f.dur);
      this.applyFlight(f.reverse ? 1 - k : k);
      if (k >= 1) {
        this.flight = null;
        f.done?.();
      }
    }

    // Closed and idle: float gently so it reads as a real object.
    const closed = 1 - Math.min(1, this.items[0].t * 3);
    this.sway.rotation.y = closed * 0.07 * Math.sin(now * 0.0006);
    this.sway.rotation.x = closed * 0.035 * Math.sin(now * 0.00045 + 1);
    this.sway.position.z = closed * 0.02 * Math.sin(now * 0.0008);

    for (const it of this.items) {
      if (it.animating) {
        const k = Math.min(1, (now - it.start) / it.dur);
        const e = it.kind === 'cover' && it.to === 1 ? easeBoard(k) : easeInOut(k);
        it.t = it.from + (it.to - it.from) * e;
        if (k >= 1) {
          it.t = it.to;
          it.animating = false;
          this.onLand?.(it.kind);
          const done = it.onDone;
          it.onDone = undefined;
          done?.();
        }
      }
      it.peel += (it.peelTarget - it.peel) * Math.min(1, dt * 9);
      if (it.peelTarget === 0 && it.peel < 0.0005) it.peel = 0;
    }
    this.updateGeometry();

    // Dust drifting through the lamp light.
    const p = this.dust.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let y = p.getY(i) + dt * 0.035 * (0.4 + (i % 7) / 7);
      if (y > 1.6) y = -1.6;
      p.setY(i, y);
      p.setX(i, p.getX(i) + Math.sin(now * 0.0003 + i) * dt * 0.01);
    }
    p.needsUpdate = true;
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    this.disposables.forEach((d) => d.dispose());
    this.dust.geometry.dispose();
    (this.dust.material as THREE.Material).dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
  }
}

/* ---------------- Helpers ---------------- */

function radialTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  g.addColorStop(0, 'rgba(0,0,0,0.75)');
  g.addColorStop(0.55, 'rgba(0,0,0,0.35)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function makeDust() {
  const n = 220;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 5;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 3.2;
    pos[i * 3 + 2] = Math.random() * 1.6 - 0.2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,220,180,1)');
  g.addColorStop(1, 'rgba(255,220,180,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const mat = new THREE.PointsMaterial({
    size: 0.018,
    map: new THREE.CanvasTexture(c),
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}
