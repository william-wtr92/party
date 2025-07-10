"use client"

import { routes } from "@client/web/utils/routes"
import Button from "@client/web/components/Button"
import Avatar from "@client/web/components/layout/Avatar"
import NavbarTitle from "@client/web/components/layout/NavbarTitle"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { getUserLoggedIn } from "@client/web/services/users/getUserLoggedIn"
import { anim } from "@client/web/utils/anim"
import { useQuery } from "@tanstack/react-query"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useCallback, useState } from "react"

const Navbar = () => {
  const {
    actions: { setShowLoginModal },
  } = useAppContext()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserLoggedIn(),
  })

  const ref = useCallback(
    (node: HTMLElement) => {
      if (node !== null) {
        refetch()
      }
    },
    [refetch]
  )

  const [displayAvatarMenu, setDisplayAvatarMenu] = useState<boolean>(false)

  const container = {
    initial: {
      opacity: 1,
    },
    enter: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 1,
      transition: {
        when: "afterChildren",
        staggerChildren: 0.2,
        staggerDirection: -1,
      },
    },
  }

  const items = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.25,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.25,
      },
    },
  }

  return (
    <nav
      ref={ref}
      className={
        "bg-glass quicksand fixed left-0 top-0 z-50 m-2 flex h-[58px] w-[99%] items-center justify-between rounded-xl px-4 py-2 pr-2 md:py-4 md:text-[1.4rem]"
      }
    >
      <NavbarTitle />

      <AnimatePresence mode="wait">
        <motion.div
          key={data?.name}
          className="flex w-fit items-center justify-end gap-2 md:gap-6"
          {...anim(container)}
        >
          {data && !isFetching && (
            <>
              <motion.div variants={items}>
                <Link
                  href={routes.home}
                  className="md:hover:text-secondary duration-300"
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={items}>
                <Link
                  href={routes.map}
                  className="md:hover:text-secondary duration-300"
                >
                  Map
                </Link>
              </motion.div>

              <motion.div variants={items}>
                <Link
                  href={routes.events.base}
                  className="md:hover:text-secondary duration-300"
                >
                  Events
                </Link>
              </motion.div>

              <motion.div variants={items}>
                <Link
                  href={routes.events.organize}
                  className="md:hover:text-secondary duration-300"
                >
                  Organize
                </Link>
              </motion.div>

              <Avatar
                displayAvatarMenu={displayAvatarMenu}
                setDisplayAvatarMenu={setDisplayAvatarMenu}
                name={data.name}
              />
            </>
          )}

          {!data && !isFetching && (
            <>
              <motion.div variants={items}>
                <Link
                  href={routes.home}
                  className="md:hover:text-secondary duration-300"
                >
                  Home
                </Link>
              </motion.div>

              <motion.div variants={items}>
                <Link
                  href={routes.events.base}
                  className="md:hover:text-secondary duration-300"
                >
                  Events
                </Link>
              </motion.div>

              <motion.div variants={items}>
                <Button
                  variant={"default"}
                  onClick={() => {
                    setShowLoginModal(true)
                  }}
                >
                  Login
                </Button>
              </motion.div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
