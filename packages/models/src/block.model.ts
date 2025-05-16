import { CustomType, Is, ModelType } from 'typerestjs'

export namespace BlockModel {
	//-----------//
	// All parts //
	//-----------//

	export const types = Is.enum([
		'page',

		'paragraph',

		'header-1',
		'header-2',
		'header-3',

		'quote',
		'hint',
		'expandable',

		'divider',

		'code',
		'javascript',
		'html',

		'list-item',
		'bulleted-list',
		'numbered-list',

		'checkbox',

		'image',
		'video',
		'audio',
		'document',
		'embed',

		'table',
	])
	export type types = ModelType<typeof types>

	export const langs = Is.string().min(2).max(5)
	export type langs = ModelType<typeof langs>

	export const lang = Is.record(langs, Is.any())
	export type lang = ModelType<typeof lang>

	export const data = Is.record(Is.string(), Is.any())
	export type data = ModelType<typeof data>

	export const metadata = Is.record(Is.string(), Is.any())
	export type metadata = ModelType<typeof metadata>

	export const colors = Is.record(Is.string(), Is.any())
	export type colors = ModelType<typeof colors>

	export const preferences = Is.record(Is.string(), Is.any())
	export type preferences = ModelType<typeof preferences>

	export const userCode = Is.record(Is.string(), Is.any())
	export type userCode = ModelType<typeof userCode>

	// Is.object({
	// 	HEAD: Is.string().optional(),
	// 	CSS: Is.string().optional(),
	// 	JS: Is.string().optional(),
	// })

	export const layout = Is.record(Is.string(), Is.any())
	export type layout = ModelType<typeof layout>

	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the client
	 */
	export const block = Is.object({
		id: Is.string().uuid(),
		type: types,
		data: data,
		preferences: preferences.optional(),
		colors: colors.optional(),
		layout: layout.optional(),
		userCode: userCode.optional(),
		metadata: Is.record(Is.string(), Is.any()),
		blockIds: Is.array(Is.string().uuid()),
		workspaceId: Is.string().uuid().optional(),
		rootId: Is.string().uuid(),
		lang: lang.optional(),
		isRoot: Is.boolean().optional(),
	})
	export type block = ModelType<typeof block>

	//-----------------//
	// All meta models //
	//-----------------//

	export const graph: CustomType<graph> = Is.lazy(() => {
		return block.omit({ blockIds: true }).extend({
			blocks: Is.array(graph),
		}) as CustomType<graph>
	})
	export type graph = Omit<block, 'blockIds'> & { blocks: graph[] }

	export const page: CustomType<page> = Is.lazy(() => {
		return block.omit({ blockIds: true }).extend({
			blocks: Is.array(graph),
			projectTree: Is.any().optional(),
		}) as CustomType<graph>
	})
	export type page = Omit<block, 'blockIds'> & { blocks: graph[]; projectTree?: any }
}
