import { PageModel } from '@notice-app/models'
import { useQuery } from '@tanstack/react-query'

export const useEditorState = (page?: Pick<PageModel.node, 'id'>) => {
	const query = useQuery<'modified' | 'saving' | 'saved' | 'error'>(['slate-page-state', page?.id], () => {
		if (!page) return 'modified' as const
		return 'saved' as const
	})

	return query.data ?? 'saved'
}
