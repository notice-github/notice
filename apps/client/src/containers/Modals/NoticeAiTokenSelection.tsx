import styled, { useTheme } from 'styled-components'
import { RangeSelector } from '../../components/RangeSelector'
import { useState } from 'react'
import { Button } from '../../components/Button'
import { Modals } from '../../components/Modal'
import Token from '../../icons/Token'
import { useT } from '../../hooks/useT'

const amountFormatter = Intl.NumberFormat(undefined, {
	notation: 'compact',
	maximumSignificantDigits: 3,
	signDisplay: 'never',
})

const formatToken = (str: string) => {
	return str.replace(/\s/g, '').toLocaleUpperCase()
}

const cleanPrice = (price: number) => {
	return (price / 1000).toFixed(2)
}

interface TokenPlanDetails {
	start: number
	price1k: number
	discount: number
}

const tokenPlans: Array<TokenPlanDetails> = [
	{
		start: 1_000_000,
		price1k: 0.04,
		discount: 33.3,
	},
	{
		start: 750_000,
		price1k: 0.045,
		discount: 25,
	},
	{
		start: 500_000,
		price1k: 0.05,
		discount: 16.7,
	},
	{
		start: 250_000,
		price1k: 0.055,
		discount: 8.3,
	},
	{
		start: 0,
		price1k: 0.06,
		discount: 0,
	},
]

export const NoticeAiTokenSelection = () => {
	const [t] = useT()
	const theme = useTheme()
	const [valueSelected, setValueSelected] = useState(100_000)
	const max = 1_000_000
	const min = 50_000
	const step = 10_000

	let price1k = 0.06
	let discount = 0

	for (const elem of tokenPlans) {
		if (valueSelected >= elem.start) {
			price1k = elem.price1k
			discount = elem.discount
			break
		}
	}

	const handleSliderChange = (value: number) => {
		setValueSelected(value)
	}

	return (
		<Container>
			<Title>{t('Monthly token amount', 'monthlyTokenAmount')}</Title>
			<Description>Select your monthly token volume</Description>
			<Body>
				<TokenWrapper>
					<Text36 color={theme.colors.primary}>{formatToken(amountFormatter.format(valueSelected))}</Text36>
					<Token></Token>
				</TokenWrapper>
				<DetailsWrapper>
					<Text16 color={theme.colors.textLighterGrey} fontWeight="600">
						For ${cleanPrice(valueSelected * price1k)} per month
					</Text16>
					<DiscountWrapper>
						<Text16 color={theme.colors.white}>Save {discount.toFixed(1)}%</Text16>
					</DiscountWrapper>
				</DetailsWrapper>
				<RangeSelector
					min={min}
					max={max}
					value={valueSelected}
					step={step}
					onChange={handleSliderChange}
				></RangeSelector>
				<RowComponent>
					<Text16 color={theme.colors.textLightGrey} style={{ paddingLeft: '10%' }}>
						{formatToken(amountFormatter.format(min))}
					</Text16>
					<Text16 color={theme.colors.textLightGrey} style={{ paddingRight: '10%' }}>
						{formatToken(amountFormatter.format(max))}
					</Text16>
				</RowComponent>
			</Body>
			<Footer>
				<Button padding="8px 12px" color={theme.colors.white} onClick={() => Modals.noticeAiTokenSelection.close()}>
					<Text16 color={theme.colors.textLighterGrey} fontWeight="500">
						Cancel
					</Text16>
				</Button>
				<Button padding="8px 12px" color={theme.colors.white} onClick={() => Modals.noticeAiTokenSelection.close()}>
					<Text16 color={theme.colors.primary}>Save</Text16>
				</Button>
			</Footer>
		</Container>
	)
}

const Container = styled.div`
	width: 500px;
	padding: 32px;
`

const TokenWrapper = styled.div<any>`
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: ${({ gap }) => (gap ? gap : '5px')};
`

const Footer = styled.div`
	display: flex;
	margin-top: 30px;
	flex-direction: row;
	justify-content: right;
	gap: 3%;
`

const RowComponent = styled.div`
	display: flex;
	width: 100%;
	flex-directtion: row;
	justify-content: space-between;
`

const DetailsWrapper = styled.div`
	display: flex;
	width: 100%;
	flex-directtion: row;
	justify-content: center;
	align-items: center;
	gap: 10px;
`
const DiscountWrapper = styled.div`
  padding 4px 15px;
  background: #5FCB71;
  border-radius: 12px;
`

const Text16 = styled.p<any>`
	font-size: 16px;
	color: ${({ color }) => (color ? color : '#0')};
	font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : '700')};
`

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap 20px;
`

const Text36 = styled.h1<any>`
	font-size: 36px;
	color: ${({ color }) => (color ? color : '#0')};
`

const Title = styled.h1`
	font-size: 28px;
	margin-bottom: 6px;
`

const Description = styled.p`
	color: ${({ theme }) => theme.colors.textGrey};
	font-size: 16px;
	margin-bottom: 32px;
`
