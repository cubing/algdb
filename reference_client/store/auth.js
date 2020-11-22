import Cookie from 'js-cookie'

export const state = () => ({
  user: null,
})

export const mutations = {
  setUserInit(state, authPayload) {
    state.user = authPayload.user || null
    Cookie.set('auth-token', authPayload.token, {
      expires: authPayload.expiration_days,
    })
  },

  setUser(state, user) {
    state.user = user || null
  },

  unsetUser(state) {
    state.user = null
    Cookie.remove('auth-token')
  },
}

export const getters = {
  user(state) {
    return state.user
  },

  token() {
    return Cookie.get('auth-token')
  },
}
