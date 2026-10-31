---
title: cacheSignal
---

<RSC>

`cacheSignal` saat ini hanya digunakan dengan [React Server Components](/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components).

</RSC>

<Intro>

`cacheSignal` memungkinkan Anda mengetahui kapan masa pakai `cache()` telah berakhir.

```js
const signal = cacheSignal();
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `cacheSignal` {/*cachesignal*/}

Panggil `cacheSignal` untuk mendapatkan `AbortSignal`.

```js {3,7}
import {cacheSignal} from 'react';
async function Component() {
  await fetch(url, { signal: cacheSignal() });
}
```

Ketika React telah selesai me-*render*, `AbortSignal` akan dibatalkan (*aborted*). Ini memungkinkan Anda membatalkan pekerjaan yang sedang berjalan (*in-flight work*) yang sudah tidak lagi diperlukan.
*Rendering* dianggap selesai ketika:
- React telah berhasil menyelesaikan *render*
- Proses *render* dibatalkan
- Proses *render* mengalami kegagalan

#### Parameter {/*parameters*/}

Fungsi ini tidak menerima parameter apa pun.

#### Nilai Kembalian {/*returns*/}

`cacheSignal` mengembalikan `AbortSignal` jika dipanggil selama proses *rendering*. Selain itu, `cacheSignal()` mengembalikan nilai `null`.

#### Peringatan {/*caveats*/}

- `cacheSignal` saat ini hanya ditujukan untuk penggunaan di dalam [React Server Components](/reference/rsc/server-components). Pada Komponen Klien (*Client Components*), fungsi ini akan selalu mengembalikan `null`. Di masa mendatang fungsi ini juga akan digunakan untuk Komponen Klien ketika *cache* klien disegarkan atau diinvalidasi. Anda sebaiknya tidak mengasumsikan nilainya akan selalu `null` di sisi klien.
- Jika dipanggil di luar proses *rendering*, `cacheSignal` akan mengembalikan `null` untuk memperjelas bahwa cakupan (*scope*) saat ini tidak di-*cache* selamanya.

---

## Penggunaan {/*usage*/}

### Membatalkan permintaan yang sedang berjalan {/*cancel-in-flight-requests*/}

Panggil <CodeStep step={1}>`cacheSignal`</CodeStep> untuk membatalkan permintaan yang sedang berlangsung.

```js [[1, 4, "cacheSignal()"]]
import {cache, cacheSignal} from 'react';
const dedupedFetch = cache(fetch);
async function Component() {
  await dedupedFetch(url, { signal: cacheSignal() });
}
```

<Pitfall>
Anda tidak dapat menggunakan `cacheSignal` untuk membatalkan pekerjaan asinkron (*async work*) yang dimulai di luar proses *rendering*, contohnya:

```js
import {cacheSignal} from 'react';
// 🚩 Jebakan: Permintaan sebenarnya tidak akan dibatalkan jika proses rendering `Component` telah selesai.
const response = fetch(url, { signal: cacheSignal() });
async function Component() {
  await response;
}
```
</Pitfall>

### Mengabaikan galat setelah React selesai me-render {/*ignore-errors-after-react-has-finished-rendering*/}

Jika sebuah fungsi melempar *error*, hal tersebut mungkin disebabkan oleh pembatalan (misalnya <CodeStep step={1}>koneksi Basis Data</CodeStep> telah ditutup). Anda dapat menggunakan <CodeStep step={2}>properti `aborted`</CodeStep> untuk memeriksa apakah galat tersebut disebabkan oleh pembatalan atau merupakan galat yang sebenarnya. Anda mungkin ingin <CodeStep step={3}>mengabaikan galat</CodeStep> yang disebabkan oleh pembatalan.

```js [[1, 2, "./database"], [2, 8, "cacheSignal()?.aborted"], [3, 12, "return null"]]
import {cacheSignal} from "react";
import {queryDatabase, logError} from "./database";

async function getData(id) {
  try {
     return await queryDatabase(id);
  } catch (x) {
     if (!cacheSignal()?.aborted) {
        // hanya catat log jika itu merupakan galat sebenarnya dan bukan karena pembatalan
       logError(x);
     }
     return null;
  }
}

async function Component({id}) {
  const data = await getData(id);
  if (data === null) {
    return <div>No data available</div>;
  }
  return <div>{data.name}</div>;
}
```
