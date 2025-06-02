---
title: startTransition
---

<Intro>

<<<<<<< HEAD
`startTransition` memungkinkan Anda memperbarui sebuah *state* tanpa memblokir proses *rendering* pada UI.
=======
`startTransition` lets you render a part of the UI in the background.
>>>>>>> 3ee3a60a1bcc687c0b87039a3a6582e3b1d6887c

```js
startTransition(action)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `startTransition(action)` {/*starttransition*/}

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

<<<<<<< HEAD
* `scope`: Fungsi yang memperbarui sebuah *state* dengan memanggil satu atau lebih [fungsi `set`.](/reference/react/useState#setstate) React segera memanggil `scope` tanpa parameter apa pun dan menandai seluruh pembaruan *state* yang berada di dalam fungsi `scope` sebagai transisi. Mereka akan bersifat [*non-blocking*](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator pemuatan.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
=======
* `action`: A function that updates some state by calling one or more [`set` functions](/reference/react/useState#setstate). React calls `action` immediately with no parameters and marks all state updates scheduled synchronously during the `action` function call as Transitions. Any async calls awaited in the `action` will be included in the transition, but currently require wrapping any `set` functions after the `await` in an additional `startTransition` (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). State updates marked as Transitions will be [non-blocking](#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators).
>>>>>>> 3ee3a60a1bcc687c0b87039a3a6582e3b1d6887c

#### Nilai Balik {/*returns*/}

`startTransition` tidak memiliki nilai balik apa pun.

#### Caveats {/*caveats*/}

* `startTransition` tidak menyediakan penanda untuk mengetahui apakah sebuah transisi sedang *pending* atau tidak. Untuk menampilkan indikator *pending* ketika sebuah transisi sedang berjalan, Anda dapat menggunakan [`useTransition`.](/reference/react/useTransition)

* Anda hanya dapat menempatkan pembaruan *state* ke dalam transisi bila Anda memiliki akses terhadap fungsi `set` dari *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai respons terhadap sebuah *prop* atau nilai balik sebuah *custom Hook*, cobalah menggunakan [`useDeferredValue`.](/reference/react/useDeferredValue)

<<<<<<< HEAD
* Fungsi yang Anda tempatkan di dalam `startTransition` harus merupakan fungsi sinkronus. React langsung mengeksekusi fungsi ini dan menandai seluruh pembaruan *state* yang terjadi sembari eksekusi sedang berjalan sebagai sebuah transisi. Apabila Anda mencoba melakukan pembaruan *state* pada waktu lain (misalnya dalam sebuah *timeout*), mereka tak akan ditandai sebagai transisi.
=======
* The function you pass to `startTransition` is called immediately, marking all state updates that happen while it executes as Transitions. If you try to perform state updates in a `setTimeout`, for example, they won't be marked as Transitions.

* You must wrap any state updates after any async requests in another `startTransition` to mark them as Transitions. This is a known limitation that we will fix in the future (see [Troubleshooting](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).
>>>>>>> 3ee3a60a1bcc687c0b87039a3a6582e3b1d6887c

* Sebuah pembaruan *state* yang ditandai sebagai transisi dapat diinterupsi oleh pembaruan *state* yang lain. Contohnya, bila Anda memperbarui sebuah komponen grafik didalam sebuah transisi, namun kemudian mengetik dalam sebuah masukan teks saat grafik tersebut masih di dalam proses *re-render*, React akan mengulangi proses *re-render* pada grafik tersebut setelah selesai melakukan pembaruan *state* dalam masukan teks tersebut.

* Pembaruan transisi tidak dapat digunakan untuk mengontrol masukan teks.

<<<<<<< HEAD
* Ketika terdapat beberapa transisi yang sedang berjalan, React akan menggabungkannya menjadi satu. Ini adalah sebuah keterbatasan yang kemungkinan besar akan diperbaiki pada rilis React selanjutnya.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that may be removed in a future release.
>>>>>>> 3ee3a60a1bcc687c0b87039a3a6582e3b1d6887c

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
