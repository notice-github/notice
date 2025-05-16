import { Handler } from 'typerestjs'
import { DomainSchema } from '../schemas/domain.schema'
import { BlockService } from '../services/block.service'
import { DomainService } from '../services/domain.service'
import { PublishedBlockService } from '../services/published-block.service'
import { NSystem } from '@notice-app/tools'

export namespace DomainController {
	export const checkAvailability: Handler<DomainSchema.checkAvailability> = async (req, reply) => {
		const isUsed = await DomainService.isAlreadyUsed(req.body.domain)

		if (!isUsed) {
			return reply.success(200, { check: 'OK' })
		} else {
			return reply.success(200, { check: 'KO', reason: 'already_used' })
		}
	}

	export const checkDNS: Handler<DomainSchema.checkDNS> = async (req, reply) => {
		const isValid = await DomainService.isValid(req.body.domain)

		if (isValid) {
			return reply.success(200, { check: 'OK' })
		} else {
			return reply.success(200, { check: 'KO', reason: 'not_configured' })
		}
	}

	export const setup: Handler<DomainSchema.setup> = async (req, reply) => {
		const isUsed = await DomainService.isAlreadyUsed(req.body.domain)
		if (isUsed) return reply.error(409, 'already_used')

		const isValid = await DomainService.isValid(req.body.domain)
		if (!isValid) return reply.error(409, 'invalid_domain')

		await DomainService.addDomain(req.body.domain)

		return reply.success(200)
	}

	export const apply: Handler<DomainSchema.apply> = async (req, reply) => {
		const isUsed = await DomainService.isAlreadyUsed(req.body.domain)
		if (isUsed) return reply.error(409, 'already_used')

		const isValid = await DomainService.isValid(req.body.domain)
		if (!isValid) return reply.error(409, 'invalid_domain')

		await BlockService.update(req.block._id, { preferences: { customDomain: req.body.domain } })
		try {
			await PublishedBlockService.update(req.block._id, { preferences: { customDomain: req.body.domain } })
		} catch (_) {}

		return reply.success(200)
	}

	export const remove: Handler<DomainSchema.remove> = async (req, reply) => {
		const domain = req.block.preferences?.customDomain
		if (!domain) return reply.success(200)

		await DomainService.delDomain(domain)

		await BlockService.update(req.block._id, { preferences: { customDomain: null } })
		try {
			await PublishedBlockService.update(req.block._id, { preferences: { customDomain: null } })
		} catch (_) {}

		return reply.success(200)
	}
}
