import {
  faPersonDressBurst,
  faChampagneGlasses,
  faChess,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons"

export const eventDefaultValues = {
  name: "",
  type: "",
  startDate: new Date(),
  endDate: new Date(),
  slots: 0,
  remainingSlots: "0",
  free: true,
  price: 0,
  typeSpecificData: "",
  participants: 0,
  city: "",
  region: "",
  streetNumber: "",
  street: "",
  country: "",
  postalCode: "",
  extra: "",
}

export const eventDefaultValuesKeys = Object.keys(eventDefaultValues).reduce(
  (acc: Record<string, string>, key) => {
    acc[key] = key

    return acc
  },
  {} as Record<string, string>
) as Record<keyof typeof eventDefaultValues, keyof typeof eventDefaultValues>

export const eventTypes = {
  meetNewPeople: {
    iconClass: faPersonDressBurst,
    name: "Meet new people",
  },
  justForFun: {
    iconClass: faChampagneGlasses,
    name: "Just for fun",
  },
  boardGames: {
    iconClass: faChess,
    name: "Board games",
  },
  drinkAndDance: {
    iconClass: faGlobe,
    name: "Drink and dance",
  },
}

export const searchEventDefaultValues = {
  name: "",
  type: "",
  city: "",
  price: "0",
  startDate: "",
  slots: "0",
  remainingSlots: "0",
  free: false,
  limit: 10,
  offset: 0,
}

export const searchEventDefaultValuesKeys = Object.keys(
  searchEventDefaultValues
).reduce(
  (acc: Record<string, string>, key) => {
    acc[key] = key

    return acc
  },
  {} as Record<string, string>
) as Record<
  keyof typeof searchEventDefaultValues,
  keyof typeof searchEventDefaultValues
>
