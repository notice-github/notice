import { langs } from '@uiw/codemirror-extensions-langs'
import styled from 'styled-components'
import { CodeHighlighter } from '../../components/CodeHighlighter'
import IntegrationTitleBanner from '../../components/IntegrationTitleBanner'
import { useCurrentPage } from '../../hooks/bms/page/useCurrentPage'

const Nuxt = () => {
	const [page] = useCurrentPage()
	const Script = `<template>
    <div>
     <div class="notice-target-container" notice-integration=”nuxt-script”
      project-id="${page?.rootId}"></div>
    </div>
</template>

<script>
export default {
  mounted() {
      (function() {
          const d = document;
          const s = d.createElement("script");
          s.src =
            "https://bundle.notice.studio/index.js";
          s.async = true;
          d.getElementsByTagName("head")[0].appendChild(s);
        })();
  }
}
</script>`

	return (
		<>
			<IntegrationTitleBanner title={`Nuxt Js`} icon={'/assets/svg/nuxt.svg'} />
			<FlexColumn>
				<p>{`Integrate Notice to NuxtJS by following the example below :`}</p>

				<CodeHighlighter code={Script} extensions={[langs.vue()]} />
			</FlexColumn>
		</>
	)
}

const FlexColumn = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
	margin-left: 36px;
`

const StyledLink = styled.a`
	color: ${({ theme }) => theme.colors.mariner};
`

export default Nuxt
