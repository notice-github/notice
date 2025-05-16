import styled, { useTheme } from 'styled-components'
import { FormTitle, Subtitle } from '.'
import { TemplateType } from '..'
import { Row } from '../../../../components/Flex'
import { SimpleInput } from '../../../../components/SimpleInput'
import Tooltip from '../../../../components/Tooltip'
import { InfoIcon } from '../../../../icons/InfoIcon'
import { Consts } from '../../../../utils/consts'
import { useT } from '../../../../hooks/useT'

interface Props {
	isOptional: boolean
	value: string
	onChange: (value: string) => any
	template: TemplateType | null
	onEnter: () => void
}

export const AIDomainInput = ({ onChange, value, template, onEnter, isOptional }: Props) => {
	const [t] = useT()
	const theme = useTheme()

	const onValidate = (value: string | number | readonly string[]) => {
		if (typeof value !== 'string') return false

		if (value.length === 0) return true
		return Consts.WEBSITE_REGEX.test(value)
	}

	const title = isOptional
		? t(`Provide your existing website URL`, 'provideYourWebsiteURL')
		: t(`We found a website linked to your email address`, 'weFoundAWebsite')
	const SubText = !isOptional ? t(`You can use any existing URL.`, 'youCanUseAnyExistingURL') : ''

	return (
		<Wrapper>
			<div>
				<Tooltip
					placement="top"
					content={t('Please make sure provided website already exists', 'makeSureProvidedWebsiteAlreadyExists')}
				>
					<Row justify="start" align="center" gap={4}>
						<FormTitle>{title}</FormTitle>
						<InfoIcon size={13} color={theme.colors.twilightDarkGrey} />
					</Row>
				</Tooltip>
				<Subtitle>
					{t(`Our AI goes through the provided website and generates a custom`, 'AIExplanation')} {template?.name}{' '}
					{t('based on the website information.', 'basedOnTheWebsiteInformation')} {SubText}
				</Subtitle>
			</div>
			<SimpleInput
				value={value}
				onChange={onChange}
				validator={onValidate}
				onEnter={() => onEnter()}
				placeholder="Enter your existing website URL (e.g., www.notice.studio)"
				style={{ width: '100%', boxSizing: 'border-box' }}
			/>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;

	gap: 8px;
	margin: 6px 0;
`
