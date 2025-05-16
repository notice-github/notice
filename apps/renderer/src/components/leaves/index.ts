import { BG_COLOR_LEAF } from './bg_color.leaf'
import { BOLD_LEAF } from './bold.leaf'
import { CODE_LEAF } from './code.leaf'
import { COLOR_LEAF } from './color.leaf'
import { ITALIC_LEAF } from './italic.leaf'
import { LINK_LEAF } from './link.leaf'
import { STRIKETHROUGH_LEAF } from './strikethrough.leaf'
import { UNDERLINE_LEAF } from './underline.leaf'

export const LEAVES = {
	[BG_COLOR_LEAF.NAME]: BG_COLOR_LEAF,
	[BOLD_LEAF.NAME]: BOLD_LEAF,
	[CODE_LEAF.NAME]: CODE_LEAF,
	[COLOR_LEAF.NAME]: COLOR_LEAF,
	[ITALIC_LEAF.NAME]: ITALIC_LEAF,
	[LINK_LEAF.NAME]: LINK_LEAF,
	[STRIKETHROUGH_LEAF.NAME]: STRIKETHROUGH_LEAF,
	[UNDERLINE_LEAF.NAME]: UNDERLINE_LEAF,
}
export type LEAVES = typeof LEAVES
