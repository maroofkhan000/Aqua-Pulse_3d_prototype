/**
 * Aqua Pulse — Industrial Water Purification & Sensor Digital Twin
 * Physical 3D Simulation, Realistic Fluid Dynamics & Sensor Telemetry Skid
 */

(function () {
  'use strict';

  // --- Scene, Camera, Renderer Setup ---
  const container = document.getElementById('scene');
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x070B0E);
  scene.fog = new THREE.FogExp2(0x070B0E, 0.024);

  const camera = new THREE.PerspectiveCamera(
    36,
    window.innerWidth / window.innerHeight,
    0.1,
    120
  );

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  // --- Lighting Setup ---
  const ambientLight = new THREE.AmbientLight(0xA0B8C8, 0.55);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0xFFFFFF, 1.25);
  mainLight.position.set(12, 18, 14);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.set(2048, 2048);
  mainLight.shadow.camera.left = -16;
  mainLight.shadow.camera.right = 16;
  mainLight.shadow.camera.top = 16;
  mainLight.shadow.camera.bottom = -16;
  mainLight.shadow.camera.near = 0.5;
  mainLight.shadow.camera.far = 45;
  mainLight.shadow.bias = -0.0003;
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x2DD4BF, 0.6);
  rimLight.position.set(-14, 10, -12);
  scene.add(rimLight);

  const fillLight = new THREE.PointLight(0xF59E0B, 0.35, 25);
  fillLight.position.set(0, 5, 8);
  scene.add(fillLight);

  // --- Floor Grid & Industrial Pedestal ---
  const floorGeo = new THREE.PlaneGeometry(80, 80);
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x0A0F14,
    roughness: 0.92,
    metalness: 0.15
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  scene.add(floor);

  const gridHelper = new THREE.GridHelper(50, 50, 0x1E293B, 0x0F1722);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // --- Interactive Camera Orbit Control ---
  let radius = 17.5;
  let theta = 0.85;
  let phi = 1.12;
  let targetRadius = radius;
  let targetTheta = theta;
  let targetPhi = phi;
  const target = new THREE.Vector3(0, 1.35, 0);
  const targetCamPos = new THREE.Vector3();

  function updateCamera() {
    camera.position.x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    camera.position.z = target.z + radius * Math.sin(phi) * Math.cos(theta);
    camera.position.y = target.y + radius * Math.cos(phi);
    camera.lookAt(target);
  }

  let dragging = false;
  let panning = false;
  let lastX = 0;
  let lastY = 0;

  renderer.domElement.addEventListener('pointerdown', function (e) {
    if (e.button === 2) {
      panning = true;
    } else {
      dragging = true;
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener('pointerup', function () {
    dragging = false;
    panning = false;
  });

  renderer.domElement.addEventListener('contextmenu', e => e.preventDefault());

  window.addEventListener('pointermove', function (e) {
    if (!dragging && !panning) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (dragging) {
      targetTheta -= dx * 0.0055;
      targetPhi = Math.min(Math.max(targetPhi - dy * 0.0055, 0.2), 1.52);
      autoRotate = false;
      updateRotateBtn();
    } else if (panning) {
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);
      target.addScaledVector(right, -dx * 0.008);
      target.addScaledVector(up, dy * 0.008);
    }
  });

  renderer.domElement.addEventListener('wheel', function (e) {
    e.preventDefault();
    targetRadius = Math.min(Math.max(targetRadius + e.deltaY * 0.012, 4.5), 32);
  }, { passive: false });

  // --- High-Fidelity Materials Library ---
  const M = {
    aluminumFrame: new THREE.MeshStandardMaterial({
      color: 0x8E9AAF,
      metalness: 0.85,
      roughness: 0.28
    }),
    steelPolish: new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.95,
      roughness: 0.15
    }),
    steelCast: new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.75,
      roughness: 0.55
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.88,
      roughness: 0.25
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xB87333,
      metalness: 0.9,
      roughness: 0.3
    }),
    darkPolymer: new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      roughness: 0.45,
      metalness: 0.2
    }),
    pipeBlue: new THREE.MeshStandardMaterial({
      color: 0x0284C7,
      roughness: 0.22,
      metalness: 0.35,
      transparent: true,
      opacity: 0.88
    }),
    pipeOrange: new THREE.MeshStandardMaterial({
      color: 0xEA580C,
      roughness: 0.3,
      metalness: 0.25
    }),
    pipeRaw: new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
      metalness: 0.4
    }),
    acrylicClear: new THREE.MeshPhysicalMaterial({
      color: 0xD8EDF8,
      metalness: 0.05,
      roughness: 0.08,
      transparent: true,
      opacity: 0.32,
      transmission: 0.75,
      ior: 1.49
    }),
    acrylicXray: new THREE.MeshPhysicalMaterial({
      color: 0x93C5FD,
      metalness: 0.0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.12,
      transmission: 0.95
    }),
    rawWater: new THREE.MeshStandardMaterial({
      color: 0x485E48,
      roughness: 0.25,
      metalness: 0.1,
      transparent: true,
      opacity: 0.72
    }),
    pureWater: new THREE.MeshStandardMaterial({
      color: 0x0EA5E9,
      roughness: 0.1,
      metalness: 0.15,
      transparent: true,
      opacity: 0.65
    }),
    sedimentCartridge: new THREE.MeshStandardMaterial({
      color: 0xB5996E,
      roughness: 0.85
    }),
    carbonBlock: new THREE.MeshStandardMaterial({
      color: 0x18181B,
      roughness: 0.9
    }),
    roMembraneSkin: new THREE.MeshStandardMaterial({
      color: 0x2563EB,
      roughness: 0.4,
      metalness: 0.3
    }),
    uvGlow: new THREE.MeshStandardMaterial({
      color: 0xC084FC,
      emissive: 0x9333EA,
      emissiveIntensity: 1.8,
      roughness: 0.1,
      metalness: 0.2
    }),
    sensorBody: new THREE.MeshStandardMaterial({
      color: 0xF8FAFC,
      roughness: 0.35
    }),
    pcbGreen: new THREE.MeshStandardMaterial({
      color: 0x064E3B,
      roughness: 0.4,
      metalness: 0.2
    }),
    chipBlack: new THREE.MeshStandardMaterial({
      color: 0x090D12,
      roughness: 0.3,
      metalness: 0.5
    }),
    gaugeFace: new THREE.MeshBasicMaterial({
      color: 0xF8FAFC
    }),
    needleRed: new THREE.MeshBasicMaterial({
      color: 0xEF4444
    }),
    ledGreen: new THREE.MeshStandardMaterial({
      color: 0x10B981,
      emissive: 0x10B981,
      emissiveIntensity: 1.5
    }),
    ledRed: new THREE.MeshStandardMaterial({
      color: 0xEF4444,
      emissive: 0xEF4444,
      emissiveIntensity: 1.8
    }),
    ledAmber: new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      emissive: 0xF59E0B,
      emissiveIntensity: 1.2
    }),
    solarCell: new THREE.MeshStandardMaterial({
      color: 0x0F172A,
      metalness: 0.8,
      roughness: 0.15
    })
  };

  // --- Scene Root and Component Registry ---
  const root = new THREE.Group();
  scene.add(root);
  const parts = [];
  const animatableGauges = [];
  const animatableValves = [];
  const animatableTurbines = [];
  let filterShells = [];

  function registerPart(group, homePos, explodeOffset, meta) {
    group.position.copy(homePos);
    group.traverse(obj => {
      if (obj.isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
        obj.userData.partId = parts.length;
      }
    });
    root.add(group);

    const partObj = {
      mesh: group,
      home: homePos.clone(),
      explode: homePos.clone().add(explodeOffset),
      name: meta.name,
      shortTag: meta.shortTag || meta.name.split('—')[0].trim(),
      labelYOffset: meta.labelYOffset !== undefined ? meta.labelYOffset : 1.6,
      hideTag: !!meta.hideTag,
      category: meta.category || 'PHYSICAL HARDWARE',
      desc: meta.desc,
      specs: meta.specs || [],
      swatchColor: meta.swatchColor || '#2DD4BF',
      focusOffset: meta.focusOffset || new THREE.Vector3(0, 0.8, 2.5)
    };
    parts.push(partObj);
    return group;
  }

  // =========================================================================
  // 1. MODULAR EXTRUDED ALUMINUM T-SLOT CHASSIS & BACKBOARD
  // =========================================================================
  (function buildSkidChassis() {
    const skidGroup = new THREE.Group();
    const skidLength = 14.8;
    const skidWidth = 3.6;
    const skidH = 0.28;

    // Heavy Structural Base Plate with Beveled Chamfer
    const basePlateGeo = new THREE.BoxGeometry(skidLength, skidH, skidWidth);
    const basePlate = new THREE.Mesh(basePlateGeo, M.steelCast);
    basePlate.position.y = skidH / 2;
    skidGroup.add(basePlate);

    // Aluminum T-Slot Perimeter Rails
    const railMat = M.aluminumFrame;
    function makeRail(w, h, d, x, y, z) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), railMat);
      rail.position.set(x, y, z);
      skidGroup.add(rail);
    }
    // Perimeter T-Slots
    makeRail(skidLength, 0.12, 0.12, 0, skidH + 0.06, -skidWidth / 2 + 0.06);
    makeRail(skidLength, 0.12, 0.12, 0, skidH + 0.06, skidWidth / 2 - 0.06);
    makeRail(0.12, 0.12, skidWidth, -skidLength / 2 + 0.06, skidH + 0.06, 0);
    makeRail(0.12, 0.12, skidWidth, skidLength / 2 - 0.06, skidH + 0.06, 0);

    // Upright Stanchions & Rear Equipment Backboard
    const uprightH = 3.2;
    const uprightXPositions = [-5.5, -1.8, 1.8, 5.5];
    uprightXPositions.forEach(x => {
      const col = new THREE.Mesh(new THREE.BoxGeometry(0.14, uprightH, 0.14), railMat);
      col.position.set(x, skidH + uprightH / 2, -1.1);
      skidGroup.add(col);
    });

    const topHeader = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.14, 0.14), railMat);
    topHeader.position.set(0, skidH + uprightH, -1.1);
    skidGroup.add(topHeader);

    // Instrument Backplate Mounting Board (Textured Polycarbonate/Aluminum)
    const backplate = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 2.6, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x0F1722, roughness: 0.6, metalness: 0.3 })
    );
    backplate.position.set(0, skidH + 1.6, -1.1);
    skidGroup.add(backplate);

    // 6x Anti-Vibration Heavy-Duty Leveling Feet
    const footPositions = [
      [-6.8, -1.5], [0, -1.5], [6.8, -1.5],
      [-6.8, 1.5], [0, 1.5], [6.8, 1.5]
    ];
    footPositions.forEach(([fx, fz]) => {
      const footStem = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 12), M.steelPolish);
      footStem.position.set(fx, 0.1, fz);
      const footPad = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.08, 16), M.darkPolymer);
      footPad.position.set(fx, 0.04, fz);
      skidGroup.add(footStem, footPad);
    });

    registerPart(skidGroup, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -0.4, 0), {
      name: 'Skid Chassis Frame',
      shortTag: 'Skid Frame',
      hideTag: true,
      category: 'STRUCTURAL',
      desc: 'Modular aluminum T-slot frame with anti-vibration leveling mounts.',
      specs: [
        { k: 'Material', v: '6061-T6 Anodized Aluminum' },
        { k: 'Load Rating', v: '450 kg static capacity' }
      ],
      swatchColor: '#8E9AAF'
    });
  })();

  const skidBaseY = 0.28;

  // =========================================================================
  // 2. RAW WATER STORAGE & AGITATION VESSEL
  // =========================================================================
  (function buildRawWaterTank() {
    const group = new THREE.Group();
    const tankR = 0.85;
    const tankH = 2.4;

    // Translucent High-Density Polyethylene Drum
    const tankShell = new THREE.Mesh(
      new THREE.CylinderGeometry(tankR, tankR, tankH, 32, 1, true),
      M.acrylicClear
    );
    tankShell.position.y = tankH / 2;

    // Top Dome & Inspection Hatch
    const topDome = new THREE.Mesh(
      new THREE.SphereGeometry(tankR, 32, 16, 0, Math.PI * 2, 0, Math.PI / 3),
      M.steelPolish
    );
    topDome.position.y = tankH;
    const hatch = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.28, 0.12, 20), M.darkPolymer);
    hatch.position.y = tankH + 0.35;

    // Base Rim Support Ring
    const baseRim = new THREE.Mesh(new THREE.CylinderGeometry(tankR + 0.04, tankR + 0.06, 0.18, 32), M.steelCast);
    baseRim.position.y = 0.09;

    // Murky Untreated Water Body
    const waterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(tankR * 0.94, tankR * 0.94, tankH * 0.72, 32),
      M.rawWater
    );
    waterMesh.position.y = (tankH * 0.72) / 2 + 0.05;

    // Transparent Sight Gauge Column on Exterior
    const sightTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, tankH * 0.8, 12), M.acrylicClear);
    sightTube.position.set(tankR + 0.06, tankH * 0.5, 0);
    const sightFluid = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, tankH * 0.72, 12), M.rawWater);
    sightFluid.position.set(tankR + 0.06, (tankH * 0.72) / 2 + 0.05, 0);

    // Outlet Bulkhead Fitting & Ball Valve
    const outletFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.25, 12), M.brass);
    outletFitting.rotation.z = Math.PI / 2;
    outletFitting.position.set(tankR + 0.12, 0.35, 0);

    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.14), M.brass);
    valveBody.position.set(tankR + 0.28, 0.35, 0);

    const valveHandle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, 0.06), M.needleRed);
    valveHandle.position.set(tankR + 0.28, 0.44, 0);

    group.add(tankShell, topDome, hatch, baseRim, waterMesh, sightTube, sightFluid, outletFitting, valveBody, valveHandle);

    registerPart(group, new THREE.Vector3(-6.2, skidBaseY, 0), new THREE.Vector3(-1.8, 0, 0), {
      name: '1. Raw Water Tank',
      shortTag: '1. Raw Tank',
      labelYOffset: 2.7,
      category: 'HYDRAULICS',
      desc: 'Stores untreated feed water with visual level sight column.',
      specs: [
        { k: 'Capacity', v: '120 Liters (HDPE Drum)' },
        { k: 'Isolation', v: '1" NPT Brass Ball Valve' }
      ],
      swatchColor: '#38A3A5'
    });
  })();

  // =========================================================================
  // 3. INDUSTRIAL ROTARY DIAPHRAGM BOOSTER PUMP
  // =========================================================================
  let pumpMotorMesh;
  (function buildBoosterPump() {
    const group = new THREE.Group();

    // Motor Body with Cooling Fins
    const motorGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.95, 24);
    const motor = new THREE.Mesh(motorGeo, M.steelCast);
    motor.rotation.z = Math.PI / 2;
    motor.position.set(0, 0.45, 0);
    pumpMotorMesh = motor;

    // Cooling Fan Cowl & Grille
    const fanCowl = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.2, 24), M.darkPolymer);
    fanCowl.rotation.z = Math.PI / 2;
    fanCowl.position.set(-0.55, 0.45, 0);

    // Diaphragm Pump Head (Cast Aluminum/POM)
    const pumpHead = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.65, 0.65), M.aluminumFrame);
    pumpHead.position.set(0.55, 0.45, 0);

    // Inlet and Outlet Quick-Connect 90° Elbows
    const elbowIn = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.05, 8, 16, Math.PI / 2), M.brass);
    elbowIn.position.set(0.65, 0.32, -0.22);
    elbowIn.rotation.x = Math.PI;

    const elbowOut = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.05, 8, 16, Math.PI / 2), M.brass);
    elbowOut.position.set(0.65, 0.58, 0.22);

    // Electrical Terminal Box on Top
    const termBox = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.24), M.darkPolymer);
    termBox.position.set(0, 0.88, 0);

    // Base Mounting Bracket with 4x Rubber Isolation Grommets
    const mountPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.06, 0.65), M.steelCast);
    mountPlate.position.y = 0.03;
    group.add(mountPlate);

    [[-0.45, -0.25], [0.45, -0.25], [-0.45, 0.25], [0.45, 0.25]].forEach(([gx, gz]) => {
      const grommet = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.08, 12), M.darkPolymer);
      grommet.position.set(gx, 0.04, gz);
      group.add(grommet);
    });

    // In-Line Bourdon-Tube Feed Pressure Gauge
    const gaugeStem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.22, 12), M.brass);
    gaugeStem.position.set(0.65, 0.82, 0.22);
    const gaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24), M.steelPolish);
    gaugeBody.rotation.x = Math.PI / 2;
    gaugeBody.position.set(0.65, 0.98, 0.22);
    const gaugeDial = new THREE.Mesh(new THREE.CircleGeometry(0.19, 24), M.gaugeFace);
    gaugeDial.position.set(0.65, 0.98, 0.265);

    const needle = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 0.14), M.needleRed);
    needle.geometry.translate(0, 0.06, 0);
    needle.position.set(0.65, 0.98, 0.27);
    animatableGauges.push({ needle, baseAngle: 0.8, type: 'feed' });

    group.add(motor, fanCowl, pumpHead, elbowIn, elbowOut, termBox, gaugeStem, gaugeBody, gaugeDial, needle);

    registerPart(group, new THREE.Vector3(-4.6, skidBaseY, -0.3), new THREE.Vector3(-1.0, 0, -0.8), {
      name: '2. Booster Pump',
      shortTag: '2. Booster Pump',
      labelYOffset: 1.25,
      category: 'HYDRAULICS',
      desc: 'Pressurizes water to 70 PSI for reverse osmosis membrane flux.',
      specs: [
        { k: 'Boost Pressure', v: '70 PSI (~4.8 bar)' },
        { k: 'Electrical', v: '24V DC / 1.8A (45W)' }
      ],
      swatchColor: '#E8A03C'
    });
  })();

  // =========================================================================
  // 4. REAL-TIME PRE-FILTRATION SENSOR FLOW CELL MANIFOLD
  // =========================================================================
  (function buildSensorManifold() {
    const group = new THREE.Group();

    // Transparent CNC-Machined Acrylic Flow-Through Chamber
    const manifoldBlock = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 0.45, 0.55),
      M.acrylicClear
    );
    manifoldBlock.position.y = 0.48;
    group.add(manifoldBlock);

    // Internal Water Path Core Cylinder (Visible inside block)
    const fluidCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 1.4, 16),
      M.rawWater
    );
    fluidCore.rotation.z = Math.PI / 2;
    fluidCore.position.y = 0.48;
    group.add(fluidCore);

    // --- SENSOR 1: Industrial Optical Turbidity Sensor Head ---
    const turbCol = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.45, 16), M.sensorBody);
    turbCol.position.set(-0.48, 0.85, 0);
    const turbNut = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 6), M.steelPolish);
    turbNut.position.set(-0.48, 0.72, 0);
    const turbCable = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.35, 8), M.darkPolymer);
    turbCable.position.set(-0.48, 1.15, 0);
    const turbEmitterGlow = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), M.ledAmber);
    turbEmitterGlow.position.set(-0.48, 0.48, 0);
    group.add(turbCol, turbNut, turbCable, turbEmitterGlow);

    // --- SENSOR 2: Industrial Glass-Bulb pH Electrode ---
    const phBody = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.55, 16), M.sensorBody);
    phBody.position.set(-0.16, 0.9, 0);
    const phGlassBulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), M.acrylicClear);
    phGlassBulb.position.set(-0.16, 0.5, 0);
    const phBncCap = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.15, 12), M.brass);
    phBncCap.position.set(-0.16, 1.22, 0);
    const phWire = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 8), M.pipeBlue);
    phWire.position.set(-0.16, 1.4, 0);
    group.add(phBody, phGlassBulb, phBncCap, phWire);

    // --- SENSOR 3: 4-Electrode Platinum TDS / EC Conductivity Probe ---
    const tdsBody = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.42, 16), M.sensorBody);
    tdsBody.position.set(0.16, 0.85, 0);
    const tdsNut = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.07, 6), M.steelPolish);
    tdsNut.position.set(0.16, 0.72, 0);
    // 2x Platinum electrode pins extending into fluid core
    [-0.03, 0.03].forEach(pz => {
      const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.16, 8), M.steelPolish);
      pin.position.set(0.16, 0.52, pz);
      group.add(pin);
    });
    group.add(tdsBody, tdsNut);

    // --- SENSOR 4: Digital Hall-Effect Turbine Flow Meter ---
    const flowMeterHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.28, 16), M.acrylicClear);
    flowMeterHousing.rotation.x = Math.PI / 2;
    flowMeterHousing.position.set(0.48, 0.48, 0);

    const turbineRotor = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 0.06, 6),
      M.needleRed
    );
    turbineRotor.rotation.x = Math.PI / 2;
    turbineRotor.position.set(0.48, 0.48, 0);
    animatableTurbines.push(turbineRotor);

    const hallSensorCap = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.16), M.darkPolymer);
    hallSensorCap.position.set(0.48, 0.76, 0);

    group.add(flowMeterHousing, turbineRotor, hallSensorCap);

    // Sensor Bracket Clamping to Skid Backboard
    const bracket = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.25), M.aluminumFrame);
    bracket.position.set(0, 0.22, 0);
    group.add(bracket);

    registerPart(group, new THREE.Vector3(-3.2, skidBaseY, 0.1), new THREE.Vector3(-0.6, 0, 0.7), {
      name: '3. Sensor Flow Cell',
      shortTag: '3. Sensor Flow Cell',
      labelYOffset: 1.6,
      category: 'SENSING',
      desc: 'In-line analytical cell measuring raw turbidity, TDS, and pH.',
      specs: [
        { k: 'Sensors', v: 'Turbidity (IR), TDS, pH' },
        { k: 'Flow Meter', v: 'Hall-Effect Turbine (450 p/L)' }
      ],
      swatchColor: '#2DD4BF'
    });
  })();

  // =========================================================================
  // 5. STAGE 1 — 5-MICRON SPUN POLYPROPYLENE SEDIMENT FILTER
  // =========================================================================
  (function buildSedimentFilter() {
    const group = new THREE.Group();
    const filterH = 2.2;
    const filterR = 0.44;

    // Heavy-Duty Polypropylene Filter Head
    const head = new THREE.Mesh(new THREE.CylinderGeometry(filterR + 0.06, filterR + 0.06, 0.35, 24), M.steelCast);
    head.position.y = filterH;

    // Red Pressure Relief Button on Head
    const reliefBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), M.needleRed);
    reliefBtn.position.set(0, filterH + 0.21, 0);

    // Clear Ribbed Polycarbonate Sump Bowl
    const bowlGeo = new THREE.CylinderGeometry(filterR, filterR * 0.9, filterH - 0.35, 24);
    const bowl = new THREE.Mesh(bowlGeo, M.acrylicClear);
    bowl.position.y = (filterH - 0.35) / 2;
    filterShells.push(bowl);

    // Internal 5-Micron Spun Polypropylene Cartridge (Visible through bowl)
    const cartridge = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, filterH - 0.48, 20),
      M.sedimentCartridge
    );
    cartridge.position.y = (filterH - 0.35) / 2;

    // Cartridge End-Caps (White FDA silicone gaskets)
    const capTop = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20), M.sensorBody);
    capTop.position.y = filterH - 0.38;
    const capBtm = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.06, 20), M.sensorBody);
    capBtm.position.y = 0.08;

    group.add(head, reliefBtn, bowl, cartridge, capTop, capBtm);

    registerPart(group, new THREE.Vector3(-1.7, skidBaseY, 0), new THREE.Vector3(0, 0, 0.9), {
      name: '4. Sediment Filter (5μm)',
      shortTag: '4. Sediment (5μm)',
      labelYOffset: 2.5,
      category: 'FILTRATION',
      desc: 'Traps suspended silt, rust, and particulates above 5 microns.',
      specs: [
        { k: 'Pore Rating', v: '5 Micron Melt-Blown PP' },
        { k: 'Retention', v: '>98% suspended solids' }
      ],
      swatchColor: '#C2A878'
    });
  })();

  // =========================================================================
  // 6. STAGE 2 — EXTRUDED ACTIVATED CARBON BLOCK (CTO) FILTER
  // =========================================================================
  (function buildCarbonFilter() {
    const group = new THREE.Group();
    const filterH = 2.2;
    const filterR = 0.44;

    const head = new THREE.Mesh(new THREE.CylinderGeometry(filterR + 0.06, filterR + 0.06, 0.35, 24), M.steelCast);
    head.position.y = filterH;

    const reliefBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), M.needleRed);
    reliefBtn.position.set(0, filterH + 0.21, 0);

    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(filterR, filterR * 0.9, filterH - 0.35, 24),
      M.acrylicClear
    );
    bowl.position.y = (filterH - 0.35) / 2;
    filterShells.push(bowl);

    // Dense Extruded Carbon Block Core
    const carbonCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, filterH - 0.48, 20),
      M.carbonBlock
    );
    carbonCore.position.y = (filterH - 0.35) / 2;

    // Outer Polyethylene Protective Netting
    const netCyl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.245, 0.245, filterH - 0.46, 20),
      new THREE.MeshStandardMaterial({ color: 0xE2E8F0, wireframe: true, transparent: true, opacity: 0.3 })
    );
    netCyl.position.y = (filterH - 0.35) / 2;

    group.add(head, reliefBtn, bowl, carbonCore, netCyl);

    registerPart(group, new THREE.Vector3(-0.3, skidBaseY, 0), new THREE.Vector3(0.4, 0, 0.9), {
      name: '5. Carbon Block Filter',
      shortTag: '5. Carbon Block',
      labelYOffset: 1.75,
      category: 'FILTRATION',
      desc: 'Adsorbs residual chlorine, organic chemicals, and odor compounds.',
      specs: [
        { k: 'Filter Media', v: 'High-Iodine Coconut CTO' },
        { k: 'Chlorine Removal', v: '>99.5% efficiency' }
      ],
      swatchColor: '#1E293B'
    });
  })();

  // =========================================================================
  // 7. STAGE 3 — HIGH-PRESSURE REVERSE OSMOSIS (RO) VESSEL & BRINE LINE
  // =========================================================================
  (function buildROMembrane() {
    const group = new THREE.Group();
    const vesselH = 2.4;
    const vesselR = 0.48;

    // Reinforced Industrial FRP Pressure Vessel Tube
    const vessel = new THREE.Mesh(
      new THREE.CylinderGeometry(vesselR, vesselR, vesselH, 28),
      M.roMembraneSkin
    );
    vessel.position.y = vesselH / 2;

    // Machined 316 Stainless Steel End Caps with Retaining Bands
    const topCap = new THREE.Mesh(new THREE.CylinderGeometry(vesselR + 0.04, vesselR + 0.04, 0.18, 28), M.steelPolish);
    topCap.position.y = vesselH;
    const btmCap = new THREE.Mesh(new THREE.CylinderGeometry(vesselR + 0.04, vesselR + 0.04, 0.18, 28), M.steelPolish);
    btmCap.position.y = 0.09;

    // Stainless Clamp Straps Securing Vessel to Skid Frame
    const strapTop = new THREE.Mesh(new THREE.TorusGeometry(vesselR + 0.02, 0.03, 8, 28), M.steelPolish);
    strapTop.rotation.x = Math.PI / 2;
    strapTop.position.y = vesselH * 0.75;

    const strapBtm = new THREE.Mesh(new THREE.TorusGeometry(vesselR + 0.02, 0.03, 8, 28), M.steelPolish);
    strapBtm.rotation.x = Math.PI / 2;
    strapBtm.position.y = vesselH * 0.25;

    // Top Permeate (Pure Water) Port
    const permeatePort = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.2, 12), M.steelPolish);
    permeatePort.position.set(0, vesselH + 0.18, 0);

    // Bottom Brine Reject (Concentrate Waste) Port & Flow Restrictor Tube
    const brinePort = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.18, 12), M.brass);
    brinePort.position.set(0.24, 0.15, 0.18);
    brinePort.rotation.z = Math.PI / 4;

    const flowRestrictorValve = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.1), M.pipeOrange);
    flowRestrictorValve.position.set(0.38, 0.1, 0.28);

    // High-Pressure Bourdon Pressure Gauge mounted on RO Feed line
    const roGaugeStem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.2, 12), M.brass);
    roGaugeStem.position.set(-vesselR - 0.12, vesselH * 0.8, 0);
    const roGaugeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.07, 24), M.steelPolish);
    roGaugeBody.rotation.x = Math.PI / 2;
    roGaugeBody.position.set(-vesselR - 0.12, vesselH * 0.8 + 0.14, 0);
    const roGaugeDial = new THREE.Mesh(new THREE.CircleGeometry(0.15, 24), M.gaugeFace);
    roGaugeDial.position.set(-vesselR - 0.12, vesselH * 0.8 + 0.14, 0.038);

    const roNeedle = new THREE.Mesh(new THREE.PlaneGeometry(0.018, 0.11), M.needleRed);
    roNeedle.geometry.translate(0, 0.05, 0);
    roNeedle.position.set(-vesselR - 0.12, vesselH * 0.8 + 0.14, 0.042);
    animatableGauges.push({ needle: roNeedle, baseAngle: 1.4, type: 'ro' });

    group.add(vessel, topCap, btmCap, strapTop, strapBtm, permeatePort, brinePort, flowRestrictorValve, roGaugeStem, roGaugeBody, roGaugeDial, roNeedle);

    registerPart(group, new THREE.Vector3(1.1, skidBaseY, 0), new THREE.Vector3(0.8, 0, 0.9), {
      name: '6. RO Membrane Vessel',
      shortTag: '6. RO Membrane',
      labelYOffset: 2.75,
      category: 'FILTRATION',
      desc: 'Hyper-filtration membrane removing dissolved salts and heavy metals.',
      specs: [
        { k: 'Membrane Spec', v: '0.0001μm Polyamide TFC' },
        { k: 'Salt Rejection', v: '>95% TDS reduction' }
      ],
      swatchColor: '#2563EB'
    });
  })();

  // =========================================================================
  // 8. STAGE 4 — STAINLESS STEEL UV-C STERILIZATION REACTOR
  // =========================================================================
  let uvGlowMesh;
  (function buildUVDisinfection() {
    const group = new THREE.Group();
    const uvH = 2.3;
    const uvR = 0.38;

    // Polished 316L Surgical Stainless Steel Reactor Cylinder
    const uvBody = new THREE.Mesh(
      new THREE.CylinderGeometry(uvR, uvR, uvH, 28),
      M.steelPolish
    );
    uvBody.position.y = uvH / 2;

    // Quartz Inspection Sight Viewport (Emits glowing purple/violet UV light)
    const quartzWindowRing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.12, 20), M.brass);
    quartzWindowRing.rotation.x = Math.PI / 2;
    quartzWindowRing.position.set(0, uvH / 2, uvR + 0.04);

    const quartzGlow = new THREE.Mesh(new THREE.CircleGeometry(0.12, 20), M.uvGlow);
    quartzGlow.position.set(0, uvH / 2, uvR + 0.105);
    uvGlowMesh = quartzGlow;

    // Dynamic Violet Point Light inside Quartz Window
    const uvLight = new THREE.PointLight(0x9333EA, 1.4, 4.5);
    uvLight.position.set(0, uvH / 2, uvR + 0.3);
    group.add(uvLight);

    // Anodized Aluminum End Gland Nuts
    const topGland = new THREE.Mesh(new THREE.CylinderGeometry(uvR + 0.04, uvR + 0.04, 0.16, 24), M.steelPolish);
    topGland.position.y = uvH;
    const btmGland = new THREE.Mesh(new THREE.CylinderGeometry(uvR + 0.04, uvR + 0.04, 0.16, 24), M.steelPolish);
    btmGland.position.y = 0.08;

    // Waterproof UV-C Lamp Socket with High-Voltage Cable
    const lampCap = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 16), M.darkPolymer);
    lampCap.position.y = uvH + 0.15;
    const lampWire = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4, 8), M.pipeOrange);
    lampWire.position.set(0, uvH + 0.35, 0);

    group.add(uvBody, quartzWindowRing, quartzGlow, topGland, btmGland, lampCap, lampWire);

    registerPart(group, new THREE.Vector3(2.5, skidBaseY, 0), new THREE.Vector3(1.2, 0, 0.9), {
      name: '7. UV-C Sterilizer',
      shortTag: '7. UV Reactor',
      labelYOffset: 1.8,
      category: 'STERILIZATION',
      desc: 'Germicidal 254nm ultraviolet chamber neutralizing bacteria and viruses.',
      specs: [
        { k: 'Wavelength', v: '253.7 nm UV-C Germicidal' },
        { k: 'Disinfection', v: '99.99% Pathogen Inactivation' }
      ],
      swatchColor: '#9333EA'
    });
  })();

  // =========================================================================
  // 9. POST-FILTRATION QUALITY CELL & 3-WAY SOLENOID REJECT ACTUATOR
  // =========================================================================
  let solenoidValveMesh;
  let alarmBeaconLight;
  let alarmInnerCoreMesh;
  let solenoidLedMesh;
  (function buildActuatorsAndPostSensors() {
    const group = new THREE.Group();

    // Secondary Post-Treatment Purity Verification Sensor Block
    const postCell = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.38, 0.45), M.acrylicClear);
    postCell.position.set(-0.5, 0.42, 0);
    group.add(postCell);

    // Output TDS Probe (Pure water confirmation)
    const outTds = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.35, 12), M.sensorBody);
    outTds.position.set(-0.5, 0.72, 0);
    group.add(outTds);

    // Forged Brass 3-Way Automated Solenoid Divert Valve
    const valveBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.32), M.brass);
    valveBody.position.set(0.2, 0.42, 0);

    // Valve Skid Mounting Stanchion / Bracket
    const valveBracket = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.08), M.steelPolish);
    valveBracket.position.set(0.2, 0.14, -0.16);

    // Solenoid Coil Cylinder with DIN 43650 Connector
    const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.38, 16), M.darkPolymer);
    coil.position.set(0.2, 0.75, 0);
    solenoidValveMesh = coil;

    const dinConnector = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.16), M.darkPolymer);
    dinConnector.position.set(0.2, 0.88, 0.14);

    // Transparent Clear Inspection Window on DIN Plug
    const dinWindow = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.04), M.acrylicClear);
    dinWindow.position.set(0.2, 0.94, 0.22);

    // Solenoid Status Indicator LED on DIN plug (Switches dynamically: Green = OK, Red = Alert)
    solenoidLedMesh = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 10), M.ledGreen);
    solenoidLedMesh.position.set(0.2, 0.94, 0.21);

    // Safety Divert Drain Tube (Red/Orange down into skid drain channel)
    const divertTube = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.42, 12), M.pipeOrange);
    divertTube.position.set(0.2, 0.15, 0);

    const divertFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.1, 12), M.brass);
    divertFitting.position.set(0.2, 0.28, 0);

    // Plumbing connections
    const inletFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 12), M.brass);
    inletFitting.rotation.z = Math.PI / 2;
    inletFitting.position.set(-0.02, 0.42, 0);

    const outletFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.14, 12), M.brass);
    outletFitting.rotation.z = Math.PI / 2;
    outletFitting.position.set(0.42, 0.42, 0);

    // Industrial Audio-Visual Alarm Tower & Flashing Strobe Beacon
    // 1. Stainless Steel Rigidity Riser Pole (mounted to valve manifold and chassis)
    const alarmPole = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.72, 16), M.steelPolish);
    alarmPole.position.set(0.2, 0.92, -0.32);

    // 2. Heavy-Duty Cross-Bracing Support Arm
    const alarmClamp = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.28), M.steelPolish);
    alarmClamp.position.set(0.2, 0.62, -0.16);

    // 3. Flange Collar
    const alarmFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.03, 16), M.darkPolymer);
    alarmFlange.position.set(0.2, 1.28, -0.32);

    // 4. Acoustic 95dB Siren / Horn Sounder Base
    const alarmBase = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.11, 0.14, 20), M.darkPolymer);
    alarmBase.position.set(0.2, 1.36, -0.32);

    const sounderGrille = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.094, 0.04, 20), M.steelPolish);
    sounderGrille.position.set(0.2, 1.34, -0.32);

    // 5. Crystal-Clear Optical Strobe Dome (Transparent acrylic lens: looks completely clear in normal mode)
    const alarmDome = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.20, 20), M.acrylicClear);
    alarmDome.position.set(0.2, 1.50, -0.32);

    // 6. High-Intensity Internal LED/Xenon Strobe Emitter Core (lights up dynamically on alarm)
    const alarmCoreMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      emissive: 0x000000,
      emissiveIntensity: 0,
      roughness: 0.25,
      metalness: 0.8
    });
    alarmInnerCoreMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.15, 16), alarmCoreMat);
    alarmInnerCoreMesh.position.set(0.2, 1.50, -0.32);

    // 7. Ruggedized Weatherproof Cap
    const alarmCap = new THREE.Mesh(new THREE.CylinderGeometry(0.086, 0.086, 0.03, 20), M.darkPolymer);
    alarmCap.position.set(0.2, 1.61, -0.32);

    // 8. Dynamic Strobe PointLight
    alarmBeaconLight = new THREE.PointLight(0xEF4444, 0, 5, 2);
    alarmBeaconLight.position.set(0.2, 1.50, -0.2);

    group.add(
      postCell, outTds, valveBody, valveBracket, coil, dinConnector, dinWindow,
      solenoidLedMesh, divertTube, divertFitting, inletFitting, outletFitting,
      alarmPole, alarmClamp, alarmFlange, alarmBase, sounderGrille,
      alarmDome, alarmInnerCoreMesh, alarmCap, alarmBeaconLight
    );

    registerPart(group, new THREE.Vector3(3.9, skidBaseY, 0), new THREE.Vector3(1.5, 0, -0.6), {
      name: '8. Fail-Safe Safety Gate',
      shortTag: '8. Safety Gate',
      labelYOffset: 1.35,
      category: 'SAFETY',
      desc: 'Auto-diverts off-spec water to reject if WHO limits are violated.',
      specs: [
        { k: 'Valve Type', v: '3-Way Solenoid (<45ms)' },
        { k: 'Trip Limit', v: 'TDS > 100 ppm / Turb > 1.0' },
        { k: 'Gate State', v: 'PRODUCT (NORMAL)' }
      ],
      swatchColor: '#EF4444'
    });
  })();

  // =========================================================================
  // 10. PRODUCT RESERVOIR & POTABLE DISPENSING STATION
  // =========================================================================
  let waterStreamMesh;
  (function buildProductTank() {
    const group = new THREE.Group();
    const beakerR = 0.55;
    const beakerH = 1.4;

    // Laboratory-Grade Graduated Borosilicate Glass Reservoir
    const beaker = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR, beakerR * 0.95, beakerH, 28, 1, true),
      M.acrylicClear
    );
    beaker.position.y = beakerH / 2;

    // Base Support Ring
    const btm = new THREE.Mesh(new THREE.CylinderGeometry(beakerR * 0.95, beakerR * 0.95, 0.06, 28), M.acrylicClear);
    btm.position.y = 0.03;

    // Purified Crystal-Clear Potable Water
    const pureWaterMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(beakerR * 0.94, beakerR * 0.9, beakerH * 0.78, 28),
      M.pureWater
    );
    pureWaterMesh.position.y = (beakerH * 0.78) / 2 + 0.04;

    // Chrome Swan-Neck Faucet Tap
    const faucetCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0, 1.6, 0),
      new THREE.Vector3(0.3, 1.85, 0),
      new THREE.Vector3(0.55, 1.65, 0)
    ]);
    const faucetGeo = new THREE.TubeGeometry(faucetCurve, 24, 0.04, 12, false);
    const faucet = new THREE.Mesh(faucetGeo, M.steelPolish);
    faucet.position.set(-0.4, 0, -0.6);

    // Falling Water Droplet/Stream from Tap
    const streamGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.5, 8);
    waterStreamMesh = new THREE.Mesh(streamGeo, M.pureWater);
    waterStreamMesh.position.set(0.15, 1.4, -0.6);

    group.add(beaker, btm, pureWaterMesh, faucet, waterStreamMesh);

    registerPart(group, new THREE.Vector3(5.4, skidBaseY, 0), new THREE.Vector3(1.8, 0, 0), {
      name: '9. Clean Product Tank',
      shortTag: '9. Product Tank',
      labelYOffset: 2.1,
      category: 'STORAGE',
      desc: 'Stores certified potable water with swan-neck dispensing tap.',
      specs: [
        { k: 'Water Quality', v: 'WHO & BIS IS 10500 Potable' },
        { k: 'Buffer Tank', v: '15 Liter Clean Water' }
      ],
      swatchColor: '#0EA5E9'
    });
  })();

  // =========================================================================
  // 11. ESP32-S3 EMBEDDED SCADA CONTROLLER & TELEMETRY UNIT
  // =========================================================================
  let esp32Canvas, esp32Texture, esp32ScreenMesh;
  (function buildControllerSkid() {
    const group = new THREE.Group();

    // IP66 Industrial Enclosure Base
    const encBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.35), M.darkPolymer);
    encBase.position.set(0, 1.8, -1.05);

    // Transparent Polycarbonate Hinged Cover
    const encDoor = new THREE.Mesh(new THREE.BoxGeometry(1.54, 1.14, 0.05), M.acrylicClear);
    encDoor.position.set(0, 1.8, -0.86);

    // Internal DIN Rail
    const dinRail = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 0.02), M.steelPolish);
    dinRail.position.set(0, 1.8, -0.98);

    // FR4 Green Microcontroller PCB
    const pcb = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.04), M.pcbGreen);
    pcb.position.set(0, 1.8, -0.95);

    // ESP32-S3 Microcontroller Module with Metal RF Shield Can
    const esp32SoC = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.06), M.steelPolish);
    esp32SoC.position.set(-0.35, 1.85, -0.92);

    // Dual 10A Solid-State Relays (Pump & Solenoid Drivers)
    const relay1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.12), M.chipBlack);
    relay1.position.set(0.35, 1.95, -0.9);
    const relay2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.3, 0.12), M.chipBlack);
    relay2.position.set(0.35, 1.6, -0.9);

    // Dynamic Mini OLED Telemetry Display on Panel
    esp32Canvas = document.createElement('canvas');
    esp32Canvas.width = 256;
    esp32Canvas.height = 128;
    esp32Texture = new THREE.CanvasTexture(esp32Canvas);
    const screenMat = new THREE.MeshBasicMaterial({ map: esp32Texture });
    esp32ScreenMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.24), screenMat);
    esp32ScreenMesh.position.set(-0.32, 1.55, -0.91);

    // Terminal Screw Blocks & Wiring Glands
    const termBlock = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.1, 0.08), M.brass);
    termBlock.position.set(0, 1.35, -0.95);

    // 4x Status Indicator LEDs (Power, WiFi, Pump, Alarm)
    const ledMat = [M.ledGreen, M.ledGreen, M.ledAmber, M.ledRed];
    [-0.45, -0.3, -0.15, 0].forEach((lx, i) => {
      const led = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), ledMat[i]);
      led.position.set(lx, 2.1, -0.92);
      group.add(led);
    });

    group.add(encBase, encDoor, dinRail, pcb, esp32SoC, relay1, relay2, esp32ScreenMesh, termBlock);

    registerPart(group, new THREE.Vector3(-2.6, 0, 0), new THREE.Vector3(-0.5, 0.4, -0.8), {
      name: 'ESP32-S3 IoT Brain',
      shortTag: 'ESP32 Brain',
      labelYOffset: 2.45,
      category: 'CONTROL',
      desc: 'Dual-core microcontroller running 100Hz safety interlocks and WiFi telemetry.',
      specs: [
        { k: 'Processor', v: 'ESP32-S3 Dual-Core @ 240MHz' },
        { k: 'Interlock Speed', v: '<45 ms autonomous trip' }
      ],
      swatchColor: '#10B981'
    });
  })();

  // Update ESP32 Mini OLED Canvas Texture
  function updateEsp32Screen(turb, tds, ph, state) {
    if (!esp32Canvas) return;
    const ctx = esp32Canvas.getContext('2d');
    ctx.fillStyle = '#050D14';
    ctx.fillRect(0, 0, 256, 128);

    // OLED Header
    ctx.fillStyle = '#2DD4BF';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('AQUA PULSE OS v2.4', 12, 22);

    ctx.strokeStyle = '#1E293B';
    ctx.beginPath();
    ctx.moveTo(10, 28);
    ctx.lineTo(246, 28);
    ctx.stroke();

    // Telemetry Lines
    ctx.fillStyle = '#E2E8F0';
    ctx.font = '13px monospace';
    ctx.fillText(`TURB: ${turb.toFixed(1)} NTU`, 14, 50);
    ctx.fillText(`TDS : ${Math.round(tds)} ppm`, 14, 70);
    ctx.fillText(`pH  : ${ph.toFixed(2)}`, 14, 90);

    // Status Footer
    if (state === 'NORMAL') {
      ctx.fillStyle = '#10B981';
      ctx.fillText('[PURIFYING - OK]', 14, 115);
    } else if (state === 'ALARM') {
      ctx.fillStyle = '#EF4444';
      ctx.fillText('! REJECT DIVERTER ACTIVE !', 14, 115);
    } else {
      ctx.fillStyle = '#F59E0B';
      ctx.fillText('[STANDBY]', 14, 115);
    }

    esp32Texture.needsUpdate = true;
  }

  // =========================================================================
  // 12. PHOTOVOLTAIC SOLAR & BATTERY BACKUP MODULE
  // =========================================================================
  (function buildSolarBackup() {
    const group = new THREE.Group();

    // Telescopic Aluminum Mast Post
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 2.2, 16), M.steelPolish);
    mast.position.y = 1.1;

    // 100W Monocrystalline PV Panel
    const panelFrame = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.06, 1.2), M.aluminumFrame);
    panelFrame.position.set(0, 2.2, 0);
    panelFrame.rotation.x = -0.42;

    const cells = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.02, 1.1), M.solarCell);
    cells.position.set(0, 2.23, 0);
    cells.rotation.x = -0.42;

    // Sealed Deep-Cycle LiFePO4 Battery Enclosure at Base
    const batteryBox = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.45, 0.45), M.darkPolymer);
    batteryBox.position.set(0, 0.25, 0);

    // Heavy Brass Battery Terminals
    const term1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 8), M.needleRed);
    term1.position.set(-0.25, 0.5, 0);
    const term2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 8), M.chipBlack);
    term2.position.set(0.25, 0.5, 0);

    group.add(mast, panelFrame, cells, batteryBox, term1, term2);

    registerPart(group, new THREE.Vector3(-6.2, skidBaseY, 1.45), new THREE.Vector3(-1.5, 0, 1.2), {
      name: 'Solar & LiFePO4 Power',
      shortTag: 'Solar / Battery',
      labelYOffset: 2.6,
      category: 'POWER',
      desc: 'Off-grid MPPT solar charging and 24V battery backup for rural sites.',
      specs: [
        { k: 'PV Array', v: '100W Monocrystalline' },
        { k: 'Battery Pack', v: '24V 20Ah LiFePO4 (480 Wh)' }
      ],
      swatchColor: '#0F172A'
    });
  })();

  // =========================================================================
  // 13. CONTINUOUS PHYSICALLY ROUTED 3D PIPELINE NETWORK
  // =========================================================================
  // High-precision coordinates through all skid ports
  const mainPipePoints = [
    new THREE.Vector3(-5.15, skidBaseY + 0.35, 0),       // Raw tank outlet
    new THREE.Vector3(-4.95, skidBaseY + 0.35, 0),       // Raw elbow
    new THREE.Vector3(-4.95, skidBaseY + 0.32, -0.4),    // Pump inlet elbow
    new THREE.Vector3(-3.95, skidBaseY + 0.45, -0.2),    // Pump outlet
    new THREE.Vector3(-3.95, skidBaseY + 0.48, 0.1),     // To Sensor block
    new THREE.Vector3(-2.5, skidBaseY + 0.48, 0.1),      // Through Sensor block
    new THREE.Vector3(-2.15, skidBaseY + 1.2, 0.1),      // Up to Sediment Filter
    new THREE.Vector3(-1.7, skidBaseY + 2.05, 0),        // Sediment inlet head
    new THREE.Vector3(-1.7, skidBaseY + 1.5, 0),         // Through Sediment
    new THREE.Vector3(-1.0, skidBaseY + 1.5, 0),         // Cross to Carbon
    new THREE.Vector3(-0.3, skidBaseY + 2.05, 0),        // Carbon inlet head
    new THREE.Vector3(-0.3, skidBaseY + 1.5, 0),         // Through Carbon
    new THREE.Vector3(0.4, skidBaseY + 1.5, 0),          // Cross to RO
    new THREE.Vector3(1.1, skidBaseY + 1.8, 0),          // RO Membrane Feed
    new THREE.Vector3(1.1, skidBaseY + 2.45, 0),         // Permeate port top
    new THREE.Vector3(1.8, skidBaseY + 2.45, 0),         // Cross to UV
    new THREE.Vector3(2.5, skidBaseY + 2.3, 0),          // UV Reactor Top
    new THREE.Vector3(2.5, skidBaseY + 0.42, 0),         // UV Reactor Outlet
    new THREE.Vector3(3.4, skidBaseY + 0.42, 0),         // Post Sensor Inflow
    new THREE.Vector3(4.1, skidBaseY + 0.42, 0),         // Solenoid Port
    new THREE.Vector3(4.8, skidBaseY + 0.42, 0),         // Output line to beaker
    new THREE.Vector3(5.3, skidBaseY + 0.95, 0)          // Product Tap Inlet
  ];

  const mainPipeCurve = new THREE.CatmullRomCurve3(mainPipePoints, false, 'centripetal', 0.15);
  const mainPipeGeo = new THREE.TubeGeometry(mainPipeCurve, 200, 0.052, 12, false);
  const mainPipeMesh = new THREE.Mesh(mainPipeGeo, M.pipeBlue);
  root.add(mainPipeMesh);

  // Dedicated RO Brine / Waste Reject Pipeline (Distinct Orange Line to Drain)
  const rejectPipePoints = [
    new THREE.Vector3(1.34, skidBaseY + 0.15, 0.18),    // RO Brine port
    new THREE.Vector3(1.7, skidBaseY + 0.1, 0.25),      // Flow restrictor
    new THREE.Vector3(2.8, skidBaseY + 0.08, 0.25),     // Drain channel runner
    new THREE.Vector3(4.1, skidBaseY + 0.15, 0),        // Connected to Solenoid Dump
    new THREE.Vector3(4.8, skidBaseY + 0.05, 0.2)       // Final Waste Outfall
  ];
  const rejectPipeCurve = new THREE.CatmullRomCurve3(rejectPipePoints, false, 'centripetal', 0.1);
  const rejectPipeGeo = new THREE.TubeGeometry(rejectPipeCurve, 60, 0.038, 10, false);
  const rejectPipeMesh = new THREE.Mesh(rejectPipeGeo, M.pipeOrange);
  root.add(rejectPipeMesh);

  // =========================================================================
  // 14. PHYSICS-BASED FLUID DYNAMICS & PARTICLE FLOW SYSTEM
  // =========================================================================
  const NUM_PARTICLES = 180;
  const particlePositions = new Float32Array(NUM_PARTICLES * 3);
  const particleColors = new Float32Array(NUM_PARTICLES * 3);
  const particleT = new Float32Array(NUM_PARTICLES);

  // Initialize particles along curve with spacing
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particleT[i] = i / NUM_PARTICLES;
    const pt = mainPipeCurve.getPointAt(particleT[i]);
    particlePositions[i * 3] = pt.x;
    particlePositions[i * 3 + 1] = pt.y;
    particlePositions[i * 3 + 2] = pt.z;

    particleColors[i * 3] = 0.2;
    particleColors[i * 3 + 1] = 0.8;
    particleColors[i * 3 + 2] = 0.9;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.14,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  root.add(particleSystem);

  // Secondary Particle Stream for Reject Drain
  const NUM_REJECT_PARTICLES = 50;
  const rejPositions = new Float32Array(NUM_REJECT_PARTICLES * 3);
  const rejT = new Float32Array(NUM_REJECT_PARTICLES);
  for (let i = 0; i < NUM_REJECT_PARTICLES; i++) {
    rejT[i] = i / NUM_REJECT_PARTICLES;
  }
  const rejGeo = new THREE.BufferGeometry();
  rejGeo.setAttribute('position', new THREE.BufferAttribute(rejPositions, 3));
  const rejMat = new THREE.PointsMaterial({
    size: 0.12,
    color: 0xEA580C,
    transparent: true,
    opacity: 0.85
  });
  const rejParticleSystem = new THREE.Points(rejGeo, rejMat);
  root.add(rejParticleSystem);

  // =========================================================================
  // 15. DYNAMIC SCADA TELEMETRY & CONTAMINATION SIMULATOR STATE
  // =========================================================================
  const Sim = {
    pumpActive: true,
    flowRate: 2.45,        // L/min (normal 2.40 - 2.50)
    feedPressure: 24.5,    // PSI (normal 24.0 - 25.0)
    roPressure: 71.5,      // PSI (normal 70.0 - 73.0)
    waterTemp: 23.8,       // °C (stable 23.7 - 23.9)
    uvIntensity: 99.2,     // % (98.8 - 99.5)

    // Water Quality Inflow (Raw municipal / surface feed)
    rawTurbidity: 21.4,    // NTU (normal 20.5 - 22.5 NTU)
    rawTDS: 385,           // ppm (normal 380 - 390 ppm)
    rawPH: 6.92,           // normal 6.88 - 6.96

    // Water Quality Effluent (WHO / BIS IS 10500 Potable Permeate)
    cleanTurbidity: 0.08,  // NTU (ideal drinking water < 0.10 NTU)
    cleanTDS: 28.5,        // ppm (sweet-spot mineralized RO, >92% rejection)
    cleanPH: 7.42,         // ideal slightly alkaline drinking pH

    // Safety Interlock
    contaminantSpike: false,
    solenoidDiverting: false,
    alarmStrobeTime: 0,
    particlesVisible: true,
    xrayEnabled: false,
    exploded: false
  };

  // DOM Elements for Telemetry Display
  const elRawTurb = document.getElementById('val-raw-turbidity');
  const elRawTds = document.getElementById('val-raw-tds');
  const elRawPh = document.getElementById('val-raw-ph');
  const elFeedPres = document.getElementById('val-feed-pressure');
  const elFlowRate = document.getElementById('val-flow-rate');
  const elRoPres = document.getElementById('val-ro-pressure');
  const elTemp = document.getElementById('val-temp');
  const elUvFlux = document.getElementById('val-uv-flux');
  const elCleanTurb = document.getElementById('val-clean-turbidity');
  const elCleanTds = document.getElementById('val-clean-tds');
  const elCleanPh = document.getElementById('val-clean-ph');
  const elSolenoid = document.getElementById('val-solenoid-state');
  const elStatusPill = document.getElementById('system-status-pill');
  const elStatusDot = document.getElementById('status-dot');
  const elStatusLabel = document.getElementById('status-label');

  function updateTelemetryUI() {
    if (!elRawTurb) return;

    // Format Telemetry Readouts
    elRawTurb.textContent = Sim.rawTurbidity.toFixed(1);
    elRawTds.innerHTML = `${Math.round(Sim.rawTDS)} <small>ppm</small>`;
    elRawPh.textContent = Sim.rawPH.toFixed(2);
    elFeedPres.innerHTML = `${Sim.feedPressure.toFixed(1)} <small>PSI</small>`;

    if (elFlowRate) elFlowRate.innerHTML = `${Sim.flowRate.toFixed(2)} <small>L/min</small>`;
    if (elRoPres) elRoPres.innerHTML = `${Sim.roPressure.toFixed(1)} <small>PSI</small>`;
    if (elTemp) elTemp.innerHTML = `${Sim.waterTemp.toFixed(1)} <small>°C</small>`;
    if (elUvFlux) elUvFlux.innerHTML = `${Sim.uvIntensity.toFixed(1)} <small>%</small>`;

    if (elCleanTurb) elCleanTurb.textContent = `${Sim.cleanTurbidity.toFixed(2)} NTU`;
    if (elCleanTds) elCleanTds.innerHTML = `${Sim.cleanTDS.toFixed(1)} <small>ppm</small>`;
    if (elCleanPh) elCleanPh.textContent = Sim.cleanPH.toFixed(2);

    if (Sim.solenoidDiverting) {
      elSolenoid.textContent = 'REJECT DIVERTER (ACTIVE)';
      elSolenoid.className = 'metric-val bad';

      elStatusPill.className = 'status-pill alarm';
      elStatusDot.className = 'status-dot red';
      elStatusLabel.textContent = 'ALARM: CONTAMINANT SPIKE DETECTED';
    } else if (!Sim.pumpActive) {
      elSolenoid.textContent = 'STANDBY (CLOSED)';
      elSolenoid.className = 'metric-val';

      elStatusPill.className = 'status-pill';
      elStatusDot.className = 'status-dot';
      elStatusLabel.textContent = 'SYSTEM STANDBY • PUMP OFF';
    } else {
      elSolenoid.textContent = 'PRODUCT (OPEN)';
      elSolenoid.className = 'metric-val good';

      elStatusPill.className = 'status-pill';
      elStatusDot.className = 'status-dot';
      elStatusLabel.textContent = 'SYSTEM ONLINE • PURIFYING';
    }
  }

  // =========================================================================
  // 16. INTERACTIVE CONTROLS & EVENT LISTENERS
  // =========================================================================
  // Toggle Booster Pump
  const btnTogglePump = document.getElementById('btn-toggle-pump');
  const pumpBtnText = document.getElementById('pump-btn-text');
  btnTogglePump.addEventListener('click', () => {
    Sim.pumpActive = !Sim.pumpActive;
    pumpBtnText.textContent = Sim.pumpActive ? 'Pump: Active' : 'Pump: Stopped';
    btnTogglePump.classList.toggle('primary', Sim.pumpActive);
    if (!Sim.pumpActive && Sim.contaminantSpike) {
      // Clear spike if stopped
      Sim.contaminantSpike = false;
      Sim.solenoidDiverting = false;
    }
  });

  // Centralized Safety Alert & Diverter Interlock Controller
  const btnContaminant = document.getElementById('btn-inject-contaminant');
  function toggleSafetyAlert() {
    Sim.contaminantSpike = !Sim.contaminantSpike;
    if (Sim.contaminantSpike) {
      Sim.rawTurbidity = 185.0;
      Sim.rawTDS = 1260;
      Sim.rawPH = 5.55;
      Sim.cleanTurbidity = 1.62; // Breached threshold > 1.0 NTU
      Sim.cleanTDS = 134.0;      // Breached threshold > 100 ppm
      Sim.cleanPH = 6.18;
      Sim.solenoidDiverting = true;
    } else {
      Sim.rawTurbidity = 21.4;
      Sim.rawTDS = 385;
      Sim.rawPH = 6.92;
      Sim.cleanTurbidity = 0.08;
      Sim.cleanTDS = 28.5;
      Sim.cleanPH = 7.42;
      Sim.solenoidDiverting = false;
    }
    updateSafetyAlertUI();
  }

  function updateSafetyAlertUI() {
    if (btnContaminant) {
      btnContaminant.classList.toggle('active', Sim.contaminantSpike);
      btnContaminant.innerHTML = Sim.contaminantSpike
        ? '<span class="btn-icon">🚨</span><span id="contaminant-btn-text">Reset Safety Alert (Normal)</span>'
        : '<span class="btn-icon">⚠️</span><span id="contaminant-btn-text">Test Safety Alert</span>';
    }

    // Refresh detail panel specs if Safety Gate is active
    if (activeSelectedPart === 8) {
      selectPart(8);
    }

    updateTelemetryUI();
  }

  if (btnContaminant) {
    btnContaminant.addEventListener('click', toggleSafetyAlert);
  }

  // X-Ray Filter Housing Transparency
  const btnXray = document.getElementById('btn-xray');
  const xrayText = document.getElementById('xray-text');
  btnXray.addEventListener('click', () => {
    Sim.xrayEnabled = !Sim.xrayEnabled;
    xrayText.textContent = Sim.xrayEnabled ? 'Shells: X-Ray (Clear)' : 'Shells: Solid';
    btnXray.classList.toggle('active', Sim.xrayEnabled);

    filterShells.forEach(mesh => {
      mesh.material = Sim.xrayEnabled ? M.acrylicXray : M.acrylicClear;
    });
  });

  // Toggle Flow Particles Visibility
  const btnParticles = document.getElementById('btn-flow-particles');
  const particlesText = document.getElementById('particles-text');
  btnParticles.addEventListener('click', () => {
    Sim.particlesVisible = !Sim.particlesVisible;
    particlesText.textContent = Sim.particlesVisible ? 'Flow: Visible' : 'Flow: Hidden';
    btnParticles.classList.toggle('active', Sim.particlesVisible);
    particleSystem.visible = Sim.particlesVisible;
    rejParticleSystem.visible = Sim.particlesVisible;
  });

  // Exploded View CAD Animation
  const btnExplode = document.getElementById('btnExplode');
  btnExplode.addEventListener('click', () => {
    Sim.exploded = !Sim.exploded;
    btnExplode.classList.toggle('active', Sim.exploded);
    btnExplode.textContent = Sim.exploded ? 'Assembled View' : 'Exploded View';
  });

  // Auto-Rotate
  let autoRotate = false;
  const btnRotate = document.getElementById('btnRotate');
  function updateRotateBtn() {
    btnRotate.classList.toggle('active', autoRotate);
  }
  btnRotate.addEventListener('click', () => {
    autoRotate = !autoRotate;
    updateRotateBtn();
  });

  // 3D Callout Labels Toggle
  let labelsOn = true;
  const btnLabels = document.getElementById('btnLabels');
  btnLabels.addEventListener('click', () => {
    labelsOn = !labelsOn;
    btnLabels.textContent = `3D Labels: ${labelsOn ? 'On' : 'Off'}`;
    btnLabels.classList.toggle('active', labelsOn);
    labelEls.forEach(el => {
      el.style.display = labelsOn ? 'block' : 'none';
    });
  });

  // Toggle Context Text Panels & Data Overlays (Hide / Show HUD)
  let panelsVisible = true;
  const btnTogglePanels = document.getElementById('btnTogglePanels');
  const panelsBtnText = document.getElementById('panels-btn-text');
  const btnHeaderHud = document.getElementById('btn-header-hud');
  const headerHudLabel = document.getElementById('header-hud-label');

  function toggleContextPanels() {
    panelsVisible = !panelsVisible;
    document.body.classList.toggle('hide-context-panels', !panelsVisible);

    const btnText = panelsVisible ? 'Hide Panels' : 'Show Panels';
    const headerText = panelsVisible ? 'Hide Panels' : 'Show Panels';
    const icon = panelsVisible ? '👁️' : '👁️‍🗨️';

    if (panelsBtnText) panelsBtnText.textContent = btnText;
    if (btnTogglePanels) {
      btnTogglePanels.classList.toggle('active', !panelsVisible);
      const iconEl = btnTogglePanels.querySelector('.btn-icon');
      if (iconEl) iconEl.textContent = icon;
    }

    if (headerHudLabel) headerHudLabel.textContent = headerText;
    if (btnHeaderHud) {
      btnHeaderHud.classList.toggle('active', !panelsVisible);
      const iconEl = btnHeaderHud.querySelector('.hud-icon');
      if (iconEl) iconEl.textContent = icon;
    }
  }

  if (btnTogglePanels) btnTogglePanels.addEventListener('click', toggleContextPanels);
  if (btnHeaderHud) btnHeaderHud.addEventListener('click', toggleContextPanels);

  // Keyboard shortcut 'H' to toggle panels
  window.addEventListener('keydown', e => {
    if ((e.key === 'h' || e.key === 'H') && !e.ctrlKey && !e.altKey && !e.metaKey) {
      if (document.activeElement && ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
      toggleContextPanels();
    }
  });

  // Reset Camera View
  document.getElementById('btnReset').addEventListener('click', () => {
    targetRadius = 17.5;
    targetTheta = 0.85;
    targetPhi = 1.12;
    target.set(0, 1.35, 0);
    autoRotate = false;
    updateRotateBtn();
  });

  // Camera Presets
  const presetMap = {
    iso: { r: 17.5, theta: 0.85, phi: 1.12, target: new THREE.Vector3(0, 1.35, 0) },
    sensors: { r: 6.5, theta: 0.45, phi: 1.25, target: new THREE.Vector3(-3.2, 0.8, 0.1) },
    filters: { r: 9.0, theta: 0.15, phi: 1.2, target: new THREE.Vector3(0.3, 1.4, 0) },
    safety: { r: 5.6, theta: 0.70, phi: 1.25, target: new THREE.Vector3(3.9, 0.85, -0.1) },
    controller: { r: 5.5, theta: -0.2, phi: 1.35, target: new THREE.Vector3(-2.6, 1.8, -0.9) },
    top: { r: 18.0, theta: 0, phi: 0.05, target: new THREE.Vector3(0, 1.0, 0) }
  };

  document.querySelectorAll('.view-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const p = presetMap[btn.dataset.preset];
      if (p) {
        targetRadius = p.r;
        targetTheta = p.theta;
        targetPhi = p.phi;
        target.copy(p.target);
        autoRotate = false;
        updateRotateBtn();
      }
    });
  });

  // =========================================================================
  // 17. COMPONENT LEGEND & TECHNICAL SPECIFICATIONS DRAWER
  // =========================================================================
  const legendRows = document.getElementById('legend-rows');
  const detailEl = document.getElementById('detail');
  const detailTitle = document.getElementById('detail-title');
  const detailDesc = document.getElementById('detail-desc');
  const detailCat = document.getElementById('detail-category');
  const detailSpecs = document.getElementById('detail-specs');
  let activeSelectedPart = null;

  document.getElementById('parts-count').textContent = `${parts.length} Modules`;

  parts.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'legend-row';

    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = p.swatchColor;
    swatch.style.color = p.swatchColor;

    const label = document.createElement('span');
    label.textContent = p.name;

    row.appendChild(swatch);
    row.appendChild(label);

    row.addEventListener('click', () => selectPart(idx));
    legendRows.appendChild(row);
  });

  function selectPart(idx) {
    activeSelectedPart = idx;
    const p = parts[idx];

    // Highlight selected row in legend
    document.querySelectorAll('.legend-row').forEach((r, i) => {
      r.classList.toggle('selected', i === idx);
    });

    // Update active state in flow path guide
    document.querySelectorAll('.flow-path-guide .path-node').forEach(node => {
      const modIdx = parseInt(node.getAttribute('data-module'), 10);
      node.classList.toggle('active', modIdx === idx);
    });

    detailEl.classList.remove('empty');
    detailCat.textContent = p.category;
    detailTitle.textContent = p.name;
    detailDesc.textContent = p.desc;

    // Update dynamic gate state if Safety Gate
    if (idx === 8) {
      const gateSpec = p.specs.find(s => s.k === 'Gate State');
      if (gateSpec) {
        gateSpec.v = Sim.solenoidDiverting ? 'REJECT DIVERTER (ACTIVE)' : 'PRODUCT (NORMAL)';
      }
    }

    // Render Specs Table
    let tableHtml = '<table class="spec-table">';
    p.specs.forEach(s => {
      tableHtml += `<tr><td class="spec-label">${s.k}</td><td class="spec-val">${s.v}</td></tr>`;
    });
    tableHtml += '</table>';

    // Interactive Safety Alert Action directly on the Safety Gate specs panel
    if (idx === 8) {
      tableHtml += `
        <div class="safety-detail-action-card">
          <div class="safety-detail-status">
            <span class="safety-dot ${Sim.solenoidDiverting ? 'alarm' : 'normal'}"></span>
            <span class="safety-status-text">${Sim.solenoidDiverting ? 'SAFETY INTERLOCK TRIGGERED' : 'SAFETY GATE CLEAR (NORMAL FLOW)'}</span>
          </div>
          <button id="btn-toggle-safety-gate" class="safety-gate-btn ${Sim.solenoidDiverting ? 'alarm' : ''}">
            <span class="btn-icon">${Sim.solenoidDiverting ? '🚨' : '⚠️'}</span>
            <span>${Sim.solenoidDiverting ? 'Reset Safety Gate (Clear Alert)' : 'Test Safety Divert'}</span>
          </button>
        </div>
      `;
    }

    detailSpecs.innerHTML = tableHtml;

    if (idx === 8) {
      const btnSafetyToggle = document.getElementById('btn-toggle-safety-gate');
      if (btnSafetyToggle) {
        btnSafetyToggle.addEventListener('click', toggleSafetyAlert);
      }
    }

    // Smoothly focus camera on component
    const worldPos = new THREE.Vector3();
    p.mesh.getWorldPosition(worldPos);
    target.copy(worldPos);
    targetRadius = Math.min(targetRadius, 10.0);
  }

  // Interactive Flow Path Guide Navigation
  document.querySelectorAll('.flow-path-guide .path-node').forEach(node => {
    node.addEventListener('click', () => {
      const modIdx = parseInt(node.getAttribute('data-module'), 10);
      if (!isNaN(modIdx) && modIdx < parts.length) {
        selectPart(modIdx);
      }
    });
  });

  document.getElementById('close-detail').addEventListener('click', () => {
    detailEl.classList.add('empty');
    detailCat.textContent = 'COMPONENT SPECS';
    detailTitle.textContent = 'Select Any Component';
    detailDesc.textContent = 'Click any 3D part or module to view key specs.';
    detailSpecs.innerHTML = '';
    document.querySelectorAll('.legend-row').forEach(r => r.classList.remove('selected'));
  });

  // Raycaster for 3D Click Selection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('click', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    for (let i = 0; i < parts.length; i++) {
      const hits = raycaster.intersectObject(parts[i].mesh, true);
      if (hits.length) {
        selectPart(i);
        break;
      }
    }
  });

  // 3D Screen-Space Callout Labels
  const labelEls = parts.map((p, i) => {
    const el = document.createElement('div');
    el.className = 'tag';
    el.textContent = p.shortTag;
    el.addEventListener('click', () => selectPart(i));
    document.body.appendChild(el);
    return el;
  });

  function updateLabels() {
    if (!labelsOn) return;
    const v = new THREE.Vector3();

    parts.forEach((p, i) => {
      if (p.hideTag) {
        labelEls[i].style.display = 'none';
        return;
      }

      p.mesh.getWorldPosition(v);
      v.y += p.labelYOffset;

      const proj = v.clone().project(camera);
      if (proj.z > 1 || proj.z < -1) {
        labelEls[i].style.display = 'none';
        return;
      }

      const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
      const y = (-proj.y * 0.5 + 0.5) * window.innerHeight;

      labelEls[i].style.display = 'block';
      labelEls[i].style.left = `${x}px`;
      labelEls[i].style.top = `${y}px`;
    });
  }

  // Window Resize Handling
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // =========================================================================
  // 18. MAIN ANIMATION & SIMULATION LOOP
  // =========================================================================
  let clock = new THREE.Clock();
  let lastTelemetryUpdate = 0;

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Camera Lerp
    if (autoRotate) {
      targetTheta += 0.0035;
    }
    theta += (targetTheta - theta) * 0.08;
    phi += (targetPhi - phi) * 0.08;
    radius += (targetRadius - radius) * 0.08;
    updateCamera();

    // Exploded View Assembly Lerp
    parts.forEach(p => {
      const dest = Sim.exploded ? p.explode : p.home;
      p.mesh.position.lerp(dest, 0.09);
    });

    // Animate Gauges Needle
    animatableGauges.forEach(g => {
      let angle = g.baseAngle;
      if (!Sim.pumpActive) {
        angle = -0.5; // Pressure drops to 0 when pump off
      } else {
        // Small realistic pressure oscillation
        angle += Math.sin(elapsedTime * 8) * 0.04;
      }
      g.needle.rotation.z = angle;
    });

    // Spin Turbine Flow Meter Impeller
    animatableTurbines.forEach(rotor => {
      if (Sim.pumpActive) {
        rotor.rotation.z += Sim.flowRate * 4.2 * delta;
      }
    });

    // UV Lamp Intensity Pulse
    if (uvGlowMesh) {
      const pulse = Sim.pumpActive ? (1.5 + Math.sin(elapsedTime * 6) * 0.3) : 0.2;
      uvGlowMesh.material.emissiveIntensity = pulse;
    }

    // Water Stream at Dispenser
    if (waterStreamMesh) {
      waterStreamMesh.visible = Sim.pumpActive && !Sim.solenoidDiverting;
      if (waterStreamMesh.visible) {
        waterStreamMesh.scale.y = 0.95 + Math.sin(elapsedTime * 14) * 0.08;
      }
    }

    // Industrial Safety Alert Strobe & Solenoid DIN LED
    if (Sim.solenoidDiverting) {
      const flash = Math.sin(elapsedTime * 22) > 0;
      alarmBeaconLight.intensity = flash ? 4.5 : 0.2;
      if (alarmInnerCoreMesh) {
        alarmInnerCoreMesh.material.emissive.setHex(0xEF4444);
        alarmInnerCoreMesh.material.emissiveIntensity = flash ? 3.5 : 0.4;
      }
      if (solenoidLedMesh) {
        solenoidLedMesh.material = flash ? M.ledRed : M.darkPolymer;
      }
    } else {
      alarmBeaconLight.intensity = 0;
      if (alarmInnerCoreMesh) {
        alarmInnerCoreMesh.material.emissive.setHex(0x000000);
        alarmInnerCoreMesh.material.emissiveIntensity = 0;
      }
      if (solenoidLedMesh) {
        solenoidLedMesh.material = Sim.pumpActive ? M.ledGreen : M.darkPolymer;
      }
    }

    // Particle Fluid Dynamics Flow along Curves
    if (Sim.particlesVisible) {
      const flowSpeed = Sim.pumpActive ? (Sim.flowRate * 0.065 * delta) : 0;
      const positions = particleGeo.attributes.position.array;
      const colors = particleGeo.attributes.color.array;

      for (let i = 0; i < NUM_PARTICLES; i++) {
        particleT[i] = (particleT[i] + flowSpeed) % 1.0;
        const pt = mainPipeCurve.getPointAt(particleT[i]);
        positions[i * 3] = pt.x;
        positions[i * 3 + 1] = pt.y;
        positions[i * 3 + 2] = pt.z;

        // Progressive water purification color transformation
        if (particleT[i] < 0.3) {
          // Raw turbid inlet water (brownish/yellow-green)
          colors[i * 3] = Sim.contaminantSpike ? 0.95 : 0.65;
          colors[i * 3 + 1] = Sim.contaminantSpike ? 0.45 : 0.55;
          colors[i * 3 + 2] = 0.2;
        } else if (particleT[i] < 0.6) {
          // Post-Sediment & Carbon (clearing up)
          colors[i * 3] = 0.3;
          colors[i * 3 + 1] = 0.7;
          colors[i * 3 + 2] = 0.8;
        } else if (particleT[i] < 0.8) {
          // In UV Chamber (luminescent violet excitation)
          colors[i * 3] = 0.7;
          colors[i * 3 + 1] = 0.4;
          colors[i * 3 + 2] = 1.0;
        } else {
          // Ultra-Pure Potable Effluent (Electric Turquoise)
          colors[i * 3] = 0.1;
          colors[i * 3 + 1] = 0.85;
          colors[i * 3 + 2] = 0.95;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;
      particleGeo.attributes.color.needsUpdate = true;

      // Reject Line Particles
      const rejPos = rejGeo.attributes.position.array;
      const rejSpeed = Sim.pumpActive ? (flowSpeed * 0.8) : 0;
      for (let i = 0; i < NUM_REJECT_PARTICLES; i++) {
        rejT[i] = (rejT[i] + rejSpeed) % 1.0;
        const rpt = rejectPipeCurve.getPointAt(rejT[i]);
        rejPos[i * 3] = rpt.x;
        rejPos[i * 3 + 1] = rpt.y;
        rejPos[i * 3 + 2] = rpt.z;
      }
      rejGeo.attributes.position.needsUpdate = true;
    }

    // Telemetry Update Loop (10 Hz)
    if (elapsedTime - lastTelemetryUpdate > 0.1) {
      lastTelemetryUpdate = elapsedTime;

      if (Sim.pumpActive) {
        // Realistic industrial SCADA sensor physics (low-pass damped harmonic wandering)
        const t = elapsedTime;
        const pumpCadence = Math.sin(t * 16) * 0.02; // ±0.02 L/min gentle pump cadence
        const slowDriftA = Math.sin(t * 0.3) * 0.4 + Math.sin(t * 0.12) * 0.2;
        const slowDriftB = Math.cos(t * 0.25) * 0.35 + Math.sin(t * 0.07) * 0.15;
        const slowDriftC = Math.sin(t * 0.18) * 0.25;

        Sim.flowRate = Math.max(0, 2.45 + pumpCadence + slowDriftA * 0.03);
        Sim.roPressure = Math.max(0, 71.5 + pumpCadence * 10 + slowDriftB * 0.5);
        Sim.feedPressure = Math.max(0, 24.5 + slowDriftC * 0.4);
        Sim.waterTemp = 23.8 + Math.sin(t * 0.02) * 0.08; // High thermal inertia
        Sim.uvIntensity = 99.2 + Math.sin(t * 0.7) * 0.3; // 98.9 - 99.5%

        if (!Sim.contaminantSpike) {
          Sim.rawTurbidity = 21.4 + slowDriftA * 0.5;
          Sim.rawTDS = Math.round(385 + slowDriftB * 3.0);
          Sim.rawPH = 6.92 + slowDriftC * 0.02;
          Sim.cleanTurbidity = 0.08 + Math.sin(t * 0.35) * 0.008;
          Sim.cleanTDS = 28.5 + Math.cos(t * 0.25) * 0.3;
          Sim.cleanPH = 7.42 + Math.sin(t * 0.15) * 0.015;
        } else {
          // Contaminant Spike dynamics with realistic turbulence
          Sim.rawTurbidity = 185.0 + Math.sin(t * 1.5) * 3.5;
          Sim.rawTDS = Math.round(1260 + Math.cos(t * 1.2) * 12);
          Sim.rawPH = 5.55 + Math.sin(t * 0.8) * 0.05;
          Sim.cleanTurbidity = 1.62 + Math.sin(t * 2) * 0.04;
          Sim.cleanTDS = 134.0 + Math.cos(t * 1.5) * 1.5;
          Sim.cleanPH = 6.18 + Math.sin(t * 0.5) * 0.02;
        }
      } else {
        // Flow and dynamic pressure drop to zero
        Sim.flowRate = 0;
        Sim.roPressure = 0;
        Sim.feedPressure = 6.2; // Static line head
        Sim.uvIntensity = 0;
      }

      updateTelemetryUI();
      updateEsp32Screen(
        Sim.rawTurbidity,
        Sim.rawTDS,
        Sim.rawPH,
        Sim.solenoidDiverting ? 'ALARM' : (Sim.pumpActive ? 'NORMAL' : 'STANDBY')
      );
    }

    updateLabels();
    renderer.render(scene, camera);
  }

  updateCamera();
  animate();

})();