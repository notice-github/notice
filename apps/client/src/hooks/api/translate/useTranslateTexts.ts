import { TranslateSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { API } from '../../../utils/query'

export const useTranslateTexts = () => {
	const mutation = useMutation<
		TranslateSchema.texts['response']['200']['data'],
		unknown,
		TranslateSchema.texts['bodyIn']
	>(async (body) => {
		const { data } = await API.post('/translate/texts', body)
		return data.data
	})

	return mutation
}
