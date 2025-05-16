import { useMemo } from 'react'
import { BlockModel } from '@notice-app/models'

import { usePagesBlocks } from './usePages'
import { useSearchParam } from '../../useSearchParam'
import { useCurrentProject } from '../project/useCurrentProject'

export const useCurrentPage = () => {
	const [project] = useCurrentProject()
	const blocks = usePagesBlocks(project?.id)
	const [value, setValue] = useSearchParam('page')

	const currentPage = useMemo(() => {
		if (value == null) return undefined
		else if (project?.id === value) return project
		else return blocks.get(value)
	}, [project, blocks, value])

	const setCurrentPage = (page: BlockModel.block) => {
		setValue(page.id, { replace: false })
	}

	return [currentPage, setCurrentPage] as const
}
