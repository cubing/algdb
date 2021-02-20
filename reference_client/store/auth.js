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

  partialUpdateUser(state, updateFields) {
    if (!state.user) return
    for (const field in updateFields) {
      if (field in state.user) {
        state.user[field] = updateFields[field]
      }
    }
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
