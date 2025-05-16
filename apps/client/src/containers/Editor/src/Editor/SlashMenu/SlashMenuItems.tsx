// libs
import { Editor } from 'slate'
import styled from 'styled-components'
import {
	BulletedListIcon,
	CodeIcon,
	DividerIcon,
	ExpandableIcon,
	File06Icon,
	Heading1Icon,
	Heading2Icon,
	Heading3Icon,
	HintIcon,
	ImageIcon,
	JavascriptIcon,
	NoticeAIIcon,
	NumberedListIcon,
	QuoteIcon,
	TableIcone,
	TextIcon,
	TodoIcon,
	VideoIcon,
} from '../../Icons'
import { AirTableIcon } from '../../Icons/AirTable.icon'
import { HTMLIcon } from '../../Icons/HTML.icon'
import { LoomIcon } from '../../Icons/Loom.icon'
import { VimeoIcon } from '../../Icons/Vimeo.icon'
import { YoutubeIcon } from '../../Icons/YoutubeIcon'
import { insertCheckList } from '../Blocks/Checklist/Checklist'
import { insertCode } from '../Blocks/Code/Code'
import { insertDivider } from '../Blocks/Divider'
import { openDocumentUploader } from '../Blocks/Document/Document'
import { insertExpandable } from '../Blocks/Expandable/Expandable'
import { insertHTML } from '../Blocks/HTML/HTML'
import { insertHeader1, insertHeader2, insertHeader3 } from '../Blocks/Header'
import { insertHint } from '../Blocks/Hint'
import { openImageUploader } from '../Blocks/Image/Image'
import { insertJavascript } from '../Blocks/Javascript/Javascript'
import { insertBulletedList, insertNumberedList } from '../Blocks/List'
import { insertNoticeAIImagePrompt } from '../Blocks/NoticeAI/NoticeAIImagePrompt'
import { insertNoticeAITextPrompt } from '../Blocks/NoticeAI/NoticeAITextPrompt'
import { insertParagraph } from '../Blocks/Paragraph'
import { insertQuoteBlock } from '../Blocks/Quote'
import { insertNewTable } from '../Blocks/Table/Table'
import { openVideoUploader } from '../Blocks/Video/Video'
import { MenuItem } from '../Components/Menu/MenuItem'
import { getT } from '../../../../../internationalisation'
import { openAudioUploader } from '../Blocks/Audio/Audio'
import { AudioIcon } from '../../Icons/Audio.icon'

const IconWrapper = styled.div`
	width: 30px;
	height: 30px;
	background-color: transparent;
	border-radius: 3px;
	display: flex;
	align-items: center;
	justify-content: center;
`

interface MenuItem {
	icon: React.ReactElement
	label: string | React.ReactElement
	keywords?: string[]
	action: (editor: Editor) => void
	name: string
	subtype: 'MenuItem'
}

interface MenuSectionTitle {
	// do not use keyword 'type' here it's namespaced by something (react I think)
	subtype: 'SectionTitle'
	label: string
}

const LabelWrapper = styled.div`
	display: flex;
	flex-direction: column;
	align-items: baseline;
	color: ${({ theme }) => theme.colors.textGrey};
`

const LabelTitle = styled.div`
	font-size: 14px;
`

const LabelDescription = styled.div`
	font-size: 11px;
`

export const menuItems: Array<MenuItem | MenuSectionTitle> = [
	{
		subtype: 'SectionTitle',
		label: getT('Basic Blocks', 'basicBlocks'),
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<TextIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Paragraph', 'paragraph')}</LabelTitle>
				<LabelDescription>{getT('Just write some text', 'justWriteDownSomeText')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['text'],
		// used for keys
		name: 'paragraph',
		action: insertParagraph,
	},
	{
		subtype: 'MenuItem',

		icon: (
			<IconWrapper>
				<Heading1Icon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Heading', 'heading')} 1</LabelTitle>
				<LabelDescription>{getT('Big section heading', 'bigSectionHeading')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['title', 'h1', 'heading'],
		action: insertHeader1,
		name: 'heading1',
	},
	{
		subtype: 'MenuItem',

		icon: (
			<IconWrapper>
				<Heading2Icon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Heading', 'heading')} 2</LabelTitle>
				<LabelDescription>{getT('Medium section heading', 'mediumSectionHeading')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['title', 'h2', 'heading'],
		action: insertHeader2,
		name: 'heading2',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<Heading3Icon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Heading', 'heading')} 3</LabelTitle>
				<LabelDescription>{getT('Small section heading', 'smallSectionHeading')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['title', 'h3', 'heading'],
		action: insertHeader3,
		name: 'heading3',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<BulletedListIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Bulleted list', 'bulletedList')}</LabelTitle>
				<LabelDescription>{getT('Organize content with bullets', 'organizeContentWithBullets')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['bulleted list'],
		action: insertBulletedList,
		name: 'Bulleted list',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<NumberedListIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Numbered list', 'numberedList')}</LabelTitle>
				<LabelDescription>{getT('Create a numbered list', 'createANumberedList')}</LabelDescription>
			</LabelWrapper>
		),
		action: insertNumberedList,
		name: 'Numbered list',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<CodeIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Code', 'code')}</LabelTitle>
				<LabelDescription>{getT('Capture a code snippet', 'captureACodeSnippet')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['snippet', 'code'],
		action: insertCode,
		name: 'Code',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<HintIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Hint', 'hint')}</LabelTitle>
				<LabelDescription>{getT('Provide helpful information', 'provideHelpfulInformation')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['warning', 'tip', 'callout'],
		name: 'Hint',
		action: insertHint,
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<QuoteIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Quote', 'quote')}</LabelTitle>
				<LabelDescription>
					{getT('Highlight a specific passage of text', 'highlightASpecificPassageOfText')}
				</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['citation', 'extract'],
		name: 'Quote',
		action: insertQuoteBlock,
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<DividerIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Divider', 'divider')}</LabelTitle>
				<LabelDescription>{getT('Separate different blocks', 'separateDifferentBlocks')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['separator', 'line', 'hr', 'section'],
		action: insertDivider,
		name: 'Divider',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<TodoIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('To-do', 'toDo')}</LabelTitle>
				<LabelDescription>{getT('Keep track of tasks or items', 'keepTrackOfTasksOrItems')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['todo', 'checklist'],
		action: insertCheckList,
		name: 'To-do',
	},
	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<CardsIcon />
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>Cards</LabelTitle>
	// 			<LabelDescription>Organize content with cards</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	name: 'Card',

	// 	action: () => alert('🚜 work in progress 🚜'),
	// },
	{
		subtype: 'SectionTitle',
		label: getT('Media', 'media'),
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<ImageIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Image', 'image')}</LabelTitle>
				<LabelDescription>{getT('Upload an image file', 'uploadAnImageFile')}</LabelDescription>
			</LabelWrapper>
		),
		name: 'Image',
		action: openImageUploader,
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<File06Icon size={20} />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Document', 'document')}</LabelTitle>
				<LabelDescription>{getT('Upload a document', 'uploadADocument')}</LabelDescription>
			</LabelWrapper>
		),
		name: 'Document',
		keywords: ['document', 'file', 'upload'],
		action: openDocumentUploader,
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<VideoIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Video', 'video')}</LabelTitle>
				<LabelDescription>{getT('Add a video', 'addAVideo')}</LabelDescription>
			</LabelWrapper>
		),
		name: 'Video',
		action: openVideoUploader,
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<AudioIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Audio', 'audio')}</LabelTitle>
				<LabelDescription>{getT('Add an audio', 'addAudio')}</LabelDescription>
			</LabelWrapper>
		),
		name: 'Audio',
		keywords: ['mp3', 'audio', 'music'],
		action: openAudioUploader,
	},

	// {
	// 	subtype: 'SectionTitle',
	// 	label: 'Navigation',
	// },
	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<PageIcon />
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>Page</LabelTitle>
	// 			<LabelDescription>Add a new page</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	action: insertPage,
	// 	name: 'Page',
	// },
	{
		subtype: 'SectionTitle',
		label: getT('Advanced blocks', 'advancedBlocks'),
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<TableIcone />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Table', 'table')}</LabelTitle>
				<LabelDescription>{getT('Organize with rows and columns', 'organizeWithRowsAndColumns')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['table', 'sheet', 'grid'],
		action: insertNewTable,
		name: 'Table',
	},
	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<ExpandableIcon />
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>Power Bar</LabelTitle>
	// 			<LabelDescription>Add a powerful action bar</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	keywords: ['power', 'bar', 'search', 'top', 'contact', 'dark', 'langu'],
	// 	action: insertPowerBar,
	// 	name: 'Power Bar',
	// },

	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<ExpandableIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Expandable', 'expandable')}</LabelTitle>
				<LabelDescription>{getT('Add a collapsable block', 'addACollapsableBlock')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['faq', 'question', 'answer', 'collapse', 'toggle'],
		action: insertExpandable,
		name: 'Expandable',
	},

	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<NoticeAIIcon />
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>{getT('Text AI generation', 'textAIGeneration')}</LabelTitle>
	// 			<LabelDescription>{getT('Let our robot create your content', 'letOurRobotCreateYourContent')}</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	name: 'Notice AI Text',
	// 	keywords: ['ai', 'gpt', 'generate', 'autocomplete', 'prompt', 'idea'],
	// 	action: insertNoticeAITextPrompt,
	// },
	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<NoticeAIIcon />
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>{getT('Image AI generation', 'imageAIGeneration')}</LabelTitle>
	// 			<LabelDescription>{getT('Let our robot create your images', 'letOurRobotCreateYourImages')}</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	name: 'Notice AI Image',
	// 	keywords: ['gpt', 'generate', 'prompt', 'image', 'dall'],
	// 	action: insertNoticeAIImagePrompt,
	// },

	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<JavascriptIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Javascript', 'javascript')}</LabelTitle>
				<LabelDescription>{getT('Embed JavaScript', 'embedJavascript')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['code', 'javascript', 'html'],
		action: insertJavascript,
		name: 'Javascript',
	},

	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<HTMLIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('HTML', 'html')}</LabelTitle>
				<LabelDescription>{getT('Embed HTML', 'embedHTML')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['code', 'javascript', 'html'],
		action: insertHTML,
		name: 'HTML',
	},
	{
		subtype: 'SectionTitle',
		label: 'Embeds',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<YoutubeIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>{getT('Youtube', 'youtube')}</LabelTitle>
				<LabelDescription>{getT('Embed youtube videos', 'embedYoutubeVideos')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['youtube', 'video'],
		action: (editor) =>
			insertParagraph(editor, [
				{
					text: getT(
						'Just copy paste the link of your video in an empty paragraph to automatically embed a Youtube video. Example link: https://www.youtube.com/watch?v=m4fDm4rdUdk',
						'justCopyPasteTheLinkOfYourVideo'
					),
				},
			]),
		name: 'Youtube',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<LoomIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>Loom</LabelTitle>
				<LabelDescription>{getT('Embed Loom videos', 'embedLoomVideos')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['loom', 'video'],
		action: (editor) =>
			insertParagraph(editor, [
				{
					text: getT(
						'Just copy paste the link of your video in an empty paragraph to automatically embed a Loom video. Example link: https://www.loom.com/share/36656bc4afb84de2bb829183f46a1b40',
						'justCopyPasteLoomVideo'
					),
				},
			]),
		name: 'Loom',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<VimeoIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>Vimeo</LabelTitle>
				<LabelDescription>{getT('Embed Vimeos', 'embedVimeos')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['vimeo', 'video'],
		action: (editor) =>
			insertParagraph(editor, [
				{
					text: getT(
						'Just copy paste the link of your video in an empty paragraph to automatically embed a Vimeo video. Example link: https://vimeo.com/251147627',
						'embedVimeosInstructions'
					),
				},
			]),
		name: 'Vimeo',
	},
	{
		subtype: 'MenuItem',
		icon: (
			<IconWrapper>
				<AirTableIcon />
			</IconWrapper>
		),
		label: (
			<LabelWrapper>
				<LabelTitle>AirTable</LabelTitle>
				<LabelDescription>{getT('Embed AirTable', 'embedAirtable')}</LabelDescription>
			</LabelWrapper>
		),
		keywords: ['airtable', 'table', 'data', 'database'],
		action: (editor) =>
			insertParagraph(editor, [
				{
					text: getT(
						'Paste the link of your table view in an empty paragraph to automatically embed an AirTable. Example link: https://airtable.com/appeh8s8bwMI7JjlW/shro43JbOcXFQH0tQ/tblnrBMRpvfrcqkko',
						'embedAirtableInstructions'
					),
				},
			]),
		name: 'AirTable',
	},

	// {
	// 	subtype: 'MenuItem',
	// 	icon: (
	// 		<IconWrapper>
	// 			<img
	// 				width="32px"
	// 				height="32px"
	// 				src="https://pbs.twimg.com/profile_images/1059761684762583040/dqtUPCRz_400x400.jpg"
	// 			/>
	// 		</IconWrapper>
	// 	),
	// 	label: (
	// 		<LabelWrapper>
	// 			<LabelTitle>TimeTonic</LabelTitle>
	// 			<LabelDescription>Embed TimeTonic forms</LabelDescription>
	// 		</LabelWrapper>
	// 	),
	// 	keywords: ['TimeTonic', 'form'],
	// 	action: (editor) =>
	// 		insertParagraph(editor, [
	// 			{
	// 				text: 'Just copy paste the link of your form in an empty paragraph to automatically embed a TimeTonic form. Example link: ',
	// 			},
	// 			{
	// 				text: 'https://timetonic.com/live/v7/externform?n=1&b_o=qchante&t=dcd7fd56687512770d827c713a026a6aaf48216ee941bfb00d6e',
	// 				italic: true,
	// 			},
	// 		]),
	// 	name: 'TimeTonic',
	// },
]
