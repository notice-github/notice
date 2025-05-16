import styled from 'styled-components'

interface Props {
	shortcut: string
}

export default function KeyboardKey({ shortcut }: Props) {
	return (
		<Wrapper>
			<Key>{shortcut}</Key>
		</Wrapper>
	)
}

export function PreviousKey() {
	return <KeyboardKey shortcut={'↑ + Shift'} />
}

export function NextKey() {
	return <KeyboardKey shortcut={'Shift + ↓'} />
}

export function EnterKey() {
	return <KeyboardKey shortcut={'↵'} />
}

export function ControlPlusVKey() {
	return <KeyboardKey shortcut={`Ctrl + V`} />
}

export function ControlPlusCKey() {
	return <KeyboardKey shortcut={`Ctrl + C`} />
}

export function MetaPlusRight() {
	const OS = getOS()
	const key = OS === 'MacOS' ? '⌘' : 'Ctrl'

	return <KeyboardKey shortcut={`${key} + ↓`} />
}

const OSSpecificKeys = {
	MacOS: {
		Meta: '⌘',
		Alt: '⌥',
	},
	Windows: {
		Meta: '⊞',
		Alt: 'Alt',
	},
}

const Wrapper = styled.div`
	background-color: #f7f7f7;
	box-shadow: 0 1px 0px rgba(0, 0, 0, 0.2), 0 0 0 2px #fff inset;
	border: 1px solid #ccc;
	border-radius: 4px;
`

const Key = styled.kbd`
	font-family: system-ui;
	font-weight: 600;
	display: inline-block;
	padding: 0.1em 0.5em;
	margin: 0 0.2em;
	color: ${({ theme }) => theme.colors.greyDark};
`

function getOS(): 'Windows' | 'MacOS' {
	// return windows by default
	let os: 'Windows' | 'MacOS' = 'Windows'

	const UA = window.navigator?.userAgent.platform
	const platform = window.navigator?.userAgentData?.platform || window.navigator.platform
	const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K', 'macOS']
	const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE']

	if (macosPlatforms.indexOf(platform) !== -1) {
		os = 'MacOS'
	} else if (windowsPlatforms.indexOf(platform) !== -1) {
		os = 'Windows'
	}

	return os
}
