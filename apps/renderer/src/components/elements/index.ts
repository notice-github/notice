import { ACTION_SELECTOR_BUTTON_ELEMENT } from './action_selector/action_selector_button.element'
import { ACTION_SELECTOR_MENU_ELEMENT } from './action_selector/action_selector_menu.element'
import { ANCHOR_ELEMENT } from './anchor.element'
import { BOTTOM_NAV_ELEMENT } from './bottom_nav/bottom_nav.element'
import { BOTTOM_NAV_LINK_ELEMENT } from './bottom_nav/bottom_nav_link.element'
import { BREADCRUMB_ELEMENT } from './breadcrumb/breadcrumb.element'
import { CONTACT_FORM_BUTTON_ELEMENT } from './contact_form/contact_form_button.element'
import { CONTACT_FORM_DIALOG_ELEMENT } from './contact_form/contact_form_dialog.element'
import { CREATED_WITH_NOTICE_BOX_ELEMENT } from './created_with_notice/created_with_notice_box.element'
import { CREATED_WITH_NOTICE_TEXT_ELEMENT } from './created_with_notice/created_with_notice_text.element'
import { FACEBOOK_ELEMENT } from './facebook.element'
import { HOME_BUTTON_ELEMENT } from './home_button.element'
import { LANGUAGE_SELECTOR_ELEMENT } from './language_selector/language_selector.element'
import { LINKEDIN_ELEMENT } from './linkedin.element'
import { LOGO_ELEMENT } from './logo.element.js'
import { PAGE_TITLE_ELEMENT } from './page_title.element'
import { PAGE_TREE_ELEMENT } from './page_tree/page_tree.element'
import { PAGE_TREE_IN_DIALOG_ELEMENT } from './page_tree/page_tree_in_dialog.element'
import { PAGE_TREE_ITEM_ELEMENT } from './page_tree/page_tree_item.element'
import { PAGE_TREE_SECTION_ELEMENT } from './page_tree/page_tree_section.element'
import { PROJECT_TITLE_ELEMENT } from './project_title.element'
import { RELATED_ARTICLES_ELEMENT } from './related_articles.elements'
import { SCROLL_TO_TOP_ELEMENT } from './scroll_to_top.element'
import { SEARCH_ELEMENT } from './search_element/search.element'
import { SEARCH_IN_DIALOG_ELEMENT } from './search_element/search_in_dialog.element'
import { SEARCH_RESULTS_ELEMENT } from './search_element/search_results.element'
import { THEME_SWITCH_ELEMENT } from './theme_switch.element'
import { TIME_TO_READ_ELEMENT } from './time_to_read.element'
import { TWITTER_ELEMENT } from './twitter.element'

export const ELEMENTS = {
	// Header Space
	[PROJECT_TITLE_ELEMENT.NAME]: PROJECT_TITLE_ELEMENT,
	[LOGO_ELEMENT.NAME]: LOGO_ELEMENT,
	[PAGE_TREE_IN_DIALOG_ELEMENT.NAME]: PAGE_TREE_IN_DIALOG_ELEMENT,

	// Left Space
	[PAGE_TREE_ELEMENT.NAME]: PAGE_TREE_ELEMENT,
	[PAGE_TREE_SECTION_ELEMENT.NAME]: PAGE_TREE_SECTION_ELEMENT,
	[PAGE_TREE_ITEM_ELEMENT.NAME]: PAGE_TREE_ITEM_ELEMENT,

	// Top Space
	[HOME_BUTTON_ELEMENT.NAME]: HOME_BUTTON_ELEMENT,
	[PAGE_TITLE_ELEMENT.NAME]: PAGE_TITLE_ELEMENT,
	[BREADCRUMB_ELEMENT.NAME]: BREADCRUMB_ELEMENT,
	[TIME_TO_READ_ELEMENT.NAME]: TIME_TO_READ_ELEMENT,
	[ACTION_SELECTOR_BUTTON_ELEMENT.NAME]: ACTION_SELECTOR_BUTTON_ELEMENT,
	[ACTION_SELECTOR_MENU_ELEMENT.NAME]: ACTION_SELECTOR_MENU_ELEMENT,

	// Right Space
	[ANCHOR_ELEMENT.NAME]: ANCHOR_ELEMENT,

	// Bottom Action
	[SCROLL_TO_TOP_ELEMENT.NAME]: SCROLL_TO_TOP_ELEMENT,

	// Bottom Nav
	[BOTTOM_NAV_ELEMENT.NAME]: BOTTOM_NAV_ELEMENT,
	[BOTTOM_NAV_LINK_ELEMENT.NAME]: BOTTOM_NAV_LINK_ELEMENT,

	// Action Space
	[SEARCH_ELEMENT.NAME]: SEARCH_ELEMENT,
	[SEARCH_IN_DIALOG_ELEMENT.NAME]: SEARCH_IN_DIALOG_ELEMENT,
	[SEARCH_RESULTS_ELEMENT.NAME]: SEARCH_RESULTS_ELEMENT,
	[CONTACT_FORM_BUTTON_ELEMENT.NAME]: CONTACT_FORM_BUTTON_ELEMENT,
	[CONTACT_FORM_DIALOG_ELEMENT.NAME]: CONTACT_FORM_DIALOG_ELEMENT,
	[LANGUAGE_SELECTOR_ELEMENT.NAME]: LANGUAGE_SELECTOR_ELEMENT,
	[THEME_SWITCH_ELEMENT.NAME]: THEME_SWITCH_ELEMENT,

	// Social
	[TWITTER_ELEMENT.NAME]: TWITTER_ELEMENT,
	[FACEBOOK_ELEMENT.NAME]: FACEBOOK_ELEMENT,
	[LINKEDIN_ELEMENT.NAME]: LINKEDIN_ELEMENT,

	// Related Article
	[RELATED_ARTICLES_ELEMENT.NAME]: RELATED_ARTICLES_ELEMENT,
	[CREATED_WITH_NOTICE_TEXT_ELEMENT.NAME]: CREATED_WITH_NOTICE_TEXT_ELEMENT,
	[CREATED_WITH_NOTICE_BOX_ELEMENT.NAME]: CREATED_WITH_NOTICE_BOX_ELEMENT,
}
export type ELEMENTS = typeof ELEMENTS
