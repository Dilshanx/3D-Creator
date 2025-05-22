"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Box, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ModelViewer from "@/components/3d/ModelViewer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className='relative w-full h-[90vh] flex items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/30 dark:to-purple-900/30' />
        </div>

        <div className='container mx-auto px-4 z-10'>
          <motion.div
            className='flex flex-col lg:flex-row items-center justify-between gap-12'
            initial='hidden'
            animate='visible'
            variants={containerVariants}
          >
            <div className='lg:w-1/2'>
              <motion.h1
                className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6'
                variants={itemVariants}
              >
                Create Amazing{" "}
                <span className='text-blue-600 dark:text-blue-400'>
                  3D Models
                </span>{" "}
                in Minutes
              </motion.h1>

              <motion.p
                className='text-lg text-gray-700 dark:text-gray-300 mb-8'
                variants={itemVariants}
              >
                Design, customize, and export professional 3D models with our
                intuitive creator tool. No experience required.
              </motion.p>

              <motion.div
                className='flex flex-wrap gap-4'
                variants={itemVariants}
              >
                <Button asChild size='lg' className='gap-2'>
                  <Link href='/models'>
                    Create Model <Box className='h-4 w-4' />
                  </Link>
                </Button>

                <Button asChild variant='outline' size='lg' className='gap-2'>
                  <Link href='/showcase'>
                    View Showcase <ArrowRight className='h-4 w-4' />
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className='lg:w-1/2 h-[400px] rounded-xl overflow-hidden shadow-xl'
              variants={itemVariants}
            >
              <ModelViewer model='robot' className='w-full h-full' />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-24 bg-gray-50 dark:bg-gray-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
              Powerful 3D Creation Tools
            </h2>
            <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
              Everything you need to bring your imagination to life in three
              dimensions
            </p>
          </motion.div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {[
              {
                icon: <Box className='h-8 w-8' />,
                title: "Multiple Model Types",
                description:
                  "Choose from robots, spaceships, cars, houses, trees, gems, planets, and anime characters",
              },
              {
                icon: <PanelRight className='h-8 w-8' />,
                title: "Easy Customization",
                description:
                  "Simple controls to adjust every aspect of your 3D creation",
              },
              {
                icon: <ArrowRight className='h-8 w-8' />,
                title: "One-Click Export",
                description:
                  "Download your models as GLB files compatible with all major 3D applications",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className='bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md'
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className='text-blue-600 dark:text-blue-400 mb-4'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-700 dark:text-gray-300'>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-blue-600 dark:bg-blue-800'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
              Ready to Create Your First 3D Model?
            </h2>
            <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
              Jump into our intuitive creator tool and start building amazing 3D
              models today
            </p>
            <Button asChild size='lg' variant='secondary' className='gap-2'>
              <Link href='/models'>
                Start Creating Now <ArrowRight className='h-4 w-4' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
