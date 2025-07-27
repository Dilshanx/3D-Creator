"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Model from "./model";

export default function ModelViewer() {
  return (
    <Canvas>
      <ambientLight />
      <directionalLight position={[2, 2, 2]} />
      <Model />
      <OrbitControls />
    </Canvas>
  );
}
