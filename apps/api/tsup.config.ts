import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['./src/**/*'],
	watch: true,
	onSuccess: 'doppler run -- node .',
	clean: true,
	splitting: false,
	sourcemap: true,
	silent: true,
})
