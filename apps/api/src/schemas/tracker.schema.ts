import { Is, Schema, SchemaType } from 'typerestjs'

export namespace TrackerSchema {
	export const event = {
		body: Is.object({
			id: Is.string(),
			eventName: Is.string(),
			data: Is.record(Is.string(), Is.any()).optional(),
		}),
		response: {
			'200': Is.success(Is.literal(undefined)),
		},
	} satisfies Schema
	export type event = SchemaType<typeof event>

	export const crash = {
		body: Is.object({
			name: Is.string(),
			message: Is.string(),
			stack: Is.string().optional(),
			metadata: Is.record(Is.string(), Is.any()).optional(),
		}),
		response: {
			200: Is.success(Is.literal(undefined)),
		},
	} satisfies Schema
	export type crash = SchemaType<typeof crash>
}
