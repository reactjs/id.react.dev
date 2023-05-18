---
title: hydrateRoot
---

<Intro>

`hydrateRoot` memungkinkan Anda menampilkan komponen React di dalam *DOM node* peramban yang konten HTML-nya sebelumnya dibuat oleh [`react-dom/server`.](/reference/react-dom/server)

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `hydrateRoot(domNode, reactNode, options?)` {/*hydrateroot*/}

Panggil fungsi `hydrateRoot` untuk “menambahkan” React ke dalam HTML yang sudah ada yang sebelumnya di-render oleh React di dalam *environment server*.

```js
import { hydrateRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = hydrateRoot(domNode, reactNode);
```

React akan ditambahkan ke dalam HTML yang ada di dalam `domNode`, dan mengambil alih pengelolaan DOM didalamnya. Sebuah aplikasi yang sepenuhnya dibangun dengan React biasanya hanya akan memiliki satu pemanggilan `hydrateRoot` dengan komponen *root*-nya.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `domNode`: [Elemen DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) yang di-render sebagai elemen akar di *server*.

* `reactNode`: "React node" yang digunakan untuk me-render HTML yang ada. Biasanya berupa bagian dari JSX seperti `<App />` yang dengan *method* `ReactDOM Server` seperti `renderToPipeableStream(<App />)`.

* **opsional** `options`: Objek dengan opsi untuk akar React.

  * **opsional** `onRecoverableError`: *Callback* dipanggil ketika React secara otomatis pulih dari kesalahan.
  * **opsional** `identifierPrefix`: Awalan string yang digunakan React untuk ID yang dihasilkan oleh [`useId`.](/reference/react/useId) Berguna untuk menghindari konflik ketika menggunakan beberapa akar pada halaman yang sama. Harus awalan yang sama dengan yang digunakan pada *server*.


#### Kembalian {/*returns*/}

`hydrateRoot` mengembalikan objek dengan dua *method*: [`render`](#root-render) dan [`unmount`.](#root-unmount)

#### Catatan penting {/*caveats*/}

* `hydrateRoot()` mengharapkan konten yang di-render identik dengan konten yang di-render *server*. Anda harus memperlakukan ketidakcocokan sebagai bug dan memperbaikinya.
* Dalam mode pengembangan, React memperingatkan tentang ketidakcocokan selama *hydration*. Tidak ada jaminan bahwa perbedaan atribut akan diperbaiki jika terjadi ketidakcocokan. Hal ini penting untuk alasan performa karena pada sebagian besar aplikasi, ketidakcocokan jarang terjadi, sehingga memvalidasi semua *markup* akan sangat mahal.
* Anda mungkin hanya akan memiliki satu panggilan `hydrateRoot` dalam aplikasi Anda. Jika Anda menggunakan framework, framework tersebut mungkin akan melakukan pemanggilan ini untuk Anda.
* Jika aplikasi Anda di-render oleh klien tanpa HTML yang telah di-render, penggunaan `hydrateRoot()` tidak disarankan. Sebaiknya gunakan [`createRoot()`](/reference/react-dom/client/createRoot).

---

### `root.render(reactNode)` {/*root-render*/}

Panggil `root.render` untuk memperbarui komponen React di dalam *hydrated React root* untuk elemen DOM peramban.

```js
root.render(<App />);
```

React akan memperbarui `<App />` di dalam *hydrated* `root`.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*root-render-parameters*/}

* `reactNode`: Sebuah "React node" yang ingin Anda perbarui. Biasanya berupa bagian dari JSX seperti `<App />`, tetapi Anda juga dapat mengoper elemen React yang dibangun dengan [`createElement()`](/reference/react/createElement), sebuah *string*, sebuah angka, `null`, atau `undefined`.


#### Kembalian {/*root-render-returns*/}

`root.render` mengembalikan `undefined`.

#### Catatan penting {/*root-render-caveats*/}

* Jika Anda memanggil `root.render` sebelum akar selesai melakukan *hydrating*, React akan menghapus konten HTML yang di-render oleh *server* dan mengalihkan seluruh akar ke render klien.

---

### `root.unmount()` {/*root-unmount*/}

Panggil `root.unmount` untuk menghancurkan pohon yang di-render di dalam akar React.

```js
root.unmount();
```

Aplikasi yang sepenuhnya dibangun dengan React biasanya tidak akan memiliki panggilan ke `root.unmount`.

Hal ini sangat berguna jika akar React DOM node (atau salah satu dari induknya) mungkin akan dihapus dari DOM oleh kode lain. Sebagai contoh, bayangkan sebuah panel *tab* jQuery menghapus *tab* yang tidak aktif dari DOM. Jika sebuah *tab* dihapus, semua yang ada di dalamnya (termasuk akar React di dalamnya) akan dihapus dari DOM juga. Anda perlu memberi tahu React untuk "berhenti" mengelola akar konten yang telah dihapus dengan memanggil `root.unmount`. Jika tidak, komponen-komponen di dalam akar yang dihapus tidak akan dibersihkan dan membebaskan sumber daya seperti langganan.

Memanggil `root.unmount` akan melepas semua komponen di root dan "melepaskan" React dari akar DOM node, termasuk menghapus semua *event handler* atau *state* di dalam pohon. 


#### Parameter {/*root-unmount-parameters*/}

`root.unmount` tidak menerima parameter apa pun.


#### Kembalian {/*root-unmount-returns*/}

`render` mengembalikan `null`.

#### Catatan penting {/*root-unmount-caveats*/}

* Memanggil `root.unmount` akan melepas semua komponen di dalam pohon dan "melepaskan" React dari akar DOM node.

* Setelah Anda memanggil `root.unmount` Anda tidak dapat memanggil `root.render` lagi pada akar. Mencoba memanggil `root.render` pada akar yang tidak terpasang akan menimbulkan kesalahan berupa *"Cannot update an unmounted root"*.

---

## Penggunaan {/*usage*/}

### Meng-*hydrate* *server* yang di-render di HTML {/*hydrating-server-rendered-html*/}

Jika HTML aplikasi Anda dibuat oleh [`react-dom/server`](/reference/react-dom/client/createRoot), Anda perlu melakukan *hydrate* kepada klien.

```js [[1, 3, "document.getElementById('root')"], [2, 3, "<App />"]]
import { hydrateRoot } from 'react-dom/client';

hydrateRoot(document.getElementById('root'), <App />);
````

Ini akan meng-*hydrate* *server* HTML di dalam <CodeStep step={1}>peramban DOM node</CodeStep> dengan <CodeStep step={2}>komponen React</CodeStep> untuk aplikasi Anda. Biasanya, Anda akan melakukannya sekali pada saat dijalankan. Jika Anda menggunakan framework, framework tersebut mungkin akan melakukan hal ini di belakang layar untuk Anda.

Untuk meng-*hydrate* aplikasi Anda, React akan "menambahkan" logika komponen Anda ke HTML yang dihasilkan dari *server*. *Hydration* mengubah gambaran HTML awal dari *server* menjadi aplikasi yang sepenuhnya interaktif yang berjalan di peramban.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Halo, dunia!</h1><button>Anda mengklik Saya sebanyak <!-- -->0<!-- --> kali</button></div>
```

```js index.js active
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
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
      Anda mengklik Saya sebanyak {count} kali
    </button>
  );
}
```

</Sandpack>

Anda seharusnya tidak perlu memanggil `hydrateRoot` lagi atau memanggilnya di banyak tempat. Mulai saat ini, React akan mengelola DOM aplikasi Anda. Untuk memperbarui UI, komponen Anda akan [menggunakan *state*](/reference/react/useState) sebagai gantinya.

<Pitfall>

Pohon React yang Anda berikan ke `hydrateRoot` harus menghasilkan **keluaran yang sama** dengan yang dihasilkan di server.

Hal ini penting untuk pengalaman pengguna. Pengguna akan menghabiskan waktu untuk melihat HTML yang dihasilkan server sebelum kode JavaScript Anda dimuat. Perenderan server menciptakan ilusi bahwa aplikasi dimuat lebih cepat dengan menampilkan cuplikan HTML dari keluarannya. Menampilkan konten yang berbeda secara tiba-tiba akan mematahkan ilusi tersebut. Inilah sebabnya mengapa output render server harus sesuai dengan output render awal pada client.

Penyebab paling umum yang menyebabkan kesalahan *hydration* antara lain:

* Spasi ekstra (seperti baris baru) di sekitar HTML yang dihasilkan React di dalam akar node.
* Menggunakan pemeriksaan seperti `typeof window !== 'undefined'` dalam logika *rendering* Anda.
* Menggunakan API khusus peramban seperti [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia) dalam logika *rendering* Anda.
* Me-render data yang berbeda pada server dan klien.

React pulih dari beberapa kesalahan *hydration*, tetapi **Anda harus memperbaikinya seperti *bug* lainnya.** Dalam kasus terbaik, mereka akan menyebabkan perlambatan; dalam kasus terburuk, *event handler* dapat melekat pada elemen yang salah.

</Pitfall>

---

### Meng-*hydrate* seluruh dokumen {/*hydrating-an-entire-document*/}

Aplikasi yang sepenuhnya dibangun dengan React dapat me-render seluruh dokumen sebagai JSX, termasuk *tag* [`<html>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/html):

```js {3,13}
function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>My app</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

Untuk meng-*hydrate* seluruh dokumen, berikan [`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document) bersifat *global* sebagai argumen pertama ke `hydrateRoot`:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

---

### Menekan kesalahan ketidakcocokan *hydration* yang tidak dapat dihindari {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Jika atribut atau konten teks dari satu elemen tidak dapat dihindari berbeda antara *server* dan klien (misalnya, *timestamp*), Anda dapat membungkam peringatan ketidakcocokan *hydration*.

Untuk membungkam peringatan hydration pada sebuah elemen, tambahkan `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Tanggal sekarang: <!-- -->01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Tanggal Sekarang: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Ini hanya berfungsi satu tingkat, dan dimaksudkan sebagai jalan keluar. Jangan terlalu sering menggunakannya. Kecuali jika itu adalah konten teks, React masih belum mencoba untuk memperbaikinya, sehingga mungkin tetap tidak konsisten hingga pembaruan di masa mendatang.

---

### Menangani konten klien dan *server* yang berbeda {/*handling-different-client-and-server-content*/}

Jika Anda secara sengaja ingin me-render sesuatu yang berbeda di *server* dan klien, Anda dapat melakukan *rendering* dua kali. Komponen yang me-render sesuatu yang berbeda di klien dapat membaca [variabel *state*](/reference/react/useState) seperti `isClient`, yang dapat Anda setel menjadi `true` di dalam [*Effect*](/reference/react/useEffect):

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Is Server</h1></div>
```

```js index.js
import './styles.css';
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

```js App.js active
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <h1>
      {isClient ? 'Is Client' : 'Is Server'}
    </h1>
  );
}
```

</Sandpack>

Dengan cara ini proses render awal akan me-render konten yang sama seperti *server*, sehingga menghindari ketidakcocokan, tetapi proses tambahan akan terjadi secara serempak setelah *hydration*.

<Pitfall>

Pendekatan ini membuat *hydration* menjadi lebih lambat karena  komponen Anda harus di-render dua kali. Perhatikan pengalaman pengguna pada koneksi yang lambat. Kode JavaScript dapat dimuat secara signifikan lebih lambat daripada render HTML awal, sehingga me-render UI yang berbeda segera setelah *hydration* juga dapat terasa mengagetkan pengguna.

</Pitfall>

---

### Memperbarui *hydrated root component* {/*updating-a-hydrated-root-component*/}

Setelah root telah selesai melakukan proses *hydrating*, Anda dapat memanggil [`root.render`](#root-render) untuk memperbarui komponen root React. **Tidak seperti pada [`createRoot`](/reference/react-dom/client/createRoot), Anda biasanya tidak perlu melakukan hal ini karena konten awal telah di-render sebagai HTML.**

Jika Anda memanggil `root.render` pada suatu saat setelah *hydration*, dan struktur pohon komponen sesuai dengan apa yang sebelumnya di-render, React akan [mempertahankan state.](/learn/preserving-and-resetting-state) Perhatikan bagaimana Anda dapat mengetikkan input, dimana pembaruan dari pemanggilan `render` diulang-ulang setiap detik pada contoh ini tidak bersifat destruktif:

<Sandpack>

```html public/index.html
<!--
  All HTML content inside <div id="root">...</div> was
  generated by rendering <App /> with react-dom/server.
-->
<div id="root"><h1>Halo, dunia! <!-- -->0</h1><input placeholder="Ketik sesuatu di sini"/></div>
```

```js index.js active
import { hydrateRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = hydrateRoot(
  document.getElementById('root'),
  <App counter={0} />
);

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
      <h1>Halo, dunia! {counter}</h1>
      <input placeholder="Ketik sesuatu di sini" />
    </>
  );
}
```

</Sandpack>

Tidak lazim untuk memanggil [`root.render`](#root-render) pada *hydrated root*. Biasanya, Anda akan [memperbarui *state*](/reference/react/useState) di dalam salah satu komponen sebagai gantinya.
