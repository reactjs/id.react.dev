---
id: forwarding-refs
title: Forwarding Refs
permalink: docs/forwarding-refs.html
---

*Ref forwarding* adalah sebuah teknik untuk meneruskan [ref](/docs/refs-and-the-dom.html) secara otomatis melalui komponen ke salah satu anaknya. Ini biasanya tidak diperlukan untuk sebagian besar komponen dalam aplikasi. Namun, ini bisa berguna untuk beberapa jenis komponen, terutama di pustaka komponen yang dapat digunakan kembali. Skenario paling umum dijelaskan di bawah ini.

## *Forwarding refs* ke komponen DOM {#forwarding-refs-to-dom-components}

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

## *Forwarding refs* dalam *higher-order components* {#forwarding-refs-in-higher-order-components}

This technique can also be particularly useful with [higher-order components](/docs/higher-order-components.html) (also known as HOCs). Let's start with an example HOC that logs component props to the console:
`embed:forwarding-refs/log-props-before.js`

The "logProps" HOC passes all `props` through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our "fancy button" component:
`embed:forwarding-refs/fancy-button.js`

There is one caveat to the above example: refs will not get passed through. That's because `ref` is not a prop. Like `key`, it's handled differently by React. If you add a ref to a HOC, the ref will refer to the outermost container component, not the wrapped component.

This means that refs intended for our `FancyButton` component will actually be attached to the `LogProps` component:
`embed:forwarding-refs/fancy-button-ref.js`

Fortunately, we can explicitly forward refs to the inner `FancyButton` component using the `React.forwardRef` API. `React.forwardRef` accepts a render function that receives `props` and `ref` parameters and returns a React node. For example:
`embed:forwarding-refs/log-props-after.js`

## Menampilkan nama *custom* di DevTools {#displaying-a-custom-name-in-devtools}

`React.forwardRef` menerima fungsi *render*. React DevTools menggunakan fungsi ini untuk menentukan apa yang akan ditampilkan untuk komponen *ref forwarding*.

Sebagai contoh, komponen berikut akan muncul sebagai "*ForwardRef*" di DevTools:

`embed:forwarding-refs/wrapped-component.js`

Jika Anda menamai fungsi *render*, DevTools juga akan menyertakan namanya (misalnya "*ForwardRef(myFunction)*"):

`embed:forwarding-refs/wrapped-component-with-function-name.js`

Anda bahkan dapat menyetel properti `displayName` pada fungsi untuk menyertakan komponen yang Anda bungkus:

`embed:forwarding-refs/customized-display-name.js`