import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { INTEGRATIONS } from '../../data/integrations'
import { Pages } from '../../pages'
import { Column, Row } from '../Flex'
interface IProps {
	closeMenu: () => void
	searchValue: string | null
}

export const PublishIntegration = ({ closeMenu, searchValue }: IProps) => {
	const navigate = useNavigate()

	const filteredIntegrations = useMemo(() => {
		if (searchValue == null || searchValue === '') return INTEGRATIONS
		return INTEGRATIONS.filter((int) => int.id.includes(searchValue.toLowerCase().trim()))
	}, [searchValue])

	if (!filteredIntegrations.length)
		return (
			<StyledColumn style={{ textAlign: 'center' }}>
				<Tile>No results found.</Tile>
			</StyledColumn>
		)

	return (
		<StyledColumn gap={10}>
			{filteredIntegrations.map((i) => {
				return (
					<Tile
						onClick={() => {
							navigate(`${Pages.INTEGRATIONS}/${i.id}`)
							closeMenu()
						}}
						gap={6}
						key={i.id}
					>
						<StyledRow align="center" gap={6}>
							<img src={i.icon}></img>
							<Title>{i.name}</Title>
						</StyledRow>
						<Text12>{i.description}</Text12>
					</Tile>
				)
			})}
		</StyledColumn>
	)
}

const StyledColumn = styled(Column)`
	padding: 16px 12px;
	margin-top: 40px;
	width: 430px;

	box-sizing: border-box;
`

const StyledRow = styled(Row)`
	img {
		width: 14px;
		height: 14px;
		object-fit: cover;
	}
`

const Text12 = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textGrey};
`

const Title = styled.h6`
	font-weight: 600;
	font-size: 14px;

	color: ${({ theme }) => theme.colors.textDark};
`

const Tile = styled(Column)`
	padding: 8px;
	border-radius: 4px;
	width: 100%;
	box-sizing: border-box;

	cursor: pointer;
	transition: background-color 0.3s ease;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};

	&:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
`
