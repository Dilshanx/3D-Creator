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
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <div className='flex flex-col h-full bg-gradient-to-br from-background to-muted'>
      <Card className='m-8 max-w-md mx-auto'>
        <CardHeader className='text-center'>
          <div className='text-6xl mb-4'>⚠️</div>
          <CardTitle className='text-2xl text-destructive'>
            Missing Dependencies
          </CardTitle>
          <CardDescription>
            This component requires React Three Fiber and related packages to
            work properly.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='bg-muted p-4 rounded-lg'>
            <p className='text-sm text-muted-foreground mb-2 font-medium'>
              Install the required packages:
            </p>
            <code className='text-primary text-sm font-mono'>
              npm install @react-three/fiber @react-three/drei three
            </code>
          </div>
          <p className='text-xs text-muted-foreground text-center'>
            After installing, restart your development server.
          </p>
        </CardContent>
      </Card>
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
    <TooltipProvider>
      <div className='flex flex-col h-screen bg-gradient-to-br from-background via-muted/20 to-background'>
        {/* Modern Top Toolbar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className='flex justify-between items-center p-4 bg-card/80 backdrop-blur-sm border-b border-border/50'
        >
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-3'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg'
              >
                <span className='text-white font-bold text-lg'>3D</span>
              </motion.div>
              <div>
                <h1 className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                  Model Creator
                </h1>
                <p className='text-xs text-muted-foreground'>
                  Professional 3D Design Tool
                </p>
              </div>
            </div>
            <Badge
              variant='secondary'
              className='bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 border-blue-200'
            >
              v2.0 • GLB Export
            </Badge>
          </div>

          <div className='flex items-center space-x-2'>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={undo}
                  disabled={undoStack.length === 0}
                  variant='outline'
                  size='sm'
                  className='transition-all duration-200'
                >
                  ↶ Undo
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo last action</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={redo}
                  disabled={redoStack.length === 0}
                  variant='outline'
                  size='sm'
                  className='transition-all duration-200'
                >
                  ↷ Redo
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo last action</TooltipContent>
            </Tooltip>

            <Separator orientation='vertical' className='h-6' />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  📤 Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={exportJSON}>
                  📄 Export as JSON
                </DropdownMenuItem>
                <DropdownMenuItem onClick={exportGLB}>
                  📦 Export as GLB
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </motion.div>

        <div className='flex flex-grow'>
          {/* Modern Left Sidebar */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className='w-80 p-6 bg-card/50 backdrop-blur-sm border-r border-border/50 overflow-y-auto'
          >
            <Tabs defaultValue='tools' className='space-y-6'>
              <TabsList className='grid w-full grid-cols-3'>
                <TabsTrigger value='tools'>Tools</TabsTrigger>
                <TabsTrigger value='shapes'>Shapes</TabsTrigger>
                <TabsTrigger value='camera'>Camera</TabsTrigger>
              </TabsList>

              <TabsContent value='tools' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <span>🛠️</span>
                      <span>Transform Tools</span>
                    </CardTitle>
                    <CardDescription>
                      Select how you want to manipulate objects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-3 gap-3'>
                      {["translate", "rotate", "scale"].map((toolMode) => (
                        <Tooltip key={toolMode}>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => setMode(toolMode)}
                                variant={
                                  mode === toolMode ? "default" : "outline"
                                }
                                size='sm'
                                className='flex flex-col items-center justify-center h-16 w-full'
                              >
                                <span className='text-lg mb-1'>
                                  {toolMode === "translate"
                                    ? "↔️"
                                    : toolMode === "rotate"
                                    ? "🔄"
                                    : "⚡"}
                                </span>
                                <span className='text-xs capitalize'>
                                  {toolMode}
                                </span>
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {toolMode === "translate"
                              ? "Move objects"
                              : toolMode === "rotate"
                              ? "Rotate objects"
                              : "Scale objects"}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='shapes' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <span>🎨</span>
                      <span>Add Shapes</span>
                    </CardTitle>
                    <CardDescription>
                      Click to add new 3D objects to your scene
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                      {shapeOptions.map((shape) => (
                        <Tooltip key={shape.name}>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => addShape(shape.geometry)}
                                variant='outline'
                                size='sm'
                                className='flex flex-col items-center justify-center h-20 w-full hover:bg-primary/5 transition-all duration-200'
                              >
                                <span className='text-xl mb-1'>
                                  {shape.icon}
                                </span>
                                <span className='text-xs'>{shape.name}</span>
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Add {shape.name} to scene
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='camera' className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <span>📷</span>
                      <span>Camera Views</span>
                    </CardTitle>
                    <CardDescription>
                      Quick camera positioning presets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='grid grid-cols-2 gap-3'>
                      {[
                        { name: "Top", preset: "top", icon: "⬆️" },
                        { name: "Front", preset: "front", icon: "➡️" },
                        { name: "Side", preset: "side", icon: "↗️" },
                        { name: "Isometric", preset: "isometric", icon: "🎯" },
                      ].map((view) => (
                        <Tooltip key={view.preset}>
                          <TooltipTrigger asChild>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Button
                                onClick={() => setCameraView(view.preset)}
                                variant='outline'
                                size='sm'
                                className='flex items-center justify-center space-x-2 w-full'
                              >
                                <span>{view.icon}</span>
                                <span className='text-xs'>{view.name}</span>
                              </Button>
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            Switch to {view.name} view
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>

          {/* Main Canvas Area */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='flex-grow relative overflow-hidden'
          >
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

            {/* Modern Info Overlays */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className='absolute bottom-6 left-6'
            >
              <Card className='bg-black/20 backdrop-blur-md border-white/10'>
                <CardContent className='p-4'>
                  <div className='flex items-center space-x-4 text-white/90'>
                    <div className='flex items-center space-x-2'>
                      <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                      <span className='text-sm font-medium'>
                        {shapes.length} Objects
                      </span>
                    </div>
                    <Separator
                      orientation='vertical'
                      className='h-4 bg-white/20'
                    />
                    <span className='text-sm'>
                      Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence>
              {selectedShape && (
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  className='absolute top-6 left-6'
                >
                  <Card className='bg-blue-500/20 backdrop-blur-md border-blue-400/30'>
                    <CardContent className='p-4'>
                      <div className='text-blue-100 text-sm font-medium'>
                        Selected:{" "}
                        {selectedShape.geometry === "text"
                          ? `Text: "${selectedShape.text || "Empty"}"`
                          : selectedShape.geometry.charAt(0).toUpperCase() +
                            selectedShape.geometry.slice(1)}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Modern Right Sidebar - Properties */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className='w-80 p-6 bg-card/50 backdrop-blur-sm border-l border-border/50 overflow-y-auto'
          >
            <AnimatePresence mode='wait'>
              {selectedShape ? (
                <motion.div
                  key='properties'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='space-y-6'
                >
                  {/* Header */}
                  <div className='flex justify-between items-center'>
                    <div>
                      <h3 className='text-lg font-semibold'>Properties</h3>
                      <p className='text-sm text-muted-foreground'>
                        Customize your selected object
                      </p>
                    </div>
                    <div className='flex space-x-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={duplicateShape}
                            variant='outline'
                            size='sm'
                          >
                            📋
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Duplicate object</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => removeShape(selectedShape.id)}
                            variant='outline'
                            size='sm'
                            className='text-destructive hover:bg-destructive/10'
                          >
                            🗑️
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete object</TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Shape Info Card */}
                  <Card>
                    <CardContent className='p-4'>
                      <div className='text-sm text-muted-foreground mb-1'>
                        Shape Type
                      </div>
                      <div className='text-lg font-medium capitalize flex items-center space-x-2'>
                        <span>
                          {shapeOptions.find(
                            (s) => s.geometry === selectedShape.geometry
                          )?.icon || "🔷"}
                        </span>
                        <span>
                          {selectedShape.geometry === "text"
                            ? "3D Text"
                            : selectedShape.geometry}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Text Content for Text shapes */}
                  {selectedShape.geometry === "text" && (
                    <Card>
                      <CardHeader>
                        <CardTitle className='text-base'>
                          Text Settings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div>
                          <Label htmlFor='text-content'>Text Content</Label>
                          <Input
                            id='text-content'
                            value={selectedShape.text || ""}
                            onChange={(e) =>
                              updateShape(selectedShape.id, {
                                text: e.target.value,
                              })
                            }
                            placeholder='Enter your text...'
                            className='mt-1'
                          />
                        </div>

                        <div>
                          <Label>
                            Text Size:{" "}
                            {selectedShape.textSize?.toFixed(2) || 0.5}
                          </Label>
                          <Slider
                            value={[selectedShape.textSize || 0.5]}
                            onValueChange={([value]) =>
                              updateShape(selectedShape.id, { textSize: value })
                            }
                            max={2}
                            min={0.1}
                            step={0.1}
                            className='mt-2'
                          />
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Transform Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Transform</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      {/* Position Controls */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-sm'>Position</h4>
                        {["X", "Y", "Z"].map((axis, index) => (
                          <div key={axis}>
                            <Label className='text-xs'>
                              {axis}: {selectedShape.position[index].toFixed(2)}
                            </Label>
                            <Slider
                              value={[selectedShape.position[index]]}
                              onValueChange={([value]) => {
                                const newPosition = [...selectedShape.position];
                                newPosition[index] = value;
                                updateShape(selectedShape.id, {
                                  position: newPosition,
                                });
                              }}
                              max={10}
                              min={-10}
                              step={0.1}
                              className='mt-1'
                            />
                          </div>
                        ))}
                      </div>

                      {/* Rotation Controls */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-sm'>Rotation</h4>
                        {["X", "Y", "Z"].map((axis, index) => (
                          <div key={axis}>
                            <Label className='text-xs'>
                              {axis}:{" "}
                              {(
                                (selectedShape.rotation[index] * 180) /
                                Math.PI
                              ).toFixed(0)}
                              °
                            </Label>
                            <Slider
                              value={[
                                (selectedShape.rotation[index] * 180) / Math.PI,
                              ]}
                              onValueChange={([degrees]) => {
                                const radians = (degrees * Math.PI) / 180;
                                const newRotation = [...selectedShape.rotation];
                                newRotation[index] = radians;
                                updateShape(selectedShape.id, {
                                  rotation: newRotation,
                                });
                              }}
                              max={180}
                              min={-180}
                              step={5}
                              className='mt-1'
                            />
                          </div>
                        ))}
                      </div>

                      {/* Scale Controls */}
                      <div className='space-y-3'>
                        <h4 className='font-medium text-sm'>Scale</h4>
                        {["X", "Y", "Z"].map((axis, index) => (
                          <div key={axis}>
                            <Label className='text-xs'>
                              {axis}: {selectedShape.scale[index].toFixed(2)}
                            </Label>
                            <Slider
                              value={[selectedShape.scale[index]]}
                              onValueChange={([value]) => {
                                const newScale = [...selectedShape.scale];
                                newScale[index] = Math.max(0.1, value);
                                updateShape(selectedShape.id, {
                                  scale: newScale,
                                });
                              }}
                              max={3}
                              min={0.1}
                              step={0.1}
                              className='mt-1'
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Material and Appearance */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Appearance</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                      <div>
                        <Label>Material</Label>
                        <Select
                          value={selectedShape.material}
                          onValueChange={(value) =>
                            updateShape(selectedShape.id, { material: value })
                          }
                        >
                          <SelectTrigger className='mt-1'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {materialOptions.map((mat) => (
                              <SelectItem key={mat.type} value={mat.type}>
                                {mat.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Color</Label>
                        <div className='flex items-center space-x-3 mt-1'>
                          <input
                            type='color'
                            value={selectedShape.color}
                            onChange={(e) =>
                              updateShape(selectedShape.id, {
                                color: e.target.value,
                              })
                            }
                            className='w-12 h-10 rounded-md border border-input cursor-pointer'
                          />
                          <Input
                            value={selectedShape.color}
                            onChange={(e) =>
                              updateShape(selectedShape.id, {
                                color: e.target.value,
                              })
                            }
                            className='flex-1'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='grid grid-cols-2 gap-2'>
                        <Button
                          onClick={() =>
                            updateShape(selectedShape.id, { scale: [1, 1, 1] })
                          }
                          variant='outline'
                          size='sm'
                        >
                          Reset Scale
                        </Button>
                        <Button
                          onClick={() =>
                            updateShape(selectedShape.id, {
                              rotation: [0, 0, 0],
                            })
                          }
                          variant='outline'
                          size='sm'
                        >
                          Reset Rotation
                        </Button>
                        <Button
                          onClick={() =>
                            updateShape(selectedShape.id, {
                              position: [0, 0.5, 0],
                            })
                          }
                          variant='outline'
                          size='sm'
                        >
                          Center Object
                        </Button>
                        <Button
                          onClick={() =>
                            updateShape(selectedShape.id, {
                              color: `#${Math.floor(
                                Math.random() * 16777215
                              ).toString(16)}`,
                            })
                          }
                          variant='outline'
                          size='sm'
                        >
                          Random Color
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key='empty'
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className='flex flex-col items-center justify-center h-full text-center'
                >
                  <div className='text-6xl mb-6'>🎨</div>
                  <h3 className='text-xl font-semibold mb-4'>
                    Create Your 3D Scene
                  </h3>
                  <p className='text-muted-foreground mb-8 leading-relaxed'>
                    Select a shape to edit its properties or add new objects to
                    get started.
                  </p>
                  <div className='space-y-3 w-full'>
                    <Button onClick={() => addShape("box")} className='w-full'>
                      🧊 Add Cube
                    </Button>
                    <Button
                      onClick={() => addShape("text")}
                      variant='outline'
                      className='w-full'
                    >
                      📝 Add 3D Text
                    </Button>
                    <Button
                      onClick={() => addShape("sphere")}
                      variant='outline'
                      className='w-full'
                    >
                      ⚪ Add Sphere
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Modern Status Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className='flex justify-between items-center px-6 py-3 bg-card/80 backdrop-blur-sm border-t border-border/50'
        >
          <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
            <div className='flex items-center space-x-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span>
                {shapes.length} {shapes.length === 1 ? "object" : "objects"} in
                scene
              </span>
            </div>
            {selectedShape && (
              <>
                <Separator orientation='vertical' className='h-4' />
                <span>
                  Selected:{" "}
                  {selectedShape.geometry === "text"
                    ? `Text: "${selectedShape.text || "Empty"}"`
                    : selectedShape.geometry}
                </span>
              </>
            )}
          </div>
          <div className='text-xs text-muted-foreground'>
            Modern 3D Creator • Orbit: Mouse • Pan: Shift+Drag • Zoom: Scroll
          </div>
        </motion.div>
      </div>
    </TooltipProvider>
  );
}
