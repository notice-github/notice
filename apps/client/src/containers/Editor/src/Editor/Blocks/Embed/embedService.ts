import { NEmbeds } from '../../../../../../utils/embeds'

const embedServicesList = NEmbeds.embedServicesList

const detectService = (url: string) => {
	return Object.keys(embedServicesList).find((key) => {
		const service = embedServicesList[key]
		const { regex } = service

		const match = regex.exec(url)
		if (!match) return false
		return true
	})
}

interface EmbedObject {
	service: string
	source: string
	url: string
	width?: number
	height?: number
}

export const getEmbedObject = (url: string): EmbedObject | undefined => {
	const service = detectService(url)

	if (!service) return undefined
	const serviceObject = embedServicesList[service]

	const { regex, embedUrl, id = (ids: Array<string>) => ids.shift() } = serviceObject
	const result = regex.exec(url).slice(1)
	const embed = embedUrl.replace(/<%= remote_id %>/g, id(result))

	const data = {
		service,
		source: url,
		url: embed,
	}
	return data
}
