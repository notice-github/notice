import { RenderComponent, html } from '@root/system'

export const DOWNLOAD_01_ICON = {
	NAME: 'download-01' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg width="${size}"height="${size}" viewBox="0 0 24 24"><path d="M21 15v4l-2 2H5l-2-2v-4m14-5-5 5m0 0-5-5m5 5V3" /></svg>`
	},
} satisfies RenderComponent<'icon'>
