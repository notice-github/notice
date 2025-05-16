import { lighten } from 'polished'
import { ReactNode, useState } from 'react'
import styled, { css } from 'styled-components'
import { Column, Row } from '../../../components/Flex'
import { Loader } from '../../../components/Loader'
import { Show } from '../../../components/Show'
import { useT } from '../../../hooks/useT'
import { useIsHovered } from '../../Editor/src/Editor/hooks/useIsHovered'

interface Props {
	icon: ReactNode
	name: string
	color: string
	onClick: () => void
	variant: 'ai' | 'preFilled'
	isLoading?: boolean
}

export const TemplateCard = ({ icon, name, color, onClick, variant, isLoading }: Props) => {
	const [t] = useT()
	const [parentRef, setParentRef] = useState<HTMLDivElement | null>(null)
	const isHovered = useIsHovered([parentRef]).some(Boolean)

	return (
		<Wrapper shouldTransform={variant === 'preFilled'} ref={setParentRef} onClick={onClick}>
			<Row style={{ width: '100%' }} justify="space-between" align="center">
				<IconContainer color={color}>{icon}</IconContainer>
				{isLoading && <Loader size={12} color={color} />}
			</Row>
			<Name color={color}>{name}</Name>
			<Show when={variant === 'ai'}>
				<AbsoluteColumn>
					<CornerDiv shouldAnimate={isHovered} color={lighten(0.2, color)}></CornerDiv>
					<CornerDiv shouldAnimate={isHovered} color={color}></CornerDiv>
				</AbsoluteColumn>
			</Show>
			<Show when={variant === 'preFilled'}>
				<StyledType>{t('Pre-filled template', 'preFilledTemplate')}</StyledType>
			</Show>
		</Wrapper>
	)
}
const Wrapper = styled.div<{ shouldTransform: boolean }>`
	position: relative;
	box-sizing: border-box;

	display: flex;
	justify-content: flex-end;
	align-items: flex-start;
	flex-direction: column;

	width: 100%;
	height: 100%;
	background-color: white;
	padding: 12px 14px;
	border-radius: 4px;
	cursor: pointer;
	transition: all 0.1s ease;

	cursor: pointer;
	overflow: hidden;

	${({ shouldTransform }) =>
		shouldTransform
			? css`
					border: 1px solid ${({ theme }) => theme.colors.border};
					box-shadow: rgb(0 0 0 / 3%) 0px 3px 7px;

					&:hover {
						box-shadow: rgb(0 0 0 / 9%) 0px 3px 7px;
						transform: translateY(-3px);
					}
			  `
			: css`
					box-shadow:
						0px 2px 5px 0px rgba(50, 50, 105, 0.15),
						0px 1px 1px 0px rgba(0, 0, 0, 0.05);
			  `}
`
const AbsoluteColumn = styled(Column)`
	position: absolute;
	transform: rotate(34.253deg);
	top: 0;
	right: -55px;
`

const StyledType = styled.div`
	font-size: 9px;
	color: ${({ theme }) => theme.colors.textLightGrey};
`

const CornerDiv = styled.div<{ color: string; shouldAnimate: boolean }>`
	width: 128.008px;
	height: 18.396px;

	background-color: ${({ color }) => color};

	${({ shouldAnimate }) =>
		shouldAnimate
			? css`
					&:after {
						content: '';
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						z-index: 1;
						position: absolute;
						background-size: 50px 50px;
						overflow: hidden;

						animation: stripes-move 3s linear infinite;
						background-image: -webkit-linear-gradient(
							135deg,
							rgba(255, 255, 255, 0.2) 25%,
							transparent 25%,
							transparent 50%,
							rgba(255, 255, 255, 0.2) 50%,
							rgba(255, 255, 255, 0.2) 75%,
							transparent 75%,
							transparent
						);
						background-image: linear-gradient(
							-45deg,
							rgba(255, 255, 255, 0.2) 25%,
							transparent 25%,
							transparent 50%,
							rgba(255, 255, 255, 0.2) 50%,
							rgba(255, 255, 255, 0.2) 75%,
							transparent 75%,
							transparent
						);

						@keyframes stripes-move {
							0% {
								background-position: 0 0;
							}
							100% {
								background-position: 50px 50px;
							}
						}
					}
			  `
			: ''}
`

const IconContainer = styled.div<{ color: string }>`
	display: flex;
	align-items: center;
	justify-content: center;

	svg path {
		fill: ${({ color }) => color};
	}
`

const Name = styled.div<{ color: string }>`
	color: ${({ color }) => color};
	font-size: 15px;
	font-weight: 700;
`

const FadeIconContainer = styled.div<{ isVisible: boolean }>`
	transition: opacity 0.5s;
	opacity: ${({ isVisible }) => (isVisible ? '1' : '0')};

	display: flex;
	justify-content: center;
	align-items: center;
`
