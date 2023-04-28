---
title: startTransition
---

<Intro>

`startTransition` memungkinkan Anda memperbarui sebuah _state_ tanpa memblokir proses _rendering_ pada UI.

```js
startTransition(scope)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `startTransition(scope)` {/*starttransitionscope*/}

Fungsi `startTransition` memungkinkan Anda menandai sebuah pembaruan _state_ sebagai transisi.

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

* `scope`: Fungsi yang memperbarui sebuah _state_ dengan memanggil satu atau lebih [fungsi `set`.](/reference/react/useState#setstate) React segera memanggil `scope` tanpa parameter apapun dan menandai seluruh pembaruan _state_ yang berada di dalam fungsi `scope` sebagai transisi. Mereka akan bersifat [_non-blocking_](/reference/react/useTransition#marking-a-state-update-as-a-non-blocking-transition) dan [tidak akan menampilkan indikator pemuatan.](/reference/react/useTransition#preventing-unwanted-loading-indicators)

#### Nilai Balik {/*returns*/}

`startTransition` tidak memiliki nilai balik apapun.

#### Anjuran {/*caveats*/}

* `startTransition` tidak menyediakan penanda untuk mengetahui apakah sebuah transisi sedang _pending_ atau tidak. Untuk menampilkan indikator _pending_ ketika sebuah transisi sedang berjalan, Anda dapat menggunakan [`useTransition`.](/reference/react/useTransition)

* Anda hanya dapat menempatkan pembaruan _state_ ke dalam transisi bila Anda memiliki akses terhadap fungsi `set` dari _state_ tersebut. Jika Anda ingin memulai sebuah transisi sebagai respons terhadap sebuah _prop_ atau nilai balik sebuah _custom Hook_, cobalah menggunakan [`useDeferredValue`.](/reference/react/useDeferredValue)

* Fungsi yang Anda tempatkan ke dalam `startTransition` harus merupakan fungsi sinkronus. React langsung mengeksekusi fungsi ini dan menandai seluruh pembaruan _state_ yang terjadi sembari eksekusi sedang berjalan sebagai sebuah transisi. Apabila Anda mencoba melakukan pembaruan _state_ pada waktu lain (misalnya dalam sebuah _timeout_), mereka tak akan ditandai sebagai transisi.

* Sebuah pembaruan _state_ yang ditandai sebagai transisi dapat diinterupsi oleh pembaruan _state_ yang lain. Contohnya, bila Anda memperbarui sebuah komponen grafik didalam sebuah transisi, namun kemudian mengetik dalam sebuah masukan teks saat grafik tersebut masih di dalam proses _re-render_, React akan mengulangi proses _re-render_ pada grafik tersebut setelah selesai melakukan pembaruan _state_ dalam masukan teks tersebut.

* Pembaruan transisi tidak dapat digunakan untuk mengontrol masukan teks.

* Ketika terdapat beberapa transisi yang sedang berjalan, React akan menggabungkannya menjadi satu. Ini adalah sebuah keterbatasan yang kemungkinan besar akan diperbaiki pada rilis React selanjutnya.

---

## Penggunaan {/*usage*/}

### Menandai sebuah pembaruan _state_ sebagai transisi _non-blocking_ {/*marking-a-state-update-as-a-non-blocking-transition*/}

Anda dapat menandai sebuah _pembaruan state_ sebagai sebuah transisi dengan memasukkannya ke dalam pemanggilan `startTransition`:

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

Transisi memungkinkan pembaruan antarmuka pengguna (_user interface_) tetap responsif, bahkan dalam gawai yang relatif lamban.

Dengan sebuah transisi, antarmuka aplikasi Anda akan tetap responsif di tengah proses _re-render_. Sebagai contoh, ketika pengguna menekan sebuah _tab_ tetapi kemudian berubah pikiran dan menekan _tab_ lain, mereka dapat tetap melakukannya tanpa perlu menunggu proses _re-render_ pertama untuk selesai.

<Note>

`startTransition` hampir serupa dengan [`useTransition`](/reference/react/useTransition), tetapi dengan perbedaan bahwa ia tidak memiliki penanda `isPending` untuk memberi tahu apakah sebuah transisi sedang berjalan atau tidak. Anda dapat memanggil `startTransition` ketika `useTransition` tidak dapat digunakan dalam kondisi tertentu. Contohnya, `startTransition` dapat digunakan di luar komponen, misalnya seperti pustaka data / _data library_.

[Pelajari lebih lanjut mengenai transisi dan lihat contoh pada halaman `useTransition`.](/reference/react/useTransition)

</Note>
