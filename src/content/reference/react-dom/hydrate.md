---
title: hydrate
---

<Deprecated>

API ini akan dihapus pada React mayor versi berikutnya.

Di React 18, `hydrate` digantikan oleh [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Menggunakan `hydrate` di React 18 akan memberi peringatan bahwa aplikasi Anda akan berperilaku seakan-akan sedang berjalan di React 17. Pelajari selengkapnya [di sini.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`hydrate` memungkinkan anda menampilkan komponen React di dalam node DOM peramban yang konten HTML-nya sebelumnya telah dihasilkan oleh [`react-dom/server`](/reference/react-dom/server) di React 17 dan yang lebih rendah.

```js
hydrate(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `hydrate(reactNode, domNode, callback?)` {/*hydrate*/}

Memanggil `hydrate` di React 17 dan yang lebih rendah untuk "melekatkan" React ke HTML yang sudah ada sebelumnya yang dihasilkan oleh React di lingkungan *server*.

```js
import { hydrate } from 'react-dom';

hydrate(reactNode, domNode);
```

React akan melekat pada HTML yang ada di dalam `domNode`, dan mengambil alih pengelolaan DOM di dalamnya. Sebuah aplikasi yang sepenuhnya dibangun dengan React biasanya hanya akan memiliki satu `hydrate` pemanggilan dengan komponen akarnya.

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `reactNode`: "Node "React" digunakan untuk me-*render* HTML yang sudah ada. Ini biasanya berupa potongan JSX seperti `<App />` yang di-*render* dengan metode (*method*) `ReactDOM Server` seperti `renderToString(<App />)` di React 17.

* `domNode`: Sebuah [elemen DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element) yang di-*render* sebagai elemen akar di *server*.

* **opsional**: `callback`: Sebuah fungsi. Jika diberikan, React akan memanggilnya setelah komponen anda terhidrasi (*hydrated*).

#### Kembalian {/*returns*/}

`hydrate` mengembalikan nilai kosong (*null*).

#### Catatan {/*caveats*/}
* `hydrate` mengharapkan konten yang di-*render* identik dengan konten yang di-*render* di *server*. React dapat memperbaiki perbedaan dalam konten teks, tetapi Anda seharusnya memperlakukan ketidakcocokan tersebut sebagai *bug* dan memperbaikinya sendiri.
* Dalam mode pengembangan, React memberi peringatan tentang ketidakcocokan selama hidrasi (*hydration*). Tidak ada jaminan bahwa perbedaan atribut akan diperbaiki dalam kasus ketidakcocokan. Ini penting untuk alasan kinerja karena dalam sebagian besar aplikasi, ketidakcocokan jarang terjadi, sehingga memvalidasi semua markup akan menjadi sangat mahal.
* Kemungkinan Anda hanya akan memiliki satu pemanggilan `hydrate` dalam aplikasi Anda. Jika Anda menggunakan sebuah *framework*, mungkin *framework* tersebut melakukan panggilan ini untuk Anda.
* Jika aplikasi anda di-*render* oleh klien tanpa HTML yang sudah di-*render* sebelumnya, penggunaan `hydrate()` tidak didukung. Alih-alih menggunakan `hydrate()`, gunakanlah [render()](/reference/react-dom/render) (untuk React 17 dan lebih rendah) or [createRoot()](/reference/react-dom/client/createRoot) (untuk React 18+) sebaliknya.

---

## Penggunaan {/*usage*/}

Panggil `hydrate` untuk melekatkan sebuah <CodeStep step={1}>komponen React</CodeStep> kepada <CodeStep step={2}>simpul DOM peramban</CodeStep> yang di-*render* di *server*.

```js [[1, 3, "<App />"], [2, 3, "document.getElementById('root')"]]
import { hydrate } from 'react-dom';

hydrate(<App />, document.getElementById('root'));
````

Penggunaan `hydrate()` untuk me-*render* aplikasi hanya di sisi klien (aplikasi tanpa HTML yang di-*render* oleh server) tidak didukung. Alih-alih menggunakan `hydrate()`, gunakanlah [`render()`](/reference/react-dom/render) (di React 17 dan lebih rendah) atau [`createRoot()`](/reference/react-dom/client/createRoot) (di React 18+).

### Menghidrasi HTML yang di-*render* oleh server {/*hydrating-server-rendered-html*/}

Di React, "hidrasi" adalah bagaimana React "melekatkan" ke HTML yang sudah ada sebelumnya yang telah di-*render* oleh React di lingkungan *server*. Selama hidrasi, React akan mencoba untuk melekatkan *event listeners* ke *markup* yang ada dan mengambil alih pe-*render*-an aplikasi pada sisi klien.

Pada aplikasi yang sepenuhnya dibangun dengan React, **biasanya Anda hanya akan meng-hidrasi satu "akar" ("*root*"), yakni sekali saat memulai menjalankan seluruh aplikasi Anda"**.

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Halo, dunia!</h1></div>
```

```js index.js active
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js
export default function App() {
  return <h1>Halo, dunia!</h1>;
}
```

</Sandpack>

Biasanya anda tidak perlu memanggil `hydrate` lagi atau memanggilnya di tempat lain. Dari titik ini, React akan mengelola DOM dari aplikasi anda. Untuk memperbarui UI, komponen akan [menggunakan state.](/reference/react/useState)

Untuk informasi lebih lanjut tentang hidrasi, lihat dokumen untuk [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot)

---

### Menghilangkan kesalahan ketidakcocokan hidrasi yang tidak dapat dihindari {/*suppressing-unavoidable-hydration-mismatch-errors*/}

Jika satu atribut elemen atau konten teks secara tidak terhindarkan berbeda antara server dan klien (misalnya, timestamp), Anda dapat menghilangkan peringatan ketidakcocokan hidrasi.

Untuk menghilangkan peringatan hidrasi pada elemen, tambahkan `suppressHydrationWarning={true}`:

<Sandpack>

```html public/index.html
<!--
  HTML content inside <div id="root">...</div>
  was generated from App by react-dom/server.
-->
<div id="root"><h1>Tanggal Saat ini: 01/01/2020</h1></div>
```

```js index.js
import './styles.css';
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
```

```js App.js active
export default function App() {
  return (
    <h1 suppressHydrationWarning={true}>
      Tanggal Saat ini: {new Date().toLocaleDateString()}
    </h1>
  );
}
```

</Sandpack>

Hal ini hanya berfungsi untuk satu level kedalaman saja dan dimaksudkan untuk menjadi jalan keluar ketika tidak ada pilihan lain. Jangan terlalu sering menggunakannya. Kecuali jika itu adalah konten teks, React masih tidak akan mencoba memperbaikinya, sehingga konten tersebut mungkin tetap tidak konsisten sampai dengan update yang akan datang.

---

### Mengatasi konten berbeda antara client dan server {/*handling-different-client-and-server-content*/}

Jika anda sengaja perlu me-*render* sesuatu yang berbeda di server dan klien, anda dapat melakukan dua kali pe-*render*-an. Komponen yang me-*render* sesuatu yang berbeda pada sisi klien dapat di baca di [*variabel state*](/reference/react/useState) seperti `isClient`, yang dapat ditetapkan ke `true` dalam sebuah [efek](/reference/react/useEffect):

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
import { hydrate } from 'react-dom';
import App from './App.js';

hydrate(<App />, document.getElementById('root'));
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

Dengan cara ini, proses *render* awal akan me-*render* konten yang sama dengan *server*, menghindari ketidakcocokan, tetapi ada tambahan proses synchronously setelah hidrasi.

<Pitfall>

Metode ini membuat hidrasi lebih lambat karena komponen Anda harus di-*render* dua kali. Pertimbangkan pengalaman pengguna pada koneksi yang lambat. Kode JavaScript dapat dimuat jauh setelah *render* HTML awal, sehingga me-*render* UI yang berbeda langsung setelah hidrasi dapat terasa tidak nyaman bagi pengguna.

</Pitfall>
