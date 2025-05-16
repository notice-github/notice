import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { toast } from 'react-toastify'
import { SettingButton } from '../../components/Settings/SettingButton'
import { useAcceptInvitation } from '../../hooks/api/useAcceptInvitation'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useInvitationWorkspace } from '../../hooks/api/useInvitationWorkspace'
import { useRefuseInvitation } from '../../hooks/api/useRefuseInvitation'
import { useWorkspaces } from '../../hooks/api/useWorkspaces'
import { useSearchParam } from '../../hooks/useSearchParam'
import { Pages } from '../../pages'

export const InvitationPage = () => {
	const navigate = useNavigate()
	const workspaces = useWorkspaces()
	const [_, setCurrentWorkspace] = useCurrentWorkspace()

	const [token] = useSearchParam('token')
	const invitationWorkspace = useInvitationWorkspace(token)

	const acceptInvitation = useAcceptInvitation()
	const refuseInvitation = useRefuseInvitation()

	// Used to remove ?token=... when page is closed
	useEffect(() => {
		return () => {
			if (location.pathname === Pages.EDITOR) {
				navigate({ pathname: Pages.EDITOR, search: 'token=undefined' }, { replace: true })
			}
		}
	}, [])

	// Used to close the page when an error occured
	useEffect(() => {
		if (!invitationWorkspace.isError) return

		toast.error('An unexpected error occured')

		navigate({ pathname: Pages.EDITOR, search: 'token=undefined' }, { replace: true })
	}, [invitationWorkspace.isError])

	// Used to close the page if the user has already joined the invitation's workspace
	useEffect(() => {
		if (!invitationWorkspace.isFetched || invitationWorkspace.data == null) return

		const workspace = workspaces.find((w) => w.id === invitationWorkspace.data.id)

		if (workspace != null) {
			setCurrentWorkspace(workspace)
			navigate({ pathname: Pages.EDITOR, search: 'token=undefined' }, { replace: true })
		}
	}, [invitationWorkspace.isFetched])

	return (
		<Container>
			<Title>You received an invitation!</Title>
			<Description>
				You received an invitation to join {`"`}
				<Important>{invitationWorkspace.data?.name ?? '...'}</Important>
				{`"`}, you can either accept to join this workspace now or decline if it looks like an error
			</Description>
			<ButtonsWrapper>
				<SettingButton
					onClick={async () => {
						await refuseInvitation.mutateAsync({ token: token! })
						navigate({ pathname: Pages.EDITOR, search: 'token=undefined' }, { replace: true })
					}}
					dangerous
				>
					Refuse
				</SettingButton>
				<SettingButton
					onClick={async () => {
						await acceptInvitation.mutateAsync({ token: token! })
						navigate({ pathname: Pages.EDITOR, search: 'token=undefined' }, { replace: true })
					}}
					primary
				>
					Accept
				</SettingButton>
			</ButtonsWrapper>
		</Container>
	)
}

const Container = styled.div`
	max-width: 450px;
	padding: 32px;
`

const Title = styled.h1`
	font-size: 28px;
	margin-bottom: 6px;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
	font-size: 16px;
	margin-bottom: 32px;
`

const Important = styled.span`
	color: ${({ theme }) => theme.colors.textLightGrey};
	font-weight: 800;
`

const ButtonsWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24px;
`
