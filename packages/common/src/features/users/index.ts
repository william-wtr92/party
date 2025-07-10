import { z } from "zod"

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  passwordHash: z.string().optional(),
  passwordSalt: z.string().optional(),
  birthdate: z.string(),
  interests: z.string(),
  rating: z.number(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const updateUserSchema = userSchema
  .omit({
    id: true,
    passwordHash: true,
    passwordSalt: true,
    rating: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    birthdate: z.preprocess((value) => {
      return typeof value === "string" ? new Date(value) : value
    }, z.date()),
  })
  .partial()

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
