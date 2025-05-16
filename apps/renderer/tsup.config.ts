import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['./src/**/*'],
	watch: true,
	onSuccess: 'doppler run -- node .',
	clean: true,
	sourcemap: true,
	silent: true,
	target: 'es2022',
	bundle: false,
})
