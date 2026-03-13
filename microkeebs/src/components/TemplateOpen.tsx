import { useTheme } from '../contexts/use-theme';

type TemplateOpenProps = {
  url: string;
  free?: boolean;
};

export function TemplateOpen({ url, free }: TemplateOpenProps) {
  const { isDark } = useTheme();

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`cursor-target button-morph inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
        isDark
          ? 'border-[#a7a495]/30 text-[#a7a495] hover:bg-[#a7a495]/10'
          : 'border-[#1c1c1c]/25 text-[#1c1c1c] hover:bg-[#1c1c1c]/5'
      }`}
    >
      Open Template
      {free ? (
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
            isDark ? 'border-[#a7a495]/30' : 'border-[#1c1c1c]/25'
          }`}
        >
          Free
        </span>
      ) : null}
    </a>
  );
}
