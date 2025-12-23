import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`${isDark ? 'bg-[#1c1c1c]' : 'bg-[#a7a495]'} mt-auto`}>
    </footer>
  );
}
