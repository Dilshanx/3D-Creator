// "use client";

// import { useState, useRef, useEffect } from "react";
// import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// const ModelViewer = ({ modelUrl, autoRotate = true }) => {
//   const containerRef = useRef(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!containerRef.current || !modelUrl) return;

//     // Setup scene
//     const scene = new THREE.Scene();
//     scene.background = new THREE.Color(0xf5f5f5);

//     // Setup camera
//     const camera = new THREE.PerspectiveCamera(
//       75,
//       containerRef.current.clientWidth / containerRef.current.clientHeight,
//       0.1,
//       1000
//     );
//     camera.position.z = 5;

//     // Setup renderer
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(
//       containerRef.current.clientWidth,
//       containerRef.current.clientHeight
//     );

//     // Use the new color management system in Three.js r152+
//     renderer.outputColorSpace = THREE.SRGBColorSpace;

//     renderer.shadowMap.enabled = true;
//     renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//     containerRef.current.appendChild(renderer.domElement);

//     // Setup lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     scene.add(ambientLight);

//     const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     directionalLight.position.set(5, 10, 7);
//     directionalLight.castShadow = true;
//     directionalLight.shadow.mapSize.width = 1024;
//     directionalLight.shadow.mapSize.height = 1024;
//     scene.add(directionalLight);

//     // Setup controls
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.05;
//     controls.autoRotate = autoRotate;
//     controls.autoRotateSpeed = 1.0;

//     // Load model
//     const loader = new GLTFLoader();

//     loader.load(
//       modelUrl,
//       (gltf) => {
//         // Center model
//         const box = new THREE.Box3().setFromObject(gltf.scene);
//         const center = box.getCenter(new THREE.Vector3());
//         const size = box.getSize(new THREE.Vector3());

//         // Reset position
//         gltf.scene.position.sub(center);

//         // Scale to fit
//         const maxDim = Math.max(size.x, size.y, size.z);
//         const scale = 2 / maxDim;
//         gltf.scene.scale.multiplyScalar(scale);

//         scene.add(gltf.scene);
//         setIsLoaded(true);
//       },
//       (progress) => {
//         if (progress.lengthComputable) {
//           const percent = (progress.loaded / progress.total) * 100;
//           setLoadingProgress(percent);
//         }
//       },
//       (error) => {
//         console.error("Error loading model:", error);
//         setError("Failed to load 3D model");
//       }
//     );

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);
//       controls.update();
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Handle window resize
//     const handleResize = () => {
//       if (containerRef.current) {
//         const width = containerRef.current.clientWidth;
//         const height = containerRef.current.clientHeight;

//         camera.aspect = width / height;
//         camera.updateProjectionMatrix();
//         renderer.setSize(width, height);
//       }
//     };

//     window.addEventListener("resize", handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener("resize", handleResize);

//       if (containerRef.current && renderer.domElement) {
//         containerRef.current.removeChild(renderer.domElement);
//       }

//       // Dispose of resources
//       scene.traverse((object) => {
//         if (object.geometry) object.geometry.dispose();
//         if (object.material) {
//           if (Array.isArray(object.material)) {
//             object.material.forEach((material) => material.dispose());
//           } else {
//             object.material.dispose();
//           }
//         }
//       });

//       renderer.dispose();
//     };
//   }, [modelUrl, autoRotate]);

//   return (
//     <div className='relative w-full h-full min-h-[300px]'>
//       <div ref={containerRef} className='w-full h-full' />

//       {!isLoaded && !error && (
//         <div className='absolute inset-0 flex flex-col items-center justify-center bg-gray-100 bg-opacity-70'>
//           <div className='mb-2 text-gray-700'>Loading 3D Model...</div>
//           <div className='w-48 h-2 bg-gray-200 rounded-full'>
//             <div
//               className='h-full bg-blue-500 rounded-full transition-all duration-300'
//               style={{ width: `${loadingProgress}%` }}
//             />
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className='absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70'>
//           <div className='p-4 bg-red-50 text-red-500 rounded-md'>{error}</div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ModelViewer;
