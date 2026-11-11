import z from 'zod';

export const SORTS = ['popular', 'name', 'price-asc', 'price-desc'] as const;

export const exploreSearchSchema = z.object({
  q: z.string().optional().catch(undefined),
  category: z.string().optional().catch(undefined),
  sort: z.enum(SORTS).optional().catch(undefined),
});

export type ExploreSearch = z.infer<typeof exploreSearchSchema>;
