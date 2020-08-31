import React, { ReactElement } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import useJql from '../../hooks/useJql'
import { useMutation } from 'react-query'
import signIn from '../../jql/signIn'

export default function WcaRedirect(): ReactElement {
	const search = useLocation().search
	const { setAuth, serverUrl } = useJql()
	const history = useHistory()
	const [mutate] = useMutation(signIn)
	React.useEffect(() => {
		const urlParam = new URLSearchParams(search)
		const code = urlParam.get('code') ?? null
		const expiresAt = parseInt(urlParam.get('expires_at') ?? '-1')
		if (code) {
			mutate({ serverUrl, authToken: code }).then((res) => {
				if (res) {
					console.log(res)
					setAuth(res.data.token, expiresAt)
					history.replace('/')
				}
			})
		} else history.replace('/')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return <></>
}
