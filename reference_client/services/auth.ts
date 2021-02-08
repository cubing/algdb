export default {
  handleLogin(that, authPayload) {
    // put the response in the vuex store
    that.$store.commit('auth/setUserInit', authPayload)
  },

  handleLogout(that) {
    that.$store.commit('auth/unsetUser')
  },

  goToWcaAuth() {
    if (process.env.wcaAuthUrl) {
      window.location.href = process.env.wcaAuthUrl
    }
  },
}
