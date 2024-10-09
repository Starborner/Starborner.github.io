// luces.js

import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";

// Función para añadir luces y sombras a la escena
export function setupLights(scene) {
  // LUZ BLANCA DEL CIELO
  const topLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
  topLight.position.set(500, 500, 500);
  topLight.castShadow = true;
  scene.add(topLight);

  // LUZ MORADA QUE SALE DEL MISMO MODELO
  const ambientLight = new THREE.AmbientLight(0x514493, 1);
  scene.add(ambientLight);

// ------------------------------------------------------------------------------------------

  // LUZ MORADA QUE ILUMINA TODO EL FRENTE
  const light = new THREE.PointLight(0x566AFF, 1, 800);
  light.position.set(0, 300, 500);
  light.castShadow = true;
  scene.add(light);

  // Propiedades de sombra de la luz principal
  light.shadow.mapSize.width = 512;
  light.shadow.mapSize.height = 512;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 500;

  // AYUDA A VER DONDE ESTÁ Y A DONDE MIRA LA LUZ (helpers)
  const helper = new THREE.CameraHelper(light.shadow.camera);
  scene.add(helper);

  // ------------------------------------------------------------------------------------------

  // LUZ AMARILLA QUE CAE EN LA CARA IZQUIERDA-ATRÁS DEL MODELO
  const light2 = new THREE.DirectionalLight(0xFF9000, 0.8);
  light2.position.set(500, 100, 0);
  light2.castShadow = true;
  scene.add(light2);

  light2.shadow.mapSize.width = 512;
  light2.shadow.mapSize.height = 512;
  light2.shadow.camera.near = 0.5;
  light2.shadow.camera.far = 500;

  const helper2 = new THREE.CameraHelper(light2.shadow.camera);
  scene.add(helper2);

  // ------------------------------------------------------------------------------------------

  // LUZ NEGRA QUE ENFOCA LA PARTE DE ABAJO DEL MODELO
  const light3 = new THREE.DirectionalLight(0x000000, 0.5);
  light3.position.set(0, 100, -500);
  light3.castShadow = true;
  scene.add(light3);

  light3.shadow.mapSize.width = 512;
  light3.shadow.mapSize.height = 512;
  light3.shadow.camera.near = 0.5;
  light3.shadow.camera.far = 500;

  const helper3 = new THREE.CameraHelper(light3.shadow.camera);
  scene.add(helper3);

  // ------------------------------------------------------------------------------------------

  // LUZ (NO DEFINIDA CLARAMENTE)
  const light4 = new THREE.DirectionalLight(0xc4c4c4, 0.5);
  light4.position.set(-500, 300, 0);
  light4.castShadow = true;
  scene.add(light4);

  light4.shadow.mapSize.width = 512;
  light4.shadow.mapSize.height = 512;
  light4.shadow.camera.near = 0.5;
  light4.shadow.camera.far = 500;

  const helper4 = new THREE.CameraHelper(light4.shadow.camera);
  scene.add(helper4);
}
