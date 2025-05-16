import { PermissionModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { NTime } from '@notice-app/tools'

export namespace PermissionService {
	export const getOwnerPermission = async (workspaceId: string) => {
		const permission = await Postgres.permissions()
			.where({
				workspaceId: workspaceId,
				role: 'owner',
				invitationEmail: null,
			})
			.first()

		return permission
	}

	export const getUserPermission = async (userId: string, workspaceId: string) => {
		const permission = await Postgres.permissions()
			.where({
				userId: userId,
				workspaceId: workspaceId,
			})
			.first()

		return permission
	}

	export const getById = async (id: string) => {
		return await Postgres.permissions().where('id', id).first()
	}

	export const setWorkspaceOwner = async (userId: string, workspaceId: string) => {
		try {
			const ownerPermission = await getOwnerPermission(workspaceId)

			if (ownerPermission != null) {
				if (ownerPermission.userId === userId) return
				else await Postgres.permissions().where('id', ownerPermission.id).delete()
			}

			const userPermission = await getUserPermission(userId, workspaceId)

			if (userPermission != null) {
				await Postgres.permissions().where('id', userPermission.id).update({
					role: 'owner',
					invitationEmail: null,
					invitationStatus: null,
					updatedAt: NTime.now(),
				})
			} else {
				await Postgres.permissions().insert({
					id: Postgres.uuid(),
					role: 'owner',
					userId: userId,
					workspaceId: workspaceId,
				})
			}
		} catch (ex: any) {}
	}

	export const update = async (
		id: string,
		data: Partial<Pick<PermissionModel.full, 'invitationEmail' | 'invitationStatus' | 'role' | 'userId'>>
	) => {
		await Postgres.permissions()
			.where('id', id)
			.update({ ...data, updatedAt: NTime.now() })
	}

	export const remove = async (id: string) => {
		await Postgres.permissions().where('id', id).delete()
	}
}
