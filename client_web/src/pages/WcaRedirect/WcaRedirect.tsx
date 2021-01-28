import React, { ReactElement, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Spinner } from '@chakra-ui/react'
import useJql from '../../hooks/useJql'
import useJqlQuery from '../../hooks/useJqlQuery'
import { WCA_LOGIN_REDIRECT } from '../../config'

export default function WcaRedirect(): ReactElement {
  const { search } = useLocation()
  const { setAuth } = useJql()
  const history = useHistory()
  const urlParam = new URLSearchParams(search)
  const code = urlParam.get('code')
  const { error, data } = useJqlQuery<'socialLogin', Error>(
    'wca-redirect-login',
    {
      socialLogin: {
        token: true,
        type: true,
        expiration: true,
        __args: {
          provider: 'wca',
          code: code!,
          redirect_uri: 'http://localhost:3000/wca-redirect',
        },
      },
    },
  )
  useEffect(() => {
    if (data) {
      setAuth(data.token, data.expiration)
      history.replace('/')
    }
  }, [data])

  if (error) {
    console.error(error.message)
    history.replace('/')
  }

  return <Spinner />
}
