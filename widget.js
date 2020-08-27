const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';

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

			if (maybeTitle && typeof maybeTitle == 'string') {
				title = maybeTitle;
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
		};
	}

	return {
		id: rawOpts.id && typeof rawOpts.id == 'string' ? rawOpts.id : null,
		classname: typeof rawOpts.classname == 'string' || Array.isArray(rawOpts.classname) ? rawOpts.classname : null,
		showHeader: typeof rawOpts.showHeader == 'boolean' ? rawOpts.showHeader : true,
		showActions: typeof rawOpts.showActions == 'boolean' ? rawOpts.showActions : true,
		showClose: typeof rawOpts.showClose == 'boolean' ? rawOpts.showClose : true,
		showMinimize: typeof rawOpts.showMinimize == 'boolean' ? rawOpts.showMinimize : true,
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

	this.draggable = null;
	this.isMinimized = false;
	this.isMounted = false;
}

Widget.prototype.createDOM = function (title, body, opts) {
	this.header = null;
	this.body = null;
	this.title = null;
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;

	const widgetClassnames = resolveClassnames(opts.classname);

	this.elm = create('div', widgetClassnames);
	if (opts.id) this.elm.id = opts.id;

	this.bodyContainer = create('section', ['widget-body-container']);

	this.header = create('header', ['widget-header']);
	if (!opts.showHeader) {
		this.hideHeader();
	}

	this.title = create('div', ['widget-title'], title);

	if (opts.showActions) {
		this.actions = create('div', ['widget-action-buttons']);
		this.actions.style.display = '';

		if (opts.showMinimize) {
			this.minimizeBtn = create('button', ['widget-button', 'widget-minimize'], MINIMIZE_SYMBOL);
			this.actions.appendChild(this.minimizeBtn);
		}

		if (opts.showClose) {
			this.closeBtn = create('button', ['widget-button', 'widget-close'], CLOSE_SYMBOL);
			this.actions.appendChild(this.closeBtn);
		}

		this.header.appendChild(this.title);
		this.header.appendChild(this.actions);
	}

	this.elm.appendChild(this.header);

	if (body) {
		body.classList.add('widget-body');
		this.body = body;
		this.bodyContainer.appendChild(body);
	}

	this.elm.appendChild(this.bodyContainer);
};

Widget.prototype.initMethods = function (opts) {
	if (opts.showClose) {
		this.destroy = this.destroy.bind(this);
	}

	// this.hide = this.hide.bind(this);

	if (opts.showHeader && (opts.showClose || opts.showMinimize)) {
		this.showActions = this.showActions.bind(this);
		this.hideActions = this.hideActions.bind(this);

		if (opts.showMinimize) {
			this.restore = this.restore.bind(this);
			this.minimize = this.minimize.bind(this);
			this.toggleMinimize = this.toggleMinimize.bind(this);
		}
	}
};

Widget.prototype.mount = function () {
	if (this.isMounted) return;

	// if (this.actions) {
		this.closeBtn && this.closeBtn.addEventListener('click', this.destroy);
		this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);

		// this.elm.addEventListener('mouseenter', this.showActions);
		// this.elm.addEventListener('mouseleave', this.hideActions);

		// this.hideActions();
	// }

	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);
	this.isMounted = true;

	return this;
};

Widget.prototype.unmount = function () {
	if (!this.isMounted) return this;

	document.body.removeChild(this.elm);

	// if (this.actions) {
		this.closeBtn && this.closeBtn.removeEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);
		// this.elm.removeEventListener('mouseenter', this.showActions);
		// this.elm.removeEventListener('mouseleave', this.hideActions);
	// 	this.hideActions();
	// }

	this.isMounted = false;

	return this;
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
	this.header.style.display = '';
	return this;
};

Widget.prototype.hideHeader = function () {
	this.header.style.display = 'none';
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

Widget.prototype.restore = function () {
	this.minimizeBtn.innerHTML = MINIMIZE_SYMBOL;
	this.bodyContainer.style.display = 'block';
	this.elm.classList.remove('minimized');
	this.isMinimized = false;
	return this;
};

Widget.prototype.minimize = function () {
	this.minimizeBtn.innerHTML = MAXIMIZE_SYMBOL;
	this.bodyContainer.style.display = 'none';
	this.elm.classList.add('minimized');
	this.isMinimized = true;
	return this;
};

Widget.prototype.toggleMinimize = function () {
	if (this.isMinimized) this.restore();
	else this.minimize();
};

Widget.prototype.setTitle = function (titleText) {
	this.title.innerText = titleText;
	return this;
};

Widget.prototype.destroy = function () {
	if (!this.isMounted) return;

	this.unmount();
	this.draggable.destroy();
	this.draggable = null;

	this.elm = null;
	this.header = null;
	this.bodyContainer = null;
	this.body = null;
	this.title = null;
	this.closeBtn = null;
	this.minimizeBtn = null;
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
