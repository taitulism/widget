import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'widget.js',
	plugins: [nodeResolve()],
	output: {
		file: 'widget-dev-bundle.js',
		format: 'iife',
		name: 'widget',
		sourcemap: 'inline',
		globals: {
			'draggable-elm': 'draggable',
			'resizable-elm': 'resizable'
		}
	},
}];
