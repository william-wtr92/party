import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import L from "leaflet"
import React, { useCallback, type MutableRefObject } from "react"
import { useMap } from "react-leaflet"

import Loader from "@client/web/components/layout/Loader"
import FilterTypePills from "@client/web/components/pages/map/searchSideBar/FilterTypePills"
import ListPlaceCard from "@client/web/components/pages/map/searchSideBar/ListPlaceCard"
import SearchInput from "@client/web/components/pages/map/searchSideBar/SearchInput"
import { type FilterType } from "@client/web/constants/places"
import { useAppContext } from "@client/web/contexts/useAppContext"
import type { Position } from "@client/web/services/places/getPlacesNearby"
import { anim } from "@client/web/utils/anim"
import type { ProcessedNearbyPlaceType } from "@client/web/utils/places/processNearbyPlacesData"
import type { ProcessedSearchedPlaceType } from "@client/web/utils/places/processSearchedPlacesData"

type Props = {
  places: ProcessedNearbyPlaceType[] | ProcessedSearchedPlaceType[]
  markerRefs: MutableRefObject<Map<string, L.Marker> | null>
  filterType: FilterType
  searchValue: string
  currentMapPosition: Position | null
  handleFilterType: (filterType: FilterType) => void
  handleSearchValue: (value: string) => void
}

const SearchSidebar = (props: Props) => {
  const {
    places,
    markerRefs,
    filterType,
    searchValue,
    currentMapPosition,
    handleFilterType,
    handleSearchValue,
  } = props

  const {
    services: {
      places: { getPlacesByName, getPlacesNearby, getAreaNameByPosition },
    },
  } = useAppContext()

  const map = useMap()

  const { isFetching: isPlacesSearchedFetching } = useQuery({
    queryKey: ["places-searched", searchValue],
    queryFn: () => getPlacesByName(searchValue),
    enabled: false,
  })

  const { isFetching: isCurrentMapPositionPlacesFetching } = useQuery({
    queryKey: ["places-current-map-position", currentMapPosition],
    queryFn: () => getPlacesNearby(currentMapPosition),
    enabled: false,
  })

  const { data: areaNameData, isFetching: isAreaNameFetching } = useQuery({
    queryKey: ["area-name", currentMapPosition],
    queryFn: () => getAreaNameByPosition(currentMapPosition),
    enabled: false,
  })

  const disableMapScrollingCb = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const div = L.DomUtil.get("no-scrolling-clicking")

      if (div) {
        L.DomEvent.disableScrollPropagation(div as HTMLElement)
        L.DomEvent.disableClickPropagation(div as HTMLElement)
      }
    }
  }, [])

  const flyToMarker = (lat: number, lon: number, markerId: number) => {
    map.flyTo([lat, lon], 18)

    const marker = markerRefs.current?.get(markerId.toString())

    if (marker) {
      setTimeout(() => {
        marker.openPopup()
      }, 2)
    }
  }

  const getResultsTitle = () => {
    if (searchValue === "" && currentMapPosition !== null) {
      return `All results around '${areaNameData}'`
    }

    if (searchValue !== "") {
      return `All results for '${searchValue}'`
    }

    return "All results nearby"
  }

  const isFetching =
    isPlacesSearchedFetching ||
    isCurrentMapPositionPlacesFetching ||
    isAreaNameFetching

  const listContainer = {
    initial: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.15,
      },
    },
    exit: {
      opacity: 0,
    },
  }

  return (
    <motion.div
      ref={disableMapScrollingCb}
      id="no-scrolling-clicking"
      className="bg-glass absolute left-[2rem] top-[18vh] z-[9999] flex h-[78.5vh] w-[25vw] cursor-default flex-col gap-4 overflow-hidden rounded-xl p-4"
    >
      <SearchInput onChangeFn={handleSearchValue} onEnterPress={() => null} />

      <FilterTypePills
        filterType={filterType}
        handleFilterType={handleFilterType}
      />

      <div className="flex h-[57vh] flex-1 flex-col gap-4">
        <AnimatePresence>
          {isFetching ? (
            <div className="flex h-full items-center justify-center">
              <Loader />
            </div>
          ) : places.length > 0 ? (
            <>
              <span className="quicksand text-[1.5rem] font-semibold">
                {getResultsTitle()}
              </span>

              <motion.div
                key={places.toString()}
                className="pointer-events-auto flex h-full max-h-full flex-col gap-2 overflow-x-hidden overflow-y-scroll rounded-xl"
                {...anim(listContainer)}
              >
                {places.map((place, index) => {
                  return (
                    <ListPlaceCard
                      key={index}
                      place={place}
                      flyToMarker={flyToMarker}
                    />
                  )
                })}
              </motion.div>
            </>
          ) : (
            <>
              <span className="quicksand text-[1.5rem] font-semibold">
                {getResultsTitle()}
              </span>

              <div className="flex h-full items-center justify-center">
                <span className="quicksand text-center text-[1.3rem]">
                  {searchValue
                    ? `There's no results for the search "${searchValue}"`
                    : "There's no results in this area"}
                </span>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default SearchSidebar
