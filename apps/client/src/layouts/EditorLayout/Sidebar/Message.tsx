import { useState } from 'react'
import styled from 'styled-components'
import Carousel, { CarouselItem } from '../../../components/Carousel'
import { Column } from '../../../components/Flex'
import { Modals } from '../../../components/Modal'
import { useTrackEvent } from '../../../hooks/analytics/useTrackEvent'
import { useUser } from '../../../hooks/api/useUser'
import { useT } from '../../../hooks/useT'

export const Message = () => {
	const [t] = useT()
	const trackEvent = useTrackEvent()
	const user = useUser()

	const localStoredValue = localStorage.getItem('carousel_closed')
	const [hidden, setHidden] = useState(localStoredValue != null)

	if (hidden) return null

	return (
		<Margin6>
			<Carousel onHide={setHidden}>
				<CarouselItem>
					<StyledColumn gap={8}>
						<Heading>{t('Step-by-step guide', 'stepByStepGuide')}</Heading>
						<Text>💅 {t('Create and customize content', 'createAndCustomizeContent')}</Text>
						<Text>✅ {t('Click on Publish', 'clickOnPublish')}</Text>
						<Text>🚀 {t('Deploy it anywhere by going to the Integrations tab', 'deployItAnywhere')}</Text>
					</StyledColumn>
				</CarouselItem>
				<CarouselItem>
					<StyledColumn gap={8}>
						<Heading>{t('Many hands make light work', 'manyHandsMakeLightWork')}</Heading>
						<Text>
							{t('Invite your colleagues to collaborate together on your projects.', 'inviteColleaguesToCollaborate')}
						</Text>
						<CarouselButton onClick={() => Modals.collaboratorInvitation.open()}>
							{t('Invite your team', 'inviteYourTeam')}
						</CarouselButton>
					</StyledColumn>
				</CarouselItem>
				<CarouselItem>
					<StyledColumn gap={8}>
						<Heading>{t('Get in touch with us', 'getInTouchWithUs')}</Heading>
						<Text>
							{t(
								'Need any help or have feature requests? Send us a message or join our community on Slack.',
								'getInTouchDescription'
							)}
						</Text>
						<CarouselButton
							onClick={() => {
								Modals.contactUs.open()
							}}
						>
							{t('Contact us', 'contactUs')}
						</CarouselButton>
					</StyledColumn>
				</CarouselItem>
			</Carousel>
		</Margin6>
	)
}

const Margin6 = styled.div`
	margin: 8px;
	border-radius: 6px;
`

const Text = styled.p`
	font-weight: 400;
	font-size: 12px;
	line-height: 14px;

	display: inline-block;
	white-space: break-spaces;
	color: ${({ theme }) => theme.colors.white};
`

const Heading = styled.h5`
	width: 222px;
	font-weight: 600;
	font-size: 12px;
	line-height: 14px;

	white-space: break-spaces;
`

const StyledColumn = styled(Column)`
	box-sizing: border-box;
	width: 100%;
	padding: 16px 16px 8px;
	overflow-wrap: break-word;
`

const CarouselButton = styled.button`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;

	font-weight: 500;
	font-size: 14px;

	border-radius: ${({ theme }) => theme.borderRadius};
	background: ${({ theme }) => theme.colors.twilightGrey};
	color: white;
	cursor: pointer;
	border: none;
	padding: 8px;

	&:hover,
	&:focus,
	&:active {
		background: ${({ theme }) => theme.colors.twilightDarkGrey};
	}
`
