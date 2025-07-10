export const toUpperCaseFirstLetter = <T>(word: T): T => {
  return (String(word).charAt(0).toUpperCase() + String(word).slice(1)) as T
}
