import { useState } from 'react'
import Picker from '@emoji-mart/react'

import { Menu } from '../../components/Menu'

interface Props<T> {
	// Menu
	anchorRef: T | null
	onClose?: () => any

	// Data
	onSelect?: (emoji: string) => any
}

const CUSTOM = [
	{
		id: 'notice',
		name: 'Notice',
		emojis: [
			{
				id: 'article',
				name: 'Article',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/article.svg' }],
			},
			{
				id: 'briefcase',
				name: 'Briefcase',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/briefcase.svg' }],
			},
			{
				id: 'document',
				name: 'Document',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/document.svg' }],
			},
			{
				id: 'flag',
				name: 'Flag',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/flag.svg' }],
			},
			{
				id: 'glasses',
				name: 'Glasses',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/glasses.svg' }],
			},
			{
				id: 'heart-chat',
				name: 'Heart in chat bubble',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/heart-chat.svg' }],
			},
			{
				id: 'money-check',
				name: 'Money Check',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/money-check.svg' }],
			},
			{
				id: 'padlock',
				name: 'Padlock',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/padlock.svg' }],
			},
			{
				id: 'page',
				name: 'Page',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/page.svg' }],
			},
			{
				id: 'play-button',
				name: 'Play Button',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/play-button.svg' }],
			},
			{
				id: 'question',
				name: 'Question Mark',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/question.svg' }],
			},
			{
				id: 'signed-document',
				name: 'Signed Document',
				keywords: ['notice'],
				skins: [{ src: '/assets/svg/emojis/signed-document.svg' }],
			},
		],
	},
]

export const EmojiMenu = <T extends HTMLElement>({ anchorRef, onClose, onSelect }: Props<T>) => {
	const [closing, setClosing] = useState(false)

	return (
		<Menu scrollable={false} closing={closing} anchorRef={anchorRef} offset={[0, 4]} onClose={onClose}>
			<Picker
				theme="light"
				custom={CUSTOM}
				previewPosition="none"
				onEmojiSelect={(emoji: any) => {
					onSelect?.call(onSelect, emoji.native ?? emoji.shortcodes)
					setClosing(true)
				}}
			/>
		</Menu>
	)
}
