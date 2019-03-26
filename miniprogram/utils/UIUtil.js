function showToast(title, isSuccess) {
  isSuccess = isSuccess ? 'success' : 'none'
  wx.showToast({
    title,
    icon: isSuccess,
    duration: 2000
  })
}

function showModal(title, content, onConfirm, onCancel) {
  wx.showModal({
    title: title,
    content: content,
    success(res) {
      if (res.confirm) {
        onConfirm()
      } else if (res.cancel) {
        if(onCancel) onCancel()
      }
    }
  })
}

export { showToast, showModal }
