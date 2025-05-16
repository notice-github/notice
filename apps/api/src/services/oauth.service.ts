import { AuthorizationCode } from 'simple-oauth2'

export namespace OAuthService {
	export type Provider = 'google' | 'github'

	type Providers = {
		[key in Provider]: {
			scopes: string[]
			userURL: string
			client: AuthorizationCode
		}
	}
	export const providers: Providers = {
		google: {
			scopes: ['profile', 'email'],
			userURL: 'https://www.googleapis.com/oauth2/v3/userinfo',
			client: new AuthorizationCode({
				client: {
					id: process.env.GCLOUD_CLIENT_ID!,
					secret: process.env.GCLOUD_CLIENT_SECRET!,
				},
				auth: {
					authorizeHost: 'https://accounts.google.com',
					authorizePath: '/o/oauth2/v2/auth',
					tokenHost: 'https://www.googleapis.com',
					tokenPath: '/oauth2/v4/token',
				},
			}),
		},
		github: {
			scopes: ['user'],
			userURL: 'https://api.github.com/user',
			client: new AuthorizationCode({
				client: {
					id: process.env.GITHUB_CLIENT_ID!,
					secret: process.env.GITHUB_CLIENT_SECRET!,
				},
				auth: {
					tokenHost: 'https://github.com',
					tokenPath: '/login/oauth/access_token',
					authorizePath: '/login/oauth/authorize',
				},
			}),
		},
	}

	export const normalizeUserData = (data: any, provider: Provider) => {
		switch (provider) {
			case 'google':
				return {
					id: data.sub,
					name: data.name,
					email: data.email.toLowerCase(),
					picture: data.picture,
				}
			case 'github':
				return {
					id: data.id,
					name: data.login,
					email: data.email.toLowerCase(),
					picture: data.avatar_url,
				}
		}
	}
}
