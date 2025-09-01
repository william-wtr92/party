/* eslint-disable no-console */
"use client"

import { useToast } from "@client/hooks/use-toast"
import AnimatedText from "@client/web/components/animations/AnimatedText"
import Button from "@client/web/components/Button"
import Input from "@client/web/components/forms/Input"
import EventAddressBlock from "@client/web/components/pages/events/organize/EventAddressBlock"
import EventParticipantBlock from "@client/web/components/pages/events/organize/EventParticipantBlock"
import EventPricingBlock from "@client/web/components/pages/events/organize/EventPricingBlock"
import EventScheduleBlock from "@client/web/components/pages/events/organize/EventScheduleBlock"
import EventTypeBlock from "@client/web/components/pages/events/organize/EventTypeBlock"
import {
  eventDefaultValues,
  eventDefaultValuesKeys,
} from "@client/web/constants/events"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertEventSchema, type InsertEventSchemaType } from "@party/common"
import { motion } from "framer-motion"
import { type SubmitHandler, useForm, type Path } from "react-hook-form"

const OrganizePage = () => {
  const {
    services: {
      events: { createEvent },
    },
  } = useAppContext()

  const { toast } = useToast()

  const { handleSubmit, control, watch, setValue, reset, formState } =
    useForm<InsertEventSchemaType>({
      resolver: zodResolver(insertEventSchema),
      mode: "onChange",
      defaultValues: eventDefaultValues,
    })

  const onSubmit: SubmitHandler<InsertEventSchemaType> = async (
    body: InsertEventSchemaType
  ) => {
    const validBody = {
      ...body,
      slots: Number(body.slots),
      remainingSlots: String(body.slots),
      price: body.price !== null ? Number(body.price) : 0,
    }

    await createEvent(validBody)

    reset()

    toast({
      variant: "default",
      title: "Event created !",
      description: "Your event has been created successfully ! 🎉",
    })
  }

  return (
    <main className="mt-[92px] flex h-[calc(100vh-92px)] w-screen flex-col items-center gap-4">
      <AnimatedText
        text={"Create THE best event !"}
        shouldAnimate={true}
        Tag={"h1"}
        letterClass="text-[3rem] cormorantGaramond"
      />

      <form
        className="flex w-[70%] flex-col items-center gap-8 pb-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <motion.div
          className="w-[50%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.name}
            type={"text"}
            label={"Event name"}
            placeholder={"Beer pong tournament"}
            name={eventDefaultValuesKeys.name as Path<InsertEventSchemaType>}
            control={control}
          />
        </motion.div>

        <motion.div
          className="w-[50%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          <Input<InsertEventSchemaType>
            key={eventDefaultValuesKeys.typeSpecificData}
            type={"text"}
            label={"Description"}
            placeholder={"We will play beer pong all night long..."}
            name={
              eventDefaultValuesKeys.typeSpecificData as Path<InsertEventSchemaType>
            }
            control={control}
          />
        </motion.div>

        <EventTypeBlock<InsertEventSchemaType> control={control} />

        <EventParticipantBlock control={control} />

        <EventPricingBlock
          control={control}
          setValue={setValue}
          watch={watch}
        />

        <EventAddressBlock control={control} />

        <EventScheduleBlock control={control} />

        <Button
          variant={"contained"}
          disabled={!formState.isValid}
          customClasses="text-[1.7rem]"
        >
          <span>Confirm</span>
        </Button>
      </form>
    </main>
  )
}

export default OrganizePage
