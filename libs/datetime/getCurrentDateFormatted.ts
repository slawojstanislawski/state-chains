/**
 * Returns current date in YYYY-MM-DD format.
 */
export function getCurrentDateFormatted() {
  const date = new Date()
  const year = date.getFullYear()
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  return `${year}-${month}-${day}`
}
