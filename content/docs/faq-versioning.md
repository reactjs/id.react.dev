---
id: faq-versioning
title: Kebijakan Pemversian
permalink: docs/faq-versioning.html
layout: docs
category: FAQ
---

React mengikuti prinsip-prinsip [*semantic versioning* (semver)](https://semver.org/).

Yang artinya dengan nomor versi **x.y.z**:

* Ketika merilis **perbaikan *bug* yang serius**, kita membuat sebuah **rilis *patch*** dengan mengubah nomor **z** (misal: 15.6.2 menjadi 15.6.3).
* Ketika merilis **fitur-fitur baru** atau **perbaikan *non-critical***, kita membuat sebuah **rilis minor** dengan mengubah nomor **y** (misal: 15.6.2 menjadi 15.7.0).
* Ketika merilis **perubahan besar**, kita membuat **rilis mayor** dengan mengubah nomor **x** (misal: 15.6.2 menjadi 16.0.0). 

Rilis mayor dapat juga mengandung fitur-fitur baru, dan rilis apa pun dapat menyertakan perbaikan *bug*.

Rilis minor merupakan jenis rilis yang paling umum.

> Kebijakan pemversian ini tidak berlaku untuk *prerelease* di kanal Next atau Experimental. [Learn more about *prerelease*.](/docs/release-channels.html)

### Perubahan Tidak Kompatibel {#breaking-changes}

<<<<<<< HEAD
Semua orang tidak menyukai perubahan-perubahan yang merusak kompatibilitas, maka dari itu kami mengupayakan untuk meminimalisasi jumlah rilis-rilis mayor - misalnya, React 15 dirilis pada bulan April 2016 dan React 16 dirilis pada bulan September 2017; React 17 belum diperkirakan hingga tahun 2020.
=======
Breaking changes are inconvenient for everyone, so we try to minimize the number of major releases – for example, React 15 was released in April 2016 and React 16 was released in September 2017, and React 17 was released in October 2020.
>>>>>>> f3baa6d075c8de475b688abf035d7054bc8a9606

Sebaliknya, kami merilis fitur-fitur baru dalam versi-versi kecil. Yang artinya rilis-rilis kecil tersebut seringkali lebih menarik dan lebih memikat dibandingkan perubahan-perubahan besar, meskipun namanya sederhana.

### Komitmen terhadap Stabilitas {#commitment-to-stability}

Karena kami mengubah React setiap waktu, kami mengupayakan untuk meminimalisasi usaha yang dibutuhkan untuk memanfaatkan fitur-fitur baru. Ketika memungkinkan, kami akan tetap menjaga agar API yang lama tetap berfungsi, bahkan jika itu berarti menaruhnya dalam *package* terpisah. Misalnya, [*mixins* sudah tidak disarankan selama bertahun-tahun](/blog/2016/07/13/mixins-considered-harmful.html) tetapi masih didukung hingga sekarang [melalui *create-react-class*](/docs/react-without-es6.html#mixins) dan banyak basis kode yang tetap menggunakannya dalam kode *legacy* yang stabil.

Lebih dari satu juta pengembang menggunakan React, secara kolektif merawat jutaan komponen. Basis kode Facebook sendiri mempunyai lebih dari 50,000 komponen. Yang artinya kami harus membuatnya semudah mungkin untuk memperbarui versi React yang baru; jika kami membuat perubahan-perubahan besar tanpa jalur migrasi, banyak orang akan terjebak pada versi yang lama. Kami menguji jalur-jalur pembaruan ini di Facebook sendiri - jika tim kami yang kurang dari 10 orang dapat memperbarui 50,000+ komponen sendiri, kami berharap pembaruannya dapat dikelola oleh semua orang yang menggunakan React. Dalam beberapa kasus, kami menulis [skrip otomatis](https://github.com/reactjs/react-codemod) untuk memperbarui sintaks komponen, yang kemudian kami sertakan dalam rilis *open-source* untuk digunakan semua orang.

### Pembaruan Bertahap melalui Peringatan {#gradual-upgrades-via-warnings}

*Development builds* dari React menyertakan banyak peringatan yang bermanfaat. Jika memungkinkan, kami menambahkan peringatan-peringatan sebagai persiapan untuk perubahan-perubahan besar yang akan datang. Dengan demikian, jika aplikasi Anda tidak memiliki peringatan pada rilis terbaru, maka akan kompatibel dengan rilis mayor selanjutnya. Hal ini memungkinkan Anda untuk memperbarui aplikasi Anda satu komponen pada satu waktu.

Peringatan *development* tidak akan memengaruhi perilaku *runtime* aplikasi Anda. Dengan demikian, Anda dapat merasa percaya diri bahwa aplikasi Anda akan berlaku sama antara *development* dan *production build* -- satu-satunya perbedaan adalah *production build* tidak akan me-*log* peringatan dan lebih efisien. (Jika Anda pernah melihat hal sebaliknya, tolong ajukan sebuah *issue*).

### Hal apa yang Terhitung sebagai Perubahan Besar? {#what-counts-as-a-breaking-change}

Secara umum, kami tidak mengubah nomor versi mayor untuk perubahan-perubahan:

* **Peringatan pengembangan.** Dikarenakan hal-hal ini tidak memengaruhi perilaku produksi, kami dapat menambahkan peringatan-peringatan baru atau mengubah peringatan-peringatan yang telah ada di antara versi mayor. Bahkan, inilah yang memungkinkan kami untuk memperingatkan tentang perubahan yang akan datang.
* **API yang diawali dengan `unstable_.`** Hal ini disediakan sebagai fitur eksperimental yang API-nya belum kami yakini. Dengan merilisnya dengan prefiks `unstable_`, kami dapat beralih lebih cepat dan mendapatkan API yang stabil dengan segera.
* **Versi *alpha* dan *canary* dari React.** Kami menyediakan versi alfa dari React sebagai sebuah cara untuk mengetes fitur baru lebih awal, akan tetapi kami butuh fleksibilitas untuk melakukan perubahan-perubahan berdasarkan hal yang kami pelajari dari waktu alfa. Jika Anda menggunakan versi ini, catat bahwa *API*-nya dapat berubah sebelum *stable release*.
* ***API* dan data struktur internal yang tidak terdokumentasi.** Jika Anda mengakses nama properti internal seperti `__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED` atau `__reactInternalInstance$uk43rzhitjg`, tidak ada jaminan. Kami tidak bertanggung jawab atas apapun.

Kebijakan ini dirancang untuk menjadi pragmatis: tentu saja, kami tidak ingin membuat Anda sakit kepala. Jika kami mengubah versi mayor untuk semua perubahan ini, kami akan berakhir dengan merilis versi mayor lebih banyak dan tentunya mengakibatkan lebih banyak *versioning pain* untuk komunitas. Hal ini juga dapat berarti kami tidak dapat membuat kemajuan dalam mengembangkan React secepat yang kami inginkan.

Maka dari itu, jika kami menyangka bahwa perubahan pada daftar ini akan mengakibatkan permasalahan yang luas pada komunitas, kami akan tetap melakukan yang terbaik untuk menyediakan jalur migrasi secara bertahap.

### Jika Sebuah Rilis Minor Tidak Menyertakan Fitur Baru, Mengapa Tidak Dijadikan Rilis *Patch*? {#minors-versus-patches}

Sangat dimungkinkan bahwa sebuah rilis minor tidak terdapat fitur baru. [Hal ini diperbolehkan oleh *semver*](https://semver.org/#spec-item-7), yang menyebutkan **"[sebuah versi minor] DAPAT ditambahkan apabila fungsional baru yang substansial atau perbaikan diperkenalkan dalam kode pribadi. Hal ini TERMASUK perubahan level *patch*"**

Bagaimanapun, hal ini menimbulkan pertanyaan mengapa rilis-rilis ini tidak diversikan sebagai *patch* saja.

Jawabannya adalah bahwa perubahan apapun pada React (atau perangkat lunak lainnya) membawa risiko rusak dalam hal-hal yang tidak terduga. Bayangkan sebuah skenario dimana sebuah rilis *patch* yang memperbaiki sebuah *bug* secara tidak sengaja menimbulkan *bug* yang berbeda. Hal ini bukan saja akan mengganggu pengembang, tetapi juga merusak kepercayaan dirinya pada rilis *patch* di kemudian hari. Sangat disesalkan jika melakukan perubahan untuk sebuah *bug* yang jarang ditemui dalam praktik sehari-hari.

Kami punya rekam jejak yang cukup baik untuk menjaga rilisan React yang bebas *bug*, tapi rilis *patch* juga mempunyai tingkat keandalan yang lebih tinggi karena kebanyakan pengembang berasumsi rilis *patch* dapat diadopsi tanpa menimbulkan konsekuensi yang merugikan.

Untuk alasan-alasan tersebut, kami menyimpan rilis *patch* hanya untuk *bug* yang paling *serius* dan kerentanan keamanan.

Jika sebuah rilis menyertakan perubahan-perubahan tidak penting - seperti refaktor internal, perubahan pada detail implementasi, peningkatan performa, atau perbaikan *bug* secara minor - kami akan mengubah versi minornya bahkan jika tidak ada fitur baru. 
