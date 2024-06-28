---
meta: "<meta>"
canary: true
---

<Canary>

Ekstensi React pada `<meta>` saat ini hanya tersedia di saluran eksperimental dan canary. Dalam rilis stabil React `<meta>` hanya bekerja sebagai [komponen HTML bawaan](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [saluran rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>


<Intro>

[Komponen HTML bawaan `<meta>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta) memungkinkan Anda menambahkan metadata ke dokumen.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<meta>` {/*meta*/}

Untuk menambahkan metadata dokumen, *render* komponen HTML bawaan `<meta>`. Anda dapat me-*render* `<meta>` dari komponen apa pun dan React akan selalu menempatkan elemen DOM yang sesuai di `<head>` dokumen.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Lihat contoh lebih lanjut di bawah.](#usage)

#### *Props* {/*props*/}

`<meta>` mendukung semua [*props* elemen pada umumnya.](/reference/react-dom/components/common#props)

Elemen ini harus memiliki *setidaknya satu* dari *props* berikut: `name`, `httpEquiv`, `charset`, `itemProp`. Komponen `<meta>` akan menghasilkan hal yang berbeda tergantung dari *props* yang diberikan.

* `name`: sebuah string. Menentukan [jenis dari metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) yang akan dilampirkan ke dokumen.
* `charset`: sebuah string. Menentukan setelan karakter yang akan digunakan dokumen. Nilai yang valid hanyalah `"utf-8"`.
* `httpEquiv`: sebuah string. Menentukan direktif dalam memproses dokumen.
* `itemProp`: sebuah string. Menentukan metadata tentang item tertentu dalam dokumen, bukan dokumen secara keseluruhan.
* `content`: sebuah string. Menentukan metadata yang akan dilampirkan saat digunakan dengan *props* `name` atau `itemProp` atau perilaku direktif saat digunakan dengan *prop* `httpEquiv`.

#### Perilaku khusus pe-*render*-an {/*special-rendering-behavior*/}

React akan selalu menempatkan elemen DOM yang terkait dengan komponen `<meta>` di dalam `<head>` dokumen, di mana pun elemen tersebut di-*render* di pohon React. Hanyalah `<head>`tempat yang valid untuk meletakkan `<meta>` di dalam DOM, namun tetap cocok dan membuat semuanya tetap dapat disusun jika komponen yang mewakili halaman tertentu dapat me-*render* komponen `<meta>` itu sendiri.

Ada satu pengecualian: jika komponen `<meta>` memiliki sebuah *prop* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), maka tidak ada perilaku khusus, karena dalam hal ini komponen tersebut tidak mewakili metadata tentang dokumen, melainkan metadata tentang bagian tertentu dari halaman.

---

## Penggunaan {/*usage*/}

### Menandai dokumen dengan metadata {/*annotating-the-document-with-metadata*/}

Anda dapat memberikan keterangan dokumen dengan metadata seperti kata kunci, ringkasan, atau nama pembuat. React akan menempatkan metadata ini di dalam dokumen `<head>` terlepas dari di mana metadata tersebut di-*render* di pohon React.

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

Anda dapat me-*render* komponen `<meta>` dari komponen mana pun. React akan meletakkan simpul DOM `<meta>` tersebut di dalam dokumen `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function SiteMapPage() {
  return (
    <ShowRenderedHTML>
      <meta name="keywords" content="React" />
      <meta name="description" content="A site map for the React website" />
      <h1>Site Map</h1>
      <p>...</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Menandai item tertentu di dalam dokumen dengan metadata {/*annotating-specific-items-within-the-document-with-metadata*/}

Anda dapat menggunakan komponen `<meta>` dengan *prop* `itemProp` untuk memberi anotasi pada item tertentu dalam dokumen dengan metadata. Dalam hal ini, React tidak akan menempatkan anotasi ini di dalam dokumen `<head>`, melainkan akan menempatkannya seperti komponen React lainnya.

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
