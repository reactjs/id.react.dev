---
id: testing
title: Testing Overview
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Anda dapat mengetes komponen React mirip dengan mengetes kode JavaScript lainnya.

Ada beberapa cara untuk mengeteskomponen pada React. Secara umum, terbagi menjadi dua kategori:

* **_Rendering component trees_** di dalam _environment_ tes yang sudah disederhanakan dan ditegaskan pada keluarannya.
* **Menjalankan aplikasi lengkap** di dalam _environment_ peramban asli (juga dikenal sebagai tes “end-to-end”).

<<<<<<< HEAD
Bagian dokumentasi ini berfokus pada strategi tes untuk kasus pertama. Sementara tes _end-to-end_ secara menyeluruh bisa sangat berguna untuk mencegah regresi terhadap alur kerja yang penting, tes semacam itu tidak diperhatikan terutama pada komponen React, dan berada di luar cakupan bagian ini.
=======
This documentation section focuses on testing strategies for the first case. While full end-to-end tests can be very useful to prevent regressions to important workflows, such tests are not concerned with React components in particular, and are out of the scope of this section.
>>>>>>> dea4f329ea3a7bba116e07adf67eb5c8b6c528cd

### _Tradeoffs_ {#tradeoffs}


Saat memilih kakas pengetesan, perlu mempertimbangkan beberapa _tradeoffs_:

* **Kecepatan iterasi vs _environment_ yang realistis:** Beberapa kakas menawarkan _feedback loop_ yang sangat cepat antara membuat sebuah perubahan dan melihat hasilnya, tetapi tidak memodelkan sifat dari peramban dengan tepat. _Tools_ lain mungkin menggunakan _environment_ peramban yang asli, tetapi mengurangi kecepatan iterasi dan lebih _flakier_ pada server integrasi berkelanjutan.
* **Seberapa banyak _mock_:** Dengan komponen, perbedaan antara tes "unit" dan tes "integrasi" bisa tidak sesuai. Jika Anda mengetes sebuah form, haruskah tes yang dilakukan juga menguji tombol yang ada di dalamnya? Atau haruskah komponen memiliki rangkaian tes sendiri? Haruskah _refactoring_ pada tombol merusak tes pada form?

Jawaban yang berbeda mungkin berlaku untuk tim dan produk yang berbeda.

### Kakas yang direkomendasikan {#tools}

**[Jest](https://facebook.github.io/jest/)** adalah _test runner_ pada JavaScript yang memungkinkan Anda mengakses DOM melalui [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Sementara jsdom hanyalah perkiraan cara kerja browser, seringkali cukup baik mengetes komponen pada React. Jest memberikan kecepatan iterasi yang bagus dikombinasikan dengan fitur-fitur yang _powerful_ seperti _mocking [modules](/docs/testing-environments.html#mocking-modules)_ dan _[timers](/docs/testing-environments.html#mocking-timers)_ sehingga Anda dapat memiliki kontrol lebih pada kode yang dijalankan.

**[React Testing Library](https://testing-library.com/react)** adalah seperangkat _helpers_ yang memungkinkan Anda mengetes komponen pada React tanpa bergantung pada detail implementasinya. Pendekatan ini membuat _refactoring_ menjadi mudah dan juga mendorong Anda untuk menerapkan _best practices_ untuk aksesbilitas. Mungkin tidak memberikan cara untuk  me-_render_ secara "dangkal" pada sebuah komponen tanpa anak, _test runner_ seperti Jest yang memungkinkan Anda melakukan [mocking](/docs/testing-recipes.html#mocking-modules).

### Pembelajaran lainnya {#learn-more}

Bagian ini terbagi dalam dua halaman:

- [_Recipes_](/docs/testing-recipes.html): Pola yang sering dijumpai pada saat menulis tes pada komponen React.
- [_Environments_](/docs/testing-environments.html): Apa yang harus dipertimbangkan ketika menyiapkan _environment_ tes untuk komponen React.
