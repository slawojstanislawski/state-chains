import { calendar_v3, google } from 'googleapis'

import Calendar = calendar_v3.Calendar

const { OAuth2 } = google.auth

export const getCalendarSdk = () => {
  // setup OAuth Client
  const oauth2Client = new OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET
  )
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH_CLIENT_REFRESH_TOKEN,
  })

  // Initialize the calendar
  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export const addQuickEvent = async (
  eventText: string,
  calendarSdk: Calendar
) => {
  try {
    // TODO SS: handle more datetime-granular meetings
    // const res = await calendarSdk.events.insert({
    //   calendarId: 'primary',
    //   requestBody: event,
    // })
    return await calendarSdk.events.quickAdd({
      calendarId: 'primary',
      text: eventText,
    })
  } catch (err) {
    console.log('Error: %s', err)
  }
}
