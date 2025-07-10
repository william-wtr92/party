import type { users } from "@server/db/schema"

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export type AdditionalUserFields = Omit<SelectUser, "username" | "email">
