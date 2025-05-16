import axios from 'axios'

interface TmpFile {
	status: 'success' | 'error'
	generationTime: number
	id: number
	output: [string]
	meta: StableDiffMeta
}

interface StableDiffMeta {
	H: number
	W: number
	file_prefix: string
	model: string
	prompt: string
}

export namespace StableDiffusion {
	const api = axios.create({
		baseURL: 'https://stablediffusionapi.com/api/',
	})

	export const createMidjourneyPNG = async (prompt: string): Promise<TmpFile> => {
		try {
			var payload = {
				key: process.env.STABLEDIFFUSION_API_KEY,
				prompt,
				negative_prompt: 'anime, text',
				width: '768',
				height: '512',
				samples: '1',
				num_inference_steps: '41',
				safety_checker: 'no',
				enhance_prompt: 'no',
				seed: null,
				guidance_scale: 7.5,
				multi_lingual: 'no',
				panorama: 'no',
				self_attention: 'no',
				upscale: 'no',
				embeddings_model: null,
				webhook: null,
				track_id: null,
				temp: 'yes',
			}

			const { data } = await api.post(`/v3/text2img`, payload, {
				headers: { 'Content-Type': 'application/json' },
			})
			return data
		} catch (ex: any) {
			return ex.response?.data
		}
	}
}
