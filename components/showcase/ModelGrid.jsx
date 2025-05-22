"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SortAsc, SortDesc, Grid, List } from "lucide-react";
import ModelCard from "./ModelCard";

const ModelGrid = ({
  initialModels = [],
  title = "Featured Models",
  description,
  showFilters = true,
}) => {
  const [models, setModels] = useState(initialModels);
  const [filteredModels, setFilteredModels] = useState(initialModels);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("popular"); // popular, newest, oldest
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "characters", name: "Characters" },
    { id: "architecture", name: "Architecture" },
    { id: "vehicles", name: "Vehicles" },
    { id: "furniture", name: "Furniture" },
    { id: "nature", name: "Nature" },
    { id: "sci-fi", name: "Sci-Fi" },
  ];

  // Filter and sort models when dependencies change
  useEffect(() => {
    setIsLoading(true);

    // Filter by search query and category
    let filtered = [...models];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (model) =>
          model.title.toLowerCase().includes(query) ||
          model.description?.toLowerCase().includes(query) ||
          model.author.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((model) => model.category === categoryFilter);
    }

    // Sort models
    switch (sortOrder) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "popular":
      default:
        filtered.sort((a, b) => b.likes + b.views - (a.likes + a.views));
        break;
    }

    // Simulate loading delay for better UX
    setTimeout(() => {
      setFilteredModels(filtered);
      setIsLoading(false);
    }, 300);
  }, [models, searchQuery, sortOrder, categoryFilter]);

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className='w-full'>
      {/* Header with title and description */}
      <div className='mb-8'>
        <h2 className='text-2xl md:text-3xl font-bold text-gray-900 dark:text-white'>
          {title}
        </h2>
        {description && (
          <p className='mt-2 text-gray-600 dark:text-gray-300'>{description}</p>
        )}
      </div>

      {/* Filters and search */}
      {showFilters && (
        <div className='mb-6 space-y-4'>
          <div className='flex flex-col md:flex-row gap-4'>
            {/* Search bar */}
            <div className='relative flex-grow'>
              <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                <Search className='h-4 w-4 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search models...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full py-2 pl-10 pr-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              />
            </div>

            {/* Sort and View options */}
            <div className='flex space-x-2'>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className='py-2 px-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
              >
                <option value='popular'>Most Popular</option>
                <option value='newest'>Newest First</option>
                <option value='oldest'>Oldest First</option>
              </select>

              <div className='flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden'>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 ${
                    viewMode === "grid"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <Grid className='h-4 w-4' />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 ${
                    viewMode === "list"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <List className='h-4 w-4' />
                </button>
              </div>
            </div>
          </div>

          {/* Category filters */}
          <div className='flex flex-wrap gap-2'>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setCategoryFilter(category.id)}
                className={`px-3 py-1 text-sm rounded-full ${
                  categoryFilter === category.id
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Models grid/list */}
      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse'>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className='bg-gray-200 dark:bg-gray-700 rounded-lg h-64'
            ></div>
          ))}
        </div>
      ) : filteredModels.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-400 dark:text-gray-500 text-6xl mb-4'>
            ¯\_(ツ)_/¯
          </div>
          <h3 className='text-xl font-medium text-gray-900 dark:text-white'>
            No models found
          </h3>
          <p className='text-gray-600 dark:text-gray-400 mt-2'>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <motion.div
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          variants={containerVariants}
          initial='hidden'
          animate='show'
        >
          {filteredModels.map((model, index) => (
            <ModelCard
              key={model.id}
              model={model}
              featured={index === 0 && filteredModels.length > 3}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div
          className='flex flex-col space-y-4'
          variants={containerVariants}
          initial='hidden'
          animate='show'
        >
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className='flex bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow'
            >
              <div className='w-32 h-32 relative shrink-0'>
                <Image
                  src={model.thumbnail || "/api/placeholder/400/300"}
                  alt={model.title}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='p-4 flex flex-col flex-grow'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h3 className='font-semibold text-gray-900 dark:text-white'>
                      {model.title}
                    </h3>
                    <p className='text-sm text-gray-600 dark:text-gray-300'>
                      by {model.author}
                    </p>
                  </div>
                  {model.fileType && (
                    <span className='text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'>
                      {model.fileType}
                    </span>
                  )}
                </div>

                <p className='text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2'>
                  {model.description}
                </p>

                <div className='mt-auto pt-2 flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <Heart className='h-4 w-4 mr-1' />
                      <span>{model.likes}</span>
                    </div>
                    <div className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                      <Eye className='h-4 w-4 mr-1' />
                      <span>{model.views}</span>
                    </div>
                  </div>

                  <Link
                    href={`/showcase/${model.id}`}
                    className='text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300'
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* Load more button */}
      {filteredModels.length > 0 && (
        <div className='mt-8 text-center'>
          <button className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'>
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ModelGrid;
