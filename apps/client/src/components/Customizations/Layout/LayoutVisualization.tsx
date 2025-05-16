import styled from 'styled-components'
import { useT } from '../../../hooks/useT'

export type SpacesType = 'left' | 'right' | 'top' | 'bottom' | 'header' | 'main'

interface Props {
	activeSpace: SpacesType
}

export const LayoutVisualization = ({ activeSpace }: Props) => {
	const [t] = useT()
	return (
		<Wrapper>
			<GridLayout>
				<LeftSpace isActive={activeSpace == 'left'}>
					Left <br /> Space
				</LeftSpace>
				<HeaderSpace isActive={activeSpace == 'header'}>Header Space</HeaderSpace>
				<RightSpace isActive={activeSpace == 'right'}>
					Right <br /> Space
				</RightSpace>
				<MainColumn isActive={activeSpace == 'main'}>Main Space</MainColumn>
				<BottomSpace isActive={activeSpace == 'bottom'}>Bottom Space</BottomSpace>
				<TopSpace isActive={activeSpace == 'top'}>Top Space</TopSpace>
			</GridLayout>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	height: 150px;
	width: 230px;
	box-sizing: border-box;

	background: ${({ theme }) => theme.colors.white};
	color: ${({ theme }) => theme.colors.textLighterGrey};
	overflow-wrap: break-word;
	overflow: hidden;
`

const GridLayout = styled.div`
	display: grid;

	grid-template-rows: 1fr 1fr 1fr 1fr 1fr;
	grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

	height: 100%;
	width: 100%;

	box-sizing: border-box;
`

const LeftSpace = styled.div<{ isActive: boolean }>`
	grid-row-start: 2;
	grid-column-start: 1;

	grid-row-end: 6;
	grid-column-end: 2;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};

	border: 1px solid ${({ theme }) => theme.colors.border};

	display: flex;
	align-items: center;
	justify-content: center;
`

const HeaderSpace = styled.div<{ isActive: boolean }>`
	grid-row-start: 1;
	grid-column-start: 1;

	grid-row-end: 2;
	grid-column-end: 6;
	//border: 1px solid #bcf975;
	border: 1px solid ${({ theme }) => theme.colors.border};

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};
`
const RightSpace = styled.div<{ isActive: boolean }>`
	grid-row-start: 2;
	grid-column-start: 5;

	grid-row-end: 6;
	grid-column-end: 6;
	//border: 1px solid #65da96;
	border: 1px solid ${({ theme }) => theme.colors.border};

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};
`
const MainColumn = styled.div<{ isActive: boolean }>`
	grid-row-start: 3;
	grid-column-start: 2;

	grid-row-end: 5;
	grid-column-end: 5;
	// border: 1px solid #e8bd8e;
	border: 1px solid ${({ theme }) => theme.colors.border};

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};
`
const BottomSpace = styled.div<{ isActive: boolean }>`
	grid-row-start: 5;
	grid-column-start: 2;

	grid-row-end: 6;
	grid-column-end: 5;
	border: 1px solid ${({ theme }) => theme.colors.border};

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};
`

const TopSpace = styled.div<{ isActive: boolean }>`
	grid-row-start: 2;
	grid-column-start: 2;

	grid-row-end: 3;
	grid-column-end: 5;
	border: 1px solid ${({ theme }) => theme.colors.border};
	// border: 1px solid #6779de;

	display: flex;
	align-items: center;
	justify-content: center;

	background-color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : 'transparent')};
	color: ${({ theme, isActive }) => (isActive ? theme.colors.white : 'inherit')};
`
