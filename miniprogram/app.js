import { TimerState } from './config/timerState'

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
      timerState: TimerState.None,
      duration: 0,
      goalId: '',
      goalTitle: '',
      beginDate: null
    }
  },

  startTimer(goalId, goalTitle, onCount) {

    if(this.data.timerState === TimerState.None) {
      this.data.goalId = goalId
      this.data.goalTitle = goalTitle
      this.data.beginDate = new Date()
    }

    this.data.timerState = TimerState.Ongoing

    if (this.data.timerId !== -1) {
      clearInterval(this.data.timerId)
    }

    let timerId = setInterval(() => {
      onCount(this.data.duration++)
    }, 1000)
    this.data.timerId = timerId
  },

  pauseTimer() {
    clearInterval(this.data.timerId)
    this.data.timerId = -1
    this.data.timerState = TimerState.Pause
  },

  stopTimer() {
    clearInterval(this.data.timerId)
    this.data.timerId = -1
    this.data.timerState = TimerState.None
    this.data.goalId = ''
    this.data.goalTitle = ''
    this.data.duration = 0
    this.data.beginDate = null
  },

  checkExistTimer() {
    return this.data
  }
})
