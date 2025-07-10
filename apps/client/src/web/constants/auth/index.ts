export const registerRequiredValues = {
  name: "",
  email: "",
  phone: "",
  birthdate: undefined,
  password: "",
  confirmPassword: "",
}

export const registerOptionalValues = {
  interests: "",
  city: undefined,
  region: undefined,
  streetNumber: undefined,
  street: undefined,
  country: undefined,
  postalCode: undefined,
  extra: undefined,
}

export const registerDefaultValues = {
  ...registerRequiredValues,
  ...registerOptionalValues,
}

export const loginDefaultValues = {
  email: "",
  password: "",
}

export type LoginTab = "login" | "register"

export const loginTabs: Record<LoginTab, LoginTab> = {
  login: "login",
  register: "register",
}

export const labels = {
  name: "Name",
  email: "E-mail",
  password: "Password",
  confirmPassword: "Password confirmation",
  phone: "Phone",
  birthdate: "Birthdate",
  interests: "Interests",
  city: "City",
  region: "Region",
  streetNumber: "Street Number",
  street: "Street",
  country: "Country",
  postalCode: "Postal Code",
  extra: "Extra",
}
