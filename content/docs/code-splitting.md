---
id: code-splitting
title: Code-Splitting
permalink: docs/code-splitting.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React and include live examples:
>
> - [`lazy`](https://react.dev/reference/react/lazy)
> - [`<Suspense>`](https://react.dev/reference/react/Suspense)

</div>

## Bundel {#bundling}

Kebanyakan aplikasi React akan "membundel" *file* menggunakan alat bantu seperti [Webpack](https://webpack.js.org/), [Rollup](https://rollupjs.org/) atau [Browserify](http://browserify.org/). Pembundelan ini adalah sebuah proses yang menelusuri sejumlah *file* yang terimpor dan digabungkan menjadi sebuah file: sebuah "bundel". Bundel ini kemudian dapat digunakan dalam halaman web untuk memuat keseluruhan aplikasi sekaligus.

#### Contoh {#example}

**App:**

```js
// app.js
import { add } from './math.js';

console.log(add(16, 26)); // 42
```

```js
// math.js
export function add(a, b) {
  return a + b;
}
```

**Bundel:**

```js
function add(a, b) {
  return a + b;
}

console.log(add(16, 26)); // 42
```

> Catatan:
>
> Bundel Anda akan terlihat sangat berbeda dari contoh yang ada.

Jika Anda menggunakan [Create React App](https://create-react-app.dev/), [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/), atau alat bantu lain yang serupa, maka Anda akan sudah mempunyai pengaturan Webpack bawaan dari alat bantu tersebut untuk membundel aplikasi Anda.

Jika tidak, maka Anda perlu untuk membuat sendiri pengaturan pembundelan. Sebagai contoh, Anda bisa melihat panduan pengaturan Webpack di [Installation](https://webpack.js.org/guides/installation/) dan
[Getting Started](https://webpack.js.org/guides/getting-started/).

## Code Splitting {#code-splitting}

Bundel adalah hal yang bagus, namun seiring berkembangnya aplikasi Anda, ukuran bundel Anda akan membesar juga. Terutama jika Anda menggunakan *library* dari pihak ketiga. Anda perlu untuk sangat memperhatikan kode yang akan dimasukkan ke dalam bundel sehingga Anda tidak secara tidak sengaja menjadikannya berukuran sangat besar sehingga butuh waktu lama untuk memuat aplikasi Anda.

Untuk menghindari masalah dengan bundel yang besar, ada baiknya Anda melakukan penanggulangan awal dan mulai untuk "memecah" bundel Anda. *Code-Splitting* adalah sebuah fitur yang didukung oleh *bundler* semacam [Webpack](https://webpack.js.org/guides/code-splitting/), [Rollup](https://rollupjs.org/guide/en/#code-splitting) dan Browserify (menggunakan [factor-bundle](https://github.com/browserify/factor-bundle)) yang memungkinkan pembuatan banyak bundel yang dapat dimuat secara dinamis saat *runtime*.

*Code-splitting* pada aplikasi Anda dapat dimanfaatkan untuk melakukan *"lazy-load"* untuk memuat hanya hal-hal yang sedang dibutuhkan oleh pengguna saja, yang dapat meningkatkan performa aplikasi Anda secara drastis. Jumlah kode pada aplikasi Anda memang tidak berkurang, namun Anda telah mengurangi proses untuk memuat kode yang bahkan tidak dibutuhkan  oleh pengguna, serta mengurangi jumlah kode yang dimuat pada proses inisialisasi awal.

## `import()` {#import}

Cara terbaik untuk memperkenalkan *code-splitting* ke dalam aplikasi Anda adalah dengan menggunakan sintaks *dynamic* `import()`.

**Sebelum:**

```js
import { add } from './math';

console.log(add(16, 26));
```

**Sesudah:**

```js
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```

Ketika Webpack membaca sintaks ini, maka proses *code-splitting* pada aplikasi Anda akan dijalankan. Jika Anda menggunakan *Create React App*, pengaturan ini sudah tersedia dan Anda bisa [langsung menggunakannya](https://create-react-app.dev/docs/code-splitting/). Pengaturan ini juga disediakan di [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import).

Jika Anda membuat sendiri pengaturan Webpack Anda, Anda mungkin dapat melihat [panduan untuk melakukan *code-splitting* ini](https://webpack.js.org/guides/code-splitting/). Pengaturan Webpack Anda kira-kira akan terlihat mirip [seperti ini](https://gist.github.com/gaearon/ca6e803f5c604d37468b0091d9959269).

Jika menggunakan [Babel](https://babeljs.io/), Anda perlu memastikan apakah Babel dapat membaca sintaks *dynamic import* ini namun tidak mengubahnya. Untuk itu Anda memerlukan [@babel/plugin-syntax-dynamic-import](https://classic.yarnpkg.com/en/package/@babel/plugin-syntax-dynamic-import). 

## `React.lazy` {#reactlazy}

Fungsi `React.lazy` memungkinkan Anda melakukan *render* hasil impor dinamis sebagai component biasa.

**Sebelum:**

```js
import OtherComponent from './OtherComponent';
```

**Sesudah:**

```js
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

Dengan menggunakan cara ini, bundel yang mengandung `OtherComponent` akan termuat secara otomatis ketika komponen ini ter-*render* pertama kalinya.

`React.lazy` membutuhkan sebuah fungsi yang harus memanggil *dynamic* `import()`. Fungsi ini harus mengembalikan sebuah `Promise` yang menghasilkan modul dengan ekspor `default` yang mengandung sebuah komponen React.

Komponen *lazy* kemudian akan ter-*render* di dalam sebuah komponen `Suspense`, yang membuat kita dapat memunculkan sebuah komponen pengganti (misalnya memunculkan indikator *loading*) selagi kita menunggu komponen *lazy* selesai dimuat.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Sedang memuat...</div>}>
        <OtherComponent />
      </Suspense>
    </div>
  );
}
```
*Props* `fallback` dapat diisi dengan elemen React apapun yang ingin Anda tampilkan selama menunggu komponen untuk dimuat. Anda bisa menggunakan komponen `Suspense` dimanapun di atas komponen yang dimuat secara *lazy*. Anda bahkan dapat membungkus beberapa komponen *lazy* dengan sebuah komponen *Suspense*.

```js
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

function MyComponent() {
  return (
    <div>
      <Suspense fallback={<div>Sedang memuat...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </div>
  );
}
```

### Avoiding fallbacks {#avoiding-fallbacks}
Any component may suspend as a result of rendering, even components that were already shown to the user. In order for screen content to always be consistent, if an already shown component suspends, React has to hide its tree up to the closest `<Suspense>` boundary. However, from the user's perspective, this can be disorienting.

Consider this tab switcher:

```js
import React, { Suspense } from 'react';
import Tabs from './Tabs';
import Glimmer from './Glimmer';

const Comments = React.lazy(() => import('./Comments'));
const Photos = React.lazy(() => import('./Photos'));

function MyComponent() {
  const [tab, setTab] = React.useState('photos');
  
  function handleTabSelect(tab) {
    setTab(tab);
  };

  return (
    <div>
      <Tabs onTabSelect={handleTabSelect} />
      <Suspense fallback={<Glimmer />}>
        {tab === 'photos' ? <Photos /> : <Comments />}
      </Suspense>
    </div>
  );
}

```

In this example, if tab gets changed from `'photos'` to `'comments'`, but `Comments` suspends, the user will see a glimmer. This makes sense because the user no longer wants to see `Photos`, the `Comments` component is not ready to render anything, and React needs to keep the user experience consistent, so it has no choice but to show the `Glimmer` above.

However, sometimes this user experience is not desirable. In particular, it is sometimes better to show the "old" UI while the new UI is being prepared. You can use the new [`startTransition`](/docs/react-api.html#starttransition) API to make React do this:

```js
function handleTabSelect(tab) {
  startTransition(() => {
    setTab(tab);
  });
}
```

Here, you tell React that setting tab to `'comments'` is not an urgent update, but is a [transition](/docs/react-api.html#transitions) that may take some time. React will then keep the old UI in place and interactive, and will switch to showing `<Comments />` when it is ready. See [Transitions](/docs/react-api.html#transitions) for more info.

### Batasan *Error* {#error-boundaries}

Jika sebuah modul gagal dimuat (misalnya karena kesalahan jaringan), maka sebuah *error* akan terpicu. Anda dapat menangani *error* tersebut untuk menampilkan *user experience* yang baik dan memungkinkan pembenahan kembali dengan menggunakan [Batasan *Error*](/docs/error-boundaries.html). Ketika Anda telah membuat batasan *error*, Anda dapat menggunakannya pada komponen *lazy* untuk memunculkan tampilan *error* khusus ketika terjadi kesalahan jaringan.

```js
import React, { Suspense } from 'react';
import MyErrorBoundary from './MyErrorBoundary';

const OtherComponent = React.lazy(() => import('./OtherComponent'));
const AnotherComponent = React.lazy(() => import('./AnotherComponent'));

const MyComponent = () => (
  <div>
    <MyErrorBoundary>
      <Suspense fallback={<div>Sedang memuat...</div>}>
        <section>
          <OtherComponent />
          <AnotherComponent />
        </section>
      </Suspense>
    </MyErrorBoundary>
  </div>
);
```

## *Code splitting* berdasarkan *route* {#route-based-code-splitting}

Tidak selalu mudah menentukan untuk mulai mengimplementasikan *code splitting* di aplikasi Anda. Anda ingin memastikan di mana sebuah bundel dapat terbagi dengan baik tanpa mengganggu *user experience*.

Tempat awal yang baik untuk memulai adalah dari *route*. Kebanyakan orang yang menggunakan *web* sudah terbiasa dengan transisi antar halaman yang membutuhkan waktu untuk dimuat. Anda mungkin juga akan me-*render* ulang seluruh isi halaman sekaligus sehingga pengguna juga tidak akan berinteraksi dengan elemen lain pada halaman dalam waktu yang sama. 

Berikut contoh bagaimana cara mengatur *code-splitting* berdasarkan *route* dengan `React.lazy` pada *library* semacam [React Router](https://reactrouter.com/).

```js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));

const App = () => (
  <Router>
    <Suspense fallback={<div>Sedang memuat...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  </Router>
);
```

## Named Exports {#named-exports}

`React.lazy` sementara ini hanya dapat digunakan untuk modul dengan ekspor `default`. Jika modul yang ingin Anda impor menggunakan *named exports* (ekspor modul yang diberi nama dan tidak menggunakan *default*), Anda dapat membuat modul perantara yang mengekspor ulang modul tersebut sebagai *default*. Cara ini memastikan proses *treeshaking* tetap berjalan dan tidak mengikutsertakan komponen yang tidak terpakai.

```js
// ManyComponents.js
export const MyComponent = /* ... */;
export const MyUnusedComponent = /* ... */;
```

```js
// MyComponent.js
export { MyComponent as default } from "./ManyComponents.js";
```

```js
// MyApp.js
import React, { lazy } from 'react';
const MyComponent = lazy(() => import("./MyComponent.js"));
```
