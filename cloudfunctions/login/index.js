const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  return [
    await db
      .collection('users')
      .where({
        _openid: openid
      })
      .get(),
    openid
  ]
}
