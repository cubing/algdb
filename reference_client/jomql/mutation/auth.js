import { userFragment } from '../fragments'

export const LOGIN_MUTATION = {
  token: true,
  expiration_days: true,
  user: {
    ...userFragment,
  },
}

export const REGISTER_MUTATION = {
  token: true,
  expiration_days: true,
  user: {
    ...userFragment,
  },
}
