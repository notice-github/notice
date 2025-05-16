export namespace NEnv {
	export type STAGE = 'development' | 'staging' | 'testing' | 'production'
	export const STAGE = process.env.STAGE as STAGE

	export type NODE_ENV = 'development' | 'production'
	export const NODE_ENV = process.env.NODE_ENV as NODE_ENV

	export type PORT = number
	export const PORT = parseInt(process.env.PORT ?? '8080') as PORT

	export type HOST = string
	export const HOST = process.env.HOST ?? 'localhost'
}
