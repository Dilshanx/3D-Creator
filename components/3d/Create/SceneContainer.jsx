"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
// import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'; // If loading HDR manually
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // For manual controls

const SceneContainer = ({ onSceneSetup, animate }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  const cleanupFnRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || rendererRef.current) return; // Prevent re-initialization

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(3, 4, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    if (!scene.environment && !scene.background) {
      scene.background = new THREE.Color(0x1a1a2e);
    }

    if (onSceneSetup && typeof onSceneSetup === "function") {
      try {
        const cleanup = onSceneSetup(scene, camera, renderer);
        if (typeof cleanup === "function") {
          cleanupFnRef.current = cleanup;
        }
      } catch (error) {
        console.error("Error in onSceneSetup:", error);
      }
    }

    const animateLoop = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
        frameIdRef.current = null;
        return;
      }
      frameIdRef.current = requestAnimationFrame(animateLoop);
      if (animate && typeof animate === "function") {
        animate();
      }
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animateLoop();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
        frameIdRef.current = null;
      }
      window.removeEventListener("resize", handleResize);

      if (cleanupFnRef.current) {
        try {
          cleanupFnRef.current();
        } catch (error) {
          console.error("Error in SceneContainer cleanup function:", error);
        }
        cleanupFnRef.current = null;
      }

      if (rendererRef.current) {
        if (
          containerRef.current &&
          rendererRef.current.domElement.parentNode === containerRef.current
        ) {
          try {
            containerRef.current.removeChild(rendererRef.current.domElement);
          } catch (e) {
            console.warn(
              "Could not remove renderer domElement during cleanup:",
              e
            );
          }
        }
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      sceneRef.current = null;
      cameraRef.current = null;
    };
  }, []); // Empty dependency array for mount/unmount behavior

  return <div ref={containerRef} className='h-full w-full' />;
};

export default SceneContainer;
