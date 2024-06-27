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

## Reference {/*reference*/}

### `<meta>` {/*meta*/}

Untuk menambahkan metadata dokumen, *render* komponen HTML bawaan `<meta>`. Anda dapat me-*render* `<meta>` dari komponen apa pun dan React akan selalu menempatkan elemen DOM yang sesuai di `<head>` dokumen.

```js
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
```

[Lihat contoh lebih lanjut di bawah.](#usage)

#### Props {/*props*/}

`<meta>` mendukung semua [properti elemen pada umumnya.](/reference/react-dom/components/common#props)

Elemen ini harus memiliki *setidaknya satu* dari *props* berikut: `name`, `httpEquiv`, `charset`, `itemProp`. Komponen `<meta>` akan menghasilkan hal yang berbeda tergantung dari *props* yang diberikan.

* `name`: a string. Specifies the [kind of metadata](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name) to be attached to the document. 
* `charset`: a string. Specifies the character set used by the document. The only valid value is `"utf-8"`.
* `httpEquiv`: a string. Specifies a directive for processing the document.
* `itemProp`: a string. Specifies metadata about a particular item within the document rather than the document as a whole.
* `content`: a string. Specifies the metadata to be attached when used with the `name` or `itemProp` props or the behavior of the directive when used with the `httpEquiv` prop.

#### Special rendering behavior {/*special-rendering-behavior*/}

React will always place the DOM element corresponding to the `<meta>` component within the document’s `<head>`, regardless of where in the React tree it is rendered. The `<head>` is the only valid place for `<meta>` to exist within the DOM, yet it’s convenient and keeps things composable if a component representing a specific page can render `<meta>` components itself. 

There is one exception to this: if `<meta>` has an [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop) prop, there is no special behavior, because in this case it doesn’t represent metadata about the document but rather metadata about a specific part of the page. 

---

## Usage {/*usage*/}

### Annotating the document with metadata {/*annotating-the-document-with-metadata*/}

You can annotate the document with metadata such as keywords, a summary, or the author’s name. React will place this metadata within the document `<head>` regardless of where in the React tree it is rendered. 

```html
<meta name="author" content="John Smith" />
<meta name="keywords" content="React, JavaScript, semantic markup, html" />
<meta name="description" content="API reference for the <meta> component in React DOM" />
```

You can render the `<meta>` component from any component. React will put a `<meta>` DOM node in the document `<head>`.

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

### Annotating specific items within the document with metadata {/*annotating-specific-items-within-the-document-with-metadata*/}

You can use the `<meta>` component with the `itemProp` prop to annotate specific items within the document with metadata. In this case, React will *not* place these annotations within the document `<head>` but will place them like any other React component. 

```js
<section itemScope>
  <h3>Annotating specific items</h3>
  <meta itemProp="description" content="API reference for using <meta> with itemProp" />
  <p>...</p>
</section>
```
