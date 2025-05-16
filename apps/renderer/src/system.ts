import { ContextService } from './services/context.service'
import { LayoutService } from './services/layout.service'

export type $NTCType = {
	wrapper: HTMLDivElement
	blockId: string
	rootId: string
	serverURL: string
	lighthouseURL: string
	navigationType: 'query' | 'slash' | 'memory'
	theme: 'dark' | 'light'
	lang: string
	baseURL: string
	slugs: { [key: string]: string }
} & { [key: string]: any }

export const $NTC: $NTCType = {} as any

export type RenderFunctions = {
	block: (ctx: ContextService.Context) => string
	space: (ctx: ContextService.Context) => string
	element: (ctx: ContextService.Context, ...params: any[]) => string
	icon: (size: number, color?: string) => string
	module: (...params: any[]) => string
	leaf: (text: string, value?: any) => string
}

export interface RenderComponent<T extends 'block' | 'space' | 'element' | 'icon' | 'module' | 'leaf'> {
	// Component Identity
	NAME: string

	// Render Functions
	HTML: RenderFunctions[T]
	MARKDOWN?: RenderFunctions[T]

	// HTML Sides
	CSS?: string
	JS?: { [key: string]: (...args: any[]) => any }
	METADATA?: (ctx: ContextService.Context) => any
}

/**
 * Fake the behaviour of lit-html vscode extesion
 * Github Repo: https://github.com/mjbvz/vscode-lit-html
 */
export const html = (strings: TemplateStringsArray, ...values: any[]) => {
	return strings.reduce((acc, curr, idx) => acc + curr + (values[idx] ?? ''), '')
}

/**
 * Fake the behaviour of vscode-styled-components vscode extension
 * Github repo: https://github.com/styled-components/vscode-styled-components
 */
export const css = (strings: TemplateStringsArray, ...values: any[]) => {
	return strings.reduce((acc, curr, idx) => acc + curr + (values[idx] ?? ''), '')
}
