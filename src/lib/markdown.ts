import MarkdownIt from 'markdown-it';

/**
 * Renders markdown held in a frontmatter string (bookmark descriptions,
 * donair notes). Same options as the old 11ty `markdown` filter.
 */
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const renderMarkdown = (content: string): string => md.render(content);
export const renderMarkdownInline = (content: string): string => md.renderInline(content);
