import {
  formatDate,
  formatTime,
  formatDurationToStr
} from '../../utils/dateTimeUtil'
import SummaryModel from '../../models/summary'
import { showToast } from '../../utils/UIUtil'

Page({
  data: {
    goalId: '',
    goalTitle: '',
    begin: 0,
    beginTime: '',
    beginDate: '',
    end: 0,
    endTime: '',
    endDate: '',
    duration: 0,
    durationStr: '',
    summary: '',
    isUploading: false
  },

  onLoad(options) {
    const { goalId, goalTitle, beginDate, endDate, duration } = options
    this.data.goalId = goalId
    this.data.begin = +beginDate
    this.data.end = +endDate
    this.data.duration = +duration

    this.setData({
      goalTitle: decodeURIComponent(goalTitle),
      beginTime: formatTime(+beginDate),
      beginDate: formatDate(+beginDate),
      endTime: formatTime(+endDate),
      endDate: formatDate(+endDate),
      durationStr: formatDurationToStr(duration)
    })
  },

  onSummaryInput(e) {
    this.setData({
      summary: e.detail.value
    })
  },

  onSubmit() {
    if (this.data.isUploading) return

    this.data.isUploading = true
    const { goalId, begin, end, duration, summary } = this.data
    SummaryModel.addGoalRecord(
      goalId,
      begin,
      end,
      duration,
      summary ? summary : '无标题'
    ).then(
      res => {
        wx.navigateBack({
          delta: 1
        })
      },
      err => {
        this.data.isUploading = false
        showToast('提交失败')
      }
    )
  }
})
