import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { BaseSchema } from 'astro/content/config';

import {
  aboutSchema,
  architectureGuideSchema,
  articleSchema,
  caseStudySchema,
  certificationSchema,
  labNoteSchema,
  learningPathSchema,
  projectSchema,
  resourceSchema,
  technologySchema,
} from './lib/content/schema';

const contentPattern = '**/*.{md,mdx}';

const createContentCollection = <Schema extends BaseSchema>(directory: string, schema: Schema) =>
  defineCollection({
    loader: glob({
      base: `./src/content/${directory}`,
      pattern: contentPattern,
    }),
    schema,
  });

export const collections = {
  about: createContentCollection('about', aboutSchema),
  articles: createContentCollection('articles', articleSchema),
  'lab-notes': createContentCollection('lab-notes', labNoteSchema),
  'architecture-guides': createContentCollection('architecture-guides', architectureGuideSchema),
  'case-studies': createContentCollection('case-studies', caseStudySchema),
  projects: createContentCollection('projects', projectSchema),
  technologies: createContentCollection('technologies', technologySchema),
  certifications: createContentCollection('certifications', certificationSchema),
  resources: createContentCollection('resources', resourceSchema),
  'learning-paths': createContentCollection('learning-paths', learningPathSchema),
};
