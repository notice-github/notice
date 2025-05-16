import { UserModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'
import { NTime } from '@notice-app/tools'
import { Logger } from 'typerestjs'
import { AdminNotice } from '../plugins/admin-notice.plugin'
import { OAuthService } from './oauth.service'

export namespace UserService {
	export const exist = async (id: string) => {
		const user = await Postgres.users().select('id').where('id', id).first()
		return user != null
	}

	export const getById = async (id: string) => {
		return await Postgres.users().where('id', id).first()
	}

	export const getByAuth = async (provider: 'email' | OAuthService.Provider, value: string) => {
		const field = provider === 'email' ? 'email' : `${provider}Id`
		const user = await Postgres.users().where(field, value).first()
		return user
	}

	export const create = async (input: UserModel.input) => {
		try {
			const [user] = await Postgres.users()
				.insert({
					id: Postgres.uuid(),
					...input,
				})
				.returning('*')

			return user
		} catch (ex: any) {
			if (ex.constraint === 'users_email_unique' && (input['googleId'] != null || input['githubId'] != null)) {
				await Postgres.users().where('email', input.email).update({
					githubId: input['githubId'],
					googleId: input['googleId'],
					updatedAt: NTime.now(),
				})

				return await Postgres.users().where('email', input.email).first()
			} else {
				return undefined
			}
		}
	}

	export const update = async (
		id: string,
		data: Partial<Pick<UserModel.full, 'username' | 'picture' | 'formIsFilled'>>
	) => {
		const [user] = await Postgres.users()
			.where('id', id)
			.update({ ...data, updatedAt: NTime.now() })
			.returning('*')

		return user
	}

	export const isActive = async (id: string) => {
		try {
			await Postgres.users().where('id', id).update({ activeAt: NTime.now() })
		} catch (ex: any) {
			Logger.error('activity', ex)
		}
	}

	export const sendForm = async (id: string, data: UserModel.form) => {
		await AdminNotice.sendForm(id, data)

		return 'success'
	}
}
