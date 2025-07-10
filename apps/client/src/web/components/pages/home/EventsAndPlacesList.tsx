"use client"

import type { EventSummaryType } from "@party/common"
import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
} from "framer-motion"
import { useRef, useState } from "react"

import EventCard from "@client/web/components/pages/home/EventCard"
import type { TabTypes } from "@client/web/components/pages/home/EventsAndPlacesTabs"
import PlaceCard from "@client/web/components/pages/home/PlaceCard"
import SeeMoreButton from "@client/web/components/pages/home/SeeMoreButton"
import { anim } from "@client/web/utils/anim"
import { type ProcessedNearbyPlaceType } from "@client/web/utils/places/processNearbyPlacesData"

type Props = {
  selectedTab: TabTypes
  placesList: ProcessedNearbyPlaceType[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  eventsList: EventSummaryType[]
}

const EventsAndPlacesList = (props: Props) => {
  const { selectedTab, placesList, eventsList } = props

  const [isAtTheEnd, setIsAtTheEnd] = useState<boolean>(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const containerVisible = useInView(containerRef, {
    once: true,
    amount: 1,
  })
  const { scrollXProgress } = useScroll({
    container: containerRef,
  })

  const scrollRight = () => {
    if (containerRef.current) {
      const container = containerRef.current
      const scrollAmount = (container.offsetWidth / 6) * 3

      container.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  const displaySeeMoreButton = () => {
    if (selectedTab === "places") {
      return placesList.length > 5
    }

    return eventsList.length > 5
  }

  const eventsContainer = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: containerVisible ? 1 : 0,
      transition: {
        when: "beforeChildren",
        duration: 0.5,
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        when: "afterChildren",
        staggerChildren: 0.15,
        staggerDirection: -1,
      },
    },
  }

  const card = {
    initial: {
      opacity: 0,
      scale: 0.8,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.5,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  useMotionValueEvent(scrollXProgress, "change", (latest) => {
    if (latest >= 0.99) {
      setIsAtTheEnd(true)

      return
    }

    setIsAtTheEnd(false)
  })

  return (
    <motion.div
      ref={containerRef}
      key={selectedTab}
      className="relative flex w-full gap-8 overflow-y-hidden overflow-x-scroll rounded-xl md:pr-4"
      {...anim(eventsContainer)}
    >
      {selectedTab === "places" &&
        placesList.map((place, index) => (
          <motion.div key={index} variants={card}>
            <PlaceCard place={place} />
          </motion.div>
        ))}

      {selectedTab === "events" && eventsList.length > 0 ? (
        eventsList.map((event, index) => (
          <EventCard key={index} event={event} />
        ))
      ) : (
        <motion.div
          className="flex h-[300px] w-full items-center justify-center"
          variants={card}
        >
          <span className="text-[1.5rem] font-semibold">
            No events found near you!
          </span>
        </motion.div>
      )}

      {displaySeeMoreButton() && (
        <SeeMoreButton scrollFn={scrollRight} isAtTheEnd={isAtTheEnd} />
      )}
    </motion.div>
  )
}

export default EventsAndPlacesList
