"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Menu, X, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDesktopNotice, setShowDesktopNotice] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/modelcreator", label: "Create" },
    { href: "/modelshowroom", label: "Showroom" },
    { href: "/modeldisplay", label: "Display" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Check if device is mobile/tablet and show desktop notice
    const checkDevice = () => {
      const isMobile = window.innerWidth < 1024; // lg breakpoint
      if (isMobile && !localStorage.getItem("desktop-notice-dismissed")) {
        setShowDesktopNotice(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkDevice);
    };
  }, []);

  const dismissDesktopNotice = () => {
    setShowDesktopNotice(false);
    localStorage.setItem("desktop-notice-dismissed", "true");
  };

  return (
    <>
      {/* Desktop Experience Notice */}
      {showDesktopNotice && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className='bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 relative z-50'
        >
          <div className='container mx-auto flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Monitor className='h-5 w-5 flex-shrink-0' />
              <p className='text-sm font-medium'>
                For the best 3D modeling experience, we recommend using a
                desktop or laptop computer
              </p>
            </div>
            <Button
              variant='ghost'
              size='sm'
              onClick={dismissDesktopNotice}
              className='text-white hover:bg-white/20 ml-2'
            >
              <X className='h-4 w-4' />
            </Button>
          </div>
        </motion.div>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            <Link href='/' className='flex items-center gap-2'>
              <Box className='h-6 w-6 text-blue-600 dark:text-blue-400' />
              <span className='font-bold text-xl text-gray-900 dark:text-white'>
                3D Creator
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className='hidden md:flex items-center gap-6'>
              {navLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative font-medium transition-colors ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        className='absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400'
                        layoutId='navbar-indicator'
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className='flex items-center gap-4'>
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <Button
                variant='ghost'
                size='icon'
                className='md:hidden'
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          links={navLinks}
          activePath={pathname}
        />
      </header>
    </>
  );
}
