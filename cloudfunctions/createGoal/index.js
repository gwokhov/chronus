const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { goalTitle, userId } = event

  if (!goalTitle || !userId) return

  try {
    const goal = await db.collection('goals').add({
      data: {
        userId,
        title: goalTitle,
        createDate: new Date(),
        lastUpdate: null,
        time: 0
      }
    })

    await db.collection('goal-records').add({
      data: {
        goalId: goal._id
      }
    })
  } catch (e) {
    console.log(e)
  }
}
