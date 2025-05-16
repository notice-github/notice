import { TemplateSchema } from '../schemas/template.schema'

export const SUBJECTS_PROMPT = `You must respect the following rules:
The user will provide you with the main content of his website.
You must use the language the most present in the content given by the user.
You must create 4 subjects for blog article.
The output must be strictly only a list of 4 subjects.
exemple:
1. subject one
2. subject two
3. subject tree
4. subject four
`

export const FAQ_PROMPT = `You must respect the following rules:
The user will provide you with the main content of his website.
You have to create an FAQ with exactly 5 questions and answers using the data that you receive.
Every question must address a different subject.
You must use the language that is most present in the content given by the user to create the FAQ.
You must output the faq using markdown with expandable using <details> and <summary> following this format:
<details>
<summary>Question</summary>
Answer
</details>
...
`

export const ARTICLE_PROMPT = `You must respect the following rules:
The user will provide you with content from his website.
You must extract the data related to this subject "{{ subject }}" and you will create a small article about it.
The title of the article is "{{ title }}"
You must create fewer than 3 sections.
You must use the language that is most present in the content given by the user to create the article.
The output must strictly be in Markdown format.`

export const ARTICLE_PROMPT_NO_SUBJECT = `You must respect the following rules:
The user will provide you with content from his website.
You must create a small blog article using the data that you receive from the user.
You must create fewer than 3 sections.
You must use the language that is most present in the content given by the user to create the article.
The output must strictly be in Markdown format.`

export const ASSISTANT_TEMPLATE_PROMPT = `
- Output format must only contain a valid JSON.
- Do not modify any block that has the type "image".
`

// About this structure:
// - A block with type "expandable" wraps a question for an FAQ. Put the question in "data.title" and NOT in the "blocks".

// - This a nested JSON structure. Each element is called a "block".
// - Each block has a "type" property. This property describes the type of the block.
// - Each block has a "blocks" property that is an array of blocks. It describes the nested children of the block.
// - A block can have a "data.text" property, it contains the text content.

export const fromTemplatePromptGen = (
	templateName: string,
	content: string,
	template?: string,
	websiteName?: string,
	context?: string
) => {
	const contextPrompt = context ? `The user provided some instructions: ${context}` : ''
	const contentPrompt = content
		? `
		You have to create a ${templateName} using the same JSON structure as in [json-structure-example].
		
		This is the [website-data] from a website called "${websiteName}":
		"${content}"

		If the [website-data] does not apply to the creation of a ${templateName}, you can ignore it and base your response on your knowledge. 
		`
		: ''

	const prompt = `
	This is the [json-structure-example] of a ${templateName} with example data:
	"${template}"

	${contentPrompt}
	${contextPrompt}

	Your output must be a JSON that respects the [json-structure-example] structure.
	`
	return prompt
}

export const scrapperPrompt = (rawText: string, domain: string): any => {
	const prompt = `I scrapped a website called ${domain}. This is the raw text: 
	"${rawText}"

	Replace the 'x' in the following list. Invent the elements in the list if missing, for instance, if you don't have the email, try contact@[websitename] and so on:
	"
	company or project name: 'x'
	sector: 'x'
	activity in less than 5 words: 'x'
	description in maximum 5 sentences: 'x'
	contact email: 'x'
	"
	`

	return [
		{ role: 'system', content: 'You are an expert summary writer.' },
		{
			role: 'user',
			content: prompt,
		},
	]
}

export interface PromptIdea {
	title: string
	content: string
	imageDescription: string
}
export const htmlPagePrompt = (
	templateName: string,
	websiteName: string,
	{ title, content }: PromptIdea,
	customFormat?: string
) => {
	const defaultFormat = `Output must be a valid HTML and contain at least 5 paragraphs and some headings.`
	const userPrompt = `You are a Blog expert writer.

	I want you to create a page for a ${templateName} using html for a website called ${websiteName}.

	The page shall be about "${JSON.stringify(content)}" and have the following title "${title}".

	${customFormat ?? defaultFormat}
	`
	return [{ role: 'user', content: userPrompt }]
}

export const generateIdeasPrompt = (
	template: TemplateSchema.generation['body']['template'],
	scrappedSummary?: string,
	customInstruction?: string,
	context?: string
) => {
	const { name, generateImage } = template
	const defaultPrompt = `Write the summary for one ${name} page.`
	const summaryPrompt =
		`I have some information about this website, if not useful for a ${name}, just invent the content yourself:"${scrappedSummary}"` ??
		''
	const contextPrompt = context ? `The user provided some instructions that you need to respect: ${context}` : ''

	const userPrompt = `${customInstruction ?? defaultPrompt}

	${summaryPrompt}
	${contextPrompt}
	
	Output must be a valid JSON Array that respects this schema: [{title: "page tite", content: "page content"${
		generateImage ? `, imageDescription: "specific image description to give to a graphist or painter"` : ``
	}}]. 
	
	Do not include any explanations or comments in your response.`

	return [{ role: 'user', content: userPrompt }]
}
