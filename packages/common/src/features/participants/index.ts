import { z } from "zod"

import { eventIdSchema } from "../events"

export const acceptParticipantSchema = z.object({
  accept: z.boolean(),
})

export type AcceptParticipantSchemaType = z.infer<
  typeof acceptParticipantSchema
>

export const approvedParticipantSchema = eventIdSchema.merge(
  z.object({
    participationId: z.string(),
  })
)
