import {
	CodeModel,
	FileModel,
	LicenceModel,
	PermissionModel,
	SubscriptionModel,
	TransactionModel,
	UserModel,
	WorkspaceInfosModel,
	WorkspaceModel,
} from '@notice-app/models'
import { randomUUID } from 'crypto'
import knex from 'knex'

export type * from 'knex'

export namespace Postgres {
	const db = knex({
		client: 'pg',
		connection: {
			host: process.env.PG_HOST,
			port: parseInt(process.env.PG_PORT ?? '5432'),
			user: process.env.PG_USER,
			password: process.env.PG_PWD,
			database: process.env.PG_DB,
		},
	})

	//---------------//
	// Init database //
	//---------------//

	export const init = async () => {
		if (!(await db.schema.hasTable('workspaces'))) {
			await db.schema.createTable('workspaces', (table) => WorkspaceModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('workspaceInfos'))) {
			await db.schema.createTable('workspaceInfos', (table) => WorkspaceInfosModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('users'))) {
			await db.schema.createTable('users', (table) => UserModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('files'))) {
			await db.schema.createTable('files', (table) => FileModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('permissions'))) {
			await db.schema.createTable('permissions', (table) => PermissionModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('subscriptions'))) {
			await db.schema.createTable('subscriptions', (table) => SubscriptionModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('codes'))) {
			await db.schema.createTable('codes', (table) => CodeModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('transactions'))) {
			await db.schema.createTable('transactions', (table) => TransactionModel.table(table, db.fn))
		}
		if (!(await db.schema.hasTable('licenses'))) {
			await db.schema.createTable('licenses', (table) => LicenceModel.table(table, db.fn))
		}
	}

	//------------//
	// All Tables //
	//------------//

	export const codes = () => db<CodeModel.full>('codes')
	export const files = () => db<FileModel.full>('files')
	export const licenses = () => db<LicenceModel.full>('licenses')
	export const permissions = () => db<PermissionModel.full>('permissions')
	export const subscriptions = () => db<SubscriptionModel.full>('subscriptions')
	export const transactions = () => db<TransactionModel.full>('transactions')
	export const users = () => db<UserModel.full>('users')
	export const workspaces = () => db<WorkspaceModel.full>('workspaces')
	export const workspaceInfos = () => db<WorkspaceInfosModel.full>('workspaceInfos')

	//------------------//
	// Function Helpers //
	//------------------//

	export const uuid = () => randomUUID()
	export const now = () => db.fn.now()
	export const raw = (sql: string) => db.raw(sql)
}
