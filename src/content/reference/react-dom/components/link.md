---
link: "<link>"
---

<<<<<<< HEAD
<Canary>

Ekstensi React untuk `<link>` saat ini hanya tersedia di kanal *canary* dan eksperimental React. Pada rilis stabil React, `<link>` hanya berfungsi sebagai [komponen HTML bawaan peramban](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

=======
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
<Intro>

[Komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) memungkinkan Anda menggunakan sumber daya eksternal seperti *stylesheet* atau memberi anotasi pada dokumen dengan metadata tautan.

```js
<link rel="icon" href="favicon.ico" />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<link>` {/*link*/}

Untuk menautkan ke sumber daya eksternal seperti *stylesheet*, *font*, dan ikon, atau untuk memberi anotasi pada dokumen dengan metadata tautan, renderlah [komponen `<link>` bawaan peramban](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link). Anda dapat me-*render* `<link>` dari komponen mana pun dan React [dalam kebanyakan kasus](#special-rendering-behavior) akan menempatkan elemen DOM yang sesuai di bagian *head* dokumen.

```js
<link rel="icon" href="favicon.ico" />
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### *Props* {/*props*/}

`<link>` mendukung semua [*props* elemen umum.](/reference/react-dom/components/common#props)

* `rel`: *string*, dibutuhkan. Menentukan [hubungan dengan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel). React [memperlakukan tautan dengan rel="stylesheet" secara berbeda](#special-rendering-behavior) dari tautan lainnya.

*Props* ini berlaku ketika `rel="stylesheet"`:

* `precedence`: *string*. Memberitahu React di mana peringkat node DOM `<link>` tergantung pada yang lain di dokumen `<head>`, yang menentukan *stylesheet* mana yang dapat menimpa yang lain. React akan menyimpulkan bahwa nilai *precedence* yang ditemukan pertama kali adalah "lebih rendah" dan nilai *precedence* yang ditemukan kemudian adalah "lebih tinggi". Banyak sistem gaya dapat berfungsi dengan baik menggunakan satu nilai *precedence* karena aturan gaya bersifat atomik. *stylesheet* dengan *precedence* yang sama akan dikelompokkan bersama baik mereka adalah *tag* `<link>` atau *tag* `<style>` inline atau dimuat menggunakan *function* [`preinit`](/reference/react-dom/preinit).
* `media`: *string*. Membatasi *stylesheet* pada [media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) tertentu.
* `title`: *string*. Menentukan nama dari [stylesheet alternatif](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

*Props* ini berlaku ketika `rel="stylesheet"` tetapi menonaktifkan  [perlakuan khusus *stylesheet*](/reference/react-dom/components/link#special-rendering-behavior) oleh React:

`disabled`: *boolean*. Menonaktifkan *stylesheet*.
`onError`: *function*. Dipanggil ketika *stylesheet* gagal dimuat.
`onLoad`: *function*. Dipanggil ketika *stylesheet* selesai dimuat.

*Props* ini berlaku ketika `rel="preload"` atau `rel="modulepreload"`:

`as`: *string*. Jenis sumber daya. Nilai yang mungkin adalah `audio`, `document`, `embed`, `fetch`, `font`, `image`, `object`, `script`, `style`, `track`, `video`, `worker`.
`imageSrcSet`: *string*. Berlaku hanya ketika `as="image"`. Menentukan [*source set* dari gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).
`imageSizes`: *string*. Berlaku hanya ketika `as="image"`. Menentukan [ukuran gambar](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

*Props* ini berlaku ketika `rel="icon"` atau `rel="apple-touch-icon"`:

* `sizes`: *string*. [Ukuran ikon](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images).

*Props* ini berlaku dalam semua kasus:

* `href`: *string*. URL dari sumber daya yang ditautkan.
* `crossOrigin`: *string*. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang mungkin adalah `anonymous` dan `use-credentials`. Diperlukan ketika `as` diatur ke `"fetch"`.
* `referrerPolicy`: *string*. [Header Referrer](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link#referrerpolicy) yang dikirim saat mengambil. Nilai yang mungkin adalah `no-referrer-when-downgrade` (default), `no-referrer`, `origin`, `origin-when-cross-origin`, dan `unsafe-url`.
* `fetchPriority`: *string*. Menyarankan prioritisasi terhadap pengambilan sumber daya. Nilai yang mungkin adalah `auto` (default), `high`, dan `low`.
* `hrefLang`: *string*. Bahasa dari sumber daya yang ditautkan.
* `integrity`: *string*. *Hash* kriptografi dari sumber daya, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `type`: *string*. Tipe MIME dari sumber daya yang ditautkan.

*Props* yang **tidak direkomendasikan** untuk digunakan dengan React:

* `blocking`: *string*. Jika diatur ke *`"render"`*, instruksikan peramban untuk tidak me-*render* halaman sampai *stylesheet* dimuat. React memberikan kendali yang lebih halus menggunakan *Suspense*.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React akan selalu menempatkan elemen DOM yang sesuai dengan komponen `<link>` di dalam `<head>` dokumen, terlepas dari mana dalam pohon React itu di-*render*. `<head>` adalah satu-satunya tempat valid untuk `<link>` dalam DOM, namun ini sesuai dan menjaga hal-hal tetap dapat dikomposisikan jika sebuah komponen yang mewakili halaman tertentu dapat me-*render* komponen `<link>` itu sendiri.

Ada beberapa pengecualian untuk ini:

* Jika `<link>` memiliki *prop* `rel="stylesheet"`, maka harus juga memiliki *prop* `precedence` untuk mendapatkan perilaku khusus ini. Ini karena urutan *stylesheet* dalam dokumen ialah penting, sehingga React perlu tahu bagaimana mengatur *stylesheet* ini tergantung pada yang lain, yang Anda tentukan menggunakan *prop* `precedence`. Jika *prop* `precedence` dihilangkan, tidak ada perilaku khusus.
* Jika `<link>` memiliki *prop* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), tidak ada perilaku khusus, karena dalam kasus ini tidak berlaku untuk dokumen tetapi mewakili metadata tentang bagian spesifik dari halaman.
* Jika `<link>` memiliki *prop* `onLoad` atau `onError`, karena dalam kasus ini Anda mengelola pemuatan sumber daya yang ditautkan secara manual dalam komponen React Anda.

#### Perilaku khusus untuk *stylesheet* {/*special-behavior-for-stylesheets*/}

Selain itu, jika `<link>` menuju *stylesheet* (yaitu, memiliki `rel="stylesheet"` dalam *props*), React memperlakukannya secara khusus dalam cara berikut:

* Komponen yang me-*render* `<link>` akan [menangguhkan](/reference/react/Suspense) saat *stylesheet* sedang dimuat.
* Jika beberapa komponen me-*render* tautan ke *stylesheet* yang sama, React akan menghapus duplikatnya dan hanya menempatkan satu tautan ke dalam DOM. Dua tautan dianggap sama jika mereka memiliki *prop* `href` yang sama.

Ada dua pengecualian untuk perilaku khusus ini:

* Jika tautan tidak memiliki *prop* `precedence`, tidak ada perilaku khusus, karena urutan *stylesheet* dalam dokumen itu penting, sehingga React perlu tahu bagaimana mengatur *stylesheet* ini tergantung pada yang lain, yang Anda tentukan menggunakan *prop* `precedence`.
* Jika Anda memberikan salah satu dari *prop* `onLoad`, `onError`, atau `disabled`, tidak ada perilaku khusus, karena *prop* ini menunjukkan bahwa Anda mengelola pemuatan *stylesheet* secara manual dalam komponen Anda.

Perlakuan khusus ini memiliki dua peringatan:

* React akan mengabaikan perubahan pada semua *props* setelah tautan di-*render*. (React akan mengeluarkan peringatan dalam pengembangan jika ini terjadi.)
* React dapat meninggalkan tautan dalam DOM bahkan setelah komponen yang me-*render*-nya dihapus.

---

## Penggunaan {/*usage*/}

### Menautkan ke sumber daya terkait {/*linking-to-related-resources*/}

Anda dapat memberi anotasi pada dokumen dengan tautan ke sumber daya terkait seperti ikon, URL kanonik, atau *pingback*. React akan menempatkan metadata ini di dalam `<head>` dokumen terlepas dari mana dalamnya pohon React itu di-*render*.

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

### Menautkan ke *stylesheet* {/*linking-to-a-stylesheet*/}

Jika sebuah komponen bergantung pada *stylesheet* tertentu agar dapat ditampilkan dengan benar, Anda dapat me-*render* tautan ke *stylesheet* tersebut di dalam komponen. Komponen Anda akan [menangguhkan](/reference/react/Suspense) saat *stylesheet* sedang dimuat. Anda harus menyertakan *prop* `precedence`, yang memberi tahu React di mana harus menempatkan *stylesheet* ini tergantung pada yang lain — *stylesheet* dengan *precedence* lebih tinggi dapat menimpa yang dengan *precedence* lebih rendah.

<Note>
Ketika Anda ingin menggunakan *stylesheet*, akan lebih berguna saat memanggil *function* [preinit](/reference/react-dom/preinit). Memanggil *function* ini dapat memungkinkan peramban untuk mulai mengambil *stylesheet* lebih awal daripada jika Anda hanya me-*render* komponen `<link>`, misalnya dengan mengirimkan [respons HTTP Early Hints](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/103).
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

### Mengendalikan *precedence* *stylesheet* {/*controlling-stylesheet-precedence*/}

<<<<<<< HEAD
*Stylesheet* dapat bertentangan satu sama lain, dan ketika itu terjadi, peramban akan memilih yang datang kemudian dalam dokumen. React memungkinkan Anda mengendalikan urutan *stylesheet* dengan *prop* `precedence`. Dalam contoh ini, dua komponen me-*render* *stylesheet*, dan yang memiliki *precedence* lebih tinggi akan muncul kemudian dalam dokumen meskipun komponen yang me-*render*-nya datang lebih awal.

{/*FIXME: ini tampaknya tidak benar-benar berfungsi -- sepertinya *precedence* belum diimplementasikan?*/}
=======
Stylesheets can conflict with each other, and when they do, the browser goes with the one that comes later in the document. React lets you control the order of stylesheets with the `precedence` prop. In this example, three components render stylesheets, and the ones with the same precedence are grouped together in the `<head>`. 
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function HalamanRumah() {
  return (
    <ShowRenderedHTML>
<<<<<<< HEAD
      <KomponenPertama />
      <KomponenKedua />
=======
      <FirstComponent />
      <SecondComponent />
      <ThirdComponent/>
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
      ...
    </ShowRenderedHTML>
  );
}

<<<<<<< HEAD
function KomponenPertama() {
  return <link rel="stylesheet" href="first.css" precedence="high" />;
}

function KomponenKedua() {
  return <link rel="stylesheet" href="second.css" precedence="low" />;
=======
function FirstComponent() {
  return <link rel="stylesheet" href="first.css" precedence="first" />;
}

function SecondComponent() {
  return <link rel="stylesheet" href="second.css" precedence="second" />;
}

function ThirdComponent() {
  return <link rel="stylesheet" href="third.css" precedence="first" />;
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781
}

```

</SandpackWithHTMLOutput>

<<<<<<< HEAD
### Merender *stylesheet* yang dihapus duplikatnya {/*deduplicated-stylesheet-rendering*/}
=======
Note the `precedence` values themselves are arbitrary and their naming is up to you. React will infer that precedence values it discovers first are "lower" and precedence values it discovers later are "higher".

### Deduplicated stylesheet rendering {/*deduplicated-stylesheet-rendering*/}
>>>>>>> a5aad0d5e92872ef715b462b1dd6dcbeb45cf781

Jika Anda me-*render* *stylesheet* yang sama dari beberapa komponen, React hanya akan menempatkan satu `<link>` di bagian *head* dokumen.

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

Anda dapat menggunakan komponen `<link>` dengan *prop* `itemProp` untuk memberi anotasi pada item tertentu dalam dokumen dengan tautan ke sumber daya terkait. Dalam hal ini, React *tidak* akan menempatkan anotasi ini di dalam `<head>` dokumen tetapi akan menempatkannya seperti komponen React lainnya.

```js
<section itemScope>
  <h3>Memberi anotasi terhadap item tertentu</h3>
  <link itemProp="penulis" href="http://example.com/" />
  <p>...</p>
</section>
```
