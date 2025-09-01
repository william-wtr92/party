"use client"

import { searchEventsSchema, type SearchEventsSchemaType } from "@party/common"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { Controller, type Path, useForm } from "react-hook-form"
import {
  eventTypes,
  searchEventDefaultValues,
  searchEventDefaultValuesKeys,
} from "@client/web/constants/events"
import Input from "@client/web/components/forms/Input"
import Button from "@client/web/components/Button"
import { FunnelIcon } from "@heroicons/react/24/solid"
import { ChevronDown, Search, XIcon } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { anim } from "@client/web/utils/anim"
import { useQuery } from "@tanstack/react-query"
import { getEventsBySearch } from "@client/web/services/events/getEventsBySearch"
import EventCard from "@client/web/components/pages/home/EventCard"

const EventsPage = () => {
  const { getValues, handleSubmit, control, formState, reset, watch } =
    useForm<SearchEventsSchemaType>({
      resolver: zodResolver(searchEventsSchema),
      mode: "onChange",
      defaultValues: searchEventDefaultValues,
    })

  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [queries, setQueries] = useState<SearchEventsSchemaType>(
    searchEventDefaultValues
  )

  const { data, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: () => getEventsBySearch(queries),
  })

  const onSubmit = () => {
    setQueries(getValues())
  }

  const handleClearFilters = () => {
    reset()
    setQueries(searchEventDefaultValues)
  }

  useEffect(() => {
    refetch()
  }, [queries, refetch])

  return (
    <main className="mt-[92px] flex h-[calc(100vh-92px)] w-full flex-col items-center justify-start">
      <h1 className="text-[4rem] font-bold">Discover events</h1>

      <p className="mb-8 w-1/2 text-center text-[1.5rem]">
        Find amazing social events happening in bars and restaurants near you.
        Connect with like-minded people and create unforgettable memories.
      </p>

      <form
        className="flex w-1/2 flex-col items-center"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex w-full items-center gap-2">
          <Input<SearchEventsSchemaType>
            key={searchEventDefaultValuesKeys.name}
            type={"text"}
            placeholder={"Press enter to search"}
            name={
              searchEventDefaultValuesKeys.name as Path<SearchEventsSchemaType>
            }
            control={control}
            customClass="w-full mb-6"
          />

          <Button
            type="submit"
            variant="outlined"
            customClasses="flex items-center gap-2 mb-6"
          >
            <Search className="size-6" />
            <span>Search</span>
          </Button>
        </div>

        <Button
          type="button"
          variant="outlined"
          customClasses="flex items-center gap-2 mb-6"
          onClick={() => setShowFilters((prevState) => !prevState)}
        >
          <FunnelIcon className="size-6" />
          <span>Show filters</span>
          <ChevronDown className="size-6" />
        </Button>

        <AnimatePresence mode="wait">
          {showFilters && (
            <motion.div
              layout
              {...anim(filtersVariant)}
              className="grid-rows-auto border-secondaryDark mb-6 grid w-full grid-cols-3 items-center justify-center gap-4 overflow-hidden rounded-md border-2 p-4"
            >
              <Controller
                name={searchEventDefaultValuesKeys.type}
                control={control}
                render={({ field }) => {
                  const value =
                    field.value === null || field.value === undefined
                      ? ""
                      : String(field.value)

                  return (
                    <div className="quicksand flex flex-col items-start gap-1">
                      <div className="flex flex-col">
                        <label className="pl-2 font-semibold">Event type</label>

                        {formState.errors.type && (
                          <span className="pl-2 text-[0.8rem] text-sm text-red-500">
                            This field is invalid
                          </span>
                        )}
                      </div>

                      <select
                        {...field}
                        key={searchEventDefaultValuesKeys.type}
                        value={value}
                        className="focus:border-secondary border-grey-100 bg-secondary w-full rounded-[30px] border px-4 py-1 text-black outline-none"
                      >
                        <option key={"no-type"} value={""}>
                          No type
                        </option>
                        {Object.values(eventTypes).map(({ name }, index) => {
                          return (
                            <option key={index} value={name}>
                              {name}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  )
                }}
              />

              <Input<SearchEventsSchemaType>
                key={searchEventDefaultValuesKeys.city}
                type={"text"}
                placeholder={"Select city"}
                label={"City"}
                name={
                  searchEventDefaultValuesKeys.city as Path<SearchEventsSchemaType>
                }
                control={control}
              />

              <Input<SearchEventsSchemaType>
                key={searchEventDefaultValuesKeys.startDate}
                type={"date"}
                placeholder={"Pick a date"}
                label={"Starting date"}
                name={
                  searchEventDefaultValuesKeys.startDate as Path<SearchEventsSchemaType>
                }
                control={control}
              />

              <Input<SearchEventsSchemaType>
                key={searchEventDefaultValuesKeys.price}
                type={"range"}
                placeholder={"Price max"}
                label={"Max price : " + watch().price + "€"}
                name={
                  searchEventDefaultValuesKeys.price as Path<SearchEventsSchemaType>
                }
                min={0}
                max={100}
                control={control}
              />

              <Input<SearchEventsSchemaType>
                key={searchEventDefaultValuesKeys.slots}
                type={"number"}
                placeholder={"e.g 20"}
                label={"Event capacity"}
                name={
                  searchEventDefaultValuesKeys.slots as Path<SearchEventsSchemaType>
                }
                control={control}
              />

              <Controller
                name={searchEventDefaultValuesKeys.remainingSlots}
                control={control}
                render={({ field, formState }) => {
                  const value = field.value

                  return (
                    <div className="quicksand flex flex-col items-start gap-1">
                      <div className="flex flex-col">
                        <label className="pl-2 font-semibold">
                          Min. Available Slots
                        </label>
                        {formState.errors.remainingSlots && (
                          <span className="pl-2 text-[0.8rem] text-sm text-red-500">
                            This field is invalid
                          </span>
                        )}
                      </div>
                      <input
                        {...field}
                        type={"number"}
                        spellCheck="false"
                        value={Number(value)}
                        placeholder={"e.g 5"}
                        min={0}
                        max={200}
                        className="focus:border-secondary border-grey-100 bg-secondary w-full rounded-[30px] border px-4 py-1 text-black outline-none"
                      />
                    </div>
                  )
                }}
              />

              <Controller
                name={searchEventDefaultValuesKeys.free}
                control={control}
                render={({ field }) => {
                  const value = field.value

                  return (
                    <div className="col-span-3 flex h-fit items-center justify-center gap-2">
                      <input
                        name={searchEventDefaultValuesKeys.free}
                        type="checkbox"
                        checked={Boolean(value)}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      <label
                        htmlFor={searchEventDefaultValuesKeys.free}
                        className="quicksand"
                      >
                        Show only free events
                      </label>
                    </div>
                  )
                }}
              />

              <div className="col-span-3 flex h-fit items-center justify-end">
                <Button
                  type="button"
                  variant="contained"
                  customClasses="flex gap-2 items-center"
                  onClick={() => handleClearFilters()}
                >
                  <XIcon className="size-4" />
                  <span>Clear all filters</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {data && data.length > 0 && (
        <span className="mb-6 text-[1.5rem]">{data.length} events found</span>
      )}

      {data && data.length > 0 ? (
        <div className="grid-rows-auto grid grid-cols-4 gap-4 pb-6">
          {data?.map((event, i) => (
            <EventCard key={i} event={event} />
          ))}
        </div>
      ) : (
        <span className="text-[1.5rem]">No events found</span>
      )}
    </main>
  )
}

export default EventsPage

const filtersVariant = {
  initial: {
    opacity: 0,
  },
  enter: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
}
