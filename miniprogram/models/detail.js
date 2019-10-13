import {
  formatDate,
  formatDateTime,
  formatDuration,
  formatDurationToStr
} from '../utils/dateTimeUtil'

class DetailModel {
  static getGoalData(goalId) {
    return wx.cloud.callFunction({
      name: 'getGoalData',
      data: { goalId }
    })
  }

  static removeGoal(goalId) {
    return wx.cloud.callFunction({
      name: 'removeGoal',
      data: { goalId }
    })
  }

  static formatGoalData(data) {
    let goalInfo = data.goalInfo.data
    let goalRecords = data.goalRecords.data[0].records

    return {
      title: goalInfo.title,
      time: formatDurationToStr(goalInfo.time),
      lastUpdate: formatDate(goalInfo.lastUpdate),
      goalRecords: this.formatGoalRecords(goalRecords),
      longestTime: this.getLongestTime(goalRecords)
    }
  }

  static formatGoalRecords(goalRecords) {
    if (!goalRecords) return []
    goalRecords.forEach(record => {
      ;(record.duration = formatDuration(record.time)),
        (record.date =
          formatDateTime(record.beginDate) +
          ' ~ ' +
          formatDateTime(record.endDate))
    })
    return goalRecords
  }

  static getLongestTime(goalRecords) {
    if (!goalRecords) return formatDurationToStr(0)
    let max = 0
    goalRecords.forEach(record => {
      let time = parseInt(record.time, 10)
      max = (time > max) ? time : max
    })
    return formatDurationToStr(max)
  }

  static editGoalTitle(goalId, goalTitle) {
    return wx.cloud.callFunction({
      name: 'editGoalTitle',
      data: {
        goalId,
        goalTitle
      }
    })
  }
}

export { DetailModel }
