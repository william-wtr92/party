import { MapPinIcon } from "@heroicons/react/24/solid"
import { motion, useInView } from "framer-motion"
import React from "react"

import type { ProcessedNearbyPlaceType } from "@client/web/utils/places/processNearbyPlacesData"

type Props = {
  place: ProcessedNearbyPlaceType
  flyToMarker: (latitude: number, longitude: number, markerId: number) => void
}

const ListPlaceCard = (props: Props) => {
  const { place, flyToMarker } = props

  const ref = React.useRef<HTMLDivElement>(null)

  const isVisible = useInView(ref, {
    once: true,
  })

  const { lat, lon } = place.coordinates

  const latitude = parseFloat(lat)
  const longitude = parseFloat(lon)

  const listItem = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: isVisible ? 1 : 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className="bg-secondary text-primary quicksand flex cursor-default flex-row justify-between rounded-2xl"
      variants={listItem}
    >
      <div className="flex w-[90%] flex-col">
        <h1 className="border-b-primary border-b-[1px] py-3 pl-3 text-[1.2rem] font-bold">
          {place.name}
        </h1>
        <span className="py-3 pl-3 text-[0.9rem]">{place.adress.string}</span>
      </div>

      <MapPinIcon
        className="border-l-bg-glass bg-primary text-secondary w-[40px] shrink-0 cursor-pointer rounded-r-2xl border-l-[1px] px-2"
        onClick={() => {
          flyToMarker(latitude, longitude, place.id)
        }}
      />
    </motion.div>
  )
}

export default ListPlaceCard
