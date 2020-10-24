/* eslint-disable complexity, no-nested-ternary */

const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MIN_HEIGHT = 110;
const DEFAULT_POSITION = 120;

const NUMBER = 'number';
const BOOLEAN = 'boolean';
const STRING = 'string';

const isNumber = thing => typeof thing == NUMBER;
const isBoolean = thing => typeof thing == BOOLEAN;
const isString = thing => typeof thing == STRING;

const defaultOpts = {
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

export default function resolveOptions (rawOpts) {
	if (!rawOpts) return defaultOpts;

	const { id, classname, showHeader, showActions, showClose, showMinimize, showMaximize,
		toggleHeader, toggleActions, minWidth, minHeight, top, bottom, left, right,
	} = rawOpts;

	return {
		id: id && isString(id) ? id : null,
		classname: (isString(classname) || Array.isArray(classname))
			? classname
			: defaultOpts.classname,
		showHeader: isBoolean(showHeader) ? showHeader : defaultOpts.showHeader,
		showActions: isBoolean(showActions) ? showActions : defaultOpts.showActions,
		showClose: isBoolean(showClose) ? showClose : defaultOpts.showClose,
		showMinimize: isBoolean(showMinimize) ? showMinimize : defaultOpts.showMinimize,
		showMaximize: isBoolean(showMaximize) ? showMaximize : defaultOpts.showMaximize,
		toggleHeader: isBoolean(toggleHeader) ? toggleHeader : defaultOpts.toggleHeader,
		toggleActions: isBoolean(toggleActions) ? toggleActions : defaultOpts.toggleActions,
		minWidth: isNumber(minWidth) ? minWidth : defaultOpts.minWidth,
		minHeight: isNumber(minHeight) ? minHeight : defaultOpts.minHeight,
		top: isNumber(top)
			? top
			: isNumber(bottom)
				? null
				: defaultOpts.top,
		bottom: isNumber(bottom) ? bottom : defaultOpts.bottom,
		left: isNumber(left) && !isNumber(right) ? left : defaultOpts.left,
		right: isNumber(right) ? right : defaultOpts.right,
	};
}
