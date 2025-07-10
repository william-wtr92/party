import Input from "@client/web/components/forms/Input"
import { eventDefaultValuesKeys } from "@client/web/constants/events"
import type { InsertEventSchemaType } from "@party/common"
import { motion, AnimatePresence } from "framer-motion"
import {
  Controller,
  type UseFormSetValue,
  type Control,
  type Path,
  type UseFormWatch,
} from "react-hook-form"

import BlockWrapper from "../BlockWrapper"

type Props = {
  control: Control<InsertEventSchemaType>
  setValue: UseFormSetValue<InsertEventSchemaType>
  watch: UseFormWatch<InsertEventSchemaType>
}

const EventPricingBlock = (props: Props) => {
  const { control, setValue, watch } = props

  const priceInputVariant = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <BlockWrapper title={"The pricing ?"}>
      <div className="flex flex-col items-center justify-center gap-6">
        <Controller
          name={"free"}
          control={control}
          render={({ field }) => (
            <div className="bg-secondary relative flex w-[40%] overflow-hidden rounded-full p-1">
              <button
                type="button"
                className={`quicksand py-2duration-300 z-[9999] flex w-[50%] items-center justify-center gap-1 rounded-l-full text-[1.5rem] ${watch("free") ? "text-secondary" : "text-black"}`}
                onClick={() => {
                  field.onChange(true)
                  setValue("price", 0)
                }}
              >
                Free
              </button>
              <button
                type="button"
                className={`quicksand z-[9999] flex w-[50%] items-center justify-center gap-1 rounded-r-full py-2 text-[1.5rem] duration-300 ${!watch("free") ? "text-secondary" : "text-black"}`}
                onClick={() => field.onChange(false)}
              >
                <span>Paid</span>
              </button>

              <motion.span
                className={`bg-tertiary absolute left-1 top-1 z-[1] h-[calc(100%-8px)] w-1/2 duration-500 ${watch("free") ? "left-1 rounded-l-full" : "left-[calc(50%-4px)] rounded-r-full"}`}
              ></motion.span>
            </div>
          )}
        />

        <AnimatePresence>
          {watch("free") === false && (
            <motion.div variants={priceInputVariant}>
              <Input<InsertEventSchemaType>
                key={eventDefaultValuesKeys.price}
                type={"number"}
                label={""}
                min={0}
                name={
                  eventDefaultValuesKeys.price as Path<InsertEventSchemaType>
                }
                control={control}
                customClass="w-fit"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </BlockWrapper>
  )
}

export default EventPricingBlock
