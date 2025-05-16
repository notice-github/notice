import { useMemo, useState } from 'react'
import { useNavigate, useOutlet } from 'react-router-dom'
import styled, { useTheme } from 'styled-components'

import { Column } from '../../components/Flex'
import { Modals } from '../../components/Modal'
import { Page } from '../../components/Page'
import { PageBody } from '../../components/Page/PageBody'
import { PageContent } from '../../components/Page/PageContent'
import { PageHead, PageHeadDescription, PageHeadIcon, PageHeadTitle } from '../../components/Page/PageHead'
import { PageSide } from '../../components/Page/PageSide'
import { Show } from '../../components/Show'
import { INTEGRATIONS, INTEGRATION_CATEGORIES, IntegrationCategory } from '../../data/integrations'
import { ArrowIcon } from '../../icons/ArrowIcon'
import { Pages } from '../../pages'
import { IntegrationCard } from './IntegrationCard'
import { useT } from '../../hooks/useT'
import { AlertBox } from '../../components/AlertBox'

export const IntegrationsPage = () => {
	const [t] = useT()
	const theme = useTheme()
	const outlet = useOutlet()
	const navigate = useNavigate()
	const [selectedCategory, selectCategory] = useState<IntegrationCategory | null>(null)

	const filteredIntegrations = useMemo(() => {
		if (selectedCategory == null) return INTEGRATIONS
		return INTEGRATIONS.filter((int: any) => int.categories.includes(selectedCategory))
	}, [selectedCategory])

	return (
		<Page>
			<PageSide>
				<PageHead style={{ padding: outlet != null ? '16px' : '24px' }}>
					<Show when={outlet != null}>
						<BackButton onClick={() => navigate(Pages.INTEGRATIONS)}>
							<ArrowIcon size={20} color={theme.colors.greyDark} />
							{t('Integrations', 'integrations')}
						</BackButton>
					</Show>
					<Show when={outlet == null}>
						<PageHeadIcon src="/assets/svg/integrations.svg" />
						<PageHeadTitle>{t('Integrations', 'integrations')}</PageHeadTitle>
						<PageHeadDescription>
							{t(
								'Empower your visibility by sharing and integrating your Notice everywhere.',
								'integrationsDescription'
							)}{' '}
						</PageHeadDescription>
					</Show>
				</PageHead>
				<PageBody>
					<Show when={outlet == null}>
						<CategoryTitle>{t('Categories', 'categories')}</CategoryTitle>
						<Column gap={4}>
							<CategoryItem onClick={() => selectCategory(null)} selected={selectedCategory === null}>
								{t('All', 'all')}
							</CategoryItem>
							{INTEGRATION_CATEGORIES.map((category) => (
								<CategoryItem
									key={category.id}
									onClick={() => selectCategory(category.id)}
									selected={selectedCategory === category.id}
								>
									{category.name}
								</CategoryItem>
							))}
						</Column>
						<HelpCard>
							<p>
								{t(
									'Need a different integration and cannot find it here?',
									'needADifferentIntegrationAndCannotFindItHere'
								)}{' '}
								<Span onClick={() => Modals.contactUs.open()}>{t('Let us know', 'letUsKnow')}</Span>
							</p>
						</HelpCard>
					</Show>
				</PageBody>
			</PageSide>
			<PageContent>
				{/* <AlertBox>
					<h1>
						V2 is <a href="https://app-v2.notice.studio">released</a>. V1 is in maintenance mode.
					</h1>
					V2 is relased! We are migrating users manually, please contact us at contact@notice.studio if you need your
					subscription to be migrated. V2 URL 👉 <a href="https://app-v2.notice.studio">this article.</a>
				</AlertBox> */}

				<Show when={outlet != null}>
					<OutletWrapper>{outlet}</OutletWrapper>
				</Show>
				<Show when={outlet == null}>
					<Grid>
						{filteredIntegrations.map((integration) => (
							<IntegrationCard key={integration.id} integration={integration} />
						))}
					</Grid>
				</Show>
			</PageContent>
		</Page>
	)
}

const BackButton = styled.div`
	display: flex;
	align-items: center;
	justify-content: start;
	gap: 8px;
	padding: 8px;
	color: ${({ theme }) => theme.colors.greyDark};
	font-size: 16px;

	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.primary};

		svg {
			stroke: ${({ theme }) => theme.colors.primary};
		}
	}
`

const CategoryTitle = styled.h2`
	font-weight: 800;
	margin-bottom: 4px;
`

const CategoryItem = styled.div<{ selected?: boolean }>`
	padding: 6px 12px;
	border-radius: ${({ theme }) => theme.borderRadius};
	background-color: ${({ selected, theme }) => (selected ? theme.colors.active : undefined)};
	color: ${({ selected, theme }) => (selected ? theme.colors.primary : undefined)};

	cursor: pointer;

	&:hover {
		background-color: ${({ selected, theme }) => (selected ? undefined : theme.colors.hover)};
		color: ${({ selected, theme }) => (selected ? undefined : theme.colors.primary)};
	}
`

const OutletWrapper = styled.div`
	max-width: 745px;
	width: 100%;
`

const Grid = styled.div`
	display: grid;
	grid-gap: 16px;
	grid-template-columns: repeat(2, 1fr);
	padding: 32px 0;
	max-width: 745px;
	width: 100%;
`

const HelpCard = styled.div`
	display: flex;
	flex-direction: row;
	align-items: flex-start;
	gap: 10px;
	padding: 16px;
	margin: 8px -4px;
	background-color: ${({ theme }) => theme.colors.hover};
	border-radius: 8px;
`

const Span = styled.span`
	text-decoration: none;
	border: 0;
	margin: 0;
	padding: 0;

	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	color: ${({ theme }) => theme.colors.primary};

	&:hover {
		text-decoration: underline;
	}
`
