import { BlockModel } from '@notice-app/models'
import { BlockSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'

import dayjs from 'dayjs'
import { NLanguages } from '../../../utils/languages'
import { BMS, queryClient } from '../../../utils/query'
import { useCurrentPage } from '../page/useCurrentPage'

export const useMarkCompleteLang = (langCode: NLanguages.LANGUAGE_CODES_TYPE) => {
	const [page] = useCurrentPage()

	const mutation = useMutation<
		void,
		unknown,
		BlockSchema.updateOne['bodyIn'] & {
			block: BlockModel.block
			complete?: boolean
		}
	>(
		async ({ block, complete = true }) => {
			await BMS.patch(`/translation/${block.id}/complete?lang=${langCode}&complete=${complete}`)
		},
		{
			onMutate: (vars) => {
				const { block, complete } = vars
				if (!page) return
				queryClient.setQueryData(['slate-value', page.id, langCode], (val: any) => {
					if (!val) return val

					const clone = structuredClone(block)

					if (val.id === block.id) {
						const completedAt = complete ? dayjs().utc().toDate() : undefined

						return { ...val, metadata: { ...clone.metadata, completedAt } }
					}

					const newChildren = val.children.map((b: BlockModel.block) => {
						if (block && b.id === block.id) {
							const completedAt = complete ? dayjs().utc().toDate() : undefined
							clone.metadata = clone.metadata ? { ...clone.metadata, completedAt } : { completedAt }

							return clone
						}
						return structuredClone(b)
					})

					return { ...val, children: structuredClone(newChildren) }
				})
			},
			onError: () => {
				// queryClient.setQueryData<BlockModel.block[]>(['pages', vars.workspace.id], (pages) =>
				// 	pages ? pages.map((page) => (page.id === vars.page.id ? structuredClone(vars.page) : page)) : undefined
				// )
			},
			onSuccess: () => {
				if (!page) return
				queryClient.invalidateQueries(['slate-page-value', page.id, langCode])
			},
		}
	)

	return mutation
}
