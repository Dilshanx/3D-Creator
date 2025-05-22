"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";

const SceneContainer = ({ onSceneSetup, animate }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  const cleanupFnRef = useRef(null);

  // Setup scene
  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent multiple initializations
    if (rendererRef.current) {
      console.log("Renderer already exists, skipping initialization");
      return;
    }

    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Call onSceneSetup callback and store cleanup function
    if (onSceneSetup && typeof onSceneSetup === "function") {
      try {
        const cleanup = onSceneSetup(scene, camera, renderer);
        cleanupFnRef.current = cleanup;
      } catch (error) {
        console.error("Error in onSceneSetup:", error);
      }
    }

    // Setup animation loop
    const animateScene = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      // Call custom animate function if provided
      if (animate && typeof animate === "function") {
        animate();
      }

      // Render scene
      rendererRef.current.render(sceneRef.current, cameraRef.current);

      // Request next frame
      frameIdRef.current = requestAnimationFrame(animateScene);
    };

    // Start animation loop
    animateScene();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) {
        return;
      }

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      // Call custom cleanup function if provided
      if (cleanupFnRef.current && typeof cleanupFnRef.current === "function") {
        try {
          cleanupFnRef.current();
        } catch (error) {
          console.error("Error in cleanup function:", error);
        }
      }

      // Cancel animation frame
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Remove renderer from DOM
      if (containerRef.current && rendererRef.current) {
        try {
          containerRef.current.removeChild(rendererRef.current.domElement);
        } catch (error) {
          console.error("Error removing renderer from DOM:", error);
        }
      }

      // Dispose resources
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }

      // Remove event listeners
      window.removeEventListener("resize", handleResize);

      // Clear references
      sceneRef.current = null;
      cameraRef.current = null;
      frameIdRef.current = null;
      cleanupFnRef.current = null;
    };
  }, [onSceneSetup, animate]);

  return <div ref={containerRef} className='h-full w-full' />;
};

export default SceneContainer;
