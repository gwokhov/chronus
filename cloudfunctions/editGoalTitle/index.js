const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const { goalId, goalTitle } = event

  if (!goalId || !goalTitle) return

  try {
    const result = await db
      .collection('goals')
      .doc(goalId)
      .update({
        data: {
          title: goalTitle
        }
      })
    result.data = {
      goalId,
      goalTitle
    }
    return result
  } catch (e) {
    console.log(e)
    return e
  }
}
