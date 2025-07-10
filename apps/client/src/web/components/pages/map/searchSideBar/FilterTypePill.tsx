import React from "react"

import type { FilterType } from "@client/web/constants/places"

type Props = {
  label: FilterType
  isSelected: boolean
  onClickFn: () => void
}

const FilterTypePill = (props: Props) => {
  const { label, isSelected, onClickFn } = props

  return (
    <span
      className={`border-secondary hover:bg-glass-hover quicksand rounded-full border-2 px-3 py-2 text-[0.9rem] duration-300 ${isSelected ? "bg-glass-hover" : "bg-glass"}`}
      onClick={() => onClickFn()}
    >
      {label}
    </span>
  )
}

export default FilterTypePill
