import {
  faChampagneGlasses,
  faChess,
  faGlobe,
  faPersonDressBurst,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { EventSummaryType } from "@packages/common/features/events"
import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

import { formatDate } from "@client/web/utils/formatDate"
import { getRandomInt } from "@client/web/utils/getRandomInt"

type Props = {
  event: EventSummaryType
}

const EventCard = (props: Props) => {
  const { event } = props

  const getEventIconByType = () => {
    switch (event.eventType) {
      case "Meet new people": {
        return faPersonDressBurst
      }

      case "Just for fun": {
        return faChampagneGlasses
      }

      case "Board games": {
        return faChess
      }

      case "Drink and dance": {
        return faGlobe
      }

      default: {
        return faPersonDressBurst
      }
    }
  }

  // This function is just to have random images
  const getEventImage = () => {
    return `/bar/bar-${getRandomInt(5)}.jpg`
  }

  return (
    <div className="aspect-short border-secondary hover:bg-secondaryDark hover:text-primary hover:border-secondaryDark group relative flex h-[500px] shrink-0 cursor-pointer flex-col justify-start gap-2 overflow-hidden rounded-xl border-4 p-4 text-white duration-300">
      {/* Type tag */}
      <motion.div className="group-hover:border-secondaryDark group/type border-secondary bg-tertiary text-secondary absolute right-0 top-0 z-[9999] flex h-[43px] w-fit min-w-[43px] rounded-bl-xl border-4 border-r-0 border-t-0 duration-500">
        <FontAwesomeIcon
          className="size-[32px] p-1 duration-300 group-hover/type:z-[-9999] group-hover/type:size-0 group-hover/type:p-0 group-hover/type:opacity-0"
          icon={getEventIconByType()}
          title={event.eventType}
        />

        <motion.span className="flex w-0 items-center justify-center whitespace-nowrap opacity-0 duration-500 group-hover/type:w-[200px] group-hover/type:opacity-100">
          {event.eventType}
        </motion.span>
      </motion.div>

      <div className="relative h-[40%] w-full overflow-hidden rounded-xl">
        <Image src={getEventImage()} alt={event.eventName + "image"} fill />
      </div>

      <div className="quicksand flex flex-1 flex-col justify-end gap-4">
        <div className="flex flex-col justify-between">
          <h1 className="cormorantGaramond line-clamp-1 text-[1.6rem] font-semibold">
            {event.eventName}
          </h1>

          <span className="text-[0.8rem] font-thin">
            Organized by {event.eventOwnerName as string}
          </span>
        </div>

        <p className="line-clamp-2 font-light">{event.eventDetails}</p>

        <div className="text-[0.8rem] font-extralight">
          <h2 className="font-semibold first-letter:uppercase">
            {event.eventCity}
          </h2>
          <h2 className="line-clamp-1">
            Starts : {formatDate(event.eventStartDate)}
          </h2>
          <h2 className="line-clamp-1">
            Ends : {formatDate(event.eventEndDate)}
          </h2>
        </div>

        <p className="text-[0.8rem] font-light">
          {event.totalSlots} person can attend this event
        </p>

        <div className="flex items-end justify-between">
          <span className="text-[1.3rem]">
            {Number.parseInt(event.eventPrice) > 0
              ? `${event.eventPrice}€`
              : "Free"}
          </span>

          <span className="text-right font-thin">
            <strong>{event.availableSlots}</strong> slots remaining
          </span>
        </div>
      </div>
    </div>
  )
}

export default EventCard
