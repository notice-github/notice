import { Is, Schema, SchemaType } from 'typerestjs'
import { Consts } from '../tools/consts'

export namespace DomainSchema {
	/**
	 * @POST /domain/check/availability
	 */
	export const checkAvailability = {
		body: Is.object({
			domain: Is.string().regex(Consts.DOMAIN_REGEX),
		}),
		response: {
			200: Is.success(
				Is.object({
					check: Is.enum(['OK', 'KO']),
					reason: Is.enum(['already_used']).optional(),
				})
			),
		},
	} satisfies Schema
	export type checkAvailability = SchemaType<typeof checkAvailability>

	/**
	 * @POST /domain/check/dns
	 */
	export const checkDNS = {
		body: Is.object({
			domain: Is.string().regex(Consts.DOMAIN_REGEX),
		}),
		response: {
			200: Is.success(
				Is.object({
					check: Is.enum(['OK', 'KO']),
					reason: Is.enum(['not_configured']).optional(),
				})
			),
		},
	} satisfies Schema
	export type checkDNS = SchemaType<typeof checkDNS>

	/**
	 * @POST /domain/:blockId/setup
	 */
	export const setup = {
		params: Is.object({ blockId: Is.string().uuid() }),
		body: Is.object({
			domain: Is.string().regex(Consts.DOMAIN_REGEX),
		}),
		response: {
			200: Is.success(),
			409: Is.error('already_used').or(Is.error('invalid_domain')),
		},
	} satisfies Schema
	export type setup = SchemaType<typeof setup>

	/**
	 * @POST /domain/:blockId/apply
	 */
	export const apply = {
		params: Is.object({ blockId: Is.string().uuid() }),
		body: Is.object({
			domain: Is.string().regex(Consts.DOMAIN_REGEX),
		}),
		response: {
			200: Is.success(),
			409: Is.error('already_used').or(Is.error('invalid_domain')),
		},
	} satisfies Schema
	export type apply = SchemaType<typeof apply>

	/**
	 * @DELETE /domain/:blockId
	 */
	export const remove = {
		params: Is.object({ blockId: Is.string().uuid() }),
		response: {
			200: Is.success(),
		},
	} satisfies Schema
	export type remove = SchemaType<typeof remove>
}
