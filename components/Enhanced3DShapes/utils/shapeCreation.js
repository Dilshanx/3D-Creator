import * as THREE from "three";
import { createAdvancedMaterial } from "./materialCreation"; // Ensure this path is correct
import { shapes as shapesDataArray } from "./shapesData"; // Ensure this path is correct

// --- Individual Shape Creators ---

export const createEnhancedHeartShape = (size = 1) => {
  const shape = new THREE.Shape();
  const x = 0,
    y = 0;
  shape.moveTo(x, y);
  shape.bezierCurveTo(
    x,
    y - size * 0.25,
    x - size * 0.4,
    y - size * 0.4,
    x - size * 0.6,
    y - size * 0.1
  );
  shape.bezierCurveTo(
    x - size * 0.7,
    y + size * 0.1,
    x - size * 0.6,
    y + size * 0.35,
    x - size * 0.4,
    y + size * 0.5
  );
  shape.bezierCurveTo(
    x - size * 0.2,
    y + size * 0.7,
    x - size * 0.1,
    y + size * 0.85,
    x,
    y + size * 1.0
  );
  shape.bezierCurveTo(
    x + size * 0.1,
    y + size * 0.85,
    x + size * 0.2,
    y + size * 0.7,
    x + size * 0.4,
    y + size * 0.5
  );
  shape.bezierCurveTo(
    x + size * 0.6,
    y + size * 0.35,
    x + size * 0.7,
    y + size * 0.1,
    x + size * 0.6,
    y - size * 0.1
  );
  shape.bezierCurveTo(x + size * 0.4, y - size * 0.4, x, y - size * 0.25, x, y);
  return shape;
};

export const createEnhancedStarShape = (
  points = 5,
  outerRadius = 1,
  innerRadius = 0.4
) => {
  const shape = new THREE.Shape();
  const totalVertices = points * 2;

  for (let i = 0; i < totalVertices; i++) {
    const isOuterPoint = i % 2 === 0;
    const radius = isOuterPoint ? outerRadius : innerRadius;
    const angle = (i / totalVertices) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    if (i === 0) {
      shape.moveTo(x, y);
    } else {
      shape.lineTo(x, y);
    }
  }
  shape.closePath();
  return shape;
};

export const createEnhancedCrownShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(-size, -size * 0.5);
  shape.quadraticCurveTo(-size, -size * 0.45, -size * 0.9, -size * 0.4);
  shape.quadraticCurveTo(-size * 0.7, -size * 0.35, -size * 0.6, -size * 0.25);
  shape.quadraticCurveTo(-size * 0.55, size * 0.1, -size * 0.5, size * 0.35);
  shape.quadraticCurveTo(-size * 0.45, size * 0.1, -size * 0.4, -size * 0.2);
  shape.quadraticCurveTo(-size * 0.25, -size * 0.15, -size * 0.2, -size * 0.1);
  shape.quadraticCurveTo(-size * 0.1, size * 0.6, 0, size * 0.9);
  shape.quadraticCurveTo(size * 0.1, size * 0.6, size * 0.2, -size * 0.1);
  shape.quadraticCurveTo(size * 0.25, -size * 0.15, size * 0.4, -size * 0.2);
  shape.quadraticCurveTo(size * 0.45, size * 0.1, size * 0.5, size * 0.35);
  shape.quadraticCurveTo(size * 0.55, size * 0.1, size * 0.6, -size * 0.25);
  shape.quadraticCurveTo(size * 0.7, -size * 0.35, size * 0.9, -size * 0.4);
  shape.quadraticCurveTo(size, -size * 0.45, size, -size * 0.5);
  shape.lineTo(-size, -size * 0.5);
  shape.closePath();
  return shape;
};

export const createEnhancedButterflyShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.bezierCurveTo(
    size * 0.1,
    size * 0.2,
    size * 0.4,
    size * 0.6,
    size * 0.6,
    size * 0.8
  );
  shape.bezierCurveTo(
    size * 0.8,
    size * 0.9,
    size * 0.9,
    size * 0.7,
    size * 0.7,
    size * 0.5
  );
  shape.bezierCurveTo(
    size * 0.85,
    size * 0.3,
    size * 0.6,
    size * 0.1,
    size * 0.3,
    size * 0.05
  );
  shape.bezierCurveTo(size * 0.15, size * 0.02, size * 0.05, -0.01, 0, 0);
  shape.bezierCurveTo(
    size * 0.05,
    -size * 0.1,
    size * 0.2,
    -size * 0.3,
    size * 0.4,
    -size * 0.4
  );
  shape.bezierCurveTo(
    size * 0.5,
    -size * 0.6,
    size * 0.4,
    -size * 0.7,
    size * 0.2,
    -size * 0.65
  );
  shape.bezierCurveTo(size * 0.1, -size * 0.4, size * 0.03, -size * 0.2, 0, 0);
  shape.bezierCurveTo(
    -size * 0.03,
    -size * 0.2,
    -size * 0.1,
    -size * 0.4,
    -size * 0.2,
    -size * 0.65
  );
  shape.bezierCurveTo(
    -size * 0.4,
    -size * 0.7,
    -size * 0.5,
    -size * 0.6,
    -size * 0.4,
    -size * 0.4
  );
  shape.bezierCurveTo(
    -size * 0.2,
    -size * 0.3,
    -size * 0.05,
    -size * 0.1,
    0,
    0
  );
  shape.bezierCurveTo(
    -size * 0.05,
    -0.01,
    -size * 0.15,
    size * 0.02,
    -size * 0.3,
    size * 0.05
  );
  shape.bezierCurveTo(
    -size * 0.6,
    size * 0.1,
    -size * 0.85,
    size * 0.3,
    -size * 0.7,
    size * 0.5
  );
  shape.bezierCurveTo(
    -size * 0.9,
    size * 0.7,
    -size * 0.8,
    size * 0.9,
    -size * 0.6,
    size * 0.8
  );
  shape.bezierCurveTo(-size * 0.4, size * 0.6, -size * 0.1, size * 0.2, 0, 0);
  shape.closePath();
  return shape;
};

export const createEnhancedLeafShape = (size = 1) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, size);
  shape.bezierCurveTo(
    size * 0.3,
    size * 0.8,
    size * 0.7,
    size * 0.4,
    size * 0.8,
    0
  );
  shape.bezierCurveTo(
    size * 0.75,
    -size * 0.3,
    size * 0.5,
    -size * 0.7,
    size * 0.2,
    -size * 0.9
  );
  shape.bezierCurveTo(size * 0.1, -size * 0.95, 0, -size * 0.98, 0, -size);
  shape.bezierCurveTo(
    0,
    -size * 0.98,
    -size * 0.05,
    -size * 0.95,
    -size * 0.15,
    -size * 0.9
  );
  shape.bezierCurveTo(
    -size * 0.35,
    -size * 0.7,
    -size * 0.5,
    -size * 0.3,
    -size * 0.4,
    0
  );
  shape.bezierCurveTo(
    -size * 0.35,
    size * 0.4,
    -size * 0.2,
    size * 0.8,
    0,
    size
  );
  shape.closePath();
  return shape;
};

export const createEnhancedTreeShape = (size = 1) => {
  const shape = new THREE.Shape();
  const trunkWidth = size * 0.15;
  const trunkHeight = size * 0.4;
  const foliageBottomY = -size * 0.5 + trunkHeight;
  const treeTopY = size * 0.5;

  shape.moveTo(-trunkWidth / 2, -size * 0.5);
  shape.lineTo(trunkWidth / 2, -size * 0.5);
  shape.lineTo(trunkWidth / 2, foliageBottomY);
  shape.lineTo(size * 0.4, foliageBottomY - size * 0.05);
  shape.lineTo(size * 0.2, foliageBottomY + size * 0.15);
  shape.lineTo(size * 0.5, foliageBottomY + size * 0.1);
  shape.lineTo(size * 0.25, foliageBottomY + size * 0.35);
  shape.lineTo(size * 0.35, foliageBottomY + size * 0.3);
  shape.lineTo(0, treeTopY);
  shape.lineTo(-size * 0.35, foliageBottomY + size * 0.3);
  shape.lineTo(-size * 0.25, foliageBottomY + size * 0.35);
  shape.lineTo(-size * 0.5, foliageBottomY + size * 0.1);
  shape.lineTo(-size * 0.2, foliageBottomY + size * 0.15);
  shape.lineTo(-size * 0.4, foliageBottomY - size * 0.05);
  shape.lineTo(-trunkWidth / 2, foliageBottomY);
  shape.closePath();
  return shape;
};

// --- Shape Configuration (Map ID to creator function) ---
const shapeCreators = {
  heart: createEnhancedHeartShape,
  star: createEnhancedStarShape, // This will use the sharp-pointed star function
  crown: createEnhancedCrownShape,
  butterfly: createEnhancedButterflyShape,
  leaf: createEnhancedLeafShape,
  tree: createEnhancedTreeShape,
};

// --- Main 3D Shape Creator ---
export const createFull3DShape = (shapeId, settings, size = 1) => {
  const creatorFunction =
    shapeCreators[shapeId.toLowerCase()] || createEnhancedHeartShape;

  let shape2D;
  if (shapeId.toLowerCase() === "star") {
    // Call createEnhancedStarShape with parameters for a "fatter" emoji-like star
    const outerRadius = size;
    const innerRadius = size * 0.55; // <<<--- INCREASED THIS VALUE for fatter points
    shape2D = createEnhancedStarShape(5, outerRadius, innerRadius);
  } else {
    // For other shapes, call their respective creator function with just 'size'
    shape2D = creatorFunction(size);
  }

  if (!(shape2D instanceof THREE.Shape)) {
    console.error(
      `Shape creator for "${shapeId}" did not return a THREE.Shape. Fallback to Box.`
    );
    const fallbackGeo = new THREE.BoxGeometry(
      size * 0.5,
      size * 0.5,
      size * 0.1
    );
    const fallbackMat = new THREE.MeshStandardMaterial({
      color: "red",
      roughness: 0.8,
      metalness: 0.1,
    });
    return new THREE.Mesh(fallbackGeo, fallbackMat);
  }

  const extrudeSettings = {
    depth: settings.extrudeDepth,
    bevelEnabled: true,
    bevelSegments:
      settings.quality === "high" ? 10 : settings.quality === "medium" ? 6 : 3,
    steps:
      settings.quality === "high" ? 5 : settings.quality === "medium" ? 3 : 1,
    bevelSize: 0.035 * (size / 1.5),
    bevelThickness: 0.025 * (size / 1.5),
    curveSegments:
      settings.quality === "high"
        ? 48
        : settings.quality === "medium"
        ? 24
        : 12,
  };

  const geometry = new THREE.ExtrudeGeometry(shape2D, extrudeSettings);
  geometry.computeVertexNormals();
  geometry.center();

  let effectiveMaterialType = settings.materialType;
  if (settings.materialType === "auto") {
    const shapeConfig = shapesDataArray.find((s) => s.id === shapeId);
    effectiveMaterialType = shapeConfig?.autoMaterial || "ceramic";
  }

  const material = createAdvancedMaterial(
    settings.shapeColor,
    effectiveMaterialType
  );
  material.userData = { type: effectiveMaterialType };

  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};
