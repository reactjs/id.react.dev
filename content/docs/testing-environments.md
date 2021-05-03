---
id: testing-environments
title: Testing Environments
permalink: docs/testing-environments.html
prev: testing-recipes.html
---
<!-- Dokumen ini dimaksudkan untuk orang-orang yang menguasai JavaScript, dan sudah pernah menulis tes/pengujian dengan itu. Dokumen ini berfungsi sebagai referensi mengenai perbedaan dari *environment* pengujian untuk komponen React, dan bagaimana perbedaan tersebut mempengaruhi pengujian-pengujian yang mereka tulis. Dokumen ini juga meng-asumsikan sudut pandang ke arah komponen react-dom berbasi web, namun memiliki catatan untuk *renderers lainnya.-->

Dokumen ini membahas faktor-faktor yang dapat mempengaruhi *environment* anda dan membahas rekomendasi untuk beberapa skenario.

### *Test runners* {#test-runners}

*Test runners* seperti [Jest](https://jestjs.io/), [mocha](https://mochajs.org/), [ava](https://github.com/avajs/ava) memungkinkan Anda untuk menulis *test suites* dengan Javascript, dan menjalankannya sebagai bagian dari proses pengembangan anda. Selain itu, *test suites* juga dijalankan sebagai bagian dari *continuous integration*

- Jest sangat kompatibel dengan proyek-proyek React, mendukung fitur-fitur seperti [tiruan modul](#mocking-modules)* dan [tiruan waktu](#mocking-timers), dan mendukung [`jsdom`](#mocking-a-rendering-surface). **Bila Anda menggunakan Create React App [Jest sudah tersedia secara *out of the box*](https://facebook.github.io/create-react-app/docs/running-tests) dengan standar bawaan yang bermanfaat.**
- *Library* seperti [mocha](https://mochajs.org/#running-mocha-in-the-browser) berfungsi dengan baik pada *environment browser* sebenarnya, dan dapat membantu pengujian-pengujian yang secara eksplisit membutuhkannya.
- Pengujian *End-to-end* digunakan untuk menguji alur yang lebih lama pada banyak halaman, dan membutuhkan [pengaturan berbeda](#end-to-end-tests-aka-e2e-tests).

### Membuat tiruan *rendering surface*{#mocking-a-rendering-surface}

Pengujian seringkali dijalankan didalam *environment* tanpa akses ke *rendering surface* sebenarnya seperti contohnya sebuah *browser*. Untuk *environment* ini kami merekomendasikan men-simulasikan *browser* dengan [`jsdom`](https://github.com/jsdom/jsdom), sebuah implementasi *browser* ringan yang berjalan didalam Node.js.

Pada banyak kasus, jsdom berperilaku seperti *browser* pada umumnya, namun tidak memiliki fitur-fitur seperti [tata letak dan navigasi](https://github.com/jsdom/jsdom#unimplemented-parts-of-the-web-platform). Ini masih berguna untuk kebanyakan tes komponen berbasis web, karena lebih cepat dibandingkan harus menjalankan *browser* setiap kali pengujian. jsdom juga berjalan dengan proses yang sama dengan tes anda, agar Anda dapat menulis kode untuk memeriksa dan menguji pada *rendered* DOM.

Seperti pada *browser* sebenarnya, kita dapat memodelkan interaksi pengguna dengan jsdom; pengujian dapat mengirimkan *events* pada DOM *nodes*, lalu mengamati dan menguji efek samping dari aksi-aksi yang dikirimkan [<small>(contoh)</small>](/docs/testing-recipes.html#events).

Porsi besar dari pengujian antarmuka pengguna dapat ditulis menggunakan pengaturan diatas:
Menggunakan Jest sebagai *test runner*, di*render* ke jsdom, dengan interaksi pengguna yang sudah dtentukan sebagai rangkaian dari *browser events*, menggunakan bantuan `act()` [<small>(contoh)</small>](/docs/testing-recipes.html). Sebagai contoh, banyak dari pengujian React sendiri dituliskan dengan kombinasi seperti ini.

Bila Anda sedang menulis *library* yang melakukan pengujian pada perilaku *browser* yang spesifik, dan memerlukan perilaku *browser* bawaan seperti tata letak dan *inputs* sebenarnya, Anda dapat menggunakan *framework* seperti [mocha](https://mochajs.org/)
.

Pada *environment* dimana Anda *tidak dapat* men-simulasikan sebuah DOM (contoh: Menguji komponen React Native pada Node.js), Anda dapat menggunakan [event simulation helpers](https://reactjs.org/docs/test-utils.html#simulate) untuk mensimulasikan interaksi-interaksi dengan elemen-elemen. Cara lainnya, Anda dapat menggunakan bantuan `fireEvent` dari [`@testing-library/react-native`](https://testing-library.com/docs/native-testing-library).

<<<<<<< HEAD
*Frameworks* seperti [Cypress](https://www.cypress.io/), [puppeteer](https://github.com/GoogleChrome/puppeteer) dan [webdriver](https://www.seleniumhq.org/projects/webdriver/) berguna untuk melakukan [pengujian *end-to-end*](#end-to-end-tests-aka-e2e-tests).
=======
In an environment where you _can't_ simulate a DOM (e.g. testing React Native components on Node.js), you could use [event simulation helpers](/docs/test-utils.html#simulate) to simulate interactions with elements. Alternately, you could use the `fireEvent` helper from [`@testing-library/react-native`](https://testing-library.com/docs/react-native-testing-library/intro).
>>>>>>> c3c93e2a7ff1b1f7b8735a3a87d4b10937eaaf91

### Membuat tiruan fungsi {#mocking-functions}

Ketika menulis pengujian, kita ingin membuat tiruan bagian kode yang tidak mempunyai padanan didalam *environment* pengujian (contoh: menguji status `navigator.online` di dalam Node.js). Pengujian juga dapat memperhatikan pada beberapa fungsi, dan mengamati bagaimana bagian lain dari pengujian berinteraksi dengan mereka. Hal ini berguna ketika dapat secara selektif meniru fungsi-fungsi dengan versi yang lebih bersahabat dengan pengujian.

Hal ini juga berguna khususnya pada *data fetching*. Umumnya lebih diminati untuk menggunakan data "palsu" dalam rangka menghindari kelambatan dan pemecahan akibat dari pengambilan dari API *endpoints* sebenarnya [<small>(contoh)</small>](/docs/testing-recipes.html#data-fetching). Ini membantu membuat pengujian dapat diprediksi. *Library-library* seperti [Jest](https://jestjs.io/) dan [sinon](https://sinonjs.org/), diantara yang lainnya, mendukung fungsi-fungsi tiruan. Untuk pengujian *end-to-end*, meniru jaringan dapat lebih sulit, akan tetapi Anda mungkin akan menguji API *endpoints* sebenarnya juga nanti.

### Membuat tiruan modul {#mocking-modules}

Beberapa komponen memiliki ketergantungan pada modul-modul yang mungkin tidak berjalan dengan baik pada *environment* pengujian, atau bukan hal yang utama pada pengujian yang dilakukan. Dapat berguna untuk secara selektif membuat tiruan dari modul-modul tersebut dengan pengganti yang cocok [<small>(contoh)</small>](/docs/testing-recipes.html#mocking-modules).

Pada Node.js, *runner* seperti Jest [mendukung membuat tiruan modul](https://jestjs.io/docs/en/manual-mocks). Anda dapat menggunakan *library* seperti [`mock-require`](https://www.npmjs.com/package/mock-require).

### Membuat tiruan waktu {#mocking-timers}

Komponen dapat menggunakan fungsi-fungsi berbasis waktu seperti `setTimeout`, `setInterval`, atau `Date.now`. Pada *environment* pengujian, akan bermanfaat untuk membuat tiruan dari fungsi-fungsi ini dengan pengganti yang memperbolehkan anda untuk secara manual "memajukan" waktu. Ini sangat baik untuk memastikan pengujian berjalan dengan cepat! Pengujian yang bergantung dengan waktu akan dapat selesai secara berurutan, namun lebih cepat [<small>(contoh)</small>](/docs/testing-recipes.html#timers). Kebanyakan *framework*, termasuk [Jest](https://jestjs.io/docs/en/timer-mocks), [sinon](https://sinonjs.org/releases/v7.3.2/fake-timers/) dan [lolex](https://github.com/sinonjs/lolex), dapat membuat tiruan waktu pada pengujian Anda.

Terkadang, Anda mungkin tidak ingin membuat waktu tiruan. Contohnya, mungkin Anda menguji sebuah animasi, atau interaksi dengan *endpoint* yang sensitif dengan waktu (seperti API *rate limiter*). *Library* dengan peniru waktu memungkinkan Anda untuk meng-aktifkan dan menon-aktifkan tiruan di setiap pengujian/*suite*, agar Anda dapat secara eksplisit memilih bagimana pengujian tersebut berjalan.

### Pengujian *End-to-end* {#end-to-end-tests-aka-e2e-tests}

Pengujian *end-to-end* berguna untuk menguji alur yang lebih panjang, khususnya untuk hal-hal yang bersifat kritis pada bisnis anda (seperti pembayaran dan pendaftaran). Untuk pengujian-pengujian ini, Anda mungkin ingin menguji keduanya, bagaimana *browser* sebenarnya me-*render* app secara keseluruhan, mengambil data dari API *endpoint* sungguhan, menggunakan *session* dan *cookie*, melakukan navigasi untuk berbagai tautan. Anda juga mungkin tidak hanya menguji kondisi DOM, namun juga menguji untuk hal-hal dukungan data (contoh: Verifikasi apakah pembaruan telah tersimpan di *database*)

Pada skenario ini, Anda dapat menggunakan *framework* seperti [Cypress](https://www.cypress.io/) atau *library* seperti [puppeteer](https://github.com/GoogleChrome/puppeteer) agar anda dapat mengunjungi banyak rute navigasi dan menguji efek samping tidak hanya pada *browser*, namun juga pada *backend*.