const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let goalId = event.goalId

  if(!goalId) return

  try {
    await db
      .collection('goal-records')
      .where({
        goalId
      })
      .remove()

    await db
      .collection('goals')
      .doc(goalId)
      .remove()

  } catch (e) {
    console.log(e)
  }
}
