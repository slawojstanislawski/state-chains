export const getCurrentDayOfWeekShort = () => {
  const language = 'en-us'
  const options = { weekday: 'short' as const }
  const today = new Date().toLocaleString(language, options)
  return today
}
