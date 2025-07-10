"use client"

import { MapPinIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import Image from "next/image"
import React from "react"

import { getRandomInt } from "@client/web/utils/getRandomInt"
import type { ProcessedNearbyPlaceType } from "@client/web/utils/places/processNearbyPlacesData"
import { toUpperCaseFirstLetter } from "@client/web/utils/toUpperCaseFirstLetter"

type Props = {
  place: ProcessedNearbyPlaceType
}

const PlaceCard = (props: Props) => {
  const { place } = props
  const { name, type, adress, url } = place

  const imageHoverVariants = {
    initial: {
      height: "100%",
    },
    hover: {
      height: "50%",
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  return (
    <motion.div
      className="aspect-short bg-secondary relative h-[300px] min-h-[300px] rounded-xl text-black md:h-[500px]"
      whileHover={"hover"}
    >
      <motion.div
        className="relative z-0 size-full overflow-hidden rounded-lg"
        variants={imageHoverVariants}
      >
        <Image
          fill
          alt="Place image"
          src={`/${type}/${type}-${getRandomInt(5)}.jpg`}
          className="customBorderRadius h-full object-cover"
        />
      </motion.div>

      <div className="absolute left-[50%] z-[20] flex h-[50%] w-[80%] flex-1 translate-x-[-50%] flex-col items-center justify-start gap-4 py-4 text-center">
        <h1 className="cormorantGaramond text-[2rem] leading-8">
          {toUpperCaseFirstLetter(type)} <strong>{name}</strong>
        </h1>

        <span>{adress.string}</span>

        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="justify-self-end duration-300 hover:scale-[1.3]"
        >
          <MapPinIcon className="size-[24px] text-black" />
        </a>
      </div>
    </motion.div>
  )
}

export default PlaceCard
