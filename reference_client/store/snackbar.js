export const state = () => ({
  message: '',
  variant: '',
})

export const mutations = {
  showSnackbar(state, { message, variant }) {
    state.message = message
    state.variant = variant
  },
}
