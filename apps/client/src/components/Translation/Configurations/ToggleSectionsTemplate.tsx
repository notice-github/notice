import { ReactNode } from 'react'
import styled from 'styled-components'
import { Switch } from '../../Switch'

interface Props {
	title: string
	description: ReactNode
	toggled?: boolean
	onToggleChange?: (value: boolean) => void
}

export const ToggleSectionsTemplate = ({ title, description, toggled, onToggleChange }: Props) => {
	return (
		<FlexRow>
			<FlexColumn gap="4px">
				<SectionTitle>{title}</SectionTitle>
				<Description>{description}</Description>
			</FlexColumn>
			{toggled !== undefined && <Switch value={toggled} onChange={onToggleChange} size={'lg'} />}
		</FlexRow>
	)
}

const FlexColumn = styled.div<{ gap: string }>`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: column;
	gap: ${({ gap }) => gap};
	box-sizing: border-box;
`

const FlexRow = styled.div`
	width: 100%;
	height: 100%;

	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`

const SectionTitle = styled.h4`
	font-size: 16px;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.primaryDark};
`

const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textGrey};
`
