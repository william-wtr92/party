"use client"

import React from "react"

export type TabTypes = "events" | "places" | ""

type Props = {
  selectedTab: string
  setSelectedTab: (tab: TabTypes) => void
}

const EventsAndPlacesTabs = (props: Props) => {
  const { selectedTab, setSelectedTab } = props

  return (
    <div className="flex justify-end gap-4 px-2 py-4 md:gap-6">
      <span
        className={`duration-200 md:text-[1.5rem] ${selectedTab === "events" && "font-semibold"}`}
        onClick={() => setSelectedTab("events")}
      >
        Events close to you
      </span>
      <span
        className={`duration-200 md:text-[1.5rem] ${selectedTab === "places" && "font-semibold"}`}
        onClick={() => setSelectedTab("places")}
      >
        Places close to you
      </span>
    </div>
  )
}

export default EventsAndPlacesTabs
