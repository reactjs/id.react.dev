---
id: concurrent-mode-reference
title: Concurrent Mode API Reference (Experimental)
permalink: docs/concurrent-mode-reference.html
prev: concurrent-mode-adoption.html
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
<<<<<<< HEAD
>Laman ini menjelaskan **fitur eksperimental yang [belum tersedia](/docs/concurrent-mode-adoption.html) dalam versi rilis yang stabil**. Jangan mengandalkan _build_ eksperimental dalam aplikasi React versi produksi. Fitur ini dapat berubah secara signifikan dan tanpa peringatan sebelum menjadi bagian dari React.
>
>Dokumentasi ini ditujukan untuk pengguna awal dan orang-orang yang penasaran. **Kalau Anda baru menggunakan React, jangan khawatir tentang fitur ini** -- Anda tidak perlu mempelajarinya sekarang.
=======
>This page was about experimental features that aren't yet available in a stable release. It was aimed at early adopters and people who are curious.
>
>Much of the information on this page is now outdated and exists only for archival purposes. **Please refer to the [React 18 Alpha announcement post](/blog/2021/06/08/the-plan-for-react-18.html
) for the up-to-date information.**
>
>Before React 18 is released, we will replace this page with stable documentation.
>>>>>>> a88b1e1331126287ccf03f2f4ec25ec38513b911

</div>

Laman ini merupakan referensi API untuk [Mode _Concurrent_](/docs/concurrent-mode-intro.html) React. Jika Anda mencari panduan dasar, gunakan [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html)

**Catatan: Fitur ini merupakan versi Pratinjau Komunitas dan bukan versi rilis yang stabil. Besar kemungkinan akan perubahan dari API yang terdapat pada laman ini. Gunakan sesuai dengan resiko Anda sendiri!**

- [Mengaktifkan Mode _Concurrent_](#concurrent-mode)
    - [`createRoot`](#createroot)
- [Suspense](#suspense)
    - [`Suspense`](#suspensecomponent)
    - [`SuspenseList`](#suspenselist)
    - [`useTransition`](#usetransition)
    - [`useDeferredValue`](#usedeferredvalue)

## Mengaktifkan Mode _Concurrent_ {#concurrent-mode}

### `createRoot` {#createroot}

```js
ReactDOM.createRoot(rootNode).render(<App />);
```

Menggantikan `ReactDOM.render(<App />, rootNode)` dan mengaktifkan Mode _Concurrent_.

Untuk informasi lebih lanjut mengenai Mode _Concurrent_, silahkan lihat [dokumentasi Mode _Concurrent_.](/docs/concurrent-mode-intro.html)

<<<<<<< HEAD
### `createBlockingRoot` {#createblockingroot}

```js
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```

Menggantikan `ReactDOM.render(<App />, rootNode)` dan mengaktifkan [Mode _Blocking_](/docs/concurrent-mode-adoption.html#migration-step-blocking-mode).

Dengan menggunakan Mode _Concurrent_ akan merubah landasan cara kerja React. Hal ini berarti Anda tidak bisa menggunakan Mode _Concurrent_ untuk beberapa komponen saja. Oleh sebab itu, kemungkinan beberapa aplikasi tidak bisa langsung mengimplementasikan Mode _Concurrent_. 

Mode _Blocking_ terdiri dari sebagian fitur-fitur Mode _Concurrent_ yang ditujukan untuk proses peralihan aplikasi yang belum bisa mengadopsi secara langsung.

=======
>>>>>>> a88b1e1331126287ccf03f2f4ec25ec38513b911
## Suspense API {#suspense}

### `Suspense` {#suspensecomponent}

```js
<Suspense fallback={<h1>Loading...</h1>}>
  <ProfilePhoto />
  <ProfileDetails />
</Suspense>
```

`Suspense` memungkinkan komponen Anda "menunggu" sesuatu sebelum di _render_, dengan menampilkan _fallback_ selama menunggu.

<<<<<<< HEAD
Pada contoh berikut ini, `ProfileDetails` menunggu panggilan API _asynchronous_ untuk mendapatkan data. Selama menunggu `ProfileDetails` dan `ProfilePhoto`, kita dapat menampilkan _fallback_ berupa `Loading...`. Hal penting yang perlu dicatat yaitu jika semua anak komponen (_children_) dari `<Suspense>` belum siap, tampilan _fallback_ akan terus muncul.
=======
In this example, `ProfileDetails` is waiting for an asynchronous API call to fetch some data. While we wait for `ProfileDetails` and `ProfilePhoto`, we will show the `Loading...` fallback instead. It is important to note that until all children inside `<Suspense>` have loaded, we will continue to show the fallback.
>>>>>>> a88b1e1331126287ccf03f2f4ec25ec38513b911

`Suspense` memiliki dua _props_:
* **fallback** untuk indikator menunggu. _fallback_ akan terus ditampilkan sampai semua anak komponen dari `Suspense` sudah selesai di _render_.
* **unstable_avoidThisFallback** sebagai _boolean_. React menggunakan _prop_ ini untuk "menghindari" tampilan _fallback_ diawal inisialisasi. Besar kemungkinan API ini akan dihapus di rilis yang akan datang.

### `<SuspenseList>` {#suspenselist}

```js
<SuspenseList revealOrder="forwards">
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={1} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={2} />
  </Suspense>
  <Suspense fallback={'Loading...'}>
    <ProfilePicture id={3} />
  </Suspense>
  ...
</SuspenseList>
```

`SuspenseList` bisa membantu koordinansi beberapa komponen sekaligus yang perlu diatur urutan penampilannya kepada pengguna.

Ketika sejumlah komponen memerlukan data, kita tidak selalu bisa memprediksi urutan data yang sampai. Tetapi, jika kita bungkus komponen-komponen ini ke dalam `SuspenseList`, React tidak akan menampilkan suatu komponen hingga komponen sebelumnya sudah tampil (dapat diatur lebih lanjut).

`SuspenseList` memiliki dua _props_:
* **revealOrder (forwards, backwards, together)** mengatur urutan munculnya komponen yang ada di dalam `SuspenseList`.
  * `together` akan menampilkan *semua* komponen secara bersamaan ketika sudah siap dibanding satu per satu.
* **tail (collapsed, hidden)** mengatur perilaku komponen di dalam `SuspenseList` yang belum siap. 
    * Secara umum, `SuspenseList` akan menampilkan semua _fallbacks_.
    * `collapsed` hanya akan menampilkan _fallback_ berikutnya dari anak komponen.
    * `hidden` tidak akan menampilkan _fallback_ apapun.

Perlu dicatat bahwa `SuspenseList` hanya akan melihat komponen `Suspense` dan `SuspenseList` terdekat. `SuspenseList` tidak akan melihat lebih dari satu level di bawahnya. Tetapi, jika dibutuhkan Anda bisa menumpuk beberapa komponen `SuspenseList` satu sama lain untuk membuat sebuah kerangka.

### `useTransition` {#usetransition}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
```

`useTransition` bisa digunakan untuk mencegah kondisi pembaruan (_loading state_) yang tidak diinginkan dengan cara menunggu konten muncul sebelum **berpindah ke tampilan berikutnya**. Dan juga hal ini bisa membantu mengontrol komponen agar memprioritaskan _render_ yang lebih penting, seperti ketika pembaruan data untuk ditahan sampai _render_ berikutnya.

_Hook_ `useTransition` menghasilkan dua nilai dalam sebuah senarai.
* `startTransition` sebuah fungsi dengan masukan _callback_. Bisa digunakan untuk memberitahu React _state_ mana yang perlu ditunda.
* `isPending` sebuah _boolean_. Digunakan React untuk memberitahu jika sedang dalam proses penangguhan _state_ tertentu.

**Jika proses pembaruan _state_ mengakibatkan sebuah komponen ditangguhkan, pembaruan _state_ tersebut harus dimasukkan ke dalam _transition_.**

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };

function App() {
  const [resource, setResource] = useState(initialResource);
  const [startTransition, isPending] = useTransition(SUSPENSE_CONFIG);
  return (
    <>
      <button
        disabled={isPending}
        onClick={() => {
          startTransition(() => {
            const nextUserId = getNextId(resource.userId);
            setResource(fetchProfileData(nextUserId));
          });
        }}
      >
        Next
      </button>
      {isPending ? " Loading..." : null}
      <Suspense fallback={<Spinner />}>
        <ProfilePage resource={resource} />
      </Suspense>
    </>
  );
}
```

Dalam contoh potongan kode, proses pengambilan data dienkapsulasi dengan `startTransition`. Ini berarti permintaan data akan segera dieksekusi selagi menangguhkan _render_ halaman profil dan komponen `Spinner` selama 2 detik (sesuai dengan waktu yang tertera di `timeoutMs`).

_Boolean_ `isPending` mengindikasikan React bahwa komponen sedang dalam transisi yang bisa kita gunakan untuk memberitahu pengguna dengan menampilkan sebuah pesan di halaman profil sebelumnya.

**Untuk informasi lebih jauh tentang transisi dapat dilihat di [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#transitions).**

#### Konfigurasi useTransition {#usetransition-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useTransition` dapat menggunakan parameter `timeoutMs` sebagai **tambahan Konfigurasi _Suspense_**. Parameter ini (dalam mili detik) digunakan React sebagai penanda berapa lama jeda sebelum berpindah ke _state_ berikutnya (Halaman Profil baru dari contoh di atas).

**Catatan: Kami merekomendasikan untuk menggunakan Konfigurasi _Suspense_ untuk tiap modul yang berbeda.**


### `useDeferredValue` {#usedeferredvalue}

```js
const deferredValue = useDeferredValue(value, { timeoutMs: 2000 });
```

Menghasilkan suatu nilai yang "tertunda" sampai kurun waktu `timeoutMs`.

Biasanya digunakan untuk memastikan tampilan tetap responsif ketika suatu hal perlu di tampilkan seketika dari interaksi pengguna sedangkan harus menunggu proses pengambilan data juga.

Salah satu contoh skenario yang tepat adalah masukan teks (_text input_).

```js
function App() {
  const [text, setText] = useState("hello");
  const deferredText = useDeferredValue(text, { timeoutMs: 2000 }); 

  return (
    <div className="App">
      {/* Keep passing the current text to the input */}
      <input value={text} onChange={handleChange} />
      ...
      {/* But the list is allowed to "lag behind" when necessary */}
      <MySlowList text={deferredText} />
    </div>
  );
 }
```

Dengan metode ini kita dapat menampilkan segera teks terbaru di `input` yang akan membuat laman web terlihat responsif. Sementara itu, `MySlowList` "tertunda" sampai 2 detik berdasarkan `timeoutMs` sebelum diperbarui, memberikan kesempatan untuk eksekusi dengan teks terbaru di balik layar.

**Untuk informasi lebih lanjut tentang penundaan, Anda dapat melihat [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html#deferring-a-value).**

#### Konfigurasi useDeferredValue {#usedeferredvalue-config}

```js
const SUSPENSE_CONFIG = { timeoutMs: 2000 };
```

`useDeferredValue` dapat menggunakan parameter `timeoutMs` sebagai **tambahan Konfigurasi _Suspense_**. Parameter ini (dalam mili detik) digunakan React sebagai penanda berapa lama jeda waktu sebuah nilai perlu ditunda.

React akan selalu menggunakan jeda waktu terkecil ketika jaringan dan peranti mendukungnya.
