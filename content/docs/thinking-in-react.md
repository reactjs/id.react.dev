---
id: thinking-in-react
title: Cara Berpikir Dengan React
permalink: docs/thinking-in-react.html
redirect_from:
  - 'blog/2013/11/05/thinking-in-react.html'
  - 'docs/thinking-in-react-zh-CN.html'
prev: composition-vs-inheritance.html
---

React, menurut opini kami, adalah cara paling terdepan dalam membangun sebuah aplikasi web JavaScript yang besar dan cepat. React dapat mengatasi masalah skalabilitas dengan sangat baik untuk kami di Facebook dan Instagram.

Salah satu keunggulan dari React adalah bagaimana ia dapat membuat Anda berpikir mengenai aplikasi Anda ketika membangun aplikasi tersebut. Dalam dokumen ini, kami akan mengajak Anda melewati proses berpikir dalam membangun sebuah tabel data produk yang memiliki fitur pencarian menggunakan React.

## Mulailah Dengan Sebuah Rancang Bangun {#start-with-a-mock}

Bayangkan kita telah memiliki sebuah API JSON dan sebuah rancang bangun dari desainer. Rancang bangun kita terlihat seperti ini:

![Mockup](../images/blog/thinking-in-react-mock.png)

API JSON kita akan mengembalikan beberapa data yang akan terlihat seperti ini:

```
[
  {category: "Sporting Goods", price: "$49.99", stocked: true, name: "Football"},
  {category: "Sporting Goods", price: "$9.99", stocked: true, name: "Baseball"},
  {category: "Sporting Goods", price: "$29.99", stocked: false, name: "Basketball"},
  {category: "Electronics", price: "$99.99", stocked: true, name: "iPod Touch"},
  {category: "Electronics", price: "$399.99", stocked: false, name: "iPhone 5"},
  {category: "Electronics", price: "$199.99", stocked: true, name: "Nexus 7"}
];
```

## Langkah 1: Bagi Antaramuka Pengguna Menjadi Sebuah Hierarki Komponen {#step-1-break-the-ui-into-a-component-hierarchy}

Langkah pertama yang akan Anda lakukan adalah menggambar kotak-kotak untuk setiap komponen (dan subkomponen) di rancang bangun dan memberikan mereka masing-masing sebuah nama. Jika Anda bekerja dengan desainer, mungkin mereka telah melakukan ini, jadi cobalah tanya mereka! Nama *layer* pada berkas Photoshop mereka bisa menjadi nama bagi komponen React Anda!

Namun bagaimana Anda mengetahui bagian mana yang harus menjadi komponen sendiri? Anda dapat menggunakan teknik yang sama untuk memutuskan jika Anda harus membuat sebuah fungsi atau obyek. Salah satu dari teknik tersebut adalah [*single responsibility principle*](https://en.wikipedia.org/wiki/Single_responsibility_principle), yang berarti secara ideal, sebuah komponen hanya dapat melakukan satu hal. Jika pada akhirnya komponen tersebut berkembang, maka ia harus dibagi kembali menjadi subkomponen yang lebih kecil.

Karena Anda seringkali akan menampilkan sebuah model data JSON kepada pengguna, Anda akan menemukan bahwa jika model Anda dibangun dengan benar, maka antaramuka pengguna (dan demikian juga struktur komponen Anda) akan dapat menyesuaikan dengan baik. Ini karena antaramuka pengguna dan model data cenderung mengikuti *arsitektur informasi* yang sama, yang berarti memisahkan antaramuka pengguna Anda ke dalam komponen-komponen seringkali sangat mudah. Bagi saja komponen-komponen Anda untuk merepresentasikan satu bagian dari model data Anda.

![Diagram showing nesting of components](../images/blog/thinking-in-react-components.png)

<<<<<<< HEAD
Anda akan melihat di sini bahwa kita memiliki lima komponen di aplikasi kita. Kami telah mencetak miring data yang direpresentasikan oleh tiap komponen.
=======
You'll see here that we have five components in our app. We've italicized the data each component represents. The numbers in the image correspond to the numbers below.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

  1. **`FilterableProductTable` (oranye):** berisi keseluruhan dari contoh ini
  2. **`SearchBar` (biru):** menerima semua *masukan pengguna*
  3. **`ProductTable` (hijau):** menampilkan dan memfilter *koleksi data* berdasarkan *masukan pengguna*
  4. **`ProductCategoryRow` (biru muda):** menampilkan judul untuk setiap *kategori*
  5. **`ProductRow` (merah):** menampilkan sebuah baris untuk setiap *produk*

Jika Anda melihat `ProductTable`, Anda akan menemukan bahwa judul tabel (berisi label "Name" dan "Price") bukan merupakan komponen yang berdiri sendiri. Sebenarnya ini adalah masalah preferensi, dan akan terdapat argumen yang akan dibuat bagaimanapun juga. Di contoh ini, kita membuatnya sebagai bagian dari `ProductTable` karena ia adalah bagian dari proses me-*render* *koleksi data*, yang merupakan tanggung jawab dari `ProductTable`. Namun, jika judul tabel ini berkembang menjadi lebih rumit (mis. jika kita akan menambahkan fungsi *sorting*), akan menjadi masuk akal untuk membuatnya dalam komponen `ProductTableHeader` yang terpisah.

Setelah kita mengidentifikasi komponen dari rancang bangun kita, mari mengaturnya dalam sebuah hierarki. Ini mudah. Komponen yang berada di dalam komponen dalam rancang bangun kita harusnya akan muncul sebagai komponen anak dalam hierarki kita:

  * `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
      * `ProductCategoryRow`
      * `ProductRow`

## Langkah 2: Buat Versi Statis di React {#step-2-build-a-static-version-in-react}

<p data-height="600" data-theme-id="0" data-slug-hash="BwWzwm" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Lihat Pen <a href="https://codepen.io/gaearon/pen/BwWzwm">Thinking In React: Step 2</a> di <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

Setelah kita memiliki hierarki komponen, saatnya mengimplementasikan aplikasi Anda. Cara termudah adalah membuat versi aplikasi Anda yang menerima model data dan me-*render* UI tanpa ada interaktifitas yang terjadi. Memisahkan proses ini adalah jalan yang terbaik karena membuat versi statis membutuhkan banyak mengetik dan tanpa berpikir, dan menambahkan interaktifitas membutuhkan banyak berpikir namun tidak terlalu banyak mengetik. Kita akan segera tahu alasannya.

Untuk membuat versi statis dari aplikasi Anda yang me-*render* model data, Anda akan membangun komponen yang menggunakan kembali komponen lain dan mengoper data menggunakan *props*. *props* adalah sebuah cara untuk mengoper data dari komponen induk ke komponen anak. Jika Anda telah familiar dengan konsep *state*, **jangan menggunakan *state* sama sekali** untuk membangun versi statis ini. *State* disediakan hanya untuk interaktifitas, yang berarti, data yang berubah seiring waktu. Karena ini adalah versi statis dari aplikasi yang Anda buat, Anda belum membutuhkannya.

Anda dapat membangun dari atas ke bawah atau dari bawah ke atas. Maksudnya, Anda dapat mulai membangun komponen teratas dari hierarki (mis. memulai dari `FilterableProductTable`) atau dari komponen terbawah (`ProductRow`). Dalam contoh simpel, biasanya lebih mudah membangun dari atas ke bawah, dan dalam proyek yang lebih besar, biasanya lebih mudah membangun dari bawah ke atas dan menambahkan tes dalam prosesnya.

<<<<<<< HEAD
Pada akhir langkah ini, Anda akan memiliki sebuah *library* dari komponen pakai ulang yang akan me-*render* model data Anda. Komponen-komponen tersebut hanya akan memiliki method `render()` karena mereka adalah versis statis dari aplikasi Anda. Komponen di atas hierarki (`FilterableProductTable`) akan mengambil model data sebagai sebuah prop. Jika Anda membuat perubahan pada model data dan memanggil kembali `ReactDOM.render()`, UI akan diperbarui secara otomatis. Akan mudah untuk melihat bagaimana UI Anda diperbarui dan dimana untuk melakukan perubahan karena tidak ada hal rumit yang terjadi. Konsep **one-way data flow** (disebut juga *one-way binding*) dari React membuat segalanya modular dan cepat.

Silakan merujuk pada [dokumentasi React](/docs/) jika Anda memerlukan bantuan dalam melakukan langkah ini.
=======
At the end of this step, you'll have a library of reusable components that render your data model. The components will only have `render()` methods since this is a static version of your app. The component at the top of the hierarchy (`FilterableProductTable`) will take your data model as a prop. If you make a change to your underlying data model and call `root.render()` again, the UI will be updated. You can see how your UI is updated and where to make changes. React's **one-way data flow** (also called *one-way binding*) keeps everything modular and fast.

Refer to the [React docs](/docs/getting-started.html) if you need help executing this step.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

### Sedikit Selingan: *Props* vs *State* {#a-brief-interlude-props-vs-state}

Terdapat dua tipe "model" data di React: *props* dan *state*. Penting untuk memahami perbedaan keduanya; baca [dokumentasi React](/docs/interactivity-and-dynamic-uis.html) jika Anda belum yakin apa perbedaan mereka. Lihat juga [FAQ: Apakah perbedaan dari *state* dan *props*?](/docs/faq-state.html#what-is-the-difference-between-state-and-props)

## Langkah 3: Identifikasi Representasi Minimal (namun komplit) dari *State* UI {#step-3-identify-the-minimal-but-complete-representation-of-ui-state}

Untuk membuat UI Anda interaktif, Anda harus bisa melakukan perubahan terhadap model data Anda. React membuat langkah ini mudah dengan **state**.

Untuk membangun aplikasi Anda dengan benar, pertama-tama Anda perlu untuk memikirkan set minimal dari *state* yang dapat berubah yang dibutuhkan oleh aplikasi Anda. Kuncinya adalah [DRY: *Don't Repeat Yourself*](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself). Carilah representasi minimal absolut dari *state* yang dibutuhkan aplikasi Anda dan hitung hal-hal lain yang Anda butuhkan berdasarkan permintaan. Sebagai contohnya, jika Anda membangun sebuah TODO list, simpan saja sebuah senarai dari item TODO; tidak perlu menyimpan variabel *state* terpisah untuk jumlah item TODO tersebut. Jika Anda ingin menampilkan jumlah item TODO, Anda bisa mendapatkannya hanya dengan menghitung panjang dari senarai item TODO.

<<<<<<< HEAD
Pikirkan bagian-bagian data yang ada dalam aplikasi kita. Kita memiliki:
=======
Think of all the pieces of data in our example application. We have:
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

  * Daftar produk
  * Teks pencarian yang dimasukkan oleh pengguna
  * Nilai dari checkbox
  * Daftar produk yang telah difilter

Mari kita telaah satu per satu dan tentukan yang mana merupakan *state*. Jawab tiga pertanyaan berikut mengenai setiap bagian data:

  1. Apakah data tersebut dioper dari komponen induk melalui *props*? Jika ya, mungkin data tersebut bukan *state*.
  2. Apakah data tersebut tidak berubah seiring waktu? Jika ya, mungkin data tersebut bukan *state*.
  3. Apakah Anda dapat menghitungnya berdasarkan *state* atau *props* lain di dalam komponen Anda? Jika ya, data tersebut bukanlah *state*.

Daftar produk dioper ke dalam komponen melalui *props*, jadi data tersebut bukan *state*. Teks pencarian dan nilai checkbox bisa menjadi *state* karena data tersebut berubah seiring waktu dan tidak dapat dihitung dari apapun. Dan akhirnya, daftar produk yang telah difilter bukan merupakan *state* karena data tersebut dapat dihitung dengan menggabungkan daftar produk dengan teks pencarian dan nilai checkbox.

Jadi, *state* kita adalah:

  * Teks pencarian yang dimasukkan oleh pengguna
  * Nilai dari checkbox

## Langkah 4: Identifikasi Dimana *State* Anda Berada {#step-4-identify-where-your-state-should-live}

<p data-height="600" data-theme-id="0" data-slug-hash="qPrNQZ" data-default-tab="js" data-user="lacker" data-embed-version="2" class="codepen">Lihat Pen <a href="https://codepen.io/gaearon/pen/qPrNQZ">Thinking In React: Step 4</a> di <a href="https://codepen.io">CodePen</a>.</p>

OK, jadi kita sudah mengindentifikasi set minimal dari *state* aplikasi kita. Selanjutnya, kita perlu mengidentifikasi komponen mana yang memutasi, atau *memiliki* *state* tersebut.

Perlu diingat: Prinsip dasar React adalah aliran data satu arah yang mengalir ke bawah sejalan dengan hierarki komponen. Bisa jadi menentukan komponen mana yang harus menyimpan *state* yang mana tidak dapat dilakukan secara langsung. **Ini seringkali adalah bagian paling menantang bagi pendatang baru untuk dipahami,** jadi ikuti langkah-langkah berikut untuk mengetahuinya:

Untuk setiap bagian *state* dari aplikasi Anda:

  * Identifikasi setiap komponen yang me-*render* sesuatu berdasarkan *state* tersebut.
  * Temukan sebuah komponen yang menjadi pemilik bersama dari *state* (sebuah komponen di atas komponen-komponen yang membutuhkan *state* tersebut di hirarki).
  * Antara komponen pemilik bersama atau komponen lain di atas hierarkilah yang seharusnya memiliki *state* tersebut.
  * Jika Anda tidak dapat menemukan sebuah komponen yang masuk akal untuk memiliki *state* tersebut, buatlah sebuah komponen yang bertugas hanya untuk menyimpan *state* dan menambahkannya dimanapun di hirarki di atas komponen-komponen pemilik bersama.

Mari kita jalankan strategi ini di aplikasi kita:

  * `ProductTable` akan perlu memfilter daftar produk berdasarkan *state* dan `SearchBar` perlu menampilkan teks pencarian dan *state* dari checkbox.
  * Komponen pemilik bersama dalam hal ini adalah `FilterableProductTable`.
  * Akan menjadi masuk akal secara konsep apabila teks pencarian dan nilai checkbox untuk berada di `FilterableProductTable`

Bagus, jadi kita telah menentukan bahwa *state* kita berada di `FilterableProductTable`. Pertama, sebuah properti awal `this.state = {filterText: '', inStockOnly: false}` di method `constructor` `FilterableProductTable` untuk merefleksikan *state* awal dari aplikasi Anda. Kemudian, oper `filterText` dan `inStockOnly` ke `ProductTable` dan `SearchBar` sebagai sebuah prop. Akhirnya, gunakan *props* tersebut untuk memfilter baris di `ProductTable` dan set nilai dari field pada form di `SearchBar`.

Anda akan mulai dapat melihat bagaimana aplikasi Anda bekerja: ubah `filterText` menjadi `"ball"` lalu muat ulang aplikasi Anda. Anda akan melihat tabel data telah diperbarui dengan benar.

## Langkah 5: Tambahkan Aliran Data Sebaliknya {#step-5-add-inverse-data-flow}

<p data-height="600" data-theme-id="0" data-slug-hash="LzWZvb" data-default-tab="js,result" data-user="rohan10" data-embed-version="2" data-pen-title="Thinking In React: Step 5" class="codepen">Lihat Pen <a href="https://codepen.io/gaearon/pen/LzWZvb">Thinking In React: Step 5</a> di <a href="https://codepen.io">CodePen</a>.</p>

Sejauh ini, kita telah membangun sebuah aplikasi yang telah secara benar di-*render* sebagai fungsi dari *props* dan *state* yang mengalir ke bawah seiring hierarki. Sekarang saatnya untuk mendukung aliran data ke arah sebaliknya: komponen form yang berada di bawah hirarki perlu untuk memperbarui *state* di `FilterableProductTable`.

React membuat aliran data seperti ini menjadi eksplisit untuk mempermudah pemahaman bagaimana aplikasi Anda bekerja, namun cara ini membuat perlunya pengetikan yang sedikit lebih banyak daripada metode *two-way data binding* tradisional.

<<<<<<< HEAD
Jika Anda mencoba untuk mengetik atau mencentang checkbox di versi saat ini, Anda akan melihat bahwa React tidak memperdulikan input yang Anda lakukan. Hal ini memang disengaja, karena kita telah menentukan prop `value` dari `input` agar selalu setara dengan `state` yang dioper dari `FilterableProductTable`.
=======
If you try to type or check the box in the previous version of the example (step 4), you'll see that React ignores your input. This is intentional, as we've set the `value` prop of the `input` to always be equal to the `state` passed in from `FilterableProductTable`.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Mari kita berpikir mengenai apa yang sebenarnya kita inginkan terjadi. Kita ingin untuk memastikan bahwa ketika pengguna mengubah form, kita memperbarui *state* untuk merefleksikan input dari pengguna. Karena komponen hanya diperbolehkan untuk memperbarui *state* mereka sendiri, `FilterableProductTable` akan mengalirkan *callback* ke `SearchBar` yang kemudian akan dipanggil kapanpun *state* harus diperbarui. Kita dapat menggunakan event `onChange` pada input untuk mengetahui kapan harus memanggil *callback*. *Callback* yang dioper oleh `FilterableProductTable` akan memanggil `setState()`, dan aplikasi akan diperbarui.

## Dan Selesai! {#and-thats-it}

Mudah-mudahan, contoh di atas memberi Anda gambaran mengenai bagaimana cara berpikir dalam membangun komponen dan aplikasi menggunakan React. Walaupun mungkin memerlukan sedikit pengetikan daripada biasanya, perlu diingat bahwa kode akan jauh lebih sering dibaca daripada ditulis, jadi akan sangat mudah untuk membaca kode yang modular dan eksplisit ini. Saat Anda mulai membangun *library* komponen-komponen yang cukup besar, Anda akan mulai menyukai keeksplisitan dan modularitasnya, dan dengan penggunaan ulang kode, jumlah baris kode Anda akan mulai berkurang. :)
