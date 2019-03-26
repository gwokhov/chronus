class SummaryModel {
  static addGoalRecord(goalId, beginDate, endDate, duration, summary) {
    return wx.cloud.callFunction({
      name: 'addGoalRecord',
      data: {
        goalId,
        beginDate,
        endDate,
        time: duration,
        summary
      }
    })
  }
}

export { SummaryModel }
