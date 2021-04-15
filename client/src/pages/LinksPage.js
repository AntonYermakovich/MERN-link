import React, { useState, useCallback, useContext, useEffect } from 'react'
import { Loader } from '../components/Loader'
import { AuthContext } from '../context/AuthContext'
import { useHttp } from '../hooks/http.hook'
import { LinksList } from '../components/LinksList'


export const LinksPage = () => {
	const [links, setLinks] = useState([])
	const { loading, req } = useHttp()
	const { token } = useContext(AuthContext)

	const fetchLinks = useCallback(async () => {
		try {
			const fetched = await req(`http://localhost:5000/api/link/`, 'GET', null, {
				Authorization: `Bearer ${token}`
			})
			setLinks(fetched)
		} catch (e) { }
	}, [token, req])

	useEffect(() => {
		fetchLinks()
	}, [fetchLinks])

	if (loading) {
		return <Loader />
	}

	return (
		<>
			{!loading && <LinksList links={links} />}
		</>
	)
}