import { NTime } from '@notice-app/utils'
import { toast } from 'react-toastify'
import { Modals } from '../../../components/Modal'
import { TemplateType } from '../../../containers/Modals/ProjectSelector'
import { AllFonts } from '../../../data/fonts'
import { GTM } from '../../../utils/GTM'
import { queryClient } from '../../../utils/query'
import { useTrackEvent } from '../../analytics/useTrackEvent'
import { useImportBms } from '../../bms/import/useImportBms'
import { useCreateProject } from '../../bms/project/useCreateProject'
import { useCurrentProject } from '../../bms/project/useCurrentProject'
import { useCreateFromTemplate } from '../useCreateFromTemplate'
import { useCurrentWorkspace } from '../useCurrentWorkspace'
import { useUser } from '../useUser'

interface Props {
	generatedData: Record<string, any>
	generatedDesign: Record<string, any>
	template: TemplateType
	domain?: string | null
	templateName?: string
	startingTime?: Date
}

export function useCreateProjectFromAiData() {
	const [createFromTemplate] = useCreateFromTemplate()
	const [currentWorkspace] = useCurrentWorkspace()
	const user = useUser()

	const [, setCurrentProject] = useCurrentProject()

	const createProject = useCreateProject()
	const importBms = useImportBms()

	const builtPreferences = ({ generatedDesign, domain, templateName }: Partial<Props>) => {
		const preferences: Record<string, any> = {}

		generatedDesign?.fonts.map((fontObject: Record<string, any>) => {
			if (AllFonts.includes(fontObject.font)) {
				preferences.fontFamilyName = fontObject.font
			}
		})
		const domainOrigin = domain
			? new URL(domain.startsWith('https://') ? domain : `https://${domain}`)?.origin
			: undefined
		if (generatedDesign?.favicon) {
			preferences.logoUrl = generatedDesign.favicon
			preferences.domainUrl = domainOrigin
			preferences.handleFavicon = true
		}

		const domainName = domainOrigin
			? domainOrigin
					?.replace(/https?:\/\/(w{3}\.)?/g, '')
					?.replace(/[^.]*$/g, '')
					?.slice(0, -1)
			: undefined
		preferences.projectTitle = domainName
			? `${domainName.charAt(0).toLocaleUpperCase() + domainName.slice(1)} ${templateName}`
			: templateName

		return preferences
	}

	const isProjectCreating = createProject.isLoading || importBms.isLoading

	const createProjectFromAiData = async ({ generatedData, generatedDesign, domain, template, startingTime }: Props) => {
		try {
			const preferences = generatedDesign
				? builtPreferences({ generatedDesign, domain, templateName: template.name })
				: null

			const project = await createProject.mutateAsync({
				workspace: currentWorkspace,
				mixpanelType: `${template.mixpanelType}#AI`,
				name: template.name,
				templateId: template.templateId,
				templateMode: 'partial',
				preferences: preferences ? preferences : undefined,
			})

			await importBms.mutateAsync({ page: project, bms: generatedData })

			queryClient.setQueryData(
				['slate-page-value', project.id, undefined],
				queryClient.getQueryData<any>(['slate-value', project.id, undefined])?.children
			)

			setCurrentProject(project)

			GTM.send({
				event: 'project_creation',
				template_used: template.name,
				type: 'ai',
			})

			if (Modals.projectSelector.isOpened()) {
				Modals.projectSelector.close()
			}
		} catch (e) {
			toast.info('We encountered difficulties generating the project with AI. We fallback on the template instead')
			createFromTemplate(template.name, template.templateId, template.name)

			if (Modals.projectSelector.isOpened()) {
				Modals.projectSelector.close()
			}
		}
	}

	return [createProjectFromAiData, isProjectCreating] as const
}
