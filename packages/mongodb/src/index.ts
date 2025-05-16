import { APIKeyModel, BMSBlockModel } from '@notice-app/models'
import { randomUUID } from 'crypto'
import { MongoClient } from 'mongodb'

export type * from 'mongodb'

export namespace MongoDB {
	const client = new MongoClient(process.env.MONGODB_URL as string)
	const db = client.db(process.env.MONGODB_DBNAME)

	//---------------//
	// Init database //
	//---------------//

	export const init = async () => {
		// Blocks
		await blocks.createIndex({ isRoot: 1 })
		await blocks.createIndex({ type: 1 })
		await blocks.createIndex({ workspaceId: 1 })
		await blocks.createIndex({ rootId: 1 })
		await blocks.createIndex({ type: 1, workspaceId: 1, isRoot: 1, deletedAt: 1 })
		await blocks.createIndex({ 'preferences.domain': 1, _id: 1 })
		await blocks.createIndex({ 'preferences.domain': 1, deletedAt: 1 })
		await blocks.createIndex({ 'preferences.customDomain': 1, deletedAt: 1 })
		await blocks.createIndex(
			{ 'metadata.slug': 1 },
			{
				unique: true,
				partialFilterExpression: { type: 'page', 'metadata.slug': { $exists: true } },
			}
		)

		// Published Blocks
		await published_blocks.createIndex({ 'preferences.domain': 1 })
		await published_blocks.createIndex({ 'preferences.customDomain': 1 })
		await published_blocks.createIndex({ type: 1 })
		await published_blocks.createIndex({ rootId: 1 })
		await published_blocks.createIndex({ isRoot: 1 })
		await published_blocks.createIndex(
			{ 'metadata.slug': 1 },
			{
				unique: true,
				partialFilterExpression: { type: 'page', 'metadata.slug': { $exists: true } },
			}
		)
		await published_blocks.createIndex({ 'metadata.datePublished': -1 })

		// API Keys
		await api_keys.createIndex({ key: 1 })
	}

	//-----------------//
	// All Collections //
	//-----------------//

	export const blocks = db.collection<BMSBlockModel.block>('blocks')
	export const published_blocks = db.collection<BMSBlockModel.block>('published_blocks')
	export const api_keys = db.collection<APIKeyModel.full>('api_keys')

	//------------------//
	// Function Helpers //
	//------------------//

	export const uuid = () => randomUUID()
}
