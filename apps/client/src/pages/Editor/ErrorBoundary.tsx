import styled from 'styled-components'
import { Component, ErrorInfo, ReactNode } from 'react'

import { HistoryIcon } from '../../icons/HistoryIcon'
import { SettingButton } from '../../components/Settings/SettingButton'
import { resetEditorTimeouts } from '../../hooks/bms/editor/useEditorValue'
import { Analytics } from '../../utils/query'

interface Props {
	value: any
	setValue: (value: any) => void
	children?: ReactNode
}

interface State {
	value?: any
	hasError: boolean
}

export class EditorErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	}

	public static getDerivedStateFromError(_: Error): State {
		return { hasError: true }
	}

	public componentDidCatch(error: Error, info: ErrorInfo) {
		Analytics.post('/tracker/crash', {
			name: error.name,
			message: error.message,
			stack: error.stack,
			metadata: { url: window.location.href },
		})

		this.state.value = structuredClone(this.props.value)

		resetEditorTimeouts()
	}

	public render() {
		if (this.state.hasError) {
			return (
				<Container>
					<Image src="/assets/images/error-boundary.png" />
					<ButtonGroup>
						<SettingButton
							primary
							onClick={() => {
								this.props.setValue(this.state.value)
								setTimeout(() => {
									this.state.hasError = false
									this.forceUpdate()
								}, 10)
							}}
						>
							<HistoryIcon color="#fff" size={16} />
							Rollback
						</SettingButton>
						<SettingButton onClick={() => window.location.reload()}>Refresh</SettingButton>
					</ButtonGroup>
				</Container>
			)
		}

		return this.props.children
	}
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 32px;
	width: 100%;
`

const Image = styled.img`
	width: 100%;
`

const ButtonGroup = styled.div`
	display: flex;
	gap: 16px;
`
