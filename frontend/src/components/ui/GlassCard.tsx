import { Paper, type PaperProps } from '@mui/material';
import { motion, type MotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

export type GlassCardProps = Omit<PaperProps, 'component' | 'children'> &
  MotionProps & {
    children?: ReactNode;
    interactive?: boolean;
  };

const MotionPaper = motion.create(Paper);

export function GlassCard({ interactive = true, sx, children, ...props }: GlassCardProps) {
  return (
    <MotionPaper
      elevation={0}
      {...props}
      whileHover={interactive ? (props.whileHover ?? { y: -4 }) : props.whileHover}
      transition={props.transition ?? { duration: 0.28, ease: 'easeOut' }}
      sx={{
        p: 2.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3.5,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))'
            : 'linear-gradient(145deg, rgba(255,255,255,.98), rgba(245,247,249,.98))',
        backdropFilter: 'blur(16px)',
        ...sx,
      }}
    >
      {children}
    </MotionPaper>
  );
}
