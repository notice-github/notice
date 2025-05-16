import axios from 'axios'
import dns from 'dns/promises'
import { Logger } from 'typerestjs'
import { BlockService } from './block.service'

export namespace DomainService {
	const hyve = axios.create({
		baseURL: 'https://hyve.notice.studio',
		headers: {
			Authorization: `Bearer ${process.env.HYVE_ADMIN_KEY}`,
		},
	})

	export const isValid = async (domain: string) => {
		try {
			const records = await dns.resolve4(domain)
			return records.find((record) => ['76.223.62.181', '13.248.172.137'].includes(record)) != undefined
		} catch (_) {
			return false
		}
	}

	export const isAlreadyUsed = async (domain: string) => {
		const block = await BlockService.getByDomain(domain)
		return block != undefined
	}

	export const addDomain = async (domain: string) => {
		try {
			await hyve.post('/api/add', { domain })
		} catch (ex: any) {
			Logger.error('domain', ex)
		}
	}

	export const delDomain = async (domain: string) => {
		try {
			await hyve.post('/api/remove', { domain })
		} catch (ex: any) {
			Logger.error('domain', ex)
		}
	}
}
