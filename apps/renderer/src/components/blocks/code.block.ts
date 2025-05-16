import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'
import hljs from 'highlight.js'
import { MIXINS } from '../../tools/mixins.tool'

const MARKDOWN_LANGUAGE: { [key: string]: string } = {
	plain_text: '',
	html: 'html',
	javascript: 'js',
	typescript: 'ts',
	jsx: 'jsx',
	tsx: 'tsx',
	java: 'java',
	python: 'py',
	xml: 'xml',
	ruby: 'ruby',
	css: 'css',
	markdown: 'md',
	mysql: 'sql',
	json: 'json',
	golang: 'go',
	csharp: 'csharp',
	c_cpp: 'cpp',
	elixir: 'elixir',
}

export const CODE_BLOCK = {
	NAME: 'code' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { code } = data

		if (ctx.isExporting) {
			return html`<code class="code-content language-${data.language}">${code}</code>`
		}

		let highlightedCode = ''
		// Try to highlight the code with the specified language, if it fails, try to auto detect the language
		// This is necessary because we don't have the same libraries in the Editor, the language code are different
		// TODO: map the language code between the 2 libraries or find a better solution
		try {
			highlightedCode = hljs.highlight(data.language, code).value.replace(/<span /g, '<span class-prefix="none"')
		} catch (err) {
			// Highlight auto won't respect the editor user choice
			highlightedCode = hljs.highlightAuto(code).value.replace(/<span /g, '<span class-prefix="none"')
		}

		return html`
			<pre id="${_id}" class="NTC_block-code" class-prefix="none" data-is-copied="false">
				<code class="NTC_code-content hljs language-${data.language}" class-prefix="none">${highlightedCode}</code>
				<span class="code-actions">
					<span class="copy-action">
						<span class="idle-icon" onclick="$NTC.copyToClipBoard('${_id}')">${ICONS['copy-03'].HTML(14)}</span>
						<span class="active-icon">${ICONS['check-done-01'].HTML(14)}</span>
					</span>
				</span>
			</pre>
		`
	},
	CSS: css`
		.block-code {
			display: block;
			margin: 0;
			white-space: nowrap !important;
			word-wrap: normal;

			height: fit-content;
			position: relative;
			padding-top: var(--ntc-user-block-padding);
			padding-bottom: var(--ntc-user-block-padding);
		}

		.code-content {
			display: block;
			border-radius: var(--ntc-app-border-radius-sm);

			font-size: 14px;
			font-family: monospace !important;

			width: 100%;
			height: 100%;

			white-space: pre !important;
		}

		.code-content span {
			font-size: 14px;
			font-family: monospace, sans-serif !important;
		}

		.code-actions {
			position: absolute;
			display: block;
			white-space: nowrap !important;

			width: fit-content;
			margin: 0;

			top: calc(var(--ntc-app-top-pos-xxs) + 6px);
			right: calc(var(--ntc-app-top-pos-xxs) + 2px);
		}

		.block-code:hover .copy-action {
			display: flex;
		}

		.copy-action {
			display: none;
			align-items: center;
			justify-content: center;

			height: var(--ntc-app-sizing-sm);
			width: var(--ntc-app-sizing-sm);
			border-radius: var(--ntc-app-border-radius-sm);

			background-color: var(--ntc-light-bg-color);
			opacity: 1;
			transition: opacity 0.2s;
			cursor: pointer;
		}

		.copy-action:hover {
			opacity: 0.9;
		}

		.idle-icon {
			${MIXINS['flex-centered']}
			${MIXINS['size-100']}
		}

		.idle-icon svg {
			stroke: var(--ntc-user-font-color);
		}

		.active-icon {
			display: none;
		}

		.block-code[data-is-copied='true'] .idle-icon {
			display: none;
		}

		.block-code[data-is-copied='true'] .active-icon {
			display: flex;
		}
	`,
	JS: {
		async copyToClipBoard(id: string) {
			const codeBlock = document.getElementById(id) as HTMLElement

			if (!codeBlock) return null

			try {
				await navigator.clipboard.writeText(codeBlock.innerText)
				codeBlock.setAttribute('data-is-copied', 'true')

				setTimeout(() => {
					codeBlock.setAttribute('data-is-copied', 'false')
				}, 3000)
			} catch (err) {
				console.error('Failed to copy:', err)
			}
		},
	},
	MARKDOWN: (ctx) => `\`\`\`${MARKDOWN_LANGUAGE[ctx.block.data.language] ?? ''}\n${ctx.block.data.code}\n\`\`\``,
} satisfies RenderComponent<'block'>
