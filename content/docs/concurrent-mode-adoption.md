---
id: concurrent-mode-adoption
title: Menggunakan Concurrent Mode (Experimental)
permalink: docs/concurrent-mode-adoption.html
prev: concurrent-mode-patterns.html
next: concurrent-mode-reference.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Perhatian:
>
>Laman ini menjelaskan **fitur eksperimental yang [belum tersedia](/docs/concurrent-mode-adoption.html) dalam versi rilis yang stabil**. Jangan mengandalkan _build_ eksperimental dalam aplikasi React versi produksi. Fitur ini dapat berubah secara signifikan dan tanpa peringatan sebelum menjadi bagian dari React.
>
>Dokumentasi ini ditujukan untuk pengguna awal dan orang-orang yang penasaran. **Kalau anda baru menggunakan React, jangan khawatir tentang fitur ini** -- anda tidak perlu mempelajarinya sekarang.

</div>

- [Instalasi](#installation)
  - [Untuk Siapakah Rilis Eksperimental Ini?](#who-is-this-experimental-release-for)
  - [Menjalankan Mode Concurrent](#enabling-concurrent-mode)
- [Apa yang Diharapkan](#what-to-expect)
  - [Langkah Migrasi: Mode Blocking](#migration-step-blocking-mode)
  - [Mengapa Sangat Banyak Mode?](#why-so-many-modes)
  - [Feature Comparison](#feature-comparison)

## Instalasi {#installation}

Mode Concurrent hanya tersedia di dalam [build eksperimental](/blog/2019/10/22/react-release-channels.html#experimental-channel) React. Untuk instalasi, jalankan:

```
npm install react@experimental react-dom@experimental
```

**Tidak ada jaminan versi semantik untuk build eksperimental.**  
API dapat ditambahkan, diubah, atau dihapus di dalam rilis `@experimental`.

**Rilis eksperimental memungkinkan adanya banyak perubahan signifikan.**

Anda dapat mencoba build ini untuk projek personal atau di dalam branch, tetapi
kami tidak merekomendasikan build ini untuk mode produksi. Di Facebook, kami *menggunakan*
build ini di mode produksi, tapi karena kami juga ada untuk membetulkan *bug*
ketika ada suatu masalah. Anda telah diperingatkan!

### Untuk Siapakah Rilis Eksperimental Ini? {#who-is-this-experimental-release-for}

Rilis ini diperuntukkan bagi pengguna awal, pencipta library, dan orang yang
penasaran.

Kami menggunakan kode ini di dalam mode produksi (dan itu bekerja untuk kami)
tetapi masih terdapat beberapa *bug*, fitur yang hilang, dan dokumentasi yang belum
lengkap. Kami ingin mendengar lebih tentang apa yang tidak bekerja di dalam Mode
Concurrent sehingga kami dapat mempersiapkan rilis resmi dan stabil kedepannya.

### Menjalankan Mode Concurrent {#enabling-concurrent-mode}

Normalnya, ketika kami menambahkan fitur ke dalam React, Anda dapat langsung
menggunakannya. Fragments, Context, serta Hooks adalah contoh dari fitur
tersebut. Anda dapat menggunakannya di dalam kode baru tanpa harus melakukan
perubahan kode.

Mode Concurrent berbeda. Mode ini memperkenalkan perubahan semantik dalam
bagaimana cara React bekerja. Sebaliknya, [fitur baru](/docs/concurrent-mode-patterns.html) yang dijalankan *tidak akan terjadi*. Ini mengapa hal tersebut dikelompokkan ke dalam "mode" baru daripada merilisnya dengan terpisah satu per satu.

Anda tidak dapat memilih Mode Concurrent dalam per-subpohon. Sebagai ganti
untuk menggunakannya, Anda harus menempatkannya di dalam tempat yang dinamakan `ReactDOM.render()`.

**Dengan ini, Mode Concurrent akan digunakan untuk keseluruhan pohon `<App />`
:**
```js
import ReactDOM from 'react-dom';

// Jika Anda sebelumnya menggunakan:
//
// ReactDOM.render(<App />, document.getElementById('root'));
//
// Anda dapat memakai Mode Concurrent dengan menulis:

ReactDOM.unstable_createRoot(
  document.getElementById('root')
).render(<App />);
```

>Catatan:
>
>API Mode Concurrent seperti `createRoot` hanya ada di dalam build eksperimental React.

Di dalam Mode Concurrent, metoda *lifecycle* yang [sebelumnya ditandai](/blog/2018/03/27/update-on-async-rendering.html) sebagai "*unsafe*" sebetulnya *memang* tidak aman, dan dapat menyebabkan lebih banyak *bug* daripada React saat ini. Kami tidak merekomendasikan untuk mencoba Mode Concurrent sampai aplikasi Anda kompatibel dengan [Strict Mode](/docs/strict-mode.html).

## Apa yang Diharapkan {#what-to-expect}

Jika Anda memiliki aplikasi yang berukuran besar, atau aplikasi yang
mengandalkan banyak *package* pihak ketiga, tolong jangan berharap Anda dapat
menggunakan Mode Concurrent secara langsung. **Contohnya, di Facebook kami
menggunakan Mode Concurrent untuk website baru, tetapi kami tidak memiliki
rencana untuk memakainya di website lama kami.** Ini dikarenakan website lama
kami masih menggunakan metoda *lifecycle* yang tidak aman di dalam kode
produksi, *library* pihak ketiga yang tidak kompatibel, dan pola yang tidak
dapat bekerja dengan baik jika digunakan bersama Mode Concurrent.

Dari pengalaman kami, kode yang menggunakan pola idiomatis React dan tidak
mengandalkan manajemen *state* eksternal adalah kode termudah yang dapat
mengaplikasikan Mode Concurrent. Kami akan menjelaskan kesalahan yang sering
terlihat dan solusi dalam beberapa minggu kedepan.

### Langkah Migrasi: Mode Blocking {#migration-step-blocking-mode}

Untuk *codebase* lama, Mode Concurrent merupakan langkah yang terlalu jauh. Ini
mengapa kami juga menyediakan "Mode Blocking" yang baru di dalam build
eksperimental React. Anda dapat mencobanya dengan mengubah `createRoot` dengan
`createBlockingRoot`. Dengan ini, beberapa fitur kecil dari Mode Concurrent
dapat digunakan, tetapi kinerjanya hampir mendekati bagaimana React bekerja saat
ini dan dapat dijadikan sebagai sebuah langkah migrasi.

Kesimpulannya:

* **Mode Legacy:** `ReactDOM.render(<App />, rootNode)`. Ini adalah cara dimana aplikasi React saat ini digunakan. Tidak ada rencana untuk mengubah Mode Legacy untuk kedepannya — tetapi mode ini tidak memungkinkan untuk menjalankan fitur-fitur baru.
* **Mode Blocking:** `ReactDOM.createBlockingRoot(rootNode).render(<App />)`.
    Saat ini, fungsi ini merupakan fungsi percobaan (eksperimental). Hanya digunakan untuk langkah
    migrasi untuk aplikasi yang ingin memakai fitur-fitur sederhana dari Mode
    Concurrent.
* **Mode Concurrent:** `ReactDOM.createRoot(rootNode).render(<App />)`. Saat
    ini, fungsi ini merupakan fungsi percobaan (eksperimental). Kedepannya,
    setelah semuanya berjalan stabil, kami ingin membuatnya sebagai mode standar
    atau bawaan dari React. Mode ini akan menjalankan *semua* fitur baru.

### Mengapa Sangat Banyak Mode? {#why-so-many-modes}

Kami berfikir lebih baik untuk menggunakan [strategi migrasi bertahap](/docs/faq-versioning.html#commitment-to-stability) daripada melakukan perubahan yang sangat banyak dan signifikan — atau membuat React menjadi stagnan (tidak berkembang) dan tidak relevan.

Dalam penggunaanya, kami berharap aplikasi yang saat ini menggunakan Mode Legacy
dapat migrasi setidaknya ke Mode Blocking (jika bukan Mode Concurrent).
Fragmentasi ini dapat menyebabkan banyak *library* yang harus bisa bekerja dalam
semua Mode dalam waktu singkat. Namun, dengan memindahkan ekosistem secara
bertahap dari Mode Legacy memungkinkan untuk *menyelesaikan* masalah yang
terdapat pada *library* penting di dalam ekosistem React, seperti [mempersulit Suspense ketika membaca layout](https://github.com/facebook/react/issues/14536) dan [tidak adanya jaminan dalam pengerjaan banyak yang konsisten](https://github.com/facebook/react/issues/15080). Terdapat beberapa *bug* yang tidak dapat diselesaikan di Mode Legacy jika tidak merubah semantik, tapi *bug* tersebut tidak ada di dalam Mode Blocking dan Mode Concurrent.

Anda dapat berfikir bahwa Mode Blocking adalah versi "degradasi yang anggun"
dari Mode Concurrent. **Sebagai hasilnya, dalam jangka waktu yang lama kami
dapat memusatkan satu hal dan berhenti untuk memikirkan Mode yang lainnya.**
Tapi untuk saat ini, Mode-mode tersebut sangatlah penting sebagai strategi untuk
migrasi. Semuanya membuat orang memilih, apakah perubahan yang dilakukan
setimpal untuk migrasi dan *upgrade* kedepannya.

### Feature Comparison {#feature-comparison}

<style>
  #feature-table table { border-collapse: collapse; }
  #feature-table th { padding-right: 30px; }
  #feature-table tr { border-bottom: 1px solid #eee; }
</style>

<div id="feature-table">

|   |Legacy Mode  |Blocking Mode  |Concurrent Mode  |
|---  |---  |---  |---  |
|[String Refs](/docs/refs-and-the-dom.html#legacy-api-string-refs)  |✅  |🚫**  |🚫**  |
|[Legacy Context](/docs/legacy-context.html) |✅  |🚫**  |🚫**  |
|[findDOMNode](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)  |✅  |🚫**  |🚫**  |
|[Suspense](/docs/concurrent-mode-suspense.html#what-is-suspense-exactly) |✅  |✅  |✅  |
|[SuspenseList](/docs/concurrent-mode-patterns.html#suspenselist) |🚫  |✅  |✅  |
|Suspense SSR + Hydration |🚫  |✅  |✅  |
|Progressive Hydration  |🚫  |✅  |✅  |
|Selective Hydration  |🚫  |🚫  |✅  |
|Cooperative Multitasking |🚫  |🚫  |✅  |
|Automatic batching of multiple setStates     |🚫* |✅  |✅  |
|[Priority-based Rendering](/docs/concurrent-mode-patterns.html#splitting-high-and-low-priority-state) |🚫  |🚫  |✅  |
|[Interruptible Prerendering](/docs/concurrent-mode-intro.html#interruptible-rendering) |🚫  |🚫  |✅  |
|[useTransition](/docs/concurrent-mode-patterns.html#transitions)  |🚫  |🚫  |✅  |
|[useDeferredValue](/docs/concurrent-mode-patterns.html#deferring-a-value) |🚫  |🚫  |✅  |
|[Suspense Reveal "Train"](/docs/concurrent-mode-patterns.html#suspense-reveal-train)  |🚫  |🚫  |✅  |

</div>

\*: Legacy mode has automatic batching in React-managed events but it's limited to one browser task. Non-React events must opt-in using `unstable_batchedUpdates`. In Blocking Mode and Concurrent Mode, all `setState`s are batched by default.

\*\*: Warns in development.
