import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { YoutubeIcon } from '@/components/ui/youtube';
import { InstagramIcon } from '@/components/ui/instagram';

interface SocialIconsProps {
  isDark: boolean;
  className?: string;
}

export function SocialIcons({ isDark, className = '' }: SocialIconsProps) {
  const iconColor = isDark ? 'text-[#a7a495]' : 'text-[#1c1c1c]';

  return (
    <div className={`hidden sm:flex items-center space-x-4 ${className}`}>
      <motion.a
        href="https://www.youtube.com/@microkeebs"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        whileTap={{ scale: 0.95 }}
      >
        <YoutubeIcon size={20} />
      </motion.a>
      <motion.a
        href="https://www.instagram.com/microkeebs/"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        whileTap={{ scale: 0.95 }}
      >
        <InstagramIcon size={20} />
      </motion.a>
      <motion.a
        href="https://www.tiktok.com/@microkeebs"
        target="_blank"
        rel="noopener noreferrer"
        className={`${iconColor} transition-opacity hover:opacity-70 interactive`}
        whileHover={{ scale: 1.1, rotate: [0, 15, -15, 0] }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mingcute:tiktok-line" className="w-5 h-5" />
      </motion.a>
    </div>
  );
}