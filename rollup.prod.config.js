import { nodeResolve } from '@rollup/plugin-node-resolve';
// import { terser } from 'rollup-plugin-terser';

export default [{
	input: 'index.js',
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
	input: 'index.js',
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

/*
minify:
-------
	import {terser} from 'rollup-plugin-terser';

	...

	input: 'index.js',
	plugins: [terser()],
	output: {
		file: 'dist/widget.browser.min.js',
		format: 'iife',
		name: 'widget',
	},
*/
