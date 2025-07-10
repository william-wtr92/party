export const formatDate = (date: Date) => {
  const dateObj = new Date(date)

  const pad = (num: number) => num.toString().padStart(2, "0")

  const day = pad(dateObj.getDate())
  const month = pad(dateObj.getMonth() + 1)
  const year = dateObj.getFullYear()

  const hours = pad(dateObj.getHours())
  const minutes = pad(dateObj.getMinutes())
  const seconds = pad(dateObj.getSeconds())

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}
