import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Instagram, Music } from 'lucide-react';

interface SocialIconsProps {
  isDark: boolean;
  className?: string;
}

export function SocialIcons({ isDark, className = '' }: SocialIconsProps) {
  const iconVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const iconColor = isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]';

  return (
    <div className={`hidden sm:flex items-center space-x-4 ${className}`}>
      <motion.a
        href="https://www.youtube.com/@microkeebs"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        variants={iconVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Youtube size={20} />
      </motion.a>
      <motion.a
        href="https://www.instagram.com/microkeebs/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        variants={iconVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Instagram size={20} />
      </motion.a>
      <motion.a
        href="https://www.tiktok.com/@microkeebs"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        variants={iconVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Music size={20} />
      </motion.a>
    </div>
  );
}