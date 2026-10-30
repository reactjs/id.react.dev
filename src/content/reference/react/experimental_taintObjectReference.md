---
title: experimental_taintObjectReference
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

`taintObjectReference` memungkinkan Anda mencegah instans objek tertentu dioper ke Komponen Klien (*Client Component*), seperti objek `user`.

```js
experimental_taintObjectReference(message, object);
```

Untuk mencegah pengoperan *key*, *hash*, atau token, lihat [`taintUniqueValue`](/reference/react/experimental_taintUniqueValue).

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `taintObjectReference(message, object)` {/*taintobjectreference*/}

Panggil `taintObjectReference` dengan sebuah objek untuk mendaftarkannya ke React sebagai sesuatu yang tidak boleh dioperkan ke Klien apa adanya:

```js
import {experimental_taintObjectReference} from 'react';

experimental_taintObjectReference(
  'Jangan oper SEMUA environment variables ke klien.',
  process.env
);
```

[Lihat contoh lainnya di bawah.](#usage)

#### Parameter {/*parameters*/}

* `message`: Pesan yang ingin Anda tampilkan jika objek tersebut dioper ke Komponen Klien. Pesan ini akan ditampilkan sebagai bagian dari galat (*error*) yang akan dilemparkan jika objek dioper ke Komponen Klien.

* `object`: Objek yang akan ditandai (*tainted*). Fungsi dan instans kelas dapat dioper ke `taintObjectReference` sebagai `object`. Fungsi dan kelas sebenarnya sudah diblokir agar tidak dapat dioper ke Komponen Klien, tetapi pesan galat bawaan React akan digantikan oleh pesan yang Anda tentukan di `message`. Ketika instans tertentu dari *Typed Array* dioper ke `taintObjectReference` sebagai `object`, salinan lain dari *Typed Array* tersebut tidak akan ditandai.

#### Nilai kembalian {/*returns*/}

`experimental_taintObjectReference` mengembalikan `undefined`.

#### Catatan penting {/*caveats*/}

- Membuat ulang atau mengkloning objek yang ditandai akan menghasilkan objek baru yang tidak ditandai, yang mungkin masih memuat data sensitif. Sebagai contoh, jika Anda memiliki objek `user` yang ditandai, `const userInfo = {name: user.name, ssn: user.ssn}` atau `{...user}` akan membuat objek baru yang tidak ditandai. `taintObjectReference` hanya melindungi dari kesalahan sederhana saat objek dioperkan langsung ke Komponen Klien tanpa perubahan.

<Pitfall>

**Jangan hanya bergantung pada penandaan (*tainting*) untuk keamanan.** Menandai sebuah objek tidak mencegah kebocoran dari setiap kemungkinan nilai turunan. Sebagai contoh, kloning dari objek yang ditandai akan membuat objek baru yang tidak ditandai. Menggunakan data dari objek yang ditandai (misalnya `{secret: taintedObj.secret}`) akan membuat nilai atau objek baru yang tidak ditandai. Penandaan (*tainting*) hanyalah satu lapisan perlindungan; aplikasi yang aman akan memiliki beberapa lapisan perlindungan, API yang dirancang dengan baik, serta pola isolasi.

</Pitfall>

---

## Penggunaan {/*usage*/}

### Mencegah data pengguna mencapai klien secara tidak sengaja {/*prevent-user-data-from-unintentionally-reaching-the-client*/}

Komponen Klien seharusnya tidak pernah menerima objek yang memuat data sensitif. Idealnya, fungsi pengambilan data (*data fetching*) tidak boleh mengekspos data yang tidak berhak diakses oleh pengguna saat ini. Terkadang kesalahan terjadi selama proses *refactoring*. Untuk melindungi dari kesalahan semacam ini di kemudian hari, kita dapat "menandai" (*taint*) objek pengguna pada API data kita.

```js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Jangan oper seluruh objek user ke klien. ' +
      'Alih-alih, pilihlah properti spesifik yang Anda butuhkan untuk kasus penggunaan ini.',
    user,
  );
  return user;
}
```

Sekarang, setiap kali ada yang mencoba mengoper objek ini ke Komponen Klien, galat akan dilemparkan beserta pesan galat yang telah Anda tentukan.

<DeepDive>

#### Melindungi dari kebocoran saat pengambilan data {/*protecting-against-leaks-in-data-fetching*/}

Jika Anda menjalankan lingkungan Komponen Server yang memiliki akses ke data sensitif, Anda harus berhati-hati untuk tidak mengoper objek secara langsung:

```js
// api.js
export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  return user;
}
```

```js
import { getUser } from 'api.js';
import { InfoCard } from 'components.js';

export async function Profile(props) {
  const user = await getUser(props.userId);
  // JANGAN LAKUKAN INI
  return <InfoCard user={user} />;
}
```

```js
// components.js
"use client";

export async function InfoCard({ user }) {
  return <div>{user.name}</div>;
}
```

Idealnya, fungsi `getUser` tidak boleh mengekspos data yang tidak berhak diakses oleh pengguna saat ini. Untuk mencegah pengoperan objek `user` ke Komponen Klien di kemudian hari, kita dapat "menandai" (*taint*) objek `user` tersebut:

```js
// api.js
import {experimental_taintObjectReference} from 'react';

export async function getUser(id) {
  const user = await db`SELECT * FROM users WHERE id = ${id}`;
  experimental_taintObjectReference(
    'Jangan oper seluruh objek user ke klien. ' +
      'Alih-alih, pilihlah properti spesifik yang Anda butuhkan untuk kasus penggunaan ini.',
    user,
  );
  return user;
}
```

Sekarang, jika ada yang mencoba mengoper objek `user` ke Komponen Klien, galat akan dilemparkan beserta pesan galat yang telah ditentukan.

</DeepDive>
