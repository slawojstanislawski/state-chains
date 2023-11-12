import { addQuickEvent, getCalendarSdk } from './addQuickEventRequest'

const calendarSdk = getCalendarSdk()

export const handler = async ({ eventText }: { eventText: string }) => {
  const res = await addQuickEvent(eventText, calendarSdk)
  return {
    message: `Created an event: ${res?.data.htmlLink}`,
  }
}
