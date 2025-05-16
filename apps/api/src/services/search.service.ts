import { BlockModel, BMSBlockModel, SearchModel } from '@notice-app/models'
import _ from 'lodash'

export namespace SearchService {
	const NON_INDEXABLE_BLOCKS: BlockModel.types[] = [
		'bulleted-list',
		'numbered-list',
		'divider',
		'embed',
		'html',
		'javascript',

		// We will add those blocks to the indexing if there are requested by the users
		'code',
		'image',
		'video',
		'audio',
		'table',
	]

	const dataToContent = (type: BlockModel.types, data?: BlockModel.data | null): string => {
		switch (type) {
			case 'paragraph':
			case 'quote':
			case 'hint':
			case 'list-item':
			case 'checkbox':
			case 'header-1':
			case 'header-2':
			case 'header-3':
				return data?.leaves?.reduce((acc: string, curr: { text: string }) => acc + curr.text, '') ?? ''
			case 'page':
				return data?.text ?? ''
			case 'expandable':
				return data?.title ?? ''
			default:
				return ''
		}
	}

	const findPage = (blockId: string, blocksMap: Map<string, BMSBlockModel.block & { parentId?: string }>) => {
		let block = blocksMap.get(blockId)
		if (!block) return

		while (block.type !== 'page') {
			if (!block.parentId) return
			block = blocksMap.get(block.parentId)
			if (!block) return
		}

		return block
	}

	const findContext = (blockId: string, blocksMap: Map<string, BMSBlockModel.block & { parentId?: string }>) => {
		let block = blocksMap.get(blockId)
		if (!block) return

		let iter = 0
		while (true) {
			if (!block.parentId) return
			const parent = blocksMap.get(block.parentId)
			if (!parent) return

			const topNeighborIds = parent.blockIds.slice(0, parent.blockIds.indexOf(block._id)).reverse()
			for (let neighborId of topNeighborIds) {
				const neighbor = blocksMap.get(neighborId)
				if (!neighbor) continue

				if (['header-1', 'header-2', 'header-3'].includes(neighbor.type)) {
					return neighbor
				}
			}

			if (['expandable', 'page'].includes(parent.type)) {
				return parent
			}

			block = parent

			// Just a little security in the case of a (impossible) reference loop
			if (iter++ > 42) return
		}
	}

	const blockToDocuments = (
		block: BMSBlockModel.block,
		prefs: { availableLanguages: BlockModel.langs[]; defaultLanguage: BlockModel.langs },
		blocksMap: Map<string, BMSBlockModel.block & { parentId?: string }>
	) => {
		if (NON_INDEXABLE_BLOCKS.includes(block.type)) return []

		prefs.availableLanguages ??= []
		prefs.defaultLanguage ??= 'en'

		const documents: SearchModel.block[] = []

		const langs = new Set(block.lang != null && typeof block.lang === 'object' ? Object.keys(block.lang) : [])

		// Delete the default lang to secure the data from duplicates
		langs.delete(prefs.defaultLanguage)

		// Delete all untranslated langs
		for (let lang of langs) {
			if (!block.lang?.[lang]?.data) langs.delete(lang)
		}

		const page = findPage(block._id, blocksMap) ?? block
		const context = findContext(block._id, blocksMap) ?? block

		const content = dataToContent(block.type, block.data)
		if (content.trim() !== '') {
			documents.push({
				id: `${block._id}__default`,
				type: block.type,
				content: content,
				data: block.data,
				pageId: page._id,
				contextId: context._id,
				langs: [prefs.defaultLanguage, ...prefs.availableLanguages].filter((lang) => !langs.has(lang)),
				blockId: block._id,
				rootId: block.rootId,
				workspaceId: block.workspaceId,
			})
		}

		for (let lang of langs) {
			const content = dataToContent(block.type, block.lang?.[lang]?.data)
			if (content.trim() !== '') {
				documents.push({
					id: `${block._id}__${lang}`,
					type: block.type,
					content: content,
					data: block.lang![lang].data,
					pageId: page._id,
					contextId: context._id,
					langs: [lang],
					blockId: block._id,
					rootId: block.rootId,
					workspaceId: block.workspaceId,
				})
			}
		}

		return documents
	}

	const mapBlocksWithParent = (parent: BMSBlockModel.block, blocks: BMSBlockModel.block[]) => {
		const blocksMap = new Map<string, BMSBlockModel.block & { parentId?: string }>(
			blocks.map((block) => [block._id, block])
		)

		const injectParent = (parent: BMSBlockModel.block) => {
			for (let blockId of parent.blockIds) {
				const block = blocksMap.get(blockId)
				if (block == null) continue

				blocksMap.set(blockId, { ...block, parentId: parent._id })

				if (block.blockIds.length > 0) injectParent(block)
			}
		}

		injectParent(parent)

		return blocksMap
	}

	const getOptimizedOperations = (newDocs: SearchModel.block[], oldDocs: SearchModel.block[]) => {
		const newDocsMap = new Map<string, SearchModel.block>(newDocs.map((doc) => [doc.id, doc]))
		const oldDocsMap = new Map<string, SearchModel.block>(oldDocs.map((doc) => [doc.id, doc]))

		const updates = newDocs.filter((doc) => !_.isEqual(doc, oldDocsMap.get(doc.id)))
		const deletions = oldDocs.filter((doc) => !newDocsMap.has(doc.id))

		return [updates, deletions.map((doc) => doc.id)] as const
	}
}
