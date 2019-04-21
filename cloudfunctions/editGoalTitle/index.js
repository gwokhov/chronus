const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  let goalTitle = event.goalTitle
  let goalId = event.goalId

  if(!goalId || !goalTitle) return

  try {
    return await db.collection('goals').doc(goalId).update({
      data: {
        title: goalTitle
      }
    })
      
  } catch (e) {
    console.log(e)
  }
}
