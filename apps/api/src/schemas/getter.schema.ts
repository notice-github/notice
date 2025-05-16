import { Is, Schema, SchemaType } from 'typerestjs'

export namespace GetterSchema {
	/**
	 * @GET /getters/slate
	 */
	export const slate = {
		querystring: Is.object({ blockId: Is.string().uuid(), lang: Is.string().optional() }),
		response: {
			200: Is.success(Is.any()), // TODO
			404: Is.error('block_not_found'),
		},
	} satisfies Schema
	export type slate = SchemaType<typeof slate>
}
