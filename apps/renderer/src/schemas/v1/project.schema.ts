import { BlockModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace V1ProjectSchema {
	/**
	 * @GET /v1/projects/:projectId
	 */
	export const get = {
		params: Is.object({
			projectId: Is.string(),
		}),
		response: {
			200: Is.success(BlockModel.block),
			400: Is.error('not_a_project'),
			404: Is.error('project_not_found'),
		},
	} satisfies Schema
	export type get = SchemaType<typeof get>

	/**
	 * @GET /v1/projects/:projectId/pages
	 */
	export const pages = {
		params: Is.object({
			projectId: Is.string(),
		}),
		response: {
			200: Is.success(Is.array(BlockModel.block)),
			400: Is.error('not_a_project'),
			404: Is.error('project_not_found'),
		},
	} satisfies Schema
	export type pages = SchemaType<typeof pages>

	/**
	 * @GET /v1/projects/:projectId/blocks-tree
	 */
	export const blocksTree = {
		params: Is.object({
			projectId: Is.string(),
		}),
		response: {
			200: Is.success(BlockModel.graph),
			400: Is.error('not_a_project'),
			404: Is.error('project_not_found'),
		},
	} satisfies Schema
	export type blocksTree = SchemaType<typeof blocksTree>

	/**
	 * @GET /v1/projects/:projectId/pages-tree
	 */
	export const pagesTree = {
		params: Is.object({
			projectId: Is.string(),
		}),
		response: {
			200: Is.success(BlockModel.graph),
			400: Is.error('not_a_project'),
			404: Is.error('project_not_found'),
		},
	} satisfies Schema
	export type pagesTree = SchemaType<typeof pagesTree>
}
