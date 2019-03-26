const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  let userId = event.userId

  console.log(userId)

  try {
    let userInfo = await db
      .collection('users')
      .doc(userId)
      .get()

    return await db
      .collection('goals')
      .where({
        _id: _.in(userInfo.data.goals)
      })
      .get()
  } catch (e) {
    console.log(e)
  }
}
