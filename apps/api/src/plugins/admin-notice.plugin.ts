import { NUrls } from '@notice-app/tools'
import axios, { AxiosError } from 'axios'
import { Logger } from 'typerestjs'
import { UserModel } from '@notice-app/models'

interface ContactData {
	id: string
	email: string
	firstname?: string
	lastname?: string
	phone_number?: string
	utmCampaign?: string
	utmMedium?: string
	utmSource?: string
	utmTerm?: string
}

interface FormData {
	userId: string
	firstName: string
	lastName: string
	phone: string
	country: string
	companyName: string
	companySize: string
	companyRole: string
}

export namespace AdminNotice {
	const admin = axios.create({
		baseURL: NUrls.Admin.api(),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			'X-Admin-Token': process.env.INTERNAL_ADMIN_TOKEN,
		},
	})

	export const addContact = async (data: ContactData) => {
		try {
			await admin.post('/contacts', data)
		} catch (ex: any) {
			Logger.error('admin', ex, {
				info: 'Error while adding contact to Notice Admin',
				error: ex instanceof AxiosError ? ex.response?.data.error : undefined,
			})
		}
	}

	export const sendForm = async (userId: string, data: UserModel.form) => {
		try {
			await admin.post(`/contacts/${userId}/form`, data)
		} catch (ex: any) {
			Logger.error('admin', ex, {
				info: 'Error while sending form to Notice Admin',
				error: ex instanceof AxiosError ? ex.response?.data.error : undefined,
			})
		}
	}
}
