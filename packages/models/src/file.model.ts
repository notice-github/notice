import { Is, ModelType } from 'typerestjs'

export namespace FileModel {
	//-----------//
	// All parts //
	//-----------//

	export const source = Is.enum(['editor', 'user', 'workspace'])
	export type source = ModelType<typeof source>

	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		id: Is.string().uuid(),

		url: Is.string().url(),
		size: Is.number().min(0).nullable(),
		originalName: Is.string().nullable(),
		mimetype: Is.string().nullable(),
		aspectRatio: Is.number().nullable(),
		source: FileModel.source.default('editor'),
		description: Is.string().nullable(),

		userId: Is.string().uuid(),
		workspaceId: Is.string().uuid(),

		createdAt: Is.date(),
		updatedAt: Is.date(),
		deletedAt: Is.date().nullable(),
	})
	export type full = ModelType<typeof full>

	/**
	 * The model available to the client
	 */
	export const client = full.omit({
		userId: true,
		workspaceId: true,
		createdAt: true,
		updatedAt: true,
		deletedAt: true,
	})
	export type client = ModelType<typeof client>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.text('url')
		table.integer('size').unsigned().nullable()
		table.text('originalName').nullable()
		table.string('mimetype').nullable()
		table.float('aspectRatio').nullable()
		table.enum('source', ['editor', 'user', 'workspace']).defaultTo('editor')
		table.text('description').nullable()

		table.uuid('userId')
		table.foreign('userId').references('users.id')
		table.uuid('workspaceId').nullable()
		table.foreign('workspaceId').references('workspaces.id')

		table.dateTime('createdAt').defaultTo(helpers.now())
		table.dateTime('updatedAt').defaultTo(helpers.now())
		table.dateTime('deletedAt').nullable()
	}
}
