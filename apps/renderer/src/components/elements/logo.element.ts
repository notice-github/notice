import { RenderComponent, css, html } from '@root/system'

export const LOGO_ELEMENT = {
	NAME: 'logo' as const,
	HTML: (ctx) => {
		const { websiteUrl, logoUrl } = ctx.rootBlock.preferences ?? {}

		if (!logoUrl) return ''

		const isValidUrl = (urlString: string) => {
			//SOURCE: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
			var urlPattern = new RegExp(
				'^(https?:\\/\\/)?' + // validate protocol
					'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
					'((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
					'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
					'(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
					'(\\#[-a-z\\d_]*)?$',
				'i'
			) // validate fragment locator
			return !!urlPattern.test(urlString)
		}

		const isAnUrl = isValidUrl(websiteUrl)
		const newWebsiteUrl = websiteUrl && websiteUrl.includes('http') ? websiteUrl : 'https://' + websiteUrl

		const onclick = isAnUrl ? `onclick="$NTC.openUserWebsite('${newWebsiteUrl}')" ` : ''

		return html`
			<div data-is-clickable="${isAnUrl}" class="logo-element" ${onclick}>
				<img src="${logoUrl}" class="logo-img" alt="logo" />
			</div>
		`
	},
	CSS: css`
		.logo-element {
			flex-shrink: 0;

			height: var(--ntc-app-sizing-xs);
			width: var(--ntc-app-sizing-xs);
			border-radius: var(--ntc-app-border-radius-md);

			transition: opacity 0.2s ease-in-out;
		}

		.logo-element[data-is-clickable='true'] {
			cursor: pointer;
		}

		.allow_click:hover {
			opacity: 0.8;
		}

		.logo-img {
			width: 100%;
			height: 100%;
			object-fit: contain;
			background-color: transparent;
		}

		@container wrapper (min-width: 768px) {
			.logo-element {
				height: var(--ntc-app-sizing-sm);
				width: var(--ntc-app-sizing-sm);
			}
		}

		@container wrapper (min-width: 1240px) {
			.logo-element {
				height: var(--ntc-app-sizing-md);
				width: var(--ntc-app-sizing-md);
			}
		}
	`,
	JS: {
		openUserWebsite(website) {
			if (!website) return
			window.open(website, '_blank')
		},
	},
} satisfies RenderComponent<'element'>
