import { eventTypes } from "@client/web/constants/events"
import { anim } from "@client/web/utils/anim"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { motion } from "framer-motion"
import {
  type Path,
  Controller,
  type Control,
  type FieldValues,
} from "react-hook-form"

import BlockWrapper from "../BlockWrapper"

type Props<T extends FieldValues> = {
  control: Control<T>
}

const EventTypeBlock = <T extends FieldValues>(props: Props<T>) => {
  const { control } = props

  const typeContainerVariant = {
    initial: {},
    enter: {
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.25,
        duration: 0.5,
      },
    },
    exit: {},
  }

  const typeItemVariant = {
    initial: {
      scale: 0.8,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.42, 0, 0.58, 1],
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
    },
  }

  return (
    <BlockWrapper title={"What type of event it is ?"}>
      <motion.div
        className="flex justify-around gap-4"
        {...anim(typeContainerVariant)}
      >
        {Object.values(eventTypes).map((eventType, index) => (
          <Controller
            key={index}
            name={"type" as Path<T>}
            control={control}
            render={({ field }) => {
              const isSelected = field.value === eventType.name

              return (
                <motion.div
                  variants={typeItemVariant}
                  className="flex flex-col items-center gap-3"
                >
                  <span
                    className={`flex size-[80px] cursor-pointer items-center justify-center rounded-full border-2 text-black duration-300 hover:scale-[1.2] ${isSelected ? "bg-primary border-secondary text-secondary scale-[1.2]" : "bg-secondary border-transparent"}`}
                    onClick={() => field.onChange(eventType.name)}
                  >
                    <FontAwesomeIcon
                      icon={eventType.iconClass}
                      className="size-[40px]"
                    />
                  </span>
                  <span className="quicksand">{eventType.name}</span>
                </motion.div>
              )
            }}
          />
        ))}
      </motion.div>
    </BlockWrapper>
  )
}

export default EventTypeBlock
