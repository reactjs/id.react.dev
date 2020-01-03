---
title: Peringatan Pemanggilan Hook yang Tidak Valid
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

 Anda kemungkinan berada di sini karena pesan galat berikut:

 > Hooks can only be called inside the body of a function component.

Ada tiga alasan umum Anda kemungkinan mendapat pesan tersebut:

1. Anda kemungkinan menggunakan versi React dan React DOM yang tidak cocok.
2. Anda kemungkinan **melanggar [Aturan Hooks](/docs/hooks-rules.html)**
3. Anda kemungkinan memiliki **lebih dari satu salinan React** dalam satu aplikasi.

Mari kita liat pada tiap-tiap kasus.

## Versi React dan React DOM yang tidak cocok {#mismatching-versions-of-react-and-react-dom}

Anda kemungkinan menggunakan versi `react-dom` (< 16.8.0) atau `react-native` (< 0.59) yang belum mendukung Hooks. Anda dapat menjalankan `npm ls react-dom` atau `npm ls react-native` pada folder aplikasi Anda untuk memeriksa versi yang sedang anda gunakan. Jika Anda menemukan lebih dari satu, kemungkinan ini dapat menyebabkan masalah (lebih detail ada pada penjelasan di bawah).

## Melanggar Aturan Hooks {#breaking-the-rules-of-hooks}

Anda hanya dapat memanggil Hooks **saat React me-_render_ fungsional komponen**:

* ✅ Panggil pada tingkatan atas dalam badan fungsional komponen.
* ✅ Panggil pada tingkatan atas dalam badan [custom Hook](/docs/hooks-custom.html).

**Pelajari lebih lanjut tentang ini pada [Aturan Hooks](/docs/hooks-rules.html).**

```js{2-3,8-9}
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

Untuk menghindari kebingungan, Pemanggilan Hooks tidak didukung pada kasus-kasus berikut:

* 🔴 Jangan panggil Hooks di dalam komponen kelas.
* 🔴 Jangan panggil Hooks di *event handler*.
* 🔴 Jangan panggil Hooks di dalam fungsi yang dioper pada `useMemo`, `useReducer`, atau `useEffect`.

Jika anda melanggar aturan-aturan tersebut, anda kemungkinan mendapatkan galat seperti berikut.

```js{3-4,11-12,20-21}
function Bad1() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad2() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad3 extends React.Component {
  render() {
    // 🔴 Bad: inside a class component
    useEffect(() => {})
    // ...
  }
}
```

Anda dapat menggunakan [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk memunculkan beberapa kesalahan di atas.

>Catatan
>
>[Custom Hooks](/docs/hooks-custom.html) *bisa saja* memanggil Hooks lainnya (itu merupakan tujuan utama). Hal ini bekerja karena custom Hooks juga seharusnya hanya dipanggil saat fungsi komponen di-_render_.


## React Ganda{#duplicate-react}

Agar Hooks bekerja, _import_ `react` dari aplikasi Anda perlu menemukan modul yang sama dengan _import_ `react` dari dalam *package* `react-dom`.

Jika kedua _import_ `react` tersebut menemukan dua _export_ obyek yang berbeda, Anda akan melihat peringatan tersebut. Hal ini bisa saja terjadi jika Anda **secara tidak sengaja menggunakan dua salinan** dari *package* `react`.

Jika anda menggunakan _Node_ untuk pengelolaan paket, Anda dapat mejalankan perintah ini di dalam berkas proyek Anda:

    npm ls react

Jika anda menemukan lebih dari satu React, Anda perlu temukan kenapa hal ini terjadi dan perbaiki _dependency tree_ Anda. Contohnya, kemungkinan _library_ yang anda gunakan, menentukan `react` secara salah sebagai _dependency_ (daripada _peer dependency_). Sampai _library_ tersebut diperbaik, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) dapat menjadi salah satu solusi.

Anda juga dapat mencoba men-_debug_ masalah ini dengan cara menambahkan beberapa _logs_ dan memuat ulang _development server_ Anda:

```js
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);
```

Jika pada contoh di atas menampilkan `false` maka Anda kemungkinan memiliki dua React dan temukan kenapa hal tersebut bisa terjadi. [Permasalahan ini](https://github.com/facebook/react/issues/13991) mencakup beberapa alasan umum yang dialami komunitas.

Permasalahan ini juga dapat muncul ketika menggunakan `npm link` atau semisalnya. Pada kasus tersebut, _bundler_ Anda mungkin saja "melihat" dua React — satu di dalam berkas aplikasi dan satu di dalam berkas _library_. Misalkan `myapp` dan `mylib` merupakan berkas yang sejajar, salah satu perbaikan yang memungkinkan ialah menjalankan `npm link ../myapp/node_modules/react` dari `mylib`. Hal ini seharusnya membuat _library_ menggunakan salinan aplikasi React.

>Note
>
>Secara umum, React mendukung penggunaan salinan independen ganda dalam satu halaman (Contohnya, saat sebuah aplikasi dan sebuah _third-party widget_ menggunakan yang sama). Hal tersebut hanya berhenti bekerja jika `require('react')` menemukan secara berada antara komponen dan salinan `react-dom` yang digunakan untuk me-_render_.

## Penyebab Lainnya {#other-causes}

Jika tidak ada yang berdampak, silahkan berkomentar pada [permasalahan ini](https://github.com/facebook/react/issues/13991) dan kita akan mencoba membantu. Coba buat sebuah contoh kecil yang dapat dibuat kembali — Anda mungkin saja menemukan masalah tersebut saat melakukannya.
