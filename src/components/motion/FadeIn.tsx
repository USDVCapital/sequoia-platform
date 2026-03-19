"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distance?: number;
  once?: boolean;
  amount?: number;
}

const getVariants = (
  direction: FadeInProps["direction"],
  distance: number
): Variants => {
  const axis =
    direction === "left" || direction === "right" ? "x" : "y";
  const sign =
    direction === "down" || direction === "right" ? -distance : distance;

  return {
    hidden: {
      opacity: 0,
      ...(direction !== "none" && { [axis]: sign }),
    },
    visible: {
      opacity: 1,
      ...(direction !== "none" && { [axis]: 0 }),
    },
  };
};

export default function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 24,
  once = true,
  amount = 0.15,
}: FadeInProps) {
  return (
    <motion.div
      className={className}
      variants={getVariants(direction, distance)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
