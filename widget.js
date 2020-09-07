const MINIMIZE_SYMBOL = '&#128469;';
const RESTORE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';
const MAXIMIZE_SYMBOL = '&#9974;';

const DEFAULT_MIN_WIDTH = 250;
const DEFAULT_MIN_HEIGHT = 150;

function resolveArgs (maybeTitle, maybeBody, maybeOpts) {
	let title = null;
	let body = null;
	let opts = null;

	if (!maybeTitle && !maybeBody && !maybeOpts) {
		return [title, body, opts];
	}

	if (maybeOpts && typeof maybeOpts == 'object') {
		opts = maybeOpts;

		if (maybeBody instanceof HTMLElement) {
			body = maybeBody;
		}

		if (maybeTitle && typeof maybeTitle == 'string') {
			title = maybeTitle;
		}
	}
	else if (maybeBody) {
		if (maybeBody instanceof HTMLElement) {
			body = maybeBody;

			if (maybeTitle) {
				if (typeof maybeTitle == 'string') {
					title = maybeTitle;
				}
				else if (maybeTitle instanceof HTMLElement) {
					title = maybeTitle;
				}
			}
		}
		else if (typeof maybeBody == 'object') {
			opts = maybeBody;

			if (typeof maybeTitle == 'string') {
				title = maybeTitle;
			}
			else if (maybeTitle instanceof HTMLElement) {
				body = maybeTitle;
			}
		}
	}
	else if (maybeTitle) {
		if (typeof maybeTitle == 'string') {
			title = maybeTitle;
		}
		else if (maybeTitle instanceof HTMLElement) {
			body = maybeTitle;
		}
		else if (maybeTitle && typeof maybeTitle == 'object') {
			opts = maybeTitle;
		}
	}

	return [title, body, opts];
}

function resolveOptions (rawOpts) {
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

function widget (...args) {
	const [title, body, rawOpts] = resolveArgs(...args);
	const opts = resolveOptions(rawOpts);
	return new Widget(title, body, opts);
}

function Widget (title, body, opts) {
	this.initMethods(opts);
	this.createDOM(title, body, opts);

	this.toggleHeader = opts.toggleHeader;
	this.toggleActions = opts.toggleActions;
	this.minWidth = opts.minWidth;
	this.minHeight = opts.minHeight;
	this.draggable = null;
	this.resizable = null;
	this.isMinimized = false;
	this.isMaximized = false;
	this.isMounted = false;
}


Widget.prototype.createWrapperElm = function (opts) {
	const widgetClassnames = resolveClassnames(opts.classname);
	const elm = create('div', widgetClassnames);
	if (opts.id) elm.id = opts.id;

	return elm;
};

Widget.prototype.createDefaultHeader = function (titleText, opts) {
	const header = create('header', ['widget-header']);
	this.title = create('div', ['widget-title'], titleText);
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;

	header.appendChild(this.title);

	if (opts.showActions) {
		this.actions = create('div', ['widget-action-buttons']);

		if (opts.toggleActions) {
			this.hideActions();
		}

		if (opts.showMinimize) {
			this.minimizeBtn = create('button', ['widget-button', 'widget-minimize-button'], MINIMIZE_SYMBOL);
			this.minimizeBtn.setAttribute('title', 'Minimize');
			this.actions.appendChild(this.minimizeBtn);
		}

		if (opts.showMaximize) {
			this.maximizeBtn = create('button', ['widget-button', 'widget-maximize-button'], MAXIMIZE_SYMBOL);
			this.maximizeBtn.setAttribute('title', 'Maximize');
			this.actions.appendChild(this.maximizeBtn);
		}

		if (opts.showClose) {
			this.closeBtn = create('button', ['widget-button', 'widget-close-button'], CLOSE_SYMBOL);
			this.closeBtn.setAttribute('title', 'Close');
			this.actions.appendChild(this.closeBtn);
		}

		header.appendChild(this.actions);
	}
	this.header = header;

	if (opts.toggleHeader || opts.showHeader == false) {
		this.hideHeader();
	}

	return header;
};

Widget.prototype.createDOM = function (title, body, opts) {
	this.title = null;
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;
	this.elm = this.createWrapperElm(opts);
	this.bodyContainer = create('section', ['widget-body-container']);

	if (!title || typeof title == 'string') {
		this.header = this.createDefaultHeader(title, opts);
	}
	else if (title instanceof HTMLElement) {
		this.header = title;
		this.header.classList.add('widget-header');
		this.title = null;
	}

	this.elm.appendChild(this.header);

	if (body) {
		body.classList.add('widget-body');
		this.body = body;
		this.bodyContainer.appendChild(body);
	}
	else this.body = null;

	this.elm.appendChild(this.bodyContainer);
};

Widget.prototype.initMethods = function (opts) {
	if (opts.toggleHeader || opts.toggleActions) {
		this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
		this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
	}

	if (opts.showMinimize) {
		this.toggleMinimize = this.toggleMinimize.bind(this);
	}

	if (opts.showMaximize) {
		this.toggleMaximize = this.toggleMaximize.bind(this);
	}

	if (opts.showClose) {
		this.destroy = this.destroy.bind(this);
	}
};

Widget.prototype.mount = function () {
	if (this.isMounted) return;

	this.closeBtn && this.closeBtn.addEventListener('click', this.destroy);
	this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);
	this.maximizeBtn && this.maximizeBtn.addEventListener('click', this.toggleMaximize);

	if (this.toggleHeader || this.toggleActions) {
		this.elm.addEventListener('mouseenter', this.mouseEnterHandler);
		this.elm.addEventListener('mouseleave', this.mouseLeaveHandler);
	}

	document.body.appendChild(this.elm);

	this.draggable = draggable(this.elm, {
		grip: this.title
	});

	this.resizable = resizable(this.elm, {
		minWidth: this.minWidth,
		minHeight: this.minHeight,
	});

	this.isMounted = true;

	return this;
};

Widget.prototype.unmount = function () {
	if (!this.isMounted) return this;

	document.body.removeChild(this.elm);

	this.closeBtn && this.closeBtn.removeEventListener('click', this.destroy);
	this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);

	if (this.toggleHeader || this.toggleActions) {
		this.elm.removeEventListener('mouseenter', this.mouseEnterHandler);
		this.elm.removeEventListener('mouseleave', this.mouseLeaveHandler);
	}

	this.isMounted = false;

	return this;
};

Widget.prototype.mouseEnterHandler = function (ev) {
	if (this.toggleHeader) {
		this.showHeader();
	}

	if (this.toggleActions) {
		this.showActions();
	}
};

Widget.prototype.mouseLeaveHandler = function () {
	if (this.toggleHeader && !this.isMinimized && !this.isMaximized) {
		this.hideHeader();
	}

	if (this.toggleActions) {
		this.hideActions();
	}
};

Widget.prototype.show = function () {
	this.elm.style.display = '';
	return this;
};

Widget.prototype.hide = function () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.showHeader = function () {
	this.header.style.visibility = '';
	this.bodyContainer.classList.remove('no-header');
	this.draggable.setGrip(this.title);
	return this;
};

Widget.prototype.hideHeader = function () {
	this.header.style.visibility = 'hidden';
	this.bodyContainer.classList.add('no-header');
	this.draggable && this.draggable.setGrip(this.bodyContainer);
	return this;
};

Widget.prototype.showActions = function (ev) {
	this.actions.style.display = '';
	return this;
};

Widget.prototype.hideActions = function (ev) {
	this.actions.style.display = 'none';
	return this;
};

Widget.prototype.minimize = function () {
	this.minimizeBtn.innerHTML = RESTORE_SYMBOL;
	this.elm.classList.add('minimized');
	this.minimizeBtn.classList.add('widget-button-active');

	if (this.toggleHeader || this.toggleActions) {
		this.showHeader();
	}

	this.isMinimized = true;
	return this;
};

Widget.prototype.unMinimize = function () {
	this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
	this.elm.classList.remove('minimized');
	this.minimizeBtn.classList.remove('widget-button-active');
	this.isMinimized = false;
	return this;
};

Widget.prototype.maximize = function () {
	this.box = this.elm.getBoundingClientRect();
	const elmStyle = this.elm.style;

	elmStyle.width = '100%';
	elmStyle.height = '100%';
	elmStyle.top = '0px';
	elmStyle.left = '0px';

	this.maximizeBtn.innerHTML = RESTORE_SYMBOL;
	this.elm.classList.add('maximized');
	this.maximizeBtn.classList.add('widget-button-active');

	if (this.toggleHeader || this.toggleActions) {
		this.showHeader();
	}

	this.draggable.disable();
	this.resizable.disable();

	this.isMaximized = true;
	return this;
};

Widget.prototype.unMaximize = function () {
	const elmStyle = this.elm.style;

	elmStyle.width = this.box.width + 'px';
	elmStyle.height = this.box.height + 'px';
	elmStyle.top = this.box.top + 'px';
	elmStyle.left = this.box.left + 'px';

	this.box = null;

	this.maximizeBtn.innerHTML = MAXIMIZE_SYMBOL;
	this.elm.classList.remove('maximized');
	this.maximizeBtn.classList.remove('widget-button-active');
	this.isMaximized = false;
	this.draggable.enable();
	this.resizable.enable();
	return this;
};

Widget.prototype.toggleMinimize = function () {
	if (this.isMinimized) this.unMinimize();
	else this.minimize();
};

Widget.prototype.toggleMaximize = function () {
	if (this.isMaximized) this.unMaximize();
	else this.maximize();
};

Widget.prototype.restoreSize = function () {
	this.unMinimize();
	this.unMaximize();
	return this;
};

Widget.prototype.setTitle = function (newTitle) {
	this.title.innerText = newTitle;
	return this;
};

Widget.prototype.setBody = function (newBody) {
	this.body.innerHTML = '';
	this.body.appendChild(newBody);
	return this;
};

Widget.prototype.setView = function (newTitle, newBody) {
	return this.setTitle(newTitle).setBody(newBody);
};

Widget.prototype.destroy = function () {
	if (!this.isMounted) return;

	this.unmount();
	this.draggable.destroy();
	this.draggable = null;
	this.resizable.destroy();
	this.resizable = null;

	this.elm = null;
	this.header = null;
	this.bodyContainer = null;
	this.body = null;
	this.title = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
	this.maximizeBtn = null;
	this.actions = null;
};


function create (node, classnames, content) {
	const elm = document.createElement(node);
	elm.classList.add(...classnames);

	if (content) {
		elm.innerHTML = content;
	}

	return elm;
}

function resolveClassnames (optsClassnames) {
	if (!optsClassnames) return ['widget'];

	if (typeof optsClassnames == 'string') {
		optsClassnames = optsClassnames.split(/\s+/);
	}

	if (Array.isArray(optsClassnames)) {
		optsClassnames.push('widget');
		return optsClassnames;
	}

	return ['widget'];
}
