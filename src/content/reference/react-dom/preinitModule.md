---
title: preinitModule
---

<Note>

[Framework berbasis React](/learn/start-a-new-react-project) sering kali menangani pemuatan sumber daya untuk Anda, jadi Anda mungkin tidak perlu memanggil API ini sendiri. Lihat dokumentasi framework Anda untuk detailnya.

</Note>

<Intro>

`preinitModule` memungkinkan Anda mengambil dan mengevaluasi modul ESM dengan mudah.

```js
preinitModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `preinitModule(href, options)` {/*preinitmodule*/}

Untuk melakukan inisialisasi terhadap sebuah modul ESM, panggil fungsi `preinitModule` dari `react-dom`.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Lihat contoh lainnya di bawah ini.](#usage)

Fungsi `preinitModule` memberikan petunjuk kepada browser bahwa untuk mulai mengunduh dan mengeksekusi modul yang diberikan, yang dapat menghemat waktu. Modul yang kamu `preinit` akan dieksekusi segera setelah selesai diunduh.

#### Parameter {/*parameters*/}

* `href`: sebuah string. URL modul yang ingin Anda unduh dan jalankan.
* `options`: sebuah objek. Ini berisi properti-properti berikut:
  *  `as`: sebuah string yang wajib. Harus berupa `'script'`.
  *  `crossOrigin`: sebuah string. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang akan digunakan. Nilai yang dapat digunakan adalah `anonymous` dan `use-credentials`.
  *  `integrity`: sebuah string. *Hash* kriptografi modul, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: sebuah string. Sebuah [*nonce* kriptografi untuk mengizinkan modul](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) ketika menggunakan *Content Security Policy* yang ketat.

#### Kembalian {/*returns*/}

`preinitModule` tidak mengembalikan apa pun.

#### Peringatan {/*caveats*/}

* Beberapa pemanggilan `preinitModule` dengan `href` memiliki efek yang sama dengan panggilan tunggal.
* Di browser, Anda dapat memanggil `preinitModule` dalam situasi apa pun: saat me-*render* komponen, di *Effect*, di *event handler*, dan sebagainya.
* Dalam rendering sisi server atau saat me-render Komponen Server, `preinitModule` hanya memiliki efek jika Anda memanggilnya saat me-render komponen atau dalam konteks asinkronisasi yang berasal dari rendering komponen. Pemanggilan lainnya akan diabaikan.

---

## Penggunaan {/*usage*/}

### Preloading awal saat me-render {/*preloading-when-rendering*/}

Panggil `preinitModule` saat me-*render* komponen jika Anda mengetahui bahwa komponen tersebut atau anak komponennya akan menggunakan modul tertentu dan Anda setuju modul tersebut langsung dievaluasi serta berlaku segera setelah selesai diunduh.

```js
import { preinitModule } from 'react-dom';

function AppRoot() {
  preinitModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Jika Anda ingin agar browser hanya mengunduh modul tanpa langsung mengeksekusinya, gunakan [`preloadModule`](/reference/react-dom/preloadModule). Jika Anda ingin melakukan preinit skrip yang bukan modul ESM, gunakan [`preinit`](/reference/react-dom/preinit).

### Preloading pada event handler {/*preloading-in-an-event-handler*/}

Panggil `preinitModule` dalam *event handler* sebelum bertransisi ke halaman atau state yang membutuhkan modul. Hal ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat merender halaman atau state baru.

```js
import { preinitModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preinitModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Start Wizard</button>
  );
}
```
