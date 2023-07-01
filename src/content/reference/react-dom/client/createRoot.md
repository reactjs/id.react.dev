---
title: createRoot
---

<Intro>

`createRoot` memungkinkan Anda untuk membuat sebuah induk untuk menampikan komponen React dalam node DOM pada browser.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Panggil `createRoot` untuk membuat induk React untuk menampilkan konten di elemen DOM di browser.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React akan membuat sebuah induk untuk `domNode` dan mengambil alih pengelolaan DOMnya. Setelah Anda membuat induk, Anda harus memanggil [`root.render`](#root-render) untuk menampilkan komponen React di dalam DOM tersebut:

```js
root.render(<App />);
```

Aplikasi yang sepenuhnya dibuat dengan React biasanya cukup memanggil `createRoot` sekali saja untuk komponen induknya. Sedangkan untuk halaman yang "dihiasi" oleh bagian yang menggunakan React mungkin dapat memiliki induk sebanyak yang diperlukan.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `domNode`: Sebuah [elemen DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React akan membuat induk untuk elemen DOM ini dan memungkinkan Anda untuk memanggil fungsi lain pada induk, seperti `render` untuk menampilkan konten React yang sudah dirender.

* **opsional** `options`: Sebuah objek dengan opsi-opsi berikut untuk induk React ini.
  * **opsional** `onRecoverableError`: *Callback* yang dipanggil saat React berhasil pulih secara otomatis dari kesalahan.
  * **opsional** `identifierPrefix`: sebuah *string* yang React gunakan untuk ID yang dibuat oleh [`useId`.](/reference/react/useId) Berguna untuk mencegah konflik saat menggunakan banyak induk pada halaman yang sama.

#### Returns {/*returns*/}

`createRoot` mengembalikan sebuah objek dengan dua *method*: [`render`](#root-render) dan [`unmount`.](#root-unmount)

#### Peringatan {/*caveats*/}
* Jika aplikasi Anda dirender oleh server, penggunaan `createRoot()` tidak didukung. Sebagai gantinya, gunakan [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Anda mungkin hanya akan memiliki satu panggilan `createRoot` pada aplikasi Anda. Jika Anda menggunakan *framework*, biasanya pemanggilan fungsi ini sudah dilakukan oleh *framework* tersebut.
* Saat Anda ingin merender sebagian JSX pada bagian lain dari pohon DOM yang bukan turunan dari komponen Anda (contohnya *modal* atau *tooltip*), gunakan [`createPortal`](/reference/react-dom/createPortal), bukan `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Panggil `root.render` untuk menampilkan sebuah [JSX](/learn/writing-markup-with-jsx) ("*React node*") dalam node DOM milik induk React pada browser.

```js
root.render(<App />);
```

React akan menampilkan `<App />` dalam `root`, dan mengambil alih pengelolaan DOM di dalamnya.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameters {/*root-render-parameters*/}

* `reactNode`: Sebuah *React Node* yang Anda ingin tampilkan. Biasanya berupa sebuah JSX seperti `<App />`, namun Ada juga dapat memberikan sebuah elemen React yang dibuat dengan [`createElement()`](/reference/react/createElement), sebuah *string*, sebuah angka (*number*), `null` atau `undefined`.

#### Returns {/*root-render-returns*/}

`root.render` mengembalikan `undefined`.

#### Peringatan {/*root-render-caveats*/}

* Pada pemanggilan `root.render` pertama kali, React akan menghapus seluruh konten HTML yang ada pada induk React, sebelum merender komponen React di dalamnya.

* Jika node DOM induk Anda memiliki HTML yang dibuat oleh React pada server, atau proses *build*, gunakan [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) agar *event handler* dapat dikaitkan dengan HTML yang ada.

* Jika Anda memanggil `render` pada induk yang sama berulang kali, React akan memperbarui DOM sebisa mungkin hingga menyamai JSX terakhir yang Anda berikan. React akan memutuskan bagian mana dari DOM yang dapat digunakan kembali dan bagian mana yang perlu dibuat ulang, dengan melakukan ["pencocokan"](/learn/preserving-and-resetting-state) dengan pohon yang telah dirender sebelumnya. Pemanggilan kembali `render` di induk yang sama mirip dengan memanggil [fungsi `set`](/reference/react/useState#setstate) pada komponen induk: React menghindari pembaharuan DOM yang tidak diperlukan.

---

### `root.unmount()` {/*root-unmount*/}

Panggil `root.unmount` untuk memusnakan pohon yang telah dirender dalam induk React.

```js
root.unmount();
```

Sebuah aplikasi yang dibuat sepenuhnya dengan React biasanya tidak perlu memanggil `root.unmount`.

Fungsi ini biasanya berguna saat node DOM pada induk React (atau turunan lainnya) mungkin dapat terhapus dari DOM oleh kode lain. Sebagai contoh, bayangkan sebuah panel tab jQuery yang menghapus tab nonaktif dari DOM. Jika tab tersebut terhapus, seluruh isi dari DOM tersebut (termasuk induk React) juga akan ikut terhapus. Pada kasus ini, Anda perlu memberitahukan React untuk "stop" mengelola konten DOM induk yang terhapus dengan memanggil `root.unmount`. Jika tidak, komponen yang ada di dalam induk tersebut tidak tahu kalau mereka harus membersihkan dan membebaskan *resources* global seperti *subscriptions*.

Memanggil `root.unmount` akan mengunmount seluruh komponen di dalam induk, dan "melepaskan" React dari dalam node DOM induk, termasuk menghapus *event handlers* dan *state* yang ada pada pohon. 


#### Parameters {/*root-unmount-parameters*/}

`root.unmount` tidak menerima parameter apapun.


#### Returns {/*root-unmount-returns*/}

`root.unmount` mengembalikan `undefined`.

#### Catatan Penting {/*root-unmount-caveats*/}

* Pemanggilan `root.unmount` akan meng-*unmount* seluruh komponen pada pohon dan "melepaskan" React dari node DOM induk.

* Begitu Anda memanggil `root.unmount`, Anda tidak dapat memanggil `root.render` kembali pada induk yang sama. Percobaan memanggil `root.render` pada induk yang sudah diunmount akan menyebabkan kesalahan "*Cannot update an unmounted root*". Walaupun begitu, Anda dapat membuat induk yang baru untuk node DOM yang sama setelah node pada induk sebelumnya telah diunmount.

---

## Penggunaan {/*usage*/}

### Merender Aplikasi yang Dibuat Sepenuhnya dengan React {/*rendering-an-app-fully-built-with-react*/}

Jika aplikasi Anda dibuat sepenuhnya dengan React, buatlah sebuah induk untuk seluruh bagian aplikasi Anda.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Biasanya, Anda cukup menjalankan kode ini sekali saja pada *startup*. Kode ini akan:

1. Mencari <CodeStep step={1}>node DOM pada browser</CodeStep>, yang didefinisikan di HTML Anda.
2. Menampilkan <CodeStep step={2}>komponen React</CodeStep> untuk aplikasi Anda didalamnya.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Ini adalah node DOMnya -->
    <div id="root"></div>
  </body>
</html>
```

```js index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Halo, dunia!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Anda mengklik saya {count} kali
    </button>
  );
}
```

</Sandpack>

**Jika aplikasi Anda dibuat sepenuhnya dengan React, Anda seharusnya tidak perlu membuat induk-induk lainnya, atau memanggil [`root.render`](#root-render) kembali.**

Kedepannya, React akan mengelola DOM tersebut untuk seluruh aplikasi Anda. Untuk menambahkan komponen-komponen lain, [pasangkan mereka di dalam komponen `App`.](/learn/importing-and-exporting-components) Saat Anda perlu memperbarui UI tersebut, Anda dapat melakukannya [dengan menggunakan *state*.](/reference/react/useState) Saat Anda ingin menampilkan konten ekstra seperti *modal* atau *tooltip* diluar dari node DOM, [render komponen tersebut dengan sebuah portal.](/reference/react-dom/createPortal)

<Note>

Saat HTML Anda kosong, pengguna akan melihat sebuah halaman kosong sampai kode JavaScript aplikasi selesai dimuat dan berjalan.

```html
<div id="root"></div>
```

Ini dapat terasa sangat lambat! Untuk mengatasi masalah ini, Anda dapat membuat HTML awal dari komponen Anda [pada server atau saat proses *build*](/reference/react-dom/server) Sehingga pengunjung dapat membaca teks, melihat gambar dan mengklik tautan sebelum kode JavaScript apapun selesai dimuat. Kami merekomendasikan untuk [menggunakan sebuah *framework*](/learn/start-a-new-react-project#production-grade-react-frameworks) yang telah melakukan optimisasi ini sejak awal. Bergantung dari kapan proses ini berjalan, ini dapat dipanggil sebagai *server-side rendering (SSR)* atau *static site generation (SSG).*

</Note>

<Pitfall>

**Aplikasi yang dirender pada server atau pembuatan statis harus memanggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), bukan `createRoot`.** React kemudian akan menghydrate (menggunakan ulang) node-node DOM dari HTML Anda, alih-alih menghancurkan dan membuat ulang node tersebut.

</Pitfall>

---

### Merender halaman yang sebagian dibuat dengan React {/*rendering-a-page-partially-built-with-react*/}

Jika halaman Anda [tidak dibuat sepenuhnya dengan React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), Anda dapat memanggil `createRoot` lebih dari sekali untuk membuat induk dari setiap bagian level teratas yang dikelola React. Anda dapat menampilkan konten yang berbeda untuk setip induk dengan memanggil [`root.render`.](#root-render)

Di sini, dua komponen React yang berbeda dirender kedalam dua node DOM yang didefinisikan dalam file `index.html`.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Paragraf ini tidak dirender oleh React (buka index.html untuk memastikan).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Beranda</NavLink>
      <NavLink href="/about">Tentang</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Komentar</h2>
      <Comment text="Halo!" author="Sophie" />
      <Comment text="Gimana kabarnya?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Anda dapat juga membuat node DOM baru dengan [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) dan menambahkannya ke dalam dokumen secara langsung.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Anda dapat menambahkan kode ini di manapun dalam dokumen
```

Untuk memusnahkan pohon React dari node DOM dan membersihkan seluruh *resources* yang digunakan, panggil [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Hal ini biasanya berguna saat komponen React Anda berada dalam aplikasi yang menggunakan *framework* yang berbeda.

---

### Memperbarui Komponen Induk {/*updating-a-root-component*/}

Anda dapat memanggil `render` lebih dari sekali untuk induk yang sama. Selama pohon komponen tersebut sama dengan yang sebelumnya telah dirender, React akan [menjaga statenya.](/learn/preserving-and-resetting-state) Perhatikan bagaimana Anda dapat mengetik pada *input*, yang berarti pembaruan dari pemanggilan `render` yang berulang setiap detik pada contoh ini tidak desktruktif.

<Sandpack>

```js index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js App.js
export default function App({counter}) {
  return (
    <>
      <h1>Halo dunia! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Pemanggilan `render` berulang kali biasanya tidak wajar. Pada umumnya komponen Anda akan [memperbarui *state*](/reference/react/useState).

---
## Pemecahan Masalah {/*troubleshooting*/}

### Saya Telah Membuat Sebuah Induk, Namun Tidak Ada yang Tampil {/*ive-created-a-root-but-nothing-is-displayed*/}

Pastikan Anda tidak lupa untuk merender aplikasi Anda dalam induknya:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Tidak akan ada yang tampil sampai hal tersebut Anda lakukan.

---
### Saya Mendapatkan Pesan Kesalahan: "*Target container is not a DOM element*" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Pesan kesalahan ini menyatakan apapun yang Anda berikan ke `createRoot` bukan sebuah node DOM.

Jika Anda tidak yakin apa yang terjadi, cobalah menglog variabel tersebut:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Sebagai contoh, jika `domNode` tersebut `null`, artinya [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) mengembalikan `null`. Hal ini terjadi jika tidak ada node dalam dokumen yang memiliki ID yang Anda coba cari. Ada beberapa alasan yang memungkinkan:

1. ID yang Anda cari mungkin berbeda dengan ID yang Anda gunakan pada file HTML Anda. Cek *typo*!
2. Tag `<script>` pada *bundle* Anda tidak dapat "melihat" node DOM apapun yang muncul *setelahnya* dalam HTML.

Kesalahan umum lainnya untuk pesan kesalahan ini adalah penulisan `createRoot(<App />)` yang seharusnya `createRoot(domNode)`.

---

### Saya Mendapatkan Pesan Kesalahan: "*Functions are not valid as a React child.*" {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Pesan kesalahan ini menyatakan bahwa apapun yang Anda berikan pada `root.render` bukan sebuah komponen React.

Hal ini mungkin terjadi jika Anda memanggil `root.render` dengan `Component`, yang seharusnya `<Component />`.

```js {2,5}
// 🚩 Salah: App adalah fungsi, bukan komponen.
root.render(App);

// ✅ Benar: <App /> adalah komponen.
root.render(<App />);
```

Kemungkinan lainnya, saat Anda memberikan sebuah fungsi ke `root.render`, yang seharusnya hasil dari pemanggilannya.

```js {2,5}
// 🚩 Salah: createApp adalah fungsi, bukan komponen.
root.render(createApp);

// ✅ Benar: panggil createApp untuk mengembalikan sebuah komponen.
root.render(createApp());
```

---

### HTML yang Dirender oleh Server Selalu Dibuat Ulang dari Awal {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Jika aplikasi Anda adalah aplikasi yang dirender oleh server dan menggunakan HTML awal yang dibuat oleh React, Anda mungkin akan menyadari bahwa dengan membuat induk dan memanggil `root.render` menghapus seluruh HTML tersebut dan membuat ulang node-node DOM dari awal. Hal ini dapat memperlambat, mereset fokus dan posisi *scroll*, dan mungkin menghilangkan *input* dari pengguna.

Aplikasi yang dirender oleh server harus menggunakan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), bukan `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Mohon dicatat bahwa APInya berbeda. Lebih spesifiknya, biasanya tidak akan ada lagi panggilan `root.render`.
