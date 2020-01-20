---
id: react-dom
title: ReactDOM
layout: docs
category: Reference
permalink: docs/react-dom.html
---

Jika Anda memuat React dari sebuah `<script>` *tag*, API-API tingkat atas ini terdapat di `ReactDOM` *global*. Jika Anda menggunakan ES6 dengan npm, Anda dapat mengetik `import ReactDOM from 'react-dom'`. Jika Anda menggunakan ES5 dengan npm, Anda dapat mengetik `var ReactDOM = require('react-dom')`.

## Ikhtisar {#overview}

*Package* `react-dom` menyediakan metode-metode spesifik DOM yang dapat digunakan di tingkat atas aplikasi Anda, juga sebagai jalan untuk keluar dari React *model* jika diperlukan. Pada umumnya komponen-komponen Anda tidak memerlukan modul ini.

- [`render()`](#render)
- [`hydrate()`](#hydrate)
- [`unmountComponentAtNode()`](#unmountcomponentatnode)
- [`findDOMNode()`](#finddomnode)
- [`createPortal()`](#createportal)

### Dukungan *Browser* {#browser-support}

React mendukung semua *browser* populer, termasuk Internet Explorer 9 dan setelahnya, meskipun [memerlukan beberapa *polyfills*](/docs/javascript-environment-requirements.html) untuk *browser*-*browser* usang seperti IE 9 dan IE 10.

> Catatan
>
> Kami tidak mendukung *browser*-*browser* usang yang tidak mendukung metode-metode ES5, tapi Anda mungkin menemukan bahwa aplikasi-aplikasi Anda ternyata dapat berjalan di *browser*-*browser* usang jika *polyfills* seperti [es5-shim dan es5-sham](https://github.com/es-shims/es5-shim) disertakan di halaman web. Kami tidak dapat membantu Anda jika Anda melakukan ini.

* * *

## Referensi {#reference}

### `render()` {#render}

```javascript
ReactDOM.render(element, container[, callback])
```

<<<<<<< HEAD
Me-*render* sebuah elemen React ke dalam DOM di dalam `container` yang diberikan dan mengembalikan sebuah [referensi](/docs/more-about-refs.html) kepada komponen (atau mengembalikan `null` untuk [stateless components](/docs/components-and-props.html#functional-and-class-components)).
=======
Render a React element into the DOM in the supplied `container` and return a [reference](/docs/more-about-refs.html) to the component (or returns `null` for [stateless components](/docs/components-and-props.html#function-and-class-components)).
>>>>>>> c8aef5dc0dc340e800fbb7963a94adb97da9803b

Jika elemen React tersebut sebelumnya di-*render* ke dalam `container`, ini akan memperbaruinya dan hanya mengubah DOM seperlunya untuk memperlihatkan elemen React terbaru.

Jika *callback* opsional diberikan, *callback* ini akan dijalankan setelah komponen di-*render* atau diperbarui.

> Catatan:
>
> `ReactDOM.render()` mengendalikan isi dari *container node* yang Anda berikan. Semua elemen-elemen DOM yang ada di dalam diganti pada saat dipanggil pertama kali. Panggilan-panggilan berikutnya menggunakan algoritma pembeda DOM dari React untuk pembaruan yang efisien.
>
> `ReactDOM.render()` tidak memodifikasi *container node* (hanya memodifikasi anak-anak dari *container*). Hal tersebut memungkinkan kita untuk memasukkan sebuah komponen ke dalam sebuah *DOM node* yang ada tanpa menimpa anak-anaknya.
>
> `ReactDOM.render()` pada saat ini mengembalikan sebuah referensi ke *root* `ReactComponent` *instance*. Tetapi, penggunaan hasil fungsi ini adalah usang
> dan harus dihindari karena React versi-versi berikutnya mungkin akan me-*render* komponen-komponen secara *asynchronous* dalam beberapa situasi tertentu. Jika Anda memerlukan referensi ke *root* `ReactComponent` *instance*, solusi yang disarankan adalah dengan melampirkan sebuah
> [callback ref](/docs/more-about-refs.html#the-ref-callback-attribute) ke elemen dasar.
>
> Menggunakan `ReactDOM.render()` untuk mengisi sebuah *container* yang di-*render* *server* dianggap usang dan akan tidak berlaku lagi di React 17. Sebaiknya gunakan [`hydrate()`](#hydrate).

* * *

### `hydrate()` {#hydrate}

```javascript
ReactDOM.hydrate(element, container[, callback])
```

Sama seperti [`render()`](#render), tapi digunakan untuk meng-*hidrasi* sebuah *container* yang isi HTML-nya di-*render* oleh [`ReactDOMServer`](/docs/react-dom-server.html). React akan mencoba untuk melampirkan *event listeners* ke *markup* yang ada.

React mengharapkan bahwa isi yang di-*render* adalah sama antara *server* dan klien. React dapat memperbaiki perbedaan dalam isi teks, tetapi Anda harus menganggap ketidakcocokan sebagai kesalahan dan memperbaikinya. Dalam mode *development*, React memperingatkan tentang ketidakcocokan pada saat *hidrasi*. Tidak ada jaminan bahwa perbedaan atribut akan diperbaiki jika terjadi ketidakcocokan. Ini penting untuk alasan-alasan kinerja karena dalam aplikasi-aplikasi pada umumnya, ketidakcocokan jarang terjadi, dan memeriksa semua *markup* akan amat sangat berat.

Jika atribut dari sebuah elemen atau isi tek berbeda antara *server* dan klien (contohnya, sebuah *timestamp*), Anda dapat membungkam *warning* dengan menambahkan `suppressHydrationWarning={true}` di elemen tersebut. Ini hanya dapat dilakukan pada kedalaman satu tingkat, dan dimaksudkan sebagai jalan keluar. Jangan disalahgunakan. Kecuali isi teksnya, React tidak akan mencoba untuk memperbaiki hal ini, jadi ini mungkin akan tetap tidak konsekuen sampai diperbarui di masa depan.

Jika Anda sengaja perlu untuk me-*render* sesuatu yang berbeda antara *server* dan klien, Anda dapat melakukan *two-pass rendering*. Komponen-komponen yang me-*render* sesuatu yang berbeda di klien dapat membaca sebuah *state variable* seperti `this.state.isClient`, dimana Anda dapat menetapkannya menjadi `true` di `componentDidMount()`. Dengan cara ini *render pass* pertama akan me-*render* isi yang sama dengan *server*, menghindari ketidakcocokan, tetapi sebuah *pass* tambahan akan terjadi secara sinkron, langsung setelah *hidrasi*. Perhatikan bahwa cara ini akan mengakibatkan komponen-komponen Anda lebih lambat karena mereka harus me-*render* dua kali, jadi gunakan dengan hati-hati.

Ingatlah untuk berhati-hati dalam hal pengalaman pengguna (*user experience*) pada saat koneksi lambat. Kode JavaScript mungkin akan dimuat lebih lambat dari saat *render* HTML pertama kali, jadi jika Anda me-*render* sesuatu yang hanya ada di klien saja, transisinya bisa jadi kasar. Meskipun begitu, jika dieksekusi dengan baik, mungkin akan bermanfaat untuk me-*render* "*shell*" dari aplikasi di *server*, dan hanya menunjukkan beberapa *widget* ekstra di klien. Untuk belajar mengenai bagaimana melakukan ini tanpa mengalami masalah ketidakcocokan *markup*, lihat penjelasan di paragraf sebelumnya.

* * *

### `unmountComponentAtNode()` {#unmountcomponentatnode}

```javascript
ReactDOM.unmountComponentAtNode(container)
```

Membuang sebuah komponen React yang terpasang dari DOM dan membersihkan *event handlers* dan *state* terkait. Jika tidak terdapat komponen yang terpasang di dalam *container*, memanggil *function* ini tidak akan melakukan apa-apa. Mengembalikan `true` jika sebuah komponen berhasil dilepas dan `false` jika tidak ada komponen yang dilepas.

* * *

### `findDOMNode()` {#finddomnode}

> Catatan:
>
> `findDOMNode` adalah sebuah jalan pintas yang digunakan untuk mengakses *DOM node* yang mendasari komponen tersebut. Dalam banyak kasus, penggunaan cara ini tidak disarankan karena dapat merusak abstraksi komponen. [Sudah tidak berlaku dalam `StrictMode`.](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)

```javascript
ReactDOM.findDOMNode(component)
```
Jika komponen ini telah terpasang ke dalam DOM, mengembalikan elemen DOM asli *browser* yang terkait. Metode ini berguna untuk membaca nilai hasil dari DOM, seperti nilai-nilai isian form dan melakukan pengukuran DOM. **Pada umumnya, Anda dapat melampirkan sebuah referensi ke *DOM node* dan menghindari penggunaan `findDOMNode` sepenuhnya.**

Ketika sebuah komponen me-*render* menjadi `null` atau `false`, `findDOMNode` mengembalikan `null`. Ketika sebuah komponen me-*render* menjadi sebuah teks, `findDOMNode` mengembalikan sebuah *DOM node* teks dengan nilai teks tersebut sebagai isinya. Dimulai dari React 16, sebuah komponen dapat mengembalikan sebuah fragmen dengan banyak anak, dimana `findDOMNode` akan mengembalikan *DOM node* yang sesuai dengan anak pertama yang tidak kosong.

> Catatan:
>
> `findDOMNode` hanya dapat digunakan pada komponen-komponen yang telah terpasang (dengan kata lain, komponen-komponen yang telah ditempatkan di dalam DOM). Jika Anda mencoba memanggil *function* ini pada sebuah komponen yang belum terpasang (seperti memanggil `findDOMNode()` di dalam `render()` dari sebuah komponen yang belum diciptakan), akan menghasilkan sebuah *exception*.
>
> `findDOMNode` tidak dapat digunakan pada komponen-komponen *function*.

* * *

### `createPortal()` {#createportal}

```javascript
ReactDOM.createPortal(child, container)
```

Membuat sebuah *portal*. *Portal* merupakan cara untuk [me-*render* anak-anak ke dalam sebuah *DOM node* yang berada diluar hirarki dari komponen DOM](/docs/portals.html).
