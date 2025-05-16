import { BlockModel, PageModel, WorkspaceModel } from '@notice-app/models'
import { useEffect, useReducer } from 'react'

import { ReactCodeMirrorProps } from '@uiw/react-codemirror'
import { PreviewHTML } from '../../containers/Editor/src/Editor/Blocks/HTML/previewHTML'
import { CollaboratorInvitation } from '../../containers/Modals/CollaboratorInvitation'
import { ContactUs } from '../../containers/Modals/ContactUs'
import { ContentScore } from '../../containers/Modals/ContentScore'
import { CreateWorkspace } from '../../containers/Modals/CreateWorkspace'
import { DeleteDomainConfirmation } from '../../containers/Modals/DeleteDomainConfirmation'
import { DeletePageConfirmation } from '../../containers/Modals/DeletePageConfirmation'
import { DeleteProjectConfirmation } from '../../containers/Modals/DeleteProjectConfirmation'
import { DeleteWorkspaceConfirmation } from '../../containers/Modals/DeleteWorkspaceConfirmation'
import { DomainConfiguration } from '../../containers/Modals/DomainConfiguration'
import { GoogleIndexationGuide } from '../../containers/Modals/GoogleIndexationGuide'
import { ImageDetails, ImageDetailsProps } from '../../containers/Modals/ImageDetails'
import { NoticeAiTokenSelection } from '../../containers/Modals/NoticeAiTokenSelection'
import { OnboardingForm } from '../../containers/Modals/Onboarding'
import { PageMetadata } from '../../containers/Modals/PageMetadata'
import { PlanUnsubscription } from '../../containers/Modals/PlanUnsubscription'
import { ProjectSelector } from '../../containers/Modals/ProjectSelector'
import { UpdateEmail } from '../../containers/Modals/UpdateEmail'
import { UpgradeValidation } from '../../containers/Modals/UpgradeValidation'
import { EventEmitter } from '../../utils/events'
import { CodeEditor } from '../CodeEditor'
import { AIOnboarding } from '../Onboarding/AIOnboarding'
import { TranslationConfiguration } from '../Translation/Configurations'
import { ModalContainer } from './ModalContainer'

const emitter = new EventEmitter()

interface ModalContextParams {
	fullHeight?: boolean
	backgroundColor?: string
	disableClickOutside?: boolean
	doNotShowExit?: boolean
	lightExit?: boolean
}

class ModalContext<T = void> {
	public opened = false

	private _closing = false

	private name: string
	private params: ModalContextParams | undefined
	private builder: (props: T) => JSX.Element

	private props?: T = undefined

	constructor(name: string, builder: (props: T) => JSX.Element, params?: ModalContextParams) {
		this.name = name
		this.params = params
		this.builder = builder
	}

	public open(props: T) {
		this.opened = true
		this.props = props
		emitter.dispatch('update', this.name)
	}

	public isOpened() {
		return this.opened
	}

	public close() {
		this._closing = true
		emitter.dispatch('update', this.name)
	}

	private _close() {
		this.opened = false
		this._closing = false
		this.props = undefined
		emitter.dispatch('update', this.name)
	}

	public render() {
		if (!this.opened) return

		return (
			<ModalContainer
				key={this.name}
				opened={this._closing ? false : this.opened}
				onClose={() => this._close()}
				{...this.params}
			>
				{this.builder(this.props!)}
			</ModalContainer>
		)
	}
}

interface ModalCodeMirrorProps extends ReactCodeMirrorProps {
	setVal: (val: string) => void
}

export const Modals = {
	onBoardingForm: new ModalContext('onBoardingForm', () => <OnboardingForm />, {
		disableClickOutside: true,
		lightExit: true,
	}),
	projectSelector: new ModalContext('projectSelector', () => <ProjectSelector />),
	contactUs: new ModalContext('contactUs', () => <ContactUs />, {
		doNotShowExit: true,
	}),
	collaboratorInvitation: new ModalContext('collaboratorInvitation', () => <CollaboratorInvitation />),
	noticeAiTokenSelection: new ModalContext('tokenPackageSelection', () => <NoticeAiTokenSelection />),
	planUnsubscription: new ModalContext('planUnsubscription', () => <PlanUnsubscription />),
	deletePageConfirmation: new ModalContext<{ page: PageModel.node }>('deletePageConfirmation', ({ page }) => (
		<DeletePageConfirmation page={page} />
	)),
	deleteProjectConfirmation: new ModalContext<{ project: BlockModel.block }>(
		'deleteProjectConfirmation',
		({ project }) => <DeleteProjectConfirmation project={project} />
	),
	updateEmail: new ModalContext('updateEmail', () => <UpdateEmail />),
	upgradeValidation: new ModalContext<{ timeSpan: 'monthly' | 'yearly' }>('upgradeValidation', ({ timeSpan }) => (
		<UpgradeValidation timeSpan={timeSpan} />
	)),
	createWorkspace: new ModalContext('createWorkspace', () => <CreateWorkspace />),
	deleteWorkspaceConfirmation: new ModalContext<{ workspace: WorkspaceModel.client }>(
		'deleteWorkspaceConfirmation',
		({ workspace }) => <DeleteWorkspaceConfirmation workspace={workspace} />
	),
	domainConfiguration: new ModalContext('domainConfiguration', () => <DomainConfiguration />),
	deleteDomainConfirmation: new ModalContext<{ project: BlockModel.block }>(
		'deleteDomainConfirmation',
		({ project }) => <DeleteDomainConfirmation project={project} />
	),
	aiOnboarding: new ModalContext('aiOnboarding', () => <AIOnboarding />, {
		fullHeight: true,
		backgroundColor: '#E0EAFC',
		disableClickOutside: true,
	}),

	expandCodeEditor: new ModalContext<ModalCodeMirrorProps>(
		'expandCodeEditor',
		({ placeholder, value, extensions, setVal }) => (
			<CodeEditor
				placeholder={placeholder}
				value={value}
				extensions={extensions}
				onChange={(val) => {
					setVal(val ?? '')
				}}
			/>
		),
		{
			fullHeight: true,
			backgroundColor: 'transparent',
		}
	),
	translationConfiguration: new ModalContext('translationConfiguration', () => <TranslationConfiguration />),
	previewHTML: new ModalContext<{ html: string }>('previewHTML', ({ html }) => <PreviewHTML html={html} />),
	googleIndexationGuide: new ModalContext('googleIndexationGuide', () => <GoogleIndexationGuide />),
	pageMetadata: new ModalContext<{ page: BlockModel.block }>('pageMetadata', ({ page }) => (
		<PageMetadata page={page} />
	)),
	contentScore: new ModalContext<{ page: BlockModel.block }>('contentScore', ({ page }) => (
		<ContentScore page={page} />
	)),
	imageDetails: new ModalContext('imageDetails', ({ image }: ImageDetailsProps) => <ImageDetails image={image} />),
}

export const GlobalModalContainer = () => {
	const [_, forceUpdate] = useReducer((x) => x + 1, 0)

	const onUpdate = () => forceUpdate()

	useEffect(() => {
		emitter.subscribe('update', onUpdate)

		return () => emitter.unsubscribe('update', onUpdate)
	}, [])

	return Object.values(Modals)
		.map((modal) => modal.render())
		.filter((elem) => elem !== undefined)
}
