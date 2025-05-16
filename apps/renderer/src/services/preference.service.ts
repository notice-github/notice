export namespace PreferenceService {
	export const DEFAULTS: { [key: string]: { CSSVarName: string; CSSPropertyName: string; value: string } } = {
		// Colors
		userFontColor: {
			CSSVarName: 'ntc-user-font-color',
			CSSPropertyName: 'color',
			value: '#333E48',
		},
		lightFontColor: {
			CSSVarName: 'ntc-light-font-color',
			CSSPropertyName: 'color',
			value: '#333E48',
		},

		accentColor: {
			CSSVarName: 'ntc-user-accent-color',
			CSSPropertyName: 'color',
			value: '#0079BF',
		},

		userBgColor: {
			CSSVarName: 'ntc-user-bg-color',
			CSSPropertyName: 'background-color',
			value: '#FFFFFF',
		},
		darkBgColor: {
			CSSVarName: 'ntc-dark-bg-color',
			CSSPropertyName: 'background-color',
			value: '#F5F7F9',
		},
		lightBgColor: {
			CSSVarName: 'ntc-light-bg-color',
			CSSPropertyName: 'background-color',
			value: '#F5F7F9',
		},

		highlightColor: {
			CSSVarName: 'ntc-user-highlight-color',
			CSSPropertyName: 'color',
			value: '#0079BF',
		},
		borderColor: {
			CSSVarName: 'ntc-user-border-color',
			CSSPropertyName: 'border-color',
			value: '#EAEFF9',
		},

		// Fonts
		fontFamilyName: {
			CSSVarName: 'ntc-user-font-family',
			CSSPropertyName: 'font-family',
			value: 'system-ui',
		},
		fontSize: {
			CSSVarName: 'ntc-user-font-size',
			CSSPropertyName: 'font-size',
			value: '16px',
		},

		// Layout
		maxWidth: {
			CSSVarName: 'ntc-user-max-width',
			CSSPropertyName: 'max-width',
			value: '700px',
		},

		// Block
		blockPadding: {
			CSSVarName: 'ntc-user-block-padding',
			CSSPropertyName: 'padding',
			value: '0.5em',
		},

		// Borders
		borderRadius: {
			CSSVarName: 'ntc-user-border-radius',
			CSSPropertyName: 'border-radius',
			value: '0.4em',
		},
		borderWidth: {
			CSSVarName: 'ntc-user-border-width',
			CSSPropertyName: 'border-width',
			value: '0.05em',
		},
		borderStyle: {
			CSSVarName: 'ntc-user-border-style',
			CSSPropertyName: 'border-style',
			value: 'solid',
		},

		// Icon Stroke
		iconStrokeWidth: {
			CSSVarName: 'ntc-user-icon-stroke-width',
			CSSPropertyName: 'stroke-width',
			value: '1.8',
		},

		// Headings
		h1Size: {
			CSSVarName: 'ntc-user-h1-size',
			CSSPropertyName: 'font-size',
			value: '25.6px',
		},
		h1Weight: {
			CSSVarName: 'ntc-user-h1-weight',
			CSSPropertyName: 'font-weight',
			value: '700',
		},
		h2Size: {
			CSSVarName: 'ntc-user-h2-size',
			CSSPropertyName: 'font-size',
			value: '20.8px',
		},
		h2Weight: {
			CSSVarName: 'ntc-user-h2-weight',
			CSSPropertyName: 'font-weight',
			value: '700',
		},
		h3Size: {
			CSSVarName: 'ntc-user-h3-size',
			CSSPropertyName: 'font-size',
			value: '17.6px',
		},
		h3Weight: {
			CSSVarName: 'ntc-user-h3-weight',
			CSSPropertyName: 'font-weight',
			value: '700',
		},

		headingsPadding: {
			CSSVarName: 'ntc-user-headings-padding',
			CSSPropertyName: 'padding',
			value: '0.3em 0 0.3em 0',
		},

		expandableTitleFontSize: {
			CSSVarName: 'ntc-user-expandable-header-size',
			CSSPropertyName: 'font-size',
			value: 'calc(var(--ntc-user-font-size) * 1.3)',
		},

		// inline

		inlineCodeColor: {
			CSSVarName: 'ntc-user-inline-code-color',
			CSSPropertyName: 'color',
			value: '#b44437',
		},

		inlineCodeBgColor: {
			CSSVarName: 'ntc-user-inline-code-bg-color',
			CSSPropertyName: 'background-color',
			value: 'rgba(250, 239, 240, 0.78)',
		},

		modalZIndex: {
			CSSVarName: 'ntc-modal-z-index',
			CSSPropertyName: 'z-index',
			value: '2147483643',
		},

		// Text
		pLineHeight: {
			CSSVarName: 'ntc-user-p-line-height',
			CSSPropertyName: 'line-height',
			// https://www.smashingmagazine.com/2020/07/css-techniques-legibility/
			value: 'calc(1.05ex / 0.33)',
		},
		textLetterSpacing: {
			CSSVarName: 'ntc-user-letter-spacing',
			CSSPropertyName: 'line-height',
			value: 'normal',
		},

		// checkbox
		checkboxBorderRadius: {
			CSSVarName: 'ntc-user-checkbox-border-radius',
			CSSPropertyName: 'border-radius',
			value: '4px',
		},

		checkboxBorderColor: {
			CSSVarName: 'ntc-user-checkbox-border-color',
			CSSPropertyName: 'border-color',
			value: 'rgb(211, 220, 228)',
		},

		checkboxBgColor: {
			CSSVarName: 'ntc-user-checkbox-bg-color',
			CSSPropertyName: 'background-color',
			value: 'rgb(52, 109, 219)',
		},
	}

	export const mergeWithDefaults = (preferences: { [key: string]: string }) => {
		const result = structuredClone(DEFAULTS)

		Object.keys(preferences).forEach((key) => {
			if (preferences[key] && result[key]) {
				result[key].value = preferences[key]
			}
		})

		return result
	}
}
