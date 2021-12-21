---
id: web-components
title: Web Components
permalink: docs/web-components.html
prev: error-boundaries.html
next: higher-order-components.html
redirect_from:
  - "docs/webcomponents.html"
---

React dan [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components) dibangun untuk menyelesaikan masalah yang berbeda. Web Components menyediakan enkapsulasi yang kuat untuk *reusable components*, sementara React menyediakan pustaka yang deklaratif untuk menjaga DOM tetap sinkron dengan data Anda. Tujuan keduanya adalah untuk saling melengkapi. Sebagai pengembang atau *developer*, Anda bebas untuk menggunakan React di dalam Web Components Anda, atau menggunakan Web Components di dalam React, ataupun keduanya.

Kebanyakan orang yang menggunakan React tidak menggunakan Web Components, tetapi mungkin Anda menginginkannya, terutama jika Anda menggunakan pustaka komponen antarmuka pengguna pihak ketiga yang ditulis menggunakan Web Components.

## Menggunakan Web Components di dalam React {#using-web-components-in-react}

```javascript
class HelloMessage extends React.Component {
  render() {
    return <div>Halo <x-search>{this.props.name}</x-search>!</div>;
  }
}
```

> Catatan:
>
> Web Components sering kali memiliki API yang bersifat imperatif. Contohnya, Web Component video mungkin memiliki fungsi `play()` dan `pause()`. Untuk mengakses API yang imperatif dari sebuah Web Component, Anda perlu menggunakan `ref` untuk berinteraksi dengan simpul DOM secara langsung. Jika Anda menggunakan Web Components pihak ketiga, solusi terbaik adalah dengan menulis komponen React yang membungkus Web Component Anda.
>
> *Events* yang dihasilkan oleh Web Component mungkin tidak terdistribusi dengan benar melalui pohon *render* React.
> Anda perlu menambahkan *event handlers* secara manual untuk menangani *events* yang terdapat dalam komponen React Anda.

Satu yang biasanya membingungkan, yaitu Web Components menggunakan "class" bukan "className".

```javascript
function BrickFlipbox() {
  return (
    <brick-flipbox class="demo">
      <div>depan</div>
      <div>belakang</div>
    </brick-flipbox>
  );
}
```

## Menggunakan React di dalam Web Components Anda {#using-react-in-your-web-components}

```javascript
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    ReactDOM.render(<a href={url}>{name}</a>, mountPoint);
  }
}
customElements.define('x-search', XSearch);
```

> Catatan:
>
> Kode ini **tidak akan** bekerja jika Anda merubah kelas dengan Babel. Untuk detail dan diskusi, lihat [masalah ini](https://github.com/w3c/webcomponents/issues/587).
> Tambahkan [custom-elements-es5-adapter](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs#custom-elements-es5-adapterjs) sebelum Anda memuat Web Components Anda untuk memperbaiki masalah tersebut.
