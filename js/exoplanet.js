// Globals
let renderer, scene, camera, exoplanet, WIDTH, HEIGHT;
const ASTEROID_ROTATION_Y = 0.001;
const ASTEROID_ROTATION_X = 0.001;
const PLANET_RADIUS = 20;
const MOONS_COUNT = 30;
const high = 100;
const low = 50;
const min = 50;

// Helpers
const rndGray = () => {
  const r = Math.floor(Math.random() * (high - low - 1)) + min + 1;
  return `hsl(0, 1%, ${r}%)`;
};

const calcSpeed = (distance, radius, index) => {
  return Math.sin(distance + 100) / 40;
};

class Exoplanet {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.createExoplanet();
    this.createMoons();
  }

  createMoons() {
    this.moons = [];
    const geometry = new THREE.SphereBufferGeometry(1, 4, 4);
    let material;
    let mesh;
    let r;
    let prevDistance = PLANET_RADIUS * 0.3 + Math.random();
    for (let i = 0; i < MOONS_COUNT; i++) {
      r = Math.random() * 10;
      material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(rndGray()),
        roughness: 0.9,
        shading: THREE.FlatShading
      });
      mesh = new THREE.Mesh(geometry, material);
      mesh.moving = Math.random() * Math.PI;
      mesh.radius = r;
      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;

      mesh.d = Math.random() * 2 + Math.random();
      mesh.distance = mesh.d + prevDistance;

      prevDistance = mesh.distance + Math.random() + mesh.d;
      mesh.speed = calcSpeed(mesh.distance, mesh.radius, i);
      mesh.position.y = 0;
      mesh.position.x = mesh.distance * Math.cos(mesh.moving);
      mesh.position.z = mesh.distance * Math.sin(mesh.moving);
      this.moons.push(mesh);
      this.mesh.add(mesh);
    }
  }

  createExoplanet() {
    this.p = new THREE.SphereGeometry(PLANET_RADIUS, 32, 32);
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(rndGray()),
      roughness: 0.9,
      flatShading: true
    });
    var noise = 2.8;
    for (let i = 0; i < this.p.vertices.length; i++) {
      this.p.vertices[i].x += Math.random() * noise;
      this.p.vertices[i].y += Math.random() * noise;
      this.p.vertices[i].z += Math.random() * noise;
    }
    this.planet = new THREE.Mesh(this.p, this.material);
    this.planet.castShadow = true;
    this.planet.receiveShadow = true;
    this.mesh.add(this.planet);
  }

  spin() {
    let m;
    for (let index = 0; index < this.moons.length; index++) {
      m = this.moons[index];
      m.moving = m.moving + m.speed;
      m.rotation.x += 0.05;
      m.rotation.y += 0.05;
      m.rotation.z += 0.05;
      m.position.x = m.distance * Math.cos(m.moving);
      m.position.z = m.distance * Math.sin(m.moving);
    }
  }
};

// Create
const summon = () => {
  renderer.render(scene, camera);
  // Rotate the exoplanet
  exoplanet.planet.rotation.y -= ASTEROID_ROTATION_Y;
  exoplanet.planet.rotation.x -= ASTEROID_ROTATION_X;
  exoplanet.spin();
  requestAnimationFrame(summon);
};

const resize = () => {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Update the renderer and the camera
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
};

// Init
const init = () => {
  window.addEventListener('resize', resize, false);

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 150);
  camera.position.z = 130;

  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x000000, 1);

  document.body.appendChild(renderer.domElement);
  const orbit = new THREE.OrbitControls(camera, renderer.domElement);

  // Lights revisit later
  const lights = [];
  lights[0] = new THREE.PointLight(0xffffff, 1, 0);
  lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  lights[0].position.set(0, 200, 0);
  lights[1].position.set(100, 200, 100);
  lights[2].position.set(-100, -200, -100);
  scene.add(lights[0]);
  scene.add(lights[1]);
  scene.add(lights[2]);

  // Exoplanet
  exoplanet = new Exoplanet();

  scene.add(exoplanet.mesh);
  renderer.render(scene, camera);
  summon();
};

// Big bang
init();