import { Dispatch, SetStateAction, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { ArrowDownFilled, CrossIcon, SearchIcon } from '../../icons'
import { Row } from '../Flex'
import { Menu } from '../Menu'
import { PublishState, usePublishButtonStyle } from '../PublishButton'
import { Show } from '../Show'
import { PublishHosting } from './PublishHosting'
import { PublishIntegration } from './PublishIntegration'
import { PublishMenuTab } from './PublishMenuTab'
import { useT } from '../../hooks/useT'

interface Props {
	publishState: PublishState
	disabled?: boolean
}

export function PublicMenuSelector({ publishState, disabled }: Props) {
	const [project] = useCurrentProject()

	const [menuOpened, setMenuOpened] = useState(false)
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const style = usePublishButtonStyle(publishState, project)

	return (
		<>
			<ExpandButton
				color={style.text}
				disabled={disabled}
				background={style.background}
				isPublished={publishState === 'up_to_date'}
				ref={setRef}
				onClick={() => setMenuOpened(true)}
			>
				<ArrowDownFilled size={10} color={style.text} />
			</ExpandButton>
			{menuOpened && <PublishMenu anchorRef={ref} setMenuOpened={setMenuOpened} />}
		</>
	)
}

interface IPublishMenu {
	anchorRef: HTMLDivElement | null
	setMenuOpened: Dispatch<SetStateAction<boolean>>
}

export const PublishMenu = ({ anchorRef, setMenuOpened }: IPublishMenu) => {
	const [t] = useT()
	const theme = useTheme()

	const [closing, setClosing] = useState(false)
	const [selected, setSelected] = useState('hosting')
	const [showInput, setShowInput] = useState(false)
	const [searchValue, setSearchValue] = useState<string | null>(null)

	return (
		<StyledMenu
			closing={closing}
			maxHeight="380px"
			anchorRef={anchorRef}
			placement="right-start"
			offset={[38, -40]}
			onClose={() => {
				setMenuOpened(false)
			}}
		>
			<Flex>
				<TabContainer>
					<TabBar>
						<Row>
							<PublishMenuTab
								title={t('Integration', 'integration')}
								selected={selected === 'integration'}
								onClick={() => {
									setSelected('integration')
								}}
							/>
							<PublishMenuTab
								title={t('Hosting', 'hosting')}
								selected={selected === 'hosting'}
								onClick={() => setSelected('hosting')}
							/>
						</Row>

						<Row align="center" style={{ padding: showInput ? '0 16px 0 0' : '0 16px' }} gap={12}>
							<Show when={showInput && selected === 'integration'}>
								<InputGroup show={showInput}>
									<StyledInput
										placeholder="search..."
										onChange={(e) => setSearchValue(e.target.value)}
										spellCheck={false}
										type="text"
									/>
									<ClearButton
										onClick={() => {
											setSearchValue(null)
											setShowInput(false)
										}}
									>
										<CrossIcon size={9} color={theme.colors.grey} />
									</ClearButton>
								</InputGroup>
							</Show>
							<Show when={selected === 'integration' && !showInput}>
								<SearchIconContainer
									showInput={showInput}
									onClick={() => {
										setShowInput(true)
									}}
								>
									<SearchIcon size={11} color={theme.colors.twilightGrey} />
								</SearchIconContainer>
							</Show>
							<IconContainer onClick={() => setClosing(true)}>
								<CrossIcon size={11} color="grey" />
							</IconContainer>
						</Row>
					</TabBar>
					<Show when={selected === 'integration'}>
						<PublishIntegration searchValue={searchValue} closeMenu={() => setClosing(true)} />
					</Show>
					<Show when={selected === 'hosting'}>
						<PublishHosting closeMenu={() => setClosing(true)} />
					</Show>
				</TabContainer>
			</Flex>
		</StyledMenu>
	)
}

const StyledMenu = styled(Menu)`
	box-sizing: border-box;
`

const ExpandButton = styled.div<{ color: string; background: string; isPublished: boolean; disabled?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 6px 12px;

	outline-style: none;

	border-top-right-radius: ${({ theme }) => theme.borderRadius};
	border-bottom-right-radius: ${({ theme }) => theme.borderRadius};

	${({ isPublished, color }) =>
		isPublished
			? css`
					border: none;
					border-left: 1px solid white;
			  `
			: css`
					border: 2.5px solid ${color};
					border-left: none;
			  `};

	background-color: ${({ background }) => background};

	font-size: 14px;
	font-weight: 600;
	cursor: ${({ disabled }) => (disabled ? undefined : 'pointer')};
	opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

	animation: fadeIn 0.4s ease-in-out;

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
`

const Flex = styled.div`
	display: flex;
	position: relative;
	box-sizing: border-box;

	overflow: hidden;

	background: ${({ theme }) => theme.colors.white};
`

const TabBar = styled.div`
	position: fixed;
	top: 0;
	margin-bottom: 10px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-sizing: border-box;

	padding-top: 8px;
	padding-left: 4px;
	border-bottom: 2px solid ${({ theme }) => theme.colors.borderLight};
	width: 100%;

	background: white;
`

const TabContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: white;
	box-sizing: border-box;
	overflow: hidden;

	width: 100%;
	height: 100%;
`

const SearchIconContainer = styled.div<{ showInput: boolean }>`
	padding: 2px;
	cursor: pointer;
	box-sizing: border-box;

	transition: opacity 2s;
	opacity: ${({ showInput }) => (showInput ? '0' : '1')};
`

const IconContainer = styled.div`
	padding: 2px;
	cursor: pointer;
	box-sizing: border-box;
`

const InputGroup = styled.div<{ show: boolean }>`
	position: relative;
	margin-top: 4px;
	display: flex;
	flex-direction: row;
	width: ${({ show }) => (show ? '140px' : '0')};

	// transform: ${({ show }) => (show ? 'scaleX(1)' : 'scaleX(0)')};
	transition: width 2s ease;
	// transform-origin: 0 0;
`

const ClearButton = styled.div`
	position: absolute;
	right: 0;
	bottom: 3px;

	cursor: pointer;
`

const StyledInput = styled.input`
	width: 100%;

	border: none;
	outline: none;
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
