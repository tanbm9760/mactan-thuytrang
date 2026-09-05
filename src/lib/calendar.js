import { config } from '../config'
import { mapUrl } from './venue'

const pad = (n) => String(n).padStart(2, '0')

/** Định dạng thời gian UTC cho lịch: 20260920T100000Z */
function toICSDate(date) {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}00Z`
  )
}

/** Link "Thêm vào Google Calendar" cho ngày cưới (mặc định 4 tiếng) */
export function googleCalendarUrl(title, durationHours = 4) {
  const start = config.weddingDate
  const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    location: `${config.venue.name}, ${config.venue.address}`,
    details: mapUrl,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
