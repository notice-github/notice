import { useState } from 'react'
import styled, { css, useTheme } from 'styled-components'

import { BlockModel } from '@notice-app/models/src'
import { NUrls } from '@notice-app/utils'
import { getEditorTimeouts } from '../hooks/bms/editor/useEditorValue'
import { useCurrentProject } from '../hooks/bms/project/useCurrentProject'
import { usePublish } from '../hooks/bms/usePublish'
import { invalidatePublishState, usePublishState } from '../hooks/bms/usePublishState'
import { useT } from '../hooks/useT'
import { OpenIcon } from '../icons/OpenIcon'
import { ZapIcon } from '../icons/ZapIcon'
import { GTM } from '../utils/GTM'
import { Row } from './Flex'
import { Loader } from './Loader'
import { PublicMenuSelector } from './PublishMenu/PublishMenu'
import { Show } from './Show'

export type PublishState = 'not_published' | 'out_of_date' | 'up_to_date' | undefined
interface IProps {
	showOptions?: boolean
	fullWidth?: boolean
}

export const usePublishButtonStyle = (state: PublishState, project?: BlockModel.block) => {
	const theme = useTheme()

	let color, background, text
	switch (state) {
		case 'not_published':
			if (project) {
				color = theme.colors.yellorange
				background = theme.colors.white
				text = color
			} else {
				color = theme.colors.greyDark
				background = theme.colors.white
				text = color
			}
			break
		case 'out_of_date':
			color = theme.colors.yellorange
			background = theme.colors.white
			text = color
			break
		case 'up_to_date':
		default:
			color = theme.colors.primary
			background = theme.colors.primary
			text = theme.colors.textLight
			break
	}

	return { color, background, text }
}

export const PublishButton = ({ showOptions = false, fullWidth }: IProps) => {
	const [t] = useT()
	const [project] = useCurrentProject()
	const publish = usePublish()
	const state = usePublishState()
	const style = usePublishButtonStyle(state.data, project)

	const [isPublishing, setIsPublishing] = useState(false)

	const onPublish = async () => {
		if (project == null || isPublishing) {
			return
		}

		if (state.data === 'up_to_date') {
			window.open(
				NUrls.App.wildcardURL(project?.preferences?.domain || project.id, project?.preferences?.customDomain),
				'_blank'
			)
			return
		}

		const timeout = getEditorTimeouts()[project.id]
		if (timeout != null) {
			return
		}

		setIsPublishing(true)

		await publish.mutateAsync({ block: project })
		GTM.send({ event: 'publish', project_id: project.id })

		await invalidatePublishState(project.id)

		if (state.data === 'not_published') {
			window.open(
				NUrls.App.wildcardURL(project?.preferences?.domain || project.id, project?.preferences?.customDomain),
				'_blank'
			)
		}

		setIsPublishing(false)
	}

	if (state.data === 'not_published') {
		return (
			<Row>
				<ImportantButton onClick={onPublish} disabled={project == null}>
					<ZapIcon size={18} color="white" />
					{t('Preview', 'preview')}
					{isPublishing && <Loader color={'white'} size={16} />}
				</ImportantButton>
			</Row>
		)
	}

	return (
		<Row>
			<Button
				hasOptions={showOptions}
				color={style.color}
				background={style.background}
				text={style.text}
				onClick={onPublish}
				disabled={project ? false : true}
				fullWidth={fullWidth}
			>
				<Content isPublishing={isPublishing} state={state.data} color={style.text} />
				{isPublishing && <Loader color={style.color} size={18} />}
			</Button>
			<Show when={showOptions}>
				<PublicMenuSelector disabled={project ? false : true} publishState={state.data} />
			</Show>
		</Row>
	)
}

const Content = ({ isPublishing, state, color }: { isPublishing: boolean; state: PublishState; color: string }) => {
	const [t] = useT()
	if (state === 'up_to_date') {
		return (
			<>
				{t('Visit page', 'visitPage')}
				<OpenIcon size={14} color={color} />
			</>
		)
	}

	if (isPublishing) return <>{t('Publishing', 'publishing')}</>
	else return <>{t('Publish', 'publish')}</>
}

const Button = styled.button<{
	color: string
	text: string
	background: string
	disabled?: boolean
	fullWidth?: boolean
	hasOptions: boolean
}>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;

	gap: 8px;
	padding: 6px 12px;

	border: none;
	outline-style: none;

	width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

	${({ hasOptions }) =>
		hasOptions
			? css`
					border-top-left-radius: ${({ theme }) => theme.borderRadius};
					border-bottom-left-radius: ${({ theme }) => theme.borderRadius};
			  `
			: css`
					border-radius: ${({ theme }) => theme.borderRadius};
			  `}

	border: 2.5px solid ${({ color }) => color};

	background-color: ${({ background }) => background};
	opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};

	font-size: 14px;
	font-weight: 600;
	color: ${({ text }) => text};
	white-space: nowrap;

	cursor: ${({ disabled }) => (disabled ? undefined : 'pointer')};

	transition:
		background-color 0.3s ease,
		border 0.3s ease,
		color 0.3s ease;
`

const ImportantButton = styled.button<{ disabled?: boolean }>`
	display: flex;
	flex-grow: 0;
	align-items: center;
	justify-content: center;

	gap: 6px;
	padding: 8px 14px;

	border: none;
	outline-style: none;

	width: auto;

	border: 1px solid rgba(0, 0, 0, 0.1);
	background: linear-gradient(92deg, #0c39d9 -7.07%, #eb6fff 83.74%);
	background-size: 400% 400%;
	transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);

	border-radius: ${({ theme }) => theme.borderRadius};
	animation: ${({ disabled }) => (!disabled ? 'animationGradient 7s ease infinite' : undefined)};

	font-size: 14px;
	font-weight: 700;
	color: white;
	letter-spacing: 0.7px;
	white-space: nowrap;

	filter: ${({ disabled }) => (disabled ? 'grayscale(0.5)' : undefined)};
	opacity: ${({ disabled }) => (disabled ? '0.5' : undefined)};

	cursor: ${({ disabled }) => (!disabled ? 'pointer' : 'not-allowed')};

	&:hover {
		box-shadow: ${({ disabled }) => (!disabled ? '0 2px 9px 0px rgba(0, 0, 0, 0.2)' : undefined)};
		transform: ${({ disabled }) => (!disabled ? 'translateY(-2px)' : undefined)};
	}

	@keyframes animationGradient {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
`
