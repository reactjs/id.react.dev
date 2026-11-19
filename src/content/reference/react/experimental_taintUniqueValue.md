---
title: experimental_taintUniqueValue
version: experimental
---

<Experimental>

**API ini bersifat eksperimental dan belum tersedia dalam versi React yang stabil.**

Anda dapat mencobanya dengan memperbarui *package* React ke versi eksperimental terbaru:

- `react@experimental`
- `react-dom@experimental`
- `eslint-plugin-react-hooks@experimental`

Versi eksperimental React mungkin mengandung bug. Jangan menggunakannya dalam produksi.

API ini hanya tersedia di dalam [Komponen Server React](/reference/rsc/use-client).

</Experimental>


<Intro>

`taintUniqueValue` memungkinkan Anda mencegah nilai-nilai unik, seperti kata sandi, *key*, atau token, dioper ke Komponen Klien (*Client Component*).

```js
taintUniqueValue(errMessage, lifetime, value)
```

Untuk mencegah pengoperan objek yang berisi data sensitif, lihat [`taintObjectReference`](/reference/react/experimental_taintObjectReference).

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `taintUniqueValue(message, lifetime, value)` {/*taintuniquevalue*/}

Panggil `taintUniqueValue` dengan kata sandi, token, *key*, atau *hash* untuk mendaftarkannya ke React sebagai sesuatu yang tidak boleh dioper ke Klien apa adanya:

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Jangan oper secret key ke klien.',
  process,
  process.env.SECRET_KEY
);
```

[Lihat contoh lainnya di bawah.](#usage)

#### Parameter {/*parameters*/}

* `message`: Pesan yang ingin Anda tampilkan jika `value` dioper ke Komponen Klien. Pesan ini akan ditampilkan sebagai bagian dari galat (*error*) yang akan dilemparkan jika `value` dioper ke Komponen Klien.

* `lifetime`: Objek apa pun yang menunjukkan berapa lama `value` harus ditandai (*tainted*). `value` akan diblokir agar tidak dikirim ke Komponen Klien mana pun selama objek ini masih ada. Sebagai contoh, mengoper `globalThis` akan memblokir nilai tersebut sepanjang masa hidup aplikasi. `lifetime` biasanya berupa objek yang salah satu propertinya berisi `value`.

* `value`: Sebuah *string*, *bigint*, atau *TypedArray*. `value` harus berupa rangkaian karakter atau *byte* unik dengan entropi tinggi, seperti token kriptografi, kunci privat (*private key*), *hash*, atau kata sandi yang panjang. `value` akan diblokir agar tidak dikirim ke Komponen Klien mana pun.

#### Kembalian {/*returns*/}

`experimental_taintUniqueValue` mengembalikan `undefined`.

#### Catatan penting {/*caveats*/}

* Membuat nilai baru dari nilai yang ditandai dapat melemahkan perlindungan penandaan. Nilai baru yang dibuat dengan mengubah nilai yang ditandai menjadi huruf kapital, menggabungkan *string* yang ditandai ke dalam *string* yang lebih panjang, mengonversi nilai yang ditandai ke base64, mengambil *substring* dari nilai yang ditandai, atau transformasi serupa lainnya tidak akan ikut ditandai, kecuali Anda secara eksplisit memanggil `taintUniqueValue` pada nilai-nilai baru tersebut.
* Jangan gunakan `taintUniqueValue` untuk melindungi nilai berentropi rendah seperti kode PIN atau nomor telepon. Jika ada nilai dalam suatu permintaan (*request*) yang dikendalikan oleh penyerang, mereka dapat menebak nilai mana yang ditandai dengan mencoba satu per satu semua kemungkinan nilai rahasia tersebut.

---

## Penggunaan {/*usage*/}

### Mencegah token dioper ke Komponen Klien {/*prevent-a-token-from-being-passed-to-client-components*/}

Agar informasi sensitif seperti kata sandi, token sesi, atau nilai unik lainnya tidak ikut teroper ke Komponen Klien tanpa disengaja, fungsi `taintUniqueValue` menyediakan sebuah lapisan perlindungan. Ketika sebuah nilai ditandai, setiap upaya untuk mengopernya ke Komponen Klien akan menghasilkan galat.

Argumen `lifetime` menentukan berapa lama nilai tersebut tetap ditandai. Untuk nilai yang harus terus ditandai tanpa batas waktu, objek seperti [`globalThis`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis) atau `process` dapat digunakan sebagai argumen `lifetime`. Objek-objek ini memiliki masa hidup yang mencakup seluruh durasi eksekusi aplikasi Anda.

```js
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Jangan oper kata sandi pengguna ke klien.',
  globalThis,
  process.env.SECRET_KEY
);
```

Jika masa hidup nilai yang ditandai terikat pada sebuah objek, `lifetime` harus berupa objek yang mengenkapsulasi nilai tersebut. Hal ini memastikan nilai yang ditandai tetap terlindungi selama masa hidup objek yang mengenkapsulasinya.

```js
import {experimental_taintUniqueValue} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintUniqueValue(
    'Jangan oper token sesi pengguna ke klien.',
    user,
    user.session.token
  );
  return user;
}
```

Dalam contoh ini, objek `user` berperan sebagai argumen `lifetime`. Jika objek ini disimpan dalam *cache* global atau dapat diakses oleh permintaan lain, token sesi tersebut tetap ditandai.

<Pitfall>

**Jangan hanya mengandalkan penandaan (*tainting*) untuk keamanan.** Menandai sebuah nilai tidak memblokir setiap kemungkinan nilai turunannya. Sebagai contoh, membuat nilai baru dengan mengubah *string* yang ditandai menjadi huruf kapital tidak akan membuat nilai baru tersebut ikut ditandai.


```js
import {experimental_taintUniqueValue} from 'react';

const password = 'correct horse battery staple';

experimental_taintUniqueValue(
  'Jangan oper kata sandi ke klien.',
  globalThis,
  password
);

const uppercasePassword = password.toUpperCase() // `uppercasePassword` tidak ditandai
```

Dalam contoh ini, konstanta `password` ditandai. Kemudian `password` digunakan untuk membuat nilai baru `uppercasePassword` dengan memanggil *method* `toUpperCase` pada `password`. Nilai `uppercasePassword` yang baru dibuat ini tidak ditandai.

Cara serupa lainnya untuk membuat nilai baru dari nilai yang ditandai, seperti menggabungkannya ke dalam *string* yang lebih panjang, mengonversinya ke base64, atau mengambil *substring*-nya, juga menghasilkan nilai yang tidak ditandai.

Penandaan hanya melindungi dari kesalahan sederhana, seperti mengoper nilai rahasia ke klien secara eksplisit. Kesalahan dalam memanggil `taintUniqueValue`, misalnya menggunakan *store* global di luar React tanpa objek `lifetime` yang sesuai, dapat membuat nilai yang ditandai tidak lagi ditandai. Penandaan hanyalah satu lapisan perlindungan; aplikasi yang aman akan memiliki beberapa lapisan perlindungan, API yang dirancang dengan baik, serta pola isolasi.

</Pitfall>

<DeepDive>

#### Menggunakan `server-only` dan `taintUniqueValue` untuk mencegah kebocoran rahasia {/*using-server-only-and-taintuniquevalue-to-prevent-leaking-secrets*/}

Jika Anda menjalankan lingkungan Komponen Server yang memiliki akses ke kunci privat atau kata sandi, seperti kata sandi basis data, Anda harus berhati-hati agar tidak mengopernya ke Komponen Klien.

```js
export async function Dashboard(props) {
  // JANGAN LAKUKAN INI
  return <Overview password={process.env.API_PASSWORD} />;
}
```

```js
"use client";

import {useEffect} from '...'

export async function Overview({ password }) {
  useEffect(() => {
    const headers = { Authorization: password };
    fetch(url, { headers }).then(...);
  }, [password]);
  ...
}
```

Contoh ini akan membocorkan token API rahasia ke klien. Jika token API ini dapat digunakan untuk mengakses data yang seharusnya tidak boleh diakses oleh pengguna tersebut, hal ini dapat menyebabkan kebocoran data.

[comment]: <> (TODO: Link to `server-only` docs once they are written)

Idealnya, rahasia seperti ini diabstraksikan ke dalam satu *file* bantuan (*helper*) yang hanya dapat diimpor oleh utilitas data tepercaya di server. *File* bantuan tersebut bahkan dapat dilabeli dengan [`server-only`](https://www.npmjs.com/package/server-only) untuk memastikan *file* ini tidak diimpor di klien.

```js
import "server-only";

export function fetchAPI(url) {
  const headers = { Authorization: process.env.API_PASSWORD };
  return fetch(url, { headers });
}
```

Terkadang kesalahan terjadi saat penulisan ulang kode (*refactoring*), dan tidak semua rekan kerja Anda mungkin mengetahui hal ini.
Untuk melindungi dari kesalahan semacam ini di kemudian hari, kita dapat "menandai" (*taint*) kata sandi yang sebenarnya:

```js
import "server-only";
import {experimental_taintUniqueValue} from 'react';

experimental_taintUniqueValue(
  'Jangan oper kata sandi token API ke klien. ' +
    'Sebagai gantinya, lakukan semua fetch di server.'
  process,
  process.env.API_PASSWORD
);
```

Sekarang, setiap kali ada yang mencoba mengoper kata sandi ini ke Komponen Klien, atau mengirim kata sandi tersebut ke Komponen Klien melalui Fungsi Server, galat akan dilemparkan dengan pesan yang Anda tentukan saat memanggil `taintUniqueValue`.

</DeepDive>

---
