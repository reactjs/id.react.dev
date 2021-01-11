---
id: optimizing-performance
title: Mengoptimalkan Performa
permalink: docs/optimizing-performance.html
redirect_from:
  - "docs/advanced-performance.html"
---

Secara internal, React menggunakan beberapa teknik cermat untuk meminimalkan jumlah operasi DOM boros yang diperlukan untuk memperbarui UI. Bagi sebagian besar aplikasi, menggunakan React akan menghasilkan antarmuka pengguna yang cepat tanpa harus melakukan pekerjaan tambahan untuk mengoptimalkan performa secara spesifik. Meskipun demikian, ada beberapa cara untuk mempercepat aplikasi React Anda.

## Menggunakan Versi Produksi {#use-the-production-build}

Apabila Anda melakukan *benchmarking* atau mengalami masalah performa di aplikasi React Anda, pastikan Anda mencobanya dengan versi produksi yang telah di *minified*.

Secara *default*, React mengandung banyak pesan peringatan. Peringatan-peringatan ini sangat berguna dalam pengembangan aplikasi. Namun, pesan-pesan ini membuat React menjadi lebih besar dan lambat sehingga Anda harus memastikan menggunakan versi produksi ketika Anda men-*deploy* aplikasi.

Jika Anda tidak yakin apakah proses *build* Anda sudah diatur dengan benar atau belum, Anda bisa mengeceknya dengan menginstal [React Developer Tools untuk Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). Jika Anda mengunjungi situs yang menggunakan React dalam versi produksi, ikon ekstensi akan memiliki latar belakang gelap:

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
<script src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
```

Ingat bahwa hanya *file* React yang berakhir dengan `.production.min.js` yang layak digunakan untuk produksi.

### Brunch {#brunch}

Untuk *build* produksi yang efisien menggunakan Brunch, instal *plugin* [`terser-brunch`](https://github.com/brunch/terser-brunch):

```
# Jika menggunakan npm
npm install --save-dev terser-brunch

# Jika menggunakan Yarn
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
<<<<<<< HEAD
# Jika menggunakan npm
npm install --save-dev envify terser uglifyify 

# Jika menggunakan Yarn
yarn add --dev envify terser uglifyify 
=======
# If you use npm
npm install --save-dev envify terser uglifyify

# If you use Yarn
yarn add --dev envify terser uglifyify
>>>>>>> 82b8c9f2ab094eb7b0268029ab72fc99ffcadaf6
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
# Jika menggunakan npm
npm install --save-dev rollup-plugin-commonjs rollup-plugin-replace rollup-plugin-terser

# Jika menggunakan Yarn
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

Untuk panduan lebih lengkap, baca [artikel ini oleh Ben Schwarz](https://calibreapp.com/blog/react-performance-profiling-optimization).

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

Jika aplikasi Anda me-*render* *list* data yang panjang (ratusan atau ribuan baris), kami menyarankan menggunakan teknik "windowing". Teknik ini hanya me-*render* bagian kecil dari baris-baris data Anda dalam waktu tertentu, dan dapat mengurangi waktu untuk me-*render* ulang komponen Anda serta jumlah simpul DOM yang dibuat secara signifikan.

[react-window](https://react-window.now.sh/) dan [react-virtualized](https://bvaughn.github.io/react-virtualized/) adalah *library* *windowing* paling populer. *Library-library* ini menyediakan beberapa komponen untuk menampilkan data-data dalam bentuk *list*, *grid*, dan tabular. Anda juga dapat membuat komponen *windowing* versi Anda sendiri, seperti [yang dilakukan Twitter](https://medium.com/@paularmstrong/twitter-lite-and-high-performance-react-progressive-web-apps-at-scale-d28a00e780a3), jika Anda ingin sesuatu yang lebih dikhususkan untuk *use case* aplikasi Anda.

## Menghindari Rekonsiliasi {#avoid-reconciliation}

React membangun dan memelihara representasi internal dari UI yang di-*render*. Representasi ini berisi elemen-elemen React yang dikembalikan dari komponen Anda. Representasi ini memungkinkan React menghindari membuat simpul DOM baru dan mengakses simpul DOM yang sudah ada diluar keperluan, karena mereka bisa lebih lambat daripada operasi dalam obyek JavaScript. Terkadan hal ini disebut sebagai "virtual DOM", namun dapat juga bekerja secara sama di React Native.

Ketika *props* atau *state* komponen berubah, React memutuskan apakah pembaruan DOM yang sesungguhnya diperlukan dengan membandingkan elemen yang baru dikembalikan dengan elemen yang sebelumnya di-render. Ketika keduanya tidak sama, React akan memperbarui DOM.

Meskipun React hanya memperbarui simpul DOM yang berubah, me-*render* ulang tetap memerlukan waktu tambahan. Dalam banyak kasus ini tidak menjadi masalah, namun ketika ada perlambatan yang signifikan, Anda dapat mempercepatnya dengan meng-*override* *lifecycle* `shouldComponentUpdate`, yang dijalankan sebelum proses *render* ulang dimulai. Implementasi bawaan fungsi ini mengembalikan `true`, yang membuat React melakukan pembaruan tersebut:

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return true;
}
```

Jika Anda tahu bahwa dalam beberapa kasus komponen Anda tidak perlu diperbarui, Anda dapat mengembalikan `false` dari `shouldComponentUpdate`, untuk melewati seluruh proses rendering, termasuk memanggil `render()` dalam komponen ini dan komponen-komponen didalamnya.

Dalam banyak kasus, alih-alih menuliskan `shouldComponentUpdate()` secara manual, Anda dapat meng-*inherit* dari [`React.PureComponent`](/docs/react-api.html#reactpurecomponent). Ini sama seperti mengimplementasikan `shouldComponentUpdate()` dengan perbandingan dangkal dari *props* dan *state* sekarang.

## Cara Kerja shouldComponentUpdate {#shouldcomponentupdate-in-action}

Berikut adalah subdiagram beberapa komponen. Dalam setiap komponen, `SCU` mengindikasikan apa yang dikembalikan `shouldComponentUpdate`, dan `vDOMEq` mengindikasikan apakah elemen-elemen React yang di-*render* ekuivalen. Akhirnya, warna lingkaran mengindikasikan apakah komponen tersebut harus direkonsiliasikan atau tidak.

<figure><img src="../images/docs/should-component-update.png" style="max-width:100%" /></figure>

Karena `shouldComponentUpdate` mengembalikan `false` pada subdiagram yang mengakar pada C2, React tidak akan me-*render* C2, dan dengan demikian tidak perlu menjalankan `shouldComponentUpdate` di C4 dan C5.

Untuk C1 dan C3, `shouldComponentUpdate` mengembalikan `true`, sehingga React harus menelusuri cabang komponen dan mengeceknya. Untuk C6 `shouldComponentUpdate` mengembalikan `true`, dan karena elemen yang di-*render* tidak ekuivalen React harus memperbarui DOM.

Kasus menarik yang terakhir adalah C8. React harus me-*render* komponen ini, tapi karena elemen-elemen React yang dikembalikan sama dengan elemen yang sebelumnya di-*render*, ia tidak harus memperbarui DOM.

Perlu dicatat bahwa React hanya perlu melakukan mutasi DOM untuk C6, yang tidak dapat dihindari. Untuk C8, ia menghindari mutasi DOM dengan membandingkan elemen-elemen React yang di-*render*, dan untuk subdiagram komponen C2 dan C7, ia bahkan tidak perlu membandingkan elemen-elemennya karena kita sudah menghindarinya di dalam `shouldComponentUpdate`, jadi `render` tidak dipanggil.

## Contoh {#examples}

Jika satu-satunya cara komponen Anda berubah adalah ketika variabel `props.color` atau `state.count` berubah, Anda dapat mengeceknya melalui `shouldComponentUpdate`:

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

Dalam kode ini, `shouldComponentUpdate` hanya memeriksa jika ada perubahan dalam `props.color` atau `state.count`. Jika nilai variabel-variabel tersebut tidak berubah, komponen tidak akan diperbarui. Jika komponen Anda menjadi lebih kompleks, Anda dapat menggunakan pola serupa dengan melakukan "perbandingan dangkal" (*shallow comparison*) diantara semua nilai di dalam `props` dan `state` untuk menentukan apakah komponen harus diperbarui. Pola ini cukup umum sehingga React menyediakan *helper* khusus untuk menggunakan logika ini - tinggal melakukan *inherit* dari `React.PureComponent`. Jadi kode di bawah adalah cara lebih simpel untuk melakukan hal serupa:

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

Seringkali, Anda dapat menggunakan `React.PureComponent` alih-alih menuliskan `shouldComponentUpdate` versi Anda sendiri. `React.PureComponent` melakukan perbandingan dangkal, jadi Anda tidak dapat menggunakannya apabila *props* atau *state* mungkin termutasi dengan cara yang tidak tertangkap oleh perbandingan dangkal.

Hal ini akan menjadi masalah dalam komponen dengan struktur data yang lebih kompleks. Misalnya, Anda ingin komponen `ListOfWords` me-*render* *list* kata yang terpisahkan oleh koma, dengan komponen induk `WordAdder` yang memungkinkan Anda mengklik tombol untuk menambahkan kata ke dalam *list*. Kode di bawah *tidak akan* bekerja secara benar:

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
    // Bagian ini merupakan contoh buruk dan akan menghasilkan bug
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

Masalahnya adalah `PureComponent` akan melakukan perbandingan sederhana antara nilai baru dan lama dari `this.props.words`. Karena kode ini memutasikan senarai `words` di dalam *method* `handleClick` pada `WordAdder`, perbandingan nilai lama dan baru dari `this.props.words` akan menghasilkan nilai serupa, meskipun kata-kata di dalam senarai telah berubah. Oleh karena itu, komponen `ListOfWords` tidak akan diperbarui meskipun ada kata-kata baru yang seharusnya di-*render*.

## Keuntungan Tidak Memutasi Data {#the-power-of-not-mutating-data}

Cara paling simpel untuk menghindari masalah di atas adalah menghindari memutasi nilai-nilai yang akan digunakan di dalam *props* atau *state*. Sebagai contoh, *method* `handleClick` dapat ditulis ulang dengan `concat` seperti contoh berikut:

```javascript
handleClick() {
  this.setState(state => ({
    words: state.words.concat(['marklar'])
  }));
}
```

ES6 mendukung [sintaksis *spread*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator) untuk senarai yang membuat proses ini lebih mudah. Jika Anda menggunakan Create React App, sintaksis ini sudah bisa digunakan.

```js
handleClick() {
  this.setState(state => ({
    words: [...state.words, 'marklar'],
  }));
};
```

Anda juga dapat menuliskan ulang kode yang memutasi objek untuk menghindari mutasi, dengan cara yang sama. Sebagai contoh, umpamakan kita memiliki objek bernama `colormap` dan kita ingin membuat fungsi yang mengubah `colormap.right` menjadi `'blue'`. Kita dapat menuliskan:

```js
function updateColorMap(colormap) {
  colormap.right = 'blue';
}
```

Untuk menuliskan fungsi ini tanpa memutasikan objek aslinya, kita dapat menggunakan *method* [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign):

```js
function updateColorMap(colormap) {
  return Object.assign({}, colormap, {right: 'blue'});
}
```

`updateColorMap` sekarang mengembalikan objek baru, daripada memutasikan objek yang lama. `Object.assign` berada di spesifikasi ES6 dan membutuhkan *polyfill*.

[Properti *spread* objek](https://github.com/sebmarkbage/ecmascript-rest-spread) membuat pembaruan objek tanpa mutasi menjadi lebih mudah:

```js
function updateColorMap(colormap) {
  return {...colormap, right: 'blue'};
}
```

<<<<<<< HEAD
Fitur ini ditambahkan ke JavaScript di ES2018.
=======
This feature was added to JavaScript in ES2018.
>>>>>>> 82b8c9f2ab094eb7b0268029ab72fc99ffcadaf6

Jika Anda menggunakan Create React App, `Object.assign` dan sintaksis *spread* untuk objek sudah tersedia.

Ketika berurusan dengan objek bersarang dalam, memperbaruinya secara *immutable* dapat menjadi sulit. Jika Anda memiliki masalah ini, cobalah [Immer](https://github.com/mweststrate/immer) atau [immutability-helper](https://github.com/kolodny/immutability-helper). *Library* ini memungkinkan Anda membuat kode yang lebih mudah dibaca tanpa menanggalkan keuntungan-keuntungan *immutability*.
