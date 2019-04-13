import { DetailModel } from '../../models/detail'
import { showToast, showModal } from '../../utils/UIUtil'

const globalEnv = getApp()

Page({
  data: {
    goalId: '',
    goalTitle: '',
    lastUpdate: '',
    time: '',
    longestTime: '',
    goalRecords: null,
    editingGoal: false,
    uploadingGoalTitle: false
  },

  onLoad: function(options) {
    this.data.goalId = options.id
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
          encodeURIComponent(this.data.goalTitle)
      })
    }
  },

  onEditGoalTitle() {
    this.setData({
      editingGoal: true
    })
  },

  onEditCompleted(e) {
    if (!e.detail.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.uploadingGoalTitle) return

    this.data.uploadingGoalTitle = true

    DetailModel.editGoalTitle(this.data.goalId, e.detail)
      .then(res => {
        this.setData({
          editingGoal: false
        })
        this.data.uploadingGoalTitle = false
        showToast('修改成功', true)
      })
      .catch(err => {
        this.setData({
          editingGoal: false
        })
        this.data.uploadingGoalTitle = false
        showToast('修改失败')
      })
  },

  onEditCancel() {
    this.setData({
      editingGoal: false
    })
  },

  onRemoveGoal() {
    showModal('', '是否删除“' + this.data.goalTitle + '”', () => {
      DetailModel.removeGoal(this.data.goalId).then(
        res => {
          wx.navigateBack({
            delta: 1
          })
        },
        err => {
          showToast('删除失败')
        }
      )
    })
  },

  getGoalData(id) {
    DetailModel.getGoalData(id).then(
      res => {
        let data = DetailModel.formatGoalData(res.result)
        this.setData({
          goalTitle: data.title,
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
