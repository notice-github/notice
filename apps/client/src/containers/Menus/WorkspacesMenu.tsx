import { WorkspaceModel } from '@notice-app/models'
import { useMemo, useState } from 'react'
import { Menu } from '../../components/Menu'
import { MenuItem } from '../../components/Menu/MenuItem'
import { MenuSeparator } from '../../components/Menu/MenuSeparator'
import { Modals } from '../../components/Modal'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useWorkspaces } from '../../hooks/api/useWorkspaces'
import { PlusIcon } from '../../icons'
import { WorkspaceCard } from '../../layouts/EditorLayout/Sidebar/Workspaces/WorkspaceCard'
import { Show } from '../../components/Show'
import { useT } from '../../hooks/useT'

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any
}

export const WorkspacesMenu = <T extends HTMLElement>({ anchorRef, onClose }: Props<T>) => {
	const [t] = useT()
	const [closing, setClosing] = useState(false)

	const workspaces = useWorkspaces()
	const [_, setCurrentWorkspace] = useCurrentWorkspace()

	const onChangeWorkspace = (workspace: WorkspaceModel.client) => {
		setCurrentWorkspace(workspace)
		setClosing(true)
	}

	const onNewWorkspace = () => {
		Modals.createWorkspace.open()
		setClosing(true)
	}

	return (
		<Menu maxWidth="250px" closing={closing} placement="top" anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<>
				{workspaces.map((workspace, index) => (
					<WorkspaceCard key={workspace.id} workspace={workspace} onClick={() => onChangeWorkspace(workspace)} />
				))}
			</>
			{/* <Show when={workspaces.length < 100}>
				<MenuSeparator />
				<MenuItem
					icon={<PlusIcon size={18} />}
					text={t('New workspace', 'newWorkspace')}
					style={{ margin: '6px 0', padding: '6px 12px' }}
					onClick={onNewWorkspace}
				></MenuItem>
			</Show> */}
		</Menu>
	)
}
