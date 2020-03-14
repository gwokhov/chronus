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
