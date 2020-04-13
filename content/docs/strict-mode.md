---
id: strict-mode
title: Mode Ketat (Strict Mode)
permalink: docs/strict-mode.html
---

Mode Ketat (`StrictMode`) merupakan alat untuk menyoroti potensi masalah dalam aplikasi. Seperti halnya `Fragment`, `StrictMode` tidak me-_render_ antarmuka yang tampak. Mode ini mengaktifkan pemeriksaan dan peringatan ekstra untuk turunannya.

> Catatan:
>
> Pemeriksaan mode ketat hanya berjalan dalam mode pengembangan. Mode ini _tidak_ berdampak dalam _build_ produksi.

Anda bisa mengaktifkan mode ketat untuk berbagai bagian dalam aplikasi. Misalnya:
`embed:strict-mode/enabling-strict-mode.js`

Pada contoh di atas, pemeriksaan mode ketat *tidak* akan dijalankan dalam komponen `Header` dan `Footer`. Namun, `ComponentOne` dan `ComponentTwo`, beserta semua turunannya akan diperiksa.

Saat ini Mode Ketat `StrictMode` membantu dalam:
* [Identifikasi komponen yang mengandung _unsafe lifecycle_](#identifying-unsafe-lifecycles)
* [Peringatan atas penggunaan API _string ref_ _legacy_](#warning-about-legacy-string-ref-api-usage)
* [Peringatan atas penggunaan findDOMNode yang usang](#warning-about-deprecated-finddomnode-usage)
* [Pendeteksian atas efek samping yang tidak diharapkan](#detecting-unexpected-side-effects)
* [Pendeteksian API _context_ _legacy_](#detecting-legacy-context-api)

Fungsionalitas lain akan ditambahkan dalam rilis React masa mendatang.

### Identifikasi komponen yang mengandung _unsafe lifecycle_ {#identifying-unsafe-lifecycles}

Seperti yang dijelaskan dalam [postingan blog ini](/blog/2018/03/27/update-on-async-rendering.html), beberapa metode _lifecycle_ yang bersifat _legacy_ tidak aman digunakan dalam aplikasi React asinkronus. Namun, jika aplikasi Anda menggunakan _library_ pihak ketiga, sangat sulit untuk memastikan bahwa _lifecycle_ ini benar-benar tidak digunakan. Mode ketat bisa membantu Anda dalam hal ini.

Saat mode ketat diaktifkan, React mengompilasi daftar semua komponen kelas yang menggunakan _unsafe lifecycle_ dan mencatatkan pesan peringatan dengan informasi tentang komponen tersebut, misalnya:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Mengatasi masalah yang diidentifikasi oleh mode ketat _sekarang juga_ akan mempermudah Anda untuk memanfaatkan proses _render_ asinkronus dalam rilis React masa mendatang.

### Peringatan atas penggunaan API _string ref_ _legacy_ {#warning-about-legacy-string-ref-api-usage}

Sebelumnya, React menyediakan dua cara untuk mengelola _ref_: API _string ref_ _legacy_ dan API _callback_. Walau API _string ref_ lebih nyaman digunakan, API ini memiliki [beberapa kelemahan](https://github.com/facebook/react/issues/1373) sehingga rekomendasi resmi kami adalah [menggunakan bentuk _callback_](/docs/refs-and-the-dom.html#legacy-api-string-refs).

React 16.3 menambahkan opsi ketiga yang menawarkan kenyamanan _string ref_ tanpa kelemahan tersebut:
`embed:16-3-release-blog-post/create-ref-example.js`

Dengan penambahan _object ref_ sebagai pengganti untuk _string ref_, mode ketat kini memperingatkan tentang penggunaan _string ref_.

> **Catatan:**
>
> _Callback ref_ akan terus didukung selain API baru `createRef`.
>
> Anda tidak perlu mengganti _callback ref_ dalam komponen Anda. API ini sedikit lebih fleksibel, jadi API ini akan tetap menjadi fitur lanjutan.

[Pelajari lebih lanjut tentang API baru `createRef` di sini.](/docs/refs-and-the-dom.html)

### Peringatan atas penggunaan findDOMNode yang usang {#warning-about-deprecated-finddomnode-usage}

Sebelumnya React telah mendukung `findDOMNode` untuk pencarian simpul DOM dalam pohon berdasarkan _instance_ kelas. Pada umumnya hal ini tidak perlu dilakukan karena Anda bisa [menyertakan _ref_ langsung ke simpul DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` juga dapat digunakan dalam komponen kelas. Namun cara ini melanggar level abstraksi dengan mengizinkan induk untuk meminta turunan tertentu agar di-_render_. Hal ini menciptakan risiko dalam proses _refactor_, yaitu Anda tidak bisa mengubah detail implementasi sebuah komponen karena induk mungkin bisa mengubah simpul DOM-nya. `findDOMNode` hanya akan mengembalikan anak pertama. Namun dengan menggunakan _Fragment_, sebuah komponen dimungkinkan untuk me-_render_ beberapa simpul DOM sekaligus. `findDOMNode` merupakan API baca sekali saja. API ini memberikan jawaban hanya pada saat diminta. Jika komponen anak me-_render_ simpul yang berbeda, tidak ada cara untuk menangani perubahan ini. Dengan alasan ini `findDOMNode` hanya berfungsi jika komponen selalu mengembalikan sebuah simpul DOM yang tidak pernah berubah.

Anda bisa membuat hal ini menjadi eksplisit dengan meneruskan sebuah _ref_ ke komponen khusus Anda, dan meneruskannya ke DOM menggunakan [penerusan _ref_](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Anda juga bisa menambahkan simpul DOM pembungkus dalam komponen Anda dan menyertakan _ref_ langsung kepadanya.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
  }
  render() {
    return <div ref={this.wrapper}>{this.props.children}</div>;
  }
}
```

> Catatan:
>
> Dalam CSS, atribut [`display: contents`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) bisa digunakan jika Anda tidak ingin simpul menjadi bagian dari _layout_.

### Pendeteksian atas efek samping yang tidak diharapkan {#detecting-unexpected-side-effects}

Secara mendasar, React bekerja dalam dua tahap:
* Tahap **_render_** menentukan perubahan apa yang perlu terjadi, misalnya untuk DOM. Dalam tahap ini, React memanggil `render` lalu membandingkannya dengan hasil _render_ sebelumnya.
* Tahap **_commit_** yang terjadi saat React menerapkan perubahan yang ada. Pada kasus DOM, ini yang terjadi saat React menyisipkan, memperbarui, dan menghapus simpul DOM. React juga memanggil _lifecycle_ seperti `componentDidMount` dan `componentDidUpdate` dalam tahap ini.

Tahap _commit_ umumnya berlangsung sangat cepat, tetapi proses _render_ bisa sangat lambat. Dengan alasan ini, mode asinkronus mendatang (yang masih belum diaktifkan secara _default_)akan memecah proses _render_ menjadi beberapa bagian, menjeda dan melanjutkan proses untuk mencegah pemblokiran oleh browser. Ini berarti React mungkin memanggil _lifecycle_ _render_ lebih dari satu kali sebelum memanggil _commit_, atau memanggil _render_ tanpa sama sekali memanggil _commit_ (karena ada kesalahan atau adanya interupsi dari proritas yang lebih tinggi).

_Lifecyle_ tahap _render_ menyertakan metode komponen kelas berikut:
* `constructor`
* `componentWillMount` (or `UNSAFE_componentWillMount`)
* `componentWillReceiveProps` (or `UNSAFE_componentWillReceiveProps`)
* `componentWillUpdate` (or `UNSAFE_componentWillUpdate`)
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* Fungsi pembaruan `setState` (argumen pertama)

Oleh karena metode di atas mungkin dipanggil lebih dari satu kali, sangat penting bagi metode tersebut untuk tidak menimbulkan efek samping. Pengabaian atas aturan ini bisa menyebabkan berbagai macam masalah, termasuk kebocoran memori dan _state_ aplikasi yang tidak valid. Sayangnya, mungkin sangat sulit untuk mendeteksi masalah tersebut karena masalahnya mungkin bersifat [non-deterministik](https://en.wikipedia.org/wiki/Deterministic_algorithm).

<<<<<<< HEAD
Mode ketat tidak bisa mendeteksi efek samping secara otomatis, tetapi bisa membantu Anda untuk menemukannya dengan membuatnya menjadi lebih deterministik. Ini dilakukan dengan memanggil metode berikut dua kali secara sengaja:

* Metode `constructor` komponen kelas
* Metode `render`
* Fungsi pembaruan `setState` (argumen pertama)
* _Lifecycle_ statis `getDerivedStateFromProps`
=======
Strict mode can't automatically detect side effects for you, but it can help you spot them by making them a little more deterministic. This is done by intentionally double-invoking the following functions:

* Class component `constructor`, `render`, and `shouldComponentUpdate` methods
* Class component static `getDerivedStateFromProps` method
* Function component bodies
* State updater functions (the first argument to `setState`)
* Functions passed to `useState`, `useMemo`, or `useReducer`
>>>>>>> b3c7f041586b71b31f556403426fcd7cab342535

> Catatan:
>
> Ini hanya berlaku dalam mode pengembangan. _Lifecycle_ tidak akan dipanggil dua kali dalam mode produksi.

Sebagai contoh, kita gunakan kode berikut:
`embed:strict-mode/side-effects-in-constructor.js`

Sekilas, kode tersebut tampak tidak mengandung masalah. Tetapi jika `SharedApplicationState.recordEvent` tidak bersifat [_idempotent_](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), maka pembuatan _instance_ komponen ini secara berulang kali akan berujung pada _state_ aplikasi yang tidak valid. _Bug_ yang tidak kentara mungkin tidak muncul dalam pengembangan atau mungkin terjadi secara tidak konsisten, dan pada akhirnya cenderung diabaikan.

Dengan memanggil metode dua kali secara sengaja seperti konstruktor komponen, mode ketat membuat pola di atas lebih mudah ditemukan.

### Pendeteksian API _context_ _legacy_ {#detecting-legacy-context-api}

API _context_ _legacy_ sangat rentan dari kesalahan dan akan dihapus dalam versi mayor mendatang. API ini masih berfungsi dalam semua rilis 16.x tetapi akan menampilkan pesan peringatan berikut dalam mode ketat:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Baca [dokumentasi tentang API _context_ yang baru](/docs/context.html) untuk membantu proses migrasi ke versi yang baru.
