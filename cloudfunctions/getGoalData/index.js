const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { goalId } = event

  if (!goalId) {
    return
  }

  try {
    const goalInfo = await db
      .collection('goals')
      .doc(goalId)
      .get()

    const goalRecords = await db
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
