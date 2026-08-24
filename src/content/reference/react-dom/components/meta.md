---
meta: "<meta>"
---

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

<<<<<<< HEAD
`<meta>` mendukung semua [*props* elemen pada umumnya.](/reference/react-dom/components/common#props)
=======
`<meta>` supports all [common element props.](/reference/react-dom/components/common#common-props)
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

Elemen ini harus memiliki *setidaknya satu* dari *props* berikut: `name`, `httpEquiv`, `charset`, `itemProp`. Komponen `<meta>` akan menghasilkan hal yang berbeda tergantung dari *props* yang diberikan.

<<<<<<< HEAD
* `name`: sebuah string. Menentukan [jenis dari metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) yang akan dilampirkan ke dokumen.
* `charset`: sebuah string. Menentukan setelan karakter yang akan digunakan dokumen. Nilai yang valid hanyalah `"utf-8"`.
* `httpEquiv`: sebuah string. Menentukan direktif dalam memproses dokumen.
* `itemProp`: sebuah string. Menentukan metadata tentang item tertentu dalam dokumen, bukan dokumen secara keseluruhan.
* `content`: sebuah string. Menentukan metadata yang akan dilampirkan saat digunakan dengan *props* `name` atau `itemProp` atau perilaku direktif saat digunakan dengan *prop* `httpEquiv`.
=======
* `name`: a string. Specifies the [kind of metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) to be attached to the document.
* `charset`: a string. Specifies the character set used by the document. The only valid value is `"utf-8"`.
* `httpEquiv`: a string. Specifies a directive for processing the document.
* `itemProp`: a string. Specifies metadata about a particular item within the document rather than the document as a whole.
* `content`: a string. Specifies the metadata to be attached when used with the `name` or `itemProp` props or the behavior of the directive when used with the `httpEquiv` prop.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

#### Perilaku khusus pe-*render*-an {/*special-rendering-behavior*/}

<<<<<<< HEAD
React akan selalu menempatkan elemen DOM yang terkait dengan komponen `<meta>` di dalam `<head>` dokumen, di mana pun elemen tersebut di-*render* di pohon React. Hanyalah `<head>`tempat yang valid untuk meletakkan `<meta>` di dalam DOM, namun tetap cocok dan membuat semuanya tetap dapat disusun jika komponen yang mewakili halaman tertentu dapat me-*render* komponen `<meta>` itu sendiri.

Ada satu pengecualian: jika komponen `<meta>` memiliki sebuah *prop* [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), maka tidak ada perilaku khusus, karena dalam hal ini komponen tersebut tidak mewakili metadata tentang dokumen, melainkan metadata tentang bagian tertentu dari halaman.
=======
React will always place the DOM element corresponding to the `<meta>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<meta>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render `<meta>` components itself.

There is one exception to this: if `<meta>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t represent metadata about the document but rather metadata about a specific part of the page.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

---

## Penggunaan {/*usage*/}

### Menandai dokumen dengan metadata {/*annotating-the-document-with-metadata*/}

<<<<<<< HEAD
Anda dapat memberikan keterangan dokumen dengan metadata seperti kata kunci, ringkasan, atau nama pembuat. React akan menempatkan metadata ini di dalam dokumen `<head>` terlepas dari di mana metadata tersebut di-*render* di pohon React.
=======
You can annotate the document with metadata such as keywords, a summary, or the author’s name. React will place this metadata within the document `<head>` regardless of where in the React tree it is rendered.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

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

<<<<<<< HEAD
Anda dapat menggunakan komponen `<meta>` dengan *prop* `itemProp` untuk memberi anotasi pada item tertentu dalam dokumen dengan metadata. Dalam hal ini, React tidak akan menempatkan anotasi ini di dalam dokumen `<head>`, melainkan akan menempatkannya seperti komponen React lainnya.
=======
You can use the `<meta>` component with the `itemProp` prop to annotate specific items within the document with metadata. In this case, React will *not* place these annotations within the document `<head>` but will place them like any other React component.
>>>>>>> 12d692da47e77cdc558b928fcfbaf4e71c6d0cec

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
