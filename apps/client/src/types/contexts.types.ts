import type { LoginTab } from "@client/web/constants/auth"
import type { SearchedPlaces } from "@client/web/services/places/getPlacesByName"
import type {
  NearbyPlaces,
  Position,
} from "@client/web/services/places/getPlacesNearby"
import type {
  EventSummaryType,
  InsertEventSchemaType,
  LoginSchemaType,
  RegisterSchemaType,
} from "@party/common"

export type AppContextType = {
  states: {
    showLoginModal: boolean | undefined
    currentTab: LoginTab
    position: Position | null
  }
  actions: {
    setShowLoginModal: (show: boolean) => void
    setCurrentTab: (tab: LoginTab) => void
    setPosition: (position: Position) => void
  }
  services: {
    auth: {
      register: (
        body: RegisterSchemaType
      ) => Promise<"You have successfully registered" | null>
      login: (
        body: LoginSchemaType
      ) => Promise<"You have successfully logged in" | null>
      logout: () => Promise<"You have successfully logged out" | null>
    }
    places: {
      getPlacesNearby: (
        position: Position | null
      ) => Promise<NearbyPlaces | null>
      getPlacesByName: (name: string) => Promise<SearchedPlaces | null>
      getAreaNameByPosition: (
        position: Position | null
      ) => Promise<string | null>
    }
    events: {
      createEvent: (body: InsertEventSchemaType) => Promise<unknown>
      getEventsBySearch: () => Promise<EventSummaryType[] | null>
      getEventById: (paramId: string) => Promise<unknown>
    }
  }
}
