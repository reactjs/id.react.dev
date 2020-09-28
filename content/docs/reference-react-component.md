---
id: react-component
title: React.Component
layout: docs
category: Reference
permalink: docs/react-component.html
redirect_from:
  - "docs/component-api.html"
  - "docs/component-specs.html"
  - "docs/component-specs-ko-KR.html"
  - "docs/component-specs-zh-CN.html"
  - "tips/UNSAFE_componentWillReceiveProps-not-triggered-after-mounting.html"
  - "tips/dom-event-listeners.html"
  - "tips/initial-ajax.html"
  - "tips/use-react-with-other-libraries.html"
---

Laman ini menjelaskan referensi API mendetail untuk definisi kelas komponen React. Diasumsikan bahwa Anda telah familier dengan konsep dasar React seperti [Komponen dan _Props_](/docs/components-and-props.html) serta [_State_ dan _Lifecycle_](/docs/state-and-lifecycle.html). Jika belum, baca konsep dasar tersebut terlebih dulu.

## Ikhtisar {#overview}

React memungkinkan Anda untuk mendefinisikan komponen sebagai kelas atau fungsi. Untuk saat ini, komponen yang didefinisikan sebagai kelas menyediakan lebih banyak fitur, yang akan dijelaskan secara mendetail di laman ini. Untuk mendefinisikan sebuah kelas komponen React, Anda harus meng-_extend_ `React.Component`:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Halo, {this.props.name}</h1>;
  }
}
```

Satu-satunya metode yang *harus* didefinisikan dalam sebuah subkelas `React.Component` adalah [`render()`](#render). Semua metode lainnya yang dijelaskan dalam laman ini bersifat opsional.

**Kami sangat menyarankan untuk tidak membuat kelas dasar komponen Anda sendiri.** Dalam komponen React, [penggunaan ulang kode diperoleh secara utama lewat metode komposisi, alih-alih menggunakan _inheritance_](/docs/composition-vs-inheritance.html).

>Catatan:
>
>React tidak memaksa Anda untuk menggunakan sintaksis kelas ES6. Jika Anda lebih suka menghindarinya, Anda bisa menggunakan modul `create-react-class` atau abstraksi khusus yang mirip. Anda bisa mempelajarinya lebih lanjut dalam [Menggunakan React tanpa ES6](/docs/react-without-es6.html).

### _Lifecycle_ Komponen {#the-component-_lifecycle_}

Masing-masing komponen memiliki beberapa "metode _lifecycle_"  yang bisa ditimpa untuk menjalankan kode pada waktu tertentu dalam proses. **Anda bisa menggunakan [diagram _lifecycle_ ini](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) sebagai contekan.** Pada daftar berikut, metode _lifecycle_ yang umum digunakan dibedakan dengan **huruf tebal**. Metode lainnya ada untuk kasus yang sangat jarang digunakan.

#### Pemasangan (_Mounting_) {#mounting}

Metode berikut dipanggil secara berurutan ketika sebuah _instance_ komponen sedang dibuat dan disisipkan ke dalam DOM:

- [**`constructor()`**](#constructor)
- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [**`render()`**](#render)
- [**`componentDidMount()`**](#componentdidmount)

>Catatan:
>
>Metode berikut merupakan metode usang dan Anda [harus menghindarinya](/blog/2018/03/27/update-on-async-rendering.html) dalam kode yang baru:
>
>- [`UNSAFE_componentWillMount()`](#unsafe_componentwillmount)

#### Pembaruan {#updating}

Pembaruan bisa disebabkan oleh perubahan pada _props_ atau _state_. Metode berikut dipanggil secara berurutan saat komponen di-_render_ ulang:

- [`static getDerivedStateFromProps()`](#static-getderivedstatefromprops)
- [`shouldComponentUpdate()`](#shouldcomponentupdate)
- [**`render()`**](#render)
- [`getSnapshotBeforeUpdate()`](#getsnapshotbeforeupdate)
- [**`componentDidUpdate()`**](#componentdidupdate)

>Catatan:
>
>Metode berikut merupakan metode usang dan Anda [harus menghindarinya](/blog/2018/03/27/update-on-async-rendering.html) dalam kode yang baru:
>
>- [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate)
>- [`UNSAFE_componentWillReceiveProps()`](#unsafe_componentwillreceiveprops)

#### Pelepasan (_Unmounting_) {#unmounting}

Metode berikut dipanggil saat komponen sedang dihapus dari DOM:

- [**`componentWillUnmount()`**](#componentwillunmount)

#### Penanganan Kesalahan {#error-handling}

Metode berikut dipanggil saat terjadi kesalahan dalam proses _render_, dalam metode _lifecycle_, atau dalam konstruktor semua komponen anak.

- [`static getDerivedStateFromError()`](#static-getderivedstatefromerror)
- [`componentDidCatch()`](#componentdidcatch)

### API Lainnya {#other-apis}

Masing-masing komponen juga menyediakan beberapa API lainnya:

  - [`setState()`](#setstate)
  - [`forceUpdate()`](#forceupdate)

### Properti Kelas {#class-properties}

  - [`defaultProps`](#defaultprops)
  - [`displayName`](#displayname)

### Properti _Instance_ {#instance-properties}

  - [`props`](#props)
  - [`state`](#state)

* * *

## Referensi {#reference}

### Metode _Lifecycle_ yang Sering Digunakan {#commonly-used-lifecycle-methods}

Metode dalam bagian berikut mencakup sebagian besar kasus penggunaan yang Anda hadapi ketika membuat komponen React. **Untuk rujukan visual, lihat [diagram _lifecycle_ ini](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/).**

### `render()` {#render}

```javascript
render()
```

Metode `render()` merupakan satu-satunya metode yang dibutuhkan dalam komponen kelas.

Saat dipanggil, metode ini akan memeriksa `this.props` dan `this.state` serta mengembalikan tipe berikut:

- **Element React.** Umumnya dibuat lewat [JSX](/docs/introducing-jsx.html). Misalnya, `<div />` dan `<MyComponent />` merupakan elemen React yang memerintahkan React untuk me-_render_ sebuah simpul DOM, atau komponen yang didefinisikan pengguna.
- **_Array_ dan _fragment_.** Memungkinkan Anda untuk mengembalikan beberapa elemen sekaligus dari _render_. Lihat dokumentasi tentang [_fragment_](/docs/fragments.html) untuk detail lebih lanjut.
- **_Portal_**. Memungkinkan Anda untuk me-_render_ anak ke subpohon DOM yang berbeda. Lihat dokumentasi tentang [portals](/docs/portals.html) for more details.
- **String dan angka.** Tipe ini akan di-_render_ sebagai simpul teks dalam DOM.
- **Boolean atau `null`**. Tidak me-_render_ (umumnya ada untuk mendukung pola `return test && <Child />`, dengan nilai `test` yang bertipe boolean.)

Fungsi `render()` harus bersifat murni (_pure_), yang berarti fungsi ini tidak mengubah _state_ komponen, mengembalikan hasil yang sama setiap kali dipanggil, dan tidak berinteraksi langsung dengan browser.

Jika Anda harus berinteraksi dengan browser, jalankan prosesnya dalam `componentDidMount()` atau dalam metode _lifecycle_ lainnya saja. Dengan menjaga `render()` bersifat murni, cara kerja komponen lebih mudah dibayangkan.

> Catatan
>
> `render()` tidak akan dipanggil jika [`shouldComponentUpdate()`](#shouldcomponentupdate) mengembalikan nilai false.

* * *

### `constructor()` {#constructor}

```javascript
constructor(props)
```

**Jika Anda tidak menginisialisasi _state_ dan Anda tidak mem-_bind_ metode, Anda tidak perlu mengimplementasikan konstruktor dalam komponen React Anda.**

Konstruktor dalam komponen React dipanggil sebelum dipasang (_mounted_). Saat mengimplementasikan konstruktor untuk subkelas `React.Component`, Anda harus memanggil `super(props)` sebelum _statement_ lainnya. Jika tidak, `this.props` akan bernilai _undefined_ dalam konstruktor, yang bisa menyebabkan _bug_.

Umumnya, konstruktor dalam React hanya digunakan untuk dua tujuan:

* Menginsialisasi [_state_ lokal](/docs/state-and-lifecycle.html) dengan menetapkan sebuah obyek ke `this.state`.
* Mem-_bind_ metode [_event handler_](/docs/handling-events.html) ke sebuah _instance_.

Anda **tidak boleh memanggil `setState()`** dalam `constructor()`. Jika komponen Anda membutuhkan _state_ lokal,, **tetapkan _state_ awal ke `this.state`** secara langsung dalam konstruktor:

```js
constructor(props) {
  super(props);
  // Tidak diperbolehkan memanggil this.setState() di sini!
  this.state = { counter: 0 };
  this.handleClick = this.handleClick.bind(this);
}
```

Konstruktor merupakan satu-satunya tempat untuk menetapkan nilai `this.state` secara langsung. Dalam metode lainnya, Anda harus menggunakan `this.setState()`.

Hindari memperkenalkan efek samping atau langganan (_subscription_) dalam konstruktor. Untuk kasus semacam ini, gunakan `componentDidMount()`.

>Catatan
>
>**Hindari menyalin _prop_ ke _state_! Ini adalah kesalahan yang umum terjadi:**
>
>```js
>constructor(props) {
>  super(props);
>  // Jangan lakukan seperti di bawah ini!
>  this.state = { color: props.color };
>}
>```
>
>Masalahnya adalah keduanya tidak diperlukan sama sekali (Anda bisa menggunakan `this.props.color` secara langsung), dan menyebabkan _bug_ (pembaruan ke _prop_ `color` tidak akan dicerminkan dalam _state_).
>
>**Hanya gunakan pola semacam ini jika Anda secara sengaja ingin mengabaikan pembaruan atas _prop_.** Dalam kasus semacam ini, lebih mudah dipahami jika _prop_ diberi nama `initialColor` atau `defaultColor`. Kemudian Anda bisa memaksa komponen untuk me-"_reset_" _state_ internalnya dengan [mengubah `key`-nya](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) jika diperlukan.
>
>Baca [postingan blog kami tentang menghindari _state_ turunan](/blog/2018/06/07/you-probably-dont-need-derived-state.html) untuk mempelajari lebih lanjut tentang apa yang harus dilakukan jika Anda memerlukan beberapa _state_ yang tergantung pada _prop_.


* * *

### `componentDidMount()` {#componentdidmount}

```javascript
componentDidMount()
```

`componentDidMount()` dipanggil langsung setelah sebuah komponen dipasang (disisipkan ke dalam pohon), Inisialisasi yang membutuhkan simpul DOM harus diletakkan di sini. Jika Anda perlu memuat data dari _endpoint remote_, metode ini merupakan tempat yang baik untuk menginisialisasi permintaan jaringan.

Metode ini merupakan tempat yang baik untuk mempersiapkan langganan (_subscription_). Jika Anda melakukan hal ini, jangan lupa untuk berhenti berlangganan dalam `componentWillUnmount()`.

Anda **bisa langsung memanggil `setState()`** dalam `componentDidMount()`. Ini akan memicu proses _render_ ekstra, tetapi akan terjadi sebelum browser memperbarui layar. Ini menjamin bahwa walau `render()` akan dipanggil dua kali dalam kasus tersebut, pengguna tidak akan melihat _state_ _intermediate_. Gunakan pola ini dengan hati-hati karena sering mengakibatkan masalah kinerja. Dalam berbagai kasus umum, Anda bisa menetapkan _state_ awal dalam `constructor()`. Penggunaan semacam ini mungkin diperlukan untuk kasus seperti kasus modal dan _tooltip_, misalnya Anda harus mengukur simpul DOM sebelum me-_render_ sesuatu yang tergantung pada ukuran atau posisinya.

* * *

### `componentDidUpdate()` {#componentdidupdate}

```javascript
componentDidUpdate(prevProps, prevState, snapshot)
```

`componentDidUpdate()` langsung dipanggil setelah terjadi perubahan. Metode ini tidak dipanggil dalam proses _render_ awal.

Gunakan metode ini sebagai kesempatan untuk beroperasi pada DOM ketika komponen diperbarui. Metode ini juga merupakan tempat yang baik untuk menjalankan pemanggilan jaringan, selama Anda bisa membandingkan _prop_ saat ini dengan _prop_ sebelumnya (misalnya, permintaan jaringan mungkin tidak diperlukan jika _prop_ tidak berubah).

```js
componentDidUpdate(prevProps) {
  // Penggunaan umum (Jangan lupa untuk membandingkan _props_):
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

Anda **bisa langsung memanggil `setState()`** dalam `componentDidUpdate()` tetapi perhatikan bahwa **pemanggilannya harus dibungkus dalam sebuah kondisi** seperti contoh di atas, atau Anda akan mengakibatkan perulangan yang tak terbatas. Ini juga akan mengakibatkan proses _render_ ekstra yang walau tidak tampak ke pengguna, bisa berdampak pada kinerja komponen. Jika Anda mencoba "mencerminkan" beberapa _state_ ke sebuah _prop_ yang datang dari tingkat yang lebih tinggi, pertimbangkan untuk menggunakan secara langsung _prop_-nya. Baca lebih lanjut tentang [mengapa menyalin _props_ ke _state_ bisa menyebabkan _bug_](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

Jika komponen Anda mengimplementasikan _lifecycle_ `getSnapshotBeforeUpdate()` (yang sangat jarang), nilai yang dikembalikan akan diteruskan sebagai parameter "_snapshot_" ketiga ke  `componentDidUpdate()`. Jika tidak, parameter ini akan bernilai _undefined_.

> Catatan
>
> `componentDidUpdate()` tidak akan dipanggil jika [`shouldComponentUpdate()`](#shouldcomponentupdate) mengembalikan nilai false.

* * *

### `componentWillUnmount()` {#componentwillunmount}

```javascript
componentWillUnmount()
```

`componentWillUnmount()` dipanggil langsung sebelum komponen dilepas dan dihancurkan. Lakukan pembersihan yang diperlukan, misalnya menghancurkan _timer_, membatalkan permintaan jaringan, atau membersihkan semua langganan yang dibuat dalam `componentDidMount()`.

Anda **tidak boleh memanggil `setState()`** dalam `componentWillUnmount()` karena komponen tidak akan pernah di-_render_ ulang. Segera setelah komponen dilepas, komponen tersebut tidak akan dipasang kembali.

* * *

### Metode _Lifecycle_ yang Jarang Digunakan {#rarely-used-_lifecycle_-methods}

Metode dalam bagian berikut terkait dengan kasus penggunaan yang tidak umum. Metode berikut terkadang berguna, tetapi sebagian besar komponen Anda mungkin tidak membutuhkannya. **Anda bisa melihat metode berikut dalam [diagram _lifecycle_ ini](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/) jika Anda mengeklik kotak centang "Tampilkan _lifecycle_ yang kurang umum" di bagian atas.**


### `shouldComponentUpdate()` {#shouldcomponentupdate}

```javascript
shouldComponentUpdate(nextProps, nextState)
```

Gunakan `shouldComponentUpdate()` untuk memberi tahu React jika output komponen tidak dipengaruhi oleh perubahan yang terjadi dalam _state_ atau _prop_. Perilaku default adalah menjalankan proses _render_ untuk setiap perubahan _state_ atau _props_. Dalam hampir semua kasus, Anda seharusnya mengandalkan perilaku default ini.

`shouldComponentUpdate()` dipanggil sebelum proses _render_ ketika nilai baru _prop_ atau _state_ diterima. Nilai kembalian default metode ini adalah `true`. Metode ini tidak dipanggil dalam proses _render_ awal atau ketika `forceUpdate()` digunakan.

Metode ini hanya ada karena alasan **[optimalisasi kinerja](/docs/optimizing-performance.html).** Jangan mengandalkan metode ini untuk "mencegah" proses _render_ karena akan menyebabkan _bug_. **Pertimbangkan untuk menggunakan [`PureComponent`](/docs/react-api.html#reactpurecomponent)** yang sudah ada, alih-alih menulis `shouldComponentUpdate()` secara manual. `PureComponent` akan menjalankan perbandingan dangkal (_shallow comparison_) atas _props_ dan _state_, dan mengurangi kemungkinan untuk melewatkan pembaruan yang diperlukan.

Jika Anda yakin untuk menuliskannya secara manual, Anda bisa membandingkan `this.props` dengan `nextProps` serta `this.state` dengan `nextState` dan kemudian mengembalikan `false` untuk memberi tahu React bahwa pembaruan bisa dilewati. Harap diingat bahwa mengembalikan `false` tidak mencegah komponen anak untuk di-_render_ ketika _state_ komponen anak berubah.

Kami tidak menyarankan untuk memeriksa pembandingan secara mendalam (_deep equality check_) atau menggunakan `JSON.stringify()` dalam `shouldComponentUpdate()`. Cara ini sangat tidak efisien dan berdampak buruk pada kinerja.

Saat ini, jika `shouldComponentUpdate()` mengembalikan `false`, maka [`UNSAFE_componentWillUpdate()`](#unsafe_componentwillupdate), [`render()`](#render), dan [`componentDidUpdate()`](#componentdidupdate) tidak akan dipanggil. Di masa datang, React mungkin akan memperlakukan `shouldComponentUpdate()` hanya sebagai panduan, alih-alih sebagai prasyarat yang ketat, dan mengembalikan nilai `false` masih memungkinkan untuk me-_render_ komponen yang bersangkutan.

* * *

### `static getDerivedStateFromProps()` {#static-getderivedstatefromprops}

```js
static getDerivedStateFromProps(props, state)
```

<<<<<<< HEAD
`getDerivedStateFromProps` dipanggil langsung sebelum memanggil metode _render_, baik saat pemasangan awal (_initial mount_) maupun dalam pembaruan selanjutnya. Metode ini mengembalikan sebuah obyek untuk memperbarui _state_, atau _null_ untuk tidak memperbarui.
=======
`getDerivedStateFromProps` is invoked right before calling the render method, both on the initial mount and on subsequent updates. It should return an object to update the state, or `null` to update nothing.
>>>>>>> 32e3c7a6f92cb6580eb38c047960805d5998c2ec

Metode ini ada untuk [kasus yang sangat jarang](/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state), yaitu saat _state_ tergantung pada perubahan dalam _props_ dalam sebuah kurun waktu. Misalnya, mungkin sangat berguna untuk mengimplementasikan sebuah komponen `<Transition>`, yang membandingkan anak sebelum dan selanjutnya untuk menentukan yang mana yang akan dianimasikan atau tidak.

Menurunkan _state_ bisa menyebabkan kode lebih bertele-tele dan membuat komponen Anda susah dibayangkan.  
[Pastikan Anda mengenal alternatif yang lebih sederhana:](/blog/2018/06/07/you-probably-dont-need-derived-state.html)

* Jika Anda perlu **menjalankan efek samping** (misalnya, pengambilan data atau animasi) sebagai reaksi atas perubahan _props_, gunakan _lifecycle_ [`componentDidUpdate`](#componentdidupdate).

* Jika Anda ingin **menghitung ulang beberapa data hanya ketika terjadi perubahan _props_**, [gunakan _helper_ _memoization_](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).

* Jika Anda ingin **"me-_reset_" beberapa _state_ ketika terjadi perubahan _props_**, pertimbangkan untuk membuat komponen [dikontrol secara lengkap](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) atau [dikontrol lengkap bersama dengan `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

Metode ini tidak memiliki akses ke _instance_ komponen. Jika diinginkan, Anda bisa menggunakan ulang kode di antara beberapa `getDerivedStateFromProps()` dengan metode lain dalam kelas, dengan mengekstrak fungsi murni _props_ dan _state_ komponen di luar definisi kelas.

Perhatikan bahwa metode ini dipanggil dalam *setiap* _render_, tanpa memperhatikan sebabnya. Ini berbeda dengan `UNSAFE_componentWillReceiveProps`, yang akan dipanggil saat induk menyebabkan proses _render_ ulang dan bukan disebabkan oleh `setState` lokal.

* * *

### `getSnapshotBeforeUpdate()` {#getsnapshotbeforeupdate}

```javascript
getSnapshotBeforeUpdate(prevProps, prevState)
```

`getSnapshotBeforeUpdate()` dipanggil langung setelah output hasil _render_ terbaru di-_commit_, misalnya ke DOM. Metode ini memungkinkan komponen Anda untuk menangkap informasi dari DOM (misalnya posisi _scroll_) sebelum nilainya mungkin berubah. Semua nilai yang dikembalikan _lifecycle_ ini akan diteruskan sebagai parameter ke `componentDidUpdate()`.

Kasus penggunaan ini tidak umum, tetapi mungkin terjadi dalam antarmuka seperti utas _chatting_ yang harus menangani posisi _scroll_ secara khusus.

Nilai _snapshot_ (atau `null`) harus dikembalikan.

Misalnya:

`embed:react-component-reference/get-snapshot-before-update.js`

Pada contoh di atas, sangat penting untuk membaca properti `scrollHeight` dalam `getSnapshotBeforeUpdate` karena mungkin ada penundaan antara _lifecycle_ tahap "_render_" (misalnya metode `render`) dan _lifecycle_ tahap "_commit_" (misalnya `getSnapshotBeforeUpdate` dan `componentDidUpdate`).

* * *

### _Error Boundary_ {#error-boundaries}

[_Error boundary_ (pembatas kesalahan)](/docs/error-boundaries.html) merupakan komponen React yang menangkap kesalahan JavaScript di semua tempat di dalam pohon komponen, mencatat kesalahan tersebut, dan menampilkan antarmuka darurat (_fallback_) alih-alih menampilkan pohon komponen yang rusak. _Error boundary_ menangkap kesalahan dalam proses _render_, dalam metode _lifecycle_, dan dalam konstruktor dari keseluruhan pohon di bawahnya.

Sebuah komponen kelas menjadi komponen _error boundary_ jika komponen tersebut mendefinisikan salah satu (atau kedua) metode _lifecycle_ `static getDerivedStateFromError()` atau `componentDidCatch()`. Pembaruan _state_ dari _lifecycle_ tersebut dapat digunakan untuk menangkap kesalahan JavaScript yang tidak tertangani dalam pohon dan menampilkan antarmuka darurat.

Hanya gunakan komponen _error boundary_ untuk proses pemulihan dari eksepsi yang tidak diharapkan; **jangan menggunakannya dalam alur program.**

Untuk detail lebih lanjut, lihat [*Penanganan Kesalahan dalam React 16*](/blog/2017/07/26/error-handling-in-react-16.html).

> Catatan
> 
> _Error boundary_ hanya akan menangkap kesalahan dalam komponen **di bawah** pohon. Sebuah komponen _error boundary_ tidak dapat menangkap kesalahan dari dalam dirinya sendiri.

### `static getDerivedStateFromError()` {#static-getderivedstatefromerror}
```javascript
static getDerivedStateFromError(error)
```

_Lifecycle_ ini dipanggil setelah sebuah kesalahan dilontarkan oleh komponen turunan.
_Lifecycle_ ini menerima kesalahan yang dilontarkan sebagai sebuah parameter dan harus mengembalikan nilai untuk memperbarui _state_.

```js{7-10,13-16}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state agar proses render berikutnya akan menampilkan antarmuka darurat.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Anda bisa menampilkan antarmuka darurat Anda di sini
      return <h1>Terjadi masalah.</h1>;
    }

    return this.props.children; 
  }
}
```

> Catatan
>
> `getDerivedStateFromError()` dipanggil dalam tahap "_render_", jadi efek samping tidak diizinkan.
Untuk kasus penggunaan efek samping, gunakan `componentDidCatch()`.

* * *

### `componentDidCatch()` {#componentdidcatch}

```javascript
componentDidCatch(error, info)
```

_Lifecycle_ ini dipanggil setelah terjadi sebuah kesalahan yang dilontarkan oleh komponen turunan.
_Lifecycle_ menerima dua parameter:

1. `error` - Kesalahan yang dilontarkan.
2. `info` - Sebuah objek yang berisi _key_ `componentStack` yang mengandung [informasi tentang komponen yang melontarkan kesalahan](/docs/error-boundaries.html#component-stack-traces).


`componentDidCatch()` dipanggil dalam tahap "_commit_" sehingga efek samping masih diizinkan.
_Lifecycle_ ini seharusnya digunakan untuk pencatatan kesalahan:

```js{12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state agar proses render berikutnya akan menampilkan antarmuka darurat.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Contoh "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logComponentStackToMyService(info.componentStack);
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

> Catatan
> 
> Pada peristiwa kesalahan berikutnya, Anda bisa me-_render_ antarmuka darurat lewat `componentDidCatch()` dengan memanggil `setState`, tetapi hal ini akan menjadi usang dalam rilis masa mendatang.
> Gunakan `static getDerivedStateFromError()` untuk menangani proses _render_ kesalahan.

* * *

### Metode _Lifecycle_ _Legacy_ {#legacy-_lifecycle_-methods}

Metode _lifecycle_ di bawah ini ditandai sebagai "_legacy_". Metode tersebut masih berfungsi, tetapi kami tidak menyarankan untuk menggunakannya dalam kode baru. Anda bisa mempelajari lebih lanjut tentang migrasi dari metode _lifecycle_ _legacy_ [dalam postingan blog ini](/blog/2018/03/27/update-on-async-rendering.html).

### `UNSAFE_componentWillMount()` {#unsafe_componentwillmount}

```javascript
UNSAFE_componentWillMount()
```

> Catatan
>
> Metode _lifecycle_ ini sebelumnya diberi nama `componentWillMount`. Nama tersebut masih akan berfungsi hingga versi 17. Gunakan perintah [codemod `rename-unsafe-lifecycle`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycle) untuk memperbarui komponen Anda secara otomatis.

`UNSAFE_componentWillMount()` dipanggil sebelum proses pemasangan terjadi. Metode ini dipanggil sebelum `render()`, sehingga pemanggilan `setState()` secara sinkronus dalam metode ini tidak akan memicu proses _render_ ekstra. Secara umum, kami menyarankan menggunakan `constructor()` untuk menginisialisasi _state_.

Hindari memperkenalkan efek samping atau langganan dalam metode ini. Untuk kasus penggunaan ini, gunakan `componentDidMount()`.

Metode ini adalah satu-satunya metode _lifecycle_ yang dipanggil dalam proses _render_ sisi server.

* * *

### `UNSAFE_componentWillReceiveProps()` {#unsafe_componentwillreceiveprops}

```javascript
UNSAFE_componentWillReceiveProps(nextProps)
```

> Catatan
>
> Metode _lifecycle_ ini sebelumnya diberi nama  `componentWillReceiveProps`. Nama tersebut masih akan berfungsi hingga versi 17. Gunakan perintah [codemod `rename-unsafe-lifecycle`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycle) untuk memperbarui komponen Anda secara otomatis.

> Catatan:
>
> Penggunaan _lifecycle_ ini seringkali menyebabkan _bug_ dan ketidakkonsistenan
>
> * Jika Anda perlu **menjalankan efek samping** (misalnya, pengambilan data atau animasi) sebagai reaksi atas perubahan _props_, gunakan _lifecycle_ [`componentDidUpdate`](#componentdidupdate).
> * Jika Anda menggunakan `componentWillReceiveProps` untuk **menghitung ulang beberapa data hanya ketika terjadi perubahan _props_**, [gunakan _helper_ _memoization_](/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization).
> * Jika Anda menggunakan `componentWillReceiveProps` untuk **"me-_reset_" beberapa _state_ ketika terjadi perubahan _props_**, pertimbangkan untuk membuat komponen [dikontrol secara lengkap](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) atau [dikontrol lengkap bersama dengan `key`](/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

>
> Untuk kasus penggunaan lainnya, [ikuti rekomendasi dalam postingan blog ini tentang _state_ turunan](/blog/2018/06/07/you-probably-dont-need-derived-state.html).

`UNSAFE_componentWillReceiveProps()` dipanggil sebelum komponen yang dipasang menerima _props_ baru. Jika Anda perlu untuk memperbarui _state_ sebagai reaksi atas perubahan _prop_ (misalnya untuk me-_reset_-nya), Anda bisa membandingkan `this.props` dam `nextProps` serta melakukan transisi _state_ menggunakan `this.setState()` dalam metode ini.

Perhatikan bahwa jika komponen induk menyebabkan komponen Anda di-_render_ ulang, metode ini akan tetap dipanggil walau _props_ Anda tidak berubah. Pastikan untuk membandngkan nilai saat ini dan nilai setelahnya jika Anda hanya ingin menangani perubahan.

React tidak memanggil `UNSAFE_componentWillReceiveProps()` dengan _props_ awal dalam proses [pemasangan](#mounting). React hanya memanggil metode ini jika beberapa _props_ komponen mungkin akan diperbarui. Pemanggilan `this.setState()` secara umum tidak akan memicu `UNSAFE_componentWillReceiveProps()`.

* * *

### `UNSAFE_componentWillUpdate()` {#unsafe_componentwillupdate}

```javascript
UNSAFE_componentWillUpdate(nextProps, nextState)
```

> Catatan
>
> Metode _lifecycle_ ini sebelumnya diberi nama `componentWillUpdate`. Nama tersebut masih akan berfungsi hingga versi 17. Gunakan perintah [codemod `rename-unsafe-lifecycle`](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycle) untuk memperbarui komponen Anda secara otomatis.

`UNSAFE_componentWillUpdate()` dipanggil sebelum proses _render_ ketika _props_ atau _state_ baru sedang diterima. Gunakan metode ini sebagai kesempatan untuk menjalankan persiapan sebelum proses pembaruan terjadi. Metode ini tidak dipanggil untuk _render_ awal.

Perhatikan bahwa Anda tidak bisa memanggil `this.setState()` di sini, dan juga Anda tidak boleh melakukan hal lain (misalnya, _dispatch_ atau aksi Redux) yang bisa memicu sebuah pembaruan atas komponen React sebelum pengembalian oleh `UNSAFE_componentWillUpdate()`.

Umumnya, metode ini bisa digantikan oleh `componentDidUpdate()`. Jika Anda membaca dari sisi DOM dalam metode ini (misalnya, untuk menyimpan posisi _scroll_), Anda bisa memindahkan logikanya ke metode `getSnapshotBeforeUpdate()`.

> Catatan
>
> `UNSAFE_componentWillUpdate()` tidak akan dipanggil jika [`shouldComponentUpdate()`](#shouldcomponentupdate) mengembalikan nilai false.

* * *

## API Lainnya {#other-apis-1}

Tidak seperti metode _lifecycle_ di atas (yang akan dipanggil oleh React untuk Anda), metode berikut merupakan metode yang bisa *Anda* panggil dari dalam komponen Anda.

Hanya ada dua metode, yaitu: `setState()` dan `forceUpdate()`.

### `setState()` {#setstate}

```javascript
setState(updater, [callback])
```

`setState()` mengantrekan perubahan atas _state_ komponen dan memberi tahu React bahwa komponen ini beserta anaknya harus di-_render_ ulang dengan _state_ terbaru. Metode ini merupakan metode utama yang Anda gunakan untuk memperbarui antarmuka sebagai reaksi atas _event handler_ dan balasan server.

Anda bisa memandang `setState()` sebagai sebuah *_request_* alih-alih memandangnya sebagai perintah perantara untuk memperbarui komponen. Untuk kinerja yang secara persepsi lebih baik, React mungkin menundanya, dan kemudian memperbarui beberapa komponen dalam sekali jalan. React tidak menjamin bahwa perubahan _state_ akan selalu diterapkan secara langsung.

`setState()` tidak selalu langsung memperbarui komponen. Metode ini mungkin mengelompokkan pemanggilan atau menunda pembaruan untuk dilakukan nanti. Hal ini menyebabkan pembacaan `this.state` langsung setelah memanggil `setState()` menjadi sebuah jebakan tersembunyi. Alih-alih menggunakan cara tersebut, gunakan `componentDidUpdate` atau _callback_ `setState` (`setState(updater, callback)`), yang dijamin akan dipanggil setelah pembaruan diterapkan. Jika Anda perlu untuk menetapkan _state_ berdasarkan _state_ sebelumnya, baca tentang argumen `updater` di bawah ini.

`setState()` akan selalu menyebabkan proses _render_ ulang, kecuali jika `shouldComponentUpdate()` mengembalikan nilai `false`. Jika obyek _mutable_ digunakan dan logika _render_ kondisional tidak bisa diimplementasikan dalam `shouldComponentUpdate()`, pemanggilan `setState()` ketika _state_ baru berbeda dengan _state_ sebelumnya akan menghindari proses _render_ ulang yang tidak perlu.

Argumen pertama merupakan fungsi `updater` dengan tanda tangan sebagai berikut:

```javascript
(state, props) => stateChange
```

`state` merupakan referensi ke _state_ komponen pada saat perubahan sedang diterapkan. Referensi ini seharusnya tidak boleh langsung bermutasi, tetapi perubahan seharusnya direpresentasikan dengan membangun obyek baru berdasarkan input dari `state` dan `props`. Misalnya, asumsikan kita ingin menaikkan sebuah nilai dalam _state_ dengan `props.step`:

```javascript
this.setState((state, props) => {
  return {counter: state.counter + props.step};
});
```

Baik `state` maupun `props` yang diterima fungsi `updater` akan dijamin selalu yang terbaru. Output dari `updater` akan digabungkan secara dangkal dengan `state`.

Parameter kedua dalam `setState()` merupakan logika _callback_ opsional yang akan dijalankan segera setelah `setState` diselesaikan dan komponen di-_render_ ulang. Umumnya, kami menyarankan untuk menggunakan `componentDidUpdate()` untuk logika semacam ini.

Alih-alih sebuah fungsi, Anda bisa meneruskan sebuah obyek secara opsional sebagai argumen ke `setState()`:

```javascript
setState(stateChange[, callback])
```

Ini akan melakukan penggabungan dangkal dari `stateChange` menjadi _state_ yang baru, misalnya untuk memperbarui jumlah item dalam keranjang belanja:

```javascript
this.setState({quantity: 2})
```

Bentuk `setState()` juga bersifat sinkronus, dan pemanggilan berulang kali dalam siklus yang sama mungkin akan dikelompokkan sekaligus. Misalnya, jika Anda berusaha untuk menaikkan jumlah item lebih dari sekali dalam siklus yang sama, hasilnya akan sama dengan pemanggilan sebagai berikut:

```javaScript
Object.assign(
  previousState,
  {quantity: state.quantity + 1},
  {quantity: state.quantity + 1},
  ...
)
```

Pemanggilan berikutnya akan menimpa nilai dari pemanggilan sebelumnya dalam siklus yang sama, sehingga jumlah di atas hanya akan dinaikkan sekali saja. Jika _state_ selanjutnya bergantung pada _state_ saat ini, kami sarankan untuk menggunakan bentuk fungsi `updater` saja:

```js
this.setState((_state_) => {
  return {quantity: state.quantity + 1};
});
```

Untuk detail lebih lanjut, baca:

* [_State_ dan _Lifecycle_](/docs/state-and-lifecycle.html)
* [Pembahasan mendalam: Kapan dan mengapa pemanggilan `setState()` dikelompokkan?](https://stackoverflow.com/a/48610973/458193)
* [Pembahasan mendalam: Mengapa `this.state` tidak diperbarui secara langsung?](https://github.com/facebook/react/issues/11527#issuecomment-360199710)

* * *

### `forceUpdate()` {#forceupdate}

```javascript
component.forceUpdate(callback)
```

Secara default, ketika _state_ atau _props_ komponen Anda berubah, komponen Anda akan di-_render_ ulang. Jika metode `render()` Anda tergantung pada beberapa data lain, Anda bisa memberi tahu React bahwa komponen Anda harus di-_render_ ulang dengan memanggil `forceUpdate()`.

Pemanggilan `forceUpdate()` akan menyebabkan pemanggilan `render()` dalam komponen, dan melewatkan `shouldComponentUpdate()`. Hal ini akan memicu metode _lifecycle_ normal untuk komponen anak, termasuk metode `shouldComponentUpdate()` masing-masing anak. React masih akan memperbarui DOM jika _markup_-nya berubah.

Umumnya, Anda harus sejauh mungkin menghindari semua penggunaan `forceUpdate()` dan hanya membaca dari `this.props` dan `this.state` dalam `render()`.

* * *

## Properti Kelas {#class-properties-1}

### `defaultProps` {#defaultprops}

<<<<<<< HEAD
`defaultProps` dapat didefinisikan sebagai properti dalam kelas komponen itu sendiri, yang digunakan untuk menetapkan _props_ default pada kelas tersebut. Ini digunakan untuk _props_ yang bernilai _undefined_ tetapi tidak untuk _props_ yang bernilai _null_. Misalnya:
=======
`defaultProps` can be defined as a property on the component class itself, to set the default props for the class. This is used for `undefined` props, but not for `null` props. For example:
>>>>>>> 32e3c7a6f92cb6580eb38c047960805d5998c2ec

```js
class CustomButton extends React.Component {
  // ...
}

CustomButton.defaultProps = {
  color: 'blue'
};
```

Jika `props.color` tidak disediakan, nilainya akan ditetapkan secara default sebagai `'blue'`:

```js
  render() {
    return <CustomButton /> ; // Nilai props.color akan ditetapkan menjadi blue
  }
```

<<<<<<< HEAD
Jika `props.color` ditetapkan bernilai _null_, nilainya akan tetap _null_:
=======
If `props.color` is set to `null`, it will remain `null`:
>>>>>>> 32e3c7a6f92cb6580eb38c047960805d5998c2ec

```js
  render() {
    return <CustomButton color={null} /> ; // Nilai props.color akan tetap _null_
  }
```

* * *

### `displayName` {#displayname}

String `displayName` digunakan untuk proses _debug_. Umumnya, Anda tidak perlu menetapkannya secara eksplisit karena nilainya diturunkan dari nama fungsi atau kelas yang mendefinisikan komponen. Anda mungkin ingin menetapkan nilainnya secara eksplisit jika Anda ingin menampilkannya dengan nama yang berbeda untuk keperluan _debug_ atau jika Anda membuat _higher-order component_, baca [Pembungkusan _displayName_ untuk Mempermudah _Debug_](/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging) untuk detail lebih lanjut.

* * *

## Properti _Instance_ {#instance-properties-1}

### `props` {#props}

`this.props` mengandung _props_ yang didefinisikan oleh pemanggil komponen ini. Lihat [Komponen dan _Props_](/docs/components-and-props.html) untuk panduan pengantar _props_.

Secara khusus, `this.props.children` merupakan _prop_ yang bersifat khusus, yang umumnya didefinisikan oleh tag anak dalam ekspresi JSX, alih-alih dalam tagnya sendiri.

### `state` {#_state_}

_state_ mengandung data khusus untuk komponen, yang bisa berubah sepanjang waktu. Nilai _state_ didefinisikan oleh pengguna dan harus berupa obyek JavaScript biasa.

Jika beberapa nilai tidak digunakan untuk proses _render_ atau aliran data (misalnya ID _timer_), Anda tidak perlu meletakkannya dalam _state_. Nilai semacam ini bisa didefinisikan sebagai _field_ dalam _instance_ komponen.

Lihat [_State_ dan _Lifecycle_](/docs/state-and-lifecycle.html) untuk informasi lebih lanjut tentang _state_.

Jangan pernah mengubah `this.state` secara langsung, karena pemanggilan `setState()` berikutnya bisa menimpa perubahan yang Anda buat. Perlakukan `this.state` seperti halnya bersifat _immutable_.
