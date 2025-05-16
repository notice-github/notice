import { RenderComponent, css, html } from '@root/system'

export const VIDEO_BLOCK = {
	NAME: 'video' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { url, aspectRatio } = data.file

		return html`
			<video
				id="${_id}"
				class="block-video"
				src="${url}"
				style="aspect-ratio: ${aspectRatio ?? '16 / 9'}"
				controls
			></video>
		`
	},
	CSS: css`
		.block-video {
			outline: none;
			margin: auto;

			width: 100%;
			height: fit-content;
		}
	`,
	MARKDOWN: (ctx) => `![video](${ctx.block.data.file.url})`,
} satisfies RenderComponent<'block'>
