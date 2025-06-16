---
title: preinit
---

<Canary>

Fungsi `preinit` saat ini hanya tersedia di kanal Canary dan eksperimental React. Pelajari lebih lanjut tentang [kanal rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Framework berbasis React](/learn/start-a-new-react-project) sering kali menangani pemuatan sumber daya untuk Anda, jadi Anda mungkin tidak perlu memanggil API ini sendiri. Lihat dokumentasi framework Anda untuk detailnya.

</Note>

<Intro>

`preinit` memungkinkan Anda mengambil dan mengevaluasi *stylesheet* atau skrip eksternal dengan cepat.

```js
preinit("https://example.com/script.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `preinit(href, options)` {/*preinit*/}

Untuk melakukan inisialisasi terhadap sebuah skrip atau *stylesheet*, panggil fungsi `preinit` dari `react-dom`.

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  // ...
}

```

[Lihat contoh lainnya di bawah ini.](#usage)

Fungsi `preinit` memberikan petunjuk kepada browser bahwa untuk mulai mengunduh dan mengeksekusi sumber daya yang diberikan, yang dapat menghemat waktu. Skrip yang kamu `preinit` akan dieksekusi segera setelah selesai diunduh. *Stylesheet* yang kamu `preinit` akan langsung dimasukkan ke dalam dokumen, sehingga langsung berlaku saat itu juga.

#### Parameter {/*parameters*/}

* `href`: sebuah string. URL sumber daya yang ingin Anda unduh dan jalankan.
* `options`: sebuah objek. Ini berisi properti-properti berikut:
  *  `as`: sebuah string yang wajib. Jenis sumber daya. Nilai yang dapat digunakan adalah `script` and `style`.
  * `precedence`: sebuah string. Wajib diisi untuk stylesheet. Menunjukkan di mana stylesheet akan disisipkan relatif terhadap stylesheet lainnya. Stylesheet dengan prioritas lebih tinggi dapat menimpa(override) stylesheet dengan prioritas lebih rendah. Nilai yang memungkinkan adalah: `reset`, `low`, `medium`, `high`.
  *  `crossOrigin`: sebuah string. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang akan digunakan. Nilai yang dapat digunakan adalah `anonymous` dan `use-credentials`.
  *  `integrity`: sebuah string. *Hash* kriptografi sumber daya, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: sebuah string. Sebuah [*nonce* kriptografi untuk mengizinkan sumber daya](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ketika menggunakan *Content Security Policy* yang ketat.
  *  `fetchPriority`: sebuah string. Menyarankan prioritas relatif untuk mengambil sumber daya. Nilai yang dapat digunakan adalah `auto` (default), `high`, dan `low`.

#### Kembalian {/*returns*/}

`preinit` tidak mengembalikan apa pun.

#### Peringatan {/*caveats*/}

* Beberapa pemanggilan `preinit` dengan `href` memiliki efek yang sama dengan panggilan tunggal.
* Di browser, Anda dapat memanggil `preinit` dalam situasi apa pun: saat me-*render* komponen, di *Effect*, di *event handler*, dan sebagainya.
* Dalam rendering sisi server atau saat me-render Komponen Server, `preinit` hanya memiliki efek jika Anda memanggilnya saat me-render komponen atau dalam konteks asinkronisasi yang berasal dari rendering komponen. Pemanggilan lainnya akan diabaikan.

---

## Penggunaan {/*usage*/}

### Preiniting awal saat me-render {/*preiniting-when-rendering*/}

Panggil `preinit` saat me-*render* komponen jika Anda mengetahui bahwa komponen tersebut atau anak komponennya akan menggunakan sumber daya tertentu, dan Anda setuju sumber daya tersebut langsung dievaluasi serta berlaku segera setelah selesai diunduh.

<Recipes titleText="Examples of preiniting">

#### Preiniting skrip eksternal {/*preiniting-an-external-script*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/script.js", {as: "script"});
  return ...;
}
```

Jika Anda ingin agar browser hanya mengunduh skrip tanpa langsung mengeksekusinya, gunakan [`preload`](/reference/react-dom/preload). Jika Anda ingin memuat modul ESM, gunakan [`preinitModule`](/reference/react-dom/preinitModule).

<Solution />

#### Preiniting stylesheet {/*preiniting-a-stylesheet*/}

```js
import { preinit } from 'react-dom';

function AppRoot() {
  preinit("https://example.com/style.css", {as: "style", precedence: "medium"});
  return ...;
}
```

Opsi `precedence` yang wajib diisi memungkinkan Anda mengontrol urutan stylesheet di dalam dokumen. Stylesheet dengan prioritas lebih tinggi dapat menimpa stylesheet dengan prioritas lebih rendah.

Jika Anda ingin mengunduh stylesheet tanpa langsung menyisipkannya ke dalam dokumen, gunakan [`preload`](/reference/react-dom/preload).

<Solution />

</Recipes>

### Preiniting pada event handler {/*preiniting-in-an-event-handler*/}

Panggil `preinit` dalam *event handler* sebelum bertransisi ke halaman atau state yang membutuhkan sumber daya eksternal. Hal ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat merender halaman atau state baru.

```js
import { preinit } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinit("https://example.com/wizardStyles.css", {as: "style"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
