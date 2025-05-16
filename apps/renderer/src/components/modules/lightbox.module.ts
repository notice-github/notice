import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const LIGHTBOX_MODULE = {
	NAME: 'lightbox' as const,
	HTML: (ctx) => {
		return html`
			<dialog class="image-viewer" onclick="$NTC.closeExpandedImage()">
				<div class="centered-img-wrapper">
					<img class="expanded-img" alt="" />
				</div>
				<div class="image-toolbar" onclick="$NTC.stopPropagation(event)">
					<div class="toolbar-name-icon">
						${ICONS['image-03'].HTML(18)}
						<span class="toolbar-image-name" data-placeholder="${ctx.textOf('Untitled', 'Untitled')}"></span>
					</div>
					<div class="image-toolbar-tools">
						<div class="tool-icon-container download-button" onclick="$NTC.onImageDownload()">
							${ICONS['download-01'].HTML(20)}
						</div>
						<div class="download-loader"></div>
						<div class="tool-icon-container" onclick="$NTC.closeExpandedImage()">${ICONS['x-close'].HTML(20)}</div>
					</div>
				</div>
			</dialog>
		`
	},
	CSS: css`
		.image-viewer {
			background: transparent !important;

			border: none;
			margin: 0;
			padding: 0;

			max-width: 100%;
			max-height: 100%;

			width: 100%;
			height: 100%;

			cursor: zoom-out;
			outline: none;
		}

		.image-viewer::backdrop {
			background: rgba(0, 0, 0, 0.85);
		}

		.centered-img-wrapper {
			position: absolute;
			top: 50%;
			left: 50%;

			width: 100%;
			height: calc(100% - 2 * 24px - 68px);

			transform: translate(-50%, -50%);
			padding: var(--ntc-app-spacing-2xl);
			overflow: auto;

			${MIXINS['flex-centered']}

			flex-grow: 1;
		}

		.expanded-img {
			max-width: 100%;
			max-height: 100%;

			animation-name: zoom;
			animation-duration: 3ms;
		}

		.image-toolbar {
			position: absolute;

			width: 100%;
			padding: var(--ntc-app-spacing-xl);

			background: #232529;
			color: white;

			${MIXINS['flex-row-space-between']}
			flex-wrap: wrap;
			cursor: default;
		}

		.image-toolbar svg {
			stroke: white;
		}

		.toolbar-name-icon {
			user-select: none;
			gap: var(--ntc-app-spacing-sm);
			width: 40%;

			${MIXINS['flex-row-start']}
		}

		.toolbar-name-icon span {
			${MIXINS['text-ellipsis']}
		}

		.toolbar-name-icon svg {
			flex-shrink: 0;
		}

		.image-toolbar-tools {
			${MIXINS['flex-row-end']}
			gap: var(--ntc-app-spacing-md);
		}

		.tool-icon-container {
			background: transparent;

			border-radius: var(--ntc-app-border-radius-round);
			padding: var(--ntc-app-spacing-md);

			transition: background-color 0.2s ease-in-out;
			${MIXINS['flex-centered']}
			cursor: pointer;
		}

		.tool-icon-container:hover {
			background: #08090a;
		}

		.image-toolbar-tools[data-is-loading='true'] .download-button {
			display: none;
		}

		.image-toolbar-tools[data-is-loading='true'] .download-loader {
			display: block;
		}

		.image-zoom-control {
			width: fit-content;
			height: fit-content;

			${MIXINS['flex-row-centered']}

			border: 1px solid white;
			border-radius: var(--ntc-app-border-radius-xs);
			gap: var(--ntc-app-spacing-md);
			user-select: none;
		}
	`,
	JS: {
		getLightBoxElements() {
			const imageDialog = $NTC.wrapper.querySelector('.NTC_image-viewer') as HTMLDialogElement
			const expandedImage = imageDialog.querySelector('.NTC_expanded-img') as HTMLImageElement
			const imageName = imageDialog.querySelector('.NTC_toolbar-image-name')
			const toolBar = imageDialog.querySelector('.NTC_image-toolbar-tools')

			return { imageDialog, expandedImage, imageName, toolBar }
		},

		expandImage(url: string, aspectRatio: string | null, originalName: string | null) {
			const { imageDialog, expandedImage, imageName } = $NTC.getLightBoxElements()
			const imageNamePlaceholder = (imageName as HTMLSpanElement).getAttribute('data-placeholder')

			expandedImage.setAttribute('src', url)
			imageName.textContent = originalName || imageNamePlaceholder
			expandedImage.style.aspectRatio = aspectRatio ?? 'auto'

			imageDialog.showModal()

			const onClose = () => {
				$NTC.closeExpandedImage()
				imageDialog.removeEventListener('close', onClose)

				imageDialog.addEventListener('close', onClose)
			}
		},

		closeExpandedImage() {
			const { imageDialog, expandedImage, imageName } = $NTC.getLightBoxElements()
			imageDialog.close()
			expandedImage.removeAttribute('src')
			expandedImage.removeAttribute('style')

			imageName.textContent = ''
		},

		async onImageDownload() {
			const { expandedImage, imageName, toolBar } = $NTC.getLightBoxElements()

			const imageSrc = expandedImage.getAttribute('src')
			const fileName = imageName.textContent

			toolBar.setAttribute('data-is-loading', 'true')
			try {
				const image = await fetch(imageSrc)
				const imageBlog = await image.blob()
				const imageURL = URL.createObjectURL(imageBlog)

				const link = document.createElement('a')
				link.href = imageURL
				link.download = fileName
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				toolBar.removeAttribute('data-is-loading')
			} catch (e) {
				toolBar.removeAttribute('data-is-loading')
				console.log('sorry something went wrong !!!')
			}
		},
	},
} satisfies RenderComponent<'module'>
