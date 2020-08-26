const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';

function widget (title, body, opts = {}) {
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
	const widgetClassnames = resolveClassnames(opts.classname);

	this.elm = create('div', widgetClassnames);
	if (opts.id) this.elm.id = opts.id;

	this.header = create('header', ['widget-header']);
	this.title = create('div', ['widget-title'], title);
	this.bodyContainer = create('section', ['widget-body-container']);

	this.header.appendChild(this.title);

	this.closeBtn = opts.close
		? create('button', ['widget-btn', 'widget-close'], CLOSE_SYMBOL)
		: null;

	this.minimizeBtn = opts.minimize
		? create('button', ['widget-btn', 'widget-minimize'], MINIMIZE_SYMBOL)
		: null;

	const hasActions = Boolean(opts.close || opts.minimize);

	if (hasActions) {
		this.actions = create('div', ['widget-action-buttons']);

		this.minimizeBtn && this.actions.appendChild(this.minimizeBtn);
		this.closeBtn && this.actions.appendChild(this.closeBtn);

		this.header.appendChild(this.actions);
	}
	else {
		this.actions = null;
	}

	if (body) {
		body.classList.add('widget-body');
		this.body = body;
		this.bodyContainer.appendChild(body);
	}

	this.elm.appendChild(this.header);
	this.elm.appendChild(this.bodyContainer);
};

Widget.prototype.initMethods = function (opts) {
	this.show = this.show.bind(this);
	this.hide = this.hide.bind(this);

	if (opts.close || opts.minimize) {
		this.showActions = this.showActions.bind(this);
		this.hideActions = this.hideActions.bind(this);
		this.minimize = this.minimize.bind(this);
		this.restore = this.restore.bind(this);
		this.toggleMinimize = this.toggleMinimize.bind(this);
	}
};

Widget.prototype.mount = function () {
	if (this.isMounted) return;

	if (this.actions) {
		this.closeBtn && this.closeBtn.addEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);

		this.elm.addEventListener('mouseenter', this.showActions);
		this.elm.addEventListener('mouseleave', this.hideActions);

		this.hideActions();
	}

	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);
	this.isMounted = true;

	return this;
};

Widget.prototype.unmount = function () {
	if (!this.isMounted) return this;

	document.body.removeChild(this.elm);

	if (this.actions) {
		this.closeBtn && this.closeBtn.removeEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);
		this.elm.removeEventListener('mouseenter', this.showActions);
		this.elm.removeEventListener('mouseleave', this.hideActions);
		this.hideActions();
	}

	this.isMounted = false;

	return this;
};

Widget.prototype.show = function () {
	this.elm.style.display = 'block';
	return this;
};

Widget.prototype.hide = function () {
	this.elm.style.display = 'none';
	return this;
};

Widget.prototype.showActions = function (ev) {
	this.actions.style.display = 'flex';
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
