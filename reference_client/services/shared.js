export default {
  handleError(err, root = null) {
    if (root) {
      if (err.response && err.response.data.error.message) {
        root.$notifier.showSnackbar({
          message: err.response.data.error.message,
          variant: 'error',
        })
        console.log(err.response.data.error)
      } else {
        // sanitize error message
        root.$notifier.showSnackbar({
          message: this.sanitizeErrorMessage(err.message),
          variant: 'error',
        })
        console.log(err)
      }
    }
  },

  sanitizeErrorMessage(errMessage) {
    return errMessage.replace(/^GraphQL error: /, '')
  },

  copyToClipboard(that, content) {
    that.$copyText(content)
    that.$notifier.showSnackbar({
      message: 'Copied to Clipboard',
      variant: 'success',
    })
  },

  generateError(message, errno = null) {
    const err = new Error(message)
    if (errno) {
      err.errno = errno
    }
    return err
  },

  capitalizeString(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  },

  capitalize(str) {
    if (!str) return ''
    return str.toUpperCase()
  },

  openExternalWindow(url) {
    window.open(url, '_blank')
  },
}
