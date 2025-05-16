import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import { SEARCH_RESULTS_ELEMENT } from './search_results.element'

export const SEARCH_IN_DIALOG_ELEMENT = {
	NAME: 'search_in_dialog' as const,
	HTML: (ctx) => {
		return html`
			<dialog id="search-dialog" class="search-dialog">
				<div class="search-wrapper">
					<div class="search-bar">
						${ICONS['search-refraction'].HTML(20)}
						<input id="search-input" class="search-input" placeholder="Search Content..." type="text" />
						<div class="icon-button-container" onclick="$NTC.clearSearchInput()">${ICONS['x-close'].HTML(20)}</div>
					</div>
					${SEARCH_RESULTS_ELEMENT.HTML(ctx)}
				</div>
			</dialog>
		`
	},

	CSS: css`
		.search-dialog {
			overflow: hidden;

			background-color: transparent;
			border: none;
			margin: 0;
			padding: 0;

			max-width: 100%;
			max-height: 100%;

			width: 100%;
			height: 100%;

			animation: fade_in 0.2s;
			cursor: pointer;
		}

		.search-dialog::backdrop {
			background-color: rgba(27, 30, 33, 0.77);
			backdrop-filter: blur(2px);
			animation: fade_in 0.1s;
		}

		.search-wrapper {
			max-width: calc(var(--ntc-app-sizing-3xl) * 2);
			width: 100%;
			height: fit-content;

			margin: auto;
			margin-top: 5%;

			border-radius: var(--ntc-app-border-radius-sm);
			background-color: var(--ntc-user-bg-color);
			cursor: default;

			${MIXINS['flex-column-centered']}
		}

		.search-wrapper * {
			line-height: normal !important;
		}

		.search-wrapper[data-has-results='true'] > .search-bar {
			border-bottom-color: var(--ntc-dark-bg-color);
		}

		.search-bar {
			${MIXINS['flex-row']}
			align-items: center;

			width: 100%;
			padding-left: var(--ntc-app-spacing-2xl);
			padding-right: var(--ntc-app-spacing-lg);
			border-bottom: 1px solid;
			border-bottom-color: transparent;
			transition: all 0.2s ease-in-out;
		}

		.search-bar > .icon-button-container {
			display: none;
		}

		.search-bar > .icon-button-container[data-is-shown='true'] {
			display: flex;
		}

		.search-input {
			padding: var(--ntc-app-spacing-xl);
			background-color: transparent !important;

			border: none !important;
			outline: none !important;
			box-shadow: none !important;

			flex-shrink: 0;
			flex-grow: 1;

			font-size: 1em !important;
			font-weight: var(--ntc-app-font-weight-sm) !important;
			color: var(--ntc-user-font-color) !important;
		}
	`,
	JS: {
		clearSearchInput() {
			const searchInput = $NTC.wrapper.querySelector('#search-input') as HTMLInputElement
			const crossButton = $NTC.wrapper.querySelector('.NTC_search-bar > .NTC_icon-button-container')

			searchInput.value = ''
			crossButton.removeAttribute('data-is-shown')
			$NTC.hideSearchResultsPanel()
		},

		onSearchInput(e: Event) {
			const value = (e.target as HTMLInputElement).value

			$NTC.fetchSearchResults(value)
			$NTC.toggleSearchClearButton(value)
		},

		async fetchSearchResults(searchValue: string) {
			const searchContainer = $NTC.wrapper.querySelector('.NTC_search-wrapper')
			const resultsContainer = $NTC.wrapper.querySelector('.NTC_search-results-panel')

			$NTC.cleanResultsContainer()

			searchContainer.setAttribute('data-has-results', 'true')
			resultsContainer.setAttribute('data-is-loading', 'true')

			if (searchValue.length > 2) {
				try {
					const url = `${$NTC.lighthouseURL}/search/blocks/${$NTC.rootId}?query=${searchValue}&lang=${$NTC.lang}`
					await fetch(url)
						.then((response) => response.json())
						.then((json) => {
							if (!json.data.length) {
								resultsContainer.setAttribute('data-is-empty', 'true')
							} else {
								json.data.forEach((result: Record<string, any>) => {
									const resultsLink = $NTC.renderSearchResultsLink(result)
									resultsContainer.appendChild(resultsLink)
								})
							}
						})
						.catch((error) => {
							resultsContainer.setAttribute('data-has-error', 'true')
						})
					resultsContainer.removeAttribute('data-is-loading')
				} catch (error) {
					resultsContainer.removeAttribute('data-is-loading')
					resultsContainer.setAttribute('data-has-error', 'true')
				}
			} else {
				$NTC.hideSearchResultsPanel()
			}
		},

		toggleSearchClearButton(searchValue: string) {
			const crossButton = $NTC.wrapper.querySelector('.NTC_search-bar > .NTC_icon-button-container')
			const isCrossButtonVisible = crossButton.getAttribute('data-is-shown')

			if (searchValue.length > 0 && !isCrossButtonVisible) {
				crossButton.setAttribute('data-is-shown', 'true')
			}
			if (!searchValue.length && isCrossButtonVisible) {
				crossButton.removeAttribute('data-is-shown')
			}
		},

		hideSearchResultsPanel() {
			const searchContainer = $NTC.wrapper.querySelector('.NTC_search-wrapper') as HTMLDialogElement
			$NTC.cleanResultsContainer()
			searchContainer.removeAttribute('data-has-results')
		},
	},
} satisfies RenderComponent<'element'>
