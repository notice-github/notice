import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Props extends React.ComponentPropsWithoutRef<'p'> {
	delay: number
	messages: string[]
}

export const MessageCarousel = ({ delay, messages, ...props }: Props) => {
	const [index, setIndex] = useState(() => randomNumberInRange())

	function randomNumberInRange() {
		return Math.floor(Math.random() * messages.length)
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setIndex(randomNumberInRange())
		}, delay)

		return () => {
			clearInterval(interval)
		}
	}, [])
	return (
		<Message
			{...props}
			dangerouslySetInnerHTML={{
				__html: messages[index],
			}}
		></Message>
	)
}

const Message = styled.p<any>`
	width: 100%;
	text-align: center;
	height: 50px;
`
