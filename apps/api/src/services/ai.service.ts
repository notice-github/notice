import { AISchema } from '../schemas/ai.schema'

export namespace AIService {
	export const createRephrasingPrompt = (input: string, type: AISchema.rephrase['body']['type']) => {
		switch (type) {
			case 'formal':
				return `Rephrase the following text in a more formal manner:\n "${input}"`
			case 'expand':
				return `Make this text a bit longer:\n "${input}"`
			case 'short':
				return `Summarize the following text in a concise manner:\n ${input}`
			case 'fun':
				return `Rephrase this text with a humorous turn of phrase:\n ${input}`
			case 'correct':
				return `Correct the text between while maintaining breaklines trying to keep the same words while fixing the grammar:\n "${input}"`
			default:
				return input
		}
	}

	export const createImagePrompt = (description: string, style?: AISchema.generateImage['body']['style']) => {
		switch (style) {
			case 'realistic':
				return `${description}, in realistic photo style`
			case 'pixel-art':
				return `${description}, in pixel art style`
			case 'isometric-art':
				return `${description}, in isometric art style`
			case 'drawing':
				return `${description}, in drawing style`
			case 'flat-illustration':
				return `${description}, in digital flat illustration style`
			default:
				return description
		}
	}
}
