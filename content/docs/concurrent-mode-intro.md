---
id: concurrent-mode-intro
title: Memperkenalkan Mode Concurrent (Eksperimental)
permalink: docs/concurrent-mode-intro.html
next: concurrent-mode-suspense.html
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
>>>>>>> aa70dcedc6db07987a814dba2b296cc4c5219860

</div>

Laman ini menyediakan ikhtisar teoretis untuk Mode _Concurrent_. **Untuk pengenalan yang lebih praktikal, anda mungkin ingin melihat bagian selanjutnya:**

* [_Suspense_ untuk Pengambilan Data](/docs/concurrent-mode-suspense.html) menjelaskan mekanisme baru untuk pengambilan data dalam komponen React.
* [Pola _Concurrent_ antarmuka pengguna (UI)](/docs/concurrent-mode-patterns.html) menunjukkan beberapa pola antarmuka pengguna (UI) yang memungkinkan dari Mode _Concurrent_ dan _Suspense_.
* [Mengadopsi Mode _Concurrent_](/docs/concurrent-mode-adoption.html) menjelaskan bagaimana anda dapat mencoba Mode _Concurrent_ di projek anda.
* [Referensi API Mode _Concurrent_](/docs/concurrent-mode-reference.html) mendokumentasikan API yang baru tersedia dalam _build_ eksperimental.

## Apa Itu Mode _Concurrent_? {#what-is-concurrent-mode}

Mode _Concurrent_ adalah serangkaian fitur baru yang membantu aplikasi React tetap responsif dan menyesuaikan dengan kapabilitas perangkat pengguna dan kecepatan jaringan.

Fitur ini masih dalam tahap percobaan dan dapat berubah sewaktu-waktu. Fitur ini belum menjadi bagian dari React versi rilis yang stabil, tetapi anda dapat mencobanya dalam _build_ eksperimental.

## _Blocking_ vs _Interruptible Rendering_ {#blocking-vs-interruptible-rendering}

<<<<<<< HEAD
**Untuk menjelaskan Mode _Concurrent_, kita akan menggunakan _version control_ sebagai kiasan.** Jika anda bekerja dalam tim, anda mungkin menggunakan sistem _version control_ seperti Git dan bekerja dalam _branch_. Ketika sebuah _branch_ telah siap, anda dapat menggabungkan pekerjaan anda ke dalam _master_ sehingga orang lain dapat mengambil pekerjaan anda.
=======
**To explain Concurrent Mode, we'll use version control as a metaphor.** If you work on a team, you probably use a version control system like Git and work on branches. When a branch is ready, you can merge your work into main so that other people can pull it.
>>>>>>> aa70dcedc6db07987a814dba2b296cc4c5219860

Sebelum ada _version control_, alur kerja pengembangan sangat berbeda. Tidak ada konsep _branch_. Jika anda ingin mengubah beberapa berkas, anda harus memberitahu semua orang untuk tidak menyentuh berkas-berkas itu sampai anda menyelesaikan pekerjaan anda. Anda bahkan tidak bisa mulai mengerjakannya secara bersamaan dengan orang itu - anda benar-benar *diblokir* oleh mereka.

Ini menggambarkan bagaimana _library_ antarmuka pengguna (UI), termasuk React, khususnya bekerja sampai hari ini. Begitu mereka mulai me-_render_ yang terbaru, termasuk membuat DOM _node_ baru dan menjalankan kode di dalam komponen, mereka tidak bisa meng-interupsi pekerjaan ini. Kita akan menyebut pendekatan ini sebagai "_blocking rendering_".

Saat Mode _Concurrent_, _rendering_ tidak memblokir. Hal itu dapat di-interupsi. Ini meningkatkan pengalaman pengguna (UX). Itu juga membuka fitur-fitur baru yang tidak mungkin sebelumnya. Sebelum kita melihat contoh konkret di [bab](/docs/concurrent-mode-patterns.html) [selanjutnya](/docs/concurrent-mode-suspense.html), kami akan melakukan ikhtisar tingkat tinggi pada fitur-fitur baru.

### _Interruptible Rendering_ {#interruptible-rendering}

Bayangkan daftar produk yang dapat di-_filter_. Pernahkah anda mengetikkan daftar _filter_ dan merasa _stutter_ setiap menekan tombol? Beberapa pekerjaan untuk memperbarui daftar produk mungkin tidak dapat dihindari, seperti membuat DOM _node_ baru atau _browser_ yang melakukan tata letak. Bagaimanapun, *kapan* dan *bagaimana* kita melakukan pekerjaan itu memainkan peran yang besar.

Cara yang umum untuk mengatasi _stutter_ adalah dengan melakukan "_debounce_" pada masukan. Ketika me-_debounce_, kita hanya memperbarui daftar *setelah* pengguna berhenti mengetik. Namun, itu bisa membuat frustasi karena antarmuka pengguna (UI) tidak memperbarui saat mengetik. Sebagai alternatif, kita bisa melakukan "_throttle_" pada masukan, dan memperbarui daftarnya dengan frekuensi maksimum tertentu. Tetapi kemudian pada perangkat bertenaga rendah masih akan tetap berakhir dengan _stutter_. _Debounce_ dan _throttle_ keduanya membuat pengalaman pengguna (UX) kurang optimal.

Alasan untuk melakukan _stutter_ sederhana: begitu mulai me-_render_, hal itu tidak dapat di-interupsi. Jadi _browser_ tidak dapat memperbarui masukan teks setelah tombol ditekan. Tidak perduli sebagus apa _library_ antarmuka pengguna (UI) (seperti React) akan terlihat perbandingannya, jika itu menggunakan _blocking rendering_, sejumlah pekerjaan dalam komponen anda akan selalu menyebabkan _stutter_. Dan, seringkali, tidak ada cara yang mudah untuk memperbaikinya.

**Mode _Concurrent_ memperbaiki keterbatasan mendasar dengan membuat _render_ yang dapat di-interupsi.** Ini berarti ketika pengguna menekan tombol lain, React tidak perlu memblokir _browser_ memperbarui masukan teks. Bahkan, hal itu membiarkan _browser_ memperbarui masukan, dan kemudian melanjutkan me-_render_ daftar terbaru *dalam memori*. Ketika _render_ selesai, React memperbarui DOM, dan perubahannya terlihat pada layar.

Secara konsep, anda dapat menganggap hal ini sebagai React yang sedang mempersiapkan setiap perubahan "pada suatu _branch_". Sama seperti anda dapat meninggalkan pekerjaan dalam _branch_ atau beralih ke _branch_ yang lain, React saat Mode _Concurrent_ bisa mengganggu perubahan yang sedang berlangsung untuk melakukan sesuatu yang lebih penting, dan kemudian kembali ke apa yang sedang dilakukan sebelumnya. Teknik ini juga mungkin mengingatkan anda tentang [_buffering_ ganda](https://wiki.osdev.org/Double_Buffering) dalam video games.

Teknik Mode _Concurrent_ mengurangi kebutuhan _debounce_ dan _throttle_ dalam antarmuka pengguna (UI). Karena _render_ dapat di-interupsi, React tidak perlu untuk *menunda* pekerjaannya secara artifisial untuk menghindari _stutter_. Hal itu dapat segera mulai me-_render_, tapi mengganggu pekerjaan ini ketika diperlukan untuk menjaga aplikasinya tetap responsif.

### Urutan Memuat yang Disengaja {#intentional-loading-sequences}

<<<<<<< HEAD
Kami telah mengatakan sebelumnya bahwa Mode _Concurrent_ itu seperti React yang bekerja "pada suatu _branch_". _Branch_ berguna tidak hanya untuk waktu perbaikan jangka pendek, tapi juga untuk fitur jangka panjang. Terkadang anda mungkin mengerjakan suatu fitur, tapi itu mungkin butuh waktu berminggu-minggu sebelum itu dalam "kondisi yang cukup bagus" untuk digabungkan ke _master_. Sisi metafora _version control_ kita ini berlaku untuk _render_ juga.
=======
We've said before that Concurrent Mode is like React working "on a branch". Branches are useful not only for short-term fixes, but also for long-running features. Sometimes you might work on a feature, but it could take weeks before it's in a "good enough state" to merge into main. This side of our version control metaphor applies to rendering too.
>>>>>>> aa70dcedc6db07987a814dba2b296cc4c5219860

Anggap kita menavigasi antara dua layar pada suatu aplikasi. Terkadang, kita mungkin tidak punya cukup kode dan data yang dimuat untuk menampilkan muatan yang "cukup baik" kepada pengguna pada layar baru. Transisi ke layar kosong atau _spinner_ besar bisa menjadi pengalaman yang menjengkelkan. Namun, hal itu juga umum bahwa kode dan data tidak butuh waktu yang lama untuk mengambil. **Bukankah lebih baik jika React bisa berdiam pada layar yang lama untuk lebih lama, dan "melewati" kondisi muatan yang buruk sebelum menampilkan layar yang baru?**

Walaupun hal ini memungkinkan saat ini, hal itu sulit untuk diatur. Pada Mode _Concurrent_, fitur ini _built-in_. React mulai mempersiapkan layar yang baru pada memori terlebih dahulu - atau, seperti metafora kita, "pada _branch_ yang berbeda". Jadi React bisa menunggu sebelum memperbarui DOM sehingga lebih banyak konten yang bisa dimuat. Pada Mode _Concurrent_, kita bisa memberitahu React untuk terus menampilkan layar yang lama, interaktif sepenuhnya, dengan indikator muatan _inline_. Dan ketika layar yang baru sudah siap, React bisa membawa kita ke layar yang baru.

### _Concurrency_ {#concurrency}

Mari kita rekap dua contoh di atas dan lihat bagaimana Mode _Concurrent_ menyatukan mereka. **Saat Mode _Concurrent_, React dapat bekerja pada beberapa perubahan _state_ secara *bersamaan*** — sama seperti _branch_ membiarkan anggota tim yang berbeda untuk bekerja secara independen:

* Untuk perubahan _CPU-bound_ (seperti membuat DOM _node_ dan menjalankan kode komponen), _concurrency_ dapat diartikan bahwa perubahan yang lebih mendesak dapat "meng-interupsi" _render_ yang sudah berjalan.
* Untuk perubahan _IO-bound_ (seperti pengambilan kode atau data dari jaringan), _concurrency_ dapat diartikan bahwa React bisa mulai me-_render_ dalam memori bahkan sebelum semua data tiba, dan melewati untuk menampilkan _state_ yang sedang memuat.

Yang terpenting, cara anda *menggunakan* React itu sama. Konsep seperti komponen, _props_, and _state_ secara fundamental bekerja dengan cara yang sama. Saat anda ingin memperbarui layar, anda mengatur _state_ nya.

React menggunakan perilaku perangkat lunak untuk memutuskan seberapa "mendesak" suatu perubahan, dan membiarkan anda menyesuaikannya dengan beberapa baris kode sehingga anda dapat mencapai pengalaman pengguna (UX) yang diinginkan untuk setiap interaksi.

## Menempatkan Riset ke dalam Pengembangan {#putting-research-into-production}

Ada motif umum mengelilingi fitur Mode _Concurrent_. **Misi nya adalah untuk membantu mengintegrasikan hasil temuan riset Human-Computer Interaction ke dalam antarmuka pengguna (UI) nyata.**

Sebagai contohnya, riset menunjukkan bahwa menampilkan terlalu banyak _state_ yang sedang memuat saat transisi antar layar membuat nuansa transisi *lebih lambat*. Inilah sebabnya kenapa Mode _Concurrent_ menunjukkan _state_ baru yang sedang memuat pada "jadwal" yang pasti untuk menghindari pembaruan yang terlalu sering dan menjengkelkan.

Sama halnya, kami tahu dari riset bahwa interaksi seperti _hover_ dan masukan teks perlu ditangani dalam waktu yang sangat singkat, sementara klik dan transisi antar halaman bisa membutuhkan waktu sedikit lebih lama tanpa merasa lamban. Perbedaan "prioritas" yang digunakan Mode _Concurrent_ secara internal sesuai dengan kategori interaksi pada riset persepsi manusia.

Tim dengan fokus yang kuat pada pengalaman pengguna (UX) terkadang memecahkan masalah yang sama dengan solusi tersendiri. Namun, solusi tersebut jarang bertahan untuk waktu yang lama, karena sulit dipertahankan. Dengan Mode _Concurrent_, tujuan kami adalah untuk memadukan riset temuan antarmuka pengguna (UI) ke dalam abstraksi itu sendiri, dan menyediakan cara idiomatis untuk menggunakannya. Sebagai _library_ antarmuka pengguna (UI), React berada pada posisi yang tepat untuk melakukan itu.

## Tahap selanjutnya {#next-steps}

Sekarang anda tahu apa itu Mode _Concurrent_!

Pada laman selanjutnya, anda akan mempelajari lebih detil tentang topik tertentu:

* [_Suspense_ untuk Pengambilan Data](/docs/concurrent-mode-suspense.html) menjelaskan mekanisme baru untuk pengambilan data dalam komponen React.
* [Pola _Concurrent_ antarmuka pengguna (UI)](/docs/concurrent-mode-patterns.html) menunjukkan beberapa pola antarmuka pengguna (UI) yang memungkinkan dari Mode _Concurrent_ dan _Suspense_.
* [Mengadopsi Mode _Concurrent_](/docs/concurrent-mode-adoption.html) menjelaskan bagaimana anda dapat mencoba Mode _Concurrent_ di projek anda.
* [Referensi API Mode _Concurrent_](/docs/concurrent-mode-reference.html) mendokumentasikan API yang baru tersedia dalam _build_ eksperimental.