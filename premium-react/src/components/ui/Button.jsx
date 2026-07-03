import { motion } from 'motion/react';
import { cn } from '../../lib/cn';

export function Button({ className, children, variant = 'primary', ...props }) {
  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className={cn('button', variant === 'ghost' && 'button-ghost', className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
