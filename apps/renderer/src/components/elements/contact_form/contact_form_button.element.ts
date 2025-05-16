import { ICONS } from '@root/components/icons'
import { $NTC, RenderComponent, html } from '@root/system'

export const CONTACT_FORM_BUTTON_ELEMENT = {
	NAME: 'contact_form_button' as const,
	HTML: (ctx) => {
		return html`
			<div class="icon-button-container" onclick="$NTC.openContactForm()">${ICONS['mail-03'].HTML(18)}</div>
		`
	},

	JS: {
		openContactForm() {
			const dialog = $NTC.wrapper.querySelector('#contact-form-dialog') as HTMLDialogElement
			dialog.showModal()

			const onClick = (e: MouseEvent) => {
				// source: https://stackoverflow.com/questions/25864259/how-to-close-the-new-html-dialog-tag-by-clicking-on-its-backdrop
				const rect = (e.target as HTMLDialogElement).getBoundingClientRect()
				if (rect.left > e.clientX || rect.right < e.clientX || rect.top > e.clientY || rect.bottom < e.clientY) {
					$NTC.closeContactForm()
				}
			}
			const onClose = () => {
				dialog.removeEventListener('click', onClick)
				dialog.removeEventListener('close', onClose)
			}

			dialog.addEventListener('click', onClick)
			dialog.addEventListener('close', onClose)
		},
	},
} satisfies RenderComponent<'element'>
