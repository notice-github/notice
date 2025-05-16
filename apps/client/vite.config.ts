import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

import type { PluginOption } from 'vite'

export default defineConfig({
	clearScreen: false,
	server: {
		port: parseInt(process.env.PORT ?? '8080'),
	},
	build: {
		minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
	},
	define: {
		'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`,
		'process.env.STAGE': `"${process.env.STAGE}"`,
		'process.env.MIXPANEL_TOKEN': `"${process.env.MIXPANEL_TOKEN}"`,
	},
	plugins: [
		visualizer() as PluginOption,
		injectEnvHTML(),
		react({
			babel: {
				plugins: [
					[
						'babel-plugin-styled-components',
						{
							displayName: true,
							fileName: true,
						},
					],
				],
			},
		}),
	],
})

function injectEnvHTML() {
	return {
		name: 'inject-env-html',
		transformIndexHtml: {
			enforce: 'pre' as const,
			transform: (html: string) => {
				return html
					.replace(/{{STAGE}}/g, process.env.STAGE ?? 'development')
					.replace(/{{NODE_ENV}}/g, process.env.NODE_ENV ?? 'development')
			},
		},
	}
}
