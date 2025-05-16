import { ICONS } from '@root/components/icons'
import { RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'

export const DOCUMENT_BLOCK = {
	NAME: 'document' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { url, size, originalName } = data.file

		const convertedSize = Helpers.sizeConverter(size)

		return html`
			<div id="${_id}" class="block-document">
				<div class="icon-container">${ICONS['file-06'].HTML(18)}</div>
				<div class="document-meta-container">
					<div class="document-name">${originalName}</div>
					<div class="document-size">${convertedSize}</div>
				</div>
				<div class="document-download-container">
					<div class="icon-button-container" onclick="$NTC.onDocumentDownload('${_id}', '${url}')">
						${ICONS['download-01'].HTML(18)}
					</div>
					<div class="download-loader"></div>
				</div>
			</div>
		`
	},
	CSS: css`
		.block-document {
			${MIXINS['flex-row-start']}
			gap: var(--ntc-app-spacing-lg);
			padding: var(--ntc-app-spacing-md);

			width: 100%;

			box-sizing: border-box;
			border: var(--ntc-user-border-width) solid var(--ntc-user-border-color);
			border-radius: var(--ntc-app-border-radius-md);
			margin: 0 8px 8px 0;
		}

		.block-document div:not(:nth-child(2)) {
			flex-shrink: 0;
		}

		.icon-container {
			width: var(--ntc-app-sizing-md);
			height: var(--ntc-app-sizing-md);

			border-radius: var(--ntc-app-border-radius-md);
			background-color: var(--ntc-light-bg-color);

			${MIXINS['flex-centered']}
		}

		.document-meta-container {
			${MIXINS['flex-column-centered']}
			width: 100%;
			gap: var(--ntc-app-spacing-xs);

			${MIXINS['text-ellipsis']}
		}

		.document-name {
			width: 100%;
			font-size: 14px;
			font-weight: var(--ntc-app-font-size-sm);
			color: var(--ntc-user-font-color);

			${MIXINS['text-ellipsis']}
		}

		.document-size {
			width: 100%;
			font-size: 12px;
			font-weight: var(--ntc-app-font-size-sm);
			color: var(--ntc-light-font-color);

			${MIXINS['text-ellipsis']}
		}

		.download-loader {
			display: none;
			height: var(--ntc-app-sizing-sm);
			width: var(--ntc-app-sizing-sm);
		}

		.document-download-container[data-is-downloading='true'] div:nth-child(2) {
			display: block;
		}
		.document-download-container[data-is-downloading='true'] div:nth-child(1) {
			display: none;
		}
	`,
	JS: {
		async onDocumentDownload(id: string, url: string) {
			const documentContainer = document.getElementById(id)
			const downloadContainer = documentContainer.querySelector('.NTC_document-download-container') as HTMLDivElement
			const documentNameContainer = documentContainer.querySelector('.NTC_document-name') as HTMLDivElement

			const fileName = documentNameContainer.textContent

			downloadContainer.setAttribute('data-is-downloading', 'true')
			try {
				const documentUrl = await fetch(url)
				const documentBlob = await documentUrl.blob()
				const imageURL = URL.createObjectURL(documentBlob)

				const link = document.createElement('a')
				link.href = imageURL
				link.download = fileName
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				downloadContainer.removeAttribute('data-is-downloading')
			} catch (e) {
				downloadContainer.removeAttribute('data-is-downloading')
				console.log('sorry something went wrong !!!')
			}
		},
	},
	MARKDOWN: (ctx) => ``,
} satisfies RenderComponent<'block'>
