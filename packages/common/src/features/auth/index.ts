import { z } from "zod"

import { addressSchema } from "../addresses"
import { userSchema } from "../users"

export const registerSchema = userSchema
  .omit({
    id: true,
    passwordHash: true,
    passwordSalt: true,
    rating: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .merge(
    addressSchema.omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })
  )
  .extend({
    birthdate: z.preprocess((value) => {
      return typeof value === "string" ? new Date(value) : value
    }, z.date()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

export type RegisterSchemaType = z.infer<typeof registerSchema>

export const loginSchema = userSchema
  .pick({
    email: true,
  })
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
  })
export type LoginSchemaType = z.infer<typeof loginSchema>
