---
title: renderToString
---

<Pitfall>

`renderToString` tidak mendukung *streaming* atau menunggu data. [Lihat beberapa alternatifnya.](#alternatives)

</Pitfall>

<Intro>

`renderToString` me-*render* pohon (*tree*) React menjadi *string* HTML.

```js
const html = renderToString(reactNode)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `renderToString(reactNode)` {/*rendertostring*/}

Di server, panggil `renderToString` untuk me-*render* aplikasi Anda ke HTML.

```js
import { renderToString } from 'react-dom/server';

const html = renderToString(<App />);
```

Di klien, panggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk membuat HTML yang dibuat server interaktif.

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: Node React yang ingin Anda render ke HTML. Contohnya, sebuah elemen JSX seperti `<App />`

#### Kembalian {/*returns*/}

Sebuah *string* HTML.

#### Peringatan {/*caveats*/}

* `renderToString` memiliki dukungan *Suspense* yang terbatas. Jika komponen ditangguhkan, `renderToString` secara langsung mengirimkan kembaliannya sebagai HTML.

* `renderToString` bekerja di peramban, tapi menggunakannya di kode klien [tidak direkomendasikan.](#removing-rendertostring-from-the-client-code)

---

## Penggunaan {/*usage*/}

### Me-render pohon React sebagai HTML menjadi string {/*rendering-a-react-tree-as-html-to-a-string*/}

Panggil `renderToString` untuk me-*render* aplikasi Anda ke *string* HTML yang dapat Anda kirim dengan respons server Anda:

```js {5-6}
import { renderToString } from 'react-dom/server';

// Sintaksis pengendali rute bergantung pada framework backend Anda
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

Ini akan menghasilkan output HTML non-interaktif awal dari komponen React Anda. Pada klien, Anda perlu memanggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) untuk *menghidrasi* HTML yang dihasilkan server dan membuatnya interaktif.


<Pitfall>

`renderToString` tidak mendukung *streaming* atau menunggu data. [Lihat beberapa alternatifnya.](#alternatives)

</Pitfall>

---

## Alternatif {/*alternatives*/}

### Migrasi dari `renderToString` ke metode streaming di server {/*migrating-from-rendertostring-to-a-streaming-method-on-the-server*/}

`renderToString` mengembalikan *string* dengan seketika, sehingga tidak mendukung *streaming* atau menunggu data.

Saat memungkinkan, kami merekomendasikan untuk menggunakan alternatif yang berfitur lengkap ini:

* Jika Anda menggunakan Node.js, gunakan [`renderToPipeableStream`.](/reference/react-dom/server/renderToPipeableStream)
* Jika Anda menggunakan Deno atau *edge runtime* modern dengan [Web Streams](https://developer.mozilla.org/en-US/docs/Web/API/Streams*API), gunakan [`renderToReadableStream`.](/reference/react-dom/server/renderToReadableStream)

Anda dapat terus menggunakan `renderToString` jika *environment* server Anda tidak mendukung *streaming*.

---

### Menghapus `renderToString` dari kode klien {/*removing-rendertostring-from-the-client-code*/}

Terkadang, `renderToString` digunakan pada klien untuk mengkonversi beberapa komponen ke HTML.

```js {1-2}
// 🚩 Tidak perlu: menggunakan renderToString pada klien
import { renderToString } from 'react-dom/server';

const html = renderToString(<MyIcon />);
console.log(html); // Contohnya, "<svg>...</svg>"
```

Mengimpor `react-dom/server` **pada klien** meningkatkan ukuran bundel Anda secara tidak perlu dan harus dihindari. Jika Anda perlu me-*render* beberapa komponen ke HTML di peramban, gunakan [`createRoot`](/reference/react-dom/client/createRoot) dan baca HTML dari DOM:

```js
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

const div = document.createElement('div');
const root = createRoot(div);
flushSync(() => {
  root.render(<MyIcon />);
});
console.log(div.innerHTML); // Contohnya, "<svg>...</svg>"
```

Memanggil [`flushSync`](/reference/react-dom/flushSync) diperlukan agar DOM diperbarui sebelum membaca [`innerHTML`](https://developer.mozilla.org/en-US/docs/Web/API/Elemen/innerHTML).

---

## Penyelesaian Masalah {/*troubleshooting*/}

### Saat komponen ditangguhkan, HTML selalu berisi fallback {/*when-a-component-suspends-the-html-always-contains-a-fallback*/}

`renderToString` tidak sepenuhnya mendukung *Suspense*.

Jika beberapa komponen ditangguhkan (misalnya, karena ditentukan dengan [`lazy`](/reference/react/lazy) atau mengambil data), `renderToString` tidak akan menunggu kontennya diselesaikan. Sebagai gantinya, `renderToString` akan menemukan batas [`<Suspense>`](/reference/react/Suspense) terdekat di atasnya dan merender prop `fallback` di HTML. Konten tidak akan muncul hingga kode klien dimuat.

Untuk mengatasinya, gunakan salah satu [solusi *streaming* yang disarankan.](#migrating-from-rendertostring-to-a-streaming-method-on-the-server) Mereka dapat melakukan *streaming* konten dalam potongan-potongan saat diselesaikan di server sehingga pengguna melihat halaman diisi secara progresif sebelum kode klien dimuat.
