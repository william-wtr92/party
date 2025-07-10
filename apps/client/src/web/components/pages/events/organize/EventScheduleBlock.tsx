import Input from "@client/web/components/forms/Input"
import { eventDefaultValuesKeys } from "@client/web/constants/events"
import type { InsertEventSchemaType } from "@party/common"
import type { Control, Path } from "react-hook-form"

import BlockWrapper from "../BlockWrapper"

type Props = {
  control: Control<InsertEventSchemaType>
}

const EventScheduleBlock = (props: Props) => {
  const { control } = props

  return (
    <BlockWrapper title={"When will it take place ?"}>
      <div className="flex items-center justify-center gap-4">
        <Input<InsertEventSchemaType>
          key={eventDefaultValuesKeys.startDate}
          type={"date"}
          label={"Start date"}
          placeholder={"France"}
          name={eventDefaultValuesKeys.startDate as Path<InsertEventSchemaType>}
          control={control}
          customClass="w-[30%]"
        />

        <Input<InsertEventSchemaType>
          key={eventDefaultValuesKeys.endDate}
          type={"date"}
          label={"End date"}
          placeholder={"France"}
          name={eventDefaultValuesKeys.endDate as Path<InsertEventSchemaType>}
          control={control}
          customClass="w-[30%]"
        />
      </div>
    </BlockWrapper>
  )
}

export default EventScheduleBlock
