[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/taitulism/widget.svg?branch=master)](https://travis-ci.org/taitulism/widget)

widget
======
Make elements window-like: a floating titled container, draggable and resizable.

```js
const widget = require('widget-elm');

const myElm = document.getElementById('target');

widget('My Title', myElm, {options});
```

## Options

* **`minWidth`** - Number. Resize minimum width.
* **`minHeight`** - Number. Resize minimum height.
* **`id`** - String. The widget `id` attribute.
* **`classname`** - String. The widget `class` attribute.
* **`showActions`** - Boolean. Show action buttons (maximize, minimize, close).
* **`showClose`** - Boolean. Show the `close` button.
* **`showMinimize`** - Boolean. Show the `minimize` button.
* **`showMaximize`** - Boolean. Show the `maximize` button.
* **`showHeader`** - Boolean. Show the widget header.
* **`toggleHeader`** - Boolean. Toggle the header visibility on hover (show on enter, hide on leave).
* **`toggleActions`** - Boolean. Toggle the action buttons visibility on hover (show on enter, hide on leave).


## API
Calling the `widget()` function returns a `Widget` instance: 
```js
const w = widget(elm);
```
It has the following methods:

### **.mount()**


### **.unmount()**


### **.show() / .hide()**


### **.showActions() / .hideActions()**


### **.showHeader() / .hideHeader()**


### **.minimize()**


### **.unMinimize()**


### **.maximize()**


### **.unMaximize()**


### **.restoreSize()**


### **.setTitle()**


### **.setBody()**


### **.setView()**


### **.destroy()**
Kills the `Widget` instance for good, unbinds events, releases element references.














## Classnames
For styling, the main element will be given the following classes:
* `'draggable'` - from initialization until destruction.
* `'grabbed'` - when grabbing the element. On mouse down, before moving.
* `'dragging'` - when moving the element until mouse up.

&nbsp;

>### Position:
>On initialization, the target element will be placed inside the `<body>` element and will be given an inline style of `position: absolute`.
