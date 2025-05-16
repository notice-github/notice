import { TranslateSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { API } from '../../../utils/query'

export const useTranslateText = () => {
	const mutation = useMutation<
		TranslateSchema.text['response']['200']['data'],
		unknown,
		TranslateSchema.text['bodyIn']
	>(async (body) => {
		const { data } = await API.post('/translate/text', body)
		return data.data
	})

	return mutation
}
