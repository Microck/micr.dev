import { motion } from 'motion/react';

interface LineSwapProps {
  text?: string | React.ReactNode;
  front?: string | React.ReactNode;
  back?: string | React.ReactNode;
  className?: string;
}

export function LineSwap({ text, front, back, className = "" }: LineSwapProps) {
  const frontContent = front || text;
  const backContent = back || text;

  return (
    <div className={`relative overflow-hidden cursor-pointer group ${className}`}>
      <motion.div
        initial={{ y: 0 }}
        whileHover={{ y: "-100%" }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <div className="h-full">{frontContent}</div>
        <div className="h-full absolute top-full left-0 w-full">{backContent}</div>
      </motion.div>
    </div>
  );
}
