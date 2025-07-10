"use client"

import Button from "@client/web/components/Button"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { anim } from "@client/web/utils/anim"
import { useQueryClient } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"

type Props = {
  displayAvatarMenu: boolean
  setDisplayAvatarMenu: (bool: boolean) => void
  name: string
}

const Avatar = (props: Props) => {
  const { displayAvatarMenu, setDisplayAvatarMenu, name } = props

  const {
    services: {
      auth: { logout },
    },
  } = useAppContext()

  const qc = useQueryClient()

  const item = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.35,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.35,
      },
    },
  }

  const avatarMenu = {
    initial: {
      y: "-50%",
      opacity: 0,
    },
    enter: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    exit: {
      y: "-50%",
      opacity: 0,
      zIndex: 1,
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  const logoutUser = async () => {
    await logout()

    qc.invalidateQueries({ queryKey: ["user"] })

    setDisplayAvatarMenu(false)
  }

  return (
    <motion.div
      className="border-secondary bg-secondary relative flex aspect-square w-[42px] cursor-pointer items-center justify-center rounded-full border pr-[2px] duration-300"
      variants={item}
      onClick={() => setDisplayAvatarMenu(!displayAvatarMenu)}
    >
      <span className="text-black">{name[0]}</span>

      <AnimatePresence>
        {displayAvatarMenu && (
          <motion.div
            key={displayAvatarMenu.toString()}
            className="bg-glass absolute right-[-40%] top-[150%] flex w-[200px] flex-col gap-2 p-2"
            {...anim(avatarMenu)}
          >
            <Button variant={"default"} customClasses="rounded-md">
              Profile
            </Button>

            <Button
              variant={"default"}
              onClick={() => logoutUser()}
              customClasses="rounded-md"
            >
              Logout
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Avatar
