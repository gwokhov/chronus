const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const result = await db
    .collection('users')
    .where({
      _openid: openId
    })
    .get()

  const idData = result.data[0]

  return {
    userId: idData && idData._id && idData._openid ? idData._id : null,
    openId
  }
}
