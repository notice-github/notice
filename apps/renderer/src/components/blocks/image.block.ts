import { RenderComponent, css, html } from '@root/system'

export const IMAGE_BLOCK = {
	NAME: 'image' as const,
	HTML: (ctx) => {
		const { _id, data } = ctx.block
		const { width } = data
		const { url, aspectRatio, originalName, description = '' } = data.file

		let clasx = 'block-image'
		if (data.alignment) clasx += ` image-align-${data.alignment}`

		/*
		 	/!\ BEFORE CHAGING THE ASPECT-RATIO LOGIC AGAIN /!\
			         CALL ME ON SLACK (@JONAS ROUSSEL)
		*/

		let imgStyle = ''
		if (width) imgStyle += `max-width: ${width}; `
		if (aspectRatio) imgStyle += `aspect-ratio: ${aspectRatio}`

		if (ctx.isExporting) {
			return html` <img class="image-img" src="${url}" style="${imgStyle}" alt="" /> `
		}

		return html`
			<div id="${_id}" class="${clasx}">
				<img
					class="image-img"
					src="${url}"
					style="${imgStyle}"
					alt="${description}"
					onclick="$NTC.expandImage('${url}', ${aspectRatio ?? 'undefined'}, '${originalName}')"
				/>
			</div>
		`
	},
	CSS: css`
		.block-image {
			display: flex;
			width: 100%;
			padding-top: var(--ntc-user-block-padding);
			padding-bottom: var(--ntc-user-block-padding);
			box-sizing: content-box;
			cursor: zoom-in;
		}

		.image-align-start {
			justify-content: flex-start;
		}
		.image-align-center {
			justify-content: center;
		}
		.image-align-flex-end {
			justify-content: flex-end;
		}

		.image-img {
			object-fit: contain;
			width: 100%;

			background-color: transparent;
		}
	`,
	MARKDOWN: (ctx) => `![image](${ctx.block.data.file.url})`,
} satisfies RenderComponent<'block'>
