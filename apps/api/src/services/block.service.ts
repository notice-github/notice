import { BlockModel, BMSBlockModel, UserModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { NIterators, NObjects, NTime } from '@notice-app/tools'
import { randomUUID } from 'crypto'
import _ from 'lodash'
import { BlockSchema } from '../schemas/block.schema'
import { MetadataService } from './metadata.service'
import { TranslationService } from './translation.service'

interface QueryOptions {
	workspaceId?: string
	type?: BlockModel.types | { $ne: BlockModel.types } | { $in: BlockModel.types[] }
	isRoot?: boolean
	rootId?: string
	isTemplate?: boolean
	isDeleted?: boolean | null
	ids?: string[]
}

const computeOptions = (options?: QueryOptions | null) => {
	const { isDeleted, ids, isRoot, ...result } = (options ?? {}) as any

	switch (options?.isDeleted) {
		case true:
		case false:
			result.deletedAt = { $exists: options.isDeleted }
			break
		case undefined:
			result.deletedAt = { $exists: false }
			break
	}

	if (options?.ids != null) {
		result._id = { $in: options.ids }
	}

	if (options?.isRoot != null) {
		if (options.isRoot) result.isRoot = true
		else result.isRoot = { $exits: 0 }
	}

	return result
}

export namespace BlockService {
	/**
	 * Check if a block with a specified ID exists
	 *
	 * @param id ID of the block to check
	 * @param options Optional query options to filter blocks
	 * @returns Boolean indicating whether a block with the specified ID exists
	 */
	export const exists = async (id: string, options?: QueryOptions) => {
		options = computeOptions(options)

		const block = await MongoDB.blocks.findOne({ _id: id, ...options }, { projection: { _id: 1 } })
		return block != null
	}

	/**
	 * Retrieve a single block based on its ID
	 *
	 * @param id ID of the block to retrieve
	 * @param options Optional query options to filter blocks
	 * @returns Found block, or null if not found
	 */
	export const getOne = async (id: string, options?: QueryOptions): Promise<BMSBlockModel.block | null> => {
		options = computeOptions(options)

		return await MongoDB.blocks.findOne({ _id: id, ...options })
	}

	/**
	 * Retrieves a block by domain.
	 *
	 * @param domain - The domain to search for.
	 * @param options Optional query options to filter block
	 * @returns Found block, or null if not found
	 */
	export const getByDomain = async (domain: string, options?: QueryOptions): Promise<BMSBlockModel.block | null> => {
		options = computeOptions(options)

		return await MongoDB.blocks.findOne({
			$or: [{ 'preferences.domain': domain }, { 'preferences.customDomain': domain }],
			...options,
		})
	}

	/**
	 * Retrieve multiple blocks based on filters
	 *
	 * @param options Query options to filter blocks
	 * @returns Array of blocks found
	 */
	export const getMultiple = async (options: QueryOptions) => {
		options = computeOptions(options)

		return await MongoDB.blocks
			.find({ ...options })
			.limit(256)
			.toArray()
	}

	/**
	 * Find the block in the DB with all children and returns it
	 * @param id Block ID
	 * @returns Block & Children (`block.blocks`)
	 */
	export const getRawGraph = async (
		id: string,
		collection: typeof MongoDB.blocks,
		options?: QueryOptions,
		lookupOptions?: Pick<QueryOptions, 'type'>
	) => {
		options = computeOptions(options)

		const [block] = await collection
			.aggregate([
				{
					$match: { _id: id, ...options },
				},
				{
					$graphLookup: {
						from: collection.collectionName,
						startWith: '$blockIds',
						connectFromField: 'blockIds',
						connectToField: '_id',
						as: 'blocks',
						...(lookupOptions != null ? { restrictSearchWithMatch: { ...lookupOptions } } : undefined),
					},
				},
				...(collection.collectionName === 'published_blocks'
					? [
							{
								$project: { 'preferences.contactFormEmail': 0 },
							},
					  ]
					: []),
			])
			.toArray()

		if (block == null) return null

		return block as BMSBlockModel.block & { blocks: BMSBlockModel.block[] }
	}

	/**
	 * Find the block in the DB with all children and returns it in the same array
	 * @param id Block ID
	 * @returns Block & Children (`block.blocks`)
	 */
	export const getRawGraphToBlocks = async <T>(
		id: string,
		collection: typeof MongoDB.blocks,
		options?: QueryOptions,
		lookupOptions?: QueryOptions
	): Promise<BMSBlockModel.block[] | null> => {
		const rawGraph = await getRawGraph(id, collection, options, lookupOptions)
		if (rawGraph == null) return null

		const { blocks, ...data } = rawGraph

		return [data, ...blocks]
	}

	/**
	 * Find the block with all his children recursively and returns it
	 * @param id Block ID
	 * @returns Graph or null
	 */
	export const getGraph = async (
		id: string,
		collection: typeof MongoDB.blocks,
		options?: QueryOptions,
		lookupOptions?: QueryOptions,
		langCode?: string | null,
		injectMetadata: boolean = true
	): Promise<BMSBlockModel.graph | null> => {
		// TODO: for the moment the request fetch all languages,
		// we need to filter by language in the mongodb query by using distinct()
		// from my understanding, it requires us to specify all the fields we want and
		// it's a bit tedious, see https://stackoverflow.com/questions/5301795/get-specific-part-of-document
		const rawGraph = await getRawGraph(id, collection, options, lookupOptions)
		if (rawGraph == null) return null

		// An hash map used to optimize the children loop and inject requested lang
		const blocksMap = new Map<string, BMSBlockModel.block>(
			(rawGraph.blocks ?? []).map((block: BMSBlockModel.block) => {
				const newBlock = langCode
					? TranslationService.overrideDefaultBlockByLang(block, langCode, injectMetadata)
					: block

				return [block._id, newBlock]
			})
		)

		// parent has a special treatment since it does not go through the blocksMap iteration
		if (langCode) {
			const parentLangData = _.get(rawGraph, `lang.${langCode}.data`)
			rawGraph.metadata = {
				...rawGraph.metadata,
				completedAt: _.get(rawGraph, `lang.${langCode}.completedAt`),
				updatedAt: rawGraph.updatedAt,
			}
			if (parentLangData) {
				rawGraph.data = { ...parentLangData }
			}
		}

		rawGraph.blocks = []

		return createGraph(rawGraph, blocksMap)
	}

	/**
	 * Retrieve the parent of the block with the given id.
	 *
	 * @param id ID of the block to retrieve
	 * @param options Optional query options to filter blocks
	 * @returns Found parent block, or null if not found
	 */
	export const getParent = async (id: string, options?: QueryOptions): Promise<BMSBlockModel.block | null> => {
		options = computeOptions(options)

		return await MongoDB.blocks.findOne({ blockIds: id, ...options })
	}

	/**
	 * Create a block graph from `blocksMap` attached to `block`
	 * @param block Block
	 * @param blocksMap Mapping of ID and Block
	 * @returns Block Graph
	 */
	export const createGraph = (
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

	/**
	 * Insert a copy of `graph` attached to `newParent`
	 * @param graph Block Graph
	 * @param newParent Block
	 * @returns List of children
	 */
	export const insertGraphIntoNewParent = async (graph: BMSBlockModel.graph, newParent: BMSBlockModel.block) => {
		const newBlocks = new Map<string, BMSBlockModel.block>()

		NIterators.walkGraph(graph, (block, parent) => {
			if (parent == null) {
				newBlocks.set(block._id, {
					...newParent,
					createdAt: NTime.now(),
					updatedAt: NTime.now(),
					blockIds: [],
				})
				return
			}

			const { blocks, ...data } = block

			const newBlock: BMSBlockModel.block = {
				...data,
				_id: MongoDB.uuid(),
				blockIds: [],
				createdAt: NTime.now(),
				updatedAt: NTime.now(),
				workspaceId: newParent.workspaceId,
				rootId: newParent.rootId,
			}

			if (parent != null && newBlocks.has(parent?._id)) {
				newBlocks.get(parent._id)!.blockIds.push(newBlock._id)
			}

			newBlocks.set(block._id, newBlock)
		})

		let blocks = Array.from(newBlocks.values()).slice(1)
		if (blocks.length > 0) {
			blocks = blocks.map((block) => {
				if (block.type === 'page') {
					const slug = MetadataService.generatePageSlug(block._id, block.data.text)
					if (slug) block.metadata.slug = slug
				}
				return block
			})
			await MongoDB.blocks.insertMany(blocks, { ordered: false })
		}

		return newBlocks.get(graph._id) ?? newParent
	}

	/**
	 * Insert inside the DB a new block with all the properties of `data`
	 * @param data Block data
	 * @returns Block
	 */
	export const insertBlock = async (
		data: Omit<BlockModel.block, 'id' | 'rootId' | 'blockIds'> & { workspaceId?: string },
		options?: {
			parentId?: string | null
			neighborId?: string | null
			templateId?: string | null
			templateMode?: BlockSchema.createOne['body']['templateMode']
			contactFormEmail?: string | null
			hideBranding?: boolean
		},
		author?: UserModel.full
	) => {
		const parent: BMSBlockModel.block | null = options?.parentId != null ? await getOne(options.parentId) : null

		const workspaceId = (parent ?? data).workspaceId
		// Normally this never happens
		if (workspaceId == null) throw new Error('Missing workspaceId')

		const randomId = MongoDB.uuid()

		let block: BMSBlockModel.block = {
			_id: randomId,
			type: data.type,
			data: data.data,
			metadata: data.metadata,
			createdAt: NTime.now(),
			updatedAt: NTime.now(),
			workspaceId: workspaceId,
			isRoot: parent == null,
			blockIds: [],
			rootId: parent?.rootId ?? randomId,
			preferences: {
				...data?.preferences,
				contactFormEmail: options?.contactFormEmail ?? '',
			},
		}

		if (options?.templateId != null) {
			const templateGraph = await getGraph(options?.templateId, MongoDB.blocks, { type: block.type })

			if (templateGraph != null) {
				const { ...templateData } = templateGraph

				if (templateData?.preferences) {
					templateData.preferences.contactFormEmail = options?.contactFormEmail ?? ''
				}

				block = {
					...block,
					data: _.merge(templateData.data, block.data) ?? {},
					metadata: _.merge(templateData.metadata, block.metadata) ?? {},
					preferences: _.merge(templateData.preferences, block.preferences) ?? {},
					layout: _.merge(templateData.layout, block.layout) ?? {},
					userCode: _.merge(templateData.userCode, block.userCode) ?? {},
					colors: _.merge(templateData.colors, block.colors) ?? {},
				}

				if ((options?.templateMode ?? 'full') === 'full') {
					block = await insertGraphIntoNewParent(templateGraph, block)
				}

				delete block.preferences?.domain
				delete block.preferences?.hideNoticePoweredBy
			}
		}

		if (options?.hideBranding) {
			block.preferences ??= {}
			block.preferences.hideNoticePoweredBy = true
		} else {
			delete block.preferences?.hideNoticePoweredBy
		}

		if (block.type === 'page') {
			const slug = MetadataService.generatePageSlug(block._id, block.data.text)
			block.metadata.datePublished = NTime.now().toISOString().split('T')[0]
			block.metadata.dateModified = NTime.now().toISOString().split('T')[0]

			if (author) {
				block.metadata.author = {
					name: author.username,
					...(author.picture ? { picture: author.picture } : {}),
				}
			}

			if (slug) {
				block.metadata.slug = slug
			}

			if (block.isRoot) {
				const domain = MetadataService.generateRootDomain(block._id, block.data.text)
				block.preferences ??= {}
				block.preferences.domain = domain
			}
		}

		await MongoDB.blocks.insertOne(block)

		if (parent != null) await addChildToBlock(parent, block._id, options?.neighborId)

		return block
	}

	/**
	 * Add `childId` to the list of children of `parent`
	 *
	 * If `neighborId` is specified it will be positioned above `neighborId`
	 * else it will be positioned at the bottom of the list
	 * @param parent Parent Block
	 * @param childId Child ID
	 * @param neighborId Optional neighbor ID
	 */
	export const addChildToBlock = async (
		parent: BMSBlockModel.block,
		childId: string,
		neighborId?: string | null,
		// defaults to end of the list
		defaultPos = -1,
		// incrementing the position when we want to insert after a block
		incrementPos = 0
	) => {
		const position =
			(neighborId != null ? parent!.blockIds.findIndex((blockId) => blockId === neighborId) : defaultPos) + incrementPos

		const res = await MongoDB.blocks.findOneAndUpdate(
			{ _id: parent._id, blockIds: { $ne: childId } },
			{
				$push: {
					blockIds:
						position === -1
							? childId
							: {
									$each: [childId],
									$position: position,
							  },
				},
				$set: { updatedAt: NTime.now() },
			}
		)
		return res
	}

	/**
	 * Duplicate `graph` and insert all the new blocks
	 * @param graph Graph to duplicate
	 * @returns The new parent Block
	 */
	export const duplicate = async (graph: BMSBlockModel.graph) => {
		const newBlockId = MongoDB.uuid()
		const { blocks, ...data } = graph

		const newBlock = await insertGraphIntoNewParent(graph, {
			...data,
			_id: newBlockId,
			rootId: data.isRoot ? newBlockId : data.rootId,
		})

		delete newBlock.preferences?.domain

		if (newBlock.type === 'page') {
			const slug = MetadataService.generatePageSlug(newBlock._id, newBlock.data.text)
			if (slug) newBlock.metadata.slug = slug
		}

		await MongoDB.blocks.insertOne(newBlock)

		return newBlock
	}

	/**
	 * Partially updates a block in the database.
	 *
	 * @param id The id of the block to be updated.
	 * @param block The block data to update.
	 */
	export const update = async (id: string, block: Partial<Omit<BlockModel.block, 'id'>>) => {
		const currentBlock = await MongoDB.blocks.findOne({ _id: id }, { projection: { type: 1 } })
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

		await MongoDB.blocks.updateOne({ _id: id }, [{ $set: { ...updates } }])
	}

	/**
	 * Perform Create, Update, or Delete operations on all blocks within the `graph`
	 * based on the differences with the database.
	 *
	 * @param graph The graph to be saved.
	 * @param workspaceId The ID of the workspace the graph belongs to.
	 *
	 * @returns Resolves with `null` if the graph is not found.
	 */
	export const saveGraph = async (graph: BlockModel.graph) => {
		const oldBlocks = await getRawGraphToBlocks(graph.id, MongoDB.blocks, undefined, { type: { $ne: 'page' } })
		if (oldBlocks == null) return null
		const pages = await MongoDB.blocks.find({ _id: { $in: oldBlocks[0].blockIds }, type: 'page' }).toArray()

		oldBlocks.push(...pages)
		const oldBlocksMap = new Map<string, BMSBlockModel.block>(oldBlocks.map((block) => [block._id, block]))

		const newBlocks = flatGraph(graph)

		const newBlocksMap = new Map<string, BlockModel.block>(newBlocks.map((block) => [block.id, block]))

		const parent = oldBlocksMap.get(graph.id)
		if (parent == null) return null

		const blocksToCreate: BlockModel.block[] = []
		const blocksToUpdate: BlockModel.block[] = []
		const blocksToDelete: BMSBlockModel.block[] = []

		for (let newBlock of newBlocks) {
			if (!newBlock.id) newBlock.id = randomUUID()
			if (!newBlock?.metadata) newBlock.metadata = {}
			if (!oldBlocksMap.has(newBlock.id)) {
				if (newBlock.type === 'page') {
					newBlock.metadata.slug = MetadataService.generatePageSlug(newBlock.id, newBlock.data.text)
				}

				blocksToCreate.push(newBlock)
				continue
			}

			const oldBlock = oldBlocksMap.get(newBlock.id)!

			if (newBlock.id === graph.id) {
				newBlock.data = oldBlock.data
				newBlock.metadata = oldBlock.metadata

				if (graph.type === 'page') {
					newBlock.metadata.dateModified = new Date().toISOString().split('T')[0]
					newBlock.metadata.timeToRead = MetadataService.generateTimeToRead(graph)
					newBlock.metadata.slug = MetadataService.generatePageSlug(newBlock.id, newBlock.data.text)
				}
			} else {
				if (newBlock.type === 'page') {
					newBlock.blockIds = [...oldBlock.blockIds]
					newBlock.metadata.slug = MetadataService.generatePageSlug(newBlock.id, newBlock.data.text)
				}
			}

			// That allow to the metadata values to be updated, added but never removed
			newBlock.metadata = { ...oldBlock.metadata, ...newBlock.metadata }

			if (
				!_.isEqual(
					{ type: newBlock.type, data: newBlock.data, metadata: newBlock.metadata, blockIds: newBlock.blockIds },
					{ type: oldBlock.type, data: oldBlock.data, metadata: oldBlock.metadata, blockIds: oldBlock.blockIds }
				)
			) {
				blocksToUpdate.push(newBlock)
				continue
			}
		}

		for (let oldBlock of oldBlocksMap.values()) {
			if (!newBlocksMap.has(oldBlock._id)) {
				blocksToDelete.push(oldBlock)
				continue
			}
		}

		const mutations: Promise<any>[] = []

		// CREATE
		if (blocksToCreate.length > 0) {
			mutations.push(
				MongoDB.blocks.insertMany(
					blocksToCreate.map((block) => ({
						_id: block.id,
						type: block.type,
						data: block.data,
						metadata: block.metadata,
						createdAt: NTime.now(),
						updatedAt: NTime.now(),
						workspaceId: parent.workspaceId,
						blockIds: block.blockIds,
						rootId: parent.rootId,
					})),
					{ ordered: false }
				)
			)
		}

		// UPDATE
		if (blocksToUpdate.length > 0) {
			mutations.push(
				MongoDB.blocks.bulkWrite(
					blocksToUpdate.map((block) => {
						const { id, rootId, ...data } = block

						const updates: Partial<BMSBlockModel.block> = {
							...data,
							updatedAt: NTime.now(),
						}

						return {
							updateOne: {
								filter: { _id: id },
								update: { $set: { ...updates } },
							},
						}
					}),
					{ ordered: false }
				)
			)
		}

		// DELETE
		if (blocksToDelete.length > 0) {
			mutations.push(MongoDB.blocks.deleteMany({ _id: { $in: blocksToDelete.map((block) => block._id) } }))
		}

		await Promise.all(mutations)
	}

	/**
	 * Hard deletes the block in the graph by removing all references to it.
	 *
	 * @param id The ID of the block to delete.
	 */
	export const hardDeleteInGraph = async (id: string) => {
		// Unlink block from parent
		const parents = await MongoDB.blocks.find({ blockIds: id }).toArray()
		if (parents.length > 0) {
			await MongoDB.blocks.updateMany(
				{ _id: { $in: parents.map((p) => p._id) } },
				{ $pull: { blockIds: id }, $set: { updatedAt: NTime.now() } }
			)
		}

		// Delete block and all its blockIds
		const block = await getRawGraph(id, MongoDB.blocks, { isDeleted: null })
		if (block == null) return
		await MongoDB.blocks.deleteMany({ _id: { $in: [...block.blocks.map((fb: any) => fb._id), id] } })
	}

	/**
	 * Soft deletes (`block.deletedAt = new Date()`) a block and all its sub-blocks in a graph.
	 *
	 * @param id The id of the block to be soft deleted.
	 */
	export const softDeleteInGraph = async (id: string) => {
		const block = await getRawGraph(id, MongoDB.blocks)
		if (block == null) return

		await MongoDB.blocks.updateMany(
			{ _id: { $in: [block._id, ...block.blocks.map((b) => b._id)] } },
			{ $set: { deletedAt: NTime.now() }, $unset: { 'metadata.slug': 1 } }
		)
	}

	/**
	 * Restore a block in the graph and all its sub-blocks.
	 *
	 * @param id The id of the block to restore.
	 */
	export const restoreInGraph = async (id: string) => {
		const block = await getRawGraph(id, MongoDB.blocks, { isDeleted: true })
		if (block == null) return

		await MongoDB.blocks.bulkWrite(
			[block, ...block.blocks].map((block) => {
				let slug: string | undefined
				if (block.type === 'page') slug = MetadataService.generatePageSlug(block._id, block.data.text)

				return {
					updateOne: {
						filter: { _id: block._id },
						update: { $unset: { deletedAt: 1 }, ...(slug ? { $set: { 'metadata.slug': slug } } : {}) },
					},
				}
			})
		)
	}

	/**
	 * Move a block inside `oldParentId` to `newParentId` and above `newNeighborId`
	 *
	 * @param id The id of the block to reorder.
	 * @param body.oldParentId Id of the block's current parent block
	 * @param body.newParentId Id of the block's new parent block
	 * @param body.newNeighborId Id of the new neighbor block
	 * @returns
	 */
	export const reorder = async (
		id: string,
		{ oldParentId, newParentId, newNeighborId }: BlockSchema.reorder['body']
	): Promise<Array<string> | undefined> => {
		// Remove block from the list of the `oldParentId`
		const oldParent = await getOne(oldParentId)
		if (oldParent == null) return

		if (!oldParent.blockIds.includes(id)) return

		await MongoDB.blocks.updateOne({ _id: oldParentId }, { $pull: { blockIds: id }, $set: { updatedAt: NTime.now() } })

		// Place block at the correct index of the list of the `newParentId`
		const newParent = await getOne(newParentId)
		if (newParent == null) return

		const res = await addChildToBlock(newParent, id, newNeighborId, -1, 1)

		return res?.value?.blockIds ?? undefined
	}

	/**
	 * Flattens a graph of blocks into a one-dimensional array of blocks.
	 *
	 * @param graph The graph of blocks to be flattened.
	 * @returns The flattened array of blocks.
	 */
	export const flatGraph = (graph: BlockModel.graph): BlockModel.block[] => {
		const { blocks, ...data } = graph

		if (blocks == null || blocks.length === 0) return [{ ...data, blockIds: [] }]

		return [
			{ ...data, blockIds: blocks.map((block) => block.id) },
			...blocks.reduce((a: BlockModel.block[], b) => [...a, ...flatGraph(b)], []),
		]
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
			rootId: block.rootId,
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
				rootId: block.rootId,
			})
		)
	}
}
