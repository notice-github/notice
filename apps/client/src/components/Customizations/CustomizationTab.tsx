import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'div'> {
	title: string
	selected: boolean
}

export const CustomizationTab = ({ title, selected, ...props }: Props) => {
	return (
		<Container selected={selected} {...props}>
			<Text selected={selected}>{title}</Text>
		</Container>
	)
}

const Container = styled.div<Pick<Props, 'selected'>>`
	display: flex;
	align-items: center;
	gap: 4px;
	border-bottom: solid 2px transparent;
	height: 0;
	cursor: pointer;

	padding: 16px;
	margin-right: 8px;

	border-bottom: ${({ theme, selected }) => (selected ? `solid 2px ${theme.colors.primary}` : undefined)};
`

const Text = styled.div<Pick<Props, 'selected'>>`
	font-style: normal;
	font-weight: 700;
	font-size: 13px;

	color: ${({ theme }) => theme.colors.greyDark};

	display: flex;
	align-items: center;

	color: ${({ theme, selected }) => (selected ? theme.colors.primary : undefined)};
`
