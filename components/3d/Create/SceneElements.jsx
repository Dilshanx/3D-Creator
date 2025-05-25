import { Suspense, useMemo, useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

// Shape creation utilities
import createLetterShape from "../../LetterShape/CreateLetterShape";
import createNumberShape from "../../LetterShape/CreateNumberShape";
import createSpecialCharShape from "../../LetterShape/CreateSpecialCharShape";
import {
  createHeartShape,
  createStarShape,
  createCrownShape,
  createLightningShape,
  createDiamondShape,
  createShieldShape,
  createArrowShape,
  createLeafShape,
  createSwordShape,
  createButterflyShape,
} from "../../LetterShape/PopularShapes";

let useFrame, useLoader, useThree, extend;
let OrbitControls, TransformControls, Grid, Environment;

try {
  const r3f = require("@react-three/fiber");
  useFrame = r3f.useFrame;
  useLoader = r3f.useLoader;
  useThree = r3f.useThree;
  extend = r3f.extend;
} catch (error) {
  console.warn("@react-three/fiber not available for SceneElements:", error);
}

try {
  const drei = require("@react-three/drei");
  OrbitControls = drei.OrbitControls;
  TransformControls = drei.TransformControls;
  Grid = drei.Grid;
  Environment = drei.Environment;
} catch (error) {
  console.warn("@react-three/drei not available for SceneElements:", error);
}

export function exportToGLB(scene, filename = "model.glb") {
  if (!THREE || !GLTFExporter) {
    alert("THREE.js or GLTFExporter is not available for GLB export.");
    console.error("THREE.js or GLTFExporter not available.");
    return;
  }
  const exporter = new GLTFExporter();
  const options = {
    binary: true,
    onlyVisible: true,
    truncateDrawRange: true,
    embedImages: true,
    animations: scene.animations || [],
  };
  try {
    exporter.parse(
      scene,
      (result) => {
        if (!(result instanceof ArrayBuffer)) {
          console.error(
            "GLTFExporter.parse() result is not an ArrayBuffer:",
            result
          );
          alert("GLB Export failed: Invalid export result.");
          return;
        }
        const blob = new Blob([result], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert(`GLB file exported successfully as ${filename}!`);
      },
      (error) => {
        console.error("GLB Export parse failed:", error);
        alert(
          "GLB Export failed during parsing: " +
            (error?.message || String(error))
        );
      },
      options
    );
  } catch (error) {
    console.error("GLB Export setup failed:", error);
    alert("GLB Export setup failed: " + (error?.message || String(error)));
  }
}

const createTextGeometryForR3F = (text, size) => {
  if (!THREE) return new THREE.BoxGeometry(0.1, 0.1, 0.1);
  try {
    const textLength = text.length;
    const spacing = size * 0.8;
    const depth = size * 0.3;
    const charGeometries = [];

    for (let i = 0; i < textLength; i++) {
      const char = text[i];
      if (char === " ") continue;

      let characterShapes = [];
      const xOffset = (i - textLength / 2 + 0.5) * spacing;

      if (/[0-9]/.test(char))
        characterShapes = [createNumberShape(char, size)].filter(Boolean);
      else if (/[A-Za-z]/.test(char))
        characterShapes = [createLetterShape(char, size)].filter(Boolean);
      else {
        const specialShapes = createSpecialCharShape(char, size);
        if (specialShapes)
          characterShapes = Array.isArray(specialShapes)
            ? specialShapes
            : [specialShapes];
      }

      const extrudeSettings = {
        depth,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: size * 0.03,
        bevelThickness: size * 0.02,
      };
      characterShapes.forEach((shape) => {
        if (shape instanceof THREE.Shape) {
          try {
            const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geom.translate(xOffset, 0, -depth / 2);
            charGeometries.push(geom);
          } catch (e) {
            console.warn(`Failed to extrude char ${char}:`, e);
          }
        } else {
          console.warn(`Invalid shape generated for char ${char}`);
        }
      });
    }

    if (charGeometries.length === 0)
      return new THREE.BoxGeometry(0.1, 0.1, 0.1);

    if (
      THREE.BufferGeometryUtils &&
      THREE.BufferGeometryUtils.mergeGeometries
    ) {
      const merged = THREE.BufferGeometryUtils.mergeGeometries(
        charGeometries,
        false
      );
      if (merged) {
        merged.center();
        charGeometries.forEach((g) => g.dispose());
        return merged;
      }
    }

    if (charGeometries.length === 1) {
      charGeometries[0].center();
      return charGeometries[0];
    }

    console.warn(
      "Text geometry merge failed. Using placeholder for multi-character text."
    );
    const placeholder = new THREE.BoxGeometry(
      text.length * size * 0.6 || 0.1,
      size || 0.1,
      depth || 0.1
    );
    charGeometries.forEach((g) => g.dispose());
    return placeholder;
  } catch (error) {
    console.error("Failed to create text geometry:", error);
    return new THREE.BoxGeometry(
      text.length * size * 0.6 || 0.1,
      size || 0.1,
      size * 0.3 || 0.1
    );
  }
};

export const createMeshFromShape = async (shapeData) => {
  if (!THREE) {
    console.error("THREE.js is not available.");
    return null;
  }
  try {
    let geometry;
    const shapeTypeProp = shapeData.type || shapeData.geometry;
    const extrudeDepth = shapeData.extrudeDepth || 0.2;
    const shapeSize = shapeData.shapeSize || 1;

    switch (shapeTypeProp) {
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
        const pyramidGeom = new THREE.BufferGeometry();
        const pyramidVertices = new Float32Array([
          -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
        ]);
        const pyramidIndices = [
          0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0,
        ];
        pyramidGeom.setIndex(pyramidIndices);
        pyramidGeom.setAttribute(
          "position",
          new THREE.Float32BufferAttribute(pyramidVertices, 3)
        );
        pyramidGeom.computeVertexNormals();
        pyramidGeom.translate(0, -0.5, 0);
        geometry = pyramidGeom;
        break;
      case "text":
        geometry = createTextGeometryForR3F(
          shapeData.text || "3D",
          shapeData.textSize || 0.5
        );
        break;
      case "customExtruded":
        let twoDShape;
        const s = shapeSize;
        switch (shapeData.shapeType?.toLowerCase()) {
          case "heart":
            twoDShape = createHeartShape(s);
            break;
          case "star":
            twoDShape = createStarShape(5, s, s * 0.4);
            break;
          case "crown":
            twoDShape = createCrownShape(s);
            break;
          case "lightning":
            twoDShape = createLightningShape(s);
            break;
          case "diamond":
            twoDShape = createDiamondShape(s);
            break;
          case "shield":
            twoDShape = createShieldShape(s);
            break;
          case "arrow":
            twoDShape = createArrowShape(s);
            break;
          case "leaf":
            twoDShape = createLeafShape(s);
            break;
          case "sword":
            twoDShape = createSwordShape(s);
            break;
          case "butterfly":
            twoDShape = createButterflyShape(s);
            break;
          default:
            twoDShape = new THREE.Shape()
              .moveTo(-s / 2, -s / 2)
              .lineTo(s / 2, -s / 2)
              .lineTo(s / 2, s / 2)
              .lineTo(-s / 2, s / 2)
              .closePath();
        }
        if (!(twoDShape instanceof THREE.Shape)) {
          console.warn(
            "Invalid 2D shape created for customExtruded, using fallback."
          );
          twoDShape = new THREE.Shape()
            .moveTo(-0.5, -0.5)
            .lineTo(0.5, -0.5)
            .lineTo(0.5, 0.5)
            .lineTo(-0.5, 0.5)
            .closePath();
        }
        const extrudeSettings = {
          depth: extrudeDepth,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: extrudeDepth * 0.05,
          bevelThickness: extrudeDepth * 0.05,
        };
        geometry = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
        geometry.center();
        break;
      case "imagePlane":
        geometry = new THREE.PlaneGeometry(
          shapeData.planeWidth || 1,
          shapeData.planeHeight || 1
        );
        break;
      case "importedGLB":
        console.warn(
          "createMeshFromShape is not intended for 'importedGLB' type during direct mesh creation. GLB data should be cloned from loadedGltfObjects."
        );
        return null;
      default:
        console.warn(
          `Unknown shape type "${shapeTypeProp}", using default box.`
        );
        geometry = new THREE.BoxGeometry(1, 1, 1);
    }

    let material;
    if (shapeTypeProp === "imagePlane") {
      if (!shapeData.imageDataUrl) {
        console.warn(
          "ImagePlane has no imageDataUrl for export, using placeholder material."
        );
        material = new THREE.MeshBasicMaterial({
          color: 0xcccccc,
          side: THREE.DoubleSide,
          transparent: true,
        });
      } else {
        const textureLoader = new THREE.TextureLoader();
        try {
          const texture = await new Promise((resolve, reject) => {
            textureLoader.load(
              shapeData.imageDataUrl,
              (tex) => {
                tex.colorSpace = THREE.SRGBColorSpace;
                resolve(tex);
              },
              undefined,
              (err) => {
                console.error("Failed to load texture for export:", err);
                reject(err);
              }
            );
          });
          material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
            transparent: true,
          });
        } catch (error) {
          console.error(
            "Error creating material for image plane, using fallback:",
            error
          );
          material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            side: THREE.DoubleSide,
            transparent: true,
          });
        }
      }
    } else {
      const color = new THREE.Color(shapeData.color || "#ffffff");
      const pbrProps = {
        color,
        roughness:
          shapeData.roughness !== undefined ? shapeData.roughness : 0.5,
        metalness:
          shapeData.metalness !== undefined ? shapeData.metalness : 0.0,
      };
      switch (shapeData.material) {
        case "standard":
          material = new THREE.MeshStandardMaterial(pbrProps);
          break;
        case "physical":
          material = new THREE.MeshPhysicalMaterial(pbrProps);
          break;
        case "toon":
          material = new THREE.MeshToonMaterial({ color });
          break;
        case "basic":
          material = new THREE.MeshBasicMaterial({ color });
          break;
        case "lambert":
          material = new THREE.MeshLambertMaterial({ color });
          break;
        case "phong":
          material = new THREE.MeshPhongMaterial({ color, shininess: 30 });
          break;
        case "wireframe":
          material = new THREE.MeshBasicMaterial({ color, wireframe: true });
          break;
        default:
          material = new THREE.MeshStandardMaterial(pbrProps);
      }
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(shapeData.position);
    mesh.rotation.fromArray(shapeData.rotation);
    mesh.scale.fromArray(shapeData.scale);
    mesh.name = `shape_${shapeData.id}_${shapeTypeProp}_${
      shapeData.name || shapeData.shapeType || ""
    }`;
    mesh.castShadow = shapeTypeProp !== "imagePlane";
    mesh.receiveShadow = true;
    return mesh;
  } catch (error) {
    console.error(
      "Critical error in createMeshFromShape for shape:",
      shapeData,
      error
    );
    return null;
  }
};

function ExtrudedCustomShapeGeometry({
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
}) {
  const geometry = useMemo(() => {
    if (!THREE) return null;
    let twoDShape;
    const s = shapeSize;
    switch (shapeType?.toLowerCase()) {
      case "heart":
        twoDShape = createHeartShape(s);
        break;
      case "star":
        twoDShape = createStarShape(5, s, s * 0.4);
        break;
      case "crown":
        twoDShape = createCrownShape(s);
        break;
      case "lightning":
        twoDShape = createLightningShape(s);
        break;
      case "diamond":
        twoDShape = createDiamondShape(s);
        break;
      case "shield":
        twoDShape = createShieldShape(s);
        break;
      case "arrow":
        twoDShape = createArrowShape(s);
        break;
      case "leaf":
        twoDShape = createLeafShape(s);
        break;
      case "sword":
        twoDShape = createSwordShape(s);
        break;
      case "butterfly":
        twoDShape = createButterflyShape(s);
        break;
      default:
        twoDShape = new THREE.Shape()
          .moveTo(-s / 2, -s / 2)
          .lineTo(s / 2, -s / 2)
          .lineTo(s / 2, s / 2)
          .lineTo(-s / 2, s / 2)
          .closePath();
    }
    if (!(twoDShape instanceof THREE.Shape)) {
      console.warn(
        `ExtrudedCustomShapeGeometry: Invalid 2D shape for type "${shapeType}", using fallback.`
      );
      twoDShape = new THREE.Shape()
        .moveTo(-0.5, -0.5)
        .lineTo(0.5, -0.5)
        .lineTo(0.5, 0.5)
        .lineTo(-0.5, 0.5)
        .closePath();
    }
    const extrudeSettings = {
      depth: extrudeDepth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: extrudeDepth * 0.05,
      bevelThickness: extrudeDepth * 0.05,
    };
    try {
      const geom = new THREE.ExtrudeGeometry(twoDShape, extrudeSettings);
      geom.center();
      return geom;
    } catch (e) {
      console.error(`Error extruding custom shape ${shapeType}:`, e);
      return new THREE.BoxGeometry(s, s, extrudeDepth);
    }
  }, [shapeType, shapeSize, extrudeDepth]);

  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' />;
}

function PyramidGeometryR3F(props) {
  const geometry = useMemo(() => {
    if (!THREE) return null;
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.5, 0, -0.5, 0.5, 0, -0.5, 0.5, 0, 0.5, -0.5, 0, 0.5, 0, 1, 0,
    ]);
    const indices = [0, 1, 2, 0, 2, 3, 0, 4, 1, 1, 4, 2, 2, 4, 3, 3, 4, 0];
    geom.setIndex(indices);
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geom.computeVertexNormals();
    geom.translate(0, -0.5, 0);
    return geom;
  }, []);
  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' {...props} />;
}

function RealTextGeometryR3F({ text = "", size = 0.5 }) {
  const geometry = useMemo(() => {
    if (!text.trim()) return new THREE.BoxGeometry(0.01, 0.01, 0.01);
    return createTextGeometryForR3F(text, size);
  }, [text, size]);

  if (!geometry) return <boxGeometry args={[0.1, 0.1, 0.1]} />;
  return <primitive object={geometry} attach='geometry' />;
}

const xAxis = new THREE.Vector3(1, 0, 0);
const yAxis = new THREE.Vector3(0, 1, 0);
const zAxis = new THREE.Vector3(0, 0, 1);

function Shape({
  id,
  position,
  rotation,
  scale,
  type,
  material: materialType,
  color,
  roughness,
  metalness,
  name,
  onClick,
  text,
  textSize,
  shapeType,
  shapeSize = 1,
  extrudeDepth = 0.2,
  objectRef,
  animation,
  isAnimating,
  isTransformDragging,
  gltfModelScene,
  imageDataUrl,
  planeWidth,
  planeHeight,
}) {
  const localMeshRef = useRef(null);
  const orbitAngleRef = useRef(Math.random() * Math.PI * 2);

  const livePosition = useRef(new THREE.Vector3().fromArray(position));
  const liveRotation = useRef(new THREE.Euler().fromArray(rotation));
  const liveScale = useRef(new THREE.Vector3().fromArray(scale));

  useEffect(() => {
    if (objectRef) objectRef.current = localMeshRef.current;
    return () => {
      if (objectRef && objectRef.current === localMeshRef.current)
        objectRef.current = null;
    };
  }, [objectRef, localMeshRef]);

  useEffect(() => {
    livePosition.current.fromArray(position);
  }, [position]);
  useEffect(() => {
    liveRotation.current.fromArray(rotation);
  }, [rotation]);
  useEffect(() => {
    liveScale.current.fromArray(scale);
  }, [scale]);

  useFrame((state, delta) => {
    if (!localMeshRef.current) return;

    localMeshRef.current.scale.copy(liveScale.current);

    let targetPosition = livePosition.current.clone();
    let targetRotationEuler = liveRotation.current.clone();

    if (
      isAnimating &&
      !isTransformDragging &&
      animation &&
      animation.type !== "none"
    ) {
      const effectiveSpeed = (animation.speed || 1) * delta;
      switch (animation.type) {
        case "rotate":
          if (animation.axis === "x") targetRotationEuler.x += effectiveSpeed;
          else if (animation.axis === "y")
            targetRotationEuler.y += effectiveSpeed;
          else if (animation.axis === "z")
            targetRotationEuler.z += effectiveSpeed;
          liveRotation.current.copy(targetRotationEuler);
          break;
        case "orbit":
          orbitAngleRef.current += effectiveSpeed * 0.2;
          const radius = animation.orbitRadius || 5;
          const cX = animation.orbitCenter?.[0] || 0;
          const cY =
            animation.orbitCenter?.[1] !== undefined
              ? animation.orbitCenter[1]
              : livePosition.current.y;
          const cZ = animation.orbitCenter?.[2] || 0;
          const plane = animation.orbitPlane || "xz";
          if (plane === "xz")
            targetPosition.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );
          else if (plane === "xy")
            targetPosition.set(
              cX + Math.cos(orbitAngleRef.current) * radius,
              cY + Math.sin(orbitAngleRef.current) * radius,
              cZ
            );
          else if (plane === "yz")
            targetPosition.set(
              cX,
              cY + Math.cos(orbitAngleRef.current) * radius,
              cZ + Math.sin(orbitAngleRef.current) * radius
            );
          livePosition.current.copy(targetPosition);
          break;
      }
    }
    localMeshRef.current.position.copy(targetPosition);
    localMeshRef.current.rotation.copy(targetRotationEuler);
  });

  useEffect(() => {
    if (animation?.type !== "orbit") {
      orbitAngleRef.current = Math.random() * Math.PI * 2;
    }
  }, [animation?.type]);

  const texture = useMemo(() => {
    if (type === "imagePlane" && imageDataUrl && useLoader) {
      return useLoader(THREE.TextureLoader, imageDataUrl);
    }
    return null;
  }, [type, imageDataUrl]);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
    }
  }, [texture]);

  const proceduralGeometry = useMemo(() => {
    switch (type) {
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
        return <PyramidGeometryR3F />;
      case "text":
        return (
          <Suspense
            fallback={
              <mesh>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color='orange' wireframe />
              </mesh>
            }
          >
            <RealTextGeometryR3F text={text || ""} size={textSize || 0.5} />
          </Suspense>
        );
      case "customExtruded":
        return (
          <ExtrudedCustomShapeGeometry
            shapeType={shapeType}
            shapeSize={shapeSize}
            extrudeDepth={extrudeDepth}
          />
        );
      case "imagePlane":
        return <planeGeometry args={[planeWidth || 1, planeHeight || 1]} />;
      default:
        return <boxGeometry args={[0.1, 0.1, 0.1]} />;
    }
  }, [
    type,
    text,
    textSize,
    shapeType,
    shapeSize,
    extrudeDepth,
    planeWidth,
    planeHeight,
  ]);

  const proceduralMaterial = useMemo(() => {
    if (type === "importedGLB") return null;
    if (type === "imagePlane") {
      if (texture)
        return (
          <meshBasicMaterial
            map={texture}
            side={THREE.DoubleSide}
            transparent={true}
          />
        );
      return (
        <meshBasicMaterial
          color={0xcccccc}
          side={THREE.DoubleSide}
          transparent={true}
          wireframe
        />
      );
    }
    const pbrProps = { color, roughness, metalness };
    switch (materialType) {
      case "standard":
        return <meshStandardMaterial {...pbrProps} />;
      case "physical":
        return (
          <meshPhysicalMaterial
            {...pbrProps}
            transmission={0}
            ior={1.5}
            thickness={0.1}
          />
        );
      case "toon":
        return <meshToonMaterial color={color} />;
      case "basic":
        return <meshBasicMaterial color={color} />;
      case "lambert":
        return <meshLambertMaterial color={color} />;
      case "phong":
        return <meshPhongMaterial color={color} shininess={30} />;
      case "wireframe":
        return <meshBasicMaterial color={color} wireframe />;
      default:
        return <meshStandardMaterial {...pbrProps} />;
    }
  }, [type, materialType, color, roughness, metalness, texture]);

  const objectName = `shape_${id}_${type}_${name || shapeType || ""}`;

  if (type === "importedGLB") {
    if (!gltfModelScene) return null;
    return (
      <primitive
        ref={localMeshRef}
        object={gltfModelScene}
        onClick={(e) => {
          e.stopPropagation();
          onClick(id, e);
        }}
        name={objectName}
        onPointerOver={(e) => e.stopPropagation()}
        onPointerOut={(e) => e.stopPropagation()}
      />
    );
  } else {
    return (
      <Suspense
        fallback={
          <mesh name={`${objectName}_loading`}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color='gray' wireframe />
          </mesh>
        }
      >
        <mesh
          ref={localMeshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick(id, e);
          }}
          castShadow={type !== "imagePlane"}
          receiveShadow
          name={objectName}
          onPointerOver={(e) => e.stopPropagation()}
          onPointerOut={(e) => e.stopPropagation()}
        >
          {proceduralGeometry}
          {proceduralMaterial}
        </mesh>
      </Suspense>
    );
  }
}

function SceneLighting() {
  const lightRef = useRef();
  const hdrPath = "/brown_photostudio_02_4k.hdr";

  return (
    <>
      {Environment && typeof Environment !== "string" && hdrPath ? (
        <Suspense fallback={null}>
          <Environment files={hdrPath} background={false} blur={0.5} />
        </Suspense>
      ) : (
        <directionalLight intensity={0.5} position={[5, 5, 5]} />
      )}
      <ambientLight intensity={0.7} />
      <directionalLight
        ref={lightRef}
        position={[8, 15, 10]}
        intensity={1.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0005}
      />
      <pointLight position={[-10, -10, -10]} color={0xffeedd} intensity={0.6} />
      <hemisphereLight
        skyColor={0xe6f0ff}
        groundColor={0xb0b0b0}
        intensity={0.4}
      />
    </>
  );
}

export function MainScene({
  shapes,
  selectedShapeId,
  mode,
  onShapeClick,
  onShapeUpdate,
  orbitControlsEnabled,
  sceneRef,
  isAnimating,
  loadedGltfObjects,
}) {
  const { scene, gl, camera } = useThree();
  const [transformObject, setTransformObject] = useState(null);
  const selectedObjectInternalRef = useRef(null);
  const [isTransformDragging, setIsTransformDragging] = useState(false);

  useEffect(() => {
    if (sceneRef) sceneRef.current = scene;
  }, [scene, sceneRef]);

  useEffect(() => {
    if (selectedShapeId) {
      const currentSelectedShapeData = shapes.find(
        (s) => s.id === selectedShapeId
      );
      if (
        currentSelectedShapeData &&
        selectedObjectInternalRef.current &&
        selectedObjectInternalRef.current.name.startsWith(
          `shape_${selectedShapeId}`
        )
      ) {
        if (transformObject !== selectedObjectInternalRef.current) {
          setTransformObject(selectedObjectInternalRef.current);
        }
      } else if (!currentSelectedShapeData) {
        if (transformObject !== null) setTransformObject(null);
        selectedObjectInternalRef.current = null;
      }
    } else {
      if (transformObject !== null) setTransformObject(null);
      selectedObjectInternalRef.current = null;
    }
  }, [selectedShapeId, shapes, transformObject]);

  useEffect(() => {
    if (
      selectedShapeId &&
      selectedObjectInternalRef.current &&
      selectedObjectInternalRef.current.name.startsWith(
        `shape_${selectedShapeId}`
      )
    ) {
      if (transformObject !== selectedObjectInternalRef.current) {
        setTransformObject(selectedObjectInternalRef.current);
      }
    } else if (!selectedShapeId && transformObject !== null) {
      setTransformObject(null);
    }
  }, [selectedShapeId, selectedObjectInternalRef.current, transformObject]);

  return (
    <>
      <SceneLighting />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
        name='ground_plane'
      >
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {Grid && typeof Grid !== "string" && (
        <Grid
          args={[100, 100]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.6}
          cellColor={new THREE.Color("#6f6f6f")}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={new THREE.Color("#9d4b4b")}
          fadeDistance={60}
          fadeStrength={1}
          infiniteGrid
          followCamera={false}
        />
      )}

      {shapes.map((shapeData) => {
        const gltfSceneForShape =
          shapeData.type === "importedGLB"
            ? loadedGltfObjects[shapeData.id]?.scene
            : null;
        return (
          <Shape
            key={shapeData.id}
            {...shapeData}
            gltfModelScene={gltfSceneForShape}
            animation={shapeData.animation}
            isAnimating={isAnimating}
            onClick={onShapeClick}
            objectRef={
              shapeData.id === selectedShapeId
                ? selectedObjectInternalRef
                : null
            }
            isTransformDragging={
              shapeData.id === selectedShapeId && isTransformDragging
            }
          />
        );
      })}

      {selectedShapeId &&
        transformObject &&
        mode &&
        TransformControls &&
        typeof TransformControls !== "string" && (
          <TransformControls
            object={transformObject}
            mode={mode}
            onObjectChange={() => {
              if (selectedShapeId && transformObject) {
                onShapeUpdate(selectedShapeId);
              }
            }}
            onDraggingChanged={(event) => {
              const dragging = event.value;
              setIsTransformDragging(dragging);
              const orbitCtrl = scene.__r3f?.controls;
              if (orbitCtrl)
                orbitCtrl.enabled = !dragging && orbitControlsEnabled;
            }}
            size={0.75}
            space={mode === "scale" ? "local" : "world"}
            camera={camera}
            domElement={gl.domElement}
          />
        )}

      {OrbitControls && typeof OrbitControls !== "string" && (
        <OrbitControls
          enabled={orbitControlsEnabled && !isTransformDragging}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={1}
          maxDistance={100}
          zoomSpeed={0.7}
          panSpeed={0.7}
        />
      )}
    </>
  );
} // Correctly ends MainScene function here

export function CameraController({ preset }) {
  const { camera } = useThree();
  const controls = useThree((state) => state.controls);

  const cameraPresets = useMemo(
    () => ({
      top: { position: [0, 15, 0.01], target: [0, 0, 0] },
      front: { position: [0, 2, 15], target: [0, 1, 0] },
      side: { position: [15, 2, 0], target: [0, 1, 0] },
      isometric: { position: [10, 10, 10], target: [0, 0, 0] },
    }),
    []
  );

  useEffect(() => {
    if (preset && cameraPresets[preset] && camera) {
      const { position, target } = cameraPresets[preset];
      camera.position.set(...position);
      if (controls && controls.target) {
        controls.target.set(...target);
        controls.update();
      } else {
        camera.lookAt(new THREE.Vector3(...target));
      }
      camera.updateProjectionMatrix();
    }
  }, [preset, camera, controls, cameraPresets]);

  return null;
}
