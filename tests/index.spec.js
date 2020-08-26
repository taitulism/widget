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

	it('returns a `Widget` instance', () => {
		const widgetInstance = widget(target);
		const ctor = Object.getPrototypeOf(widgetInstance).constructor;

		expect(ctor.name).to.equal('Widget');
	});

	describe('Arguments', () => {
		describe('With No Arguments', () => {
			it('creates a widget', () => {
				wgt = widget();

				expect(wgt.elm).to.be.instanceOf(HTMLElement);
				expect(wgt.elm.classList.contains('widget')).to.be.true;

				expect($byClassname('widget')).to.have.lengthOf(0);
				wgt.mount();
				expect($byClassname('widget')).to.have.lengthOf(1);
				expect($byClassname('widget')[0]).to.deep.equal(wgt.elm);
			});

			it('creates a header', () => {
				wgt = widget();

				expect(wgt.header).to.be.instanceOf(HTMLElement);
				expect(wgt.header.classList.contains('widget-header')).to.be.true;

				expect($byClassname('widget-header')).to.have.lengthOf(0);
				wgt.mount();
				expect($byClassname('widget-header')).to.have.lengthOf(1);

				expect($byClassname('widget-header')[0]).to.deep.equal(wgt.header);
				expect(wgt.header.parentNode).to.deep.equal(wgt.elm);
			});

			it('creates a title', () => {
				wgt = widget();

				expect(wgt.title).to.be.instanceOf(HTMLElement);
				expect(wgt.title.classList.contains('widget-title')).to.be.true;

				expect($byClassname('widget-title')).to.have.lengthOf(0);
				wgt.mount();
				expect($byClassname('widget-title')).to.have.lengthOf(1);

				expect($byClassname('widget-title')[0]).to.deep.equal(wgt.title);
				expect(wgt.title.parentNode).to.deep.equal(wgt.header);
			});

			it('creates action buttons', () => {
				wgt = widget();

				expect(wgt.actions).to.be.instanceOf(HTMLElement);
				expect(wgt.closeBtn).to.be.instanceOf(HTMLElement);
				expect(wgt.minimizeBtn).to.be.instanceOf(HTMLElement);

				expect(wgt.actions.classList.contains('widget-action-buttons')).to.be.true;
				expect(wgt.closeBtn.classList.contains('widget-close')).to.be.true;
				expect(wgt.minimizeBtn.classList.contains('widget-minimize')).to.be.true;

				expect($byClassname('widget-action-buttons')).to.have.lengthOf(0);
				expect($byClassname('widget-button')).to.have.lengthOf(0);
				wgt.mount();
				expect($byClassname('widget-action-buttons')).to.have.lengthOf(1);
				expect($byClassname('widget-button')).to.have.lengthOf(2);

				expect($byClassname('widget-action-buttons')[0]).to.deep.equal(wgt.actions);
				expect($byClassname('widget-button')[0]).to.deep.equal(wgt.minimizeBtn);
				expect($byClassname('widget-button')[1]).to.deep.equal(wgt.closeBtn);

				expect(wgt.actions.parentNode).to.deep.equal(wgt.header);
				expect(wgt.minimizeBtn.parentNode).to.deep.equal(wgt.actions);
				expect(wgt.closeBtn.parentNode).to.deep.equal(wgt.actions);
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

			it('creates a widget with no body', () => {
				wgt = widget();

				expect(wgt.body).to.be.null;
				wgt.mount();
				expect(wgt.body).to.be.null;
			});
		});

		describe('With a `title` Argument', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE).mount();

				expect($byClassname('widget-title')[0].innerHTML).to.equal(TITLE);
			});
		});

		describe('With a `body` Argument', () => {
			it('sets the widget body', () => {
				wgt = widget(target).mount();

				expect($byClassname('widget-body')[0].innerHTML).to.include('BBB');
			});
		});

		describe('With `title` & `body`', () => {
			it('sets the widget title text', () => {
				wgt = widget(TITLE, target).mount();
				expect($byClassname('widget-title')[0].innerHTML).to.equal(TITLE);
			});

			it('sets the widget body', () => {
				wgt = widget(TITLE, target).mount();
				const wgtBodyHtml = $byClassname('widget-body')[0].innerHTML;
				expect(wgtBodyHtml).to.include('AAA');
				expect(wgtBodyHtml).to.include('BBB');
				expect(wgtBodyHtml).to.include('CCC');
			});
		});

		describe('With an `options` Argument', () => {
			describe('id', () => {
				it('sets an `id` attribute on the widget element', () => {
					wgt = widget(TITLE, target, {id: 'the-widget'});
					expect(wgt.elm.id).to.equal('the-widget');
				});
			});

			describe('classname', () => {
				it('sets a `classname` attribute on the widget element', () => {
					wgt = widget(TITLE, target, {classname: 'a-widget'});
					expect(wgt.elm.classList.contains('widget')).to.be.true;
					expect(wgt.elm.classList.contains('a-widget')).to.be.true;
				});

				it('handles multiple classnames string', () => {
					wgt = widget(TITLE, target, {classname: 'a-widget theme-bg with-border'});
					expect(wgt.elm.classList.contains('widget')).to.be.true;
					expect(wgt.elm.classList.contains('a-widget')).to.be.true;
					expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
					expect(wgt.elm.classList.contains('with-border')).to.be.true;
				});

				it('handles an array of classnames', () => {
					wgt = widget(TITLE, target, {classname: ['a-widget', 'theme-bg', 'with-border']});
					expect(wgt.elm.classList.contains('widget')).to.be.true;
					expect(wgt.elm.classList.contains('a-widget')).to.be.true;
					expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
					expect(wgt.elm.classList.contains('with-border')).to.be.true;
				});
			});

			describe('close', () => {
				it('clicking the `close` button hides the widget', () => {
					wgt = widget(TITLE, target, {close: true}).mount();

					expect(wgt.elm.style.display).to.not.equal('none');
					wgt.closeBtn.click();
					expect(wgt.elm.style.display).to.equal('none');
				});
			});

			describe('minimize', () => {
				it('toggles the widget body visibility', () => {
					wgt = widget(TITLE, target, {minimize: true}).mount();

					expect(wgt.elm.classList.contains('minimized')).to.be.false;
					wgt.minimizeBtn.click();
					expect(wgt.elm.classList.contains('minimized')).to.be.true;
					wgt.minimizeBtn.click();
					expect(wgt.elm.classList.contains('minimized')).to.be.false;
				});
			});
		});
	});

	describe('.mount()', () => {
		it('appends a new widget element to the <body>', () => {
			wgt = widget();

			expect(document.getElementsByClassName('widget')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('widget')).to.have.lengthOf(1);
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
			expect(wgt.actions.style.display).to.equal('flex'); // flex
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex'); // flex
		});

		it('binds listener: click on `close`', () => {
			wgt = widget(TITLE, target, {close: true});

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
			expect(wgt.actions.style.display).to.equal('flex'); // flex
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex'); // flex

			wgt.unmount();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
		});

		it('unbinds listener: click on `close`', () => {
			wgt = widget(TITLE, target, {close: true}).mount();
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
			wgt = widget(TITLE, target, {close: true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			wgt.showActions();
			expect(wgt.actions.style.display).to.equal('flex');
			wgt.hideActions();
			expect(wgt.actions.style.display).to.equal('none');
		});

		it('returns the widget instance', () => {
			wgt = widget(TITLE, target, {close: true}).mount();
			expect(wgt.showActions()).to.eql(wgt);
			expect(wgt.hideActions()).to.eql(wgt);
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
	});

	describe('Elements & ClassNames', () => {
		describe('Main Element', () => {
			it('is stored in `elm` property', () => {
				wgt = widget(TITLE, target);
				expect(wgt.elm).to.be.instanceOf(HTMLElement);
			});

			it('has classnames', () => {
				wgt = widget(TITLE, target);

				expect(wgt.elm.classList.contains('widget')).to.be.true;
				expect(wgt.elm.classList.contains('draggable')).to.be.false;
				wgt.mount();
				expect(wgt.elm.classList.contains('draggable')).to.be.true;
			});
		});

		describe('Header', () => {
			it('is stored in `header` property', () => {
				wgt = widget('My Widget', target);
				expect(wgt.header).to.be.instanceOf(HTMLElement);
			});

			it('has a classname', () => {
				wgt = widget('My Widget', target);
				expect(wgt.header.classList.contains('widget-header')).to.be.true;
			});

			it('is added to the DOM on mount', () => {
				wgt = widget();

				expect(document.getElementsByClassName('widget-header')).to.have.lengthOf(0);
				wgt.mount();
				expect(document.getElementsByClassName('widget-header')).to.have.lengthOf(1);
			});

			describe('Title', () => {
				it('is stored in `title` property', () => {
					wgt = widget('My Widget', target);
					expect(wgt.title).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					wgt = widget('My Widget', target);
					expect(wgt.title.classList.contains('widget-title')).to.be.true;
				});

				it('is added to the DOM on mount', () => {
					wgt = widget('My Widget', target);

					expect(document.getElementsByClassName('widget-title')).to.have.lengthOf(0);
					wgt.mount();
					expect(document.getElementsByClassName('widget-title')).to.have.lengthOf(1);
				});
			});

			describe('Action Buttons', () => {
				it('is stored in `actions` property', () => {
					wgt = widget(TITLE, target, {minimize: true});
					expect(wgt.actions).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					wgt = widget(TITLE, target, {minimize: true});
					expect(wgt.actions.classList.contains('widget-action-buttons')).to.be.true;
				});

				it('is added to the DOM on mount (with options: close/minimize)', () => {
					const closeWgt = widget(TITLE, target, {close: true});
					const minimizeWgt = widget(TITLE, target, {minimize: true});
					const noOptsWgt = widget();

					expect(document.getElementsByClassName('widget-action-buttons')).to.have.lengthOf(0);
					closeWgt.mount();
					minimizeWgt.mount();
					noOptsWgt.mount();
					expect(document.getElementsByClassName('widget-action-buttons')).to.have.lengthOf(2);

					closeWgt.destroy();
					minimizeWgt.destroy();
					noOptsWgt.destroy();
				});
			});

			describe('Minimize Button', () => {
				it('is stored in `minimizeBtn` property', () => {
					wgt = widget(TITLE, target, {minimize: true});
					expect(wgt.minimizeBtn).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					wgt = widget(TITLE, target, {minimize: true});
					expect(wgt.minimizeBtn.classList.contains('widget-minimize')).to.be.true;
				});

				it('is added to the DOM on mount', () => {
					wgt = widget(TITLE, target, {minimize: true});

					expect(document.getElementsByClassName('widget-minimize')).to.have.lengthOf(0);
					wgt.mount();
					expect(document.getElementsByClassName('widget-minimize')).to.have.lengthOf(1);
				});
			});

			describe('Close Button', () => {
				it('is stored in `closeBtn` property', () => {
					wgt = widget(TITLE, target, {close: true});
					expect(wgt.closeBtn).to.be.instanceOf(HTMLElement);
				});

				it('has a classname', () => {
					wgt = widget(TITLE, target, {close: true});
					expect(wgt.closeBtn.classList.contains('widget-close')).to.be.true;
				});

				it('is added to the DOM on mount', () => {
					wgt = widget(TITLE, target, {close: true});

					expect(document.getElementsByClassName('widget-close')).to.have.lengthOf(0);
					wgt.mount();
					expect(document.getElementsByClassName('widget-close')).to.have.lengthOf(1);
				});
			});
		});

		describe('Body', () => {
			it('is stored in `body` property', () => {
				wgt = widget(TITLE, target);
				expect(wgt.body).to.deep.equal(target);
			});

			it('has a classname', () => {
				wgt = widget(TITLE, target);
				expect(wgt.body.classList.contains('widget-body')).to.be.true;
			});

			it('inside a body-container', () => {
				wgt = widget(TITLE, target);
				expect(wgt.bodyContainer.classList.contains('widget-body-container')).to.be.true;
				expect(target.parentNode).to.deep.equal(wgt.bodyContainer);
			});
		});
	});

	describe('Behavior', () => {
		it('toggles actions visiblity on hover', () => {
			wgt = widget(TITLE, target, {close: true}).mount();

			// TODO: use document selector instead of wgt[elm]
			// console.log(document.getElementsByClassName('widget-action-buttons').length);

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.equal('flex');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
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
