import { TransactionModel } from '@notice-app/models'
import { Postgres } from '@notice-app/postgres'

export namespace TransactionService {
	export const addTokenTransaction = async (
		params: Pick<TransactionModel.full, 'source' | 'amount' | 'userId' | 'workspaceId'>
	) => {
		await Postgres.transactions().insert({
			id: Postgres.uuid(),
			type: 'token',
			source: params.source,
			amount: params.amount,
			userId: params.userId,
			workspaceId: params.workspaceId,
		})
	}

	export const getTokenTransactions = async (workspaceId: string) => {
		const transactions = await Postgres.transactions()
			.where({
				workspaceId: workspaceId,
				type: 'token',
			})
			.orderBy('createdAt', 'desc')
			.limit(1000)

		return transactions
	}
}
