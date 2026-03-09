---
title: "Pengantar Referensi React"
---

<Intro>

Bagian ini menyediakan dokumentasi referensi yang mendetail untuk bekerja dengan React. Untuk pengenalan tentang React, Silahkan kunjungi bagian [Learn](/learn).

</Intro>

Dokumentasi referensi React dibagi menjadi beberapa sub-bagian fungsional:

## React {/*react*/}

Fitur-fitur React yang diprogram:

* [Hooks](/reference/react/hooks) — Gunakan bermacam-macam fitur React dari komponen Anda.
* [Komponen](/reference/react/components) — Komponen bawaan yang dapat digunakan di JSX Anda.
* [API](/reference/react/apis) — API yang berguna untuk mendefinisikan komponen.
* [Direktif](/reference/rsc/directives) — Menyediakan instruksi ke *bundler* yang kompatibel dengan Komponen Server React.

## React DOM {/*react-dom*/}

<<<<<<< HEAD
React-dom berisi fitur-fitur yang hanya didukung untuk aplikasi web (yang berjalan di lingkungan peramban DOM). Bagian ini dibagi menjadi beberapa bagian berikut ini:

* [Hooks](/reference/react-dom/hooks) — Hooks untuk aplikasi web yang berjalan di lingkungan peramban DOM.
* [Komponen](/reference/react-dom/components) — React mendukung semua komponen HTML dan SVG bawaan peramban.
* [API](/reference/react-dom) — Paket `react-dom` berisi metode-metode yang hanya didukung dalam aplikasi web.
* [API Klien](/reference/react-dom/client) — API `react-dom/client` memungkinkan Anda untuk me-*render* komponen React pada klien (di peramban).
* [API Server](/reference/react-dom/server) — API `react-dom/server` memungkinkan Anda untuk me-*render* komponen React ke HTML di server.
=======
React DOM contains features that are only supported for web applications (which run in the browser DOM environment). This section is broken into the following:

* [Hooks](/reference/react-dom/hooks) - Hooks for web applications which run in the browser DOM environment.
* [Components](/reference/react-dom/components) - React supports all of the browser built-in HTML and SVG components.
* [APIs](/reference/react-dom) - The `react-dom` package contains methods supported only in web applications.
* [Client APIs](/reference/react-dom/client) - The `react-dom/client` APIs let you render React components on the client (in the browser).
* [Server APIs](/reference/react-dom/server) - The `react-dom/server` APIs let you render React components to HTML on the server.
* [Static APIs](/reference/react-dom/static) - The `react-dom/static` APIs let you generate static HTML for React components.

## React Compiler {/*react-compiler*/}

The React Compiler is a build-time optimization tool that automatically memoizes your React components and values:

* [Configuration](/reference/react-compiler/configuration) - Configuration options for React Compiler.
* [Directives](/reference/react-compiler/directives) - Function-level directives to control compilation.
* [Compiling Libraries](/reference/react-compiler/compiling-libraries) - Guide for shipping pre-compiled library code.

## ESLint Plugin React Hooks {/*eslint-plugin-react-hooks*/}

The [ESLint plugin for React Hooks](/reference/eslint-plugin-react-hooks) helps enforce the Rules of React:

* [Lints](/reference/eslint-plugin-react-hooks) - Detailed documentation for each lint with examples.
>>>>>>> 7c90c6eb4bb93a5eacb9cb4ad4ca496c32984636

## Aturan React {/*rules-of-react*/}

React memiliki idiom — atau aturan — tentang cara mengekspresikan pola dengan cara yang mudah dimengerti dan menghasilkan aplikasi berkualitas tinggi:

* [Komponen dan *Hooks* harus murni](/reference/rules/components-and-hooks-must-be-pure) — Kemurnian membuat kode Anda lebih mudah dipahami, di-*debug*, dan memungkinkan React untuk secara otomatis mengoptimalkan komponen dan *Hook* Anda dengan benar.
* [React memanggil Komponen dan *Hooks*](/reference/rules/react-calls-components-and-hooks) — React bertanggung jawab untuk me-*render* komponen dan *Hooks* ketika diperlukan untuk mengoptimalkan pengalaman pengguna.
* [Peraturan *Hooks*](/reference/rules/rules-of-hooks) — *Hooks* didefinisikan menggunakan fungsi JavaScript, tetapi *Hooks* merepresentasikan tipe khusus dari logika UI yang dapat digunakan kembali dengan batasan di mana *Hooks* tersebut dapat dipanggil.

## API Lama {/*legacy-apis*/}

* [API Lama](/reference/react/legacy) — Diekspor dari paket `react`, tetapi tidak direkomendasikan untuk digunakan pada kode yang baru ditulis.
