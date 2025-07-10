import Input from "@client/web/components/forms/Input"
import { eventDefaultValuesKeys } from "@client/web/constants/events"
import type { InsertEventSchemaType } from "@party/common"
import type { Control, Path } from "react-hook-form"

import BlockWrapper from "../BlockWrapper"

type Props = {
  control: Control<InsertEventSchemaType>
}

const EventAddressBlock = (props: Props) => {
  const { control } = props

  return (
    <BlockWrapper title={"Where will it take place ?"}>
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-2 gap-2">
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.streetNumber}
            type={"text"}
            label={"Street number"}
            placeholder={"28"}
            name={
              eventDefaultValuesKeys.streetNumber as Path<InsertEventSchemaType>
            }
            control={control}
            customClass="w-full"
          />
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.street}
            type={"text"}
            label={"Street"}
            placeholder={"Rue de la tour"}
            name={eventDefaultValuesKeys.street as Path<InsertEventSchemaType>}
            control={control}
            customClass="w-full"
          />
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.region}
            type={"text"}
            label={"Region"}
            placeholder={"Île-de-France"}
            name={eventDefaultValuesKeys.region as Path<InsertEventSchemaType>}
            control={control}
            customClass="w-full"
          />
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.postalCode}
            type={"text"}
            label={"Postal code"}
            placeholder={"75010"}
            name={
              eventDefaultValuesKeys.postalCode as Path<InsertEventSchemaType>
            }
            control={control}
            customClass="w-full"
          />
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.city}
            type={"text"}
            label={"City"}
            placeholder={"Paris"}
            name={eventDefaultValuesKeys.city as Path<InsertEventSchemaType>}
            control={control}
            customClass="w-full"
          />
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.country}
            type={"text"}
            label={"Country"}
            placeholder={"France"}
            name={eventDefaultValuesKeys.country as Path<InsertEventSchemaType>}
            control={control}
            customClass="w-full"
          />
        </div>

        <details className="w-[80%]">
          <summary className="quicksand text-center">
            Extra informations (optional)
          </summary>

          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.extra}
            type={"text"}
            label={"Extra informations"}
            placeholder={"Green door, first on the left"}
            name={eventDefaultValuesKeys.extra as Path<InsertEventSchemaType>}
            control={control}
            customClass="w-full"
          />
        </details>
      </div>
    </BlockWrapper>
  )
}

export default EventAddressBlock
