import { BMSBlockModel, BlockModel } from '@notice-app/models'
import { MongoDB } from '@notice-app/mongodb'
import { NTime, NObjects } from '@notice-app/tools'
import _ from 'lodash'
import { BlockService } from './block.service'

// TranslationService performs similar actions to the BlockService but BlockService was already very long
export namespace TranslationService {
	export const updateAllLangBlocksInGraph = async (graph: BlockModel.graph, lang: string) => {
		const flatBlocks = BlockService.flatGraph(graph)
		const updatedAt = NTime.now()

		// This is an aggressive update strategy that updates every block that is sent
		// Not sure making the diff would be more efficient (would mean making a call to MongoDB before)
		// since most of the updates on translation happen on 1 block at a time
		await MongoDB.blocks.bulkWrite(
			flatBlocks.map((block) => {
				const { id } = block

				let updates: any = {
					updatedAt,
					lang: {
						[lang]: {
							data: block.data,
							// need a separate updatedAt for each lang
							updatedAt,
						},
					},
				}

				updates = NObjects.dotify(updates)

				return {
					updateOne: {
						filter: { _id: id },
						update: { $set: { ...updates } },
					},
				}
			}),
			{ ordered: false }
		)
		return 'success'
	}

	export const updateAllLangBlocksInArray = async (
		blocks: BlockModel.block[],
		lang: string,
		markAsComplete = false
	) => {
		const updatedAt = NTime.now()
		const completedAt = NTime.$now().add(1, 'second').toDate()

		// This is an aggressive update strategy that updates every block that is sent
		// Not sure making the diff would be more efficient (would mean making a call to MongoDB before)
		// since most of the updates on translation happen on 1 block at a time
		await MongoDB.blocks.bulkWrite(
			blocks.map((block) => {
				const { id } = block

				let updates: any = {
					lang: {
						[lang]: {
							data: block.data,
							// need a separate updatedAt for each lang
							updatedAt,
							...(markAsComplete ? { completedAt } : {}),
						},
					},
				}

				updates = NObjects.dotify(updates)

				return {
					updateOne: {
						filter: { _id: id },
						update: { $set: { ...updates } },
					},
				}
			}),
			{ ordered: false }
		)
		return 'success'
	}

	export const updatePageTitle = async (block: BMSBlockModel.block, lang: string, text: string) => {
		const updatedAt = NTime.now()

		const updates: Partial<BMSBlockModel.block> = {
			updatedAt,
			lang: {
				[lang]: {
					data: { ...block.data, text },
					updatedAt,
				},
			},
		}

		await MongoDB.blocks.updateOne({ _id: block._id }, { $set: { ...updates } })

		return 'success'
	}

	export const markAsComplete = async (blockId: string, lang: string, complete: boolean) => {
		const path = `lang.${lang}.completedAt`
		const completedAt = complete ? NTime.now() : undefined

		const updates: Partial<BlockModel.block> = {
			[path]: completedAt,
		}

		// do not update the `updatedAt` of the block
		// we need it not to change to check completedAt vs updatedAt
		await MongoDB.blocks.updateOne(
			{
				_id: blockId,
			},
			{
				$set: {
					...updates,
				},
			}
		)

		return 'success'
	}

	export const overrideDefaultBlockByLang = (
		block: BMSBlockModel.block,
		langCode: string,
		injectMetadata: boolean
	): BMSBlockModel.block => {
		const leaves = _.get(block, `lang.${langCode}.data.leaves`) ?? block?.data?.leaves
		const text = _.get(block, `lang.${langCode}.data.text`) ?? block?.data?.text
		const title = _.get(block, `lang.${langCode}.data.title`) ?? block?.data?.title
		const content = _.get(block, `lang.${langCode}.data.content`) ?? block?.data?.content
		const completedAt = _.get(block, `lang.${langCode}.completedAt`)

		// updatedAt is required to know if the default lang block
		// has been updated since the last time it was translated
		// this is the parent updatedAt! There is no updatedAt for lang blocks.
		const updatedAt = block.updatedAt

		block.data = {
			...block.data,
			leaves,
			title,
			text,
			content,
		}
		if (injectMetadata) block.metadata = { ...block.metadata, completedAt, updatedAt }

		return block
	}
}
