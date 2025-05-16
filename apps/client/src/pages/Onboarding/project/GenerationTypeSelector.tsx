import styled, { css, useTheme } from 'styled-components'
import Tooltip from '../../../components/Tooltip'
import { useT } from '../../../hooks/useT'
import { AIIcon, AllTemplateIcon } from '../../../icons/ProjectIcons'

export type SelectedOptionType = 'ai' | 'form' | 'template'

interface Props {
	selectedType: SelectedOptionType
	onToggle: () => void
}

export const GenerationTypeSelector = ({ onToggle, selectedType }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const isSelected = selectedType === 'ai' || selectedType === 'form'

	return (
		<SelectorWrapper>
			<BgWrapper>
				<ToggleWrapper>
					<HiddenInput type="checkbox" checked={isSelected} onChange={onToggle} />
					<InnerWrapper>
						<Tooltip placement="top" offset={[8, 6]} content={t('Use Templates', 'useTemplates')}>
							<LeftSpan isSelected={!isSelected}>
								<AllTemplateIcon size={14} color={!isSelected ? theme.colors.white : theme.colors.textGrey} />
							</LeftSpan>
						</Tooltip>
						<Tooltip placement="top" offset={[8, 6]} content={t('Use AI Generation', 'useAIGeneration')}>
							<RightSpan isSelected={isSelected}>
								<AIIcon size={14} color={isSelected ? theme.colors.white : theme.colors.textGrey} />
							</RightSpan>
						</Tooltip>
					</InnerWrapper>
					<ToggleSwitch
						onAnimationEnd={() => localStorage.setItem('should_ai_toggle_hint', 'false')}
						isChecked={isSelected}
					></ToggleSwitch>
				</ToggleWrapper>
			</BgWrapper>
		</SelectorWrapper>
	)
}

const SelectorWrapper = styled.div`
	width: fit-content;
	height: fit-content;

	margin-right: calc(24px * 2);
`

const BgWrapper = styled.div`
	width: 100px;
	height: fit-content;
	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};

	display: flex;
	justify-content: center;
	border-radius: 6px;
	padding: 6px 10px;
`

const ToggleWrapper = styled.label`
	display: inline-block;
	position: relative;

	padding: 4px 0;
	cursor: pointer;

	width: 100%;
	height: 15px;
`

const HiddenInput = styled.input`
	position: absolute;
	opacity: 0;
	z-index: 5;
`

const InnerWrapper = styled.span`
	position: absolute;
	left: 0;
	width: calc(100% - 2px);
	margin: 0;
	text-align: left;
	white-space: nowrap;
	margin: 0 3px;
`

const TextBase = css`
	position: absolute;
	top: 0;
	z-index: 2;

	font-size: 14px;
	height: fit-content;
	text-align: center;
	line-height: 30px;

	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	gap: 6px;
`

const LeftSpan = styled.span<{ isSelected: boolean }>`
	${TextBase}
	color: ${({ theme, isSelected }) => (isSelected ? theme.colors.white : theme.colors.textGrey)};

	left: 0;
	margin: 0;
	width: 50%;
`
const RightSpan = styled.span<{ isSelected: boolean }>`
	${TextBase}

	left: auto;
	right: 0;
	color: ${({ theme, isSelected }) => (isSelected ? theme.colors.white : theme.colors.textGrey)};
	margin: 0;
	width: 53%;
`

const ToggleSwitch = styled.div<{ isChecked: boolean }>`
	position: absolute;
	z-index: 1;
	display: block;

	top: 2px;
	right: 48%;

	bottom: 3px;
	padding: 0;

	left: ${({ isChecked }) => (isChecked ? 'calc(50% - 1px)' : '3px')};
	width: 50%;
	height: 20px;
	background-color: #00c0ff;

	background: linear-gradient(to right bottom, #00c0ff, #009efa, #007aef, #0052da, #4218b8);
	border-radius: 4px;

	transition: left 0.2s ease-out;
`
