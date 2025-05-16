import { VisitModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace InsightSchema {
	/**
	 * @GET /insights/:blockId/visits
	 */

	export const visits = {
		params: Is.object({
			blockId: Is.string().uuid(),
		}),
		querystring: Is.object({
			from: Is.date(),
			to: Is.date(),
			granularity: VisitModel.granularity
		}),
		response: {
			200: Is.success(Is.any()),
		},
	} satisfies Schema
	export type visits = SchemaType<typeof visits>
}
