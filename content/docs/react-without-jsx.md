---
id: react-without-jsx
title: React Without JSX
permalink: docs/react-without-jsx.html
---

JSX bukan persyaratan untuk menggunakan React. Menggunakan React tanpa JSX sangat cocok ketika Anda tidak ingin mengatur kompilasi di *build environment* Anda.

Setiap elemen hanyalah _syntactic sugar_ untuk pemanggilan  `React.createElement(component, props, ...children)`. Jadi, apa pun yang dapat Anda lakukan dengan JSX juga dapat dilakukan hanya dengan JavaScript biasa.

Misalnya, kode yang ditulis dengan JSX berikut:

```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

ReactDOM.render(
  <Hello toWhat="World" />,
  document.getElementById('root')
);
```

Dapat dikompilasi dengan kode dibawah ini untuk yang tidak menggunakan JSX:

```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```

Jika Anda ingin tahu lebih lanjut untuk melihat banyak contoh tentang bagaimana JSX dikonversi ke JavaScript, Anda dapat mencobanya di [the online Babel compiler](babel://jsx-simple-example).

<<<<<<< HEAD
Komponen dapat diberikan sebagai _string_, atau sebagai subkelas dari `React.Component`, atau fungsi murni untuk komponen _stateless_.
=======
The component can either be provided as a string, as a subclass of `React.Component`, or a plain function.
>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3

Jika Anda terlalu lelah mengetik `React.createElement` satu pola umum adalah dengan menggunakan pintasan:

```js
const e = React.createElement;

ReactDOM.render(
  e('div', null, 'Hello World'),
  document.getElementById('root')
);
```

Jika Anda menggunakan pintasan `React.createElement`, akan lebih mudah menggunakan React tanpa JSX.

Atau, Anda dapat merujuk ke proyek komunitas seperti [`react-hyperscript`](https://github.com/mlmorg/react-hyperscript) dan[`hyperscript-helpers`](https://github.com/ohanhi/hyperscript-helpers) yang menawarkan _terser syntax_.

