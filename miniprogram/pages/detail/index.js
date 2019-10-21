import DetailModel from '../../models/detail'
import { showToast, showModal } from '../../utils/UIUtil'

const globalEnv = getApp()

Page({
  data: {
    goalId: '',
    goalTitle: '',
    lastUpdate: '',
    duration: '',
    longestDuration: '',
    goalRecords: null,
    isEditingTitle: false,
    isUploadingTitle: false
  },

  onLoad: function(options) {
    this.data.goalId = options.id
  },

  onShow() {
    this.getGoalData(this.data.goalId)
  },

  onStartRecord() {
    const timerInfo = globalEnv.data

    if (timerInfo.goalId !== '' && timerInfo.goalId !== this.data.goalId) {
      showToast('你目前已经有目标在进行中')
      return
    }

    wx.navigateTo({
      url: `/pages/timer/index?goalId=${
        this.data.goalId
      }&goalTitle=${encodeURIComponent(this.data.goalTitle)}`
    })
  },

  onEditGoalTitle() {
    this.setData({
      isEditingTitle: true
    })
  },

  onEditCompleted(e) {
    if (!e.detail.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.isUploadingTitle) return

    this.data.isUploadingTitle = true

    DetailModel.editGoalTitle(this.data.goalId, e.detail)
      .then(res => {
        const { goalId, goalTitle } = res.result.data
        const timerInfo = globalEnv.data

        this.setData({
          isEditingTitle: false,
          goalTitle
        })

        if (timerInfo.goalId && timerInfo.goalId === goalId) {
          timerInfo.goalTitle = goalTitle
        }
        this.data.isUploadingTitle = false
        showToast('修改成功', true)
      })
      .catch(err => {
        this.setData({
          isEditingTitle: false
        })
        this.data.isUploadingTitle = false
        showToast('修改失败')
      })
  },

  onEditCancel() {
    this.setData({
      isEditingTitle: false
    })
  },

  onRemoveGoal() {
    showModal('', `是否删除 “${this.data.goalTitle}”`, () => {
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

  getGoalData(goalId) {
    DetailModel.getGoalData(goalId).then(
      res => {
        const data = DetailModel.formatGoalData(res.result)
        this.setData({
          goalTitle: data.title,
          lastUpdate: data.lastUpdate,
          duration: data.duration,
          longestDuration: data.longestDuration,
          goalRecords: data.goalRecords
        })
      },
      err => {
        showToast('获取失败')
      }
    )
  }
})
