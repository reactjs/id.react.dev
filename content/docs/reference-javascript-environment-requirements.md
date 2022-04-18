---
id: javascript-environment-requirements
title: Kebutuhan Lingkungan JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 membutuhkan tipe data *collection* seperti [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) dan [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Jika Anda ingin mendukung *browser* dan perangkat lama yang mungkin belum menyediakannya secara langsung (contoh: IE < 11) atau *browser* yang mengimplementasikannya dengan tidak sesuai (contoh: IE 11), mohon menambahkan *polyfill global* di bundel aplikasi, seperti [core-js](https://github.com/zloirock/core-js) atau [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).

Lingkungan untuk React 16 yang sudah ditambahkan *polyfill* menggunakan *core-js* untuk mendukung *browser* lama mungkin terlihat seperti berikut:
=======
React 18 supports all modern browsers (Edge, Firefox, Chrome, Safari, etc).

If you support older browsers and devices such as Internet Explorer which do not provide modern browser features natively or have non-compliant implementations, consider including a global polyfill in your bundled application.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Here is a list of the modern features React 18 uses:
- [`Promise`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [`Symbol`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [`Object.assign`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>Halo, dunia!</h1>,
  document.getElementById('root')
);
```

React juga membutuhkan `requestAnimationFrame` (termasuk di lingkungan test).
Anda dapat menggunakan *package* [raf](https://www.npmjs.com/package/raf) untuk mendukung `requestAnimationFrame`:

```js
import 'raf/polyfill';
```
=======
The correct polyfill for these features depend on your environment. For many users, you can configure your [Browserlist](https://github.com/browserslist/browserslist) settings. For others, you may need to import polyfills like [`core-js`](https://github.com/zloirock/core-js) directly.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450
