import { Handler } from 'typerestjs'
import { TranslationSchema } from '../schemas/translation.schema'
import { SerializerService } from '../services/serializer.service'
import { TranslationService } from '../services/translation.service'

export namespace TranslationController {
	export const updatePageTitle: Handler<TranslationSchema.updatePageTitle> = async (req, reply) => {
		const { text } = req.body

		await TranslationService.updatePageTitle(req.block, req.query.lang, text)

		return reply.success(200)
	}
	export const updateOne: Handler<TranslationSchema.updateOne> = async (req, reply) => {
		const block = SerializerService.slate(req.body.data)

		if (!block) return reply.error(404, 'block_not_found')

		TranslationService.updateAllLangBlocksInGraph(block, req.query.lang)

		return reply.success(200)
	}

	export const markComplete: Handler<TranslationSchema.markComplete> = async (req, reply) => {
		const { complete, lang } = req.query
		TranslationService.markAsComplete(req.params.blockId, lang, complete)

		return reply.success(200)
	}
}
