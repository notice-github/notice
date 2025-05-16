import { RenderComponent, html } from '@root/system'

export const SOCIAL_FACEBOOK_01_ICON = {
	NAME: 'social-facebook-01' as const,
	HTML: (size = 24) => {
		// prettier-ignore
		return html`<svg data-filled width="${size}"height="${size}"viewBox="0 0 24 24"><path d="M13.6874 22.669V15.1225H16.204L16.6824 11.9999H13.6874V9.9739C13.6874 9.12035 14.105 8.28654 15.4476 8.28654H16.81V5.62868C16.81 5.62868 15.5737 5.41758 14.3921 5.41758C11.9256 5.41758 10.3126 6.91205 10.3126 9.62002V11.9999H7.56974V15.1225H10.3126V22.669C5.14945 21.8589 1.20001 17.3907 1.20001 12C1.20001 6.03532 6.03534 1.2 12 1.2C17.9647 1.2 22.8 6.03532 22.8 12C22.8 17.3907 18.8506 21.8589 13.6874 22.669Z"></svg>`
	},
} satisfies RenderComponent<'icon'>
