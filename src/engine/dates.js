export function todayKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function displayDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(',', '').replace(/ /g, '.').toUpperCase()
}

export function daysBetween(a, b) {
  const start = new Date(`${a}T00:00:00.000Z`)
  const end = new Date(`${b}T00:00:00.000Z`)
  return Math.max(0, Math.round((end - start) / 86400000))
}
