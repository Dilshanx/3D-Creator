import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  memo,
} from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { create3DShape } from "../lib/three-helpers";
import { ANIMATION_PRESETS_DATA, saneNumber } from "../lib/constants";
import { toast as sonnerToast } from "sonner";

export const ThreeDCanvas = memo(
  forwardRef(
    (
      {
        isMounted,
        settings,
        currentShape,
        importedModel,
        isImportedModelDisplayed,
        appliedTexture,
        isAnimating,
        animationPreset,
        onDropFile,
      },
      ref
    ) => {
      // console.log("CANVAS: ThreeDCanvas rendered. Props.settings:", settings, "isMounted:", isMounted, "currentShape:", currentShape);

      const mountRef = useRef(null);
      const sceneInstance = useRef(null);
      const cameraInstance = useRef(null);
      const rendererInstance = useRef(null);
      const controlsInstance = useRef(null);
      const composerInstance = useRef(null);
      const ssaoPassInstance = useRef(null);
      const currentMesh = useRef(null);
      const animationId = useRef(null);
      const lights = useRef({ ambient: null, key: null, fill: null });
      const skyboxMesh = useRef(null);
      const envMapTexture = useRef(null);
      const currentAnimationState = useRef({
        rotation: new THREE.Euler(),
        targetRotation: new THREE.Euler(),
        floatY: 0,
        startTime: Date.now(),
      });
      const frameCount = useRef(0);

      const animationPresets = ANIMATION_PRESETS_DATA;

      useEffect(() => {
        // console.log("CANVAS: Main setup useEffect triggered. isMounted:", isMounted);
        if (!isMounted || !mountRef.current) return;
        // console.log("CANVAS: Main setup - Proceeding with Three.js initialization.");
        const currentMount = mountRef.current;

        sceneInstance.current = new THREE.Scene();

        cameraInstance.current = new THREE.PerspectiveCamera(
          50,
          currentMount.clientWidth / currentMount.clientHeight,
          0.01,
          10000
        );
        cameraInstance.current.position.set(0, 1, 5);
        cameraInstance.current.lookAt(0, 0.2, 0);

        rendererInstance.current = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
        });
        rendererInstance.current.setSize(
          currentMount.clientWidth,
          currentMount.clientHeight
        );
        rendererInstance.current.setPixelRatio(window.devicePixelRatio);
        rendererInstance.current.shadowMap.enabled = true;
        rendererInstance.current.shadowMap.type = THREE.PCFSoftShadowMap;
        rendererInstance.current.outputColorSpace = THREE.SRGBColorSpace;
        rendererInstance.current.toneMapping = THREE.ACESFilmicToneMapping;
        rendererInstance.current.toneMappingExposure = 1.0;
        currentMount.appendChild(rendererInstance.current.domElement);

        controlsInstance.current = new OrbitControls(
          cameraInstance.current,
          rendererInstance.current.domElement
        );
        controlsInstance.current.enableDamping = true;
        controlsInstance.current.dampingFactor = 0.05;
        controlsInstance.current.minDistance = 0.5;
        controlsInstance.current.maxDistance = 30;
        controlsInstance.current.maxPolarAngle = Math.PI / 1.6;
        controlsInstance.current.target.set(0, 0.2, 0);

        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(
          "/brown_photostudio_02_4k.hdr",
          (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            if (sceneInstance.current) {
              sceneInstance.current.environment = texture;
              envMapTexture.current = texture;
              texture.intensity =
                settings?.sceneEnvMapIntensity !== undefined
                  ? settings.sceneEnvMapIntensity
                  : 1.0;
            }
          },
          undefined,
          (error) => {
            console.error("CANVAS: Error loading HDR:", error);
            sonnerToast.error("HDR Load Failed", {
              description: "Studio lighting map could not be loaded.",
            });
          }
        );

        // --- DEBUG: BOOSTED LIGHTS ---
        const ambientIntensity =
          settings?.sceneAmbientLightIntensity !== undefined
            ? settings.sceneAmbientLightIntensity
            : 2.0;
        const keyIntensity =
          settings?.sceneKeyLightIntensity !== undefined
            ? settings.sceneKeyLightIntensity
            : 3.0;

        lights.current.ambient = new THREE.AmbientLight(
          0xffffff,
          ambientIntensity
        );
        sceneInstance.current.add(lights.current.ambient);

        lights.current.key = new THREE.DirectionalLight(0xffffff, keyIntensity);
        lights.current.key.position.set(5, 8, 5);
        lights.current.key.castShadow = true;
        lights.current.key.shadow.mapSize.width = 2048;
        lights.current.key.shadow.mapSize.height = 2048;
        lights.current.key.shadow.camera.near = 0.5;
        lights.current.key.shadow.camera.far = 50;
        lights.current.key.shadow.bias = -0.0005;
        sceneInstance.current.add(lights.current.key);

        lights.current.fill = new THREE.DirectionalLight(
          0xa0c0ff,
          keyIntensity * 0.7
        );
        lights.current.fill.position.set(-5, 3, -3);
        sceneInstance.current.add(lights.current.fill);
        console.log(
          "CANVAS: Lights created (DEBUG: BOOSTED INTENSITY). Ambient:",
          ambientIntensity,
          "Key:",
          keyIntensity
        );
        // --- END DEBUG: BOOSTED LIGHTS ---

        composerInstance.current = new EffectComposer(rendererInstance.current);
        const renderPass = new RenderPass(
          sceneInstance.current,
          cameraInstance.current
        );
        composerInstance.current.addPass(renderPass);
        ssaoPassInstance.current = new SSAOPass(
          sceneInstance.current,
          cameraInstance.current,
          currentMount.clientWidth,
          currentMount.clientHeight
        );
        ssaoPassInstance.current.kernelRadius = 0.6;
        ssaoPassInstance.current.minDistance = 0.001;
        ssaoPassInstance.current.maxDistance = 0.03;
        composerInstance.current.addPass(ssaoPassInstance.current);
        const outputPass = new OutputPass();
        composerInstance.current.addPass(outputPass);

        const handleResize = () => {
          if (
            !currentMount ||
            !cameraInstance.current ||
            !rendererInstance.current
          )
            return;
          const width = currentMount.clientWidth;
          const height = currentMount.clientHeight;
          cameraInstance.current.aspect = width / height;
          cameraInstance.current.updateProjectionMatrix();
          rendererInstance.current.setSize(width, height);
          if (composerInstance.current) {
            composerInstance.current.setSize(width, height);
            if (ssaoPassInstance.current)
              ssaoPassInstance.current.setSize(width, height);
          }
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        const clock = new THREE.Clock();
        const animate = () => {
          animationId.current = requestAnimationFrame(animate);
          if (
            !sceneInstance.current ||
            !rendererInstance.current ||
            !cameraInstance.current ||
            !isMounted
          ) {
            if (animationId.current) cancelAnimationFrame(animationId.current);
            return;
          }
          const delta = clock.getDelta();
          if (controlsInstance.current) controlsInstance.current.update();

          // frameCount logging commented out
          // if (frameCount.current % 120 === 0 && cameraInstance.current) { /* ... */ }
          // frameCount.current++;

          if (currentMesh.current && isAnimating) {
            const preset = animationPresets[animationPreset];
            if (preset && settings) {
              const effDelta = delta * settings.animationSpeed;
              currentAnimationState.current.targetRotation.x +=
                preset.rotationSpeed[0] * 60 * effDelta;
              currentAnimationState.current.targetRotation.y +=
                preset.rotationSpeed[1] * 60 * effDelta;
              currentAnimationState.current.targetRotation.z +=
                preset.rotationSpeed[2] * 60 * effDelta;
              currentMesh.current.rotation.x = THREE.MathUtils.lerp(
                currentMesh.current.rotation.x,
                currentAnimationState.current.targetRotation.x,
                0.1
              );
              currentMesh.current.rotation.y = THREE.MathUtils.lerp(
                currentMesh.current.rotation.y,
                currentAnimationState.current.targetRotation.y,
                0.1
              );
              currentMesh.current.rotation.z = THREE.MathUtils.lerp(
                currentMesh.current.rotation.z,
                currentAnimationState.current.targetRotation.z,
                0.1
              );
              const baseMeshY =
                currentMesh.current.userData.baseY !== undefined
                  ? currentMesh.current.userData.baseY
                  : 0;
              const floatTime =
                (Date.now() - currentAnimationState.current.startTime) *
                0.001 *
                settings.animationSpeed;
              currentAnimationState.current.floatY =
                Math.sin(floatTime * (preset.floatSpeed || 0.0001) * 100) *
                (preset.floatAmplitude || 0);
              currentMesh.current.position.y =
                baseMeshY + currentAnimationState.current.floatY;
            }
          }
          if (
            composerInstance.current &&
            sceneInstance.current &&
            cameraInstance.current
          ) {
            composerInstance.current.render(delta);
          } else if (
            rendererInstance.current &&
            sceneInstance.current &&
            cameraInstance.current
          ) {
            rendererInstance.current.render(
              sceneInstance.current,
              cameraInstance.current
            );
          }
        };
        animate();

        return () => {
          window.removeEventListener("resize", handleResize);
          if (animationId.current) cancelAnimationFrame(animationId.current);
          controlsInstance.current?.dispose();
          envMapTexture.current?.dispose();
          if (skyboxMesh.current) {
            sceneInstance.current?.remove(skyboxMesh.current);
            skyboxMesh.current.geometry?.dispose();
            skyboxMesh.current.material?.dispose();
            skyboxMesh.current = null;
          }
          if (currentMesh.current) {
            sceneInstance.current?.remove(currentMesh.current);
            currentMesh.current.traverse((obj) => {
              if (obj.geometry) obj.geometry.dispose();
              if (obj.material) {
                const materials = Array.isArray(obj.material)
                  ? obj.material
                  : [obj.material];
                materials.forEach((mat) => {
                  if (mat.map) mat.map.dispose();
                  Object.values(mat).forEach((val) => {
                    if (val instanceof THREE.Texture) val.dispose();
                  });
                  mat.dispose();
                });
              }
            });
            currentMesh.current = null;
          }
          composerInstance.current?.passes.forEach((pass) => {
            if (typeof pass.dispose === "function") pass.dispose();
          });
          composerInstance.current = null;
          ssaoPassInstance.current?.dispose?.();
          ssaoPassInstance.current = null;
          sceneInstance.current?.traverse((obj) => {
            if (obj.isLight && obj.shadow && obj.shadow.map)
              obj.shadow.map.dispose();
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const materials = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              materials.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                Object.values(mat).forEach((val) => {
                  if (val instanceof THREE.Texture) val.dispose();
                });
                mat.dispose();
              });
            }
          });
          sceneInstance.current = null;
          if (rendererInstance.current) {
            rendererInstance.current.dispose();
            if (mountRef.current && rendererInstance.current.domElement) {
              try {
                mountRef.current.removeChild(
                  rendererInstance.current.domElement
                );
              } catch (e) {
                /* console.warn("CANVAS: Error removing renderer DOM on cleanup:", e); */
              }
            }
            rendererInstance.current = null;
          }
          cameraInstance.current = null;
          controlsInstance.current = null;
          envMapTexture.current = null;
          lights.current = { ambient: null, key: null, fill: null };
        };
      }, [isMounted]);

      useEffect(() => {
        if (
          !isMounted ||
          !sceneInstance.current ||
          !rendererInstance.current ||
          !settings
        )
          return;
        if (skyboxMesh.current) {
          sceneInstance.current.remove(skyboxMesh.current);
          skyboxMesh.current.geometry?.dispose();
          skyboxMesh.current.material?.dispose();
          skyboxMesh.current = null;
        }
        sceneInstance.current.background = null;
        sceneInstance.current.fog = null;
        if (rendererInstance.current)
          rendererInstance.current.toneMappingExposure = 1.0;
        let topC,
          bottomC,
          fogC,
          fogNear = 8,
          fogFar = 30;
        switch (settings.background) {
          case "modernGradient":
            topC = new THREE.Color(0x3a7ca5);
            bottomC = new THREE.Color(0x1e3b49);
            fogC = new THREE.Color(0x2c5d72);
            break;
          case "darkSpace":
            sceneInstance.current.background = new THREE.Color(0x0a0a10);
            fogC = new THREE.Color(0x050508);
            fogNear = 10;
            fogFar = 35;
            break;
          case "softLight":
            sceneInstance.current.background = new THREE.Color(0xe0e8f0);
            fogC = new THREE.Color(0xd0d8e0);
            fogNear = 7;
            fogFar = 28;
            if (rendererInstance.current)
              rendererInstance.current.toneMappingExposure = 0.9;
            break;
          case "studioDark":
            sceneInstance.current.background = new THREE.Color(0x18181b);
            fogC = new THREE.Color(0x101012);
            fogNear = 12;
            fogFar = 40;
            break;
          case "studioLight":
            sceneInstance.current.background = new THREE.Color(0xf4f4f5);
            fogC = new THREE.Color(0xe4e4e7);
            fogNear = 10;
            fogFar = 35;
            if (rendererInstance.current)
              rendererInstance.current.toneMappingExposure = 0.85;
            break;
          default:
            sceneInstance.current.background = new THREE.Color(0x18181b);
            fogC = new THREE.Color(0x101012);
        }
        if (settings.background === "modernGradient" && topC && bottomC) {
          const gradGeom = new THREE.SphereGeometry(50, 32, 32);
          const gradMat = new THREE.ShaderMaterial({
            uniforms: {
              topColor: { value: topC },
              bottomColor: { value: bottomC },
              offset: { value: 33 },
              exponent: { value: 0.6 },
            },
            vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(position, 1.0); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
            fragmentShader: `uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float exponent; varying vec3 vWorldPosition; void main() { float h = normalize(vWorldPosition + offset).y; gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0); }`,
            side: THREE.BackSide,
          });
          skyboxMesh.current = new THREE.Mesh(gradGeom, gradMat);
          sceneInstance.current.add(skyboxMesh.current);
        }
        if (fogC)
          sceneInstance.current.fog = new THREE.Fog(fogC, fogNear, fogFar);
      }, [settings?.background, isMounted, settings]);

      useEffect(() => {
        if (!isMounted || !lights.current.ambient || !settings) return;
        lights.current.ambient.intensity = settings.sceneAmbientLightIntensity;
      }, [settings?.sceneAmbientLightIntensity, isMounted, settings]);

      useEffect(() => {
        if (
          !isMounted ||
          !lights.current.key ||
          !lights.current.fill ||
          !settings
        )
          return;
        lights.current.key.intensity = settings.sceneKeyLightIntensity;
        lights.current.fill.intensity = settings.sceneKeyLightIntensity * 0.5;
      }, [settings?.sceneKeyLightIntensity, isMounted, settings]);

      useEffect(() => {
        if (!isMounted || !settings) return;
        if (sceneInstance.current && sceneInstance.current.environment) {
          sceneInstance.current.environment.intensity =
            settings.sceneEnvMapIntensity;
        }
        if (currentMesh.current) {
          currentMesh.current.traverse((child) => {
            if (child.isMesh && child.material) {
              const materialsToUpdate = Array.isArray(child.material)
                ? child.material
                : [child.material];
              materialsToUpdate.forEach((mat) => {
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  mat.envMapIntensity = settings.sceneEnvMapIntensity;
                  mat.needsUpdate = true;
                }
              });
            }
          });
        }
      }, [
        settings?.sceneEnvMapIntensity,
        isMounted,
        importedModel,
        currentShape,
        settings,
      ]);

      useEffect(() => {
        if (!isMounted || !sceneInstance.current || !settings) {
          return;
        }
        if (currentMesh.current) {
          sceneInstance.current.remove(currentMesh.current);
          currentMesh.current.traverse((obj) => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
              const materials = Array.isArray(obj.material)
                ? obj.material
                : [obj.material];
              materials.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
              });
            }
          });
          currentMesh.current = null;
        }

        let newMesh;
        if (isImportedModelDisplayed && importedModel && importedModel.scene) {
          newMesh = importedModel.scene.clone(true);
          const box = new THREE.Box3().setFromObject(newMesh);
          const sizeVec = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(
            saneNumber(sizeVec.x, 1),
            saneNumber(sizeVec.y, 1),
            saneNumber(sizeVec.z, 1)
          );
          const desiredDisplaySize = 3;
          const scaleFactor = maxDim > 0 ? desiredDisplaySize / maxDim : 1;
          newMesh.scale.set(
            saneNumber(scaleFactor, 1),
            saneNumber(scaleFactor, 1),
            saneNumber(scaleFactor, 1)
          );
          const scaledBox = new THREE.Box3().setFromObject(newMesh);
          const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
          if (
            !isNaN(scaledCenter.x) &&
            !isNaN(scaledCenter.y) &&
            !isNaN(scaledCenter.z)
          ) {
            newMesh.position.sub(scaledCenter);
          } else {
            newMesh.position.set(0, 0, 0);
          }
          newMesh.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (child.material) {
                if (Array.isArray(child.material)) {
                  child.material.forEach((m) => (m.side = THREE.DoubleSide));
                } else {
                  child.material.side = THREE.DoubleSide;
                }
              }
            }
          });
        } else {
          newMesh = create3DShape(currentShape, settings, 1.5);
          if (newMesh) {
            newMesh.castShadow = true;
            newMesh.receiveShadow = true;
          }
        }

        if (newMesh) {
          if (appliedTexture) {
            newMesh.traverse((child) => {
              if (child.isMesh && child.material) {
                const materials = Array.isArray(child.material)
                  ? child.material
                  : [child.material];
                materials.forEach((material) => {
                  if (
                    material.isMeshStandardMaterial ||
                    material.isMeshPhysicalMaterial ||
                    material.isMeshPhongMaterial ||
                    material.isMeshBasicMaterial
                  ) {
                    if (material.map && material.map !== appliedTexture)
                      material.map.dispose();
                    material.map = appliedTexture;
                    material.needsUpdate = true;
                  }
                });
              }
            });
          }
          newMesh.traverse((child) => {
            if (child.isMesh && child.material) {
              const materialsToUpdate = Array.isArray(child.material)
                ? child.material
                : [child.material];
              materialsToUpdate.forEach((mat) => {
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  mat.envMapIntensity = settings.sceneEnvMapIntensity;
                  mat.needsUpdate = true;
                }
              });
            }
          });

          let baseMeshY = 0;
          if (!isImportedModelDisplayed && newMesh.geometry) {
            newMesh.geometry.computeBoundingBox();
            if (newMesh.geometry.boundingBox) {
              baseMeshY = -newMesh.geometry.boundingBox.min.y;
              newMesh.position.y = baseMeshY;
            } else {
              newMesh.position.y = 0;
            }
          } else {
            newMesh.position.y = 0;
          }
          newMesh.userData.baseY = baseMeshY;

          currentAnimationState.current.floatY = newMesh.position.y;
          currentAnimationState.current.targetRotation.set(0, 0, 0);
          newMesh.rotation.set(0, 0, 0);
          sceneInstance.current.add(newMesh);
          currentMesh.current = newMesh;
        }
      }, [
        currentShape,
        settings.extrudeDepth,
        settings.quality,
        settings.shapeColor,
        settings.materialType,
        isMounted,
        importedModel,
        isImportedModelDisplayed,
        appliedTexture,
        settings.sceneEnvMapIntensity,
      ]);

      useImperativeHandle(ref, () => ({
        getRenderer: () => rendererInstance.current,
        getScene: () => sceneInstance.current,
        getCamera: () => cameraInstance.current,
        getComposer: () => composerInstance.current,
        resetControls: () => {
          if (controlsInstance.current) {
            controlsInstance.current.reset();
            controlsInstance.current.target.set(0, 0.2, 0);
          }
          if (currentMesh.current) {
            currentMesh.current.rotation.set(0, 0, 0);
            const baseMeshY =
              currentMesh.current.userData.baseY !== undefined
                ? currentMesh.current.userData.baseY
                : 0;
            currentMesh.current.position.y = baseMeshY;
          }
          currentAnimationState.current.targetRotation.set(0, 0, 0);
          currentAnimationState.current.floatY = currentMesh.current
            ? currentMesh.current.position.y
            : 0;
          currentAnimationState.current.startTime = Date.now();
        },
        getCurrentMesh: () => currentMesh.current,
      }));

      return (
        <div
          ref={mountRef}
          className='w-full h-full rounded-lg overflow-hidden bg-transparent'
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onDrop={onDropFile}
        />
      );
    }
  )
);
ThreeDCanvas.displayName = "ThreeDCanvas";
