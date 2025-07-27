// src/components/Enhanced3DShapes/utils/materialCreation.js
import * as THREE from "three";

export const createAdvancedMaterial = (
  baseColorHex,
  materialType = "standard"
) => {
  const color = new THREE.Color(baseColorHex); // Convert hex string to THREE.Color

  const commonProps = { color, side: THREE.DoubleSide };

  const materials = {
    metallic: new THREE.MeshStandardMaterial({
      ...commonProps,
      metalness: 0.85,
      roughness: 0.15,
      envMapIntensity: 1.2,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      ...commonProps,
      metalness: 0.05,
      roughness: 0.05,
      transmission: 0.95, // Higher transmission for clearer glass
      thickness: 0.3, // Adjust for desired refraction
      transparent: true,
      opacity: 0.9, // Opacity can be lower if fully transparent is desired
    }),
    ceramic: new THREE.MeshStandardMaterial({
      ...commonProps,
      metalness: 0.05,
      roughness: 0.8, // Higher roughness for matte ceramic
    }),
    organic: new THREE.MeshLambertMaterial({
      // Lambert is good for softer, diffuse looks
      ...commonProps,
    }),
    crystal: new THREE.MeshPhysicalMaterial({
      ...commonProps,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      ior: 1.5, // Index of refraction for crystal
    }),
  };
  return materials[materialType] || materials.ceramic; // Default to ceramic
};
