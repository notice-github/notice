import { NCheckers, NUrls } from '@notice-app/utils'
import { QueryClient } from '@tanstack/react-query'
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { Pages } from '../pages'
import { Router } from '../router'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000, // 5 minutes
			retry: false,
		},
	},
})

const parseDatesInObject = (body: any) => {
	if (body === null || body === undefined || typeof body !== 'object') return body

	const newBody: Record<string, any> = !Array.isArray(body) ? {} : []

	for (const key of Object.keys(body)) {
		const value = body[key]

		if (NCheckers.isIsoDateString(value)) newBody[key] = new Date(value)
		else if (typeof value === 'object') newBody[key] = parseDatesInObject(value)
		else newBody[key] = value
	}

	return newBody
}

const onFulfilled = (res: AxiosResponse) => {
	res.data = parseDatesInObject(res.data)
	return res
}

const onRejected = async (err: any) => {
	const status = err.response?.status

	switch (status) {
		case 402: {
			const { type, message } = err.response.data.error
			if (type === 'subscription_limit') {
				if (err.response.config?.url === '/blocks') queryClient.invalidateQueries(['projects'])
				Router._router.navigate(Pages.SETTINGS_SUBSCRIPTION)
			}
			break
		}
		default: {
			if (status < 400) break
			else if (status >= 500) {
				toast.error(
					'An unknown error has occurred during the request.' +
						'Try to refresh the page. If the issue persists, please contact us.'
				)
				break
			}

			try {
				const { type, message } = err.response.data.error
				if (message === type) break

				toast.error(message)
			} catch (ex) {}
		}
	}

	return Promise.reject(err)
}

const cleanSearchParams = (req: InternalAxiosRequestConfig<any>) => {
	const { url } = req
	if (url == null) return req

	const search = url.split('?')[1]
	if (search == null) return req

	const params = new URLSearchParams(search)

	for (const [key, val] of params.entries()) {
		if (val == null || val === 'undefined' || val === 'null') params.delete(key)
	}

	const result = params.toString()
	req.url = url.split('?')[0] + (result !== '' ? `?${result}` : '')

	return req
}

export const API = axios.create({
	baseURL: NUrls.App.api(),
	timeout: 60_000,
	withCredentials: true,
})
API.interceptors.request.use(cleanSearchParams)
API.interceptors.response.use(onFulfilled, onRejected)

export const BMS = axios.create({
	baseURL: NUrls.App.api(),
	timeout: 60_000,
	withCredentials: true,
})
BMS.interceptors.request.use(cleanSearchParams)
BMS.interceptors.response.use(onFulfilled, onRejected)

export const Analytics = axios.create({
	baseURL: NUrls.App.api(),
	timeout: 60_000,
	withCredentials: true,
})
Analytics.interceptors.request.use(cleanSearchParams)
Analytics.interceptors.response.use(onFulfilled, onRejected)

export const Lighthouse = axios.create({
	baseURL: NUrls.App.lighthouse(),
	timeout: 60_000,
	withCredentials: false,
})
Lighthouse.interceptors.request.use(cleanSearchParams)
Lighthouse.interceptors.response.use(onFulfilled, onRejected)
