import classNames from "classnames"
import React from "react"
import {
  type Path,
  type FieldValues,
  Controller,
  type Control,
} from "react-hook-form"

type Props<T extends FieldValues> = {
  type: string
  label: string
  name: Path<T>
  control: Control<T>
  placeholder?: string
  min?: number
  max?: number
  customClass?: string
}

const Input = <T extends FieldValues>(props: Props<T>) => {
  const { type, label, name, control, placeholder, min, max, customClass } =
    props

  return (
    <div
      className={classNames(
        "quicksand flex flex-col items-start gap-1",
        customClass
      )}
    >
      <Controller
        name={name}
        control={control}
        render={({ field, formState }) => {
          const value =
            field.value === null || field.value === undefined ? "" : field.value

          return (
            <>
              <div className="flex flex-col">
                <label className="pl-2 font-semibold">{label}</label>
                {formState.errors[name] && (
                  <span className="pl-2 text-[0.8rem] text-sm text-red-500">
                    This field is invalid
                  </span>
                )}
              </div>
              <input
                {...field}
                type={type}
                spellCheck="false"
                value={value}
                placeholder={placeholder}
                min={min}
                max={max}
                className="focus:border-secondary border-grey-100 bg-secondary w-full rounded-[30px] border px-4 py-1 text-black outline-none"
              />
            </>
          )
        }}
      />
    </div>
  )
}

export default Input
