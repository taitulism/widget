const MINIMIZE_SYMBOL = '&#128469;';
const MAXIMIZE_SYMBOL = '&#128470;';
const CLOSE_SYMBOL = '&#10006;';

function widget (opts = {}) {
	return new Widget(opts);
}

function Widget (opts) {
	this.show = this.show.bind(this);
	this.hide = this.hide.bind(this);
	this.showActions = this.showActions.bind(this);
	this.hideActions = this.hideActions.bind(this);
	this.restore = this.restore.bind(this);
	this.minimize = this.minimize.bind(this);
	this.toggleMinimize = this.toggleMinimize.bind(this);

	const elm = document.createElement('div');
	elm.classList.add('widget');
	this.elm = elm;
	this.header = null;
	this.title = null;
	this.actions = null;
	this.closeBtn = null;
	this.minimizeBtn = null;

	this.draggable = null;

	this.isMinimized = false;

	if (opts.title) this.createTitle(opts.title);
	if (opts.close) this.createClose();
	if (opts.minimize) this.createToggleMinimize();

	if (opts.close || opts.minimize) {
		this.createActionsContainer();
		this.minimizeBtn && this.actions.appendChild(this.minimizeBtn);
		this.closeBtn && this.actions.appendChild(this.closeBtn);
	}

	if (opts.title || opts.close || opts.minimize) {
		this.createHeader();
		this.title && this.header.appendChild(this.title);
		(this.closeBtn || this.minimizeBtn) && this.header.appendChild(this.actions);
		elm.appendChild(this.header);
	}

	this.createBody();
	elm.appendChild(this.body);
}

Widget.prototype.createHeader = function () {
	const header = document.createElement('header');
	header.classList.add('widget-header');
	this.header = header;
};

Widget.prototype.createActionsContainer = function () {
	const actions = document.createElement('div');
	actions.classList.add('widget-header-buttons');
	this.actions = actions;
};

Widget.prototype.createClose = function () {
	const btn = document.createElement('button');
	btn.classList.add('widget-btn', 'widget-close');
	btn.innerHTML = CLOSE_SYMBOL;
	this.closeBtn = btn;
};

Widget.prototype.createToggleMinimize = function () {
	const btn = document.createElement('button');
	btn.classList.add('widget-btn', 'widget-minimize');
	btn.innerHTML = MINIMIZE_SYMBOL;
	this.minimizeBtn = btn;
};

Widget.prototype.createTitle = function (titleText) {
	const title = document.createElement('div');
	title.classList.add('widget-title');
	this.title = title;
	this.setTitle(titleText);
};

Widget.prototype.createBody = function () {
	const body = document.createElement('section');
	body.classList.add('widget-body-container');
	this.body = body;
	return this
};

Widget.prototype.mount = function () {
	if (this.actions) {
		this.closeBtn && this.closeBtn.addEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.addEventListener('click', this.toggleMinimize);

		this.elm.addEventListener('mouseenter', this.showActions);
		this.elm.addEventListener('mouseleave', this.hideActions);

		this.hideActions();
	}

	document.body.appendChild(this.elm);
	this.draggable = draggable(this.elm);

	return this;
};

Widget.prototype.unmount = function () {
	document.body.removeChild(this.elm);

	if (this.actions) {
		this.closeBtn && this.closeBtn.removeEventListener('click', this.hide);
		this.minimizeBtn && this.minimizeBtn.removeEventListener('click', this.toggleMinimize);
		this.elm.removeEventListener('mouseenter', this.showActions);
		this.elm.removeEventListener('mouseleave', this.hideActions);
		this.hideActions();
	}

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
	this.body.style.display = 'block';
	this.elm.classList.remove('minimized');
	return this;
};

Widget.prototype.minimize = function () {
	this.minimizeBtn.innerHTML = MAXIMIZE_SYMBOL;
	this.body.style.display = 'none';
	this.elm.classList.add('minimized');
	return this;
};

Widget.prototype.toggleMinimize = function () {
	this.isMinimized = !this.isMinimized;

	if (this.isMinimized) this.minimize();
	else this.restore();
};

Widget.prototype.setTitle = function (titleText) {
	this.title.innerText = titleText;
	return this;
};

Widget.prototype.destroy = function () {
	this.unmount();
	this.draggable.destroy();
};
