export const getInputType = (type: string): string => {
  if (type.toLocaleLowerCase().includes("password")) {
    return "password"
  }

  if (type.includes("date")) {
    return "date"
  }

  switch (type) {
    case "email":
      return "email"

    case "number":
      return "number"

    case "string":
      return "text"

    default:
      return "text"
  }
}
