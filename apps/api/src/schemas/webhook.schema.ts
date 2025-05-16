import { Is, Schema, SchemaType } from 'typerestjs'

export namespace WebhookSchema {
	/**
	 * @POST /webhooks/stripe
	 */
	export const stripe = {
		body: Is.any(),
		response: {
			200: Is.unknown(),
			400: Is.string(),
		},
	} satisfies Schema
	export type stripe = SchemaType<typeof stripe>
}
