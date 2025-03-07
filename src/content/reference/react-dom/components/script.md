---
script: "<script>"
canary: true
---

<Canary>

Ekstensi React untuk `<script>` saat ini hanya tersedia di kanal *canary* dan eksperimental React. Dalam rilis stabil React, `<script>` berfungsi sebagai [komponen HTML browser bawaan](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [kanal rilis React di sini.](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[Komponen `<script>` bawaan browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) memungkinkan Anda menambahkan *script* di dokumen anda.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<script>` {/*script*/}

Untuk menambahkan *script* eksternal atau sisipan pada document, render [komponen bawaan `<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Anda bisa merender `<script>` dari komponen apapun dan React [dalam kasus tertentu](#special-rendering-behavior) akan menempatkan elemen DOM yang sesuai isi di kepala dokumen dan menghapus *script* duplikat yang identik.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Lihat contoh lainnya di bawah.](#usage)

#### Props {/*props*/}

`<script>` mendukung segala [props elemen umum.](/reference/react-dom/components/common#props)

Seharusnya memiliki *salah satu* props `children` atau `src`.

* `children`: sebuah string. Sumber kode *script* sisipan.
* `src`: sebuah string. URL dari eksternal *script*.

Props lain yang didukung:

* `async`: sebuah boolean. Mengizinkan browser menunda eksekusi *script* hingga seluruh dokumen telah diproses — perilaku yang lebih baik untuk performa.
*  `crossOrigin`: sebuah string. [Aturan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang memungkinkan adalah `anonymous` dan `use-credentials`.
* `fetchPriority`: sebuah string. Memungkinkan browser memberikan peringkat *script* pada prioritas saat mengambil beberapa *script* secara bersamaan. Dapat berupa `"high"`, `"low"`, atau `"auto"` (nilai bawaan).
* `integrity`: sebuah string. Hash kriptografi dari *script*, untuk [memverifikasi keaslian](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: sebuah boolean. Menonaktifkan *script* di browser yang mendukung modul ES — memungkinkan *script* cadangan untuk browser yang tidak mendukungnya.
* `nonce`: sebuah string. Kriptografi [nonce untuk mengizinkan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) saat menggunakan sebuah aturan yang ketat mengenai Content Security.
* `referrer`: sebuah string. Mengatakan [apa kepala Referer yang mau dikirim](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) saat mengambil *script* dan sumber daya apa pun yang diambil oleh *script* secara bergantian.
* `type`: sebuah string. Apakah script ini merupakan[*script* klasik, modul ES, or *import map*](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props yang menonaktifkan [perlakuan khusus pada *script*](#special-rendering-behavior) React:

* `onError`: sebuah fungsi. Dipanggil saat *script* gagal dimuat.
* `onLoad`: sebuah fungsi. Dipanggil saat *script* telah berhasil dimuat.

Props yang **tidak direkomendasikan** untuk digunakan di React:

* `blocking`: sebuah string. Jika dipasang ke `"render"`, memerintahkan browser untuk tidak merender halaman sampai lembar *script* dimuat. React memberikan kontrol yang lebih halus menggunakan Suspense.
* `defer`: sebuah string. Mencegah browser menjalankan *script* hingga dokumen selesai dimuat. Tidak kompatibel dengan komponen yang dirender oleh *server streaming*. Gunakan prop `async` sebagai gantinya.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React dapat memindahkan komponen `<script>` ke `<head>` dokumen dan menghapus *script* duplikat yang identik.

Untuk mengikuti perilaku ini, berikan props `src` dan `async={true}`. React akan menghapus *script* duplikat jika skrip tersebut memiliki `src` yang sama. Prop `async` harus memiliki nilai *true* agar *script* dapat dipindahkan dengan aman.

Perlakuan khusus ini disertai dengan dua peringatan:

* React akan mengabaikan perubahan pada props setelah *script* dirender. (React akan mengeluarkan peringatan dalam pengembangan jika ini terjadi.)
* React mungkin meninggalkan *script* di DOM bahkan setelah komponen yang merendernya telah dilepas. (Ini tidak berpengaruh karena *script* hanya dijalankan satu kali ketika dimasukkan ke dalam DOM.)

---

## Penggunaan {/*usage*/}

### Merender *script* eksternal {/*rendering-an-external-script*/}

Jika suatu komponen bergantung pada *script* tertentu agar dapat ditampilkan dengan benar, Anda dapat merender `<script>` di dalam komponen tersebut.
Namun, komponen mungkin di-*commit* sebelum *script* selesai dimuat.
Anda dapat mulai bergantung pada konten *script* setelah acara `load` diaktifkan, mis. dengan menggunakan prop `onLoad`.

React akan menghapus *script* duplikat yang memiliki `src` yang sama, hanya memasukkan salah satu *script* tersebut ke dalam DOM meskipun beberapa komponen merendernya.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Map({lat, long}) {
  return (
    <>
      <script async src="map-api.js" onLoad={() => console.log('script loaded')} />
      <div id="map" data-lat={lat} data-long={long} />
    </>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <Map />
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>

<Note>
Saat Anda ingin menggunakan *script*, akan bermanfaat jika memanggil fungsi [preinit](/reference/react-dom/preinit). Memanggil fungsi ini memungkinkan browser untuk mulai mengambil *script* lebih awal dibandingkan jika Anda hanya merender komponen `<script>`, misalnya dengan mengirimkan [respons Early Hints HTTP](https://developer.mozilla.org/en-US/dokumen/Web/HTTP/Status/103).
</Note>

### Merender *script* sisipan {/*rendering-an-inline-script*/}

Untuk menyertakan *script sisipan*, render komponen `<script>` dengan kode sumber *script* sebagai turunannya. *Script* sebaris tidak dihapus duplikatnya atau dipindahkan ke dokumen `<head>`.

<SandpackWithHTMLOutput>

```js src/App.js active
import ShowRenderedHTML from './ShowRenderedHTML.js';

function Tracking() {
  return (
    <script>
      ga('send', 'pageview');
    </script>
  );
}

export default function Page() {
  return (
    <ShowRenderedHTML>
      <h1>My Website</h1>
      <Tracking />
      <p>Welcome</p>
    </ShowRenderedHTML>
  );
}
```

</SandpackWithHTMLOutput>
