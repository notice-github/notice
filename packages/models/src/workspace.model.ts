import { Is, ModelType } from 'typerestjs'

import { PermissionModel } from './permission.model'
import { SubscriptionModel } from './subscription.model'
import { UserModel } from './user.model'

export namespace WorkspaceModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		name: Is.string(),
		icon: Is.string().url().nullable(),
		tokenBalance: Is.number().int().default(0),

		activeAt: Is.date().nullable(),

		createdAt: Is.date(),
		updatedAt: Is.date(),
		deletedAt: Is.date().nullable(),
	})
	export type full = ModelType<typeof full>

	/**
	 * The model available to the client
	 */
	export const client = full.omit({ updatedAt: true, deletedAt: true }).extend({
		subscription: SubscriptionModel.type,
		myRole: PermissionModel.roles,
	})
	export type client = ModelType<typeof client>

	//-----------------//
	// All meta models //
	//-----------------//

	export const collaborator = PermissionModel.full.pick({ role: true, invitationStatus: true }).merge(UserModel.client)
	export type collaborator = ModelType<typeof collaborator>

	export const invitation = PermissionModel.full
		.pick({
			id: true,
			role: true,
		})
		.extend({
			invitationEmail: Is.string(),
			invitationStatus: PermissionModel.status,
		})
	export type invitation = ModelType<typeof invitation>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.string('name')
		table.text('icon').nullable()
		table.integer('tokenBalance').defaultTo(0)

		table.dateTime('activeAt').nullable()

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('updatedAt').defaultTo(helpers.now())
		table.dateTime('deletedAt').nullable()
	}
}
