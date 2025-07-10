import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  integer,
  boolean,
  decimal,
  text,
  index,
} from "drizzle-orm/pg-core"

import { users } from "./users"

export const events = pgTable(
  "events",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    slots: integer().notNull(),
    remainingSlots: integer("remaining_slots").notNull(),
    free: boolean().notNull(),
    price: decimal(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      typeIdx: index("idx_event_type").on(table.type),
      startDateIdx: index("idx_event_start_date").on(table.startDate),
      remainingSlotsIdx: index("idx_event_remaining_slots").on(
        table.remainingSlots
      ),
    }
  }
)

export const eventDetails = pgTable("events_details", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  eventId: uuid("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  typeSpecificData: text("type_specific_data"),
  participants: integer("participants"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
