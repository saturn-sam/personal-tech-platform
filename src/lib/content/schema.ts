import { z } from 'astro/zod';

import { contentCollectionNames } from './collections';

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase kebab-case slugs.');

const nonEmptyString = z.string().trim().min(1);
const dateSchema = z.coerce.date();

export const lifecycleStatusSchema = z.enum(['draft', 'review', 'published', 'archived']);

export const contentCollectionNameSchema = z.enum(contentCollectionNames);

export const assetReferenceSchema = z
  .object({
    collection: contentCollectionNameSchema,
    slug: slugSchema,
  })
  .strict();

export const featuredImageSchema = z
  .object({
    src: nonEmptyString,
    alt: nonEmptyString,
  })
  .strict();

export const seoMetadataSchema = z
  .object({
    title: nonEmptyString.max(70),
    description: nonEmptyString.max(160),
    canonicalPath: z
      .string()
      .regex(/^\/[a-z0-9/-]*$/)
      .optional(),
    robots: z.enum(['index,follow', 'noindex,follow', 'noindex,nofollow']).default('index,follow'),
  })
  .strict();

export const readingTimeSchema = z
  .object({
    minutes: z.number().int().positive(),
    text: nonEmptyString,
  })
  .strict();

export const baseKnowledgeAssetSchema = z
  .object({
    title: nonEmptyString,
    slug: slugSchema,
    description: nonEmptyString.max(180),
    summary: nonEmptyString,
    author: nonEmptyString,
    publishedDate: dateSchema,
    updatedDate: dateSchema,
    reviewedDate: dateSchema.optional(),
    revision: nonEmptyString.optional(),
    status: lifecycleStatusSchema,
    tags: z.array(nonEmptyString).min(1),
    technologies: z.array(nonEmptyString).min(1),
    categories: z.array(nonEmptyString).min(1),
    difficulty: nonEmptyString,
    relatedAssets: z.array(assetReferenceSchema).default([]),
    featuredImage: featuredImageSchema,
    seo: seoMetadataSchema,
    featured: z.boolean().default(false),
  })
  .strict();

export const articleSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('article'),
    readingTime: readingTimeSchema,
    series: nonEmptyString.optional(),
  })
  .strict();

export const labNoteSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('lab-note'),
    readingTime: readingTimeSchema,
    tools: z.array(nonEmptyString).default([]),
  })
  .strict();

export const architectureGuideSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('architecture-guide'),
    readingTime: readingTimeSchema,
    businessContext: nonEmptyString,
    requirements: z.array(nonEmptyString).min(1),
    assumptions: z.array(nonEmptyString).min(1),
    diagram: z
      .object({
        language: z.literal('mermaid'),
        title: nonEmptyString,
      })
      .strict()
      .optional(),
  })
  .strict();

const projectTimelineItemSchema = z
  .object({
    date: dateSchema,
    title: nonEmptyString,
    description: nonEmptyString,
  })
  .strict();

export const projectSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('project'),
    projectStatus: z.enum(['planned', 'active', 'completed', 'archived']),
    environment: nonEmptyString,
    startDate: dateSchema,
    endDate: dateSchema.optional(),
    outcomes: z.array(nonEmptyString).min(1),
    gallery: z.array(featuredImageSchema).default([]),
    timeline: z.array(projectTimelineItemSchema).default([]),
    diagram: z
      .object({
        language: z.literal('mermaid'),
        title: nonEmptyString,
      })
      .strict()
      .optional(),
  })
  .strict();

export const technologySchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('technology'),
    vendor: nonEmptyString.optional(),
    versionInfo: nonEmptyString.optional(),
    website: z.url().optional(),
    skillLevel: nonEmptyString,
    aliases: z.array(nonEmptyString).default([]),
  })
  .strict();

export const certificationSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('certification'),
    issuer: nonEmptyString,
    credentialId: nonEmptyString.optional(),
    certificationDate: dateSchema,
    expirationDate: dateSchema.optional(),
    verificationUrl: z.url(),
    badge: featuredImageSchema,
    skills: z.array(nonEmptyString).min(1),
  })
  .strict();

export const resourceSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('resource'),
    resourceType: z.enum([
      'download',
      'cheat-sheet',
      'template',
      'script',
      'presentation',
      'reference-document',
      'external-link',
    ]),
    format: nonEmptyString,
    estimatedStudyTime: nonEmptyString,
    downloadPath: z.string().startsWith('/').optional(),
    externalUrl: z.url().optional(),
  })
  .strict();

export const learningPathSchema = baseKnowledgeAssetSchema
  .extend({
    assetType: z.literal('learning-path'),
    estimatedHours: z.number().positive(),
    steps: z
      .array(
        z
          .object({
            title: nonEmptyString,
            asset: assetReferenceSchema,
            order: z.number().int().positive(),
          })
          .strict(),
      )
      .min(1),
  })
  .strict();
