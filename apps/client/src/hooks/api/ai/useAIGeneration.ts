import { TemplateSchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { NTime } from '@notice-app/utils'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { Modals } from '../../../components/Modal'
import { TemplateType } from '../../../containers/Modals/ProjectSelector'
import { API } from '../../../utils/query'
import { useTrackEvent } from '../../analytics/useTrackEvent'
import { useCreateFromTemplate } from '../useCreateFromTemplate'
import { useUser } from '../useUser'
import { useCreateProjectFromAiData } from './useCreateProjectFromAiData'

export const useAIGeneration = () => {
	const [createFromTemplate] = useCreateFromTemplate()
	const [createProjectFromAiData, isCreatingProject] = useCreateProjectFromAiData()

	const trackEvent = useTrackEvent()
	const user = useUser()
	const [startingTime, setStartingTime] = useState<Date>(NTime.now())

	const mutation = useMutation<
		void,
		undefined,
		TemplateSchema.generation['bodyIn'] & {
			workspace: WorkspaceModel.client
			abortController: AbortController
			selectedTemplate: TemplateType
		}
	>(async ({ workspace, abortController, ...body }) => {
		setStartingTime(NTime.now())
		const { url, context, selectedTemplate, domain } = body

		const [data, design] = await Promise.allSettled([
			API.post(`/template/generation?workspaceId=${workspace.id}`, body, {
				timeout: 1000 * 60 * 4,
				signal: abortController.signal,
			}),
			body.domain
				? API.post(
						`/template/getDesign`,
						{ domain },
						{
							timeout: 1000 * 60 * 4,
							signal: abortController.signal,
						}
				  )
				: Promise.resolve(undefined),
		])

		if (data.status === 'fulfilled') {
			createProjectFromAiData({
				generatedData: data.value.data.data,
				generatedDesign: design.status === 'fulfilled' ? design.value?.data.data : undefined,
				template: selectedTemplate,
				startingTime,
				domain,
			})
		}

		if (data.status === 'rejected') {
			const error = data.reason?.response?.data?.error?.type

			if (error === 'domain_unreachable' || error === 'domain_timeout') {
				toast.error('The domain/page/URL given is unreachable. Please try with a different one')
			} else if (error === 'subscription_limit') {
				if (Modals.projectSelector.isOpened()) {
					Modals.projectSelector.close()
				}
			} else {
				if (abortController.signal.aborted === false) {
					createFromTemplate(selectedTemplate.name, selectedTemplate.templateId, selectedTemplate.name)
					toast.info('We encountered difficulties generating the project with AI. We fallback on the template instead')
				}
			}
		}

		if (design.status === 'rejected') {
			const error = design.reason?.response?.data?.error?.type

			if (error === 'domain_timeout') {
				trackEvent.mutate({
					id: user.email,
					eventName: '[AI] Error',
					data: {
						when: 'design domain timeout',
						website: domain ?? 'null',
					},
				})
			}
		}
	})

	return [mutation, isCreatingProject] as const
}
