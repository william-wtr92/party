import type { SelectUser, AdditionalUserFields } from "@server/features/users"

export const sanitizeUser = <T extends keyof AdditionalUserFields>(
  user: SelectUser,
  additionalFields: T[] = []
) => {
  const additionalData: Pick<SelectUser, T> = additionalFields.reduce(
    (acc, field) => {
      acc[field] = user[field]

      return acc
    },
    {} as Pick<SelectUser, T>
  )

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
    birthdate: user.birthdate,
    interests: user.interests,
    rating: user.rating,
    ...additionalData,
  }
}

export const sanitizeUsers = <T extends keyof AdditionalUserFields>(
  users: SelectUser[],
  additionalFields: T[] = []
) => {
  return users.map((user: SelectUser) => {
    return sanitizeUser(user, additionalFields)
  })
}
