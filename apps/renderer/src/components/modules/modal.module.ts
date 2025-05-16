import { RenderComponent, css, html } from '@root/system'

export const MODAL_MODULE = {
	NAME: 'modal' as const,
	HTML: (id: string, modalBody: string) => {
		return html`
			<dialog id="${id}" class="notice_dialog_modal size_100 cursor_pointer">
				<div class="size_100 position_relative" onclick="closeModal('${id}')">${modalBody}</div>
			</dialog>
		`
	},
	CSS: css`
		.notice_dialog_modal {
			overflow: hidden;

			background-color: transparent;
			border: none;
			margin: 0;
			padding: 0;

			max-width: 100%;
			max-height: 100%;
		}

		.notice_dialog_modal[open]::backdrop {
			animation: backdrop-fade-in 0.2s ease-in-out;
			background-color: rgba(27, 30, 33, 0.77);
		}

		@keyframes backdrop-fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
	`,
	JS: {
		closeModal(id: string) {
			const dialog = document.getElementById(id) as HTMLDialogElement

			if (id === 'project_tree_modal') {
				const drawer = document.getElementById('notice_drawer')!
				drawer.classList.remove('NTC_active')

				// add exit animation for the drawer to slide left
				drawer.classList.add('NTC_deactivate')
				setTimeout(() => {
					// remove the deactivate class from the drawer class list
					// so you can open again with animation
					drawer.classList.remove('NTC_deactivate')
				}, 50)

				setTimeout(() => {
					dialog.close()
				}, 300)
			}

			if (id === 'search_modal') {
				this.clearSearch()
				const wrapper = document.getElementById('search_wrapper')!
				wrapper.classList.remove('NTC_search_active')

				wrapper.classList.add('NTC_search_deactive')

				this.removeSearchEventListener() // remove the input event listener

				setTimeout(() => {
					dialog.close()
				}, 190)
			}

			if (id === 'contact_modal') {
				this.clearContactFrom()
				const wrapper = document.getElementById('contact_form_wrapper')!
				wrapper.classList.remove('NTC_contact_active')

				wrapper.classList.add('NTC_contact_deactive')

				setTimeout(() => {
					dialog.close()
				}, 190)
			}
		},

		stopPropagation(event: any) {
			event.stopPropagation()
		},
	},
} satisfies RenderComponent<'module'>
