import { RenderComponent, html } from '@root/system'

export const SOCIAL_TWITTER_01_ICON = {
	NAME: 'social-twitter-01' as const,
	HTML: (size = 24, color = 'white') => {
		// prettier-ignore
		return html`<svg data-filled width="${size}" height="${size}" viewBox="0 0 24 24">
			<circle cx="12" cy="12" r="12" />
			<path d="M5.03407 5L10.4393 12.7218L5 19H6.22427L10.9865 13.5032L14.8341 19H19L13.2905 10.8439L18.3534 5H17.1292L12.7436 10.0623L9.2 5H5.03407ZM6.8344 5.96341H8.74821L17.1994 18.0366H15.2856L6.8344 5.96341Z" fill="${color}"
			/>
		</svg> `
	},
} satisfies RenderComponent<'icon'>
