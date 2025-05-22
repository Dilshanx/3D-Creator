"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, Download, Heart, Share2, Info } from "lucide-react";
import { Button } from "../ui/button";

const ModelCard = ({
  model = {
    id: "1",
    title: "Model Title",
    thumbnail: "/api/placeholder/400/300",
    author: "Creator Name",
    likes: 124,
    views: 1.5,
    fileSize: "2.4 MB",
    fileType: "GLB",
    description: "A brief description of the 3D model",
    createdAt: "2025-03-15",
    modelPath: "/models/model.glb",
  },
  featured = false,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(model.likes || 0);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  // Format views count (e.g., 1.5k)
  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views;
  };

  return (
    <motion.div
      className={`relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Thumbnail */}
      <div className='relative w-full aspect-[4/3] overflow-hidden'>
        <Image
          src={model.thumbnail || "/api/placeholder/400/300"}
          alt={model.title}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover transition-transform duration-500 hover:scale-105'
          priority={featured}
        />

        {/* Overlay with actions */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4'>
          <div className='flex justify-between items-center'>
            <Link href={`/showcase/${model.id}`}>
              <Button variant='secondary' size='sm' className='text-xs'>
                <Eye className='h-3 w-3 mr-1' /> Quick View
              </Button>
            </Link>

            <div className='flex space-x-1'>
              <Button variant='secondary' size='icon' className='h-7 w-7'>
                <Share2 className='h-3 w-3' />
              </Button>
              <Button variant='secondary' size='icon' className='h-7 w-7'>
                <Info className='h-3 w-3' />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex-grow flex flex-col'>
        <div className='flex justify-between items-start mb-2'>
          <Link href={`/showcase/${model.id}`} className='hover:underline'>
            <h3 className='font-semibold text-lg text-gray-900 dark:text-white line-clamp-1'>
              {model.title}
            </h3>
          </Link>

          {model.fileType && (
            <span className='text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'>
              {model.fileType}
            </span>
          )}
        </div>

        <p className='text-sm text-gray-600 dark:text-gray-300 mb-3'>
          by <span className='font-medium'>{model.author}</span>
        </p>

        {featured && model.description && (
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>
            {model.description}
          </p>
        )}

        <div className='mt-auto pt-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700'>
          <div className='flex items-center space-x-4'>
            <button
              onClick={toggleLike}
              className='flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
            >
              <Heart
                className={`h-4 w-4 mr-1 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{likes}</span>
            </button>

            <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
              <Eye className='h-4 w-4 mr-1' />
              <span>{formatViews(model.views || 0)}</span>
            </div>
          </div>

          <Link
            href={model.modelPath || "#"}
            className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center'
          >
            <Download className='h-4 w-4 mr-1' />
            {model.fileSize && <span>{model.fileSize}</span>}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ModelCard;
