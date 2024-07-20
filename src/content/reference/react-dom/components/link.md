---
link: "<link>"
canary: true
---

<Canary>

Ekstensi React untuk `<link>` saat ini hanya tersedia di kanal _canary_ dan eksperimental React. Pada rilis stabil React, `<link>` hanya berfungsi sebagai [komponen HTML bawaan peramban](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) memungkinkan Anda menggunakan sumber daya eksternal seperti _stylesheet_ atau memberi anotasi pada dokumen dengan metadata tautan.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<link>` {/*link*/}

Untuk menautkan ke sumber daya eksternal seperti _stylesheet_, _font_, dan ikon, atau untuk memberi anotasi pada dokumen dengan metadata tautan, renderlah [komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Anda dapat me-_render_ `<link>` dari komponen mana pun dan React [dalam kebanyakan kasus](#special-rendering-behavior) akan menempatkan elemen DOM yang sesuai di bagian kepala dokumen.

```js
<link rel="icon" href="favicon.ico" />
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### _Props_ {/*props*/}

`<link>` mendukung semua [_props_ elemen umum.](/reference/react-dom/components/common#props)

* `rel`: _string_, dibutuhkan. Menentukan [hubungan dengan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [memperlakukan tautan dengan rel="stylesheet" secara berbeda](#special-rendering-behavior) dari tautan lainnya.

_Props_ ini berlaku ketika `rel="stylesheet"`:

* `precedence`: _string_. Memberitahu React di mana peringkat node DOM `<link>` tergantung pada yang lain di dokumen `<head>`, yang menentukan _stylesheet_ mana yang dapat menimpa yang lain. React akan menyimpulkan bahwa nilai _precedence_ yang ditemukan pertama kali adalah "lebih rendah" dan nilai _precedence_ yang ditemukan kemudian adalah "lebih tinggi". Banyak sistem gaya dapat berfungsi dengan baik menggunakan satu nilai _precedence_ karena aturan gaya bersifat atomik. _Stylesheet_ dengan _precedence_ yang sama akan dikelompokkan bersama baik mereka adalah _tag_ `<link>` atau _tag_ `<style>` inline atau dimuat menggunakan _function_ [`preinit`](/reference/react-dom/preinit).
* `media`: _string_. Membatasi _stylesheet_ pada [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) tertentu.
* `title`: _string_. Menentukan nama dari [stylesheet alternatif](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

_Props_ ini berlaku ketika `rel="stylesheet"` tetapi menonaktifkan  [perlakuan khusus _stylesheet_](/reference/react-dom/components/link#special-rendering-behavior) oleh React:

`disabled`: _boolean_. Menonaktifkan _stylesheet_.
`onError`: _function_. Dipanggil ketika _stylesheet_ gagal dimuat.
`onLoad`: _function_. Dipanggil ketika _stylesheet_ selesai dimuat.

_Props_ ini berlaku ketika `rel="preload"` atau `rel="modulepreload"`:

`as`: _string_. Jenis sumber daya. Nilai yang mungkin adalah `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
`imageSrcSet`: _string_. Berlaku hanya ketika `as="image"`. Menentukan [_source set_ dari gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
`imageSizes`: _string_. Berlaku hanya ketika `as="image"`. Menentukan [ukuran gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

_Props_ ini berlaku ketika `rel="icon"` atau `rel="apple-touch-icon"`:

* `sizes`: _string_. [Ukuran ikon](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

_Props_ ini berlaku dalam semua kasus:

* `href`: _string_. URL dari sumber daya yang ditautkan.
* `crossOrigin`: _string_. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang mungkin adalah `anonymous` dan `use-credentials`. Diperlukan ketika `as` diatur ke `"fetch"`.
* `referrerPolicy`: _string_. [Header Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) yang dikirim saat mengambil. Nilai yang mungkin adalah `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, dan `unsafe-url`.
* `fetchPriority`: _string_. Menyarankan prioritisasi terhadap pengambilan sumber daya. Nilai yang mungkin adalah `auto` (default), `high`, dan `low`.
* `hrefLang`: _string_. Bahasa dari sumber daya yang ditautkan.
* `integrity`: _string_. _Hash_ kriptografi dari sumber daya, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: _string_. Tipe MIME dari sumber daya yang ditautkan.

_Props_ yang **tidak direkomendasikan** untuk digunakan dengan React:

* `blocking`: _string_. Jika diatur ke _`"render"`_, instruksikan peramban untuk tidak me-_render_ halaman sampai _stylesheet_ dimuat. React memberikan kendali yang lebih halus menggunakan _Suspense_.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React akan selalu menempatkan elemen DOM yang sesuai dengan komponen `<link>` di dalam `<head>` dokumen, terlepas dari mana dalam pohon React itu dirender. `<head>` adalah satu-satunya tempat valid untuk `<link>` dalam DOM, namun ini sesuai dan menjaga hal-hal tetap dapat dikomposisikan jika sebuah komponen yang mewakili halaman tertentu dapat me-_render_ komponen `<link>` itu sendiri.

Ada beberapa pengecualian untuk ini:

* Jika `<link>` memiliki _prop_ `rel="stylesheet"`, maka harus juga memiliki _prop_ `precedence` untuk mendapatkan perilaku khusus ini. Ini karena urutan _stylesheet_ dalam dokumen adalah signifikan, sehingga React perlu tahu bagaimana mengatur _stylesheet_ ini tergantung pada yang lain, yang Anda tentukan menggunakan _prop_ `precedence`. Jika _prop_ `precedence` dihilangkan, tidak ada perilaku khusus.
* Jika `<link>` memiliki _prop_ [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), tidak ada perilaku khusus, karena dalam kasus ini tidak berlaku untuk dokumen tetapi mewakili metadata tentang bagian spesifik dari halaman.
* Jika `<link>` memiliki _prop_ `onLoad` atau `onError`, karena dalam kasus ini Anda mengelola pemuatan sumber daya yang ditautkan secara manual dalam komponen React Anda.

#### Perilaku khusus untuk _stylesheet_ {/*special-behavior-for-stylesheets*/}

Selain itu, jika `<link>` menuju _stylesheet_ (yaitu, memiliki `rel="stylesheet"` dalam propertinya), React memperlakukannya secara khusus dalam cara berikut:

* Komponen yang me-_render_ `<link>` akan [menangguhkan](/reference/react/Suspense) saat _stylesheet_ sedang dimuat.
* Jika beberapa komponen me-_render_ tautan ke _stylesheet_ yang sama, React akan menghapus duplikatnya dan hanya menempatkan satu tautan ke dalam DOM. Dua tautan dianggap sama jika mereka memiliki _prop_ `href` yang sama.

Ada dua pengecualian untuk perilaku khusus ini:

* Jika tautan tidak memiliki _prop_ `precedence`, tidak ada perilaku khusus, karena urutan _stylesheet_ dalam dokumen itu penting, sehingga React perlu tahu bagaimana mengatur _stylesheet_ ini tergantung pada yang lain, yang Anda tentukan menggunakan _prop_ `precedence`.
* Jika Anda memberikan salah satu dari _prop_ `onLoad`, `onError`, atau `disabled`, tidak ada perilaku khusus, karena _prop_ ini menunjukkan bahwa Anda mengelola pemuatan _stylesheet_ secara manual dalam komponen Anda.

Perlakuan khusus ini memiliki dua peringatan:

* React akan mengabaikan perubahan pada semua _props_ setelah tautan dirender. (React akan mengeluarkan peringatan dalam pengembangan jika ini terjadi.)
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

### Menautkan ke _stylesheet_ {/*linking-to-a-stylesheet*/}

Jika sebuah komponen bergantung pada _stylesheet_ tertentu agar dapat ditampilkan dengan benar, Anda dapat me-_render_ tautan ke _stylesheet_ tersebut di dalam komponen. Komponen Anda akan [menangguhkan](/reference/react/Suspense) saat _stylesheet_ sedang dimuat. Anda harus menyertakan _prop_ `precedence`, yang memberi tahu React di mana harus menempatkan _stylesheet_ ini tergantung pada yang lain — _stylesheet_ dengan _precedence_ lebih tinggi dapat menimpa yang dengan _precedence_ lebih rendah.

<Note>
Ketika Anda ingin menggunakan _stylesheet_, akan lebih bermanfaat untuk memanggil _function_ [preinit](/reference/react-dom/preinit). Memanggil _function_ ini dapat memungkinkan peramban untuk mulai mengambil _stylesheet_ lebih awal daripada jika Anda hanya me-_render_ komponen `<link>`, misalnya dengan mengirimkan [respons HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
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

### Mengendalikan _precedence_ _stylesheet_ {/*controlling-stylesheet-precedence*/}

Stylesheet dapat bertentangan satu sama lain, dan ketika itu terjadi, peramban akan memilih yang datang kemudian dalam dokumen. React memungkinkan Anda mengendalikan urutan _stylesheet_ dengan _prop_ `precedence`. Dalam contoh ini, dua komponen me-_render_ _stylesheet_, dan yang memiliki _precedence_ lebih tinggi akan muncul kemudian dalam dokumen meskipun komponen yang merendernya datang lebih awal.

{/*FIXME: ini tampaknya tidak benar-benar berfungsi -- sepertinya _precedence_ belum diimplementasikan?*/}

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

### Merender _stylesheet_ yang dihapus duplikatnya {/*deduplicated-stylesheet-rendering*/}

Jika Anda me-_render_ _stylesheet_ yang sama dari beberapa komponen, React hanya akan menempatkan satu `<link>` di bagian kepala dokumen.

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

Anda dapat menggunakan komponen `<link>` dengan _prop_ `itemProp` untuk memberi anotasi pada item tertentu dalam dokumen dengan tautan ke sumber daya terkait. Dalam hal ini, React *tidak* akan menempatkan anotasi ini di dalam `<head>` dokumen tetapi akan menempatkannya seperti komponen React lainnya.

```js
<section itemScope>
  <h3>Memberi anotasi terhadap item tertentu</h3>
  <link itemProp="penulis" href="http://example.com/" />
  <p>...</p>
</section>
```
