"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, Twitter, Linkedin, Heart, Mail } from "lucide-react";

const Footer = () => {
  const [isHovered, setIsHovered] = useState(false);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "Github",
      icon: <Github className='h-5 w-5' />,
      href: "https://github.com",
    },
    {
      name: "Twitter",
      icon: <Twitter className='h-5 w-5' />,
      href: "https://twitter.com",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className='h-5 w-5' />,
      href: "https://linkedin.com",
    },
    {
      name: "Email",
      icon: <Mail className='h-5 w-5' />,
      href: "mailto:contact@example.com",
    },
  ];

  const footerLinks = [
    {
      section: "Navigation",
      links: [
        { name: "Home", href: "/" },
        { name: "Models", href: "/models" },
        { name: "Creator", href: "/model-creator" },
        { name: "About", href: "/about" },
      ],
    },
    {
      section: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "API", href: "/api" },
        { name: "Support", href: "/support" },
      ],
    },
    {
      section: "Legal",
      links: [
        { name: "Privacy", href: "/privacy" },
        { name: "Terms", href: "/terms" },
        { name: "Cookies", href: "/cookies" },
      ],
    },
  ];

  return (
    <footer className='w-full border-t border-gray-800 dark:border-gray-700 bg-white dark:bg-gray-950 py-12 mt-24'>
      <div className='container mx-auto px-4 md:px-6'>
        {/* Main footer content */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10'>
          {/* Brand section */}
          <div className='space-y-4'>
            <Link href='/' className='flex items-center'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent'
              >
                Hono Dev Studio
              </motion.div>
            </Link>
            <p className='text-gray-600 dark:text-gray-400 text-sm'>
              Create, showcase, and share amazing 3D models with our intuitive
              platform built for creators of all skill levels.
            </p>
            <div className='flex space-x-4'>
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target='_blank'
                  rel='noopener noreferrer'
                  whileHover={{ y: -3 }}
                  className='text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors'
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          {footerLinks.map((section) => (
            <div key={section.section} className='space-y-4'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                {section.section}
              </h3>
              <ul className='space-y-2'>
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className='text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 transition-colors text-sm'
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className='mt-12 border-t border-gray-200 dark:border-gray-800 pt-8'>
          <div className='max-w-md mx-auto lg:mx-0'>
            <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              Join our newsletter
            </h3>
            <form className='flex flex-col sm:flex-row gap-2'>
              <input
                type='email'
                placeholder='Enter your email'
                className='px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-grow'
                required
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type='submit'
                className='px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium'
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className='mt-12 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4'>
          <p className='text-gray-600 dark:text-gray-400 text-sm'>
            © {currentYear} 3D Model Hub. All rights reserved.
          </p>
          <motion.div
            className='flex items-center text-gray-600 dark:text-gray-400 text-sm'
            whileHover={{ scale: 1.05 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            Made with
            <motion.span
              animate={{ scale: isHovered ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: isHovered ? Infinity : 0, duration: 0.6 }}
              className='mx-1 text-red-500'
            >
              <Heart className='h-4 w-4 fill-current' />
            </motion.span>
            by Hono Dev Studio & Dilshan Jayatissa
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
