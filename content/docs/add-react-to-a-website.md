---
id: add-react-to-a-website
title: Menambahkan React pada Sebuah Situs
permalink: docs/add-react-to-a-website.html
redirect_from:
  - "docs/add-react-to-an-existing-app.html"
prev: getting-started.html
next: create-a-new-react-app.html
---

Anda dapat menggunakan React sesedikit atau sebanyak mungkin sesuai kebutuhan Anda.

React telah didesain dari awal untuk adopsi secara bertahap, dan **Anda dapat menggunakan React sesedikit atau sebanyak mungkin sesuai kebutuhan Anda**. Mungkin Anda hanya ingin menambahkan "sedikit interaktivitas" di laman yang sudah ada. Komponen React adalah cara yang tepat untuk melakukan hal tersebut.

Mayoritas situs bukan, dan tidak perlu, untuk bersifat *Single Page Application*. Dengan **beberapa baris kode dan tanpa *build tool***, Anda dapat mencoba React di bagian kecil dari situs Anda. Anda kemudian dapat secara bertahap memperluas penggunaannya, atau membiarkannya berada di beberapa *widget* yang dinamis saja.

---

- [Tambahkan React Dalam Satu Menit](#add-react-in-one-minute)
- [Opsional: Mencoba React Dengan JSX](#optional-try-react-with-jsx) (tanpa membutuhkan *bundler*!)

## Tambahkan React Dalam Satu Menit {#add-react-in-one-minute}

Pada bagian ini, kami akan menunjukkan bagaimana Anda dapat menambahkan sebuah komponen React ke laman HTML yang sudah ada. Anda dapat mengikuti dengan situs Anda sendiri, atau dengan membuat sebuah berkas HTML kosong untuk berlatih.

Di sini tidak akan ada alat yang membingungkan atau persyaratan pemasangan apapun -- **untuk menyelesaikan bagian ini, Anda hanya butuh koneksi internet, dan semenit dari waktu Anda.**

Opsional: [Unduh contoh lengkap (2KB *zipped*)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)

### Langkah 1: Tambahkan sebuah Kontainer DOM ke dalam HTML {#step-1-add-a-dom-container-to-the-html}

Pertama, buka laman HTML yang ingin Anda sunting. Tambahkan sebuah *tag* `<div>` kosong untuk menandai di mana Anda ingin menampilkan sesuatu dengan React. Sebagai contoh:

```html{3}
<!-- ... HTML yang sudah ada ... -->

<div id="like_button_container"></div>

<!-- ... HTML yang sudah ada ... -->
```

Kita memberikan atribut HTML `id` yang unik kepada `<div>` ini. Hal ini memungkinkan kita untuk menemukannya dari kode JavaScript nantinya dan menampilkan sebuah komponen React di dalamnya.

>Tip
>
>Anda dapat menaruh sebuah `<div>` kontainer seperti ini **di mana saja** di dalam *tag* `<body>`. Anda dapat memiliki sebanyak apapun kontainer DOM independen dalam satu laman sesuai yang Anda butuhkan. Mereka biasanya kosong -- React akan menimpa konten apapun yang berada di dalam kontainer DOM.

### Langkah 2: Tambahkan Tag Script {#step-2-add-the-script-tags}

Berikutnya, tambahkan tiga *tag* `<script>` ke laman HTML tepat sebelum penutup *tag* `<body>`:

```html{5,6,9}
  <!-- ... HTML lainnya ... -->

<<<<<<< HEAD
  <!-- Muat React. -->
  <!-- Catatan: ketika men-deploy (ke production), timpa "development.js" menjadi "production.min.js". -->
  <script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
=======
  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". -->
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>
>>>>>>> c3c93e2a7ff1b1f7b8735a3a87d4b10937eaaf91

  <!-- Muat komponen React kita. -->
  <script src="like_button.js"></script>

</body>
```

*Tag* pertama dan kedua akan memuat React. *Tag* ketiga akan memuat kode komponen Anda.


### Langkah 3: Buat Sebuah Komponen React {#step-3-create-a-react-component}

Buat sebuah berkas bernama `like_button.js` tepat disebelah berkas laman HTML Anda.

Buka **[kode permulaan](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)** dan *paste*-kan kode tersebut ke berkas yang baru saja Anda buat.

>Tip
>
>Kode ini mendefinisikan sebuah komponen React bernama `LikeButton`. Jangan khawatir jika Anda belum memahaminya -- kita akan membahas blok-blok pembangun React nantinya di [tutorial langsung](/tutorial/tutorial.html) dan [panduan konsep utama](/docs/hello-world.html). Untuk sekarang, mari kita fokus untuk membuatnya muncul di layar terlebih dahulu!

Setelah **[kode permulaan](https://gist.github.com/gaearon/0b180827c190fe4fd98b4c7f570ea4a8/raw/b9157ce933c79a4559d2aa9ff3372668cce48de7/LikeButton.js)**, tambahkan dua barus di bawah berkas `like_button.js`:

```js{3,4}
// ... kode permulaan yang telah Anda paste ...

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(e(LikeButton), domContainer);
```

<<<<<<< HEAD
Kedua baris kode di atas akan menemukan `<div>` yang telah kita tambahkan ke HTML kita di langkah pertama, kemudian menampilkan komponen React tombol "Like" kita di dalamnya.
=======
These two lines of code find the `<div>` we added to our HTML in the first step, and then display our "Like" button React component inside of it.
>>>>>>> c3c93e2a7ff1b1f7b8735a3a87d4b10937eaaf91

### Itu Saja! {#thats-it}

Tidak ada langkah ke empat. **Anda baru saja menambahkan komponen React pertama pada situs Anda**

Kunjungi bagian-bagian berikutnya untuk tips lebih lanjut mengenai mengintegrasikan React.

**[Lihat contoh kode sumber lengkapnya](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605)**

**[Unduh contoh lengkapnya (2KB *zipped*)](https://gist.github.com/gaearon/6668a1f6986742109c00a581ce704605/archive/f6c882b6ae18bde42dcf6fdb751aae93495a2275.zip)**

### Tip: Penggunaan Ulang Sebuah Komponen {#tip-reuse-a-component}

Umumnya, Anda mungkin ingin menampilkan komponen React di berbagai tempat di laman HTML. Ini adalah sebuah contoh untuk menampilkan tombol "Like" tiga kali dan mengoperkan data ke dalamnya.

[Lihat contoh kode sumber lengkapnya](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda)

[Unduh contoh lengkapnya (2KB *zipped*)](https://gist.github.com/gaearon/faa67b76a6c47adbab04f739cba7ceda/archive/9d0dd0ee941fea05fd1357502e5aa348abb84c12.zip)

>Catatan
>
>Strategi ini akan lebih berguna untuk penggunaan React di bagian-bagian laman yang terisolasi satu sama lain. Di dalam kode React sendiri, akan lebih mudah menggunakan [komposisi komponen](/docs/components-and-props.html#composing-components).

### Tip: Minifikasi JavaScript untuk Production {#tip-minify-javascript-for-production}

Sebelum men-*deploy* situs Anda ke *production*, berhati-hatilah terhadap JavaScript yang belum diminifikasi yang dapat secara signifikan memperlambat laman untuk pengguna Anda.

Jika Anda telah meminifikasi *script* aplikasi, **situs Anda telah siap untuk *production*** jika Anda telah memastikan HTML yang ter-*deploy* memuat versi React yang berakhiran dengan `production.min.js`:

```js
<script src="https://unpkg.com/react@17/umd/react.production.min.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js" crossorigin></script>
```

Jika Anda belum memiliki proses minifikasi untuk *script* Anda, [berikut salah satu cara untuk mempersiapkannya](https://gist.github.com/gaearon/42a2ffa41b8319948f9be4076286e1f3).

## Opsional: Mencoba React dengan JSX {#optional-try-react-with-jsx}

Pada contoh di atas, kita hanya bergantung pada fitur-fitur yang secara langsung didukung oleh *browser*. Inilah alasan mengapa kita menggunakan sebuah fungsi JavaScript untuk memberitahukan React apa yang akan ditampilkan:

```js
const e = React.createElement;

// Tampilkan sebuah <button> "Like"
return e(
  'button',
  { onClick: () => this.setState({ liked: true }) },
  'Like'
);
```

Namun, React juga menawarkan opsi untuk menggunakan [JSX](/docs/introducing-jsx.html):

```js
// Tampiilkan sebuah <button>-"Like"
return (
  <button onClick={() => this.setState({ liked: true })}>
    Like
  </button>
);
```

Kedua potongan kode di atas akan menghasilkan hal yang sama. Meskipun **JSX bersifat [opsional sepenuhnya](/docs/react-without-jsx.html)**, banyak orang yang menganggapnya berguna untuk menuliskan kode antarmuka pengguna -- dengan menggunakan React maupun *library* lainnya.

Anda dapat bermain-main dengan JSX menggunakan [konverter daring ini](https://babeljs.io/repl#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=Q&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&sourceType=module&lineWrap=true&presets=es2015%2Creact%2Cstage-2%2Cstage-3&prettier=true&targets=Node-6.12&version=6.26.0&envVersion=).

### Mencoba JSX Secara Cepat {#quickly-try-jsx}

Cara tercepat untuk mencoba JSX di proyek Anda adalah dengan menambahkan *tag* `<script>` pada laman Anda:

```html
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

Sekarang Anda dapat menggunakan JSX di *tag* `<script>` manapun dengan menambahkan atribut `type="text/babel"`. Berikut adalah [sebuah contoh berkas HTML dengan JSX](https://raw.githubusercontent.com/reactjs/reactjs.org/master/static/html/single-file-example.html) yang dapat Anda unduh dan mainkan.

Pendekatan ini cukup untuk mempelajari dan membuat contoh-contoh simpel. Namun, cara ini akan membuat situs Anda lambat dan **tidak cocok untuk *production***. Ketika Anda siap untuk melangkah lebih lanjut, hapus *tag* `<script>` dan atribut `type="text/babel"` yang baru saja Anda tambahkan. Alih-alih menggunakan cara tadi, di bagian berikutnya Anda akan menyiapkan preprosesor JSX untuk mengkonversi *tag* `<script>` secara otomatis.

### Menambahkan JSX pada Sebuah Proyek {#add-jsx-to-a-project}

Menambahkan JSX pada sebuah proyek tidak memerlukan alat-alat rumit seperti *bundler* atau server *development*. Sebenarnya, menambahkan JSX **sangat mirip dengan menambahkan sebuah preprosesor CSS.** Satu-satunya prasyarat adalah Anda harus memiliki [Node.js](https://nodejs.org/) terpasang di komputer Anda.

Masuk ke *folder* proyek Anda di terminal, dan *paste*-kan kedua perintah di bawah:

1. **Langkah 1:** Jalankan `npm init -y` (jika perintah ini gagal, [berikut cara pembetulannya](https://gist.github.com/gaearon/246f6380610e262f8a648e3e51cad40d))
2. **Langkah 2:** Jalankan `npm install babel-cli@6 babel-preset-react-app@3`

>Tip
>
>Kita **menggunakan npm di sini hanya untuk memasang preprosesor JSX;** Anda tidak akan membutuhkannya untuk hal-hal lainnya. Baik React maupun kode aplikasi Anda akan tetap berada di *tag* `<script>` tanpa perlu perubahan.

Selamat! Anda baru saja menambahkan sebuah ***setup* JSX yang siap untuk *production*** pada proyek Anda.


### Menjalankan Preprosesor JSX {#run-jsx-preprocessor}

Buat sebuah *folder* yang bernama `src` dan jalankan perintah terminal di bawah:

```
npx babel --watch src --out-dir . --presets react-app/prod
```

>Catatan
>
>`npx` di atas bukan kesalahan pengetikan -- ia adalah sebuah [*package runner* yang terpasang bersama npm 5.2+](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b).
>
> Jika Anda melihat pesan *error* yang mengatakan "You have mistakenly installed the `babel` package", Anda mungkin melewatkan [langkah sebelumnya](#add-jsx-to-a-project). Lakukan langkah tersebut di *folder* yang sama, kemudian ulangi lagi.

Jangan menunggu perintah untuk selesai -- perintah ini menjalankan sebuah *watcher* otomatis untuk JSX.

Jika sekarang Anda membuat sebuah berkas bernama `src/like_button.js` dengan **[kode permulaan JSX](https://gist.github.com/gaearon/c8e112dc74ac44aac4f673f2c39d19d1/raw/09b951c86c1bf1116af741fa4664511f2f179f0a/like_button.js)** ini, *watcher* akan membuat sebuah `like_button.js` yang telah dipreproses berbentuk sebuah kode JavaScript biasa yang siap dijalankan di *browser*. Ketika Anda menyunting berkas sumber dengan JSX, proses transformasi akan berjalan kembali secara otomatis.

Sebagai bonus, cara ini juga memungkinkan Anda menggunakan fitur-fitur sintaksis JavaScript modern seperti kelas (*class*) tanpa khawatir merusak dukungan terhadap *browser* yang lebih lama. Alat yang baru saja kita gunakan disebut Babel, dan Anda dapat mempelajarinya lebih lanjut dari [dokumentasinya](https://babeljs.io/docs/en/babel-cli/).

Jika Anda merasa mulai nyaman menggunakan *build tool* dan menginginkan mereka untuk melakukan hal-hal lain, [bagian berikutnya](/docs/create-a-new-react-app.html) menjelaskan beberapa dari *toolchain* yang populer dan cukup mudah digunakan. Jika tidak -- *tag-tag* *script* tadi juga tidak masalah!
