import { TrackerSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { Analytics } from '../../utils/query'

export const useTrackCrash = () => {
	const mutation = useMutation<TrackerSchema.crash['response'][200], undefined, TrackerSchema.crash['bodyIn']>(
		async (body) => {
			const { data } = await Analytics.post('/tracker/crash', body)
			return data.data
		}
	)

	return mutation
}
