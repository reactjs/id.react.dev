---
id: forwarding-refs
title: Forwarding Refs
permalink: docs/forwarding-refs.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)
> - [`forwardRef`](https://react.dev/reference/react/forwardRef)

</div>

*Ref forwarding* adalah sebuah teknik untuk meneruskan [ref](/docs/refs-and-the-dom.html) secara otomatis melalui komponen ke salah satu anaknya. Ini biasanya tidak diperlukan untuk sebagian besar komponen dalam aplikasi. Namun, ini bisa berguna untuk beberapa jenis komponen, terutama di pustaka komponen yang dapat digunakan kembali. Skenario paling umum dijelaskan di bawah ini.

## Mengoper refs ke komponen DOM {#forwarding-refs-to-dom-components}

Pertimbangkan sebuah komponen `FancyButton` yang me-render native DOM element yaitu `button`:
`embed:forwarding-refs/fancy-button-simple.js`

Komponen React menyembunyikan detail implementasi mereka, termasuk keluaran render mereka. Komponen-komponen lainnya yang menggunakan `FancyButton` **biasanya tidak perlu untuk** [mendapatkan sebuah ref](/docs/refs-and-the-dom.html) ke dalam DOM element `button`. Ini bagus karena hal ini mencegah komponen untuk bersandar pada struktur DOM komponen lain yang berlebihan.

Meskipun enkapsulasi seperti itu diperlukan oleh komponen yang berada di application-level seperti `FeedStory` atau `Comment`, namun hal tersebut dapat menyulitkan komponen-komponen "leaf" yang sering digunakan kembali seperti `FancyButton` atau `MyTextInput`. Komponen ini cenderung digunakan di seluruh aplikasi dengan cara yang sama seperti regular DOM `button` dan `input`, dan mungkin tidak dapat dihindari mengakses DOM nodes mereka untuk mengelola focus, selection, atau animation.

**Ref forwarding adalah sebuah fitur keikutsertaan yang memperbolehkan beberapa komponen-komponen mengambil sebuah `ref` yang didapatkan, dan menurunkannya (dengan kata lain, "meneruskan" nya) kepada child.**

Pada contoh di bawah ini, `FancyButton` menggunakan `React.forwardRef` untuk mendapatkan `ref` yang diteruskan kepadanya, lalu meneruskannya ke `button` DOM yang di render:
`embed:forwarding-refs/fancy-button-simple-ref.js`

Dengan cara ini, komponen-komponen yang menggunakan `FancyButton` bisa mendapatkan ref ke DOM node `button` yang mendasarinya dan mengaksesnya jika perlu - sama seperti jika mereka menggunakan `button` DOM secara langsung. 

Berikut adalah penjelasan langkah demi langkah tentang apa yang terjadi pada contoh di atas:

1. Kita buat sebuah [React ref](/docs/refs-and-the-dom.html) dengan memanggil `React.createRef` dan masukan kedalam variabel `ref`.
1. Kita teruskan `ref` tersebut ke `<FancyButton ref={ref}>` dengan menulisnya sebagai atribut JSX.
1. React meneruskan `ref` ke fungsi `(props, ref) => ...` di dalam `forwardRef` sebagai argumen kedua.
1. Kita teruskan argumen `ref` tersebut ke `<button ref={ref}>` dengan menulisnya sebagai atribut JSX.
1. Jika ref sudah terpasang, `ref.current` akan mengarah ke DOM node `<button>`.

>Catatan
>
>Argumen `ref` kedua hanya ada saat Anda mendefinisikan komponen dengan `React.forwardRef`. Regular function atau class components tidak menerima argumen `ref` tersebut, dan ref juga tidak teredia di props.
>
>Ref forwarding tidak terbatas pada komponen DOM. Anda juga dapat meneruskan refs ke class component instances.

## Catatan untuk pengelola pustaka komponen {#note-for-component-library-maintainers}

**Saat Anda mulai menggunakan `forwardRef` di pustaka komponen, Anda harus memperlakukannya sebagai sebuah *breaking change* dan merilis versi mayor baru pustaka Anda.** Ini karena pustaka Anda kemungkinan besar memiliki perilaku yang sangat berbeda (seperti *refs* apa yang ditetapkan, dan tipe apa yang diekspor), dan ini bisa merusak aplikasi dan pustaka lain yang bergantung pada perilaku lama.

Menerapkan `React.forwardRef` secara kondisional jika ada juga tidak disarankan karena alasan yang sama: ini mengubah cara pustaka Anda berperilaku dan bisa merusak aplikasi pengguna Anda saat mereka meningkatkan versi React itu sendiri.

## Mengoper refs dalam higher-order components {#forwarding-refs-in-higher-order-components}

Teknik ini juga bisa menjadi sangat berguna untuk [higher-order components](/docs/higher-order-components.html) (biasa disebut dengan HOCs). Mari kita mulai dengan contoh HOC yang mengeluarkan component props ke log konsol:
`embed:forwarding-refs/log-props-before.js`

HOC "logProps" meneruskan semua `props` ke komponen yang dibungkusnya, sehingga keluaran yang dirender akan sama. Misalnya, kita dapat menggunakan HOC ini untuk mengeluarkan semua props ke log konsol yang diteruskan ke "fancy button" komponen kita:
`embed:forwarding-refs/fancy-button.js`

Ada satu peringatan untuk contoh diatas: refs tidak akan diteruskan. Itu karena `ref` bukan sebuah prop. Seperti `key`, ini ditangani secara berbeda oleh React. Jika Anda menambahkan ref ke HOC, maka ref akan merujuk ke komponen container terluar, bukan komponen yang dibungkus.

Ini berarti bahwa ref yang dimaksudkan untuk komponen `FancyButton` kita sebenarnya akan dilampirkan ke `LogProps` komponen:
`embed:forwarding-refs/fancy-button-ref.js`

Untungnya, kita dapat secara eksplisit meneruskan refs kedalam komponen `FancyButton` menggunakan `React.forwardRef` API. `React.forwardRef` menerima sebuah fungsi render yang menerima parameter `props` dan `ref` dan mengembalikan React node. Sebagai contoh:
`embed:forwarding-refs/log-props-after.js`

## Menampilkan nama custom di DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` menerima fungsi *render*. React DevTools menggunakan fungsi ini untuk menentukan apa yang akan ditampilkan untuk komponen *ref forwarding*.

Sebagai contoh, komponen berikut akan muncul sebagai "*ForwardRef*" di DevTools:
`embed:forwarding-refs/wrapped-component.js`

Jika Anda menamai fungsi *render*, DevTools juga akan menyertakan namanya (misalnya "*ForwardRef(myFunction)*"):
`embed:forwarding-refs/wrapped-component-with-function-name.js`

Anda bahkan dapat menyetel properti `displayName` pada fungsi untuk menyertakan komponen yang Anda bungkus:
`embed:forwarding-refs/customized-display-name.js`