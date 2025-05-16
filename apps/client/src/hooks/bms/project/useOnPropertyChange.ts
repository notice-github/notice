import { useCurrentWorkspace } from '../../api/useCurrentWorkspace'
import { useCurrentProject } from './useCurrentProject'
import { useUpdateProject } from './useUpdateProject'

export type OnPropertyChange = (
	scope: 'preferences' | 'layout' | 'colors' | 'data' | 'userCode',
	field: string,
	value: any
) => Promise<void>

export const useOnPropertyChange = () => {
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()
	const updateProject = useUpdateProject()

	const onPropertyChange: OnPropertyChange = async (scope, field, value) => {
		if (project == null) return
		await updateProject.mutateAsync({ project, workspace, [scope]: { [field]: value } })
	}
	return [onPropertyChange]
}
