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
		it('toggles `minimized` classname on the widget', () => {
			wgt = widget().mount();

			expect(wgt.elm.classList.contains('minimized')).to.be.false;
			wgt.minimizeBtn.click();
			expect(wgt.elm.classList.contains('minimized')).to.be.true;
			wgt.minimizeBtn.click();
			expect(wgt.elm.classList.contains('minimized')).to.be.false;
		});
	});

	describe('Click on `Maximize` Button', () => {
		it('toggles `maximized` classname on the widget', () => {
			wgt = widget().mount();

			expect(wgt.elm.classList.contains('maximized')).to.be.false;
			wgt.maximizeBtn.click();
			expect(wgt.elm.classList.contains('maximized')).to.be.true;
			wgt.maximizeBtn.click();
			expect(wgt.elm.classList.contains('maximized')).to.be.false;
		});
	});
};
