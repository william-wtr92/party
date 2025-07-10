"use client"

import { ArrowRightIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import React from "react"

import { anim } from "@client/web/utils/anim"

type Props = {
  scrollFn: () => void
  isAtTheEnd: boolean
}

const SeeMoreButton = (props: Props) => {
  const { scrollFn, isAtTheEnd } = props

  const seeMoreBtn = {
    initial: {
      minWidth: "36px",
    },
    enter: {
      minWidth: isAtTheEnd ? "100px" : "36px",
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      minWidth: "36px",
    },
  }

  return (
    <motion.button
      className="border-secondary bg-primary sticky right-[0.5rem] top-[50%] z-[9999] flex h-[36px] min-w-[48px] translate-y-[-50%] items-center justify-center overflow-hidden rounded-xl border px-2 py-1"
      onClick={() => scrollFn()}
      {...anim(seeMoreBtn)}
    >
      {isAtTheEnd ? (
        <motion.span className="whitespace-nowrap">See more</motion.span>
      ) : (
        <ArrowRightIcon className="text-secondary size-[18px]" />
      )}
    </motion.button>
  )
}

export default SeeMoreButton
