import { Middleware } from 'typerestjs'

interface RateLimitOptions {
	max: number
	timeWindow: number // in milliseconds
}

interface RateLimitRecord {
	count: number
	resetTime: number
}

const requestMap = new Map<string, RateLimitRecord>()

// Clean up old entries every 5 minutes
setInterval(
	() => {
		const now = Date.now()
		for (const [key, record] of requestMap.entries()) {
			if (record.resetTime < now) {
				requestMap.delete(key)
			}
		}
	},
	5 * 60 * 1000
)

export namespace SimpleRateLimitMiddleware {
	export const rateLimit = (options: RateLimitOptions): Middleware => {
		return async (req, reply) => {
			const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
			const key = `${clientIp}:${req.method}:${req.url}`
			const now = Date.now()

			let record = requestMap.get(key)
			if (!record || record.resetTime < now) {
				record = {
					count: 1,
					resetTime: now + options.timeWindow,
				}
				requestMap.set(key, record)
			} else {
				record.count++
				if (record.count > options.max) {
					return reply
						.custom()
						.status(429)
						.headers({
							'X-RateLimit-Limit': options.max.toString(),
							'X-RateLimit-Remaining': '0',
							'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000).toString(),
						})
						.send({ error: 'too_many_requests', message: 'Rate limit exceeded' })
				}
			}

			// Add rate limit headers
			reply.custom().headers({
				'X-RateLimit-Limit': options.max.toString(),
				'X-RateLimit-Remaining': (options.max - record.count).toString(),
				'X-RateLimit-Reset': Math.ceil(record.resetTime / 1000).toString(),
			})
		}
	}
}
