---
id: concurrent-mode-suspense
title: Suspense untuk Penarikan Data (Eksperimental)
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

>Perhatian:
>
<<<<<<< HEAD
>Laman ini menjelaskan **fitur eksperimental yang [belum tersedia](/docs/concurrent-mode-adoption.html) dalam versi rilis yang stabil**. Jangan mengandalkan _build_ eksperimental dalam aplikasi React versi produksi. Fitur ini dapat berubah secara signifikan dan tanpa peringatan sebelum menjadi bagian dari React.
>
>Dokumentasi ini ditujukan untuk pengguna awal dan orang-orang yang penasaran. **Kalau anda baru menggunakan React, jangan khawatir tentang fitur ini** -- anda tidak perlu mempelajarinya sekarang.
=======
>This page was about experimental features that aren't yet available in a stable release. It was aimed at early adopters and people who are curious.
>
>Much of the information on this page is now outdated and exists only for archival purposes. **Please refer to the [React 18 Alpha announcement post](/blog/2021/06/08/the-plan-for-react-18.html
) for the up-to-date information.**
>
>Before React 18 is released, we will replace this page with stable documentation.
>>>>>>> 0cddca13ddebb3ed19c1124723e10d006a5457fc

</div>

React 16.6 menambahkan komponen `<Suspense>` yang memungkinkan Anda "menunggu" kode untuk dimuat dan menentukan keadaan pemintal pemuatan secara deklaratif.

```jsx
const ProfilePage = React.lazy(() => import('./ProfilePage')); // Lazy-loaded

// Menampilkan pemintal ketika masih memuat profil
<Suspense fallback={<Spinner />}>
  <ProfilePage />
</Suspense>
```

Suspense untuk Penarikan Data adalah sebuah fitur baru yang juga memungkinkan Anda menggunakan `<Suspense>` untuk **secara deklaratif "menunggu" hal-hal yang lainnya, termasuk data.** Halaman ini berfokus pada kasus penarikan data, tetapi ini bisa juga menunggu gambar, kode, atau pekerjaan asinkron lainnya.

- [Apa Sebenarnya Suspense Itu?](#what-is-suspense-exactly)
  - [Apa yang Bukan Suspense](#what-suspense-is-not)
  - [Apa yang Mungkin Anda Lakukan dengan Suspense](#what-suspense-lets-you-do)
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
  - [Kondisi Balapan dengan componentDidUpdate](#race-conditions-with-componentdidupdate)
  - [Masalah](#the-problem)
  - [Memecahkan Kondisi Balapan dengan Suspense](#solving-race-conditions-with-suspense)
- [Penanganan Eror](#handling-errors)
- [Langkah Selanjutnya](#next-steps)

## Apa Sebenarnya Suspense Itu? {#what-is-suspense-exactly}

Suspense memungkinkan komponen Anda "menunggu" sesuatu sebelum mereka bisa dirender. Pada [contoh ini](https://codesandbox.io/s/frosty-hermann-bztrp), dua komponen menunggu sebuah pemanggilan API secara asinkron untuk penarikan suatu data:

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

<<<<<<< HEAD
Suspense bukan merupakan pustaka untuk penarikan data. Dia adalah sebuah **mekanisme bagi pustaka penarikan data** untuk berkomunikasi dengan React dimana *data yang dibaca sebuah komponen belum siap*. React bisa menunggunya hingga siap dan kemudian memperbarui UI-nya. Di Facebook, kita menggunakan Relay dan [integrasi dengan Suspense yang baru](https://relay.dev/docs/en/experimental/step-by-step)
=======
Suspense is not a data fetching library. It's a **mechanism for data fetching libraries** to communicate to React that *the data a component is reading is not ready yet*. React can then wait for it to be ready and update the UI. At Facebook, we use Relay and its [new Suspense integration](https://relay.dev/docs/getting-started/step-by-step-guide/). We expect that other libraries like Apollo can provide similar integrations.
>>>>>>> 0cddca13ddebb3ed19c1124723e10d006a5457fc

Dalam jangka panjang, kita berniat agar Suspense menjadi cara utama untuk membaca data asinkron pada suatu komponen -- tidak peduli darimanapun datangnya

### Apa yang Bukan Suspense {#what-suspense-is-not}

Suspense secara signifikan berbeda dengan pendekatan yang sudah ada pada masalah-masalah ini, jadi membaca tentang hal ini untuk pertama kali sering kali mengarah ke kesalahpahaman. Mari klarifikasi beberapa yang paling umum:

 * **Ini bukan merupakan implementasi penarikan data.** Suspense tidak mengasumsikan Anda menggunakan GraphQL, REST, atau format data, pustaka, pengangkut, dan protokol lainnya.

<<<<<<< HEAD
 * **Ini bukan merupakan klien yang siap digunakan.** Anda tidak bisa "mengganti" `fetch` atau Relay dengan Suspense. Tetapi Anda bisa menggunakan pustaka yang terintegrasi dengan Suspense (contohnya, [API Relay yang baru](https://relay.dev/docs/en/experimental/api-reference)).
=======
 * **It is not a ready-to-use client.** You can't "replace" `fetch` or Relay with Suspense. But you can use a library that's integrated with Suspense (for example, [new Relay APIs](https://relay.dev/docs/api-reference/relay-environment-provider/)).
>>>>>>> 0cddca13ddebb3ed19c1124723e10d006a5457fc

 * **Ini tidak menggandeng penarikan data pada lapisan tampilan.** Suspense membantu orkestrasi dalam menampilkan keadaan pemuatan pada antarmuka Anda, tetapi tidak mengikat logika jaringan pada komponen React.

### Apa yang Mungkin Anda Lakukan dengan Suspense {#what-suspense-lets-you-do}

Jadi, apakah poin dari Suspense? Terdapat beberapa cara untuk kita dapat menjawabnya:

* **Ini memungkinkan pustaka penarikan data terintegrasi secara mendalam dengan React.** Jika pustaka penarikan data mengimplementasikan dukungan Suspense, menggunakannya dari komponen React terasa sangat natural.

* **Ini memungkinkan Anda mengatur keadaan pemuatan yang dirancang dengan maksud tertentu.** Suspense tidak menyatakan _bagaimana_ data ditarik, tetapi memungkinkan Anda mengontrol urutan pemuatan visual pada aplikasi Anda.

* **Ini membantu Anda terhindar dari kondisi balapan.** Bahkan dengan `await`, kode asinkron sering rawan kesalahan. Suspense lebih terasa seperti membaca data secara *sinkron* yang seolah-olah sudah dimuat.

## Penggunaan Suspense dalam Praktik {#using-suspense-in-practice}

<<<<<<< HEAD
Di Facebook, sejauh ini kami hanya menggunakan integrasi Relay dengan Suspense dalam produksi. **Jika Anda mencari panduan praktis untuk memulai hari ini, [lihat Panduan Relay](https://relay.dev/docs/en/experimental/step-by-step)!** Hal itu menunjukkan pola yang sudah bekerja dengan baik bagi kita dalam produksi.
=======
At Facebook, so far we have only used the Relay integration with Suspense in production. **If you're looking for a practical guide to get started today, [check out the Relay Guide](https://relay.dev/docs/getting-started/step-by-step-guide/)!** It demonstrates patterns that have already worked well for us in production.
>>>>>>> 0cddca13ddebb3ed19c1124723e10d006a5457fc

**Demo kode pada halaman ini menggunakan implementasi API "palsu" daripada Relay.** Hal itu membuat mereka lebih mudah dimengerti jika Anda tidak terbiasa dengan GraphQL, tetapi mereka tidak akan memberi tahu Anda "cara yang benar" untuk membangun aplikasi dengan Suspense. Halaman ini lebih konseptual dan dimaksudkan untuk membantu Anda melihat *mengapa* Suspense bekerja dengan cara tertentu, dan masalah apa yang dipecahkannya.

### Bagaimana Jika Saya Tidak Menggunakan Relay? {#what-if-i-dont-use-relay}

Jika Anda tidak menggunakan Relay hari ini, Anda mungkin harus menunggu sebelum benar-benar dapat mencoba Suspense di aplikasi Anda. Sejauh ini, ini adalah satu-satunya implementasi yang kami uji dalam produksi dan merasa percaya diri.

Selama beberapa bulan ke depan, banyak pustaka yang akan muncul dengan pandangan berbeda pada Suspense APIs. **Jika Anda lebih memilih belajar ketika segalanya lebih stabil, Anda mungkin lebih memilih untuk mengabaikan Suspense untuk saat ini, dan kembali ketika ekosistemnya lebih matang.**

Anda juga dapat menulis integrasi Anda sendiri untuk pustaka penarikan data, jika Anda mau.

### Untuk Pembuat Pustaka {#for-library-authors}

Kami berharap dapat melihat banyak eksperimen di komunitas dengan pustaka lain. Ada satu hal penting yang perlu diperhatikan untuk penulis pustaka penarikan data.

Meskipun secara teknis bisa dilakukan, Suspense saat ini **tidak** dimaksudkan sebagai cara untuk mulai menarik data saat komponen dirender. Sebaliknya, Suspense memungkinkan komponen untuk menyatakan bahwa mereka "menunggu" data yang *sedang ditarik*. **[Membangun Pengalaman Pengguna yang Hebat dengan Mode Konkuren dan Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) menjelaskan mengapa hal ini penting dan bagaimana menerapkan pola ini dalam praktik.**

<<<<<<< HEAD
Kecuali Anda memiliki solusi yang membantu mencegah _waterfalls_, kami sarankan untuk memilih API yang mendukung atau memberlakukan penarikan sebelum render. Sebagai contoh nyata, Anda bisa melihat bagaimana cara [Relay Suspense API](https://relay.dev/docs/en/experimental/api-reference#usepreloadedquery) memberlakukan _preloading_. Pesan kami tentang ini belum terlalu konsisten di masa lalu. Suspense untuk Penarikan Data masih bersifat percobaan, sehingga Anda dapat mengharapkan rekomendasi kami berubah seiring waktu karena kami belajar lebih banyak dari penggunaan produksi dan memahami ruang masalah dengan lebih baik.
=======
Unless you have a solution that helps prevent waterfalls, we suggest to prefer APIs that favor or enforce fetching before render. For a concrete example, you can look at how [Relay Suspense API](https://relay.dev/docs/api-reference/use-preloaded-query/) enforces preloading. Our messaging about this hasn't been very consistent in the past. Suspense for Data Fetching is still experimental, so you can expect our recommendations to change over time as we learn more from production usage and understand the problem space better.
>>>>>>> 0cddca13ddebb3ed19c1124723e10d006a5457fc

## Pendekatan Tradisional vs Suspense {#traditional-approaches-vs-suspense}

Kami dapat memperkenalkan Suspense tanpa menyebutkan pendekatan penarikan data populer. Namun, ini membuatnya lebih sulit untuk melihat masalah mana yang dipecahkan oleh Suspense, mengapa masalah ini layak untuk dipecahkan, dan bagaimana Suspense berbeda dari solusi yang sudah ada.

Sebagai gantinya, kita akan melihat Suspense sebagai langkah logis berikutnya dalam serangkaian pendekatan:

* **Tarik-saat-render (contohnya, `fetch` di dalam `useEffect`):** Mulai merender komponen. Masing-masing komponen ini dapat memicu penarikan data dalam efek dan silklus hidup mereka. Pendekatan ini sering mengarah pada "waterfall".
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

Pada halaman ini, kita tidak mengasumsikan pengetahuan tentang Relay, jadi kita tidak akan menggunakannya untuk contoh ini. Sebagai gantinya, kita akan menulis sesuatu yang serupa secara manual dengan menggabungkan metode penarikan data kita:

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

Kita telah memecahkan masalah "waterfalls" jaringan sebelumnya, tetapi secara tidak sengaja memperkenalkan suatu hal yang berbeda. Kita menunggu *semua* data untuk kembali dengan `Promise.all()` di dalam `fetchProfileData`, jadi sekarang kita tidak dapat merender detail profil hingga kirimannya sudah ditarik juga. Kita harus menunggu keduanya.

Tentu saja, ini dimungkinkan untuk diperbaiki dalam contoh khusus ini. Kita dapat menghapus pemanggilan `Promise.all()`, dan menunggu kedua _Promise_ secara terpisah. Namun, pendekatan ini semakin sulit seiring dengan semakin kompleksnya data dan komponen kita. Sulit untuk menulis komponen yang andal ketika suatu bagian acak dari pohon data mungkin hilang atau basi. Jadi menarik semua data untuk layar baru dan *kemudian* melakukan perenderan seringkali merupakan opsi yang lebih praktis.

### Pendekatan 3: Render-Sembari-Tarik (menggunakan Suspense) {#approach-3-render-as-you-fetch-using-suspense}

Pada pendekatan sebelumnya, kita menari kdata sebelum memanggil `setState`:

1. Mulai penarikan
2. Selesai penarikan
3. Mulai perenderan

Dengan Suspense, kita aka mulai penarikan terlebih dahulu, tetapi kita menukar dua langkah terakhir:

1. Mulai penarikan
2. **Mulai perenderan**
3. **Selesai penarikan**

**Dengan Suspense, kita tidak menunggu respons kembali sebelum kita mulai merender.** Faktanya, kita mulai perenderan *segera* setelah memulai penarikan jaringan:

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

Perhatikan bahwa pemanggilan `read()` dalam contoh ini tidak *memulai* penarikan. Dia hanya mencoba untuk membaca data yang **sudah tertarik**. Perbedaan tersebut sangat penting untuk membuat aplikasi yang cepat dengan Suspense. Kita tidak ingin menunda pemuatan data hingga komponen mulai dirender. Sebagai pembuat pustaka penarikan data, Anda bisa memberlakukan hal tersebut dengan membuatnya tidak mungkin untuk mendapatkan objek `resource` tanpa memulai penarikan data. Setiap demo di halaman ini yang menggunakan "API palsu" kami memberlakukan hal tersebut.

Anda mungkin keberatan bahwa penarikan "di tingkat atas" seperti dalam contoh itu tidak praktis. Apa yang akan kita lakukan jika kita melakukan navigasi ke halaman profil lain? Kita mungkin ingin menarik berdasarkan propertinya. Jawabannya adalah **kita ingin mulai penarikan dalam event handlers**. Berikut adalah contoh yang disederhanakan dari navigasi di antara halaman pengguna:

```js{1,2,10,11}
// Penarikan pertama: seawal mungkin
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
  return (
    <>
      <button onClick={() => {
        const nextUserId = getNextId(resource.userId);
        // Penarikan selanjutnya: ketika pengguna mengeklik
        setResource(fetchProfileData(nextUserId));
      }}>
        Berikutnya
      </button>
      <ProfilePage resource={resource} />
    </>
  );
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**
 
Dengan pendekatan ini, kita dapat **mengambil kode dan data secara paralel**. Saat kita melakukan navigasi antar halaman, kita tidak perlu menunggu kode halaman dimuat untuk mulai memuat datanya. Kita dapat mulai mengambil kode dan data sekaligus (pada saat klik tautan), memberikan pengalaman pengguna yang jauh lebih baik.

Ini menimbulkan pertanyaan tentang bagaimana kita tahu *apa* yang harus ditarik sebelum merender layar berikutnya. Ada beberapa cara untuk mengatasi ini (misalnya, dengan mengintegrasikan penarikan data semakin dekat dengan solusi routing Anda). Jika Anda mengerjakan pustaka pengambilan data, [Membangun Pengalaman Hebat Pengguna dengan Mode Konkuren dan Suspense](/blog/2019/11/06/building-great-user-experiences-with-concurrent-mode-and-suspense.html) menyajikan penyelaman mendalam tentang bagaimana mencapai hal tersebut dan mengapa hal tersebut penting.

### Kita Masih Memikirkan Ini {#were-still-figuring-this-out}

Suspense itu sendiri sebagai suatu mekanisme adalah fleksibel dan tidak memiliki banyak batasan. Kode produk perlu lebih dibatasi untuk memastikan tidak ada waterfalls, tetapi ada berbagai cara untuk memberikan jaminan ini. Beberapa pertanyaan yang saat ini kita eksplorasi meliputi:

* Mengambil lebih awal bisa jadi rumit untuk diungkapkan. Bagaimana kita membuatnya lebih mudah untuk menghindari waterfall?
* Ketika kita menarik data untuk sebuah halaman, dapatkah API mendorong mengikutsertakan data untuk transisi instan *darinya*?
* Apa umur tanggapan itu? Haruskah caching bersifat global atau lokal? Siapa yang mengelola cache?
* Dapatkah Proxy membantu mengekspresikan API yang dimuat secara lazy-loaded tanpa memasukkan pemanggilan `read()` di mana-mana?
* Seperti apakah hal yang setara dengan penulisan query GraphQL untuk data Suspense yang berubah-ubah?

Relay memiliki jawaban sendiri untuk beberapa pertanyaan ini. Tentu ada lebih dari satu cara untuk melakukannya, dan kita senang melihat ide-ide baru apa yang muncul dari komunitas React.

## Suspense and Kondisi Balapan {#suspense-and-race-conditions}

Kondisi balapan adalah kesalahan program yang terjadi karena asumsi yang salah tentang urutan yang mungkin kode kita dapat jalankan. Mengambil data di Hook `useEffect` atau metode siklus hidup class seperti` componentDidUpdate` sering mengarah ke hal-hal tersebut. Suspense juga dapat membantu di sini - mari kita lihat caranya.

Untuk menunjukkan masalah ini, kita akan menambahkan komponen `<App>` tingkat atas yang merender `<ProfilePage>` kita dengan tombol yang memungkinkan kita **beralih di antara berbagai profil**:

```js{9-11}
function getNextId(id) {
  // ...
}

function App() {
  const [id, setId] = useState(0);
  return (
    <>
      <button onClick={() => setId(getNextId(id))}>
        Berikutnya
      </button>
      <ProfilePage id={id} />
    </>
  );
}
```

Mari kita bandingkan bagaimana berbagai strategi penarikan data menangani kebutuhan ini.

### Kondisi Balapan dengan `useEffect` {#race-conditions-with-useeffect}

Pertama, kita akan mencoba contoh versi asli dari "menarik saat efek" kita. Kita akan memodifikasinya untuk meneruskan parameter `id` dari properti `<ProfilePage>` ke `fetchUser(id)` dan `fetchPosts(id)`:

```js{1,5,6,14,19,23,24}
function ProfilePage({ id }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(id).then(u => setUser(u));
  }, [id]);

  if (user === null) {
    return <p>Memuat profil...</p>;
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

**[Coba ini di CodeSandbox](https://codesandbox.io/s/nervous-glade-b5sel)**

Perhatikan bagaimana kita juga mengubah dependensi efek dari `[]` ke `[id]` - karena kita ingin efeknya dijalankan kembali ketika `id` berubah. Kalau tidak, kami tidak akan menarik kembali data baru.

Jika kita mencoba kode ini, mungkin seperti berhasil pada awalnya. Namun, jika kita mengacak waktu tunda dalam implementasi "API palsu" dan menekan tombol "Berikutnya" dengan cukup cepat, kita akan melihat dari log konsol bahwa ada sesuatu yang salah. **Permintaan dari profil sebelumnya kadang-kadang "kembali" setelah kita mengalihkan profil ke ID lain -- dan dalam kasus itu mereka dapat menimpa state baru dengan respons basi untuk ID yang berbeda.**

Masalah ini dapat diperbaiki (Anda dapat menggunakan fungsi pembersihan efek untuk mengabaikan atau membatalkan permintaan basi), tetapi tidak intuitif dan sulit untuk di-debug.

### Kondisi Balapan dengan `componentDidUpdate` {#race-conditions-with-componentdidupdate}

Orang mungkin berpikir bahwa ini adalah masalah khusus untuk `useEffect` atau Hooks. Mungkin jika kita memasukkan kode ini ke class atau menggunakan sintaks yang mudah digunakan seperti `async` /` await`, itu akan menyelesaikan masalah?

Mari kita coba:

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
      return <p>Memuatan profil...</p>;
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
}
```

**[Coba ini di Codesandbox](https://codesandbox.io/s/trusting-clarke-8twuq)**

Kode ini terlihat mudah dibaca.

Sayangnya, tidak menggunakan class atau sintaks `async` /` await` membantu ktia memecahkan masalah ini. Versi ini juga mengalami kondisi balapan yang persis sama, untuk sebab yang sama.

### Masalah {#the-problem}

Komponen React memiliki "siklus hidup" sendiri. Mereka dapat menerima properti atau memperbarui state kapan saja. Namun, setiap permintaan asinkron *juga* memiliki "siklus hidup" sendiri. Itu dimulai ketika kita memicunya, dan selesai ketika kita mendapatkan respons. Kesulitan yang kami alami adalah "menyinkronkan" beberapa proses sekaligus yang saling memengaruhi. Ini sulit dipikirkan.

### Memecahkan Kondisi Balapan dengan Suspense {#solving-race-conditions-with-suspense}

Mari tulis ulang contoh tersebut, tetapi dengan hanya menggunakan Suspense:

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
    <Suspense fallback={<h1>Memuat profil...</h1>}>
      <ProfileDetails resource={resource} />
      <Suspense fallback={<h1>Memuat kiriman...</h1>}>
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

**[Coba ini di CodeSandbox](https://codesandbox.io/s/infallible-feather-xjtbu)**

Dalam contoh Suspense sebelumnya, kita hanya memiliki satu `resource`, jadi kami menyimpannya dalam variabel tingkat atas. Sekarang kita memiliki banyak sumber daya, kami memindahkannya ke state komponen `<App>`:

```js{4}
const initialResource = fetchProfileData(0);

function App() {
  const [resource, setResource] = useState(initialResource);
```

Ketika kita mengklik "Berikutnya", komponen `<App>` memulai permintaan untuk profil berikutnya, dan meneruskan objek *tersebut* ke komponen` <ProfilePage> `:

```js{4,8}
  <>
    <button onClick={() => {
      const nextUserId = getNextId(resource.userId);
      setResource(fetchProfileData(nextUserId));
    }}>
      Berikutnya
    </button>
    <ProfilePage resource={resource} />
  </>
```

Sekali lagi, perhatikan bahwa **kita tidak menunggu respons untuk mengatur state. Itu sebaliknya: kita mengatur state (dan mulai merender) segera setelah memulai permintaan**. Segera setelah kita memiliki lebih banyak data, React "mengisi" konten di dalam komponen `<Suspense>`.

Kode ini sangat mudah dibaca, tetapi tidak seperti contoh sebelumnya, versi Suspense tidak mengalami kondisi balapan. Anda mungkin bertanya-tanya mengapa. Jawabannya adalah bahwa dalam versi Suspense, kita tidak perlu memikirkan terlu banyak tentang *waktu* dalam kode kita. Kode asli kita dengan kondisi balapan memerlukan pengaturan state *di saat yang tepat nantinya*, atau jika tidak maka akan salah. Tetapi dengan Suspense, kita mengatur state *seketika* -- jadi lebih sulit untuk mengacaukannya.

## Penanganan Eror {#handling-errors}

Ketika kita menulis kode dengan Promises, kita mungkin menggunakan `catch()` untuk menangani eror. Bagaimana cara kerjanya dengan Suspense, mengingat kita tidak *menunggu* Promises untuk memulai perenderan?

Dengan Suspense, menangani kesalahan penarikan bekerja dengan cara yang sama seperti menangani kesalahan perenderan - Anda dapat membuat [batas kesalahan](/docs/error-boundaries.html) di mana saja untuk "menangkap" kesalahan dalam komponen di bawah ini.

Pertama, kita akan mendefinisikan komponen batas kesalahan untuk digunakan di seluruh proyek kita:

```js
// Batas kesalahan saat ini harus berupa class
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

Dan kemudian kita bisa meletakkannya di mana saja di pohon untuk menangkap kesalahan:

```js{5,9}
function ProfilePage() {
  return (
    <Suspense fallback={<h1>Memuat profil...</h1>}>
      <ProfileDetails />
      <ErrorBoundary fallback={<h2>Tidak bisa mendapatkan kiriman.</h2>}>
        <Suspense fallback={<h1>Memuat kiriman...</h1>}>
          <ProfileTimeline />
        </Suspense>
      </ErrorBoundary>
    </Suspense>
  );
}
```

**[Coba ini di CodeSandbox](https://codesandbox.io/s/adoring-goodall-8wbn7)**

Ini akan menangkap kesalahan perenderan *dan* dari penarikan data Suspense. Kita dapat memiliki batas kesalahan sebanyak yang kita mau, tetapi selalu terbaik untuk bisa [beralasan](https://aweary.dev/fault-tolerance-react/) tentang penempatan mereka.

## Langkah Selanjutnya {#next-steps}

Kita sekarang telah membahas dasar-dasar Suspense untuk Penarikan Data! Yang terpenting, kita sekarang lebih memahami *mengapa* Suspense bekerja dengan cara ini, dan bagaimana itu cocok dengan masalah penarikan data.

Suspense menjawab beberapa pertanyaan, tetapi juga memunculkan pertanyaan baru:

* Jika beberapa komponen "ditangguhkan", apakah aplikasi dibekukan? Bagaimana cara menghindarinya?
* Bagaimana jika kita ingin menunjukkan pemintal di tempat yang berbeda dari  "di atas" komponen di pohon?
* Jika kita sengaja *ingin* menampilkan UI yang tidak konsisten untuk jangka waktu yang pendek, dapatkah kita melakukannya?
* Alih-alih menunjukkan pemintal, dapatkah kita menambahkan efek visual seperti "memudarkan" layar saat ini?
* Mengapa [contoh Suspense terakhir](https://codesandbox.io/s/infallible-feather-xjtbu) kita membuat log peringatan saat mengklik tombol "Berikutnya"?

Untuk menjawab pertanyaan-pertanyaan ini, kita akan merujuk ke bagian selanjutnya pada [Pola Mode Konkuren](/docs/concurrent-mode-patterns.html).
