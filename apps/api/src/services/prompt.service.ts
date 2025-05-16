import { OpenAI } from '@notice-app/openai'
import { randomUUID } from 'crypto'
import { parseHTMLToBlocks } from '../controllers/import.controller'
import { TemplateSchema } from '../schemas/template.schema'
import { PromptIdea, generateIdeasPrompt, htmlPagePrompt } from '../tools/prompt.tool'
import { FileService } from './file.service'
import { UserModel } from '@notice-app/models'

export interface MessageSetup {
	role: 'system' | 'user' | 'assistant'
	content: string
	vars?: Record<string, any>
}

interface CreateBMSPage {
	idea: PromptIdea
	rootId: string
	template: TemplateSchema.generation['body']['template']
	domain?: string
	workspaceId: string
	user: UserModel.client
	singlePageProject: boolean
	customFormat?: string
}

export namespace PromptService {
	export const buildChatMessage = (msg: MessageSetup[]) => {
		return msg.map((elem) => {
			return {
				role: elem.role,
				content: elem.content.replace(/\{\{\s*[a-z0-9]{1,}\s*\}\}/g, (sub) => {
					if (elem.vars) {
						return elem.vars[sub.slice(2, -2).trim()]?.toString() ?? ''
					}
				}),
			}
		})
	}

	export const createBMSPage = async (args: CreateBMSPage) => {
		let page = null
		const { idea, rootId, template, domain, workspaceId, user, singlePageProject, customFormat } = args

		const noTmp = htmlPagePrompt(template?.name ?? '', domain ?? '', idea, customFormat)

		// Parallel calls for image and content
		const [image, res] = await Promise.all([
			idea?.imageDescription ? PromptService.generateCoverImage(workspaceId, user, idea.imageDescription) : null,
			OpenAI.chatCompletion({
				model: 'gpt-4o-mini',
				temperature: 0,
				// @ts-ignore
				messages: PromptService.buildChatMessage(noTmp),
			}),
		])

		const pageBlocks = await parseHTMLToBlocks(res.data, rootId, ['h1'])

		if (image) {
			pageBlocks.unshift({
				type: 'image',
				data: { file: image },
				metadata: {},
				rootId,
				id: randomUUID(),
				blocks: [],
			})
		}

		if (!singlePageProject) {
			let metadata = {}
			if (template.generateImage) {
				metadata = { ...metadata, displaySummary: true, displayBorder: false }
			}
			if (image) {
				metadata = { ...metadata, displayCover: true, cover: image.url }
			}
			metadata = { ...metadata, text: idea.title }

			page = {
				id: randomUUID(),
				rootId,
				type: 'page',
				blocks: pageBlocks,
				data: metadata,
			}
		}

		// single page project directly return the array of blocks
		return page ?? pageBlocks
	}

	export const generateIdeas = async (
		template: TemplateSchema.generation['body']['template'],
		scrappedSummary: string,
		customInstruction?: string,
		context?: string
	): Promise<Array<PromptIdea>> => {
		const ideasPrompt = generateIdeasPrompt(template, scrappedSummary, customInstruction, context)

		const ideasRes = await OpenAI.chatCompletion({
			model: 'gpt-4o-mini',
			temperature: 0.7,
			// @ts-ignore
			messages: PromptService.buildChatMessage(ideasPrompt),
		})
		const ideasString = ideasRes.data.replace(/(?:\r\n|\r|\n)/g, '')
		const ideas = JSON.parse(ideasString)
		return ideas
	}

	export const generateCoverImage = async (workspaceId: string, user: UserModel.client, imageDescription: string) => {
		try {
			const tmpFile = await OpenAI.generateImage({
				model: 'dall-e-3',
				prompt: imageDescription,
				size: '1792x1024',
			})

			if (!tmpFile) return null

			const file = await FileService.upload(tmpFile, {
				userId: user.id,
				workspaceId: workspaceId,
				mimetype: 'image/png',
				aspectRatio: 1.75,
			})
			return file
		} catch (e) {
			return null
		}
	}
}
