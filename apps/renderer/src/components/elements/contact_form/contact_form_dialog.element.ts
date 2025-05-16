import { $NTC, RenderComponent, css, html } from '@root/system'
import { MIXINS } from '../../../tools/mixins.tool'
import { ICONS } from '../../icons'

export const CONTACT_FORM_DIALOG_ELEMENT = {
	NAME: 'contact_form_dialog' as const,
	HTML: (ctx) => {
		return html`
			<dialog id="contact-form-dialog" class="contact-form-dialog">
				<div class="contact-form-container">
					<div class="contact-form-header">
						<h2>${ctx.textOf('ContactUs', 'Contact us')}</h2>
						<div class="icon-button-container" onclick="$NTC.closeContactForm()">${ICONS['x-close'].HTML(18)}</div>
					</div>
					<form id="ntc-contact-form" method="post" class="contact-form">
						<label for="name">${ctx.textOf('YourName', 'Your Name')} :</label>
						<input
							type="text"
							placeholder="${ctx.textOf('YourNamePlaceholder', 'Type your name here...')}"
							id="name"
							name="name"
						/>

						<label for="email">${ctx.textOf('YourEmail', 'Your E-mail')} :</label>
						<input
							type="email"
							placeholder="${ctx.textOf('YouremailSubjectPlaceholder', 'email-address@domain.com')}"
							id="email"
							name="email"
						/>
						<label for="subject">${ctx.textOf('YouremailSubject', 'Your Subject')} :</label>
						<input
							type="text"
							id="subject"
							placeholder="${ctx.textOf('YouremailSubjectPlaceholder', 'Type your subject here...')}"
							name="subject"
							maxlength="128"
						/>

						<label for="message">${ctx.textOf('YourMessage', 'Your message')} :</label>
						<textarea
							id="message"
							placeholder="${ctx.textOf('YourMessagePlaceholder', 'Type your message here...')}"
							name="message"
						></textarea>

						<div class="contact-form-footer">
							<div class="contact-form-response">
								<span class="name-error" data-should-display="false">
									${ctx.textOf('PleaseEnterAName', 'Please enter a name')}
								</span>
								<span class="email-error" data-should-display="false">
									${ctx.textOf('PleaseEnterAnEmail', 'Please enter an e-mail')}
								</span>
								<span class="invalid-email-error" data-should-display="false">
									${ctx.textOf('InvalidEmailAddress', 'Invalid email address')}
								</span>
								<span class="subject-error" data-should-display="false">
									${ctx.textOf('PleaseEnterASubject', 'Please enter an subject')}
								</span>
								<span class="message-error" data-should-display="false">
									${ctx.textOf('PleaseEnterAMessage', 'Please enter an message')}
								</span>
								<span class="form-success" data-should-display="false">
									${ctx.textOf('MessageSentSuccessfully', 'Message sent successfully!')}
								</span>
								<span class="form-error" data-should-display="false">
									${ctx.textOf('UnexpectedError', 'Sorry, an unexpected error occurred')}
								</span>
							</div>
							<button type="submit" class="contact-form-submit" onclick="$NTC.validateAndSendMessage(event)">
								${ICONS['send-01'].HTML(16)} ${ctx.textOf('SendMessage', 'Send')}
							</button>
						</div>
					</form>
				</div>
			</dialog>
		`
	},
	CSS: css`
		.contact-form-dialog {
			max-width: 500px;
			width: 100%;
			height: fit-content;

			padding: var(--ntc-app-spacing-xl);
			border: none;
			border-radius: var(--ntc-app-border-radius-sm);
			animation: fade_in 0.2s;
			background-color: var(--ntc-user-bg-color);
		}

		.contact-form-dialog::backdrop {
			background-color: rgba(27, 30, 33, 0.77);
			backdrop-filter: blur(2px);
			cursor: pointer;
			animation: fade_in 0.1s;
		}

		.contact-form-container {
			width: 100%;

			gap: var(--ntc-app-spacing-lg);
			${MIXINS['flex-column-centered']}
		}

		.contact-form-header {
			width: 100%;
			margin-bottom: var(--ntc-app-spacing-xl);

			${MIXINS['flex-row-space-between']}
		}

		.contact-form-header h2 {
			font-size: 1.5em !important;
			font-weight: bold !important;
		}

		.contact-form-dialog label {
			user-select: none;
			color: var(--ntc-user-font-color) !important;
		}

		.contact-form {
			width: 100%;
		}

		.contact-form-dialog input[type='text'],
		input[type='email'],
		textarea {
			width: 100%;
			padding: var(--ntc-app-spacing-md);
			border: 1px solid var(--ntc-user-border-color);
			border-radius: var(--ntc-app-border-radius-sm);

			margin-bottom: var(--ntc-app-spacing-xl);
			color: var(--ntc-user-font-color) !important;
			background-color: transparent !important;
		}

		.contact-form-dialog input::placeholder,
		textarea::placeholder {
			user-select: none;
		}

		.contact-form-dialog textarea {
			resize: none !important;
			height: var(--ntc-app-sizing-xl);
		}

		.contact-form-footer {
			${MIXINS['flex-row-space-between']}
			padding: 0 var(--ntc-app-spacing-md);
		}

		.contact-form-submit {
			padding: var(--ntc-app-spacing-md) var(--ntc-app-spacing-lg);
			color: var(--ntc-user-font-color);
			background-color: transparent;

			border: 1px solid;
			border-color: var(--ntc-user-border-color);
			border-radius: var(--ntc-app-border-radius-sm);

			cursor: pointer;
			transition: all 0.2s ease;

			${MIXINS['flex-centered']}
			gap: var(--ntc-app-spacing-sm);
			user-select: none;
		}

		.contact-form-submit:hover {
			border-color: transparent;
			background-color: var(--ntc-light-bg-color);
		}

		.contact-form-response * {
			display: none;
			font-size: 1em;
			font-weight: var(--ntc-app-font-weight-lg) !important;

			white-space: nowrap !important;
		}

		.contact-form-response *[data-should-display='true'] {
			display: block;
			color: var(--ntc-app-error-color);
		}

		.contact-form-response > .form-success[data-should-display='true'] {
			color: var(--ntc-app-success-color);
		}
	`,
	JS: {
		closeContactForm() {
			const dialog = $NTC.wrapper.querySelector('#contact-form-dialog') as HTMLDialogElement
			const form = $NTC.wrapper.querySelector('#ntc-contact-form') as HTMLFormElement

			form.reset()
			$NTC.clearPreviousResponses()

			dialog.close()
		},

		async validateAndSendMessage(e: Event) {
			e.preventDefault()

			const name = ($NTC.wrapper.querySelector('#name') as HTMLInputElement).value
			const email = ($NTC.wrapper.querySelector('#email') as HTMLInputElement).value
			const subject = ($NTC.wrapper.querySelector('#subject') as HTMLInputElement).value
			const message = ($NTC.wrapper.querySelector('#message') as HTMLTextAreaElement).value

			const responseContainer = $NTC.wrapper.querySelector('.NTC_contact-form-response')

			$NTC.clearPreviousResponses()

			if (name == '') {
				responseContainer.children[0].setAttribute('data-should-display', 'true')
				return
			}

			if (email == '') {
				responseContainer.children[1].setAttribute('data-should-display', 'true')
				return
			} else if (!$NTC.validateEmail(email)) {
				responseContainer.children[2].setAttribute('data-should-display', 'true')
				return
			}

			if (subject === '') {
				responseContainer.children[3].setAttribute('data-should-display', 'true')
				return
			}

			if (message == '') {
				responseContainer.children[4].setAttribute('data-should-display', 'true')
				return
			}

			$NTC.sendContactMessage(name, email, subject, message)
		},

		async sendContactMessage(name: string, email: string, subject: string, message: string) {
			const responseContainer = $NTC.wrapper.querySelector('.NTC_contact-form-response')

			try {
				const response = await fetch($NTC.lighthouseURL + '/contact', {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						name,
						senderEmail: email,
						emailSubject: subject,
						content: message,
						projectId: $NTC.rootId,
						projectTitle: document.title,
					}),
				})

				const content = await response.json()

				if (content.success) {
					responseContainer.children[5].setAttribute('data-should-display', 'true')
					setTimeout(() => {
						$NTC.closeContactForm()
					}, 750)
				} else {
					responseContainer.children[6].setAttribute('data-should-display', 'true')
				}
			} catch (error) {
				responseContainer.children[6].setAttribute('data-should-display', 'true')
			}
		},

		clearPreviousResponses() {
			const responseContainer = $NTC.wrapper.querySelector('.NTC_contact-form-response')
			const childrenArray = Array.from(responseContainer.children)
			childrenArray.forEach((child) => {
				child.setAttribute('data-should-display', 'false')
			})
		},

		validateEmail(email: string) {
			let re = /\S+@\S+\.\S+/
			return re.test(email)
		},
	},
} satisfies RenderComponent<'element'>
