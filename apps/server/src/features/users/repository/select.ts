import { db } from "@server/db/client"

export const existUserById = async (id: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, id),
  })
}

export const existByEmail = async (email: string) => {
  return await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  })
}

export const existPhoneOrName = async (phone?: string, name?: string) => {
  const user = await db.query.users.findFirst({
    where: (users, { eq, or }) =>
      or(
        phone ? eq(users.phone, phone) : undefined,
        name ? eq(users.name, name) : undefined
      ),
  })

  return !!user
}
