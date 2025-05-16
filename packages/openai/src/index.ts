import axios from 'axios'
import { encode } from 'gpt-3-encoder'
import { OpenAI as OpenAIApi } from 'openai'
import {
	ChatCompletionChunk,
	ChatCompletionCreateParams,
	ChatCompletionCreateParamsNonStreaming,
	ChatCompletionCreateParamsStreaming,
} from 'openai/resources'
import { Stream } from 'stream'

type OpenAIGenerateImageConfig = {
	prompt: string
	size: string
	model?: string
}

type OpenAICompletionConfig = {
	prompt: string
	model: 'text-davinci-003' | 'text-curie-001' | 'text-babbage-001' | 'text-ada-001'
	temperature?: number
}

export namespace OpenAI {
	const configuration = {
		organization: 'org-vSOjVhGwNyLw2qiEAoj2LcAv',
		apiKey: process.env.OPENAI_API_KEY,
	}
	const openai = new OpenAIApi(configuration)

	export const MAX_TOKEN = {
		'gpt-4o-mini': 4096,
		'gpt-4': 8192,
		'gpt-3.5-turbo': 4096,
		'text-davinci-003': 4096,
		'text-curie-001': 2048,
		'text-babbage-001': 2048,
		'text-ada-001': 2048,
	}

	export const getTokenCount = (prompt: string) => {
		return encode(prompt).length
	}

	export async function generateImage(config: OpenAIGenerateImageConfig) {
		const { data } = await axios.post(
			'https://api.openai.com/v1/images/generations',
			{
				...config,
				n: 1,
				response_format: 'url',
			},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		)
		return data.data[0]?.url
	}

	export async function getModerationPolicy(input: string) {
		const { data } = await axios.post(
			'https://api.openai.com/v1/moderations',
			{ input },
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				},
			}
		)
		return data.results[0]
	}

	export const chatCompletion = async (params: ChatCompletionCreateParamsNonStreaming) => {
		const chatCompletion = await openai.chat.completions.create(params)

		return {
			data: chatCompletion.choices[0]?.message?.content?.trim() ?? '',
			usage: chatCompletion.usage?.total_tokens ?? 0,
		}
	}

	export const getTokenAmount = (prompt: string) => {
		return encode(prompt).length
	}

	export const streamChatCompletion = async (params: ChatCompletionCreateParams, res: any) => {
		const stream = await openai.chat.completions.create({
			...params,
		})
		if (!params.stream) return stream

		for await (const chunk of stream as AsyncIterable<ChatCompletionChunk>) {
			res.write(chunk.choices[0]?.delta?.content || '')
		}
		return stream
	}
}
