import { FileModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace FileSchema {
	/**
	 * @POST /files
	 */
	export const addOne = {
		body: Is.object({
			workspaceId: Is.string().uuid(),
			file: Is.file(),
			aspectRatio: Is.number().or(Is.string()).optional(),
			source: FileModel.source.default('editor'),
		}),
		response: {
			201: Is.success(FileModel.client),
		},
	}
	export type addOne = SchemaType<typeof addOne>

	/**
	 * @GET /files
	 */
	export const getAll = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
			type: Is.enum(['image', 'video', 'application', 'audio'] as const).optional(),
			source: FileModel.source.optional(),
		}),
		response: {
			200: Is.success(Is.array(FileModel.client)),
		},
	} satisfies Schema
	export type getAll = SchemaType<typeof getAll>

	/**
	 * @GET /storage
	 */
	export const storage = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(Is.number()),
		},
	} satisfies Schema
	export type storage = SchemaType<typeof storage>

	/**
	 * @GET /files/:id
	 */
	export const getOne = {
		params: Is.object({
			url: Is.string(),
		}),
		response: {
			200: Is.success(FileModel.client),
			404: Is.error('file_not_found'),
		},
	}
	export type getOne = SchemaType<typeof getOne>

	/**
	 * @PATCH /files/:id
	 */
	export const updateOne = {
		params: Is.object({
			url: Is.string(),
		}),
		body: Is.object({
			originalName: Is.string().max(101).optional(),
			mimeType: Is.string().optional(),
			url: Is.string().optional(),
			description: Is.string().max(125).optional(),
		}),
		response: {
			200: Is.success(FileModel.client),
			404: Is.error('file_not_found'),
		},
	}
	export type updateOne = SchemaType<typeof updateOne>
}
