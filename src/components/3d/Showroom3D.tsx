import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundEngine } from '../../services/audio';
import {
  RotateCcw,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Box
} from 'lucide-react';

interface Showroom3DProps {
  modelType?: 'roadster' | 'cybertruck' | 'models' | 'model3' | 'modelx' | 'modely';
  currentColorHex?: string;
  className?: string;
  height?: string;
  onColorChange?: (hex: string) => void;
  showAllControls?: boolean;
  interactiveControls?: boolean;
}

const COLOR_PRESETS = [
  { name: 'Ultra Red', hex: '#b30000' },
  { name: 'Obsidian Black', hex: '#0f0f11' },
  { name: 'Pearl White', hex: '#eceff1' },
  { name: 'Quicksilver', hex: '#8a939e' },
  { name: 'Deep Blue', hex: '#0d2b56' },
  { name: 'Stealth Grey', hex: '#2c3036' },
];

export const Showroom3D: React.FC<Showroom3DProps> = ({
  modelType = 'roadster',
  currentColorHex = '#b30000',
  className = '',
  height = 'h-[75vh] min-h-[520px]',
  onColorChange,
  showAllControls = true,
  interactiveControls = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHudCollapsed, setIsHudCollapsed] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [viewMode, setViewMode] = useState<'standard' | 'wireframe' | 'xray'>('standard');
  const [activeCameraAngle, setActiveCameraAngle] = useState<'hero' | 'side' | 'rear' | 'top' | 'cockpit'>('hero');
  const [isMuted, setIsMuted] = useState(soundEngine.getMuted());
  const [activeColor, setActiveColor] = useState(currentColorHex);

  // References to communicate with Three.js loop without re-triggering useEffect
  const stateRef = useRef({
    activeColor,
    viewMode,
    isAutoRotating,
    modelType,
    targetCamPos: new THREE.Vector3(4.2, 1.8, 4.2),
    targetLookAt: new THREE.Vector3(0, 0.6, 0),
    currentLookAt: new THREE.Vector3(0, 0.6, 0),
  });

  useEffect(() => {
    stateRef.current.activeColor = activeColor;
  }, [activeColor]);

  useEffect(() => {
    setActiveColor(currentColorHex);
    stateRef.current.activeColor = currentColorHex;
  }, [currentColorHex]);

  useEffect(() => {
    stateRef.current.viewMode = viewMode;
  }, [viewMode]);

  useEffect(() => {
    stateRef.current.isAutoRotating = isAutoRotating;
  }, [isAutoRotating]);

  useEffect(() => {
    stateRef.current.modelType = modelType;
  }, [modelType]);

  // Main Three.js Scene Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.FogExp2(0x060608, 0.04);

    // Camera setup
    const width = canvas.parentElement?.clientWidth || canvas.clientWidth || window.innerWidth;
    const height = canvas.parentElement?.clientHeight || canvas.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(4.2, 1.8, 4.2);

    // WebGL Renderer using React's canvas element
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // RoomEnvironment Studio Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x111122, 0.6);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    // Key studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 7, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Rim light (Tesla Crimson accent)
    const rimLight = new THREE.DirectionalLight(0xe82127, 2.4);
    rimLight.position.set(-6, 3, -5);
    scene.add(rimLight);

    // Soft cool fill
    const fillLight = new THREE.DirectionalLight(0x7090ff, 1.0);
    fillLight.position.set(-4, 5, 4);
    scene.add(fillLight);

    // Overhead rectangular light panel (aesthetic studio softbox)
    const ceilingPanelGeo = new THREE.PlaneGeometry(5, 9);
    const ceilingPanelMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const ceilingPanel = new THREE.Mesh(ceilingPanelGeo, ceilingPanelMat);
    ceilingPanel.rotation.x = Math.PI / 2;
    ceilingPanel.position.set(0, 4.8, 0);
    scene.add(ceilingPanel);

    // Showroom Floor (Reflective dark mirror platform)
    const floorGeo = new THREE.CircleGeometry(16, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.18,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = !isSoftwareGl;
    scene.add(floor);

    // Turntable circular rings
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.65, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x242430, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.005;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(4.8, 4.83, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xe82127, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.006;
    scene.add(ring2);

    // Contact Shadow beneath vehicle
    const contactShadowGeo = new THREE.PlaneGeometry(4.8, 2.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(128, 128, 20, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0.9)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.01;
    scene.add(contactShadow);

    // --- CAR MODEL PROCEDURAL BUILDER ---
    const carRoot = new THREE.Group();
    scene.add(carRoot);

    // Materials dictionary for dynamic color / mode swap
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(currentColorHex),
      metalness: 0.88,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0
    });

    const carbonMaterial = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.35,
      metalness: 0.6
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x05070a,
      roughness: 0.05,
      metalness: 0.1,
      transparent: true,
      opacity: 0.65,
      transmission: isSoftwareGl ? 0 : 0.85,
      ior: 1.52,
    });

    const headlightMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 2.5,
      roughness: 0.2
    });

    const taillightMaterial = new THREE.MeshStandardMaterial({
      color: 0xff1015,
      emissive: 0xff0015,
      emissiveIntensity: 3.5,
      roughness: 0.2
    });

    const tireMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1c,
      roughness: 0.85,
      metalness: 0.1
    });

    const rimMaterial = new THREE.MeshStandardMaterial({
      color: 0x33363b,
      metalness: 0.95,
      roughness: 0.25
    });

    const caliperMaterial = new THREE.MeshStandardMaterial({
      color: 0xe82127,
      metalness: 0.7,
      roughness: 0.3
    });

    const xrayBatteryMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x0099ff,
      emissiveIntensity: 1.2,
      wireframe: false,
      transparent: true,
      opacity: 0.85
    });

    const xrayMotorMat = new THREE.MeshStandardMaterial({
      color: 0xff9100,
      emissive: 0xff5500,
      emissiveIntensity: 1.5,
      roughness: 0.3
    });

    const wireframeOverlayMat = new THREE.MeshBasicMaterial({
      color: 0xe82127,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    // Helper to generate wheels
    const wheels: THREE.Group[] = [];
    const createWheel = (x: number, y: number, z: number, isRight: boolean) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(x, y, z);

      // Tire
      const tireGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.24, 32);
      tireGeo.rotateZ(Math.PI / 2);
      const tire = new THREE.Mesh(tireGeo, tireMaterial);
      tire.castShadow = !isSoftwareGl;
      wheelGroup.add(tire);

      // Rim
      const rimGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.245, 24);
      rimGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimGeo, rimMaterial);
      wheelGroup.add(rim);

      // Spokes (5-blade aerodynamic design)
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5;
        const spokeGeo = new THREE.BoxGeometry(0.04, 0.24, 0.05);
        const spoke = new THREE.Mesh(spokeGeo, rimMaterial);
        spoke.position.set(isRight ? 0.08 : -0.08, Math.sin(angle) * 0.12, Math.cos(angle) * 0.12);
        spoke.rotation.x = angle;
        wheelGroup.add(spoke);
      }

      // Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.08, 0.18, 0.08);
      const caliper = new THREE.Mesh(caliperGeo, caliperMaterial);
      caliper.position.set(isRight ? 0.04 : -0.04, 0.12, 0.14);
      wheelGroup.add(caliper);

      wheels.push(wheelGroup);
      return wheelGroup;
    };

    // Build specific car body type based on modelType
    const buildCarModel = (type: string) => {
      // Clear previous car parts
      while (carRoot.children.length > 0) {
        carRoot.remove(carRoot.children[0]);
      }
      wheels.length = 0;

      const bodyGroup = new THREE.Group();
      carRoot.add(bodyGroup);

      if (type === 'cybertruck') {
        // --- CYBERTRUCK ANGULAR GEOMETRY ---
        // Exoskeleton main wedge body
        const wedgeShape = new THREE.Shape();
        wedgeShape.moveTo(-2.2, 0.25);
        wedgeShape.lineTo(0.1, 1.4); // Apex of Cyber roof
        wedgeShape.lineTo(2.3, 0.9); // Bed edge
        wedgeShape.lineTo(2.3, 0.3);
        wedgeShape.lineTo(-2.2, 0.3);
        wedgeShape.closePath();

        const extrudeSettings = {
          steps: 1,
          depth: 1.8,
          bevelEnabled: true,
          bevelThickness: 0.04,
          bevelSize: 0.04,
          bevelSegments: 2
        };
        const wedgeGeo = new THREE.ExtrudeGeometry(wedgeShape, extrudeSettings);
        wedgeGeo.center();
        const mainWedge = new THREE.Mesh(wedgeGeo, paintMaterial);
        mainWedge.position.y = 0.85;
        mainWedge.castShadow = !isSoftwareGl;
        bodyGroup.add(mainWedge);

        // Armor Glass faceted windows
        const windowGeo = new THREE.BoxGeometry(1.8, 0.45, 1.82);
        const windows = new THREE.Mesh(windowGeo, glassMaterial);
        windows.position.set(0.1, 1.25, 0);
        bodyGroup.add(windows);

        // Cyberpunk continuous LED front lightbar
        const frontLightGeo = new THREE.BoxGeometry(0.06, 0.04, 1.76);
        const frontLight = new THREE.Mesh(frontLightGeo, headlightMaterial);
        frontLight.position.set(-2.24, 0.72, 0);
        bodyGroup.add(frontLight);

        // Rear red continuous LED taillight bar
        const rearLightGeo = new THREE.BoxGeometry(0.06, 0.04, 1.76);
        const rearLight = new THREE.Mesh(rearLightGeo, taillightMaterial);
        rearLight.position.set(2.32, 0.92, 0);
        bodyGroup.add(rearLight);

        // Rugged Wheel Wells & 4 cyber wheels
        bodyGroup.add(createWheel(-1.4, 0.45, 0.95, true));
        bodyGroup.add(createWheel(-1.4, 0.45, -0.95, false));
        bodyGroup.add(createWheel(1.4, 0.45, 0.95, true));
        bodyGroup.add(createWheel(1.4, 0.45, -0.95, false));

      } else {
        // --- SLEEK AERODYNAMIC TESLA (Roadster / Model S / 3 / X / Y) ---
        const isRoadster = type === 'roadster';
        const isSUV = type === 'modelx' || type === 'modely';
        const heightScale = isRoadster ? 0.85 : (isSUV ? 1.25 : 1.0);
        const lengthScale = isRoadster ? 0.95 : 1.05;

        // 1. Lower Chassis & Aerodynamic Floor
        const chassisGeo = new THREE.BoxGeometry(4.2 * lengthScale, 0.35, 1.75);
        const chassis = new THREE.Mesh(chassisGeo, carbonMaterial);
        chassis.position.y = 0.35;
        chassis.castShadow = !isSoftwareGl;
        bodyGroup.add(chassis);

        // 2. Sculpted Main Upper Body
        const bodyGeo = new THREE.BoxGeometry(3.9 * lengthScale, 0.48 * heightScale, 1.72);
        const mainBody = new THREE.Mesh(bodyGeo, paintMaterial);
        mainBody.position.y = 0.62 * heightScale;
        mainBody.castShadow = !isSoftwareGl;
        bodyGroup.add(mainBody);

        // 3. Aerodynamic Hood / Frunk Slope
        const hoodGeo = new THREE.CylinderGeometry(0.85, 0.88, 1.3 * lengthScale, 16);
        hoodGeo.rotateZ(Math.PI / 2);
        const hood = new THREE.Mesh(hoodGeo, paintMaterial);
        hood.position.set(-1.2 * lengthScale, 0.65 * heightScale, 0);
        hood.scale.set(1, 0.45, 1.85);
        bodyGroup.add(hood);

        // 4. Cabin Glass Greenhouse / Targa Roof
        const cabinLength = isRoadster ? 1.8 : 2.2;
        const cabinGeo = new THREE.BoxGeometry(cabinLength, 0.58 * heightScale, 1.45);
        const cabin = new THREE.Mesh(cabinGeo, glassMaterial);
        cabin.position.set(0.1, (0.95 + (isRoadster ? -0.05 : 0.05)) * heightScale, 0);
        bodyGroup.add(cabin);

        // Glass Roof Crown
        const roofGeo = new THREE.CylinderGeometry(0.72, 0.75, cabinLength * 0.95, 16);
        roofGeo.rotateZ(Math.PI / 2);
        const roof = new THREE.Mesh(roofGeo, glassMaterial);
        roof.position.set(0.1, 1.22 * heightScale, 0);
        roof.scale.set(1, 0.32, 1.75);
        bodyGroup.add(roof);

        // 5. Minimalist Cockpit interior (visible through glass)
        const dashGeo = new THREE.BoxGeometry(0.3, 0.15, 1.3);
        const dash = new THREE.Mesh(dashGeo, carbonMaterial);
        dash.position.set(-0.5, 0.85 * heightScale, 0);
        bodyGroup.add(dash);

        // 17-inch Tesla Touchscreen
        const screenGeo = new THREE.BoxGeometry(0.04, 0.22, 0.32);
        const screenMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const screen = new THREE.Mesh(screenGeo, screenMat);
        screen.position.set(-0.45, 0.95 * heightScale, 0);
        screen.rotation.y = -0.2;
        bodyGroup.add(screen);

        // Steering Yoke
        const yokeGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 16, Math.PI * 1.5);
        const yokeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
        const yoke = new THREE.Mesh(yokeGeo, yokeMat);
        yoke.position.set(-0.42, 0.92 * heightScale, 0.35);
        yoke.rotation.y = Math.PI / 2;
        bodyGroup.add(yoke);

        // Front Headlights
        const leftLight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.35), headlightMaterial);
        leftLight.position.set(-2.0 * lengthScale, 0.65 * heightScale, 0.6);
        leftLight.rotation.y = -0.3;
        bodyGroup.add(leftLight);

        const rightLight = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.35), headlightMaterial);
        rightLight.position.set(-2.0 * lengthScale, 0.65 * heightScale, -0.6);
        rightLight.rotation.y = 0.3;
        bodyGroup.add(rightLight);

        // Rear Continuous Taillight Bar
        const tailLight = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.6), taillightMaterial);
        tailLight.position.set(2.02 * lengthScale, 0.72 * heightScale, 0);
        bodyGroup.add(tailLight);

        // Active Rear Aero Wing / Diffuser (for Roadster & Plaid)
        if (isRoadster || type === 'models') {
          const spoilerGeo = new THREE.BoxGeometry(0.25, 0.04, 1.55);
          const spoiler = new THREE.Mesh(spoilerGeo, carbonMaterial);
          spoiler.position.set(1.95 * lengthScale, 0.85 * heightScale, 0);
          spoiler.rotation.z = -0.12;
          bodyGroup.add(spoiler);
        }

        // 4 Performance Wheels
        const wheelY = 0.38;
        const frontX = -1.35 * lengthScale;
        const rearX = 1.35 * lengthScale;
        const wheelZ = 0.88;

        bodyGroup.add(createWheel(frontX, wheelY, wheelZ, true));
        bodyGroup.add(createWheel(frontX, wheelY, -wheelZ, false));
        bodyGroup.add(createWheel(rearX, wheelY, wheelZ, true));
        bodyGroup.add(createWheel(rearX, wheelY, -wheelZ, false));
      }

      // --- X-RAY POWERTRAIN SYSTEM ---
      const powertrainGroup = new THREE.Group();
      powertrainGroup.name = 'powertrainGroup';

      // Skateboard Battery Pack
      const batteryGeo = new THREE.BoxGeometry(2.5, 0.12, 1.25);
      const battery = new THREE.Mesh(batteryGeo, xrayBatteryMat);
      battery.position.set(0, 0.28, 0);
      powertrainGroup.add(battery);

      // Front Electric Drive Motor
      const frontMotorGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.5, 16);
      frontMotorGeo.rotateZ(Math.PI / 2);
      const frontMotor = new THREE.Mesh(frontMotorGeo, xrayMotorMat);
      frontMotor.position.set(-1.35, 0.38, 0);
      powertrainGroup.add(frontMotor);

      // Rear Dual / Tri Motor Assembly
      const rearMotorGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 16);
      rearMotorGeo.rotateZ(Math.PI / 2);
      const rearMotor = new THREE.Mesh(rearMotorGeo, xrayMotorMat);
      rearMotor.position.set(1.35, 0.38, 0);
      powertrainGroup.add(rearMotor);

      powertrainGroup.visible = false;
      carRoot.add(powertrainGroup);

      // Wireframe mesh clone
      const wireframeMesh = new THREE.Mesh(
        new THREE.BoxGeometry(4.1, 1.1, 1.8),
        wireframeOverlayMat
      );
      wireframeMesh.name = 'wireframeMesh';
      wireframeMesh.position.set(0, 0.7, 0);
      wireframeMesh.visible = false;
      carRoot.add(wireframeMesh);
    };

    // Initial build
    buildCarModel(modelType);

    // --- MOUSE ORBIT CONTROLS ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationVelocity = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      stateRef.current.isAutoRotating = false;
      setIsAutoRotating(false);
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      carRoot.rotation.y += deltaX * 0.008;
      rotationVelocity = deltaX * 0.004;

      // Adjust camera height slightly with Y drag
      stateRef.current.targetCamPos.y = THREE.MathUtils.clamp(
        stateRef.current.targetCamPos.y - deltaY * 0.005,
        0.8,
        4.0
      );
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.003;
      const len = stateRef.current.targetCamPos.length();
      if ((zoomDelta > 0 && len < 9.0) || (zoomDelta < 0 && len > 2.2)) {
        stateRef.current.targetCamPos.multiplyScalar(1 + zoomDelta);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Window Resize Handler
    const handleResize = () => {
      if (!canvas) return;
      const newWidth = canvas.parentElement?.clientWidth || canvas.clientWidth || window.innerWidth;
      const newHeight = canvas.parentElement?.clientHeight || canvas.clientHeight || 600;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight, false);
    };
    window.addEventListener('resize', handleResize);

    // --- ANIMATION LOOP ---
    let frameId = 0;
    const clock = new THREE.Clock();

    function tick() {
      const delta = clock.getDelta();

      // Update vehicle body paint color dynamically
      if (paintMaterial.color.getHexString() !== stateRef.current.activeColor.replace('#', '')) {
        paintMaterial.color.set(stateRef.current.activeColor);
      }

      // Check modelType changes
      if (stateRef.current.modelType !== modelType) {
        // Updated via prop
      }

      // View mode toggling (xray / wireframe)
      const powertrain = carRoot.getObjectByName('powertrainGroup');
      const wireframe = carRoot.getObjectByName('wireframeMesh');
      if (powertrain && wireframe) {
        if (stateRef.current.viewMode === 'xray') {
          powertrain.visible = true;
          wireframe.visible = false;
          paintMaterial.opacity = 0.35;
          paintMaterial.transparent = true;
        } else if (stateRef.current.viewMode === 'wireframe') {
          powertrain.visible = false;
          wireframe.visible = true;
          paintMaterial.opacity = 0.2;
          paintMaterial.transparent = true;
        } else {
          powertrain.visible = false;
          wireframe.visible = false;
          paintMaterial.opacity = 1.0;
          paintMaterial.transparent = false;
        }
      }

      // Handle Auto Rotation & Inertia
      if (stateRef.current.isAutoRotating && !isDragging) {
        carRoot.rotation.y += delta * 0.45;
        // Subtle wheel spin when auto-rotating
        wheels.forEach(w => {
          w.rotation.z -= delta * 1.5;
        });
      } else if (!isDragging && Math.abs(rotationVelocity) > 0.0001) {
        carRoot.rotation.y += rotationVelocity;
        rotationVelocity *= 0.92;
      }

      // Smooth camera interpolation
      camera.position.lerp(stateRef.current.targetCamPos, 0.06);
      stateRef.current.currentLookAt.lerp(stateRef.current.targetLookAt, 0.06);
      camera.lookAt(stateRef.current.currentLookAt);

      renderer.render(scene, camera);

      frameId = requestAnimationFrame(tick);
    }

    tick();

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [modelType]);

  // Handle camera view preset clicks
  const setCameraPreset = (preset: 'hero' | 'side' | 'rear' | 'top' | 'cockpit') => {
    setActiveCameraAngle(preset);
    soundEngine.playClick();
    switch (preset) {
      case 'hero':
        stateRef.current.targetCamPos.set(4.2, 1.8, 4.2);
        stateRef.current.targetLookAt.set(0, 0.6, 0);
        break;
      case 'side':
        stateRef.current.targetCamPos.set(0, 1.4, 5.2);
        stateRef.current.targetLookAt.set(0, 0.6, 0);
        break;
      case 'rear':
        stateRef.current.targetCamPos.set(-4.2, 1.6, -3.2);
        stateRef.current.targetLookAt.set(0, 0.6, 0);
        break;
      case 'top':
        stateRef.current.targetCamPos.set(0.1, 6.2, 0.1);
        stateRef.current.targetLookAt.set(0, 0.5, 0);
        break;
      case 'cockpit':
        stateRef.current.targetCamPos.set(0.2, 1.25, 0.4);
        stateRef.current.targetLookAt.set(-1.2, 0.8, 0);
        break;
    }
  };

  const handleColorSelect = (hex: string) => {
    setActiveColor(hex);
    soundEngine.playClick();
    if (onColorChange) {
      onColorChange(hex);
    }
  };

  const toggleSound = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      soundEngine.playElectricAcceleration();
    }
  };

  return (
    <div className={`relative w-full overflow-hidden select-none bg-[#060608] ${height} ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing block" />

      {/* Showroom Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050505]/20 to-[#050505]/90" />

      {/* Top Left Status & Specs Overlay */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#e82127]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400">
            3D Interactive Showroom Studio
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white tracking-wide uppercase">
          {modelType.toUpperCase()}
        </h2>
        <p className="text-xs text-neutral-400 font-mono mt-0.5">
          Dual / Tri-Motor Architecture &bull; PBR Studio Lighting
        </p>
      </div>

      {/* Top Right Quick Audio & Reset Action */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={toggleSound}
          title={isMuted ? 'Unmute EV Sound' : 'Mute Sound'}
          className="p-2.5 rounded-full bg-black/60 hover:bg-neutral-900 border border-white/10 text-neutral-300 hover:text-white transition-all backdrop-blur-md"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-[#e82127]" />}
        </button>

        <button
          onClick={() => {
            soundEngine.playElectricAcceleration();
            setIsAutoRotating(!isAutoRotating);
          }}
          title={isAutoRotating ? 'Pause Auto-Rotation' : 'Start Auto-Rotation'}
          className={`p-2.5 rounded-full border transition-all backdrop-blur-md ${
            isAutoRotating
              ? 'bg-[#e82127]/20 border-[#e82127] text-white shadow-[0_0_15px_rgba(232,33,39,0.3)]'
              : 'bg-black/60 border-white/10 text-neutral-400 hover:text-white'
          }`}
        >
          <RotateCcw className={`w-4 h-4 ${isAutoRotating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Collapsible Bottom Control Dock (Compliant with zero viewport occlusion directive) */}
      {interactiveControls && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 z-20 w-[94vw] max-w-[880px] transition-all duration-300 ${
            isHudCollapsed ? 'bottom-2' : 'bottom-6'
          }`}
        >
          {/* Collapse / Expand Toggle Tab */}
          <div className="flex justify-center mb-1">
            <button
              onClick={() => setIsHudCollapsed(!isHudCollapsed)}
              className="flex items-center gap-1.5 px-4 py-1 text-[11px] font-mono tracking-wider uppercase text-neutral-400 hover:text-white bg-black/80 hover:bg-black border border-white/10 rounded-t-lg backdrop-blur-md transition-colors"
            >
              {isHudCollapsed ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5 text-[#e82127]" /> Show Showroom Controls
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" /> Hide Controls
                </>
              )}
            </button>
          </div>

          {/* Unified Bottom Dock */}
          {!isHudCollapsed && (
            <div className="glass-dock rounded-2xl p-3 sm:p-4 text-white">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* 1. Camera Angle Presets */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  <span className="text-[10px] font-mono uppercase text-neutral-500 mr-1 hidden sm:inline">
                    Angles:
                  </span>
                  {(['hero', 'side', 'rear', 'top', 'cockpit'] as const).map(angle => (
                    <button
                      key={angle}
                      onClick={() => setCameraPreset(angle)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                        activeCameraAngle === angle
                          ? 'bg-[#e82127] text-white shadow-[0_0_12px_rgba(232,33,39,0.4)]'
                          : 'bg-white/5 hover:bg-white/10 text-neutral-300'
                      }`}
                    >
                      {angle}
                    </button>
                  ))}
                </div>

                {/* 2. Color Swatches */}
                {showAllControls && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase text-neutral-500 mr-1 hidden sm:inline">
                      Paint:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {COLOR_PRESETS.map(color => (
                        <button
                          key={color.name}
                          onClick={() => handleColorSelect(color.hex)}
                          title={color.name}
                          style={{ backgroundColor: color.hex }}
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 transition-transform hover:scale-110 ${
                            activeColor.toLowerCase() === color.hex.toLowerCase()
                              ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.6)]'
                              : 'border-white/20'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Inspection Modes (Standard, Wireframe, X-Ray) */}
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
                  <button
                    onClick={() => {
                      setViewMode('standard');
                      soundEngine.playClick();
                    }}
                    title="Studio PBR View"
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      viewMode === 'standard' ? 'bg-white/20 text-white font-medium' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Studio</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('wireframe');
                      soundEngine.playClick();
                    }}
                    title="Cyber Wireframe"
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      viewMode === 'wireframe' ? 'bg-[#e82127] text-white font-medium' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Box className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Wireframe</span>
                  </button>

                  <button
                    onClick={() => {
                      setViewMode('xray');
                      soundEngine.playClick();
                    }}
                    title="X-Ray Powertrain & Battery"
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg transition-colors ${
                      viewMode === 'xray' ? 'bg-[#00e5ff] text-black font-semibold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Powertrain</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
