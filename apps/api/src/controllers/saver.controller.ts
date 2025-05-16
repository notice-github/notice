import { Handler } from 'typerestjs'
import { SaverSchema } from '../schemas/saver.schema'
import { SerializerService } from '../services/serializer.service'
import { BlockService } from '../services/block.service'

export namespace SaverController {
	export const slate: Handler<SaverSchema.slate> = async (req, reply) => {
		const block = SerializerService.slate(req.body)

		if (block == null) return reply.error(400, 'block_unserializable')

		await BlockService.saveGraph(block)

		return reply.success(200)
	}
}
