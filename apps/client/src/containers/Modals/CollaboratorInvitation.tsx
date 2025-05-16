import { PermissionModel } from '@notice-app/models'
import { NStrings } from '@notice-app/utils'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled, { useTheme } from 'styled-components'
import { Modals } from '../../components/Modal'
import { SettingDropdown } from '../../components/Settings/SetingDropdown'
import { SettingButton } from '../../components/Settings/SettingButton'
import { SimpleInput } from '../../components/SimpleInput'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useCreateInvitation } from '../../hooks/api/useInviteCollaborator'
import { AdminRoleIcon, EditorRoleIcon, OwnerRoleIcon, ViewerRoleIcon } from '../../icons'
import { Pages } from '../../pages'
import { useT } from '../../hooks/useT'

export const CollaboratorInvitation = () => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()
	const [role, setRole] = useState('editor')
	const [email, setEmail] = useState('')
	const [workspace] = useCurrentWorkspace()
	const createInvitation = useCreateInvitation()

	const onSubmit = async () => {
		try {
			await createInvitation.mutateAsync({ email, role: role as PermissionModel.roles, workspace })
			navigate(Pages.SETTINGS_COLLABORATORS)
			toast.success(`Invitation successfully sent to ${email}!`)
		} catch (ex) {}

		Modals.collaboratorInvitation.close()
	}

	return (
		<Container>
			<Title>{t('Invite collaborators', 'inviteCollaborators')}</Title>
			<Description>
				{t(
					'Many hands make light work. Invite your colleagues to collaborate together on your projects.',
					'inviteCollaboratorsDescription'
				)}
			</Description>
			<InputWrapper>
				<SimpleInput
					style={{ flexGrow: '1' }}
					value={email}
					placeholder={t('Email address', 'emailAddress')}
					onChange={(value) => setEmail(value)}
					onEnter={onSubmit}
				/>
				<SettingDropdown
					values={['owner', 'admin', 'editor', 'viewer']}
					currentValue={role}
					displayName={(value) => {
						switch (value) {
							case 'admin':
								return t('Administrator', 'admin')
							case 'owner':
								return t('Owner', 'owner')
							case 'editor':
								return t('Editor', 'editor')
							case 'viewer':
								return t('Viewer', 'viewer')

							default:
								return NStrings.capitalizeWords(value)
						}
					}}
					displayIcon={(value) => {
						switch (value) {
							case 'viewer':
								return <ViewerRoleIcon color={theme.colors.primary} />
							case 'editor':
								return <EditorRoleIcon color={theme.colors.primary} />
							case 'admin':
								return <AdminRoleIcon color={theme.colors.primary} />
							case 'owner':
								return <OwnerRoleIcon color={theme.colors.primary} />
							default:
								return <></>
						}
					}}
					onUpdate={(value) => setRole(value)}
				/>
			</InputWrapper>
			<ButtonWrapper>
				<SettingButton onClick={() => Modals.collaboratorInvitation.close()}>{t('Close', 'close')}</SettingButton>
				<SettingButton disabled={email.trim() === ''} onClick={onSubmit} primary>
					{t('Invite', 'invite')}
				</SettingButton>
			</ButtonWrapper>
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

const InputWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
`

const ButtonWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 8px;
	margin-top: 32px;
`
