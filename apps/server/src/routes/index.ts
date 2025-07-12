import { authRoutes } from "./auth"
import { eventsRoutes } from "./events"
import { metricsRoute } from "./global"
import { participantsRoutes } from "./participants"
import { placesRoutes } from "./places"
import { reviewsRoutes } from "./reviews"
import { usersRoutes } from "./users"

export const routes = {
  auth: authRoutes,
  users: usersRoutes,
  places: placesRoutes,
  events: eventsRoutes,
  participants: participantsRoutes,
  reviews: reviewsRoutes,
  globals: metricsRoute,
}
