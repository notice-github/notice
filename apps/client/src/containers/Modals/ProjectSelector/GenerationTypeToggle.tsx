import styled, { css, useTheme } from 'styled-components'
import { SelectedOptionType } from '.'
import Tooltip from '../../../components/Tooltip'
import { useT } from '../../../hooks/useT'
import { AIIcon, AllTemplateIcon } from '../../../icons/ProjectIcons'

interface Props {
	selectedType: SelectedOptionType
	onToggle: () => void
}

export const GenerationTypeToggle = ({ onToggle, selectedType }: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const isSelected = selectedType === 'ai' || selectedType === 'form'

	return <></>
	return (
		<Tooltip
			placement="top"
			offset={[8, 6]}
			content={t('You can toggle between AI generation and templates', 'selectProjectTip')}
		>
			<SelectorWrapper>
				<BgWrapper>
					<ToggleWrapper>
						<HiddenInput type="checkbox" checked={isSelected} onChange={onToggle} />
						<InnerWrapper>
							<LeftSpan isSelected={!isSelected}>
								<AllTemplateIcon size={18} color={!isSelected ? theme.colors.white : theme.colors.textGrey} />
								{t('Use Templates', 'useTemplates')}
							</LeftSpan>
							<RightSpan isSelected={isSelected}>
								<AIIcon size={18} color={isSelected ? theme.colors.white : theme.colors.textGrey} />
								{t('Use AI Generation', 'useAIGeneration')}
							</RightSpan>
						</InnerWrapper>
						<ToggleSwitch
							onAnimationEnd={() => localStorage.setItem('should_ai_toggle_hint', 'false')}
							isChecked={isSelected}
						></ToggleSwitch>
					</ToggleWrapper>
				</BgWrapper>
			</SelectorWrapper>
		</Tooltip>
	)
}

const SelectorWrapper = styled.div`
	width: 100%;
	height: fit-content;

	margin: 32px auto;
`

const BgWrapper = styled.div`
	width: 350px;
	height: fit-content;
	background-color: ${({ theme }) => theme.colors.backgroundLightGrey};

	display: flex;
	justify-content: center;
	border-radius: 6px;
	padding: 10px 16px;
	margin: auto;
`

const ToggleWrapper = styled.label`
	display: inline-block;
	position: relative;

	padding: 4px 0;
	cursor: pointer;

	width: 100%;
	height: 28px;
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
	right: 48%;
	z-index: 1;
	display: block;

	top: 2px;
	bottom: 3px;
	padding: 0;

	left: ${({ isChecked }) => (isChecked ? 'calc(50% - 3px)' : '3px')};
	width: 50%;
	height: 34px;
	background-color: #00c0ff;

	background: linear-gradient(to right bottom, #00c0ff, #009efa, #007aef, #0052da, #4218b8);
	border-radius: 4px;

	transition: left 0.2s ease-out;
`
