import { useMapEvents } from "react-leaflet"

import useDebounce from "@client/web/hooks/useDebounce"
import type { Position } from "@client/web/services/places/getPlacesNearby"

type Props = {
  handleCurrentMapPosition: (position: Position) => void
}

const DragEventsComponent = (props: Props) => {
  const { handleCurrentMapPosition } = props

  const debounceEvent = useDebounce((position: Position) => {
    handleCurrentMapPosition(position)
  }, 1100)

  useMapEvents({
    dragend: (e) => {
      const position = {
        lat: e.target.getCenter().lat.toString(),
        lon: e.target.getCenter().lng.toString(),
      }
      debounceEvent(position)
    },
  })

  return null
}

export default DragEventsComponent
