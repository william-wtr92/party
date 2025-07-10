"use client"

import Loader from "@client/web/components/layout/Loader"
import LeafletMap from "@client/web/components/pages/map/LeafletMap"
import { filterTypeValues, type FilterType } from "@client/web/constants/places"
import { useAppContext } from "@client/web/contexts/useAppContext"
import { getPlacesByName } from "@client/web/services/places/getPlacesByName"
import {
  getPlacesNearby,
  type Position,
} from "@client/web/services/places/getPlacesNearby"
import {
  processNearbyPlacesData,
  type ProcessedNearbyPlaceType,
} from "@client/web/utils/places/processNearbyPlacesData"
import {
  processSearchPlacesData,
  type ProcessedSearchedPlaceType,
} from "@client/web/utils/places/processSearchedPlacesData"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const MapPage = () => {
  const {
    states: { position },
    services: {
      places: { getAreaNameByPosition },
    },
  } = useAppContext()

  const [filterType, setFilterType] = useState<FilterType>("")
  const [searchValue, setSearchValue] = useState<string>("")
  const [currentMapPosition, setCurrentMapPosition] = useState<Position | null>(
    null
  )

  const { data: nearbyPlacesData, isFetching: isNearbyPlacesFetching } =
    useQuery({
      queryKey: ["places-nearby", position],
      queryFn: () => getPlacesNearby(position),
      enabled: !!position,
    })

  const {
    data: currentMapPositionPlacesData,
    refetch: refetchCurrentMapPositionPlaces,
  } = useQuery({
    queryKey: ["places-current-map-position", currentMapPosition],
    queryFn: () => getPlacesNearby(currentMapPosition),
    enabled: false,
  })

  const { data: searchedPlacesData, refetch: refetchSearchedPlaces } = useQuery(
    {
      queryKey: ["places-searched", searchValue],
      queryFn: () => getPlacesByName(searchValue),
      enabled: false,
    }
  )

  const { refetch: refetchAreaName } = useQuery({
    queryKey: ["area-name", currentMapPosition],
    queryFn: () => getAreaNameByPosition(currentMapPosition),
    enabled: false,
  })

  const handleFilterType = (type: FilterType) => {
    setFilterType(type === filterType ? filterTypeValues[""] : type)
  }

  const handleSearchValue = (value: string) => {
    setSearchValue(value)
  }

  const handleCurrentMapPosition = (position: Position) => {
    setCurrentMapPosition(position)
  }

  const filterResultsByType = (
    data: ProcessedNearbyPlaceType[] | ProcessedSearchedPlaceType[]
  ) => {
    if (filterType === filterTypeValues[""]) {
      return data
    }

    return data?.filter((place) => place.type === filterType)
  }

  const processedNearbyPlacesList =
    nearbyPlacesData?.filterWithLimit(50).map(processNearbyPlacesData) || []

  const processedCurrentMapPositionPlacesList =
    currentMapPositionPlacesData
      ?.filterWithLimit(50)
      .map(processNearbyPlacesData) || []

  const processedSearchedPlacesList =
    searchedPlacesData?.filterWithLimit(50).map(processSearchPlacesData) || []

  const list =
    searchValue.length > 0
      ? filterResultsByType(processedSearchedPlacesList)
      : currentMapPosition !== null
        ? filterResultsByType(processedCurrentMapPositionPlacesList)
        : filterResultsByType(processedNearbyPlacesList)

  useEffect(() => {
    if (searchValue.length > 1) {
      refetchSearchedPlaces()
    }
  }, [refetchSearchedPlaces, searchValue])

  useEffect(() => {
    refetchCurrentMapPositionPlaces()
    refetchAreaName()
  }, [refetchCurrentMapPositionPlaces, refetchAreaName, currentMapPosition])

  return (
    <div className="relative h-screen w-full">
      {position && !isNearbyPlacesFetching ? (
        <LeafletMap
          position={position}
          places={list}
          filterType={filterType}
          searchValue={searchValue}
          currentMapPosition={currentMapPosition}
          handleFilterType={handleFilterType}
          handleSearchValue={handleSearchValue}
          handleCurrentMapPosition={handleCurrentMapPosition}
        />
      ) : (
        <div className="flex size-full items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}

export default MapPage
