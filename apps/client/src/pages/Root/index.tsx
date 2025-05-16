import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { GlobalDrawerContainer } from '../../components/Drawer'
import { Loader } from '../../components/Loader'
import { GlobalModalContainer } from '../../components/Modal'
import { Show } from '../../components/Show'
import { useQueryUser } from '../../hooks/api/useUser'
import { useQueryWorkspaces } from '../../hooks/api/useWorkspaces'
import { getEditorTimeouts } from '../../hooks/bms/editor/useEditorValue'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Pages } from '../../pages'

export const RootPage = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const timeouts = getEditorTimeouts()
	const [iframe] = useSearchParam('_iframe')

	const user = useQueryUser()
	const workspaces = useQueryWorkspaces()

	const everythingIsFetched = () => user.data && !user.isError && workspaces.data && !workspaces.isError

	useEffect(() => {
		if (user.isError || workspaces.isError) {
			navigate(
				{
					pathname: Pages.SIGNIN,
					search: `?next=${encodeURIComponent(location.pathname + location.search)}`,
				},
				{ replace: true, state: { clear: true } }
			)
			return
		}

		if (everythingIsFetched() && location.pathname === '/') {
			navigate('/editor', { replace: true })
		}
	}, [user.isError, user.isFetched, workspaces.isFetched, workspaces.isError, location.pathname])

	useEffect(() => {
		const beforeUnload = (e: BeforeUnloadEvent) => {
			if (Object.values(timeouts).filter((timeout) => timeout != null).length === 0) return undefined

			const confirmationMessage = 'Changes that you made may not be saved.'

			;(e || window.event).returnValue = confirmationMessage // Gecko + IE
			return confirmationMessage // Gecko + Webkit, Safari, Chrome etc.
		}

		window.addEventListener('beforeunload', beforeUnload)
		return () => window.removeEventListener('beforeunload', beforeUnload)
	}, [])

	useEffect(() => {
		if (iframe === 'wordpress') window.close()
	}, [iframe])

	return (
		<>
			<Show when={everythingIsFetched()}>
				<Outlet />
				<GlobalModalContainer />
				<GlobalDrawerContainer />
			</Show>
			<Show when={!everythingIsFetched()}>
				<Background>
					<StyledLoader size={24} />
				</Background>
			</Show>
		</>
	)
}

const Background = styled.div`
	height: 100vh;
	background-color: ${({ theme }) => theme.colors.dark};
`

const StyledLoader = styled(Loader)`
	position: absolute;
	left: calc(50% - (24px / 2));
	top: calc(50% - (24px / 2));
`
