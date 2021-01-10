const moment = require('moment')

export default {
  generateTimeStringFromUnix(unixTimestamp, mode = 'x', fromNow = true) {
    if (unixTimestamp === 0) {
      return 'just now'
    } else if (unixTimestamp == null) {
      return 'None'
    } else {
      return fromNow
        ? moment.unix(unixTimestamp, mode).fromNow()
        : moment.unix(unixTimestamp, mode).format('MMM Do YYYY')
    }
  },

  handleError(err, root = null) {
    if (root) {
      if (err.response && err.response.data.message) {
        root.$notifier.showSnackbar({
          message: err.response.data.message,
          variant: 'error',
        })
      } else {
        // sanitize error message
        root.$notifier.showSnackbar({
          message: this.sanitizeErrorMessage(err.message),
          variant: 'error',
        })
      }
    }
    console.log(err)
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