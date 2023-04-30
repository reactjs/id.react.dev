---
title: renderToStaticMarkup
---

<Intro>

`renderToStaticMarkup` me-*render* sebuah pohon React yang non-interaktif ke *string* HTML.

```js
const html = renderToStaticMarkup(reactNode)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `renderToStaticMarkup(reactNode)` {/*rendertostaticmarkup*/}

Pada *server*, panggil fungsi `renderToStaticMarkup` untuk me-*render* aplikasi Anda ke HTML.

```js
import { renderToStaticMarkup } from 'react-dom/server';

const html = renderToStaticMarkup(<Page />);
```

Keluaran yang diberikan adalah HTML non-interaktif dari komponen-komponen React Anda.

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

* `reactNode`: Sebuah *node* React yang Anda ingin *render* ke HTML. Contohnya, sebuah *node* JSX seperti `<Page />`.

#### Nilai Balik {/*returns*/}

Sebuah *string* HTML.

#### Caveats {/*caveats*/}

* Keluaran dari `renderToStaticMarkup` tidak dapat dihidrasi (*hydrate*).

* `renderToStaticMarkup` mendukung penggunaan `Suspense` secara terbatas. Apabila sebuah komponen berada dalam kondisi *suspended*, `renderToStaticMarkup` segera mengirimkan *fallback*-nya sebagai HTML.

* `renderToStaticMarkup` bekerja dalam peramban, tetapi tidak direkomendasikan untuk digunakan dalam *source code* klien atau lingkungan peramban tersebut. Apabila Anda ingin me-*render* komponen ke HTML dalam peramban, [ambil HTML dengan cara me-*render* dalam *node* DOM.](/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code)

---

## Penggunaan {/*usage*/}

### Me-*render* pohon React yang non-interaktif sebagai HTML menjadi *string* {/*rendering-a-non-interactive-react-tree-as-html-to-a-string*/}

Panggil `renderToStaticMarkup` untuk me-*render* aplikasi Anda dalam sebuah *string* HTML yang dapat Anda kirimkan dengan respons dari *server* Anda:

```js {5-6}
import { renderToStaticMarkup } from 'react-dom/server';

// Sintaks router ini tergantung dari framework yang Anda gunakan.
app.use('/', (request, response) => {
  const html = renderToStaticMarkup(<Page />);
  response.send(html);
});
```

Ini akan memproduksi HTML non-interaktif awal dari komponen-komponen React Anda.

<Pitfall>

Metode ini me-*render* **HTML non-interaktif yang tidak bisa di hidrasi.** Ini berguna apabila Anda ingin menggunakan React sebagai *generator* halaman statis yang sederhana, atau bila Anda me-*render* konten yang benar-benar statis seperti surat elektronik.

Aplikasi yang interaktif seharusnya menggunakan [`renderToString`](/reference/react-dom/server/renderToString) pada *server* dan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) pada klien.

</Pitfall>
