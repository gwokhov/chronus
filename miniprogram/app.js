import TimerState from './config/timerState'

App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }

    this.data = {
      timerId: -1,
      timerState: TimerState.NONE,
      goalId: '',
      goalTitle: '',
      duration: 0,
      beginDate: 0,
      pauseDate: 0,
      pauseDuration: 0
    }
  },

  startTimer(goalId, goalTitle, onCount) {
    const { data } = this
    const { timerState, timerId } = data

    if (timerState === TimerState.NONE) {
      data.goalId = goalId
      data.goalTitle = goalTitle
      data.beginDate = Date.now()
    } else if (timerState === TimerState.PAUSE) {
      data.pauseDuration = data.pauseDuration + (Date.now() - data.pauseDate)
      data.pauseDate = 0
    }

    data.timerState = TimerState.ONGOING

    if (timerId !== -1) {
      clearInterval(timerId)
    }

    const { beginDate, pauseDuration } = data

    data.duration = Date.now() - beginDate - pauseDuration
    onCount(data.duration)
    const newTimerId = setInterval(() => {
      data.duration = Date.now() - beginDate - pauseDuration
      onCount(data.duration)
    }, 1000)
    this.data.timerId = newTimerId
  },

  pauseTimer() {
    this.data.pauseDate = Date.now()
    clearInterval(this.data.timerId)
    this.data.timerId = -1
    this.data.timerState = TimerState.PAUSE
  },

  stopTimer() {
    clearInterval(this.data.timerId)
    this.data.timerId = -1
    this.data.timerState = TimerState.NONE
    this.data.goalId = ''
    this.data.goalTitle = ''
    this.data.duration = 0
    this.data.pauseDuration = 0
    this.data.beginDate = 0
    this.data.pauseDate = 0
  },

  getExistTimer() {
    return this.data
  }
})
