const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { goalId, beginDate, endDate, summary, time } = event

  if (!goalId) {
    return
  }

  try {
    await db
      .collection('goal-records')
      .where({
        goalId
      })
      .update({
        data: {
          records: _.push([
            {
              summary,
              beginDate,
              endDate,
              time
            }
          ])
        }
      })

    await db
      .collection('goals')
      .doc(goalId)
      .update({
        data: {
          time: _.inc(parseInt(time)),
          lastUpdate: endDate
        }
      })
  } catch (e) {
    console.log(e)
  }
}
