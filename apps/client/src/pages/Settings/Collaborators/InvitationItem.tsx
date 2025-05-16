import { PermissionModel, WorkspaceModel } from '@notice-app/models'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'

import { NStrings } from '@notice-app/utils'
import ImageWithCropper from '../../../components/ImageCropper/ImageWithCropper'
import { Menu } from '../../../components/Menu'
import { MenuItem } from '../../../components/Menu/MenuItem'
import { SettingDropdown } from '../../../components/Settings/SetingDropdown'
import { SettingButton } from '../../../components/Settings/SettingButton'
import { SettingOption } from '../../../components/Settings/SettingOption'
import { Show } from '../../../components/Show'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useRemoveInvitation } from '../../../hooks/api/useRemoveInvitation'
import { useUpdateInvitation } from '../../../hooks/api/useUpdateInvitation'
import { AdminRoleIcon, CrossIcon, EditorRoleIcon, OwnerRoleIcon, ViewerRoleIcon } from '../../../icons'
import { TrashIcon } from '../../../icons/TrashIcon'
import { VerticalDotsIcon } from '../../../icons/VerticalDotsIcon'
import { useT } from '../../../hooks/useT'

interface Props {
	invitation: WorkspaceModel.invitation
}

export const InvitationItem = ({ invitation }: Props) => {
	const theme = useTheme()
	const [t] = useT()
	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const [role, setRole] = useState<string>(invitation.role)

	const [workspace] = useCurrentWorkspace()
	const updateInvitation = useUpdateInvitation()

	const onUpdateRole = async (value: string) => {
		try {
			await updateInvitation.mutateAsync({ invitation, workspace, role: value as PermissionModel.roles })
			setRole(value)
		} catch (ex) {}
	}

	return (
		<>
			<SettingOption
				title={invitation.invitationEmail}
				description={
					<Description invitation={invitation}>
						{`${invitation.invitationEmail} · ${NStrings.capitalizeWords(invitation.invitationStatus)}`}
					</Description>
				}
				icon={<ImageWithCropper editable={false} picture={null} name={invitation.invitationEmail} size={36} />}
			>
				<Show when={invitation.invitationStatus !== 'refused'}>
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
						onUpdate={onUpdateRole}
					/>
				</Show>
				<div ref={setRef}>
					<SettingButton padding="8px" onClick={() => setMenuOpened(true)}>
						<VerticalDotsIcon size={16} />
					</SettingButton>
				</div>
			</SettingOption>
			<Show when={menuOpened}>
				<InvitationMenu invitation={invitation} anchorRef={ref} onClose={() => setMenuOpened(false)} />
			</Show>
		</>
	)
}

const Description = styled.span<Pick<Props, 'invitation'>>`
	color: ${({ theme, invitation }) => (invitation.invitationStatus === 'refused' ? theme.colors.error : undefined)};
`

interface MenuProps<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	invitation: WorkspaceModel.invitation
}

const InvitationMenu = <T extends HTMLElement>({ invitation, anchorRef, onClose }: MenuProps<T>) => {
	const [closing, setClosing] = useState(false)
	const [workspace] = useCurrentWorkspace()

	const removeInvitation = useRemoveInvitation()

	const onCancel = async () => {
		try {
			await removeInvitation.mutateAsync({ invitation: invitation, workspace: workspace })
		} catch (ex) {}
		setClosing(true)
	}

	return (
		<Menu closing={closing} anchorRef={anchorRef} offset={[0, 6]} onClose={onClose}>
			<MenuItem
				icon={
					invitation.invitationStatus === 'refused' ? (
						<TrashIcon size={18} />
					) : (
						<CrossIcon size={14} style={{ margin: '2px' }} />
					)
				}
				text={invitation.invitationStatus === 'refused' ? 'Remove' : 'Cancel'}
				onClick={onCancel}
			/>
		</Menu>
	)
}
