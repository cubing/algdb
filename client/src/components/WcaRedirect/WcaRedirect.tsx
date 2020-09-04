import React, { ReactElement } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { Spinner } from '@chakra-ui/core'
import useJql from '../../hooks/useJql'
import useJqlQuery from '../../hooks/useJqlQuery'
import { Auth } from '../../generated/jql'

export default function WcaRedirect(): ReactElement {
  const { search } = useLocation()
  const { setAuth } = useJql()
  const history = useHistory()
  const urlParam = new URLSearchParams(search)
  const code = urlParam.get('code')
  const query = {
    token: null,
    type: null,
    expiration: null,
    __args: {
      provider: 'wca',
      code,
    },
  }
  const { error, data } = useJqlQuery<Auth, Error>(
    'wca-redirect-login',
    'socialLogin',
    query,
  )
  if (error) {
    console.error(error.message)
    history.replace('/')
  }
  if (data) {
    setAuth(data.token, data.expiration)
    history.replace('/')
  }

  return <Spinner />
}
