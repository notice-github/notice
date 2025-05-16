import { RenderComponent, html } from '@root/system'

export const JAVASCRIPT_BLOCK = {
	NAME: 'javascript' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block

		if (!data.code || typeof data.code !== 'string') return ''

		return html`
			<script id="${_id}" class="block-javascript">
				${data.code}
			</script>
		`
	},
} satisfies RenderComponent<'block'>
