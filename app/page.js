
"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Download,
  Layers,
  MousePointer2,
  Palette,
  Pause,
  Play,
  Settings2,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import Enhanced3DShapes from "@/components/Enhanced3DShapes/Enhanced3DShapes";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.25 },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const featureCardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const previewVariants = {
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const features = [
  {
    icon: Box,
    title: "Model starter kit",
    description:
      "Begin with clean shapes or import GLB and GLTF assets for a more custom 3D composition.",
    meta: "Create",
  },
  {
    icon: Palette,
    title: "Material direction",
    description:
      "Shape the mood with matte, glass, metallic, ceramic, and soft-surface material controls.",
    meta: "Style",
  },
  {
    icon: Sparkles,
    title: "Quiet motion",
    description:
      "Add movement with useful presets and embedded model clips without making the scene feel noisy.",
    meta: "Motion",
  },
  {
    icon: Settings2,
    title: "Scene controls",
    description:
      "Tune light, camera, texture, depth, and preview settings from one focused creative panel.",
    meta: "Refine",
  },
  {
    icon: Layers,
    title: "Layered composition",
    description:
      "Combine 3D text, image planes, product visuals, and spatial elements with practical depth.",
    meta: "Compose",
  },
  {
    icon: Download,
    title: "Production export",
    description:
      "Download GLB or OBJ files for web previews, client work, product mockups, or creative delivery.",
    meta: "Export",
  },
];

const proofPoints = [
  "Browser-based workflow",
  "Real-time preview",
  "Export-ready assets",
];

const workflow = [
  {
    step: "01",
    title: "Start with form",
    text: "Choose a primitive, import a model, or open a blank scene and establish the visual direction.",
  },
  {
    step: "02",
    title: "Shape the atmosphere",
    text: "Use material, lighting, camera, and motion controls to create a polished visual language.",
  },
  {
    step: "03",
    title: "Prepare for delivery",
    text: "Preview the final scene and export clean files for client presentation or production use.",
  },
];

export default function Home() {
  const [isHeroPreviewPlaying, setIsHeroPreviewPlaying] = useState(true);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen bg-[#f6f1e8] text-stone-950 dark:bg-stone-950 dark:text-stone-50"
    >
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden border-b border-stone-200/80 bg-[#f6f1e8] dark:border-white/10 dark:bg-stone-950">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(180,83,9,0.15),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(15,118,110,0.12),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.58),transparent_44%)] dark:bg-[radial-gradient(circle_at_18%_12%,rgba(245,158,11,0.13),transparent_28%),radial-gradient(circle_at_88%_16%,rgba(20,184,166,0.08),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.04),transparent_44%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,25,23,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.045)_1px,transparent_1px)] bg-[size:76px_76px] opacity-40 [mask-image:radial-gradient(ellipse_74%_58%_at_50%_36%,#000_48%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)]" />
        </div>

        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] xl:gap-16"
          >
            <div className="max-w-2xl">
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center rounded-full border border-stone-300/80 bg-white/60 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-700 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300">
                  Browser-based 3D studio
                </span>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mt-7 max-w-3xl text-[2.65rem] font-semibold leading-[0.98] tracking-[-0.055em] text-stone-950 dark:text-white sm:text-5xl md:text-[3.7rem] lg:text-[4.25rem] xl:text-[4.8rem]"
              >
                Design refined 3D scenes from a clean creative workspace.
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mt-6 max-w-xl text-base leading-8 text-stone-700 dark:text-stone-300 sm:text-lg"
              >
                Create shapes, style materials, preview motion, and export
                polished 3D assets without jumping between complex tools.
              </motion.p>

              <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-stone-950 px-7 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(28,25,23,0.22)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
                >
                  <Link href="/models">
                    Launch studio <ArrowRight className="ml-2 inline h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-13 rounded-full border-stone-300 bg-white/50 px-7 text-sm font-semibold text-stone-900 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
                >
                  <Link href="/showcase">
                    View examples <Zap className="ml-2 inline h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-8 grid gap-3 text-sm text-stone-700 dark:text-stone-300 sm:grid-cols-3"
              >
                {proofPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-amber-700 dark:text-amber-400" />
                    <span>{point}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-amber-900/10 via-stone-900/5 to-teal-900/10 blur-3xl dark:from-amber-500/10 dark:via-white/5 dark:to-teal-500/10" />

              <motion.div
                variants={previewVariants}
                animate="animate"
                className="relative overflow-hidden rounded-[1.8rem] border border-stone-300/80 bg-stone-950 p-2 shadow-[0_30px_80px_rgba(28,25,23,0.22)] dark:border-white/10"
              >
                <Card className="overflow-hidden rounded-[1.35rem] border-0 bg-[#f8f4ec] shadow-none dark:bg-stone-900">
                  <div className="flex items-center justify-between border-b border-stone-200 bg-white/75 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                      <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                    </div>

                    <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-medium text-stone-600 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-300">
                      Live preview
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={
                        isHeroPreviewPlaying
                          ? "Pause 3D preview"
                          : "Play 3D preview"
                      }
                      className="h-8 w-8 rounded-full text-stone-600 hover:bg-stone-100 hover:text-stone-950 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
                      onClick={() =>
                        setIsHeroPreviewPlaying((current) => !current)
                      }
                    >
                      {isHeroPreviewPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <AspectRatio
                    ratio={16 / 10}
                    className="bg-[radial-gradient(circle_at_50%_25%,rgba(245,158,11,0.10),transparent_35%),linear-gradient(135deg,#faf8f3,#e9e1d3)] dark:bg-[radial-gradient(circle_at_50%_25%,rgba(245,158,11,0.13),transparent_35%),linear-gradient(135deg,#11100e,#292524)]"
                  >
                    <div className="group relative h-full w-full">
                      <Enhanced3DShapes isPlaying={isHeroPreviewPlaying} />

                      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-2xl border border-white/60 bg-white/55 px-4 py-3 text-sm text-stone-700 opacity-0 shadow-sm backdrop-blur-xl transition-all duration-500 group-hover:opacity-100 dark:border-white/10 dark:bg-black/30 dark:text-stone-300">
                        <span className="flex items-center gap-2 font-medium">
                          <MousePointer2 className="h-4 w-4" />
                          Drag to orbit
                        </span>
                        <span className="text-xs text-stone-500 dark:text-stone-400">
                          Real-time scene
                        </span>
                      </div>
                    </div>
                  </AspectRatio>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Section */}
      <section className="border-b border-stone-200/80 bg-[#fbfaf7] py-16 dark:border-white/10 dark:bg-stone-950 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800 dark:text-amber-400">
                Creative control
              </span>

              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl md:text-5xl">
                A studio that keeps the important controls close.
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-stone-600 dark:text-stone-300 md:ml-auto">
              The interface is built around useful creative decisions: form,
              material, light, motion, and export. Everything else stays out of
              the way.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.12 }}
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  variants={featureCardVariants}
                  custom={index}
                >
                  <Card className="group h-full overflow-hidden rounded-[1.5rem] border-stone-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-[0_24px_60px_rgba(28,25,23,0.08)] dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/20">
                    <CardHeader className="space-y-5 p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-[#f7f1e6] text-stone-900 transition-colors duration-300 group-hover:bg-amber-100 group-hover:text-amber-900 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:group-hover:bg-amber-500/10 dark:group-hover:text-amber-300">
                          <Icon className="h-5 w-5" />
                        </div>

                        <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400">
                          {feature.meta}
                        </span>
                      </div>

                      <div>
                        <CardTitle className="text-xl font-semibold tracking-[-0.025em] text-stone-950 dark:text-white">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-[#f6f1e8] py-16 dark:bg-stone-950 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
              className="lg:sticky lg:top-24"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800 dark:text-amber-400">
                Workflow
              </span>

              <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl md:text-5xl">
                From first shape to finished visual in a calmer flow.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-8 text-stone-600 dark:text-stone-300">
                The experience is intentionally simple: start with form, shape
                the atmosphere, then export what you need.
              </p>
            </motion.div>

            <div className="grid gap-4">
              {workflow.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    delay: index * 0.07,
                    duration: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="rounded-[1.5rem] border border-stone-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.035]"
                >
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-950 text-sm font-semibold text-white dark:bg-white dark:text-stone-950">
                      {item.step}
                    </span>

                    <div>
                      <h3 className="text-xl font-semibold tracking-[-0.025em] text-stone-950 dark:text-white">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                        {item.text}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Studio Demo Section */}
      <section className="border-y border-stone-200/80 bg-[#fbfaf7] py-16 dark:border-white/10 dark:bg-stone-950 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"
          >
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-800 dark:text-amber-400">
                Interactive preview
              </span>

              <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] text-stone-950 dark:text-white sm:text-4xl md:text-5xl">
                Test the feel before opening a blank canvas.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-stone-600 dark:text-stone-300">
              A live scene gives visitors confidence that this is a real product
              experience, not just another static landing page.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.975 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-[1.8rem] border border-stone-300 bg-stone-950 p-2 shadow-[0_30px_80px_rgba(28,25,23,0.18)] dark:border-white/10"
          >
            <div className="overflow-hidden rounded-[1.35rem] bg-[#f8f4ec] dark:bg-stone-900">
              <div className="flex items-center gap-3 border-b border-stone-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                  <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-white/20" />
                </div>

                <span className="text-sm font-medium text-stone-600 dark:text-stone-300">
                  3D Studio / Scene Preview
                </span>

                <div className="ml-auto flex items-center gap-2 rounded-full border border-emerald-700/15 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-400/15 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-300" />
                  Live
                </div>
              </div>

              <div className="relative min-h-[56vh] w-full bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.10),transparent_34%),linear-gradient(135deg,#faf8f3,#e8dfd0)] dark:bg-[radial-gradient(circle_at_50%_15%,rgba(245,158,11,0.14),transparent_34%),linear-gradient(135deg,#11100e,#292524)] md:min-h-[70vh] lg:min-h-[78vh]">
                <Enhanced3DShapes isPlaying={true} demoMode={true} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-stone-950 py-16 text-white md:py-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_20%,rgba(245,158,11,0.16),transparent_30%),radial-gradient(circle_at_82%_12%,rgba(20,184,166,0.10),transparent_26%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:76px_76px] opacity-50 [mask-image:radial-gradient(ellipse_72%_55%_at_50%_40%,#000_50%,transparent_100%)]" />
        </div>

        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl"
          >
            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-stone-300">
              Start with a real scene
            </span>

            <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.045em] text-white sm:text-4xl md:text-5xl lg:text-6xl">
              Create polished 3D assets from one focused workspace.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-300">
              Build product visuals, experimental forms, client concepts, and
              exportable files with a calmer creative process.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-13 rounded-full bg-white px-8 text-sm font-semibold text-stone-950 shadow-[0_20px_55px_rgba(255,255,255,0.12)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-stone-200"
              >
                <Link href="/models">
                  Open studio <ArrowRight className="ml-2 inline h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-13 rounded-full border-white/15 bg-white/[0.04] px-8 text-sm font-semibold text-white backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/[0.08]"
              >
                <Link href="/showcase">See showcase</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-stone-400">
              Create, refine, preview, and export professional 3D assets.
            </p>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
