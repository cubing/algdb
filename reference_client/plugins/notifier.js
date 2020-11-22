export default ({ _, store }, inject) => {
  inject('notifier', {
    showSnackbar({ message, variant }) {
      store.commit('snackbar/showSnackbar', { message, variant })
    },
  })
}
