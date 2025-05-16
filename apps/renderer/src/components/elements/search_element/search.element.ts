import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, html } from '@root/system'

export const SEARCH_ELEMENT = {
	NAME: 'search' as const,
	HTML: () => {
		return html`
			<div class="icon-button-container" onclick="$NTC.openSearch()">${ICONS['icon_search-md'].HTML(18)}</div>
		`
	},

	JS: {
		openSearch() {
			const dialog = $NTC.wrapper.querySelector('#search-dialog') as HTMLDialogElement
			const searchInput = $NTC.wrapper.querySelector('#search-input') as HTMLInputElement

			const debouncedSearch = $NTC.debounce((e: Event) => $NTC.onSearchInput(e), 400)

			dialog.showModal()

			const onClick = (e: Event) => {
				const node = e.target as HTMLElement

				if (node.nodeName === 'DIALOG') {
					$NTC.closeSearch()
					return
				}
			}
			const onClose = () => {
				dialog.removeEventListener('click', onClick)
				dialog.removeEventListener('close', onClose)
				searchInput.removeEventListener('input', debouncedSearch)
			}

			dialog.addEventListener('click', onClick)
			dialog.addEventListener('close', onClose)
			searchInput.addEventListener('input', debouncedSearch)
		},

		closeSearch() {
			const dialog = $NTC.wrapper.querySelector('#search-dialog') as HTMLDialogElement
			$NTC.clearSearchInput()
			dialog.close()
		},

		debounce<T extends Function>(cb: T, wait = 100) {
			let timeout: ReturnType<typeof setTimeout>
			let callable = (...args: any) => {
				clearTimeout(timeout)
				timeout = setTimeout(() => cb(...args), wait)
			}
			return <T>(<any>callable)
		},
	},
} satisfies RenderComponent<'element'>
