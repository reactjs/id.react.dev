---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` me-*render* sebuah pohon (*tree*) React yang tidak interaktif ke dalam sebuah [*Node.js Readable Stream*.](https://nodejs.org/api/stream.html#readable-streams)

```js
const stream = renderToStaticNodeStream(reactNode)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `renderToStaticNodeStream(reactNode)` {/*rendertostaticnodestream*/}

Pada *server*, panggil `renderToStaticNodeStream` untuk mendapatkan sebuah [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams).

```js
import { renderToStaticNodeStream } from 'react-dom/server';

const stream = renderToStaticNodeStream(<Page />);
stream.pipe(response);
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

*Stream* akan menghasilkan keluaran HTML yang tidak interaktif dari komponen-komponen React anda.

#### Parameter {/*parameters*/}

* `reactNode`: Sebuah *node* React yang ingin anda *render* ke dalam HTML. Misalnya, sebuah elemen JSX seperti `<Page />`.

#### Returns {/*returns*/}

Sebuah [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams) yang menghasilkan sebuah *string* HTML. HTML yang dihasilkan tidak bisa dihidrasi (*hydrated*) di sisi klien.

#### Caveats {/*caveats*/}

* Keluaran `renderToStaticNodeStream` tidak dapat dihidrasi (*hydrated*).

* *Method* ini akan menunggu semua [*Suspense boundaries*](/reference/react/Suspense) untuk diselesaikan sebelum mengembalikan keluaran apapun.

* Sejak React 18, metode ini menyangga semua keluarannya, sehingga tidak memberikan keuntungan *stream* apapun .

* *Stream* yang dikembalikan merupakan sebuah *byte stream* yang *encoded* dalam *utf-8*. Jika anda membutuhkan sebuah *stream* lain yang di-*encode*, lihatlah ke sebuah proyek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang memberikan transformasi *stream* untuk *transcoding* teks.

---

## Penggunaan {/*usage*/}

### Me-render sebuah pohon React sebagai HTML statis ke dalam sebuah Node.js Readable Stream {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

Panggil `renderToStaticNodeStream` untuk mendapatkan sebuah [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) yang dapat dihubungkan ke respon *server*:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// Sintaks route bergantung pada framework backend yang digunakan
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

*Stream* akan menghasilkan keluaran awal HTML yang tidak interaktif dari komponen-komponen React anda.

<Pitfall>

*Method* ini me-*render* **HTML tidak interaktif yang tidak bisa dihidrasi (*hydrated*).** Ini berguna jika anda ingin menggunakan React sebagai sebuah *generator* halaman statis sederhana, atau jika anda me*render* konten statis seperti email.

Aplikasi interaktif sebaiknya menggunakan [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) pada *server* dan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pada klien.

</Pitfall>
