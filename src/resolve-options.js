const DEFAULT_MIN_WIDTH = 180;
const DEFAULT_MIN_HEIGHT = 110;

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
		};
	}

	return {
		id: rawOpts.id && typeof rawOpts.id == 'string' ? rawOpts.id : null,
		classname: typeof rawOpts.classname == 'string' || Array.isArray(rawOpts.classname) ? rawOpts.classname : null,
		showHeader: typeof rawOpts.showHeader == 'boolean' ? rawOpts.showHeader : true,
		showActions: typeof rawOpts.showActions == 'boolean' ? rawOpts.showActions : true,
		showClose: typeof rawOpts.showClose == 'boolean' ? rawOpts.showClose : true,
		showMinimize: typeof rawOpts.showMinimize == 'boolean' ? rawOpts.showMinimize : true,
		showMaximize: typeof rawOpts.showMaximize == 'boolean' ? rawOpts.showMaximize : true,
		toggleHeader: typeof rawOpts.toggleHeader == 'boolean' ? rawOpts.toggleHeader : false,
		toggleActions: typeof rawOpts.toggleActions == 'boolean' ? rawOpts.toggleActions : false,
		minWidth: typeof rawOpts.minWidth == 'number' ? rawOpts.minWidth : DEFAULT_MIN_WIDTH,
		minHeight: typeof rawOpts.minHeight == 'number' ? rawOpts.minHeight : DEFAULT_MIN_HEIGHT,
	};
}
