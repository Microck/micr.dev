import { useTheme } from '../contexts/ThemeContext';

type TemplatePreviewProps = {
  href: string;
  children: React.ReactNode;
};

export function TemplatePreview({ href, children }: TemplatePreviewProps) {
  const { isDark } = useTheme();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`cursor-target button-morph inline-flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-medium transition-colors ${
        isDark
          ? 'bg-[#a7a495] text-[#1c1c1c] hover:bg-[#c7c4b3]'
          : 'bg-[#1c1c1c] text-[#a7a495] hover:bg-[#2a2a2a]'
      }`}
    >
      {children}
    </a>
  );
}
