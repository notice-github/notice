import { NEnv } from '@notice-app/utils'
import { toast } from 'react-toastify'
import { Modals } from '../../components/Modal'
import { GTM } from '../../utils/GTM'
import { useCreateProject } from '../bms/project/useCreateProject'
import { useCurrentProject } from '../bms/project/useCurrentProject'
import { useCurrentWorkspace } from './useCurrentWorkspace'

export const useCreateFromTemplate = () => {
	const [workspace] = useCurrentWorkspace()
	const [, setCurrentProject] = useCurrentProject()
	const createProject = useCreateProject()

	const createFromTemplate = async (name: string, templateId?: string | null, mixpanelType?: string) => {
		if (templateId == null) {
			toast.info('This feature is coming soon...')
			return
		}

		const project = await createProject.mutateAsync({
			workspace: workspace,
			name: NEnv.STAGE !== 'production' ? `My ${name}` : undefined,
			templateId: templateId,
			mixpanelType,
		})

		GTM.send({
			event: 'project_creation',
			template_used: name,
			type: 'default',
			project_id: project.id,
		})

		if (Modals.projectSelector.isOpened()) {
			Modals.projectSelector.close()
		}

		setCurrentProject(project)
		return project
	}

	const isLoading = createProject.isLoading
	return [createFromTemplate, isLoading] as const
}
