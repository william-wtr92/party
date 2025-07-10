export const cantParticipateInUrOwnEvent = {
  result: "You can't participate in your own event, because you are the owner",
  key: "notOwnerOfThisEvent",
} as const

export const participationAlreadyRegistered = {
  result: "You are already registered for this event",
  key: "participationAlreadyRegistered",
} as const

export const participationRegistered = {
  result: "You have successfully registered for this event",
  key: "participationRegistered",
} as const

export const userNeedToWaitCooldownBeforeParticipating = {
  result:
    "You have been rejected of this event, you need to wait before participating again",
  key: "userNeedToWaitCooldownBeforeParticipating",
} as const
