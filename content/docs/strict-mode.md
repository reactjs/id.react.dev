---
id: strict-mode
title: Strict Mode
permalink: docs/strict-mode.html
---

`StrictMode` adalah alat untuk menyoroti potensi masalah dalam suatu aplikasi. Seperti `Fragment`, `StrictMode` tidak merender UI apa pun yang terlihat. Ini mengaktifkan pemeriksaan dan peringatan tambahan untuk turunannya.

> Catatan:
>
> Pemeriksaan Strict mode hanya dijalankan dalam mode pengembangan; _mereka tidak memengaruhi produksi_.

Anda dapat mengaktifkan strict mode untuk bagian mana pun dari aplikasi Anda. Sebagai contoh:
`embed:strict-mode/enabling-strict-mode.js`

Dalam contoh di atas, pemeriksaan strict mode *tidak* akan dijalankan terhadap komponen `Header` dan `Footer`. Namun, `ComponentOne` dan `ComponentTwo`, serta semua turunannya, akan diperiksa.

`StrictMode` saat ini membantu dengan:
* [Mengidentifikasi komponen dengan siklus hidup yang tidak aman](#identifying-unsafe-lifecycles)
* [Peringatan tentang penggunaan API ref string lama](#warning-about-legacy-string-ref-api-usage)
* [Peringatan tentang penggunaan findDOMNode yang tidak berlaku lagi](#warning-about-deprecated-finddomnode-usage)
* [Mendeteksi efek samping yang tidak terduga](#detecting-unexpected-side-effects)
* [Mendeteksi API konteks lama](#detecting-legacy-context-api)

Fungsionalitas tambahan akan ditambahkan dengan rilis React di masa mendatang.

### Mengidentifikasi siklus hidup yang tidak aman {#identifying-unsafe-lifecycles}

Seperti yang dijelaskan [dalam posting blog ini](/blog/2018/03/27/update-on-async-rendering.html), metode siklus hidup lama tertentu tidak aman untuk digunakan dalam aplikasi React async. Namun, jika aplikasi Anda menggunakan pustaka pihak ketiga, mungkin sulit untuk memastikan bahwa siklus proses ini tidak digunakan. Untungnya, strict mode dapat membantu dalam hal ini!

Ketika strict mode diaktifkan, React mengompilasi daftar semua komponen kelas menggunakan siklus hidup yang tidak aman, dan mencatat pesan peringatan dengan informasi tentang komponen ini, seperti:

![](../images/blog/strict-mode-unsafe-lifecycles-warning.png)

Mengatasi masalah yang diidentifikasi oleh strict mode _sekarang_ akan memudahkan Anda untuk memanfaatkan rendering bersamaan di rilis React mendatang.

### Peringatan tentang penggunaan API ref string lama {#warning-about-legacy-string-ref-api-usage}

Sebelumnya, React menyediakan dua cara untuk mengelola ref: API ref string lama dan API panggilan balik. Meskipun string ref API lebih nyaman dari keduanya, ia memiliki [beberapa kelemahan](https://github.com/facebook/react/issues/1373) dan rekomendasi resmi kami adalah [menggunakan formulir panggilan balik sebagai gantinya](/docs/refs-and-the-dom.html#legacy-api-string-refs). .

React 16.3 menambahkan opsi ketiga yang menawarkan kenyamanan ref string tanpa ada kelemahan:
`embed:16-3-release-blog-post/create-ref-example.js`

Karena referensi objek sebagian besar ditambahkan sebagai pengganti referensi string, strict mode sekarang memperingatkan tentang penggunaan referensi string.

> **Catatan:**
>
> Referensi panggilan balik akan terus didukung selain API `createRef` baru.
>
> Anda tidak perlu mengganti referensi panggilan balik di komponen Anda. Mereka sedikit lebih fleksibel, jadi mereka akan tetap sebagai fitur lanjutan.

[Pelajari lebih lanjut tentang API `createRef` baru di sini.](/docs/refs-and-the-dom.html)

### Peringatan tentang penggunaan findDOMNode yang tidak berlaku lagi {#warning-about-deprecated-finddomnode-usage}

React digunakan untuk mendukung `findDOMNode` untuk mencari pohon untuk simpul DOM yang diberikan sebuah instance kelas. Biasanya Anda tidak memerlukan ini karena Anda dapat [melampirkan ref langsung ke simpul DOM](/docs/refs-and-the-dom.html#creating-refs).

`findDOMNode` juga dapat digunakan pada komponen kelas tetapi ini melanggar level abstraksi dengan mengizinkan induk untuk meminta turunan tertentu dirender. Ini menciptakan bahaya pemfaktoran ulang di mana Anda tidak dapat mengubah detail implementasi sebuah komponen karena induk mungkin menjangkau ke simpul DOM-nya. `findDOMNode` hanya mengembalikan anak pertama, tetapi dengan penggunaan Fragmen, mungkin saja komponen merender beberapa node DOM. `findDOMNode` adalah API baca satu kali. Itu hanya memberi Anda jawaban ketika Anda memintanya. Jika komponen turunan merender node yang berbeda, tidak ada cara untuk menangani perubahan ini. Oleh karena itu, `findDOMNode` hanya berfungsi jika komponen selalu mengembalikan satu node DOM yang tidak pernah berubah.

Sebagai gantinya Anda dapat membuat ini eksplisit dengan meneruskan ref ke komponen khusus Anda dan meneruskannya ke DOM menggunakan [penerusan referensi](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Anda juga dapat menambahkan simpul DOM pembungkus di komponen Anda dan melampirkan ref langsung padanya.

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
> Di CSS, [`display: content`](https://developer.mozilla.org/en-US/docs/Web/CSS/display#display_contents) atribut dapat digunakan jika Anda tidak ingin node menjadi bagian dari tata letak.

### Mendeteksi efek samping yang tidak terduga {#detecting-unexpected-side-effects}

Secara konseptual, React bekerja dalam dua fase:
* Fase **render** menentukan perubahan apa yang perlu dilakukan, misalnya. DOM. Selama fase ini, React memanggil `render` dan kemudian membandingkan hasilnya dengan render sebelumnya.
* Fase **commit** adalah saat React menerapkan perubahan apa pun. (Dalam kasus React DOM, ini adalah saat React menyisipkan, memperbarui, dan menghapus node DOM.) React juga memanggil siklus hidup seperti `componentDidMount` dan` componentDidUpdate` selama fase ini.

Fase komit biasanya sangat cepat, tetapi rendering bisa lambat. Karena alasan ini, mode async yang akan datang (yang belum diaktifkan secara default) memecah pekerjaan rendering menjadi beberapa bagian, menjeda dan melanjutkan pekerjaan untuk menghindari pemblokiran browser. Ini berarti bahwa React dapat memanggil siklus hidup fase render lebih dari sekali sebelum melakukan, atau mungkin memanggilnya tanpa melakukan sama sekali (karena kesalahan atau gangguan prioritas yang lebih tinggi).

Siklus fase render mencakup metode komponen kelas berikut:
* `constructor`
* `componentWillMount`
* `componentWillReceiveProps`
* `componentWillUpdate`
* `getDerivedStateFromProps`
* `shouldComponentUpdate`
* `render`
* `setState` fungsi pembaru (argumen pertama)

Karena metode di atas mungkin dipanggil lebih dari sekali, penting agar metode tersebut tidak mengandung efek samping. Mengabaikan aturan ini dapat menyebabkan berbagai masalah, termasuk kebocoran memori dan status aplikasi yang tidak valid. Sayangnya, sulit untuk mendeteksi masalah ini karena seringkali dapat menjadi [non-deterministik](https://en.wikipedia.org/wiki/Deterministic_algorithm).

Strict mode tidak dapat secara otomatis mendeteksi efek samping untuk Anda, tetapi dapat membantu Anda menemukannya dengan membuatnya sedikit lebih deterministik. Ini dilakukan dengan sengaja memanggil ulang metode berikut:

* Metode `constructor` komponen kelas
* Metode `render`
* Fungsi pembaru`setState` (argumen pertama)
* Siklus hidup `getDerivedStateFromProps` statis

> Catatan:
>
> Ini hanya berlaku untuk mode pengembangan. _Lifecycles tidak akan dipanggil ganda dalam mode produksi._

Sebagai contoh, perhatikan kode berikut:
`embed:strict-mode/side-effects-in-constructor.js`

Sekilas, kode ini mungkin tidak tampak bermasalah. Tetapi jika `SharedApplicationState.recordEvent` bukan [idempoten](https://en.wikipedia.org/wiki/Idempotence#Computer_science_meaning), lalu membuat instance komponen ini beberapa kali dapat menyebabkan status aplikasi tidak valid. Bug halus semacam ini mungkin tidak terwujud selama pengembangan, atau mungkin terjadi secara tidak konsisten sehingga terabaikan.

Dengan metode pemanggilan ganda secara sengaja seperti konstruktor komponen, strict mode membuat pola seperti ini lebih mudah dikenali.

### Detecting legacy context API {#detecting-legacy-context-api}

API konteks lama rawan kesalahan, dan akan dihapus dalam versi utama mendatang. Ini masih berfungsi untuk semua rilis 16.x tetapi akan menampilkan pesan peringatan ini dalam strict mode:

![](../images/blog/warn-legacy-context-in-strict-mode.png)

Baca [dokumentasi API konteks baru](/docs/context.html) untuk membantu bermigrasi ke versi baru.
