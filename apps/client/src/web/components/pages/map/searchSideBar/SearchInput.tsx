import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import React, { useCallback, type ChangeEvent } from "react"

import useDebounce from "@client/web/hooks/useDebounce"

type Props = {
  onChangeFn: (value: string) => void
  onEnterPress: () => void
}

const SearchInput = (props: Props) => {
  const { onChangeFn, onEnterPress } = props

  const ref = useCallback(
    (node: HTMLInputElement) => {
      if (node) {
        node.addEventListener("keypress", (e: KeyboardEvent) => {
          if (e.key === "Enter") {
            onEnterPress()
          }
        })

        return () => {
          node.removeEventListener("keypress", onEnterPress)
        }
      }
    },
    [onEnterPress]
  )

  const debounceEvent = useDebounce((value: string) => {
    onChangeFn(value.trim())
  }, 600)

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounceEvent(e.target.value)
  }

  return (
    <div className="flex h-fit items-center justify-between rounded-xl border border-gray-400 bg-white p-2">
      <input
        ref={ref}
        type="text"
        placeholder="Search in Party maps"
        className="quicksand shrink-0 cursor-pointer pl-1 pr-3 text-[1.1rem] text-black outline-0"
        spellCheck="false"
        onChange={(e) => onChange(e)}
      />

      <MagnifyingGlassIcon className="size-[24px] text-black" />
    </div>
  )
}

export default SearchInput
