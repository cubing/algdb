import Pusher from 'pusher-js'

export const pusher = new Pusher('22c7829e8338677d885b', {
  cluster: 'us2',
  authEndpoint: process.env.apiUrl + '/pusher/auth',
})

export function unsubscribeChannels(channelsArray) {
  channelsArray.forEach((channel) => {
    pusher.unsubscribe(channel)
  })
}