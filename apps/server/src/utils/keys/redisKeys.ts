export const redisKeys = {
  session: (email: string) => `session:${email}`,
  participation: (eventId: string, userId: string) =>
    `participation:${eventId}${userId}`,
}
