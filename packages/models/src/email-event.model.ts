import { Is, ModelType } from 'typerestjs'

export namespace EmailEventModel {
	//------------//
	// All models //
	//------------//

	/**
	 * The full model that is use by the table
	 */
	export const full = Is.object({
		event_type: Is.string(),

		event_time: Is.string(),
		event_date: Is.string(),

		message_id: Is.string(),
		message_from: Is.string(),
		message_to: Is.string(),

		source_ip: Is.string().nullable().optional(),
		outgoing_ip: Is.string().nullable().optional(),

		metadata: Is.record(Is.string(), Is.string()),
	})
	export type full = ModelType<typeof full>

	//--------------//
	// Create Table //
	//--------------//

	export const table = async () => {
		return /* sql */ `
			CREATE TABLE email_events (
				event_type LowCardinality(String),

				event_time DateTime CODEC(DoubleDelta, ZSTD(1)),
				event_date Date CODEC(DoubleDelta, ZSTD(1)),

				message_id String,
				message_from LowCardinality(String),
				message_to String,

				source_ip LowCardinality(Nullable(String)),
				outgoing_ip Nullable(String),

				metadata Map(LowCardinality(String), String),

				INDEX IDX_metadataKey mapKeys(metadata) TYPE bloom_filter GRANULARITY 1,
				INDEX IDX_metadataValue mapValues(metadata) TYPE bloom_filter GRANULARITY 1,
			)
			ENGINE = MergeTree()
			PARTITION BY toYYYYMM(event_date)
			ORDER BY (
				event_type,
				message_id,
				event_time,
			)
		`
	}
}
