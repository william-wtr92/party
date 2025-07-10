import { anim } from "@client/web/utils/anim"
import { useInView, motion } from "framer-motion"
import { useRef, type ReactNode } from "react"

type Props = {
  title: string
  children: ReactNode
}

const BlockWrapper = (props: Props) => {
  const { title, children } = props

  const ref = useRef<HTMLDivElement | null>(null)

  const isInView = useInView(ref, {
    amount: 0.5,
  })

  const containerVariant = {
    initial: {
      scale: 0.8,
      opacity: 0,
    },
    enter: {
      scale: isInView ? 1 : 0.8,
      opacity: isInView ? 1 : 0,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
    },
  }

  return (
    <motion.div
      ref={ref}
      {...anim(containerVariant)}
      className="flex w-full flex-col gap-2"
    >
      <h1 className="cormorantGaramond text-center text-[1.9rem] font-bold">
        {title}
      </h1>
      <div className="border-secondaryDark w-full rounded-lg border-2 p-12">
        {children}
      </div>
    </motion.div>
  )
}

export default BlockWrapper
