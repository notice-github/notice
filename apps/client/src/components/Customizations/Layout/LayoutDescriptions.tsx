/* // TODO: FIX TYPING
type NestedKeyOf<ObjectType extends object> = {
	[Key in keyof ObjectType]: ObjectType[Key] extends object ? `${Key}.${NestedKeyOf<ObjectType[Key]>}` : Key
}[keyof ObjectType] */

import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useT } from '../../../hooks/useT'
import { Pages } from '../../../pages'
import { Modals } from '../../Modal'

// TODO: MAybe a much better wat to do this to have a smooth developer experience
export const LayoutDescriptions = ({ elementType }: { elementType: string }) => {
	const [t] = useT()
	const navigate = useNavigate()

	switch (elementType) {
		case 'title':
			return <Description>{t('Set project title', 'setProjectTitle')}</Description>
		case 'page_title':
			return (
				<Description>
					{t('Will show the project title on the top space for every page.', 'setProjectTitleDescription')}
				</Description>
			)
		case 'page_tree':
			return (
				<Description>
					{t('Navigation menu on the left that gives easy access to your project.', 'navMenuDesc')}
				</Description>
			)
		case 'search':
			return (
				<Description>
					{t('Allow user to search inside you project. you will also have', 'searchDescription')}{' '}
					<NakedButton
						onClick={() => {
							navigate(Pages.INSIGHTS)
						}}
					>
						{t('analytics support', 'analyticsSupport')}
					</NakedButton>{' '}
					{t('from notice for your project search.', 'searchDescription2')}
				</Description>
			)
		case 'theme_switch':
			return (
				<Description>
					{t(
						'You can allow users to change the theme of your project. you can setup your theme',
						'themeSwitchDescription'
					)}{' '}
					<NakedButton onClick={() => navigate(Pages.CUSTOMIZATION_STYLING)}>
						{t('here inside colors.', 'hereInsideColors')}
					</NakedButton>
				</Description>
			)

		case 'language_selector':
			return (
				<Description>
					{t(
						'You can allow users to change the language of your project. You can configure your translations',
						'languageSwitchDescription'
					)}{' '}
					<NakedButton
						onClick={() => {
							navigate(Pages.TRANSLATIONS)
							Modals.translationConfiguration.open()
						}}
					>
						{t('here', 'here')}.
					</NakedButton>
				</Description>
			)

		case 'breadcrumb':
			return (
				<Description>
					{t('You can allow users to navigate between current nested pages.', 'allowNavDescription')}
				</Description>
			)

		case 'home_button':
			return (
				<Description>
					{t('Display a home button for users to navigate to homepage.', 'displayHomeButtonDescription')}
				</Description>
			)

		case 'time_to_read':
			return (
				<Description>
					{t(
						'Show users how long will it take to read the current page (automatically calculated).',
						'timeToReadDescription'
					)}
				</Description>
			)

		case 'facebook':
			return <Description>{t('Allow user to share your page on facebook.', 'facebookShareDescription')}</Description>

		case 'twitter':
			return <Description>{t('Allow user to share your page on twitter.', 'twitterShareDescription')}</Description>

		case 'linkedin':
			return <Description>{t('Allow user to share your page on linkedin.', 'linkedinShareDescription')}</Description>

		case 'bottom_nav':
			return (
				<Description>
					{t('Add buttons to navigate to next and previous pages from bottom.', 'nextPrevDescription')}
				</Description>
			)

		case 'anchor':
			return (
				<Description>
					{t(
						'Add a menu on the right that allows users to navigate inside subtitles of the current page.',
						'anchorRightMenuDescription'
					)}
				</Description>
			)

		case 'read_more':
			return (
				<Description>
					{t('Allow user to read more articles related to the current one.', 'allowRecommendedArticlesDescription')}
				</Description>
			)

		default:
			return <></>
	}
}

const Description = styled.div`
	margin-bottom: 8px;
	padding-left: 2px;

	font-size: 14px;
	font-weight: 400;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const NakedButton = styled.button`
	text-decoration: none;
	border: none;
	background-color: transparent;
	cursor: pointer;

	font-size: 14px;
	font-weight: 400;
	padding: 0;

	color: ${({ theme }) => theme.colors.mariner};

	&:hover {
		text-decoration: underline;
	}
`
