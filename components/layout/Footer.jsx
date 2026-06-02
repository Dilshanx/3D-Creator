"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Box,
  Github,
  Heart,
  Linkedin,
  Mail,
  Sparkles,
} from "lucide-react";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      icon: <Github className="h-4 w-4" />,
      href: "https://github.com/Dilshanx",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      href: "https://www.linkedin.com",
    },
    {
      name: "Email",
      icon: <Mail className="h-4 w-4" />,
      href: "mailto:dilshanjayatissa@gmail.com",
    },
  ];

  const footerLinks = [
    {
      section: "Studio",
      links: [
        { name: "Home", href: "/" },
        { name: "Models", href: "/model" },
        { name: "3D Creator", href: "/modelcreator" },
        { name: "Showroom", href: "/modelshowroom" },
      ],
    },
    {
      section: "Create",
      links: [
        { name: "Model Display", href: "/modeldisplay" },
        { name: "Scene Preview", href: "/modelcreator" },
        { name: "Export Assets", href: "/modelcreator" },
        { name: "Browse Models", href: "/model" },
      ],
    },
    {
      section: "Built by",
      links: [
        {
          name: "Lyncore",
          href: "https://www.lyncore.dev/",
          external: true,
        },
        {
          name: "Dilshan Jayatissa",
          href: "https://www.dilshanjayatissa.online/",
          external: true,
        },
      ],
    },
  ];

  return (
    <footer className="relative mt-20 w-full overflow-hidden border-t border-stone-200/80 bg-[#f6f1e8] text-stone-950 dark:border-white/10 dark:bg-stone-950 dark:text-white">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(180,83,9,0.13),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(15,118,110,0.10),transparent_25%)] dark:bg-[radial-gradient(circle_at_18%_20%,rgba(245,158,11,0.11),transparent_28%),radial-gradient(circle_at_86%_10%,rgba(20,184,166,0.07),transparent_25%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,25,23,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,25,23,0.04)_1px,transparent_1px)] bg-[size:76px_76px] opacity-35 [mask-image:radial-gradient(ellipse_72%_55%_at_50%_35%,#000_45%,transparent_100%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]" />
      </div>

      <div className="container mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_1fr_1fr_1fr] lg:gap-12">
          <div className="max-w-md">
            <Link href="/" className="inline-flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.04, rotate: -2 }}
                transition={{ duration: 0.2 }}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-200 bg-white text-stone-950 shadow-sm dark:border-white/10 dark:bg-white/[0.05] dark:text-white"
              >
                <Box className="h-5 w-5" />
              </motion.div>

              <div>
                <span className="block text-xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white">
                  3D Creator
                </span>
                <span className="mt-0.5 block text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-800 dark:text-amber-400">
                  Browser-based studio
                </span>
              </div>
            </Link>

            <p className="mt-5 text-sm leading-7 text-stone-600 dark:text-stone-400">
              Create, refine, preview, and export polished 3D assets from a
              focused workspace built for modern creative production.
            </p>

            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white/70 text-stone-600 shadow-sm backdrop-blur transition-colors hover:border-stone-300 hover:bg-white hover:text-stone-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.section}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {section.section}
              </h3>

              <ul className="mt-5 space-y-3">
                {section.links.map((link) => {
                  const className =
                    "group inline-flex items-center gap-1.5 text-sm text-stone-600 transition-colors hover:text-stone-950 dark:text-stone-400 dark:hover:text-white";

                  if (link.external) {
                    return (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={className}
                        >
                          {link.name}
                          <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                        </a>
                      </li>
                    );
                  }

                  return (
                    <li key={link.name}>
                      <Link href={link.href} className={className}>
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-[2rem] border border-stone-200 bg-white/68 p-5 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.035] sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-800/15 bg-amber-100/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-900 dark:border-amber-400/15 dark:bg-amber-400/10 dark:text-amber-300">
                <Sparkles className="h-3.5 w-3.5" />
                Creative workspace
              </div>

              <h3 className="mt-4 text-xl font-semibold tracking-[-0.035em] text-stone-950 dark:text-white sm:text-2xl">
                Build clean 3D visuals with a calmer design workflow.
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-600 dark:text-stone-400">
                Start with a shape, refine the material, preview the scene, and
                export assets when the composition feels ready.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/modelcreator"
                className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(28,25,23,0.16)] transition-transform hover:-translate-y-0.5 hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200"
              >
                Open 3D Creator
              </Link>

              <Link
                href="/modelshowroom"
                className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/70 px-5 text-sm font-semibold text-stone-900 backdrop-blur transition-transform hover:-translate-y-0.5 hover:bg-white dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/[0.08]"
              >
                View showroom
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-stone-200/80 pt-6 text-sm text-stone-500 dark:border-white/10 dark:text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} 3D Creator. All rights reserved.</p>

          <motion.div
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
            whileHover={{ scale: 1.01 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <span>Made with</span>

            <motion.span
              animate={{ scale: isHovered ? [1, 1.18, 1] : 1 }}
              transition={{ repeat: isHovered ? Infinity : 0, duration: 0.65 }}
              className="text-amber-700 dark:text-amber-400"
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.span>

            <span>by</span>

            <a
              href="https://www.lyncore.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-700 underline-offset-4 transition-colors hover:text-stone-950 hover:underline dark:text-stone-300 dark:hover:text-white"
            >
              Lyncore
            </a>

            <span>&amp;</span>

            <a
              href="https://www.dilshanjayatissa.online/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-700 underline-offset-4 transition-colors hover:text-stone-950 hover:underline dark:text-stone-300 dark:hover:text-white"
            >
              Dilshan Jayatissa
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;