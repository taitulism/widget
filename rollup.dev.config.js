import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'index.js',
	plugins: [nodeResolve()],
	output: {
		file: 'dev-bundles/widget.js',
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
		file: 'dev-bundles/widget-spec.js',
		format: 'iife',
	},
}];
