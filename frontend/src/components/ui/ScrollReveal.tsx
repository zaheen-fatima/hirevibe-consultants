import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const MotionDiv = motion.create('div');

export function ScrollReveal({ children, delay = 0, y = 22 }: { children: ReactNode; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <MotionDiv
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.58, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionDiv>
  );
}
