import { Consts } from './consts'

export const isCorporateEmail = (email: string) => {
	if (!email) return false
	const domain = email.split('@')[1]

	const isProvider = Consts.EMAIL_PROVIDER_LIST.includes(domain)

	return !isProvider
}
