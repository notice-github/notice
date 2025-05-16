import { Handler } from 'typerestjs'
import { GTranslate } from '../plugins/translate.plugin'
import { TranslateSchema } from '../schemas/translate.schema'
import { TranslationService } from '../services/translation.service'
import { BlockService } from '../services/block.service'
import { OpenAI } from '@notice-app/openai'
import { MessageSetup, PromptService } from '../services/prompt.service'
import { MongoDB } from '@notice-app/mongodb'

export namespace TranslateController {
	export const text: Handler<TranslateSchema.text> = async (req, reply) => {
		const result = await GTranslate.text(req.body)
		if (!result) return reply.error(424, 'translation_failed')

		return reply.success(200, result)
	}

	export const texts: Handler<TranslateSchema.texts> = async (req, reply) => {
		const result = await GTranslate.texts(req.body)
		if (!result) return reply.error(424, 'translation_failed')
		return reply.success(200, result)
	}

	// Generate a list of chunks (this will allow us to handle page or even full project translation)
	const generateChunks = (data: any, chunkSize: number) => {
		let size = data.length
		let accumulator = 0
		const chunks = []
		let startChunk = 0

		for (let i = 0; i < size; i++) {
			const stringifiedElem = OpenAI.getTokenAmount(JSON.stringify(data[i]))
			if (stringifiedElem >= chunkSize) {
				data.splice(i, 1)
				i -= 1
				size -= 1
				continue
			}
			accumulator += stringifiedElem
			if (accumulator >= chunkSize) {
				chunks.push(data.slice(startChunk, i))
				accumulator = 0
				startChunk = i
				i -= 1
			}
		}
		if (startChunk === 0 && data.length === 0) {
			return chunks
		} else {
			chunks.push(data.slice(startChunk, data.length))
			return chunks
		}
	}

	export const page: Handler<TranslateSchema.page> = async (req, reply) => {
		const exclusionList = ['image', 'video', 'audio', 'bulleted-list', 'numbered-list', 'divider']
		// retrieve the page from the id received
		const { langCode, langName, pageId } = req.body

		const blocks = await BlockService.getRawGraphToBlocks(pageId, MongoDB.blocks, undefined, { type: { $ne: 'page' } })
		if (!blocks) return reply.error(424, 'translation_failed')

		// filter block that can be translated
		const filteredBlocks = blocks.filter((block) => !exclusionList.includes(block.type))

		// simplify the structure :
		const dataSimplified = filteredBlocks
			.map((block) => {
				if (block.type === 'page') {
					return {
						id: block._id,
						content: block.data?.text,
						type: 'text',
					}
				} else if (block.data?.title != null) {
					return {
						id: block._id,
						content: block.data?.title,
						type: 'title',
					}
				} else {
					return {
						id: block._id,
						content: block.data.leaves?.map?.((elem: any) => elem.text)?.join?.(''),
						type: 'leaves',
					}
				}
			})
			.filter((elem: any) => elem.content?.length > 0)

		//send the data to GPT to translate it
		const sysPrompt = `The user will provide you with a RFC8259 compliant JSON of this schema {data: [{ id: string, content: string, type: string }]}.
You will act as a translator and translate every values of the 'content' key in ${langName}.
You must only return the exact same object replacing the original text value by the translated one.`

		const dataChunks = generateChunks(dataSimplified, 1_500)

		await Promise.all(
			dataChunks.map(async (data) => {
				const messages: Array<MessageSetup> = [
					{ role: 'system', content: sysPrompt },
					{ role: 'user', content: JSON.stringify(data) },
				]

				const generatedContent = await OpenAI.chatCompletion({
					// Version for JSON support
					model: 'gpt-4o-mini',
					temperature: 0,
					messages: PromptService.buildChatMessage(messages),
					stream: false,
					response_format: { type: 'json_object' },
				})
				try {
					const translated = JSON.parse(generatedContent.data)

					//inject the result in the original page
					const translatedBlocks = translated.data.map((elem: any) => {
						const currentBlock = blocks.find((e) => e._id === elem.id)

						if (elem.type === 'title') {
							return {
								id: elem.id,
								data: {
									...currentBlock?.data,
									title: elem.content,
								},
							}
						} else if (elem.type === 'leaves') {
							return {
								id: elem.id,
								data: {
									...currentBlock?.data,
									leaves: [{ text: elem.content }],
								},
							}
						} else if (elem.type === 'text') {
							return {
								id: elem.id,
								data: {
									...currentBlock?.data,
									text: elem.content,
								},
							}
						}
					})

					await TranslationService.updateAllLangBlocksInArray(translatedBlocks, langCode, true)
					await BlockService.update(pageId, {})
				} catch (err) {}
			})
		)

		return reply.success(200, 'ok')
	}
}
