---
id: cdn-links
title: Tautan CDN
permalink: docs/cdn-links.html
prev: create-a-new-react-app.html
next: hello-world.html
---

React dan ReactDOM tersedia melalui CDN.

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
```

Versi di atas hanya dimaksudkan untuk pengembangan dan tidak cocok untuk produksi. Versi produksi React yang telah diperkecil dan dioptimalkan tersedia di:

```html
<script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Untuk memuat versi spesifik dari `react` dan `react-dom`, ganti `16` dengan nomor versi.

### Mengapa Atribut `crossorigin`? {#why-the-crossorigin-attribute}

Jika Anda menjalankan React dari CDN, kami merekomendasikan untuk tetap membiarkan set atribut [`crossorigin`](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes):

```html
<script crossorigin src="..."></script>
```

Kami juga merekomendasikan untuk memverifikasi bahwa CDN yang Anda gunakan menetapkan HTTP *header* `Access-Control-Allow-Origin: *`:

![Access-Control-Allow-Origin: *](../images/docs/cdn-cors-header.png)

Hal ini memungkinkan [pengalaman penanganan kesalahan](/blog/2017/07/26/error-handling-in-react-16.html) di React 16 dan yang lebih baru.
