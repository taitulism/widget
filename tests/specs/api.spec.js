import {
	TITLE,
	createHeader,
	createTarget,
	simulateMouseEnter,
	simulateMouseLeave
} from '../utils';

export default () => {
	let testDOMContainer, target, wgt;

	before(() => {
		testDOMContainer = document.getElementById('test-dom-container');
	});

	beforeEach(() => {
		target = createTarget();
		testDOMContainer.appendChild(target);
	});

	afterEach(() => {
		wgt && wgt.elm && wgt.destroy();
		target.parentNode && target.parentNode.removeChild(target);
		target = null;
	});

	describe('.mount()', () => {
		it('appends a new widget element to the <body>', () => {
			wgt = widget();

			expect(document.getElementsByClassName('winjet')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('winjet')).to.have.lengthOf(1);
		});

		it('header and its children are shown by default', () => {
			wgt = widget();

			expect(wgt.header.style.display).to.not.equal('none');
			expect(wgt.title.style.display).to.not.equal('none');
			expect(wgt.actions.style.display).to.not.equal('none');
			wgt.mount();
			expect(wgt.header.style.display).to.not.equal('none');
			expect(wgt.title.style.display).to.not.equal('none');
			expect(wgt.actions.style.display).to.not.equal('none');
		});

		it('binds listener: click on `close`', () => {
			wgt = widget(TITLE, target);

			let called = false;
			const origDestroy = wgt.destroy;
			wgt.destroy = () => {
				called = true;
				origDestroy.call(wgt);
			};

			expect(called).to.be.false;
			wgt.mount();
			wgt.closeBtn.click();
			expect(called).to.be.true;
		});

		it('binds listener: click on `minimize`', () => {
			wgt = widget(TITLE, target);

			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			wgt.minimizeBtn.click();
			expect(wgt.elm.classList.contains('minimized')).to.be.false;

			wgt.mount();

			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			wgt.minimizeBtn.click();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
		});

		it('binds listener: click on `maximize`', () => {
			wgt = widget(TITLE, target);

			expect(wgt.elm.classList.contains('maximized')).to.be.false;
			wgt.maximizeBtn.click();
			expect(wgt.elm.classList.contains('maximized')).to.be.false;

			wgt.mount();

			expect(wgt.elm.classList.contains('maximized')).to.be.false;
			wgt.maximizeBtn.click();
			expect(wgt.elm.classList.contains('maximized')).to.be.true;
		});

		it('makes the widget element draggable', () => {
			wgt = widget();

			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(1);
		});

		it('makes the widget element resizable', () => {
			wgt = widget();

			expect(document.getElementsByClassName('resizable')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('resizable')).to.have.lengthOf(1);
		});

		describe('with `toggleHeader` option', () => {
			it('by default - doesn\'t bind listener', () => {
				wgt = widget();

				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');

				wgt.mount();

				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.not.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.not.equal('hidden');
			});

			it('when `true` - binds listener', () => {
				wgt = widget({toggleHeader: true});

				expect(wgt.header.style.visibility).to.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.equal('hidden');

				wgt.mount();

				expect(wgt.header.style.visibility).to.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
			});

			it('when `false` - doesn\'t bind listener', () => {
				wgt = widget({toggleHeader: false});

				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');

				wgt.mount();

				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.not.equal('hidden');
				simulateMouseLeave(wgt.elm);
				expect(wgt.header.style.visibility).to.not.equal('hidden');
				simulateMouseEnter(wgt.elm);
				expect(wgt.header.style.visibility).to.not.not.equal('hidden');
			});
		});

		describe('with `toggleActions` option', () => {
			it('by default - doesn\'t bind listener', () => {
				wgt = widget();

				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');

				wgt.mount();

				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
			});

			it('when `true` - binds listener', () => {
				wgt = widget({toggleActions: true});

				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');

				wgt.mount();

				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
			});

			it('when `false` - doesn\'t bind listener', () => {
				wgt = widget({toggleActions: false});

				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');

				wgt.mount();

				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseEnter(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
				simulateMouseLeave(wgt.elm);
				expect(wgt.actions.style.display).to.not.equal('none');
			});
		});
	});

	describe('.unmount()', () => {
		it('doesn\'t fail when called before `.mount()`', () => {
			wgt = widget();
			const safeCall = () => wgt.unmount();
			expect(safeCall).to.not.throw();
		});

		it('removes the widget element from the <body>', () => {
			wgt = widget();

			expect(document.getElementsByClassName('winjet')).to.have.lengthOf(0);
			wgt.mount();
			expect(document.getElementsByClassName('winjet')).to.have.lengthOf(1);
			wgt.unmount();
			expect(document.getElementsByClassName('winjet')).to.have.lengthOf(0);
		});

		it('unbinds listener: toggle header on hover', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.header.style.visibility).to.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');

			wgt.unmount();

			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
		});

		it('unbinds listener: toggle actions on hover', () => {
			wgt = widget({toggleActions: true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');

			wgt.unmount();

			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
		});

		it('unbinds listener: click on `close`', () => {
			wgt = widget(TITLE, target).mount();
			wgt.unmount();

			expect(wgt.elm.style.display).to.not.equal('none');
			wgt.closeBtn.click();
			expect(wgt.elm.style.display).to.not.equal('none');
		});

		it('unbinds listener: click on `minimize`', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.isMinimized).to.be.false;
			wgt.minimizeBtn.click();
			expect(wgt.isMinimized).to.be.true;
			wgt.minimizeBtn.click();
			expect(wgt.isMinimized).to.be.false;
			wgt.unmount();
			wgt.minimizeBtn.click();
			expect(wgt.isMinimized).to.be.false;
		});

		it('unbinds listener: click on `maximize`', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.isMaximized).to.be.false;
			wgt.maximizeBtn.click();
			expect(wgt.isMaximized).to.be.true;
			wgt.maximizeBtn.click();
			expect(wgt.isMaximized).to.be.false;
			wgt.unmount();
			wgt.maximizeBtn.click();
			expect(wgt.isMaximized).to.be.false;
		});

		it('unbinds listener: hover toggles header visibility (when `toggleHeader` option is used)', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.header.style.visibility).to.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');

			wgt.unmount();

			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
		});

		it('unbinds listener: hover toggles actions visibility (when `toggleActions` option is used)', () => {
			wgt = widget({toggleActions: true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');

			wgt.unmount();

			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
		});

		it('returns the widget instance', () => {
			wgt = widget().mount();
			expect(wgt.unmount()).to.eql(wgt);
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

			expect(wgt.actions.style.display).to.not.equal('none');
			wgt.hideActions();
			expect(wgt.actions.style.display).to.equal('none');
			wgt.showActions();
			expect(wgt.actions.style.display).to.not.equal('none');
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

			expect(wgt.header.style.visibility).to.not.equal('hidden');
			wgt.hideHeader();
			expect(wgt.header.style.visibility).to.equal('hidden');
			wgt.showHeader();
			expect(wgt.header.style.visibility).to.not.equal('hidden');
		});

		it('toggles the drag grip handle between title & bodyContainer', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.draggable.gripHandle).to.deep.equal(wgt.title);
			wgt.hideHeader();
			expect(wgt.draggable.gripHandle).to.deep.equal(wgt.bodyContainer);
			wgt.showHeader();
			expect(wgt.draggable.gripHandle).to.deep.equal(wgt.title);
		});

		it('toggles the `.isHeaderShown` boolean prop', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.isHeaderShown).to.be.true;
			wgt.hideHeader();
			expect(wgt.isHeaderShown).to.be.false;
			wgt.showHeader();
			expect(wgt.isHeaderShown).to.be.true;
		});

		it('returns the widget instance', () => {
			wgt = widget(TITLE, target).mount();
			expect(wgt.showHeader()).to.eql(wgt);
			expect(wgt.hideHeader()).to.eql(wgt);
		});

		describe('With a `grip` argument', () => {
			it('sets the drag grip handle to given elm', () => {
				const grip = document.createElement('div');
				wgt = widget(TITLE, target).mount();

				expect(wgt.draggable.gripHandle).to.deep.equal(wgt.title);
				wgt.hideHeader(grip);
				expect(wgt.draggable.gripHandle).to.deep.equal(grip);
				wgt.showHeader(wgt.bodyContainer);
				expect(wgt.draggable.gripHandle).to.deep.equal(wgt.bodyContainer);
			});
		});
	});

	describe('.minimize()', () => {
		it('adds the `minimized` classname to the widget', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			wgt.minimize();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
		});

		it('adds `widget-button-active` classname on the button', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.false;
			wgt.minimize();
			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.true;
		});

		it('sets the widget `.isMinimized` property to `true`', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.isMinimized).to.be.false;
			wgt.minimize();
			expect(wgt.isMinimized).to.be.true;
		});

		it('disables header toggle visibility on hover', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.header.style.visibility).to.equal('hidden');
			wgt.minimize();
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
		});

		it('returns the widget instance', () => {
			wgt = widget().mount();
			expect(wgt.minimize()).to.eql(wgt);
		});
	});

	describe('.unMinimize()', () => {
		it('removes the `minimized` classname from the widget', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
			wgt.unMinimize();
			expect(wgt.elm.classList.contains('minimized')).to.be.false;
		});

		it('removes `widget-button-active` classname from the button', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.true;
			wgt.unMinimize();
			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.false;
		});

		it('sets the widget `.isMinimized` property to `true`', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			expect(wgt.isMinimized).to.be.true;
			wgt.unMinimize();
			expect(wgt.isMinimized).to.be.false;
		});

		it('returns the widget instance', () => {
			wgt = widget().mount().minimize();
			expect(wgt.unMinimize()).to.eql(wgt);
		});
	});

	describe('.maximize()', () => {
		it('adds the `maximized` classname to the widget', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.elm.classList.contains('maximized')).to.be.false;
			wgt.maximize();
			expect(wgt.elm.classList.contains('maximized')).to.be.true;
		});

		it('adds `widget-button-active` classname on the button', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.false;
			wgt.maximize();
			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.true;
		});

		it('sets the widget `.isMaximized` property to `true`', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.isMaximized).to.be.false;
			wgt.maximize();
			expect(wgt.isMaximized).to.be.true;
		});

		it('sets the widget inline style to maximized', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.elm.style.width).to.not.equal('100%');
			expect(wgt.elm.style.height).to.not.equal('100%');
			expect(wgt.elm.style.top).to.not.equal('0');
			expect(wgt.elm.style.left).to.not.equal('0');
			wgt.maximize();
			expect(wgt.elm.style.width).to.equal('100%');
			expect(wgt.elm.style.height).to.equal('100%');
			expect(wgt.elm.style.top).to.equal('0px');
			expect(wgt.elm.style.left).to.equal('0px');
		});

		it('disables header toggle visibility on hover', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.header.style.visibility).to.equal('hidden');
			wgt.maximize();
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
		});

		it('disables draggable', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.draggable.isDraggable).to.be.true;
			wgt.maximize();
			expect(wgt.draggable.isDraggable).to.be.false;
		});

		it('disables resizable', () => {
			wgt = widget(TITLE, target).mount();

			expect(wgt.resizable.isResizable).to.be.true;
			wgt.maximize();
			expect(wgt.resizable.isResizable).to.be.false;
		});

		it('returns the widget instance', () => {
			wgt = widget().mount();
			expect(wgt.maximize()).to.eql(wgt);
		});
	});

	describe('.unMaximize()', () => {
		it('removes the `maximized` classname from the widget', () => {
			wgt = widget(TITLE, target).mount();

			wgt.maximize();
			expect(wgt.elm.classList.contains('maximized')).to.be.true;
			wgt.unMaximize();
			expect(wgt.elm.classList.contains('maximized')).to.be.false;
		});

		it('removes `widget-button-active` classname from the button', () => {
			wgt = widget(TITLE, target).mount();

			wgt.maximize();
			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.true;
			wgt.unMaximize();
			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.false;
		});

		it('sets the widget `.isMaximized` property to `false`', () => {
			wgt = widget(TITLE, target).mount();

			wgt.maximize();
			expect(wgt.isMaximized).to.be.true;
			wgt.unMaximize();
			expect(wgt.isMaximized).to.be.false;
		});

		it('restores the widget inline style to before maximize', () => {
			wgt = widget(TITLE, target).mount();

			const boxBefore = wgt.elm.getBoundingClientRect();

			wgt.maximize();
			expect(wgt.elm.style.width).to.equal('100%');
			expect(wgt.elm.style.height).to.equal('100%');
			expect(wgt.elm.style.top).to.equal('0px');
			expect(wgt.elm.style.left).to.equal('0px');
			wgt.unMaximize();
			expect(wgt.elm.style.width).to.equal(boxBefore.width + 'px');
			expect(wgt.elm.style.height).to.equal(boxBefore.height + 'px');
			expect(wgt.elm.style.top).to.equal(boxBefore.top + 'px');
			expect(wgt.elm.style.left).to.equal(boxBefore.left + 'px');
		});

		it('re-enables draggable', () => {
			wgt = widget(TITLE, target).mount();

			wgt.maximize();
			expect(wgt.draggable.isDraggable).to.be.false;
			wgt.unMaximize();
			expect(wgt.draggable.isDraggable).to.be.true;
		});

		it('re-enables resizable', () => {
			wgt = widget(TITLE, target).mount();

			wgt.maximize();
			expect(wgt.resizable.isResizable).to.be.false;
			wgt.unMaximize();
			expect(wgt.resizable.isResizable).to.be.true;
		});

		it('returns the widget instance', () => {
			wgt = widget().mount().maximize();
			expect(wgt.unMaximize()).to.eql(wgt);
			wgt.destroy();

			// test early return
			wgt = widget().mount();
			expect(wgt.unMaximize()).to.eql(wgt);
		});
	});

	describe('.restoreSize()', () => {
		it('restores the widget size (unMinimize + unMaximize)', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			wgt.maximize();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
			expect(wgt.elm.classList.contains('maximized')).to.be.true;
			wgt.restoreSize();
			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			expect(wgt.elm.classList.contains('maximized')).to.be.false;
		});

		it('removes `widget-button-active` classname from the action buttons', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			wgt.maximize();
			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.true;
			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.true;
			wgt.restoreSize();
			expect(wgt.minimizeBtn.classList.contains('winjet-button-active')).to.be.false;
			expect(wgt.maximizeBtn.classList.contains('winjet-button-active')).to.be.false;
		});

		it('sets the widget `.isMinimized` & `.isMaximized` properties to `false`', () => {
			wgt = widget(TITLE, target).mount();

			wgt.minimize();
			wgt.maximize();
			expect(wgt.isMinimized).to.be.true;
			expect(wgt.isMaximized).to.be.true;
			wgt.restoreSize();
			expect(wgt.isMinimized).to.be.false;
			expect(wgt.isMaximized).to.be.false;
		});

		it('returns the widget instance', () => {
			wgt = widget().mount();
			expect(wgt.restoreSize()).to.eql(wgt);
		});
	});

	describe('.setTitle()', () => {
		it('changes the widget title', () => {
			wgt = widget('My Widget', target);
			expect(wgt.title.innerText).to.equal('My Widget');
			wgt.setTitle('New Title');
			expect(wgt.title.innerText).to.equal('New Title');
		});

		it('returns the widget instance', () => {
			wgt = widget().mount();
			expect(wgt.setTitle('New Title')).to.eql(wgt);
		});
	});

	describe('.setHeader()', () => {
		it('changes the widget header', () => {
			const header = createHeader();

			wgt = widget('My Widget', target).mount();
			expect(wgt.title.innerText).to.equal('My Widget');

			wgt.setHeader(header);
			expect(wgt.title).to.be.null;
			expect(wgt.header.innerHTML).to.contain('Custom Header');
			expect(wgt.header.classList.contains('winjet-header')).to.be.true;
		});

		it('returns the widget instance', () => {
			const header = createHeader();
			wgt = widget().mount();
			expect(wgt.setHeader(header)).to.eql(wgt);
		});
	});

	describe('.setBody()', () => {
		it('changes the widget body', () => {
			const newBody = document.createElement('div');
			newBody.innerHTML = '<button>Click</button>';

			wgt = widget('My Widget', target).mount();

			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.not.include('Click');
			wgt.setBody(newBody);
			expect(wgt.body.innerHTML).to.not.include('BBB');
			expect(wgt.body.innerHTML).to.include('Click');
		});

		it('returns the widget instance', () => {
			const newBody = document.createElement('div');
			wgt = widget().mount();
			expect(wgt.setBody(newBody)).to.eql(wgt);
		});
	});

	describe('.setView()', () => {
		it('changes the widget title & body', () => {
			wgt = widget('My Widget', target);

			const newBody = document.createElement('div');
			newBody.innerHTML = '<button>Click</button>';

			expect(wgt.title.innerText).to.equal('My Widget');
			expect(wgt.title.innerText).to.not.equal('New Title');
			expect(wgt.body.innerHTML).to.include('BBB');
			expect(wgt.body.innerHTML).to.not.include('Click');
			wgt.setView('New Title', newBody);
			expect(wgt.title.innerText).to.not.equal('My Widget');
			expect(wgt.title.innerText).to.equal('New Title');
			expect(wgt.body.innerHTML).to.not.include('BBB');
			expect(wgt.body.innerHTML).to.include('Click');
		});

		it('returns the widget instance', () => {
			const newBody = document.createElement('div');
			wgt = widget().mount();
			expect(wgt.setView('New Title', newBody)).to.eql(wgt);
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
			expect(safeCall).to.not.throw();
		});

		it('destroys Draggable', () => {
			wgt = widget().mount();

			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(1);
			wgt.destroy();
			expect(document.getElementsByClassName('draggable')).to.have.lengthOf(0);
		});

		it('destroys Resizable', () => {
			wgt = widget().mount();

			expect(document.getElementsByClassName('resizable')).to.have.lengthOf(1);
			wgt.destroy();
			expect(document.getElementsByClassName('resizable')).to.have.lengthOf(0);
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
};

