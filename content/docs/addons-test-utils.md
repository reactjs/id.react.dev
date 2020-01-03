---
id: test-utils
title: Utilitas Tes
permalink: docs/test-utils.html
layout: docs
category: Reference
---

**Cara Import**

```javascript
import ReactTestUtils from 'react-dom/test-utils'; // ES6
var ReactTestUtils = require('react-dom/test-utils'); // ES5 dengan npm
```

## Ikhtisar {#ikhtisar}

`ReactTestUtils` mempermudah kita melakukan tes pada komponen React dengan _framework_ tes pilihan anda. Di Facebook kami menggunakan [Jest](https://facebook.github.io/jest/) untuk tes JavaScript yang tidak merepotkan. Belajar cara mulai menggunakan Jest melalui situs Jest [React Tutorial](https://jestjs.io/docs/tutorial-react).

> Catatan:
>
> Kami menyarankan Anda untuk menggunakan [`react-testing-library`](https://git.io/react-testing-library) yang didesain untuk memfasilitasi dan mendorong penulisan tes yang menggunakan komponen anda selayaknya seorang pengguna sebenarnya.
>
> Pilihan lain, Airbnb telah merilis utilitas tes bernama [Enzyme](https://airbnb.io/enzyme/), yang mempermudah kita dalam menyatakan, memanipulasi, dan melewati keluaran dari komponen React anda.

 - [`act()`](#act)
 - [`mockComponent()`](#mockcomponent)
 - [`isElement()`](#iselement)
 - [`isElementOfType()`](#iselementoftype)
 - [`isDOMComponent()`](#isdomcomponent)
 - [`isCompositeComponent()`](#iscompositecomponent)
 - [`isCompositeComponentWithType()`](#iscompositecomponentwithtype)
 - [`findAllInRenderedTree()`](#findallinrenderedtree)
 - [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass)
 - [`findRenderedDOMComponentWithClass()`](#findrendereddomcomponentwithclass)
 - [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag)
 - [`findRenderedDOMComponentWithTag()`](#findrendereddomcomponentwithtag)
 - [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype)
 - [`findRenderedComponentWithType()`](#findrenderedcomponentwithtype)
 - [`renderIntoDocument()`](#renderintodocument)
 - [`Simulate`](#simulate)

## Referensi {#referensi}

### `act()` {#act}

Untuk menyiapkan komponen sebelum penegasan, bungkus kode yang me-*render* komponen tersebut dan lakukan pembaruan di dalam panggilan `act()`. Hal ini membuat tes anda berjalan menyerupai bagaimana React bekerja di peramban.

>Catatan
>
>Jika Anda menggunakan `react-test-renderer`, `react-test-renderer` juga menyediakan sebuah `act` ekspor yang sama.

Sebagai contoh, katakanlah kita punya `Counter` komponen:

```js
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 0};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
    document.title = `Anda menekan sebanyak ${this.state.count} kali`;
  }
  componentDidUpdate() {
    document.title = `Anda menekan sebanyak ${this.state.count} kali`;
  }
  handleClick() {
    this.setState(state => ({
      count: state.count + 1,
    }));
  }
  render() {
    return (
      <div>
        <p>Anda telah menekan sebanyak {this.state.count} kali</p>
        <button onClick={this.handleClick}>
          Tekan aku
        </button>
      </div>
    );
  }
}
```

Ini adalah contoh bagaimana kita bisa menguji komponen ini:

```js{3,20-22,29-31}
import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import Counter from './Counter';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('bisa render dan memperbarui counter', () => {
  // Uji render pertama dan componentDidMount
  act(() => {
    ReactDOM.render(<Counter />, container);
  });
  const button = container.querySelector('button');
  const label = container.querySelector('p');
  expect(label.textContent).toBe('Anda menekan sebanyak 0 kali');
  expect(document.title).toBe('Anda menekan sebanyak 0 kali');

  // Uji render kedua dan componentDidUpdate
  act(() => {
    button.dispatchEvent(new MouseEvent('click', {bubbles: true}));
  });
  expect(label.textContent).toBe('Anda menekan sebanyak 1 kali');
  expect(document.title).toBe('Anda menekan sebanyak 1 kali');
});
```

- Jangan lupa bahwa mengirim *event* DOM hanya dapat dilakukan ketika penampung DOM sudah ditambahkan ke `document`. Anda dapat menggunakan *library* seperti [`react-testing-library`](https://github.com/kentcdodds/react-testing-library) untuk mengurangi kode _boilerplate_.
- Dokumen [`recipes`](/docs/testing-recipes.html) berisi lebih detil mengenai cara kerja `act()`, lengkap dengan contoh dan cara penggunaan.

* * *

### `mockComponent()` {#mockcomponent}

```javascript
mockComponent(
  componentClass,
  [mockTagName]
)
```

Oper sebuah komponen tiruan ke _method_ ini untuk menambahkan _method-method_ berguna yang memperbolehkan komponen tersebut untuk digunakan sebagai komponen React tiruan. Sebagai ganti dari _rendering_ seperti biasa, komponen tiruan ini akan menjadi `<div>` sederhana (atau tag lain jika `mockTagName` disediakan) yang menampung anak komponen yang disediakan.

> Catatan:
>

> `mockComponent()` adalah sebuah API peninggalan. Kami menyarankan Anda menggunakan [`jest.mock()`](https://facebook.github.io/jest/docs/en/tutorial-react-native.html#mock-native-modules-using-jestmock).

* * *

### `isElement()` {#iselement}

```javascript
isElement(element)
```

Mengembalikan `true` jika `element` adalah sebuah React elemen.

* * *

### `isElementOfType()` {#iselementoftype}

```javascript
isElementOfType(
  element,
  componentClass
)
```

Mengembalikan `true` jika `element` adalah sebuah React elemen yang memiliki tipe dari React `componentClass`.

* * *

### `isDOMComponent()` {#isdomcomponent}

```javascript
isDOMComponent(instance)
```

Mengembalikan `true` jika `instance` adalah sebuah komponen DOM (seperti sebuah `<div>` atau `<span>`).

* * *

### `isCompositeComponent()` {#iscompositecomponent}

```javascript
isCompositeComponent(instance)
```

Mengembalikan `true` jika `instance` adalah sebuah komponen yang ditetapkan oleh pengguna, seperti sebuah kelas atau sebuah fungsi.

* * *

### `isCompositeComponentWithType()` {#iscompositecomponentwithtype}

```javascript
isCompositeComponentWithType(
  instance,
  componentClass
)
```

Mengembalikan `true` jika `instance` adalah sebuah komponen yang memiliki tipe dari React `componentClass`.

* * *

### `findAllInRenderedTree()` {#findallinrenderedtree}

```javascript
findAllInRenderedTree(
  tree,
  test
)
```

Melewati semua komponen dalam `tree` dan mengumpulkan semua komponen yang `test(component)` adalah `true`. Ini tidak begitu bermanfaat dengan dirinya sendiri, tetapi digunakan sebagai primitif untuk alat uji lainnya.

* * *

### `scryRenderedDOMComponentsWithClass()` {#scryrendereddomcomponentswithclass}

```javascript
scryRenderedDOMComponentsWithClass(
  tree,
  className
)
```

Mencari semua DOM elemen dalam _rendered tree_ yang merupakan komponen DOM yang memiliki nama kelas sama dengan `className`.

* * *

### `findRenderedDOMComponentWithClass()` {#findrendereddomcomponentwithclass}

```javascript
findRenderedDOMComponentWithClass(
  tree,
  className
)
```

Seperti [`scryRenderedDOMComponentsWithClass()`](#scryrendereddomcomponentswithclass) tetapi mengharapkan satu hasil dan mengembalikan satu hasil tersebut atau melempar _exception_ jika ada lebih dari satu yang cocok.

* * *

### `scryRenderedDOMComponentsWithTag()` {#scryrendereddomcomponentswithtag}

```javascript
scryRenderedDOMComponentsWithTag(
  tree,
  tagName
)
```

Mencari semua DOM elemen dalam _rendered tree_ yang merupakan komponen DOM dengan nama label yang sama dengan `tagName`.

* * *

### `findRenderedDOMComponentWithTag()` {#findrendereddomcomponentwithtag}

```javascript
findRenderedDOMComponentWithTag(
  tree,
  tagName
)
```

Seperti [`scryRenderedDOMComponentsWithTag()`](#scryrendereddomcomponentswithtag) tetapi mengharapkan satu hasil dan mengembalikan satu hasil tersebut atau melempar _exception_ jika ada lebih dari satu yang cocok.

* * *

### `scryRenderedComponentsWithType()` {#scryrenderedcomponentswithtype}

```javascript
scryRenderedComponentsWithType(
  tree,
  componentClass
)
```

Mencari semua instansi dari komponen dengan tipe yang sama dengan `componentClass`.

* * *

### `findRenderedComponentWithType()` {#findrenderedcomponentwithtype}

```javascript
findRenderedComponentWithType(
  tree,
  componentClass
)
```

Sama seperti [`scryRenderedComponentsWithType()`](#scryrenderedcomponentswithtype) tetapi mengharapkan satu hasil dan mengembalikan satu hasil tersebut atau melempar _exception_ jika ada lebih dari satu yang cocok.

***

### `renderIntoDocument()` {#renderintodocument}

```javascript
renderIntoDocument(element)
```

Menggambar sebuah elemen React ke dalam sebuah DOM _node_ terpisah dalam _document_. **Fungsi ini membutuhkan sebuah DOM.** Secara efektif hal ini sama dengan:

```js
const domContainer = document.createElement('div');
ReactDOM.render(element, domContainer);
```

> Catatan:
>
> Anda harus memiliki `window`, `window.document` dan `window.document.createElement` tersedia secara global **sebelum** Anda import `React`. Jika tidak React akan berpikir tidak dapat mengakses DOM dan _method-method_ seperti `setState` tidak akan bekerja.

* * *

## Other Utilities {#other-utilities}

### `Simulate` {#simulate}

```javascript
Simulate.{eventName}(
  element,
  [eventData]
)
```

Mensimulasikan pengiriman sebuah perihal pada suatu DOM _node_ dengan pilihan `eventData` _event_ data.

`Simulate` memiliki sebuah _method_ untuk [every event that React understands](/docs/events.html#supported-events).

**Klik sebuah elemen**

```javascript
// <button ref={(node) => this.button = node}>...</button>
const node = this.button;
ReactTestUtils.Simulate.click(node);
```

**Mengubah nilai dari sebuah bidang masukan lalu menekan ENTER.**

```javascript
// <input ref={(node) => this.textInput = node} />
const node = this.textInput;
node.value = 'jerapah';
ReactTestUtils.Simulate.change(node);
ReactTestUtils.Simulate.keyDown(node, {key: "Enter", keyCode: 13, which: 13});
```

> Catatan
>
> Anda harus menyediakan _event_ properti yang Anda gunakan dalam komponen (contoh keyCode, which, dll...) karena React tidak membuat _event_ tersebut untuk Anda.

* * *
