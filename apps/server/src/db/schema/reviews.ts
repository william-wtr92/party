import { pgTable, uuid, integer, text, timestamp } from "drizzle-orm/pg-core"

import { events } from "./events"
import { users } from "./users"

export const reviews = pgTable("reviews", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer().notNull(),
  comment: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
