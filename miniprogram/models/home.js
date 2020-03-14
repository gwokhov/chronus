import { formatDurationToStr, formatDateTime } from '../utils/dateTimeUtil'

export default class HomeModel {
  static getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: res => {
                resolve(res)
              }
            })
          } else {
            reject(res)
          }
        },
        fail: err => {
          reject(err)
        }
      })
    })
  }

  static getOpenIdAndUserId() {
    return wx.cloud.callFunction({
      name: 'login',
      data: {}
    })
  }

  static addUserId() {
    return wx.cloud.callFunction({
      name: 'addUser',
      data: null
    })
  }

  static getGoalList(userId) {
    return wx.cloud.callFunction({
      name: 'getGoalList',
      data: {
        userId
      }
    })
  }

  static addGoal(userId, goalTitle) {
    return wx.cloud.callFunction({
      name: 'createGoal',
      data: {
        userId,
        goalTitle
      }
    })
  }

  static formatGoalList(list) {
    let wholeTime = 0
    list.forEach(goal => {
      goal.lastUpdate = formatDateTime(goal.lastUpdate)
      wholeTime += goal.time
      goal.duration = formatDurationToStr(goal.time)
      goal.time = (goal.time / (60 * 60 * 1000)).toFixed(3) // 用于饼状图数据
    })
    return { list, wholeTime: formatDurationToStr(wholeTime) }
  }

  static serializeForChart(list) {
    const chartData = []
    let min = 0
    let max = 0
    list.forEach((goal, index) => {
      const { time, title } = goal
      if (index === 0) {
        min = time
        max = time
      } else {
        min = min > time ? time : min
        max = max < time ? time : max
      }
      const data = { value: time, name: title }
      chartData.push(data)
    })
    return {
      min,
      max,
      list: chartData
    }
  }
}
