---
id: hello-world
title: Hello World
permalink: docs/hello-world.html
prev: cdn-links.html
next: introducing-jsx.html
---

Contoh React yang paling sederhana adalah seperti ini:

```js
ReactDOM.render(
  <h1>Halo, dunia!</h1>,
  document.getElementById('root')
);
```

React menampilkan *heading* pada halaman bertuliskan "Halo, dunia!".

[](codepen://hello-world)

Klik tautan di atas untuk membuka editor daring. Anda dibebaskan untuk membuat perubahan dan lihat bagaimana perubahan itu mempengaruhi keluaran. Mayoritas dari halaman yang ada dalam panduan ini akan memiliki contoh yang dapat diubah seperti ini.


## Bagaimana Membaca Panduan Ini {#how-to-read-this-guide}

Dalam panduan ini, kita akan membahas tentang kerangka dari aplikasi React: elemen dan komponen. Setelah Anda menguasainya, Anda dapat membuat aplikasi yang kompleks dari bagian-bagian kecil yang bisa digunakan ulang.

>Tip
>
>Panduan ini didesain untuk orang yang lebih suka **mempelajari konsep selangkah demi selangkah**. Jika Anda lebih suka untuk belajar sambil mencoba, silakan lihat [tutorial praktis](/tutorial/tutorial.html) kami. Anda mungkin merasa panduan ini dan tutorial tersebut saling melengkapi satu sama lain.

Ini adalah bab pertama dalam panduan langkah demi langkah tentang konsep utama React. Anda dapat menemukan daftar semua babnya dalam navigasi *sidebar*. Jika Anda membaca ini menggunakan perangkat bergerak, Anda bisa mengakses navigasi dengan menekan tombol yang ada di pojok kanan bawah layar Anda.

Setiap bab dalam panduan ini dibangun di atas pengetahuan yang diperkenalkan pada bab sebelumnya. **Anda bisa mempelajari sebagian besar dari React dengan membaca panduan bab “Konsep Utama” secara berurutan.** Sebagai contoh, [“Memperkenalkan JSX”](/docs/introducing-jsx.html) adalah bab selanjutnya setelah ini.

## Asumsi Tingkat Pengetahuan {#knowledge-level-assumptions}

React adalah *library* JavaScript, jadi kami akan berasumsi bahwa Anda memiliki pemahaman dasar tentang bahasa JavaScript. **Jika Anda tidak merasa percaya diri, kami merekomendasikan untuk [melalui tutorial JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) untuk mengecek tingkat pengetahuan Anda** dan memungkinkan Anda untuk mengikuti panduan ini tanpa tersesat. Mungkin akan memakan waktu Anda sekitar 30 menit hingga 1 jam, tetapi sebagai hasilnya Anda tidak perlu merasa bahwa Anda sedang belajar React dan JavaScript dalam waktu bersamaan.

>Catatan
>
>Contoh pada panduan ini terkadang menggunakan beberapa sintaksis JavaScript yang baru. Jika Anda belum pernah menggunakan JavaScript dalam beberapa tahun terakhir, [tiga poin berikut](https://gist.github.com/gaearon/683e676101005de0add59e8bb345340c) akan membantu sebagian besar perjalanan Anda.

## Ayo Mulai! {#lets-get-started}

Terus gulir ke bawah dan Anda akan menemukan tautan ke [bab selanjutnya dari panduan ini](/docs/introducing-jsx.html) tepat sebelum *footer* laman.


