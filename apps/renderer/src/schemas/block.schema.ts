import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace BlockSchema {
	export const get = {
		params: Is.object({
			target: Is.string(),
		}),
		response: {
			200: Is.success(BlockModel.block),
			404: Is.error('target_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	export const pages = {
		params: Is.object({
			blockId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(Is.array(BlockModel.block)),
		},
	} satisfies Schema
	export type pages = SchemaType<typeof pages>
}
