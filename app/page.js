// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import { ArrowRight, Box, PanelRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// // import Enhanced3DShapes from "@/components/3d/Display/Enhanced3DShapes";
// import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 20, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//   },
// };

// export default function Home() {
//   return (
//     <>
//       {/* Hero Section */}
//       <section className='relative w-full h-[90vh] flex items-center justify-center overflow-hidden'>
//         <div className='absolute inset-0 z-0'>
//           <div className='absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-900/30 dark:to-purple-900/30' />
//         </div>

//         <div className='container mx-auto px-4 z-10'>
//           <motion.div
//             className='flex flex-col lg:flex-row items-center justify-between gap-12'
//             initial='hidden'
//             animate='visible'
//             variants={containerVariants}
//           >
//             <div className='lg:w-1/2'>
//               <motion.h1
//                 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6'
//                 variants={itemVariants}
//               >
//                 Create Amazing{" "}
//                 <span className='text-blue-600 dark:text-blue-400'>
//                   3D Shapes
//                 </span>{" "}
//                 in Minutes
//               </motion.h1>

//               <motion.p
//                 className='text-lg text-gray-700 dark:text-gray-300 mb-8'
//                 variants={itemVariants}
//               >
//                 Design, customize, and export professional 3D shapes with our
//                 intuitive creator tool. Hearts, stars, crowns, butterflies, and
//                 leaves - all with advanced materials and lighting.
//               </motion.p>

//               <motion.div
//                 className='flex flex-wrap gap-4'
//                 variants={itemVariants}
//               >
//                 <Button asChild size='lg' className='gap-2'>
//                   <Link href='/models'>
//                     Create Shapes <Box className='h-4 w-4' />
//                   </Link>
//                 </Button>

//                 <Button asChild variant='outline' size='lg' className='gap-2'>
//                   <Link href='/showcase'>
//                     View Showcase <ArrowRight className='h-4 w-4' />
//                   </Link>
//                 </Button>
//               </motion.div>
//             </div>

//             {/* Replace ModelViewer with Enhanced3DShapes preview */}
//             <motion.div
//               className='lg:w-1/2 h-[400px] rounded-xl overflow-hidden shadow-xl bg-slate-900'
//               variants={itemVariants}
//             >
//               <div className='w-full h-full scale-50 origin-center'>
//                 <Enhanced3DShapes />
//               </div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className='py-24 bg-gray-50 dark:bg-gray-900'>
//         <div className='container mx-auto px-4'>
//           <motion.div
//             className='text-center mb-16'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
//               Powerful 3D Shape Creation Tools
//             </h2>
//             <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
//               Everything you need to create beautiful 3D shapes with advanced
//               materials and realistic lighting
//             </p>
//           </motion.div>

//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
//             {[
//               {
//                 icon: <Box className='h-8 w-8' />,
//                 title: "Multiple Shape Types",
//                 description:
//                   "Choose from hearts, stars, crowns, butterflies, and leaves - each with unique organic curves and details",
//               },
//               {
//                 icon: <PanelRight className='h-8 w-8' />,
//                 title: "Advanced Materials",
//                 description:
//                   "Metallic, glass, ceramic, organic, and crystal materials with realistic lighting and shadows",
//               },
//               {
//                 icon: <ArrowRight className='h-8 w-8' />,
//                 title: "Professional Export",
//                 description:
//                   "Download as GLB or OBJ formats with full geometry, materials, and UV mapping for professional use",
//               },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 className='bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md'
//                 initial={{ opacity: 0, y: 20 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1, duration: 0.5 }}
//               >
//                 <div className='text-blue-600 dark:text-blue-400 mb-4'>
//                   {feature.icon}
//                 </div>
//                 <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
//                   {feature.title}
//                 </h3>
//                 <p className='text-gray-700 dark:text-gray-300'>
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Full Featured 3D Shapes Studio Section */}
//       <section className='py-20 bg-white dark:bg-gray-800'>
//         <div className='container mx-auto px-4'>
//           <motion.div
//             className='text-center mb-12'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4'>
//               Interactive 3D Shapes Studio
//             </h2>
//             <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto'>
//               Experience the full power of our 3D shape creator with real-time
//               editing, animation controls, and professional export options
//             </p>
//           </motion.div>

//           <motion.div
//             className='rounded-2xl overflow-hidden shadow-2xl'
//             initial={{ opacity: 0, scale: 0.95 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8 }}
//           >
//             <Enhanced3DShapes />
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className='py-20 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800'>
//         <div className='container mx-auto px-4 text-center'>
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             whileInView={{ opacity: 1, scale: 1 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
//               Ready to Create Your First 3D Shape?
//             </h2>
//             <p className='text-xl text-blue-100 mb-8 max-w-2xl mx-auto'>
//               Jump into our intuitive shape creator tool and start building
//               amazing 3D models with advanced materials and lighting today
//             </p>
//             <Button asChild size='lg' variant='secondary' className='gap-2'>
//               <Link href='/models'>
//                 Start Creating Now <ArrowRight className='h-4 w-4' />
//               </Link>
//             </Button>
//           </motion.div>
//         </div>
//       </section>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   ArrowRight,
//   Box,
//   PanelRight,
//   Zap,
//   Palette,
//   Sparkles,
//   Download,
//   Play,
//   Pause,
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
// import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes";
// import { useState } from "react";

// const containerVariants = {
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.15,
//       delayChildren: 0.2,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { y: 30, opacity: 0 },
//   visible: {
//     y: 0,
//     opacity: 1,
//     transition: {
//       type: "spring",
//       stiffness: 100,
//       damping: 15,
//     },
//   },
// };

// const featureIconVariants = {
//   hover: { scale: 1.2, rotate: 15 },
//   tap: { scale: 0.9 },
// };

// // Floating animation for 3D preview wrapper
// const floatingVariants = {
//   animate: {
//     y: [0, -10, 0],
//     rotateY: [0, 5, 0],
//     transition: {
//       duration: 4,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// // Glow effect animation
// const glowVariants = {
//   animate: {
//     boxShadow: [
//       "0 0 20px rgba(168, 85, 247, 0.4)",
//       "0 0 40px rgba(168, 85, 247, 0.6)",
//       "0 0 20px rgba(168, 85, 247, 0.4)",
//     ],
//     transition: {
//       duration: 3,
//       repeat: Infinity,
//       ease: "easeInOut",
//     },
//   },
// };

// export default function Home() {
//   const [isPlaying, setIsPlaying] = useState(true);

//   return (
//     <>
//       {/* Hero Section */}
//       <section className='relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-20 md:py-0'>
//         {/* Enhanced Animated Background */}
//         <div className='absolute inset-0 -z-10 h-full w-full bg-background'>
//           <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'></div>
//           {/* Animated gradient orbs */}
//           <div className='absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse'></div>
//           <div className='absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
//         </div>
//         <div className='absolute inset-0 z-0 pointer-events-none'>
//           <div className='absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background opacity-80'></div>
//         </div>

//         <div className='container mx-auto px-4 z-10'>
//           <motion.div
//             className='flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-20'
//             initial='hidden'
//             animate='visible'
//             variants={containerVariants}
//           >
//             <div className='lg:w-1/2 text-center lg:text-left'>
//               <motion.h1
//                 className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 leading-tight'
//                 variants={itemVariants}
//               >
//                 Craft Stunning{" "}
//                 <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400'>
//                   3D Shapes
//                 </span>
//                 , Effortlessly.
//               </motion.h1>

//               <motion.p
//                 className='text-lg md:text-xl text-muted-foreground mb-10'
//                 variants={itemVariants}
//               >
//                 Unleash your creativity with an intuitive 3D shape studio.
//                 Design, customize, animate, and export professional-grade models
//                 with advanced PBR materials and dynamic lighting.
//               </motion.p>

//               <motion.div
//                 className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'
//                 variants={itemVariants}
//               >
//                 <Button
//                   asChild
//                   size='lg'
//                   className='gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-primary/30 transition-shadow'
//                 >
//                   <Link href='/models'>
//                     Start Creating <Zap className='h-5 w-5' />
//                   </Link>
//                 </Button>
//                 <Button
//                   asChild
//                   variant='outline'
//                   size='lg'
//                   className='gap-2 text-lg px-8 py-6'
//                 >
//                   <Link href='/showcase'>
//                     View Showcase <ArrowRight className='h-5 w-5' />
//                   </Link>
//                 </Button>
//               </motion.div>
//             </div>

//             {/* Enhanced 3D Preview Section */}
//             <motion.div
//               className='lg:w-1/2 w-full mt-10 lg:mt-0 relative'
//               variants={itemVariants}
//             >
//               {/* Floating container with glow effect */}
//               <motion.div
//                 variants={floatingVariants}
//                 animate='animate'
//                 className='relative'
//               >
//                 <motion.div
//                   variants={glowVariants}
//                   animate='animate'
//                   className='rounded-2xl'
//                 >
//                   <Card className='overflow-hidden shadow-2xl border-primary/30 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-lg relative'>
//                     {/* Decorative elements */}
//                     <div className='absolute top-4 right-4 z-10 flex gap-2'>
//                       <div className='w-3 h-3 bg-red-500 rounded-full opacity-60'></div>
//                       <div className='w-3 h-3 bg-yellow-500 rounded-full opacity-60'></div>
//                       <div className='w-3 h-3 bg-green-500 rounded-full opacity-60'></div>
//                     </div>

//                     {/* Play/Pause button */}
//                     <Button
//                       variant='ghost'
//                       size='sm'
//                       className='absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-sm'
//                       onClick={() => setIsPlaying(!isPlaying)}
//                     >
//                       {isPlaying ? (
//                         <Pause className='h-4 w-4' />
//                       ) : (
//                         <Play className='h-4 w-4' />
//                       )}
//                     </Button>

//                     <AspectRatio
//                       ratio={16 / 10}
//                       className='bg-gradient-to-br from-slate-900/80 to-slate-800/80 relative overflow-hidden'
//                     >
//                       {/* Background pattern */}
//                       <div className='absolute inset-0 opacity-10'>
//                         <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-pulse'></div>
//                       </div>

//                       {/* 3D Component with enhanced styling */}
//                       <div className='w-full h-full relative'>
//                         {/* Spotlight effect */}
//                         <div className='absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none'></div>

//                         {/* Enhanced 3D component */}
//                         <div className='w-full h-full transform transition-transform duration-300 hover:scale-105'>
//                           <Enhanced3DShapes />
//                         </div>

//                         {/* Interactive overlay */}
//                         <div className='absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 opacity-0 hover:opacity-100 transition-opacity duration-300'>
//                           <p className='text-sm text-muted-foreground'>
//                             ✨ Interactive 3D Preview - Click and drag to
//                             explore
//                           </p>
//                         </div>
//                       </div>
//                     </AspectRatio>
//                   </Card>
//                 </motion.div>
//               </motion.div>

//               {/* Floating labels */}
//               <motion.div
//                 className='absolute -top-6 -right-6 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg'
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 1, type: "spring" }}
//               >
//                 Real-time 3D
//               </motion.div>

//               <motion.div
//                 className='absolute -bottom-6 -left-6 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium shadow-lg'
//                 initial={{ opacity: 0, scale: 0 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 transition={{ delay: 1.2, type: "spring" }}
//               >
//                 PBR Materials
//               </motion.div>
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className='py-20 md:py-32 bg-muted/40'>
//         <div className='container mx-auto px-4'>
//           <motion.div
//             className='text-center mb-16'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
//               Unleash Your 3D Potential
//             </h2>
//             <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
//               Our studio offers a comprehensive suite of tools for crafting
//               unique 3D assets with unparalleled ease and visual fidelity.
//             </p>
//           </motion.div>

//           <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
//             {[
//               {
//                 icon: <Box className='h-10 w-10' />,
//                 title: "Versatile Shape Library",
//                 description:
//                   "Start with a diverse collection of base shapes—hearts, stars, crowns, and more—each ready for your creative touch.",
//               },
//               {
//                 icon: <Palette className='h-10 w-10' />,
//                 title: "Advanced PBR Materials",
//                 description:
//                   "Apply realistic metallic, glass, crystal, ceramic, or organic finishes with dynamic lighting and reflections.",
//               },
//               {
//                 icon: <Sparkles className='h-10 w-10' />,
//                 title: "Dynamic Animations",
//                 description:
//                   "Bring your shapes to life with customizable animation presets, from gentle floats to energetic spins.",
//               },
//               {
//                 icon: <PanelRight className='h-10 w-10' />,
//                 title: "Intuitive Customization",
//                 description:
//                   "Fine-tune every aspect: color, depth, quality, lighting, and animation speed through a user-friendly panel.",
//               },
//               {
//                 icon: <Download className='h-10 w-10' />,
//                 title: "Professional Export",
//                 description:
//                   "Download your creations as GLB or OBJ, ready for use in game engines, 3D software, or web projects.",
//               },
//               {
//                 icon: <Zap className='h-10 w-10' />,
//                 title: "Real-time Previews",
//                 description:
//                   "See your changes instantly in a high-fidelity 3D viewer with SSAO and environment-based lighting.",
//               },
//             ].map((feature, index) => (
//               <motion.div
//                 key={index}
//                 initial={{ opacity: 0, y: 30 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, amount: 0.2 }}
//                 transition={{
//                   delay: index * 0.1,
//                   duration: 0.5,
//                   type: "spring",
//                   stiffness: 90,
//                 }}
//               >
//                 <Card className='h-full hover:shadow-primary/10 transition-shadow duration-300'>
//                   <CardHeader>
//                     <motion.div
//                       className='text-primary mb-4 inline-block p-3 bg-primary/10 rounded-lg'
//                       variants={featureIconVariants}
//                       whileHover='hover'
//                       whileTap='tap'
//                     >
//                       {feature.icon}
//                     </motion.div>
//                     <CardTitle className='text-2xl'>{feature.title}</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <CardDescription className='text-base'>
//                       {feature.description}
//                     </CardDescription>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Enhanced Full Featured 3D Shapes Studio Section */}
//       <section className='py-20 md:py-32 bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden'>
//         {/* Background decorations */}
//         <div className='absolute top-0 left-0 w-full h-full opacity-30'>
//           <div className='absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse'></div>
//           <div className='absolute bottom-40 right-20 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-500'></div>
//           <div className='absolute top-1/2 left-1/3 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-pulse delay-1000'></div>
//         </div>

//         <div className='container mx-auto px-4 relative z-10'>
//           <motion.div
//             className='text-center mb-16'
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.6 }}
//           >
//             <h2 className='text-4xl md:text-5xl font-bold text-foreground mb-4'>
//               Experience the Full Studio
//             </h2>
//             <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
//               Dive into the complete 3D shape creation environment. Interact,
//               customize, and see the power of real-time PBR rendering.
//             </p>
//           </motion.div>

//           <motion.div
//             className='relative'
//             initial={{ opacity: 0, y: 50, scale: 0.95 }}
//             whileInView={{ opacity: 1, y: 0, scale: 1 }}
//             viewport={{ once: true, amount: 0.1 }}
//             transition={{
//               duration: 0.8,
//               type: "spring",
//               stiffness: 50,
//               damping: 15,
//             }}
//           >
//             {/* Enhanced container with multiple visual effects */}
//             <div className='relative rounded-3xl overflow-hidden shadow-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-lg'>
//               {/* Top bar with controls */}
//               <div className='bg-gradient-to-r from-primary/10 to-secondary/10 p-4 border-b border-border/20 flex items-center justify-between'>
//                 <div className='flex items-center gap-3'>
//                   <div className='flex gap-2'>
//                     <div className='w-3 h-3 bg-red-500 rounded-full'></div>
//                     <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
//                     <div className='w-3 h-3 bg-green-500 rounded-full'></div>
//                   </div>
//                   <span className='text-sm font-medium text-muted-foreground'>
//                     3D Shape Studio
//                   </span>
//                 </div>
//                 <div className='flex items-center gap-2 text-xs text-muted-foreground'>
//                   <span className='flex items-center gap-1'>
//                     <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
//                     Live Preview
//                   </span>
//                 </div>
//               </div>

//               {/* Enhanced 3D component container */}
//               <div className='relative min-h-[70vh] md:min-h-[80vh] bg-gradient-to-br from-slate-950/90 to-slate-900/90'>
//                 {/* Ambient lighting effect */}
//                 <div className='absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none'></div>

//                 {/* Grid pattern overlay */}
//                 <div className='absolute inset-0 opacity-5'>
//                   <div className='w-full h-full bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]'></div>
//                 </div>

//                 {/* Main 3D component */}
//                 <div className='relative w-full h-full'>
//                   <Enhanced3DShapes />
//                 </div>

//                 {/* Interactive hints */}
//                 <div className='absolute bottom-6 left-6 right-6 flex justify-between items-end'>
//                   <div className='bg-background/90 backdrop-blur-sm rounded-lg p-4 max-w-xs opacity-0 hover:opacity-100 transition-opacity duration-300'>
//                     <h4 className='font-semibold text-sm mb-2'>Pro Tips:</h4>
//                     <ul className='text-xs text-muted-foreground space-y-1'>
//                       <li>• Drag to rotate the view</li>
//                       <li>• Scroll to zoom in/out</li>
//                       <li>• Use controls to customize</li>
//                     </ul>
//                   </div>

//                   <div className='flex gap-2'>
//                     <Button
//                       size='sm'
//                       variant='secondary'
//                       className='bg-background/90 backdrop-blur-sm'
//                     >
//                       <Download className='h-4 w-4 mr-2' />
//                       Export
//                     </Button>
//                     <Button
//                       size='sm'
//                       className='bg-primary/90 backdrop-blur-sm'
//                     >
//                       <Sparkles className='h-4 w-4 mr-2' />
//                       Customize
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating performance indicators */}
//             <motion.div
//               className='absolute -top-4 -right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-2'
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 1.5, type: "spring" }}
//             >
//               <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
//               60 FPS
//             </motion.div>

//             <motion.div
//               className='absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg'
//               initial={{ opacity: 0, scale: 0 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ delay: 1.7, type: "spring" }}
//             >
//               WebGL 2.0
//             </motion.div>
//           </motion.div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className='py-20 md:py-32 bg-gradient-to-br from-primary/80 to-primary'>
//         <div className='container mx-auto px-4 text-center'>
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true, amount: 0.3 }}
//             transition={{ duration: 0.7 }}
//           >
//             <h2 className='text-4xl md:text-5xl font-bold text-primary-foreground mb-6'>
//               Ready to Shape Your Ideas?
//             </h2>
//             <p className='text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto'>
//               Join thousands of creators. Start building stunning 3D models with
//               unparalleled ease and visual fidelity today. No complex software
//               needed.
//             </p>
//             <Button
//               asChild
//               size='lg'
//               variant='secondary'
//               className='gap-2 text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-shadow'
//             >
//               <Link href='/models'>
//                 Get Started for Free <ArrowRight className='h-5 w-5' />
//               </Link>
//             </Button>
//           </motion.div>
//         </div>
//       </section>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  Settings2, // Changed from PanelRight for "Studio" section
  Zap,
  Palette,
  Sparkles,
  Download,
  Play,
  Pause,
  MousePointer2, // For interactivity hint
  Layers, // For feature
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
import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes"; // Your interactive hero component
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
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const heroItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const previewGlowVariants = {
  animate: {
    boxShadow: [
      "0 0 30px 0px rgba(168, 85, 247, 0.3)", // Lighter, more spread out
      "0 0 50px 5px rgba(129, 140, 248, 0.3)", // Indigoish
      "0 0 30px 0px rgba(168, 85, 247, 0.3)",
    ],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const floatingPreviewVariants = {
  animate: {
    y: [0, -8, 0, 8, 0], // More subtle float
    transition: {
      duration: 6,
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
      description:
        "Start with diverse base shapes or import your own GLB/GLTF models for limitless possibilities.",
    },
    {
      icon: <Palette className='h-10 w-10' />,
      title: "Advanced PBR Materials",
      description:
        "Apply realistic metallic, glass, crystal, or organic finishes with full control over physical properties.",
    },
    {
      icon: <Sparkles className='h-10 w-10' />,
      title: "Dynamic Animations",
      description:
        "Bring shapes to life with preset animations, or animate imported models using their embedded clips.",
    },
    {
      icon: <Settings2 className='h-10 w-10' />,
      title: "Intuitive Customization",
      description:
        "Fine-tune every aspect: color, depth, lighting, textures, and post-processing effects via a user-friendly panel.",
    },
    {
      icon: <Layers className='h-10 w-10' />,
      title: "3D Text & Image Planes",
      description:
        "Add depth with extruded 3D text using custom fonts, or incorporate 2D images as planes within your scene.",
    },
    {
      icon: <Download className='h-10 w-10' />,
      title: "Professional Export",
      description:
        "Download creations as GLB (static or animated) or OBJ, ready for any 3D workflow or platform.",
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
      <section className='relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden py-16 md:py-0 bg-background'>
        {/* Subtle Animated Background Grid */}
        <div className='absolute inset-0 -z-10 h-full w-full bg-transparent'>
          <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,rgba(129,140,248,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(129,140,248,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,#000_70%,transparent_100%)] opacity-70'></div>
        </div>
        {/* Gradient Overlay */}
        <div className='absolute inset-0 z-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900 pointer-events-none'></div>

        <div className='container mx-auto px-4 z-10'>
          <motion.div
            className='flex flex-col lg:flex-row items-center justify-between gap-12 xl:gap-24'
            variants={containerVariants}
            initial='hidden'
            animate='visible'
          >
            <div className='lg:w-1/2 text-center lg:text-left'>
              <motion.h1
                className='text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-50 mb-6 leading-tight tracking-tight'
                variants={heroItemVariants}
              >
                Create Immersive{" "}
                <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400'>
                  3D Experiences
                </span>
              </motion.h1>

              <motion.p
                className='text-lg md:text-xl text-slate-300 mb-10'
                variants={heroItemVariants}
              >
                The intuitive 3D design studio for crafting stunning shapes,
                customizing PBR materials, animating scenes, and exporting
                professional models.
              </motion.p>

              <motion.div
                className='flex flex-col sm:flex-row justify-center lg:justify-start gap-4'
                variants={heroItemVariants}
              >
                <Button
                  asChild
                  size='xl' // Larger button
                  className='gap-2.5 text-lg px-10 py-7 rounded-xl shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:ring-4 focus:ring-purple-400/50'
                >
                  <Link href='/models'>
                    {" "}
                    {/* Assuming /models is your studio page */}
                    Launch Studio <Zap className='h-5 w-5' />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant='outline'
                  size='xl'
                  className='gap-2.5 text-lg px-10 py-7 rounded-xl border-slate-600 hover:bg-slate-700/30 hover:border-slate-500 text-slate-200 transition-all'
                >
                  <Link href='/showcase'>
                    {" "}
                    {/* Link to a showcase page */}
                    View Examples <ArrowRight className='h-5 w-5' />
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
                  className='rounded-xl'
                >
                  <Card className='overflow-hidden shadow-2xl border-purple-500/30 bg-slate-800/50 backdrop-blur-md'>
                    <div className='absolute top-3 left-3 z-20 flex items-center gap-1.5'>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 text-slate-300 hover:text-white bg-black/20 hover:bg-black/40 rounded-full'
                        onClick={() =>
                          setIsHeroPreviewPlaying(!isHeroPreviewPlaying)
                        }
                      >
                        {isHeroPreviewPlaying ? (
                          <Pause className='h-4 w-4' />
                        ) : (
                          <Play className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {isHeroPreviewPlaying
                            ? "Pause Preview"
                            : "Play Preview"}
                        </span>
                      </Button>
                    </div>
                    <div className='absolute top-3 right-3 z-20 flex items-center gap-1.5'>
                      <div className='w-2.5 h-2.5 bg-red-500 rounded-full opacity-70'></div>
                      <div className='w-2.5 h-2.5 bg-yellow-400 rounded-full opacity-70'></div>
                      <div className='w-2.5 h-2.5 bg-green-500 rounded-full opacity-70'></div>
                    </div>

                    <AspectRatio ratio={16 / 10} className='bg-transparent'>
                      <div className='w-full h-full relative'>
                        {/* Ensure Enhanced3DShapes handles its own loading/suspense */}
                        <Enhanced3DShapes isPlaying={isHeroPreviewPlaying} />
                        <div className='absolute bottom-3 left-3 right-3 bg-black/30 backdrop-blur-sm rounded-md p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                          <p className='text-xs text-slate-300 flex items-center justify-center'>
                            <MousePointer2 size={14} className='mr-1.5' />{" "}
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
      <section className='py-20 md:py-28 bg-slate-900 border-y border-slate-800'>
        <div className='container mx-auto px-4'>
          <motion.div
            className='text-center mb-16'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-slate-50 mb-4 tracking-tight'>
              Powerfully Simple 3D Creation
            </h2>
            <p className='text-lg md:text-xl text-slate-400 max-w-3xl mx-auto'>
              Everything you need to design and animate compelling 3D assets,
              all in one intuitive interface.
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
              >
                <Card className='h-full bg-slate-800/50 border-slate-700/70 hover:border-purple-500/50 hover:shadow-purple-500/10 transition-all duration-300 ease-out transform hover:-translate-y-1 group'>
                  <CardHeader>
                    <motion.div
                      className='text-purple-400 mb-5 inline-block p-3 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors'
                      whileHover={{ scale: 1.1, rotate: -5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <CardTitle className='text-2xl text-slate-100'>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className='text-base text-slate-300'>
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Embedded Studio Section (if it's the same component, just style its container) */}
      <section className='py-20 md:py-32 bg-slate-950'>
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
              className='mb-4 text-purple-400 border-purple-400/50 bg-purple-500/10 text-sm px-4 py-1'
            >
              Live Studio Demo
            </Badge>
            <h2 className='text-4xl md:text-5xl font-bold text-slate-50 mb-4 tracking-tight'>
              Try the Studio Now
            </h2>
            <p className='text-lg md:text-xl text-slate-400 max-w-3xl mx-auto'>
              Get hands-on with the core features. Click, drag, and customize in
              real-time. This is a simplified preview of the full editor.
            </p>
          </motion.div>

          <motion.div
            className='relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50'
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} // Smoother spring-like ease
          >
            <div className='bg-slate-800 p-3 border-b border-slate-700 flex items-center gap-2'>
              <div className='w-3 h-3 bg-red-500 rounded-full'></div>
              <div className='w-3 h-3 bg-yellow-400 rounded-full'></div>
              <div className='w-3 h-3 bg-green-500 rounded-full'></div>
              <span className='ml-auto text-xs text-slate-500'>
                Interactive Demo
              </span>
            </div>
            <div className='min-h-[60vh] md:min-h-[75vh] lg:min-h-[85vh] w-full bg-slate-900 relative'>
              {/* Using Enhanced3DShapes here again, but it should ideally be distinct or configured for a "demo" mode */}
              <Enhanced3DShapes isPlaying={true} demoMode={true} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 md:py-32 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600'>
        <div className='container mx-auto px-4 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className='text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight'>
              Ready to Shape Your Vision?
            </h2>
            <p className='text-xl text-purple-100/90 mb-10 max-w-2xl mx-auto'>
              Experience the future of 3D design. Simple for beginners, powerful
              for pros. Start creating for free today!
            </p>
            <Button
              asChild
              size='xl'
              variant='secondary' // Or a custom "premium" variant
              className='gap-2.5 text-lg px-10 py-7 rounded-xl shadow-2xl bg-white text-purple-700 hover:bg-slate-100 transition-all duration-300 transform hover:scale-105 focus:ring-4 focus:ring-white/50'
            >
              <Link href='/models'>
                Get Started Now <ArrowRight className='h-5 w-5' />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
