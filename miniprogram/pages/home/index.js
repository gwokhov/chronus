import * as echarts from '../../libs/ec-canvas/echarts'
import pieOptions from '../../config/pieDefOption'
import { showToast } from '../../utils/UIUtil'
import HomeModel from '../../models/home'
import TimerState from '../../config/timerState'
import { formatDurationToTimer } from '../../utils/dateTimeUtil'

const globalEnv = getApp()

Page({
  data: {
    chart: {
      lazyLoad: true
    },
    userInfo: null,
    goalList: null,
    wholeTime: '',
    hasInitChart: false,
    isCreating: false,
    isUploading: false,
    timerGoalTitle: '',
    timerGoalId: '',
    timer: '00:00:00',
    timerState: null
  },

  onLoad() {
    this.initUserInfo()
  },

  onShow() {
    // 若初始化id失败则在catch中初始化userId，否则直接获取列表
    this.initOpenIdAndUserId()
      .then()
      .catch(err => {
        if (err === 0) {
          return this.initUserId()
        }
      })
      .then(() => {
        this.getGoalList()
      })

    this.setTimerTips()
  },

  onReady() {
    this.chartComponent = this.selectComponent('#chart')
  },

  /**
   * 点击授权按钮获取信息
   */
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
      isCreating: true
    })
  },

  onCancelCreate() {
    this.setData({
      isCreating: false
    })
  },

  onAddGoal(e) {
    const title = e.detail
    if (!title.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.isUploading) {
      return
    }

    this.data.isUploading = true
    HomeModel.addGoal(globalEnv.data.userId, title).then(
      res => {
        this.setData({
          isCreating: false
        })
        this.data.isUploading = false
        showToast('创建成功', true)
        this.getGoalList()
      },
      err => {
        this.setData({
          isCreating: false,
          isUploading: false
        })
        showToast('创建失败')
      }
    )
  },

  onGoalClick(e) {
    const { goalId } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/detail/index?id=${goalId}`
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
      case TimerState.NONE:
        stateDesc = ''
        break
      case TimerState.PAUSE:
        stateDesc = '暂停中'
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration),
          timerGoalId: timerInfo.goalId
        })
        break
      case TimerState.ONGOING:
        stateDesc = '进行中'
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration)
        })
        globalEnv.startTimer(null, null, duration => {
          this.setData({
            timer: formatDurationToTimer(duration),
            timerGoalId: timerInfo.goalId
          })
        })
    }
    this.setData({
      timerState: stateDesc,
      timerGoalTitle: timerInfo.goalTitle
    })
  },

  initUserInfo() {
    HomeModel.getUserInfo().then(
      res => {
        this.setData({
          userInfo: res.userInfo
        })
      },
      err => {
        showToast('请先授权登录')
        console.log(err)
      }
    )
  },

  initOpenIdAndUserId() {
    return new Promise((resolve, reject) => {
      HomeModel.getOpenIdAndUserId().then(
        res => {
          const idData = res.result
          globalEnv.data.openid = idData.openId
          if (idData.userId) {
            globalEnv.data.userId = idData.userId
            resolve()
          } else {
            reject(0)
          }
        },
        err => {
          if (err.errCode === -1) {
            showToast('网络不佳，登录失败')
          } else {
            showToast(`登录失败，错误码：${err.errCode}`)
          }
          reject(-1)
        }
      )
    })
  },

  initUserId() {
    return new Promise((resolve, reject) => {
      HomeModel.addUserId().then(
        res => {
          globalEnv.data.userId = res._id
          resolve()
        },
        err => {
          showToast(`添加用户id失败，错误码：${err.errCode}`)
          reject()
        }
      )
    })
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
    const data = HomeModel.serializeForChart(this.data.goalList)
    const option = pieOptions
    option.series[0].data = data
    // option.visualMap.min = 0.19
    // option.visualMap.max = 0.26
    // option.visualMap.inRange.colorLightness = [0.8, 0.2]
    chart.setOption(option)
  }
})
