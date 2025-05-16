import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { OnPropertyChange } from '../../hooks/bms/project/useOnPropertyChange'
import useDebounce from '../../hooks/useDebounce'
import { CrossIcon } from '../../icons'
import { DoneIcon } from '../../icons/DoneIcon'
import { CustomizationExpandableSection } from '../Customizations/CustomizationExpandableSection'
import { Row } from '../Flex'
import InlineCode from '../InlineCode'
import { Loader } from '../Loader'
import { SimpleInput } from '../SimpleInput'
import { useT } from '../../hooks/useT'

interface Props {
	onPropertyChange: OnPropertyChange
}
/**
 * /!\ IMPORTANT /!\
 *
 * If you need to change something here, that is not simply text.
 * Please, tell me (jonas.roussel@notice.studio) before.
 * This component is very sensitive to changes and can break at the slightest change.
 */

export const NoticeDomain = ({ onPropertyChange }: Props) => {
	const [t] = useT()
	const [project] = useCurrentProject()
	const currentValue = project?.preferences?.domain ?? ''
	const [isLoading, setLoading] = useState(false)
	const [state, setState] = useState<'valid' | 'invalid' | undefined>()
	const [domain, setDomain] = useState(currentValue)
	const [debouncedDomain] = useDebounce(domain, 1500)
	const [deboundedState] = useDebounce(state, 1500)
	const displayedDomain = state === 'invalid' ? debouncedDomain : domain

	useEffect(() => {
		if (currentValue) setDomain(currentValue)
	}, [currentValue])

	useEffect(() => {
		if (debouncedDomain.trim() === currentValue.trim()) {
			setLoading(false)
			return
		}

		onPropertyChange('preferences', 'domain', debouncedDomain.trim())
			.then(() => setState('valid'))
			.catch(() => setState('invalid'))
			.finally(() => setLoading(false))
	}, [debouncedDomain])

	useEffect(() => {
		if (deboundedState) setState(undefined)
	}, [deboundedState])

	return (
		<CustomizationExpandableSection title={t('Notice Domain', 'noticeDomain')} noToggle>
			<Container>
				<Description>
					{t('Change the name of the notice hosted domain.', 'noticeDomainDescription')} <br />
					{t('Allowed characters', 'allowedCharacters')} <InlineCode>{t('letters', 'letters')}</InlineCode>{' '}
					<InlineCode>{t('numbers', 'numbers')}</InlineCode> {t('and', 'and')} <InlineCode>-</InlineCode>
				</Description>
				<SimpleInput
					type="text"
					style={{ margin: '4px 0 4px -2px' }}
					value={displayedDomain}
					onChange={(value) => {
						setLoading(true)
						setState(undefined)
						setDomain(value.toLowerCase().replace(/[^\w-]/g, ''))
					}}
					suffix={<Suffix>notice.site</Suffix>}
					placeholder={t('Domain Name', 'domainName')}
				/>
				{displayedDomain !== '' && (
					<>
						<Description>Your project link is : </Description>
						<Row align="center" gap={8}>
							<Link
								href={isLoading ? undefined : `https://${displayedDomain}.notice.site`}
								target="_blank"
								disabled={isLoading}
							>
								{`https://${displayedDomain}.notice.site`}
							</Link>
							{isLoading && <Loader size={14} />}
							{!isLoading && state === 'valid' && <DoneIcon size={14} color="green" />}
							{!isLoading && state === 'invalid' && <CrossIcon size={10} color="red" />}
						</Row>
					</>
				)}
			</Container>
		</CustomizationExpandableSection>
	)
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`
const Description = styled.p`
	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`
const Link = styled.a<{ disabled?: boolean }>`
	font-size: 12px;
	text-decoration: none;
	color: ${({ theme }) => theme.colors.mariner};
	cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
	&:hover {
		text-decoration: ${({ disabled }) => (disabled ? undefined : 'underline')};
	}
`
const Suffix = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	padding: 0 16px;
	background-color: ${({ theme }) => theme.colors.primaryExtraLight};
`
