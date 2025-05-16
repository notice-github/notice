import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import styled, { css, useTheme } from 'styled-components'
import { useTrackEvent } from '../../hooks/analytics/useTrackEvent'
import { useCurrentWorkspace } from '../../hooks/api/useCurrentWorkspace'
import { useUser } from '../../hooks/api/useUser'
import { useImportMarkdown } from '../../hooks/bms/import/useImportMarkdown'
import { useCreateProject } from '../../hooks/bms/project/useCreateProject'
import Tick from '../../icons/Tick'
import { Consts } from '../../utils/consts'
import { API, queryClient } from '../../utils/query'
import { Button } from '../Button'
import { Modals } from '../Modal'
import { SimpleInput } from '../SimpleInput'

export const AIOnboarding = () => {
	const theme = useTheme()
	const [workspace] = useCurrentWorkspace()
	const createProject = useCreateProject()
	const importMarkdown = useImportMarkdown()

	const containerRef = useRef<HTMLDivElement>(null)

	const [step, setStep] = useState(0)
	const [type, setType] = useState<'faq' | 'article'>()
	const [website, setWebsite] = useState('')
	const [submited, setSubmited] = useState(false)
	const [confirmed, setConfirmed] = useState(false)

	const [result, setResult] = useState<string>()
	const [subjects, setSubjects] = useState<string[]>([])
	const [selectedSubject, setSelectedSubject] = useState<number>()

	const trackEvent = useTrackEvent()
	const user = useUser()

	useEffect(() => {
		setStep(1)
	}, [])

	useEffect(() => {
		if (!containerRef.current) return
		containerRef.current.scrollIntoView(false)
	}, [step, submited, result, subjects])

	const selectType = (type: 'faq' | 'article') => {
		if (submited) return

		setType(type)
		setStep(2)
	}

	const submitWebsite = async () => {
		if (submited || website.trim().length === 0 || !Consts.WEBSITE_REGEX.test(website)) return

		setSubmited(true)
		setStep(3)

		try {
			const url = new URL(website.startsWith('https://') ? website : `https://${website}`)

			switch (type) {
				case 'faq': {
					const { data } = await API.post('/onboarding/faq', { domain: url.host })
					setResult(data.data)
					setTimeout(() => confirm('faq', data.data), 2000)
					break
				}
				case 'article': {
					const { data } = await API.post('/onboarding/subjects', { domain: url.host, path: url.pathname })
					setSubjects(data.data)
					break
				}
			}
		} catch (ex: any) {
			if (ex?.response?.data?.error?.type === 'domain_unreachable') {
				toast.error('The domain/page/URL given is unreachable. Please try with a different one')
			} else {
				toast.error('Sorry, something went wrong during the creation process. Please reload the page and try again')
			}
			Modals.aiOnboarding.close()
		}
	}

	const submitSubject = async (index: number) => {
		setSelectedSubject(index)
		setStep(4)

		try {
			const url = new URL(website.startsWith('https://') ? website : `https://${website}`)

			const { data } = await API.post('/onboarding/article', {
				domain: url.host,
				path: url.pathname,
				subject: subjects[index],
			})

			setResult(data.data)
			setTimeout(() => confirm('article', data.data), 2000)
		} catch (ex) {
			toast.error('Sorry, something went wrong during the creation process. Please reload the page and try again')
			Modals.aiOnboarding.close()
		}
	}

	const confirm = async (type: 'faq' | 'article', result: string) => {
		if (type == undefined || result == undefined || confirmed) return
		setConfirmed(true)

		const project = await createProject.mutateAsync({ workspace, mixpanelType: type, name: 'My first project' })
		await importMarkdown.mutateAsync({ page: project, markdown: result })
		queryClient.setQueryData(
			['slate-page-value', project.id, undefined],
			queryClient.getQueryData<any>(['slate-value', project.id, undefined]).children
		)

		Modals.aiOnboarding.close()
	}

	return (
		<Container ref={containerRef}>
			{/* STEP 1 */}
			<ChatBubble align="start" displayed={step >= 1}>
				👋 Hi, I'm the Notice AI. What kind of project do you want me to create for you?
			</ChatBubble>
			<ChatBubble align="end" displayed={step >= 1}>
				<Card onClick={() => selectType('faq')} disabled={submited}>
					<img src="/assets/svg/ob_faq_card.svg" width={200} />
					{type === 'faq' && (
						<CardSelect>
							<Tick size={22} color={theme.colors.primary} />
						</CardSelect>
					)}
				</Card>
				<Card onClick={() => selectType('article')} disabled={submited}>
					<img src="/assets/svg/ob_article_card.svg" width={200} />
					{type === 'article' && (
						<CardSelect>
							<Tick size={22} color={theme.colors.primary} />
						</CardSelect>
					)}
				</Card>
			</ChatBubble>

			{/* STEP 2 */}
			<ChatBubble align="start" displayed={step >= 2} style={{ flexDirection: 'column', gap: '4px' }}>
				🤩 Sounds good! Now I need a website URL to continue... You can provide me:
				<Tips>
					<li>Your own website</li>
					<li>
						{type === 'faq' ? 'The one of your company' : 'A page of your company’s website (Blog, service, product)'}
					</li>
					<li>{type === 'faq' ? 'Any website with intresting content' : 'Any page with interesting content'}</li>
				</Tips>
			</ChatBubble>
			<ChatBubble align="end" style={{ alignItems: 'center' }} displayed={step >= 2}>
				<SimpleInput
					value={website}
					onChange={(value) => setWebsite(value)}
					validator={(value) => {
						if (typeof value !== 'string') return false
						value = value.trim()

						if (value.length === 0) return true
						return Consts.WEBSITE_REGEX.test(value)
					}}
					onEnter={submitWebsite}
					placeholder="www.notice.studio"
					disabled={submited}
				/>
				<Button style={{ padding: 8 }} onClick={submitWebsite} disabled={submited}>
					Submit
				</Button>
			</ChatBubble>

			{/* STEP 3 (FAQ) */}
			{type === 'faq' && (
				<>
					<ChatBubble align="start" displayed={step >= 3}>
						🙏 Thanks, I'm going to get to work now. Give me 15-20 seconds and I will come back with something good.
					</ChatBubble>
					{result != undefined && (
						<ChatBubble align="start" displayed={step >= 3}>
							🎉 I've come up with a perfect FAQ for you! Now I need to import it to the editor...
						</ChatBubble>
					)}
					<ChatBubble align="start" displayed={step >= 3}>
						<LoaderWrapper>
							<ThreeDotsLoading />
						</LoaderWrapper>
					</ChatBubble>
				</>
			)}

			{/* STEP 3 (Article) */}
			{type === 'article' && (
				<>
					<ChatBubble align="start" displayed={step >= 3}>
						🙏 Thanks! I'm going to get to work now, give me 5-10 seconds to get some intresting article subjects.
					</ChatBubble>
					<ChatBubble align="start" displayed={step >= 3}>
						{subjects.length > 0 &&
							`✨ I've come up with ${subjects.length} topics that could make a good article` +
								', tell me which one do you prefer?'}
						{subjects.length === 0 && (
							<LoaderWrapper>
								<ThreeDotsLoading />
							</LoaderWrapper>
						)}
					</ChatBubble>
					<ChatBubble align="end" displayed={step >= 3 && subjects.length > 0}>
						<SubjectsWrapper>
							{subjects.map((subject, idx) => (
								<Subject
									key={`subject-${idx}`}
									selected={selectedSubject === idx}
									disabled={selectedSubject != undefined}
									onClick={() => {
										if (selectedSubject != undefined) return
										submitSubject(idx)
									}}
								>
									{subject}
								</Subject>
							))}
						</SubjectsWrapper>
					</ChatBubble>
				</>
			)}

			{/* Step 4 (Article) */}
			{type === 'article' && submited && (
				<>
					<ChatBubble align="start" displayed={step >= 4}>
						👍 Nice choice! Let's back to work, give me 15-20 seconds and I will come back with something good.
					</ChatBubble>
					{result != undefined && (
						<ChatBubble align="start" displayed={step >= 4}>
							🎉 I've come up with a perfect article for you! Now I need to import it to the editor...
						</ChatBubble>
					)}
					<ChatBubble align="start" displayed={step >= 4}>
						<LoaderWrapper>
							<ThreeDotsLoading />
						</LoaderWrapper>
					</ChatBubble>
				</>
			)}

			<br />
		</Container>
	)
}

const Container = styled.div`
	width: 700px;
	overflow-x: hidden;

	display: flex;
	align-items: center;
	flex-direction: column;
	gap: 32px;

	padding: 32px;
`

const ChatBubble = styled.div<{ align: 'start' | 'end'; displayed?: boolean }>`
	display: flex;
	gap: 8px;

	max-width: 75%;

	align-self: ${({ align }) => align};
	color: ${({ theme, align }) => (align === 'end' ? theme.colors.textDark : theme.colors.textLight)};
	background-color: ${({ theme, align }) => (align === 'end' ? theme.colors.white : theme.colors.primary)};
	border-radius: 10px;

	font-size: 15px;
	font-weight: 500;
	line-height: 1.5rem;

	transform: translateX(${({ align, displayed }) => (displayed ? '0px' : align === 'end' ? '100px' : '-100px')});
	opacity: ${({ displayed }) => (displayed ? 1 : 0)};
	transition:
		transform 0.3s ease-in-out,
		opacity 0.3s ease-in-out;

	padding: 8px;

	box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`

const Card = styled.div<{ disabled?: boolean }>`
	position: relative;

	user-select: none;
	cursor: ${({ disabled }) => (disabled ? undefined : 'pointer')};

	transition: transform 0.3s ease;

	&:hover {
		transform: ${({ disabled }) => (disabled ? undefined : 'scale(1.1)')};
	}

	img {
		transform: translateY(8px);
	}
`

const CardSelect = styled.div`
	position: absolute;
	left: calc(50% - 21px);
	top: calc(50% - 42px);

	display: flex;
	align-items: center;
	justify-content: center;

	width: 42px;
	height: 42px;

	border-radius: 360px;
	border: 2px solid ${({ theme }) => theme.colors.primaryLight};

	background-color: white;
`

const Tips = styled.ul`
	margin-left: 24px;
`

const SubjectsWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`

const Subject = styled.div<{ selected?: boolean; disabled?: boolean }>`
	border: 2px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.borderRadius};
	padding: 12px 16px;

	user-select: none;
	cursor: ${({ disabled }) => (disabled ? undefined : 'pointer')};

	transition:
		border-color 0.2s ease,
		background-color 0.2s ease;

	${({ selected }) =>
		selected
			? css`
					border-color: ${({ theme }) => theme.colors.primary};
					background-color: ${({ theme }) => theme.colors.primaryExtraLight};
			  `
			: undefined}

	${({ disabled }) =>
		disabled
			? undefined
			: css`
					&:hover {
						border-color: ${({ theme }) => theme.colors.primary};
						background-color: ${({ theme }) => theme.colors.primaryExtraLight};
					}
			  `}
`

const LoaderWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 65px;
	height: 17px;
	padding-top: 3px;
`

const ThreeDotsLoading = styled.div`
	position: relative;
	left: -9999px;
	width: 8px;
	height: 8px;
	border-radius: 5px;
	background-color: ${({ theme }) => theme.colors.textLight};
	color: ${({ theme }) => theme.colors.textLight};
	box-shadow:
		9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
		9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
		10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
	animation: dot-typing 1.2s infinite linear;

	@keyframes dot-typing {
		0% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
		16.667% {
			box-shadow:
				9984px -10px 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
		33.333% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
		50% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px -10px 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
		66.667% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
		83.333% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px -10px 0 0 ${({ theme }) => theme.colors.textLight};
		}
		100% {
			box-shadow:
				9984px 0 0 0 ${({ theme }) => theme.colors.textLight},
				9999px 0 0 0 ${({ theme }) => theme.colors.textLight},
				10014px 0 0 0 ${({ theme }) => theme.colors.textLight};
		}
	}
`

const ConfirmButton = styled.div`
	display: inline-flex;
	align-items: center;
	gap: 0.375rem;

	margin-bottom: 32px;
	padding: 0.75rem 1.5rem;

	font-size: 1.1rem;
	font-weight: 700;
	color: white;

	border-radius: 10px;
	background: linear-gradient(156deg, rgba(109, 201, 183, 0.6) 0%, rgba(255, 122, 146, 0.6) 59.62%),
		linear-gradient(38deg, #3a85d0 0%, #3a85d0 50%, #ffb745 100%);

	cursor: pointer;
`
