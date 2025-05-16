import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'

export const SEARCH_RESULTS_ELEMENT = {
	NAME: 'search_results' as const,
	HTML: (ctx) => {
		// /!\ NOT POSSIBLE
		// const { top_space } = ctx.rootBlock?.layout || {}

		// const emptySearchMessage = top_space?.contact_form.show
		// 	? html`
		// 			<span>${ctx.textOf('NoResultsForYourSearchContactForm', 'No results for your search, Need help?')}</span>
		// 			<div class="search-contact-button" onclick="$NTC.openContactForm()">
		// 				${ctx.textOf('ClickHereToContactUs', 'Click here to contact us')}
		// 			</div>
		// 	  `
		// 	: html` <span>${ctx.textOf('NoResultsForYourSearch', 'No results for your search.')}</span> `

		return html`
			<div class="search-results-panel">
				<div class="search-loader"></div>
				<div class="search-is-empty">
					<span>${ctx.textOf('NoResultsForYourSearch', 'No results for your search.')}</span>
				</div>
				<div class="search-has-error">${ctx.textOf('UnexpectedError', 'Sorry, an unexpected error occurred')}</div>
			</div>
		`
	},

	CSS: css`
		.search-results-panel {
			${MIXINS['flex-column']}
			${MIXINS['size-100']}
			max-height: calc(90px * 5.5);

			display: none;
			align-items: center;
			box-sizing: border-box;
			overflow: auto;

			padding: var(--ntc-app-spacing-xl);
			gap: var(--ntc-app-spacing-md);
			cursor: default;
		}

		.search-wrapper[data-has-results='true'] > .search-results-panel {
			display: flex;
		}

		.search-results-link {
			gap: var(--ntc-app-spacing-sm);
			padding: var(--ntc-app-spacing-lg);

			background-color: transparent;
			transition: all 0.1s ease-in-out;
			border-radius: var(--ntc-app-border-radius-sm);
			color: var(--ntc-user-font-color);
			cursor: pointer;

			${MIXINS['flex-column-align-start']}
			${MIXINS['size-100']}
		}

		.search-results-link > h3 {
			width: 100%;

			font-size: 1em !important;
			font-weight: bold !important;
			${MIXINS['multiline-ellipsis']}
		}

		.search-results-link:hover {
			background-color: var(--ntc-light-bg-color);
		}

		.search-results-text {
			width: 100%;
			font-size: 0.9375em;

			${MIXINS['multiline-ellipsis']}
		}

		.search-loader {
			width: var(--ntc-app-sizing-md);
			height: var(--ntc-app-sizing-md);

			border: 3px solid var(--ntc-user-accent-color);
			border-bottom-color: transparent;
			border-radius: var(--ntc-app-border-radius-round);
			display: none;
			box-sizing: border-box;
			animation: rotation 1s linear infinite;
		}

		.search-results-panel[data-is-loading='true'] > .search-loader {
			display: inline-block;
		}

		.search-is-empty {
			${MIXINS['flex-column-centered']}
			display: none;
			gap: var(--ntc-app-spacing-lg);
		}

		.search-is-empty span {
			font-size: 1.1em;
			font-weight: var(--ntc-app-font-weight-md);
			color: var(--ntc-user-font-color);
		}

		.search-results-panel[data-is-empty='true'] > .search-is-empty {
			display: flex;
		}

		.search-contact-button {
			padding: var(--ntc-app-spacing-lg);
			border-radius: var(--ntc-app-border-radius-md);
			background-color: transparent;

			border: 1px solid;
			border-color: var(--ntc-dark-bg-color);
			transition: all 0.2s;
			gap: var(--ntc-app-spacing-sm);

			color: var(--ntc-user-font-color);
			cursor: pointer;

			${MIXINS['flex-centered']}
		}

		.search-contact-button:hover {
			background-color: var(--ntc-dark-bg-color);
			border-color: transparent;
		}

		.search-has-error {
			display: none;
			font-size: 1.1em;
			font-weight: var(--ntc-app-font-weight-md);
			color: var(--ntc-user-font-color);
		}

		.search-results-panel[data-has-error='true'] > .search-has-error {
			display: inline-block;
		}
	`,
	JS: {
		renderSearchResultsLink(result: any) {
			const { context, data, type, pageId, blockId } = result ?? {}

			const resultsLink = document.createElement('div')
			const searchContext = document.createElement('h3')
			const searchText = document.createElement('div')

			resultsLink.className = 'NTC_search-results-link'
			resultsLink.onclick = function () {
				$NTC.navigateOnSearchSelection(pageId, blockId, context)
			}

			resultsLink.appendChild(searchContext)
			const contextText = $NTC.dataToLeaves(context.type, context.data)
			searchContext.textContent = contextText

			const leavesToText = $NTC.dataToLeaves(type, data)
			searchText.className = 'NTC_search-results-text'
			searchText.textContent = leavesToText
			resultsLink.appendChild(searchText)

			return resultsLink
		},

		dataToLeaves(type, data) {
			switch (type) {
				case 'paragraph':
				case 'quote':
				case 'hint':
				case 'list-item':
				case 'checkbox':
				case 'header-1':
				case 'header-2':
				case 'header-3':
					return $NTC.leavesToText(data.leaves)
				case 'page':
					return data.text ?? ''
				case 'expandable':
					return data.title ?? ''
				default:
					return ''
			}
		},

		leavesToText(leaves: any[]) {
			return leaves?.reduce((acc, curr) => acc + curr.text, '')
		},

		navigateOnSearchSelection(pageId: string, blockId: string, context?: Record<string, any>) {
			if (pageId === $NTC.blockId) {
				$NTC.closeSearch()
				$NTC.scrollToAndHighlightBlock(blockId, context)
			} else {
				$NTC.navigateTo(pageId)?.then(() => {
					$NTC.scrollToAndHighlightBlock(blockId, context)
				})
			}
		},

		scrollToAndHighlightBlock(blockId: string, context?: Record<string, any>) {
			const target = document.getElementById(blockId)

			if (!target) return

			if (context && context.type === 'expandable') {
				$NTC.expandParentExpandable(context.id)
			}

			target.scrollIntoView({ behavior: 'smooth' })
			target.classList.add('NTC_search-highlight')

			setTimeout(() => target.classList.remove('NTC_search-highlight'), 2000)
		},

		cleanResultsContainer() {
			const resultsContainer = $NTC.wrapper.querySelector('.NTC_search-results-panel')
			const isLoading = resultsContainer.getAttribute('data-is-loading')
			const isEmpty = resultsContainer.getAttribute('data-is-empty')
			const hasError = resultsContainer.getAttribute('data-has-error')
			const results = resultsContainer.querySelectorAll('.NTC_search-results-link')

			if (isLoading) {
				resultsContainer.removeAttribute('data-is-loading')
			}

			if (isEmpty) {
				resultsContainer.removeAttribute('data-is-empty')
			}

			if (hasError) {
				resultsContainer.removeAttribute('data-has-error')
			}

			if (results && results.length) {
				results.forEach((result) => {
					result.remove()
				})
			}
		},

		expandParentExpandable(id: string) {
			const expandable = $NTC.wrapper.querySelector(`div[id="${id}"]`)

			if (!expandable) return

			expandable.setAttribute('aria-expanded', 'true')
		},
	},
} satisfies RenderComponent<'element'>
