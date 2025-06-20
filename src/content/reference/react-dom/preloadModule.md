---
title: preloadModule
canary: true
---

<Canary>

Fungsi `preloadModule` saat ini hanya tersedia di saluran Canary dan eksperimental React. Pelajari lebih lanjut tentang [saluran rilis React di sini](/community/versioning-policy#all-release-channels).

</Canary>

<Note>

[Framework berbasis React](/learn/start-a-new-react-project) sering kali sudah menangani pemuatan resource untuk Anda, jadi Anda mungkin tidak perlu memanggil API ini sendiri. Lihat dokumentasi framework Anda untuk detailnya.

</Note>

<Intro>

`preloadModule` memungkinkan Anda mengambil modul ESM lebih awal yang Anda perkirakan akan digunakan.

```js
preloadModule("https://example.com/module.js", {as: "script"});
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `preloadModule(href, options)` {/*preloadmodule*/}

Untuk melakukan preload modul ESM, panggil fungsi `preloadModule` dari `react-dom`.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  // ...
}

```

[Lihat contoh lainnya di bawah.](#usage)

Fungsi `preloadModule` memberikan petunjuk kepada browser agar mulai mengunduh modul yang diberikan, sehingga dapat menghemat waktu.

#### Parameter {/*parameters*/}

* `href`: string. URL dari modul yang ingin Anda unduh.
* `options`: objek. Berisi properti berikut:
  *  `as`: string wajib. Harus bernilai `'script'`.
  *  `crossOrigin`: string. [Kebijakan CORS](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/crossorigin) yang digunakan. Nilai yang mungkin adalah `anonymous` dan `use-credentials`.
  *  `integrity`: string. Hash kriptografi dari modul, untuk [memverifikasi keasliannya](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity).
  *  `nonce`: string. [Nonce kriptografi](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) untuk mengizinkan modul saat menggunakan Content Security Policy yang ketat.


#### Return {/*returns*/}

`preloadModule` tidak mengembalikan apa pun.

#### Catatan Khusus {/*caveats*/}

* Memanggil `preloadModule` beberapa kali dengan `href` yang sama akan memberikan efek yang sama seperti satu kali pemanggilan.
* Di browser, Anda dapat memanggil `preloadModule` dalam situasi apa pun: saat merender komponen, di Effect, di event handler, dan sebagainya.
* Pada server-side rendering atau saat merender Server Components, `preloadModule` hanya akan berpengaruh jika Anda memanggilnya saat merender komponen atau dalam konteks async yang berasal dari proses render komponen. Pemanggilan di luar itu akan diabaikan.

---

## Penggunaan {/*usage*/}

### Preload saat merender {/*preloading-when-rendering*/}

Panggil `preloadModule` saat merender komponen jika Anda tahu bahwa komponen tersebut atau turunannya akan menggunakan modul tertentu.

```js
import { preloadModule } from 'react-dom';

function AppRoot() {
  preloadModule("https://example.com/module.js", {as: "script"});
  return ...;
}
```

Jika Anda ingin browser langsung mengeksekusi modul (bukan hanya mengunduhnya), gunakan [`preinitModule`](/reference/react-dom/preinitModule). Jika Anda ingin memuat skrip yang bukan modul ESM, gunakan [`preload`](/reference/react-dom/preload).

### Preload di event handler {/*preloading-in-an-event-handler*/}

Panggil `preloadModule` di event handler sebelum berpindah ke halaman atau state di mana modul tersebut akan dibutuhkan. Ini akan memulai proses lebih awal dibandingkan jika Anda memanggilnya saat merender halaman atau state baru.

```js
import { preloadModule } from 'react-dom';

function CallToAction() {
  const onClick = () => {
    preloadModule("https://example.com/module.js", {as: "script"});
    startWizard();
  }
  return (
    <button onClick={onClick}>Mulai Wizard</button>
  );
}
```
