---
id: codebase-overview
title: Gambaran Basis Kode
layout: contributing
permalink: docs/codebase-overview.html
prev: how-to-contribute.html
next: implementation-notes.html
redirect_from:
  - "contributing/codebase-overview.html"
---

Bagian ini akan memberikan Anda gambaran mengenai penyusunan basis kode React, konvensi, serta implementasinya.

Jika Anda ingin [berkontribusi pada React](/docs/how-to-contribute.html) kami berharap panduan ini akan membantu Anda merasa lebih nyaman dalam membuat perubahan.

Kami tidak selalu merekomendasikan konvensi ini pada aplikasi React. Banyak di antaranya ada karena alasan historis dan mungkin berubah seiring berjalannya waktu.

### _Dependency_ Eksternal {#external-dependencies}

React hampir tidak memiliki _dependency_ eksternal. Biasanya, `require()` mengacu pada sebuah _file_ pada basis kode React sendiri. Bagaimanapun, ada sedikit pengecualian yang relatif langka.

[Repositori fbjs](https://github.com/facebook/fbjs) ada karena React berbagi beberapa utilitas dengan _library_ seperti [Relay](https://github.com/facebook/relay), dan kami menjaga mereka tetap sinkron. Kami tidak bergantung pada modul-modul kecil yang ekuivalen pada ekosistem Node karena kami ingin _engineer_ Facebook dapat mengubahnya kapanpun dibutuhkan. Tidak ada satupun utilitas dalam fbjs yang dianggap sebagai API publik, dan hanya ditujukan untuk penggunaan oleh proyek Facebook seperti React.

### Folder Level Atas {#top-level-folders}

Setelah melakukan kloning pada [repositori React](https://github.com/facebook/react), Anda akan melihat beberapa folder teratas di dalamnya:

* [`packages`](https://github.com/facebook/react/tree/master/packages) berisi metadata (seperti `package.json`) dan kode sumber (`src` subdirektori) untuk semua _package_ pada repositori React. **Jika perubahan Anda berkaitan dengan kode, subdirektori `src` dari setiap _package_ adalah dimana Anda akan menghabiskan sebagian besar waktu Anda.**
* [`fixtures`](https://github.com/facebook/react/tree/master/fixtures) berisi beberapa aplikasi uji coba React untuk para kontributor.
* `build` adalah _output build_ dari React. Ia tidak ada pada repositori tetapi akan muncul pada hasil klon React Anda setelah Anda [melakukan _build_](/docs/how-to-contribute.html#development-workflow) untuk pertama kali.

Dokumentasi berada pada [repositori terpisah dari React](https://github.com/reactjs/reactjs.org).

Ada beberapa folder teratas lainnya tetapi mereka sebagian besar digunakan untuk peralatan dan kemungkinan besar Anda tidak akan pernah menghadapi mereka ketika berkontribusi.

### Tes Kolokasi {#colocated-tests}

Kami tidak memiliki direktori level atas untuk tes unit. Sebagai gantinya, kami meletakkannya pada direktori bernama `__tests__`, relatif pada _file_ yang ditesnya.

Misalnya, tes untuk [`setInnerHTML.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/setInnerHTML.js) terletak tepat di sampingnya pada [`__tests__/setInnerHTML-test.js`](https://github.com/facebook/react/blob/87724bd87506325fcaf2648c70fc1f43411a87be/src/renderers/dom/client/utils/__tests__/setInnerHTML-test.js).

### Peringatan dan _Invariant_ {#warnings-and-invariants}

Basis kode React menggunakan modul `warning` untuk menampilkan peringatan:

```js
var warning = require('warning');

warning(
  2 + 2 === 4,
  'Matematika tidak berfungsi hari ini.'
);
```
**Peringatan ditampilkan ketika kondisi `warning` adalah `false`.**

Satu cara yang baik untuk mengingatnya adalah bahwa kondisi seharusnya merefleksikan keadaan yang normal daripada yang tidak.

Ini adalah ide yang bagus untuk menghindari men-spam konsol dengan peringatan yang sama:

```js
var warning = require('warning');

var didWarnAboutMath = false;
if (!didWarnAboutMath) {
  warning(
    2 + 2 === 4,
    'Matematika tidak berfungsi hari ini.'
  );
  didWarnAboutMath = true;
}
```

Peringatan hanya diaktifkan pada mode pengembangan. Pada mode produksi, mereka dilepas seluruhnya. Jika Anda perlu melarang beberapa jalur kode untuk dijalankan, gunakan modul `invariant`:

```js
var invariant = require('invariant');

invariant(
  2 + 2 === 4,
  'Anda tidak boleh lewat!'
);
```

**_Invariant_ dilontarkan ketika kondisi`invariant` adalah `false`.**

"_Invariant_" hanya cara lain untuk mengatakan "kondisi ini selalu benar". Anda dapat menganggapnya sebagai membuat _assertion_.

Merupakan hal yang penting untuk menjaga perilaku versi pengembangan dan produksi tetap serupa, sehingga `invariant` dilontarkan baik di mode pengembangan dan produksi. Pesan eror secara otomatis diganti dengan kode eror pada mode produksi untuk menghindari mempengaruhi ukuran byte secara negatif.

### Pengembangan dan Produksi {#development-and-production}

Anda dapat menggunakan variabel pseudo-global `__DEV__` pada basis kode untuk menjaga blok kode yang ditujukan hanya pada mode pengembangan.

Variabel ini di-_inline_ pada tahap kompilasi, dan berubah menjadi pengecekan `process.env.NODE_ENV !== 'production'` pada _build_ CommonJS.

Untuk _build_ yang berdiri sendiri, ia menjadi `true` pada _build_ yang tidak di -_minify_, dan dilepas seluruhnya dengan menggunakan blok `if` yang ia jaga pada _build_ yang di-_minify_.

```js
if (__DEV__) {
  // Kode ini hanya akan berjalan di mode pengembangan.
}
```

### Flow {#flow}

Kami baru saja mulai memperkenalkan pengecekan [Flow](https://flow.org/) pada basis kode. _File_ yang ditandai dengan anotasi `@flow` pada komentar lisensi _header_ mengalami pengecekan tipe.

Kami menerima _pull request_ [menambahkan anotasi Flow pada kode yang sudah ada](https://github.com/facebook/react/pull/7600/files). Anotasi Flow terlihat seperti ini:

```js
ReactRef.detachRefs = function(
  instance: ReactInstance,
  element: ReactElement | string | number | null | false,
): void {
  // ...
}
```

Bila mungkin, kode baru harus menggunakan anotasi Flow.
Anda dapat menjalankan `yarn flow` secara lokal untuk mengecek kode Anda menggunakan Flow.

### Injeksi Dinamis {#dynamic-injection}

React menggunakan injeksi dinamis pada sebagian modul. Walaupun selalu eksplisit, hal tersebut masih disayangkan karena menghalangi pemahaman terhadap kode. Alasan utama ia adalah karena React mulanya hanya mendukung DOM sebagai target. React Native dimulai sebagai _fork_ dari React. Kami perlu menambahkan injeksi dinamis agar React Native dapat melakukan _override_ pada beberapa perilaku.

Anda mungkin melihat modul yang mendeklarasikan _dependency_ dinamis seperti ini:

```js
// Diinjeksi secara dinamis
var textComponentClass = null;

// Bergantung pada nilai yang diinjeksi secara dinamis
function createInstanceForText(text) {
  return new textComponentClass(text);
}

var ReactHostComponent = {
  createInstanceForText,

  // Menyediakan kesempatan untuk injeksi dinamis
  injection: {
    injectTextComponentClass: function(componentClass) {
      textComponentClass = componentClass;
    },
  },
};

module.exports = ReactHostComponent;
```

_Field_ `injection` tidak ditangani secara khusus dengan cara apapun. Tapi menurut konvensi, modul ini perlu beberapa _dependency_ (agaknya spesifik pada platform tertentu) yang diinjeksi pada saat sedang berjalan (_runtime_).

Terdapat beberapa poin untuk injeksi pada basis kode. Di waktu yang akan datang, kami berniat untuk menghilangkan mekanisme injeksi dinamis dan menghubungkan semua bagian secara statis selama proses _build_.

### _Multiple Package_ {#multiple-packages}

React adalah sebuah [monorepo](https://danluu.com/monorepo/). Repositorinya berisi banyak _package_ terpisah sehingga perubahan mereka dapat dikoordinasikan bersama, dan isu-isu berada pada satu tempat.

### Inti React {#react-core}

Inti dari React berisi semua [API level atas `React`](/docs/top-level-api.html#react), misalnya:

* `React.createElement()`
* `React.Component`
* `React.Children`

**Inti React hanya berisi API yang dibutuhkan untuk mendefinisikan komponen.** Ia tidak termasuk algoritma [_reconciliation_](/docs/reconciliation.html) atau kode spesifik platform lainnya. Ia digunakan oleh React DOM dan komponen React Native.

Kode untuk inti React terletak di [`packages/react`](https://github.com/facebook/react/tree/master/packages/react) pada diagram sumber. Ia tersedia pada npm sebagai _package_ [`react`](https://www.npmjs.com/package/react). _Build browser_ yang berdiri sendiri disebut `react.js`, dan ia mengekspor sebuah global yang disebut `React`.

### _Renderer_ {#renderers}

React mulanya dibuat demi DOM tetapi kemudian diadaptasi untuk mendukung platform _native_ dengan [React Native](https://facebook.github.io/react-native/). Hal ini memperkenalkan konsep _renderer_ pada tim internal React.

**_Renderer_ mengatur bagaimana sebuah diagram React berubah menjadi panggilan platform yang mendasarinya**

_Renderer_ juga terletak pada [`packages/`](https://github.com/facebook/react/tree/master/packages/):

* [_Renderer_ React DOM](https://github.com/facebook/react/tree/master/packages/react-dom) merender komponen React menuju DOM. Ia mengimplementasi [API `ReactDOM` level atas](/docs/react-dom.html) dan tersedia sebagai _package_ npm [`react-dom`](https://www.npmjs.com/package/react-dom). Ia juga bisa digunakan sebagai bundel _browser_ yang berdiri sendiri yang dikenal `react-dom.js` yang mengekspor sebuah global `ReactDOM`.
* [_Renderer_ React Native](https://github.com/facebook/react/tree/master/packages/react-native-renderer) merender komponen React menuju tampilan _native_. Ia digunakan secara internal oleh React Native.
* [_Renderer_ React Test](https://github.com/facebook/react/tree/master/packages/react-test-renderer) merender komponen React menuju diagram JSON. Ia digunakan oleh fitur [Snapshot Testing](https://facebook.github.io/jest/blog/2016/07/27/jest-14.html) dari [Jest](https://facebook.github.io/jest) dan tersedia sebagai _package_ npm [react-test-renderer](https://www.npmjs.com/package/react-test-renderer).

Satu-satunya _Renderer_ lain yang didukung secara resmi adalah [`react-art`](https://github.com/facebook/react/tree/master/packages/react-art). Ia dulu terletak pada [repositori GitHub](https://github.com/reactjs/react-art) terpisah tetapi kami memindahkannya pada diagram sumber _main_ sekarang.

>**Catatan:**
>
>Secara teknis [`react-native-renderer`](https://github.com/facebook/react/tree/master/packages/react-native-renderer) adalah sebuah lapisan yang sangat tipis yang mengajarkan React untuk berinteraksi dengan implementasi React Native. Kode spesifik platform yang sesungguhnya mengatur tampilan _native_ yang hidup di dalam [repositori React Native](https://github.com/facebook/react-native) bersama dengan komponennya.

### _Reconciler_ {#reconcilers}

Bahkan _renderer_ yang sangat berbeda seperti React DOM dan React Native perlu berbagi banyak logika. Khususnya, algoritma [_reconciliation_](/docs/reconciliation.html) harus semirip mungkin agar proses render deklaratif, komponen kustom, _state_, metode _lifecycle_, dan _refs_ bekerja secara konsisten antar platform.

Untuk menyelesaikan hal ini, _renderer_ berbeda berbagi beberapa kode di antara mereka. Kami menyebut bagian React ini sebuah "_reconciler_". Ketika sebuah pembaruan seperti `setState()` dijadwalkan, _reconciler_ memanggil `render()` pada komponen di diagram, dan memasang, membarui, atau melepas mereka.

_Reconciler_ tidak dipaketkan terpisah karena saat ini mereka tidak memiliki API publik. Sebagai gantinya, mereka digunakan secara eksklusif oleh _renderer_ seperti React DOM dan React Native.

### _Reconciler Stack_ {#stack-reconciler}

_Reconciler "stack"_ adalah implementasi yang menggerakan React 15 dan versi sebelumnya. Kami telah berhenti menggunakannya, tapi ia didokumentasikan dengan detil di [bagian berikutnya](/docs/implementation-notes.html)

### _Reconciler_ Fiber {#fiber-reconciler}

_Reconciler_ "fiber" adalah usaha baru untuk menyelesaikan masalah yang melekat pada _reconciler stack_ dan memperbaiki beberapa isu yang telah lama ada. Ia telah menjadi _reconciler default_ sejak React 16.

Tujuan utamanya adalah:

* Kemampuan untuk membagi tugas yang dapat diinterupsi menjadi potongan kecil.
* Kemampuan untuk memprioritaskan, _rebase_ dan menggunakan kembali tugas yang sedang berjalan.
* Kemampuan untuk bolak-balik antara _parent_ dan _children_ untuk mendukung layout pada React.
* Kemampuan untuk mengembalikan beberapa elemen dari `render()`.
* Dukungan yang lebih baik untuk batasan eror.

Anda dapat membaca lebih banyak mengenai Arsitektur React Fiber [di sini](https://github.com/acdlite/react-fiber-architecture) dan [di sini](https://blog.ag-grid.com/inside-fiber-an-in-depth-overview-of-the-new-reconciliation-algorithm-in-react). Walaupun ia telah dikirimkan bersama dengan React 16, fitur-fitur _async_ belum diaktifkan secara _default_.

Kode sumbernya terletak di [`packages/react-reconciler`](https://github.com/facebook/react/tree/master/packages/react-reconciler).

### Sistem _Event_ {#event-system}

React menerapkan sebuah sistem _event_ sintetis yang agnostik terhadap _renderer_-nya dan bekerja dengan React DOM dan React Native. Kode sumbernya terletak di [`packages/react-events`](https://github.com/facebook/react/tree/master/packages/react-events).

Terdapat sebuah [video dengan pembahasan mendalam mengenai kodenya](https://www.youtube.com/watch?v=dRo_egw7tBc) (66 menit).

### Selanjutnya Apa? {#what-next}

Bacalah [bagian berikutnya](/docs/implementation-notes.html) untuk mempelajari mengenai implementasi _reconciler_ sebelum React 16 secara lebih detil. Kami belum mendokumentasikan bagian internal dari _reconciler_ yang baru.
