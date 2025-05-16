import { ReactNode, useCallback, useState } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useT } from '../../hooks/useT'
import { ChevronIcon } from '../../icons/ChevronIcon'
import { RocketLaunch } from '../../icons/RocketLaunch'
import { Switch, SwitchSizeType } from '../Switch'

interface Props {
	title: string
	description?: string
	children?: ReactNode
	paidFeature?: boolean
	toggled?: boolean
	onToggleChange?: (value: boolean) => any
	noToggle?: boolean
	onUpgrade?: () => void
	shouldBeHighlightedOnExpand?: boolean
	toggleSize?: SwitchSizeType
	hasInfoButton?: boolean
	tooltipContent?: ReactNode
}

export const CustomizationExpandableSection = ({
	title,
	description,
	children,
	paidFeature,
	toggled,
	onToggleChange,
	onUpgrade,
	toggleSize,
	tooltipContent,
	noToggle = false,
	shouldBeHighlightedOnExpand = false,
	hasInfoButton = false,
}: Props) => {
	const [t] = useT()
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const [expanded, setExpanded] = useState(false)
	const [contentContainerHeight, setContentContainerHeight] = useState(0)

	const contentContainerRef = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return null
			const resizeObserver = new ResizeObserver(() => {
				setContentContainerHeight(expanded ? node!.getBoundingClientRect().height : 0)
			})
			resizeObserver.observe(node)
		},
		[expanded]
	)

	const handleChange = (value: boolean) => {
		onToggleChange?.(value)
		setExpanded(value)
	}

	const handleExpanding = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			setExpanded(!expanded)
		},
		[expanded, toggled]
	)

	return (
		<Container expanded={expanded} isHighLighted={expanded && shouldBeHighlightedOnExpand}>
			<HeaderWrapper expanded={expanded} noToggle={noToggle} isHighlighted={toggled} onClick={handleExpanding}>
				<TitleWrapper>
					<Title>
						{!noToggle && (
							<HeaderActionButton expanded={expanded} onClick={() => setExpanded(!expanded)}>
								<ChevronIcon size={18} color={theme.colors.greyDark} />
							</HeaderActionButton>
						)}
						<TitleText>{title}</TitleText>
						{paidFeature && workspace.subscription === 'free' && (
							<UpgradeWrapper onClick={onUpgrade}>
								<RocketLaunch color={theme.colors.pink} size={16} />
								<UpgradeText>{t('Upgrade', 'upgrade')}</UpgradeText>
							</UpgradeWrapper>
						)}
					</Title>
					{description != null && <Description>{description}</Description>}
				</TitleWrapper>
				{toggled !== undefined && !noToggle && (
					<Switch
						value={toggled}
						onChange={handleChange}
						disabled={paidFeature && workspace.subscription === 'free'}
						size={toggleSize}
					/>
				)}{' '}
				{noToggle && (
					<HeaderActionButton expanded={expanded} onClick={() => setExpanded(!expanded)}>
						<ChevronIcon size={18} color={theme.colors.greyDark} />
					</HeaderActionButton>
				)}
			</HeaderWrapper>
			{children != null && (
				<ContentWrapper maxHeight={contentContainerHeight}>
					<Content noToggle={noToggle} expanded={expanded} ref={contentContainerRef}>
						{children}
					</Content>
				</ContentWrapper>
			)}
		</Container>
	)
}

const Container = styled.div<{ expanded: boolean; isHighLighted: boolean }>`
	display: flex;
	flex-basis: auto;
	flex-direction: column;
	flex-shrink: 0;
	box-sizing: border-box;

	border: 1px solid ${({ theme }) => theme.colors.borderLight};
	border-radius: 8px;
	margin-bottom: 16px;
	background-color: ${({ theme, isHighLighted }) =>
		isHighLighted ? theme.colors.backgroundLightGrey : theme.colors.white};

	transition: all 0.1s ease-in-out;
	transition-delay: ${({ expanded }) => (expanded ? 'none' : '0.3s')};
`

const HeaderWrapper = styled.div<{ expanded: boolean; noToggle: boolean; isHighlighted?: boolean }>`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 14px 18px;
	border-top-left-radius: 7px;
	border-top-right-radius: 7px;
	cursor: pointer;
	&:hover {
		background-color: ${({ theme }) => theme.colors.backgroundLightGrey};

		${({ expanded }) => {
			return expanded
				? css`
						border-top-left-radius: 7px;
						border-top-right-radius: 7px;
				  `
				: css`
						border-radius: 8px;
				  `
		}}
	}

	transition: background-color 0.2s ease-in-out;
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
	gap: 6px;
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

const ContentWrapper = styled.div<{ maxHeight?: number }>`
	box-sizing: border-box;
	overflow: hidden;
	max-height: ${({ maxHeight }) => `${maxHeight}px`};
	transition: max-height 0.3s ease-in-out;
`

const Content = styled.div<{ expanded: boolean; noToggle: boolean }>`
	color: rgb(107, 121, 133);
	padding: 14px 18px 18px 18px;
	border-top: 1px solid
		${({ theme, expanded, noToggle }) => (expanded && noToggle ? theme.colors.borderLight : 'transparent')};

	opacity: ${({ expanded }) => (expanded ? 1 : 0)};
	transition: opacity 0.3s ease-in-out;
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

const HeaderActionButton = styled.div<{ expanded?: boolean }>`
	width: 24px;
	height: 24px;

	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: ${({ theme }) => theme.borderRadius};

	cursor: pointer;
	svg {
		transform: ${({ expanded }) => (expanded ? 'rotate(-90deg)' : 'rotate(90deg)')};
		transition: 0.2s ease-in-out;
	}
	&:hover {
		background-color: ${({ theme }) => theme.colors.hover};
	}
`
