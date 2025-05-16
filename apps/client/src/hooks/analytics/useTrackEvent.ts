import { NEnv } from '@notice-app/utils'
import { TrackerSchema } from '@notice-app/api/schemas'
import { useMutation } from '@tanstack/react-query'
import { Analytics } from '../../utils/query'

export const useTrackEvent = () => {
	const mutation = useMutation<TrackerSchema.event['response'][200], undefined, TrackerSchema.event['bodyIn']>(
		async (body) => {
			if (NEnv.STAGE === 'development') return

			const { data } = await Analytics.post(`/tracker/event`, body)
			return data.data
		}
	)

	return mutation
}
