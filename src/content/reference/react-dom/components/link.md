---
link: "<link>"
canary: true
---

<Canary>

Ekstensi React untuk `<link>` saat ini hanya tersedia di kanal canary dan eksperimental React. Pada rilis stabil React, `<link>` hanya berfungsi sebagai [komponen HTML bawaan peramban](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) memungkinkan Anda menggunakan sumber daya eksternal seperti stylesheet atau memberi anotasi pada dokumen dengan metadata tautan.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<link>` {/*link*/}

Untuk menautkan ke sumber daya eksternal seperti stylesheet, font, dan ikon, atau untuk memberi anotasi pada dokumen dengan metadata tautan, renderlah [komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Anda dapat merender `<link>` dari komponen mana pun dan React [dalam kebanyakan kasus](#special-rendering-behavior) akan menempatkan elemen DOM yang sesuai di bagian kepala dokumen.

```js
<link rel="icon" href="favicon.ico" />
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Properti {/*props*/}

`<link>` mendukung semua [properti elemen umum.](/reference/react-dom/components/common#props)

* `rel`: string, dibutuhkan. Menentukan [hubungan dengan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [memperlakukan tautan dengan rel="stylesheet" secara berbeda](#special-rendering-behavior) dari tautan lainnya.

Properti-properti ini berlaku ketika `rel="stylesheet"`:

* `precedence`: string. Memberitahu React di mana peringkat node DOM `<link>` relatif terhadap yang lain di dokumen `<head>`, yang menentukan stylesheet mana yang dapat menimpa yang lain. React akan menyimpulkan bahwa nilai precedence yang ditemukan pertama kali adalah "lebih rendah" dan nilai precedence yang ditemukan kemudian adalah "lebih tinggi". Banyak sistem gaya dapat berfungsi dengan baik menggunakan satu nilai precedence karena aturan gaya bersifat atomik. Stylesheet dengan precedence yang sama akan dikelompokkan bersama baik mereka adalah tag `<link>` atau tag `<style>` inline atau dimuat menggunakan fungsi [`preinit`](/reference/react-dom/preinit).
* `media`: string. Membatasi stylesheet pada [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) tertentu.
* `title`: string. Menentukan nama dari [stylesheet alternatif](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Properti-properti ini berlaku ketika `rel="stylesheet"` tetapi menonaktifkan  [`perlakuan khusus stylesheet`](/reference/react-dom/components/link#special-rendering-behavior) oleh React:

`disabled`: boolean. Menonaktifkan stylesheet.
`onError`: fungsi. Dipanggil ketika stylesheet gagal dimuat.
`onLoad`: fungsi. Dipanggil ketika stylesheet selesai dimuat.

Properti-properti ini berlaku ketika `rel="preload"` atau `rel="modulepreload"`:

`as`: string. Jenis sumber daya. Nilai yang mungkin adalah `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
`imageSrcSet`: string. Berlaku hanya ketika `as="image"`. Menentukan [source set dari gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
`imageSizes`: string. Berlaku hanya ketika as="image". Menentukan [ukuran gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Properti-properti ini berlaku ketika `rel="icon"` atau `rel="apple-touch-icon"`:

* `sizes`: string. [Ukuran ikon](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

Properti-properti ini berlaku dalam semua kasus:

* `href`: string. URL dari sumber daya yang ditautkan.
* `crossOrigin`: string. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang mungkin adalah `anonymous` dan `use-credentials`. Diperlukan ketika `as` diatur ke `"fetch"`.
* `referrerPolicy`: string. [Header Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) yang dikirim saat mengambil. Nilai yang mungkin adalah `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, dan `unsafe-url`.
* `fetchPriority`: string. Menyarankan prioritas relatif untuk mengambil sumber daya. Nilai yang mungkin adalah `auto` (default), `high`, dan `low`.
* `hrefLang`: string. Bahasa dari sumber daya yang ditautkan.
* `integrity`: string. Hash kriptografi dari sumber daya, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: string. Tipe MIME dari sumber daya yang ditautkan.

Properti yang **tidak direkomendasikan** untuk digunakan dengan React:

* `blocking`: string. Jika diatur ke `"render"`, instruksikan browser untuk tidak merender halaman sampai stylesheet dimuat. React memberikan kontrol yang lebih halus menggunakan Suspense.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React akan selalu menempatkan elemen DOM yang sesuai dengan komponen `<link>` di dalam `<head>` dokumen, terlepas dari di mana dalam pohon React itu dirender. `<head>` adalah satu-satunya tempat valid untuk `<link>` dalam DOM, namun ini sesuai dan menjaga hal-hal tetap dapat dikomposisikan jika sebuah komponen yang mewakili halaman tertentu dapat merender komponen `<link>` itu sendiri.

Ada beberapa pengecualian untuk ini:

* Jika `<link>` memiliki properti `rel="stylesheet"`, maka harus juga memiliki properti `precedence` untuk mendapatkan perilaku khusus ini. Ini karena urutan stylesheet dalam dokumen adalah signifikan, sehingga React perlu tahu bagaimana mengatur stylesheet ini relatif terhadap yang lain, yang Anda tentukan menggunakan properti `precedence`. Jika properti `precedence` dihilangkan, tidak ada perilaku khusus.
* Jika `<link>` memiliki properti [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), tidak ada perilaku khusus, karena dalam kasus ini tidak berlaku untuk dokumen tetapi mewakili metadata tentang bagian spesifik dari halaman.
* Jika `<link>` memiliki properti `onLoad` atau `onError`, karena dalam kasus ini Anda mengelola pemuatan sumber daya yang ditautkan secara manual dalam komponen React Anda.

#### Perilaku khusus untuk stylesheet {/*special-behavior-for-stylesheets*/}

Selain itu, jika `<link>` menuju stylesheet (yaitu, memiliki `rel="stylesheet"` dalam propertinya), React memperlakukannya secara khusus dalam cara berikut:

* Komponen yang merender `<link>` akan [menangguhkan](/reference/react/Suspense) saat stylesheet sedang dimuat.
* Jika beberapa komponen merender tautan ke stylesheet yang sama, React akan menghapus duplikatnya dan hanya menempatkan satu tautan ke dalam DOM. Dua tautan dianggap sama jika mereka memiliki properti `href` yang sama.

Ada dua pengecualian untuk perilaku khusus ini:

* Jika tautan tidak memiliki properti `precedence`, tidak ada perilaku khusus, karena urutan stylesheet dalam dokumen ialah penting, sehingga React perlu tahu bagaimana mengatur stylesheet ini relatif terhadap yang lain, yang Anda tentukan menggunakan properti `precedence`.
* Jika Anda memberikan salah satu dari properti `onLoad`, `onError`, atau `disabled`, tidak ada perilaku khusus, karena properti ini menunjukkan bahwa Anda mengelola pemuatan stylesheet secara manual dalam komponen Anda.

Perlakuan khusus ini memiliki dua peringatan:

* React akan mengabaikan perubahan pada semua properti setelah tautan dirender. (React akan mengeluarkan peringatan dalam pengembangan jika ini terjadi.)
* React dapat meninggalkan tautan dalam DOM bahkan setelah komponen yang merendernya dihapus.

---

## Penggunaan {/*usage*/}

### Menautkan ke sumber daya terkait {/*linking-to-related-resources*/}

Anda dapat memberi anotasi pada dokumen dengan tautan ke sumber daya terkait seperti ikon, URL kanonik, atau pingback. React akan menempatkan metadata ini di dalam `<head>` dokumen terlepas dari di mana dalam pohon React itu dirender.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function BlogPage() {
  return (
    <ShowRenderedHTML>
      <link rel="icon" href="favicon.ico" />
      <link rel="pingback" href="http://www.example.com/xmlrpc.php" />
      <h1>Blog saya</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Menautkan ke stylesheet {/*linking-to-a-stylesheet*/}

Jika sebuah komponen bergantung pada stylesheet tertentu agar dapat ditampilkan dengan benar, Anda dapat merender tautan ke stylesheet tersebut di dalam komponen. Komponen Anda akan [menangguhkan](/reference/react/Suspense) saat stylesheet sedang dimuat. Anda harus menyertakan properti `precedence`, yang memberi tahu React di mana harus menempatkan stylesheet ini relatif terhadap yang lain — stylesheet dengan precedence lebih tinggi dapat menimpa yang dengan precedence lebih rendah.

<Note>
Ketika Anda ingin menggunakan stylesheet, akan lebih bermanfaat untuk memanggil fungsi [preinit](/reference/react-dom/preinit). Memanggil fungsi ini dapat memungkinkan peramban untuk mulai mengambil stylesheet lebih awal daripada jika Anda hanya merender komponen `<link>`, misalnya dengan mengirimkan [respons HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
</Note>

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <link rel="stylesheet" href="sitemap.css" precedence="medium" />
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Mengontrol precedence stylesheet {/*controlling-stylesheet-precedence*/}

Stylesheet dapat bertentangan satu sama lain, dan ketika itu terjadi, peramban akan memilih yang datang kemudian dalam dokumen. React memungkinkan Anda mengendalikan urutan stylesheet dengan properti `precedence`. Dalam contoh ini, dua komponen merender stylesheet, dan yang memiliki precedence lebih tinggi akan muncul kemudian dalam dokumen meskipun komponen yang merendernya datang lebih awal.

{/*FIXME: ini tampaknya tidak benar-benar berfungsi -- sepertinya precedence belum diimplementasikan?*/}

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HalamanRumah() {
  return (
    <ShowRenderedHTML>
      <KomponenPertama />
      <KomponenKedua />
      ...
    </ShowRenderedHTML>
  );
}

function KomponenPertama() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function KomponenKedua() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
}

```

</SandpackWithHTMLOutput>

### Merender stylesheet yang dihapus duplikatnya {/*deduplicated-stylesheet-rendering*/}

Jika Anda merender stylesheet yang sama dari beberapa komponen, React hanya akan menempatkan satu `<link>` di bagian kepala dokumen.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HalamanRumah() {
  return (
    <ShowRenderedHTML>
      <Komponen />
      <Komponen />
      ...
    </ShowRenderedHTML>
  );
}

function Komponen() {
  return <link rel="stylesheet" href="styles.css" precedence="medium" />;
}
```

</SandpackWithHTMLOutput>

### Memberi anotasi pada item tertentu dalam dokumen dengan tautan {/*annotating-specific-items-within-the-document-with-links*/}

Anda dapat menggunakan komponen `<link>` dengan properti `itemProp` untuk memberi anotasi pada item tertentu dalam dokumen dengan tautan ke sumber daya terkait. Dalam hal ini, React *tidak* akan menempatkan anotasi ini di dalam `<head>` dokumen tetapi akan menempatkannya seperti komponen React lainnya.

```js
<section itemScope>
  <h3>Memberi anotasi terhadap item tertentu</h3>
  <link itemProp="penulis" href="http://example.com/" />
  <p>...</p>
</section>
```
