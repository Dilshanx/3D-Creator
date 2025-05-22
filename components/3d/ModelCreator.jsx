import {
  useState,
  useRef,
  useCallback,
  Suspense,
  useMemo,
  useEffect,
} from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Conditional imports with error handling
let Canvas, useFrame, useThree, extend;
let OrbitControls, TransformControls, Text3D, Center, Grid;
import createLetterShape from "../LetterShape/CreateLetterShape";
import createNumberShape from "../LetterShape/CreateNumberShape";
import createSpecialCharShape from "../LetterShape/CreateSpecialCharShape";

try {
  const r3f = require("@react-three/fiber");
  Canvas = r3f.Canvas;
  useFrame = r3f.useFrame;
  useThree = r3f.useThree;
  extend = r3f.extend;
} catch (error) {
  console.warn("@react-three/fiber not available:", error);
}

try {
  const drei = require("@react-three/drei");
  OrbitControls = drei.OrbitControls;
  TransformControls = drei.TransformControls;
  Text3D = drei.Text3D;
  Center = drei.Center;
  Grid = drei.Grid;
} catch (error) {
  console.warn("@react-three/drei not available:", error);
}

if (extend && THREE) {
  extend({
    BoxGeometry: THREE.BoxGeometry,
    SphereGeometry: THREE.SphereGeometry,
    CylinderGeometry: THREE.CylinderGeometry,
    ConeGeometry: THREE.ConeGeometry,
    TorusGeometry: THREE.TorusGeometry,
  });
}

// Modern Slider Component
function ModernSlider({ label, value, min, max, step, onChange, unit = "" }) {
  return (
    <div className='mb-4'>
      <div className='flex justify-between items-center mb-2'>
        <label className='text-sm font-medium text-slate-300'>{label}</label>
        <span className='text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded'>
          {typeof value === "number" ? value.toFixed(2) : value}
          {unit}
        </span>
      </div>
      <div className='relative'>
        <input
          type='range'
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className='w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider-modern'
        />
      </div>
    </div>
  );
}

// Modern Input Component
function ModernInput({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div className='mb-4'>
      <label className='block text-sm font-medium text-slate-300 mb-2'>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200'
      />
    </div>
  );
}

// Modern Button Component
function ModernButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}) {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800";

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary:
      "bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    accent:
      "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

// Enhanced GLB Exporter utility
function exportToGLB(scene, filename = "model.glb") {
  const exporter = new GLTFExporter();

  const options = {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    embedImages: true,
    animations: [],
    includeCustomExtensions: false,
  };

  exporter.parse(
    scene,
    (result) => {
      if (result instanceof ArrayBuffer) {
        const blob = new Blob([result], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("GLB export completed successfully");
        alert("GLB file exported successfully!");
      } else {
        const jsonString = JSON.stringify(result, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = filename.replace(".glb", ".gltf");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log("GLTF export completed successfully");
        alert("GLTF file exported successfully!");
      }
    },
    (error) => {
      console.error("GLB export failed:", error);
      alert("Export failed: " + error.message);
    },
    options
  );
}

// Helper function to create mesh from shape data
const createMeshFromShape = (shape) => {
  try {
    let geometry;

    switch (shape.geometry) {
      case "box":
        geometry = new THREE.BoxGeometry(1, 1, 1);
        break;
      case "sphere":
        geometry = new THREE.SphereGeometry(0.5, 32, 32);
        break;
      case "cylinder":
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        break;
      case "cone":
        geometry = new THREE.ConeGeometry(0.5, 1, 32);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
        break;
      case "pyramid":
        const vertices = new Float32Array([
          -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
        ]);
        const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
        geometry = new THREE.BufferGeometry();
        geometry.setIndex(indices);
        geometry.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(vertices, 3)
        );
        geometry.computeVertexNormals();
        break;
      case "text":
        geometry = createTextGeometryForExport(
          shape.text || "3D",
          shape.textSize || 0.5
        );
        break;
      default:
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    let material;
    const color = new THREE.Color(shape.color);

    switch (shape.material) {
      case "standard":
        material = new THREE.MeshStandardMaterial({ color });
        break;
      case "basic":
        material = new THREE.MeshBasicMaterial({ color });
        break;
      case "phong":
        material = new THREE.MeshPhongMaterial({ color });
        break;
      case "wireframe":
        material = new THREE.MeshBasicMaterial({ color, wireframe: true });
        break;
      case "glass":
        material = new THREE.MeshPhysicalMaterial({
          color,
          transparent: true,
          opacity: 0.7,
          roughness: 0.1,
          transmission: 0.9,
          metalness: 0.1,
        });
        break;
      case "metal":
        material = new THREE.MeshStandardMaterial({
          color,
          metalness: 0.9,
          roughness: 0.1,
        });
        break;
      default:
        material = new THREE.MeshStandardMaterial({ color });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...shape.position);
    mesh.rotation.set(...shape.rotation);
    mesh.scale.set(...shape.scale);
    mesh.name = `shape_${shape.id}_${shape.geometry}`;

    return mesh;
  } catch (error) {
    console.error("Failed to create mesh for shape:", shape, error);
    return null;
  }
};

// Create text geometry for export
const createTextGeometryForExport = (text, size) => {
  try {
    const textLength = text.length;
    const spacing = size * 0.8;
    const depth = size * 0.3;
    const shapes = [];

    for (let i = 0; i < textLength; i++) {
      const char = text[i];
      if (char === " ") continue;

      let characterShapes = [];
      const xOffset = (i - textLength / 2 + 0.5) * spacing;

      if (/[0-9]/.test(char)) {
        const numberShape = createNumberShape(char, size);
        if (numberShape) characterShapes = [numberShape];
      } else if (/[A-Za-z]/.test(char)) {
        const letterShape = createLetterShape(char, size);
        if (letterShape) characterShapes = [letterShape];
      } else {
        const specialShapes = createSpecialCharShape(char, size);
        if (specialShapes) {
          characterShapes = Array.isArray(specialShapes)
            ? specialShapes
            : [specialShapes];
        }
      }

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: size * 0.02,
        bevelThickness: size * 0.01,
      };

      characterShapes.forEach((shape, shapeIndex) => {
        try {
          const charGeometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeSettings
          );
          charGeometry.translate(xOffset, shapeIndex * size * 0.1, 0);
          shapes.push(charGeometry);
        } catch (error) {
          console.warn(`Failed to create character ${char}:`, error);
          const fallbackGeometry = new THREE.BoxGeometry(
            size * 0.5,
            size,
            size * 0.3
          );
          fallbackGeometry.translate(xOffset, 0, 0);
          shapes.push(fallbackGeometry);
        }
      });
    }

    if (shapes.length > 0) {
      if (
        THREE.BufferGeometryUtils &&
        THREE.BufferGeometryUtils.mergeGeometries
      ) {
        try {
          const mergedGeometry =
            THREE.BufferGeometryUtils.mergeGeometries(shapes);
          shapes.forEach((geom) => geom.dispose());
          return mergedGeometry;
        } catch (error) {
          console.warn("Failed to merge geometries:", error);
          const result = shapes[0];
          shapes.slice(1).forEach((geom) => geom.dispose());
          return result;
        }
      } else {
        const result = shapes[0];
        shapes.slice(1).forEach((geom) => geom.dispose());
        return result;
      }
    } else {
      return new THREE.BoxGeometry(textLength * 0.5, 0.8, 0.2);
    }
  } catch (error) {
    console.error("Failed to create text geometry:", error);
    return new THREE.BoxGeometry(text.length * size * 0.6, size, size * 0.3);
  }
};

// Fallback component
function FallbackCreator() {
  return (
    <div className='flex flex-col h-full bg-slate-900 text-slate-100'>
      <div className='flex justify-between items-center p-6 bg-slate-800 border-b border-slate-700'>
        <div className='flex items-center space-x-3'>
          <h2 className='text-2xl font-bold text-red-400'>3D Model Creator</h2>
          <span className='px-3 py-1 text-xs bg-red-600 rounded-full font-medium'>
            Error
          </span>
        </div>
      </div>

      <div className='flex-grow flex items-center justify-center p-8'>
        <div className='text-center max-w-md'>
          <div className='text-6xl mb-6'>⚠️</div>
          <h3 className='text-2xl font-bold text-red-400 mb-6'>
            Missing Dependencies
          </h3>
          <p className='text-slate-300 mb-8 leading-relaxed'>
            This component requires React Three Fiber and related packages to
            work properly.
          </p>
          <div className='bg-slate-800 p-6 rounded-xl text-left border border-slate-700'>
            <p className='text-sm text-slate-400 mb-3 font-medium'>
              Install the required packages:
            </p>
            <code className='text-green-400 text-sm font-mono'>
              npm install @react-three/fiber @react-three/drei three
            </code>
          </div>
          <p className='text-xs text-slate-500 mt-6'>
            After installing, restart your development server.
          </p>
        </div>
      </div>
    </div>
  );
}

// Custom Pyramid Geometry Component
function PyramidGeometry(props) {
  const geometry = useRef();

  useEffect(() => {
    if (!THREE || !geometry.current) return;

    const vertices = new Float32Array([
      -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
    ]);
    const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];

    geometry.current.setIndex(indices);
    geometry.current.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.current.computeVertexNormals();
  }, []);

  return <bufferGeometry ref={geometry} {...props} />;
}

// Complete 3D Text Component
function RealTextGeometry({ text = "", size = 0.5 }) {
  const geometry = useRef();

  useEffect(() => {
    if (!THREE || !geometry.current || !text) return;

    const textLength = text.length;
    const spacing = size * 0.8;
    const depth = size * 0.3;
    const shapes = [];

    for (let i = 0; i < textLength; i++) {
      const char = text[i];
      if (char === " ") continue;

      let characterShapes = [];
      const xOffset = (i - textLength / 2 + 0.5) * spacing;

      if (/[0-9]/.test(char)) {
        const numberShape = createNumberShape(char, size);
        if (numberShape) characterShapes = [numberShape];
      } else if (/[A-Za-z]/.test(char)) {
        const letterShape = createLetterShape(char, size);
        if (letterShape) characterShapes = [letterShape];
      } else {
        const specialShapes = createSpecialCharShape(char, size);
        if (specialShapes) {
          characterShapes = Array.isArray(specialShapes)
            ? specialShapes
            : [specialShapes];
        }
      }

      const extrudeSettings = {
        depth: depth,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: size * 0.02,
        bevelThickness: size * 0.01,
      };

      characterShapes.forEach((shape, shapeIndex) => {
        try {
          const charGeometry = new THREE.ExtrudeGeometry(
            shape,
            extrudeSettings
          );
          charGeometry.translate(xOffset, shapeIndex * size * 0.1, 0);
          shapes.push(charGeometry);
        } catch (error) {
          console.warn(`Failed to create character ${char}:`, error);
          const fallbackGeometry = new THREE.BoxGeometry(
            size * 0.5,
            size,
            size * 0.3
          );
          fallbackGeometry.translate(xOffset, 0, 0);
          shapes.push(fallbackGeometry);
        }
      });
    }

    if (shapes.length > 0) {
      if (
        THREE.BufferGeometryUtils &&
        THREE.BufferGeometryUtils.mergeGeometries
      ) {
        try {
          const mergedGeometry =
            THREE.BufferGeometryUtils.mergeGeometries(shapes);
          geometry.current.copy(mergedGeometry);
          mergedGeometry.dispose();
        } catch (error) {
          console.warn("Failed to merge geometries:", error);
          geometry.current.copy(shapes[0]);
        }
      } else {
        geometry.current.copy(shapes[0]);
      }

      shapes.forEach((geom) => geom.dispose());
    } else {
      const fallbackGeometry = new THREE.BoxGeometry(
        Math.max(textLength * 0.5, 0.5),
        0.8,
        0.2
      );
      geometry.current.copy(fallbackGeometry);
      fallbackGeometry.dispose();
    }
  }, [text, size]);

  return <bufferGeometry ref={geometry} />;
}

// Shape Component
function Shape({
  position,
  rotation,
  scale,
  geometry,
  material,
  color,
  isSelected,
  onClick,
  id,
  text,
  textSize,
}) {
  const meshRef = useRef();

  const renderGeometry = useMemo(() => {
    switch (geometry) {
      case "box":
        return <boxGeometry args={[1, 1, 1]} />;
      case "sphere":
        return <sphereGeometry args={[0.5, 32, 32]} />;
      case "cylinder":
        return <cylinderGeometry args={[0.5, 0.5, 1, 32]} />;
      case "cone":
        return <coneGeometry args={[0.5, 1, 32]} />;
      case "torus":
        return <torusGeometry args={[0.5, 0.2, 16, 100]} />;
      case "pyramid":
        return <PyramidGeometry />;
      case "text":
        return (
          <Suspense fallback={<boxGeometry args={[2, 0.5, 0.2]} />}>
            <RealTextGeometry text={text || ""} size={textSize || 0.5} />
          </Suspense>
        );
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  }, [geometry, text, textSize]);

  const renderMaterial = useMemo(() => {
    const materialProps = { color };

    switch (material) {
      case "standard":
        return <meshStandardMaterial {...materialProps} />;
      case "basic":
        return <meshBasicMaterial {...materialProps} />;
      case "phong":
        return <meshPhongMaterial {...materialProps} />;
      case "wireframe":
        return <meshBasicMaterial {...materialProps} wireframe />;
      case "glass":
        return (
          <meshPhysicalMaterial
            {...materialProps}
            transparent
            opacity={0.7}
            roughness={0.1}
            transmission={0.9}
            metalness={0.1}
          />
        );
      case "metal":
        return (
          <meshStandardMaterial
            {...materialProps}
            metalness={0.9}
            roughness={0.1}
          />
        );
      default:
        return <meshStandardMaterial {...materialProps} />;
    }
  }, [material, color]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation();
        onClick(id);
      }}
      castShadow
      receiveShadow
    >
      {renderGeometry}
      {renderMaterial}
      {isSelected && <meshBasicMaterial color='#00ff00' wireframe />}
    </mesh>
  );
}

// Scene Lights Component
function Lights() {
  const directionalRef = useRef();

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        ref={directionalRef}
        position={[10, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-5, 5, -5]} color='#4080ff' intensity={0.3} />
      <pointLight position={[5, 5, 5]} color='#ff8040' intensity={0.3} />
    </>
  );
}

// Transform Controls Wrapper
function TransformControlsWrapper({
  children,
  mode,
  enabled,
  onObjectChange,
  onDraggingChanged,
}) {
  const { camera, gl } = useThree();

  return enabled && TransformControls ? (
    <TransformControls
      camera={camera}
      domElement={gl.domElement}
      mode={mode}
      onObjectChange={onObjectChange}
      onDraggingChanged={onDraggingChanged}
    >
      {children}
    </TransformControls>
  ) : (
    children
  );
}

// Main Scene Component
function Scene({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  sceneRef,
}) {
  const { scene } = useThree();

  useEffect(() => {
    if (sceneRef) {
      sceneRef.current = scene;
    }
  }, [scene, sceneRef]);

  return (
    <>
      <Lights />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color='#f8fafc' />
      </mesh>

      {Grid && (
        <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
          cellColor='#e2e8f0'
          sectionColor='#cbd5e1'
        />
      )}

      {!Grid && <gridHelper args={[20, 20, "#cbd5e1", "#e2e8f0"]} />}

      {shapes.map((shape) => {
        const isSelected = shape.id === selectedShapeId;

        return (
          <TransformControlsWrapper
            key={shape.id}
            mode={mode}
            enabled={isSelected}
            onObjectChange={() => onShapeUpdate(shape.id)}
            onDraggingChanged={(isDragging) => {}}
          >
            <Shape
              id={shape.id}
              position={shape.position}
              rotation={shape.rotation}
              scale={shape.scale}
              geometry={shape.geometry}
              material={shape.material}
              color={shape.color}
              text={shape.text}
              textSize={shape.textSize}
              isSelected={isSelected}
              onClick={onShapeClick}
            />
          </TransformControlsWrapper>
        );
      })}

      {OrbitControls && (
        <OrbitControls
          enabled={orbitControlsEnabled}
          enableDamping
          dampingFactor={0.05}
        />
      )}
    </>
  );
}

// Camera Controls Component
function CameraController({ preset }) {
  const { camera } = useThree();

  const cameraPresets = {
    top: { position: [0, 10, 0], target: [0, 0, 0] },
    front: { position: [0, 0, 10], target: [0, 0, 0] },
    side: { position: [10, 0, 0], target: [0, 0, 0] },
    isometric: { position: [5, 5, 5], target: [0, 0, 0] },
  };

  useEffect(() => {
    if (preset && cameraPresets[preset] && camera) {
      const settings = cameraPresets[preset];
      camera.position.set(...settings.position);
      camera.lookAt(...settings.target);
    }
  }, [preset, camera]);

  return null;
}

// Main Component
export default function Model3DCreator() {
  if (!Canvas || !useThree || !THREE) {
    return <FallbackCreator />;
  }

  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const [mode, setMode] = useState("translate");
  const [orbitControlsEnabled, setOrbitControlsEnabled] = useState(true);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [cameraPreset, setCameraPreset] = useState(null);
  const sceneRef = useRef(null);

  const shapeOptions = [
    { name: "Cube", geometry: "box", icon: "🧊" },
    { name: "Sphere", geometry: "sphere", icon: "⚪" },
    { name: "Cylinder", geometry: "cylinder", icon: "🥫" },
    { name: "Cone", geometry: "cone", icon: "🔺" },
    { name: "Torus", geometry: "torus", icon: "🍩" },
    { name: "Pyramid", geometry: "pyramid", icon: "🔺" },
    { name: "3D Text", geometry: "text", icon: "📝" },
  ];

  const materialOptions = [
    { name: "Standard", type: "standard" },
    { name: "Basic", type: "basic" },
    { name: "Phong", type: "phong" },
    { name: "Wireframe", type: "wireframe" },
    { name: "Glass", type: "glass" },
    { name: "Metal", type: "metal" },
  ];

  const selectedShape = shapes.find((shape) => shape.id === selectedShapeId);

  const saveState = useCallback(() => {
    const state = shapes.map((shape) => ({
      ...shape,
      position: [...shape.position],
      rotation: [...shape.rotation],
      scale: [...shape.scale],
    }));
    setUndoStack((prev) => [...prev, state]);
    setRedoStack([]);
  }, [shapes]);

  const addShape = useCallback(
    (geometry) => {
      const newShape = {
        id: Date.now().toString(),
        geometry,
        material: "standard",
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        position: [
          (Math.random() - 0.5) * 3,
          Math.random() * 2 + 0.5,
          (Math.random() - 0.5) * 3,
        ],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        text: geometry === "text" ? "" : undefined,
        textSize: geometry === "text" ? 0.5 : undefined,
      };

      setShapes((prev) => [...prev, newShape]);
      setSelectedShapeId(newShape.id);
      saveState();
    },
    [saveState]
  );

  const removeShape = useCallback(
    (shapeId) => {
      saveState();
      setShapes((prev) => prev.filter((shape) => shape.id !== shapeId));
      if (selectedShapeId === shapeId) {
        setSelectedShapeId(null);
      }
    },
    [selectedShapeId, saveState]
  );

  const duplicateShape = useCallback(() => {
    if (!selectedShape) return;

    const duplicated = {
      ...selectedShape,
      id: Date.now().toString(),
      position: [
        selectedShape.position[0] + 0.5,
        selectedShape.position[1],
        selectedShape.position[2],
      ],
    };

    saveState();
    setShapes((prev) => [...prev, duplicated]);
    setSelectedShapeId(duplicated.id);
  }, [selectedShape, saveState]);

  const updateShape = useCallback((shapeId, updates) => {
    setShapes((prev) =>
      prev.map((shape) =>
        shape.id === shapeId ? { ...shape, ...updates } : shape
      )
    );
  }, []);

  const handleShapeClick = useCallback((shapeId) => {
    setSelectedShapeId(shapeId);
  }, []);

  const handleShapeUpdate = useCallback((shapeId) => {
    setShapes((prev) => [...prev]);
  }, []);

  const setCameraView = useCallback((preset) => {
    setCameraPreset(preset);
    setTimeout(() => setCameraPreset(null), 100);
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;

    const prevStates = [...undoStack];
    const stateToRestore = prevStates.pop();
    setUndoStack(prevStates);

    setRedoStack((prev) => [...prev, shapes]);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [undoStack, shapes]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const nextStates = [...redoStack];
    const stateToRestore = nextStates.pop();
    setRedoStack(nextStates);

    setUndoStack((prev) => [...prev, shapes]);
    setShapes(stateToRestore);
    setSelectedShapeId(null);
  }, [redoStack, shapes]);

  const exportGLB = useCallback(() => {
    if (!sceneRef.current || shapes.length === 0) {
      if (shapes.length === 0) {
        alert("No shapes to export. Please add some shapes first.");
      } else {
        alert("Scene not ready for export. Please try again.");
      }
      return;
    }

    try {
      const exportScene = new THREE.Scene();

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
      exportScene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
      directionalLight.position.set(10, 10, 5);
      directionalLight.castShadow = true;
      exportScene.add(directionalLight);

      let exportedCount = 0;
      shapes.forEach((shape) => {
        const mesh = createMeshFromShape(shape);
        if (mesh) {
          exportScene.add(mesh);
          exportedCount++;
        }
      });

      if (exportedCount === 0) {
        alert("No valid shapes found to export.");
        return;
      }

      exportToGLB(exportScene, `3d-model-${Date.now()}.glb`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed: " + error.message);
    }
  }, [shapes]);

  const exportJSON = useCallback(() => {
    if (shapes.length === 0) {
      alert("No shapes to export. Please add some shapes first.");
      return;
    }

    try {
      const sceneData = {
        metadata: {
          version: "1.0",
          type: "3D Model Creator Export",
          generator: "React Three Fiber",
          created: new Date().toISOString(),
        },
        shapes: shapes.map((shape) => ({
          id: shape.id,
          type: shape.geometry,
          material: shape.material,
          color: shape.color,
          position: shape.position,
          rotation: shape.rotation,
          scale: shape.scale,
          text: shape.text,
          textSize: shape.textSize,
        })),
        scene: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          totalShapes: shapes.length,
        },
      };

      const jsonString = JSON.stringify(sceneData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `3d-model-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert(`Exported ${shapes.length} shapes to JSON format!`);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed. Please check the console for details.");
    }
  }, [shapes]);

  return (
    <div className='flex flex-col h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100'>
      <style jsx>{`
        .slider-modern::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
        }

        .slider-modern::-webkit-slider-thumb:hover {
          background: #2563eb;
          box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
        }

        .slider-modern::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
      `}</style>

      {/* Modern Top Toolbar */}
      <div className='flex justify-between items-center p-6 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700/50'>
        <div className='flex items-center space-x-4'>
          <div className='flex items-center space-x-3'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>3D</span>
            </div>
            <h2 className='text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
              Model Creator
            </h2>
          </div>
          <span className='px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-medium text-white'>
            v2.0 • GLB Export
          </span>
        </div>

        <div className='flex items-center space-x-3'>
          <ModernButton
            onClick={undo}
            disabled={undoStack.length === 0}
            variant='secondary'
            size='sm'
          >
            ↶ Undo
          </ModernButton>

          <ModernButton
            onClick={redo}
            disabled={redoStack.length === 0}
            variant='secondary'
            size='sm'
          >
            ↷ Redo
          </ModernButton>

          <div className='h-6 w-px bg-slate-600'></div>

          <ModernButton onClick={exportJSON} variant='secondary' size='sm'>
            📄 JSON
          </ModernButton>

          <ModernButton onClick={exportGLB} variant='success' size='sm'>
            📦 Export GLB
          </ModernButton>
        </div>
      </div>

      <div className='flex flex-grow'>
        {/* Modern Left Sidebar */}
        <div className='w-72 p-6 bg-slate-800/50 backdrop-blur-sm border-r border-slate-700/50 overflow-y-auto'>
          {/* Tools Section */}
          <div className='mb-8'>
            <h3 className='font-semibold text-slate-200 mb-4 text-lg'>
              Transform Tools
            </h3>
            <div className='grid grid-cols-3 gap-2'>
              {["translate", "rotate", "scale"].map((toolMode) => (
                <ModernButton
                  key={toolMode}
                  onClick={() => setMode(toolMode)}
                  variant={mode === toolMode ? "primary" : "secondary"}
                  size='sm'
                  className='flex flex-col items-center justify-center h-16'
                >
                  <span className='text-lg mb-1'>
                    {toolMode === "translate"
                      ? "↔️"
                      : toolMode === "rotate"
                      ? "🔄"
                      : "⚡"}
                  </span>
                  <span className='text-xs capitalize'>{toolMode}</span>
                </ModernButton>
              ))}
            </div>
          </div>

          {/* Shapes Section */}
          <div className='mb-8'>
            <h3 className='font-semibold text-slate-200 mb-4 text-lg'>
              Add Shapes
            </h3>
            <div className='grid grid-cols-2 gap-3'>
              {shapeOptions.map((shape) => (
                <ModernButton
                  key={shape.name}
                  onClick={() => addShape(shape.geometry)}
                  variant='secondary'
                  size='sm'
                  className='flex flex-col items-center justify-center h-20 hover:bg-slate-600'
                >
                  <span className='text-xl mb-1'>{shape.icon}</span>
                  <span className='text-xs'>{shape.name}</span>
                </ModernButton>
              ))}
            </div>
          </div>

          {/* Camera Views */}
          <div>
            <h3 className='font-semibold text-slate-200 mb-4 text-lg'>
              Camera Views
            </h3>
            <div className='grid grid-cols-2 gap-2'>
              {[
                { name: "Top", preset: "top", icon: "⬆️" },
                { name: "Front", preset: "front", icon: "➡️" },
                { name: "Side", preset: "side", icon: "↗️" },
                { name: "Isometric", preset: "isometric", icon: "🎯" },
              ].map((view) => (
                <ModernButton
                  key={view.preset}
                  onClick={() => setCameraView(view.preset)}
                  variant='secondary'
                  size='sm'
                  className='flex items-center justify-center space-x-2'
                >
                  <span>{view.icon}</span>
                  <span className='text-xs'>{view.name}</span>
                </ModernButton>
              ))}
            </div>
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className='flex-grow relative'>
          <Canvas
            shadows
            camera={{ position: [5, 5, 5], fov: 60 }}
            gl={{ antialias: true }}
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
            onCreated={({ gl }) => {
              if (THREE) {
                gl.shadowMap.enabled = true;
                gl.shadowMap.type = THREE.PCFSoftShadowMap;
              }
            }}
          >
            <Scene
              shapes={shapes}
              selectedShapeId={selectedShapeId}
              mode={mode}
              onShapeClick={handleShapeClick}
              onShapeUpdate={handleShapeUpdate}
              orbitControlsEnabled={orbitControlsEnabled}
              sceneRef={sceneRef}
            />
            {cameraPreset && <CameraController preset={cameraPreset} />}
          </Canvas>

          {/* Modern Info Overlay */}
          <div className='absolute bottom-6 left-6 p-4 bg-black/20 backdrop-blur-md rounded-xl border border-white/10'>
            <div className='flex items-center space-x-4 text-white/90'>
              <div className='flex items-center space-x-2'>
                <span className='w-2 h-2 bg-green-400 rounded-full'></span>
                <span className='text-sm font-medium'>
                  {shapes.length} Objects
                </span>
              </div>
              <div className='w-px h-4 bg-white/20'></div>
              <span className='text-sm'>
                Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </span>
            </div>
          </div>

          {selectedShape && (
            <div className='absolute top-6 left-6 p-4 bg-blue-500/20 backdrop-blur-md rounded-xl border border-blue-400/30'>
              <div className='text-blue-100 text-sm font-medium'>
                Selected:{" "}
                {selectedShape.geometry === "text"
                  ? `Text: "${selectedShape.text || "Empty"}"`
                  : selectedShape.geometry.charAt(0).toUpperCase() +
                    selectedShape.geometry.slice(1)}
              </div>
            </div>
          )}
        </div>

        {/* Modern Right Sidebar - Properties */}
        <div className='w-80 p-6 bg-slate-800/50 backdrop-blur-sm border-l border-slate-700/50 overflow-y-auto'>
          {selectedShape ? (
            <div className='space-y-6'>
              {/* Header */}
              <div className='flex justify-between items-center'>
                <h3 className='font-semibold text-slate-100 text-lg'>
                  Properties
                </h3>
                <div className='flex space-x-2'>
                  <ModernButton
                    onClick={duplicateShape}
                    variant='secondary'
                    size='sm'
                    className='p-2'
                    title='Duplicate'
                  >
                    📋
                  </ModernButton>
                  <ModernButton
                    onClick={() => removeShape(selectedShape.id)}
                    variant='danger'
                    size='sm'
                    className='p-2'
                    title='Delete'
                  >
                    🗑️
                  </ModernButton>
                </div>
              </div>

              {/* Shape Info Card */}
              <div className='p-4 bg-slate-700/50 rounded-xl border border-slate-600/50'>
                <div className='text-sm text-slate-300 mb-1'>Shape Type</div>
                <div className='text-lg font-medium text-slate-100 capitalize'>
                  {selectedShape.geometry === "text"
                    ? "3D Text"
                    : selectedShape.geometry}
                </div>
              </div>

              {/* Text Content for Text shapes */}
              {selectedShape.geometry === "text" && (
                <div className='space-y-4'>
                  <ModernInput
                    label='Text Content'
                    value={selectedShape.text || ""}
                    onChange={(value) =>
                      updateShape(selectedShape.id, { text: value })
                    }
                    placeholder='Enter your text...'
                  />

                  <ModernSlider
                    label='Text Size'
                    value={selectedShape.textSize || 0.5}
                    min={0.1}
                    max={2}
                    step={0.1}
                    onChange={(value) =>
                      updateShape(selectedShape.id, { textSize: value })
                    }
                  />
                </div>
              )}

              {/* Position Controls */}
              <div className='space-y-3'>
                <h4 className='font-medium text-slate-200'>Position</h4>
                {["X", "Y", "Z"].map((axis, index) => (
                  <ModernSlider
                    key={axis}
                    label={`${axis} Position`}
                    value={selectedShape.position[index]}
                    min={-10}
                    max={10}
                    step={0.1}
                    onChange={(value) => {
                      const newPosition = [...selectedShape.position];
                      newPosition[index] = value;
                      updateShape(selectedShape.id, { position: newPosition });
                    }}
                  />
                ))}
              </div>

              {/* Rotation Controls */}
              <div className='space-y-3'>
                <h4 className='font-medium text-slate-200'>Rotation</h4>
                {["X", "Y", "Z"].map((axis, index) => (
                  <ModernSlider
                    key={axis}
                    label={`${axis} Rotation`}
                    value={(selectedShape.rotation[index] * 180) / Math.PI}
                    min={-180}
                    max={180}
                    step={5}
                    unit='°'
                    onChange={(degrees) => {
                      const radians = (degrees * Math.PI) / 180;
                      const newRotation = [...selectedShape.rotation];
                      newRotation[index] = radians;
                      updateShape(selectedShape.id, { rotation: newRotation });
                    }}
                  />
                ))}
              </div>

              {/* Scale Controls */}
              <div className='space-y-3'>
                <h4 className='font-medium text-slate-200'>Scale</h4>
                {["X", "Y", "Z"].map((axis, index) => (
                  <ModernSlider
                    key={axis}
                    label={`${axis} Scale`}
                    value={selectedShape.scale[index]}
                    min={0.1}
                    max={3}
                    step={0.1}
                    onChange={(value) => {
                      const newScale = [...selectedShape.scale];
                      newScale[index] = Math.max(0.1, value);
                      updateShape(selectedShape.id, { scale: newScale });
                    }}
                  />
                ))}
              </div>

              {/* Material Selection */}
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-3'>
                  Material
                </label>
                <select
                  value={selectedShape.material}
                  onChange={(e) =>
                    updateShape(selectedShape.id, { material: e.target.value })
                  }
                  className='w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                >
                  {materialOptions.map((mat) => (
                    <option key={mat.type} value={mat.type}>
                      {mat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Control */}
              <div>
                <label className='block text-sm font-medium text-slate-300 mb-3'>
                  Color
                </label>
                <div className='flex items-center space-x-3'>
                  <input
                    type='color'
                    value={selectedShape.color}
                    onChange={(e) =>
                      updateShape(selectedShape.id, { color: e.target.value })
                    }
                    className='w-12 h-12 rounded-lg border-2 border-slate-600 cursor-pointer'
                  />
                  <input
                    type='text'
                    value={selectedShape.color}
                    onChange={(e) =>
                      updateShape(selectedShape.id, { color: e.target.value })
                    }
                    className='flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h4 className='font-medium text-slate-200 mb-3'>
                  Quick Actions
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  <ModernButton
                    onClick={() =>
                      updateShape(selectedShape.id, { scale: [1, 1, 1] })
                    }
                    variant='secondary'
                    size='sm'
                  >
                    Reset Scale
                  </ModernButton>
                  <ModernButton
                    onClick={() =>
                      updateShape(selectedShape.id, { rotation: [0, 0, 0] })
                    }
                    variant='secondary'
                    size='sm'
                  >
                    Reset Rotation
                  </ModernButton>
                  <ModernButton
                    onClick={() =>
                      updateShape(selectedShape.id, { position: [0, 0.5, 0] })
                    }
                    variant='secondary'
                    size='sm'
                  >
                    Center Object
                  </ModernButton>
                  <ModernButton
                    onClick={() =>
                      updateShape(selectedShape.id, {
                        color: `#${Math.floor(
                          Math.random() * 16777215
                        ).toString(16)}`,
                      })
                    }
                    variant='accent'
                    size='sm'
                  >
                    Random Color
                  </ModernButton>
                </div>
              </div>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='text-6xl mb-6'>🎨</div>
              <h3 className='text-xl font-semibold text-slate-200 mb-4'>
                Create Your 3D Scene
              </h3>
              <p className='text-slate-400 mb-8 leading-relaxed'>
                Select a shape to edit its properties or add new objects to get
                started.
              </p>
              <div className='space-y-3 w-full'>
                <ModernButton
                  onClick={() => addShape("box")}
                  variant='primary'
                  className='w-full'
                >
                  🧊 Add Cube
                </ModernButton>
                <ModernButton
                  onClick={() => addShape("text")}
                  variant='success'
                  className='w-full'
                >
                  📝 Add 3D Text
                </ModernButton>
                <ModernButton
                  onClick={() => addShape("sphere")}
                  variant='accent'
                  className='w-full'
                >
                  ⚪ Add Sphere
                </ModernButton>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modern Status Bar */}
      <div className='flex justify-between items-center px-6 py-3 bg-slate-800/90 backdrop-blur-sm border-t border-slate-700/50'>
        <div className='flex items-center space-x-4 text-sm text-slate-300'>
          <div className='flex items-center space-x-2'>
            <div className='w-2 h-2 bg-green-400 rounded-full'></div>
            <span>
              {shapes.length} {shapes.length === 1 ? "object" : "objects"} in
              scene
            </span>
          </div>
          {selectedShape && (
            <>
              <div className='w-px h-4 bg-slate-600'></div>
              <span>
                Selected:{" "}
                {selectedShape.geometry === "text"
                  ? `Text: "${selectedShape.text || "Empty"}"`
                  : selectedShape.geometry}
              </span>
            </>
          )}
        </div>
        <div className='text-xs text-slate-400'>
          Modern 3D Creator • Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
        </div>
      </div>
    </div>
  );
}
