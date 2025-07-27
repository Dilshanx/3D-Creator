"use client";

import { motion } from "framer-motion";
import ModelCreator from "@/components/3d/Create/ModelCreator";

export default function ModelCreatorPage() {
  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white'>
          3D Model Creator
        </h1>
        <p className='text-lg text-gray-700 dark:text-gray-300 text-center mb-8'>
          Design, customize, and export your own 3D models
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
        className='mb-16'
      >
        <ModelCreator />
      </motion.div>

      <div className='mt-12 bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md'>
        <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
          Tips for Creating Models
        </h2>

        <ul className='space-y-3 text-gray-700 dark:text-gray-300'>
          <li className='flex items-start'>
            <span className='mr-2'>•</span>
            <span>
              Use the model type selector to choose from different 3D assets
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>•</span>
            <span>
              Models automatically rotate so you can see them from all angles
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>•</span>
            <span>
              Export as GLB to use your models in other 3D applications
            </span>
          </li>
          <li className='flex items-start'>
            <span className='mr-2'>•</span>
            <span>
              Exported models work with Three.js, React Three Fiber, and other
              WebGL libraries
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
