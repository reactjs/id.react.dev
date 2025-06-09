---
title: preload
---

<<<<<<< HEAD
<Canary>

Fungsi `preload` saat ini hanya tersedia di kanal Canary dan eksperimental React. Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91
<Note>

[Framework berbasis React](/learn/start-a-new-react-project) sering kali menangani pemuatan sumber daya untuk Anda, jadi Anda mungkin tidak perlu memanggil API ini sendiri. Lihat dokumentasi framework Anda untuk detailnya.

</Note>

<Intro>

`preload` memungkinkan Anda mengambil sumber daya seperti *stylesheet*, *font*, atau skrip eksternal yang ingin Anda gunakan.

```js
preload("https://example.com/font.woff2", {as: "font"});
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `preload(href, options)` {/*preload*/}

Untuk memuat sumber daya, panggil fungsi `preload` dari `react-dom`.

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/font.woff2", {as: "font"});
  // ...
}

```

[Lihat contoh lainnya di bawah ini.](#usage)

Fungsi `preload` memberikan petunjuk kepada browser untuk mulai mengunduh sumber daya yang diberikan, yang dapat menghemat waktu.

#### Parameter {/*parameters*/}

* `href`: sebuah string. URL sumber daya yang ingin Anda unduh.
* `options`: sebuah objek. Ini berisi properti-properti berikut:
  *  `as`: string yang diperlukan. Jenis sumber daya. Nilai [yang memungkinkan](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#as) adalah `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
  *  `crossOrigin`: sebuah string. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang akan digunakan. Nilai yang mungkin adalah `anonymous` dan `use-credentials`. Ini diperlukan ketika `as` disetel ke `"fetch"`.
  *  `referrerPolicy`: sebuah string. [Referrer header](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) yang akan dikirim saat *fetching*. Nilai yang memungkinkan adalah `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, dan `unsafe-url`.
  *  `integrity`: sebuah string. Hash kriptografi sumber daya, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `type`: sebuah string. Jenis MIME sumber daya.
  *  `nonce`: sebuah string. Sebuah kriptografi [*nonce* untuk mengizinkan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ketika menggunakan *Content Security Policy* yang ketat.
  *  `fetchPriority`: sebuah string. Menyarankan prioritas relatif untuk mengambil sumber daya. Nilai yang memungkinkan adalah `auto` (default), `high`, dan `low`.
  *  `imageSrcSet`: sebuah string. Hanya untuk digunakan dengan `as: “image"`. Menentukan [kumpulan sumber gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
  *  `imageSizes`: sebuah string. Hanya untuk digunakan dengan `as: “image"`. Menentukan [ukuran gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

#### Kembalian {/*returns*/}

`preload` tidak mengembalikan apa pun.

#### Peringatan {/*caveats*/}

* Beberapa panggilan setara ke `preload` memiliki efek yang sama dengan panggilan tunggal. Panggilan ke `preload` dianggap setara menurut aturan berikut:
  * Dua pemanggilan setara jika memiliki `href` yang sama, kecuali:
  * Jika `as` diset ke `image`, dua panggilan setara jika memiliki `href`, `imageSrcSet`, dan `imageSizes` yang sama.
* Di browser, Anda dapat memanggil `preload` dalam situasi apa pun: saat me-*render* komponen, di *Effect*, di *event handler*, dan sebagainya.
* Dalam rendering sisi server atau saat merender Komponen Server, `preload` hanya memiliki efek jika Anda memanggilnya saat me-*render* komponen atau dalam konteks asinkronisasi yang berasal dari rendering komponen. Pemanggilan lainnya akan diabaikan.

---

## Penggunaan {/*usage*/}

### Preloading awal saat me-render {/*preloading-when-rendering*/}

Panggil `preload` saat me-*render* komponen jika Anda mengetahui bahwa komponen tersebut atau anak komponen akan menggunakan sumber daya tertentu.

<Recipes titleText="Examples of preloading">

#### Preloading skrip eksternal {/*preloading-an-external-script*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Jika Anda ingin agar browser segera mengeksekusi skrip (bukan hanya mengunduhnya), gunakan [`preinit`](/reference/react-dom/preinit). Jika Anda ingin memuat modul ESM, gunakan [`preloadModule`](/reference/react-dom/preloadModule).

<Solution />

#### Preloading stylesheet {/*preloading-a-stylesheet*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  return ...;
}
```

Jika Anda ingin stylesheet disisipkan ke dalam dokumen dengan segera (yang berarti browser akan langsung mem-*parsing*-nya, bukan hanya mengunduhnya), gunakan [`preinit`](/reference/react-dom/preinit) sebagai gantinya.

<Solution />

#### Preloading font {/*preloading-a-font*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("https://example.com/style.css", {as: "style"});
  preload("https://example.com/font.woff2", {as: "font"});
  return ...;
}
```

Jika Anda melakukan *preload* stylesheet, sebaiknya Anda juga melakukan *preload* font apa pun yang dirujuk oleh stylesheet tersebut. Dengan begitu, browser dapat mulai mengunduh font sebelum mengunduh dan menguraikan stylesheet.

<Solution />

#### Preloading gambar {/*preloading-an-image*/}

```js
import { preload } from 'react-dom';

function AppRoot() {
  preload("/banner.png", {
    as: "image",
    imageSrcSet: "/banner512.png 512w, /banner1024.png 1024w",
    imageSizes: "(max-width: 512px) 512px, 1024px",
  });
  return ...;
}
```

Saat memuat gambar secara *preload*, opsi `imageSrcSet` dan `imageSizes` membantu browser [mengambil gambar dengan ukuran yang tepat untuk ukuran layar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

<Solution />

</Recipes>

### Preloading pada event handler {/*preloading-in-an-event-handler*/}

Panggil `preload` dalam *event handler* sebelum bertransisi ke halaman atau state yang membutuhkan sumber daya eksternal. Hal ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat merender halaman atau state baru.

```js
import { preload } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preload("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
