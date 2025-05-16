import { OpenAI } from '@notice-app/openai'
import { Handler } from 'typerestjs'
import { AISchema } from '../schemas/ai.schema'
import { AIService } from '../services/ai.service'
import { FileService } from '../services/file.service'
import { PromptService } from '../services/prompt.service'
import { WorkspaceService } from '../services/workspace.service'

export namespace AIController {
	export const rephrase: Handler<AISchema.rephrase> = async (req, reply) => {
		const prompt = AIService.createRephrasingPrompt(req.body.text, req.body.type)

		const { data } = await OpenAI.chatCompletion({
			model: 'gpt-4o-mini',
			temperature: 0,
			messages: [{ role: 'user', content: prompt }],
		})

		return reply.success(200, data)
	}

	export const generateImage: Handler<AISchema.generateImage> = async (req, reply) => {
		const prompt = AIService.createImagePrompt(req.body.description, req.body.style)

		const tmpURL = await OpenAI.generateImage({
			model: 'dall-e-3',
			prompt: prompt,
			size: '1792x1024',
		})
		if (tmpURL == null) return reply.error(400, 'image_unavailable')

		const file = await FileService.upload(tmpURL, {
			userId: req.user.id,
			workspaceId: req.query.workspaceId,
			mimetype: 'image/png',
			aspectRatio: 1.75,
			description: req.body.description,
			originalName: 'Image',
		})

		return reply.success(200, file)
	}

	export const generatePage: Handler<AISchema.generatePage> = async (req, reply): Promise<any> => {
		const workspaceId = req.query.workspaceId as string
		const {
			companyDescription = '',
			aiTone = '',
			aiPromptExample = '',
			aiModel,
		} = await WorkspaceService.getWorkspaceInfos(workspaceId)

		const { prompt } = req.body

		// Take control
		const res = reply.custom().hijack().raw

		// Manually set the headers
		const origin = req.headers.origin
		res.setHeader('Access-Control-Allow-Origin', origin ?? '')
		res.setHeader('Access-Control-Allow-Credentials', 'true')
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

		await OpenAI.streamChatCompletion(
			{
				// Don't use the 4 turbo preview model yet, it's not suited for production
				// see https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
				model: aiModel ?? 'gpt-4o-mini',
				temperature: 0,

				messages: PromptService.buildChatMessage([
					{
						role: 'system',
						content: `
					You will be prompted by a user to write a text in markdown.
					${companyDescription ? `Description of the user activity: ${companyDescription}` : ''}
					${aiTone ? `Writing style you should use: ${aiTone}` : ''}
					${aiPromptExample ? `Example of writing style: ${aiPromptExample}` : ''}
					- Your output must be a valid markdown
					- Only use the following markdown: #, ##, ###, -, *, \n, \n\n, **`,
					},
					{ role: 'user', content: prompt },
				]),
				stream: true,
			},
			res
		)
		res.write('_end_of_stream_') // TODO: we can personalize the error state in the future
		res.writeHead(200) // Set the status code
		return res.end()
	}

	export const imageSuggestion: Handler<AISchema.imageSuggestion> = async (req, reply) => {
		// Let's take only the first 10 000 characters
		const text = req.body.text.slice(0, 10000)

		const res = await OpenAI.chatCompletion({
			// Don't use the 4 turbo preview model yet, it's not suited for production
			// see https://platform.openai.com/docs/models/gpt-4-and-gpt-4-turbo
			model: 'gpt-4o-mini',
			temperature: 0,

			messages: PromptService.buildChatMessage([
				{
					role: 'system',
					content: `
					You are a helpful assistant. You help users to find the right image for their text.
					You return a prompt that will make a good illustration for a text that will be provided to you.
					Only return what is asked for, don't make any comment. 
					ONLY OUTPUT THE PROMPT. NOTHING ELSE. NO COMMENT. NO EXPLANATION. NO EXAMPLE.`,
				},
				{
					role: 'user',
					content: `
					Give a good image prompt to create an illustration for the following text:
					"${text}"
					`,
				},
			]),
		})

		return reply.success(200, res.data)
	}
}
