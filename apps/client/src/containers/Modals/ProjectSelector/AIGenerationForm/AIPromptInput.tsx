import { ChangeEvent } from 'react'
import styled from 'styled-components'
import { FormTitle, Subtitle } from '.'
import { TemplateType } from '..'
import { useT } from '../../../../hooks/useT'

interface Props {
	isOptional: boolean
	value: string
	onChange: (value: string) => void
	template: TemplateType | null
	onEnter: () => void
}
export const AIPromptInput = ({ value, onChange, template, isOptional, onEnter }: Props) => {
	const [t] = useT()
	const onInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		if (e.target.value.length > 300) return
		onChange.call(onChange, e.target.value)
	}

	const title = isOptional
		? t(`You can enhance your generation by adding more instructions`, 'enhanceYourGeneration')
		: `${t(`Give instructions to generate your`, 'giveInstructions')} ${template?.name}`

	const subtext = isOptional
		? t(`Please make sure this prompt is matching with the selected project type.`, 'makeSureThisPromptIsMatching')
		: `Our AI takes this prompt and generates your ${template?.name}. Please be precise.`

	const placeHolder = isOptional
		? t(`Write it in French and only use past tense`, 'writeItInFrenchOnlyUsePastTense')
		: `Generate ${template?.name} in French about cars`

	const onKeyup = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && e.shiftKey) return

		if (e.key === 'Enter') {
			e.preventDefault()
			onEnter?.call(onEnter)
		}
	}

	return (
		<Wrapper>
			<div>
				<FormTitle>{title}</FormTitle>
				<Subtitle>{subtext}</Subtitle>
			</div>
			<InputWrapper>
				<StyledTextArea
					onKeyDown={onKeyup}
					placeholder={placeHolder}
					value={value}
					onChange={onInputChange}
				></StyledTextArea>
				<LengthWrapper>{value.length} / 300</LengthWrapper>
			</InputWrapper>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	gap: 8px;
	margin: 6px 0;
	width: 100%;
`

const StyledTextArea = styled.textarea`
	box-sizing: border-box;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;

	-moz-appearance: textfield-multiline;
	-webkit-appearance: textarea;

	height: 60px;
	width: 100%;
	overflow: scroll;
	outline: none;
	resize: none;

	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	padding: 8px 16px;
	border-radius: ${({ theme }) => theme.borderRadius};

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightGrey};
	}

	&:focus-within {
		border-color: ${({ theme }) => theme.colors.primary};
	}

	font-style: normal;
	font-weight: 500;
	font-size: 14px;
	color: ${({ theme }) => theme.colors.textDark};
`

const InputWrapper = styled.div`
	position: relative;
	width: 100%;
	height: fit-content;
`

const LengthWrapper = styled.div`
	position: absolute;
	bottom: 10px;
	right: 6px;
	color: ${({ theme }) => theme.colors.textLighterGrey};

	font-size: 10px;
`
