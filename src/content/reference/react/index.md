---
title: "Ikhtisar Referensi React"
---

<Intro>

Bagian ini menyediakan dokumentasi referensi yang mendetail untuk bekerja dengan React. Untuk pengenalan tentang React, Silahkan kunjungi bagian [Learn](/learn).

</Intro>

Dokumentasi referensi React dibagi menjadi beberapa sub-bagian fungsional:

## React {/*react*/}

Fitur-fitur React yang diprogram:

<<<<<<< HEAD
* [*Hooks*](/reference/react/hooks) — Gunakan bermacam-macam fitur React dari komponen Anda.
* [Komponen](/reference/react/components) — Mendokumentasikan komponen bawaan yang dapat digunakan di JSX Anda.
* [API](/reference/react/apis) — API yang berguna untuk mendefinisikan komponen.
* [Directive](/reference/react/directives) — Menyediakan instruksi ke *bundler* yang kompatibel dengan React Server Component.
=======
* [Hooks](/reference/react/hooks) - Use different React features from your components.
* [Components](/reference/react/components) - Built-in components that you can use in your JSX.
* [APIs](/reference/react/apis) - APIs that are useful for defining components.
* [Directives](/reference/rsc/directives) - Provide instructions to bundlers compatible with React Server Components.
>>>>>>> 6ae99dddc3b503233291da96e8fd4b118ed6d682

## React DOM {/*react-dom*/}

React-dom berisi fitur-fitur yang hanya didukung untuk aplikasi web (yang berjalan di lingkungan peramban DOM). Bagian ini dibagi menjadi beberapa bagian berikut ini:

* [*Hooks*](/reference/react-dom/hooks) — *Hooks* untuk aplikasi web yang berjalan di lingkungan peramban DOM.
* [Komponen](/reference/react-dom/components) — React mendukung semua komponen HTML dan SVG bawaan peramban.
* [API](/reference/react-dom) — Paket `react-dom` berisi metode-metode yang hanya didukung dalam aplikasi web.
* [API Klien](/reference/react-dom/client) — API `react-dom/client` memungkinkan Anda untuk me-*render* komponen React pada klien (di peramban).
* [API Server](/reference/react-dom/server) — API `react-dom/server` memungkinkan Anda untuk me-*render* komponen React ke HTML di server.

## Aturan React {/*rules-of-react*/}

React memiliki idiom — atau aturan — tentang cara mengekspresikan pola dengan cara yang mudah dimengerti dan menghasilkan aplikasi berkualitas tinggi:

* [Komponen dan *Hooks* harus murni](/reference/rules/components-and-hooks-must-be-pure) — Kemurnian membuat kode Anda lebih mudah dipahami, di-*debug*, dan memungkinkan React untuk secara otomatis mengoptimalkan komponen dan *Hook* Anda dengan benar.
* [React memanggil Komponen dan *Hooks*](/reference/rules/react-calls-components-and-hooks) — React bertanggung jawab untuk me-*render* komponen dan *Hooks* ketika diperlukan untuk mengoptimalkan pengalaman pengguna.
* [Peraturan *Hooks*](/reference/rules/rules-of-hooks) — *Hooks* didefinisikan menggunakan fungsi JavaScript, tetapi *Hooks* merepresentasikan tipe khusus dari logika UI yang dapat digunakan kembali dengan batasan di mana *Hooks* tersebut dapat dipanggil.

## API Lama {/*legacy-apis*/}

* [API Lama](/reference/react/legacy) — Diekspor dari paket `react`, tetapi tidak direkomendasikan untuk digunakan pada kode yang baru ditulis.
