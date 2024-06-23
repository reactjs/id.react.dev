---
title: <Profiler>
---

<Intro>

`<Profiler>` memungkinkan Anda mengukur performa *rendering* dari sebuah pohon React secara terprogram.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<Profiler>` {/*profiler*/}

Bungkus pohon komponen dalam `<Profiler>` untuk mengukur performa *rendering*.

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

#### Props {/*props*/}


* `id`: String yang mengidentifikasi bagian UI yang sedang Anda ukur.
* `onRender`: Sebuah [`onRender` *callback*](#onrender-callback) yang dipanggil oleh React setiap kali komponen dalam pohon yang diprofilkan diperbarui. Menerima informasi tentang apa yang di-*render* dan berapa lama waktu yang dibutuhkan.


#### *Caveats* {/*caveats*/}

* Pembuatan *profiler* akan menambah waktu komputasi, sehingga **dinonaktifkan dalam *build* produksi secara bawaan.** Untuk menggunakan *profiler* dalam produksi, Anda harus mengaktifkan sebuah [*build* produksi spesial dengan opsi pembuatan *profiler*.](https://fb.me/react-profiling)

---

### `onRender` *callback* {/*onrender-callback*/}

React akan memanggil `onRender` *callback* Anda dengan informasi tentang apa yang sudah di-*render*.

```js
function onRender(id, phase, actualDuration, baseDuration, startTime, commitTime) {
  // Aggregate or log render timings...
}
```

#### Parameters {/*onrender-parameters*/}

* `id`: String `id` prop dari pohon `<Profiler>` yang baru saja di-*commit*. Ini memungkinkan Anda mengidentifikasi bagian mana dari pohon yang di-*commit* jika Anda menggunakan beberapa *profiler*.
* `phase`: `"mount"`, `"update"` atau `"nested-update"`. Hal ini memungkinkan Anda mengetahui, apakah pohon baru saja dipasang untuk pertama kali, atau di-*render* ulang karena ada perubahan pada *props*, status, atau *hooks*.
* `actualDuration`: Jumlah milidetik yang dihabiskan untuk me-*render* `<Profiler>` dan turunannya untuk pembaruan terkini. Ini mengindikasikan seberapa baik *sub*-pohon menggunakan memoisasi (contohnya [`memo`](/reference/react/memo) dan [`useMemo`](/reference/react/useMemo)). Idealnya, nilai ini akan berkurang secara signifikan setelah pemasangan awal, karena banyak keturunan yang hanya perlu me-*render* ulang jika *props* tertentu mereka berubah.
* `baseDuration`: Jumlah milidetik yang memperkirakan berapa lama waktu yang dibutuhkan untuk me-*render* ulang seluruh *sub*-pohon `<Profiler>` tanpa pengoptimalan apa pun. Dihitung dengan menjumlahkan durasi *render* terbaru dari setiap komponen dalam pohon. Nilai ini memperkirakan biaya kasus terburuk dari *rendering* (misalnya, pemasangan awal atau pohon tanpa memoisasi). Bandingkan `actualDuration` dengan nilai ini untuk melihat apakah memoisasi berfungsi.
* `startTime`: Stempel waktu numerik untuk mengetahui kapan React mulai me-*render* pembaruan terkini.
* `commitTime`: Stempel waktu numerik untuk mengetahui kapan React melakukan pembaruan terkini. Nilai ini dibagi di antara semua *profiler* dalam sebuah *commit*, sehingga memungkinkan untuk dikelompokkan jika diinginkan.

---

## Penggunaan {/*usage*/}

### Mengukur performa *rendering* secara terprogram {/*measuring-rendering-performance-programmatically*/}

Bungkus komponen `<Profiler>` di sekitar pohon React untuk mengukur performa *rendering*nya.

```js {2,4}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <PageContent />
</App>
```

Dua *props* dibutuhkan untuk ini: sebuah `id` (string) dan *callback* `onRender` (fungsi) yang dipanggil oleh React kapan pun sebuah komponen di dalam pohon melakukan pembaruan.

<Pitfall>

Pembuatan *profiler* akan menambah waktu komputasi, sehingga **dinonaktifkan dalam *build* produksi secara *default*.** Untuk menggunakan *profiler* dalam produksi, Anda harus mengaktifkan sebuah [*build* produksi spesial dengan opsi pembuatan *profiler*.](https://fb.me/react-profiling)

</Pitfall>

<Note>

`<Profiler>` memungkinkan Anda mengumpulkan pengukuran secara terprogram. Jika Anda mencari *profiler* interaktif, cobalah tab *Profiler* di [React Developer Tools](/learn/react-developer-tools). Alat ini memiliki fungsionalitas yang serupa sebagai ekstensi peramban.

</Note>

---

### Mengukur berbagai bagian aplikasi yang berbeda {/*measuring-different-parts-of-the-application*/}

Anda dapat menggunakan beberapa komponen `<Profiler>` untuk mengukur bagian yang berbeda dari aplikasi Anda:

```js {5,7}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content />
  </Profiler>
</App>
```

Anda juga dapat menyarangkan komponen `<Profiler>`:

```js {5,7,9,12}
<App>
  <Profiler id="Sidebar" onRender={onRender}>
    <Sidebar />
  </Profiler>
  <Profiler id="Content" onRender={onRender}>
    <Content>
      <Profiler id="Editor" onRender={onRender}>
        <Editor />
      </Profiler>
      <Preview />
    </Content>
  </Profiler>
</App>
```

Meskipun `<Profiler>` adalah komponen yang ringan, komponen ini sebaiknya digunakan hanya jika diperlukan. Setiap penggunaan akan menambah beban CPU dan memori pada aplikasi.

---

