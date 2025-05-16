import { FileModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace AISchema {
	/**
	 * @POST /ai/rephrase
	 */
	export const rephrase = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			text: Is.string(),
			type: Is.enum(['formal', 'expand', 'short', 'fun', 'correct'] as const),
		}).refine(({ text, type }) => {
			const max = 4000 - 400 // -400 represent a security while trying these min-max values

			switch (type) {
				case 'formal':
				case 'correct':
				case 'fun':
					return text.length <= (max * 4) / 2
				case 'expand':
					return text.length <= max
				case 'short':
					return text.length <= (max * 4) / 1.5
				default:
					return false
			}
		}, `You have reached the maximum number of characters available for reformulation`),
		response: {
			200: Is.success(Is.string()),
			402: Is.error('not_enough_token'),
		},
	} satisfies Schema
	export type rephrase = SchemaType<typeof rephrase>

	/**
	 * @POST /ai/generate/image
	 */
	export const generateImage = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			description: Is.string().max(2048),
			style: Is.enum(['realistic', 'pixel-art', 'isometric-art', 'drawing', 'flat-illustration'] as const)
				.optional()
				.nullable(),
		}),
		response: {
			200: Is.success(FileModel.client),
			400: Is.error('image_unavailable'),
			402: Is.error('not_enough_token'),
		},
	} satisfies Schema
	export type generateImage = SchemaType<typeof generateImage>

	/**
	 * @POST /ai/page
	 */
	export const generatePage = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			// These limits shall match the frontend ones
			prompt: Is.string().max(300 * 5),
			tone: Is.string()
				.max(500 * 5)
				.nullable()
				.optional(),
			companyDescription: Is.string()
				.max(500 * 5)
				.nullable()
				.optional(),
			exampleTone: Is.string()
				.max(500 * 5)
				.nullable()
				.optional(),
		}),
		response: {
			200: Is.any(),
			402: Is.error('upgraded_plan_required'),
		},
	} satisfies Schema
	export type generatePage = SchemaType<typeof generatePage>

	/**
	 * @POST /ai/image/suggestion
	 */
	export const imageSuggestion = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			text: Is.string()
				.max(2048 * 2)
				.min(5),
		}),
		response: {
			200: Is.success(Is.string()),
			400: Is.error('string_too_long'),
		},
	} satisfies Schema
	export type imageSuggestion = SchemaType<typeof imageSuggestion>
}
