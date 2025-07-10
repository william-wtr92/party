import type { addresses } from "@server/db/schema"

export type InsertAddress = typeof addresses.$inferInsert
export type SelectAddress = typeof addresses.$inferSelect
