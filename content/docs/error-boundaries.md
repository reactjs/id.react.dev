---
id: error-boundaries
title: Error Boundaries
permalink: docs/error-boundaries.html
---

Di masa lalu, kesalahan JavaScript dalam komponen sering kali merusak _state_ internal React dan menyebabkannya untuk [meng-_emit_](https://github.com/facebook/react/issues/4026) [kesalahan](https://github.com/facebook/react/issues/8579) [yang samar](https://github.com/facebook/react/issues/6895) dalam proses _render_ berikutnya. Kesalahan tersebut selalu disebabkan oleh kesalahan sebelumnya pada kode aplikasi, tetapi React tidak menyediakan cara untuk menanganinya secara lugas dalam komponen, dan pada akhirnya tidak bisa dipulihkan.


## Memperkenalkan _Error Boundaries_ (Pembatas Kesalahan) {#introducing-error-boundaries}

Kesalahan JavaScript dalam sebuah bagian antarmuka seharusnya tidak boleh menyebabkan kerusakan aplikasi secara keseluruhan. Untuk mengatasi masalah ini bagi pengguna React, React 16 memperkenalkan konsep baru yaitu “_error boundary_”.

_Error boundaries_ merupakan komponen React yang **menangkap kesalahan JavaScript di semua tempat di dalam pohon komponen, mencatat kesalahan tersebut, dan menampilkan antarmuka darurat (_fallback_)** alih-alih menampilkan pohon komponen yang rusak. _Error boundary_ menangkap kesalahan dalam proses _render_, dalam metode _lifecycle_, dan dalam konstruktor dari keseluruhan pohon di bawahnya.

> Catatan
>
> _Error boundaries_ **tidak**  menangkap kesalahan untuk:
>
> * _Event handler_ ([pelajari lebih lanjut](#how-about-event-handlers))
> * Kode asinkronus (misalnya, `setTimeout` atau _callback_ `requestAnimationFrame`)
> * Proses _render_ sisi server
> * Kesalahan yang dilontarkan dalam komponen _error boundary_ itu sendiri (bukan dalam anaknya)

Sebuah komponen kelas menjadi komponen _error boundary_ jika komponen tersebut mendefinisikan salah satu (atau kedua) metode _lifecycle_ [`static getDerivedStateFromError()`](/docs/react-component.html#static-getderivedstatefromerror) atau [`componentDidCatch()`](/docs/react-component.html#componentdidcatch). Gunakan `static getDerivedStateFromError()` untuk me-_render_ antarmuka darurat saat kesalahan dilontarkan. Gunakan `componentDidCatch()` untuk mencatat informasi kesalahan.

```js{7-10,12-15,18-21}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state agar proses render berikutnya akan menampilkan antarmuka darurat.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Anda juga bisa mencatat kesalahan ke layanan pencatat kesalahan
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Anda bisa menampilkan antarmuka darurat Anda di sini
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}
```

Setelahnya, Anda bisa menggunakannya seperti komponen biasa:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

_Error boundaries_ bekerja seperti blok JavaScript `catch {}`, tetapi diperuntukkan bagi komponen. Hanya komponen kelas yang bisa menjadi komponen _error boundaries_. Dalam praktiknya, Anda hampir akan selalu mendeklarasikan sebuah komponen _error boundary_ sekali lalu menggunakannya dalam aplikasi Anda.

<<<<<<< HEAD
Perhatikan bahwa **_error boundaries_ hanya menangkap kesalahan dalam komponen di bawah pohon**. Komponen _error boundary_ tidak dapat menangkap kesalahan dari dalam dirinya sendiri. Jika _error boundary_ gagal me-_render_ pesan kesalahan, kesalahan tersebut akan merambat ke komponen _error boundary_ terdekat di atasnya. Ini mirip dengan cara kerja blok catch {} dalam JavaScript.
=======
Note that **error boundaries only catch errors in the components below them in the tree**. An error boundary can’t catch an error within itself. If an error boundary fails trying to render the error message, the error will propagate to the closest error boundary above it. This, too, is similar to how the `catch {}` block works in JavaScript.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

## Demonstrasi Langsung {#live-demo}

<<<<<<< HEAD
Kunjungi [contoh tentang pendeklarasian dan penggunaan komponen _error boundary_](https://codepen.io/gaearon/pen/wqvxGa?editors=0010) dengan [React 16](/blog/2017/09/26/react-v16.0.html).
=======
Check out [this example of declaring and using an error boundary](https://codepen.io/gaearon/pen/wqvxGa?editors=0010).
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d


## Dimana Harus Meletakkan _Error boundaries_ {#where-to-place-error-boundaries}

<<<<<<< HEAD
Anda sendiri yang menentukan granularitas sebuah komponen _error boundaries_. Anda mungkin ingin membungkus komponen _route_ tingkat teratas untuk menampilkan pesan “Ada masalah” kepada pengguna, seperti halnya yang dilakukan _framework_ sisi server saat terjadi kerusakan. Anda mungkin juga bisa membungkus _widget_ secara individual dengan sebuah _error boundary_ untuk melindung kerusakan merambat ke seluruh aplikasi.
=======
The granularity of error boundaries is up to you. You may wrap top-level route components to display a “Something went wrong” message to the user, just like how server-side frameworks often handle crashes. You may also wrap individual widgets in an error boundary to protect them from crashing the rest of the application.
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d


## Perilaku Baru untuk Kesalahan yang Tidak Tertangkap {#new-behavior-for-uncaught-errors}

Perubahan ini memiliki dampak yang penting. **Sejak React 16, kesalahan yang tidak ditangkap oleh _error boundary_ apa pun akan menyebabkan proses pelepasan (_mounting_) keseluruhan pohon komponen React.**

Kami berdebat cukup panjang hingga sampai pada keputusan ini. Namun menurut pengalaman kami, antarmuka yang rusak berdampak lebih buruk dibandingkan dengan benar-benar menghilangkannya. Misalnya, pada produk seperti Messenger, menyisakan tampilan antarmuka yang rusak kepada pengguna bisa menyebabkan seseorang mengirim pesan ke tujuan yang salah. Kasus yang mirip adalah dalam aplikasi pembayaran, dampak lebih buruk akan terjadi jika aplikasi menampilkan jumlah yang salah, dibandingkan dengan tidak menampilkannya sama sekali..

Perubahan ini berarti, seiring dengan migrasi Anda ke React 16, Anda lebih mungkin menemukan kerusakan yang ada dalam aplikasi, yang sebelumnya belum pernah ditemukan. Penambahan _error boundaries_ dapat digunakan untuk menyediakan pengalaman yang lebih baik bagi pengguna Anda pada saat masalah terjadi.

Misalnya, Facebook Messenger membungkus konten bilah samping, panel info, catatan percakapan, serta input pesan ke dalam _error boundaries_ yang berbeda. Jika beberapa komponen dalam antarmuka tersebut rusak, sisa antarmuka yang tampil tetap masih bersifat interaktif.

Kami juga menyarankan Anda untuk menggunakan layanan pelaporan kesalahan JavaScript (atau buatan Anda sendiri) agar Anda bisa mempelajari tentang eksepsi yang tidak tertangani dalam versi produksi, dan kemudian memperbaikinya.


## _Stack Trace_ Komponen {#component-stack-traces}

React 16 mencetak semua kesalahan yang terjadi dalam proses _render_ ke konsol dalam tahap pengembangan, walau aplikasi tanpa sengaja mengenyampingkannya. Selain pesan kesalahan dan _stack_ JavaScript, React juga menyediakan _stack trace_ komponen. Kini Anda bisa melihat letak kegagalan dalam pohon komponen:
 
<img src="../images/docs/error-boundaries-stack-trace.png" style="max-width:100%" alt="Kesalahan yang ditangkap komponen Error Boundary">

Anda juga bisa melihat nama file dan nomor baris dalam _stack trace_ komponen. Ini berfungsi secara default dalam proyek yang berasal dari [Create React App](https://github.com/facebookincubator/create-react-app):

<img src="../images/docs/error-boundaries-stack-trace-line-numbers.png" style="max-width:100%" alt="Kesalahan yang ditangkap komponen Error Boundary beserta nomor baris">

Jika Anda tidak menggunakan Create React App, Anda bisa menambahkan [_plugin_ ini](https://www.npmjs.com/package/@babel/plugin-transform-react-jsx-source) secara manual dalam konfigurasi Babel Anda. Perhatikan bahwa ini ditujukan untuk tahap pengembangan dan **harus dinonaktifkan dalam tahap produksi**.

> Catatan
>
> Nama komponen yang ditampilkan dalam _stack trace_ tergantung dari properti [`Function.name`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name). Jika Anda mendukung browser dan perangkat versi lawas yang tidak mendukung fitur ini secara _native_ (misalnya, IE 11), pertimbangkan untuk menyertakan _polyfill_ `Function.name` dalam bundel aplikasi Anda, misalnya [`function.name-polyfill`](https://github.com/JamesMGreene/Function.name). Alternatifnya adalah Anda bisa menetapkan properti [`displayName`](/docs/react-component.html#displayname) secara eksplisit untuk semua komponen Anda.


## Bagaimana dengan try/catch? {#how-about-trycatch}

`try` / `catch` sangat baik, tetapi hanya bekerja untuk kode yang imperatif:

```js
try {
  showButton();
} catch (error) {
  // ...
}
```

Sedangkan komponen React bersifat deklaratif dan menentukan *apa* yang harus di-_render_:

```js
<Button />
```

_Error boundaries_ mempertahankan sifat deklaratif React dan berperilaku seperti yang Anda harapkan. Misalnya, walau kesalahan terjadi dalam metode `componentDidUpdate` yang disebabkan oleh `setState` di suatu tempat dalam pohon, kesalahan tersebut masih akan terus merambat dengan benar ke _error boundary_ terdekat.

## Bagaimana dengan _Event Handler_? {#how-about-event-handlers}

_Error boundaries_ **tidak** menangkap kesalahan dalam _event handler_.

React tidak membutuhkan _error boundaries_ untuk memulihkan dari kesalahan dalam _event handler_. Tidak seperti metode _render_ dan _lifecycle_, _event handler_ tidak dijalankan selama proses _render_. Jadi jika kesalahan ini dilontarkan, React masih mengetahui apa yang harus ditampilkan dalam layar.

<<<<<<< HEAD
Jika Anda harus menangkap kesalahan dalam _event handler_, gunakan JavaScript _statement_ `try` / `catch` biasa:
=======
If you need to catch an error inside an event handler, use the regular JavaScript `try` / `catch` statement:
>>>>>>> 5f3a9756e00e256735a5f52df19b403d8fdd3a9d

```js{9-13,17-20}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    try {
      // Lakukan sesuatu yang bisa melontarkan kesalahan
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    if (this.state.error) {
      return <h1>Kesalahan ditangkap.</h1>
    }
    return <button onClick={this.handleClick}>Klik Saya</button>
  }
}
```

Perhatikan bahwa contoh di atas mendemonstrasikan perilaku JavaScript biasa dan tidak menggunakan _error boundaries_.

## Perubahan Nama Sejak React 15 {#naming-changes-from-react-15}

React 15 menyertakan dukungan terbatas untuk _error boundaries_ dengan nama metode yang berbeda: `unstable_handleError`. Metode ini tidak lagi berfungsi dan Anda harus mengubahnya menjadi `componentDidCatch` dalam kode, sejak versi rilis beta 16.

Untuk perubahan ini, kami menyediakan perintah [codemod](https://github.com/reactjs/react-codemod#error-boundaries) untuk memigrasikan kode Anda secara otomatis.
