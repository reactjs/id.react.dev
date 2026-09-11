---
style: "<style>"
---

<Intro>

Komponen [bawaan browser `<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style) memungkinkan Anda menambahkan stylesheet CSS inline ke dokumen Anda.

```js
<style>{` p { color: red; } `}</style>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<style>` {/*style*/}

Untuk menambahkan gaya inline ke dokumen Anda, render [komponen bawaan browser `<style>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/style). Anda dapat merender `<style>` dari komponen apa pun dan React akan, [dalam kasus tertentu](#special-rendering-behavior), menempatkan elemen DOM yang sesuai di head dokumen serta menghapus duplikasi gaya yang identik.

```js
<style>{` p { color: red; } `}</style>
```

[Lihat contoh lainnya di bawah.](#usage)

#### Properti {/*props*/}

`<style>` mendukung semua [properti elemen umum.](/reference/react-dom/components/common#common-props)

* `children`: string, wajib. Isi stylesheet.
* `precedence`: string. Memberi tahu React peringkat node DOM `<style>` relatif terhadap yang lain di `<head>` dokumen, yang menentukan stylesheet mana yang dapat menimpa yang lain. React akan menyimpulkan bahwa nilai precedence yang ditemukannya lebih awal lebih "rendah" dan nilai precedence yang ditemukannya lebih belakangan lebih "tinggi". Banyak sistem gaya dapat bekerja dengan baik menggunakan satu nilai precedence karena aturan gaya bersifat atomik. Stylesheet dengan precedence yang sama akan dikelompokkan bersama, baik berupa `<link>` maupun tag `<style>` inline atau dimuat menggunakan fungsi [`preinit`](/reference/react-dom/preinit).
* `href`: string. Memungkinkan React [menghapus duplikasi gaya](#special-rendering-behavior) yang memiliki `href` yang sama.
* `media`: string. Membatasi stylesheet pada [kueri media](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries) tertentu.
* `nonce`: string. [Nonce kriptografis untuk mengizinkan resource](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) saat menggunakan Content Security Policy yang ketat.
* `title`: string. Menentukan nama [stylesheet alternatif](https://developer.mozilla.org/en-US/docs/Web/CSS/Alternative_style_sheets).

Properti yang **tidak direkomendasikan** untuk digunakan dengan React:

* `blocking`: string. Jika diatur ke `"render"`, browser diperintahkan untuk tidak merender halaman sampai stylesheet dimuat. React menyediakan kontrol yang lebih terperinci menggunakan Suspense.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React dapat memindahkan komponen `<style>` ke `<head>` dokumen, menghapus duplikasi stylesheet yang identik, dan [menangguhkan](/reference/react/Suspense) saat stylesheet sedang dimuat.

Untuk mengaktifkan perilaku ini, berikan properti `href` dan `precedence`. React akan menghapus duplikasi gaya jika memiliki `href` yang sama. Properti precedence memberi tahu React peringkat node DOM `<style>` relatif terhadap yang lain di `<head>` dokumen, yang menentukan stylesheet mana yang dapat menimpa yang lain.

Perlakuan khusus ini disertai beberapa catatan:

* React akan mengabaikan perubahan properti setelah gaya dirender. (React akan mengeluarkan peringatan dalam mode pengembangan jika hal ini terjadi.)
* React akan menghapus semua properti tambahan ketika menggunakan properti `precedence` (selain `href` dan `precedence`).
* React dapat membiarkan gaya tetap berada di DOM bahkan setelah komponen yang merendernya di-unmount.

---

## Penggunaan {/*usage*/}

### Merender stylesheet CSS inline {/*rendering-an-inline-css-stylesheet*/}

Jika sebuah komponen bergantung pada gaya CSS tertentu agar ditampilkan dengan benar, Anda dapat merender stylesheet inline di dalam komponen.

Properti `href` harus mengidentifikasi stylesheet secara unik, karena React akan menghapus duplikasi stylesheet yang memiliki `href` yang sama.
Jika Anda memberikan properti `precedence`, React akan mengurutkan ulang stylesheet inline berdasarkan urutan kemunculan nilai-nilai ini dalam pohon komponen.

Stylesheet inline tidak akan memicu batas Suspense saat sedang dimuat.
Bahkan jika mereka memuat resource async seperti font atau gambar

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';
import { useId } from 'react';

function PieChart({data, colors}) {
  const id = useId();
  const stylesheet = colors.map((color, index) =>
    `#${id} .color-${index}: \{ color: "${color}"; \}`
  ).join();
  return (
    <>
      <style href={"PieChart-" + JSON.stringify(colors)} precedence="medium">
        {stylesheet}
      </style>
      <svg id={id}>
        …
      </svg>
    </>
  );
}

export default function App() {
  return (
    <ShowRenderedHTML>
      <PieChart data="..." colors={['red', 'green', 'blue']} />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
