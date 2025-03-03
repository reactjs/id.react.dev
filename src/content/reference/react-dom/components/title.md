---
title: "<title>"
---

<<<<<<< HEAD
<Canary>

Ekstensi React untuk `<title>` saat ini hanya tersedia di kanal *canary* dan eksperimental React. Pada rilis stabil React, `<title>` hanya berfungsi sebagai [komponen HTML bawaan peramban](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>


=======
>>>>>>> 6326e7b1b9fa2a7e36a555792e2f1b97cfcf2669
<Intro>

[Komponen bawaan peramban `<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title) memungkinkan Anda untuk menentukan judul dari dokumen.

```js
<title>Blog Saya</title>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<title>` {/*title*/}

Untuk menentukan judul dokmen, render [komponen bawaan peramban `<title>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/title). Anda dapat me-*render* `<title>` dari komponen apapun dan React akan selalu menempatkan elemen DOM yang sesuai di *document head*.

```js
<title>Blog Saya</title>
```

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Props {/*props*/}

`<title>` mendukung semua [element props yang umum.](/reference/react-dom/components/common#props)

* `children`: `<title>` hanya menerima teks sebagai anak. Teks ini akan menjadi judul dokumen. Anda juga dapat meng-oper komponen Anda sendiri selama komponen tersebut hanya me-*render* teks.

#### Perilaku *render*-ing khusus {/*special-rendering-behavior*/}

React akan selalu menempatkan elemen DOM yang sesuai dengan komponen `<title>` di dalam `<head>` dokumen, di mana pun elemen tersebut di-*render* di pohon React. `<head>` adalah satu-satunya tempat yang valid untuk `<title>` berada dalam DOM, namun tetap mudah dan membuat segala sesuatunya tetap dapat disusun jika komponen yang mewakili laman tertentu dapat me-*render* `<title>`-nya sendiri. 

Ada dua pengecualian untuk hal ini:
* Jika `<title>` berada dalam komponen `<svg>`, maka tidak ada perilaku khusus, karena dalam konteks ini tidak mewakili judul dokumen melainkan merupakan [anotasi aksesibilitas untuk grafik SVG tersebut](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/title).
* Jika `<title>` memiliki prop [`itemProp`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/itemprop), maka tidak ada perilaku khusus, karena dalam hal ini dalam hal ini tidak mewakili judul dokumen melainkan metadata tentang bagian halaman tertentu.

<Pitfall>

Hanya *render* satu `<title>` dalam satu waktu. Jika lebih dari satu komponen me-*render* tag `<title>` secara bersamaan, React akan menempatkan semua judul tersebut di dokumen `head`. Jika hal ini terjadi, perilaku peramban dan mesin telusur tidak terdefinisi.

</Pitfall>

---

## Penggunaan {/*usage*/}

### Menyetel judul dokumen {/*set-the-document-title*/}

*Render* komponen `<title>` dari komponen apapun dengan teks sebagai anak. React akan menempatkan node DOM `<title>` di dokumen `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

export default function ContactUsPage() {
  return (
    <ShowRenderedHTML>
      <title>My Site: Contact Us</title>
      <h1>Contact Us</h1>
      <p>Email us at support@example.com</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

### Penggunaan variabel dalam title {/*use-variables-in-the-title*/}

*Children* dari komponen `<title>` harus berupa string teks tunggal. (Atau satu nomor atau satu objek dengan metode `toString`.) Ini mungkin tidak terlihat jelas, tetapi menggunakan kurung kurawal JSX seperti ini:

```js
<title>Results page {pageNumber}</title> // 🔴 Masalah: Ini bukan string tunggal
```

... sebenarnya menyebabkan komponen `<title>` mendapatkan array dua elemen sebagai turunan-nya (string `"Results page"` dan nilai `pageNumber`). Ini akan menyebabkan kesalahan. Sebagai gantinya, gunakan interpolasi string untuk meng-oper `<title>` satu string:

```js
<title>{`Results page ${pageNumber}`}</title>
```

