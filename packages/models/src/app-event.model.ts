import { Is, ModelType } from 'typerestjs'

export namespace AppEventModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is used by the table
	 */
	export const full = Is.object({
		//----------------//
		// Event identity //
		//----------------//

		event_type: Is.string(),
		event_time: Is.string(),
		event_date: Is.string(),

		//------------------//
		// Request identity //
		//------------------//

		user_id: Is.string().uuid().optional(),
		user_email: Is.string().optional(),
		user_ip: Is.string().optional(),
		user_country: Is.string().length(2).optional(),

		workspace_id: Is.string().uuid().optional(),

		block_id: Is.string().uuid().optional(),
		block_type: Is.string().optional(),
		block_is_root: Is.boolean().optional(),

		//------------------//
		// Browser metadata //
		//------------------//

		user_agent: Is.string().nullable().optional(),
		browser: Is.string().nullable().optional(),
		browser_version: Is.string().nullable().optional(),
		engine: Is.string().nullable().optional(),
		engine_version: Is.string().nullable().optional(),
		os: Is.string().nullable().optional(),
		os_version: Is.string().nullable().optional(),
		device: Is.string().nullable().optional(),
		device_vendor: Is.string().nullable().optional(),
		device_model: Is.string().nullable().optional(),

		url: Is.string().nullable().optional(),
		url_scheme: Is.string().nullable().optional(),
		url_host: Is.string().nullable().optional(),
		url_domain: Is.string().nullable().optional(),
		url_path: Is.string().nullable().optional(),
		url_search: Is.string().nullable().optional(),

		//-----------------//
		// Custom metadata //
		//-----------------//

		metadata: Is.record(Is.string(), Is.string()),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = async () => {
		return /* sql */ `
			CREATE TABLE app_events (
				event_type LowCardinality(String),
				event_time DateTime CODEC(DoubleDelta, ZSTD(1)),
				event_date Date CODEC(DoubleDelta, ZSTD(1)),

				user_id Nullable(UUID),
				user_email Nullable(String),
				user_ip Nullable(String),
				user_country LowCardinality(Nullable(FixedString(2))),

				workspace_id Nullable(UUID),

				block_id Nullable(UUID),
				block_type LowCardinality(Nullable(String)),
				block_is_root Nullable(Bool),

				user_agent Nullable(String),
				browser LowCardinality(Nullable(String)),
				browser_version Nullable(String),
				engine LowCardinality(Nullable(String)),
				engine_version Nullable(String),
				os LowCardinality(Nullable(String)),
				os_version Nullable(String),
				device LowCardinality(Nullable(String)),
				device_vendor LowCardinality(Nullable(String)),
				device_model LowCardinality(Nullable(String)),

				url Nullable(String),
				url_scheme LowCardinality(Nullable(String)),
				url_host Nullable(String),
				url_domain Nullable(String),
				url_path Nullable(String),
				url_search Nullable(String),

				metadata Map(LowCardinality(String), String),

				INDEX IDX_user_id user_id TYPE set(0) GRANULARITY 1,
				INDEX IDX_workspace_id workspace_id TYPE set(0) GRANULARITY 1,
			)
			ENGINE = MergeTree()
			PARTITION BY toYYYYMM(event_date)
			ORDER BY (
				event_type,
				event_date,
				event_time
			)
		`
	}
}
