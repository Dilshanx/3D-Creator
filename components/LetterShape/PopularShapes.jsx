import * as THREE from "three";

// Heart Shape - Most popular for social media
export function createHeartShape(size = 1) {
  const shape = new THREE.Shape();
  const x = 0,
    y = 0;

  shape.moveTo(x, y);
  shape.bezierCurveTo(
    x,
    y - size * 0.3,
    x - size * 0.6,
    y - size * 0.3,
    x - size * 0.6,
    y
  );
  shape.bezierCurveTo(
    x - size * 0.6,
    y + size * 0.3,
    x,
    y + size * 0.6,
    x,
    y + size * 1.0
  );
  shape.bezierCurveTo(
    x,
    y + size * 0.6,
    x + size * 0.6,
    y + size * 0.3,
    x + size * 0.6,
    y
  );
  shape.bezierCurveTo(x + size * 0.6, y - size * 0.3, x, y - size * 0.3, x, y);

  return shape;
}

// Star Shape - Universal appeal
export function createStarShape(
  points = 5,
  outerRadius = 1,
  innerRadius = 0.5
) {
  const shape = new THREE.Shape();

  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
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
}

// Crown Shape - Premium, royal feeling
export function createCrownShape(size = 1) {
  const shape = new THREE.Shape();

  // Base
  shape.moveTo(-size, -size * 0.5);
  shape.lineTo(-size, -size * 0.3);

  // Left peak
  shape.lineTo(-size * 0.6, -size * 0.3);
  shape.lineTo(-size * 0.5, size * 0.3);
  shape.lineTo(-size * 0.4, -size * 0.3);

  // Center peak (tallest)
  shape.lineTo(-size * 0.2, -size * 0.3);
  shape.lineTo(0, size * 0.8);
  shape.lineTo(size * 0.2, -size * 0.3);

  // Right peak
  shape.lineTo(size * 0.4, -size * 0.3);
  shape.lineTo(size * 0.5, size * 0.3);
  shape.lineTo(size * 0.6, -size * 0.3);

  // Complete base
  shape.lineTo(size, -size * 0.3);
  shape.lineTo(size, -size * 0.5);
  shape.lineTo(-size, -size * 0.5);

  return shape;
}

// Lightning Bolt - Dynamic energy
export function createLightningShape(size = 1) {
  const shape = new THREE.Shape();

  shape.moveTo(-size * 0.2, size);
  shape.lineTo(size * 0.3, size);
  shape.lineTo(-size * 0.1, size * 0.2);
  shape.lineTo(size * 0.4, size * 0.2);
  shape.lineTo(size * 0.2, -size);
  shape.lineTo(-size * 0.3, -size);
  shape.lineTo(size * 0.1, -size * 0.2);
  shape.lineTo(-size * 0.4, -size * 0.2);
  shape.lineTo(-size * 0.2, size);

  return shape;
}

// Diamond/Gem Shape - Luxury appeal
export function createDiamondShape(size = 1) {
  const shape = new THREE.Shape();

  // Top facet
  shape.moveTo(0, size * 0.8);
  shape.lineTo(size * 0.3, size * 0.4);
  shape.lineTo(size * 0.6, size * 0.4);
  shape.lineTo(size * 0.4, -size * 0.8);
  shape.lineTo(0, -size);
  shape.lineTo(-size * 0.4, -size * 0.8);
  shape.lineTo(-size * 0.6, size * 0.4);
  shape.lineTo(-size * 0.3, size * 0.4);
  shape.lineTo(0, size * 0.8);

  return shape;
}

// Shield Shape - Gaming/heraldic appeal
export function createShieldShape(size = 1) {
  const shape = new THREE.Shape();

  shape.moveTo(0, size);
  shape.quadraticCurveTo(size * 0.8, size * 0.8, size * 0.8, size * 0.4);
  shape.lineTo(size * 0.8, -size * 0.2);
  shape.quadraticCurveTo(size * 0.8, -size * 0.8, 0, -size);
  shape.quadraticCurveTo(-size * 0.8, -size * 0.8, -size * 0.8, -size * 0.2);
  shape.lineTo(-size * 0.8, size * 0.4);
  shape.quadraticCurveTo(-size * 0.8, size * 0.8, 0, size);

  return shape;
}

// Arrow Shape - Directional, useful
export function createArrowShape(size = 1) {
  const shape = new THREE.Shape();

  // Arrow head
  shape.moveTo(size, 0);
  shape.lineTo(size * 0.3, size * 0.4);
  shape.lineTo(size * 0.3, size * 0.2);

  // Arrow body
  shape.lineTo(-size * 0.8, size * 0.2);
  shape.lineTo(-size * 0.8, -size * 0.2);
  shape.lineTo(size * 0.3, -size * 0.2);
  shape.lineTo(size * 0.3, -size * 0.4);
  shape.lineTo(size, 0);

  return shape;
}

// Leaf Shape - Natural, organic
export function createLeafShape(size = 1) {
  const shape = new THREE.Shape();

  shape.moveTo(0, size);
  shape.quadraticCurveTo(size * 0.6, size * 0.6, size * 0.8, 0);
  shape.quadraticCurveTo(size * 0.6, -size * 0.6, 0, -size);
  shape.quadraticCurveTo(-size * 0.3, -size * 0.3, -size * 0.2, 0);
  shape.quadraticCurveTo(-size * 0.3, size * 0.3, 0, size);

  return shape;
}

// Sword Shape - Gaming appeal
export function createSwordShape(size = 1) {
  const shape = new THREE.Shape();

  // Blade
  shape.moveTo(0, size);
  shape.lineTo(size * 0.1, size * 0.9);
  shape.lineTo(size * 0.1, -size * 0.3);

  // Guard (crossguard)
  shape.lineTo(size * 0.4, -size * 0.3);
  shape.lineTo(size * 0.4, -size * 0.4);
  shape.lineTo(size * 0.1, -size * 0.4);

  // Handle
  shape.lineTo(size * 0.1, -size * 0.8);

  // Pommel
  shape.lineTo(size * 0.15, -size * 0.8);
  shape.lineTo(size * 0.15, -size * 0.9);
  shape.lineTo(-size * 0.15, -size * 0.9);
  shape.lineTo(-size * 0.15, -size * 0.8);

  // Handle (left side)
  shape.lineTo(-size * 0.1, -size * 0.8);
  shape.lineTo(-size * 0.1, -size * 0.4);

  // Guard (left side)
  shape.lineTo(-size * 0.4, -size * 0.4);
  shape.lineTo(-size * 0.4, -size * 0.3);
  shape.lineTo(-size * 0.1, -size * 0.3);

  // Blade (left side)
  shape.lineTo(-size * 0.1, size * 0.9);
  shape.lineTo(0, size);

  return shape;
}

// Butterfly Shape - Delicate, beautiful
export function createButterflyShape(size = 1) {
  const shape = new THREE.Shape();

  // Right upper wing
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(size * 0.6, size * 0.8, size * 0.3, size);
  shape.quadraticCurveTo(size * 0.8, size * 0.6, size * 0.4, size * 0.3);
  shape.quadraticCurveTo(size * 0.2, size * 0.1, 0, 0);

  // Right lower wing
  shape.quadraticCurveTo(size * 0.1, -size * 0.2, size * 0.3, -size * 0.4);
  shape.quadraticCurveTo(size * 0.6, -size * 0.6, size * 0.2, -size * 0.8);
  shape.quadraticCurveTo(size * 0.1, -size * 0.3, 0, 0);

  // Left lower wing
  shape.quadraticCurveTo(-size * 0.1, -size * 0.3, -size * 0.2, -size * 0.8);
  shape.quadraticCurveTo(-size * 0.6, -size * 0.6, -size * 0.3, -size * 0.4);
  shape.quadraticCurveTo(-size * 0.1, -size * 0.2, 0, 0);

  // Left upper wing
  shape.quadraticCurveTo(-size * 0.2, size * 0.1, -size * 0.4, size * 0.3);
  shape.quadraticCurveTo(-size * 0.8, size * 0.6, -size * 0.3, size);
  shape.quadraticCurveTo(-size * 0.6, size * 0.8, 0, 0);

  return shape;
}

// Usage example function to create 3D extruded shapes
export function create3DShape(shapeType, size = 1, extrudeDepth = 0.2) {
  let shape;

  switch (shapeType.toLowerCase()) {
    case "heart":
      shape = createHeartShape(size);
      break;
    case "star":
      shape = createStarShape(5, size, size * 0.5);
      break;
    case "crown":
      shape = createCrownShape(size);
      break;
    case "lightning":
      shape = createLightningShape(size);
      break;
    case "diamond":
      shape = createDiamondShape(size);
      break;
    case "shield":
      shape = createShieldShape(size);
      break;
    case "arrow":
      shape = createArrowShape(size);
      break;
    case "leaf":
      shape = createLeafShape(size);
      break;
    case "sword":
      shape = createSwordShape(size);
      break;
    case "butterfly":
      shape = createButterflyShape(size);
      break;
    default:
      shape = createHeartShape(size);
  }

  // Extrude settings for nice 3D effect
  const extrudeSettings = {
    depth: extrudeDepth,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 2,
    bevelSize: extrudeDepth * 0.1,
    bevelThickness: extrudeDepth * 0.1,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  // Create attractive materials
  const materials = [
    new THREE.MeshPhongMaterial({ color: 0xff6b9d, shininess: 100 }), // Pink
    new THREE.MeshPhongMaterial({ color: 0x4ecdc4, shininess: 100 }), // Teal
    new THREE.MeshPhongMaterial({ color: 0xffd93d, shininess: 100 }), // Gold
    new THREE.MeshPhongMaterial({ color: 0x6c5ce7, shininess: 100 }), // Purple
    new THREE.MeshPhongMaterial({ color: 0xff7675, shininess: 100 }), // Red
    new THREE.MeshPhongMaterial({ color: 0x00b894, shininess: 100 }), // Green
  ];

  const material = materials[Math.floor(Math.random() * materials.length)];
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

// import React, { useRef, useEffect, useState } from "react";
// import * as THREE from "three";

// const Enhanced3DShapes = () => {
//   const mountRef = useRef(null);
//   const sceneRef = useRef(null);
//   const rendererRef = useRef(null);
//   const frameRef = useRef(null);
//   const [currentShape, setCurrentShape] = useState("heart");
//   const [isAnimating, setIsAnimating] = useState(true);

//   // Enhanced Heart Shape with more natural curves
//   const createEnhancedHeartShape = (size = 1) => {
//     const shape = new THREE.Shape();
//     const x = 0,
//       y = 0;

//     // More organic curves using multiple bezier segments
//     shape.moveTo(x, y);
//     shape.bezierCurveTo(
//       x,
//       y - size * 0.25,
//       x - size * 0.4,
//       y - size * 0.4,
//       x - size * 0.6,
//       y - size * 0.1
//     );
//     shape.bezierCurveTo(
//       x - size * 0.7,
//       y + size * 0.1,
//       x - size * 0.6,
//       y + size * 0.35,
//       x - size * 0.4,
//       y + size * 0.5
//     );
//     shape.bezierCurveTo(
//       x - size * 0.2,
//       y + size * 0.7,
//       x - size * 0.1,
//       y + size * 0.85,
//       x,
//       y + size * 1.0
//     );
//     shape.bezierCurveTo(
//       x + size * 0.1,
//       y + size * 0.85,
//       x + size * 0.2,
//       y + size * 0.7,
//       x + size * 0.4,
//       y + size * 0.5
//     );
//     shape.bezierCurveTo(
//       x + size * 0.6,
//       y + size * 0.35,
//       x + size * 0.7,
//       y + size * 0.1,
//       x + size * 0.6,
//       y - size * 0.1
//     );
//     shape.bezierCurveTo(
//       x + size * 0.4,
//       y - size * 0.4,
//       x,
//       y - size * 0.25,
//       x,
//       y
//     );

//     return shape;
//   };

//   // Enhanced Star with natural variations
//   const createEnhancedStarShape = (
//     points = 5,
//     outerRadius = 1,
//     innerRadius = 0.4
//   ) => {
//     const shape = new THREE.Shape();

//     for (let i = 0; i < points * 2; i++) {
//       // Add slight randomness for natural look
//       const variation = 0.05 * (Math.sin(i * 2.5) * 0.5 + 0.5);
//       const radius =
//         (i % 2 === 0 ? outerRadius : innerRadius) * (1 + variation);
//       const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;

//       // Smooth the points slightly
//       const smoothing = i % 2 === 0 ? 0.02 : 0.01;
//       const x = Math.cos(angle) * radius;
//       const y = Math.sin(angle) * radius;

//       if (i === 0) {
//         shape.moveTo(x, y);
//       } else {
//         // Use quadratic curves for smoother transitions
//         const prevAngle = ((i - 1) / (points * 2)) * Math.PI * 2 - Math.PI / 2;
//         const prevRadius =
//           ((i - 1) % 2 === 0 ? outerRadius : innerRadius) * (1 + variation);
//         const controlX =
//           Math.cos((angle + prevAngle) / 2) * ((radius + prevRadius) / 2) * 1.1;
//         const controlY =
//           Math.sin((angle + prevAngle) / 2) * ((radius + prevRadius) / 2) * 1.1;

//         if (i % 2 === 1) {
//           shape.quadraticCurveTo(controlX, controlY, x, y);
//         } else {
//           shape.lineTo(x, y);
//         }
//       }
//     }
//     shape.closePath();
//     return shape;
//   };

//   // Enhanced Crown with royal details
//   const createEnhancedCrownShape = (size = 1) => {
//     const shape = new THREE.Shape();

//     // Base with slight curve
//     shape.moveTo(-size, -size * 0.5);
//     shape.quadraticCurveTo(-size, -size * 0.45, -size * 0.9, -size * 0.4);

//     // Ornate peaks with curves
//     shape.quadraticCurveTo(
//       -size * 0.7,
//       -size * 0.35,
//       -size * 0.6,
//       -size * 0.25
//     );
//     shape.quadraticCurveTo(-size * 0.55, size * 0.1, -size * 0.5, size * 0.35);
//     shape.quadraticCurveTo(-size * 0.45, size * 0.1, -size * 0.4, -size * 0.2);

//     shape.quadraticCurveTo(
//       -size * 0.25,
//       -size * 0.15,
//       -size * 0.2,
//       -size * 0.1
//     );
//     shape.quadraticCurveTo(-size * 0.1, size * 0.6, 0, size * 0.9);
//     shape.quadraticCurveTo(size * 0.1, size * 0.6, size * 0.2, -size * 0.1);

//     shape.quadraticCurveTo(size * 0.25, -size * 0.15, size * 0.4, -size * 0.2);
//     shape.quadraticCurveTo(size * 0.45, size * 0.1, size * 0.5, size * 0.35);
//     shape.quadraticCurveTo(size * 0.55, size * 0.1, size * 0.6, -size * 0.25);

//     shape.quadraticCurveTo(size * 0.7, -size * 0.35, size * 0.9, -size * 0.4);
//     shape.quadraticCurveTo(size, -size * 0.45, size, -size * 0.5);
//     shape.lineTo(-size, -size * 0.5);

//     return shape;
//   };

//   // Enhanced Butterfly with realistic wing patterns
//   const createEnhancedButterflyShape = (size = 1) => {
//     const shape = new THREE.Shape();

//     // More realistic wing proportions
//     shape.moveTo(0, 0);

//     // Right upper wing - larger and more organic
//     shape.bezierCurveTo(
//       size * 0.1,
//       size * 0.2,
//       size * 0.4,
//       size * 0.6,
//       size * 0.6,
//       size * 0.8
//     );
//     shape.bezierCurveTo(
//       size * 0.8,
//       size * 0.9,
//       size * 0.9,
//       size * 0.7,
//       size * 0.7,
//       size * 0.5
//     );
//     shape.bezierCurveTo(
//       size * 0.85,
//       size * 0.3,
//       size * 0.6,
//       size * 0.1,
//       size * 0.3,
//       size * 0.05
//     );
//     shape.bezierCurveTo(size * 0.15, size * 0.02, size * 0.05, -0.01, 0, 0);

//     // Right lower wing - smaller
//     shape.bezierCurveTo(
//       size * 0.05,
//       -size * 0.1,
//       size * 0.2,
//       -size * 0.3,
//       size * 0.4,
//       -size * 0.4
//     );
//     shape.bezierCurveTo(
//       size * 0.5,
//       -size * 0.6,
//       size * 0.4,
//       -size * 0.7,
//       size * 0.2,
//       -size * 0.65
//     );
//     shape.bezierCurveTo(
//       size * 0.1,
//       -size * 0.4,
//       size * 0.03,
//       -size * 0.2,
//       0,
//       0
//     );

//     // Left wings (mirror)
//     shape.bezierCurveTo(
//       -size * 0.03,
//       -size * 0.2,
//       -size * 0.1,
//       -size * 0.4,
//       -size * 0.2,
//       -size * 0.65
//     );
//     shape.bezierCurveTo(
//       -size * 0.4,
//       -size * 0.7,
//       -size * 0.5,
//       -size * 0.6,
//       -size * 0.4,
//       -size * 0.4
//     );
//     shape.bezierCurveTo(
//       -size * 0.2,
//       -size * 0.3,
//       -size * 0.05,
//       -size * 0.1,
//       0,
//       0
//     );

//     shape.bezierCurveTo(
//       -size * 0.05,
//       -0.01,
//       -size * 0.15,
//       size * 0.02,
//       -size * 0.3,
//       size * 0.05
//     );
//     shape.bezierCurveTo(
//       -size * 0.6,
//       size * 0.1,
//       -size * 0.85,
//       size * 0.3,
//       -size * 0.7,
//       size * 0.5
//     );
//     shape.bezierCurveTo(
//       -size * 0.9,
//       size * 0.7,
//       -size * 0.8,
//       size * 0.9,
//       -size * 0.6,
//       size * 0.8
//     );
//     shape.bezierCurveTo(-size * 0.4, size * 0.6, -size * 0.1, size * 0.2, 0, 0);

//     return shape;
//   };

//   // Enhanced Leaf with natural asymmetry
//   const createEnhancedLeafShape = (size = 1) => {
//     const shape = new THREE.Shape();

//     // Natural leaf with central vein
//     shape.moveTo(0, size);
//     shape.bezierCurveTo(
//       size * 0.3,
//       size * 0.8,
//       size * 0.7,
//       size * 0.4,
//       size * 0.8,
//       0
//     );
//     shape.bezierCurveTo(
//       size * 0.75,
//       -size * 0.3,
//       size * 0.5,
//       -size * 0.7,
//       size * 0.2,
//       -size * 0.9
//     );
//     shape.bezierCurveTo(size * 0.1, -size * 0.95, 0, -size * 0.98, 0, -size);
//     shape.bezierCurveTo(
//       0,
//       -size * 0.98,
//       -size * 0.05,
//       -size * 0.95,
//       -size * 0.15,
//       -size * 0.9
//     );
//     shape.bezierCurveTo(
//       -size * 0.35,
//       -size * 0.7,
//       -size * 0.5,
//       -size * 0.3,
//       -size * 0.4,
//       0
//     );
//     shape.bezierCurveTo(
//       -size * 0.35,
//       size * 0.4,
//       -size * 0.2,
//       size * 0.8,
//       0,
//       size
//     );

//     return shape;
//   };

//   // Create advanced materials with PBR properties
//   const createAdvancedMaterial = (baseColor, materialType = "standard") => {
//     const materials = {
//       metallic: new THREE.MeshStandardMaterial({
//         color: baseColor,
//         metalness: 0.8,
//         roughness: 0.2,
//         envMapIntensity: 1.0,
//       }),
//       glass: new THREE.MeshPhysicalMaterial({
//         color: baseColor,
//         metalness: 0.0,
//         roughness: 0.0,
//         transmission: 0.8,
//         thickness: 0.5,
//         transparent: true,
//         opacity: 0.8,
//       }),
//       ceramic: new THREE.MeshStandardMaterial({
//         color: baseColor,
//         metalness: 0.1,
//         roughness: 0.3,
//       }),
//       organic: new THREE.MeshLambertMaterial({
//         color: baseColor,
//       }),
//       crystal: new THREE.MeshPhysicalMaterial({
//         color: baseColor,
//         metalness: 0.0,
//         roughness: 0.1,
//         transmission: 0.3,
//         transparent: true,
//         opacity: 0.9,
//         clearcoat: 1.0,
//         clearcoatRoughness: 0.1,
//       }),
//     };

//     return materials[materialType] || materials.standard;
//   };

//   // Enhanced shape creation with modern features
//   const createEnhanced3DShape = (shapeType, size = 1) => {
//     let shape;
//     let materialType = "ceramic";
//     let color = 0xff6b9d;

//     switch (shapeType.toLowerCase()) {
//       case "heart":
//         shape = createEnhancedHeartShape(size);
//         materialType = "organic";
//         color = 0xff4757;
//         break;
//       case "star":
//         shape = createEnhancedStarShape(5, size, size * 0.4);
//         materialType = "metallic";
//         color = 0xffd700;
//         break;
//       case "crown":
//         shape = createEnhancedCrownShape(size);
//         materialType = "metallic";
//         color = 0xdaa520;
//         break;
//       case "butterfly":
//         shape = createEnhancedButterflyShape(size);
//         materialType = "glass";
//         color = 0x6c5ce7;
//         break;
//       case "leaf":
//         shape = createEnhancedLeafShape(size);
//         materialType = "organic";
//         color = 0x00b894;
//         break;
//       default:
//         shape = createEnhancedHeartShape(size);
//         materialType = "organic";
//         color = 0xff4757;
//     }

//     // Advanced extrude settings for organic look
//     const extrudeSettings = {
//       depth: 0.3,
//       bevelEnabled: true,
//       bevelSegments: 8,
//       steps: 4,
//       bevelSize: 0.05,
//       bevelThickness: 0.03,
//       curveSegments: 32,
//     };

//     const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

//     // Smooth normals for organic appearance
//     geometry.computeVertexNormals();

//     const material = createAdvancedMaterial(color, materialType);
//     const mesh = new THREE.Mesh(geometry, material);

//     // Add subtle vertex displacement for organic feel
//     if (materialType === "organic") {
//       const positions = geometry.attributes.position;
//       for (let i = 0; i < positions.count; i++) {
//         const vertex = new THREE.Vector3().fromBufferAttribute(positions, i);
//         const noise = Math.sin(vertex.x * 10) * Math.cos(vertex.y * 10) * 0.01;
//         vertex.addScalar(noise);
//         positions.setXYZ(i, vertex.x, vertex.y, vertex.z);
//       }
//       positions.needsUpdate = true;
//       geometry.computeVertexNormals();
//     }

//     return mesh;
//   };

//   useEffect(() => {
//     if (!mountRef.current) return;

//     // Scene setup
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0x1a1a2e);

//     // Add fog for depth
//     scene.fog = new THREE.Fog(0x1a1a2e, 5, 15);

//     const camera = new THREE.PerspectiveCamera(75, 800 / 600, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(800, 600);
//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//     renderer.toneMapping = THREE.ACESFilmicToneMapping;
//     renderer.toneMappingExposure = 1.2;

//     mountRef.current.appendChild(renderer.domElement);

//     // Advanced lighting setup
//     const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 5, 5);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 2048;
//     directionalLight.shadow.mapSize.height = 2048;
//     scene.add(directionalLight);

//     // Rim lighting for dramatic effect
//     const rimLight = new THREE.DirectionalLight(0x4ecdc4, 0.5);
//     rimLight.position.set(-5, 0, -5);
//     scene.add(rimLight);

//     // Point lights for color variation
//     const pointLight1 = new THREE.PointLight(0xff6b9d, 0.8, 10);
//     pointLight1.position.set(3, 2, 3);
//     scene.add(pointLight1);

//     const pointLight2 = new THREE.PointLight(0x6c5ce7, 0.6, 8);
//     pointLight2.position.set(-3, 2, -2);
//     scene.add(pointLight2);

//     // Environment map for reflections
//     const loader = new THREE.CubeTextureLoader();

//     camera.position.set(0, 0, 5);

//     sceneRef.current = scene;
//     rendererRef.current = renderer;

//     // Create initial shape
//     const initialShape = createEnhanced3DShape(currentShape, 1.5);
//     initialShape.castShadow = true;
//     initialShape.receiveShadow = true;
//     scene.add(initialShape);

//     // Animation loop
//     const animate = () => {
//       if (!isAnimating) return;

//       frameRef.current = requestAnimationFrame(animate);

//       // Smooth rotation
//       if (scene.children.length > 5) {
//         // Skip lights
//         const shape = scene.children[scene.children.length - 1];
//         shape.rotation.y += 0.01;
//         shape.rotation.x += 0.005;

//         // Subtle floating animation
//         shape.position.y = Math.sin(Date.now() * 0.001) * 0.2;
//       }

//       // Animate lights
//       pointLight1.position.x = Math.sin(Date.now() * 0.001) * 3;
//       pointLight1.position.z = Math.cos(Date.now() * 0.001) * 3;

//       pointLight2.position.x = Math.cos(Date.now() * 0.0015) * -3;
//       pointLight2.position.z = Math.sin(Date.now() * 0.0015) * -2;

//       renderer.render(scene, camera);
//     };

//     animate();

//     return () => {
//       if (frameRef.current) {
//         cancelAnimationFrame(frameRef.current);
//       }
//       if (mountRef.current && renderer.domElement) {
//         mountRef.current.removeChild(renderer.domElement);
//       }
//       renderer.dispose();
//     };
//   }, [currentShape, isAnimating]);

//   const handleShapeChange = (newShape) => {
//     if (!sceneRef.current) return;

//     // Remove old shape
//     const oldShape =
//       sceneRef.current.children[sceneRef.current.children.length - 1];
//     if (oldShape && oldShape.type === "Mesh") {
//       sceneRef.current.remove(oldShape);
//       oldShape.geometry.dispose();
//       oldShape.material.dispose();
//     }

//     // Add new shape
//     const newShapeObj = createEnhanced3DShape(newShape, 1.5);
//     newShapeObj.castShadow = true;
//     newShapeObj.receiveShadow = true;
//     sceneRef.current.add(newShapeObj);

//     setCurrentShape(newShape);
//   };

//   const shapes = ["heart", "star", "crown", "butterfly", "leaf"];

//   return (
//     <div className='flex flex-col items-center space-y-6 p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen'>
//       <div className='text-center'>
//         <h1 className='text-4xl font-bold text-white mb-2'>
//           Enhanced Natural 3D Shapes
//         </h1>
//         <p className='text-gray-300 text-lg'>
//           Modern Three.js with PBR materials, advanced lighting & organic
//           details
//         </p>
//       </div>

//       <div
//         ref={mountRef}
//         className='border-2 border-purple-500/30 rounded-xl shadow-2xl bg-black/20 backdrop-blur-sm'
//         style={{ width: "800px", height: "600px" }}
//       />

//       <div className='flex space-x-4 flex-wrap justify-center'>
//         {shapes.map((shape) => (
//           <button
//             key={shape}
//             onClick={() => handleShapeChange(shape)}
//             className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${
//               currentShape === shape
//                 ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
//                 : "bg-gray-700 text-gray-300 hover:bg-gray-600"
//             }`}
//           >
//             {shape.charAt(0).toUpperCase() + shape.slice(1)}
//           </button>
//         ))}
//       </div>

//       <div className='flex items-center space-x-4'>
//         <button
//           onClick={() => setIsAnimating(!isAnimating)}
//           className={`px-6 py-2 rounded-lg font-medium transition-all ${
//             isAnimating
//               ? "bg-green-600 text-white hover:bg-green-700"
//               : "bg-red-600 text-white hover:bg-red-700"
//           }`}
//         >
//           {isAnimating ? "Pause Animation" : "Start Animation"}
//         </button>
//       </div>

//       <div className='max-w-4xl text-center space-y-4 text-gray-300'>
//         <h2 className='text-2xl font-semibold text-white'>
//           Modern Enhancements
//         </h2>
//         <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
//           <div className='bg-black/30 p-4 rounded-lg'>
//             <h3 className='font-semibold text-purple-300 mb-2'>
//               Advanced Materials
//             </h3>
//             <p>
//               PBR materials with metallic, glass, ceramic, and organic finishes.
//               Proper reflections and refractions.
//             </p>
//           </div>
//           <div className='bg-black/30 p-4 rounded-lg'>
//             <h3 className='font-semibold text-purple-300 mb-2'>
//               Natural Geometry
//             </h3>
//             <p>
//               Organic curves using bezier paths, subtle vertex displacement, and
//               asymmetrical variations.
//             </p>
//           </div>
//           <div className='bg-black/30 p-4 rounded-lg'>
//             <h3 className='font-semibold text-purple-300 mb-2'>
//               Cinematic Lighting
//             </h3>
//             <p>
//               Multi-light setup with rim lighting, colored point lights, and
//               soft shadows for depth.
//             </p>
//           </div>
//           <div className='bg-black/30 p-4 rounded-lg'>
//             <h3 className='font-semibold text-purple-300 mb-2'>
//               Smooth Animation
//             </h3>
//             <p>
//               Floating motion, dynamic light movement, and butter-smooth
//               rotation with proper timing.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Enhanced3DShapes;
