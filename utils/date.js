import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

// Set your app's default timezone if needed
// dayjs.tz.setDefault('Asia/Dhaka')

export function formatDate(date, format = 'YYYY-MM-DD') {
  return dayjs(date).format(format)
}

export function formatDateTime(date, format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs(date).format(format)
}

export function fromNow(date) {
  return dayjs(date).fromNow() // e.g., "2 hours ago"
}

export function toUTC(date) {
  return dayjs(date).utc().format()
}

export function toLocalTime(date, tz = 'Asia/Dhaka', format = 'YYYY-MM-DD HH:mm:ss') {
  return dayjs.utc(date).tz(tz).format(format)
}

export function isBefore(date1, date2) {
  return dayjs(date1).isBefore(dayjs(date2))
}

export function isAfter(date1, date2) {
  return dayjs(date1).isAfter(dayjs(date2))
}

export function getCurrentTimestamp() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss')
}
