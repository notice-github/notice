import { NLanguages } from '../../utils/languages'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'
import { useUpdateProject } from '../../hooks/bms/project/useUpdateProject'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'

export function useAvailableLanguages() {
	const [workspace] = useCurrentWorkspace()
	const [project] = useCurrentProject()
	const updateProject = useUpdateProject()

	const availableLanguages = project?.preferences?.availableLanguages ?? []

	const updateAvailableLanguages = (lang: NLanguages.LANGUAGE_CODES_TYPE) => {
		if (!availableLanguages.includes(lang) && project) {
			const newAvailableLanguages = availableLanguages.concat(lang)
			updateProject.mutateAsync({
				workspace,
				project,
				preferences: { availableLanguages: newAvailableLanguages },
			})
		}
	}
	return [availableLanguages, updateAvailableLanguages] as const
}
