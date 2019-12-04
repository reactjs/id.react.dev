---
id: optimizing-performance
title: Mengoptimalkan Performa
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Secara internal, React menggunakan beberapa teknik cermat untuk meminimalkan jumlah operasi DOM mahal yang diperlukan untuk memperbarui UI. Bagi sebagian besar aplikasi, menggunakan React akan menghasilkan antaramuka pengguna yang cepat tanpa harus melakukan pekerjaan tambahan untuk mengoptimalkan performa secara spesifik. Meskipun demikian, ada beberapa cara Anda dapan mempercepat aplikasi React Anda.

## Menggunakan Versi Produksi {#use-the-production-build}

Apabila Anda melakukan *benchmarking* atau mengalami masalah performa di aplikasi React Anda, pastikan Anda mencobanya dengan versi produksi yang telah *minified*.

Secara *default*, React mengandung banyak pesan peringatan. Peringatan-peringatan ini sangat berguna dalam pengembangan aplikasi. Namun, pesan-pesan ini membuat React menjadi lebih besar dan lambat sehingga Anda harus memastikan menggunakan versi produksi ketika Anda men-*deploy* aplikasi.

Jika Anda tidak yakin apakah proses *build* anda sudah diatur dengan benar atau belum, Anda bisa mengeceknya dengan menginstal [React Developer Tools untuk Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Jika Anda mengunjungi situs yang menggunakan React dalam versi produksi, ikon ekstensi akan memiliki latar belakang gelap:

<img src="../images/docs/devtools-prod.png" style="max-width:100%" alt="React DevTools dalam situs dengan versi produksi React">

Jika Anda mengunjungi situs yang menggunakan React dalam mode pengembangan, ikon ekstensi akan memiliki latar belakang merah:

<img src="../images/docs/devtools-dev.png" style="max-width:100%" alt="React DevTools dalam situs dengan versi pengembangan React.">

Anda diharapkan menggunakan mode pengembangan ketika mengerjakan aplikasi Anda, dan mode produksi ketika men-*deploy* aplikasi Anda kepada pengguna.

Anda dapat menemukan instruksi untuk membangun aplikasi Anda untuk mode produksi di bawah.

### Create React App {#create-react-app}

Jika proyek Anda dibangun menggunakan [Create React App](https://github.com/facebookincubator/create-react-app), jalankan:

```
npm run build
```

Ini akan membuat versi produksi untuk aplikasi Anda di dalam folder `build/` di proyek Anda.

Ingat bahwa ini hanya diperlukan sebelum men-*deploy* ke produksi. Untuk pengembangan normal, gunakan `npm start`.

### *Single-File Build* {#single-file-builds}

Kami menyediakan versi siap produksi dari React dan React DOM sebagai *file* tunggal:

```html
<script src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
```

Ingat bahwa hanya *file* React yang berakhir dengan `.production.min.js` yang layak digunakan untuk produksi.

### Brunch {#brunch}

Untuk *build* produksi yang efisien menggunakan Brunch, instal *plugin* [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# If you use npm
npm install --save-dev terser-brunch

# If you use Yarn
yarn add --dev terser-brunch
```

Kemudian, untuk membuat *build* produksi, tambahkan *flag* `-p` ke *command* `build`:

```
brunch build -p
```

Ingat bahwa Anda hanya perlu melakukan ini di *build* produksi. Anda tidak perlu mengoper *flag* `-p` atau mengaplikasikan *plugin* ini dalam pengembangan, karena akan menyembunyikan peringatan React yang berguna dan membuat waktu *build* lebih lambat.

### Browserify {#browserify}

Untuk *build* produksi yang efisien menggunakan Browserify, instal plugin-plugin berikut:

```
# If you use npm
npm install --save-dev envify terser uglifyify 

# If you use Yarn
yarn add --dev envify terser uglifyify 
```

Untuk membangun versi produksi, pastikan Anda menambahkan *transform* berikut **(urutan ini penting)**:

* *Transform* [`envify`](https://github.com/hughsk/envify) memastikan pengaturan *build environment* telah tepat. Aplikasikan secara global (`-g`).
* *Transform* [`uglifyify`](https://github.com/hughsk/uglifyify) menghapus *import-import* pengembangan. Aplikasikan secara global juga (`-g`).
* Akhirnya, bundel akhir di-pipe ke [`terser`](https://github.com/terser-js/terser) untuk proses *mangling* ([baca alasannya](https://github.com/hughsk/uglifyify#motivationusage)).

Contoh:

```
browserify ./index.js \
  -g [ envify --NODE_ENV production ] \
  -g uglifyify \
  | terser --compress --mangle > ./bundle.js
```

Ingat bahwa Anda hanya perlu melakukan ini di *build* produksi. Anda tidak perlu mengaplikasikan mengaplikasikan *plugin* ini dalam pengembangan, karena akan menyembunyikan peringatan React yang berguna dan membuat waktu *build* lebih lambat.

### Rollup {#rollup}

Untuk *build* produksi yang efisien menggunakan Rollup, instal plugin-plugin berikut:

```bash
# If you use npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# If you use Yarn
yarn add --dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser
```

Untuk membangun versi produksi, pastikan Anda menambahkan plugin-plugin berikut **(urutan ini penting)**:

* *Plugin* [`replace`](https://github.com/rollup/rollup-plugin-replace) memastikan pengaturan *build environment* telah tepat.
* *Plugin* [`commonjs`](https://github.com/rollup/rollup-plugin-commonjs) mengaktifkan dukungan CommonJS di Rollup.
* *Plugin* [`terser`](https://github.com/TrySound/rollup-plugin-terser) mengkompresikan dan melakukan proses *mangling* pada bundel akhir.

```js
plugins: [
  // ...
  require('rollup-plugin-replace')({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  require('rollup-plugin-commonjs')(),
  require('rollup-plugin-terser')(),
  // ...
]
```

[Lihat gist ini](https://gist.github.com/Rich-Harris/cb14f4bc0670c47d00d191565be36bf0) untuk contoh pengaturan lengkap.

Ingat bahwa Anda hanya perlu melakukan ini di *build* produksi. Anda tidak perlu mengaplikasikan plugin `terser` atau plugin `replace` dengan *value* `'production'` dalam pengembangan karena akan menyembunyikan peringatan React yang berguna dan membuat waktu *build* lebih lambat.

### webpack {#webpack}

>**Catatan:**
>
>Jika Anda menggunakan Create React App, ikuti [instruksi di atas](#create-react-app).<br>
>Bagian ini hanya relevan jika Anda melakukan konfigurasi webpack sendiri.

Webpack v4+ akan me-*minify* kode Anda secara *default* di mode produksi.

```js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  optimization: {
    minimizer: [new TerserPlugin({ /* additional options here */ })],
  },
};
```

Anda dapat mempelajari ini lebih lanjut di [dokumentasi webpack](https://webpack.js.org/guides/production/).

Ingat bahwa Anda hanya perlu melakukan ini di *build* produksi. Anda tidak perlu mengaplikasikan `TerserPlugin` dalam pengembangan karena akan menyembunyikan peringatan React yang berguna dan membuat waktu *build* lebih lambat.

## Memprofil Komponen dengan Tab *Performance* Chrome {#profiling-components-with-the-chrome-performance-tab}

Dalam mode **pengembangan**, Anda dapat memvisualisasikan bagaimana komponen terpasang, diperbarui, dan dilepas, mengunakan perangkat performa di peramban web yang mendukungnya. Sebagai contoh:

<center><img src="../images/blog/react-perf-chrome-timeline.png" style="max-width:100%" alt="Komponen React di timeline Chrome" /></center>

Cara melakukannya di Chrome:

1. **Matikan seluruh ekstensi Chrome secara sementara, termasuk React DevTools**. Ekstensi tambahan dapat mengubah hasil uji performa!

2. Pastikan Anda menjalankan aplikasi dalam mode pengembangan.

3. Buka tab **[Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)** pada Chrome DevTools dan tekan **Record** untuk merekam.

4. Lakukan aksi-aksi yang ingin Anda profil. Jangan merekan lebih dari 20 detik, ini akan membuat Chrome *hang*.

5. Berhenti merekam.

6. *Event* React akan dikelompokkan dalam label **User Timing**.

Untuk panduan lebih lengkap, baca [artikel ini oleh Ben Schwarz](https://building.calibreapp.com/debugging-react-performance-with-react-16-and-chrome-devtools-c90698a522ad).

Perlu dicatat bahwa **nilai-nilai ini adalah relatif sehingga komponen akan me-*render* lebih cepat di mode produksi**. Tetap saja, ini akan membantu Anda untuk mengetahui ketika bagian UI yang tidak relevan diperbarui secara tidak sengaja, dan seberapa dalam dan sering pembaruan UI terjadi.

Saat ini hanya Chrome, Edge, and IE yang mendukung fitur ini, tapi kita menggunakan [User Timing API](https://developer.mozilla.org/en-US/docs/Web/API/User_Timing_API) yang terstandarisasi sehingga kami memperkirakan peramban web lain akan menambahkan dukungan terhadap API tersebut.

## Memprofil Komponen dengan Profiler DevTools {#profiling-components-with-the-devtools-profiler}

`react-dom` 16.5+ dan `react-native` 0.57+ menyediakan kemampuan memprofil tambahan dalam mode pengembangan dengan Profiler React DevTools.
Sebuah ikhtisar mengenai *profiler* tersebut dapat ditemukan dalam postingan blog ["Introducing the React Profiler"](/blog/2018/09/10/introducing-the-react-profiler.html).
Panduan video profiler ini juga [tersedia di YouTube](https://www.youtube.com/watch?v=nySib7ipZdk).

Jika Anda belum menginstal React DevTools, Anda dapat menemukannya di sini:

- [Versi Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Versi Firefox](https://addons.mozilla.org/en-GB/firefox/addon/react-devtools/)
- [*Standalone Package* di Node](https://www.npmjs.com/package/react-devtools)

> Catatan
>
> Versi bundel `react-dom` yang dapat memprofil versi produksi juga tersedia di `react-dom/profiling`.
> Baca lebih lanjut mengenai cara penggunaan bundel ini di [fb.me/react-profiling](https://fb.me/react-profiling)

## Memvirtualisasi *List* Panjang {#virtualize-long-lists}

Jika aplikasi Anda me-*render* *list* data yang panjang (ratusan atau ribuan baris), kani menyarankan menggunakan teknik "windowing". Teknik ini hanya me-*render* subset kecil dari baris-baris data Anda dalam waktu tertentu, dan dapat mengurangi waktu me-*render* ulang komponen Anda serta jumlah simpul DOM yang dibuat secara signifikan.

[react-window](https://react-window.now.sh/) dan [react-virtualized](https://bvaughn.github.io/react-virtualized/) adalah *library* *windowing* paling populer. *Library-library* ini menyediakan beberapa komponen untuk menampilkan data-data dalam bentuk *list*, *grid*, dan tabular. Anda juga dapat membuat komponen *windowing* versi Anda sendiri, seperti [yang dilakukan Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), jika Anda ingin sesuatu yang lebih dikhususkan untuk *use case* aplikasi Anda.

## Menghindari Rekonsiliasi {#avoid-reconciliation}

React membangun dan memelihara representasi internal dari UI yang di-*render*. Representasi ini berisi elemen-elemen React yang dikembalikan dari komponen Anda. Representasi ini memungkinkan React menghindari membuat simpul DOM baru dan mengakses simpul DOM yang sudah ada diluar keperluan, karena mereka bisa lebih lambat daripada operasi dalam obyek JavaScript. Terkadan hal ini disebut sebagai "virtual DOM", namun dapat juga bekerja secara sama di React Native.

Ketika *props* atau *state* komponen berubah, React memutuskan apakah pembaruan DOM yang sesungguhnya diperlukan dengan membandingkan elemen yang baru dikembalikan dengan elemen yang sebelumnya di-render. Ketika keduanya tidak sama, React akan memperbarui DOM.

Meskipun React hanya memperbarui simpul DOM yang berubah, me-*render* ulang tetap memerlukan waktu tambahan. Dalam banyak kasus ini tidak menjadi masalah, namun ketika ada perlambatan yang signifikan, Anda dapat mempercepatnya dengan meng-*override* *lifecycle* `shouldComponentUpdate`, yang dijalankan sebelum proses *render* ulang dimulai. Implementasi bawaan fungsi ini mengembalikan `true`, yang membuat react React melakukan pembaruan tersebut:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Jika Anda tahu bahwa dalam beberapa kasus komponen Anda tidak perlu diperbarui, Anda dapat mengembalikan `false` dari `shouldComponentUpdate`, untuk melewati seluruh proses rendering, termasuk memanggil `render()` dalam komponen ini dan komponen-komponen didalamnya.

Dalam banyak kasus, alih-alih menuliskan `shouldComponentUpdate()` secara manual, Anda dapat meng-*inherit* dari [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Ini sama seperti mengimplementasikan `shouldComponentUpdate()` dengan perbandingan dangkal dari *props* dan *state* sekarang.

## shouldComponentUpdate In Action {#shouldcomponentupdate-in-action}

Here's a subtree of components. For each one, `SCU` indicates what `shouldComponentUpdate` returned, and `vDOMEq` indicates whether the rendered React elements were equivalent. Finally, the circle's color indicates whether the component had to be reconciled or not.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Since `shouldComponentUpdate` returned `false` for the subtree rooted at C2, React did not attempt to render C2, and thus didn't even have to invoke `shouldComponentUpdate` on C4 and C5.

For C1 and C3, `shouldComponentUpdate` returned `true`, so React had to go down to the leaves and check them. For C6 `shouldComponentUpdate` returned `true`, and since the rendered elements weren't equivalent React had to update the DOM.

The last interesting case is C8. React had to render this component, but since the React elements it returned were equal to the previously rendered ones, it didn't have to update the DOM.

Note that React only had to do DOM mutations for C6, which was inevitable. For C8, it bailed out by comparing the rendered React elements, and for C2's subtree and C7, it didn't even have to compare the elements as we bailed out on `shouldComponentUpdate`, and `render` was not called.

## Examples {#examples}

If the only way your component ever changes is when the `props.color` or the `state.count` variable changes, you could have `shouldComponentUpdate` check that:

```javascript
class CounterButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.color !== nextProps.color) {
      return true;
    }
    if (this.state.count !== nextState.count) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

In this code, `shouldComponentUpdate` is just checking if there is any change in `props.color` or `state.count`. If those values don't change, the component doesn't update. If your component got more complex, you could use a similar pattern of doing a "shallow comparison" between all the fields of `props` and `state` to determine if the component should update. This pattern is common enough that React provides a helper to use this logic - just inherit from `React.PureComponent`. So this code is a simpler way to achieve the same thing:

```js
class CounterButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {count: 1};
  }

  render() {
    return (
      <button
        color={this.props.color}
        onClick={() => this.setState(state => ({count: state.count + 1}))}>
        Count: {this.state.count}
      </button>
    );
  }
}
```

Most of the time, you can use `React.PureComponent` instead of writing your own `shouldComponentUpdate`. It only does a shallow comparison, so you can't use it if the props or state may have been mutated in a way that a shallow comparison would miss.

This can be a problem with more complex data structures. For example, let's say you want a `ListOfWords` component to render a comma-separated list of words, with a parent `WordAdder` component that lets you click a button to add a word to the list. This code does *not* work correctly:

```javascript
class ListOfWords extends React.PureComponent {
  render() {
    return <div>{this.props.words.join(',')}</div>;
  }
}

class WordAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words: ['marklar']
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // This section is bad style and causes a bug
    const words = this.state.words;
    words.push('marklar');
    this.setState({words: words});
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick} />
        <ListOfWords words={this.state.words} />
      </div>
    );
  }
}
```

The problem is that `PureComponent` will do a simple comparison between the old and new values of `this.props.words`. Since this code mutates the `words` array in the `handleClick` method of `WordAdder`, the old and new values of `this.props.words` will compare as equal, even though the actual words in the array have changed. The `ListOfWords` will thus not update even though it has new words that should be rendered.

## The Power Of Not Mutating Data {#the-power-of-not-mutating-data}

The simplest way to avoid this problem is to avoid mutating values that you are using as props or state. For example, the `handleClick` method above could be rewritten using `concat` as:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 supports a [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) for arrays which can make this easier. If you're using Create React App, this syntax is available by default.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

You can also rewrite code that mutates objects to avoid mutation, in a similar way. For example, let's say we have an object named `colormap` and we want to write a function that changes `colormap.right` to be `'blue'`. We could write:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

To write this without mutating the original object, we can use [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) method:

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` now returns a new object, rather than mutating the old one. `Object.assign` is in ES6 and requires a polyfill.

There is a JavaScript proposal to add [object spread properties](https://github.com/sebmarkbage/ecmascript-rest-spread) to make it easier to update objects without mutation as well:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

If you're using Create React App, both `Object.assign` and the object spread syntax are available by default.

When you deal with deeply nested objects, updating them in an immutable way can feel convoluted. If you run into this problem, check out [Immer](https://github.com/mweststrate/immer) or [immutability-helper](https://github.com/kolodny/immutability-helper). These libraries let you write highly readable code without losing the benefits of immutability.
