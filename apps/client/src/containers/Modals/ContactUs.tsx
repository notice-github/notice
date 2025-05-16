import { lighten } from 'polished'
import { useState } from 'react'
import styled from 'styled-components'
import ContactForm from '../../components/ContactForm/ContactForm'
import Tooltip from '../../components/Tooltip'
import { HelpDeskIcon, LinkedInIcon, SlackIcon, TwitterIcon, YoutubeIcon } from '../../icons'
import { EmailIcon } from '../../icons/EmailIcon'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { useT } from '../../hooks/useT'

export interface IContactForm {
	email: string
	subject: string
	message: string
}

export const ContactUs = () => {
	const [t] = useT()
	const [expanded, setExpanded] = useState(false)

	return (
		<MainDiv expanded={expanded}>
			<FlexColumn>
				<Heading>{t('Support & Community', 'supportAndCommunity')}</Heading>
				<hr />
				<StyledParagraph>
					{t(
						'Join our Slack community for updates and feedback, and connect with us on socials.',
						'joinOurSlackCommunityForUpdatesAndFeedback'
					)}
				</StyledParagraph>
				<FlexRow>
					<Tooltip content={t('Join Slack', 'joinSlack')} placement="right" offset={[-10, 10]}>
						<StyledButton
							onClick={() =>
								window.open(
									'https://join.slack.com/t/noticegroupe/shared_invite/zt-21nkruxea-gTZ5jfvevH49JvzQrHdfhQ',
									'_blank'
								)
							}
						>
							<SlackIcon size={24} />
						</StyledButton>
					</Tooltip>
					<Tooltip content="Twitter" placement="right" offset={[-10, 10]}>
						<RoundIconContainer href="https://twitter.com/Did_U_Notice" target="_blank" rel="noopener noreferrer">
							<TwitterIcon size={24} color={'#1C9BEF'} />
						</RoundIconContainer>
					</Tooltip>
					<Tooltip content="LinkedIn" placement="right" offset={[-10, 10]}>
						<RoundIconContainer
							href="https://www.linkedin.com/company/noticestudio/"
							target="_blank"
							rel="noopener noreferrer"
						>
							<LinkedInIcon size={24} color={'#007BB5'} />
						</RoundIconContainer>
					</Tooltip>
				</FlexRow>
				<DividerWithText> Support </DividerWithText>
				<FlexRow>
					<Tooltip content={t('Join the academy!', 'joinTheAcademy')} placement="right" offset={[-10, 10]}>
						<RoundIconContainer href="https://www.notice.studio/academy" target="_blank" rel="noopener noreferrer">
							<RocketLaunch size={24} color={'#FF0000'} />
						</RoundIconContainer>
					</Tooltip>

					<Tooltip content={t('Read our doc', 'readOurDoc')} placement="right" offset={[-10, 10]}>
						<StyledButton onClick={() => window.open('https://documentation.notice.site/', '_blank')}>
							<HelpDeskIcon />
						</StyledButton>
					</Tooltip>
					<Tooltip content={t('Check our tutorials', 'checkOurTutorials')} placement="right" offset={[-10, 10]}>
						<RoundIconContainer href="https://www.youtube.com/@Notice.studio" target="_blank" rel="noopener noreferrer">
							<YoutubeIcon size={24} color={'#FF0000'} />
						</RoundIconContainer>
					</Tooltip>
				</FlexRow>

				<DividerWithText> {t('Contact Us', 'contactUs')} </DividerWithText>
				<FlexRow>
					<Tooltip content={t('Send us an e-mail', 'sendUsAnEmail')} placement="right" offset={[-10, 10]}>
						<StyledButton onClick={() => setExpanded(!expanded)}>
							<EmailIcon />
						</StyledButton>
					</Tooltip>
				</FlexRow>
			</FlexColumn>
			<ContactForm setExpanded={setExpanded} />
		</MainDiv>
	)
}

const MainDiv = styled.div<{ expanded: boolean }>`
	width: ${({ expanded }) => (expanded ? '800px' : '400px')};
	height: auto;

	overflow-x: hidden;
	transition: 0.5s;
	padding: 2px;

	display: flex;
	flex-direction: row;
	gap: 8px;
	margin: 4px;
	font-size: 16px;
`

const FlexColumn = styled.div`
	box-sizing: border-box;

	width: 400px;
	border-radius: 8px;
	background-color: ${({ theme }) => lighten(0.03, theme.colors.dark)};
	color: ${({ theme }) => theme.colors.lightGrey};

	padding: 20px;
	flex-shrink: 0;
	gap: 4px;
`

const StyledParagraph = styled.p`
	margin: 12px 0;
`

const Heading = styled.h3`
	font-weight: 500;
`

const StyledButton = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	gap: 8px;
	padding: 10px;
	border-radius: 50%;
	cursor: pointer;
	transition: 0.5s;

	color: ${({ theme }) => theme.colors.primary};
	background-color: ${({ theme }) => theme.colors.lightGrey};

	&:hover {
		background-color: ${({ theme }) => theme.colors.white};
	}
`

const DividerWithText = styled.div`
	display: flex;
	flex-basis: 100%;
	align-items: center;
	color: ${({ theme }) => theme.colors.lightGrey};
	margin: 16px 0px;

	::before,
	::after {
		content: '';
		flex-grow: 1;
		background: ${({ theme }) => theme.colors.lightGrey};
		height: 1px;
		font-size: 0px;
		line-height: 0px;
		margin: 0px 8px;
	}
`
const FlexRow = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;

	gap: 24px;
	margin: 24px 0px;
`

const RoundIconContainer = styled.a`
	display: flex;
	border-radius: 50%;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.lightGrey};

	padding: 10px;
	transition: 0.5s;

	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.white};
	}
`
