import { useTheme } from '../contexts/use-theme';

type TechStackProps = {
  technologies: string[];
};

const TECH_LABELS: Record<string, string> = {
  nextjs: 'Next.js',
  react: 'React',
  typescript: 'TypeScript',
  tailwindcss: 'Tailwind CSS',
  shadcn: 'shadcn/ui',
};

export function TechStack({ technologies }: TechStackProps) {
  const { isDark } = useTheme();

  return (
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={tech}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
            isDark
              ? 'border-[#a7a495]/30 text-[#a7a495]'
              : 'border-[#1c1c1c]/25 text-[#1c1c1c]'
          }`}
        >
          {TECH_LABELS[tech] ?? tech}
        </span>
      ))}
    </div>
  );
}
