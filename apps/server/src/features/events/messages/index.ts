export const eventCreatedSuccess = {
  result: "Event created",
  key: "eventCreated",
} as const

export const eventAlreadyExists = {
  result: "Event already exists",
  key: "eventAlreadyExists",
} as const

export const eventNotFound = {
  result: "Event not found",
  key: "eventNotFound",
} as const

export const eventUpdatedSuccess = {
  result: "Event updated",
  key: "eventUpdated",
} as const

export const eventDeletedSuccess = {
  result: "Event deleted",
  key: "eventDeleted",
} as const

export const userIsNotOwnerOfEvent = {
  result: "User is not the owner of the event",
  key: "userIsNotOwnerOfEvent",
} as const

export const approveParticipation = (accept: boolean) => {
  return {
    result: accept ? "Participation approved" : "Participation rejected",
    key: "approveParticipation",
  } as const
}

export const participationNotFound = {
  result: "Participation not found",
  key: "participationNotFound",
} as const
