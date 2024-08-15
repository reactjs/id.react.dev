---
script: "<script>"
canary: true
---

<Canary>

Ekestensi React untuk `<script>` saat ini hanya tersedia di canary dan saluran experiment React. Dalam rilis stabil React, `<script>` berfungsi sebagai [komponen HTML browser bawaan](https://react.dev/reference/react-dom/components#all-html-components). Pelajari lebih lanjut tentang [saluran rilis React di sini.](/community/versioning-policy#all-release-channels).

</Canary>

<Intro>

[Komponen `<script>` bawaan browser](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script) memungkinkan Anda menambahkan skrip di dokumen anda.

```js
<script> alert("hi!") </script>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<script>` {/*script*/}

Untuk menambahkan eksternal atau sisipan skrip pada document, render [komponen bawaan `<script>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script). Kamu bisa render `<script>` dari komponen apapun dan React [dalam kasus tertentu](#special-rendering-behavior) akan menempatkan elemen DOM yang sesuai isi di kepala dokumen dan menghapus duplikat skrip yang identik.

```js
<script> alert("hi!") </script>
<script src="script.js" />
```

[Lihat contoh lainnya di bawah.](#usage)

#### Props {/*props*/}

`<script>` mendukung segala [props elemen umum.](/reference/react-dom/components/common#props)

Seharusnya memiliki *salah satu* `children` atau `src` prop.

* `children`: sebuah string. Sumber kode skrip sisipan.
* `src`: sebuah string. URL dari eksternal skrip.

props lain yang didukung:

* `async`: sebuah boolean. Mengizinkan browser menunda eksekusi skrip hingga seluruh dokumen telah diproses — perilaku yang lebih baik untuk performa.
*  `crossOrigin`: sebuah string. [aturan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang memungkinkan adalah `anonymous` dan `use-credentials`.
* `fetchPriority`: sebuah string. Memungkinkan browser memberikan peringkat skrip pada prioritas saat mengambil beberapa skrip secara bersamaan. Dapat berupa `"high"`, `"low"`, atau `"auto"` (nilai bawaan).
* `integrity`: sebuah string. Hash kriptografi dari skrip, untuk [memverifikasi keaslian](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
* `noModule`: sebuah boolean. Menonaktifkan skrip di browser yang mendukung modul ES — memungkinkan skrip cadangan untuk browser yang tidak mendukungnya.
* `nonce`: sebuah string. Kriptografi [nonce untuk mengizinkan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) saat menggunakan sebuah aturan yang ketat mengenai Content Security.
* `referrer`: sebuah string. Mengatakan [apa kepala Referer yang mau dikirim](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#referrerpolicy) saat mengambil skrip dan sumber daya apa pun yang diambil oleh skrip secara bergantian.
* `type`: sebuah string. Apakah script ini merupakan[klasik skrip, modul ES, or import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type).

Props yang menonaktifkan [perlakuan khusus pada skrip](#special-rendering-behavior) React:

* `onError`: sebuah fungsi. Dipanggil saat skrip gagal dimuat.
* `onLoad`: sebuah fungsi. Dipanggil saat skrip telah berhasil dimuat.

Props yang **tidak direkomendasikan** untuk digunakan di React:

* `blocking`: sebuah string. Jika dipasang ke `"render"`, memerintahkan browser untuk tidak merender halaman sampai lembar skrip dimuat. React memberikan kontrol yang lebih halus menggunakan Suspense.
* `defer`: sebuah string. Mencegah browser menjalankan skrip hingga dokumen selesai dimuat. Tidak kompatibel dengan komponen yang dirender oleh server streaming. Gunakan prop `async` sebagai gantinya.

#### Perilaku rendering khusus {/*special-rendering-behavior*/}

React dapat memindahkan komponen `<script>` ke `<head>` dokumen dan menghapus duplikat skrip yang identik.

Untuk ikut dalam perilaku ini, berikan props `src` dan `async={true}`. React akan menghapus duplikat skrip jika skrip tersebut memiliki `src` yang sama. Prop `async` harus benar agar skrip dapat dipindahkan dengan aman.

Perlakuan khusus ini disertai dengan dua peringatan:

* React akan mengabaikan perubahan pada props setelah skrip dirender. (React akan mengeluarkan peringatan dalam pengembangan jika ini terjadi.)
* React mungkin meninggalkan skrip di DOM bahkan setelah komponen yang merendernya telah dilepas. (Ini tidak berpengaruh karena skrip hanya dijalankan satu kali ketika dimasukkan ke dalam DOM.)

---

## Penggunaan {/*usage*/}

### Merender skrip eksternal {/*rendering-an-external-script*/}

Jika suatu komponen bergantung pada skrip tertentu agar dapat ditampilkan dengan benar, Anda dapat merender `<script>` di dalam komponen tersebut.
Namun, komponen mungkin dikomit sebelum skrip selesai dimuat.
Anda dapat mulai bergantung pada konten skrip setelah acara `load` diaktifkan, mis. dengan menggunakan prop `onLoad`.

React akan menghapus duplikat skrip yang memiliki `src` yang sama, hanya memasukkan salah satu skrip tersebut ke dalam DOM meskipun beberapa komponen merendernya.

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
Saat Anda ingin menggunakan skrip, akan bermanfaat jika memanggil fungsi [preinit](/reference/react-dom/preinit). Memanggil fungsi ini memungkinkan browser untuk mulai mengambil skrip lebih awal dibandingkan jika Anda hanya merender komponen `<script>`, misalnya dengan mengirimkan [respons Petunjuk Awal HTTP](https://developer.mozilla.org/en-AS/dokumen/Web/HTTP/Status/103).
</Note>

### Merender skrip sisipan {/*rendering-an-inline-script*/}

Untuk menyertakan skrip inline, render komponen `<script>` dengan kode sumber skrip sebagai turunannya. Skrip sebaris tidak dihapus duplikatnya atau dipindahkan ke dokumen `<head>`.

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
