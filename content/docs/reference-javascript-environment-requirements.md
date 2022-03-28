---
id: javascript-environment-requirements
title: Kebutuhan Lingkungan JavaScript
layout: docs
category: Reference
permalink: docs/javascript-environment-requirements.html
---

<<<<<<< HEAD
React 16 membutuhkan tipe data *collection* seperti [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) dan [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). Jika Anda ingin mendukung *browser* dan perangkat lama yang mungkin belum menyediakannya secara langsung (contoh: IE < 11) atau *browser* yang mengimplementasikannya dengan tidak sesuai (contoh: IE 11), mohon menambahkan *polyfill global* di bundel aplikasi, seperti [core-js](https://github.com/zloirock/core-js) atau [babel-polyfill](https://babeljs.io/docs/usage/polyfill/).
=======
React 16 depends on the collection types [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set). If you support older browsers and devices which may not yet provide these natively (e.g. IE < 11) or which have non-compliant implementations (e.g. IE 11), consider including a global polyfill in your bundled application, such as [core-js](https://github.com/zloirock/core-js).
>>>>>>> 5e9d673c6bc1530c901548c0b51af3ad3f91d594

Lingkungan untuk React 16 yang sudah ditambahkan *polyfill* menggunakan *core-js* untuk mendukung *browser* lama mungkin terlihat seperti berikut:

```js
import 'core-js/es/map';
import 'core-js/es/set';

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
