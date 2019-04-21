const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let goalId = event.goalId
  let beginDate = event.beginDate
  let endDate = event.endDate
  let summary = event.summary
  let time = event.time

  if(!goalId) return

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
