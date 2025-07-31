import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(), // Use coerce to automatically convert string to date
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    lang: z.enum(['en', 'zh-hans']).optional().default('en'),
  }),
});

export const collections = {
  blog: blogCollection,
};