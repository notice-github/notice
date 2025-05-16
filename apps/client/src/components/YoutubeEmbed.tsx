import styled from 'styled-components'

const YoutubeEmbed = ({ embedId, title }: { embedId: string; title: string }) => (
	<Video>
		<iframe
			width="600"
			height="480"
			src={`https://www.youtube.com/embed/${embedId}`}
			frameBorder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowFullScreen
			title={title}
		/>
	</Video>
)

const Video = styled.div`
    overflow: hidden;
    padding-bottom: 56.25%;
    position: relative;
    height: 0;

    iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
`
export default YoutubeEmbed
