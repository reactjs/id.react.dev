---
title: API Klien React DOM
---

<Intro>

API `react-dom/client` memungkinkan Anda me-*render* komponen React di sisi klien (di peramban). Biasanya API ini digunakan pada level teratas aplikasi React untuk menginisialisasi pohon React Anda. Sebuah [*framework*](/learn/start-a-new-react-project#production-grade-react-frameworks) mungkin memanggilnya untuk Anda. Biasanya komponen Anda tidak perlu mengimpor atau menggunakannya.

</Intro>

---

## API Klien {/*client-apis*/}

* [`createRoot`](/reference/react-dom/client/createRoot) memungkinkan Anda membuat akar (*root*) yang digunakan untuk menampilkan komponen React di dalam simpul (*node*) DOM peramban.
* [`hydrateRoot`](/reference/react-dom/client/hydrateRoot) memungkinkan Anda menampilkan komponen React di dalam simpul DOM peramban  yang telah dihasilkan oleh [`react-dom/server`.](/reference/react-dom/server)

---

## Dukungan peramban {/*browser-support*/}

React mendukung semua peramban populer, termasuk Internet Explorer 9 dan yang lebih baru. Beberapa *polyfills* dibutuhkan untuk peramban lama seperti IE 9 dan IE 10.