/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Variants } from "framer-motion"

type Result = {
  initial: string
  animate: string
  exit: string
  variants: Variants
  custom?: any
}

export const anim = (variants: Variants, custom?: any): Result => ({
  initial: "initial",
  animate: "enter",
  exit: "exit",
  variants,
  custom,
})
