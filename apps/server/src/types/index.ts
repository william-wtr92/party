export type SimpleHeaders = { [key: string]: string }

export type SessionContextType = {
  user: {
    id: string
    email: string
    name: string
  }
}

declare module "hono" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ContextVariableMap {
    session: SessionContextType
  }
}
