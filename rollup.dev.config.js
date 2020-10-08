import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'index.js',
	plugins: [nodeResolve()],
	output: {
		file: 'widget-dev-bundle.js',
		format: 'iife',
		name: 'widget',
		globals: {
			'draggable-elm': 'draggable',
			'resizable-elm': 'resizable'
		}
	},
}, {
	input: 'tests/index.spec.js',
	output: {
		file: 'widget-spec-bundle.js',
		format: 'iife',
		name: 'resizable',
	},
}];
