import Input from "@client/web/components/forms/Input"
import { eventDefaultValuesKeys } from "@client/web/constants/events"
import type { InsertEventSchemaType } from "@party/common"
import type { Control, Path } from "react-hook-form"

import BlockWrapper from "../BlockWrapper"

type Props = {
  control: Control<InsertEventSchemaType>
}

const EventParticipantBlock = (props: Props) => {
  const { control } = props

  return (
    <BlockWrapper title={"How many people can participate ?"}>
      <div className="flex items-end justify-center gap-2">
        <Input<InsertEventSchemaType>
          key={eventDefaultValuesKeys.slots}
          type={"number"}
          label={""}
          placeholder={"Number of participants"}
          min={0}
          max={200}
          name={eventDefaultValuesKeys.slots as Path<InsertEventSchemaType>}
          control={control}
          customClass="w-fit"
        />

        <span className="quicksand text-[1.2rem]">slots</span>
      </div>
    </BlockWrapper>
  )
}

export default EventParticipantBlock
