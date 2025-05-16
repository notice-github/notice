import { useEffect, useMemo } from 'react'
import { WorkspaceModel } from '@notice-app/models'

import { useWorkspaces } from './useWorkspaces'
import { useSearchParam } from '../useSearchParam'

export const useCurrentWorkspace = () => {
	const workspaces = useWorkspaces()
	const [value, setValue] = useSearchParam('workspace')
	const lastWorkspaceId = localStorage.getItem('last_workspace')
	const currentWorkspace = useMemo(
		() => workspaces.find((workspace) => workspace.id === (value ?? lastWorkspaceId)) ?? workspaces[0],
		[value, workspaces]
	)

	useEffect(() => {
		if (value == null && workspaces.length > 0) {
			setValue(currentWorkspace.id)
		}

		if (currentWorkspace.id) localStorage.setItem('last_workspace', currentWorkspace.id)
	}, [value, workspaces])

	const setCurrentWorkspace = (workspace: WorkspaceModel.client) => {
		setValue(workspace.id)
	}

	return [currentWorkspace, setCurrentWorkspace] as const
}
