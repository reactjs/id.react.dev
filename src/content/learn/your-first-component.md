---
title: Komponen Pertama Anda
---

<Intro>

Komponen merupakan salah satu konsep inti dari React. Komponen adalah fondasi di mana Anda bangun antarmuka pengguna (UI), yang membuat komponen tempat yang sempurna untuk memulai perjalan React Anda!

</Intro>

<YouWillLearn>

* Apa itu komponen
* Apa tugas yang dimainkan oleh komponen di dalam aplikasi React
* Bagaimana cara menulis komponen React pertama Anda

</YouWillLearn>

## Komponen: Pembangun Balok UI {/*components-ui-building-blocks*/}

Di dalam *web*, HTML memungkinkan kita membuat dokumen-dokumen terstruktur yang kaya dengan kumpulan *tag* bawaannya seperti `<h1>` dan `<li>`:

```html
<article>
  <h1>Komponen Pertama Saya</h1>
  <ol>
    <li>Komponen: Pembangun Balok UI</li>
    <li>Mendefinisikan suatu Komponen</li>
    <li>Menggunakan suatu Komponen</li>
  </ol>
</article>
```

*Markup* ini merepresentasikan artikel `<article>`, heading `<h1>` dan daftar isi (yang disingkat) sebagai daftar yang tersusun `<ol>`. *Markup* seperti ini, digabung dengan CSS untuk *style*, dan JavaScript untuk interaktivitas, berada di belakang setiap *sidebar*, *avatar*, *modal*, *dropdown*—setiap potongan UI yang Anda liat di dalam *web*.

React memungkinkan Anda menggabung *markup*, CSS, dan JavaScript Anda menjadi "komponen" yang dibuat khusus, **elemen UI yang dapat digunakan kembali untuk aplikasi Anda.** Daftar isi yang Anda lihat di atas dapat diubah menjadi sebuah komponen `<TableOfContents />` yang dapat Anda *render* pada setiap halaman. Dari belakang, itu tetap menggunakan *tag* HTML yang sama seperti `<article>`, `h1`, dll.

Sama seperti *tag* HTML, Anda dapat menggabung, mengurut, dan menyusun bertingkat komponen untuk mendesain halaman penuh. Misalnya, halaman dokumentasi ini yang Anda baca terbuat oleh komponen-komponen React: 

```js
<PageLayout>
  <NavigationHeader>
    <SearchBar />
    <Link to="/docs">Docs</Link>
  </NavigationHeader>
  <Sidebar />
  <PageContent>
    <TableOfContents />
    <DocumentationText />
  </PageContent>
</PageLayout>
```

Seiring berkembangnya proyek Anda, Anda akan memperhatikan bahwa banyak desain Anda bisa dikomposisi dengan menggunakan ulang komponen-komponen yang sudah Anda buat, mempercepatkan perkembangan proyek Anda. Daftar isi kita di atas bisa disertakan pada layar apapun dengan `<TableOfContents />`! Anda bisa memulai proyek Anda dengan cepat menggunakan ribuan komponen-komponen yang dibagi oleh komunitas *open source* React seperti [Chakra UI](https://chakra-ui.com/) dan [Material UI.](https://material-ui.com/)

## Mendefinisikan suatu komponen {/*defining-a-component*/}

Secara tradisional saat menciptakan halaman *web*, para pengembang *web* me-*mark-up* konten mereka kemudian menambahkan interaksi dengan sedikit JavaScript. Ini bekerja dengan baik ketika interaksi hanya menyenangkan-untuk-dimiliki di dalam *web*. Sekarang ini diharapkan banyak situs dan semua aplikasi. React mengutamakan interaktivitas dengan tetap menggunakan teknologi yang sama: **Sebuah komponen React adalah sebuah fungsi _JavaScript_ yang dapat Anda _tambahkan dengan markup_.** Inilah tampilannya (Anda bisa sunting contoh di bawah ini):

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3Am.jpg"
      alt="Katherine Johnson"
    />
  )
}
```

```css
img { height: 200px; }
```

</Sandpack>

Dan ini bagaimana cara membuat sebuah komponen:

### Langkah 1: Eksport komponennya {/*step-1-export-the-component*/}

awalan `export default` adalah sebuah [sintaksis JavaScript standar](https://developer.mozilla.org/docs/web/javascript/reference/statements/export) (tidak spesifik kepada React). Itu memungkinkan Anda menandai fungsi utama di sebuah file supaya Anda bisa mengimport itu dari *file-file* lain nantinya. (Lebih lanjut tentang mengimport di [Mengimport dan Mengeksport Komponen](/learn/importing-and-exporting-components)!)

### Langkah 2: Definisikan fungsinya {/*step-2-define-the-function*/}

Dengan `function Profile() { }` Anda mendefinisikan fungsi JavaScript dengan nama `Profile`.

<Pitfall>

Komponen React adalah fungsi JavaScript biasa, tetapi **nama mereka harus dimulai dengan huruf kapital** atau tidak akan berfungsi!

</Pitfall>

### Langkah 3: Tambahkan *markup* {/*step-3-add-markup*/}

Komponen itu mengembalikan *tag* `<img />` dengan atribut `src` dan `alt`. `<img />` ditulis seperti HTML, tetapi ini sebenarnya merupakan JavaScript di belakang! Sintaksis ini disebut [JSX](/learn/writing-markup-with-jsx), dan ini memungkinkan Anda untuk *embed* *markup* di dalam JavaScript.

Pernyataan-pernyataan yang dikembalikan bisa ditulis semua pada satu baris, seperti dalam komponen ini.

```js
return <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />;
```

Tetapi jika *markup* Anda tidak semua ada di baris yang sama dengan *keyword* `return`, Anda harus membungkus itu dalam tanda kurung:

```js
return (
  <div>
    <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  </div>
);
```

<Pitfall>

Tanpa tanda kurung, kode apapun di baris-baris setelah `return` [akan diabaikan](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)!

</Pitfall>

## Menggunakan suatu komponen {/*using-a-component*/}

Sekarang setelah Anda mendefinisikan komponen `Profile` Anda, Anda bisa meletakkan itu di dalam komponen-komponen lain secara bertingkat. Misalnya, Anda bisa eksport sebuah komponen `Gallery` yang menggunakan beberapa komponen `Profile`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/MK3eW3As.jpg"
      alt="Katherine Johnson"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Ilmuwan yang luar biasa</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

### Apa yang dilihat oleh peramban {/*what-the-browser-sees*/}

Perhatikanlah perbedaan pada huruf kapitalisasi:

* `<section>` dimulai dengan huruf kecil, supaya React mengetahui bahwa kita merujuk pada *tag* HTML.
* `<Profile />` dimulai dengan huruf kapital `P`, supaya React mengetahui bahwa kita ingin menggunakan komponen kita bernama `Profile`.

Dan `Profile` berisi lebih banyak HTML: `<img />`. Pada akhirnya, inilah yang dilihat oleh peramban:

```html
<section>
  <h1>Ilmuwan yang luar biasa</h1>
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
  <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
</section>
```

### Menyusun secara bertingkat dan mengorganisir komponen {/*nesting-and-organizing-components*/}

Komponen adalah fungsi JavaScript biasa, sehingga Anda bisa menjaga beberapa komponen di dalam *file* yang sama. Ini nyaman ketika komponen-komponen relatif kecil atau saling terkait secara erat. Jika *file* ini menjadi ramai, Anda selalu bisa memindahkan `Profile` kepada suatu *file* yang beda. Anda akan belajar bagaimana cara melakukan ini segera di [halaman tentang import.](/learn/importing-and-exporting-components)

Karena komponen-komponen `Profile` di-*render* di dalam `Gallery`—bahkan beberapa kali!—kita dapat mengatakan bahwa `Gallery` adalah sebuah **komponen induk,** yang me-*render* setiap `Profile` sebagai sebuah "anak". Ini merupakan bagian ajaib dari React: Anda bisa mendefinisikan suatu komponen sekali, kemudian digunakan di banyak tempat dan sebanyak kali yang Anda suka.

<Pitfall>

Komponen dapat me-*render* komponen lain, tetapi **Anda tidak boleh menyusun definisinya secara bertingkat:**

```js {2-5}
export default function Gallery() {
  // 🔴 Jangan mendefinisi suatu komponen di dalam komponen lain!
  function Profile() {
    // ...
  }
  // ...
}
```

Potongan di atas [sangat lambat dan mengakibatkan *bug*.](/learn/preserving-and-resetting-state#different-components-at-the-same-position-reset-state) Sebagai gantinya, definisikan setiap komponen di tingkat atas:

```js {5-8}
export default function Gallery() {
  // ...
}

// ✅ Deklarasikan komponen di tingkat atas
function Profile() {
  // ...
}
```

Ketika suatu komponen anak membutuhkan data dari suatu induk, [operkan data melalui *props*](/learn/passing-props-to-a-component) daripada menyusun definisinya secara bertingkat.

</Pitfall>

<DeepDive>

#### Komponen sampai ke bawah {/*components-all-the-way-down*/}

Aplikasi React Anda dimulai dari suatu komponen "*root*". Biasanya, itu dibuat secara otomatis saat Anda memulai proyek baru. Misalnya, jika Anda menggunakan [CodeSandbox](https://codesandbox.io/) atau [Create React App](https://create-react-app.dev/), komponen *root* didefinisikan di `src/App.js`. Jika Anda menggunakan *framework* [Next.js](https://nextjs.org/), komponen *root* didefinisikan di `pages/index.js`. Dalam contoh-contoh berikut, Anda telah mengeksport komponen-komponen *root*.

Sebagian besar aplikasi React menggunakan komponen sampai ke bawah. Ini berarti Anda tidak akan hanya menggunakan komponen untuk bagian-bagian yang dapat digunakan kembali seperti tombol, tetapi juga bagian-bagian yang lebih besar seperti *sidebar*, daftar, dan juga, halaman lengkap! Komponen adalah sebuah cara yang praktis untuk mengorganisir kode UI dan *markup*, bahkan jika beberapa darinya hanya digunakan sekali.

[*Framework-framework* berbasis React](/learn/start-a-new-react-project) mengambil ini selangkah lebih jauh. Daripada menggunakan sebuah *file* HTML yang kosong dan membiarkan React untuk "mengambil alih" dalam mengelola halamannya dengan JavaScript, mereka *juga* membuat HTML-nya secara otomatis dari komponen-komponen React Anda. Ini memungkinkan aplikasi Anda menampilkan beberapa konten sebelum kode JavaScript dimuat.

Namun, banyak *website* hanya menggunakan React untuk [menambahkan interaktivitas kepada halaman HTML yang sudah ada.](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page) Mereka memiliki banya komponen *root* daripada satu untuk seluruh halaman. Anda dapat menggunakan React sebanyaknya-banyaknya—atau sesedikit mungkin—sesuai dengan yang dibutuhkan.

</DeepDive>

<Recap>

Anda baru saja mendapatkan rasa pertama Anda dari React! Mari kita rekap beberapa poin penting.

* React memungkinkan Anda untuk membuat komponen, **elemen UI yang dapat digunakan kembali untuk aplikasi Anda**
* Dalam suatu aplikasi React, setiap bagian dari UI adalah sebuah komponen.
* Komponen React adalah fungsi JavaScript biasa kecuali:
  
  1. Nama mereka selalu dimulai dengan huruf kapital.
  2. Mereka selalu mengembalikan *markup* JSX.  

</Recap>



<Challenges>

#### Eksport komponen tersebut {/*export-the-component*/}

*Sandbox* ini tidak dapat bekerja karena komponen *root* tidak dieksport:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Coba perbaiki sendiri sebelum melihat pada solusinya!

<Solution>

Tambahkan `export default` sebelum definisi fungsi seperti ini:

<Sandpack>

```js
export default function Profile() {
  return (
    <img
      src="https://i.imgur.com/lICfvbD.jpg"
      alt="Aklilu Lemma"
    />
  );
}
```

```css
img { height: 181px; }
```

</Sandpack>

Anda mungkin heran mengapa menulis `export` sendiri tidak cukup untuk memperbaiki contoh ini. Anda bisa belajar perbedaan dari `export` dan `export default` di [Mengimport dan Mengeksport Komponen.](/learn/importing-and-exporting-components)

</Solution>

#### Perbaikilah pernyataan pengembalian {/*fix-the-return-statement*/}

Ada yang tidak benar tentang pernyataan `return` ini. Dapatkah Anda memperbaikinya?

<Hint>

Anda mungkin mendapatkan sebuah kesalahan "*Unexpected Token*" saat mencoba memperbaiki ini. Dalam hal itu, cek kembali bahwa titik koma muncul *setelah* tanda kurung. Meletakkan suatu titik koma di dalam `return ( )` akan mengakibatkan sebuah kesalahan.

</Hint>


<Sandpack>

```js
export default function Profile() {
  return
    <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

<Solution>

Anda dapat memperbaiki komponen ini dengan memindahkan penyataan pengembalian kepada satu baris seperti ini:

<Sandpack>

```js
export default function Profile() {
  return <img src="https://i.imgur.com/jA8hHMpm.jpg" alt="Katsuko Saruhashi" />;
}
```

```css
img { height: 180px; }
```

</Sandpack>

Atau dengan membungkus *markup* JSX yang dikembalikan di dalam tanda kurung yang terbuka setelah `return`:

<Sandpack>

```js
export default function Profile() {
  return (
    <img 
      src="https://i.imgur.com/jA8hHMpm.jpg" 
      alt="Katsuko Saruhashi" 
    />
  );
}
```

```css
img { height: 180px; }
```

</Sandpack>

</Solution>

#### Temukanlah kesalahannya {/*spot-the-mistake*/}

Ada yang salah dengan bagaimana komponen `Profile` dideklarasi dan digunakan. Dapatkah Anda temukan masalahnya? (Coba untuk mengingat kembali bagaimana React membedakan komponen dengan *tag* HTML biasa!)

<Sandpack>

```js
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Ilmuwan yang luar biasa</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; height: 90px; }
```

</Sandpack>

<Solution>

Nama dari komponen React harus dimulai dengan huruf kapital.

Ubahlah `function profile()` menjadi `function Profile()`, kemudian ubah setiap `<profile />` menjadi `<Profile />`:

<Sandpack>

```js
function Profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Ilmuwan yang luar biasa</h1>
      <Profile />
      <Profile />
      <Profile />
    </section>
  );
}
```

```css
img { margin: 0 10px 10px 0; }
```

</Sandpack>

</Solution>

#### Komponen Anda sendiri {/*your-own-component*/}

Tulislah sebuah komponen dari awal. Anda bisa memberikannya nama apapun yang benar dan mengembalikan *markup* apapun. Jika Anda kehabisan ide, Anda bisa tulis sebuah komponen `Congratuliations` yang menampilkan `<h1>Kerja bagus!</h1>`. Jangan lupa untuk dieksport!

<Sandpack>

```js
// Tulislah komponen Anda di bawah ini!

```

</Sandpack>

<Solution>

<Sandpack>

```js
export default function Congratulations() {
  return (
    <h1>Kerja bagus!</h1>
  );
}
```

</Sandpack>

</Solution>

</Challenges>
