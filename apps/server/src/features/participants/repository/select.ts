import { db } from "@server/db/client"
import { participants, users } from "@server/db/schema"
import { and, count, eq } from "drizzle-orm"

export const participationExists = async (participationId: string) => {
  return await db.query.participants.findFirst({
    where: (participants, { eq }) => eq(participants.id, participationId),
  })
}

export const paritipantAlreadyRegistered = async (
  participantId: string,
  eventId: string
) => {
  const result = await db
    .select()
    .from(participants)
    .where(
      and(
        eq(participants.userId, participantId),
        eq(participants.eventId, eventId)
      )
    )
    .limit(1)
    .execute()

  return result.length > 0
}

export const getParticipantsAtEvent = async (
  eventId: string,
  limit: number | undefined,
  offset: number | undefined
) => {
  return await db
    .select({
      participantId: participants.id,
      eventId: participants.eventId,
      userId: participants.userId,
      approved: participants.approved,
      joinedAt: participants.joinedAt,
      paymentStatus: participants.payementStatus,
      userName: users.name,
      userEmail: users.email,
    })
    .from(participants)
    .leftJoin(users, eq(participants.userId, users.id))
    .where(eq(participants.eventId, eventId))
    .limit(limit ?? 10)
    .offset(offset ?? 0)
    .execute()
}

export const countParticipantsAtEvent = async (eventId: string) => {
  const counted = await db
    .select({
      count: count(),
    })
    .from(participants)
    .where(eq(participants.eventId, eventId))
    .execute()

  return counted[0].count
}

export const participantIsInEvent = async (userId: string, eventId: string) => {
  return await db.query.events.findFirst({
    where: (events, { or, eq, and, exists }) =>
      and(
        eq(events.id, eventId),
        or(
          eq(events.userId, userId),
          exists(
            db
              .select()
              .from(participants)
              .where((participants) =>
                and(
                  eq(participants.eventId, eventId),
                  eq(participants.userId, userId),
                  eq(participants.approved, true)
                )
              )
          )
        )
      ),
  })
}
