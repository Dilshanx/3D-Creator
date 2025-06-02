"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Example if you add controls

const SceneContainer = ({ onSceneSetup, animate }) => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const frameIdRef = useRef(null);
  const cleanupFnRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || rendererRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    // Aligning with ModelViewer3D.jsx reference's typical scene background
    scene.background = new THREE.Color(0x18181b); // Dark slate gray, similar to studioDark
    // scene.fog = new THREE.Fog(0x18181b, 10, 50); // Optional fog matching background

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(3, 4, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); // Alpha false if bg is set
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Consistent tone mapping and color space with reference ModelViewer3D.jsx
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Example of adding controls manually if needed for this non-R3F setup
    // const controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.minDistance = 1;
    // controls.maxDistance = 50;

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
      // if (controls) controls.update(); // If manual OrbitControls are used
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animateLoop();

    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current)
        return;
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
      // if (controls) controls.dispose(); // If manual OrbitControls are used

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
  }, [onSceneSetup, animate]); // Dependencies

  return (
    <div
      ref={containerRef}
      className='h-full w-full bg-slate-900 rounded-lg overflow-hidden'
    />
  ); // Added bg for container itself
};

export default SceneContainer;
