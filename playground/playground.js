const targetElm = document.getElementById('target');
const headerElm = document.getElementById('custom-header');

// const wgt = widget({minWidth: 300});
// const wgt = widget('qwe', targetElm);
// const wgt = widget(headerElm, targetElm);
const wgt = widget('My Widget', targetElm, {
	// toggleHeader: true,
	// toggleActions: true,
	// showHeader: false,
	// showActions: false,
	// minWidth: 300
});

wgt.mount();
