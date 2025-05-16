import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import styled from 'styled-components'

export const CodeEditor = ({ value, onChange, placeholder, extensions }: ReactCodeMirrorProps) => {
	return (
		<Wrapper>
			<CodeMirror
				theme={tokyoNightStorm}
				value={value}
				placeholder={placeholder}
				basicSetup={{
					autocompletion: true,
					bracketMatching: true,
				}}
				extensions={extensions}
				onChange={onChange}
			/>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	box-sizing: border-box;
	width: 100%;
	height: 100%;
	.cm-editor {
		outline: none;
		border-radius: 4px;
		min-width: 1013px;
		height: 600px;
	}
	.cm-scroller {
		border-radius: 4px;
	}
`
