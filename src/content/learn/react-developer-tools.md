---
title: Alat pengembang React
---

<Intro>

Gunakan Alat Pengembang React untuk memeriksa [komponen](/learn/your-first-component), menyunting [*props*](/learn/passing-props-to-a-component) dan [*state*](/learn/state-a-components-memory), dan mengidentifikasi masalah kinerja.

</Intro>

<YouWillLearn>

* Cara memasang Alat Pengembang React

</YouWillLearn>

## Ekstensi Browser {/*browser-extension*/}

Cara termudah untuk melakukan debugging website yang dibangun dengan React adalah dengan memasang ekstensi browser Alat Pengembang React. Ekstensi ini tersedia untuk beberapa browser populer:

* [Pasang untuk **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Pasang untuk **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Pasang untuk **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Sekarang, jika Anda mengunjungi sebuah website **yang dibangun dengan React,** Anda akan melihat panel _Components_ dan _Profiler_.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari and browser lainnya {/*safari-and-other-browsers*/}
Untuk browser lainnya (misalnya, Safari), pasang paket npm [`react-devtools`](https://www.npmjs.com/package/react-devtools):

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Selanjutnya buka alat pengembang dari terminal:

```bash
react-devtools
```

Lalu sambungkan website Anda dengan menambahkan tag `<script>` berikut ke awal `<head>` website Anda:

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Reload website Anda sekarang untuk melihatnya di alat pengembang.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
Alat Pengembang React dapat digunakan untuk memeriksa aplikasi yang dibangun dengan [React Native](https://reactnative.dev/) juga.

Cara termudah untuk menggunakan Alat Pengembang React adalah dengan memasangnya secara global:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Selanjutnya buka alat pengembang dari terminal:
```bash
react-devtools
```

Alat Pengembang React akan terhubung ke aplikasi React Native lokal yang sedang berjalan.

> Lakukan reload aplikasi jika alat pengembang tidak terhubung setelah beberapa detik.

[Pelajari lebih lanjut tentang debugging React Native.](https://reactnative.dev/docs/debugging)

