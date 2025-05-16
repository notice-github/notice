import { ReactNode, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

import { SubscriptionModel } from '@notice-app/models'
import { useNavigate } from 'react-router-dom'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useT } from '../../hooks/useT'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { Pages } from '../../pages'
import { Switch, SwitchSizeType } from '../Switch'
import { SelectCustomisationMenu } from './General/SelectCustomisationMenu'

interface Props {
	title: ReactNode
	description?: ReactNode
	toggled?: boolean
	onToggleChange?: (value: boolean | string) => any
	children?: ReactNode
	toggleDisabled?: boolean
	paidFeature?: boolean
	forPlans?: SubscriptionModel.type[]
	toggleSize?: SwitchSizeType
	menuItems?: Array<{ name: string; value: string }>
	sectionType?: 'select' | 'switch'
	currentValue?: string
}

export const CustomizationSection = ({
	title,
	description,
	toggled,
	onToggleChange,
	children,
	paidFeature,
	forPlans,
	toggleSize,
	menuItems,
	sectionType,
	currentValue,
}: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const navigate = useNavigate()
	const [workspace] = useCurrentWorkspace()

	const isLocked = useMemo(() => {
		if (!paidFeature) return false

		return workspace.subscription === 'free' || (forPlans != null && !forPlans.includes(workspace.subscription))
	}, [])

	const handleOnToggleChange = (value: boolean) => {
		if (isLocked) {
			navigate(Pages.SETTINGS_SUBSCRIPTION)
		} else {
			onToggleChange?.call(onToggleChange, value)
		}
	}

	return (
		<Container>
			<HeaderWrapper>
				<TitleWrapper>
					<Title>
						<TitleText>{title}</TitleText>
						{isLocked && (
							<UpgradeWrapper onClick={() => navigate(Pages.SETTINGS_SUBSCRIPTION)}>
								<RocketLaunch color={theme.colors.pink} size={16} />
								<UpgradeText>{t('Upgrade', 'upgrade')}</UpgradeText>
							</UpgradeWrapper>
						)}
					</Title>
					{description != null && <Description>{description}</Description>}
				</TitleWrapper>
				{toggled !== undefined && sectionType !== 'select' && (
					<Switch value={toggled} onChange={handleOnToggleChange} size={toggleSize} />
				)}
				{menuItems != null && currentValue && (
					<SelectCustomisationMenu currentValue={currentValue} onUpdate={onToggleChange} values={menuItems} />
				)}
			</HeaderWrapper>
			{children != null && <ContentWrapper>{children}</ContentWrapper>}
		</Container>
	)
}

const Container = styled.div`
	display: flex;
	flex-basis: auto;
	flex-direction: column;
	flex-shrink: 0;

	box-sizing: border-box;
	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 8px;

	margin-bottom: 16px;
	background-color: ${({ theme }) => theme.colors.white};
`

const HeaderWrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;

	padding: 14px 18px;

	border-top-left-radius: 7px;
	border-top-right-radius: 7px;
`

const TitleWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding-right: 16px;
`

const Title = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`

const TitleText = styled.h3`
	font-size: 16px;
	font-weight: 600;

	color: ${({ theme }) => theme.colors.primaryDark};
`

const Description = styled.div`
	font-size: 14px;
	font-weight: 400;

	color: ${({ theme }) => theme.colors.textLightGrey};
`

const ContentWrapper = styled.div`
	color: rgb(107, 121, 133);

	padding: 14px 18px 18px 18px;

	box-sizing: border-box;
	border: none;
	border-top: 1px solid ${({ theme }) => theme.colors.borderLight};

	overflow: hidden;
	border-radius: none;
`

const UpgradeWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;

	cursor: pointer;
`

const UpgradeText = styled.p`
	font-size: 14px;
	color: ${({ theme }) => theme.colors.pink};
`
