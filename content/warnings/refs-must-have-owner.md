---
title: Refs Must Have Owner Warning
layout: single
permalink: warnings/refs-must-have-owner.html
---

Anda berada disini kemungkinan karena mendapati salah satu pesan kesalahan (_error_) berikut:

*React 16.0.0+*
> _Warning:_
>
> _Element ref was specified as a string (myRefName) but no owner was set. You may have multiple copies of React loaded. (details: https://fb.me/react-refs-must-have-owner)_.

*React versi sebelumnya*
> _Warning:_
>
> _addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded._

Biasanya ini terjadi karena salah satu dari tiga hal berikut:

- Anda mencoba untuk menambahkan `ref` pada sebuah _function component_.
- Anda mencoba menambahkan `ref` pada sebuah elemen yang dibuat diluar fungsi `render()` komponen tersebut.
- Anda memuat beberapa salinan React yang saling bertentangan (misalnya dikarenakan kesalahan konfigurasi dependensi npm).

## _Refs_ pada _Function Components_ {#refs-on-function-components}

Jika `<Foo>` merupakan sebuah _function component_, Anda tidak dapat menambahkan _ref_ padanya.
```js
// Tidak akan bekerja jika Foo adalah sebuah fungsi!
<Foo ref={foo} />
```

Jika anda perlu menambahkan _ref_ pada sebuah komponen, ubahlah komponen tersebut menjadi kelas terlebih dahulu, atau pertimbangkan untuk tidak menggunakan _ref_ karena biasanya _ref_ [jarang diperlukan](/docs/refs-and-the-dom.html#when-to-use-refs).

## Strings Refs Outside the Render Method {#strings-refs-outside-the-render-method}

## _String Ref_ Berada Diluar _Method Render_ {#strings-refs-outside-the-render-method}

Biasanya ini terjadi ketika Anda mencoba untuk menambahkan _ref_ pada komponen yang tidak ada pemiliknya (yaitu komponen yang tidak dibuat didalam _method_ `render` komponen lain). Contohnya, kode ini tidak bisa jalan:
```js
// Tidak bisa jalan!
ReactDOM.render(<App ref="app" />, el);
```

Cobalah untuk me-_render_ komponen ini didalam sebuah komponen dengan level lebih tinggi yang dapat memuat _ref_-nya. Sebagai alternatif, Anda dapat menggunakan _callback ref_:
```js
let app;
ReactDOM.render(
  <App ref={inst => {
    app = inst;
  }} />,
  el
);
```

Coba pertimbangkan apakah Anda [benar-benar membutuhkan _ref_](/docs/refs-and-the-dom.html#when-to-use-refs) sebelum menggunakan pendekatan ini.

## Beberapa salinan React {#multiple-copies-of-react}

Bower bekerja dengan baik dalam mengurangi duplikasi dependensi, namun tidak dengan npm. Jika Anda tidak melakukan sesuatu yang aneh-aneh dengan _ref_, kemungkinan permasalahannya tidak terletak pada _ref_, melainkan pada beberapa salinan React yang dimuat didalam proyek Anda. Terkadang jika Anda melakukan penarikan modul pihak ketiga melalui npm, Anda akan mendapatkan duplikasi salinan dari _library_ dependensi, dan ini akan menjadi masalah.

Jika Anda menggunakan npm... `npm ls` atau `npm ls react` mungkin dapat membantu mencerahkan.
