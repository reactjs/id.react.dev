---
title: "Ikhtisar Referensi React"
---

<Intro>

Bagian ini menyediakan dokumentasi referensi yang mendetail untuk bekerja dengan React. Untuk pengenalan tentang React, Silahkan kunjungi bagian [Learn](/learn).

</Intro>

Dokumentasi referensi React dibagi menjadi beberapa sub-bagian fungsional:

## React {/*react*/}

Fitur-fitur React yang diprogram:

* [Hooks](/reference/react/hooks) - Gunakan fitur React yang berbeda dari komponen Anda.
* [Components](/reference/react/components) - Mendokumentasikan komponen bawaan yang dapat digunakan di JSX Anda.
* [APIs](/reference/react/apis) - APIs yang berguna untuk mendefinisikan komponen.
* [Directives](/reference/react/directives) - Menyediakan instruksi ke *bundler* yang kompatibel dengan React Server Component.

## React DOM {/*react-dom*/}

React-dom berisi fitur-fitur yang hanya didukung untuk aplikasi web (yang berjalan di lingkungan peramban DOM). Bagian ini dibagi menjadi beberapa bagian berikut ini:

* [Hooks](/reference/react-dom/hooks) - Hooks untuk aplikasi web yang berjalan di lingkungan peramban DOM.
* [Components](/reference/react-dom/components) - React mendukung semua komponen HTML dan SVG bawaan peramban.
* [APIs](/reference/react-dom) - Paket `react-dom` berisi metode-metode yang hanya didukung dalam aplikasi web.
* [Client APIs](/reference/react-dom/client) - API `react-dom/client` memungkinkan Anda untuk me-*render* komponen React pada klien (di peramban).
* [Server APIs](/reference/react-dom/server) - API `react-dom/server` memungkinkan Anda untuk me-*render* komponen React ke HTML di server.

## Aturan React {/*rules-of-react*/}

React memiliki idiom - atau aturan - tentang cara mengekspresikan pola dengan cara yang mudah dimengerti dan menghasilkan aplikasi berkualitas tinggi:

* [Komponen dan Hooks harus murni](/reference/rules/components-and-hooks-must-be-pure) - Kemurnian membuat kode Anda lebih mudah dipahami, di-*debug*, dan memungkinkan React untuk secara otomatis mengoptimalkan komponen dan hook Anda dengan benar.
* [React memanggil Komponen dan Hooks](/reference/rules/react-calls-components-and-hooks) - React bertanggung jawab untuk me-*render* komponen dan hooks ketika diperlukan untuk mengoptimalkan pengalaman pengguna.
* [Rules of Hooks](/reference/rules/rules-of-hooks) - Hooks didefinisikan menggunakan fungsi JavaScript, tetapi hooks merepresentasikan tipe khusus dari logika UI yang dapat digunakan kembali dengan batasan di mana hooks tersebut dapat dipanggil.

## APIs Lama {/*legacy-apis*/}

* [Legacy APIs](/reference/react/legacy) - Diekspor dari paket `react`, tetapi tidak direkomendasikan untuk digunakan pada kode yang baru ditulis.
