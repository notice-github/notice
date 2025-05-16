import { NEnv, NSystem } from '@notice-app/tools'
import axios from 'axios'
import { Logger } from 'typerestjs'

export namespace CacheService {
	export const purgeCache = async (id: string) => {
		if (NEnv.NODE_ENV !== 'production') return

		try {
			await axios.post(
				`https://api.bunny.net/pullzone/${process.env.BUNNY_PZ_ID}/purgeCache`,
				{ CacheTag: id },
				{ headers: { AccessKey: process.env.BUNNY_ACCESS_KEY! } }
			)

			await NSystem.sleep(1000)
		} catch (_) {
			Logger.error('bunny', `Bunny failed to purge cache of ${id}`)
		}
	}
}
