---
title: renderToNodeStream
---

<Deprecated>

API ini akan dihapus pada React versi mayor berikutnya. Gunakan [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) sebagai gantinya.

</Deprecated>

<Intro>

`renderToNodeStream` me-*render* pohon (*tree*) React ke dalam [Node.js Readable Stream.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `renderToNodeStream(reactNode)` {/*rendertonodestream*/}

Di server, panggil `renderToNodeStream` untuk mendapatkan [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams) yang dapat Anda salurkan ke respons.

```js
import { renderToNodeStream } from 'react-dom/server';

const stream = renderToNodeStream(<App />);
stream.pipe(response);
```

Di klien, panggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk membuat HTML yang dibuat server interaktif.

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: Node React yang ingin Anda render ke HTML. Contohnya, sebuah elemen JSX seperti `<App />`

#### Kembalian {/*returns*/}

Sebuah [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams) yang menghasilkan *string* HTML.

#### Catatan Penting {/*caveats*/}

* Metode ini akan menunggu semua [*Suspense boundaries*](/reference/react/Suspense) selesai sebelum menampilkan keluaran apa pun.

* Pada React 18, metode ini mem-*buffer* semua keluarannya, sehingga tidak benar-benar memberikan manfaat *streaming* apa pun. Inilah mengapa Anda disarankan untuk beralih ke [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) sebagai gantinya.

* *Stream* yang dikembalikan adalah *stream* byte yang di-enkode dalam utf-8. Jika Anda memerlukan *stream* dalam enkode lain, lihat proyek seperti [*iconv-lite*](https://www.npmjs.com/package/iconv-lite), yang mengenkode *stream* transformasi untuk *transcoding* teks.

---

## Penggunaan {/*usage*/}

### Me-render pohon React sebagai HTML ke Node.js Readable Stream {/*rendering-a-react-tree-as-html-to-a-nodejs-readable-stream*/}

Panggil `renderToNodeStream` untuk mendapatkan [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams) yang dapat Anda salurkan ke respons server Anda:

```js {5-6}
import { renderToNodeStream } from 'react-dom/server';

// Sintaks pengendali rute bergantung pada framework backend Anda
app.use('/', (request, response) => {
  const stream = renderToNodeStream(<App />);
  stream.pipe(response);
});
```

*Stream* akan menghasilkan keluaran HTML non-interaktif awal dari komponen React Anda. Pada klien, Anda perlu memanggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk *menghidrasi* HTML yang dihasilkan server dan membuatnya interaktif.
