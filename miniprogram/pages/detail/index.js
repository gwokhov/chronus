import { DetailModel } from '../../models/detail'
import { showToast } from '../../utils/UIUtil'

const globalEnv = getApp()

Page({
  data: {
    goalId: '',
    goalTitle: '',
    lastUpdate: '',
    time: '',
    longestTime: '',
    goalRecords: []
  },

  onLoad: function(options) {
    this.setData({
      goalId: options.id,
      goalTitle: options.title
    })
  },

  onShow() {
    this.getGoalData(this.data.goalId)
  },

  onStartRecord() {
    let timerInfo = globalEnv.checkExistTimer()

    if (timerInfo.goalId !== '' && timerInfo.goalId !== this.data.goalId) {
      showToast('你目前已经有目标在进行中')
    } else {
      wx.navigateTo({
        url:
          '/pages/timer/index?id=' +
          this.data.goalId +
          '&title=' +
          this.data.goalTitle
      })
    }
  },

  getGoalData(id) {
    DetailModel.getGoalData(id).then(
      res => {
        let data = DetailModel.formatGoalData(res.result)
        this.setData({
          lastUpdate: data.lastUpdate,
          time: data.time,
          longestTime: data.longestTime,
          goalRecords: data.goalRecords
        })
      },
      err => {
        showToast('获取失败')
      }
    )
  }
})
