import { executeJomql } from '~/services/jomql'
import { userFragment } from '~/jomql/fragments'

export default (context) => {
  const { store } = context

  return new Promise((resolve) => {
    if (store.getters['auth/token'] && !store.getters['auth/user']) {
      // fetch the user info
      executeJomql('getCurrentUser', userFragment)
        .then((data) => {
          if (!data) {
            return resolve()
          }

          store.commit('auth/setUser', data)
          resolve()
        })
        .catch(() => resolve())
    } else {
      resolve()
    }
  })
}
