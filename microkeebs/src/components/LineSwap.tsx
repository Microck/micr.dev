import { motion } from 'motion/react';

interface LineSwapProps {
  text: string;
  className?: string;
}

export function LineSwap({ text, className = "" }: LineSwapProps) {
  return (
    <div className={`relative overflow-hidden cursor-pointer group ${className}`}>
      <motion.div
        initial={{ y: 0 }}
        whileHover={{ y: "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="h-full">{text}</div>
        <div className="h-full absolute top-full left-0 w-full">{text}</div>
      </motion.div>
    </div>
  );
}
