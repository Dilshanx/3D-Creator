"use client";
import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";

export default function Model() {
  const group = useRef();
  const { scene, animations } = useGLTF("/model.glb");
  const { actions } = useAnimations(animations, group);

  // Play the first animation if available
  useEffect(() => {
    if (actions && animations.length > 0) {
      const action = actions[animations[0].name];
      if (action) {
        action.play();
      }
    }
  }, [actions, animations]);

  // Manual rotation (for auto-turntable)
  // useFrame(() => {
  //   if (group.current) {
  //     group.current.rotation.y += 0.01;
  //   }
  // });

  return <primitive object={scene} ref={group} />;
}
