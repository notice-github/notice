import { Is, Schema, SchemaType } from 'typerestjs'

export namespace EmailSchema {
	/**
	 * @GET /email/unsubscribe
	 */
	export const unsubscribe = {
		querystring: Is.object({
			email: Is.string().optional(),
		}),
		response: {
			200: Is.string(),
			404: Is.undefined(),
		},
	} satisfies Schema
	export type unsubscribe = SchemaType<typeof unsubscribe>

	/**
	 * @GET /email/resubscribe
	 */
	export const resubscribe = {
		querystring: Is.object({
			email: Is.string().optional(),
		}),
		response: {
			200: Is.string(),
		},
	} satisfies Schema
	export type resubscribe = SchemaType<typeof resubscribe>
}
