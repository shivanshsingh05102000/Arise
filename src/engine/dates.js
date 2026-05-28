export function todayKey() {
  return new Date().toISOString().slice(0, 10)
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
