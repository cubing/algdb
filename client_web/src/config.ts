export const PRODUCTION = process.env.NODE_ENV === 'production'
export const SERVER_URI = 'https://api.algdb.net/jomql'
export const WCA_LOGIN_REDIRECT: string = PRODUCTION
  ? process.env.REACT_APP_WCA_LOGIN_URL_PROD!
  : process.env.REACT_APP_WCA_LOGIN_URL_DEV!
