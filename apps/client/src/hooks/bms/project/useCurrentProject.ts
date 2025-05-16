import { BlockModel } from '@notice-app/models'
import { useMemo } from 'react'

import { useCurrentWorkspace } from '../../api/useCurrentWorkspace'
import { useSearchParams } from '../../useSearchParams'
import { useProjects } from './useProjects'

export const useCurrentProject = () => {
	const [workspace] = useCurrentWorkspace()
	const projects = useProjects(workspace)
	const [params, setParams] = useSearchParams()

	const currentProject = useMemo(
		() => projects.data?.find((project) => project.id === params['project']),
		[projects.data, params['project']]
	)

	const setCurrentProject = (project: BlockModel.block) => {
		setParams({ project: project.id, page: project.id }, { replace: false })
	}

	return [currentProject, setCurrentProject] as const
}
