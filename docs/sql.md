# README - Optimisation et Utilisation Avancée avec Drizzle ORM

Ce document décrit comment utiliser Drizzle ORM pour optimiser votre application en abordant les concepts du problème des requêtes N+1, des vues matérialisées, de l'indexation, de la pagination, des requêtes préparées, des transactions et de l'implémentation de Redis pour le caching.

## 1. Introduction à Drizzle ORM

Drizzle ORM est un ORM léger et performant pour Node.js et TypeScript. Pour plus de détails sur ses performances, consultez [leurs benchmarks](https://orm.drizzle.team/benchmarks).

## 2. Problème des Requêtes N+1

Le problème des requêtes N+1 survient lorsqu'une requête initiale est suivie de multiples requêtes supplémentaires. Drizzle ORM propose des solutions pour atténuer ce problème via `leftJoin()` et `innerJoin()`.

Drizzle a complétement intégré le support des requêtes N+1, vous n'avez pas besoin de vous soucier de la gestion des requêtes supplémentaires.[Voir l'article](https://orm.drizzle.team/benchmarks#how-it-works).

### Exemple de Code

```typescript
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

#### Avantages

- Réduction du nombre de requêtes.
- Amélioration des performances des requêtes complexes.

## 3. Utilisation des Vues Matérialisées

Les vues matérialisées stockent le résultat pré-calculé des requêtes lourdes pour réduire le temps de calcul et améliorer la performance des requêtes répétées.

### Exemple de Code

```typescript
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

Dans vos requête d'ajout, de modification ou de suppression vous allez devoir refresh cette vue matérialisée.

```typescript
await db.refreshMaterializedView(eventSummary).concurrently()
```

#### Avantages

- Réduction du temps de réponse.
- Allègement de la charge sur la base de données.

## 4. Indexation

L'indexation est une technique pour améliorer les performances des requêtes en créant des index sur les colonnes fréquemment utilisées dans les requêtes.

### Exemple de Code

```typescript
import { sql, index, pgTable } from "drizzle-orm"
import { users } from "./tables/users"

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

#### Avantages

- Réduction du temps de réponse des requêtes.
- Amélioration des performances des requêtes de recherche.
- Réduction du temps de scan des lignes pour les requêtes ciblées.

## 5. Pagination

La pagination est une technique pour diviser les résultats de requêtes en pages pour améliorer les performances et la lisibilité des résultats.

### Exemple de Code

```typescript
import { sql } from "drizzle-orm"
import { users } from "./tables/users"

const query = db
  .select({
    user: users.name,
    postTitle: posts.title,
  })
  .from(users)
  .limit(10)
  .offset(0)
```

#### Avantages

- Réduction du temps de réponse des requêtes.
- Amélioration de la lisibilité des résultats.

## 6. Requêtes Préparées avec `.prepare()` et `.execute()`

Les requêtes préparées sont des requêtes SQL pré-compilées qui améliorent les performances des requêtes répétées en évitant la compilation à chaque exécution.

### Exemple de Code

```typescript
import { sql } from "drizzle-orm"
import { users } from "./tables/users"

const query = db
  .select({
    user: users.name,
    postTitle: posts.title,
  })
  .prepare("myQueryStatement")

// Execution de la requête préparée
await query.execute()
```

#### Avantages

- Réduction du temps de réponse des requêtes répétées.
- Amélioration des performances des requêtes complexes.
- Réduction de la charge sur la base de données.

## 7. Transactions

Les transactions sont des groupes de requêtes SQL qui sont exécutées de manière atomique pour garantir la cohérence des données.

### Exemple de Code

```typescript
import { sql } from "drizzle-orm"
import { users } from "./tables/users"

const insertUsers = await db.transaction(async (tx) => {
  await tx.insertInto(users).values({ name: "Alice" })
  await tx.insertInto(users).values({ name: "Bob" })
})
```

#### Avantages

- Garantie de la cohérence des données.
- Réduction des conflits de concurrence.

## 8. Implémentation de Redis pour le Caching

Redis est une base de données en mémoire qui peut être utilisée pour stocker des données en cache pour améliorer les performances des requêtes répétées.

### Exemple de Code

```typescript
import { sql } from "drizzle-orm"
import { users } from "./tables/users"

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

#### Avantages

- Réduction du temps de réponse des requêtes répétées.
- Réduction de la charge sur la base de données.

## 9. Petits Trucs en Plus

- Pour le moment Drizzle ne donne pas le moyen de faire du partitionnement de tables, mais vous pouvez toujours utiliser des vues pour simuler ce comportement.

- Quand vous créez une vue matérialisée, assurez-vous de générer un index unique sur la colonne d'identifiant pour éviter les erreurs au refresh de la vue. Drizzle ne le fait pas automatiquement.

```typescript
npm run drizzle-kit generate --custom
```

```sql
-- Custom SQL migration file, put your code below! --
CREATE UNIQUE INDEX IF NOT EXISTS idx_event_summary_event_id ON event_summary (id);
```

```typescript
npm run drizzle-kit migrate
```
