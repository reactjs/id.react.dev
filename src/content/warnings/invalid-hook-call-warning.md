---
<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
title: Peringatan Pemanggilan Hook yang Tidak Valid
layout: single
permalink: warnings/invalid-hook-call-warning.html
---

 Anda kemungkinan berada di sini karena pesan galat berikut:
=======
title: Rules of Hooks
---

You are probably here because you got the following error message:
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

<ConsoleBlock level="error">

Hooks can only be called inside the body of a function component.

</ConsoleBlock>

Ada tiga alasan umum Anda kemungkinan mendapat pesan tersebut:

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
1. Anda kemungkinan menggunakan versi React dan React DOM yang tidak cocok.
2. Anda kemungkinan **melanggar [Aturan Hooks](/docs/hooks-rules.html)**
3. Anda kemungkinan memiliki **lebih dari satu salinan React** dalam satu aplikasi.
=======
1. You might be **breaking the Rules of Hooks**.
2. You might have **mismatching versions** of React and React DOM.
3. You might have **more than one copy of React** in the same app.
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

Mari kita liat pada tiap-tiap kasus.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## Versi React dan React DOM yang tidak cocok {#mismatching-versions-of-react-and-react-dom}

Anda kemungkinan menggunakan versi `react-dom` (< 16.8.0) atau `react-native` (< 0.59) yang belum mendukung Hooks. Anda dapat menjalankan `npm ls react-dom` atau `npm ls react-native` pada folder aplikasi Anda untuk memeriksa versi yang sedang Anda gunakan. Jika Anda menemukan lebih dari satu, kemungkinan ini dapat menyebabkan masalah (lebih detail ada pada penjelasan di bawah).

## Melanggar Aturan Hooks {#breaking-the-rules-of-hooks}

Anda hanya dapat memanggil Hooks **saat React me-_render_ fungsional komponen**:

* ✅ Panggil pada tingkatan atas dalam badan fungsional komponen.
* ✅ Panggil pada tingkatan atas dalam badan [custom Hook](/docs/hooks-custom.html).

**Pelajari lebih lanjut tentang ini pada [Aturan Hooks](/docs/hooks-rules.html).**
=======
## Breaking Rules of Hooks {/*breaking-rules-of-hooks*/}

Functions whose names start with `use` are called [*Hooks*](/reference/react) in React.

**Don’t call Hooks inside loops, conditions, or nested functions.** Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

* ✅ Call them at the top level in the body of a [function component](/learn/your-first-component).
* ✅ Call them at the top level in the body of a [custom Hook](/learn/reusing-logic-with-custom-hooks).
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

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

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Untuk menghindari kebingungan, Pemanggilan Hooks tidak didukung pada kasus-kasus berikut:

* 🔴 Jangan panggil Hooks di dalam komponen kelas.
* 🔴 Jangan panggil Hooks di *event handler*.
* 🔴 Jangan panggil Hooks di dalam fungsi yang dioper pada `useMemo`, `useReducer`, atau `useEffect`.
=======
It’s **not** supported to call Hooks (functions starting with `use`) in any other cases, for example:

* 🔴 Do not call Hooks inside conditions or loops.
* 🔴 Do not call Hooks after a conditional `return` statement.
* 🔴 Do not call Hooks in event handlers.
* 🔴 Do not call Hooks in class components.
* 🔴 Do not call Hooks inside functions passed to `useMemo`, `useReducer`, or `useEffect`.
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

Jika Anda melanggar aturan-aturan tersebut, Anda kemungkinan mendapatkan galat seperti berikut.

```js{3-4,11-12,20-21}
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
Anda dapat menggunakan [plugin `eslint-plugin-react-hooks`](https://www.npmjs.com/package/eslint-plugin-react-hooks) untuk memunculkan beberapa kesalahan di atas.

>Catatan
>
>[Custom Hooks](/docs/hooks-custom.html) *bisa saja* memanggil Hooks lainnya (itu merupakan tujuan utama). Hal ini bekerja karena custom Hooks juga seharusnya hanya dipanggil saat fungsi komponen di-_render_.
=======
You can use the [`eslint-plugin-react-hooks` plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to catch these mistakes.

<Note>
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

[Custom Hooks](/learn/reusing-logic-with-custom-hooks) *may* call other Hooks (that's their whole purpose). This works because custom Hooks are also supposed to only be called while a function component is rendering.

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
## React Ganda{#duplicate-react}
=======
</Note>

## Mismatching Versions of React and React DOM {/*mismatching-versions-of-react-and-react-dom*/}

You might be using a version of `react-dom` (< 16.8.0) or `react-native` (< 0.59) that doesn't yet support Hooks. You can run `npm ls react-dom` or `npm ls react-native` in your application folder to check which version you're using. If you find more than one of them, this might also create problems (more on that below).

## Duplicate React {/*duplicate-react*/}
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

Agar Hooks bekerja, _import_ `react` dari aplikasi Anda perlu menemukan modul yang sama dengan _import_ `react` dari dalam *package* `react-dom`.

Jika kedua _import_ `react` tersebut menemukan dua _export_ obyek yang berbeda, Anda akan melihat peringatan tersebut. Hal ini bisa saja terjadi jika Anda **secara tidak sengaja menggunakan dua salinan** dari *package* `react`.

Jika Anda menggunakan _Node_ untuk pengelolaan paket, Anda dapat mejalankan perintah ini di dalam berkas proyek Anda:

<TerminalBlock>

npm ls react

</TerminalBlock>

Jika Anda menemukan lebih dari satu React, Anda perlu temukan kenapa hal ini terjadi dan perbaiki _dependency tree_ Anda. Contohnya, kemungkinan _library_ yang Anda gunakan, menentukan `react` secara salah sebagai _dependency_ (daripada _peer dependency_). Sampai _library_ tersebut diperbaik, [Yarn resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) dapat menjadi salah satu solusi.

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

<<<<<<< HEAD:content/warnings/invalid-hook-call-warning.md
>Note
>
>Secara umum, React mendukung penggunaan salinan independen ganda dalam satu halaman (Contohnya, saat sebuah aplikasi dan sebuah _third-party widget_ menggunakan yang sama). Hal tersebut hanya berhenti bekerja jika `require('react')` menemukan secara berada antara komponen dan salinan `react-dom` yang digunakan untuk me-_render_.

## Penyebab Lainnya {#other-causes}
=======
<Note>

In general, React supports using multiple independent copies on one page (for example, if an app and a third-party widget both use it). It only breaks if `require('react')` resolves differently between the component and the `react-dom` copy it was rendered with.

</Note>

## Other Causes {/*other-causes*/}
>>>>>>> 920f32eca6fee820fc22b528c564cf9c65eb786c:src/content/warnings/invalid-hook-call-warning.md

Jika tidak ada yang berdampak, silahkan berkomentar pada [permasalahan ini](https://github.com/facebook/react/issues/13991) dan kita akan mencoba membantu. Coba buat sebuah contoh kecil yang dapat dibuat kembali — Anda mungkin saja menemukan masalah tersebut saat melakukannya.
