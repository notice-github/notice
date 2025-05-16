// import { useMemo } from 'react'
// import { BlockModel } from '@notice-app/models'

// import { queryClient } from '../utils/query'
// import { usePages } from './bms/usePages'
// import { useSearchParam } from './useSearchParams'
// import { useCurrentWorkspace } from './useCurrentWorkspace'

// export const useCurrentPage = () => {
// 	const [workspace] = useCurrentWorkspace()
// 	const pages = usePages(workspace)
// 	const [value, setValue] = useSearchParam('page')

// 	const currentPage = useMemo(() => findPage(pages.data, value), [pages.data, value])

// 	const setCurrentPage = (page: BlockModel.block | string) => {
// 		if (typeof page === 'string') setValue(page)
// 		else setValue(page.id)
// 	}

// 	return [currentPage, setCurrentPage] as const
// }

// const findPage = (pages: BlockModel.block[] | undefined, id: string | null): BlockModel.block | undefined => {
// 	if (pages == undefined || id == null) return undefined

// 	for (const page of pages) {
// 		if (page.id === id) return page

// 		const subPages = queryClient.getQueryData<BlockModel.block[]>(['sub-pages', page.id])
// 		const found = findPage(subPages, id)
// 		if (found) return found
// 	}
// }
