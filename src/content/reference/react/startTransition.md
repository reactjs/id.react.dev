---
title: startTransition
---

<Intro>

`startTransition` memungkinkan Anda merender bagian UI di latar belakang.

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

* `action`: Fungsi yang memperbarui beberapa *state* dengan memanggil satu atau beberapa fungsi [`set`](/reference/react/useState#setstate). React memanggil `action` segera tanpa parameter dan menandai semua pembaruan *state* yang dijadwalkan secara sinkron selama panggilan fungsi `action` sebagai Transisi. Semua panggilan asinkron yang ditunggu dalam `action` akan disertakan dalam transisi, tetapi saat ini memerlukan pembungkusan semua fungsi `set` setelah `await` dalam `startTransition` tambahan (lihat [Pemecahan Masalah](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)). Pembaruan *state* yang ditandai sebagai Transisi akan menjadi [*non-blocking*](#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator pemuatan yang tidak diinginkan.](/reference/react/useTransition#preventing-unwanted-loading-indicators).

#### Kembalian {/*returns*/}

`startTransition` tidak mengembalikan apa pun.

#### Catatan Penting {/*caveats*/}

* `startTransition` tidak menyediakan penanda untuk mengetahui apakah sebuah transisi sedang *pending* atau tidak. Untuk menampilkan indikator *pending* ketika sebuah transisi sedang berjalan, Anda dapat menggunakan [`useTransition`.](/reference/react/useTransition)

* Anda hanya dapat menempatkan pembaruan *state* ke dalam transisi bila Anda memiliki akses terhadap fungsi `set` dari *state* tersebut. Jika Anda ingin memulai sebuah transisi sebagai respons terhadap sebuah *prop* atau nilai balik sebuah *custom Hook*, cobalah menggunakan [`useDeferredValue`.](/reference/react/useDeferredValue)

* Fungsi yang Anda teruskan ke `startTransition` dipanggil segera, menandai semua pembaruan status yang terjadi saat dijalankan sebagai Transisi. Jika Anda mencoba melakukan pembaruan status dalam `setTimeout`, misalnya, pembaruan tersebut tidak akan ditandai sebagai Transisi.

* Anda harus membungkus pembaruan status apa pun setelah permintaan async apa pun dalam `startTransition` lain untuk menandainya sebagai Transisi. Ini adalah batasan yang diketahui yang akan kami perbaiki di masa mendatang (lihat [Pemecahan Masalah](/reference/react/useTransition#react-doesnt-treat-my-state-update-after-await-as-a-transition)).

* Sebuah pembaruan *state* yang ditandai sebagai transisi dapat diinterupsi oleh pembaruan *state* yang lain. Contohnya, bila Anda memperbarui sebuah komponen grafik didalam sebuah transisi, namun kemudian mengetik dalam sebuah masukan teks saat grafik tersebut masih di dalam proses *re-render*, React akan mengulangi proses *re-render* pada grafik tersebut setelah selesai melakukan pembaruan *state* dalam masukan teks tersebut.

* Pembaruan transisi tidak dapat digunakan untuk mengontrol masukan teks.

* Ketika terdapat beberapa transisi yang sedang berjalan, React akan menggabungkannya menjadi satu. Ini adalah sebuah keterbatasan yang kemungkinan besar akan dihapus pada rilis React selanjutnya.

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
