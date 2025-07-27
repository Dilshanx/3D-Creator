import * as THREE from "three";
import { saneNumber } from "./constants";

// --- Shape Creation Functions ---
export const createCatShape = (size = 1) => {
  // console.log("HELPER: createCatShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(0), saneNumber(s * 0.8));
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.8),
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.8)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.8),
    saneNumber(-s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(s * 0.6),
    saneNumber(s * 0.8),
    saneNumber(0),
    saneNumber(s * 0.8)
  );
  const ear1 = new THREE.Path();
  ear1.moveTo(saneNumber(-s * 0.4), saneNumber(s * 0.6));
  ear1.lineTo(saneNumber(-s * 0.7), saneNumber(s * 1.2));
  ear1.lineTo(saneNumber(-s * 0.1), saneNumber(s * 0.9));
  ear1.closePath();
  const ear2 = new THREE.Path();
  ear2.moveTo(saneNumber(s * 0.4), saneNumber(s * 0.6));
  ear2.lineTo(saneNumber(s * 0.7), saneNumber(s * 1.2));
  ear2.lineTo(saneNumber(s * 0.1), saneNumber(s * 0.9));
  ear2.closePath();
  shape.holes.push(ear1);
  shape.holes.push(ear2);
  return shape;
};
export const createBirdShape = (size = 1) => {
  // console.log("HELPER: createBirdShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(0), saneNumber(s * 0.6));
  shape.bezierCurveTo(
    saneNumber(-s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.9),
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.6)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(s * 0.6),
    saneNumber(-s * 0.6)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.9),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.8),
    saneNumber(s * 0.4),
    saneNumber(0),
    saneNumber(s * 0.6)
  );
  const wing = new THREE.Path();
  wing.moveTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
  wing.bezierCurveTo(
    saneNumber(-s * 0.7),
    saneNumber(s * 0.3),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.5),
    saneNumber(-s * 0.3)
  );
  wing.bezierCurveTo(
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.1),
    saneNumber(-s * 0.1),
    saneNumber(s * 0.1),
    saneNumber(-s * 0.3),
    saneNumber(s * 0.2)
  );
  shape.holes.push(wing);
  return shape;
};
export const createFishShape = (size = 1) => {
  // console.log("HELPER: createFishShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-s * 0.8), saneNumber(0));
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(s * 0.4),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.5),
    saneNumber(s * 0.2),
    saneNumber(s * 0.3)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.6),
    saneNumber(s * 0.2),
    saneNumber(s * 0.8),
    saneNumber(0),
    saneNumber(s * 0.8),
    saneNumber(0)
  );
  shape.bezierCurveTo(
    saneNumber(s * 0.6),
    saneNumber(-s * 0.2),
    saneNumber(s * 0.2),
    saneNumber(-s * 0.3),
    saneNumber(-s * 0.2),
    saneNumber(-s * 0.5)
  );
  shape.bezierCurveTo(
    saneNumber(-s * 0.6),
    saneNumber(-s * 0.4),
    saneNumber(-s * 0.8),
    saneNumber(0),
    saneNumber(-s * 0.8),
    saneNumber(0)
  );
  shape.moveTo(saneNumber(s * 0.8), saneNumber(0));
  shape.lineTo(saneNumber(s * 1.2), saneNumber(s * 0.3));
  shape.lineTo(saneNumber(s * 1.0), saneNumber(0));
  shape.lineTo(saneNumber(s * 1.2), saneNumber(-s * 0.3));
  shape.lineTo(saneNumber(s * 0.8), saneNumber(0));
  return shape;
};
export const createSoccerBallShape = (size = 1) => {
  // console.log("HELPER: createSoccerBallShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const r = s * 0.8;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * r);
    const y = saneNumber(Math.sin(a) * r);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const ih = new THREE.Path();
  const ir = s * 0.4;
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * ir);
    const y = saneNumber(Math.sin(a) * ir);
    if (i === 0) ih.moveTo(x, y);
    else ih.lineTo(x, y);
  }
  ih.closePath();
  shape.holes.push(ih);
  return shape;
};
export const createTennisRacketShape = (size = 1) => {
  // console.log("HELPER: createTennisRacketShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const a = s * 0.6;
  const b = s * 0.4;
  for (let i = 0; i <= 32; i++) {
    const ang = (i / 32) * Math.PI * 2;
    const x = saneNumber(Math.cos(ang) * a);
    const y = saneNumber(Math.sin(ang) * b + s * 0.3);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(s * 0.1), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(-s * 0.1), saneNumber(-s * 0.8));
  shape.closePath();
  return shape;
};
export const createBasketballShape = (size = 1) => {
  // console.log("HELPER: createBasketballShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const r = s * 0.8;
  for (let i = 0; i <= 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * r);
    const y = saneNumber(Math.sin(a) * r);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
};
export const createPersonShape = (size = 1) => {
  // console.log("HELPER: createPersonShape called");
  const s = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const hr = s * 0.2;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * hr);
    const y = saneNumber(Math.sin(a) * hr + s * 0.6);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(-s * 0.3), saneNumber(s * 0.2));
  shape.lineTo(saneNumber(-s * 0.4), saneNumber(-s * 0.4));
  shape.lineTo(saneNumber(-s * 0.2), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(s * 0.2), saneNumber(-s * 0.8));
  shape.lineTo(saneNumber(s * 0.4), saneNumber(-s * 0.4));
  shape.lineTo(saneNumber(s * 0.3), saneNumber(s * 0.2));
  shape.closePath();
  return shape;
};
export const createRobotShape = (size = 1) => {
  // console.log("HELPER: createRobotShape called");
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.4));
  shape.closePath();
  shape.moveTo(saneNumber(-sval * 0.5), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.5), saneNumber(sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.5), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.5), saneNumber(-sval * 0.4));
  shape.closePath();
  shape.moveTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(-sval * 0.3), saneNumber(-sval * 0.8));
  shape.closePath();
  shape.moveTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.4));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.8));
  shape.closePath();
  return shape;
};
export const createPhoneShape = (size = 1) => {
  // console.log("HELPER: createPhoneShape called");
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const w = sval * 0.5;
  const h = sval * 1.0;
  const r = sval * 0.1;
  shape.moveTo(saneNumber(-w + r), saneNumber(h));
  shape.lineTo(saneNumber(w - r), saneNumber(h));
  shape.quadraticCurveTo(
    saneNumber(w),
    saneNumber(h),
    saneNumber(w),
    saneNumber(h - r)
  );
  shape.lineTo(saneNumber(w), saneNumber(-h + r));
  shape.quadraticCurveTo(
    saneNumber(w),
    saneNumber(-h),
    saneNumber(w - r),
    saneNumber(-h)
  );
  shape.lineTo(saneNumber(-w + r), saneNumber(-h));
  shape.quadraticCurveTo(
    saneNumber(-w),
    saneNumber(-h),
    saneNumber(-w),
    saneNumber(-h + r)
  );
  shape.lineTo(saneNumber(-w), saneNumber(h - r));
  shape.quadraticCurveTo(
    saneNumber(-w),
    saneNumber(h),
    saneNumber(-w + r),
    saneNumber(h)
  );
  shape.closePath();
  const screen = new THREE.Path();
  const sw = w * 0.8;
  const sh = h * 0.8;
  const sr = r * 0.5;
  screen.moveTo(saneNumber(-sw + sr), saneNumber(sh));
  screen.lineTo(saneNumber(sw - sr), saneNumber(sh));
  screen.quadraticCurveTo(
    saneNumber(sw),
    saneNumber(sh),
    saneNumber(sw),
    saneNumber(sh - sr)
  );
  screen.lineTo(saneNumber(sw), saneNumber(-sh + sr));
  screen.quadraticCurveTo(
    saneNumber(sw),
    saneNumber(-sh),
    saneNumber(sw - sr),
    saneNumber(-sh)
  );
  screen.lineTo(saneNumber(-sw + sr), saneNumber(-sh));
  screen.quadraticCurveTo(
    saneNumber(-sw),
    saneNumber(-sh),
    saneNumber(-sw),
    saneNumber(-sh + sr)
  );
  screen.lineTo(saneNumber(-sw), saneNumber(sh - sr));
  screen.quadraticCurveTo(
    saneNumber(-sw),
    saneNumber(sh),
    saneNumber(-sw + sr),
    saneNumber(sh)
  );
  screen.closePath();
  shape.holes.push(screen);
  return shape;
};
export const createLightningShape = (size = 1) => {
  // console.log("HELPER: createLightningShape called");
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  shape.moveTo(saneNumber(-sval * 0.2), saneNumber(sval * 0.8));
  shape.lineTo(saneNumber(sval * 0.3), saneNumber(sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.4), saneNumber(-sval * 0.8));
  shape.lineTo(saneNumber(-sval * 0.1), saneNumber(-sval * 0.2));
  shape.lineTo(saneNumber(sval * 0.1), saneNumber(-sval * 0.2));
  shape.lineTo(saneNumber(-sval * 0.4), saneNumber(sval * 0.8));
  shape.closePath();
  return shape;
};
export const createMusicNoteShape = (size = 1) => {
  // console.log("HELPER: createMusicNoteShape called");
  const sval = saneNumber(size, 1);
  const shape = new THREE.Shape();
  const nr = sval * 0.15;
  for (let i = 0; i <= 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const x = saneNumber(Math.cos(a) * nr - sval * 0.2);
    const y = saneNumber(Math.sin(a) * nr - sval * 0.4);
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.lineTo(saneNumber(-sval * 0.05), saneNumber(sval * 0.6));
  shape.lineTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
  shape.lineTo(saneNumber(sval * 0.05), saneNumber(-sval * 0.25));
  shape.closePath();
  shape.moveTo(saneNumber(sval * 0.05), saneNumber(sval * 0.6));
  shape.bezierCurveTo(
    saneNumber(sval * 0.4),
    saneNumber(sval * 0.5),
    saneNumber(sval * 0.3),
    saneNumber(sval * 0.2),
    saneNumber(sval * 0.05),
    saneNumber(sval * 0.3)
  );
  shape.closePath();
  return shape;
};

export const createAdvancedMaterial = (
  baseColor,
  materialType = "standard"
) => {
  // console.log("HELPER: createAdvancedMaterial called with:", baseColor, materialType, "(DEBUG: FORCING SIMPLE STANDARD)");
  const color = new THREE.Color(baseColor);

  // --- TEMPORARY DEBUG: Force a very simple, bright MeshStandardMaterial ---
  // This is currently active to ensure basic visibility with MeshStandardMaterial
  const mat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.5,
    metalness: 0.0,
    side: THREE.DoubleSide,
    // emissive: color,
    // emissiveIntensity: 0.3 // Slight emissive to help visibility if lights are an issue
  });
  // --- END TEMPORARY DEBUG ---

  // --- Original Material Logic (Commented out for debugging) ---
  // const materialPresets = {
  //   metallic: { metalness: 0.9, roughness: 0.1, envMapIntensity: 1.5 },
  //   glass: { metalness: 0.0, roughness: 0.0, transmission: 0.95, thickness: 0.7, transparent: true, opacity: 0.85, envMapIntensity: 2.0, ior: 1.52, },
  //   crystal: { metalness: 0.0, roughness: 0.01, transmission: 0.98, thickness: 0.6, transparent: true, opacity: 0.9, envMapIntensity: 2.5, ior: 1.7, },
  //   ceramic: { metalness: 0.1, roughness: 0.6, envMapIntensity: 0.8 },
  //   organic: { metalness: 0.0, roughness: 0.8, envMapIntensity: 0.5 },
  //   plastic: { metalness: 0.0, roughness: 0.3, envMapIntensity: 0.7 },
  //   neon: { metalness: 0.0, roughness: 0.1, emissive: color.clone().multiplyScalar(0.8), emissiveIntensity: 1.0, envMapIntensity: 0.2, },
  // };
  // const preset = materialPresets[materialType] || materialPresets.ceramic;
  // const sharedProps = { color, ...preset, side: THREE.DoubleSide };
  // let mat;
  // if (materialType === "glass" || materialType === "crystal") {
  //   mat = new THREE.MeshPhysicalMaterial(sharedProps);
  // } else {
  //   mat = new THREE.MeshStandardMaterial(sharedProps);
  // }
  // --- End Original Material Logic ---

  // console.log("HELPER: createAdvancedMaterial returning material (DEBUG SIMPLIFIED):", mat);
  return mat;
};

export const create3DShape = (shapeId, currentSettings, size = 1) => {
  // console.log("HELPER: create3DShape called with:", shapeId, "settings:", currentSettings);
  if (!currentSettings) {
    console.error(
      "HELPER: create3DShape called with undefined currentSettings!"
    );
    return new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.1, 0.1),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
  }
  let shapeInstance;
  let materialType =
    currentSettings.materialType === "auto"
      ? "ceramic"
      : currentSettings.materialType;

  const shapeConfigs = {
    cat: { creator: createCatShape, autoMaterial: "organic" },
    bird: { creator: createBirdShape, autoMaterial: "organic" },
    fish: { creator: createFishShape, autoMaterial: "metallic" },
    soccer: { creator: createSoccerBallShape, autoMaterial: "plastic" },
    tennis: { creator: createTennisRacketShape, autoMaterial: "plastic" },
    basketball: { creator: createBasketballShape, autoMaterial: "plastic" },
    person: { creator: createPersonShape, autoMaterial: "organic" },
    robot: { creator: createRobotShape, autoMaterial: "metallic" },
    phone: { creator: createPhoneShape, autoMaterial: "glass" },
    lightning: { creator: createLightningShape, autoMaterial: "neon" },
    music: { creator: createMusicNoteShape, autoMaterial: "metallic" },
  };
  const config = shapeConfigs[shapeId] || shapeConfigs.cat;
  if (!config || typeof config.creator !== "function") {
    console.error(
      `HELPER: No creator function for shapeId: ${shapeId}. Falling back to cat.`
    );
    shapeInstance = shapeConfigs.cat.creator(saneNumber(size, 1.5));
  } else {
    const shapeSize = saneNumber(size, 1.5);
    shapeInstance = config.creator(shapeSize);
  }

  if (currentSettings.materialType === "auto") {
    materialType = config?.autoMaterial || "ceramic";
  }

  const extrudeSettings = {
    depth: saneNumber(currentSettings.extrudeDepth, 0.4),
    bevelEnabled: true,
    bevelSegments:
      currentSettings.quality === "high"
        ? 10
        : currentSettings.quality === "medium"
        ? 6
        : 3,
    steps:
      currentSettings.quality === "high"
        ? 5
        : currentSettings.quality === "medium"
        ? 3
        : 1,
    bevelSize: saneNumber(0.035 * (saneNumber(size, 1.5) / 1.5), 0.02),
    bevelThickness: saneNumber(0.025 * (saneNumber(size, 1.5) / 1.5), 0.015),
    curveSegments:
      currentSettings.quality === "high"
        ? 48
        : currentSettings.quality === "medium"
        ? 24
        : 12,
  };

  if (!shapeInstance || typeof shapeInstance.getPoints !== "function") {
    console.error(
      "HELPER: shapeInstance not valid THREE.Shape. ShapeId:",
      shapeId,
      "Instance:",
      shapeInstance
    );
    return new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.3, 0.3),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
    );
  }

  const geometry = new THREE.ExtrudeGeometry(shapeInstance, extrudeSettings);
  geometry.computeVertexNormals();
  try {
    geometry.center();
  } catch (e) {
    console.error("HELPER: Error centering geometry:", e, shapeId);
    return new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.2, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
    );
  }
  const material = createAdvancedMaterial(
    currentSettings.shapeColor,
    materialType
  );
  const mesh = new THREE.Mesh(geometry, material);
  // console.log("HELPER: create3DShape returning mesh:", mesh, "with position attributes count:", geometry.attributes.position.count);
  return mesh;
};
