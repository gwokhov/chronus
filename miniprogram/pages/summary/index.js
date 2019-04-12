import {
  dateFormat,
  timeFormat,
  durationFormatText
} from '../../utils/dateTimeUtil'
import { SummaryModel } from '../../models/summary'
import { showToast } from '../../utils/UIUtil'

Page({
  data: {
    goalId: '',
    goalTitle: '',
    begin: '',
    beginTime: '',
    beginDate: '',
    end: '',
    endTime: '',
    endDate: '',
    duration: 0,
    durationText: '',
    summary: '',
    uploadingSummary: false
  },

  onLoad(options) {
    this.data.goalId = options.id
    this.data.begin = options.begin
    this.data.end = options.end
    this.data.duration = options.duration

    this.setData({
      goalTitle: decodeURIComponent(options.title),
      beginTime: timeFormat(options.begin),
      beginDate: dateFormat(options.begin),
      endTime: timeFormat(options.end),
      endDate: dateFormat(options.end),
      durationText: durationFormatText(options.duration)
    })
  },

  onSummaryInput(e) {
    this.setData({
      summary: e.detail.value
    })
  },

  onSubmit() {
    if (this.data.uploadingSummary) return

    this.data.uploadingSummary = true
    SummaryModel.addGoalRecord(
      this.data.goalId,
      this.data.begin,
      this.data.end,
      this.data.duration,
      this.data.summary ? this.data.summary : '无标题'
    ).then(
      res => {
        showToast('提交成功', true)
        wx.navigateBack({
          delta: 1
        })
      },
      err => {
        this.data.uploadingSummary = false
        showToast('提交失败')
      }
    )
  }
})
