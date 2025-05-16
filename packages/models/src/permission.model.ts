import { Is, ModelType } from 'typerestjs'

export namespace PermissionModel {
	//-----------//
	// All parts //
	//-----------//

	export const roles = Is.enum(['owner', 'admin', 'editor', 'viewer'])
	export type roles = ModelType<typeof roles>

	export const status = Is.enum(['accepted', 'pending', 'refused'] as const)
	export type status = ModelType<typeof status>

	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),
		role: roles,

		userId: Is.string().uuid(),
		workspaceId: Is.string().uuid(),

		invitationEmail: Is.string().nullable(),
		invitationStatus: status.nullable(),

		createdAt: Is.date(),
		updatedAt: Is.date(),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.enum('role', ['owner', 'admin', 'editor', 'viewer']).defaultTo('viewer')

		table.uuid('userId')
		table.foreign('userId').references('users.id')
		table.uuid('workspaceId')
		table.foreign('workspaceId').references('workspaces.id')
		table.unique(['userId', 'workspaceId'], { indexName: 'permissions_userid_workspaceid_unique' })

		table.string('invitationEmail', 320).nullable()
		table.enum('invitationStatus', ['accepted', 'pending', 'refused']).nullable()

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('updatedAt').defaultTo(helpers.now())
	}
}
