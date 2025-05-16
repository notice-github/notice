import { AUDIO_BLOCK } from './audio.block'
import { BULLET_LIST_BLOCK } from './bulleted_list.bock'
import { CHECKBOX_BLOCK } from './checkbox.block'
import { CODE_BLOCK } from './code.block'
import { DIVIDER_BLOCK } from './divider.block'
import { DOCUMENT_BLOCK } from './document.block'
import { EMBED_BLOCK } from './embed.block'
import { EXPANDABLE_BLOCK } from './expandable.block'
import { HEADER_BLOCK } from './header.block'
import { HINT_BLOCK } from './hint.block'
import { HTML_BLOCK } from './html.block'
import { IMAGE_BLOCK } from './image.block'
import { JAVASCRIPT_BLOCK } from './javascript.block'
import { LIST_ITEM_BLOCK } from './list_item.block'
import { NUMBERED_LIST_BLOCK } from './numbered_list.block'
import { PAGE_BLOCK } from './page.block'
import { PARAGRAPH_BLOCK } from './paragraph.block'
import { QUOTE_BLOCK } from './quote.block'
import { TABLE_BLOCK } from './table.block'
import { VIDEO_BLOCK } from './video.block'

export const BLOCKS = {
	[EXPANDABLE_BLOCK.NAME]: EXPANDABLE_BLOCK,
	[`${HEADER_BLOCK.NAME}-1` as const]: HEADER_BLOCK,
	[`${HEADER_BLOCK.NAME}-2` as const]: HEADER_BLOCK,
	[`${HEADER_BLOCK.NAME}-3` as const]: HEADER_BLOCK,
	[LIST_ITEM_BLOCK.NAME]: LIST_ITEM_BLOCK,
	[NUMBERED_LIST_BLOCK.NAME]: NUMBERED_LIST_BLOCK,
	[BULLET_LIST_BLOCK.NAME]: BULLET_LIST_BLOCK,
	[PAGE_BLOCK.NAME]: PAGE_BLOCK,
	[PARAGRAPH_BLOCK.NAME]: PARAGRAPH_BLOCK,
	[VIDEO_BLOCK.NAME]: VIDEO_BLOCK,
	[AUDIO_BLOCK.NAME]: AUDIO_BLOCK,
	[IMAGE_BLOCK.NAME]: IMAGE_BLOCK,
	[DOCUMENT_BLOCK.NAME]: DOCUMENT_BLOCK,
	[CODE_BLOCK.NAME]: CODE_BLOCK,
	[HINT_BLOCK.NAME]: HINT_BLOCK,
	[DIVIDER_BLOCK.NAME]: DIVIDER_BLOCK,
	[QUOTE_BLOCK.NAME]: QUOTE_BLOCK,
	[CHECKBOX_BLOCK.NAME]: CHECKBOX_BLOCK,
	[JAVASCRIPT_BLOCK.NAME]: JAVASCRIPT_BLOCK,
	[HTML_BLOCK.NAME]: HTML_BLOCK,
	[TABLE_BLOCK.NAME]: TABLE_BLOCK,
	[EMBED_BLOCK.NAME]: EMBED_BLOCK,
}
export type BLOCKS = typeof BLOCKS
