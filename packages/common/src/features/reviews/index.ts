import { z } from "zod"

const reviewSchema = z.object({
  id: z.string().optional(),
  userId: z.string(),
  eventId: z.string(),
  rating: z.number(),
  comment: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})
export type InsertReviewType = z.infer<typeof reviewSchema>

export const insertReviewSchema = reviewSchema.omit({
  id: true,
  userId: true,
  eventId: true,
  createdAt: true,
  updatedAt: true,
})
