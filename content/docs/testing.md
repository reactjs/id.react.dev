---
id: testing
title: Testing Overview
permalink: docs/testing.html
redirect_from:
  - "community/testing.html"
next: testing-recipes.html
---

Anda dapat men-_testing_ komponen React mirip dengan men-_testing_ kode JavaScript lainnya.

Ada beberapa cara untuk men-_testing_ komponen pada React. Secara umum, dibagi menjadi dua kategori:

* **_Rendering component trees_** di dalam tes _environment_ yang sudah disederhanakan dan ditegaskan pada outputnya.
* **Menjalankan aplikasi lengkap** di dalam _environment_ browser asli (juga dikenal sebagai tes “end-to-end”).

Bagian dokumentasi ini berfokus pada strategi tes untuk kasus pertama. Sementara tes _end-to-end_ secara menyeluruh bisa sangat berguna untuk mencegah regresi terhadap alur kerja yang penting, tes semacam itu tidak diperhatikan terutama pada komponen React, dan berada di luar cakupan bagian ini.

### Tradeoffs {#tradeoffs}


Saat memilih _testing tools_, perlu mempertimbangkan beberapa _tradeoffs_:

* **Kecepatan Iterasi vs _environment_ yang Realistis:** Beberapa _tools_ menawarkan _feedback loop_ yang sangat cepat antar membuat sebuah perubahan dan melihat hasilnya, tetapi jangan memodelkan _behavior_ dari browser dengan tepat. _Tools_ lain mungkin menggunakan _environment_ browser yang asli, tetapi mengurangi kecepatan iterasi dan lebih _flakier_ pada server integrasi berkelanjutan.
* **Seberapa banyak _mock_:** Dengan komponen, perbedaan antara tes "unit" dan tes "integrasi" bisa tidak sesuai. Jika Anda men-_testing_ sebuah form, haruskah tes yang dilakukan juga menguji tombol yang ada di dalamnya? Atau haruskah komponen memiliki rangkaian tes sendiri? Haruskah _refactoring_ pada tombol yang dapat merusak tes pada form?

Jawaban yang berbeda mungkin berlaku untuk tim & produk yang berbeda.

### _Tools_ yang direkomendasikan {#tools}

**[Jest](https://facebook.github.io/jest/)** adalah _test runner_ pada JavaScript yang memungkinkan Anda dapat mengakses DOM melalui [`jsdom`](/docs/testing-environments.html#mocking-a-rendering-surface). Sementara jsdom hanyalah perkiraan cara kerja browser, seringkali cukup baik men-_testing_ komponen pada React. Jest memberikan kecepatan iterasi yang bagus dikombinasikan dengan fitur-fitur yang _powerful_ seperti mocking [modules](/docs/testing-environments.html#mocking-modules) dan [timers](/docs/testing-environments.html#mocking-timers) sehingga Anda dapat memiliki kontrol lebih pada kode yang dijalankan.

**[React Testing Library](https://testing-library.com/react)** adalah seperangkat _helpers_ yang memungkinakan Anda men-_testing_ komponen pada React tanpa bergantung pada detail implementasinya. Pendekatan ini membuat _refactoring_ menjadi mudah dan juga mendorong Anda untuk menerapkan _best practices_ untuk aksesbilitas. Mungkin tidak memberikan cara untuk  me-_render_ "shallowly" pada sebuah komponen tanpa _children_, _test runner_ seperti Jest yang memungkinkan Anda melakukan [mocking](/docs/testing-recipes.html#mocking-modules).

### Pembelajaran lainnya {#learn-more}

Bagian ini dibagi dalam dua halaman:

- [_Recipes_](/docs/testing-recipes.html): _Common patterns_ pada saat menulis tes pada komponen React.
- [_Environments_](/docs/testing-environments.html): Apa yang harus dipertimbangkan ketika menyiapkan _testing environment_ untuk komponen React.
