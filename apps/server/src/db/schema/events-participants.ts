import { uuid, pgTable, timestamp, boolean } from "drizzle-orm/pg-core"

import { events } from "./events"
import { users } from "./users"

export const participants = pgTable("events_participants", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  approved: boolean().notNull().default(false),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  payementStatus: boolean("payement_status").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
