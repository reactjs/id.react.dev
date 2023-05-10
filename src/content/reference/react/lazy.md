---
title: lazy
---

<Intro>

`lazy` memungkinkan Anda menangguhkan (*defer*) pemuatan kode komponen hingga komponen tersebut di-*render* untuk pertama kalinya.

```js
const SomeComponent = lazy(load)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `lazy(load)` {/*lazy*/}

Panggil fungsi `lazy` di luar komponen apapun untuk mendeklarasikan *lazy-loaded* komponen React:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `load`: Sebuah fungsi yang mengembalikan [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau *thenable* lain (sebuah objek yang mirip dengan *Promise* dan memiliki metode `then`). React tidak akan memanggil `load` sampai pertama kali Anda mencoba untuk me-*render* komponen yang dikembalikan. Setelah React pertama kali memanggil `load`, React akan menunggu sampai komponen itu selesai, dan kemudian me-*render* nilai yang telah diselesaikan sebagai komponen React. Baik *Promise* yang dikembalikan maupun nilai yang diselesaikan dari *Promise* akan dicache, sehingga React tidak akan memanggil `load` lebih dari satu kali. Jika *Promise* menolak (`reject`), React akan melempar (`throw`) alasan penolakan ke *Error Boundary* terdekat untuk ditangani.

#### Kembalian {/*returns*/}

`lazy` mengembalikan komponen React yang dapat Anda *render* di dalam *tree*. Ketika kode untuk komponen *lazy* masih dimuat, mencoba me-*render*nya akan *suspend.* Gunakan [`<Suspense>`](/reference/react/Suspense) untuk menampilkan indikator pemuatan ketika komponen tersebut dimuat.

---

### Fungsi `load` {/*load*/}

#### Parameter {/*load-parameters*/}

`load` tidak menerima parameter.

#### Kembalian {/*load-returns*/}

Anda perlu mengembalikan sebuah [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau *thenable* lain (sebuah objek yang mirip dengan *Promise* dan memiliki metode `then`). Pada akhirnya, komponen ini harus diselesaikan ke tipe komponen React yang valid, seperti sebuah fungsi, [`memo`](/reference/react/memo), atau [`forwardRef`](/reference/react/forwardRef) komponen.

---

## Penggunaan {/*usage*/}

### Lazy-loading komponen dengan Suspense {/*suspense-for-code-splitting*/}

Biasanya, Anda mengimpor komponen dengan deklarasi statis [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) :

```js
import MarkdownPreview from './MarkdownPreview.js';
```

Untuk menunda pemuatan kode komponen ini hingga di-*render* untuk pertama kalinya, ganti *import* ini dengan:

```js
import { lazy } from 'react';

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
```

Kode ini bergantung pada [dynamic `import()`,](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import) yang mungkin memerlukan dukungan dari *bundler* atau *framework* yang Anda gunakan.

Setelah kode komponen Anda dimuat saat digunakan (*on demand*), Anda juga perlu menentukan apa yang harus ditampilkan ketika dimuat. Anda dapat melakukan ini dengan membungkus komponen *lazy* atau salah satu induknya ke dalam [`<Suspense>`](/reference/react/Suspense):

```js {1,4}
<Suspense fallback={<Loading />}>
  <h2>Preview</h2>
  <MarkdownPreview />
 </Suspense>
```

Pada contoh ini, kode untuk `MarkdownPreview` tidak akan dimuat hingga Anda mencoba me-*render*nya. Jika `MarkdownPreview` belum dimuat, Komponen `Loading` akan ditampilkan sebagai gantinya. Coba centang *checkbox* **Lihat pratinjau**:

<Sandpack>

```js App.js
import { useState, Suspense, lazy } from 'react';
import Loading from './Loading.js';

const MarkdownPreview = lazy(() => delayForDemo(import('./MarkdownPreview.js')));

export default function MarkdownEditor() {
  const [showPreview, setShowPreview] = useState(false);
  const [markdown, setMarkdown] = useState('Helo, **dunia**!');
  return (
    <>
      <textarea value={markdown} onChange={e => setMarkdown(e.target.value)} />
      <label>
        <input type="checkbox" checked={showPreview} onChange={e => setShowPreview(e.target.checked)} />
        Lihat pratinjau
      </label>
      <hr />
      {showPreview && (
        <Suspense fallback={<Loading />}>
          <h2>Pratinjau</h2>
          <MarkdownPreview markdown={markdown} />
        </Suspense>
      )}
    </>
  );
}

// Add a fixed delay so you can see the loading state
function delayForDemo(promise) {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  }).then(() => promise);
}
```

```js Loading.js
export default function Loading() {
  return <p><i>Sedang memuat...</i></p>;
}
```

```js MarkdownPreview.js
import { Remarkable } from 'remarkable';

const md = new Remarkable();

export default function MarkdownPreview({ markdown }) {
  return (
    <div
      className="content"
      dangerouslySetInnerHTML={{__html: md.render(markdown)}}
    />
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
label {
  display: block;
}

input, textarea {
  margin-bottom: 10px;
}

body {
  min-height: 200px;
}
```

</Sandpack>

Demo ini dimuat dengan penundaan buatan. Lain kali Anda menghapus centang dan mencentang *checkbox* **Lihat pratinjau**, Komponen `Preview` akan dicache, sehingga tidak akan ada status pemuatan. Untuk melihat status pemuatan lagi, Klik *"Reset"* pada *sandbox*.

[Pelajari lebih lanjut tentang mengelola status pemuatan dengan Suspense.](/reference/react/Suspense)

---

## Pemecahan Masalah {/*troubleshooting*/}

### State komponen `lazy` saya disetel ulang secara tidak terduga {/*my-lazy-components-state-gets-reset-unexpectedly*/}

Jangan deklarasikan komponen `lazy` *di dalam* komponen lain:

```js {4-5}
import { lazy } from 'react';

function Editor() {
  // 🔴 Buruk: Ini akan menyebabkan semua status di-reset pada render ulang
  const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));
  // ...
}
```

Sebaiknya, selalu deklarasikan mereka di tingkat teratas modul Anda:

```js {3-4}
import { lazy } from 'react';

// ✅ Bagus: Mendeklarasikan komponen lazy di luar komponen Anda
const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

function Editor() {
  // ...
}
```
