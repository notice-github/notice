import { cloneElement } from 'react'
import styled, { useTheme } from 'styled-components'
import { Checkbox } from '../Checkbox/Checkbox.component'

type MenuType = 'SectionTitle' | 'MenuItem'

interface MenuItemProps extends React.ComponentPropsWithoutRef<'div'> {
	icon?: React.ReactElement
	text: string | React.ReactElement
	keywords?: string[]
	name: string
	subtype?: MenuType
	isSelected?: boolean
	optionSelectable?: boolean
	autoClose?: boolean
}

export const MenuItem = ({
	icon,
	optionSelectable,
	isSelected,
	onClick,
	text,
	keywords,
	subtype = 'MenuItem',
	...props
}: MenuItemProps) => {
	const theme = useTheme()

	return (
		<StyledDiv onClick={onClick} {...props}>
			<FlexRow>
				{optionSelectable && <Checkbox type="checkbox" checked={isSelected} onChange={onClick} />}

				{icon && cloneElement(icon, { color: theme.colors.primary })}
				{text}
			</FlexRow>
		</StyledDiv>
	)
}

const StyledDiv = styled.div<any>`
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-right: 6px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
`

const FlexRow = styled.div`
	display: flex;
	gap: 12px;
	cursor: pointer;
	justify-content: center;
	align-items: center;
	padding: 6px 0px 6px 16px;
	margin: 6px 0;
`
