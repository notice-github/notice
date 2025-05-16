import { BLOCKS } from '@root/components/blocks'
import { ELEMENTS } from '@root/components/elements'
import { LEAVES } from '@root/components/leaves'
import { MODULES } from '@root/components/modules'
import { SPACES } from '@root/components/spaces'
import { css } from '@root/system'
import { MIXINS } from '@root/tools/mixins.tool'
import Color from 'color'
import { ContextService } from './context.service'
import { PreferenceService } from './preference.service'

export namespace StyleService {
	export const globalStyles = () => {
		return css`
			.wrapper {
				width: 100%;
				font-size: var(--ntc-user-font-size);
				background-color: var(--ntc-user-bg-color);

				display: grid;
				grid-template-columns: 1fr minmax(100px, var(--ntc-user-max-width)) 1fr;
				grid-template-rows: auto auto auto 1fr auto auto;

				container-type: inline-size;
				container-name: wrapper;
				color: var(--ntc-user-font-color);
				overflow: visible;
			}

			.wrapper p {
				margin: 0;
			}

			.wrapper * {
				box-sizing: border-box;
				font-family:
					var(--ntc-user-font-family),
					-apple-system,
					system-ui,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					'Helvetica Neue',
					Arial,
					sans-serif !important;
				letter-spacing: var(--ntc-user-letter-spacing);
				line-height: var(--ntc-user-p-line-height);
				direction: var(--ntc-user-text-direction) !important;
			}

			.wrapper h1,
			.wrapper h2,
			.wrapper h3,
			.wrapper h4,
			.wrapper h5,
			.wrapper h6 {
				margin: 0;
				color: var(--ntc-user-font-color);
			}

			.wrapper svg {
				fill: none !important;
				stroke: var(--ntc-user-font-color);
			}

			.wrapper svg[data-filled=''] {
				fill: var(--ntc-user-font-color) !important;
				stroke: none;
			}

			.wrapper svg path {
				stroke: inherit;
				stroke-width: var(--ntc-user-icon-stroke-width);
				stroke-linecap: round;
				stroke-linejoin: round;
			}

			.space-content {
				${MIXINS['flex-column']}
				grid-column: 2;
				background-color: var(--ntc-user-bg-color);
				grid-row: 4;
				color: var(--ntc-user-font-color);
				word-break: break-word;

				padding-bottom: var(--ntc-app-spacing-xl);
				padding-left: var(--ntc-app-spacing-xl);
				padding-right: var(--ntc-app-spacing-xl);
				padding-top: var(--ntc-app-spacing-2xl);
			}

			@container wrapper (min-width: 1240px) {
				.space-content {
					padding-bottom: var(--ntc-app-spacing-md);
					padding-left: var(--ntc-app-spacing-md);
					padding-right: var(--ntc-app-spacing-md);
				}
			}

			.icon-button-container {
				cursor: pointer;
				height: var(--ntc-app-sizing-md);
				width: var(--ntc-app-sizing-md);
				background-color: transparent;
				border-radius: var(--ntc-app-border-radius-md);

				${MIXINS['flex-centered']}
				transition: background-color 0.2s ease-in-out;
			}

			.icon-button-container:hover {
				background-color: var(--ntc-light-bg-color);
			}

			.icon-button-container svg {
				transition: all 0.2s ease-in-out;
			}

			.icon-button-container:hover svg[data-filled=''] {
				fill: var(--ntc-user-accent-color) !important;
			}

			.download-loader {
				width: var(--ntc-app-sizing-xs);
				height: var(--ntc-app-sizing-xs);

				border: 2px solid var(--ntc-user-accent-color);
				border-bottom-color: transparent;
				border-radius: var(--ntc-app-border-radius-round);
				display: none;
				box-sizing: border-box;
				animation: rotation 1s linear infinite;
			}

			.search-highlight {
				-webkit-animation: highlightBg 1s linear;
				-o-animation: highlightBg 1s linear;
				animation: highlightBg 1s linear;
				-webkit-animation-iteration-count: 2;
				-o-animation-iteration-count: 2;
				animation-iteration-count: 2;
			}

			@keyframes fade_in {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			@keyframes fade_out {
				from {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			}

			@keyframes rotation {
				0% {
					transform: rotate(0deg);
				}
				100% {
					transform: rotate(360deg);
				}
			}

			@keyframes highlightBg {
				0% {
					background: var(--ntc-user-bg-color);
				}
				50% {
					background: var(--ntc-user-highlight-color);
				}
				100% {
					background: var(--ntc-user-bg-color);
				}
			}

			@keyframes zoom {
				from {
					transform: scale(0);
				}
				to {
					transform: scale(1);
				}
			}
		`
	}

	export const userCSSVars = (ctx: ContextService.Context) => {
		const { preferences = {}, colors = {} } = ctx.rootBlock

		const allColors = StyleService.generateColors({ ...ctx.customColors, ...colors }, ctx.theme === 'dark')
		const allPreferences = PreferenceService.mergeWithDefaults({
			...preferences,
			...allColors,
		})

		allPreferences['textDirection'] ??= {
			CSSVarName: 'ntc-user-text-direction',
			CSSPropertyName: 'direction',
			value: ctx.isRtl ? 'rtl' : 'ltr',
		}

		return Object.keys(allPreferences)
			.map((key) => {
				const { CSSVarName, value } = allPreferences[key]
				return `--${CSSVarName}: ${value};`
			})
			.join('\n')
	}

	export const userCustomCSS = (ctx: ContextService.Context) => {
		return ctx.rootBlock.userCode?.CSS ?? ''
	}

	export const appCSSVars = () => {
		return css`
			/* border radius */
			--ntc-app-border-radius-xs: 2px;
			--ntc-app-border-radius-sm: 4px;
			--ntc-app-border-radius-md: 6px;
			--ntc-app-border-radius-lg: 8px;
			--ntc-app-border-radius-round: 50%;

			/* spacing whole for padding and margins and flex items gap */
			--ntc-app-spacing-xs: 2px;
			--ntc-app-spacing-sm: 4px;
			--ntc-app-spacing-md: 8px;
			--ntc-app-spacing-lg: 12px;
			--ntc-app-spacing-xl: 16px;
			--ntc-app-spacing-2xl: 24px;
			--ntc-app-spacing-3xl: 32px;

			/* spacing whole for width and height */
			--ntc-app-sizing-xxs: 12px;
			--ntc-app-sizing-xs: 18px;
			--ntc-app-sizing-sm: 24px;
			--ntc-app-sizing-md: 34px;
			--ntc-app-sizing-lg: 56px;
			--ntc-app-sizing-xl: 90px;
			--ntc-app-sizing-2xl: 200px;
			--ntc-app-sizing-3xl: 300px;

			/* width */
			--ntc-app-width-half: 49%;
			--ntc-app-page-cover-width-lg: 135px;
			--ntc-app-page-cover-height-lg: 110px;

			--ntc-app-page-cover-width-sm: 80px;
			--ntc-app-page-cover-height-sm: 56px;

			/* font weight  */
			--ntc-app-font-weight-xs: 300;
			--ntc-app-font-weight-sm: 400;
			--ntc-app-font-weight-md: 500;
			--ntc-app-font-weight-lg: 600;
			--ntc-app-font-weight-xl: 700;

			/* z-index  */
			--ntc-app-zIndex-menu: 2147483644;

			/* colors */
			--ntc-app-error-color: #8c0002;
			--ntc-app-success-color: #355e3b;

			/* positioning for absolute pos */
			--ntc-app-top-pos-xs: 50px;
			--ntc-app-top-pos-xxs: 8px;
		`
	}

	export const blocksStyles = () => {
		return Object.keys(BLOCKS).reduce((css, key) => {
			const block = BLOCKS[key as keyof BLOCKS]

			if ('CSS' in block) return css + block.CSS
			else return css
		}, '')
	}

	export const spacesStyles = () => {
		return Object.keys(SPACES).reduce((css, key) => {
			const space = SPACES[key as keyof SPACES]

			if ('CSS' in space) return css + space.CSS
			else return css
		}, '')
	}

	export const elementsStyles = () => {
		return Object.keys(ELEMENTS).reduce((css, key) => {
			const element = ELEMENTS[key as keyof ELEMENTS]

			if ('CSS' in element) return css + element.CSS
			else return css
		}, '')
	}

	export const leavesStyles = () => {
		return Object.keys(LEAVES).reduce((css, key) => {
			const leaf = LEAVES[key as keyof LEAVES]

			if ('CSS' in leaf) return css + leaf.CSS
			else return css
		}, '')
	}

	export const modulesStyles = () => {
		return Object.keys(MODULES).reduce((css, key) => {
			const module = MODULES[key as keyof MODULES]

			if ('CSS' in module) return css + module.CSS
			else return css
		}, '')
	}

	export const generateColors = (
		{
			mainBgColor = '#ffffff',
			fontColor = '#333E48',
			highlightColor = '#4A90E2',
			darkModeFontColor = '#ffffff',
			darkModeBgColor = '#000000',
			darkModeHighlightColor = '#4A90E2',
		},
		isDarkMode: boolean
	) => {
		// three bases colors, others are inferred from these
		const userFontColor = !isDarkMode ? fontColor : darkModeFontColor
		const userBgColor = !isDarkMode ? mainBgColor : darkModeBgColor
		const hlColor = !isDarkMode ? highlightColor : darkModeHighlightColor

		// transforms colors to HSL
		const userFont = Color(userFontColor).hsl()
		let userBg: Color
		try {
			userBg = Color(userBgColor).hsl()
		} catch (_) {
			userBg = Color('#ffffff').hsl()
		}
		const accent = Color(hlColor).hsl()

		let highlight = null
		let border = null
		let lightBg = null
		let lightFont = null
		let darkBgColor = null

		// we check Luminosity for BG
		if (userBg.lightness() > 70) {
			highlight = Color(accent).lightness(80)

			// Initial border color is 80% lighter than font color, but it does not work
			// when lightness of font is 20%+
			// border = Color(userFont).lightness(userFont.color[2] + 80);
			border = Color(userFont).lightness(Math.min(userFont.lightness() + 50, 85))
			lightBg = Color(userFont).lightness(90)
			darkBgColor = Color(userFont).lightness(87)
			lightFont = Color(userFont).lightness(userFont.lightness() + 20)
		} else {
			highlight = Color(accent).lightness(90)
			border = Color(userBg).lightness(userBg.lightness() + 40)
			lightBg = Color(userBg).lightness(30)
			darkBgColor = Color(userFont).lightness(37)
			lightFont = Color(userFont).lightness(50)
		}

		return {
			userFontColor: userFont.hex(),
			userBgColor: userBg.hex(),
			accentColor: accent.hex(),
			highlightColor: highlight.hex(),
			borderColor: border.hex(),
			lightBgColor: lightBg.hex(),
			lightFontColor: lightFont.hex(),
			darkBgColor: darkBgColor.hex(),
		}
	}
}
