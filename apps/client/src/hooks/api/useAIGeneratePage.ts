import { AISchema } from '@notice-app/api/schemas'
import { WorkspaceModel } from '@notice-app/models'
import { useMutation } from '@tanstack/react-query'

import { toast } from 'react-toastify'
import { NUrls } from '@notice-app/utils'
import { Router } from '../../router'
import { Pages } from '../../pages'

export const useAIGeneratePage = () => {
	const mutation = useMutation<
		AISchema.generatePage['response']['200']['data'],
		undefined,
		AISchema.generatePage['bodyIn'] & {
			workspace: WorkspaceModel.client
			setMdResponse: (s: string) => void
			destroyElement?: () => void
		}
	>(
		async ({ workspace, setMdResponse, destroyElement, ...body }: any) => {
			const data = await fetch(`${NUrls.App.api()}/ai/page?workspaceId=${workspace.id}`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors',
				body: JSON.stringify({ workspaceId: workspace.id, ...body }),
			})
				// Retrieve its body as ReadableStream
				.then((response) => {
					if (response.status === 402) {
						Router._router.navigate(Pages.SETTINGS_SUBSCRIPTION)
						destroyElement()
					}
					return response.body
				})
				.then(async (body) => {
					let reader = body?.pipeThrough(new TextDecoderStream()).getReader()
					while (reader) {
						let stream = await reader.read()
						if (stream.value?.includes('_end_of_stream_')) {
							// split the string between the end of the stream and the end of the string
							const split = stream.value.split('_end_of_stream_')
							// set the markdown response
							setMdResponse(split[0])
							break
						}

						setMdResponse(stream.value)
						if (stream.done) break
					}
				})
				.catch((error) => {
					console.error('Fetch error:', error)
				})
			return data
		},
		{
			onError: () => {
				toast.error('Sorry, an error occurred. Please try again or contact us.')
			},
		}
	)

	return mutation
}
