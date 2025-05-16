import { TranslateSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { API } from '../../../utils/query'
import { invalidatePublishState } from '../../bms/usePublishState'
import { toast } from 'react-toastify'

export const usePageTranslate = () => {
	const mutation = useMutation<
		TranslateSchema.page['response']['200']['data'],
		unknown,
		TranslateSchema.page['bodyIn']
	>(
		async (body) => {
			const { data } = await API.post('/translate/page', body, { timeout: 1000 * 60 * 3 })
			return data.data
		},
		{
			onSuccess: async (_, { projectId }) => {
				await invalidatePublishState(projectId)
				window.location.reload() // Need to refecth the project instead of reloading the whole page
			},
			onError: () => {
				toast.error('Sorry, something went wrong during the translation process. Please reload the page and try again')
			},
		}
	)

	return mutation
}
