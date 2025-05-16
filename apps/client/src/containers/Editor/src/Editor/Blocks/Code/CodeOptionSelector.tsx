import { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Menu } from '../../Components/Menu'
import { MenuItem } from '../../Components/Menu/MenuItem'
import { Show } from '../../Components/Show'

interface DropdownProps {
	data: Record<string, string>[]
	type: string
	onChange: (value: string) => void
	defaultValue?: Record<string, string>
}

export const CodeOptionSelector = ({ data, onChange, type, defaultValue }: DropdownProps) => {
	const [referenceElement, setReferenceElement] = useState<HTMLButtonElement | null>(null)
	const [selectedOption, setSelectedOption] = useState<Record<string, string> | undefined>(defaultValue)
	const [menuOpened, setMenuOpened] = useState(false)

	const sortedData = useMemo(() => data.sort((a, b) => a.name.localeCompare(b.name)), [data])

	return (
		<>
			<ReferenceButton
				contentEditable="false"
				suppressContentEditableWarning
				ref={setReferenceElement}
				onClick={() => setMenuOpened(true)}
			>
				<FlexRow>
					<div>{selectedOption?.name}</div>
				</FlexRow>
			</ReferenceButton>
			<Show when={menuOpened}>
				<Menu
					closing={!menuOpened}
					anchorRef={referenceElement}
					offset={[0, 5]}
					onClose={() => setMenuOpened(false)}
					maxHeight={'200px'}
					placement="top"
				>
					<>
						<StyledTitle>Choose a {type} </StyledTitle>
						{sortedData.map((d, idx) => {
							return (
								<MenuItem
									key={`${d.name}-${idx}`}
									text={<div>{d.name}</div>}
									name={d.name}
									onClick={() => {
										setMenuOpened(false)
										setSelectedOption(d)
										onChange(d.value)
									}}
								/>
							)
						})}
					</>
				</Menu>
			</Show>
		</>
	)
}

const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	gap: 4px;
	align-items: center;
	justify-content: center;
`

const ReferenceButton = styled.button`
	display: flex;
	flex-direction: row;
	flex-grow: 0;
	align-items: center;
	justify-content: center;
	gap: 12px;
	font-size: 14px;
	font-weight: 500;
	padding: 12px;
	height: 15px;

	border: none;
	outline-style: none;
	background-color: transparent;

	font-size: 14px;
	color: ${({ theme }) => theme.colors.grey};
	white-space: nowrap;
	border-radius: 4px;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.primaryExtraLight};
		color: ${({ theme }) => theme.colors.primary};
	}
`
const StyledTitle = styled.h5`
	padding: 8px 12px;
`
