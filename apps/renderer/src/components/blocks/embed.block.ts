import { RenderComponent, css, html } from '@root/system'

export const EMBED_BLOCK = {
	NAME: 'embed' as const,
	HTML: (ctx) => {
		const { _id, url, service } = ctx.block.data

		if (service === 'twitter') return ''
		return html`
			<div id="${_id}" class="block-embed embed-${service}">
				<iframe class="embed-iframe" src="${url}" allowfullscreen></iframe>
			</div>
		`
	},
	// TODO: why don't we use the shared embeds.ts file that contains a style object?
	// please @Ragool switch to using the embeds.ts in `utils`, it makes developing new embeds much easier
	// The only difficulty is to transform the style object to proper CSS
	CSS: css`
		.block-embed {
			margin: var(--ntc-app-spacing-lg) 0;
			width: 100%;
		}

		.embed-iframe {
			top: 0;
			left: 0;
			border: 0;

			width: 100%;
			height: 100%;
		}

		.embed-vimeo {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
		.embed-youtube {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
		.embed-coub {
			width: 580px;
			height: 320px;
		}
		.embed-airtable {
			width: 100%;
			height: 500px;
		}
		.embed-vine {
			width: 580px;
			height: 320px;
			aspect-ratio: 16 / 9;
		}
		.embed-imgur {
			width: 540px;
			height: 500px;
		}
		.embed-gfycat {
			width: 580px;
			height: 436px;
		}
		.embed-twitch-channel {
			width: 600px;
			height: 366px;
		}
		.embed-twitch-video {
			width: 600px;
			height: 366px;
		}
		.embed-yandex-music-album {
			width: 540px;
			height: 400px;
		}
		.embed-yandex-music-track {
			width: 540px;
			height: 100px;
		}
		.embed-yandex-music-playlist {
			width: 540px;
			height: 400px;
		}
		.embed-codepen {
			width: 300px;
			height: 600px;
		}
		.embed-instagram {
			width: 505px;
			height: 400px;
		}
		.embed-twitter {
			width: 550px;
			height: 250px;
		}
		.embed-pinterest {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
		.embed-facebook {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
		.embed-aparat {
			width: 600px;
			height: 300px;
		}
		.embed-miro {
			width: 700px;
			height: 500px;
		}
		.embed-timeTonic {
			width: 100%;
			height: 800px;
		}
		.embed-loom {
			width: 100%;
			aspect-ratio: 16 / 9;
		}
	`,
} satisfies RenderComponent<'block'>
