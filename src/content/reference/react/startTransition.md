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

<<<<<<< HEAD
Fungsi `startTransition` memungkinkan Anda menandai sebuah pembaruan *state* sebagai transisi.
=======
The `startTransition` function lets you mark a state update as a Transition.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

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
* `scope`: A function that updates some state by calling one or more [`set` functions.](/reference/react/useState#setstate) React immediately calls `scope` with no arguments and marks all state updates scheduled synchronously during the `scope` function call as Transitions. They will be [non-blocking](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) and [will not display unwanted loading indicators.](/reference/react/useTransition#preventing-unwanted-loading-indicators)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

#### Nilai Balik {/*returns*/}

`startTransition` tidak memiliki nilai balik apa pun.

#### Caveats {/*caveats*/}

<<<<<<< HEAD
* `startTransition` tidak menyediakan penanda untuk mengetahui apakah sebuah transisi sedang *pending* atau tidak. Untuk menampilkan indikator *pending* ketika sebuah transisi sedang berjalan, Anda dapat menggunakan [`useTransition`.](/reference/react/useTransition)

* Anda hanya dapat menempatkan pembaruan *state* ke dalam transisi bila Anda memiliki akses terhadap fungsi `set` dari *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai respons terhadap sebuah *prop* atau nilai balik sebuah *custom Hook*, cobalah menggunakan [`useDeferredValue`.](/reference/react/useDeferredValue)

* Fungsi yang Anda tempatkan di dalam `startTransition` harus merupakan fungsi sinkronus. React langsung mengeksekusi fungsi ini dan menandai seluruh pembaruan *state* yang terjadi sembari eksekusi sedang berjalan sebagai sebuah transisi. Apabila Anda mencoba melakukan pembaruan *state* pada waktu lain (misalnya dalam sebuah *timeout*), mereka tak akan ditandai sebagai transisi.

* Sebuah pembaruan *state* yang ditandai sebagai transisi dapat diinterupsi oleh pembaruan *state* yang lain. Contohnya, bila Anda memperbarui sebuah komponen grafik didalam sebuah transisi, namun kemudian mengetik dalam sebuah masukan teks saat grafik tersebut masih di dalam proses *re-render*, React akan mengulangi proses *re-render* pada grafik tersebut setelah selesai melakukan pembaruan *state* dalam masukan teks tersebut.
=======
* `startTransition` does not provide a way to track whether a Transition is pending. To show a pending indicator while the Transition is ongoing, you need [`useTransition`](/reference/react/useTransition) instead.

* You can wrap an update into a Transition only if you have access to the `set` function of that state. If you want to start a Transition in response to some prop or a custom Hook return value, try [`useDeferredValue`](/reference/react/useDeferredValue) instead.

* The function you pass to `startTransition` must be synchronous. React immediately executes this function, marking all state updates that happen while it executes as Transitions. If you try to perform more state updates later (for example, in a timeout), they won't be marked as Transitions.

* A state update marked as a Transition will be interrupted by other state updates. For example, if you update a chart component inside a Transition, but then start typing into an input while the chart is in the middle of a re-render, React will restart the rendering work on the chart component after handling the input state update.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

* Pembaruan transisi tidak dapat digunakan untuk mengontrol masukan teks.

<<<<<<< HEAD
* Ketika terdapat beberapa transisi yang sedang berjalan, React akan menggabungkannya menjadi satu. Ini adalah sebuah keterbatasan yang kemungkinan besar akan diperbaiki pada rilis React selanjutnya.
=======
* If there are multiple ongoing Transitions, React currently batches them together. This is a limitation that will likely be removed in a future release.
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

---

## Penggunaan {/*usage*/}

<<<<<<< HEAD
### Menandai sebuah pembaruan *state* sebagai transisi *non-blocking* {/*marking-a-state-update-as-a-non-blocking-transition*/}

Anda dapat menandai sebuah pembaruan *state* sebagai sebuah transisi dengan memasukkannya ke dalam pemanggilan `startTransition`:
=======
### Marking a state update as a non-blocking Transition {/*marking-a-state-update-as-a-non-blocking-transition*/}

You can mark a state update as a *Transition* by wrapping it in a `startTransition` call:
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

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

<<<<<<< HEAD
Dengan sebuah transisi, antarmuka aplikasi Anda akan tetap responsif di tengah proses *re-render*. Sebagai contoh, ketika pengguna menekan sebuah *tab* tetapi kemudian berubah pikiran dan menekan *tab* lain, mereka dapat tetap melakukannya tanpa perlu menunggu proses *re-render* pertama untuk selesai.

<Note>

`startTransition` hampir serupa dengan [`useTransition`](/reference/react/useTransition), tetapi dengan perbedaan bahwa ia tidak memiliki penanda `isPending` untuk memberi tahu apakah sebuah transisi sedang berjalan atau tidak. Anda dapat memanggil `startTransition` ketika `useTransition` tidak dapat digunakan dalam kondisi tertentu. Contohnya, `startTransition` dapat digunakan di luar komponen, misalnya seperti pustaka data / *data library*.

[Pelajari lebih lanjut mengenai transisi dan lihat contoh pada halaman `useTransition`.](/reference/react/useTransition)
=======
With a Transition, your UI stays responsive in the middle of a re-render. For example, if the user clicks a tab but then change their mind and click another tab, they can do that without waiting for the first re-render to finish.

<Note>

`startTransition` is very similar to [`useTransition`](/reference/react/useTransition), except that it does not provide the `isPending` flag to track whether a Transition is ongoing. You can call `startTransition` when `useTransition` is not available. For example, `startTransition` works outside components, such as from a data library.

[Learn about Transitions and see examples on the `useTransition` page.](/reference/react/useTransition)
>>>>>>> 97489434323b0c4cce78588cd0f48e3808e0eba4

</Note>
