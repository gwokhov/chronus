import { formatDurationToTimer } from '../../utils/dateTimeUtil'
import { showModal } from '../../utils/UIUtil'
import TimerState from '../../config/timerState'

const globalEnv = getApp()

Page({
  data: {
    goalTitle: '',
    goalId: '',
    isOngoing: true,
    pauseImg: '../../images/timer/pause.png',
    resumeImg: '../../images/timer/resume.png',
    timer: '00:00:00'
  },

  onLoad(options) {
    const timerInfo = globalEnv.data
    this.setData({
      goalTitle:
        timerInfo.timerState === TimerState.NONE
          ? decodeURIComponent(options.goalTitle)
          : timerInfo.goalTitle,
      goalId:
        timerInfo.timerState === TimerState.NONE
          ? options.goalId
          : timerInfo.goalId
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
    const timerInfo = globalEnv.data

    const { goalId, goalTitle, beginDate, duration } = timerInfo

    this.stopCounter()

    wx.redirectTo({
      url: `/pages/summary/index?goalId=${goalId}&goalTitle=${encodeURIComponent(
        goalTitle
      )}&beginDate=${beginDate}&endDate=${Date.now()}&duration=${duration}`
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
    const timerInfo = globalEnv.data

    switch (timerInfo.timerState) {
      case TimerState.ONGOING:
      case TimerState.NONE:
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration)
        })
        this.startCounter()
        break
      case TimerState.PAUSE:
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration),
          isOngoing: false
        })
        break
    }
  },

  startCounter() {
    this.setData({
      isOngoing: true
    })

    const { goalId, goalTitle } = this.data

    globalEnv.startTimer(goalId, goalTitle, duration => {
      this.setData({
        timer: formatDurationToTimer(duration)
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
