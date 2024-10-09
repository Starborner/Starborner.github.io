//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
//PARA QUE EL ZOOM SEA MAS BONITO
import { TrackballControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/TrackballControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//PARA FIJAR LABEL
import { CSS2DRenderer, CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

// Importar las funciones desde info.js
import { createSpheres, setupLabel, setupSphereInteraction } from './info.js';
// Importar la configuración de luces desde luces.js
import { setupLights } from './luces.js';


//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

// Global controls
let controls, controls2;

//Set which object to render
let objToRender = 'uniBio';

//-----------------------------------------------------------------------------------------------
//PARA FIJAR LABEL

// Crear los sphereMesh y añadirlos a la escena
const group = createSpheres(scene);

//PARA FIJAR LABEL
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
labelRenderer.domElement.style.pointerEvents = 'none';
document.body.appendChild(labelRenderer.domElement);

// Configurar el label para los sphereMesh
const labelElements = setupLabel(scene);

// Configurar la interacción de los sphereMesh y el raycasting
setupSphereInteraction(scene, camera, group, labelElements);

//-----------------------------------------------------------------------------------------------

// Load a .gltf file
const loader = new GLTFLoader();
loader.load(
  `models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error(error);
  }
);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

//COLOR DEL FONDO
renderer.setClearColor(0xd2ccc5, 1); // 0xd2ccc5 es el color en hexadecimal, 1 es la opacidad (1 = opaco)


document.getElementById("container3D").appendChild(renderer.domElement);

// Camera setup
camera.position.z = objToRender === "uniBio" ? 0 : 500; //para cambiar la altura
camera.position.x = objToRender === "uniBio" ? -65 : 500;
camera.position.y = objToRender === "uniBio" ? 5 : 500;


// Lights setup
// Llamamos a la función para configurar las luces
setupLights(scene);


// Camera controls setup
//PARA QUE EL MOVIMIENTO SEA MAS BONITO
if (objToRender === "uniBio") {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.12;
  //PARA QUE EL ZOOM SEA MAS BONITO
  controls.enableZoom = false;

  controls2 = new TrackballControls(camera, renderer.domElement);
  controls2.noRotate = true;
  controls2.noPan = true;
  controls2.noZoom = false;
  controls2.zoomSpeed = 1;

  //Limita la rotación vertical para no ver debajo del suelo
  controls.maxPolarAngle = Math.PI / 2
  //ni idea
  controls.listenToKeyEvents( window )

  
  // Escuchar tanto eventos táctiles como de mouse
window.addEventListener('load', () => {
  const controlsMouse = document.querySelector('.controls-mouse');
  const controlsTouch = document.querySelector('.controls-touch');

  // Detectar si es un dispositivo táctil o si la pantalla es pequeña
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;

  if (isTouchDevice || isSmallScreen) {
    controlsTouch.style.display = 'block';
    controlsMouse.style.display = 'none';
  } else {
    controlsMouse.style.display = 'block';
    controlsTouch.style.display = 'none';
  }
});

  
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  //PARA QUE EL ZOOM SEA MAS BONITO
  if (controls) {
    const target = controls.target;
    controls.update();

    if (controls2) {
      controls2.target.set(target.x, target.y, target.z);
      controls2.update();
    }

// Límite de desplazamiento vertical para no bajar por debajo del suelo (y = 0)
  if (controls.target.y < 0) {
    controls.target.y = 0;  // Mantiene la cámara por encima del suelo
  }

  }

  if (object && objToRender === "eye") {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  //renderiza la escena
  labelRenderer.render(scene, camera);
  renderer.render(scene, camera);
}

// Resize handler   //Hace que no se deforme el modelo cuando se estira la ventana
// Escucha los cambios de tamaño de pantalla para adaptarse en tiempo real
window.addEventListener('resize', () => {
  const controlsMouse = document.querySelector('.controls-mouse');
  const controlsTouch = document.querySelector('.controls-touch');

  const isSmallScreen = window.matchMedia("(max-width: 767px)").matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Ajustar la visibilidad de controles
  if (isTouchDevice || isSmallScreen) {
    controlsTouch.style.display = 'block';
    controlsMouse.style.display = 'none';
  } else {
    controlsMouse.style.display = 'block';
    controlsTouch.style.display = 'none';
  }

  // Redimensionar el canvas y ajustar la cámara
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});


// Mouse move handler for eye movement
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Start rendering
animate();

