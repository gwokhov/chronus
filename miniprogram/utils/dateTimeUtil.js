export function formatDate(dateStr) {
  if (!dateStr) {
    return false
  }
  const date = new Date(dateStr)
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${month}月${day}日`
}

export function formatTime(dateStr) {
  if (!dateStr) {
    return false
  }
  const date = new Date(dateStr)
  const hour = date.getHours()
  const minute = padZero(date.getMinutes())
  return `${hour}:${minute}`
}

export function formatDateTime(dateStr) {
  if (!dateStr) {
    return false
  }
  return `${formatDate(dateStr)} ${formatTime(dateStr)}`
}

export function formatDuration(duration) {
  let pref = ''
  let suff = ''
  if (duration <= 0) {
    suff = '未开始'
  } else if (duration <= 1) {
    suff = '1秒不够'
  } else if (duration < 60) {
    pref = parseInt(duration)
    suff = '秒'
  } else if (duration / 60 < 60) {
    pref = parseInt(duration / 60)
    suff = '分钟'
  } else if (duration / 3600 < 24) {
    pref = parseInt(duration / 3600)
    suff = '小时'
  } else {
    pref = parseInt(duration / 86400)
    suff = '天'
  }
  return {
    pref,
    suff
  }
}

export function formatDurationToStr(duration) {
  const obj = formatDuration(duration)
  return obj.pref + obj.suff
}

export function formatDurationToTimer(duration) {
  const second = padZero(duration % 60)
  const minute = padZero(Math.floor(duration / 60) % 60)
  const hour = padZero(Math.floor(duration / 60 / 60) % 60)
  return `${hour}:${minute}:${second}`
}

export function countDuration(startDate, endDate) {
  if (!startDate || !endDate) {
    return
  }
  const duration = +endDate - +startDate
  if (duration < 0) return

  return Math.floor(duration / 1000)
}

function padZero(number) {
  return +number < 10 ? '0' + number.toString() : number.toString()
}
