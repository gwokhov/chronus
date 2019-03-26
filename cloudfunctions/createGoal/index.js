const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let goalTitle = event.title
  let userId = event.userId

  try {
    let goal = await db.collection('goals').add({
      data: {
        title: goalTitle,
        createDate: new Date(),
        lastUpdate: null,
        time: 0
      }
    })

    await db
      .collection('users')
      .doc(userId)
      .update({
        data: {
          goals: _.push([goal._id])
        }
      })

    await db
      .collection('goal-records')
      .add({
        data: {
          goalId: goal._id
        }
      })
      
  } catch (e) {
    console.log(e)
  }
}
