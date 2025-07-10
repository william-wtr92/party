import { anim } from "@client/web/utils/anim"
import { motion } from "framer-motion"
import type { ReactNode } from "react"

type WrapperProps = {
  children: ReactNode
}

type AnimatedTextProps = {
  text: string
  shouldAnimate: boolean
  Tag: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span"
  letterClass: string
}

const Wrapper = ({ children }: WrapperProps) => {
  return <span className="wrapper">{children}</span>
}

const AnimatedText = (props: AnimatedTextProps) => {
  const { text, shouldAnimate, Tag, letterClass } = props

  if (text === "") {
    return
  }

  // This global letter index is needed in order to calculate the delay for each letter
  // The delay is calculated based on the total length of the text so we have to keep track of the index
  // To know we are at which letter
  let letterIndex = 0

  const splittedText = text.split(" ")
  const words: string[][] = []

  splittedText.forEach((word) => {
    words.push(word.split(""))
  })

  words.map((word, index) => {
    return index !== words.length - 1 ? word.push("\u00A0") : word
  })

  const letters = {
    initial: {
      y: 25,
      opacity: 0,
      width: 0,
    },
    enter: (delay: number) => ({
      y: shouldAnimate ? 0 : 25,
      opacity: shouldAnimate ? 1 : 0,
      width: "fit-content",
      transition: {
        duration: 0.15,
        ease: [0.42, 0, 0.58, 1],
        delay,
      },
    }),
    exit: (delay: number) => ({
      y: 25,
      opacity: 0,
      width: 0,
      transition: {
        duration: 0.15,
        ease: [0.42, 0, 0.58, 1],
        delay: 1 - delay,
      },
    }),
  }

  return (
    <Tag className={"text-slide-up-animation"}>
      {words.map((word, index) => {
        const totalLength = text.split("").length

        return (
          <Wrapper key={index}>
            {word.map((letter, idx) => {
              const delay = letterIndex / totalLength

              letterIndex++

              return (
                <span key={idx} className={"letter-wrapper"}>
                  <motion.span
                    className={letterClass}
                    {...anim(letters, delay)}
                  >
                    {letter}
                  </motion.span>
                </span>
              )
            })}
          </Wrapper>
        )
      })}
    </Tag>
  )
}

export default AnimatedText
