"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Box, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "./ThemeToggle";
import MobileNav from "./MobileNav";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/models", label: "Create" },
    { href: "/showcase", label: "Showcase" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
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
  );
}
