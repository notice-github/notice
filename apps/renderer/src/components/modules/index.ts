import { ANCHOR_DROP_DOWN_MODULE } from './anchor_drop_down.module'
import { LANGUAGE_SELECTOR_MENU_MODULE } from './language_selector_menu.module'
import { LIGHTBOX_MODULE } from './lightbox.module'
import { LOADER_MODULE } from './loader.module'
import { MODAL_MODULE } from './modal.module'

export const MODULES = {
	[LIGHTBOX_MODULE.NAME]: LIGHTBOX_MODULE,
	[MODAL_MODULE.NAME]: MODAL_MODULE,
	[LOADER_MODULE.NAME]: LOADER_MODULE,
	[ANCHOR_DROP_DOWN_MODULE.NAME]: ANCHOR_DROP_DOWN_MODULE,
	[LANGUAGE_SELECTOR_MENU_MODULE.NAME]: LANGUAGE_SELECTOR_MENU_MODULE,
}
export type MODULES = typeof MODULES
