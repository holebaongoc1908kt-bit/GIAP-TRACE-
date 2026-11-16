import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { 
  RadarPOI, 
  RadarViewMode, 
  CameraPreset, 
  TacticalLayers, 
  VisualRenderMode 
} from '../../types/radar3d';
import { 
  Maximize2, 
  Rotate3d, 
  Compass, 
  Eye, 
  MapPin, 
  Layers, 
  Plus, 
  Minus, 
  Crosshair,
  ArrowLeft,
  Building,
  Flag,
  Mountain,
  Sun,
  ShieldAlert
} from 'lucide-react';

interface Radar3DSceneProps {
  pois: RadarPOI[];
  selectedPoi: RadarPOI | null;
  onSelectPoi: (poi: RadarPOI) => void;
  viewMode: RadarViewMode;
  onChangeViewMode: (mode: RadarViewMode) => void;
  cameraPreset: CameraPreset;
  onChangeCameraPreset: (preset: CameraPreset) => void;
  layers: TacticalLayers;
  visualMode: VisualRenderMode;
  onChangeVisualMode?: (mode: VisualRenderMode) => void;
  isDark: boolean;
  radarSweepActive?: boolean;
}

export const Radar3DScene: React.FC<Radar3DSceneProps> = ({
  pois,
  selectedPoi,
  onSelectPoi,
  viewMode,
  onChangeViewMode,
  cameraPreset,
  onChangeCameraPreset,
  layers,
  visualMode,
  onChangeVisualMode,
  isDark,
  radarSweepActive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js instances stored in refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const radarBeamRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const terrainGroupRef = useRef<THREE.Group | null>(null);
  const tacticalLinesGroupRef = useRef<THREE.Group | null>(null);

  // Pin screen positions state for HTML overlay
  const [pinPositions, setPinPositions] = useState<{ 
    id: string; 
    x: number; 
    y: number; 
    distance: number; 
    visible: boolean 
  }[]>([]);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [camDistance, setCamDistance] = useState<number>(50);

  // Camera Target Animation State
  const targetCamPos = useRef<THREE.Vector3 | null>(null);
  const targetCamLook = useRef<THREE.Vector3 | null>(null);

  // Handle Preset Camera Positions
  const applyCameraPreset = useCallback((preset: CameraPreset, smooth: boolean = true) => {
    if (!cameraRef.current || !controlsRef.current) return;

    let targetPos = new THREE.Vector3(0, 36, 46);
    let targetLook = new THREE.Vector3(0, 1.8, 0);

    if (preset === 'topdown') {
      targetPos = new THREE.Vector3(0, 56, 0.01);
      targetLook = new THREE.Vector3(0, 0, 0);
    } else if (preset === 'overview') {
      targetPos = new THREE.Vector3(0, 36, 46);
      targetLook = new THREE.Vector3(0, 1.8, 0);
    } else if (preset === 'cinematic' || preset === 'valley') {
      targetPos = new THREE.Vector3(-18, 12, 18);
      targetLook = new THREE.Vector3(0, 2, 0);
    }

    if (smooth) {
      targetCamPos.current = targetPos;
      targetCamLook.current = targetLook;
    } else {
      cameraRef.current.position.copy(targetPos);
      controlsRef.current.target.copy(targetLook);
      controlsRef.current.update();
    }
  }, []);

  // Fly to selected POI
  useEffect(() => {
    if (!selectedPoi || !cameraRef.current || !controlsRef.current) return;

    const { x, y, z } = selectedPoi.coordinates;
    targetCamPos.current = new THREE.Vector3(x - 9, y + 8, z + 12);
    targetCamLook.current = new THREE.Vector3(x, y + 1.2, z);
  }, [selectedPoi]);

  // Handle visual render mode change (Realistic vs Tactical vs History)
  useEffect(() => {
    if (!terrainMeshRef.current || !wireframeMeshRef.current || !radarBeamRef.current) return;

    if (visualMode === 'realistic') {
      wireframeMeshRef.current.visible = layers.contourLines;
      radarBeamRef.current.visible = false;
    } else if (visualMode === 'tactical') {
      wireframeMeshRef.current.visible = true;
      radarBeamRef.current.visible = radarSweepActive;
    } else if (visualMode === 'history') {
      wireframeMeshRef.current.visible = false;
      radarBeamRef.current.visible = false;
    }
  }, [visualMode, layers.contourLines, radarSweepActive]);

  // Handle view mode change (3D vs 2D)
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;

    if (viewMode === '2d') {
      targetCamPos.current = new THREE.Vector3(0, 56, 0.1);
      targetCamLook.current = new THREE.Vector3(0, 0, 0);
      controlsRef.current.enableRotate = false;
    } else {
      controlsRef.current.enableRotate = true;
      if (terrainGroupRef.current) terrainGroupRef.current.visible = true;
      if (tacticalLinesGroupRef.current) tacticalLinesGroupRef.current.visible = true;
      applyCameraPreset(cameraPreset, true);
    }
  }, [viewMode, cameraPreset, applyCameraPreset]);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene with bright atmospheric sky tone (mist over northwestern valleys)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x13221b);
    scene.fog = new THREE.FogExp2(0x13221b, 0.009);

    // Camera
    const camera = new THREE.PerspectiveCamera(46, width / height, 0.5, 450);
    camera.position.set(0, 34, 44);
    cameraRef.current = camera;

    // Renderer with high brightness & ACES Filmic
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35; // Ample brightness so landscape is clearly visible
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 110;
    controls.target.set(0, 1.8, 0);
    controlsRef.current = controls;

    // -------------------------------------------------------------
    // REALISTIC LIGHTING SYSTEM (NO PITCH-BLACK VOID)
    // -------------------------------------------------------------
    // 1. Hemisphere light: Bright sky reflection + warm earth bounce
    const hemiLight = new THREE.HemisphereLight(0xdcfce7, 0x2e4a32, 2.2);
    scene.add(hemiLight);

    // 2. Primary directional sunlight
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 2.8);
    sunLight.position.set(35, 55, 25);
    scene.add(sunLight);

    // 3. Valley Floor Fill Light: keeps center Mường Thanh basin bright and readable
    const valleyFillLight = new THREE.PointLight(0xa7f3d0, 1.6, 65);
    valleyFillLight.position.set(0, 15, 0);
    scene.add(valleyFillLight);

    // 4. Subtle cool backlight for mountain rim depth
    const backLight = new THREE.DirectionalLight(0x7dd3fc, 1.0);
    backLight.position.set(-30, 20, -30);
    scene.add(backLight);

    // -------------------------------------------------------------
    // PROCEDURAL REALISTIC 3D TERRAIN (LUSH MOUNTAINS & GOLDEN VALLEY)
    // -------------------------------------------------------------
    const terrainGroup = new THREE.Group();
    terrainGroupRef.current = terrainGroup;
    scene.add(terrainGroup);

    const planeW = 86;
    const planeH = 86;
    const segments = 100;
    const terrainGeo = new THREE.PlaneGeometry(planeW, planeH, segments, segments);
    terrainGeo.rotateX(-Math.PI / 2);

    const posAttr = terrainGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      // Distance from center of valley
      const dist = Math.sqrt(x * x + z * z);
      const normDist = Math.min(1, dist / (planeW * 0.48));

      // Mountain bowl formation (outer high peaks, flat valley in center)
      const mountainRim = Math.pow(normDist, 2.2) * 8.8;

      // Natural mountain ridges and peaks
      const ridges = Math.sin(x * 0.22) * Math.cos(z * 0.22) * 2.0 +
                     Math.sin(x * 0.45 + z * 0.35) * 1.0;

      // Eastern Hills Ridge: Đồi A1, C1, D1
      let easternRidge = 0;
      if (x > 1 && x < 16 && z > -14 && z < 8) {
        easternRidge = (1 - Math.abs(x - 8) / 7) * 2.6;
      }

      // Northern Gate Hills: Him Lam, Độc Lập
      let northernHills = 0;
      if (z < -8 && Math.abs(x) < 22) {
        northernHills = Math.sin((x + 20) * 0.2) * 1.5 + 1.2;
      }

      // River Nậm Rốm channel indentation
      const riverZ = z;
      const riverCurveX = Math.sin(riverZ * 0.16) * 4.8 - 2.2;
      const distToRiver = Math.abs(x - riverCurveX);
      const riverCut = distToRiver < 3.2 ? -Math.cos((distToRiver / 3.2) * (Math.PI / 2)) * 0.75 : 0;

      const finalY = Math.max(0.3, mountainRim + ridges + easternRidge + northernHills + riverCut);
      posAttr.setY(i, finalY);
    }
    terrainGeo.computeVertexNormals();

    // High Resolution Procedural Canvas Texture (2048x2048) for Realistic Color & Depth
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 2048;
    texCanvas.height = 2048;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      // 1. Base Mountain Forest Green
      ctx.fillStyle = '#264327';
      ctx.fillRect(0, 0, 2048, 2048);

      // 2. Mường Thanh Fertile Valley: Soft Olive & Golden Rice Paddies
      const valleyGrad = ctx.createRadialGradient(1024, 1024, 120, 1024, 1024, 900);
      valleyGrad.addColorStop(0, '#788A4C');   // Lush rice paddy center
      valleyGrad.addColorStop(0.35, '#687A3E'); // Valley agricultural belt
      valleyGrad.addColorStop(0.65, '#3D5E32'); // Foothills transition
      valleyGrad.addColorStop(1, '#1E361D');    // Deep northwestern mountain forest
      ctx.fillStyle = valleyGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // 3. Rice fields patchwork texture in valley
      ctx.fillStyle = 'rgba(180, 160, 90, 0.22)';
      for (let x = 650; x < 1400; x += 45) {
        for (let y = 650; y < 1450; y += 45) {
          if (Math.random() > 0.4) {
            ctx.fillRect(x, y, 40, 40);
          }
        }
      }

      // 4. Mountain ridge rock & cliff shading
      ctx.fillStyle = 'rgba(40, 60, 40, 0.4)';
      for (let i = 0; i < 40; i++) {
        const rx = Math.random() * 2048;
        const ry = Math.random() * 2048;
        const distToCenter = Math.hypot(rx - 1024, ry - 1024);
        if (distToCenter > 600) {
          ctx.beginPath();
          ctx.arc(rx, ry, Math.random() * 90 + 40, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Dirt Roads & Strategic Movement Paths (Ochre/Brown)
      ctx.strokeStyle = '#99734D';
      ctx.lineWidth = 10;
      ctx.beginPath();
      // Provincial Route 41 (Tuần Giáo into Điện Biên Phủ)
      ctx.moveTo(1800, 450);
      ctx.bezierCurveTo(1500, 650, 1200, 850, 1024, 1024);
      ctx.bezierCurveTo(900, 1200, 950, 1500, 1000, 1850);
      ctx.stroke();

      // 6. French Airstrip Mường Thanh (Runway strip)
      ctx.fillStyle = '#6E6759';
      ctx.fillRect(990, 880, 56, 320);
      ctx.strokeStyle = '#D4A017';
      ctx.lineWidth = 3;
      ctx.strokeRect(990, 880, 56, 320);
      // Runway dashed center line
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(1018, 890);
      ctx.lineTo(1018, 1190);
      ctx.stroke();
      ctx.setLineDash([]);

      // 7. Sông Nậm Rốm in Vivid Reflective Azure Blue
      ctx.strokeStyle = '#0284C7';
      ctx.lineWidth = 24;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(1024 - 40, 80);
      ctx.bezierCurveTo(920, 550, 1120, 1050, 1000, 1450);
      ctx.bezierCurveTo(920, 1700, 980, 1920, 1020, 2000);
      ctx.stroke();

      // River bank highlights
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 8;
      ctx.stroke();

      // 8. Topographic Radar Contour Lines (Light green overlay)
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.28)';
      for (let r = 80; r < 950; r += 50) {
        ctx.beginPath();
        for (let a = 0; a <= Math.PI * 2; a += 0.07) {
          const wobble = Math.sin(a * 6) * 12 + Math.cos(a * 4) * 8;
          const px = 1024 + Math.cos(a) * (r + wobble);
          const py = 1024 + Math.sin(a) * (r + wobble);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    const terrainTex = new THREE.CanvasTexture(texCanvas);
    terrainTex.colorSpace = THREE.SRGBColorSpace;
    terrainTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const terrainMat = new THREE.MeshStandardMaterial({
      map: terrainTex,
      roughness: 0.75,
      metalness: 0.12,
      flatShading: false
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMeshRef.current = terrainMesh;
    terrainGroup.add(terrainMesh);

    // Optional Wireframe Mesh Overlay (Contour wireframe - toggled on/off)
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.2
    });
    const wireframeMesh = new THREE.Mesh(terrainGeo, wireframeMat);
    wireframeMesh.position.y += 0.03;
    wireframeMesh.visible = false; // By default off in realistic mode
    wireframeMeshRef.current = wireframeMesh;
    terrainGroup.add(wireframeMesh);

    // -------------------------------------------------------------
    // TACTICAL OVERLAYS: TRENCHES & DEFENSE PERIMETERS
    // -------------------------------------------------------------
    const tacticalGroup = new THREE.Group();
    tacticalLinesGroupRef.current = tacticalGroup;
    scene.add(tacticalGroup);

    // Trenches (Earth Sandbag brown dashed lines)
    const trenchMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 1.0,
      gapSize: 0.5,
      linewidth: 3
    });

    const trenchPoints: THREE.Vector3[][] = [
      [
        new THREE.Vector3(12, 2.8, -8),
        new THREE.Vector3(8, 2.2, -4),
        new THREE.Vector3(4, 1.8, 0),
        new THREE.Vector3(-2, 1.4, 2),
        new THREE.Vector3(-7, 1.4, 4)
      ],
      [
        new THREE.Vector3(-14, 2.1, -4),
        new THREE.Vector3(-10, 1.6, 0),
        new THREE.Vector3(-8, 1.4, 3)
      ],
      [
        new THREE.Vector3(16, 3.4, -9),
        new THREE.Vector3(20, 4.0, -6),
        new THREE.Vector3(24, 4.8, 0)
      ]
    ];

    trenchPoints.forEach(pts => {
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, trenchMat);
      line.computeLineDistances();
      tacticalGroup.add(line);
    });

    // Attack arrows / Vectors (Viet Minh assault from North and East)
    const arrowCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(22, 4.5, -14),
      new THREE.Vector3(14, 3.2, -8),
      new THREE.Vector3(6, 2.2, -3),
      new THREE.Vector3(-2, 1.5, 2)
    ]);
    const arrowTubeGeo = new THREE.TubeGeometry(arrowCurve, 24, 0.22, 8, false);
    const arrowTubeMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9
    });
    const arrowTube = new THREE.Mesh(arrowTubeGeo, arrowTubeMat);
    tacticalGroup.add(arrowTube);

    // French Stronghold Defense Ring (Red dashed ring around De Castries)
    const defenseCurve = new THREE.EllipseCurve(-4, 3, 14, 12, 0, 2 * Math.PI, false, 0);
    const defensePoints2D = defenseCurve.getPoints(50);
    const defensePoints3D = defensePoints2D.map(p => new THREE.Vector3(p.x, 1.5, p.y));
    const defenseGeo = new THREE.BufferGeometry().setFromPoints(defensePoints3D);
    const defenseMat = new THREE.LineDashedMaterial({
      color: 0xef4444,
      dashSize: 1.2,
      gapSize: 0.6,
      linewidth: 3
    });
    const defenseLine = new THREE.Line(defenseGeo, defenseMat);
    defenseLine.computeLineDistances();
    tacticalGroup.add(defenseLine);

    // -------------------------------------------------------------
    // RADAR SWEEPER BEAM (ACTIVE IN TACTICAL MODE)
    // -------------------------------------------------------------
    const sweepGeo = new THREE.CylinderGeometry(34, 0.5, 1.2, 32, 1, false, 0, Math.PI / 3);
    const sweepMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const sweepMesh = new THREE.Mesh(sweepGeo, sweepMat);
    sweepMesh.position.set(0, 1.7, 0);
    sweepMesh.visible = false;
    radarBeamRef.current = sweepMesh;
    scene.add(sweepMesh);

    // -------------------------------------------------------------
    // ANIMATION & PROJECTION LOOP
    // -------------------------------------------------------------
    let animationFrameId = 0;
    const tempVec = new THREE.Vector3();

    const animate = () => {
      // Rotate Radar Beam if active
      if (radarBeamRef.current && radarBeamRef.current.visible && radarSweepActive) {
        radarBeamRef.current.rotation.y += 0.02;
      }

      // Smooth Camera Fly-To transitions
      if (targetCamPos.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, 0.065);
        controlsRef.current.target.lerp(targetCamLook.current || new THREE.Vector3(), 0.065);
        controlsRef.current.update();

        if (cameraRef.current.position.distanceTo(targetCamPos.current) < 0.15) {
          targetCamPos.current = null;
          targetCamLook.current = null;
        }
      } else {
        controls.update();
      }

      // Compass & Distance
      if (cameraRef.current) {
        cameraRef.current.getWorldDirection(tempVec);
        const angle = Math.atan2(tempVec.x, tempVec.z) * (180 / Math.PI);
        setCompassHeading(angle);
        const dist = cameraRef.current.position.distanceTo(controls.target);
        setCamDistance(dist);
      }

      // Project 3D coordinates to 2D HTML markers with distance
      if (cameraRef.current && containerRef.current) {
        const cWidth = containerRef.current.clientWidth;
        const cHeight = containerRef.current.clientHeight;

        const updatedPositions = pois.map((poi, idx) => {
          tempVec.set(poi.coordinates.x, poi.coordinates.y + 1.2, poi.coordinates.z);
          const pDist = cameraRef.current!.position.distanceTo(tempVec);
          tempVec.project(cameraRef.current!);

          const isBehind = tempVec.z > 1.0;
          let x = (tempVec.x * 0.5 + 0.5) * cWidth;
          let y = (-(tempVec.y * 0.5) + 0.5) * cHeight;

          // Prevent exact overlaps by subtle staggered offset
          const staggerY = (idx % 2 === 0 ? 0 : -6);

          return {
            id: poi.id,
            x,
            y: y + staggerY,
            distance: pDist,
            visible: !isBehind && x >= -80 && x <= cWidth + 80 && y >= -80 && y <= cHeight + 80
          };
        });

        setPinPositions(updatedPositions);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Responsive resize handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const nw = containerRef.current.clientWidth;
      const nh = containerRef.current.clientHeight;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      terrainTex.dispose();
      wireframeMat.dispose();
      renderer.dispose();
    };
  }, [pois, radarSweepActive]);

  // Update visibility of tactical layers
  useEffect(() => {
    if (tacticalLinesGroupRef.current) {
      tacticalLinesGroupRef.current.visible = (layers.defenseLines || layers.attackArrows || layers.maneuverLines);
    }
  }, [layers]);

  // Zoom helpers
  const handleZoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, 4.5);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, -4.5);
    controlsRef.current.update();
  };

  const handleResetTarget = () => {
    applyCameraPreset('overview', true);
  };

  // Zoom Level Check: close vs far
  const isZoomedClose = camDistance < 46;

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full min-h-[420px] sm:min-h-[500px] md:min-h-[580px] bg-[#0A1811] select-none overflow-hidden rounded-2xl border border-emerald-500/40 shadow-inner"
    >
      {/* 3D WebGL Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-hidden" />

      {/* 3D Battlefield Status (Clean & Minimal) */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/80 border border-emerald-500/40 rounded-xl backdrop-blur-md pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="text-xs font-mono font-bold text-emerald-200 uppercase tracking-wider">
          Chiến trường 3D Điện Biên Phủ
        </span>
      </div>

      {/* FLOATING COMPASS ROSE (TOP-RIGHT) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 pointer-events-none flex flex-col items-center">
        <div 
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-emerald-500/40 bg-black/80 shadow-lg flex items-center justify-center relative transition-transform duration-75"
          style={{ transform: `rotate(${-compassHeading}deg)` }}
        >
          <div className="absolute top-0.5 text-[8px] font-mono font-black text-red-500">N</div>
          <div className="absolute bottom-0.5 text-[8px] font-mono font-bold text-gray-400">S</div>
          <div className="absolute left-0.5 text-[8px] font-mono font-bold text-gray-400">W</div>
          <div className="absolute right-0.5 text-[8px] font-mono font-bold text-gray-400">E</div>
          <Compass className="w-5 h-5 text-emerald-400/80" />
        </div>
      </div>

      {/* FLOATING RIGHT MAP CONTROLS: ZOOM, RECENTER, 2D/3D TOGGLE */}
      <div className="absolute right-3 top-16 sm:right-4 sm:top-18 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleZoomIn}
          className="p-1.5 sm:p-2 rounded-xl bg-black/80 hover:bg-black border border-emerald-500/30 text-emerald-300 hover:text-white transition-all shadow-md cursor-pointer"
          title="Phóng to"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 sm:p-2 rounded-xl bg-black/80 hover:bg-black border border-emerald-500/30 text-emerald-300 hover:text-white transition-all shadow-md cursor-pointer"
          title="Thu nhỏ"
        >
          <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={handleResetTarget}
          className="p-1.5 sm:p-2 rounded-xl bg-black/80 hover:bg-black border border-emerald-500/30 text-emerald-300 hover:text-white transition-all shadow-md cursor-pointer"
          title="Tái định vị trung tâm"
        >
          <Crosshair className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
        <button
          onClick={() => onChangeViewMode(viewMode === '3d' ? '2d' : '3d')}
          className={`p-1.5 sm:p-2 rounded-xl border transition-all shadow-md cursor-pointer ${
            viewMode === '2d' 
              ? 'bg-emerald-600 text-white border-emerald-400' 
              : 'bg-black/80 border-emerald-500/30 text-emerald-300 hover:text-white'
          }`}
          title={viewMode === '3d' ? 'Chuyển sang 2D' : 'Chuyển sang 3D'}
        >
          <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* BOTTOM-LEFT CAMERA PRESET BUTTONS (ĐƠN GIẢN, DỄ NHÌN, ÍT CHỮ) */}
      <div className="absolute bottom-20 sm:bottom-24 left-3 sm:left-4 z-20 flex items-center gap-1.5 p-1 bg-black/85 border border-emerald-500/40 rounded-xl backdrop-blur-md shadow-lg">
        <button
          onClick={() => {
            onChangeCameraPreset('overview');
            applyCameraPreset('overview', true);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
            cameraPreset === 'overview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-300 hover:text-white hover:bg-white/10'
          }`}
          title="Góc nhìn toàn cảnh lòng chảo"
        >
          🌐 Toàn cảnh
        </button>
        <button
          onClick={() => {
            onChangeCameraPreset('cinematic');
            applyCameraPreset('cinematic', true);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
            cameraPreset === 'cinematic'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-300 hover:text-white hover:bg-white/10'
          }`}
          title="Góc nhìn cận cảnh chiến trường hầm hào"
        >
          🎯 Cận cảnh
        </button>
        <button
          onClick={() => {
            onChangeCameraPreset('topdown');
            applyCameraPreset('topdown', true);
          }}
          className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer transition-all ${
            cameraPreset === 'topdown'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-emerald-300 hover:text-white hover:bg-white/10'
          }`}
          title="Nhìn từ trên cao xuống"
        >
          📐 Trên xuống
        </button>
      </div>

      {/* 3D PROJECTED HTML MARKER PINS (ZOOM-AWARE, NO OVERLAPS) */}
      {viewMode === '3d' && pinPositions.map(pos => {
        if (!pos.visible) return null;
        const poi = pois.find(p => p.id === pos.id);
        if (!poi) return null;

        // Layer filters
        if (poi.category === 'bunker' && !layers.bunkers) return null;
        if (poi.category === 'stronghold' && !layers.strongholds) return null;
        if (poi.category === 'hq' && !layers.hq) return null;
        if (poi.category === 'hill' && !layers.highTerrain) return null;

        const isSelected = selectedPoi?.id === poi.id;

        return (
          <div
            key={poi.id}
            onClick={() => onSelectPoi(poi)}
            className="absolute z-10 -translate-x-1/2 -translate-y-full flex flex-col items-center cursor-pointer group transition-all duration-200"
            style={{
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              transform: `translate(-50%, -100%) scale(${isSelected ? 1.15 : 1})`
            }}
          >
            {/* ZOOM-AWARE RENDERING: Full Badge when Close, Compact Dot when Far */}
            {isZoomedClose ? (
              /* Full Badge with Circular Photo */
              <div className={`flex items-center gap-2 p-1 pr-3 rounded-full border shadow-xl backdrop-blur-md transition-all ${
                isSelected
                  ? 'bg-emerald-950/95 border-amber-400 ring-2 ring-amber-400/60 shadow-amber-500/40'
                  : 'bg-black/90 border-emerald-500/60 hover:border-emerald-300 group-hover:scale-105'
              }`}>
                {/* Circular Thumbnail Photo with fallback */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border-2 border-white/90 shrink-0 bg-black">
                  <img 
                    src={poi.thumbnail} 
                    alt={poi.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/tactical_briefing_map_1789877546424.jpg';
                    }}
                  />
                </div>

                {/* Label (CHỮ TO & ĐẬM) */}
                {layers.labels && (
                  <div className="flex flex-col text-left">
                    <span className={`text-xs sm:text-sm font-sans font-black whitespace-nowrap leading-tight ${
                      isSelected ? 'text-amber-300' : 'text-white group-hover:text-emerald-200'
                    }`}>
                      {poi.name}
                    </span>
                    {poi.frenchName && (
                      <span className="text-[10px] font-mono text-emerald-300/80">
                        {poi.frenchName}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Compact Dot + Short Name when Zoomed Out (CHỮ RÕ RÀNG) */
              <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border shadow-md backdrop-blur-xs transition-all ${
                isSelected
                  ? 'bg-amber-500 text-black border-amber-300 font-black'
                  : 'bg-black/90 border-emerald-500/50 text-emerald-200 group-hover:border-amber-400 group-hover:text-amber-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  poi.category === 'hq' ? 'bg-amber-400' :
                  poi.category === 'bunker' ? 'bg-sky-400' : 'bg-red-500'
                }`} />
                {layers.labels && (
                  <span className="text-[11px] sm:text-xs font-mono font-bold whitespace-nowrap">
                    {poi.shortName}
                  </span>
                )}
              </div>
            )}

            {/* Anchor Stem Pin & Ground Node */}
            <div className="flex flex-col items-center">
              <div className={`w-0.5 h-2 sm:h-2.5 ${isSelected ? 'bg-amber-400' : 'bg-emerald-400/80'}`} />
              <div className={`w-2 h-2 rounded-full border border-white flex items-center justify-center ${
                poi.category === 'hq' ? 'bg-amber-500' :
                poi.category === 'bunker' ? 'bg-sky-500' : 'bg-red-500'
              }`}>
                <div className="w-0.5 h-0.5 rounded-full bg-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
