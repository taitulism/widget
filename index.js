import Widget from './src/widget';
import resolveArgs from './src/resolve-arguments';
import resolveOptions from './src/resolve-options';

export default function widget (...args) {
	const [title, body, rawOpts] = resolveArgs(...args);
	const opts = resolveOptions(rawOpts);
	return new Widget(title, body, opts);
}
