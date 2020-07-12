---
id: concurrent-mode-suspense
title: Suspense for Penarikan Data (Eksperimental)
permalink: docs/concurrent-mode-suspense.html
prev: concurrent-mode-intro.html
next: concurrent-mode-patterns.html
---

<style>
.scary > blockquote {
  background-color: rgba(237, 51, 21, 0.2);
  border-left-color: #ed3315;
}
</style>

<div class="scary">

>Caution:
>
> Halaman ini menjelaskan **fitur eksperimental yang [belum tersedia](/docs/concurrent-mode-adoption.html) dalam versi rilis yang stabil**. Jangan mengandalkan _builds_ eksperimental dalam aplikasi React versi produksi. Fitur-fitur ini dapat berubah secara signifikan dan tanpa peringatan sebelum menjadi bagian dari React.
>
> Dokumentasi ini ditujukan untuk pengguna awal dan orang-orang yang penasaran. **Jika Anda baru menggunakan React, jangan khawatirkan tentang fitur ini** -- Anda tidak perlu mempelajarinya sekaran

</div>

React 16.6 menambahkan komponen `<Suspense>` yang memungkinkan Anda "menunggu" kode untuk dimuat dan menentukan keadaan pemuatan (_spinner_) secara deklaratif.

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Menampilkan spinner ketika masih memuat profil
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Suspense untuk Penarikan Data adalah sebuah fitur baru yang juga memungkinkan Anda menggunakan `<Suspense>` untuk **secara deklaratif "menunggu" hal-hal yang lainnya, termasuk data.** Halaman ini berfokus pada kasus penarikan data, tetapi ini bisa juga menunggu gambar, kode, atau pekerjaan asinkron lainnya.

- [Apa sebenarnya Suspense itu?](#what-is-suspense-exactly)
  - [Apa yang Bukan Suspense](#what-suspense-is-not)
  - [Apa saja yang Suspense Bisa Lakukan](#what-suspense-lets-you-do)
- [Penggunaan Suspense dalam Praktik](#using-suspense-in-practice)
  - [Bagaimana Jika Saya Tidak Menggunakan Relay?](#what-if-i-dont-use-relay)
  - [Untuk Pembuat Pustaka](#for-library-authors)
- [Pendekatan Tradisional vs Suspense](#traditional-approaches-vs-suspense)
  - [Pendekatan 1: Tarik-Saat-Render (Tidak Menggunakan Suspense)](#approach-1-fetch-on-render-not-using-suspense)
  - [Pendekatan 2: Tarik-Kemudian-Render (Tidak Menggunakan Suspense)](#approach-2-fetch-then-render-not-using-suspense)
  - [Pendekatan 3: Render-Sembari-Tarik (Menggunakan Suspense)](#approach-3-render-as-you-fetch-using-suspense)
- [Mulai Penarikan Lebih Awal](#start-fetching-early)
  - [Kita Masih Mencari Tahu](#were-still-figuring-this-out)
- [Suspense and Kondisi Balapan](#suspense-and-race-conditions)
  - [Kondisi Balapan dengan useEffect](#race-conditions-with-useeffect)
  - [Race Conditions dengan componentDidUpdate](#race-conditions-with-componentdidupdate)
  - [Masalah](#the-problem)
  - [Memecahkan Kondisi Balapan Solving dengan Suspense](#solving-race-conditions-with-suspense)
- [Penanganan Error](#handling-errors)
- [Langkah Selanjutnya](#next-steps)

## What Is Suspense, Exactly? {#what-is-suspense-exactly}
## Apa Itu Suspense Sebenarnya? {#what-is-suspense-exactly}

Suspense memungkinkan komponen Anda "menunggu" sesuatu sebelum mereka bisa _render_. Pada [contoh ini](https://codesandbox.io/s/frosty-hermann-bztrp), dua komponen menunggu sebuah pemanggilan API secara asinkron untuk penarikan suatu data:

```js
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Memuat profil...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Memuat kiriman...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Mencoba untuk membaca info pengguna, walau mungkin belum termuat
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Mencoba untuk membaca kiriman, walau mungkin belum termuat
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Coba di CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Demo ini hanyalah penggoda. Jangan khawatir jika itu belum cukup masuk akal. Kita akan bahas lebih lanjut tentang bagaimana cara kerjanya di bawah. Perlu diingat bahwa Suspense lebih merupakan sebuah *mekanisme*, dan beberapa API seperti `fetchProfileData()` atau `resource.posts.read()` pada contoh di atas tidak terlalu penting. Jika Anda penasaran, Anda bisa menemukan definisinya langsung di [demo sandbox](https://codesandbox.io/s/frosty-hermann-bztrp)

Suspense bukan merupakan pustaka untuk penarikan data. Dia adalah sebuah **mekanisme bagi pustaka penarikan data** untuk berkomunikasi dengan React dimana *data yang dibaca sebuah komponen belum siap*. React bisa menunggunya hingga siap dan kemudian memperbarui UI-nya. Di Facebook, kita menggunakan Relay dan [integrasi dengan Suspense yang baru](https://relay.dev/docs/en/experimental/step-by-step)

Dalam jangka panjang, kita berniat agar Suspense menjadi cara utama untuk membaca data asinkron pada suatu komponen -- tidak peduli darimanapun datangnya

### Apa yang Bukan Suspense {#what-suspense-is-not}

Suspense secara signifikan berbeda dengan pendekatan yang sudah ada pada masalah-masalah ini, jadi membaca tentang hal ini untuk pertama kali sering kali mengarah ke kesalahpahaman. Mari klarifikasi beberapa yang paling umum:

 * **Ini bukan merupakan implementasi penarikan data.** Ini tidak mengasumsikan Anda menggunakan GraphQL, REST, atau format data, pustaka, pengangkut, atau protokol lainnya.

 * **Ini bukan merupakan klien yang siap digunakan.** Anda tidak bisa "mengganti" `fetch` atau Relay dengan Suspense. Tetapi Anda bisa menggunakan pustaka yang terintegrasi dengan Suspense (contohnya, [API Relay yang baru](https://relay.dev/docs/en/experimental/api-reference)).

 * **Ini tidak menggandeng penarikan data pada lapisan tampilan.** Suspense membantu orkestrasi dalam menampilkan keadaan pemuatan pada antarmuka Anda, tetapi tidak mengikat logika jaringan pada komponen React.

### Apa yang Mungkin Anda Lakukan dengan Suspense {#what-suspense-lets-you-do}

Jadi, apakah poin dari Suspense? Terdapat beberapa cara untuk kita dapat menjawabnya:

* **Ini memungkinkan pustaka penarikan data terintegrasi secara mendalam dengan React.** Jika pustaka penarikan data mengimplementasikan dukungan Suspense, menggunakannya dari komponen React terasa sangat natural.

* **Ini memungkinkan Anda mengatur keadaan pemuatan yang dirancang secara sengaja.** Suspense tidak menyatakan _bagaimana_ data ditarik, tetapi memungkinkan Anda mengontrol urutan pemuatan visual pada aplikasi Anda.

* **Ini membantu Anda terhindar dari kondisi balapan.** Bahkan dengan `await`, kode asinkron sering rawan kesalahan. Suspense lebih terasa seperti membaca data secara *sinkron* yang seolah-olah sudah dimuat.

## Praktek Penggunaan Suspense {#using-suspense-in-practice}

Di Facebook, sejauh ini kami hanya menggunakan integrasi Relay dengan Suspense dalam produksi. **Jika Anda mencari panduan praktis untuk memulai hari ini, [lihat Panduan Relay](https://relay.dev/docs/en/experimental/step-by-step)!** Ini menunjukkan pola yang sudah bekerja dengan baik untuk kita dalam produksi.

**Demo kode pada halaman ini menggunakan implementasi API "palsu" daripada Relay.** Ini membuat mereka lebih mudah dimengerti jika Anda tidak terbiasa dengan GraphQL, tetapi mereka tidak akan memberi tahu Anda "cara yang benar" untuk membangun aplikasi dengan Suspense. Halaman ini lebih konseptual dan dimaksudkan untuk membantu Anda melihat *mengapa* Suspense berfungsi dengan cara tertentu, dan masalah apa yang dipecahkannya.

### Bagaimana Jika Saya Tidak Menggunakan Relay? {#what-if-i-dont-use-relay}

Jika Anda tidak menggunakan Relay hari ini, Anda mungkin harus menunggu sebelum benar-benar dapat mencoba Suspense di aplikasi Anda. Sejauh ini, ini adalah satu-satunya implementasi yang kami uji dalam produksi dan percaya diri.

Selama beberapa bulan ke depan, banyak pustaka yang akan muncul dengan pandangan berbeda pada Suspense APIs. **Jika Anda lebih memilih belajar ketika segalanya lebih stabil, Anda mungkin lebih memilih untuk mengabaikan Suspense untuk saat ini, dan kembali ketika ekosistemnya lebih matang.**

Anda juga dapat menulis integrasi Anda sendiri untuk pustaka penarikan data, jika Anda mau.

### Untuk Pembuat Pustaka {#for-library-authors}

Kami berharap dapat melihat banyak eksperimen di komunitas dengan pustaka lain. Ada satu hal penting yang perlu diperhatikan untuk penulis pustaka penarikan data.

Meskipun secara teknis bisa dilakukan, Suspense saat ini **tidak** dimaksudkan sebagai cara untuk mulai menarik data saat komponen dirender. Sebaliknya, Suspense memungkinkan komponen menyatakan bahwa mereka "menunggu" data yang *sudah ditarik*. **[Membangun Pengalaman Pengguna yang Hebat dengan Mode Konkuren dan Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) menjelaskan mengapa hal ini penting dan bagaimana menerapkan pola ini dalam praktik.**

Kecuali Anda memiliki solusi yang membantu mencegah _waterfalls_, kami sarankan untuk memilih API yang mendukung atau memberlakukan penarikan sebelum render. Sebagai contoh nyata, Anda bisa melihat bagaimana caran [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) memberlakukan _preloading_. Pesan kami tentang ini belum terlalu konsisten di masa lalu. Suspense untuk Penarikan Data masih bersifat percobaan, sehingga Anda dapat mengharapkan rekomendasi kami berubah seiring waktu karena kami belajar lebih banyak dari penggunaan produksi dan memahami ruang masalah dengan lebih baik.

## Pendekatan Tradisional vs Suspense {#traditional-approaches-vs-suspense}

Kami dapat memperkenalkan Suspense tanpa menyebutkan pendekatan penarikan data populer. Namun, ini membuatnya lebih sulit untuk melihat masalah mana yang dipecahkan oleh Suspense, mengapa masalah ini layak untuk dipecahkan, dan bagaimana Suspense berbeda dari solusi yang ada.

Sebagai gantinya, kita akan melihat Suspense sebagai langkah logis berikutnya dalam serangkaian pendekatan:

* **Tarik-saat-render (contohnya, `fetch` di dalam `useEffect`):** Mulai merender komponen. Masing-masing komponen ini dapat memicu penarikan data dalam _effects_ dan _lifecycle methods_ mereka. Pendekatan ini sering mengarah pada "waterfall".
* **Tarik-kemudian-render (contohnya, Relay tanpa Suspense):** Mulai tarik semua data untuk layar berikutnya sedini mungkin. Ketika data siap, render layar baru. Kita tidak dapat melakukan apa pun sampai data tiba.
* **Render-sembari-tarik (contohnya, Relay dengan Suspense):** Mulai tarik semua data yang diperlukan untuk layar berikutnya sedini mungkin, dan mulai merender layar baru *segera sebelum kita mendapatkan respons jaringan*. Saat data mengalir, React akan mencoba kembali merender komponen yang masih membutuhkan data hingga semuanya siap.

>Catatan
>
>Ini agak disederhanakan, dan dalam praktiknya solusi cenderung menggunakan gabungan dari pendekatan yang berbeda. Namun, kita akan melihat mereka secara terpisah agar bisa lebih baik dalam membandingkan perbandingan konsekuensi mereka.

Untuk membandingkan pendekatan ini, kita akan mengimplementasi halaman profil dengan masing-masing dari pendekatan tersebut.

### Pendekatan 1: Tarik-Saat-Render (tidak menggunakan Suspense) {#approach-1-fetch-on-render-not-using-suspense}

Cara umum untuk menarik data di aplikasi React hari ini adalah menggunakan _effect_:

```js
// Di dalam function component:
useEffect(() => {
  fetchSomething();
}, []);

// Atau, di dalam class component:
componentDidMount() {
  fetchSomething();
}
```

Kami menyebut pendekatan ini "fetch-on-render" karena tidak memulai penarikan sampai *setelah* komponen ditampilkan di layar. Ini mengarah ke masalah yang dikenal sebagai "waterfall".

Perhatikan komponen `<ProfilePage>` dan `<ProfileTimeline>` berikut ini:

```js{4-6,22-24}
function ProfilePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser().then(u => setUser(u));
  }, []);

  if (user === null) {
    return <p>Memuat profil...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline />
    </>
  );
}

function ProfileTimeline() {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts().then(p => setPosts(p));
  }, []);

  if (posts === null) {
    return <h2>Memuat kiriman ...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/fragrant-glade-8huj6)**

Jika Anda menjalankan kode ini dan memperhatikan log konsol, Anda akan melihat urutannya adalah:

1. Kita mulai penarikan detail pengguna
2. Kita menunggu...
3. Kita selesai penarikan detail pengguna
4. Kita mulai penarikan kiriman
5. Kita menunggu...
6. Kita selesai penarikan kiriman

Jika penarikan detail pengguna membutuhkan tiga detik, kita hanya akan *mulai* mengambil kiriman setelah tiga detik! Itu adalah "waterfall": tidak disengaja berurutan yang seharusnya diparalelkan.

_Waterfalls_ adalah umum dalam kode yang menarik data pada saat render. Hal itu mungkin untuk dipecahkan, tetapi ketika produk berkembang, banyak orang lebih suka menggunakan solusi yang dapat menghindari masalah ini.

### Pendekatan 2: Tarik-Kemudian-Render (tidak menggunakan Suspense) {#approach-2-fetch-then-render-not-using-suspense}

Pustaka dapat mencegah _waterfalls_ dengan menawarkan cara yang lebih terpusat untuk melakukan penarikan data. Sebagai contoh, Relay memecahkan masalah ini dengan memindahkan informasi tentang data yang diperlukan komponen pada *fragment-fragment* yang bisa dianalisa secara statis, yang nantinya dapat dikomposisikan ke dalam satu permintaan.

entang Relay, jadi kita tidak akan menggunakannya untuk contoh ini. Sebagai gantinya, kita akan menulis sesuatu yang serupa secara manual dengan menggabungkan metode penarikan data kita:

```js
function fetchProfileData() {
  return Promise.all([
    fetchUser(),
    fetchPosts()
  ]).then(([user, posts]) => {
    return {user, posts};
  })
}
```

Pada contoh ini, `<ProfilePage>` menunggu kedua permintaan tetapi memulainya secara paralel:

```js{1,2,8-13}
// Memulai pengambilan sedini mungkin
const promise = fetchProfileData();

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    promise.then(data => {
      setUser(data.user);
      setPosts(data.posts);
    });
  }, []);

  if (user === null) {
    return <p>Memuat profil...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline posts={posts} />
    </>
  );
}

// Komponen anaknya tidak lagi memicu penarikan
function ProfileTimeline({ posts }) {
  if (posts === null) {
    return <h2>Memuat kiriman...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/wandering-morning-ev6r0)**

Urutan kejadian sekarang menjadi seperti ini:

1. Kita mulai penarikan detail pengguna
2. Kita mulai penarikan kiriman
3. Kita menunggu...
4. Kita selesai penarikan detail pengguna
5. Kita selesai penarikan kiriman

Kita telah memecahkan masalah _waterfalls_ jaringan sebelumnya, tetapi secara tidak sengaja memperkenalkan suatu hal yang berbeda. Kita menunggu *semua* data untuk kembali dengan `Promise.all()` di dalam `fetchProfileData`, jadi sekarang kami tidak dapat merender detail profil hingga postingannya sudah ditarik juga. Kita harus menunggu keduanya.

Tentu saja, ini dimungkinkan untuk diperbaiki dalam contoh khusus ini. Kita dapat menghapus pemanggilan `Promise.all()`, dan menunggu kedua _Promise_ secara terpisah. Namun, pendekatan ini semakin sulit seiring dengan semakin kompleksnya data dan komponen kita. Sulit untuk menulis komponen yang andal ketika suatu bagian acak dari pohon data mungkin hilang atau basi. Jadi menarik semua data untuk layar baru dan *kemudian* melakukan perenderan seringkali merupakan opsi yang lebih praktis.

### Pendekatan 3: Render-Sembari-Tarik (menggunakan Suspense) {#approach-3-render-as-you-fetch-using-suspense}

Pada pendekatan sebelumnya, kita menari kdata sebelum memanggil `setState`:

1. Mulai penarikan
2. Selesai penarikan
3. Mulai perenderan

Dengan Suspense, we still start fetching first, but we flip the last two steps around:
Dengan Suspense, kita aka mulai penarikan terlebih dahulu, tetapi kita menukar dua langkah terakhir:

1. Mulai penarikan
2. **Mulai perenderan**
3. **Selesai penarikan**

**With Suspense, we don't wait for the response to come back before we start rendering.** In fact, we start rendering *pretty much immediately* after kicking off the network request:
**Dengan Suspense, kita tidak menunggu respons kembali sebelum kita mulai merender.** Faktanya, kita mulai perenderan  *segera* setelah memulai penarikan jaringan:

```js{2,17,23}
// Ini bukanlah sebuah Promise. Ini adalah sebuah objek spesial dari integrasi Suspense kita.
const resource = fetchProfileData();

function ProfilePage() {
  return (
    <Suspense fallback={<h1>Memuat profil...</h1>}>
      <ProfileDetails />
      <Suspense fallback={<h1>Memuat kiriman...</h1>}>
        <ProfileTimeline />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails() {
  // Mencoba untuk membaca info pengguna, walaupun itu mungkin belum termuat.
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline() {
  // Mencoba untuk membaca kiriman, walaupun itu mungkin belum termuat.
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Here's what happens when we render `<ProfilePage>` on the screen:
Inilah yang terjadi ketika kita merender `<ProfilePage>` di layar:

1. Kita telah memulai penarikan saat `fetchProfileData ()`. Dia memberi kita "sumber daya" khusus, bukan sebuah Promise. Dalam contoh realistis, ini akan disediakan oleh integrasi Suspense dari pustaka data, seperti Relay.
2. React mencoba untuk merender `<ProfilePage>`. Dia mengembalikan `<ProfileDetails>` dan `<ProfileTimeline>` sebagai anak.
3. React mencoba untuk merender `<ProfileDetails>`. Dia memanggil `resource.user.read()`. Belum ada data yang tertarik, jadi komponen ini "ditangguhkan". React melompatinya, dan mencoba merender komponen lain di pohon.
4. React mencoba untuk merender `<ProfileTimeline>`. Dia memanggil `resource.posts.read()`. Sekali lagi, belum ada data, jadi komponen ini juga "ditangguhkan". React melompatinya juga, dan mencoba merender komponen lain di pohon.
5. Tidak ada yang tersisa untuk dicoba dirender. Karena `<ProfileDetails>` ditangguhkan, React menunjukkan the closest `<Suspense>` _fallback_ terdekat di atasnya di dalam pohon: `<h1>Memuat profil...</h1>`. Kita sudah selesai sekarang.

Objek `resource` ini mewakili data yang belum ada, tetapi pada akhirnya mungkin dimuat. Ketika kita memanggil `read()`, kita mendapatkan datanya, atau komponen yang "ditangguhkan".

**Ketika lebih banyak data mengalir masuk, React akan mencoba lagi perenderan, dan setiap kali dapat berkembang menjadi "lebih dalam".** Ketika `resource.user` didapatkan, komponen `<ProfileDetails>` akan terender dengan sukses dan kita tidak lagi membutuhkan _fallback_ `<h1> Memuat profil ... </h1>`. Pada akhirnya, kita akan mendapatkan semua data, dan tidak akan ada _fallback_ di layar.

Hal ini memiliki implikasi yang menarik. Bahkan jika kita menggunakan klien GraphQL yang mengumpulkan semua persyaratan data dalam satu permintaan, *streaming respons memungkinkan kita menampilkan lebih banyak konten dengan lebih cepat*. Karena kita merender-*sembari-tarik* (bertolak belakang dari *setelah* penarikan), jika `user` muncul dalam respons lebih awal dari` posts`, kita akan dapat "membuka" bagian luar batasan `<Suspense> ` bahkan sebelum respons selesai. Kita mungkin telah melewatkan ini sebelumnya, tetapi bahkan solusi tarik-kemudian-render mengandung _waterfall_: antara penarikan dan perenderan. Pada dasarnya tidak terefek buruk dari _waterfall_ ini, dan pustaka seperti Relay mengambil keuntungan dari ini.

Perhatikan bagaimana kita menghilangkan pemeriksaan `if (...)` "sedang memuat" dari komponen kita. Ini tidak hanya menghapus kode yang bertele-tele, tetapi juga menyederhanakan membuat perubahan desain cepat. Misalnya, jika kita ingin detail profil dan kiriman selalu "muncul" bersama-sama, kita dapat menghapus batas `<Suspense>` di antara kedua hal tersebut. Atau kita bisa membuat mereka independen satu sama lain dengan memberi masing-masing *batas* `<Suspense>` *sendiri*. Suspense memungkinkan kita mengubah rincian status pemuatan dan mengatur urutannya tanpa perubahan invasif pada kode kita.

## Mulai Penarikan Di Awal {#start-fetching-early}

Jika Anda sedang mengerjakan pustaka pengambilan data, ada aspek penting dari render-sembari-tarik yang tidak ingin Anda lewatkan. **Kita memulai penarikan _sebelum_ perenderan.** Lihat contoh kode ini lebih dekat:

```js
// Mulai penarikan di awal!
const resource = fetchProfileData();

// ...

function ProfileDetails() {
  // Mencoba membaca info pengguna
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/frosty-hermann-bztrp)**

Note that the `read()` call in this example doesn't *start* fetching. It only tries to read the data that is **already being fetched**. This difference is crucial to creating fast applications with Suspense. We don't want to delay loading data until a component starts rendering. As a data fetching library author, you can enforce this by making it impossible to get a `resource` object without also starting a fetch. Every demo on this page using our "fake API" enforces this.


You might object that fetching "at the top level" like in this example is impractical. What are we going to do if we navigate to another profile's page? We might want to fetch based on props. The answer to this is **we want to start fetching in the event handlers instead**. Here is a simplified example of navigating between user's pages:

```js{1,2,10,11}
// First fetch: as soon as possible
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Next fetch: when the user clicks
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

With this approach, we can **fetch code and data in parallel**. When we navigate between pages, we don't need to wait for a page's code to load to start loading its data. We can start fetching both code and data at the same time (during the link click), delivering a much better user experience.

This poses a question of how do we know *what* to fetch before rendering the next screen. There are several ways to solve this (for example, by integrating data fetching closer with your routing solution). If you work on a data fetching library, [Building Great User Experiences with Concurrent Mode and Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) presents a deep dive on how to accomplish this and why it's important.

### We're Still Figuring This Out {#were-still-figuring-this-out}

Suspense itself as a mechanism is flexible and doesn't have many constraints. Product code needs to be more constrained to ensure no waterfalls, but there are different ways to provide these guarantees. Some questions that we're currently exploring include:

* Fetching early can be cumbersome to express. How do we make it easier to avoid waterfalls?
* When we fetch data for a page, can the API encourage including data for instant transitions *from* it?
* What is the lifetime of a response? Should caching be global or local? Who manages the cache?
* Can Proxies help express lazy-loaded APIs without inserting `read()` calls everywhere?
* What would the equivalent of composing GraphQL queries look like for arbitrary Suspense data?

Relay has its own answers to some of these questions. There is certainly more than a single way to do it, and we're excited to see what new ideas the React community comes up with.

## Suspense and Race Conditions {#suspense-and-race-conditions}

Race conditions are bugs that happen due to incorrect assumptions about the order in which our code may run. Fetching data in the `useEffect` Hook or in class lifecycle methods like `componentDidUpdate` often leads to them. Suspense can help here, too — let's see how.

To demonstrate the issue, we will add a top-level `<App>` component that renders our `<ProfilePage>` with a button that lets us **switch between different profiles**:

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Next
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

Let's compare how different data fetching strategies deal with this requirement.

### Race Conditions with `useEffect` {#race-conditions-with-useeffect}

First, we'll try a version of our original "fetch in effect" example. We'll modify it to pass an `id` parameter from the `<ProfilePage>` props to `fetchUser(id)` and `fetchPosts(id)`:

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Loading profile...</p>;
  }
  return (
    <>
      <h1>{user.name}</h1>
      <ProfileTimeline id={id} />
    </>
  );
}

function ProfileTimeline({ id }) {
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    fetchPosts(id).then(p => setPosts(p));
  }, [id]);

  if (posts === null) {
    return <h2>Loading posts...</h2>;
  }
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

Note how we also changed the effect dependencies from `[]` to `[id]` — because we want the effect to re-run when the `id` changes. Otherwise, we wouldn't refetch new data.

If we try this code, it might seem like it works at first. However, if we randomize the delay time in our "fake API" implementation and press the "Next" button fast enough, we'll see from the console logs that something is going very wrong. **Requests from the previous profiles may sometimes "come back" after we've already switched the profile to another ID -- and in that case they can overwrite the new state with a stale response for a different ID.**

This problem is possible to fix (you could use the effect cleanup function to either ignore or cancel stale requests), but it's unintuitive and difficult to debug.

### Race Conditions with `componentDidUpdate` {#race-conditions-with-componentdidupdate}

One might think that this is a problem specific to `useEffect` or Hooks. Maybe if we port this code to classes or use convenient syntax like `async` / `await`, it will solve the problem?

Let's try that:

```js
class ProfilePage extends React.Component {
  state = {
    user: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const user = await fetchUser(id);
    this.setState({ user });
  }
  render() {
    const { id } = this.props;
    const { user } = this.state;
    if (user === null) {
      return <p>Loading profile...</p>;
    }
    return (
      <>
        <h1>{user.name}</h1>
        <ProfileTimeline id={id} />
      </>
    );
  }
}

class ProfileTimeline extends React.Component {
  state = {
    posts: null,
  };
  componentDidMount() {
    this.fetchData(this.props.id);
  }
  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.fetchData(this.props.id);
    }
  }
  async fetchData(id) {
    const posts = await fetchPosts(id);
    this.setState({ posts });
  }
  render() {
    const { posts } = this.state;
    if (posts === null) {
      return <h2>Loading posts...</h2>;
    }
    return (
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.text}</li>
        ))}
      </ul>
    );
  }
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

This code is deceptively easy to read.

Unfortunately, neither using a class nor the `async` / `await` syntax helped us solve this problem. This version suffers from exactly the same race conditions, for the same reasons.

### The Problem {#the-problem}

React components have their own "lifecycle". They may receive props or update state at any point in time. However, each asynchronous request *also* has its own "lifecycle". It starts when we kick it off, and finishes when we get a response. The difficulty we're experiencing is "synchronizing" several processes in time that affect each other. This is hard to think about.

### Solving Race Conditions with Suspense {#solving-race-conditions-with-suspense}

Let's rewrite this example again, but using Suspense only:

```js
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        setResource(fetchProfileData(nextUserId));
      }}>
        Next
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Loading posts...</h1>}>
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

In the previous Suspense example, we only had one `resource`, so we held it in a top-level variable. Now that we have multiple resources, we moved it to the `<App>`'s component state:

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

When we click "Next", the `<App>` component kicks off a request for the next profile, and passes *that* object down to the `<ProfilePage>` component:

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Next
    </button>
    <ProfilePage resource={resource} />
  </>
```

Again, notice that **we're not waiting for the response to set the state. It's the other way around: we set the state (and start rendering) immediately after kicking off a request**. As soon as we have more data, React "fills in" the content inside `<Suspense>` components.

This code is very readable, but unlike the examples earlier, the Suspense version doesn't suffer from race conditions. You might be wondering why. The answer is that in the Suspense version, we don't have to think about *time* as much in our code. Our original code with race conditions needed to set the state *at the right moment later*, or otherwise it would be wrong. But with Suspense, we set the state *immediately* -- so it's harder to mess it up.

## Handling Errors {#handling-errors}

When we write code with Promises, we might use `catch()` to handle errors. How does this work with Suspense, given that we don't *wait* for Promises to start rendering?

With Suspense, handling fetching errors works the same way as handling rendering errors -- you can render an [error boundary](/docs/error-boundaries.html) anywhere to "catch" errors in components below.

First, we'll define an error boundary component to use across our project:

```js
// Error boundaries currently have to be classes.
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

And then we can put it anywhere in the tree to catch errors:

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Loading profile...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Could not fetch posts.</h2>}>
        <Suspense fallback={<h1>Loading posts...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Try it on CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

It would catch both rendering errors *and* errors from Suspense data fetching. We can have as many error boundaries as we like but it's best to [be intentional](https://aweary.dev/fault-tolerance-react/) about their placement.

## Next Steps {#next-steps}

We've now covered the basics of Suspense for Data Fetching! Importantly, we now better understand *why* Suspense works this way, and how it fits into the data fetching space.

Suspense answers some questions, but it also poses new questions of its own:

* If some component "suspends", does the app freeze? How to avoid this?
* What if we want to show a spinner in a different place than "above" the component in a tree?
* If we intentionally *want* to show an inconsistent UI for a small period of time, can we do that?
* Instead of showing a spinner, can we add a visual effect like "greying out" the current screen?
* Why does our [last Suspense example](https://codesandbox.io/s/infallible-feather-xjtbu) log a warning when clicking the "Next" button?

To answer these questions, we will refer to the next section on [Concurrent UI Patterns](/docs/concurrent-mode-patterns.html).
