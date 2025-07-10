export type DecodedToken = {
  payload: {
    user: {
      id: string
      email: string
      name: string
    }
  }
}
