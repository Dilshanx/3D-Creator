import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, Star, Download, Upload, AlertTriangle } from "lucide-react";

export const FileFormatGuideCard = () => {
  return (
    <Card className='bg-slate-800/70 border-slate-700 shadow-xl'>
      <CardHeader>
        <CardTitle className='text-slate-100 flex items-center'>
          <Info size={18} className='mr-2 text-purple-400' />
          3D File Format Guide
        </CardTitle>
        <CardDescription className='text-slate-400 text-xs'>
          Capabilities of this studio for common 3D file formats.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[28rem] pr-3 text-slate-300 text-xs leading-relaxed'>
          <div className='space-y-4'>
            <div>
              <h4 className='font-semibold text-purple-300 mb-1 text-sm flex items-center'>
                <Star size={16} className='mr-1.5 text-amber-400' />
                This Studio's Support
              </h4>
              <p className='mb-1.5 text-slate-300'>
                How this application handles various 3D file formats:
              </p>
            </div>

            <div className='space-y-3'>
              <div>
                <h5 className='font-medium text-sky-300 text-[0.8rem] mb-0.5'>
                  GLB / GLTF (.glb, .gltf) - Recommended
                </h5>
                <ul className='list-disc list-inside space-y-0.5 pl-3 text-slate-400'>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Upload size={12} className='mr-1.5 text-green-400' />
                      Import:
                    </span>{" "}
                    Fully supported. Handles meshes, PBR materials, textures,
                    and animations. GLTF with external resources (like .bin,
                    textures) should be zipped or have paths resolvable.
                  </li>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Download size={12} className='mr-1.5 text-blue-400' />
                      Export:
                    </span>{" "}
                    Fully supported as **GLB** (binary format with embedded
                    assets). Includes geometry, materials, textures, and active
                    animations.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>Why:</span>{" "}
                    Efficient, web-native, and versatile for modern 3D
                    workflows.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Use For:
                    </span>{" "}
                    Most import/export tasks, especially for full scenes, PBR
                    materials, or animated models.
                  </li>
                </ul>
              </div>

              <div>
                <h5 className='font-medium text-sky-300 text-[0.8rem] mb-0.5'>
                  OBJ (.obj)
                </h5>
                <ul className='list-disc list-inside space-y-0.5 pl-3 text-slate-400'>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Upload size={12} className='mr-1.5 text-green-400' />
                      Import:
                    </span>{" "}
                    Supported for static models (geometry, UVs). Associated .MTL
                    files for materials are also supported if provided alongside
                    the .OBJ.
                  </li>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Download size={12} className='mr-1.5 text-orange-400' />
                      Export:
                    </span>{" "}
                    <span className='font-semibold text-orange-300'>
                      Simulated.
                    </span>{" "}
                    Downloads a placeholder .OBJ file. Full client-side OBJ
                    export with materials is complex. For actual OBJ export,
                    consider exporting as GLB and using an external converter.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>Why:</span>{" "}
                    Simple, broadly compatible for basic static geometry.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Use For:
                    </span>{" "}
                    Importing basic meshes or models from older software.
                  </li>
                </ul>
              </div>

              <div>
                <h5 className='font-medium text-sky-300 text-[0.8rem] mb-0.5'>
                  FBX (.fbx)
                </h5>
                <ul className='list-disc list-inside space-y-0.5 pl-3 text-slate-400'>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Upload size={12} className='mr-1.5 text-green-400' />
                      Import:
                    </span>{" "}
                    Supported. Can load models, embedded materials, animations,
                    and skeletal rigs. Performance may vary with complexity.
                  </li>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Download size={12} className='mr-1.5 text-orange-400' />
                      Export:
                    </span>{" "}
                    <span className='font-semibold text-orange-300'>
                      Simulated.
                    </span>{" "}
                    Downloads a placeholder .FBX file. Full client-side FBX
                    export is very complex.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Guidance:
                    </span>{" "}
                    For robust FBX exports, use Digital Content Creation (DCC)
                    tools like Blender, Maya, or server-side converters after
                    exporting from here as GLB.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Use For:
                    </span>{" "}
                    Importing complex models or animated characters from
                    professional game/animation pipelines.
                  </li>
                </ul>
              </div>

              <div>
                <h5 className='font-medium text-sky-300 text-[0.8rem] mb-0.5'>
                  STL (.stl)
                </h5>
                <ul className='list-disc list-inside space-y-0.5 pl-3 text-slate-400'>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Upload size={12} className='mr-1.5 text-green-400' />
                      Import:
                    </span>{" "}
                    Supported for static, untextured geometry (binary and ASCII
                    STL).
                  </li>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Download size={12} className='mr-1.5 text-red-400' />
                      Export:
                    </span>{" "}
                    Not a direct export option. For STL output, export your
                    model as GLB or OBJ first, then use an external tool (e.g.,
                    Blender, MeshLab) to convert to STL.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>Why:</span>{" "}
                    Common for 3D printing and some CAD applications.
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Use For:
                    </span>{" "}
                    Importing models intended for 3D printing or from certain
                    CAD systems.
                  </li>
                </ul>
              </div>

              <div>
                <h5 className='font-medium text-sky-300 text-[0.8rem] mb-0.5'>
                  USDZ (.usdz) - For Augmented Reality (AR)
                </h5>
                <ul className='list-disc list-inside space-y-0.5 pl-3 text-slate-400'>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Upload size={12} className='mr-1.5 text-red-400' />
                      Import:
                    </span>{" "}
                    Not directly supported for import into this studio.
                  </li>
                  <li>
                    <span className='text-slate-200 flex items-center'>
                      <Download size={12} className='mr-1.5 text-yellow-400' />
                      Export (Indirect):
                    </span>{" "}
                    To create a USDZ file for AR (especially on iOS devices):
                    <ol className='list-decimal list-inside pl-4 mt-1 text-slate-400/90'>
                      <li>
                        Export your model from this studio as a **GLB** file.
                      </li>
                      <li>
                        Use an external tool to convert the GLB to USDZ.
                        Examples:
                        <ul className='list-disc list-inside pl-3 text-slate-400/80'>
                          <li>Apple's Reality Converter (macOS).</li>
                          <li>Online GLB to USDZ converters.</li>
                          <li>Command-line tools like `usd_from_gltf`.</li>
                        </ul>
                      </li>
                    </ol>
                  </li>
                  <li>
                    <span className='text-slate-300 font-semibold'>
                      Guidance:
                    </span>{" "}
                    USDZ is primarily for AR experiences on Apple platforms.
                    Ensure your GLB has PBR materials for best results.
                  </li>
                </ul>
              </div>
            </div>

            <div className='pt-3'>
              <h4 className='font-semibold text-purple-300 mb-1 text-sm flex items-center'>
                <AlertTriangle size={16} className='mr-1.5 text-yellow-400' />
                Important Notes
              </h4>
              <ul className='list-disc list-inside space-y-1 pl-2 text-slate-400'>
                <li>
                  <span className='text-slate-200'>Performance:</span> Complex
                  models (high polygon counts, many textures/animations) might
                  impact browser performance during import or rendering.
                </li>
                <li>
                  <span className='text-slate-200'>Material Fidelity:</span>{" "}
                  While the studio aims for good material representation,
                  complex custom shaders or highly specific material setups from
                  DCC tools might not translate perfectly across all formats,
                  especially during import. GLTF/GLB with PBR materials
                  generally offers the best fidelity.
                </li>
                <li>
                  <span className='text-slate-200'>Texture Paths:</span> For
                  GLTF files with external textures, ensure the paths are
                  relative and the texture files are provided alongside the
                  GLTF, or zip them together for upload. GLB is preferred as it
                  embeds assets.
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
