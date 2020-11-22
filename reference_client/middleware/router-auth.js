export default function ({ store, redirect, route }) {
  if (
    route.name === 'login' ||
    route.name === 'register' ||
    route.name === 'password-reset'
  ) {
    if (store.getters['auth/user']) {
      redirect('/')
    }
  } else if (!store.getters['auth/user']) {
    redirect('/login')
  }
}
