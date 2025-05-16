import { RenderComponent, css, html } from '@root/system'

export const AUDIO_BLOCK = {
	NAME: 'audio' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { url } = data.file

		return html`
			<audio id="${_id}" class="block-audio" controls>
				<source src="${url}" />
			</audio>
		`
	},
	CSS: css`
		.block-audio {
			margin: var(--ntc-user-block-padding) 0;
		}
	`,
	MARKDOWN: (ctx) => `![audio](${ctx.block.data.file.url})`,
} satisfies RenderComponent<'block'>
