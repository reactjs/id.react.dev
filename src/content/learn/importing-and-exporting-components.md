---
title: Mengimpor dan Mengekspor Komponen
---

<Intro>

Keajaiban komponen terletak pada kemampuannya yang dapat digunakan kembali: Anda dapat membuat komponen yang disusun dengan komponen lain. Namun, ketika Anda menyusun komponen-komponen yang semakin banyak, seringkali lebih masuk akal untuk mulai membaginya ke dalam *file-file* yang berbeda. Dengan ini Anda menjaga *file* Anda agar tetap mudah dipindai dan digunakan kembali di banyak tempat.

</Intro>

<YouWillLearn>

* Apa itu *file* komponen root
* Bagaimana cara impor dan ekspor komponen
* Kapan menggunakan default dan named impor dan ekspor
* Bagaimana cara mengimpor dan mengekspor beberapa komponen pada satu *file*
* Bagaimana cara memisahkan komponen menjadi beberapa *file*

</YouWillLearn>

## File komponen root {/*the-root-component-file*/}

Pada [Komponen Pertama Anda](/learn/your-first-component), Anda membuat komponen `Profile` dan komponen `Gallery` yang me-*render*:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Komponen tersebut saat ini berada pada **file komponen root,** yang bernama `App.js` pada contoh ini. Pada [Create React App](https://create-react-app.dev/), aplikasi Anda berada di `src/App.js`. Tergantung pada persiapan Anda, komponen root Anda bisa saja berada di *file* lain. Jika Anda menggunakan framework dengan *file-based routing*, seperti Next.js, komponen root Anda akan berbeda di setiap halaman.

## Mengekspor dan mengimpor sebuah komponen {/*exporting-and-importing-a-component*/}

Bagaimana jika Anda ingin mengubah *landing screen* di masa depan dan memasukkan daftar buku sains disana? Atau meletakkan semua profil di tempat lain? Masuk akal untuk memindahkan `Gallery` dan `Profile` dari *file* komponen root. Ini akan membuat lebih modular dan dapat digunakan kembali di *file* lain. Anda dapat memindahkan sebuah komponen dengan tiga langkah:

1. **Buat** sebuah *file* JS baru untuk memasukkan komponen.
2. **Ekspor** function component Anda dari *file* tersebut (menggunakan baik [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_the_default_export) atau [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/export#using_named_exports) eskpor).
3. **Impor** dimana Anda akan menggunakan komponen tersebut (menggunakan teknik yang sesuai untuk mengimpor [default](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#importing_defaults) atau [named](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import#import_a_single_export_from_a_module) ekspor).

Di sini `Profile` dan `Gallery` sudah dipindahkan dari `App.js` ke dalam *file* baru bernama `Gallery.js`. Sekarang Anda dapat mengubah `App.js` untuk mengimpor `Gallery` dari `Gallery.js`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';

export default function App() {
  return (
    <Gallery />
  );
}
```

```js Gallery.js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Perhatikan bagaimana pada contoh ini dipecah menjadi dua *file* komponen sekarang:

1. `Gallery.js`:
     - Mendefinisikan `Profile` komponen yang hanya digunakan dalam *file* yang sama dan tidak diekspor.
     - Mengekspor `Gallery` komponen sebagai **default export.**
2. `App.js`:
     - Mengimpor `Gallery` sebagai **default import** dari `Gallery.js`.
     - Mengekspor root `App` komponen sebagai **default export.**


<Note>

Anda mungkin menemukan *file* yang meninggalkan ekstensi *file* `.js` seperti ini:

```js 
import Gallery from './Gallery';
```

Salah satu `'./Gallery.js'` atau `'./Gallery'` akan jalan dengan React, meskipun yang pertama lebih mirip dengan bagaimana [native ES Modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules) bekerja.

</Note>

<DeepDive>

#### Default vs named ekspor {/*default-vs-named-exports*/}

Ada dua cara utama untuk mengekspor nilai dengan JavaScript: **default exports** dan **named exports**. Sejauh ini, contoh kita hanya menggunakan **default exports**. Tapi Anda dapat menggunakan satu atau keduanya pada *file* yang sama. **Sebuah file dapat menggunakan tidak lebih dari satu _default_ export, tapi dapat menggunakan _named_ exports sebanyak yang Anda suka.**

![Default dan named ekspor](/images/docs/illustrations/i_import-export.svg)

Bagaimana Anda mengekspor komponen Anda mendikte bagaimana Anda harus mengimpornya. Anda akan mendapatkan error jika Anda mencoba untuk mengimpor **default exports** dengan cara yang sama Anda menggunakan **named exports**! Tabel ini akan membantu Anda untuk melacak:

| Sintaksis           | Pernyataan Expor                           | Pernyataan Impor                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

Ketika Anda menulis **default imports**, Anda dapat memberi nama apa saja setelah `import`. Contoh, Anda dapat menulis `import Banana from './Button.js'` dan itu akan tetap memberi Anda `export default` yang sama. Sebaliknya, dengan **named imports**, nama harus sama di kedua sisi. Itulah mengapa disebut **named imports**!

**Orang-orang seringkali menggunakan `default exports` jika *file* yang diekspor hanya satu komponen, dan menggunakan `named exports` jika mengekspor beberapa komponen dan nilai.** Bagaimanapun gaya koding yang Anda gunakan, selalu beri nama yang berarti pada fungsi komponen Anda dan isi *file* tersebut. Komponen tanpa nama, seperti `export default () => {}`, tidak disarankan karena membuat proses debug lebih sulit.

</DeepDive>

## Mengekspor dan mengimpor beberapa komponen dari file yang sama {/*exporting-and-importing-multiple-components-from-the-same-file*/}

Bagaimana jika Anda ingin menampilkan hanya satu `Profile` selain sebuah galeri? Anda dapat mengekspor komponen `Profile` juga. Tapi `Gallery.js` telah menggunakan **default exports**, dan Anda tidak dapat memiliki _dua_ **default exports**. Anda dapat membuat *file* baru dengan **default exports**, atau Anda dapat menambahkan sebuah **named exports** untuk `Profile`. **Sebuah *file* hanya dapat memiliki satu `default exports`, tapi dapat memiliki banyak `named exports`!**

<Note>

Untuk mengurangi potensi kebingunan antara **default** dan **named exports**, beberapa tim memilih untuk berpegang pada satu gaya penulisan (**default** atau **named**), atau menghindari mencampurnya dalam satu *file*. Lakukan yang terbaik untuk Anda!

</Note>

Pertama, **ekspor** `Profile` dari `Gallery.js` menggunakan **named exports** (tanpa kata kunci **default**):

```js
export function Profile() {
  // ...
}
```

Selanjutnya, **impor** `Profile` dari `Gallery.js` ke `App.js` menggunakan **named imports** (dengan kurung kurawal):

```js
import { Profile } from './Gallery.js';
```

Akhirnya, **render** `<Profile />` dari komponen `App`:

```js
export default function App() {
  return <Profile />;
}
```

Sekarang `Gallery.js` berisi dua ekspor: **default exports** `Gallery`, dan **named exports** `Profile`. `App.js` mengimpor keduanya.
Coba mengedit `<Profile />` ke `<Gallery />` dan kembali pada contoh ini:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <Profile />
  );
}
```

```js Gallery.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Sekarang Anda menggunakan campuran **default** dan **named exports**:

* `Gallery.js`:
  - Mengekspor komponen `Profile` sebagai **named exports bernama `Profile`.**
  - Mengekspor komponen `Gallery` sebagai **default exports.**
* `App.js`:
  - Mengimpor `Profile` as a **named imports called `Profile`** dari `Gallery.js`.
  - Mengimpor `Gallery` as a **default imports** dari `Gallery.js`.
  - Mengekspor komponen root `App` sebagai **default exports.**

<Recap>

Pada halaman ini Anda belajar:

* Apa itu *file* komponen root
* Bagaimana cara impor dan ekspor komponen
* Kapan menggunakan **default** dan **named** impor dan ekspor
* Bagaimana cara mengimpor dan mengekspor beberapa komponen pada satu *file*

</Recap>



<Challenges>

#### Memisahkan komponen lebih jauh {/*split-the-components-further*/}

Saat ini, `Gallery.js` mengekspor kedua `Profile` dan `Gallery`, yang mana sedikit membingungkan.

Pindahkan komponen `Profile` pada miliknya sendiri `Profile.js`, dan ubah komponen `App` untuk me-*render* kedua `<Profile />` dan `<Gallery />` satu setelah lainnya.

Anda mungkin menggukanan salah satu dari **default** atau **named** eskpor untuk `Profile`, tetapi pastikan bahwa Anda menggunakan sintaksis impor pada kedua `App.js` dan `Gallery.js`. Anda dapat merujuk pada table dari bagian **deep dive** di atas:

| Sintaksis           | Pernyataan Expor                           | Pernyataan Impor                          |
| -----------      | -----------                                | -----------                               |
| Default  | `export default function Button() {}` | `import Button from './Button.js';`     |
| Named    | `export function Button() {}`         | `import { Button } from './Button.js';` |

<Hint>

Jangan lupa untuk mengimpor komponen Anda di mana mereka dipanggil. Bukankah `Gallery` juga menggunakan `Profile`?

</Hint>

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Gallery.js';

export default function App() {
  return (
    <div>
      <Profile />
    </div>
  );
}
```

```js Gallery.js active
// Pindahkan saya ke Profile.js!
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Setelah Anda berhasil menjalankan dengan salah satu ekspor, buat juga berjalan dengan jenis yang lain.

<Solution>

Ini adalah solusi menggunakan `named exports`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import { Profile } from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import { Profile } from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

Ini adalah solusi menggunakan `default exports`:

<Sandpack>

```js App.js
import Gallery from './Gallery.js';
import Profile from './Profile.js';

export default function App() {
  return (
    <div>
      <Profile />
      <Gallery />
    </div>
  );
}
```

```js Gallery.js
import Profile from './Profile.js';

export default function Gallery() {
  return (
    <section>
      <h1>Para ilmuwan hebat</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```js Profile.js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

</Solution>

</Challenges>
