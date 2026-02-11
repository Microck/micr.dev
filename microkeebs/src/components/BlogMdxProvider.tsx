import { MDXProvider } from '@mdx-js/react';
import { BlogDemoMedia } from './BlogDemoMedia';
import { TemplateOpen } from './TemplateOpen';
import { TemplatePreview } from './TemplatePreview';
import { TechStack } from './TechStack';

const components = {
  BlogDemoMedia,
  TemplateOpen,
  TemplatePreview,
  TechStack,
};

type BlogMdxProviderProps = {
  children: React.ReactNode;
};

export function BlogMdxProvider({ children }: BlogMdxProviderProps) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
