import axios from 'axios'
import Cookie from 'js-cookie'
import { pusher } from './pusher.js'

const prodResource = axios.create({
  baseURL: process.env.apiUrl,
})

export async function executeJomql(action, query, args = {}) {
  // fetches the idToken directly from the cookies, if available
  const idToken = Cookie.get('auth-token')

  const request = idToken
    ? {
        headers: {
          Authorization: 'Bearer ' + idToken,
        },
      }
    : null

  const { data } = await prodResource.post(
    '/jomql',
    {
      action,
      query: {
        ...query,
        __args: args,
      },
    },
    request
  )

  return data.data
}

export async function executeJomqlSubscription(
  action,
  query,
  args = {},
  callbackFn
) {
  // fetches the idToken directly from the cookies, if available
  const idToken = Cookie.get('auth-token')

  const request = idToken
    ? {
        headers: {
          Authorization: 'Bearer ' + idToken,
        },
      }
    : null

  const { data } = await prodResource.post(
    '/jomql',
    {
      action,
      query: {
        ...query,
        __args: args,
      },
    },
    request
  )

  const channel = pusher.subscribe(data.data.channel_name)

  channel.bind('subscription-data', callbackFn)

  return data.data.channel_name
}
