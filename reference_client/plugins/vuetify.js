export default (context) => {
  if (process.client) {
    context.$vuetify.theme.dark = localStorage.getItem('theme') !== 'light'
  }
}
