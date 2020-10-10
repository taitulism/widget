import { createTarget } from '../utils';

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
