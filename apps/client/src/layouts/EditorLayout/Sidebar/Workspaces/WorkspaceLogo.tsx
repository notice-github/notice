import styled from 'styled-components'

import { WorkspaceModel } from '@notice-app/models'
import { Show } from '../../../../components/Show'

interface Props {
	workspace: WorkspaceModel.client
	size?: number
}

export const WorkspaceLogo = ({ workspace, size = 48 }: Props) => {
	return (
		<Container size={size}>
			<Show when={workspace.icon == null}>
				<Background size={size}>{workspace.name.charAt(0).toUpperCase()}</Background>
			</Show>
			<Show when={workspace.icon != null}>
				<Picture src={workspace.icon!} />
			</Show>
		</Container>
	)
}

const Container = styled.div<{ size: number }>`
	position: relative;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;

	flex-shrink: 0;
	flex-grow: 0;
	flex-basis: ${({ size }) => size};

	border-radius: ${({ theme }) => theme.borderRadius};
	overflow: hidden;
`

const Picture = styled.img`
	position: absolute;
	width: 100%;
	height: 100%;
	object-fit: cover;
`

const Background = styled.div<{ size: number }>`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.colors.primary};
	font-size: ${({ size }) => Math.round(size / 2.2)}px;
	color: ${({ theme }) => theme.colors.white};
`
