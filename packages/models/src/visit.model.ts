import { Is, ModelType } from 'typerestjs'

export namespace VisitModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		event_time: Is.string(),
		event_date: Is.string(),

		block_id: Is.string().uuid(),
		block_type: Is.string(), // NEW

		root_id: Is.string().uuid(), // NEW
		workspace_id: Is.string().uuid(), // NEW

		client_ip: Is.string(),
		client_country: Is.string().length(2).default('US'),

		user_agent: Is.string().nullable().optional(),
		is_robot: Is.boolean().default(true),
		ua_browser: Is.string().nullable().optional(),
		ua_browser_version: Is.string().nullable().optional(),
		ua_engine: Is.string().nullable().optional(),
		ua_engine_version: Is.string().nullable().optional(),
		ua_os: Is.string().nullable().optional(),
		ua_os_version: Is.string().nullable().optional(),
		ua_device: Is.string().nullable().optional(),
		ua_device_vendor: Is.string().nullable().optional(),
		ua_device_model: Is.string().nullable().optional(),

		url: Is.string().nullable().optional(),
		url_scheme: Is.string().nullable().optional(),
		url_host: Is.string().nullable().optional(),
		url_domain: Is.string().nullable().optional(),
		url_path: Is.string().nullable().optional(),
		url_search: Is.string().nullable().optional(),

		integration: Is.string().nullable().optional(),
	})
	export type full = ModelType<typeof full>

	export const granularity = Is.enum(['minutes', 'hours', 'days', 'weeks', 'months']).optional()
	export type granularity = ModelType<typeof granularity>

	//--------------//
	// Create Table //
	//--------------//

	export const table = async () => {
		return /* sql */ `
			CREATE TABLE visits (
				event_time DateTime CODEC(DoubleDelta, ZSTD(1)),
				event_date Date CODEC(DoubleDelta, ZSTD(1)),
				
				block_id UUID,
				block_type LowCardinality(String),
				
				root_id UUID,
				workspace_id UUID,
			
				client_ip String,
				client_country LowCardinality(FixedString(2)) DEFAULT 'US',
				
				user_agent Nullable(String),
				is_robot Bool DEFAULT true,
				ua_browser LowCardinality(Nullable(String)),
				ua_browser_version Nullable(String),
				ua_engine LowCardinality(Nullable(String)),
				ua_engine_version Nullable(String),
				ua_os LowCardinality(Nullable(String)),
				ua_os_version Nullable(String),
				ua_device LowCardinality(Nullable(String)),
				ua_device_vendor LowCardinality(Nullable(String)),
				ua_device_model LowCardinality(Nullable(String)),
				
				url Nullable(String),
				url_scheme LowCardinality(Nullable(String)),
				url_host Nullable(String),
				url_domain Nullable(String),
				url_path Nullable(String),
				url_search Nullable(String),
			
				integration LowCardinality(Nullable(String))
			)
			ENGINE = MergeTree()
			PARTITION BY toYYYYMM(event_date)
			ORDER BY (
				workspace_id,
				root_id,
				block_id,
				client_ip,
				event_time,
			)
		`
	}
}
