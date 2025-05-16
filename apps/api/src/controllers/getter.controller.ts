import { MongoDB } from '@notice-app/mongodb'
import { Handler } from 'typerestjs'
import { GetterSchema } from '../schemas/getter.schema'
import { BlockService } from '../services/block.service'
import { DeserializerService } from '../services/deserializer.service'

export namespace GetterController {
	export const slate: Handler<GetterSchema.slate> = async (req, reply) => {
		const bmsGraph = await BlockService.getGraph(req.block._id, MongoDB.blocks, undefined, undefined, req.query.lang)

		if (bmsGraph == null) return reply.error(404, 'block_not_found')

		const graph = BlockService.exportGraph(bmsGraph)

		const deserializedData = DeserializerService.slate(graph)

		return reply.success(200, deserializedData)
	}
}
