---
title: Tambahkan React ke Proyek yang sudah Ada
---

<Intro>

Jika Anda ingin menambahkan beberapa interaktivitas ke proyek Anda yang sudah ada, Anda tidak perlu menulis ulang menggunakan React. Tambahkan React ke proyek Anda, dan Anda dapat me-*render* komponen interaktif React di mana saja.

</Intro>

<Note>

**Anda perlu mengunduh [Node.js](https://nodejs.org/en/) untuk menjalankan lokal (*development*).** Meskipun Anda dapat mencoba [React](/learn/installation#try-react) secara online atau dengan halaman HTML sederhana, secara realistis sebagian besar tooling JavaScript yang ingin Anda gunakan untuk pengembangan memerlukan Node.js

</Note>

## Menggunakan React untuk seluruh subroute dari situs web Anda yang sudah ada {/*using-react-for-an-entire-subroute-of-your-existing-website*/}

Katakanlah Anda memiliki aplikasi web yang sudah ada di `example.com` yang dibuat dengan teknologi server lain (seperti Rails), dan Anda ingin mengimplementasikan semua rute yang dimulai dengan `example.com/some-app/` sepenuhnya dengan React.

Inilah cara kami menyarankan untuk menyiapkannya:

1. **Buat bagian React dari aplikasi Anda** menggunakan salah satu [*framework* berbasis React](/learn/start-a-new-react-project).
2. **Tentukan `/some-app` sebagai *base path*** dalam konfigurasi *framework* Anda (begini caranya: [Next.js](https://nextjs.org/docs/app/api-reference/config/next-config-js/basePath), [Gatsby](https://www.gatsbyjs.com/docs/how-to/previews-deploys-hosting/path-prefix/)).
3. **Konfigurasi server Anda atau Proxy** sehingga semua permintaan di rute `/some-app/` ditangani oleh aplikasi React Anda.

Ini memastikan bagian React dari aplikasi Anda bisa mendapatkan [keuntungan dari praktik terbaik](/learn/start-a-new-react-project#can-i-use-react-without-a-framework) yang dimasukkan ke dalam *framework* tersebut.

Banyak *framework* berbasis React bersifat *full-stack* dan membiarkan aplikasi React Anda memanfaatkan server. Namun, Anda dapat menggunakan pendekatan yang sama meskipun Anda tidak dapat atau tidak ingin menjalankan JavaScript di server. Dalam hal ini, sajikan HTML/CSS/JS ([`next export` output](https://nextjs.org/docs/advanced-features/static-html-export) untuk Next.js, *default* untuk Gatsby) di `/some-app/` sebagai gantinya.

## Menggunakan React sebagai bagian dari halaman Anda yang sudah ada {/*using-react-for-a-part-of-your-existing-page*/}

Katakanlah Anda memiliki halaman yang dibangun dengan teknologi lain (baik *server-based* seperti Rails, atau *client-based* seperti Backbone), dan Anda ingin me-*render* komponen interaktif React di suatu tempat di halaman itu. Itu adalah cara umum untuk mengintegrasikan React sebenarnya, begitulah cara sebagian besar penggunaan React di Meta selama bertahun-tahun!

Anda dapat melakukannya dengan dua cara:

1. **Siapkan JavaScript *environment* Anda** yang memungkinkan Anda menggunakan [sintaks JSX](/learn/writing-markup-with-jsx), bagi kode Anda menjadi modul dengan sintaks [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) / [`export`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), dan gunakan paket (misalnya React) dari registri paket [npm](https://www.npmjs.com/).
2. **Tampilkan komponen React Anda** di tempat yang ingin Anda lihat di halaman.

Pendekatan yang tepat tergantung pada setup halaman Anda, jadi mari kita telusuri beberapa detail.

### Langkah 1: Siapkan lingkungan JavaScript modular {/*step-1-set-up-a-modular-javascript-environment*/}

Lingkungan JavaScript modular memungkinkan Anda menulis komponen React Anda dalam file individual, bukan menulis semua kode Anda dalam satu file. Ini juga memungkinkan Anda menggunakan semua paket luar biasa yang diterbitkan oleh pengembang lain di registri [npm](https://www.npmjs.com/)--termasuk React itu sendiri! Cara Anda melakukannya tergantung pada pengaturan yang sudah ada:

* **Jika aplikasi Anda sudah dipecah menjadi beberapa file yang menggunakan pernyataan `import`,** coba gunakan pengaturan yang sudah Anda miliki. Periksa apakah menulis `<div />` dalam kode JS Anda menyebabkan kesalahan sintaksis. Jika menyebabkan kesalahan sintaksis, Anda mungkin perlu [mengubah kode JavaScript Anda dengan Babel](https://babeljs.io/setup), dan mengaktifkan [Babel React preset](https://babeljs.io/docs/babel-preset-react) untuk menggunakan JSX.

* **Jika aplikasi Anda belum memiliki penyiapan untuk mengompilasi modul JavaScript,** siapkan dengan [Vite](https://vite.dev/). Komunitas Vite mempunyai [banyak integrasi *framework backend*](https://github.com/vitejs/awesome-vite#integrations-with-backends), termasuk Rails, Django, dan Laravel. Jika *framework backend* Anda tidak tercantum, [ikuti panduan ini](https://vite.dev/guide/backend-integration.html) untuk mengintegrasikan Vite build dengan backend Anda secara manual.

Untuk memeriksa apakah penyiapan Anda berfungsi, jalankan perintah ini di folder proyek Anda:

<TerminalBlock>
npm install react react-dom
</TerminalBlock>

Kemudian tambahkan baris kode ini di bagian atas file JavaScript utama Anda (mungkin disebut `index.js` atau `main.js`):

<Sandpack>

```html public/index.html hidden
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Konten halaman Anda yang ada (dalam contoh ini konten akan diganti) -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

// Hapus konten HTML yang ada
document.body.innerHTML = '<div id="app"></div>';

// Render komponen React Anda sebagai gantinya
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

</Sandpack>

Jika seluruh konten halaman Anda berganti dengan "Hello, world", semuanya berhasil! Teruslah membaca.

<Note>

Mengintegrasikan lingkungan JavaScript modular ke dalam proyek yang sudah ada untuk pertama kalinya bisa terasa menakutkan, tetapi itu sepadan! Jika Anda mengalami kebuntuan, coba periksa [komunitas kami](/community) atau [Vite Chat](https://chat.vite.dev/).

</Note>

### Langkah 2: Render komponen React di mana saja di halaman Anda {/*step-2-render-react-components-anywhere-on-the-page*/}

Pada langkah sebelumnya, Anda meletakkan kode ini di bagian atas file utama Anda:

```js
import { createRoot } from 'react-dom/client';

// Hapus konten HTML yang ada
document.body.innerHTML = '<div id="app"></div>';

// Render komponen React Anda sebagai gantinya
const root = createRoot(document.getElementById('app'));
root.render(<h1>Hello, world</h1>);
```

Tentu saja, Anda sebenarnya tidak ingin menghapus konten HTML yang ada!

Hapus kode ini.

Sebagai gantinya, Anda mungkin ingin me-*render* komponen React Anda di tempat tertentu di HTML Anda. Buka halaman HTML Anda (atau *template server* yang membuatnya) dan tambahkan atribut [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) yang unik ke tag mana saja, sebagi contohnya:

```html
<!-- ... somewhere in your html ... -->
<nav id="navigation"></nav>
<!-- ... more html ... -->
```

Ini memungkinkan Anda menemukan elemen HTML dengan [`document.getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) dan meneruskannya ke [`createRoot`](/reference/react-dom/client/createRoot) sehingga Anda dapat me-*render* komponen React Anda sendiri di dalam:

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <p>This paragraph is a part of HTML.</p>
    <nav id="navigation"></nav>
    <p>This paragraph is also a part of HTML.</p>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';

function NavigationBar() {
  // TODO: Actually implement a navigation bar
  return <h1>Hello from React!</h1>;
}

const domNode = document.getElementById('navigation');
const root = createRoot(domNode);
root.render(<NavigationBar />);
```

</Sandpack>

Perhatikan bagaimana konten HTML asli dari `index.html` dipertahankan, tetapi komponen React `NavigationBar` Anda sekarang muncul di dalam `<nav id="navigation">` HTML Anda. Baca [dokumentasi penggunaan `createRoot`](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) untuk mempelajari lebih lanjut tentang me-*render* komponen React di dalam halaman HTML yang ada.

Saat Anda mengadopsi React dalam proyek yang sudah ada, umumnya dimulai dengan komponen interaktif kecil (seperti tombol), dan kemudian secara bertahap terus "bergerak ke atas" hingga akhirnya seluruh halaman Anda dibuat dengan React. Jika Anda sudah mencapai titik itu, kami sarankan untuk segera bermigrasi ke [React *framework*](/learn/start-a-new-react-project) untuk mendapatkan hasil maksimal dari React.

## Menggunakan React Native di aplikasi seluler native yang sudah ada {/*using-react-native-in-an-existing-native-mobile-app*/}

[React Native](https://reactnative.dev/) juga dapat diintegrasikan ke dalam aplikasi asli yang ada secara bertahap. Jika Anda memiliki aplikasi asli untuk Android (Java or Kotlin) atau iOS (Objective-C or Swift), [ikuti petunjuk ini](https://reactnative.dev/docs/integration-with-existing-apps) untuk menambahkan React Native ke dalamnya.
