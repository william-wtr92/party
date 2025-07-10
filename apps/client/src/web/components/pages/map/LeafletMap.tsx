import { Marker } from "@adamscybot/react-leaflet-component-marker"
import L from "leaflet"
import Image from "next/image"
import React, { useRef } from "react"
import { TileLayer, Popup, MapContainer } from "react-leaflet"

import DragEventsComponent from "@client/web/components/pages/map/DragEventsComponent"
import SearchSidebar from "@client/web/components/pages/map/searchSideBar/SearchSidebar"
import type { FilterType } from "@client/web/constants/places"
import type { Position } from "@client/web/services/places/getPlacesNearby"
import { getRandomInt } from "@client/web/utils/getRandomInt"
import type { ProcessedNearbyPlaceType } from "@client/web/utils/places/processNearbyPlacesData"
import type { ProcessedSearchedPlaceType } from "@client/web/utils/places/processSearchedPlacesData"

type Props = {
  position: Position
  places: ProcessedNearbyPlaceType[] | ProcessedSearchedPlaceType[]
  filterType: FilterType
  searchValue: string
  currentMapPosition: Position | null
  handleFilterType: (filterType: FilterType) => void
  handleSearchValue: (value: string) => void
  handleCurrentMapPosition: (position: Position) => void
}

const LeafletMap = (props: Props) => {
  const {
    position,
    places,
    filterType,
    searchValue,
    currentMapPosition,
    handleCurrentMapPosition,
    handleFilterType,
    handleSearchValue,
  } = props

  const markerRefs = useRef<Map<string, L.Marker>>(new Map())

  const center: [number, number] = [
    Number.parseFloat(position.lat),
    Number.parseFloat(position.lon),
  ]

  const getCustomMarkerIcon = (type: FilterType) => {
    return L.divIcon({
      className: "custom-div-icon",
      html: `
      <div class="custom-marker">
        <img src="/${type}-icon.png" class="custom-marker-image" alt="Custom Marker for ${type}" />
      </div>
    `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [1, -34],
    })
  }

  return (
    <MapContainer
      key={JSON.stringify(position)}
      center={center}
      zoom={15}
      scrollWheelZoom={true}
      className="relative z-10 h-full"
    >
      <DragEventsComponent
        handleCurrentMapPosition={handleCurrentMapPosition}
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <SearchSidebar
        places={places}
        markerRefs={markerRefs}
        filterType={filterType}
        searchValue={searchValue}
        currentMapPosition={currentMapPosition}
        handleFilterType={handleFilterType}
        handleSearchValue={handleSearchValue}
      />

      {places.map((place, index) => {
        const { id, type, name, adress } = place
        const { lat, lon } = place.coordinates

        const latitude: number = parseFloat(lat)
        const longitude: number = parseFloat(lon)

        return (
          <Marker
            key={index}
            position={[latitude, longitude]}
            icon={getCustomMarkerIcon(type as FilterType)}
            ref={(markerInstance) => {
              if (markerInstance) {
                markerRefs.current.set(id.toString(), markerInstance)
              }
            }}
          >
            <Popup className="quicksand">
              <div className="flex flex-col gap-3 pt-1">
                <div className="relative ml-1 h-[200px] w-[300px] overflow-hidden rounded-xl object-cover">
                  <Image
                    fill
                    src={`/${type}/${type}-${getRandomInt(5)}.jpg`}
                    alt={"Image of " + name}
                  />
                </div>

                <div className="flex flex-col items-center gap-4">
                  <span className="cormorantGaramond text-[1.8rem] font-semibold">
                    {name}
                  </span>

                  <span className="text-center text-[0.9rem]">
                    {adress.string}
                  </span>

                  <span className="text-center">{place.openingHours}</span>

                  <a href={place.url} target="_blank" rel="noreferrer">
                    Let's go
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default LeafletMap
