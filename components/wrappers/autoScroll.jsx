"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export const AutoScrollingRow = ({ children, lng }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex"
        animate={{ x: [0, "-100%"] }}
        transition={{ repeat: Infinity, duration: 70, delay: 0.2 }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export const AnimatedSection = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.div>
  );
};
