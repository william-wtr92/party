# SQL - Advanced Usage and Optimization with Drizzle ORM

This document outlines advanced techniques for optimizing your application with Drizzle ORM. It covers common performance issues such as the N+1 query problem, materialized views, indexing, pagination, prepared queries, transactions, and Redis caching.

## 1. Introduction to Drizzle ORM

Drizzle ORM is a lightweight and high-performance ORM for Node.js and TypeScript. For benchmark details, see [their official benchmarks](https://orm.drizzle.team/benchmarks).

## 2. N+1 Query Problem

The N+1 problem occurs when an initial query is followed by many additional queries. Drizzle ORM helps avoid this through the use of `leftJoin()` and `innerJoin()`.

Drizzle has built-in support to handle N+1 scenarios effectively. [See article](https://orm.drizzle.team/benchmarks#how-it-works).

### Example

```ts
import { sql } from "drizzle-orm"
import { users } from "./tables/users"
import { posts } from "./tables/posts"

const query = db
  .select({
    user: users.name,
    postTitle: posts.title,
  })
  .from(users)
  .leftJoin(posts, sql`${users.id} = ${posts.userId}`)
```

### Benefits

* Fewer queries
* Improved performance for complex queries

## 3. Materialized Views

Materialized views store pre-computed query results to reduce computation on repeated calls.

### Example

```ts
import { pgMaterializedView, sql } from "drizzle-orm/pg-core"
import { events } from "./tables/events"
import { addresses } from "./tables/addresses"

export const eventSummary = pgMaterializedView("event_summary").as((qb) => {
  return qb
    .select({
      eventId: events.id,
      eventName: events.name,
      eventType: events.type,
      eventCity: addresses.city,
    })
    .from(events)
    .innerJoin(addresses, sql`${events.id} = ${addresses.eventId}`)
})
```

To refresh:

```ts
await db.refreshMaterializedView(eventSummary).concurrently()
```

### Benefits

* Faster response times
* Reduced database load

## 4. Indexing

Indexing improves query performance by indexing frequently queried columns.

### Example

```ts
import { sql, index, pgTable } from "drizzle-orm"

const users = pgTable("users").columns(
  {
    id: "serial",
    name: "text",
    email: "text",
  },
  (table) => {
    return {
      nameIdx: index("idx_user_name").on(table.name),
    }
  }
)
```

### Benefits

* Faster search and query execution
* Reduced scan time

## 5. Pagination

Pagination breaks down results into smaller pages.

### Example

```ts
const query = db
  .select({
    user: users.name,
    postTitle: posts.title,
  })
  .from(users)
  .limit(10)
  .offset(0)
```

### Benefits

* Improved performance
* Better UX for large datasets

## 6. Prepared Queries

Prepared queries improve repeated execution performance by avoiding re-compilation.

### Example

```ts
const query = db
  .select({
    user: users.name,
    postTitle: posts.title,
  })
  .prepare("myQueryStatement")

await query.execute()
```

### Benefits

* Lower latency for repeated queries
* Reduced DB load

## 7. Transactions

Transactions ensure multiple queries are executed atomically.

### Example

```ts
const insertUsers = await db.transaction(async (tx) => {
  await tx.insertInto(users).values({ name: "Alice" })
  await tx.insertInto(users).values({ name: "Bob" })
})
```

### Benefits

* Data consistency
* Concurrency conflict reduction

## 8. Redis Caching

Redis is an in-memory store used to cache data and reduce DB pressure.

### Example

```ts
const cachedQuery = await redis.get("myCachedQuery")

if (!cachedQuery) {
  const query = db
    .select({
      user: users.name,
      postTitle: posts.title,
    })
    .prepare("myQueryStatement")

  const result = await query.execute()
  await redis.set("myCachedQuery", result)
}
```

### Benefits

* Faster repeat queries
* Offload DB from repeated reads

## 9. Extra Notes

* Drizzle currently doesn't support native table partitioning. Use views to simulate this behavior.
* Always create a unique index on materialized views' identifier columns to avoid refresh errors:

```bash
npm run drizzle-kit generate --custom
```

```sql
-- In the generated SQL migration
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_summary_event_id ON event_summary (id);
```

```bash
npm run drizzle-kit migrate
```
