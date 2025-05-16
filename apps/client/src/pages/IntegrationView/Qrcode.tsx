import QRCode from 'qrcode.react'
import styled from 'styled-components'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { useCurrentProject } from '../../hooks/bms/project/useCurrentProject'

const Qrcode = () => {
	const downloadQrCode = () => {
		const canvas = document.getElementById('QR-Code') as HTMLCanvasElement
		if (canvas) {
			const dlUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
			const downloadLink = document.createElement('a')
			downloadLink.href = dlUrl
			downloadLink.download = `notice.png`
			document.body.appendChild(downloadLink)
			downloadLink.click()
			document.body.removeChild(downloadLink)
		}
	}

	const [project] = useCurrentProject()
	const domain = project?.preferences?.domain ?? project?.id

	return (
		<>
			<IntegrationTitleBanner title={'QR Code'} icon={'/assets/svg/qrcode.svg'} />
			<MarginLeft16>
				<p>Here is the QR code of your project.</p>
				<p>Click to export it as a PNG file.</p>
				<QrWrapper onClick={downloadQrCode}>
					<QRCode id="QR-Code" size={300} value={`https://${domain}.notice.site`} />
					<DlIcon>{/* <FolderDownload /> */}</DlIcon>
				</QrWrapper>
				<p>You are ready to share your content! </p>
			</MarginLeft16>
		</>
	)
}

const MarginLeft16 = styled.div`
	margin-left: 16px;
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const QrWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin: 24px 0 16px 0;
	cursor: pointer;
`

const DlIcon = styled.div`
	position: relative;
	top: -12px;
	right: -2px;
`

export default Qrcode
