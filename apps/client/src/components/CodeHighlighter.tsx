import { tokyoNightStorm } from '@uiw/codemirror-theme-tokyo-night-storm'
import CodeMirror, { ReactCodeMirrorProps } from '@uiw/react-codemirror'

import { langs } from '@uiw/codemirror-extensions-langs'
import styled, { useTheme } from 'styled-components'
import useCopyToClipboard from '../hooks/useCopyToClipboard'
import Copied from '../icons/Copied'
import { CopyIcon } from '../icons/CopyIcon'
import { ExportIcon } from '../icons/ExportIcon'

interface IProps extends ReactCodeMirrorProps {
	code?: string
	onDownload?: () => void
}

export const CodeHighlighter = ({ code, extensions = [langs.jsx()], onDownload }: IProps) => {
	const [isCopied, handleOnCopy] = useCopyToClipboard()
	const theme = useTheme()
	if (!code) return null
	return (
		<RelativeDiv>
			<StyledButton
				isCopied={isCopied}
				onClick={() => handleOnCopy(code)}
				right={0}
				type="button"
				aria-label="Copy to Clipboard Button"
			>
				{isCopied ? <Copied size={18} color={theme.colors.spray} /> : <CopyIcon size={18} color={theme.colors.white} />}
			</StyledButton>
			{onDownload && (
				<StyledButton onClick={onDownload} right={'30px'} type="button" aria-label="Download Button">
					<ExportIcon size={20} color={theme.colors.white} />
				</StyledButton>
			)}
			<CodeMirror
				theme={tokyoNightStorm}
				basicSetup={{
					bracketMatching: true,
					allowMultipleSelections: true,
				}}
				value={code}
				extensions={extensions}
				editable={false}
				height="auto"
			/>
		</RelativeDiv>
	)
}

const RelativeDiv = styled.div`
	position: relative;
	border-radius: 4px;

	.cm-editor {
		outline: none;
		border-radius: 4px;
	}
	.cm-scroller {
		border-radius: 4px;
	}
`

const StyledButton = styled.button<{ right: string | number; isCopied?: boolean }>`
	position: absolute;
	right: ${({ right }) => right};
	top: 0;
	background: transparent;
	z-index: 1;
	padding: 6px; // padding is set to different default values for Chrome and Safari
	margin: 0; // margin is set to different default values for Chrome and Safari
	border: none;
	font-size: 14px;

	display: flex;
	flex-direction: row;
	gap: 4px;
	color: white;
	align-items: center;

	cursor: pointer;

	&:hover {
		svg {
			fill: ${({ theme, isCopied }) => (isCopied ? theme.colors.spray : theme.colors.backgroundGrey)};
		}
	}
`
