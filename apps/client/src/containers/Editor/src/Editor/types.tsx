import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { CheckListItemBlock } from './Blocks/Checklist/Checklist'
import { EmbedBlock } from './Blocks/Embed/Embed'
import { ExpandableBlock } from './Blocks/Expandable/Expandable'
import { HintBlock } from './Blocks/Hint'

import { CodeBlock } from './Blocks/Code/Code'
import { DividerBlock } from './Blocks/Divider'
import { DocumentElement } from './Blocks/Document/Document'
import { HTMLBlock } from './Blocks/HTML/HTML'
import { Header1Block, Header2Block, Header3Block } from './Blocks/Header'
import { ImageElement } from './Blocks/Image/Image'
import { JavaScriptBlock } from './Blocks/Javascript/Javascript'
import { BulletedListBlock, ListItemBlock, NumberedListBlock } from './Blocks/List'
import { NoticeAIImagePromptBlock } from './Blocks/NoticeAI/NoticeAIImagePrompt'
import { NoticeAIBlock } from './Blocks/NoticeAI/NoticeAITextPrompt'
import { PageBlock } from './Blocks/PageBlock/PageBlock'
import { ParagraphBlock } from './Blocks/Paragraph'
import { PowerBarBlock } from './Blocks/PowerBar/PowerBar'
import { QuoteBlock } from './Blocks/Quote'
import { TableBlock } from './Blocks/Table/Table'
import { VideoElement } from './Blocks/Video/Video'

export type CustomElement =
	| ParagraphBlock
	// headers
	| Header1Block
	| Header2Block
	| Header3Block
	| QuoteBlock
	| HintBlock
	| CodeBlock
	| JavaScriptBlock
	| HTMLBlock
	| DividerBlock
	// lists
	| ListItemBlock
	| BulletedListBlock
	| NumberedListBlock
	// image
	| ImageElement
	//Document
	| DocumentElement
	| CheckListItemBlock
	| ExpandableBlock
	| VideoElement
	| EmbedBlock
	// AI
	| NoticeAIBlock
	| NoticeAIImagePromptBlock
	| PowerBarBlock
	// tables
	| TableBlock
	// navigation
	| PageBlock

export type CustomText = {
	text: string
	placeholder?: string
	bold?: boolean
	italic?: boolean
	code?: boolean
	color?: string
	bgColor?: string
	link?: string
	strikethrough?: boolean
	underline?: boolean
	menuOpener?: boolean
}

declare module 'slate' {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor
		Element: CustomElement
		Text: CustomText
	}
}
