import { Is, Schema, SchemaType } from 'typerestjs'

export namespace TemplateSchema {
	export const generation = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			domain: Is.string()
				.regex(/^.+\..+$/)
				.optional()
				.nullable(),
			url: Is.string().nullable(),
			context: Is.string().optional(),
			customInstruction: Is.string().optional(),
			customFormat: Is.string().optional(),
			template: Is.object({
				name: Is.string(),
				id: Is.string(),
				customInstruction: Is.string().optional(),
				customFormat: Is.string().optional(),
				generateImage: Is.boolean().optional(),
			}),
		}),
		response: {
			200: Is.success(Is.object({ type: Is.string(), data: Is.any(), blocks: Is.array(Is.any()) })),
			400: Is.error('unknown'),
			404: Is.error('domain_unreachable'),
			408: Is.error('domain_timeout'),
		},
	} satisfies Schema
	export type generation = SchemaType<typeof generation>

	export const design = {
		body: Is.object({
			domain: Is.string().regex(/^.+\..+$/),
		}),
		response: {
			200: Is.success(
				Is.object({
					url: Is.string().url(),
					favicon: Is.string().url().nullable(),
					titles: Is.array(Is.object({ level: Is.enum(['page', 'H1', 'H2', 'H3']), content: Is.string() })),
					paragraphs: Is.array(Is.string()),
					fonts: Is.array(Is.object({ font: Is.string(), importance: Is.number() })),
					fontColors: Is.array(Is.object({ color: Is.string(), importance: Is.number() })),
					colors: Is.array(Is.object({ color: Is.string(), importance: Is.number() })),
				}).nullable()
			),
			400: Is.error('unknown'),
			404: Is.error('domain_unreachable'),
			408: Is.error('domain_timeout'),
		},
	} satisfies Schema
	export type design = SchemaType<typeof design>
}
