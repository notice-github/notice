import { merge } from 'lodash'

export namespace LayoutService {
	export type Layout = typeof DEFAULTS

	export const DEFAULTS = {
		header_space: {
			show: false,
			title: { show: true },
			logo: { show: true },
			contact_form: { show: false },
			search: {
				show: false,
				type: 'icon',
			},
			theme_switch: { show: false },
			language_selector: { show: false },
		},
		top_space: {
			show: true,
			page_title: { show: true },
			logo: { show: false },
			date: { show: false },
			time_to_read: { show: false },
			facebook: { show: false },
			twitter: { show: false },
			linkedin: { show: false },
			home_button: { show: false },
			contact_form: { show: false },
			search: {
				show: false,
				type: 'icon',
			},
			theme_switch: { show: false },
			language_selector: { show: false },
			breadcrumb: { show: false },
		},
		left_space: {
			show: false,
			page_tree: { show: true },
		},
		right_space: {
			show: false,
			anchor: { show: true },
			export_to_pdf: { show: false },
		},
		bottom_space: {
			show: false,
			bottom_nav: { show: false },
			comment: {
				show: false,
				position: 'hover-bar',
			},
			like: {
				show: false,
				position: 'hover-bar',
			},
			facebook: { show: false },
			twitter: { show: false },
			linkedin: { show: false },
			read_more: { show: false },
		},
	}

	export const mergeWithDefaults = (layout: { [key: string]: any }) => {
		return merge({}, DEFAULTS, layout)
	}
}
