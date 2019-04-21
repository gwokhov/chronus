const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let goalId = event.goalId

  if(!goalId) return

  try {
    let goalInfo = await db
      .collection('goals')
      .doc(goalId)
      .get()

    let goalRecords = await db
      .collection('goal-records')
      .where({
        goalId
      })
      .get()

    return { goalInfo, goalRecords }
  } catch (e) {
    console.log(e)
  }
}
