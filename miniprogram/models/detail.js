import {
  dateFormat,
  dateTimeFormat,
  durationFormat,
  durationFormatText
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
      time: durationFormatText(goalInfo.time),
      lastUpdate: dateFormat(goalInfo.lastUpdate),
      goalRecords: this.formatGoalRecords(goalRecords),
      longestTime: this.getLongestTime(goalRecords)
    }
  }

  static formatGoalRecords(goalRecords) {
    if (!goalRecords) return []
    goalRecords.forEach(record => {
      ;(record.duration = durationFormat(record.time)),
        (record.date =
          dateTimeFormat(record.beginDate) +
          ' ~ ' +
          dateTimeFormat(record.endDate))
    })
    return goalRecords
  }

  static getLongestTime(goalRecords) {
    if (!goalRecords) return durationFormatText(0)
    let max = 0
    goalRecords.forEach(record => {
      let time = parseInt(record.time, 10)
      max = (time > max) ? time : max
    })
    return durationFormatText(max)
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
