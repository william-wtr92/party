export const routes = {
  home: "/",
  map: "/map",
  events: {
    base: "/events",
    organize: "/events/organize",
    participate: "/events/participate",
  },
  test: "/test",
}

export const apiRoutes = {
  internal: {
    auth: "/api/auth",
  },
  users: {
    me: "/users/me",
  },
  auth: {
    register: "/auth/register",
    login: "/auth/login",
  },
}
