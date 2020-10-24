/* eslint-disable complexity, max-len, no-nested-ternary */

const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MIN_HEIGHT = 110;
const DEFAULT_POSITION = 120;

const NUMBER = 'number';
const BOOLEAN = 'boolean';
const STRING = 'string';

const isNumber = thing => typeof thing == NUMBER;
const isBoolean = thing => typeof thing == BOOLEAN;
const isString = thing => typeof thing == STRING;

export default function resolveOptions (rawOpts) {
	if (!rawOpts) {
		return {
			id: null,
			classname: null,
			showHeader: true,
			showActions: true,
			showClose: true,
			showMinimize: true,
			showMaximize: true,
			toggleHeader: false,
			toggleActions: false,
			minWidth: DEFAULT_MIN_WIDTH,
			minHeight: DEFAULT_MIN_HEIGHT,
			top: DEFAULT_POSITION,
			bottom: null,
			left: null,
			right: DEFAULT_POSITION,
		};
	}

	return {
		id: rawOpts.id && isString(rawOpts.id) ? rawOpts.id : null,
		classname: isString(rawOpts.classname) || Array.isArray(rawOpts.classname) ? rawOpts.classname : null,
		showHeader: isBoolean(rawOpts.showHeader) ? rawOpts.showHeader : true,
		showActions: isBoolean(rawOpts.showActions) ? rawOpts.showActions : true,
		showClose: isBoolean(rawOpts.showClose) ? rawOpts.showClose : true,
		showMinimize: isBoolean(rawOpts.showMinimize) ? rawOpts.showMinimize : true,
		showMaximize: isBoolean(rawOpts.showMaximize) ? rawOpts.showMaximize : true,
		toggleHeader: isBoolean(rawOpts.toggleHeader) ? rawOpts.toggleHeader : false,
		toggleActions: isBoolean(rawOpts.toggleActions) ? rawOpts.toggleActions : false,
		minWidth: isNumber(rawOpts.minWidth) ? rawOpts.minWidth : DEFAULT_MIN_WIDTH,
		minHeight: isNumber(rawOpts.minHeight) ? rawOpts.minHeight : DEFAULT_MIN_HEIGHT,
		top: isNumber(rawOpts.top)
			? rawOpts.top
			: isNumber(rawOpts.bottom)
				? null
				: DEFAULT_POSITION,
		bottom: isNumber(rawOpts.bottom) ? rawOpts.bottom : null,
		left: isNumber(rawOpts.left) && !isNumber(rawOpts.right) ? rawOpts.left : null,
		right: isNumber(rawOpts.right) ? rawOpts.right : DEFAULT_POSITION,
	};
}
