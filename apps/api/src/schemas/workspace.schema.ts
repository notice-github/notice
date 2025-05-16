import { WorkspaceInfosModel, WorkspaceModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace WorkspaceSchema {
	/**
	 * @GET /workspaces
	 */
	export const getAll = {
		response: {
			200: Is.success(Is.array(WorkspaceModel.client)),
		},
	} satisfies Schema
	export type getAll = SchemaType<typeof getAll>

	/**
	 * @POST /workspaces
	 */
	export const createOne = {
		body: Is.object({
			name: Is.string(),
		}),
		response: {
			201: Is.success(WorkspaceModel.client),
		},
	} satisfies Schema
	export type createOne = SchemaType<typeof createOne>

	/**
	 * @PATCH /workspaces/:workspaceId
	 */
	export const update = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: WorkspaceModel.full.pick({ name: true, icon: true }).merge(WorkspaceInfosModel.client).partial(),
		response: {
			200: Is.success(),
			404: Is.error('workspace_not_found'),
		},
	} satisfies Schema
	export type update = SchemaType<typeof update>

	/**
	 * @DELETE /workspaces/:workspaceId
	 */
	export const deleteOne = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(),
			409: Is.error('could_not_delete'),
		},
	}
	export type deleteOne = SchemaType<typeof deleteOne>

	/**
	 * @GET /workspaces/:workspaceId/info
	 */
	export const getWorkspaceInfos = {
		params: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(WorkspaceInfosModel.client),
			404: Is.error('workspace_infos_not_found'),
		},
	} satisfies Schema
	export type getWorkspaceInfos = SchemaType<typeof getWorkspaceInfos>
}
