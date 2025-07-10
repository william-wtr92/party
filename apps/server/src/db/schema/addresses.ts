import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core"

import { events } from "./events"
import { users } from "./users"

export const addresses = pgTable(
  "addresses",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    city: varchar("city", { length: 255 }).notNull(),
    region: varchar("region", { length: 255 }).notNull(),
    streetNumber: varchar("street_number", { length: 50 }).notNull(),
    street: varchar("street", { length: 255 }).notNull(),
    country: varchar("country", { length: 255 }).notNull(),
    postalCode: varchar("postal_code", { length: 50 }).notNull(),
    extra: text(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => {
    return {
      cityIdx: index("idx_event_city").on(table.city),
    }
  }
)

export const addressLinks = pgTable("address_links", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  addressId: uuid("address_id")
    .references(() => addresses.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id),
  eventId: uuid("event_id").references(() => events.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
