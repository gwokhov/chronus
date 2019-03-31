import { TimerState } from './config/timerState'
import { countDuration } from './utils/dateTimeUtil'

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
      beginDate: null,
      hideDate: null,
      hideDuration: 0,
      lastShowDuration: 0
    }
  },

  onShow() {
    let hideDate = this.data.hideDate
    if (!hideDate) return

    console.log(this.data.lastShowDuration, countDuration(hideDate, new Date()))
    this.data.duration =
      this.data.lastShowDuration + countDuration(hideDate, new Date())
      
    this.data.hideDate = null
  },

  onHide() {
    if (this.data.timerState !== TimerState.Ongoing) return
    
    this.data.hideDate = new Date()
    this.data.lastShowDuration = this.data.duration
  },

  startTimer(goalId, goalTitle, onCount) {
    if (this.data.timerState === TimerState.None) {
      this.data.goalId = goalId
      this.data.goalTitle = goalTitle
      this.data.beginDate = new Date()
    }

    this.data.timerState = TimerState.Ongoing

    if (this.data.timerId !== -1) {
      clearInterval(this.data.timerId)
    }

    onCount(this.data.duration++)
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
    this.data.lastShowDuration = 0
    this.data.hideDuration = 0
    this.data.beginDate = null
    this.data.hideDate = null
  },

  checkExistTimer() {
    return this.data
  }
})
