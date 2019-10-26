---
title: React Element Factories dan Peringatan JSX
layout: single
permalink: warnings/legacy-factories.html
---

Anda kemungkinan berada di sini karena kode Anda memanggil komponen sebagai _function call_ biasa. Hal ini sekarang sudah usang:

```javascript
var MyComponent = require('MyComponent');

function render() {
  return MyComponent({ foo: 'bar' });  // WARNING
}
```

## JSX {#jsx}

Komponen React tidak lagi dapat dipanggil seperti ini. Sebagai gantinya [Anda dapat menggunakan JSX](/docs/jsx-in-depth.html).

```javascript
var React = require('react');
var MyComponent = require('MyComponent');

function render() {
  return <MyComponent foo="bar" />;
}
```

## Tanpa JSX {#without-jsx}

Jika Anda tidak ingin atau tidak dapat menggunakan JSX, Anda perlu membungkus komponen Anda dalam sebuah _factory_ sebelum pemanggilan:

```javascript
var React = require('react');
var MyComponent = React.createFactory(require('MyComponent'));

function render() {
  return MyComponent({ foo: 'bar' });
}
```

Hal ini merupakan langkah pembaruan yang mudah jika Anda memiliki banyak _function call_ yang sudah ada.

## Komponen dinamis tanpa JSX {#dynamic-components-without-jsx}

Jika anda mendapatkan komponen kelas dari sumber dinamis, tidaklah begitu perlu membuat _factory_ yang dipanggil secara langsung. Sebagai gantinya, Anda dapat saja membuat elemen _inline_:

```javascript
var React = require('react');

function render(MyComponent) {
  return React.createElement(MyComponent, { foo: 'bar' });
}
```

## Pembahasan Mendalam {#in-depth}

[Baca lebih lanjut tentang kenapa kita membuat perubahan ini.](https://gist.github.com/sebmarkbage/d7bce729f38730399d28)
