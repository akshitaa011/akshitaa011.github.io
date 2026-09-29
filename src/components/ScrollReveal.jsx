import React from 'react';
import { motion } from 'framer-motion';

/**
 * High-Impact Dynamic Scroll Reveal Component
 * Provides smooth 3D perspective gliding, depth scaling, and blur dissipation
 * as the user journeys down the page.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  direction = "up", // 'up' | 'down' | 'left' | 'right' | 'zoom' | 'depth'
  staggerChildren = 0,
  once = false, // Re-animate smoothly on continuous scrolling for a living cosmos feel
}) {
  const getVariants = () => {
    switch (direction) {
      case "depth":
        return {
          hidden: {
            opacity: 0,
            y: 50,
            scale: 0.92,
            rotateX: 10,
            filter: "blur(12px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren || 0.1,
            },
          },
        };
      case "zoom":
        return {
          hidden: {
            opacity: 0,
            scale: 0.88,
            filter: "blur(8px)",
          },
          visible: {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case "left":
        return {
          hidden: {
            opacity: 0,
            x: -60,
            filter: "blur(8px)",
          },
          visible: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case "right":
        return {
          hidden: {
            opacity: 0,
            x: 60,
            filter: "blur(8px)",
          },
          visible: {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
            },
          },
        };
      case "up":
      default:
        return {
          hidden: {
            opacity: 0,
            y: 45,
            filter: "blur(6px)",
          },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren || 0.08,
            },
          },
        };
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.12 }}
      variants={getVariants()}
      style={{ perspective: 1200 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Child item for staggered parent lists
 */
export function ScrollItem({ children, className = "", delay = 0 }) {
  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
