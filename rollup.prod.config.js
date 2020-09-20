import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [{
	input: 'widget.js',
	plugins: [nodeResolve()],
	output: {
		file: 'dist/widget.esm-bundle.js',
		format: 'es',
		globals: {
			'draggable-elm': 'draggable',
			'resizable-elm': 'resizable'
		}
	},
},{
	input: 'widget.js',
	plugins: [nodeResolve()],
	output: {
		file: 'dist/widget.browser.js',
		format: 'iife',
		name: 'widget',
		globals: {
			'draggable-elm': 'draggable',
			'resizable-elm': 'resizable'
		}
	},
}];
