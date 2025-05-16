import { DefaultLeaf, RenderLeafProps } from 'slate-react'
import styled from 'styled-components'
import { useT } from '../../../../../hooks/useT'

export const Placeholder = (props: RenderLeafProps) => {
	const [t] = useT()
	return (
		<>
			<StyledPlaceholder contentEditable={false}>
				{t('Type', 'type')} <Kdb>/</Kdb> {t('to add blocks and for commands', 'forCommands')}
			</StyledPlaceholder>
			<DefaultLeaf {...props} />
		</>
	)
}

const Kdb = styled.kbd`
	background-color: ${({ theme }) => theme.colors.lightGrey};
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 20px;
	padding: 1px 3px;
`

const StyledPlaceholder = styled.span`
	position: absolute;
	color: ${({ theme }) => theme.colors.greyLight};
	user-select: none;
	cursor: text;
`
