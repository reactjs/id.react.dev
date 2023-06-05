---
title: renderToReadableStream
---

<Intro>

`renderToReadableStream` me-*render* sebuah pohon (*tree*) React menjadi [*Readable Web Stream.*](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
const stream = await renderToReadableStream(reactNode, options?)
```

</Intro>

<InlineToc />

<Note>

API ini bergantung ke [*Web Streams*.](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API) Untuk Node.js, gunakan [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) sebagai gantinya.

</Note>

---

## Referensi {/*reference*/}

### `renderToReadableStream(reactNode, options?)` {/*rendertoreadablestream*/}

Panggil `renderToReadableStream` untuk me-*render* pohon React Anda ke dalam [*Readable Web Stream*.](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Di klien, panggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk membuat HTML yang dibuat server interaktif.

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: Node React yang ingin Anda *render* ke HTML. Contohnya, sebuah elemen JSX seperti `<App />`. Diharapkan untuk mewakili keseluruhan dokumen, sehingga komponen `App` harus me-*render* tag `<html>`.

* **opsional** `options`: Objek dengan opsi *streaming*.
   * **opsional** `bootstrapScriptContent`: Jika ditentukan, *string* ini akan ditempatkan dalam tag sebaris `<script>`.
   * **opsional** `bootstrapScripts`: Senarai URL string untuk tag `<script>` yang akan dikeluarkan di halaman. Gunakan ini untuk menyertakan `<script>` yang memanggil [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot) Abaikan jika Anda sama sekali tidak ingin menjalankan React pada klien.
   * **opsional** `bootstrapModules`: Seperti `bootstrapScripts`, tetapi mengeluarkan [`<script type="module">`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/ Panduan/Modul) sebagai gantinya.
   * **opsional** `identifierPrefix`: Prefiks *string* yang digunakan React untuk ID yang dihasilkan oleh [`useId`.](/reference/react/useId) Berguna untuk menghindari konflik saat menggunakan beberapa *root* pada halaman yang sama. Harus memiliki awalan yang sama dengan yang diteruskan ke [`hydrateRoot`.](/reference/react-dom/client/hydrateRoot#parameters)
   * **opsional** `namespaceURI`: *String* dengan *root* [*namespace URI*](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElementNS#important*namespace*uris) untuk *streaming*. *Default* ke HTML biasa. Tambahkan `'http://www.w3.org/2000/svg'` untuk SVG atau `'http://www.w3.org/1998/Math/MathML'` untuk MathML.
   * **opsional** `nonce`: *String* [`nonce`](http://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#nonce) digunakan untuk mengizinkan skrip untuk [` script-src` Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src).
   * **opsional** `onError`: *Callback* yang aktif setiap kali ada kesalahan server, baik [dapat dipulihkan](#recovering-from-errors-outside-the-shell) atau [tidak.](#recovering-from-errors-inside-the-shell) Secara bawaan, ini hanya memanggil `console.error`. Jika Anda menimpanya ke [laporan kerusakan log,](#logging-crashes-on-the-server) pastikan Anda masih memanggil `console.error`. Anda juga dapat menggunakannya untuk [menyesuaikan kode status](#setting-the-status-code) sebelum *shell* dikeluarkan.
   * **opsional** `progressiveChunkSize`: Jumlah byte dalam potongan. [Baca selengkapnya tentang heuristik default.](https://github.com/facebook/react/blob/14c2be8dac2d5482fda8a0906a31d239df8551fc/packages/react-server/src/ReactFizzServer.js#L210-L225)
   * **opsional** `signal`: Sebuah [*abort signal*](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) yang memungkinkan Anda [membatalkan *render* di server](#aborting-server-rendering) dan me-*render* sisanya pada klien.


#### Kembalian {/*returns*/}

`renderToReadableStream` mengembalikan sebuah *Promise*:

- Jika *render [shell*](#specifying-what-goes-into-the-shell) berhasil, *Promise* tersebut akan diselesaikan menjadi [*Readable Web Stream*.](https://developer.mozilla.org/en-US /docs/Web/API/ReadableStream)
- Jika *render shell* gagal, *Promise* akan ditolak. [Gunakan ini untuk mengeluarkan *Shell* cadangan.](#recovering-from-errors-inside-the-shell)

*Stream* yang dikembalikan memiliki properti tambahan:

* `allReady`: *Promise* yang diselesaikan saat semua preose *render* selesai, termasuk [*shell*](#specifying-what-goes-into-the-shell) dan semua [konten](#streaming-more-content-as-it-loads) tambahan. Anda dapat menggunakan`await stream.allReady` sebelum mengembalikan respons [untuk *crawler* dan *static generation*.](#waiting-for-all-content-to-load-for-crawlers-and-static-generation) Jika Anda melakukannya, Anda tidak akan mendapatkan pemuatan progresif. *Stream* akan berisi HTML final.

---

## Penggunaan {/*usage*/}

### Me-render pohon React sebagai HTML ke Readable Web Stream {/*rendering-a-react-tree-as-html-to-a-readable-web-stream*/}

Panggil `renderToReadableStream` untuk me-*render* React *tree* anda sebagai HTML ke [*Readable Web Stream*:](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)

```js [[1, 4, "<App />"], [2, 5, "['/main.js']"]]
import { renderToReadableStream } from 'react-dom/server';

async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```
  
Bersamaan dengan <CodeStep step={1}>root component</CodeStep>, Anda perlu memberikan daftar <CodeStep step={2}>bootstrap `<script>` paths</CodeStep>. Komponen root Anda harus mengembalikan **seluruh dokumen termasuk tag root `<html>`.

Misalnya, mungkin terlihat seperti ini:

```js [[1, 1, "App"]]
export default function App() {
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

React akan memasukkan [doctype](https://developer.mozilla.org/en-US/docs/Glossary/Doctype) dan <CodeStep step={2}>bootstrap `<script>` tags</CodeStep> Anda ke *stream* HTML yang dihasilkan:

```html [[2, 5, "/main.js"]]
<!DOCTYPE html>
<html>
  <!-- ... HTML untuk komponen Anda ... -->
</html>
<script src="/main.js" async=""></script>
```

Di klien, skrip *bootstrap* Anda harus [menghidrasi seluruh `dokumen` dengan panggilan ke `hydrateRoot`:](/reference/react-dom/client/hydrateRoot#hydrating-an-entire-document)

```js [[1, 4, "<App />"]]
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App />);
```

Ini akan melampirkan *event listeners* ke HTML yang dihasilkan server dan membuatnya interaktif.

<DeepDive>

#### Membaca jalur aset CSS dan JS dari output *build* {/*reading-css-and-js-asset-paths-from-the-build-output*/}

URL aset final (seperti file JavaScript dan CSS) sering kali di-*hash* setelah dibuat. Misalnya, alih-alih `styles.css` Anda mungkin berakhir dengan `styles.123456.css`. *Hashing* nama file aset statis menjamin bahwa setiap build berbeda dari aset yang sama akan memiliki nama file yang berbeda pula. Ini berguna karena memungkinkan Anda mengaktifkan *caching* jangka panjang dengan aman untuk aset statis: konten file dengan nama tertentu tidak akan pernah berubah.

Namun, jika Anda tidak mengetahui URL aset hingga setelah pembuatan, tidak ada cara bagi Anda untuk memasukkannya ke dalam kode sumber. Misalnya, *hardcoding* `"/styles.css"` ke dalam JSX seperti sebelumnya tidak akan berfungsi. Untuk menjauhkannya dari kode sumber Anda, komponen *root* Anda dapat membaca nama file asli dari *map* yang diteruskan sebagai *prop*:

```js {1,6}
export default function App({ assetMap }) {
  return (
    <html>
      <head>
        <title>Aplikasiku</title>
        <link rel="stylesheet" href={assetMap['styles.css']}></link>
      </head>
      ...
    </html>
  );
}
```

Di server, *render* `<App assetMap={assetMap} />` dan teruskan `assetMap` Anda dengan URL aset:

```js {1-5,8,9}
// Anda perlu mendapatkan JSON ini dari tooling build Anda, mis. membacanya dari keluaran build.
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    bootstrapScripts: [assetMap['/main.js']]
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Karena server Anda sekarang me-*render* `<App assetMap={assetMap} />`, Anda juga perlu me-*render*-nya dengan `assetMap` pada klien untuk menghindari error hidrasi. Anda dapat men-*serialize* dan meneruskan `assetMap` ke klien seperti ini:


```js {9-10}
// Anda perlu mendapatkan JSON ini dari tooling build Anda
const assetMap = {
  'styles.css': '/styles.123456.css',
  'main.js': '/main.123456.js'
};

async function handler(request) {
  const stream = await renderToReadableStream(<App assetMap={assetMap} />, {
    // Hati-hati: Aman untuk stringify() ini karena data ini tidak dibuat oleh pengguna.
    bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
    bootstrapScripts: [assetMap['/main.js']],
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Pada contoh di atas, opsi `bootstrapScriptContent` menambahkan tag `<script>` sebaris tambahan yang menyetel variabel global `window.assetMap` pada klien. Ini memungkinkan kode klien membaca `assetMap` yang sama:

```js {4}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document, <App assetMap={window.assetMap} />);
```

Klien dan server merender `App` dengan prop `assetMap` yang sama, sehingga tidak ada error hidrasi.

</DeepDive>

---

### Streaming lebih banyak konten saat dimuat {/*streaming-more-content-as-it-loads*/}

*Streaming* memungkinkan pengguna untuk mulai melihat konten bahkan sebelum semua data dimuat di server. Misalnya, pertimbangkan halaman profil yang menampilkan sebuah sampul, *sidebar* dengan teman dan foto, dan daftar postingan:

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

Bayangkan bahwa memuat data untuk `<Posts />` membutuhkan waktu. Idealnya, Anda ingin menampilkan konten halaman profil lainnya kepada pengguna tanpa menunggu kiriman. Untuk melakukannya, [bungkus `Posts` dalam batas `<Suspense>`:](/reference/react/Suspense#displaying-a-fallback-while-content-is-loading)

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

Ini memberitahu React untuk memulai *streaming* HTML sebelum `Posts` memuat datanya. React akan mengirimkan HTML untuk *fallback* pemuatan (`PostsGlimmer`) terlebih dahulu, dan kemudian, ketika `Posts` selesai memuat datanya, React akan mengirimkan HTML yang tersisa bersama dengan tag `<script>` sebaris yang menggantikan *fallback* pemuatan dengan HTML itu. Dari perspektif pengguna, halaman pertama akan muncul dengan `PostsGlimmer`, kemudian diganti dengan `Posts`.

Anda dapat lebih jauh [menyatukan batas `<Suspense>`](/reference/react/Suspense#revealing-nested-content-as-it-loads) untuk membuat urutan pemuatan yang lebih terperinci:

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

Dalam contoh ini, React dapat memulai *streaming* halaman lebih awal. Hanya `ProfileLayout` dan `ProfileCover` yang harus menyelesaikan *render* terlebih dahulu karena tidak terbungkus dalam batas `<Suspense>`. Namun, jika `Sidebar`, `Friends`, atau `Photos` perlu memuat beberapa data, React akan mengirimkan HTML untuk *fallback* `BigSpinner` sebagai gantinya. Kemudian, ketika lebih banyak data tersedia, lebih banyak konten akan terus ditampilkan hingga semuanya terlihat.

*Streaming* tidak perlu menunggu React sendiri dimuat di peramban, atau aplikasi Anda menjadi interaktif. Konten HTML dari server akan ditampilkan secara progresif sebelum tag `<script>` mana pun dimuat.

[Baca selengkapnya tentang cara kerja *streaming* HTML.](https://github.com/reactwg/react-18/discussions/37)

<Note>

**Hanya sumber data yang mengaktifkan *Suspense* yang akan mengaktifkan komponen Suspense.** Sumber tersebut meliputi:

- Pengambilan data dengan *framework* yang mendukung *Suspense* seperti [Relay](https://relay.dev/docs/guided-tour/rendering/loading-states/) dan [Next.js](https://nextjs.org/docs/getting-started/react-essentials)
- Kode komponen pemuatan lambat dengan [`lazy`](/reference/react/lazy)

*Suspense* **tidak** mendeteksi saat data diambil di dalam *Effect* atau *event handler*.

Cara persis Anda memuat data dalam komponen `Posts` di atas bergantung pada *framework* Anda. Jika Anda menggunakan *framework* dengan dukungan *Suspense*, Anda akan menemukan detailnya dalam dokumentasi pengambilan datanya.

Pengambilan data dengan dukungan *suspense* tanpa menggunakan *opinionated framework* belum didukung. Persyaratan untuk mengimplementasikan sumber data yang mendukung *Suspense* tidak stabil dan tidak terdokumentasi. API resmi untuk mengintegrasikan sumber data dengan *Suspense* akan dirilis dalam versi React yang akan datang.

</Note>

---

### Menentukan apa yang masuk ke dalam *shell* {/*specifying-what-goes-into-the-shell*/}

Bagian aplikasi Anda di luar batas `<Suspense>` disebut *shell:*

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

Ini menentukan status pemuatan paling awal yang mungkin dilihat pengguna:

```js {3-5,13
<ProfileLayout>
  <ProfileCover />
  <BigSpinner />
</ProfileLayout>
```

Jika Anda menggabungkan seluruh aplikasi ke dalam batas `<Suspense>` di akar, *shell* hanya akan berisi pemintal tersebut. Namun, itu bukan pengalaman pengguna yang menyenangkan karena melihat pemintal besar di layar bisa terasa lebih lambat dan lebih menyebalkan daripada menunggu lebih lama dan melihat tata letak yang sebenarnya. Inilah mengapa biasanya Anda ingin menempatkan batas `<Suspense>` sehingga *shell* terasa *minimal tetapi lengkap*--seperti kerangka dari keseluruhan tata letak halaman.

Panggilan asinkronus ke `renderToReadableStream` akan berubah menjadi `stream` segera setelah seluruh *shell* di-*render*. Biasanya, Anda akan memulai *streaming* kemudian dengan membuat dan mengembalikan respons dengan `stream` itu:

```js {5}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js']
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Pada saat `stream` dikembalikan, komponen di batas `<Suspense>` bersarang mungkin masih memuat data.

---

### Logging eror di server {/*logging-crash-on-the-server*/}

Secara *default*, semua kesalahan di server dicatat ke konsol. Anda dapat mengganti perilaku ini untuk mencatat laporan kerusakan:

```js {4-7}
async function handler(request) {
  const stream = await renderToReadableStream(<App />, {
    bootstrapScripts: ['/main.js'],
    onError(error) {
      console.error(error);
      logServerCrashReport(error);
    }
  });
  return new Response(stream, {
    headers: { 'content-type': 'text/html' },
  });
}
```

Jika Anda memberikan implementasi `onError` khusus, jangan lupa juga mencatat kesalahan ke konsol seperti di atas.

---

### Memulihkan dari kesalahan di dalam shell {/*recovering-from-errors-inside-the-shell*/}

Dalam contoh ini, *shell* berisi `ProfileLayout`, `ProfileCover`, dan `PostsGlimmer`:

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

Jika terjadi kesalahan saat me-*render* komponen tersebut, React tidak akan memiliki HTML yang berarti untuk dikirim ke klien. Bungkus panggilan `renderToReadableStream` Anda dalam `try...catch` untuk mengirimkan HTML *fallback* yang tidak bergantung pada *render* server sebagai upaya terakhir:

```js {2,13-18}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Jika ada kesalahan saat membuat *shell*, `onError` dan blok `catch` Anda akan aktif. Gunakan `onError` untuk pelaporan kesalahan dan gunakan blok `catch` untuk mengirim dokumen HTML *fallback*. HTML *fallback* Anda tidak harus berupa halaman kesalahan. Sebagai gantinya, Anda dapat menyertakan *shell* alternatif yang merender aplikasi Anda hanya pada klien.

---

### Memulihkan dari kesalahan di luar shell {/*recovering-from-errors-outside-the-shell*/}

Dalam contoh ini, komponen `<Posts />` dibungkus dengan `<Suspense>` sehingga *bukan* merupakan bagian dari shell:

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

Jika kesalahan terjadi pada komponen `Posts` atau di suatu tempat di dalamnya, React akan [mencoba memulihkannya:](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

1. Ini akan menampilkan *fallback* pemuatan untuk batas `<Suspense>` terdekat (`PostsGlimmer`) ke dalam HTML.
2. Ini akan "menyerah" untuk mencoba me-*render* konten `Posts` di server lagi.
3. Saat kode JavaScript dimuat di klien, React akan *coba lagi* me-*render* `Posts` di klien.

Jika mencoba merender `Posts` pada klien *juga* gagal, React akan melempar kesalahan pada klien. Seperti semua eror yang terjadi selama proses *render*, [batas error induk terdekat](/reference/react/Component#static-getderivedstatefromerror) menentukan cara menyajikan error kepada pengguna. Dalam praktiknya, ini berarti bahwa pengguna akan melihat indikator pemuatan hingga dipastikan bahwa kesalahan tidak dapat dipulihkan.

Jika percobaan ulang rendering `Posts` pada klien berhasil, *fallback* pemuatan dari server akan diganti dengan hasil proses *render* klien. Pengguna tidak akan tahu bahwa ada kesalahan server. Namun, *callback* `onError` server dan *callback* [`onRecoverableError`](/reference/react-dom/client/hydrateRoot#hydrateroot) klien akan aktif sehingga Anda bisa mendapatkan pemberitahuan tentang error tersebut.

---

### Menyetel kode status {/*setting-the-status-code*/}

*Streaming* memperkenalkan keuntungan dan kerugian. Anda ingin memulai *streaming* halaman sedini mungkin agar pengguna dapat melihat konten lebih cepat. Namun, begitu Anda memulai *streaming*, Anda tidak dapat lagi menyetel kode status respons.

Dengan [membagi aplikasi Anda](#specifying-what-goes-into-the-shell) ke dalam *shell* (di atas semua batas `<Suspense>`) dan konten lainnya, Anda telah menyelesaikan sebagian dari masalah ini. Jika shell error, blok `catch` Anda akan berjalan yang memungkinkan Anda mengatur kode status eror. Jika tidak, Anda tahu bahwa aplikasi dapat pulih pada klien, sehingga Anda dapat mengirimkan "OK".

```js {11}
async function handler(request) {
  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Jika sebuah komponen *di luar shell* (yaitu di dalam batas `<Suspense>`) melontarkan kesalahan, React tidak akan berhenti me-*render*. Ini berarti *callback* `onError` akan diaktifkan, tetapi kode Anda akan terus berjalan tanpa masuk ke blok `catch`. Ini karena React akan mencoba memulihkan dari kesalahan itu pada klien, [seperti yang dijelaskan di atas.](#recovering-from-errors-outside-the-shell)

Namun, jika mau, Anda dapat menggunakan fakta bahwa ada kesalahan untuk menyetel kode status:

```js {3,7,13}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Ini hanya akan menangkap kesalahan di luar *shell* yang terjadi saat membuat konten *shell* awal, jadi tidak lengkap. Jika mengetahui apakah terjadi kesalahan untuk beberapa konten sangat penting, Anda dapat memindahkannya ke dalam *shell*.

---

### Menangani berbagai eror dengan cara berbeda {/*handling-different-errors-in-different-ways*/}

Anda dapat [membuat sub-kelas `Error` Anda sendiri](https://javascript.info/custom-errors) dan menggunakan [`instanceof`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof) operator untuk memeriksa kesalahan mana yang dilemparkan. Misalnya, Anda dapat menentukan `NotFoundError` khusus dan membuangnya dari komponen Anda. Kemudian Anda dapat menyimpan kesalahan di `onError` dan melakukan sesuatu yang berbeda sebelum mengembalikan respons tergantung pada jenis kesalahannya:

```js {2-3,5-15,22,28,33}
async function handler(request) {
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

  try {
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        caughtError = error;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    return new Response(stream, {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: getStatusCode(),
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Perlu diingat bahwa setelah Anda memancarkan *shell* dan memulai *streaming*, Anda tidak dapat mengubah kode status.

---

### Menunggu semua konten dimuat untuk *crawler* dan *static generation* {/*waiting-for-all-content-to-load-for-crawlers-and-static-generation*/}

*Streaming* menawarkan pengalaman pengguna yang lebih baik karena pengguna dapat melihat konten saat tersedia.

Namun, saat *crawlers* mengunjungi halaman Anda, atau jika Anda membuat halaman pada waktu pembuatan, Anda mungkin ingin membiarkan semua konten dimuat terlebih dahulu, lalu menghasilkan keluaran HTML akhir alih-alih menampilkannya secara bertahap.

Anda dapat menunggu semua konten dimuat dengan menunggu *Promise* `stream.allReady`:

```js {12-15}
async function handler(request) {
  try {
    let didError = false;
    const stream = await renderToReadableStream(<App />, {
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    let isCrawler = // ... tergantung pada strategi deteksi bot Anda ...
    if (isCrawler) {
      await stream.allReady;
    }
    return new Response(stream, {
      status: didError ? 500 : 200,
      headers: { 'content-type': 'text/html' },
    });
  } catch (error) {
    return new Response('<h1>Something went wrong</h1>', {
      status: 500,
      headers: { 'content-type': 'text/html' },
    });
  }
}
```

Pengunjung reguler akan mendapatkan aliran konten yang dimuat secara progresif. *Crawlers* akan menerima hasil akhir HTML setelah semua data dimuat. Namun, ini juga berarti *crawler* harus menunggu *semua* data, beberapa di antaranya mungkin lambat dimuat atau error. Bergantung pada aplikasi Anda, Anda juga dapat memilih untuk mengirim *shell* ke *crawler*.

---

### Membatalkan proses *render* di server {/*aborting-server-rendering*/}

Anda dapat memaksa proses *render* di server untuk "menyerah" setelah waktu habis:

```js {3,4-6,9}
async function handler(request) {
  try {
    const controller = new AbortController();
    setTimeout(() => {
      controller.abort();
    }, 10000);

    const stream = await renderToReadableStream(<App />, {
      signal: controller.signal,
      bootstrapScripts: ['/main.js'],
      onError(error) {
        didError = true;
        console.error(error);
        logServerCrashReport(error);
      }
    });
    // ...
```

React akan menghapus *fallback* pemuatan yang tersisa sebagai HTML, dan akan mencoba merender sisanya pada klien.
