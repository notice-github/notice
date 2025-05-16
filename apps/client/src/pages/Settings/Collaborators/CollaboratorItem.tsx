import { PermissionModel, WorkspaceModel } from '@notice-app/models'
import { NStrings } from '@notice-app/utils'
import { useState } from 'react'
import { useTheme } from 'styled-components'
import ImageWithCropper from '../../../components/ImageCropper/ImageWithCropper'
import { Menu } from '../../../components/Menu'
import { MenuItem } from '../../../components/Menu/MenuItem'
import { SettingDropdown } from '../../../components/Settings/SetingDropdown'
import { SettingButton } from '../../../components/Settings/SettingButton'
import { SettingOption } from '../../../components/Settings/SettingOption'
import { Show } from '../../../components/Show'
import { useCurrentWorkspace } from '../../../hooks/api/useCurrentWorkspace'
import { useRemoveCollaborator } from '../../../hooks/api/useRemoveCollaborator'
import { useUpdateCollaborator } from '../../../hooks/api/useUpdateCollaborator'
import { AdminRoleIcon, EditorRoleIcon, OwnerRoleIcon, ViewerRoleIcon } from '../../../icons'
import { TrashIcon } from '../../../icons/TrashIcon'
import { VerticalDotsIcon } from '../../../icons/VerticalDotsIcon'
import { useT } from '../../../hooks/useT'

interface Props {
	collaborator: WorkspaceModel.collaborator
}

export const CollaboratorItem = ({ collaborator }: Props) => {
	const [t] = useT()
	const theme = useTheme()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const [role, setRole] = useState<string>(collaborator.role)

	const [workspace] = useCurrentWorkspace()
	const updateCollaborator = useUpdateCollaborator()

	const onUpdateRole = async (value: string) => {
		try {
			await updateCollaborator.mutateAsync({ collaborator, workspace, role: value as PermissionModel.roles })
			setRole(value)
		} catch (ex) {}
	}

	return (
		<>
			<SettingOption
				title={collaborator.username}
				description={`${collaborator.email} · ${
					collaborator.invitationStatus != null ? NStrings.capitalizeWords(collaborator.invitationStatus) : 'Creator'
				}`}
				icon={
					<ImageWithCropper editable={false} name={collaborator.username} picture={collaborator.picture} size={36} />
				}
			>
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
				{/* <Show when={collaborator.id !== user.id}> */}
				<div ref={setRef}>
					<SettingButton padding="8px" onClick={() => setMenuOpened(true)}>
						<VerticalDotsIcon size={16} />
					</SettingButton>
				</div>
				{/* </Show> */}
			</SettingOption>
			<Show when={menuOpened}>
				<CollaboratorMenu collaborator={collaborator} anchorRef={ref} onClose={() => setMenuOpened(false)} />
			</Show>
		</>
	)
}

interface MenuProps<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	collaborator: WorkspaceModel.collaborator
}

const CollaboratorMenu = <T extends HTMLElement>({ collaborator, anchorRef, onClose }: MenuProps<T>) => {
	const [closing, setClosing] = useState(false)
	const [workspace] = useCurrentWorkspace()

	const removeCollaborator = useRemoveCollaborator()

	const onRemove = async () => {
		try {
			await removeCollaborator.mutateAsync({ workspace, collaborator })
		} catch (ex) {}
		setClosing(true)
	}

	return (
		<Menu closing={closing} anchorRef={anchorRef} offset={[0, 6]} onClose={onClose}>
			<MenuItem icon={<TrashIcon size={18} />} text="Remove" onClick={onRemove} />
		</Menu>
	)
}
