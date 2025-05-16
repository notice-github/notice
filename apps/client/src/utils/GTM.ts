import { NEnv } from '@notice-app/utils'

export namespace GTM {
	export const send = (data: Record<string, string | undefined>) => {
		if (NEnv.STAGE !== 'production') return

		;(window as any).dataLayer ??= []
		;(window as any).dataLayer.push(data)
	}
}
