---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

<<<<<<< HEAD
Jika Anda memuat React dari sebuah `<script>` *tag*, API-API tingkat atas ini terdapat di `ReactDOM` *global*. Jika Anda menggunakan ES6 dengan npm, Anda dapat mengetik `import ReactDOM from 'react-dom'`. Jika Anda menggunakan ES5 dengan npm, Anda dapat mengetik `var ReactDOM = require('react-dom')`.
=======
The `react-dom` package provides DOM-specific methods that can be used at the top level of your app and as an escape hatch to get outside the React model if you need to.

```js
import * as ReactDOM from 'react-dom';
```

If you use ES5 with npm, you can write:

```js
var ReactDOM = require('react-dom');
```

The `react-dom` package also provides modules specific to client and server apps:
- [`react-dom/client`](/docs/react-dom-client.html)
- [`react-dom/server`](/docs/react-dom-server.html)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## Ikhtisar {#overview}

<<<<<<< HEAD
*Package* `react-dom` menyediakan metode-metode spesifik DOM yang dapat digunakan di tingkat atas aplikasi Anda, juga sebagai jalan untuk keluar dari React *model* jika diperlukan. Pada umumnya komponen-komponen Anda tidak memerlukan modul ini.
=======
The `react-dom` package exports these methods:
- [`createPortal()`](#createportal)
- [`flushSync()`](#flushsync)
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

These `react-dom` methods are also exported, but are considered legacy:
- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`findDOMNode()`](#finddomnode)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)

> Note: 
> 
> Both `render` and `hydrate` have been replaced with new [client methods](/docs/react-dom-client.html) in React 18. These methods will warn that your app will behave as if it's running React 17 (learn more [here](https://reactjs.org/link/switch-to-createroot)).

### Dukungan *Browser* {#browser-support}

<<<<<<< HEAD
React mendukung semua *browser* populer, termasuk Internet Explorer 9 dan setelahnya, meskipun [memerlukan beberapa *polyfills*](/docs/javascript-environment-requirements.html) untuk *browser*-*browser* usang seperti IE 9 dan IE 10.
=======
React supports all modern browsers, although [some polyfills are required](/docs/javascript-environment-requirements.html) for older versions.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

> Catatan
>
<<<<<<< HEAD
> Kami tidak mendukung *browser*-*browser* usang yang tidak mendukung metode-metode ES5, tapi Anda mungkin menemukan bahwa aplikasi-aplikasi Anda ternyata dapat berjalan di *browser*-*browser* usang jika *polyfills* seperti [es5-shim dan es5-sham](https://github.com/es-shims/es5-shim) disertakan di halaman web. Kami tidak dapat membantu Anda jika Anda melakukan ini.

* * *
=======
> We do not support older browsers that don't support ES5 methods or microtasks such as Internet Explorer. You may find that your apps do work in older browsers if polyfills such as [es5-shim and es5-sham](https://github.com/es-shims/es5-shim) are included in the page, but you're on your own if you choose to take this path.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

## Referensi {#reference}

### `createPortal()` {#createportal}

```javascript
createPortal(child, container)
```

<<<<<<< HEAD
Me-*render* sebuah elemen React ke dalam DOM di dalam `container` yang diberikan dan mengembalikan sebuah [referensi](/docs/more-about-refs.html) kepada komponen (atau mengembalikan `null` untuk [stateless components](/docs/components-and-props.html#functional-and-class-components)).
=======
Creates a portal. Portals provide a way to [render children into a DOM node that exists outside the hierarchy of the DOM component](/docs/portals.html).

### `flushSync()` {#flushsync}

```javascript
flushSync(callback)
```

Force React to flush any updates inside the provided callback synchronously. This method is useful for being able to read the result of those updates immediately.

> Note:
> 
> `flushSync` can have a significant impact on performance. Use sparingly.
> 
> `flushSync` may force pending Suspense boundaries to show their `fallback` state.
> 
> `flushSync` may also run pending effects and synchronously apply any updates they contain before returning.
> 
> `flushSync` may also flush updates outside the callback when necessary to flush the updates inside the callback. For example, if there are pending updates from a click, React may flush those before flushing the updates inside the callback.

## Legacy Reference {#legacy-reference}
### `render()` {#render}
```javascript
render(element, container[, callback])
```

> Note:
>
> `render` has been replaced with `createRoot` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Jika elemen React tersebut sebelumnya di-*render* ke dalam `container`, ini akan memperbaruinya dan hanya mengubah DOM seperlunya untuk memperlihatkan elemen React terbaru.

Jika *callback* opsional diberikan, *callback* ini akan dijalankan setelah komponen di-*render* atau diperbarui.

> Catatan:
>
<<<<<<< HEAD
> `ReactDOM.render()` mengendalikan isi dari *container node* yang Anda berikan. Semua elemen-elemen DOM yang ada di dalam diganti pada saat dipanggil pertama kali. Panggilan-panggilan berikutnya menggunakan algoritma pembeda DOM dari React untuk pembaruan yang efisien.
>
> `ReactDOM.render()` tidak memodifikasi *container node* (hanya memodifikasi anak-anak dari *container*). Hal tersebut memungkinkan kita untuk memasukkan sebuah komponen ke dalam sebuah *DOM node* yang ada tanpa menimpa anak-anaknya.
>
> `ReactDOM.render()` pada saat ini mengembalikan sebuah referensi ke *root* `ReactComponent` *instance*. Tetapi, penggunaan hasil fungsi ini adalah usang
> dan harus dihindari karena React versi-versi berikutnya mungkin akan me-*render* komponen-komponen secara *asynchronous* dalam beberapa situasi tertentu. Jika Anda memerlukan referensi ke *root* `ReactComponent` *instance*, solusi yang disarankan adalah dengan melampirkan sebuah
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) ke elemen dasar.
>
> Menggunakan `ReactDOM.render()` untuk mengisi sebuah *container* yang di-*render* *server* dianggap usang dan akan tidak berlaku lagi di React 17. Sebaiknya gunakan [`hydrate()`](#hydrate).
=======
> `render()` controls the contents of the container node you pass in. Any existing DOM elements inside are replaced when first called. Later calls use React’s DOM diffing algorithm for efficient updates.
>
> `render()` does not modify the container node (only modifies the children of the container). It may be possible to insert a component to an existing DOM node without overwriting the existing children.
>
> `render()` currently returns a reference to the root `ReactComponent` instance. However, using this return value is legacy
> and should be avoided because future versions of React may render components asynchronously in some cases. If you need a reference to the root `ReactComponent` instance, the preferred solution is to attach a
> [callback ref](/docs/refs-and-the-dom.html#callback-refs) to the root element.
>
> Using `render()` to hydrate a server-rendered container is deprecated. Use [`hydrateRoot()`](#hydrateroot) instead.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `hydrate()` {#hydrate}

```javascript
hydrate(element, container[, callback])
```

<<<<<<< HEAD
Sama seperti [`render()`](#render), tapi digunakan untuk meng-*hidrasi* sebuah *container* yang isi HTML-nya di-*render* oleh [`ReactDOMServer`](/docs/react-dom-server.html). React akan mencoba untuk melampirkan *event listeners* ke *markup* yang ada.
=======
> Note:
>
> `hydrate` has been replaced with `hydrateRoot` in React 18. See [hydrateRoot](/docs/react-dom-client.html#hydrateroot) for more info.

Same as [`render()`](#render), but is used to hydrate a container whose HTML contents were rendered by [`ReactDOMServer`](/docs/react-dom-server.html). React will attempt to attach event listeners to the existing markup.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

React mengharapkan bahwa isi yang di-*render* adalah sama antara *server* dan klien. React dapat memperbaiki perbedaan dalam isi teks, tetapi Anda harus menganggap ketidakcocokan sebagai kesalahan dan memperbaikinya. Dalam mode *development*, React memperingatkan tentang ketidakcocokan pada saat *hidrasi*. Tidak ada jaminan bahwa perbedaan atribut akan diperbaiki jika terjadi ketidakcocokan. Ini penting untuk alasan-alasan kinerja karena dalam aplikasi-aplikasi pada umumnya, ketidakcocokan jarang terjadi, dan memeriksa semua *markup* akan amat sangat berat.

Jika atribut dari sebuah elemen atau isi tek berbeda antara *server* dan klien (contohnya, sebuah *timestamp*), Anda dapat membungkam *warning* dengan menambahkan `suppressHydrationWarning={true}` di elemen tersebut. Ini hanya dapat dilakukan pada kedalaman satu tingkat, dan dimaksudkan sebagai jalan keluar. Jangan disalahgunakan. Kecuali isi teksnya, React tidak akan mencoba untuk memperbaiki hal ini, jadi ini mungkin akan tetap tidak konsekuen sampai diperbarui di masa depan.

Jika Anda sengaja perlu untuk me-*render* sesuatu yang berbeda antara *server* dan klien, Anda dapat melakukan *two-pass rendering*. Komponen-komponen yang me-*render* sesuatu yang berbeda di klien dapat membaca sebuah *state variable* seperti `this.state.isClient`, dimana Anda dapat menetapkannya menjadi `true` di `componentDidMount()`. Dengan cara ini *render pass* pertama akan me-*render* isi yang sama dengan *server*, menghindari ketidakcocokan, tetapi sebuah *pass* tambahan akan terjadi secara sinkron, langsung setelah *hidrasi*. Perhatikan bahwa cara ini akan mengakibatkan komponen-komponen Anda lebih lambat karena mereka harus me-*render* dua kali, jadi gunakan dengan hati-hati.

Ingatlah untuk berhati-hati dalam hal pengalaman pengguna (*user experience*) pada saat koneksi lambat. Kode JavaScript mungkin akan dimuat lebih lambat dari saat *render* HTML pertama kali, jadi jika Anda me-*render* sesuatu yang hanya ada di klien saja, transisinya bisa jadi kasar. Meskipun begitu, jika dieksekusi dengan baik, mungkin akan bermanfaat untuk me-*render* "*shell*" dari aplikasi di *server*, dan hanya menunjukkan beberapa *widget* ekstra di klien. Untuk belajar mengenai bagaimana melakukan ini tanpa mengalami masalah ketidakcocokan *markup*, lihat penjelasan di paragraf sebelumnya.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
unmountComponentAtNode(container)
```

<<<<<<< HEAD
Membuang sebuah komponen React yang terpasang dari DOM dan membersihkan *event handlers* dan *state* terkait. Jika tidak terdapat komponen yang terpasang di dalam *container*, memanggil *function* ini tidak akan melakukan apa-apa. Mengembalikan `true` jika sebuah komponen berhasil dilepas dan `false` jika tidak ada komponen yang dilepas.
=======
> Note:
>
> `unmountComponentAtNode` has been replaced with `root.unmount()` in React 18. See [createRoot](/docs/react-dom-client.html#createroot) for more info.

Remove a mounted React component from the DOM and clean up its event handlers and state. If no component was mounted in the container, calling this function does nothing. Returns `true` if a component was unmounted and `false` if there was no component to unmount.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

* * *

### `findDOMNode()` {#finddomnode}

> Catatan:
>
> `findDOMNode` adalah sebuah jalan pintas yang digunakan untuk mengakses *DOM node* yang mendasari komponen tersebut. Dalam banyak kasus, penggunaan cara ini tidak disarankan karena dapat merusak abstraksi komponen. [Sudah tidak berlaku dalam `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
findDOMNode(component)
```
Jika komponen ini telah terpasang ke dalam DOM, mengembalikan elemen DOM asli *browser* yang terkait. Metode ini berguna untuk membaca nilai hasil dari DOM, seperti nilai-nilai isian form dan melakukan pengukuran DOM. **Pada umumnya, Anda dapat melampirkan sebuah referensi ke *DOM node* dan menghindari penggunaan `findDOMNode` sepenuhnya.**

Ketika sebuah komponen me-*render* menjadi `null` atau `false`, `findDOMNode` mengembalikan `null`. Ketika sebuah komponen me-*render* menjadi sebuah teks, `findDOMNode` mengembalikan sebuah *DOM node* teks dengan nilai teks tersebut sebagai isinya. Dimulai dari React 16, sebuah komponen dapat mengembalikan sebuah fragmen dengan banyak anak, dimana `findDOMNode` akan mengembalikan *DOM node* yang sesuai dengan anak pertama yang tidak kosong.

> Catatan:
>
> `findDOMNode` hanya dapat digunakan pada komponen-komponen yang telah terpasang (dengan kata lain, komponen-komponen yang telah ditempatkan di dalam DOM). Jika Anda mencoba memanggil *function* ini pada sebuah komponen yang belum terpasang (seperti memanggil `findDOMNode()` di dalam `render()` dari sebuah komponen yang belum diciptakan), akan menghasilkan sebuah *exception*.
>
> `findDOMNode` tidak dapat digunakan pada komponen-komponen *function*.

* * *
<<<<<<< HEAD

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Membuat sebuah *portal*. *Portal* merupakan cara untuk [me-*render* anak-anak ke dalam sebuah *DOM node* yang berada diluar hirarki dari komponen DOM](/docs/portals.html).
=======
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1
