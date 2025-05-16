import { NavigateOptions, useSearchParams } from 'react-router-dom'

// TODO : performance problem
export const useSearchParam = (key: string) => {
	const [params, setParams] = useSearchParams()

	const setParam = (value: string | null, options?: Pick<NavigateOptions, 'replace'>) => {
		const allParams: { [key: string]: string } = {}
		for (const [_key, _value] of params.entries()) {
			allParams[_key] = _value
		}

		allParams[key] = value ?? 'undefined'

		setParams(allParams, { replace: options?.replace ?? true })
	}

	return [params.get(key), setParam] as const
}
