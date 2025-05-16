import React, { ReactNode, isValidElement, useEffect, useState } from 'react'

import styled, { useTheme } from 'styled-components'
import { ArrowLeft } from '../icons/ArrowLeft'
import { ArrowRight } from '../icons/ArrowRight'
import Cross from '../icons/Cross'
import { Row } from './Flex'
import { Show } from './Show'

interface ICarouselItem {
	children: ReactNode
	width?: string
}

export const CarouselItem = ({ children, width = '100%' }: ICarouselItem) => {
	return <CarouselItemWrapper width={width}>{children}</CarouselItemWrapper>
}

interface Props {
	onHide: (hidden: boolean) => any
	children: ReactNode
}

const Carousel = ({ children, onHide }: Props) => {
	const theme = useTheme()
	const [activeIndex, setActiveIndex] = useState(0)
	const [paused, setPaused] = useState(false)

	const updateIndex = (newIndex: number) => {
		if (newIndex < 0) {
			newIndex = React.Children.count(children) - 1
		} else if (newIndex >= React.Children.count(children)) {
			newIndex = 0
		}

		setActiveIndex(newIndex)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			if (!paused) {
				updateIndex(activeIndex + 1)
			}
		}, 10000)

		return () => {
			if (interval) {
				clearInterval(interval)
			}
		}
	})

	return (
		<CarouselWrapper onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
			<Show when={paused}>
				<CrossWrapper
					onClick={() => {
						localStorage.setItem('carousel_closed', 'true')
						onHide(true)
					}}
				>
					<Cross size={12} color={theme.colors.twilightGrey} />
				</CrossWrapper>
			</Show>
			<NoWrapTransition activeIndex={activeIndex}>
				{React.Children.map(children, (child) => {
					if (isValidElement(child)) {
						return React.cloneElement(child)
					}
				})}
			</NoWrapTransition>
			<Row gap={10} justify="center" align="center">
				<IconContainer
					onClick={() => {
						updateIndex(activeIndex - 1)
					}}
				>
					<ArrowLeft size={12} color={theme.colors.twilightGrey} />
				</IconContainer>
				<Row gap={8} justify="center" align="center">
					{React.Children.map(children, (child, index) => {
						return (
							<PaddingDiv
								onClick={() => {
									updateIndex(index)
								}}
							>
								<RoundDiv
									active={index === activeIndex}
									onClick={() => {
										updateIndex(index)
									}}
								></RoundDiv>
							</PaddingDiv>
						)
					})}
				</Row>
				<IconContainer
					onClick={() => {
						updateIndex(activeIndex + 1)
					}}
				>
					<ArrowRight size={12} color={theme.colors.twilightGrey} />
				</IconContainer>
			</Row>
		</CarouselWrapper>
	)
}

const CarouselWrapper = styled.div`
	overflow: hidden;
	border-radius: ${({ theme }) => theme.borderRadius};

	background: linear-gradient(180deg, rgba(109, 201, 183, 0.6) 4.63%, rgba(255, 122, 146, 0.6) 92.16%),
		linear-gradient(90deg, #3a85d0 14.9%, #ffb745 86.69%);
	background-size: 180% 180%;
	animation: gradient 3s ease-in-out infinite;
	padding: 8px 0;
	position: relative;

	@keyframes gradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 50% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
`

const CrossWrapper = styled.div`
	position: absolute;
	cursor: pointer;
	top: 3%;
	right: 3%;
	z-index: 3;
`

const NoWrapTransition = styled.div<{ activeIndex: number }>`
	white-space: nowrap;
	transform: ${({ activeIndex }) => `translateX(-${activeIndex * 100}%)`};
	transition: transform 0.3s;
`

const CarouselItemWrapper = styled.div<{ width: string }>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	height: auto;
	color: #fff;
	width: ${({ width }) => width};
	overflow: hidden;

	box-sizing: border-box;
`

const PaddingDiv = styled.div`
	padding: 8px 0;
	cursor: pointer;
`

const RoundDiv = styled.div<{ active: boolean }>`
	width: 20px;
	height: 4px;
	border-radius: 8px;
	cursor: pointer;
	background-color: ${({ active, theme }) => (active ? theme.colors.white : theme.colors.twilightGrey)};
`

const IconContainer = styled.div`
	display: flex;
	align-items: center;
	width: auto;
	height: auto;
	cursor: pointer;
`

export default Carousel
