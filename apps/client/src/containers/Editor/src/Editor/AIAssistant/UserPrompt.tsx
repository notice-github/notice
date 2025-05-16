import styled, { useTheme } from 'styled-components'
import { DestroyElement } from '.'
import { useT } from '../../../../../hooks/useT'
import { AIIcon } from '../../../../../icons/ProjectIcons'
import { ArrowRight } from '../../Icons'
import { Loader } from '../Components/Loader/Loader'

interface Props {
	inputValue: string
	handleSubmit: () => void
	handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
	status: 'idle' | 'loading' | 'done'
	destroyElement: DestroyElement
	keepResponse: () => void
	retryInput: () => void
}

export const UserPrompt = ({
	inputValue,
	handleSubmit,
	handleInputChange,
	status,
	destroyElement,
	keepResponse,
	retryInput,
}: Props) => {
	const theme = useTheme()
	const [t] = useT()

	// This function is called when the user types in the textarea
	// It will resize the textarea to fit the text
	const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
		// @ts-ignore
		event.target.style.height = '21px' // Reset the height at the start of the input event
		// @ts-ignore
		event.target.style.height = `${event.target.scrollHeight}px` // Set the height to scroll height
	}

	return (
		<Wrapper>
			<div>
				<AIIcon size={16} color={theme.colors.yellorange} />
			</div>
			<TextWrapper>
				{status === 'loading' && (
					<ActionsWrapper style={{ justifyContent: 'space-between' }}>
						<AIIsWriting>{t('AI is writing...', 'AIIsWriting')}</AIIsWriting>
					</ActionsWrapper>
				)}
				{status === 'idle' && (
					<TextArea
						autoFocus
						value={inputValue}
						onChange={handleInputChange}
						placeholder={t('Describe what you want to create to our AI', 'DescribeWhatYouWantAI')}
						onInput={handleInput}
					/>
				)}
				{status === 'done' && (
					<DoneActions destroyElement={destroyElement} keepResponse={keepResponse} retryInput={retryInput} />
				)}
			</TextWrapper>
			<StyledRow>
				{status === 'loading' && <Loader size={17} color={theme.colors.yellorange} />}
				{status === 'idle' && (
					<WrapperArrowRight disabled={!inputValue} onClick={() => inputValue && handleSubmit()}>
						<ArrowRight size={20} color={'white'} />
					</WrapperArrowRight>
				)}
			</StyledRow>
		</Wrapper>
	)
}

interface DoneActionsProps {
	destroyElement: DestroyElement
	keepResponse: () => void
	retryInput: () => void
}

export const DoneActions = ({ destroyElement, keepResponse, retryInput }: DoneActionsProps) => {
	const [t] = useT()

	return (
		<ActionsWrapper>
			<MainCTA onClick={keepResponse}>{t('Keep', 'Keep')}</MainCTA>
			<ActionWrapper onClick={retryInput}>{t('Retry', 'Retry')}</ActionWrapper>
			<ActionWrapper onClick={destroyElement}>
				{t('Cancel', 'cancel')} <Kdb>ESC</Kdb>
			</ActionWrapper>
		</ActionsWrapper>
	)
}

const MainCTA = styled.span`
	transition: opacity 0.1s ease-in-out;
	font-size: 15px;
	padding: 4px;
	border-radius: 4px;
	margin-right: 8px;
	background-color: ${({ theme }) => theme.colors.mariner};
	color: white;
	cursor: pointer;
	:hover {
		opacity: 0.8;
	}
`

const Kdb = styled.kbd`
	background-color: ${({ theme }) => theme.colors.lightGrey};
	border: 1px solid #ccc;
	border-radius: 4px;
	width: 20px;
	padding: 1px 3px;
`

const ActionWrapper = styled.div`
	transition: background-color 0.1s ease-in-out;

	margin-right: 8px;
	justify-content: flex-end;
	font-size: 15px;
	color: ${({ theme }) => theme.colors.grey};
	cursor: pointer;
	:hover {
		background-color: ${({ theme }) => theme.colors.lightGrey};
	}
	padding: 4px;
	border-radius: 4px;
`

const ActionsWrapper = styled.div`
	display: flex;
	justify-content: end;
`

const AIIsWriting = styled.span`
	font-weight: 500;
	font-size: 14.5px;

	color: ${(props) => props.theme.colors.yellorange};
`

const TextWrapper = styled.div`
	width: 100%;
	padding-left: 12px;
`

const WrapperArrowRight = styled.div<{ disabled: boolean }>`
	display: flex;
	justify-content: center;
	border-radius: 100%;
	background-color: ${({ theme, disabled }) => (disabled ? theme.colors.grey : theme.colors.yellorange)};
	width: 20px;
	height: 20px;
	align-self: center;
	opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
	:hover {
		cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
		opacity: ${({ disabled }) => (disabled ? 0.5 : 0.8)};
	}
`

const TextArea = styled.textarea`
	font-family: inherit;
	outline: none;
	overflow: hidden;
	height: 21px;
	font-size: inherit;
	line-height: inherit;
	border: none;
	background: none;
	width: 100%;
	display: block;
	resize: none;
	padding: 0px;
	font-size: 14px;
`

const Wrapper = styled.div`
	display: flex;
	width: 100%;
	max-width: fill-available;
	font-size: 16px;
	border-radius: 5px;
	border: none;
	box-sizing: border-box;
`
const StyledRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	gap: 8px;
`
