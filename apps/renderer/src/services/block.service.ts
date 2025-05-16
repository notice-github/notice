import { BMSBlockModel, BlockModel } from '@notice-app/models'
import { Filter, MongoDB } from '@notice-app/mongodb'
import { NCheckers, NIterators, NTime } from '@notice-app/tools'
import { I18n } from '@root/i18n'
import { Helpers } from '@root/tools/helpers.tool'
import _ from 'lodash'

export namespace BlockService {
	const EXCLUDED_FIELDS = ['preferences.contactFormEmail']

	type BlockBase = Pick<
		BMSBlockModel.block,
		'_id' | 'type' | 'rootId' | 'blockIds' | 'preferences' | 'colors' | 'layout'
	> & {
		defaultLanguage: string
		availableLanguages: string[]
	}

	export const getBlockBase = async (target: string, collection: typeof MongoDB.blocks = MongoDB.published_blocks) => {
		const query = buildTargetQuery(target)

		const base = await collection.findOne<BlockBase & { preferences?: any; data: any }>(query, {
			projection: {
				_id: 1,
				type: 1,
				rootId: 1,
				blockIds: 1,
				data: 1,
				preferences: 1,
				colors: 1,
				layout: 1,
			},
		})
		if (!base || base.type !== 'page') return undefined

		let preferences: Record<string, any> | undefined
		let colors: Record<string, any> | undefined
		let layout: Record<string, any> | undefined

		if (base._id !== base.rootId) {
			const rootBlock = await collection.findOne(
				{ _id: base.rootId },
				{
					projection: {
						data: 1,
						preferences: 1,
						colors: 1,
						layout: 1,
					},
				}
			)

			preferences = rootBlock.preferences
			colors = rootBlock.colors
			layout = rootBlock.layout
			preferences.projectTitle ??= rootBlock.data.text
		} else {
			preferences = base.preferences
			colors = base.colors
			layout = base.layout
			preferences.projectTitle ??= base.data.text
		}

		base.preferences = preferences
		base.colors = colors
		base.layout = layout
		base.defaultLanguage = preferences?.defaultLanguage ?? 'en'
		base.availableLanguages = preferences?.availableLanguages ?? []

		return base
	}

	export const getBlock = async (
		base: BlockBase,
		lang: I18n.LanguageCode,
		collection: typeof MongoDB.blocks = MongoDB.published_blocks,
		enableSummary = true
	) => {
		const [[{ blocks, ...block }], pages] = await Promise.all([
			collection
				.aggregate<BMSBlockModel.block & { blocks: BMSBlockModel.block[] }>([
					{ $match: { _id: base._id } },
					{
						$graphLookup: {
							from: collection.collectionName,
							startWith: '$blockIds',
							connectFromField: 'blockIds',
							connectToField: '_id',
							as: 'blocks',
							restrictSearchWithMatch: { type: { $ne: 'page' } },
						},
					},
					{ $project: baseProjection('blocks') },
				])
				.toArray(),
			collection.find({ _id: { $in: base.blockIds }, type: 'page' }, { projection: baseProjection() }).toArray(),
		])

		// Required only for generating page summary
		// Maybe later, generate summary inside the metadata (page -> `metadata.summary`) at save time
		const pagesBlocks =
			pages.length > 0 && enableSummary
				? await collection
						.find(
							{ _id: { $in: pages.reduce<string[]>((acc, page) => acc.concat(page.blockIds), []) } },
							{ projection: baseProjection() }
						)
						.toArray()
				: []

		const blocksMap = new Map<string, BMSBlockModel.block>(
			[...blocks, ...pages, ...pagesBlocks].map((block) => [block._id, translateBlock(block, lang)])
		)

		return createGraph(translateBlock(block, lang), blocksMap)
	}

	export const getPageTree = async (
		base: BlockBase,
		lang: I18n.LanguageCode,
		collection: typeof MongoDB.blocks = MongoDB.published_blocks
	) => {
		const [{ blocks, ...rootBlock }] = await collection
			.aggregate<BMSBlockModel.block & { blocks: BMSBlockModel.block[] }>([
				{ $match: { _id: base.rootId } },
				{
					$graphLookup: {
						from: collection.collectionName,
						startWith: '$blockIds',
						connectFromField: 'blockIds',
						connectToField: '_id',
						as: 'blocks',
						restrictSearchWithMatch: { $or: [{ type: 'page' }, { 'data.isSection': true }] },
					},
				},
				{ $project: baseProjection('blocks') },
			])
			.toArray()

		// TODO: we could just iterate once over the blocks to create both mappings and filter it
		const blocksMap = new Map<string, BMSBlockModel.block>(
			blocks.map((block) => [block._id, translateBlock(block, lang)])
		)

		const slugMapping = new Map<string, string>(
			[rootBlock, ...blocks]
				.filter((block) => block.type === 'page' && block.metadata?.slug != undefined)
				.map((block) => [block.metadata.slug, block._id])
		)

		const pageTree = createGraph(translateBlock(rootBlock, lang), blocksMap)

		return { ...mergePageSection(pageTree), slugMapping, blocksMap }
	}

	export const getBlocks = async (
		base: BlockBase,
		lang: I18n.LanguageCode,
		collection: typeof MongoDB.blocks = MongoDB.published_blocks,
		filter?: { type?: BlockModel.types },
		pagination?: { limit: number; offset: number }
	) => {
		let blocks = await collection
			.find({ _id: { $in: base.blockIds }, ...filter }, { projection: baseProjection() })
			.toArray()

		blocks.sort((a, b) => base.blockIds.indexOf(a._id) - base.blockIds.indexOf(b._id))

		if (pagination) blocks = blocks.slice(pagination.offset, pagination.limit)

		return blocks.map((block) => translateBlock(block, lang))
	}

	export const getTree = async (
		base: BlockBase,
		lang: I18n.LanguageCode,
		collection: typeof MongoDB.blocks = MongoDB.published_blocks
	) => {
		const [{ blocks, ...block }] = await collection
			.aggregate<BMSBlockModel.block & { blocks: BMSBlockModel.block[] }>([
				{ $match: { _id: base._id } },
				{
					$graphLookup: {
						from: collection.collectionName,
						startWith: '$blockIds',
						connectFromField: 'blockIds',
						connectToField: '_id',
						as: 'blocks',
					},
				},
				{ $project: baseProjection('blocks') },
			])
			.toArray()

		const blocksMap = new Map<string, BMSBlockModel.block>(
			blocks.map((block) => [block._id, translateBlock(block, lang)])
		)

		return createGraph(translateBlock(block, lang), blocksMap)
	}

	/**
	 * Retrieves a single block from the MongoDB collection.
	 *
	 * @param target - The target identifier of the block.
	 * @returns A promise that resolves to the retrieved block.
	 */
	export const getOne = async (target: string) => {
		const query = buildTargetQuery(target)
		return await MongoDB.published_blocks.findOne(query)
	}

	/**
	 * Retrieve multiple blocks based on filters
	 *
	 * @param options Query options to filter blocks
	 * @returns Array of blocks found
	 */
	export const getMultiple = async (options: { rootId?: string; type?: BlockModel.types; isRoot?: boolean }) => {
		return await MongoDB.published_blocks
			.find({ ...options })
			.limit(256)
			.toArray()
	}

	/**
	 * @deprecated
	 */
	export const getPagesOLD = async (blockId: string) => {
		const [block] = await MongoDB.published_blocks
			.aggregate([
				{
					$match: { _id: blockId },
				},
				{
					$graphLookup: {
						from: MongoDB.published_blocks.collectionName,
						startWith: '$blockIds',
						connectFromField: 'blockIds',
						connectToField: '_id',
						as: 'blocks',
						restrictSearchWithMatch: { type: { $in: ['page', 'header-1', 'header-2', 'header-3', 'paragraph'] } },
						maxDepth: 2,
					},
				},
				{
					$project: { 'blocks.preferences': 0 },
				},
			])
			.toArray()

		if (!block) return []

		const blocks = block.blocks as BMSBlockModel.block[]

		const pages = blocks
			.filter((block) => block.type === 'page')
			.sort((a, b) => block.blockIds.indexOf(a._id) - block.blockIds.indexOf(b._id))

		for (let page of pages) {
			const texts = blocks.filter((block) => page.blockIds.includes(block._id))
			const summary = createSummary(texts)
			page.metadata ??= {}
			page.metadata.summary = summary
		}

		return pages
	}

	export const getPages = async (base: BlockBase, lang: I18n.LanguageCode, enableSummary: boolean = true) => {
		const pages = await MongoDB.published_blocks
			.find({
				_id: { $in: base.blockIds },
				type: 'page',
				$or: [
					{ 'metadata.datePublished': { $lte: NTime.now().toISOString().split('T')[0] } },
					{ 'metadata.datePublished': { $exists: false } },
					{ 'metadata.datePublished': null },
				],
			})
			.sort('metadata.datePublished', -1)
			.toArray()

		if (enableSummary) {
			const childBlocks: string[] = []

			for (let page of pages) {
				if (page.metadata?.summary) continue
				childBlocks.push(...page.blockIds)
			}

			const blocks = (await MongoDB.published_blocks.find({ _id: { $in: childBlocks } }).toArray()).map((block) =>
				translateBlock(block, lang)
			)
			const blocksMap = new Map<string, BMSBlockModel.block>(blocks.map((block) => [block._id, block]))

			for (let page of pages) {
				if (page.metadata?.summary) continue
				const texts = page.blockIds.map((id) => blocksMap.get(id)).filter((block) => block.data?.leaves)
				const summary = createSummary(texts)
				page.metadata ??= {}
				page.metadata.summary = summary
			}
		}

		return pages.map((page) => translateBlock(page, lang))
	}

	/**
	 * Creates a summary from an array of texts.
	 * @param texts - The array of texts to create the summary from.
	 * @returns The summary string.
	 */
	export const createSummary = (texts: any[]) => {
		let summary = ''

		for (let text of texts) {
			const leaves: { text: string }[] = text.data?.leaves ?? text.children
			const words = leaves
				.reduce((acc, leaf) => acc + leaf.text, '')
				.split(/\s+/)
				.filter((word) => word !== '')

			for (let word of words) {
				if (summary.length + word.length > 197) {
					return summary + '...'
				} else {
					summary += (summary.length > 0 ? ' ' : '') + word
				}
			}
		}

		return summary
	}

	/**
	 * Exports a block from BMSBlockModel to BlockModel format.
	 *
	 * @param block The BMS block to be exported.
	 * @returns The exported block in BlockModel format.
	 */
	export const exportBlock = (block: BMSBlockModel.block): BlockModel.block => {
		return _.cloneDeep({
			id: block._id,
			type: block.type,
			data: block.data,
			metadata: block.metadata,
			preferences: block.preferences,
			colors: block.colors,
			layout: block.layout,
			userCode: block.userCode,
			blockIds: block.blockIds.filter((block) => block != null),
			workspaceId: block.workspaceId,
			rootId: block.rootId,
			isRoot: block.isRoot,
		})
	}

	/**
	 * Exports a graph from `BMSBlockModel` format to `BlockModel` format.
	 *
	 * @param graph The graph in `BMSBlockModel.graph` format.
	 * @returns The exported graph in `BlockModel.graph` format.
	 */
	export const exportGraph = (graph: BMSBlockModel.graph): BlockModel.graph => {
		return NIterators.mapGraph(graph, (block) =>
			_.cloneDeep({
				id: block._id,
				type: block.type,
				data: block.data,
				preferences: block.preferences,
				colors: block.colors,
				layout: block.layout,
				userCode: block.userCode,
				metadata: block.metadata,
				workspaceId: block.workspaceId,
				rootId: block.rootId,
				isRoot: block.isRoot,
			})
		)
	}

	//------------------//
	// Helper Functions //
	//------------------//

	const createGraph = (
		block: BMSBlockModel.block,
		blocksMap: Map<string, BMSBlockModel.block>
	): BMSBlockModel.graph => {
		const blocks: BMSBlockModel.graph[] = []

		for (let blockId of block.blockIds) {
			const block = blocksMap.get(blockId)

			if (block == null) continue

			if (block.blockIds.length <= 0) {
				blocks.push({ ...block, blocks: [] })
			} else {
				blocks.push(createGraph(block, blocksMap))
			}
		}

		return { ...block, blocks: blocks }
	}

	export const baseProjection = (aggregate?: string) => {
		return EXCLUDED_FIELDS.reduce(
			(acc, field) => ({ ...acc, [field]: 0, ...(aggregate ? { [`${aggregate}.${field}`]: 0 } : {}) }),
			{}
		)
	}

	const translateBlock = (block: BMSBlockModel.block, lang: I18n.LanguageCode) => {
		const { lang: translations, ...translatedBlock } = structuredClone(block)
		translatedBlock.data = translations?.[lang]?.data ?? translatedBlock.data
		return translatedBlock
	}

	const mergePageSection = (pageTree: BMSBlockModel.graph) => {
		let currentSection: BMSBlockModel.block | undefined

		for (let block of pageTree.blocks) {
			if (block.data.isSection === true) {
				currentSection = block
				pageTree.blocks = pageTree.blocks.filter((b) => b._id !== block._id)
			} else if (block.type === 'page') {
				if (currentSection != undefined) {
					block.metadata.section = Helpers.leavesToText(currentSection.data.leaves)
				}
				block.blocks = mergePageSection(block).blocks
			}
		}

		return pageTree
	}

	const buildTargetQuery = (target: string): Filter<typeof MongoDB.blocks & { _id: string }> => {
		if (NCheckers.isUUID(target)) return { _id: target }
		else if (target.includes('.')) return { 'preferences.customDomain': target }
		else return { $or: [{ 'metadata.slug': target }, { 'preferences.domain': target }] }
	}
}
