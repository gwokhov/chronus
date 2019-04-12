import { timerFormat } from '../../utils/dateTimeUtil'
import { showModal } from '../../utils/UIUtil'
import { TimerState } from '../../config/timerState'

const globalEnv = getApp()

Page({
  data: {
    goalTitle: '',
    goalId: '',
    isOngoing: true,
    pauseImg: '../../images/timer/pause.png',
    resumeImg: '../../images/timer/resume.png',
    timer: '00:00:00',
  },

  onLoad(options) {
    this.setData({
      goalTitle: decodeURIComponent(options.title),
      goalId: options.id
    })
    this.initCounter()
  },

  onPauseOrResume() {
    this.setData({
      isOngoing: !this.data.isOngoing
    })
    this.data.isOngoing ? this.startCounter() : this.pauseCounter()
  },

  onFinish() {
    let timerInfo = globalEnv.checkExistTimer()

    let { beginDate, duration } = { ...timerInfo }

    this.stopCounter()

    wx.redirectTo({
      url:
        '/pages/summary/index?id=' +
        this.data.goalId +
        '&title=' +
        encodeURIComponent(this.data.goalTitle) +
        '&begin=' +
        beginDate +
        '&end=' +
        new Date() +
        '&duration=' +
        duration
    })
  },

  onAbort() {
    showModal(
      '',
      '是否取消本次记录',
      () => {
        this.stopCounter()
        wx.navigateBack({
          delta: 1
        })
      },
      null
    )
  },

  initCounter() {
    let timerInfo = globalEnv.checkExistTimer()

    switch (timerInfo.timerState) {
      case TimerState.Ongoing:
      case TimerState.None:
        this.setData({
          timer: timerFormat(timerInfo.duration)
        })
        this.startCounter()
        break
      case TimerState.Pause:
        this.setData({
          timer: timerFormat(timerInfo.duration),
          isOngoing: false
        })
        break
    }
  },

  startCounter() {
    this.setData({
      isOngoing: true
    })

    globalEnv.startTimer(this.data.goalId, this.data.goalTitle, duration => {
      this.setData({
        timer: timerFormat(duration)
      })
    })
  },

  pauseCounter() {
    globalEnv.pauseTimer()
  },

  stopCounter() {
    globalEnv.stopTimer()
  }
})
