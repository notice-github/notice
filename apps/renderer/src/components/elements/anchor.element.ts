import { $NTC, RenderComponent, css, html } from '@root/system'
import { Helpers } from '@root/tools/helpers.tool'
import { MIXINS } from '@root/tools/mixins.tool'

export const ANCHOR_ELEMENT = {
	NAME: 'anchor' as const,
	HTML: (ctx) => {
		const headers = ctx.block.blocks
			.filter((block) => block.type === 'header-1' || block.type === 'header-2' || block.type === 'header-3')
			.filter((header) => Helpers.leavesToText(header.data.leaves).trim() !== '')
		if (headers.length === 0) return ''

		return html`
			<div class="anchor-sticky-container">
				<div class="anchors-list-container">
					<h5>${ctx.textOf('OnThisPage', 'On This Page')}</h5>
					${headers
						.map((header) => {
							const leavesText = Helpers.leavesToText(header.data.leaves)

							const split_id = header._id.slice(0, 4)

							// get the same heading id matching the one inside the document
							const slug = Helpers.slugOf(leavesText) + '-' + split_id

							return html`
								<div
									id="anchor_${slug}"
									onclick="$NTC.navigateToAndSetAnchor('${slug}')"
									class="anchor-link anchor-${header.type}"
								>
									${leavesText}
								</div>
							`
						})
						.join('')}
				</div>
			</div>
		`
	},
	CSS: css`
		.anchor-sticky-container {
			box-sizing: border-box;
			position: sticky;
			top: var(--ntc-app-spacing-xl);

			display: none;

			width: var(--ntc-app-sizing-3xl);
			height: fit-content;

			justify-content: center;

			margin: 0 auto;
		}

		.anchors-list-container {
			width: 100%;
			height: auto;
			max-height: calc(var(--ntc-app-sizing-3xl) + var(--ntc-app-sizing-3xl));

			gap: var(--ntc-app-spacing-lg);
			overflow: auto;

			${MIXINS['flex-column-align-start']}

			justify-content: flex-start;

			padding: var(--ntc-app-spacing-md);
			margin-top: var(--ntc-app-spacing-3xl);
			margin-left: calc(var(--ntc-app-spacing-3xl) + var(--ntc-app-spacing-2xl) * 2);
		}

		.anchors-list-container h5 {
			font-size: 0.8em;
			color: var(--ntc-light-font-color);
			font-weight: var(--ntc-app-font-weight-xl);
		}

		.anchor-link {
			flex-shrink: 0;
			font-size: 0.9em;
			font-weight: var(--ntc-app-font-weight-sm);

			padding: 0 var(--ntc-app-spacing-sm);

			height: auto;
			width: 100%;

			max-width: calc(var(--ntc-app-sizing-2xl) + var(--ntc-app-sizing-lg));
			border-left: 2px solid transparent;

			transition: all 0.2s;
			color: inherit;
			cursor: pointer;

			${MIXINS['text-ellipsis']}
		}

		.anchor-link:hover {
			border-left: 2px solid var(--ntc-user-accent-color);
			color: var(--ntc-user-accent-color);
		}

		.anchor-active {
			border-left: 2px solid var(--ntc-user-accent-color);
			color: var(--ntc-user-accent-color);
		}

		.anchor-header-1 {
			padding-left: var(--ntc-app-spacing-xl);
		}
		.anchor-header-2 {
			padding-left: var(--ntc-app-spacing-2xl);
		}
		.anchor-header-3 {
			padding-left: var(--ntc-app-spacing-3xl);
		}

		@container wrapper (min-width: 1240px) {
			.anchor-sticky-container {
				display: flex;
			}
		}
	`,
	JS: {
		/**
		 * remove all previous active class from anchor link
		 * get the current selection from the user using id and add the active class to
		 * the anchor link
		 */
		highlightActiveAnchor(anchorId: string) {
			if (!anchorId) return

			const anchorElements = document.querySelectorAll('.NTC_anchor-link')
			anchorElements.forEach((anchorElement) => {
				anchorElement.classList.remove('NTC_anchor-active')
			})

			const anchorLink = document.getElementById(`anchor_${anchorId}`)
			if (anchorLink) anchorLink.classList.add('NTC_anchor-active')
		},

		navigateToAnchor(anchorIdParam?: string) {
			const anchorId = anchorIdParam ?? window.location.hash.slice(1)
			if (!anchorId) return

			$NTC.highlightActiveAnchor(anchorId)

			const target = $NTC.wrapper.querySelector(`*[slug-id='${anchorId}'`)
			if (!target) return

			target.scrollIntoView({ behavior: 'smooth' })
		},

		navigateToAndSetAnchor(anchorId: string) {
			if (!anchorId) return

			// Using replace to avoid adding a new entry in the history stack
			// and triggering the popstate event / hashchange event / etc.
			window.location.replace('#' + anchorId.replace(/^#/, ''))

			$NTC.navigateToAnchor(anchorId)
		},
	},
} satisfies RenderComponent<'element'>
