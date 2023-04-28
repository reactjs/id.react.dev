---
title: renderToStaticNodeStream
---

<Intro>

`renderToStaticNodeStream` merender sebuah pohon React yang tidak interaktif ke dalam sebuah [*Node.js Readable Stream*.](https://nodejs.org/api/stream.html#readable-streams)

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

*Stream* akan menghasilkan keluaran HTML yang tidak interaktif dari komponen-komponen React kalian.

#### Parameter {/*parameters*/}

* `reactNode`: Sebuah *node* React yang ingin kalian render ke dalam HTML. Misalnya, sebuah elemen JSX seperti `<Page />`.

#### Returns {/*returns*/}

Sebuah [*Node.js Readable Stream*](https://nodejs.org/api/stream.html#readable-streams) yang menghasilkan sebuah *string* HTML. HTML yang dihasilkan tidak bisa dihidrasi di sisi klien.

#### Batasan {/*caveats*/}

* Keluaran `renderToStaticNodeStream` tidak dapat dihidrasi.

* Metode ini akan menunggu semua [*Suspense boundaries*](/reference/react/Suspense) untuk diselesaikan sebelum mengembalikan keluaran apapun.

* Sejak React 18, metode ini menyangga semua keluarannya, sehingga tidak memberikan keuntungan *stream* apapun .

* *Stream* yang dikembalikan merupakan sebuah *byte stream* yang dienkode dalam utf-8. Jika kalian membutuhkan sebuah *stream* yang dienkode lainnya, lihatlah ke sebuah proyek seperti [iconv-lite](https://www.npmjs.com/package/iconv-lite), yang memberikan transformasi aliran untuk *transcoding* teks.

---

## Penggunaan {/*usage*/}

### Merender sebuah pohon React sebagai HTML statis ke dalam sebuah *Node.js Readable Stream* {/*rendering-a-react-tree-as-static-html-to-a-nodejs-readable-stream*/}

Panggil `renderToStaticNodeStream` untuk mendapatkan sebuah [Node.js Readable Stream](https://nodejs.org/api/stream.html#readable-streams) yang dapat dihubungkan ke respon *server*:

```js {5-6}
import { renderToStaticNodeStream } from 'react-dom/server';

// Sintaks route bergantung pada framework backend yang digunakan
app.use('/', (request, response) => {
  const stream = renderToStaticNodeStream(<Page />);
  stream.pipe(response);
});
```

*Stream* akan menghasilkan keluaran awal HTML yang tidak interaktif dari komponen-komponen React kalian.

<Pitfall>

Metode ini merender **HTML tidak interaktif yang tidak bisa dihidrasi.** Ini berguna jika kalian ingin menggunakan React sebagai sebuah generator halaman statis sederhana, atau jika kalian merender konten statis seperti email.

Aplikasi interaktif sebaiknya menggunakan [`renderToPipeableStream`](/reference/react-dom/server/renderToPipeableStream) pada *server* dan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pada klien.

</Pitfall>
