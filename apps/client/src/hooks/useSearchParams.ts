import * as rrd from 'react-router-dom'

type Params = { [key: string]: string | null }
type Result = [Params, (value: Params, options?: Pick<rrd.NavigateOptions, 'replace'>) => void]

export const useSearchParams = (): Result => {
	const [params, rrdSetParams] = rrd.useSearchParams()

	const setParams = (newParams: Params, options?: Pick<rrd.NavigateOptions, 'replace'>) => {
		const allParams: { [key: string]: string } = {}
		for (const [_key, _value] of params.entries()) {
			allParams[_key] = _value
		}

		for (const key in newParams) {
			allParams[key] = newParams[key] ?? 'undefined'
		}

		rrdSetParams(allParams, { replace: options?.replace ?? true })
	}

	return [Object.fromEntries(params.entries()), setParams]
}
