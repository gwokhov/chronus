import * as echarts from '../../libs/ec-canvas/echarts'
import pieOptions from '../../config/pieDefOption'
import { showToast } from '../../utils/UIUtil'
import { HomeModel } from '../../models/home'
import { TimerState } from '../../config/timerState'
import { timerFormat } from '../../utils/dateTimeUtil'

const globalEnv = getApp()

Page({
  data: {
    chart: {
      lazyLoad: true
    },
    userInfo: null,
    creatingGoal: false,
    uploadingGoal: false,
    goalList: null,
    wholeTime: '',
    hasInitChart: false,
    timerGoalTitle: '',
    timerGoalId: '',
    timer: '00:00:00',
    timerState: null
  },

  onLoad(options) {
    this.getUserInfo()
  },

  onShow() {
    this.getOpenidAndUserId()
    this.setTimerTips()
  },

  onReady() {
    this.chartComponent = this.selectComponent('#chart')
  },

  onAuthorize(e) {
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
    }
  },

  onCreateGoal() {
    if (!this.data.userInfo) {
      showToast('请先授权登录')
      return
    }
    this.setData({
      creatingGoal: true
    })
  },

  onCancelCreate() {
    this.setData({
      creatingGoal: false
    })
  },

  onNewGoalInput(e) {
    this.setData({
      newGoalTitle: e.detail.value
    })
  },

  onAddGoal(e) {
    let newGoalTitle = e.detail
    if (!newGoalTitle.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.uploadingGoal) return

    this.data.uploadingGoal = true
    HomeModel.addGoal(globalEnv.data.userId, newGoalTitle).then(
      res => {
        this.setData({
          creatingGoal: false
        })
        this.data.uploadingGoal = false
        showToast('创建成功', true)
        this.getGoalList()
      },
      err => {
        this.setData({
          creatingGoal: false,
          uploadingGoal: false
        })
        showToast('创建失败')
      }
    )
  },

  onGoalClick(e) {
    let goalId = e.currentTarget.dataset.goalId

    wx.navigateTo({
      url: '/pages/detail/index?id=' + goalId
    })
  },

  onCheckTimer() {
    wx.navigateTo({
      url:
        '/pages/timer/index?id=' +
        this.data.timerGoalId +
        '&title=' +
        this.data.timerGoalTitle
    })
  },

  setTimerTips() {
    let timerInfo = globalEnv.checkExistTimer()
    let stateDesc = ''

    switch (timerInfo.timerState) {
      case TimerState.None:
        stateDesc = ''
        break
      case TimerState.Pause:
        stateDesc = '暂停中'
        this.setData({
          timer: timerFormat(timerInfo.duration),
          timerGoalId: timerInfo.goalId
        })
        break
      case TimerState.Ongoing:
        stateDesc = '进行中'
        this.setData({
          timer: timerFormat(timerInfo.duration)
        })
        globalEnv.startTimer(null, null, duration => {
          this.setData({
            timer: timerFormat(duration),
            timerGoalId: timerInfo.goalId
          })
        })
    }
    this.setData({
      timerState: stateDesc,
      timerGoalTitle: timerInfo.goalTitle
    })
  },

  getUserInfo() {
    HomeModel.getUserInfo().then(res => {
      this.setData({
        userInfo: res.userInfo
      })
    })
  },

  getOpenidAndUserId() {
    HomeModel.getOpenidAndUserId().then(
      res => {
        let ids = res.result
        globalEnv.data.openid = ids[1]

        if (!ids[0].data.length) {
          this.addUserId()
        } else {
          globalEnv.data.userId = ids[0].data[0]._id
          this.getGoalList()
        }
      },
      err => {
        showToast('登录失败')
      }
    )
  },

  addUserId() {
    HomeModel.addUserId().then(
      res => {
        globalEnv.data.userId = res._id
        this.getGoalList()
      },
      err => {
        showToast('添加用户id失败')
      }
    )
  },

  getGoalList() {
    HomeModel.getGoalList(globalEnv.data.userId).then(
      res => {
        if (!res.result) {
          this.setData({
            goalList: []
          })
          return
        }
        let formattedData = HomeModel.formatGoalList(res.result.data)
        this.setData({
          goalList: formattedData.list,
          wholeTime: formattedData.wholeTime
        })
        if (this.data.hasInitChart) {
          this.setChartOption(this.chart)
        } else {
          this.initChart()
        }
      },
      err => {
        showToast('获取目标列表失败')
      }
    )
  },

  initChart() {
    this.chartComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      this.setChartOption(chart)
      this.chart = chart
      this.setData({
        hasInitChart: true
      })
      return chart
    })
  },

  setChartOption(chart) {
    let data = HomeModel.serializeForChart(this.data.goalList)
    let option = pieOptions
    option.series[0].data = data
    chart.setOption(option)
  }
})
