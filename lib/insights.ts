import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const insightsDirectory = path.join(process.cwd(), '_insights');

export interface Author {
  name: string;
}

export interface Insight {
  slug: string;
  title: string;
  date: string;
  authors: Author[];
  description: string;
  featured_image?: string;
  content: string;
  htmlContent?: string;
}

export function getAllInsights(): Insight[] {
  const fileNames = fs.readdirSync(insightsDirectory);
  const insights = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
      const fullPath = path.join(insightsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        authors: data.authors || [],
        description: data.description || '',
        featured_image: data.featured_image,
        content,
      };
    });

  return insights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getInsightBySlug(slug: string): Promise<Insight | undefined> {
  const fileNames = fs.readdirSync(insightsDirectory);
  const fileName = fileNames.find(
    (name) => name.endsWith('.md') && name.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '') === slug
  );

  if (!fileName) return undefined;

  const fullPath = path.join(insightsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark()
    .use(html, { sanitize: false })
    .process(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    authors: data.authors || [],
    description: data.description || '',
    featured_image: data.featured_image,
    content,
    htmlContent: processedContent.toString(),
  };
}
