import { z } from "zod"

export const addressSchema = z.object({
  id: z.string().optional(),
  city: z.string(),
  region: z.string(),
  streetNumber: z.string(),
  street: z.string(),
  country: z.string(),
  postalCode: z.string(),
  extra: z.string(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const insertAddressSchema = addressSchema.omit({
  createdAt: true,
  updatedAt: true,
  id: true,
})

export type InsertAddress = z.infer<typeof insertAddressSchema>
