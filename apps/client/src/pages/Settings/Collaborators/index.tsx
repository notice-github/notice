import styled from 'styled-components'

import { Loader } from '../../../components/Loader'
import { Modals } from '../../../components/Modal'
import { SettingButton } from '../../../components/Settings/SettingButton'
import { SettingsCard } from '../../../components/Settings/SettingCard'
import { Show } from '../../../components/Show'
import { useCollaborators } from '../../../hooks/api/useCollaborators'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useInvitations } from '../../../hooks/api/useInvitations'
import { PlusIcon } from '../../../icons'
import { CollaboratorItem } from './CollaboratorItem'
import { InvitationItem } from './InvitationItem'

export const SettingsCollaboratorsPage = () => {
	const [workspace] = useCurrentWorkspace()

	const collaborators = useCollaborators(workspace.id)
	const invitations = useInvitations(workspace.id)

	return (
		<>
			<Title>Collaborators & permissions</Title>
			<Description>Manage permissions and invite people in your workspace</Description>
			<SettingsCard
				title="Collaborators"
				button={
					<SettingButton onClick={() => Modals.collaboratorInvitation.open()} primary>
						<PlusIcon color="white" /> Invite new collaborator
					</SettingButton>
				}
			>
				<Show when={!collaborators.isFetched}>
					<LoaderWrapper>
						<Loader />
					</LoaderWrapper>
				</Show>
				{collaborators.data?.map((collaborator) => (
					<CollaboratorItem key={collaborator.id} collaborator={collaborator} />
				))}
			</SettingsCard>

			<Show when={(invitations.data?.length ?? 0) > 0}>
				<SettingsCard title="Invitations">
					<Show when={!invitations.isFetched}>
						<LoaderWrapper>
							<Loader />
						</LoaderWrapper>
					</Show>
					{invitations.data?.map((invitation) => <InvitationItem key={invitation.id} invitation={invitation} />)}
				</SettingsCard>
			</Show>
		</>
	)
}

const Title = styled.h1`
	font-weight: 700;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
`

const LoaderWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`
