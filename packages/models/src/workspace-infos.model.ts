import { Is, ModelType } from 'typerestjs'

export namespace WorkspaceInfosModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */

	export const full = Is.object({
		id: Is.string().uuid(),
		workspaceId: Is.string().uuid(),

		companyDescription: Is.string().nullable(),
		aiTone: Is.string().nullable(),
		aiPromptExample: Is.string().nullable(),
		aiModel: Is.string().nullable(),
	})
	export type full = ModelType<typeof full>

	/**
	 * The model available to the client
	 */
	export const client = full.omit({ id: true, workspaceId: true })
	export type client = ModelType<typeof client>

	//--------------//
	// Create Table //
	//--------------//

	export const table = (table: any, helpers: any) => {
		table.uuid('id').primary()

		table.uuid('workspaceId')
		table.foreign('workspaceId').references('workspaces.id')

		table.text('companyDescription').nullable()
		table.text('aiTone').nullable()
		table.text('aiPromptExample').nullable()
		table.text('aiModel').nullable()
	}
}
