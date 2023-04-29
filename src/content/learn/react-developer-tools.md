---
title: React Developer Tools
---

<Intro>

Gunakan React Developer Tools untuk memeriksa [komponen](/learn/your-first-component), menyunting [*props*](/learn/passing-props-to-a-component) dan [*state*](/learn/state-a-components-memory), dan mengidentifikasi masalah kinerja.

</Intro>

<YouWillLearn>

* Cara menginstal React Developer Tools

</YouWillLearn>

## Ekstensi peramban {/*browser-extension*/}

Cara termudah untuk melakukan debugging website yang dibangun dengan React adalah dengan menginstal ekstensi peramban React Developer Tools. Ekstensi ini tersedia untuk beberapa peramban populer:

* [Instal untuk **Chrome**](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
* [Instal untuk **Firefox**](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
* [Instal untuk **Edge**](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil)

Sekarang, jika Anda mengunjungi sebuah website **yang dibangun dengan React,** Anda akan melihat panel _Components_ dan _Profiler_.

![React Developer Tools extension](/images/docs/react-devtools-extension.png)

### Safari and peramban lainnya {/*safari-and-other-browsers*/}
Untuk peramban lainnya (misalnya, Safari), instal *package* npm [`react-devtools`](https://www.npmjs.com/package/react-devtools):

```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Selanjutnya buka React Developer Tools dari terminal:

```bash
react-devtools
```

Lalu sambungkan *website* Anda dengan menambahkan tag `<script>` berikut ke awal `<head>` *website* Anda:

```html {3}
<html>
  <head>
    <script src="http://localhost:8097"></script>
```

Reload website Anda sekarang untuk melihatnya di React Developer Tools.

![React Developer Tools standalone](/images/docs/react-devtools-standalone.png)

## Mobile (React Native) {/*mobile-react-native*/}
React Developer Tools dapat digunakan untuk memeriksa aplikasi yang dibangun dengan [React Native](https://reactnative.dev/) juga.

Cara termudah untuk menggunakan React Developer Tools adalah dengan menginstalnya secara global:
```bash
# Yarn
yarn global add react-devtools

# Npm
npm install -g react-devtools
```

Selanjutnya buka React Developer Tools dari terminal:
```bash
react-devtools
```

React Developer Tools akan terhubung ke aplikasi React Native lokal yang sedang berjalan.

> Lakukan reload aplikasi jika React Developer Tools tidak terhubung setelah beberapa detik.

[Pelajari lebih lanjut tentang debugging React Native.](https://reactnative.dev/docs/debugging)

