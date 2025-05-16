import { PermissionModel, WorkspaceModel } from '@notice-app/models'
import { Is, Schema, SchemaType } from 'typerestjs'

export namespace InvitationSchema {
	/**
	 * @GET /invitations
	 */
	export const getAll = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		response: {
			200: Is.success(Is.array(WorkspaceModel.invitation)),
		},
	} satisfies Schema
	export type getAll = SchemaType<typeof getAll>

	/**
	 * @POST /invitations
	 */
	export const create = {
		querystring: Is.object({
			workspaceId: Is.string().uuid(),
		}),
		body: Is.object({
			email: Is.string()
				.email()
				.transform((email) => email.toLowerCase()),
			role: PermissionModel.roles,
		}),
		response: {
			202: Is.success(),
			403: Is.error('not_allowed'),
			409: Is.error('already_invited'),
		},
	} satisfies Schema
	export type create = SchemaType<typeof create>

	/**
	 * @GET /invitations/workspace
	 */
	export const getWorkspace = {
		querystring: Is.object({
			token: Is.string(),
		}),
		response: {
			200: Is.success(WorkspaceModel.client),
			400: Is.error('invitation_token_expired').or(Is.error('invitation_token_invalid')),
			404: Is.error('workspace_not_found'),
		},
	} satisfies Schema
	export type getWorkspace = SchemaType<typeof getWorkspace>

	/**
	 * @POST /invitations/:action
	 */
	export const acceptOrRefuse = {
		params: Is.object({
			action: Is.enum(['accept', 'refuse'] as const),
		}),
		body: Is.object({
			token: Is.string(),
		}),
		response: {
			200: Is.success(WorkspaceModel.client.optional()),
			400: Is.error('invitation_token_expired').or(Is.error('invitation_token_invalid')),
			404: Is.error('workspace_not_found'),
		},
	} satisfies Schema
	export type acceptOrRefuse = SchemaType<typeof acceptOrRefuse>

	/**
	 * @PATCH /invitations/:permissionId
	 */
	export const update = {
		params: Is.object({
			permissionId: Is.string().uuid(),
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
			404: Is.error('invitation_not_found'),
		},
	} satisfies Schema
	export type update = SchemaType<typeof update>

	/**
	 * @DELETE /invitations/:permissionId
	 */
	export const remove = {
		params: Is.object({
			permissionId: Is.string().uuid(),
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
