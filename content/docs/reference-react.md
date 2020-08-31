---
id: react-api
title: API Tingkat Atas React
layout: docs
category: Reference
permalink: docs/react-api.html
redirect_from:
  - "docs/reference.html"
  - "docs/clone-with-props.html"
  - "docs/top-level-api.html"
  - "docs/top-level-api-ja-JP.html"
  - "docs/top-level-api-ko-KR.html"
  - "docs/top-level-api-zh-CN.html"
---

`React` merupakan _entry point_ untuk menggunakan _library_ React. Apabila Anda mengimpor React menggunakan _tag_ `<script>`, _API_ tingkat atas ini tersedia pada `React` _global_. Apabila Anda menggunakan ES6 dengan npm, Anda dapat mengimpor React dengan menuliskan `import React from 'react'`. Apabila Anda menggunakan ES5 dengan npm, Anda dapat mengimpor React dengan menuliskan `var React = require('react')`.

## Ikhtisar {#overview}

### Komponen {#components}

Komponen React membuat Anda dapat memisahkan antarmuka pengguna menjadi bagian yang independen dan dapat digunakan kembali, serta dapat dipikirkan secara terpisah. Komponen React dapat didefinisikan dengan melakukan _subclassing_ pada kelas  `React.Component` atau `React.PureComponent`.

 - [`React.Component`](#reactcomponent)
 - [`React.PureComponent`](#reactpurecomponent)

Apabila Anda tidak menggunakan kelas ES6, Anda dapat menggunakan modul `create-react-class`. Kunjungi [Menggunakan React Tanpa ES6](/docs/react-without-es6.html) untuk informasi selengkapnya.

Komponen React juga dapat didefinisikan sebagai fungsi yang dapat dibungkus:

- [`React.memo`](#reactmemo)

### Membuat Elemen React {#creating-react-elements}

Kami menyarankan untuk [menggunakan JSX](/docs/introducing-jsx.html) untuk mendeskripsikan bagaimana tampilan antarmuka pengguna Anda seharusnya terlihat. Setiap elemen JSX merupakan _syntactic sugar_ untuk memanggil [`React.createElement()`](#createelement). Anda tidak perlu memanggil _method_ berikut secara langsung apabila Anda menggunakan JSX.

- [`createElement()`](#createelement)
- [`createFactory()`](#createfactory)

Kunjungi [Menggunakan React tanpa JSX](/docs/react-without-jsx.html) untuk informasi selengkapnya.

### Mengubah Elemen {#transforming-elements}

`React` menyediakan beberapa _API_ untuk memanipulasi elemen:

- [`cloneElement()`](#cloneelement)
- [`isValidElement()`](#isvalidelement)
- [`React.Children`](#reactchildren)

### Fragments {#fragments}

`React` juga menyediakan komponen untuk me-_render_ lebih dari satu elemen tanpa perlu menggunakan pembungkus.

- [`React.Fragment`](#reactfragment)

### Refs {#refs}

- [`React.createRef`](#reactcreateref)
- [`React.forwardRef`](#reactforwardref)

### Suspense {#suspense}

_Suspense_ membuat komponen dapat "menunggu" sesuatu sebelum melakukan _rendering_. Untuk saat ini, _Suspense_ hanya mendukung satu kasus penggunaan: [membuat komponen secara dinamis menggunakan `React.lazy`](/docs/code-splitting.html#reactlazy). Pada masa yang akan datang, _Suspense_ akan mendukung penggunaan lain seperti pengambilan data.

- [`React.lazy`](#reactlazy)
- [`React.Suspense`](#reactsuspense)

### Hooks {#hooks}

_Hooks_ merupakan fitur baru pada React 16.8. _Hook_ membuat Anda dapat menggunakan _state_ dan fitur React lain tanpa menuliskan sebuah kelas. _Hooks_ memiliki [bagian dokumentasi tersendiri](/docs/hooks-intro.html) dan terpisah dengan referensi _API_:

- [Basic Hooks](/docs/hooks-reference.html#basic-hooks)
  - [`useState`](/docs/hooks-reference.html#usestate)
  - [`useEffect`](/docs/hooks-reference.html#useeffect)
  - [`useContext`](/docs/hooks-reference.html#usecontext)
- [Additional Hooks](/docs/hooks-reference.html#additional-hooks)
  - [`useReducer`](/docs/hooks-reference.html#usereducer)
  - [`useCallback`](/docs/hooks-reference.html#usecallback)
  - [`useMemo`](/docs/hooks-reference.html#usememo)
  - [`useRef`](/docs/hooks-reference.html#useref)
  - [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)
  - [`useLayoutEffect`](/docs/hooks-reference.html#uselayouteffect)
  - [`useDebugValue`](/docs/hooks-reference.html#usedebugvalue)

* * *

## Referensi {#reference}

### `React.Component` {#reactcomponent}

`React.Component` merupakan kelas pokok untuk komponen React ketika didefinisikan menggunakan [kelas ES6](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes):

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Halo, {this.props.name}</h1>;
  }
}
```

Kunjungi [Referensi API React.Component](/docs/react-component.html) untuk melihat daftar _method_ dan _property_ yang berhubungan dengan kelas `React.Component`.

* * *

### `React.PureComponent` {#reactpurecomponent}

`React.PureComponent` mirip dengan [`React.Component`](#reactcomponent). Perbedaannya adalah [`React.Component`](#reactcomponent) tidak mengimplementasikan [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate), sedangkan `React.PureComponent` mengimplementasikannya dengan perbandingan _props_ dan _state_ secara dangkal (_shallow_). 

Apabila fungsi `render()` pada komponen React Anda me-_render_ hasil yang sama dengan _props_ dan _state_ yang sama juga, Anda dapat menggunakan `React.PureComponent` untuk meningkatkan kinerja komponen pada kasus tertentu.

> Catatan
>
> `shouldComponentUpdate()` pada `React.PureComponent` hanya membandingkan objek secara dangkal (_shallow compare_). Apabila objek tersebut berisi struktur data yang rumit dan dalam, bisa jadi hal ini akan menghasilkan _false-negative_ pada perbandingan yang lebih dalam. Gunakan `PureComponent` hanya ketika Anda memiliki _props_ dan _state_ yang dangkal, atau gunakan [`forceUpdate()`](/docs/react-component.html#forceupdate) saat Anda tahu bahwa ada perubahan pada struktur data yang dalam. Atau, cobalah untuk menggunakan [_immutable object_](https://facebook.github.io/immutable-js/) untuk mempercepat proses perbandingan data bersarang.
>
> Selain itu, `shouldComponentUpdate()` pada `React.PureComponent` melewati proses pembaruan _props_ pada seluruh komponen dibawahnya. Jadi pastikan semua komponen anaknya juga "_pure_".

* * *

### `React.memo` {#reactmemo}

```javascript
const MyComponent = React.memo(function MyComponent(props) {
  /* render menggunakan props */
});
```

<<<<<<< HEAD
`React.memo` merupakan sebuah [_higher order component_](/docs/higher-order-components.html). Ia mirip dengan [`React.PureComponent`](#reactpurecomponent) tapi alih - alih untuk _class component_ ia digunakan untuk _function component_.

Apabila _function component_ Anda me-_render_ hasil yang sama jika diberikan _props_ yang sama juga, Anda dapat membungkusnya dengan menggunakan `React.memo` untuk meningkatkan kinerjanya dengan cara menyimpan (_memoize_) hasil _render_-nya. Ini artinya React akan melewati proses _render_ komponen, dan menggunakan hasil _render_ terakhir.
=======
`React.memo` is a [higher order component](/docs/higher-order-components.html).

If your component renders the same result given the same props, you can wrap it in a call to `React.memo` for a performance boost in some cases by memoizing the result. This means that React will skip rendering the component, and reuse the last rendered result.
>>>>>>> 25cc703d1f23f1782ff96c5c7882a806f8741ec4

`React.memo` hanya berefek kepada _props_ yang berubah. Jika komponen Anda yang dibungkus dengan `React.memo` memiliki *Hooks* [`useState`](/docs/hooks-state.html) atau [`useContext`](/docs/hooks-reference.html#usecontext) dalam implementasinya, komponen itu akan tetap me-_render_ ulang apabila _state_ atau _context_ berubah.

Secara bawaan `React.memo` hanya akan membandingkan objek yang kompleks pada objek _props_ secara dangkal (_shallow comparison_). Apabila Anda ingin membuat perbandingan sendiri, Anda juga dapat memberikan fungsi pembanding _custom_ sebagai argumen kedua.

```javascript
function MyComponent(props) {
  /* render menggunakan props */
}
function areEqual(prevProps, nextProps) {
  /*
  mengembalikan nilai true apabila dengan mengoper nextProps ke render akan mengembalikan
  hasil yang sama seperti mengoper prevProps ke render,
  selain itu akan mengembalikan nilai false
  */
}
export default React.memo(MyComponent, areEqual);
```

_Method_ ini hanya digunakan sebagai **[optimasi kinerja](/docs/optimizing-performance.html).** Jangan menggunakannya untuk "mencegah" _render_, karena dapat menyebabkan _bug_.

> Catatan
>
> Tidak seperti _method_ [`shouldComponentUpdate()`](/docs/react-component.html#shouldcomponentupdate) pada _class component_, fungsi `areEqual` mengembalikan nilai `true` apabila _props_ bernilai sama dan `false` Apabila _props_ tidak sama. Ini merupakan kebalikan dari `shouldComponentUpdate`.

* * *

### `createElement()` {#createelement}

```javascript
React.createElement(
  type,
  [props],
  [...children]
)
```

Membuat dan mengembalikan [elemen React](/docs/rendering-elements.html) baru berdasarkan _type_ yang diberikan. Argumen _type_ dapat diisi dengan nama _tag_ berupa _string_ (seperti `'div'` atau `'span'`), [komponen React](/docs/components-and-props.html) (kelas atau fungsi), atau [fragment React](#reactfragment).

Kode yang ditulis dengan [JSX](/docs/introducing-jsx.html) akan dikonversi menggunakan `React.createElement()`. Anda tidak perlu menggunakan `React.createElement()` secara langsung apabila Anda menggunakan JSX. Kunjungi [React tanpa JSX](/docs/react-without-jsx.html) untuk informasi selengkapnya.

* * *

### `cloneElement()` {#cloneelement}

```javascript
React.cloneElement(
  element,
  [props],
  [...children]
)
```

Melakukan _clone_ dan mengembalikan elemen React baru berdasarkan elemen yang diberikan. Elemen yang dihasilkan akan memiliki _props_ dari elemen asli (elemen yang di-_clone_) dengan tambahan _props_ baru yang akan digabungkan secara dangkal. _Children_ baru yang dimasukkan sebagai argumen akan menggantikan _children_ yang sudah ada. Sedangkan `key` dan `ref` dari elemen asli akan tetap dipertahankan.

`React.cloneElement()` mirip dengan:

```js
<element.type {...element.props} {...props}>{children}</element.type>
```

Namun, `React.cloneElement()` tetap mempertahankan `ref`. Ini artinya apabila Anda mendapatkan _child_ yang memiliki `ref`, Anda tidak akan mencurinya secara tidak sengaja dari _ancestor_. Anda akan mendapatkan `ref` yang sama yang dilampirkan ke elemen yang baru.

_API_ ini dikenalkan sebagai pengganti dari `React.addons.cloneWithProps()`.

* * *

### `createFactory()` {#createfactory}

```javascript
React.createFactory(type)
```

Mengembalikan fungsi yang akan menghasilkan elemen React berdasarkan _type_ yang diberikan. Seperti [`React.createElement()`](#createelement), argumen _type_ dapat diisi dengan nama _tag_ berupa string (seperti `'div'` atau `'span'`), [komponen React](/docs/components-and-props.html) (kelas atau fungsi), atau [fragment React](#reactfragment).

_Helper_ ini dianggap _legacy_, dan Kami menganjurkan Anda untuk menggunakan JSX atau `React.createElement()` secara langsung.

Anda tidak perlu menggunakan `React.createFactory()` secara langsung apabila Anda menggunakan JSX. Kunjungi [React Tanpa JSX](/docs/react-without-jsx.html) untuk informasi selengkapnya.

* * *

### `isValidElement()` {#isvalidelement}

```javascript
React.isValidElement(object)
```

Memeriksa apakah objek yang diberikan merupakan elemen React atau bukan. Mengembalikan `true` atau `false`.

* * *

### `React.Children` {#reactchildren}

`React.Children` memberikan utilitas untuk berurusan dengan struktur data `this.props.children`.

#### `React.Children.map` {#reactchildrenmap}

```javascript
React.Children.map(children, function[(thisArg)])
```

Menjalankan sebuah fungsi pada setiap _child_ yang berada pada `children` dengan `this` yang diisikan ke `thisArg`. Apabila `children` berbentuk senarai, maka senarai tersebut akan dilewati dan fungsi akan dipanggil untuk setiap _child_ di dalam senarai. Apabila children bernilai `null` atau `undefined`, _method_ ini akan mengembalikan nilai `null` atau `undefined` daripada senarai.

> Catatan
>
> Apabila `children` merupakan `Fragment` maka `children` tersebut akan dianggap sebagai satu _child_ dan tidak akan diproses.

#### `React.Children.forEach` {#reactchildrenforeach}

```javascript
React.Children.forEach(children, function[(thisArg)])
```

Mirip dengan [`React.Children.map()`](#reactchildrenmap) namun tidak mengembalikan senarai.

#### `React.Children.count` {#reactchildrencount}

```javascript
React.Children.count(children)
```

Mengembalikan jumlah total komponen yang berada di dalam `children`, jumlah total yang dihasilkan sama dengan berapa kali sebuah _callback_ yang dioper ke `map` atau `forEach` akan dijalankan.

#### `React.Children.only` {#reactchildrenonly}

```javascript
React.Children.only(children)
```

Memeriksa apakah `children` yang diberikan hanya memiliki satu _child_ (elemen React) dan mengembalikannya. Jika tidak _method_ ini akan melempar _error_.

> Catatan:
>
>`React.Children.only()` mengembalikan nilai yang berbeda dengan [`React.Children.map()`](#reactchildrenmap) karena `React.Children.map()` mengembalikan senarai dan bukan elemen React.

#### `React.Children.toArray` {#reactchildrentoarray}

```javascript
React.Children.toArray(children)
```

Mengembalikan struktur data `children` sebagai senarai datar dengan _key_ yang diberikan pada setiap _child_. Sangat berguna apabila Anda ingin memanipulasi kumpulan _children_ pada _method_ _render_ Anda, terutama apabila Anda ingin mengurutkan atau memotong `this.props.children` sebelum menurunkannya.

> Catatan:
>
> `React.Children.toArray()` mengubah _key_ untuk mempertahankan semantik dari senarai bersarang ketika meratakan (_flatten_) daftar _children_. Itu artinya, `toArray` menambahkan prefiks di setiap _key_ pada senarai yang dikembalikan sehingga setiap _key_ elemen mencakup senarai masukan yang mengandungnya.

* * *

### `React.Fragment` {#reactfragment}

Komponen `React.Fragment` membuat Anda dapat mengembalikan lebih dari satu elemen pada _method_ `render()` tanpa membuat elemen _DOM_ tambahan:

```javascript
render() {
  return (
    <React.Fragment>
      Beberapa teks.
      <h2>Sebuah heading</h2>
    </React.Fragment>
  );
}
```

Anda juga dapat menggunakannya dengan menuliskan sintaksis pintas `<></>`. Untuk informasi selengkapnya, kunjungi [React v16.2.0: Improved Support for Fragments](/blog/2017/11/28/react-v16.2.0-fragment-support.html).


### `React.createRef` {#reactcreateref}

`React.createRef` membuat sebuah [_ref_](/docs/refs-and-the-dom.html) yang dapat dilampirkan ke elemen React melalaui atribut _ref_.
`embed:16-3-release-blog-post/create-ref-example.js`

### `React.forwardRef` {#reactforwardref}

`React.forwardRef` membuat komponen React yang dapat meneruskan atribut [_ref_](/docs/refs-and-the-dom.html) yang diterima ke komponen lain yang berada di bawahnya. teknik ini jarang digunakan tapi sangat berguna pada dua skenario berikut:

* [Meneruskan _ref_ ke komponen DOM](/docs/forwarding-refs.html#forwarding-refs-to-dom-components)
* [Meneruskan _ref_ ke _higher-order-components_](/docs/forwarding-refs.html#forwarding-refs-in-higher-order-components)

`React.forwardRef` menerima fungsi _rendering_ sebagai argumen. React akan memanggil fungsi ini dengan `props` dan `ref` sebagai dua argumen. Fungsi ini akan mengembalikan _node_ React.

`embed:reference-react-forward-ref.js`

Pada contoh diatas, React mengoper `ref` yang diberikan ke elemen `<FancyButton ref={ref}>` sebagai argumen kedua ke fungsi _rendering_ yang berada pada pemanggilan `React.forwardRef`. Fungsi _rendering_ ini mengoper `ref` ke elemen `<button ref={ref}>`.

Hasilnya, setelah React melampirkan _ref_ tersebut, `ref.current` akan menunjuk ke instansi elemen DOM `<button>` secara langsung.

Untuk informasi selengkapnya, kunjungi [meneruskan _ref_](/docs/forwarding-refs.html).

### `React.lazy` {#reactlazy}

`React.lazy()` membuat Anda dapat mendefinisikan komponen yang akan dimuat secara dinamis. Ini membantu mengurangi ukuran bundel dengan menunda pemuatan komponen yang tidak digunakan saat _render_ pertama.

Anda dapat belajar cara menggunakan `React.lazy()`  dari [dokumentasi pembagian kode](/docs/code-splitting.html#reactlazy) kami. Anda mungkin juga ingin melihat [artikel ini](https://medium.com/@pomber/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d) yang menjelaskan cara menggunakan `React.lazy()` secara lebih detail.

```js
// Komponen ini dimuat secara dinamis
const SomeComponent = React.lazy(() => import('./SomeComponent'));
```

Perhatikan bahwa untuk me-_render_ komponen `lazy`, Anda membutuhkan komponen `<React.Suspense>` yang berada pada posisi yang lebih tinggi di dalam pohon _rendering_. Ini merupakan cara bagaimana Anda menentukan indikator pemuatan.

> **Catatan**
>
> Menggunakan `React.lazy` dengan impor yang dinamis membutuhkan _Promises_ tersedia pada lingkungan JS. Ini membutuhkan _polyfill_ pada IE11 ke bawah.

### `React.Suspense` {#reactsuspense}

`React.Suspense` membuat Anda dapat menentukan indikator pemuatan apabila beberapa komponen di bawahnya belum siap untuk di-_render_. Saat ini, komponen _lazy loading_ merupakan **satu-satunya** kasus penggunaan yang didukung `<React.Suspense>`:

```js
// Komponen ini dimuat secara dinamis
const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    // Tampilkan <Spinner> hingga OtherComponent dimuat
    <React.Suspense fallback={<Spinner />}>
      <div>
        <OtherComponent />
      </div>
    </React.Suspense>
  );
}
```

Hal itu didokumentasikan pada [panduan pembagian kode](/docs/code-splitting.html#reactlazy) kami. Perhatikan bahwa komponen `lazy` dapat berada jauh di dalam pohon `Suspense` -- komponen tersebut tidak perlu dibungkus secara satu per satu. Sangat disarankan untuk meletakkan `<Suspense>` dimana Anda ingin melihat indikator pemuatan, akan tetapi untuk menggunakan `lazy()` dimanapun Anda ingin melakukan pembagian kode.

Meskipun hal ini tidak didukung untuk saat ini, pada masa yang akan datang Kami berencana untuk membuat `Suspense` dapat menangani lebih banyak skenario seperti pengambilan data. Anda dapat membaca tentang hal ini pada [roadmap kami](/blog/2018/11/27/react-16-roadmap.html).

>Note:
>
>`React.lazy()` dan `<React.Suspense>` belum didukung oleh `ReactDOMServer`. Ini merupakan batasan yang akan diselesaikan pada masa yang akan datang.
