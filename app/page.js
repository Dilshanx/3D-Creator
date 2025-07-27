// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Box,
//   Settings2, // Changed from PanelRight for "Studio" section
//   Zap,
//   Palette,
//   Sparkles,
//   Download,
//   Play,
//   Pause,
//   MousePointer2, // For interactivity hint
//   Layers, // For feature
//   Badge,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { AspectRatio } from "@/components/ui/aspect-ratio";
// import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes"; // Your interactive hero component
// import { useState } from "react";

// const pageVariants = {
//   initial: { opacity: 0 },
//   animate: { opacity: 1, transition: { duration: 0.5 } },
//   exit: { opacity: 0, transition: { duration: 0.3 } },
// };

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.2,
//       delayChildren: 0.3,
//     },
//   },
// };

// const heroItemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 80,
//       damping: 12,
//     },
//   },
// };

// const featureCardVariants = {
//   hidden: { opacity: 0, y: 50 },
//   visible: (i) => ({
//     opacity: 1,
//     y: 0,
//     transition: {
//       delay: i * 0.1,
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   }),
// };

// const previewGlowVariants = {
//   animate: {
//     boxShadow: [
//       "0 0 30px 0px rgba(168, 85, 247, 0.3)", // Lighter, more spread out
//       "0 0 50px 5px rgba(129, 140, 248, 0.3)", // Indigoish
//       "0 0 30px 0px rgba(168, 85, 247, 0.3)",
//     ],
//     transition: {
//       duration: 3.5,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// const floatingPreviewVariants = {
//   animate: {
//     y: [0, -8, 0, 8, 0], // More subtle float
//     transition: {
//       duration: 6,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// export default function Home() {
//   const [isHeroPreviewPlaying, setIsHeroPreviewPlaying] = useState(true);

//   const features = [
//     {
//       icon: <Box className='h-10 w-10' />,
//       title: "Versatile Shape Library",
//       description:
//         "Start with diverse base shapes or import your own GLB/GLTF models for limitless possibilities.",
//     },
//     {
//       icon: <Palette className='h-10 w-10' />,
//       title: "Advanced PBR Materials",
//       description:
//         "Apply realistic metallic, glass, crystal, or organic finishes with full control over physical properties.",
//     },
//     {
//       icon: <Sparkles className='h-10 w-10' />,
//       title: "Dynamic Animations",
//       description:
//         "Bring shapes to life with preset animations, or animate imported models using their embedded clips.",
//     },
//     {
//       icon: <Settings2 className='h-10 w-10' />,
//       title: "Intuitive Customization",
//       description:
//         "Fine-tune every aspect: color, depth, lighting, textures, and post-processing effects via a user-friendly panel.",
//     },
//     {
//       icon: <Layers className='h-10 w-10' />,
//       title: "3D Text & Image Planes",
//       description:
//         "Add depth with extruded 3D text using custom fonts, or incorporate 2D images as planes within your scene.",
//     },
//     {
//       icon: <Download className='h-10 w-10' />,
//       title: "Professional Export",
//       description:
//         "Download creations as GLB (static or animated) or OBJ, ready for any 3D workflow or platform.",
//     },
//   ];

//   return (
//     <motion.div
//       initial='initial'
//       animate='animate'
//       exit='exit'
//       variants={pageVariants}
//     >
//       {/* Hero Section */}
//       <section className='relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0 bg-background'>
//         {/* Subtle Animated Background Grid */}
//         <div className='absolute inset-0 -z-10 h-full w-full bg-transparent'>
//           <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(129,140,248,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(129,140,248,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-70'></div>
//         </div>
//         {/* Gradient Overlay */}
//         <div className='absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900 pointer-events-none'></div>

//         <div className='container mx-auto px-4 z-10'>
//           <motion.div
//             className='flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-24'
//             variants={containerVariants}
//             initial='hidden'
//             animate='visible'
//           >
//             <div className='lg:w-1/2 text-center lg:text-left'>
//               <motion.h1
//                 className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 mb-6 leading-tight tracking-tight'
//                 variants={heroItemVariants}
//               >
//                 Create Immersive{" "}
//                 <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400'>
//                   3D Experiences
//                 </span>
//               </motion.h1>

//               <motion.p
//                 className='text-lg md:text-xl text-slate-300 mb-10'
//                 variants={heroItemVariants}
//               >
//                 The intuitive 3D design studio for crafting stunning shapes,
//                 customizing PBR materials, animating scenes, and exporting
//                 professional models.
//               </motion.p>

//               <motion.div
//                 className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'
//                 variants={heroItemVariants}
//               >
//                 <Button
//                   asChild
//                   size='xl' // Larger button
//                   className='gap-2.5 text-lg px-10 py-7 rounded-xl shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-purple-400/50'
//                 >
//                   <Link href='/models'>
//                     {" "}
//                     {/* Assuming /models is your studio page */}
//                     Launch Studio <Zap className='h-5 w-5' />
//                   </Link>
//                 </Button>
//                 <Button
//                   asChild
//                   variant='outline'
//                   size='xl'
//                   className='gap-2.5 text-lg px-10 py-7 rounded-xl border-slate-600 hover:bg-slate-700/30 hover:border-slate-500 text-slate-200 transition-all'
//                 >
//                   <Link href='/showcase'>
//                     {" "}
//                     {/* Link to a showcase page */}
//                     View Examples <ArrowRight className='h-5 w-5' />
//                   </Link>
//                 </Button>
//               </motion.div>
//             </div>

//             <motion.div
//               className='lg:w-1/2 w-full mt-12 lg:mt-0'
//               variants={heroItemVariants}
//             >
//               <motion.div
//                 variants={floatingPreviewVariants}
//                 animate='animate'
//                 className='relative group'
//               >
//                 <motion.div
//                   variants={previewGlowVariants}
//                   animate='animate'
//                   className='rounded-xl'
//                 >
//                   <Card className='overflow-hidden shadow-2xl border-purple-500/30 bg-slate-800/50 backdrop-blur-md'>
//                     <div className='absolute top-3 left-3 z-20 flex items-center gap-1.5'>
//                       <Button
//                         variant='ghost'
//                         size='icon'
//                         className='h-8 w-8 text-slate-300 hover:text-white bg-black/20 hover:bg-black/40 rounded-full'
//                         onClick={() =>
//                           setIsHeroPreviewPlaying(!isHeroPreviewPlaying)
//                         }
//                       >
//                         {isHeroPreviewPlaying ? (
//                           <Pause className='h-4 w-4' />
//                         ) : (
//                           <Play className='h-4 w-4' />
//                         )}
//                         <span className='sr-only'>
//                           {isHeroPreviewPlaying
//                             ? "Pause Preview"
//                             : "Play Preview"}
//                         </span>
//                       </Button>
//                     </div>
//                     <div className='absolute top-3 right-3 z-20 flex items-center gap-1.5'>
//                       <div className='w-2.5 h-2.5 bg-red-500 rounded-full opacity-70'></div>
//                       <div className='w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-70'></div>
//                       <div className='w-2.5 h-2.5 bg-green-500 rounded-full opacity-70'></div>
//                     </div>

//                     <AspectRatio ratio={16 / 10} className='bg-transparent'>
//                       <div className='w-full h-full relative'>
//                         {/* Ensure Enhanced3DShapes handles its own loading/suspense */}
//                         <Enhanced3DShapes isPlaying={isHeroPreviewPlaying} />
//                         <div className='absolute bottom-3 left-3 right-3 bg-black/30 backdrop-blur-sm rounded-md p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
//                           <p className='text-xs text-slate-300 flex items-center justify-center'>
//                             <MousePointer2 size={14} className='mr-1.5' />{" "}
//                             Interactive Preview - Drag to Orbit
//                           </p>
//                         </div>
//                       </div>
//                     </AspectRatio>
//                   </Card>
//                 </motion.div>
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className='py-20 md:py-28 bg-slate-900 border-y border-slate-800'>
//         <div className='container mx-auto px-4'>
//           <motion.div
//             className='text-center mb-16'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h2 className='text-4xl md:text-5xl font-bold text-slate-50 mb-4 tracking-tight'>
//               Powerfully Simple 3D Creation
//             </h2>
//             <p className='text-lg md:text-xl text-slate-400 max-w-3xl mx-auto'>
//               Everything you need to design and animate compelling 3D assets,
//               all in one intuitive interface.
//             </p>
//           </motion.div>

//           <motion.div
//             className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
//             variants={containerVariants}
//             initial='hidden'
//             whileInView='visible'
//             viewport={{ once: true, amount: 0.1 }}
//           >
//             {features.map((feature, index) => (
//               <motion.div
//                 key={index}
//                 variants={featureCardVariants}
//                 custom={index}
//               >
//                 <Card className='h-full bg-slate-800/50 border-slate-700/70 hover:border-purple-500/50 hover:shadow-purple-500/10 transition-all duration-300 ease-out transform hover:-translate-y-1 group'>
//                   <CardHeader>
//                     <motion.div
//                       className='text-purple-400 mb-5 inline-block p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors'
//                       whileHover={{ scale: 1.1, rotate: -5 }}
//                     >
//                       {feature.icon}
//                     </motion.div>
//                     <CardTitle className='text-2xl text-slate-100'>
//                       {feature.title}
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription className='text-base text-slate-300'>
//                       {feature.description}
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>
//       </section>

//       {/* Embedded Studio Section (if it's the same component, just style its container) */}
//       <section className='py-20 md:py-32 bg-slate-950'>
//         <div className='container mx-auto px-4'>
//           <motion.div
//             className='text-center mb-16'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.5 }}
//           >
//             <Badge
//               variant='outline'
//               className='mb-4 text-purple-400 border-purple-400/50 bg-purple-500/10 text-sm px-4 py-1'
//             >
//               Live Studio Demo
//             </Badge>
//             <h2 className='text-4xl md:text-5xl font-bold text-slate-50 mb-4 tracking-tight'>
//               Try the Studio Now
//             </h2>
//             <p className='text-lg md:text-xl text-slate-400 max-w-3xl mx-auto'>
//               Get hands-on with the core features. Click, drag, and customize in
//               real-time. This is a simplified preview of the full editor.
//             </p>
//           </motion.div>

//           <motion.div
//             className='relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50'
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true, amount: 0.1 }}
//             transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // Smoother spring-like ease
//           >
//             <div className='bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2'>
//               <div className='w-3 h-3 bg-red-500 rounded-full'></div>
//               <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
//               <div className='w-3 h-3 bg-green-500 rounded-full'></div>
//               <span className='ml-auto text-xs text-slate-500'>
//                 Interactive Demo
//               </span>
//             </div>
//             <div className='min-h-[60vh] md:min-h-[75vh] lg:min-h-[85vh] w-full bg-slate-900 relative'>
//               {/* Using Enhanced3DShapes here again, but it should ideally be distinct or configured for a "demo" mode */}
//               <Enhanced3DShapes isPlaying={true} demoMode={true} />
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className='py-20 md:py-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600'>
//         <div className='container mx-auto px-4 text-center'>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.2 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight'>
//               Ready to Shape Your Vision?
//             </h2>
//             <p className='text-xl text-purple-100/90 mb-10 max-w-2xl mx-auto'>
//               Experience the future of 3D design. Simple for beginners, powerful
//               for pros. Start creating for free today!
//             </p>
//             <Button
//               asChild
//               size='xl'
//               variant='secondary' // Or a custom "premium" variant
//               className='gap-2.5 text-lg px-10 py-7 rounded-xl shadow-2xl bg-white text-purple-700 hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-white/50'
//             >
//               <Link href='/models'>
//                 Get Started Now <ArrowRight className='h-5 w-5' />
//               </Link>
//             </Button>
//           </motion.div>
//         </div>
//       </section>
//     </motion.div>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Settings2,
  Zap,
  Palette,
  Sparkles,
  Download,
  Play,
  Pause,
  MousePointer2,
  Layers,
  Badge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes";
import { useState } from "react";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.3 } },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const heroItemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  }),
};

const previewGlowVariants = {
  animate: {
    boxShadow: [
      "0 0 40px 5px rgba(236, 72, 153, 0.4), 0 0 80px 10px rgba(147, 51, 234, 0.2)",
      "0 0 60px 10px rgba(59, 130, 246, 0.4), 0 0 100px 15px rgba(34, 197, 94, 0.2)",
      "0 0 50px 8px rgba(249, 115, 22, 0.4), 0 0 90px 12px rgba(168, 85, 247, 0.2)",
      "0 0 40px 5px rgba(236, 72, 153, 0.4), 0 0 80px 10px rgba(147, 51, 234, 0.2)",
    ],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatingPreviewVariants = {
  animate: {
    y: [0, -12, 0, 8, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function Home() {
  const [isHeroPreviewPlaying, setIsHeroPreviewPlaying] = useState(true);

  const features = [
    {
      icon: <Box className='h-10 w-10' />,
      title: "Versatile Shape Library",
      description: "Start with diverse base shapes or import your own GLB/GLTF models for limitless possibilities.",
      gradient: "from-pink-500 via-rose-500 to-orange-500",
      iconBg: "bg-gradient-to-br from-pink-500/20 to-rose-500/20",
      borderGlow: "hover:shadow-pink-500/25"
    },
    {
      icon: <Palette className='h-10 w-10' />,
      title: "Advanced PBR Materials",
      description: "Apply realistic metallic, glass, crystal, or organic finishes with full control over physical properties.",
      gradient: "from-purple-500 via-violet-500 to-indigo-500",
      iconBg: "bg-gradient-to-br from-purple-500/20 to-violet-500/20",
      borderGlow: "hover:shadow-purple-500/25"
    },
    {
      icon: <Sparkles className='h-10 w-10' />,
      title: "Dynamic Animations",
      description: "Bring shapes to life with preset animations, or animate imported models using their embedded clips.",
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      iconBg: "bg-gradient-to-br from-blue-500/20 to-cyan-500/20",
      borderGlow: "hover:shadow-blue-500/25"
    },
    {
      icon: <Settings2 className='h-10 w-10' />,
      title: "Intuitive Customization",
      description: "Fine-tune every aspect: color, depth, lighting, textures, and post-processing effects via a user-friendly panel.",
      gradient: "from-emerald-500 via-green-500 to-lime-500",
      iconBg: "bg-gradient-to-br from-emerald-500/20 to-green-500/20",
      borderGlow: "hover:shadow-emerald-500/25"
    },
    {
      icon: <Layers className='h-10 w-10' />,
      title: "3D Text & Image Planes",
      description: "Add depth with extruded 3D text using custom fonts, or incorporate 2D images as planes within your scene.",
      gradient: "from-amber-500 via-yellow-500 to-orange-500",
      iconBg: "bg-gradient-to-br from-amber-500/20 to-yellow-500/20",
      borderGlow: "hover:shadow-amber-500/25"
    },
    {
      icon: <Download className='h-10 w-10' />,
      title: "Professional Export",
      description: "Download creations as GLB (static or animated) or OBJ, ready for any 3D workflow or platform.",
      gradient: "from-red-500 via-pink-500 to-rose-500",
      iconBg: "bg-gradient-to-br from-red-500/20 to-pink-500/20",
      borderGlow: "hover:shadow-red-500/25"
    },
  ];

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={pageVariants}
    >
      {/* Hero Section */}
      <section className='relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-purple-950/50 dark:to-slate-900'>
        {/* Enhanced Animated Background */}
        <div className='absolute inset-0 -z-10 h-full w-full'>
          <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(236,72,153,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(236,72,153,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(147,51,234,0.12)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_40%,#000_70%,transparent_100%)]'></div>
          
          {/* Floating orbs */}
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.8, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className='container mx-auto px-4 z-10'>
          <motion.div
            className='flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-24'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='lg:w-1/2 text-center lg:text-left'>
              <motion.div
                className="inline-block mb-6"
                variants={heroItemVariants}
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-500/20 dark:to-purple-500/20 text-pink-700 dark:text-pink-300 border border-pink-500/20 dark:border-pink-500/30">
                  ✨ Revolutionary 3D Design
                </span>
              </motion.div>

              <motion.h1
                className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-slate-50 mb-6 leading-tight tracking-tight'
                variants={heroItemVariants}
              >
                Create Immersive{" "}
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-400 dark:via-purple-400 dark:to-blue-400'>
                  3D Experiences
                </span>
              </motion.h1>

              <motion.p
                className='text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl'
                variants={heroItemVariants}
              >
                The next-generation 3D design studio for crafting stunning shapes, customizing PBR materials, animating scenes, and exporting professional models with ease.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'
                variants={heroItemVariants}
              >
                <Button
                  asChild
                  size='xl'
                  className='gap-3 text-lg px-12 py-8 rounded-2xl shadow-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white transition-all duration-500 ease-out transform hover:scale-105 hover:shadow-purple-500/50 focus:ring-4 focus:ring-purple-400/50 relative overflow-hidden group'
                >
                  <Link href='/models'>
                    <span className="relative z-10 flex items-center gap-3">
                      Launch Studio <Zap className='h-6 w-6' />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='xl'
                  className='gap-3 text-lg px-12 py-8 rounded-2xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:border-purple-400 dark:hover:border-purple-400 text-slate-700 dark:text-slate-200 transition-all duration-300 hover:shadow-lg'
                >
                  <Link href='/showcase'>
                    View Examples <ArrowRight className='h-6 w-6' />
                  </Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className='lg:w-1/2 w-full mt-12 lg:mt-0'
              variants={heroItemVariants}
            >
              <motion.div
                variants={floatingPreviewVariants}
                animate='animate'
                className='relative group'
              >
                <motion.div
                  variants={previewGlowVariants}
                  animate='animate'
                  className='rounded-2xl'
                >
                  <Card className='overflow-hidden shadow-2xl border-2 border-purple-200/50 dark:border-purple-500/30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md'>
                    <div className='absolute top-4 left-4 z-20 flex items-center gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-10 w-10 text-slate-600 dark:text-slate-300 hover:text-white bg-white/20 dark:bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-sm transition-all duration-300'
                        onClick={() =>
                          setIsHeroPreviewPlaying(!isHeroPreviewPlaying)
                        }
                      >
                        {isHeroPreviewPlaying ? (
                          <Pause className='h-5 w-5' />
                        ) : (
                          <Play className='h-5 w-5' />
                        )}
                      </Button>
                    </div>
                    <div className='absolute top-4 right-4 z-20 flex items-center gap-2'>
                      <div className='w-3 h-3 bg-red-500 rounded-full shadow-lg'></div>
                      <div className='w-3 h-3 bg-yellow-400 rounded-full shadow-lg'></div>
                      <div className='w-3 h-3 bg-green-500 rounded-full shadow-lg'></div>
                    </div>

                    <AspectRatio ratio={16 / 10} className='bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
                      <div className='w-full h-full relative'>
                        <Enhanced3DShapes isPlaying={isHeroPreviewPlaying} />
                        <div className='absolute bottom-4 left-4 right-4 bg-white/20 dark:bg-black/30 backdrop-blur-md rounded-xl p-3 text-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none border border-white/30 dark:border-white/10'>
                          <p className='text-sm text-slate-700 dark:text-slate-300 flex items-center justify-center font-medium'>
                            <MousePointer2 size={16} className='mr-2' />
                            Interactive Preview - Drag to Orbit
                          </p>
                        </div>
                      </div>
                    </AspectRatio>
                  </Card>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 md:py-32 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden'>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.05)_50%,transparent_75%)] dark:bg-[linear-gradient(45deg,transparent_25%,rgba(168,85,247,0.1)_50%,transparent_75%)] bg-[length:60px_60px]"></div>
        
        <div className='container mx-auto px-4 relative z-10'>
          <motion.div
            className='text-center mb-20'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-700/50">
              🚀 Powerful Features
            </span>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight'>
              Powerfully Simple{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                3D Creation
              </span>
            </h2>
            <p className='text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed'>
              Everything you need to design and animate compelling 3D assets, all in one intuitive interface designed for creators of all skill levels.
            </p>
          </motion.div>

          <motion.div
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={featureCardVariants}
                custom={index}
                className="group"
              >
                <Card className={`h-full bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 hover:border-transparent transition-all duration-500 ease-out transform hover:-translate-y-2 hover:shadow-2xl ${feature.borderGlow} relative overflow-hidden`}>
                  {/* Gradient border on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} style={{ padding: '1px' }}>
                    <div className="bg-white dark:bg-slate-800 rounded-lg h-full w-full"></div>
                  </div>
                  
                  <CardHeader className="relative z-10">
                    <motion.div
                      className={`inline-block p-4 rounded-2xl mb-6 ${feature.iconBg} group-hover:scale-110 transition-all duration-300`}
                      whileHover={{ rotate: -10, scale: 1.15 }}
                    >
                      <div className={`text-transparent bg-clip-text bg-gradient-to-r ${feature.gradient}`}>
                        {feature.icon}
                      </div>
                    </motion.div>
                    <CardTitle className='text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3'>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <CardDescription className='text-base text-slate-600 dark:text-slate-300 leading-relaxed'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Studio Demo Section */}
      <section className='py-20 md:py-32 bg-gradient-to-br from-slate-100 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950/30 dark:to-slate-900'>
        <div className='container mx-auto px-4'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant='outline'
              className='mb-6 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-400/50 bg-purple-100 dark:bg-purple-500/10 text-base px-6 py-2 font-semibold'
            >
              🎮 Live Studio Demo
            </Badge>
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 mb-6 tracking-tight'>
              Try the Studio{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Right Now
              </span>
            </h2>
            <p className='text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed'>
              Get hands-on with the core features. Click, drag, and customize in real-time. Experience the power of our 3D editor with this interactive preview.
            </p>
          </motion.div>

          <motion.div
            className='relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white dark:border-slate-700/50 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900'
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-4 border-b border-slate-300 dark:border-slate-600 flex items-center gap-3'>
              <div className='flex items-center gap-2'>
                <div className='w-4 h-4 bg-red-500 rounded-full shadow-sm'></div>
                <div className='w-4 h-4 bg-yellow-400 rounded-full shadow-sm'></div>
                <div className='w-4 h-4 bg-green-500 rounded-full shadow-sm'></div>
              </div>
              <span className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                3D Studio - Interactive Demo
              </span>
              <div className="ml-auto flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className='text-xs text-slate-500 dark:text-slate-400'>Live</span>
              </div>
            </div>
            <div className='min-h-[60vh] md:min-h-[75vh] lg:min-h-[85vh] w-full relative bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800'>
              <Enhanced3DShapes isPlaying={true} demoMode={true} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className='py-20 md:py-32 bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 dark:from-pink-600 dark:via-purple-700 dark:to-blue-700 relative overflow-hidden'>
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </div>

        <div className='container mx-auto px-4 text-center relative z-10'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="inline-block mb-8"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="text-6xl md:text-7xl">🚀</span>
            </motion.div>
            
            <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight'>
              Ready to Shape Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-orange-300">
                Creative Vision?
              </span>
            </h2>
            <p className='text-xl md:text-2xl text-purple-100/90 mb-12 max-w-3xl mx-auto leading-relaxed'>
              Experience the future of 3D design. Simple for beginners, powerful for professionals. Join thousands of creators and start building amazing 3D experiences today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                asChild
                size='xl'
                className='gap-3 text-xl px-16 py-10 rounded-2xl shadow-2xl bg-white text-purple-700 hover:bg-slate-100 transition-all duration-500 transform hover:scale-105 focus:ring-4 focus:ring-white/50 font-bold relative overflow-hidden group'
              >
                <Link href='/models'>
                  <span className="relative z-10 flex items-center gap-3">
                    Get Started Free <ArrowRight className='h-6 w-6' />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </Button>
              
              <div className="text-center">
                <p className="text-white/80 text-sm">✨ No credit card required</p>
                <p className="text-white/60 text-xs">Start creating in seconds</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}