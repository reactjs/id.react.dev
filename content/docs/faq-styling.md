---
id: faq-styling
title: Styling and CSS
permalink: docs/faq-styling.html
layout: docs
category: FAQ
---

### Bagaimana saya menambahkan kelas CSS ke komponen? {#how-do-i-add-css-classes-to-components}

Melewatkan sebuah string sebagai properti `className`:

```jsx
render() {
  return <span className="menu navigation-menu">Menu</span>
}
```

Merupakan hal yang umum bagi kelas CSS untuk bergantung pada properti komponen atau _state_:

```jsx
render() {
  let className = 'menu';
  if (this.props.isActive) {
    className += ' menu-active';
  }
  return <span className={className}>Menu</span>
}
```

>Tip
>
>If you often find yourself writing code like this, [classnames](https://www.npmjs.com/package/classnames#usage-with-reactjs) package can simplify it.

### Dapatkah saya menggunakan _inline styles_? {#can-i-use-inline-styles}

Ya, lihat dokumen untuk _styling_ [disini](/docs/dom-elements.html#style).

### Apakah _inline styles_ buruk? {#are-inline-styles-bad}

Performa kelas CSS biasanya lebih baik daripada _inline styles._

### Apa yang dimaksud dengan CSS-in-JS? {#what-is-css-in-js}

"CSS-in-JS" mengacu kepada pola dimana CSS disusun menggunakan JavaScript bukannya didefinisikan di luar arsip.[disini](https://github.com/MicheleBertoli/css-in-js).

_Perhatikan bahwa fungsi ini bukan bagian dari React, tetapi disediakan oleh library dari pihak ketiga._ React tidak memiliki pendapat tentang bagaimana style didefinisikan; jika ragu, titik awal yang baik adalah mendefinisikan style anda secara terpisah dalam file `*.css` seperti biasa dan arahkan ke mereka menggunakan [`className`](/docs/dom-elements.html#classname).

### Dapatkah saya membuat animasi di React?{#can-i-do-animations-in-react}

React dapat digunakan untuk menggerakkan animasi. Lihat [React Transition Group](https://reactcommunity.org/react-transition-group/) dan [React Motion](https://github.com/chenglou/react-motion), untuk contoh.
