import { getT } from '../../internationalisation'

export const DEFAULT_LAYOUT = {
	header_space: {
		name: getT('Header Space', 'headerSpace'),
		show: false,
		elements: {
			title: {
				show: false,
				name: getT('Project Title', 'projectTitle'),
				children: [{ name: getT('Project Title', 'projectTitle'), type: 'title-input', description: '' }],
			},
			logo: {
				show: true,
				name: getT('Project Logo', 'projectLogo'),
				children: [{ name: getT('Project Logo', 'projectLogo'), type: 'logo-selector', description: '' }],
			},
		},
	},
	top_space: {
		name: getT('Top Space', 'topSpace'),
		show: true,
		elements: {
			page_title: { show: true, name: getT('Page Title', 'pageTitle') },
			logo: {
				show: true,
				name: getT('Project Logo', 'projectLogo'),
				children: [{ name: getT('Project Logo', 'projectLogo'), type: 'logo-selector', description: '' }],
			},
			home_button: { show: false, name: getT('Home Button', 'homeButton') },
			search: {
				show: false,
				type: 'icon',
				name: 'Search',
			},

			contact_form: {
				show: true,
				name: getT('Contact Form', 'contactForm'),
				children: [
					{
						name: getT('E-mail to receive messages from your users', 'emailToReceiveMessages'),
						type: 'contact-email-input',
					},
				],
			},

			theme_switch: {
				show: false,
				name: getT('Theme Switch', 'themeSwitch'),
			},
			language_selector: {
				show: false,
				name: getT('Language Selector', 'languageSelector'),
			},
			breadcrumb: { show: false, name: getT('Breadcrumb Navigation', 'breadcrumbNavigation') },

			time_to_read: { show: false, name: getT('Time to read', 'timeToRead') },
			facebook: { show: false, name: getT('Share to Facebook', 'shareToFacebook') },
			twitter: { show: false, name: getT('Share to Twitter', 'shareToTwitter') },
			linkedin: { show: false, name: getT('Share to LinkedIn', 'shareToLinkedIn') },
		},
	},
	left_space: {
		name: getT('Left Space', 'leftSpace'),
		show: false,
		elements: {
			page_tree: {
				show: true,
				name: getT('Navigation Menu', 'navigationMenu'),
			},
		},
	},
	right_space: {
		name: getT('Right Space', 'rightSpace'),
		show: false,
		elements: {
			anchor: { show: true, name: getT('Anchor Menu', 'anchorMenu') },
			/* 			export_to_pdf: { show: true, name: 'Export to PDF' },
			 */
		},
	},
	bottom_space: {
		name: getT('Bottom Space', 'bottomSpace'),
		show: false,
		elements: {
			bottom_nav: {
				show: false,
				name: getT('Bottom Navigation', 'bottomNavigation'),
			},

			read_more: {
				show: false,
				name: getT('Read More Articles', 'readMoreArticles'),
			},

			facebook: { show: false, name: getT('Share to Facebook', 'shareToFacebook') },
			twitter: { show: false, name: getT('Share to Twitter', 'shareToTwitter') },
			linkedin: { show: false, name: getT('Share to LinkedIn', 'shareToLinkedIn') },
		},
	},
}

export const DEFAULT_STYLE_VALUES = {
	// Colors
	mainBgColor: {
		defaultValue: '#ffffff',
		CSSPropertyName: 'background-color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Light Background Color', 'lightBgColor'),
	},

	fontColor: {
		defaultValue: '#333E48',
		CSSPropertyName: 'color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Light Font Color', 'lightFontColor'),
	},

	highlightColor: {
		defaultValue: '#4A90E2',
		CSSPropertyName: 'background-color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Light Highlight Color', 'lightHighlightColor'),
	},

	darkModeBgColor: {
		defaultValue: '#000000',
		CSSPropertyName: 'background-color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Dark Background Color', 'darkBgColor'),
	},

	darkModeFontColor: {
		defaultValue: '#ffffff',
		CSSPropertyName: 'color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Dark Font Color', 'darkFontColor'),
	},

	darkModeHighlightColor: {
		defaultValue: '#4A90E2',
		CSSPropertyName: 'background-color',
		category: getT('Colors', 'colors'),
		type: 'color-selector',
		name: getT('Dark Highlight Color', 'darkHighlightColor'),
	},

	// Fonts
	fontFamilyName: {
		CSSVarName: 'ntc-user-font-family',
		CSSPropertyName: 'font-family',
		defaultValue: 'system-ui',
		category: getT('Fonts', 'fonts'),
		type: 'font-selector',
		name: getT('Font Family', 'fontFamily'),
		description: getT(
			`To explore fonts, go to to <a href="https://fonts.google.com/" target="_blank">Google Fonts.</a>`,
			'fontFamilyDescription'
		),
	},
	fontSize: {
		CSSVarName: 'ntc-user-font-size',
		CSSPropertyName: 'font-size',
		defaultValue: '16px',
		category: getT('Fonts', 'fonts'),
		type: 'incrementor',
		name: getT('Font Size', 'fontSize'),
	},

	// Layout
	maxWidth: {
		CSSVarName: 'ntc-user-max-width',
		CSSPropertyName: 'max-width',
		defaultValue: '700px',
		category: getT('Spacing', 'spacing'),
		type: 'incrementor',
		name: getT('Max Width', 'maxWidth'),
		description: getT(`set max-width for main column`, 'maxWidthDescription'),
	},

	// Block
	blockPadding: {
		CSSVarName: 'ntc-user-block-padding',
		CSSPropertyName: 'padding',
		defaultValue: '0.5em',
		category: getT('Spacing', 'spacing'),
		type: 'incrementor',
		name: getT('Block Padding', 'blockPadding'),
	},

	// Icon Stroke
	iconStrokeWidth: {
		CSSVarName: 'ntc-user-icon-stroke-width',
		CSSPropertyName: 'stroke-width',
		defaultValue: '1.8',
		category: getT('Icons', 'icons'),
		type: 'incrementor',
		name: getT('Icon Stroke', 'iconStroke'),
	},

	// Headings
	h1Size: {
		CSSVarName: 'ntc-user-h1-size',
		CSSPropertyName: 'font-size',
		defaultValue: '25.6px',
		category: getT('Headings', 'headings'),
		type: 'incrementor',
		name: 'H1 Size',
	},
	h1Weight: {
		CSSVarName: 'ntc-user-h1-weight',
		CSSPropertyName: 'font-weight',
		defaultValue: '700',
		category: getT('Headings', 'headings'),
		type: 'incrementor',
		name: getT('H1 Weight', 'h1Weight'),
	},
	h2Size: {
		CSSVarName: 'ntc-user-h2-size',
		CSSPropertyName: 'font-size',
		defaultValue: '20.8px',
		category: getT('Headings', 'headings'),
		type: 'incrementor',
		name: getT('H2 Size', 'h2Size'),
	},
	h2Weight: {
		CSSVarName: 'ntc-user-h2-weight',
		CSSPropertyName: 'font-weight',
		defaultValue: '700',
		category: getT('Headings', 'headings'),
		type: 'drop-down',
		name: getT('H2 Weight', 'h2Weight'),
	},
	h3Size: {
		CSSVarName: 'ntc-user-h3-size',
		CSSPropertyName: 'font-size',
		defaultValue: '17.6px',
		category: getT('Headings', 'headings'),
		type: 'incrementor',
		name: getT('H3 Size', 'h3Size'),
	},
	h3Weight: {
		CSSVarName: 'ntc-user-h3-weight',
		CSSPropertyName: 'font-weight',
		defaultValue: '700',
		category: getT('Headings', 'headings'),
		type: 'drop-down',
		name: getT('H3 Weight', 'h3Weight'),
	},
	headingsPadding: {
		CSSVarName: 'ntc-user-headings-padding',
		CSSPropertyName: 'padding',
		defaultValue: '0.3em 0 0.3em 0',
		category: getT('Headings', 'headings'),
		type: 'drop-down',
		name: getT('Headings Padding', 'headingsPadding'),
	},
	expandableTitleFontSize: {
		CSSVarName: 'ntc-user-expandable-header-size',
		CSSPropertyName: 'font-size',
		defaultValue: 'calc(var(--ntc-user-font-size) * 1.3)',
		category: getT('Expandable', 'expandable'),
		type: 'incrementor',
		name: getT('Title font size', 'titleFontSize'),
	},

	// Text
	pLineHeight: {
		CSSVarName: 'ntc-user-p-line-height',
		CSSPropertyName: 'line-height',
		// https://www.smashingmagazine.com/2020/07/css-techniques-legibility/
		defaultValue: 'calc(1.05ex / 0.33)',
		category: getT('Text', 'text'),
		type: 'incrementor',
		name: getT('Text line-height', 'textLineHeight'),
	},
	textLetterSpacing: {
		CSSVarName: 'ntc-user-letter-spacing',
		CSSPropertyName: 'letter-spacing',
		defaultValue: 'normal',
		category: getT('Text', 'text'),
		type: 'incrementor',
		name: getT('Text letter-spacing', 'textLetterSpacing'),
	},
}
