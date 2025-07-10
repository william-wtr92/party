import React from "react"

import FilterTypePill from "@client/web/components/pages/map/searchSideBar/FilterTypePill"
import { filterTypesArray, type FilterType } from "@client/web/constants/places"
import { toUpperCaseFirstLetter } from "@client/web/utils/toUpperCaseFirstLetter"

type Props = {
  filterType: FilterType
  handleFilterType: (type: FilterType) => void
}

const FilterTypePills = (props: Props) => {
  const { filterType, handleFilterType } = props

  return (
    <div className="flex flex-wrap gap-2">
      {filterTypesArray.map((type, index) => {
        const label = toUpperCaseFirstLetter<FilterType>(type)
        const onClickFn = () => handleFilterType(type)
        const isSelected = filterType === type

        return (
          <FilterTypePill
            key={index}
            label={label}
            isSelected={isSelected}
            onClickFn={onClickFn}
          />
        )
      })}
    </div>
  )
}

export default FilterTypePills
