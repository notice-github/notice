import { PermissionModel, UserModel, WorkspaceModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { NTime } from '@notice-app/tools'
import { Logger } from 'typerestjs'

export namespace WorkspaceService {
	export const exists = async (id: string) => {
		const workspace = await Postgres.workspaces().select('id').where('id', id).first()
		return workspace != null
	}

	export const userHasHisOwnWorkspace = async (userId: string) => {
		const workspace = await getUserOwnWorkspace(userId)
		return workspace != null
	}

	export const getUserOwnWorkspace = async (userId: string): Promise<WorkspaceModel.full> => {
		const workspace = await Postgres.permissions()
			.select('workspaces.*')
			.where('userId', userId)
			.whereNull('invitationEmail')
			.join('workspaces', 'permissions.workspaceId', '=', 'workspaces.id')
			.orderBy('workspaces.createdAt', 'asc')
			.first()

		return workspace
	}

	export const getUserWorkspaces = async (userId: string) => {
		const workspaces = await Postgres.permissions()
			.select(
				Postgres.raw(`
					workspaces.*,
					permissions.role AS "myRole",
					COALESCE (subscriptions.type, 'free') AS subscription
				`)
			)
			.where('permissions.userId', userId)
			.whereNull('workspaces.deletedAt')
			.join('workspaces', 'permissions.workspaceId', '=', 'workspaces.id')
			.leftJoin(
				Postgres.raw(
					'subscriptions ON permissions."workspaceId" = subscriptions."workspaceId" AND (subscriptions."expiresAt" > NOW() OR subscriptions."expiresAt" IS NULL)'
				)
			)
			.orderBy([
				{ column: 'invitationStatus', nulls: 'last' },
				{ column: 'permissions.userId', order: 'asc' },
				{ column: 'name', order: 'asc' },
			])

		return workspaces as WorkspaceModel.client[]
	}

	export const countUserOwnWorkspaces = async (userId: string) => {
		const workspaces = await Postgres.permissions()
			.select('workspaces.id')
			.where('userId', userId)
			.whereNull('invitationEmail')
			.whereNull('workspaces.deletedAt')
			.join('workspaces', 'permissions.workspaceId', '=', 'workspaces.id')
		return workspaces.length
	}

	export const createWorkspace = async (name: string, options?: { tokenBalance?: number }) => {
		const [workspace] = await Postgres.workspaces()
			.insert({
				id: Postgres.uuid(),
				name: name,
				tokenBalance: options?.tokenBalance ?? 10_000,
			})
			.returning('*')

		return workspace!
	}

	export const getCollaborators = async (
		id: string
	): Promise<(UserModel.full & Pick<PermissionModel.full, 'role' | 'invitationStatus'>)[]> => {
		return await Postgres.permissions()
			.select('permissions.role', 'permissions.invitationStatus', 'users.*')
			.where('workspaceId', id)
			.andWhere((builder) => builder.whereNot('invitationStatus', 'pending').orWhereNull('invitationStatus'))
			.join('users', 'permissions.userId', '=', 'users.id')
			.orderBy('permissions.createdAt', 'asc')
	}

	export const countActiveCollaborators = async (id: string) => {
		const collaborators = await Postgres.permissions()
			.select('id')
			.where('workspaceId', id)
			.andWhere((builder) => builder.where('invitationStatus', 'accepted').orWhereNull('invitationStatus'))
		return collaborators.length
	}

	export const countCollaborators = async (id: string) => {
		const collaborators = await Postgres.permissions()
			.select('id')
			.where('workspaceId', id)
			.andWhere((builder) => builder.whereNot('invitationStatus', 'refused').orWhereNull('invitationStatus'))
		return collaborators.length
	}

	export const getInvitations = async (id: string) => {
		const invitations = await Postgres.permissions()
			.select('id', 'role', 'invitationEmail', 'invitationStatus')
			.where('workspaceId', id)
			.andWhere((builder) => builder.where('invitationStatus', 'pending').orWhere('invitationStatus', 'refused'))

		return invitations as WorkspaceModel.invitation[]
	}

	export const getInvitation = async (id: string, email: string) => {
		const invitation = await Postgres.permissions()
			.select('id', 'role', 'invitationEmail', 'invitationStatus')
			.where({
				workspaceId: id,
				invitationEmail: email,
			})
			.andWhere((builder) => builder.where('invitationStatus', 'pending').orWhere('invitationStatus', 'refused'))
			.first()

		return invitation as WorkspaceModel.invitation | undefined
	}

	export const getByPermission = async (permissionId: string): Promise<WorkspaceModel.client | undefined> => {
		const workspace = await Postgres.permissions()
			.select(
				Postgres.raw(`
					workspaces.*,
					permissions.role AS "myRole",
					COALESCE (subscriptions.type, 'free') AS subscription
				`)
			)
			.where('permissions.id', permissionId)
			.whereNull('workspaces.deletedAt')
			.join('workspaces', 'permissions.workspaceId', '=', 'workspaces.id')
			.leftJoin('subscriptions', 'permissions.workspaceId', '=', 'subscriptions.workspaceId')
			.first()

		return workspace
	}

	export const decrementTokenBalance = async (id: string, amount: number) => {
		await Postgres.workspaces().where('id', id).decrement('tokenBalance', amount)
	}

	export const incrementTokenBalance = async (id: string, amount: number) => {
		await Postgres.workspaces().where('id', id).increment('tokenBalance', amount)
	}

	export const getTokenBalance = async (id: string) => {
		const workspace = await Postgres.workspaces().select('tokenBalance').where('id', id).first()
		return workspace?.tokenBalance
	}

	export const addCollaborator = async (id: string, email: string, role: PermissionModel.roles) => {
		const [invitation] = await Postgres.permissions()
			.insert({
				id: Postgres.uuid(),
				role: role,
				workspaceId: id,
				invitationEmail: email,
				invitationStatus: 'pending',
			})
			.returning('*')

		return invitation
	}

	export const update = async (id: string, data: { name?: string; icon?: string | null } & Record<string, any>) => {
		const { name, icon, ...info } = data
		const updates = { ...(name && { name }), ...(icon && { icon }) }

		const hasWorkspaceInfo = await Postgres.workspaceInfos().select('id').where('workspaceId', '=', id).first()
		if (!hasWorkspaceInfo) {
			await Postgres.workspaceInfos().insert({
				id: Postgres.uuid(),
				workspaceId: id,
				...info,
			})
		} else {
			if (Object.keys(info).length > 0) await Postgres.workspaceInfos().where('workspaceId', id).update(info)
		}

		if (Object.keys(updates).length > 0) await Postgres.workspaces().where('id', id).update(updates)
	}

	export const isActive = async (id: string) => {
		try {
			await Postgres.workspaces().where('id', id).update({ activeAt: NTime.now() })
		} catch (ex: any) {
			Logger.error('workspace.service', ex)
		}
	}

	export const deleteOne = async (id: string) => {
		await Postgres.workspaces().where('id', id).update({
			deletedAt: NTime.now(),
		})
	}

	export const getWorkspaceInfos = async (id: string) => {
		const result = await Postgres.workspaceInfos()
			.select('companyDescription', 'aiTone', 'aiPromptExample', 'aiModel')
			.where('workspaceId', '=', id)
			.first()
		return result ?? { companyDescription: null, aiTone: null, aiPromptExample: null, aiModel: null }
	}
}
