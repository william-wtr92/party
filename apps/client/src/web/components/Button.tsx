"use client"

import classNames from "classnames"
import type { ButtonHTMLAttributes, ReactNode } from "react"

type Props = {
  children: ReactNode
  variant: "default" | "contained" | "outlined"
  disabled?: boolean
  customClasses?: string
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = (props: Props) => {
  const { children, variant, disabled, customClasses, ...otherProps } = props

  const variantStyle = () => {
    switch (variant) {
      case "contained":
        return "bg-secondary text-black border-2 md:hover:border-secondary md:hover:bg-primary md:hover:text-secondary"

      case "outlined":
        return "bg-primary text-secondary border-2 border-secondary md:hover:bg-secondary md:hover:text-primary md:hover:border-primary"

      default:
        return "bg-glass md:hover:bg-glass-hover"
    }
  }

  const disabledStyle = () => {
    if (disabled) {
      return "cursor-not-allowed opacity-50 hover:none"
    }
  }

  return (
    <button
      className={classNames(
        variantStyle(),
        disabledStyle(),
        customClasses,
        "quicksand rounded-[50px] px-3 py-1 font-medium duration-300"
      )}
      {...otherProps}
    >
      {children}
    </button>
  )
}

export default Button
