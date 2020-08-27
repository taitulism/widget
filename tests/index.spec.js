/* global widget */

// const widget = require('../widget');

const createEvent = (type, props = {}) => {
	const event = new window.Event(type, {bubbles: true});
	Object.assign(event, props);
	return event;
};

function simulateMouseEnter (elm, x, y) {
	const event = createEvent('mouseenter', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseLeave (elm, x, y) {
	const event = createEvent('mouseleave', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseDown (elm, x, y) {
	const event = createEvent('mousedown', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});
	elm.dispatchEvent(event);
}

function simulateMouseMove (elm, x, y) {
	const event = createEvent('mousemove', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateMouseUp (elm, x, y) {
	const event = createEvent('mouseup', {
		clientX: x || 0,
		clientY: y || 0,
		offsetX: x || 0,
		offsetY: y || 0,
	});

	elm.dispatchEvent(event);
}

function simulateDragNDrop (elm, moveX, moveY) {
	simulateMouseDown(elm, 0, 0);
	simulateMouseMove(elm, moveX, moveY);
	simulateMouseUp(elm, moveX, moveY);
}

function $byClassname (cls) {
	return document.getElementsByClassName(cls);
}

const TITLE = 'My Widget';

describe('widget', () => {
	let testDOMContainer, container, target, box, body, wgt;

	before(() => {
		body = document.body;

		testDOMContainer = document.getElementById('test-dom-container');
		if (!testDOMContainer) {
			testDOMContainer = document.createElement('div');
			testDOMContainer.id = 'test-dom-container';
			document.body.appendChild(testDOMContainer);
		}
	});

	beforeEach(() => {
		container = document.createElement('div');
		container.id = 'container';

		target = document.createElement('div');
		target.id = 'target';
		target.innerHTML = `
			<ul>
				<li>AAA</li>
				<li>BBB</li>
				<li>CCC</li>
			</ul>
		`;

		container.appendChild(target);
		testDOMContainer.appendChild(container);

		box = target.getBoundingClientRect();

		Array.from(document.getElementsByClassName('widget')).forEach((wgt) => {
			wgt.parentNode.removeChild(wgt);
		});
	});

	afterEach(() => {
		target.innerHTML = '';
		target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		box = null;

		if (wgt && wgt.elm) {
			wgt.destroy();
		}

		// Array.from(document.getElementsByClassName('widget')).forEach((wgt) => {
		// 	wgt.parentNode.removeChild(wgt);
		// });
	});

	after(() => {
		body = null;
		testDOMContainer = null;
	});

	it('is a function', () => expect(widget).to.be.a('function'));

	it('returns a Widget instance', () => {
		wgt = widget();
		const ctor = Object.getPrototypeOf(wgt).constructor;
		expect(ctor.name).to.equal('Widget');
	});

	describe('Arguments', () => {
		describe('()', () => {
			it('creates a widget', () => {
				wgt = widget();
				expect(wgt.elm.classList.contains('widget')).to.be.true;
			});

			it('has no title', () => {
				wgt = widget();
				expect(wgt.title.innerHTML).to.equal('');
			});

			it('has no body', () => {
				wgt = widget();
				expect(wgt.bodyContainer.children).to.have.lengthOf(0);
				expect(wgt.body).to.be.null;
			});
		});

		describe('(title)', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE);
				expect(wgt.title.innerHTML).to.equal(TITLE);
			});

			it('has no body', () => {
				wgt = widget(TITLE);
				expect(wgt.bodyContainer.children).to.have.lengthOf(0);
				expect(wgt.body).to.be.null;
			});
		});

		describe('(body)', () => {
			it('sets the widget body', () => {
				wgt = widget(target);
				expect(wgt.body.innerHTML).to.include('AAA');
				expect(wgt.body.innerHTML).to.include('BBB');
				expect(wgt.body.innerHTML).to.include('CCC');
			});

			it('has no title', () => {
				wgt = widget(target);
				expect(wgt.title.innerHTML).to.equal('');
			});
		});

		describe('(title, body)', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE, target);
				expect(wgt.title.innerHTML).to.equal(TITLE);
			});

			it('sets the widget body', () => {
				wgt = widget(TITLE, target);
				expect(wgt.body.innerHTML).to.include('AAA');
				expect(wgt.body.innerHTML).to.include('BBB');
				expect(wgt.body.innerHTML).to.include('CCC');
			});
		});

		describe('(options)', () => {
			it('sets an `id` attribute on the widget element', () => {
				wgt = widget({id: 'the-widget'});
				expect(wgt.elm.id).to.equal('the-widget');
			});

			it('has no title', () => {
				wgt = widget({id: 'the-widget'});
				expect(wgt.title.innerHTML).to.equal('');
			});

			it('has no body', () => {
				wgt = widget({id: 'the-widget'});
				expect(wgt.bodyContainer.children).to.have.lengthOf(0);
				expect(wgt.body).to.be.null;
			});
		});

		describe('(title, options)', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE, {id: 'the-widget'});
				expect(wgt.title.innerHTML).to.equal(TITLE);
			});

			it('sets an `id` attribute on the widget element', () => {
				wgt = widget(TITLE, {id: 'the-widget'});
				expect(wgt.elm.id).to.equal('the-widget');
			});

			it('has no body', () => {
				wgt = widget(TITLE, {id: 'the-widget'});
				expect(wgt.bodyContainer.children).to.have.lengthOf(0);
				expect(wgt.body).to.be.null;
			});
		});

		describe('(body, options)', () => {
			it('sets the widget body', () => {
				wgt = widget(target, {id: 'the-widget'});
				expect(wgt.body.innerHTML).to.include('AAA');
				expect(wgt.body.innerHTML).to.include('BBB');
				expect(wgt.body.innerHTML).to.include('CCC');
			});

			it('sets an `id` attribute on the widget element', () => {
				wgt = widget(target, {id: 'the-widget'});
				expect(wgt.elm.id).to.equal('the-widget');
			});

			it('has no title', () => {
				wgt = widget(target, {id: 'the-widget'});
				expect(wgt.title.innerHTML).to.equal('');
			});
		});

		describe('(title, body, options)', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE, target, {id: 'the-widget'});
				expect(wgt.title.innerHTML).to.equal(TITLE);
			});

			it('sets the widget body', () => {
				wgt = widget(TITLE, target, {id: 'the-widget'});
				expect(wgt.body.innerHTML).to.include('AAA');
				expect(wgt.body.innerHTML).to.include('BBB');
				expect(wgt.body.innerHTML).to.include('CCC');
			});

			it('sets an `id` attribute on the widget element', () => {
				wgt = widget(TITLE, target, {id: 'the-widget'});
				expect(wgt.elm.id).to.equal('the-widget');
			});
		});
	});

	describe('Widget Element Structure', () => {
		describe('Wrapper', () => {
			it('is the main element', () => {
				wgt = widget();
				expect(wgt.elm).to.be.instanceOf(HTMLElement);
				expect(wgt.elm.parentNode).to.be.null;
			});

			it('is added to the DOM', () => {
				expect($byClassname('widget')).to.have.lengthOf(0);
				wgt = widget().mount();
				expect($byClassname('widget')[0]).to.deep.equal(wgt.elm);
			});

			describe('Header', () => {
				it('created', () => {
					wgt = widget();
					expect(wgt.header).to.be.instanceOf(HTMLElement);
					expect(wgt.header.parentNode).to.deep.equal(wgt.elm);
				});

				it('is added to the DOM', () => {
					expect($byClassname('widget-header')).to.have.lengthOf(0);
					wgt = widget().mount();
					expect($byClassname('widget-header')[0]).to.deep.equal(wgt.header);
				});

				describe('Title', () => {
					it('created', () => {
						wgt = widget();
						expect(wgt.title).to.be.instanceOf(HTMLElement);
						expect(wgt.title.parentNode).to.deep.equal(wgt.header);
					});

					it('is added to the DOM', () => {
						expect($byClassname('widget-title')).to.have.lengthOf(0);
						wgt = widget().mount();
						expect($byClassname('widget-title')[0]).to.deep.equal(wgt.title);
					});
				});

				describe('Action Buttons', () => {
					it('created', () => {
						wgt = widget();
						expect(wgt.actions).to.be.instanceOf(HTMLElement);
						expect(wgt.actions.parentNode).to.deep.equal(wgt.header);
					});

					it('is added to the DOM', () => {
						expect($byClassname('widget-action-buttons')).to.have.lengthOf(0);
						wgt = widget().mount();
						expect($byClassname('widget-action-buttons')[0]).to.deep.equal(wgt.actions);
					});

					it('has buttons', () => {
						wgt = widget();
						expect(wgt.actions.children).not.to.have.lengthOf(0);
						expect(wgt.actions.getElementsByClassName('widget-button')).not.to.have.lengthOf(0);
					});

					describe('Close Button', () => {
						it('created', () => {
							wgt = widget();
							expect(wgt.closeBtn).to.be.instanceOf(HTMLElement);
							expect(wgt.closeBtn.parentNode).to.deep.equal(wgt.actions);
							expect(wgt.closeBtn.classList.contains('widget-button')).to.be.true;
						});

						it('is added to the DOM', () => {
							expect($byClassname('widget-close')).to.have.lengthOf(0);
							wgt = widget().mount();
							expect($byClassname('widget-close')[0]).to.deep.equal(wgt.closeBtn);
						});
					});

					describe('Minimize Button', () => {
						it('created', () => {
							wgt = widget();
							expect(wgt.minimizeBtn).to.be.instanceOf(HTMLElement);
							expect(wgt.minimizeBtn.parentNode).to.deep.equal(wgt.actions);
							expect(wgt.minimizeBtn.classList.contains('widget-button')).to.be.true;
						});

						it('is added to the DOM', () => {
							expect($byClassname('widget-minimize')).to.have.lengthOf(0);
							wgt = widget().mount();
							expect($byClassname('widget-minimize')[0]).to.deep.equal(wgt.minimizeBtn);
						});
					});
				});
			});

			describe('Body Container', () => {
				it('created', () => {
					wgt = widget();
					expect(wgt.bodyContainer).to.be.instanceOf(HTMLElement);
					expect(wgt.bodyContainer.parentNode).to.deep.equal(wgt.elm);
				});

				it('is added to the DOM', () => {
					expect($byClassname('widget-body-container')).to.have.lengthOf(0);
					wgt = widget().mount();
					expect($byClassname('widget-body-container')[0]).to.deep.equal(wgt.bodyContainer);
				});

				it('is empty by default', () => {
					wgt = widget();
					expect(wgt.bodyContainer.children).to.have.lengthOf(0);
					expect(wgt.body).to.be.null;
				});

				it('holds the custom body element', () => {
					wgt = widget(target);
					expect(wgt.bodyContainer.children).to.have.lengthOf(1);
					expect(wgt.bodyContainer.children[0]).to.deep.equal(target);
				});

				describe('Custom Body', () => {
					it('created', () => {
						wgt = widget(target);
						expect(wgt.body).to.deep.equal(target);
						expect(target.parentNode).to.deep.equal(wgt.bodyContainer);
					});

					it('is added to the DOM', () => {
						expect($byClassname('widget-body')).to.have.lengthOf(0);
						wgt = widget(target).mount();
						expect($byClassname('widget-body')[0]).to.deep.equal(wgt.body);
					});
				});
			});
		});
	});

	describe('Actions', () => {
		describe('Click on `Close` Button', () => {
			it('destroys the widget', () => {
				wgt = widget();

				let called = false;
				const origDestroy = wgt.destroy;
				wgt.destroy = () => {
					called = true;
					origDestroy.call(wgt);
				};

				wgt.mount();
				expect(called).to.be.false;
				wgt.closeBtn.click();
				expect(called).to.be.true;
			});
		});

		describe('Click on `Minimize` Button', () => {
			it('toggles the widget body visibility', () => {
				wgt = widget().mount();

				expect(wgt.bodyContainer.style.display).to.not.equal('none');
				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				wgt.minimizeBtn.click();
				expect(wgt.bodyContainer.style.display).to.equal('none');
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
				wgt.minimizeBtn.click();
				expect(wgt.bodyContainer.style.display).to.not.equal('none');
				expect(wgt.elm.classList.contains('minimized')).to.be.false;
			});
		});
	});

	describe('Options', () => {
		describe('id', () => {
			it('sets an `id` attribute on the widget element', () => {
				wgt = widget({id: 'the-widget'});
				expect(wgt.elm.id).to.equal('the-widget');
			});
		});

		describe('classname', () => {
			it('sets a `classname` attribute on the widget element', () => {
				wgt = widget({classname: 'a-widget'});
				expect(wgt.elm.classList.contains('widget')).to.be.true;
				expect(wgt.elm.classList.contains('a-widget')).to.be.true;
			});

			it('sets multiple classnames string', () => {
				wgt = widget({classname: 'a-widget theme-bg with-border'});
				expect(wgt.elm.classList.contains('widget')).to.be.true;
				expect(wgt.elm.classList.contains('a-widget')).to.be.true;
				expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
				expect(wgt.elm.classList.contains('with-border')).to.be.true;
			});

			it('sets an array of classnames', () => {
				wgt = widget({classname: ['a-widget', 'theme-bg', 'with-border']});
				expect(wgt.elm.classList.contains('widget')).to.be.true;
				expect(wgt.elm.classList.contains('a-widget')).to.be.true;
				expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
				expect(wgt.elm.classList.contains('with-border')).to.be.true;
			});
		});

		describe('showClose', () => {
			it('creates the `close` button when `true` (default)', () => {
				wgt = widget({showClose: true}).mount();

				expect(wgt.closeBtn).not.to.be.null;
				expect($byClassname('widget-close')).to.have.lengthOf(1);
			});

			it('doesn\'t create the `close` button when `false`', () => {
				wgt = widget({showClose: false}).mount();

				expect(wgt.closeBtn).to.be.null;
				expect($byClassname('widget-close')).to.have.lengthOf(0);
			});
		});

		describe('showMinimize', () => {
			it('creates the `minimize` button when `true` (default)', () => {
				wgt = widget({showMinimize: true}).mount();

				expect(wgt.minimizeBtn).not.to.be.null;
				expect($byClassname('widget-minimize')).to.have.lengthOf(1);
			});

			it('doesn\'t create the `close` button when `false`', () => {
				wgt = widget({showMinimize: false}).mount();

				expect(wgt.minimizeBtn).to.be.null;
				expect($byClassname('widget-minimize')).to.have.lengthOf(0);
			});
		});

		describe('showHeader', () => {
			it('shows the header when `true` (default)', () => {
				wgt = widget({showHeader: true}).mount();
				expect(wgt.header.style.display).not.to.equal('none');
			});

			it('hides the header when `false`', () => {
				wgt = widget({showHeader: false}).mount();
				expect(wgt.header.style.display).to.equal('none');
			});
		});
	});

	describe('API Methods', () => {
		describe('.mount()', () => {
			it('appends a new widget element to the <body>', () => {
				wgt = widget();

				expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
				wgt.mount();
				expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
			});

			it('header and its children are shown by default', () => {
				wgt = widget();

				expect(wgt.header.style.display).not.to.equal('none');
				expect(wgt.title.style.display).not.to.equal('none');
				expect(wgt.actions.style.display).not.to.equal('none');
				wgt.mount();
				expect(wgt.header.style.display).not.to.equal('none');
				expect(wgt.title.style.display).not.to.equal('none');
				expect(wgt.actions.style.display).not.to.equal('none');
			});

			it('binds listener: hover on widget', () => {
				wgt = widget(TITLE, target, {close : true});

				expect(wgt.actions.style.display).to.equal('');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.equal('');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('');

				wgt.mount();

				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).not.to.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).not.to.equal('none');
			});

			it.skip('hover doesn\'t toggle actions visibility', () => {

			});

			it('binds listener: click on `close`', () => {
				wgt = widget(TITLE, target);

				expect(wgt.elm.style.display).to.not.equal('none');
				wgt.closeBtn.click();
				expect(wgt.elm.style.display).to.not.equal('none');

				wgt.mount();

				expect(wgt.elm.style.display).to.not.equal('none');
				wgt.closeBtn.click();
				expect(wgt.elm.style.display).to.equal('none');
			});

			it('binds listener: click on `minify`', () => {
				wgt = widget(TITLE, target, {minimize: true});

				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.false;

				wgt.mount();

				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
			});

			it('makes the widget element draggable', () => {
				wgt = widget();

				expect(document.getElementsByClassName('draggable')).to.have.lengthOf(0);
				wgt.mount();
				expect(document.getElementsByClassName('draggable')).to.have.lengthOf(1);
			});
		});

		describe('.unmount()', () => {
			it('doesn\'t fail when called before `.mount()`', () => {
				wgt = widget();
				const safeCall = () => wgt.unmount();
				expect(safeCall).not.to.throw();
			});

			it('removes the widget element from the <body>', () => {
				wgt = widget();

				expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
				wgt.mount();
				expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
				wgt.unmount();
				expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
			});

			it('unbinds listener: hover on widget', () => {
				wgt = widget(TITLE, target, {close : true}).mount();

				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).not.to.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).not.to.equal('none');

				wgt.unmount();

				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
			});

			it('unbinds listener: click on `close`', () => {
				wgt = widget(TITLE, target).mount();
				wgt.unmount();

				expect(wgt.elm.style.display).to.not.equal('none');
				wgt.closeBtn.click();
				expect(wgt.elm.style.display).to.not.equal('none');
			});

			it('unbinds listener: click on `minify`', () => {
				wgt = widget(TITLE, target, {minimize: true}).mount();

				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
				wgt.unmount();
				wgt.minimizeBtn.click();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
			});
		});

		describe('.show() / .hide()', () => {
			it('toggles the widget visibility', () => {
				wgt = widget().mount();

				expect(wgt.elm.style.display).to.not.equal('none');
				wgt.hide();
				expect(wgt.elm.style.display).to.equal('none');
				wgt.show();
				expect(wgt.hide()).to.eql(wgt);
				expect(wgt.show()).to.eql(wgt);
			});

			it('returns the widget instance', () => {
				wgt = widget().mount();
				expect(wgt.hide()).to.eql(wgt);
				expect(wgt.show()).to.eql(wgt);
			});
		});

		describe('.showActions() / .hideActions()', () => {
			it('toggles the action buttons visibility', () => {
				wgt = widget(TITLE, target).mount();

				expect(wgt.actions.style.display).not.to.equal('none');
				wgt.hideActions();
				expect(wgt.actions.style.display).to.equal('none');
				wgt.showActions();
				expect(wgt.actions.style.display).not.to.equal('none');
			});

			it('returns the widget instance', () => {
				wgt = widget(TITLE, target).mount();
				expect(wgt.showActions()).to.eql(wgt);
				expect(wgt.hideActions()).to.eql(wgt);
			});
		});

		describe('.showHeader() / .hideHeader()', () => {
			it('toggles the header buttons visibility', () => {
				wgt = widget(TITLE, target).mount();

				expect(wgt.header.style.display).not.to.equal('none');
				wgt.hideHeader();
				expect(wgt.header.style.display).to.equal('none');
				wgt.showHeader();
				expect(wgt.header.style.display).not.to.equal('none');
			});

			it('returns the widget instance', () => {
				wgt = widget(TITLE, target).mount();
				expect(wgt.showHeader()).to.eql(wgt);
				expect(wgt.hideHeader()).to.eql(wgt);
			});
		});

		describe('.minimize()', () => {
			it('minimizes the widget', () => {
				wgt = widget(TITLE, target, {minimize: true}).mount();

				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				expect(wgt.bodyContainer.style.display).to.not.equal('none');
				wgt.minimize();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
				expect(wgt.bodyContainer.style.display).to.equal('none');
			});

			it('toggles the `.isMinimized` property', () => {
				wgt = widget(TITLE, target, {minimize: true}).mount();

				expect(wgt.isMinimized).to.be.false;
				wgt.minimize();
				expect(wgt.isMinimized).to.be.true;
			});
		});

		describe('.restore()', () => {
			it('restores the widget size (unMinimize)', () => {
				wgt = widget(TITLE, target, {minimize: true}).mount();

				wgt.minimize();
				expect(wgt.elm.classList.contains('minimized')).to.be.true;
				expect(wgt.bodyContainer.style.display).to.equal('none');
				wgt.restore();
				expect(wgt.elm.classList.contains('minimized')).to.be.false;
				expect(wgt.bodyContainer.style.display).to.not.equal('none');
			});

			it('toggles the `.isMinimized` property', () => {
				wgt = widget(TITLE, target, {minimize: true}).mount();

				wgt.minimize();
				expect(wgt.isMinimized).to.be.true;
				wgt.restore();
				expect(wgt.isMinimized).to.be.false;
			});
		});

		describe('.setTitle()', () => {
			it('changes the widget title', () => {
				wgt = widget('My Widget', target);
				expect(wgt.title.innerText).to.equal('My Widget');
				wgt.setTitle('New Title');
				expect(wgt.title.innerText).to.equal('New Title');
			});

			it('doesn\'t fail with', () => {

			});
		});
	});

	describe('Behavior', () => {
		it('toggles actions visiblity on hover', () => {
			wgt = widget(TITLE, target).mount();

			// TODO: use document selector instead of wgt[elm]
			// console.log(document.getElementsByClassName('widget-action-buttons').length);

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).not.to.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
		});

		it('header and its children are shown by default', () => {
			wgt = widget();

			expect(wgt.header.style.display).not.to.equal('none');
			expect(wgt.title.style.display).not.to.equal('none');
			expect(wgt.actions.style.display).not.to.equal('none');
			wgt.mount();
			expect(wgt.header.style.display).not.to.equal('none');
			expect(wgt.title.style.display).not.to.equal('none');
			expect(wgt.actions.style.display).not.to.equal('none');
		});

		it.skip('hover doesn\'t toggle actions visibility', () => {

		});
	});

	describe('.destroy()', () => {
		it('calls .unmount()', () => {
			wgt = widget().mount();

			let called = false;
			const origUnmount = wgt.unmount;
			wgt.unmount = () => {
				called = true;
				origUnmount.call(wgt);
			};

			wgt.destroy();
			expect(called).to.be.true;
		});

		it('doesn\'t fail when called before `.mount()`', () => {
			wgt = widget();
			const safeCall = () => wgt.destroy();
			expect(safeCall).not.to.throw();
		});

		it('destroys Draggable', () => {
			wgt = widget().mount();

			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(1);
			wgt.destroy();
			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(0);
		});

		it('releases all element references', () => {
			wgt = widget('My Widget', target, {
				close: true,
				minimize: true,
			}).mount();

			wgt.destroy();
			expect(wgt.elm).to.be.null;
			expect(wgt.header).to.be.null;
			expect(wgt.bodyContainer).to.be.null;
			expect(wgt.closeBtn).to.be.null;
			expect(wgt.minimizeBtn).to.be.null;
			expect(wgt.title).to.be.null;
			expect(wgt.actions).to.be.null;
		});
	});
});
