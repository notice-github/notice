import { BlockModel, BMSBlockModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { NCheckers, NObjects, NSystem, NTime } from '@notice-app/tools'
import { BlockService } from './block.service'
import { MetadataService } from './metadata.service'

export namespace PublishedBlockService {
	export const getOne = async (idOrDomain: string) => {
		let query

		if (NCheckers.isUUID(idOrDomain)) query = { _id: idOrDomain }
		else if (!idOrDomain.includes('.')) query = { 'preferences.domain': idOrDomain }
		else if (idOrDomain.includes('.mynotice.io')) {
			query = { 'preferences.domain': idOrDomain.replace('.mynotice.io', '') }
		} else if (idOrDomain.includes('.notice.site')) {
			query = { 'preferences.domain': idOrDomain.replace('.notice.site', '') }
		} else {
			query = { 'preferences.customDomain': idOrDomain }
		}

		const block = await MongoDB.published_blocks.findOne(
			query,
			// Exclude contactFormEmail because it's a non-public data
			{ projection: { 'preferences.contactFormEmail': 0 } }
		)
		if (block == null) return null

		return block
	}

	export function filterTree(obj: any) {
		const filteredObj = {
			id: obj._id,
			blocks: obj.blocks.map((block: any) => filterTree(block)),
			data: obj.data,
			type: obj.type,
		}

		return filteredObj
	}

	export const getPage = async (
		idOrDomain: string,
		lang?: BlockModel.langs | null
	): Promise<BlockModel.page | null> => {
		const block = await getOne(idOrDomain)
		if (block == null) return null

		// get the page graph that stops at page blocks
		const graph = await BlockService.getGraph(block._id, MongoDB.published_blocks, undefined, undefined, lang, false)

		// get the tree of pages from the root block, including the top level block
		// include headers so we can display them
		const tree = await BlockService.getGraph(block.rootId, MongoDB.blocks, undefined, {
			type: { $in: ['page', 'header-1', 'header-2', 'header-3'] },
		})

		if (graph == null || tree == null) return null

		const page: BlockModel.page = {
			...BlockService.exportGraph(graph),
			preferences: tree.preferences,
			colors: tree.colors,
			layout: tree?.layout ?? {},
			userCode: tree?.userCode ?? {
				CSS: '',
				JS: '',
				HEAD: '',
			},
		}

		const filteredJSON = filterTree(tree)
		page['projectTree'] = filteredJSON

		return page
	}

	// Service called by the BDN
	export const getRecursive = async (idOrDomain: string, lang?: BlockModel.langs | null) => {
		const block = await getOne(idOrDomain)
		if (block == null) return null

		const graph = await BlockService.getGraph(block._id, MongoDB.published_blocks, undefined, undefined, lang, false)
		if (graph == null) return null

		return graph
	}

	export const getState = async (id: string) => {
		const aggregate = (col: string) => [
			{ $match: { _id: id } },
			{
				$graphLookup: {
					from: col,
					startWith: '$blockIds',
					connectFromField: 'blockIds',
					connectToField: '_id',
					as: 'blocks',
				},
			},
			{
				$project: {
					blockUpdatedAt: '$updatedAt',
					blocksLastUpdatedAt: { $max: '$blocks.updatedAt' },
				},
			},
		]

		const [[block], [publishedBlock]] = await Promise.all([
			MongoDB.blocks.aggregate(aggregate('blocks')).toArray(),
			MongoDB.published_blocks.aggregate(aggregate('published_blocks')).toArray(),
		])

		if (block == null) return 'block_not_found'
		if (publishedBlock == null) return 'not_published'

		const lastUpdate = NTime.$from(Math.max(block.blockUpdatedAt, block.blocksLastUpdatedAt))
		const lastPublish = NTime.$from(Math.max(publishedBlock.blockUpdatedAt, publishedBlock.blocksLastUpdatedAt))

		if (lastUpdate.isAfter(lastPublish)) return 'out_of_date'
		else return 'up_to_date'
	}

	/**
	 * Partially updates a block in the database.
	 *
	 * @param id The id of the block to be updated.
	 * @param block The block data to update.
	 */
	export const update = async (id: string, block: Partial<Omit<BlockModel.block, 'id'>>) => {
		const currentBlock = await MongoDB.published_blocks.findOne({ _id: id }, { projection: { type: 1 } })
		if (!currentBlock) return

		let updates: any = { ...block }

		if (currentBlock.type === 'page' && block.data?.text) {
			const slug = MetadataService.generatePageSlug(id, block.data.text)
			if (slug) {
				updates.metadata ??= {}
				updates.metadata.slug = slug
			}
		}

		updates.updatedAt = NTime.now()
		updates = NObjects.dotify(updates)

		for (let key in updates) {
			const value = updates[key]
			updates[key] = { $ifNull: [value, value] }
		}

		await MongoDB.published_blocks.updateOne({ _id: id }, [{ $set: { ...updates } }])
	}

	export const publish = async (rootId: string, blocks: BMSBlockModel.block[]) => {
		await MongoDB.published_blocks.deleteMany({ rootId: rootId })

		await NSystem.sleep(1000) // Just to be sure MongoDB replicates has been informed of the deletion

		await MongoDB.published_blocks.insertMany(blocks, { ordered: false })
	}

	export const unpublish = async (id: string) => {
		const blocks = await BlockService.getRawGraphToBlocks(id, MongoDB.published_blocks)
		if (blocks == null) return []

		await MongoDB.published_blocks.deleteMany({
			_id: { $in: blocks.map((block: any) => block._id) },
		})

		return blocks
	}
}
