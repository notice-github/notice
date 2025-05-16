import { OpenAI } from '@notice-app/openai'
import { randomUUID } from 'crypto'
import { Handler, Logger } from 'typerestjs'
import { TemplateSchema } from '../schemas/template.schema'
import { PromptService } from '../services/prompt.service'
import { TemplateService } from '../services/template.service'
import { scrapperPrompt } from '../tools/prompt.tool'

export namespace TemplateController {
	export const generation: Handler<TemplateSchema.generation> = async (req, reply) => {
		const { template, domain, url, context } = req.body
		const { customInstruction, customFormat } = template

		try {
			// Get the scrapper data
			const scrappedRes = url ? await TemplateService.scrapURL(url) : ({ success: true, data: undefined } as const)

			if (!scrappedRes.success) {
				if (scrappedRes.error === 'domain_timeout') {
					return reply.error(408, 'domain_timeout')
				}

				return reply.error(404, 'domain_unreachable')
			}

			const scrapped4kMax = scrappedRes?.data ? scrappedRes.data.substring(0, 16_000) : '' // ~ 4_0000 token max

			// Takes the scrapped data and make a useful summary
			const scrappSummary = domain
				? await OpenAI.chatCompletion({
						model: 'gpt-4o-mini',
						temperature: 0.6,
						messages: PromptService.buildChatMessage(scrapperPrompt(scrapped4kMax, domain ?? '')),
				  })
				: { data: '' }

			// Generates ideas for page(s) from scrapped data, template, instructions and context
			const ideas = await PromptService.generateIdeas(template, scrappSummary.data, customInstruction, context)

			// ID of the project
			const rootId = randomUUID()

			// From these ideas, create page(s) in HTML and convert them into blocks
			const promises = ideas.map(async (idea: any) => {
				return PromptService.createBMSPage({
					singlePageProject: ideas.length === 1,
					idea,
					rootId,
					template: template,
					domain: domain ?? '',
					workspaceId: req.query.workspaceId,
					user: req.user,
					customFormat,
				})
			})

			const blocks = await Promise.all(promises)

			// Store it into a parent page
			const project = {
				id: rootId,
				type: 'page',
				data: { text: 'Page title here' },
				blocks: blocks.length === 1 ? blocks[0] : blocks,
			}

			// @ts-ignore
			return reply.success(200, project)
		} catch (err: any) {
			Logger.error('controller', err)
			return reply.error(400, 'unknown')
		}
	}

	export const getDesign: Handler<TemplateSchema.design> = async (req, reply) => {
		try {
			const design = await TemplateService.scrapDesign(req.body.domain)
			if (design.success === false) {
				if (design.error === 'domain_timeout') {
					return reply.error(408, 'domain_timeout')
				}
				return reply.error(404, 'domain_unreachable')
			}
			return reply.success(200, design.data)
		} catch (err: any) {
			Logger.error('controller', err)
			reply.error(400, 'unknown')
		}
		return reply.success(200, null)
	}
}
