import { Is, ModelType } from 'typerestjs'
import { PermissionModel } from './permission.model'

export namespace APIKeyModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the collection
	 */
	export const full = Is.object({
		_id: Is.string().uuid(),
		key: Is.string().min(21),
		workspaceId: Is.union([Is.string().uuid(), Is.literal('*')]),
		role: PermissionModel.roles,
	})
	export type full = ModelType<typeof full>
}
