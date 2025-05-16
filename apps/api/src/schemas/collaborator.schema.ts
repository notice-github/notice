import { PermissionModel, WorkspaceModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace CollaboratorSchema {
	/**
	 * @GET /collaborators
	 */
	export const getAll = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(Is.array(WorkspaceModel.collaborator)),
		},
	} satisfies Schema
	export type getAll = SchemaType<typeof getAll>

	/**
	 * @PATCH /collaborators/:userId
	 */
	export const update = {
		params: Is.object({
			userId: Is.string().uuid(),
		}),
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			role: PermissionModel.roles,
		}).partial(),
		response: {
			200: Is.success(),
			403: Is.error('not_allowed'),
			404: Is.error('collaborator_not_found'),
		},
	} satisfies Schema
	export type update = SchemaType<typeof update>

	/**
	 * @DELETE /collaborators/:userId
	 */
	export const remove = {
		params: Is.object({
			userId: Is.string().uuid(),
		}),
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(),
			403: Is.error('not_allowed'),
		},
	} satisfies Schema
	export type remove = SchemaType<typeof remove>
}
