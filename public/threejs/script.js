import * as THREE from "three";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
// Note: TWEEN is imported via CDN in index.html and available globally

let camera, scene, renderer, labelRenderer, controls;
let currentTween = null; // To manage ongoing tweens

const sceneContainer = document.getElementById("scene-container");
const roomInfoOverlay = document.getElementById("room-info-overlay");
const roomNameElement = document.getElementById("room-name");
const roomDescriptionElement = document.getElementById("room-description");

// Texture URLs (Using placeholders from threejs examples - replace with actual URLs if needed)
const textureURLs = {
  corridorFloor: "https://threejs.org/examples/textures/hardwood2_diffuse.jpg", // Placeholder
  receptionFloor: "https://threejs.org/examples/textures/brick_diffuse.jpg", // Placeholder tile
  classroomFloor: "https://threejs.org/examples/textures/hardwood2_diffuse.jpg", // Placeholder wood
  libraryFloor: "https://threejs.org/examples/textures/carpet.jpg", // Placeholder carpet
  cafeteriaFloor: "https://threejs.org/examples/textures/brick_diffuse.jpg", // Placeholder tile
  wall: "https://threejs.org/examples/textures/wall.jpg", // Placeholder generic wall
  wood: "https://threejs.org/examples/textures/hardwood2_diffuse.jpg", // Placeholder wood
  whiteboard: null, // Will use a white material
  metal: null, // Will use a metallic material
};

const textures = {};
const textureLoader = new THREE.TextureLoader();

// Preload textures
let texturesLoaded = 0;
const totalTextures = Object.keys(textureURLs).filter(
  (key) => textureURLs[key] !== null
).length;

function checkTexturesLoaded() {
  texturesLoaded++;
  if (texturesLoaded === totalTextures) {
    console.log("All textures loaded.");
    initScene(); // Initialize scene only after textures are loaded
    animate();
  }
}

for (const key in textureURLs) {
  if (textureURLs[key]) {
    textures[key] = textureLoader.load(
      textureURLs[key],
      checkTexturesLoaded,
      undefined,
      (err) => {
        console.error(`Failed to load texture: ${key}`, err);
        checkTexturesLoaded(); // Still count it to proceed
      }
    );
    // Configure texture wrapping and repeat for floors if needed
    if (key.includes("Floor")) {
      textures[key].wrapS = THREE.RepeatWrapping;
      textures[key].wrapT = THREE.RepeatWrapping;
      textures[key].repeat.set(4, 4); // Adjust repeat values as needed
    }
  } else {
    // For null URLs, create placeholder materials later
  }
}

// Camera viewpoints [position_vec3, lookAt_vec3]
const viewpoints = {
  corridor: {
    pos: new THREE.Vector3(0, 1.7, 10),
    lookAt: new THREE.Vector3(0, 1.7, -10),
  },
  reception: {
    pos: new THREE.Vector3(-4, 1.7, 10),
    lookAt: new THREE.Vector3(-4, 1.7, 6),
  }, // Adjusted Z lookAt
  classroom: {
    pos: new THREE.Vector3(-4, 1.7, -5),
    lookAt: new THREE.Vector3(-4, 1.7, -10),
  },
  library: {
    pos: new THREE.Vector3(4, 1.7, 10),
    lookAt: new THREE.Vector3(4, 1.7, 6),
  }, // Adjusted Z lookAt
  cafeteria: {
    pos: new THREE.Vector3(4, 1.7, -5),
    lookAt: new THREE.Vector3(4, 1.7, -10),
  },
};

// Room definitions [name, description, center_x, center_z, size_x, size_z]
const roomDefs = [
  {
    name: "Reception",
    description: "Main reception area.",
    x: -5,
    z: 9.5,
    w: 6,
    d: 5,
    viewpoint: viewpoints.reception,
  },
  {
    name: "Classroom",
    description: "Lecture Hall 101.",
    x: -5,
    z: -6,
    w: 6,
    d: 6,
    viewpoint: viewpoints.classroom,
  },
  {
    name: "Library",
    description: "Quiet study area.",
    x: 5,
    z: 9.5,
    w: 6,
    d: 5,
    viewpoint: viewpoints.library,
  },
  {
    name: "Cafeteria",
    description: "Grab a coffee or snack.",
    x: 5,
    z: -6,
    w: 6,
    d: 6,
    viewpoint: viewpoints.cafeteria,
  },
];

// Add glass material for doorways
const glassMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.2,
  metalness: 0.1,
  roughness: 0.1,
});

function initScene() {
  // 1. Scene Setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xcccccc); // Light grey background
  // scene.fog = new THREE.Fog(0xcccccc, 10, 50);

  // 2. Camera Setup
  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.copy(viewpoints.corridor.pos);
  // camera.lookAt(viewpoints.corridor.lookAt); // lookAt is handled by controls target

  // 3. Renderer Setup
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  sceneContainer.appendChild(renderer.domElement);

  // CSS2D Renderer for Labels
  labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.domElement.style.position = "absolute";
  labelRenderer.domElement.style.top = "0px";
  labelRenderer.domElement.style.pointerEvents = "none";
  sceneContainer.appendChild(labelRenderer.domElement);

  // 4. Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
  directionalLight.position.set(10, 20, 5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  scene.add(directionalLight);

  // Room-specific lighting
  roomDefs.forEach((def) => {
    let pointLight;
    switch (def.name) {
      case "Reception":
        pointLight = new THREE.PointLight(0xffffff, 0.8, 15);
        pointLight.position.set(def.x, 3.5, def.z);
        scene.add(pointLight);
        break;
      case "Classroom":
        pointLight = new THREE.PointLight(0xffffff, 1.0, 15);
        pointLight.position.set(def.x, 3.5, def.z);
        scene.add(pointLight);
        const spotLight = new THREE.SpotLight(
          0xffffff,
          0.8,
          10,
          Math.PI / 6,
          0.5
        );
        spotLight.position.set(def.x, 4, def.z - def.d / 2 + 1);
        spotLight.target.position.set(def.x, 1.5, def.z - def.d / 2 + 0.1);
        scene.add(spotLight);
        scene.add(spotLight.target);
        break;
      case "Library":
        pointLight = new THREE.PointLight(0xffd700, 0.6, 15);
        pointLight.position.set(def.x, 3.5, def.z);
        scene.add(pointLight);
        const lampPositions = [
          [def.x - 2, 2, def.z],
          [def.x + 2, 2, def.z],
        ];
        lampPositions.forEach((pos) => {
          const lampLight = new THREE.PointLight(0xffd700, 0.4, 5);
          lampLight.position.set(...pos);
          scene.add(lampLight);
        });
        break;
      case "Cafeteria":
        pointLight = new THREE.PointLight(0xffd700, 0.7, 15);
        pointLight.position.set(def.x, 3.5, def.z);
        scene.add(pointLight);
        const counterLight = new THREE.PointLight(0xffffff, 0.5, 5);
        counterLight.position.set(def.x, 3, def.z - def.d / 2 + 1);
        scene.add(counterLight);
        break;
      default:
        pointLight = new THREE.PointLight(0xffffff, 0.5, 15);
        pointLight.position.set(def.x, 3.5, def.z);
        scene.add(pointLight);
    }
  });

  // --- Layout Creation ---
  const buildingGroup = new THREE.Group();
  scene.add(buildingGroup);

  const wallThickness = 0.2;
  const buildingHeight = 4;
  const corridorWidth = 4;
  const corridorLength = 25;
  const doorHeight = 2.5;
  const doorWidth = 1.5;

  // Materials
  const wallMaterial = textures.wall
    ? new THREE.MeshStandardMaterial({ map: textures.wall })
    : new THREE.MeshStandardMaterial({
        color: 0xeaeaea,
        side: THREE.DoubleSide,
      });
  const corridorFloorMaterial = textures.corridorFloor
    ? new THREE.MeshStandardMaterial({
        map: textures.corridorFloor,
        side: THREE.DoubleSide,
      })
    : new THREE.MeshStandardMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide,
      });
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide,
  });
  const woodMaterial = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const whiteboardMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
  });
  const personMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
  const shelfMaterial = woodMaterial.clone();
  const metalMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.8,
    roughness: 0.4,
  });

  // Floor (Corridor + Rooms combined initially for simplicity)
  const totalWidth =
    corridorWidth +
    2 * Math.max(...roomDefs.map((r) => r.w)) +
    2 * wallThickness; // Approximate total width
  const floorGeometry = new THREE.PlaneGeometry(totalWidth, corridorLength);
  const floor = new THREE.Mesh(floorGeometry, corridorFloorMaterial); // Use corridor texture for base
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  floor.receiveShadow = true;
  buildingGroup.add(floor);

  // Ceiling (Covers everything)
  const ceilingGeometry = new THREE.PlaneGeometry(totalWidth, corridorLength);
  const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = buildingHeight;
  buildingGroup.add(ceiling);

  // Function to create a wall segment (with potential doorway)
  function createWall(
    width,
    height,
    depth,
    x,
    y,
    z,
    hasDoorway = false,
    doorwayPos = 0
  ) {
    if (hasDoorway) {
      const wallPartWidth = (width - doorWidth) / 2;
      // Left part
      createWall(
        wallPartWidth,
        height,
        depth,
        x - doorWidth / 2 - wallPartWidth / 2,
        y,
        z
      );
      // Right part
      createWall(
        wallPartWidth,
        height,
        depth,
        x + doorWidth / 2 + wallPartWidth / 2,
        y,
        z
      );
      // Top part
      createWall(
        doorWidth,
        height - doorHeight,
        depth,
        x,
        y + doorHeight + (height - doorHeight) / 2,
        z
      );
      // Glass door
      const doorGeo = new THREE.PlaneGeometry(doorWidth, doorHeight);
      const door = new THREE.Mesh(doorGeo, glassMaterial);
      // Position depends on which wall it is. Assuming it's a wall along Z axis (like room entrance)
      door.position.set(x, y + doorHeight / 2, z);
      // If wall is along X axis, rotation would be different.
      // door.rotation.y = Math.PI / 2; // This was likely incorrect for room entrances
      buildingGroup.add(door);
    } else {
      const wallGeo = new THREE.BoxGeometry(width, height, depth);
      const wall = new THREE.Mesh(wallGeo, wallMaterial);
      wall.position.set(x, y + height / 2, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      buildingGroup.add(wall);
    }
  }

  // Corridor Walls
  createWall(
    wallThickness,
    buildingHeight,
    corridorLength,
    -corridorWidth / 2,
    0,
    0
  ); // Left
  createWall(
    wallThickness,
    buildingHeight,
    corridorLength,
    corridorWidth / 2,
    0,
    0
  ); // Right
  createWall(
    corridorWidth,
    buildingHeight,
    wallThickness,
    0,
    0,
    -corridorLength / 2
  ); // Back
  createWall(
    corridorWidth,
    buildingHeight,
    wallThickness,
    0,
    0,
    corridorLength / 2
  ); // Front (can add main door later)

  // Create Rooms
  roomDefs.forEach((def) => {
    const roomGroup = new THREE.Group();
    roomGroup.position.set(def.x, 0, def.z);
    buildingGroup.add(roomGroup);

    const roomFloorGeo = new THREE.PlaneGeometry(def.w, def.d);
    let roomFloorMat;
    switch (def.name) {
      case "Reception":
        roomFloorMat = textures.receptionFloor
          ? new THREE.MeshStandardMaterial({
              map: textures.receptionFloor,
              side: THREE.DoubleSide,
            })
          : corridorFloorMaterial;
        break;
      case "Classroom":
        roomFloorMat = textures.classroomFloor
          ? new THREE.MeshStandardMaterial({
              map: textures.classroomFloor,
              side: THREE.DoubleSide,
            })
          : corridorFloorMaterial;
        break;
      case "Library":
        roomFloorMat = textures.libraryFloor
          ? new THREE.MeshStandardMaterial({
              map: textures.libraryFloor,
              side: THREE.DoubleSide,
            })
          : corridorFloorMaterial;
        break;
      case "Cafeteria":
        roomFloorMat = textures.cafeteriaFloor
          ? new THREE.MeshStandardMaterial({
              map: textures.cafeteriaFloor,
              side: THREE.DoubleSide,
            })
          : corridorFloorMaterial;
        break;
      default:
        roomFloorMat = corridorFloorMaterial;
    }
    if (roomFloorMat.map) {
      roomFloorMat.map.wrapS = roomFloorMat.map.wrapT = THREE.RepeatWrapping;
      roomFloorMat.map.repeat.set(def.w / 2, def.d / 2); // Adjust repeat
    }
    const roomFloor = new THREE.Mesh(roomFloorGeo, roomFloorMat);
    roomFloor.rotation.x = -Math.PI / 2;
    roomFloor.position.y = 0.01; // Slightly above base floor
    roomFloor.receiveShadow = true;
    roomGroup.add(roomFloor);

    // Room Walls (relative to roomGroup origin)
    const wallY = 0;
    const isLeftSide = def.x < 0;
    // Wall facing corridor (with doorway) - position relative to room center
    const corridorWallZ = isLeftSide ? def.d / 2 : -def.d / 2; // Z position of the wall facing corridor
    createWall(
      def.w,
      buildingHeight,
      wallThickness,
      0,
      wallY,
      corridorWallZ,
      true
    );

    // Outer wall - position relative to room center
    const outerWallZ = isLeftSide ? -def.d / 2 : def.d / 2;
    createWall(def.w, buildingHeight, wallThickness, 0, wallY, outerWallZ);

    // Side walls - position relative to room center
    const sideWallX = def.w / 2;
    createWall(wallThickness, buildingHeight, def.d, -sideWallX, wallY, 0);
    createWall(wallThickness, buildingHeight, def.d, sideWallX, wallY, 0);

    // Add Label
    const labelDiv = document.createElement("div");
    labelDiv.className = "label";
    labelDiv.textContent = def.name;
    const roomLabel = new CSS2DObject(labelDiv);
    // Position label near the doorway in the corridor
    const labelX = isLeftSide
      ? -corridorWidth / 2 - 0.5
      : corridorWidth / 2 + 0.5;
    roomLabel.position.set(labelX, buildingHeight - 0.5, def.z);
    scene.add(roomLabel);

    // Add room-specific furniture
    if (def.name === "Reception") {
      const desk = createDeskWithChair(0, 0, -def.d / 2 + 1, 2, 1, 0.8);
      roomGroup.add(desk);
      const receptionist = createPerson(0, 0, -def.d / 2 + 1, 0x0000ff);
      roomGroup.add(receptionist);
      const computerGeo = new THREE.BoxGeometry(0.3, 0.2, 0.02);
      const computerMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
      const computer = new THREE.Mesh(computerGeo, computerMat);
      computer.position.set(
        0,
        desk.position.y + 0.8 / 2 + 0.1,
        -def.d / 2 + 1.1
      ); // Position on desk
      roomGroup.add(computer);
    } else if (def.name === "Classroom") {
      const teacherDesk = createDeskWithChair(
        0,
        0,
        -def.d / 2 + 1,
        1.5,
        0.8,
        0.8
      );
      roomGroup.add(teacherDesk);
      const teacher = createPerson(0, 0, -def.d / 2 + 1, 0x0000ff);
      roomGroup.add(teacher);
      const boardGeo = new THREE.PlaneGeometry(def.w * 0.7, 1.5);
      const board = new THREE.Mesh(boardGeo, whiteboardMaterial);
      board.position.set(0, 1.8, -def.d / 2 + 0.1); // Back wall
      // board.rotation.y = Math.PI; // Rotation might not be needed if wall is correct
      roomGroup.add(board);
      const rows = 3;
      const cols = 3;
      const spacing = 1.5;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const desk = createDeskWithChair(
            (j - (cols - 1) / 2) * spacing,
            0,
            -def.d / 2 + 3 + i * spacing,
            1,
            0.6,
            0.8
          );
          roomGroup.add(desk);
        }
      }
    } else if (def.name === "Library") {
      const shelfCount = 3;
      for (let i = 0; i < shelfCount; i++) {
        const shelf = createBookshelf(
          -def.w / 2 + 1 + i * 2,
          1, // Position Y adjusted to sit on floor
          -def.d / 2 + 1
        );
        roomGroup.add(shelf);
      }
      const table = createTableWithChairs(0, 0, 0);
      roomGroup.add(table);
      for (let i = 0; i < 5; i++) {
        const bookGeo = new THREE.BoxGeometry(0.2, 0.05, 0.15);
        const bookMat = new THREE.MeshStandardMaterial({
          color: [0x8b4513, 0x4b0082, 0x006400, 0x8b0000, 0x00008b][i],
        });
        const book = new THREE.Mesh(bookGeo, bookMat);
        // Position books on the table
        book.position.set(
          (Math.random() - 0.5) * 1.5, // Spread on table X
          0.7 + 0.025, // Table height + half book height
          (Math.random() - 0.5) * 0.8 // Spread on table Z
        );
        book.rotation.y = Math.random() * Math.PI;
        roomGroup.add(book);
      }
    } else if (def.name === "Cafeteria") {
      const counterGeo = new THREE.BoxGeometry(3, 1, 0.8);
      const counterMat = textures.wood
        ? new THREE.MeshStandardMaterial({ map: textures.wood })
        : woodMaterial;
      const counter = new THREE.Mesh(counterGeo, counterMat);
      counter.position.set(0, 0.5, -def.d / 2 + 1);
      roomGroup.add(counter);
      const foodItems = [
        {
          geo: new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
          color: 0x8b4513,
          pos: [-1, counter.position.y + 1 / 2 + 0.1, -def.d / 2 + 1.1],
        }, // Coffee
        {
          geo: new THREE.BoxGeometry(0.2, 0.1, 0.2),
          color: 0xffd700,
          pos: [0, counter.position.y + 1 / 2 + 0.05, -def.d / 2 + 1.1],
        }, // Sandwich
        {
          geo: new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16),
          color: 0xffffff,
          pos: [1, counter.position.y + 1 / 2 + 0.1, -def.d / 2 + 1.1],
        }, // Cup
      ];
      foodItems.forEach((item) => {
        const mesh = new THREE.Mesh(
          item.geo,
          new THREE.MeshStandardMaterial({ color: item.color })
        );
        mesh.position.set(...item.pos);
        roomGroup.add(mesh);
      });
      const tablePositions = [
        [-2, 0, 2],
        [2, 0, 2],
        [-2, 0, -2],
        [2, 0, -2],
      ];
      tablePositions.forEach((pos) => {
        const table = createTableWithChairs(pos[0], pos[1], pos[2]);
        roomGroup.add(table);
      });
    }
  });

  // --- Navigation UI Setup ---
  document
    .getElementById("btn-corridor")
    .addEventListener("click", () => moveToView(viewpoints.corridor));
  document
    .getElementById("btn-reception")
    .addEventListener("click", () =>
      moveToView(viewpoints.reception, "Reception")
    );
  document
    .getElementById("btn-classroom")
    .addEventListener("click", () =>
      moveToView(viewpoints.classroom, "Classroom")
    );
  document
    .getElementById("btn-library")
    .addEventListener("click", () => moveToView(viewpoints.library, "Library"));
  document
    .getElementById("btn-cafeteria")
    .addEventListener("click", () =>
      moveToView(viewpoints.cafeteria, "Cafeteria")
    );

  // Window Resize Handler
  window.addEventListener("resize", onWindowResize);

  // Add OrbitControls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enablePan = false; // Disable panning
  controls.enableZoom = false; // Disable zooming
  // Allow full vertical rotation for 360 view
  controls.minPolarAngle = 0; // default
  controls.maxPolarAngle = Math.PI; // default
  controls.target.copy(viewpoints.corridor.lookAt);
  controls.update(); // Initial update
}

function moveToView(viewpoint, roomName = null) {
  if (currentTween) {
    currentTween.stop(); // Stop the previous tween
    TWEEN.remove(currentTween); // Remove it from TWEEN updates
  }

  controls.enabled = false; // Disable OrbitControls during animation

  const duration = 1000; // Animation duration in ms
  const startPosition = camera.position.clone();
  const startTarget = controls.target.clone();
  const endPosition = viewpoint.pos;
  const endTarget = viewpoint.lookAt;

  // Use a single tween object to animate both position and target
  currentTween = new TWEEN.Tween({
    posX: startPosition.x,
    posY: startPosition.y,
    posZ: startPosition.z,
    targetX: startTarget.x,
    targetY: startTarget.y,
    targetZ: startTarget.z,
  })
    .to(
      {
        posX: endPosition.x,
        posY: endPosition.y,
        posZ: endPosition.z,
        targetX: endTarget.x,
        targetY: endTarget.y,
        targetZ: endTarget.z,
      },
      duration
    )
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(function (obj) {
      camera.position.set(obj.posX, obj.posY, obj.posZ);
      controls.target.set(obj.targetX, obj.targetY, obj.targetZ);
      // We need to call controls.update() here IF damping is enabled,
      // but since controls are disabled, this might not be necessary.
      // However, it's safer to update the internal state if needed.
      // controls.update(); // Let's test without this first, might cause issues
      camera.lookAt(controls.target); // Ensure camera looks at the interpolated target
    })
    .onComplete(() => {
      camera.position.copy(endPosition); // Ensure final position
      controls.target.copy(endTarget); // Ensure final target
      controls.enabled = true; // Re-enable OrbitControls
      controls.update(); // IMPORTANT: Update controls state after changing target
      currentTween = null;

      // Update room info overlay
      if (roomName) {
        const room = roomDefs.find((r) => r.name === roomName);
        if (room) {
          roomNameElement.textContent = room.name;
          roomDescriptionElement.textContent = room.description;
          roomInfoOverlay.classList.remove("hidden"); // Use classList
        }
      } else {
        roomInfoOverlay.classList.add("hidden"); // Use classList
      }
    })
    .start();
}

function onWindowResize() {
  if (!camera || !renderer || !labelRenderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update(); // Update animations

  // Only update controls if not tweening and controls are enabled
  if (!currentTween && controls && controls.enabled) {
    controls.update();
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
  if (labelRenderer && scene && camera) {
    labelRenderer.render(scene, camera);
  }
}

// Helper functions for creating furniture (assuming they exist from previous context)
// Function to create a simple person figure
function createPerson(x, y, z, color = 0x0000ff) {
  const group = new THREE.Group();
  const bodyGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.2, 16);
  const bodyMat = new THREE.MeshStandardMaterial({ color: color });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.6;
  group.add(body);
  const headGeo = new THREE.SphereGeometry(0.25, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ color: color });
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.y = 1.4;
  group.add(head);
  group.position.set(x, y, z);
  group.castShadow = true;
  return group;
}

// Function to create a desk with chair
function createDeskWithChair(x, y, z, width = 1.2, depth = 0.6, height = 0.8) {
  const group = new THREE.Group();
  const deskGeo = new THREE.BoxGeometry(width, height, depth);
  const deskMat = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : woodMaterial;
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.y = height / 2;
  group.add(desk);
  const chairSeatGeo = new THREE.BoxGeometry(0.5, 0.1, 0.5);
  const chairBackGeo = new THREE.BoxGeometry(0.5, 0.4, 0.1);
  const chairMat = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : woodMaterial;
  const chairSeat = new THREE.Mesh(chairSeatGeo, chairMat);
  chairSeat.position.set(0, 0.45, depth / 2 + 0.3); // Position chair in front of desk
  group.add(chairSeat);
  const chairBack = new THREE.Mesh(chairBackGeo, chairMat);
  chairBack.position.set(0, 0.7, depth / 2 + 0.3 + 0.05); // Position back relative to seat
  chairBack.rotation.x = -0.1; // Slight tilt back
  group.add(chairBack);
  group.position.set(x, y, z);
  group.castShadow = true;
  return group;
}

// Function to create a bookshelf
function createBookshelf(x, y, z, width = 1, height = 2, depth = 0.3) {
  const group = new THREE.Group();
  const frameGeo = new THREE.BoxGeometry(width, height, depth);
  const frameMat = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : woodMaterial;
  const frame = new THREE.Mesh(frameGeo, frameMat);
  frame.position.y = height / 2; // Center the frame vertically
  group.add(frame);
  const bookWidth = 0.15;
  const bookHeight = 0.2;
  const bookDepth = depth * 0.8; // Books slightly less deep than shelf
  const colors = [0x8b4513, 0x4b0082, 0x006400, 0x8b0000, 0x00008b];
  const shelves = 4;
  for (let shelf = 0; shelf < shelves; shelf++) {
    const shelfY = -height / 2 + (height / shelves) * (shelf + 0.5);
    const numBooks = Math.floor((width * 0.9) / bookWidth); // Fill 90% width
    for (let i = 0; i < numBooks; i++) {
      const bookGeo = new THREE.BoxGeometry(
        bookWidth * (0.8 + Math.random() * 0.2),
        bookHeight * (0.9 + Math.random() * 0.1),
        bookDepth * (0.8 + Math.random() * 0.2)
      );
      const bookMat = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
      });
      const book = new THREE.Mesh(bookGeo, bookMat);
      book.position.set(
        -width / 2 + width * 0.05 + bookWidth / 2 + i * bookWidth,
        shelfY,
        0 // Center books on shelf depth
      );
      book.rotation.y = (Math.random() - 0.5) * 0.1; // Slight random rotation
      group.add(book);
    }
  }
  group.position.set(x, y, z);
  group.castShadow = true;
  return group;
}

// Function to create a table with chairs
function createTableWithChairs(x, y, z, radius = 0.8) {
  const group = new THREE.Group();
  const tableGeo = new THREE.CylinderGeometry(radius, radius, 0.05, 32);
  const tableMat = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : woodMaterial;
  const table = new THREE.Mesh(tableGeo, tableMat);
  table.position.y = 0.7;
  group.add(table);
  const legGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.7, 16);
  const legMat = textures.wood
    ? new THREE.MeshStandardMaterial({ map: textures.wood })
    : woodMaterial;
  const leg = new THREE.Mesh(legGeo, legMat);
  leg.position.y = 0.35;
  group.add(leg);
  const chairPositions = [
    [radius + 0.3, 0, 0],
    [-radius - 0.3, 0, 0],
    [0, 0, radius + 0.3],
    [0, 0, -radius - 0.3],
  ];
  chairPositions.forEach((pos, index) => {
    const chair = createDeskWithChair(pos[0], 0, pos[2], 0.5, 0.5, 0.8);
    // Rotate chairs to face the table
    if (pos[0] !== 0) chair.rotation.y = (Math.sign(pos[0]) * -Math.PI) / 2;
    if (pos[2] !== 0 && pos[2] < 0) chair.rotation.y = Math.PI;
    group.add(chair);
  });
  group.position.set(x, y, z);
  group.castShadow = true;
  return group;
}

// Start loading textures, which will trigger initScene when done
