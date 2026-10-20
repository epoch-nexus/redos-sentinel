import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

interface PageTransitionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
}

export const pageFadeVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      variants={pageFadeVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`w-full min-h-screen ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
