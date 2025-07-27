"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelGrid from "@/components/showcase/ModelGrid";

const modelCategories = [
  { id: "all", label: "All Models" },
  { id: "robot", label: "Robots" },
  { id: "spaceship", label: "Spaceships" },
  { id: "car", label: "Cars" },
  { id: "house", label: "Houses" },
  { id: "tree", label: "Trees" },
  { id: "gem", label: "Gems" },
  { id: "planet", label: "Planets" },
  { id: "animeCharacter", label: "Anime Characters" },
];

// Sample model data - in a real app, this would come from an API or database
const sampleModels = [
  {
    id: 1,
    name: "Robot Explorer",
    type: "robot",
    path: "/models/robot-model.glb",
  },
  {
    id: 2,
    name: "Starship Alpha",
    type: "spaceship",
    path: "/models/spaceship-model.glb",
  },
  { id: 3, name: "Sports Car", type: "car", path: "/models/car-model.glb" },
  {
    id: 4,
    name: "Modern House",
    type: "house",
    path: "/models/house-model.glb",
  },
  { id: 5, name: "Pine Tree", type: "tree", path: "/models/tree-model.glb" },
  { id: 6, name: "Crystal Gem", type: "gem", path: "/models/gem-model.glb" },
  {
    id: 7,
    name: "Gas Giant",
    type: "planet",
    path: "/models/planet-model.glb",
  },
  {
    id: 8,
    name: "Anime Hero",
    type: "animeCharacter",
    path: "/models/animeCharacter-model.glb",
  },
  // More sample models to fill the grid
  {
    id: 9,
    name: "Battle Robot",
    type: "robot",
    path: "/models/robot-model.glb",
  },
  {
    id: 10,
    name: "Cruiser Ship",
    type: "spaceship",
    path: "/models/spaceship-model.glb",
  },
  { id: 11, name: "Vintage Car", type: "car", path: "/models/car-model.glb" },
  {
    id: 12,
    name: "Beach House",
    type: "house",
    path: "/models/house-model.glb",
  },
];

export default function ShowcasePage() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredModels =
    activeCategory === "all"
      ? sampleModels
      : sampleModels.filter((model) => model.type === activeCategory);

  return (
    <div className='container mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className='text-3xl md:text-4xl font-bold text-center mb-2 text-gray-900 dark:text-white'>
          3D Model Showcase
        </h1>
        <p className='text-lg text-gray-700 dark:text-gray-300 text-center mb-8'>
          Browse our collection of amazing 3D models
        </p>
      </motion.div>

      <div className='mb-8'>
        <div className='flex items-center mb-4'>
          <Filter className='mr-2 h-5 w-5 text-gray-700 dark:text-gray-300' />
          <span className='font-medium text-gray-900 dark:text-white'>
            Filter by category:
          </span>
        </div>

        <div className='flex flex-wrap gap-2'>
          {modelCategories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              size='sm'
              onClick={() => setActiveCategory(category.id)}
              className='transition-all'
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.7 }}
      >
        <ModelGrid models={filteredModels} />
      </motion.div>
    </div>
  );
}
