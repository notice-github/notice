import { BlockModel } from '@notice-app/models'
import { useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { useBlockLang } from '../../hooks/bms/translation/useBlockLang'
import { useSearchParams } from '../../hooks/useSearchParams'
import { NLanguages } from '../../utils/languages'

interface Props extends Pick<React.ComponentPropsWithoutRef<'input'>, 'style'> {
	value: string
	id: string
	editable?: boolean
	page: BlockModel.block
	lang: NLanguages.LANGUAGE_CODES_TYPE
	data?: { title: string; lang: string }
	setData?: (any: any) => any
}

export function TranslationTitle({ page, editable = false, value, id, data, setData }: Props) {
	const [params] = useSearchParams()
	const lang = params.lang as unknown as NLanguages.LANGUAGE_CODES_TYPE
	const [selectedBlock] = useBlockLang(page)

	const ref = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		data && setData && setData({ title: selectedBlock?.data?.text, lang })
	}, [selectedBlock?.data?.text])

	useEffect(() => {
		ref.current?.focus()
	}, [])

	return (
		<Wrapper id={id} className={'notice-block-wrapper'} isRtl={NLanguages.LANGUAGES[lang]?.isRtl}>
			{editable ? (
				<StyledInput
					onChange={(e) => {
						setData && setData({ lang, title: e.target.value })
					}}
					ref={ref}
					value={data?.title ? data?.title : value ?? ''}
				/>
			) : (
				<>
					<div id={`${id}`} className={'readonly-handler'}>
						<div className="readonly-handler-circle"></div>
					</div>
					<Text>{value}</Text>
				</>
			)}
		</Wrapper>
	)
}

const Wrapper = styled.div<{ isRtl?: boolean }>`
	position: relative;
	${({ isRtl }) =>
		isRtl &&
		css`
			* {
				direction: rtl !important;
			}
		`}
`

const StyledInput = styled.input`
	padding: 12px;

	${({ theme }) => theme.fonts.regular};
	font-size: 30px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textDark};

	outline: none;
	border: none;
	border-radius: 8px;
	width: 100%;

	box-sizing: border-box;

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightGrey};
	}
`

const Text = styled.span`
	width: 100%;

	${({ theme }) => theme.fonts.regular};
	font-size: 30px;
	font-weight: 700;
	color: ${({ theme }) => theme.colors.textDark};
	padding: 0;
	box-sizing: border-box;
	outline: none;

	&::placeholder {
		color: ${({ theme }) => theme.colors.textLightGrey};
	}
`
