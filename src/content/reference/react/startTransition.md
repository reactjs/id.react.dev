---
title: startTransition
---

<Intro>

`startTransition` memungkinkan Anda memperbarui sebuah *state* tanpa memblokir proses *rendering* pada UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

Fungsi `startTransition` memungkinkan Anda menandai sebuah pembaruan *state* sebagai transisi.

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

* `scope`: Fungsi yang memperbarui sebuah *state* dengan memanggil satu atau lebih [fungsi `set`.](/reference/react/useState#setstate) React segera memanggil `scope` tanpa parameter apapun dan menandai seluruh pembaruan *state* yang berada di dalam fungsi `scope` sebagai transisi. Mereka akan bersifat [*non-blocking*](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator pemuatan.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Nilai Balik {/*returns*/}

`startTransition` tidak memiliki nilai balik apapun.

#### Caveats {/*caveats*/}

* `startTransition` tidak menyediakan penanda untuk mengetahui apakah sebuah transisi sedang *pending* atau tidak. Untuk menampilkan indikator *pending* ketika sebuah transisi sedang berjalan, Anda dapat menggunakan [`useTransition`.](/reference/react/useTransition)

* Anda hanya dapat menempatkan pembaruan *state* ke dalam transisi bila Anda memiliki akses terhadap fungsi `set` dari *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai respons terhadap sebuah *prop* atau nilai balik sebuah *custom Hook*, cobalah menggunakan [`useDeferredValue`.](/reference/react/useDeferredValue)

* Fungsi yang Anda tempatkan di dalam `startTransition` harus merupakan fungsi sinkronus. React langsung mengeksekusi fungsi ini dan menandai seluruh pembaruan *state* yang terjadi sembari eksekusi sedang berjalan sebagai sebuah transisi. Apabila Anda mencoba melakukan pembaruan *state* pada waktu lain (misalnya dalam sebuah *timeout*), mereka tak akan ditandai sebagai transisi.

* Sebuah pembaruan *state* yang ditandai sebagai transisi dapat diinterupsi oleh pembaruan *state* yang lain. Contohnya, bila Anda memperbarui sebuah komponen grafik didalam sebuah transisi, namun kemudian mengetik dalam sebuah masukan teks saat grafik tersebut masih di dalam proses *re-render*, React akan mengulangi proses *re-render* pada grafik tersebut setelah selesai melakukan pembaruan *state* dalam masukan teks tersebut.

* Pembaruan transisi tidak dapat digunakan untuk mengontrol masukan teks.

* Ketika terdapat beberapa transisi yang sedang berjalan, React akan menggabungkannya menjadi satu. Ini adalah sebuah keterbatasan yang kemungkinan besar akan diperbaiki pada rilis React selanjutnya.

---

## Penggunaan {/*usage*/}

### Menandai sebuah pembaruan *state* sebagai transisi *non-blocking* {/*marking-a-state-update-as-a-non-blocking-transition*/}

Anda dapat menandai sebuah pembaruan *state* sebagai sebuah transisi dengan memasukkannya ke dalam pemanggilan `startTransition`:

```js {7,9}
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

Transisi memungkinkan pembaruan antarmuka pengguna (*user interface*) tetap responsif, bahkan dalam gawai yang relatif lamban.

Dengan sebuah transisi, antarmuka aplikasi Anda akan tetap responsif di tengah proses *re-render*. Sebagai contoh, ketika pengguna menekan sebuah *tab* tetapi kemudian berubah pikiran dan menekan *tab* lain, mereka dapat tetap melakukannya tanpa perlu menunggu proses *re-render* pertama untuk selesai.

<Note>

`startTransition` hampir serupa dengan [`useTransition`](/reference/react/useTransition), tetapi dengan perbedaan bahwa ia tidak memiliki penanda `isPending` untuk memberi tahu apakah sebuah transisi sedang berjalan atau tidak. Anda dapat memanggil `startTransition` ketika `useTransition` tidak dapat digunakan dalam kondisi tertentu. Contohnya, `startTransition` dapat digunakan di luar komponen, misalnya seperti pustaka data / *data library*.

[Pelajari lebih lanjut mengenai transisi dan lihat contoh pada halaman `useTransition`.](/reference/react/useTransition)

</Note>
