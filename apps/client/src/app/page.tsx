"use client"

import EventsAndPlacesList from "@client/web/components/pages/home/EventsAndPlacesList"
import EventsAndPlacesTabs, {
  type TabTypes,
} from "@client/web/components/pages/home/EventsAndPlacesTabs"
import Hero from "@client/web/components/pages/home/Hero"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { processNearbyPlacesData } from "@client/web/utils/places/processNearbyPlacesData"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

const limit = 15

export default function Home() {
  const {
    states: { position },
    services: {
      places: { getPlacesNearby },
      events: { getEventsBySearch },
    },
  } = useAppContext()

  const [selectedTab, setSelectedTab] = useState<TabTypes>("events")

  const { data: placesData } = useQuery({
    queryKey: ["places-nearby", position],
    queryFn: () => getPlacesNearby(position),
    enabled: !!position,
  })

  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEventsBySearch(),
    enabled: true,
  })

  const processedPlacesList =
    placesData?.filterWithLimit(limit).map(processNearbyPlacesData) ??
    ([] as const)

  return (
    <div className="h-full flex-1 gap-4">
      <Hero />

      <div className={"bg-tertiary quicksand px-4 pb-4"}>
        <EventsAndPlacesTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />

        <AnimatePresence mode="wait">
          <EventsAndPlacesList
            key={selectedTab}
            selectedTab={selectedTab}
            placesList={processedPlacesList}
            eventsList={eventsData ? (eventsData as []) : []}
          />
        </AnimatePresence>
      </div>
    </div>
  )
}
