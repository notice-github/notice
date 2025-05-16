import { Is, Schema, SchemaType } from 'typerestjs'

export namespace SaverSchema {
	/**
	 * @POST /savers/slate
	 */
	export const slate = {
		body: Is.any(), // TODO
		response: {
			200: Is.success(),
			400: Is.error('block_unserializable'),
		},
	} satisfies Schema
	export type slate = SchemaType<typeof slate>
}
