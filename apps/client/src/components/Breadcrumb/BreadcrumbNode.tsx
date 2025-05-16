import { PageModel } from '@notice-app/models'
import styled from 'styled-components'

import { usePageBlock } from '../../hooks/bms/page/usePages'
import { useSearchParam } from '../../hooks/useSearchParam'
import { renderIcon } from '../../utils/icon'

interface Props {
	page: PageModel.node
	index: number
}

const shortenText = (text?: string) => {
	if (!text) return null
	const result = text.length > 34 ? text.slice(0, 31).concat('...') : text
	return result
}

export const BreadcrumbNode = ({ page, index }: Props) => {
	const block = usePageBlock(page)
	const [, setPageId] = useSearchParam('page')

	if (!block) return <></>

	return (
		<>
			{index > 0 && <Separator />}
			<Container onClick={() => setPageId(page.id)}>
				{renderIcon(block.metadata?.icon)}
				<Title untitled={!block.data.text || block.data.text === ''}>
					{shortenText(block.data.text) || 'Untitled'}
				</Title>
			</Container>
		</>
	)
}

const Container = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 3px 6px;
	border-radius: ${({ theme }) => theme.borderRadius};

	cursor: pointer;
	user-select: none;
	font-size: 12px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`

const Separator = styled.span`
	width: 2px;
	align-self: stretch;
	margin: 5px 4px;
	transform: rotateZ(15deg);
	background-color: ${({ theme }) => theme.colors.grey};
`

const Title = styled.p<{ untitled: boolean }>`
	color: ${({ theme, untitled }) => (untitled ? theme.colors.textGrey : theme.colors.textDark)};
`
