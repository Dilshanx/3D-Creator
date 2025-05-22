"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MobileNav({ isOpen, onClose, links, activePath }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/60 z-40 md:hidden'
            onClick={onClose}
          />

          {/* Mobile menu panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className='fixed inset-y-0 right-0 w-3/4 max-w-sm bg-white dark:bg-gray-900 z-50 md:hidden flex flex-col overflow-y-auto'
          >
            <div className='flex items-center justify-between p-4 border-b dark:border-gray-800'>
              <span className='font-semibold text-lg text-gray-900 dark:text-white'>
                Menu
              </span>
              <Button variant='ghost' size='icon' onClick={onClose}>
                <X className='h-5 w-5' />
                <span className='sr-only'>Close menu</span>
              </Button>
            </div>

            <nav className='p-4 flex flex-col gap-2'>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`py-3 px-4 rounded-lg font-medium ${
                    activePath === link.href
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
