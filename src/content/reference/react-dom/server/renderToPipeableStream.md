---
title: renderToPipeableStream
---

<Intro>

`renderToPipeableStream` me-*render* pohon (*tree*) React menjadi [Node.js Stream](https://nodejs.org/api/stream.html) yang *pipeable*.

```js
const { pipe, abort } = renderToPipeableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API ini spesifik untuk Node.js. *Environment* dengan [*Web Streams,*](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) seperti Deno dan *edge runtime* modern, harus menggunakan [`renderToReadableStream`](/reference/react-dom/server/renderToReadableStream) sebagai gantinya.

</Note>

---

## Referensi {/*reference*/}

### `renderToPipeableStream(reactNode, options?)` {/*rendertopipeablestream*/}

Panggil `renderToPipeableStream` untuk me-*render* pohon React Anda sebagai HTML menjadi [*Node.js Stream.*](https://nodejs.org/api/stream.html#writable-streams)

```js
import { renderToPipeableStream } from 'react-dom/server';

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Di sisi klien, panggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk membuat HTML yang dihasilkan *server* menjadi interaktif.

[Lihat contoh lainnya.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: Node React yang ingin anda *render* menjadi HTML. Contohnya, sebuah elemen JSX seperti `<App />`. Ini diharapkan mewakili keseluruhan dokumen. Jadi, komponen `App` harus me-*render tag* `<html>`.

<<<<<<< HEAD
* `options` **(opsional)**: Objek berisi opsi *streaming*.
  * `bootstrapScriptContent` **(opsional)**: Jika ditentukan, *string* ini akan diletakkan di dalam *tag* `<script>` *inline*.
  * `bootstrapScripts` **(opsional)**: Senarai URL *string* untuk *tag* `<script>` yang akan di-*emit* (dipancarkan) di halaman. Gunakan ini untuk menyertakan `<script>` yang memanggil [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Abaikan jika Anda sama sekali tidak ingin menjalankan React di sisi klien.
  * `bootstrapModules` **(opsional)**: Sama seperti `bootstrapScripts`, tetapi meng-*emit* [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) sebagai gantinya.
  * `identifierPrefix` **(opsional)**: Awalan *string* yang digunakan React untuk ID yang dihasilkan oleh [`useId`.](/reference/react/useId) Berguna untuk menghindari konflik saat menggunakan banyak *root* di halaman yang sama. Harus sama dengan awalan yang dioper ke [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * `namespaceURI` **(opsional)**: *String* dengan [URI namespace](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) *root* untuk *streaming.* *Default* ke HTML biasa. Berikan `'http://www.w3.org/2000/svg'` untuk SVG atau `'http://www.w3.org/1998/Math/MathML'` untuk MathML.
  * `nonce` **(opsional)**: *String* [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) untuk mengizinkan skrip untuk [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * `onAllReady` **(opsional)**: *Callback* yang diaktifkan saat semua proses *rendering* selesai, termasuk [*shell*](#specifying-what-goes-into-the-shell) dan semua [konten](#streaming-more-content-as-it-loads) tambahan. Anda dapat menggunakan ini sebagai ganti `onShellReady` [untuk *crawler* dan *static generation*.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Jika Anda memulai *streaming* di sini, Anda tidak akan mendapatkan *progressive loading* apa pun. *Stream* akan berisi HTML final.
  * `onError` **(opsional)**: *Callback* yang diaktifkan setiap kali ada kesalahan *server*, baik yang [dapat dipulihkan](#recovering-from-errors-outside-the-shell) atau [tidak.](#recovering-from-errors-inside-the-shell) Secara *default*, ini hanya memanggil `console.error`. Jika Anda menggantinya untuk [mencatat laporan kerusakan,](#logging-crashes-on-the-server) pastikan anda masih memanggil `console.error`. Anda juga dapat menggunakannya untuk [menyesuaikan kode status](#setting-the-status-code) sebelum *shell* di-*emit.*
  * `onShellReady` **(opsional)**: *Callback* yang diaktifkan tepat setelah [*shell* awal](#specifying-what-goes-into-the-shell) di-*render*. Anda dapat [mengatur kode status](#setting-the-status-code) dan memanggil `pipe` di sini untuk memulai *streaming.* React akan [mengalirkan konten tambahan](#streaming-more-content-as-it-loads) setelah *shell* bersama *tag* `<script>` *inline* yang menggantikan *fallback* pemuatan HTML dengan konten.
  * `onShellError` **(opsional)**: *Callback* yang diaktifkan jika ada *error* saat me-*render* *shell* awal.  Ini menerima *error* sebagai argumen. Belum ada bita yang di-*emit* dari *stream.* `onShellReady` maupun `onAllReady` tidak akan dipanggil. Dengan demikian, Anda dapat [menampilkan *shell* HTML *fallback*.](#recovering-from-errors-inside-the-shell)
  * `progressiveChunkSize` **(opsional)**: Jumlah bita dalam sebuah *chunk.* [Baca lebih lanjut tentang *default heuristic.*](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
=======
* **optional** `options`: An object with streaming options.
  * **optional** `bootstrapScriptContent`: If specified, this string will be placed in an inline `<script>` tag.
  * **optional** `bootstrapScripts`: An array of string URLs for the `<script>` tags to emit on the page. Use this to include the `<script>` that calls [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Omit it if you don't want to run React on the client at all.
  * **optional** `bootstrapModules`: Like `bootstrapScripts`, but emits [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) instead.
  * **optional** `identifierPrefix`: A string prefix React uses for IDs generated by [`useId`.](/reference/react/useId) Useful to avoid conflicts when using multiple roots on the same page. Must be the same prefix as passed to [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
  * **optional** `namespaceURI`: A string with the root [namespace URI](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important_namespace_uris) for the stream. Defaults to regular HTML. Pass `'http://www.w3.org/2000/svg'` for SVG or `'http://www.w3.org/1998/Math/MathML'` for MathML.
  * **optional** `nonce`: A [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) string to allow scripts for [`script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
  * **optional** `onAllReady`: A callback that fires when all rendering is complete, including both the [shell](#specifying-what-goes-into-the-shell) and all additional [content.](#streaming-more-content-as-it-loads) You can use this instead of `onShellReady` [for crawlers and static generation.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) If you start streaming here, you won't get any progressive loading. The stream will contain the final HTML.
  * **optional** `onError`: A callback that fires whenever there is a server error, whether [recoverable](#recovering-from-errors-outside-the-shell) or [not.](#recovering-from-errors-inside-the-shell) By default, this only calls `console.error`. If you override it to [log crash reports,](#logging-crashes-on-the-server) make sure that you still call `console.error`. You can also use it to [adjust the status code](#setting-the-status-code) before the shell is emitted.
  * **optional** `onShellReady`: A callback that fires right after the [initial shell](#specifying-what-goes-into-the-shell) has been rendered. You can [set the status code](#setting-the-status-code) and call `pipe` here to start streaming. React will [stream the additional content](#streaming-more-content-as-it-loads) after the shell along with the inline `<script>` tags that replace the HTML loading fallbacks with the content.
  * **optional** `onShellError`: A callback that fires if there was an error rendering the initial shell.  It receives the error as an argument. No bytes were emitted from the stream yet, and neither `onShellReady` nor `onAllReady` will get called, so you can [output a fallback HTML shell.](#recovering-from-errors-inside-the-shell)
  * **optional** `progressiveChunkSize`: The number of bytes in a chunk. [Read more about the default heuristic.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
>>>>>>> 5138e605225b24d25701a1a1f68daa90499122a4


#### Kembalian {/*returns*/}

`renderToPipeableStream` mengembalikan objek dengan dua metode:

* `pipe` menghasilkan HTML dalam bentuk [*Writable Node.js Stream*](https://nodejs.org/api/stream.html#writable-streams) yang disediakan. Panggil `pipe` dalam `onShellReady` jika Anda ingin mengaktifkan *streaming*, atau panggil dalam `onAllReady` untuk *crawler* dan *static generation.*
* `abort` memungkinkan Anda [membatalkan *server rendering*](#aborting-server-rendering) dan me-*render* sisanya di sisi klien.

---

## Penggunaan {/*usage*/}

### Me-render pohon React sebagai HTML menjadi Node.js Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-stream*/}

Panggil `renderToPipeableStream` untuk me-*render* pohon React Anda sebagai HTML menjadi [*Node.js Stream:*](https://nodejs.org/api/stream.html#writable-streams)

```js [[1, 5, "<App />"], [2, 6, "['/main.js']"]]
import { renderToPipeableStream } from 'react-dom/server';

// Sintaks route handler tergantung framework backend yang Anda gunakan
app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Bersamaan dengan <CodeStep step={1}>komponen *root*</CodeStep>, Anda perlu menyediakan daftar <CodeStep step={2}>*path* `<script>` *bootstrap*</CodeStep>. Komponen *root* Anda harus mengembalikan **seluruh dokumen termasuk *tag root* `<html>`.**

Misalnya, mungkin terlihat seperti ini:

```js [[1, 1, "App"]]
export default function App() {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/styles.css"></link>
        <title>Aplikasi Saya</title>
      </head>
      <body>
        <Router />
      </body>
    </html>
  );
}
```

React akan menyisipkan [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) dan *tag* <CodeStep step={2}>*bootstrap* `<script>`</CodeStep> Anda ke dalam *stream* HTML yang dihasilkan:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML dari komponen Anda ... -->
</html>
<script src="/main.js" async=""></script>
```

Di sisi klien, skrip *bootstrap* Anda harus [menghidrasi seluruh `document` dengan memanggil `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Ini akan melampirkan *event listener* untuk HTML yang dibuat *server* dan menjadikannya interaktif.

<DeepDive>

#### Membaca path aset CSS and JS dari keluaran build {/*reading-css-and-js-asset-paths-from-the-build-output*/}

URL aset yang bersifat *final* (seperti file JavaScript and CSS) sering kali di-*hash* setelah proses *build* (pembangunan). Misalnya, alih-alih `styles.css` Anda mungkin mendapatkan `styles.123456.css`. *Hashing* nama file aset statis menjamin sebuah aset pada setiap *build* memiliki nama file yang berbeda. Ini berguna karena memungkinkan anda mengaktifkan *caching* jangka panjang dengan aman untuk aset statis: file dengan nama tertentu tidak akan mengubah konten.

Namun, jika Anda tidak mengetahui URL aset hingga selesainya proses *build*, tidak ada cara bagi Anda untuk memasukkan aset tersebut ke dalam *source code.* Misalnya, *hardcoding* `"/styles.css"` dalam JSX seperti sebelumnya tidak akan berfungsi. Untuk menjauhkan aset tersebut dari *source code* Anda, komponen *Root* dapat membaca nama file asli dari *map* yang dioper sebagai *prop:*

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        ...
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
        ...
      </head>
      ...
    </html>
  );
}
```

Di sisi *server*, *render* `<App assetMap={assetMap} />` dan berikan `assetMap` URL aset:

```js {1-5,8,9}
// Anda perlu mendapatkan JSON ini dari build tooling yang Anda gunakan, misalnya dari keluaran build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Karena *server* Anda sekarang me-*render* `<App assetMap={assetMap} />`, Anda juga perlu me-*render* `assetMap` di sisi klien untuk menghindari *error* hidrasi. Anda dapat melakukan serialisasi dan mengoper `assetMap` kepada klien seperti ini:

```js {9-10}
// Anda perlu mendapatkan JSON ini dari build tooling yang Anda gunakan.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

app.use('/', (request, response) => {
  const { pipe } = renderToPipeableStream(<App assetMap={assetMap} />, {
    // Hati-hati: di sini aman menggunakan stringify() karena data ini tidak dibuat oleh pengguna.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['main.js']],
    onShellReady() {
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  });
});
```

Pada contoh di atas, opsi `bootstrapScriptContent` menambahkan *tag* `<script>` *inline* ekstra yang mengatur variabel global `window.assetMap` klien. ini memungkinkan kode klien membaca `assetMap` yang sama:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Baik klien maupun *server* me-*render* `App` dengan *prop* `assetMap` yang sama, sehingga tidak ada *error* hidrasi.

</DeepDive>

---

### Streaming lebih banyak konten saat dimuat {/*streaming-more-content-as-it-loads*/}

*Streaming* memungkinkan pengguna untuk mulai melihat konten bahkan sebelum semua data dimuat di *server*. Misalnya, perhatikan halaman profil yang menampilkan sampul, sidebar dengan daftar teman dan foto, dan daftar postingan:

```js
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Posts />
    </ProfileLayout>
  );
}
```

Bayangkan bahwa memuat data `<Posts />` membutuhkan waktu. Idealnya, Anda ingin menampilkan konten lain dari halaman profil kepada pengguna tanpa perlu menunggu daftar postingan. Untuk melakukannya, [letakkan `Posts` dalam `<Suspense>` *boundary:*](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

```js {9,11}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Sidebar>
        <Friends />
        <Photos />
      </Sidebar>
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Ini memberitahu React untuk memulai *streaming* HTML sebelum `Posts` memuat datanya. React akan mengirimkan HTML *fallback* pemuatan (`PostsGlimmer`) terlebih dahulu, kemudian ketika `Posts` selesai memuat datanya, React akan mengirimkan HTML yang tersisa bersama dengan *tag* `<script>` *inline* yang menggantikan *fallback* pemuatan dengan HTML itu. Dari perspektif pengguna, halaman pertama kali akan tampil dengan `PostsGlimmer`, kemudian digantikan dengan `Posts`.

Anda dapat membuat [`<Suspense>` *boundary* bersarang](/reference/react/Suspense#revealing-nested-content-as-it-loads) sehingga urutan pemuatan lebih terperinci:

```js {5,13}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Pada contoh di atas, React dapat memulai *streaming* halaman lebih awal. Hanya `ProfileLayout` dan `ProfileCover` yang harus menyelesaikan *rendering* terlebih dahulu karena tidak berada dalam `<Suspense>` *boundary*. Apabila `Sidebar`, `Friends`, atau `Photos` perlu memuat data, React akan mengirimkan HTML *fallback* `BigSpinner` terlebih dahulu. Kemudian, ketika lebih banyak data tersedia, lebih banyak konten yang ditampilkan hingga semuanya terlihat.

*Streaming* tidak perlu menunggu React sendiri dimuat di peramban maupun menunggu aplikasi Anda menjadi interaktif. Konten HTML dari *server* akan ditampilkan secara bertahap sebelum *tag* `<script>` mana pun dimuat.

[Baca selengkapnya tentang cara kerja *streaming* HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Hanya sumber data yang mendukung Suspense yang akan mengaktifkan komponen Suspense.** Di antaranya:

- Pengambilan dengan *framework* yang mendukung *Suspense* seperti [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) dan [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Pemuatan kode komponen secara *lazy-loading* dengan [`lazy`](/reference/react/lazy)
- Membaca nilai sebuah *Promise* dengan [`use`](/reference/react/use)

*Suspense* **tidak** dapat medeteksi *data fetching* jika dilakukan dalam *Effect* atau *event handler.*

Cara persis pemuatan data dalam komponen `Posts` di atas tergantung *framework* yang Anda gunakan. Jika Anda menggunakan *framework* yang mendukung *Suspense*, Anda dapat menemukan detailnya dalam dokumentasi *framework* tersebut tentang *data fetching.*

*Data fetching* secara *Suspense-enabled* tanpa menggunakan *framework* yang *opinionated* masih belum didukung. Persyaratan untuk mengimplementasikan sumber data yang mendukung *Suspense* masih belum stabil dan belum terdokumentasi. API resmi untuk mengintegrasikan sumber data dengan *Suspense* akan dirilis dalam versi React yang akan datang. 

</Note>

---

### Menentukan apa yang masuk ke dalam shell {/*specifying-what-goes-into-the-shell*/}

Bagian aplikasi Anda di luar `<Suspense>` disebut *shell* (cangkang):

```js {3-5,13,14}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<BigSpinner />}>
        <Sidebar>
          <Friends />
          <Photos />
        </Sidebar>
        <Suspense fallback={<PostsGlimmer />}>
          <Posts />
        </Suspense>
      </Suspense>
    </ProfileLayout>
  );
}
```

Ini menentukan status pemuatan paling awal yang dapat dilihat pengguna:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Jika Anda memasukkan seluruh cakupan aplikasi di level *root* ke dalam `<Suspense>`, *shell* hanya akan berisi *spinner* tersebut. Ini bukan pengalaman pengguna yang menyenangkan karena melihat *spinner* besar di layar dapat terasa lebih lambat dan lebih menyebalkan daripada menunggu sedikit lebih lama dan melihat tata letak yang sebenarnya. Inilah alasan mengapa biasanya Anda ingin menempatkan batas `<Suspense>` sehingga *shell* terasa *minimal tetapi lengkap*--seperti kerangka dari keseluruhan tata letak halaman.

*Callback* `onShellReady` diaktifkan ketika seluruh *shell* telah di-*render*. Biasanya, Anda akan mulai melakukan *streaming*:

```js {3-6}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  }
});
```

Pada saat `onShellReady` diaktifkan, komponen di dalam `<Suspense>` bersarang mungkin masih memuat data.

---

### Mencatat laporan kerusakan di server {/*logging-crashes-on-the-server*/}

Secara *default*, semua *error* di *server* dicatat di konsol. Anda dapat mengganti perilaku ini untuk mencatat laporan kerusakan:

```js {7-10}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Jika Anda menyediakan implementasi `onError` khusus, jangan lupa juga untuk mencatat kesalahan di konsol seperti di atas.

---

### Memulihkan dari error di dalam shell {/*recovering-from-errors-inside-the-shell*/}

Pada contoh berikut, *shell* berisi `ProfileLayout`, `ProfileCover`, dan `PostsGlimmer`:

```js {3-5,7-8}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Jika terjadi *error* saat me-*render* komponen tersebut, React tidak akan memiliki HTML yang berarti untuk dikirim ke klien. Ganti `onShellError` untuk mengirim HTML *fallback* yang tidak bergantung pada *server rendering* sebagai upaya terakhir:

```js {7-11}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Jika ada *error* saat membuat *shell*, `onError` dan `onShellError` akan diaktifkan. Gunakan `onError` untuk pelaporan kesalahan dan gunakan `onShellError` untuk mengirim dokumen HTML cadangan. HTML *fallback* Anda tidak harus berupa halaman *error.* Sebagai gantinya, Anda dapat menyertakan *shell* alternatif yang me-*render* aplikasi Anda hanya pada klien.

---

### Memulihkan dari error di luar shell {/*recovering-from-errors-outside-the-shell*/}

Pada contoh berikut, komponen `<Posts />` berada di dalam `<Suspense>` sehingga *bukan* merupakan bagian dari *shell:*

```js {6}
function ProfilePage() {
  return (
    <ProfileLayout>
      <ProfileCover />
      <Suspense fallback={<PostsGlimmer />}>
        <Posts />
      </Suspense>
    </ProfileLayout>
  );
}
```

Jika *error* terjadi pada komponen `Posts` atau suatu tempat di dalamnya, React akan [mencoba memulihkannya:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

1. Mengirimkan *fallback* pemuatan dari `<Suspense>` *boundary* terdekat (`PostsGlimmer`) ke HTML halaman.
2. "Menyerah" untuk mencoba me-*render* konten `Posts` di *server* lagi.
3. Saat kode JavaScript dimuat di klien, React akan *mencoba lagi* me-*render* `Posts` dari sisi klien.

Jika percobaan me-*render* ulang `Posts` dari klien *juga* gagal, React akan melempar kesalahan di klien. Seperti halnya semua *error* yang terjadi selama *rendering*, [*error boundary* induk terdekat](/reference/react/Component#static-getderivedstatefromerror) menentukan bagaimana *error* ditampilkan kepada pengguna. Dalam praktiknya, ini berarti bahwa pengguna akan melihat indikator pemuatan hingga dipastikan bahwa *error* tidak dapat dipulihkan.

Jika percobaan me-*render* ulang `Posts` dari klien berhasil, *fallback* pemuatan dari *server* akan diganti dengan keluaran *rendering* klien. Pengguna tidak akan tahu bahwa ada kesalahan *server*. Namun, *callback* `onError` *server* dan *callback* [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) klien akan aktif sehingga Anda bisa mendapatkan pemberitahuan tentang *error* tersebut.

---

### Mengatur kode status {/*setting-the-status-code*/}

*Streaming* menimbulkan *tradeoff* (pengorbanan). Anda ingin memulai *streaming* halaman sedini mungkin agar pengguna dapat melihat konten lebih cepat. Namun, begitu Anda memulai *streaming*, Anda tidak dapat lagi menyetel kode status respons.

Dengan [membagi aplikasi Anda](#specifying-what-goes-into-the-shell) ke dalam *shell* (di atas semua batas `<Suspense>`) dan konten lainnya, Anda telah menyelesaikan sebagian dari masalah ini . Jika *shell* terjadi *error*, Anda akan mendapatkan *callback* `onShellError` yang memungkinkan Anda menyetel kode status *error*. Jika tidak, Anda tahu bahwa aplikasi dapat pulih pada klien, sehingga Anda dapat mengirimkan "OK".

```js {4}
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ada yang salah</h1>'); 
  },
  onError(error) {
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Jika sebuah komponen *di luar shell* (yaitu di dalam `<Suspense>` *boundary*) melontarkan *error,* React tidak akan berhenti me-*render*. Ini berarti *callback* `onError` akan diaktifkan, tetapi Anda masih akan mendapatkan `onShellReady` alih-alih `onShellError`. Ini karena React akan mencoba memulihkan dari *error* itu dari sisi klien, [seperti yang dijelaskan di atas.](#recovering-from-errors-outside-the-shell)

Namun, jika mau, Anda dapat menggunakan fakta bahwa ada kesalahan untuk menyetel kode status:

```js {1,6,16}
let didError = false;

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = didError ? 500 : 200;
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Ada yang salah</h1>'); 
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Ini hanya akan menangkap *error* di luar *shell* yang terjadi saat membuat konten *shell* awal, jadi tidak lengkap. Jika mengetahui apakah terjadi *error* untuk beberapa konten sangat penting, Anda dapat memindahkannya ke dalam *shell*.

---

### Menangani error yang berbeda dengan cara yang berbeda {/*handling-different-errors-in-different-ways*/}

Anda dapat [membuat *subclass* `Error` sendiri](https://javascript.info/custom-errors) dan menggunakan operator [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) untuk memeriksa kesalahan mana yang dilontarkan. Misalnya, Anda dapat menentukan `NotFoundError` khusus dan melontarkannya dari komponen Anda. Kemudian *callback* `onError`, `onShellReady`, dan `onShellError` dapat melakukan sesuatu yang berbeda bergantung pada jenis kesalahan:

```js {2,4-14,19,24,30}
let didError = false;
let caughtError = null;

function getStatusCode() {
  if (didError) {
    if (caughtError instanceof NotFoundError) {
      return 404;
    } else {
      return 500;
    }
  } else {
    return 200;
  }
}

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    response.statusCode = getStatusCode();
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
  onShellError(error) {
   response.statusCode = getStatusCode();
   response.setHeader('content-type', 'text/html');
   response.send('<h1>Ada yang salah</h1>'); 
  },
  onError(error) {
    didError = true;
    caughtError = error;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Perlu diingat bahwa setelah Anda meng-*emit* *shell* dan memulai *streaming*, Anda tidak dapat mengubah kode status.

---

### Menunggu semua konten dimuat untuk crawler dan static generation {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

*Streaming* menawarkan pengalaman pengguna yang lebih baik karena pengguna dapat melihat konten saat tersedia.

Namun, saat *crawler* mengunjungi halaman Anda, atau jika Anda membuat halaman pada saat proses pembangunan, Anda mungkin ingin membiarkan semua konten dimuat terlebih dahulu, lalu menghasilkan keluaran akhir HTML alih-alih menampilkannya secara bertahap.

Anda dapat menunggu semua konten dimuat menggunakan *callback* `onAllReady`:

```js {2,7,11,18-24}
let didError = false;
let isCrawler = // ... depends on your bot detection strategy ...

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['/main.js'],
  onShellReady() {
    if (!isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);
    }
  },
  onShellError(error) {
    response.statusCode = 500;
    response.setHeader('content-type', 'text/html');
    response.send('<h1>Something went wrong</h1>'); 
  },
  onAllReady() {
    if (isCrawler) {
      response.statusCode = didError ? 500 : 200;
      response.setHeader('content-type', 'text/html');
      pipe(response);      
    }
  },
  onError(error) {
    didError = true;
    console.error(error);
    logServerCrashReport(error);
  }
});
```

Pengunjung reguler akan mendapatkan *stream* konten yang dimuat secara progresif. *Crawler* akan menerima keluaran akhir HTML setelah semua data dimuat. Namun, ini juga berarti *crawler* harus menunggu *semua* data, beberapa di antaranya mungkin lambat dimuat atau *error*. Bergantung pada aplikasi Anda, Anda juga dapat memilih untuk mengirim *shell* ke *crawler*.

---

### Membatalkan server rendering {/*aborting-server-rendering*/}

Anda dapat memaksa *server rendering* untuk "menyerah" setelah *timeout:*

```js {1,5-7}
const { pipe, abort } = renderToPipeableStream(<App />, {
  // ...
});

setTimeout(() => {
  abort();
}, 10000);
```

React akan menghapus *fallback* pemuatan yang tersisa sebagai HTML, dan akan mencoba me-*render* sisanya dari sisi klien.
