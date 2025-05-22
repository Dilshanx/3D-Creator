import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and merges Tailwind CSS classes efficiently
 * @param  {...string} inputs - Class names to combine
 * @returns {string} - Merged class string with conflicts resolved
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object to a human-readable string
 * @param {Date} date - Date to format
 * @param {Object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date string
 */
export function formatDate(date, options = {}) {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Date(date).toLocaleDateString("en-US", {
    ...defaultOptions,
    ...options,
  });
}

/**
 * Handles errors in async functions
 * @param {Function} fn - Async function to execute
 * @returns {Promise} - Promise that never rejects
 */
export const catchErrors = async (fn) => {
  try {
    return [await fn(), null];
  } catch (error) {
    console.error(error);
    return [null, error];
  }
};

/**
 * Debounces a function call
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

/**
 * Truncates text to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} - Truncated text with ellipsis if needed
 */
export function truncateText(text, length = 100) {
  if (!text || text.length <= length) return text;
  return `${text.substring(0, length).trim()}...`;
}
