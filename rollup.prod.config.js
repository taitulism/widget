import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';

export default [{
	input: 'widget.js',
	plugins: [nodeResolve()],
	output: {
		file: 'dist/widget.esm.js',
		format: 'es',
		globals: {
			'draggable-elm': 'draggable',
			'resizable-elm': 'resizable'
		}
	},
}, {
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
// }, {
// 	input: 'widget.js',
// 	plugins: [nodeResolve(), terser()],
// 	output: {
// 		file: 'dist/widget.browser.min.js',
// 		format: 'iife',
// 		name: 'widget',
// 		globals: {
// 			'draggable-elm': 'draggable',
// 			'resizable-elm': 'resizable'
// 		}
// 	},
}];
