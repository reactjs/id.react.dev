---
id: glossary
title: Glossary of React Terms
layout: docs
category: Reference
permalink: docs/glossary.html

---

## Aplikasi Single-page {#single-page-application}

Aplikasi _Single-page_ adalah jenis aplikasi web yang memuat sebuah halaman HTML dan seluruh aset yang diperlukannya (seperti Javascript dan CSS) untuk dapat berjalan. Seluruh interaksi yang terjadi pada halaman yang telah dimuat maupun halaman lainnya yang berhubungan, tidak memerlukan tambahan pengambilan data ke server, yang berarti halaman tidak perlu dimuat ulang.

Aplikasi _Single-page_ tidak harus dibangun menggunakan React. React dapat digunakan untuk meningkatkan bagian-bagian tertentu dari halaman yang telah ada untuk meningkatkan interaktivitas halaman tersebut. Kode yang ditulis dalam React dapat berjalan dengan aman dengan jenis lainnnya yang di _render_ pada _server_, seperti PHP, atau _library_ lain yang ada di sisi _client_. Faktanya, dengan cara inilah Facebook menggunakan React.

## ES6, ES2015, ES2016, dsb {#es6-es2015-es2016-etc}

Semua akronim diatas merujuk pada versi terbaru dari standar Spesifikasi bahasa ECMAScript, yang merupakan implementasi dari bahasa JavaScript Versi ES6 (dikenal juga sebagai ES2015), yang mencakup tambahan dari versi sebelumnya seperti : _Arrow Function_, kelas, _template literals_, deklarasi variabel dengan `let` dan `const`. Anda dapat mempelajarinya lebih dalam tiap versinya melalui [tautan ini](https://en.wikipedia.org/wiki/ECMAScript#Versions)

## Kompiler {#compilers}

Sebuah kompiler JavaScript menerima kode JavaScript, mengubahnya, dan mengembalikannya kedalam format yang berbeda. Kasus paling umum penggunaan compiler adalah saat sintaksis ES6 diubah untuk dapat dimengerti oleh peramban tipe lama. [Babel](https://babeljs.io/) adalah salah satu jenis kompiler yang sering digunakan dengan React.

## Bundler {#bundlers}

_Bundler_ menggunakan kode JavaScript dan CSS yang ditulis di modul terpisah, dan menggabungkannya menjadi beberapa file yang lebih optimal untuk dijalankan oleh *browser*. _Bundler_ yang sering digunakan React meliputi [Webpack](https://webpack.js.org/) dan [Browserify](http://browserify.org/)

## Package Manager {#package-managers}

_Package manager_ adalah alat yang digunakan untuk mengatur dan mengelola dependensi pada proyek Anda. [npm](https://www.npmjs.com/) dan [Yarn](http://yarnpkg.com/) adalah _package manager_ yang paling sering digunakan pada aplikasi React dimana keduanya adalah klien yang memiliki registri paket npm yang sama.

## CDN {#cdn}

CDN adalah singkatan dari _Content Delivery Network_. CDN menyediakan konten yang statis dan di-_cache_ dari jaringan server di seluruh dunia.

## JSX {#jsx}

JSX adalah sintaksis ekstensi untuk JavaScript. JSX mirip dengan bahasa _template_, namun memiliki kekuatan penuh atas bahasa JavaScript. JSX akan dikompilasi ke pemanggilan `React.createElement()` yang mengembalikan objek JavaScript biasa bernama "React elements". Untuk mendapatkan penjelasan dasar mengenai mengenai JSX dapat melihat [dokumentasi JSX](/docs/introducing-jsx.html), atau mengenai JSX dengan lebih mendalam [di sini](https://reactjs.org/docs/introducing-jsx.html)

Alih-alih menggunakan nama atribut HTML, React DOM menggunakan konvensi penamaan *camelCase* untuk penamaan atributnya. Sebagai contoh, `tabindex` menjadi `tabIndex` di JSX. Atribut `class` juga ditulis sebagai `className` karena `class` adalah nama yang telah dipesan dalam JavaScript.


<<<<<<< HEAD
```js
const name = 'Clementine';
ReactDOM.render(
  <h1 className="hello">Nama saya {name}!</h1>,
  document.getElementById('root')
);
```  
=======
```jsx
<h1 className="hello">My name is Clementine!</h1>
```
>>>>>>> 951fae39f0e12dc061f1564d02b2f4707c0541c4

## [Elemen](/docs/rendering-elements.html) {#elements}

Elemen React adalah bagian pembangun aplikasi React. Beberapa orang bisa jadi salah mengartikan elemen sebagai istilah 'komponen' yang lebih dikenal luas. Sebuah elemen menjelaskan apa yang ingin Anda tampilkan di layar. Elemen React tidak dapat diubah (*immutable*).

```js
const element = <h1>Hai, dunia</h1>;
```

Secara khusus, elemen tidak digunakan secara langsung, melainkan dikembalikan melalui komponen.

## [Komponen](/docs/components-and-props.html) {#components}

Komponen React adalah bagian atau potongan kecil dari kode yang dapat digunakan kembali, yang mengembalikan elemen React untuk di-_render_ ke halaman. Versi paling sederhana dari komponen React adalah fungsi JavaScript yang mengembalikan elemen React :

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Komponen juga dapat menggunakan kelas dengan format penulisan ES6:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Komponen dapat dipecah menjadi beberapa bagian fungsi berbeda yang dapat digunakan dengan komponen lainnya. Komponen dapat mengembalikan senarai, _string_, angka, maupun mengembalikan komponen lainnya. Aturan dasar yang praktis yaitu, jika ada bagian dari antarmuka Anda yang digunakan beberapa kali (Tombol, Panel, Avatar), atau cukup kompleks untuk berdiri dengan sendirinya (App, FeedStory, Komentar), komponen-komponen tersebut adalah kandidat yang cocok untuk dijadikan komponen yang dapat digunakan kembali (*reusable component*). Nama komponen juga harus selalu diawali dengan huruf kapital (`<Wrapper/>` **bukan** `<wrapper/>`). Lihat [dokumentasi](https://reactjs.org/docs/components-and-props.html#rendering-a-component) untuk penjelasan mengenai cara melakukan _render_ komponen.


### [`props`](/docs/components-and-props.html) {#props}

`props` adalah masukan dari komponen React. `props` adalah data yang dioper dari _parent component_ ke _child component_-nya.

Perlu diingat bahwa `props` bersifat _readonly_, sehingga nilainya tidak dapat diubah melalui cara apapun:

```js
// Wrong!
props.number = 42;
```

Jika Anda perlu memodifikasi nilai sebagai respon dari masukan penguna, gunakan `state`.

### `props.children` {#propschildren}

`props.children` tersedia di setiap komponen. Ia berisi konten yang terletak diantara _tag_ pembuka dan penutup dari sebuah komponen. Sebagai contoh:

```js
<Welcome>Hai dunia!</Welcome>
```

Teks `Hai dunia!` dapat diakses sebagai `props.children` di komponen `Welcome`:

```js
function Welcome(props) {
  return <p>{props.children}</p>;
}
```

Untuk komponen yang menggunakan kelas, gunakan `this.props.children`:

```js
class Welcome extends React.Component {
  render() {
    return <p>{this.props.children}</p>;
  }
}
```

### [`state`](/docs/state-and-lifecycle.html#adding-local-state-to-a-class) {#state}

Sebuah komponen membutuhkan `state` saat sebuah data yang berhubungan dengannya berubah sewaktu-waktu. Sebagai contoh, sebuah komponen `Checkbox` dapat membutuhkan _state_ `isChecked`, dan sebuah komponen `NewsFeed` bisa jadi selalu membutuhkan _state_ `fetchedPost` terbaru.

Perbedaan paling penting diantara `state` dan `props` adalah `props` dioper melalui _parent component_, sedangkan `state` diatur oleh komponen itu sendiri. Sebuah komponen tidak dapat mengubah `props`, tetapi dapat mengubah `state`. Untuk melakukannya, komponen tersebut harus memanggil fungsi `this.setState()`. Hanya komponen yang didefinisikan sebagai kelas yang dapat memiliki _state_.

Untuk setiap bagian data yang berubah, harus terdapat satu komponen yang 'memiliki' data tersebut sebagai _state_ di dalamnya. Jangan mencoba untuk melakukan sinkronisasi _state_ pada dua komponen yang berbeda. Sebaliknya, [angkat nilainya ke atas](/docs/lifting-state-up.html), kemudian oper sebagai _props_ untuk kedua komponen tersebut.

## [Lifecycle Methods](/docs/state-and-lifecycle.html#adding-lifecycle-methods-to-a-class) {#lifecycle-methods}

_Lifecycle Methods_ adalah fungsionalitas khusus yang dijalankan selama fase tertentu dalam sebuah komponen. Terdapat beberapa metode yang tersedia saat komponen dibuat dan dimasukkan kedalam DOM ([mounting](/docs/react-component.html#mounting)), saat komponen diperbarui, dan saat komponen dilepas atau dihapus dari DOM.

 ## [Controlled](/docs/forms.html#controlled-components) vs. [Uncontrolled Components](/docs/uncontrolled-components.html)

React memiliki dua pendekatan berbeda untuk mengatur inputan form.

Sebuah elemen masukan formulir yang nilainya diatur oleh React disebut sebagai *_controlled component*. Saat seorang pengguna memasukkan data kedalam _controlled component_, sebuah _event handler_ terpicu, dan kode Anda yang selanjutnya menentukan apakah masukan valid atau tidak (dengan cara merender ulang dengan nilai yang telah diperbarui). Jika Anda tidak merender ulang, maka nilai formulir tidak akan berubah.

Sebuah *uncontrolled component* bekerja seperti hal yang dilakukan elemen formulir diluar React. Disaat pengguna memasukkan data kedalam formulir (melalui kotak input, _dropdown_, dll) nilai yang telah diperbarui akan digunakan tanpa React perlu melakukan apapun. Namun, hal ini berarti Anda tidak dapat memaksa sebuah bidang masukan unntuk memiliki nilai tertentu.

Dalam banyak kasus, Anda harus menggunakan _controlled components_.

## [Keys](/docs/lists-and-keys.html) {#keys}

Sebuah "*key*" adalah atribut *string* spesial yang perlu disertakan saat membuat kumpulan elemen dalam bentuk senarai. Key membantu React untuk mengidentifikasi bagian mana yang telah diubah, ditambah, atau dihilangkan. *Keys* harus diberikan pada elemen dalam sebuah senarai untuk memberikan identitas yang stabil pada elemen tersebut.

*Keys* hanya perlu bersifat unik dengan elemen lainnya dalam senarai yag sama. *Keys* tidak perlu bersifat unik di seluruh aplikasi atau bahkan di dalam komponen yang sama.

Jangan mengoper nilai `Math.random()` sebagai key. Penting untuk diingat bahwa key harus memiliki "identitas yang stabil" walau melalui _di-render_ ulang, sehingga React dapat menentukan kapan sebuah item ditambah, dihapus, atau diurutkan. Secara ideal, key harus tersusun dari data Anda yang bersifat unik dan stabil, seperti `post.id`.

## [Refs](/docs/refs-and-the-dom.html) {#refs}

React mendukung atribut spesial yang dapat dilampirkan di komponen apapun. Atribut `ref` dapat terdiri dari sebuah objek yang dibuat oleh [`React.createRef()` function](/docs/react-api.html#reactcreateref) atau oleh sebuah _callback function_, atau _string_ (di API _legacy_). Disaat `ref` adalah sebuah _callback function_, fungsi tersebut dapat menerima argumen berupa elemen DOM atau sebuah kelas (bergantung pada tipe elemen). Hal ini dapat memberikan Anda akses langsung pada elemen DOM atau komponen yang berhubungan.

Gunakan refs-and dengan bijak. Jika anda merasa sering menggunakan refs untuk "melakukan suatu hal", pertimbangkan untuk lebih familier dengan [aliran data _top-down_](/docs/lifting-state-up.html).

## [Event](/docs/handling-events.html) {#events}

Menangani _event_ dengan Elemen React memiliki perbedaan secara sintaksis:

* _Event handler_ pada React ditulis menggunakan *camelCase*, bukan sebagai huruf kecil.
* Dengan JSX, Anda mengoper sebuah fungsi sebagai _event handler_, bukan sebagai _string_.

## [Rekonsiliasi](/docs/reconciliation.html) {#reconciliation}

Disaat sebuah _props_ atau _state_ dari sebuah komponen mengalami perubahan, React dapat memutuskan apakah hal tersebut memerlukan pembaruan DOM, dengan cara membandingkan elemen komponen yang dikembalikan dengan komponen yang telah _di-render_ sebelumnya. Jika keduanya berbeda, React akan memperbarui DOM. Proses ini disebut dengan istilah "rekonsiliasi".
