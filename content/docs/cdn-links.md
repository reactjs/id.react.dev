---
id: cdn-links
title: Tautan CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: release-channels.html
---

React dan ReactDOM tersedia melalui CDN.

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
```

Versi di atas hanya dimaksudkan untuk lingkungan pengembangan dan tidak cocok untuk lingkungan produksi. Versi React yang telah diperkecil dan dioptimalkan untuk lingkungan produksi tersedia di:

```html
<script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

<<<<<<< HEAD
Untuk memuat versi spesifik dari `react` dan `react-dom`, ganti `16` dengan nomor versi yang sesuai.
=======
To load a specific version of `react` and `react-dom`, replace `17` with the version number.
>>>>>>> aa70dcedc6db07987a814dba2b296cc4c5219860

### Mengapa Atribut `crossorigin`? {#why-the-crossorigin-attribute}

Jika Anda menjalankan React dari CDN, kami merekomendasikan untuk tetap membiarkan set atribut [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Kami juga merekomendasikan untuk memverifikasi bahwa CDN yang Anda gunakan menetapkan HTTP *header* `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Hal ini dapat membuat [pengalaman penanganan kesalahan](/blog/2017/07/26/error-handling-in-react-16.html) yang lebih baik di React versi 16 dan versi yang lebih baru.
