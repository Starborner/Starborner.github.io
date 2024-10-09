import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { CSS2DObject } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/renderers/CSS2DRenderer.js";

// Información asociada a cada sphereMesh, incluyendo imágenes
const sphereInfo = {
  sphereMesh1: {
    title: 'Información de Sphere 1',
    content: 'Este es el contenido para el sphereMesh1. Aquí puedes agregar detalles específicos.',
    image: 'https://via.placeholder.com/300x200.png?text=Imagen+de+Sphere+1'
  },
  sphereMesh2: {
    title: 'Información de Sphere 2',
    content: 'Este es el contenido para el sphereMesh2. Aquí puedes poner otra descripción.',
    image: 'https://via.placeholder.com/300x200.png?text=Imagen+de+Sphere+2'
  }
};

// Función para detectar si estamos en un dispositivo móvil
function isMobile() {
  return window.innerWidth <= 767;
}

// Ajustar el layout según el dispositivo (móvil o escritorio)
function adjustLayout() {
  const infoColumn = document.getElementById('info-column');
  const isMobileDevice = isMobile();

  if (isMobileDevice) {
    infoColumn.style.width = '100%';  // Ocupa toda la pantalla en móviles
    infoColumn.style.height = '100vh';  // Limitar la altura al 100% del viewport
    infoColumn.style.overflowY = 'auto';  // Habilitar scroll vertical si el contenido es mayor
  } else {
    infoColumn.style.width = '33.33%';  // Solo un tercio de la pantalla en escritorio
    infoColumn.style.height = '100vh';
  }
}

// Crear los SphereMesh y añadirlos a la escena
export function createSpheres(scene) {
  const group = new THREE.Group();

  const sphereMesh1 = createCpointMesh('sphereMesh1', -36, 20, 34);
  const sphereMesh2 = createCpointMesh('sphereMesh2', 0, 10, 10);

  group.add(sphereMesh1);
  group.add(sphereMesh2);

  scene.add(group);

  return group;
}

// Crear un sphereMesh
function createCpointMesh(name, x, y, z) {
  const geo = new THREE.SphereBufferGeometry(2);
  const mat = new THREE.MeshBasicMaterial({ color: 0x5878B8 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, z);
  mesh.name = name;
  return mesh;
}

// Crear y gestionar el label para los puntos
export function setupLabel(scene) {
  const p = document.createElement('p');
  p.className = 'tooltip';
  const pContainer = document.createElement('div');
  pContainer.appendChild(p);

  const cPointLabel = new CSS2DObject(pContainer);
  scene.add(cPointLabel);

  return { p, cPointLabel };
}

// Actualizar la columna deslizante con el contenido dinámico, incluyendo imagen
function updateInfoColumn(name) {
  const infoTitle = document.querySelector('#info-column h2');
  const infoContent = document.querySelector('#info-column p');
  const infoImage = document.querySelector('#info-column img');

  if (sphereInfo[name]) {
    infoTitle.textContent = sphereInfo[name].title;
    infoContent.textContent = sphereInfo[name].content;
    infoImage.src = sphereInfo[name].image;
  }
}

// Configurar el raycasting y la interacción con los sphereMesh
export function setupSphereInteraction(scene, camera, group, labelElements) {
  const { p, cPointLabel } = labelElements;

  const mousePos = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();

  let isColumnOpen = false; // Estado de la columna
  const infoColumn = document.getElementById('info-column');
  const overlay = document.getElementById('overlay');
  const closeButton = document.querySelector('#info-column .close-btn');

  // Funciones para abrir y cerrar la columna
  function openInfoColumn() {
    infoColumn.classList.add('open');
    overlay.classList.add('active');
    adjustLayout(); // Asegurarse de que el layout se ajuste
    isColumnOpen = true;
  }

  function closeInfoColumn() {
    infoColumn.classList.remove('open');
    overlay.classList.remove('active');
    isColumnOpen = false;
  }

  // Unificar eventos para clic y toque
  ['click', 'touchstart'].forEach((eventName) => {
    window.addEventListener(eventName, function (event) {
      if (event.touches && event.touches.length > 0) {
        mousePos.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      } else {
        mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
        mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }

      raycaster.setFromCamera(mousePos, camera);
      const intersects = raycaster.intersectObjects(group.children);

      if (intersects.length > 0) {
        const clickedSphereName = intersects[0].object.name;
        console.log('Esfera seleccionada:', clickedSphereName);
        updateInfoColumn(clickedSphereName);

        if (!isColumnOpen) {
          openInfoColumn();
        }
      }
    });
  });

  raycaster.params.Points = { threshold: 0.1 };

  // Cerrar al hacer clic en la "X"
  closeButton.addEventListener('click', closeInfoColumn);

  // Solo permitir cierre tocando la "X" en dispositivos móviles
  if (!isMobile()) {
    overlay.addEventListener('click', closeInfoColumn);
  }

  infoColumn.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // Mover el label en función del raycaster
  window.addEventListener('mousemove', function (e) {
    mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mousePos, camera);
    const intersects = raycaster.intersectObjects(group.children);

    if (intersects.length > 0) {
      switch (intersects[0].object.name) {
        case 'sphereMesh1':
          p.className = 'tooltip show';
          cPointLabel.position.set(-36, 20.8, 34);
          p.textContent = 'PRUEBA';
          break;
        case 'sphereMesh2':
          p.className = 'tooltip show';
          cPointLabel.position.set(0, 10.8, 10);
          p.textContent = 'ENTRADA';
          break;
        default:
          break;
      }
    } else {
      p.className = 'tooltip hide';
    }
  });
}

// Escuchar cambios de tamaño y ajustar el layout
window.addEventListener('resize', adjustLayout);
window.addEventListener('load', adjustLayout);
