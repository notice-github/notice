import { NEnv } from './env'

export namespace NUrls {
	//------------//
	// Notice App //
	//------------//

	export namespace App {
		export const client = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:3000'
				case 'staging':
					return 'https://app.notice-staging.studio'
				case 'production':
					return 'https://app.notice.studio'
			}
		}

		export const api = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:3001'
				case 'staging':
					return 'https://gimli.notice-staging.studio'
				case 'production':
					return 'https://gimli.notice.studio'
			}
		}

		export const renderer = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:3002'
				case 'staging':
					return 'https://gollum.notice-staging.studio'
				case 'production':
					return 'https://gollum.notice.studio'
			}
		}

		export const lighthouse = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:3003'
				case 'staging':
					return 'https://gandalf.notice-staging.studio'
				case 'production':
					return 'https://gandalf.notice.studio'
			}
		}

		export const files = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
				case 'staging':
					return 'https://files.notice-staging.studio'
				case 'production':
					return 'https://files.notice.studio'
			}
		}

		export const bdn = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return renderer()
				case 'staging':
					return 'https://bdn.notice-staging.studio'
				case 'production':
					return 'https://bdn.notice.studio'
			}
		}

		export const wildcardURL = (blockId?: string, cname?: string) => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return `${renderer()}/document/${blockId}`
				case 'staging':
					return cname && cname !== ''
						? `https://${cname}?stage=staging`
						: `https://${blockId}.notice.site?stage=staging`
				case 'production':
					return cname && cname !== '' ? `https://${cname}` : `https://${blockId}.notice.site`
			}
		}

		// TMP
		export const previewURL = (blockId: string) => {
			return `${renderer()}/document/${blockId}?mode=draft`
		}
	}

	//-----------//
	// Admin App //
	//-----------//

	export namespace Admin {
		export const client = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:4000'
				case 'staging':
					return 'https://admin.notice-staging.studio'
				case 'production':
					return 'https://admin.notice.studio'
			}
		}

		export const api = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:4001'
				case 'staging':
					return 'https://admin-api.notice-staging.studio'
				case 'production':
					return 'https://admin-api.notice.studio'
			}
		}
	}

	//------------//
	// Public API //
	//------------//

	export namespace PublicAPI {
		export const api = () => {
			switch (NEnv.STAGE) {
				case 'development':
				case 'testing':
					return 'http://localhost:5000'
				case 'staging':
				case 'production':
					return 'https://api.notice.studio'
			}
		}
	}
}
