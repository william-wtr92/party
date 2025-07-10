"use client"

import type { AppContextType } from "@client/types"
import type { LoginTab } from "@client/web/constants/auth"
import { login } from "@client/web/services/authentication/login"
import { logout } from "@client/web/services/authentication/logout"
import { register } from "@client/web/services/authentication/register"
import { createEvent } from "@client/web/services/events/createEvent"
import { getAreaNameByPosition } from "@client/web/services/places/getAreaNameByPosition"
import { getPlacesByName } from "@client/web/services/places/getPlacesByName"
import {
  getPlacesNearby,
  type Position,
} from "@client/web/services/places/getPlacesNearby"
import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"

import { getEventById } from "../services/events/getEventById"
import { getEventsBySearch } from "../services/events/getEventsBySearch"

type AppContextProviderProps = {
  children: ReactNode
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export const AppContextProvider: FC<
  PropsWithChildren<AppContextProviderProps>
> = ({ children }) => {
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<LoginTab>("login")
  const [position, setPosition] = useState<Position | null>(null)

  useEffect(() => {
    if ("geolocation" in navigator) {
      const setPositionOfUser = (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords
        setPosition({ lat: latitude.toString(), lon: longitude.toString() })
        // const testPosition = ["48.866667", "2.333333"]
        // setPosition({ lat: testPosition[0], lon: testPosition[1] })
      }

      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
      }

      navigator.geolocation.getCurrentPosition(
        setPositionOfUser,
        () => "",
        options
      )
    }
  }, [])

  const value = {
    states: {
      showLoginModal,
      currentTab,
      position,
    },
    actions: {
      setShowLoginModal,
      setCurrentTab,
      setPosition,
    },
    services: {
      auth: {
        register,
        login,
        logout,
      },
      places: {
        getPlacesNearby,
        getPlacesByName,
        getAreaNameByPosition,
      },
      events: {
        createEvent,
        getEventsBySearch,
        getEventById,
      },
    },
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider")
  }

  return {
    ...context,
  }
}
