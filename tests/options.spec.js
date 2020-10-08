import {$byClassname, simulateMouseEnter, simulateMouseLeave} from './utils';

export default () => {
	let testDOMContainer, container, target, header, headerSpan, wgt;

	before(() => {
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

		header = document.createElement('div');
		headerSpan = document.createElement('span');
		header.id = 'custom-header';
		headerSpan.id = 'header-span';
		headerSpan.innerHTML = 'Custom Header';
		header.appendChild(headerSpan);

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

		Array.from(document.getElementsByClassName('winjet')).forEach((wgt) => {
			wgt.parentNode.removeChild(wgt);
		});
	});

	afterEach(() => {
		target.innerHTML = '';
		target.parentNode && target.parentNode.removeChild(target);
		target = null;

		container.parentNode.removeChild(container);
		container = null;

		header = null;
		headerSpan = null;

		if (wgt && wgt.elm) {
			wgt.destroy();
		}
	});

	after(() => {
		testDOMContainer = null;
	});

	describe('id', () => {
		it('sets an `id` attribute on the widget element', () => {
			wgt = widget({id: 'the-widget'});
			expect(wgt.elm.id).to.equal('the-widget');
		});
	});

	describe('classname', () => {
		it('sets a `classname` attribute on the widget element', () => {
			wgt = widget({classname: 'a-widget'});
			expect(wgt.elm.classList.contains('winjet')).to.be.true;
			expect(wgt.elm.classList.contains('a-widget')).to.be.true;
		});

		it('sets multiple classnames string', () => {
			wgt = widget({classname: 'a-widget theme-bg with-border'});
			expect(wgt.elm.classList.contains('winjet')).to.be.true;
			expect(wgt.elm.classList.contains('a-widget')).to.be.true;
			expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
			expect(wgt.elm.classList.contains('with-border')).to.be.true;
		});

		it('sets an array of classnames', () => {
			wgt = widget({classname: ['a-widget', 'theme-bg', 'with-border']});
			expect(wgt.elm.classList.contains('winjet')).to.be.true;
			expect(wgt.elm.classList.contains('a-widget')).to.be.true;
			expect(wgt.elm.classList.contains('theme-bg')).to.be.true;
			expect(wgt.elm.classList.contains('with-border')).to.be.true;
		});
	});

	describe('showClose', () => {
		it('by default - creates the `close` button', () => {
			wgt = widget().mount();

			expect(wgt.closeBtn).to.not.be.null;
			expect($byClassname('winjet-close-button')).to.have.lengthOf(1);
		});

		it('when `true` - creates the `close` button', () => {
			wgt = widget({showClose: true}).mount();

			expect(wgt.closeBtn).to.not.be.null;
			expect($byClassname('winjet-close-button')).to.have.lengthOf(1);
		});

		it('when `false` - doesn\'t create the `close` button', () => {
			wgt = widget({showClose: false}).mount();

			expect(wgt.closeBtn).to.be.null;
			expect($byClassname('winjet-close-button')).to.have.lengthOf(0);
		});
	});

	describe('showMinimize', () => {
		it('by default - creates the `minimize` button', () => {
			wgt = widget().mount();

			expect(wgt.minimizeBtn).to.not.be.null;
			expect($byClassname('winjet-minimize-button')).to.have.lengthOf(1);
		});

		it('when `true` - creates the `minimize` button', () => {
			wgt = widget({showMinimize: true}).mount();

			expect(wgt.minimizeBtn).to.not.be.null;
			expect($byClassname('winjet-minimize-button')).to.have.lengthOf(1);
		});

		it('when `false` - doesn\'t create the `close` button', () => {
			wgt = widget({showMinimize: false}).mount();

			expect(wgt.minimizeBtn).to.be.null;
			expect($byClassname('winjet-minimize-button')).to.have.lengthOf(0);
		});
	});

	describe('showMaximize', () => {
		it('by default - creates the `maximize` button', () => {
			wgt = widget().mount();

			expect(wgt.maximizeBtn).to.not.be.null;
			expect($byClassname('winjet-maximize-button')).to.have.lengthOf(1);
		});

		it('when `true` - creates the `maximize` button', () => {
			wgt = widget({showMaximize: true}).mount();

			expect(wgt.maximizeBtn).to.not.be.null;
			expect($byClassname('winjet-maximize-button')).to.have.lengthOf(1);
		});

		it('when `false` - doesn\'t create the `close` button', () => {
			wgt = widget({showMaximize: false}).mount();

			expect(wgt.maximizeBtn).to.be.null;
			expect($byClassname('winjet-maximize-button')).to.have.lengthOf(0);
		});
	});

	describe('showHeader', () => {
		it('by default - shows the header', () => {
			wgt = widget().mount();
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			expect(wgt.isHeaderShown).to.be.true;
		});

		it('when `true` - shows the header', () => {
			wgt = widget({showHeader: true}).mount();
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			expect(wgt.isHeaderShown).to.be.true;
		});

		it('when `false` - hides the header', () => {
			wgt = widget({showHeader: false}).mount();
			expect(wgt.header.style.visibility).to.equal('hidden');
			expect(wgt.isHeaderShown).to.be.false;
		});
	});

	describe('showActions', () => {
		it('by default - shows the action buttons', () => {
			wgt = widget().mount();
			expect(wgt.actions).to.not.be.null;
		});

		it('when `true` - shows the action buttons', () => {
			wgt = widget({showActions: true}).mount();
			expect(wgt.actions).to.not.be.null;
		});

		it('when `false` - hides the action buttons', () => {
			wgt = widget({showActions: false}).mount();
			expect(wgt.actions).to.be.null;
		});
	});

	describe('toggleHeader', () => {
		it('by default - doesn\'t toggle the header visibility on hover', () => {
			wgt = widget().mount();

			const [header] = $byClassname('winjet-header');

			expect(header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(header.style.visibility).to.not.equal('hidden');
		});

		it('when `false` - doesn\'t toggle the header visibility on hover', () => {
			wgt = widget({toggleHeader: false}).mount();

			const [header] = $byClassname('winjet-header');

			expect(header.style.visibility).to.not.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(header.style.visibility).to.not.equal('hidden');
		});

		it('when `true` - toggles the header visibility on hover', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.header.style.visibility).to.equal('hidden');
			simulateMouseEnter(wgt.elm);
			expect(wgt.header.style.visibility).to.not.equal('hidden');
			simulateMouseLeave(wgt.elm);
			expect(wgt.header.style.visibility).to.equal('hidden');
		});

		it('toggles a classname on the body container', () => {
			wgt = widget({toggleHeader: true}).mount();

			expect(wgt.bodyContainer.classList.contains('no-header')).to.be.true;
			simulateMouseEnter(wgt.elm);
			expect(wgt.bodyContainer.classList.contains('no-header')).to.be.false;
			simulateMouseLeave(wgt.elm);
			expect(wgt.bodyContainer.classList.contains('no-header')).to.be.true;
		});
	});

	describe('toggleActions', () => {
		it('by default - doesn\'t toggle the actions element visibility on hover', () => {
			wgt = widget().mount();

			const [actions] = $byClassname('winjet-action-buttons');

			expect(actions.style.display).to.not.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(actions.style.display).to.not.equal('none');
		});

		it('when `false` - doesn\'t toggle the actions element visibility on hover', () => {
			wgt = widget({toggleActions: false}).mount();

			const [actions] = $byClassname('winjet-action-buttons');

			expect(actions.style.display).to.not.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(actions.style.display).to.not.equal('none');
		});

		it('when `true` - toggles the actions element visibility on hover', () => {
			wgt = widget({toggleActions: true}).mount();

			expect(wgt.actions.style.display).to.equal('none');
			simulateMouseEnter(wgt.elm);
			expect(wgt.actions.style.display).to.not.equal('none');
			simulateMouseLeave(wgt.elm);
			expect(wgt.actions.style.display).to.equal('none');
		});

		// ? :/
		it.skip('toggles a classname on the title element', () => {
			wgt = widget({toggleActions: true}).mount();

			expect(wgt.title.classList.contains('no-actions')).to.be.true;
			simulateMouseEnter(wgt.elm);
			expect(wgt.title.classList.contains('no-actions')).to.be.false;
			simulateMouseLeave(wgt.elm);
			expect(wgt.title.classList.contains('no-actions')).to.be.true;
		});
	});

	describe('minWidth', () => {
		it('by default - sets a minimum widget width to 180px', () => {
			wgt = widget().mount();
			const wgtBox = wgt.elm.getBoundingClientRect();
			expect(wgtBox.width).to.equal(180);
		});

		it('when number - sets a minimum widget width to the given number of pixels', () => {
			wgt = widget({minWidth: 300}).mount();
			const wgtBox = wgt.elm.getBoundingClientRect();
			expect(wgtBox.width).to.equal(300);
		});
	});

	describe('minHeight', () => {
		it('by default - sets a minimum widget height to 110px', () => {
			wgt = widget().mount();
			const wgtBox = wgt.elm.getBoundingClientRect();
			expect(wgtBox.height).to.equal(110);
		});

		it('when number - sets a minimum widget height to the given number of pixels', () => {
			wgt = widget({minHeight: 300}).mount();
			const wgtBox = wgt.elm.getBoundingClientRect();
			expect(wgtBox.height).to.equal(300);
		});
	});
};
