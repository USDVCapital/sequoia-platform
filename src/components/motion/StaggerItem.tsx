"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export default function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 20,
}: StaggerItemProps) {
  const isHorizontal = direction === "left" || direction === "right";
  const sign = direction === "down" || direction === "right" ? -distance : distance;

  const hidden = isHorizontal
    ? { opacity: 0, x: sign }
    : { opacity: 0, y: sign };

  const visible = isHorizontal
    ? { opacity: 1, x: 0 }
    : { opacity: 1, y: 0 };

  const variants: Variants = {
    hidden,
    visible: {
      ...visible,
      transition: {
        duration: 0.45,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
