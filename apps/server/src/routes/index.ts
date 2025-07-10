import { authRoutes } from "./auth"
import { eventsRoutes } from "./events"
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
}
