var dateFormat = function(dateStr) {
  if (!dateStr) return null
  var date = new Date(dateStr)
  var month = date.getMonth() + 1
  var day = date.getDate()
  return month + '月' + day + '日'
}

var timeFormat = function(dateStr) {
  if (!dateStr) return null
  var date = new Date(dateStr)
  var hour = date.getHours()
  var minute = date.getMinutes()
  minute = minute < 10 ? '0' + minute.toString() : minute
  return hour + ':' + minute
}

var dateTimeFormat = function(dateStr) {
  if (!dateStr) return null
  return dateFormat(dateStr) + ' ' + timeFormat(dateStr)
}

var durationFormat = function(duration) {
  let before = ''
  let after = ''
  if (duration <= 0) {
    after = '未开始'
  } else if (duration <= 1) {
    after = '1秒不够'
  } else if (duration < 60) {
    before = parseInt(duration)
    after = '秒'
  } else if (duration / 60 < 60) {
    before = parseInt(duration / 60)
    after = '分钟'
  } else if (duration / 3600 < 24) {
    before = parseInt(duration / 3600)
    after = '小时'
  } else {
    before = parseInt(duration / 86400)
    after = '天'
  }
  return {
    before,
    after
  }
}

var countDuration = function(startDate, endDate) {
  if (!startDate && !endDate) return
  if (endDate.getTime() - startDate.getTime() <= 0) return

  return Math.floor((endDate.getTime() - startDate.getTime()) / 1000)
}

var durationFormatText = function(duration) {
  let obj = durationFormat(duration)
  return obj.before + obj.after
}

var addRealZero = function(number) {
  return number < 10 ? '0' + number.toString() : number.toString()
}

var timerFormat = function(duration) {
  let seconds = addRealZero(duration % 60)
  let minutes = addRealZero(Math.floor(duration / 60) % 60)
  let hours = addRealZero(Math.floor(duration / 60 / 60) % 60)
  return hours + ':' + minutes + ':' + seconds
}

export {
  dateFormat,
  timeFormat,
  dateTimeFormat,
  durationFormat,
  durationFormatText,
  timerFormat,
  countDuration
}
