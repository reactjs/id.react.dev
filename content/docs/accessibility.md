---
id: accessibility
title: Aksesibilitas
permalink: docs/accessibility.html
---

## Mengapa aksesibilitas? {#why-accessibility}

Aksesibilitas web (juga dikenal dengan istilah [**a11y**](https://en.wiktionary.org/wiki/a11y)) adalah perancangan dan pembuatan situs web yang dapat digunakan oleh semua orang. Dukungan aksesibilitas diperlukan agar teknologi asistif—misalnya alat pembaca layar untuk pengguna tuna netra—dapat memahami dan menyampaikan isi halaman web.

React sepenuhnya mendukung pembuatan situs web yang aksesibel, pada umumnya melalui penggunaan teknik-teknik HTML standar.

## Standar dan Pedoman {#standards-and-guidelines}

### WCAG {#wcag}

[Web Content Accessibility Guidelines](https://www.w3.org/WAI/intro/wcag) (Panduan Aksesibilitas Konten Web) menyediakan panduan untuk membuat situs web yang aksesibel.

Daftar cek dari WCAG di bawah ini dapat memberikan gambaran umum:

- [Daftar cek WCAG dari Wuhcag](https://www.wuhcag.com/wcag-checklist/)
- [Daftar cek WCAG dari WebAIM](http://webaim.org/standards/wcag/checklist)
- [Daftar cek dari The A11Y Project](http://a11yproject.com/checklist.html)

### WAI-ARIA {#wai-aria}

Dokumen [Web Accessibility Initiative - Accessible Rich Internet Applications](https://www.w3.org/WAI/intro/aria) (Inisiatif Aksesibilitas Web - Aplikasi Internet Kaya yang Aksesibel) berisi teknik-teknik untuk membuat _widget_ JavaScript yang sepenuhnya aksesibel.

JSX sepenuhnya mendukung semua atribut HTML `aria-*`. Berbeda dengan sebagian besar properti DOM dan atribut lain di React yang ditulis dengan _camelCase_ (inisial kata selain kata pertama menggunakan huruf kapital), atribut `aria-*` menggunakan _hyphen-case_ (seluruh kata ditulis dengan huruf kecil dan dipisahkan tanda “-“) karena atribut-atribut tersebut ditulis dalam HTML biasa:

```javascript{3,4}
<input
  type="text"
  aria-label={labelText}
  aria-required="true"
  onChange={onchangeHandler}
  value={inputValue}
  name="name"
/>
```

## HTML Semantik {#semantic-html}

HTML yang semantik merupakan landasan aksesibilitas dalam suatu aplikasi web. Dengan menggunakan berbagai elemen HTML untuk memperkuat makna informasi di situs web kita, sering kali kita dapat memperoleh manfaat aksesibilitas secara cuma-cuma.

- [Referensi elemen HTML di MDN](https://developer.mozilla.org/id/docs/Web/HTML/Element)

Kadang kita melanggar kaidah semantik HTML dengan menambahkan elemen `<div>` ke dalam JSX agar kode React berjalan dengan baik, khususnya saat berurusan dengan elemen-elemen daftar (`<ol>`, `<ul>`, dan `<dl>`) serta `<table>` HTML. Dalam kasus demikian, alih-alih `<div>`, gunakan [_Fragment_ React](/docs/fragments.html) untuk mengelompokkan beberapa elemen.

Contohnya,

```javascript{1,5,8}
import React, { Fragment } from 'react';

function ListItem({ item }) {
  return (
    <Fragment>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </Fragment>
  );
}

function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <ListItem item={item} key={item.id} />
      ))}
    </dl>
  );
}
```

Anda juga dapat memetakan sekumpulan _item_ pada senarai (_array_) berisi fragmen, sama seperti elemen-elemen lainnya:

```javascript{6,9}
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        // Fragment juga harus memiliki prop `key` untuk memetakan koleksi
        <Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

Jika _tag_ _Fragment_ Anda tidak membutuhkan _props_ dan jika peralatan Anda mendukung, Anda dapat menggunakan [sintaks singkat](/docs/fragments.html#short-syntax):

```javascript{3,6}
function ListItem({ item }) {
  return (
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>
  );
}
```

Untuk info selengkapnya, lihat [dokumentasi _Fragment_](/docs/fragments.html).

## Formulir yang Aksesibel {#accessible-forms}

### Pelabelan {#labeling}

Setiap elemen kendali formulir HTML, seperti `<input>` dan `<textarea>`, perlu diberi label yang memenuhi prinsip aksesibilitas. Kita perlu memberi label deskriptif yang juga dapat diakses oleh aplikasi pembaca layar (_screen reader_).

Sumber-sumber di bawah ini menunjukkan caranya:

- [W3C menunjukkan cara memberi label pada elemen](https://www.w3.org/WAI/tutorials/forms/labels/)
- [WebAIM menunjukkan cara memberi label pada elemen](http://webaim.org/techniques/forms/controls)
- [Paciello Group menjelaskan tentang nama yang aksesibel](https://www.paciellogroup.com/blog/2017/04/what-is-an-accessible-name/)

Praktik-praktik standar HTML tersebut dapat langsung digunakan di React, namun harap diingat bahwa atribut `for` ditulis sebagai `htmlFor` di JSX:

```javascript{1}
<label htmlFor="namedInput">Name:</label>
<input id="namedInput" type="text" name="name"/>
```

### Menyampaikan notifikasi kesalahan ke pengguna {#notifying-the-user-of-errors}

Keadaan kesalahan (_error_) perlu dipahami semua pengguna. Tautan di bawah ini menunjukkan cara menyampaikan pesan kesalahan yang juga dapat diakses oleh pengguna aplikasi pembaca layar:

- [W3C mendemonstrasikan notifikasi untuk pengguna](https://www.w3.org/WAI/tutorials/forms/notifications/)
- [WebAIM melihat proses validasi formulir](http://webaim.org/techniques/formvalidation/)

## Kendali Fokus {#focus-control}

Pastikan aplikasi web Anda dapat dioperasikan sepenuhnya hanya dengan menggunakan _keyboard_:

- [Artikel WebAIM tentang aksesibilitas _keyboard_](http://webaim.org/techniques/keyboard/)

### Fokus _keyboard_ dan garis luar fokus {#keyboard-focus-and-focus-outline}

Fokus _keyboard_ mengacu pada elemen saat ini di DOM
yang dipilih untuk menerima masukan dari _keyboard_. Kita sering melihatnya dalam bentuk garis luar (_outline_) fokus seperti pada gambar di bawah ini:

<img src="../images/docs/keyboard-focus.png" alt="Garis luar fokus berwarna biru di sekeliling tautan yang dipilih." />

Jangan gunakan CSS untuk menghilangkan garis luar ini, misalnya dengan menggunakan `outline: 0`, kecuali Anda menggantinya dengan implementasi sejenis untuk garis luar fokus.

### Mekanisme untuk melompat ke konten yang diinginkan {#mechanisms-to-skip-to-desired-content}

Sediakan mekanisme untuk memungkinkan pengguna “melompati” bagian navigasi di aplikasi Anda, karena ini dapat memudahkan dan mempercepat navigasi menggunakan _keyboard_.

Tautan melompati navigasi (_Skiplinks_ atau _Skip Navigation Links_) adalah tautan navigasi tersembunyi yang hanya muncul di layar saat pengguna _keyboard_ berinteraksi dengan halaman tersebut. Fitur ini sangat mudah untuk diimplementasikan dengan menggunakan tautan internal halaman dan modifikasi tampilan (_styling_):

- [WebAIM - Tautan Melompati Navigasi](http://webaim.org/techniques/skipnav/)

Gunakan juga elemen dan peran _landmark_, seperti  `<main>` dan `<aside>`, untuk menandai wilayah halaman yang berguna bagi pengguna teknologi asistif untuk melakukan navigasi cepat ke bagian-bagian tersebut.

Baca selengkapnya tentang kegunaan elemen-elemen tersebut untuk meningkatkan aksesibilitas di sini:

- [_Landmark_ yang Aksesibel](http://www.scottohara.me/blog/2018/03/03/landmarks.html)

### Mengelola fokus secara programatik {#programmatically-managing-focus}

Aplikasi React kita memodifikasi DOM HTML secara terus menerus sepanjang _runtime_, yang kadang menyebabkan hilangnya fokus _keyboard_ atau berpindahnya fokus ke elemen yang tak diinginkan. Untuk mengatasi masalah ini, kita perlu mengarahkan fokus _keyboard_ secara programatik ke arah yang tepat. Misalnya, dengan mengembalikan fokus _keyboard_ ke tombol yang membuka jendela _modal_ setelah jendela _modal_ tersebut ditutup.

Dokumentasi Web MDN mengangkat topik ini dan menjelaskan cara membuat [_widget_ JavaScript yang dapat dioperasikan dengan _keyboard_](https://developer.mozilla.org/en-US/docs/Web/Accessibility/Keyboard-navigable_JavaScript_widgets).

Untuk menetapkan fokus pada React, kita dapat menggunakan [_Ref_ ke elemen DOM](/docs/refs-and-the-dom.html).

Dengan kode di bawah ini, pertama-tama kita membuat _ref_ ke elemen dalam JSX dari sebuah kelas komponen:

```javascript{4-5,8-9,13}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // Buat ref untuk menyimpan elemen DOM textInput
    this.textInput = React.createRef();
  }
  render() {
  // Gunakan callback `ref` untuk menyimpan referensi ke elemen 
  // DOM input teks dalam field instans (misalnya, this.textInput).
    return (
      <input
        type="text"
        ref={this.textInput}
      />
    );
  }
}
```

Lalu, kita dapat memfokuskan _ref_ tersebut ke posisi lain di komponen kita saat diperlukan:

 ```javascript
 focus() {
   // Fokuskan pada input teks secara eksplisit menggunakan API DOM mentah
   // Catatan: kita mengakses “current” untuk mendapatkan simpul DOM
   this.textInput.current.focus();
 }
 ```

Kadang komponen induk perlu menetapkan fokus pada sebuah elemen dalam komponen anak yang meneruskan _ref_ induknya ke simpul DOM. Kita dapat melakukannya dengan [mengekspos _ref_ DOM ke komponen induk](/docs/refs-and-the-dom.html#exposing-dom-refs-to-parent-components) melalui prop khusus pada komponen anak yang meneruskan _ref_ induk ke simpul DOM anak.

```javascript{4,12,16}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.inputElement = React.createRef();
  }
  render() {
    return (
      <CustomTextInput inputRef={this.inputElement} />
    );
  }
}

// Sekarang Anda dapat menetapkan fokus saat diperlukan.
this.inputElement.current.focus();
```

<<<<<<< HEAD
Saat menggunakan HOC (_Higher-Order Component_) untuk membuat komponen baru dari komponen yang sudah ada, disarankan untuk [melakukan _ref forwarding_](/docs/forwarding-refs.html) ke komponen yang dibungkus dengan menggunakan fungsi `forwardRef` React. Jika HOC pihak ketiga tidak mengimplementasikan _ref forwarding_, pola di atas masih dapat digunakan sebagai _fallback_.
=======
When using a [HOC](/docs/higher-order-components.html) to extend components, it is recommended to [forward the ref](/docs/forwarding-refs.html) to the wrapped component using the `forwardRef` function of React. If a third party HOC does not implement ref forwarding, the above pattern can still be used as a fallback.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

Salah satu contoh pengelolaan fokus yang baik adalah [react-aria-modal](https://github.com/davidtheclark/react-aria-modal). Ini adalah contoh yang relatif langka dari jendela _modal_ yang sepenuhnya aksesibel. Selain menetapkan fokus awal pada tombol “batal” (mencegah pengguna keyboard tidak sengaja mengaktifkan opsi “sukses”) dan mengurung fokus _keyboard_ di dalam modal, react-aria-modal juga mengembalikan fokus ke elemen awal yang memicu _modal_ tersebut.

>Catatan:
>
>Ini adalah fitur aksesibilitas yang sangat penting, namun pertimbangkan matang-matang sebelum menggunakan teknik ini. Gunakanlah teknik ini untuk memperbaiki alur fokus keyboard yang mengalami gangguan, bukan untuk mencoba mengantisipasi cara pengguna memakai aplikasi.

## _Event mouse_ dan penunjuk {#mouse-and-pointer-events}

Pastikan bahwa semua fungsionalitas yang terekspos melalui _event mouse_ atau penunjuk (_pointer_) juga dapat diakses hanya dengan menggunakan _keyboard_. Bergantung pada peranti penunjuk akan mengakibatkan kasus di mana pengguna _keyboard_ tidak dapat menggunakan aplikasi Anda.

Sebagai gambaran, mari kita lihat contoh umum rusaknya aksesibilitas akibat _event_ klik. Ini adalah pola “klik di luar”, di mana pengguna bisa menonaktifkan kotak _popover_ yang terbuka dengan cara mengklik di luar elemen tersebut.

<img src="../images/docs/outerclick-with-mouse.gif" alt="Tombol buka-tutup yang membuka kotak daftar popover yang diimplementasikan dengan pola klik di luar popover dan dioperasikan dengan mouse. Kotak popover berhasil ditutup." />

Pola ini umumnya diimplementasikan dengan menempelkan _event_ `click` pada obyek `window` yang menutup _popover_:

```javascript{12-14,26-30}
class OuterClickExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.toggleContainer = React.createRef();

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onClickOutsideHandler = this.onClickOutsideHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutsideHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutsideHandler);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  onClickOutsideHandler(event) {
    if (this.state.isOpen && !this.toggleContainer.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  }

  render() {
    return (
      <div ref={this.toggleContainer}>
        <button onClick={this.onClickHandler}>Pilih salah satu opsi</button>
        {this.state.isOpen ? (
          <ul>
            <li>Opsi 1</li>
            <li>Opsi 2</li>
            <li>Opsi 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Kode ini mungkin berfungsi dengan baik untuk pengguna yang memakai peranti penunjuk, misalnya _mouse_. Tapi jika dioperasikan hanya dengan _keyboard_, fungsionalitasnya akan rusak saat pengguna menekan tombol _tab_ ke elemen selanjutnya, karena objek `window` tidak pernah menerima _event_ `click`. Hal ini dapat mengakibatkan fungsionalitas yang terhalang, yang menghambat pengguna untuk menggunakan aplikasi Anda.

<img src="../images/docs/outerclick-with-keyboard.gif" alt="Tombol buka-tutup yang membuka kotak daftar popover yang diimplementasikan dengan pola klik di luar popover dan dioperasikan dengan keyboard. Kotak popover tidak tertutup saat fokus berpindah (blur) dan menghalangi elemen lainnya di layar." />

Fungsionalitas yang sama dapat dicapai dengan menggunakan _event handler_ yang sesuai, misalnya `onBlur` dan `onFocus`:

```javascript{19-29,31-34,37-38,40-41}
class BlurExample extends React.Component {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.timeOutId = null;

    this.onClickHandler = this.onClickHandler.bind(this);
    this.onBlurHandler = this.onBlurHandler.bind(this);
    this.onFocusHandler = this.onFocusHandler.bind(this);
  }

  onClickHandler() {
    this.setState(currentState => ({
      isOpen: !currentState.isOpen
    }));
  }

  // Kita menutup popover pada detik selanjutnya menggunakan setTimeout.
  // Ini perlu, karena kita harus memeriksa terlebih dahulu 
  // apakah ada anak lain dari elemen ini yang telah menerima 
  // fokus saat event blur diluncurkan sebelum event fokus yang baru.
  onBlurHandler() {
    this.timeOutId = setTimeout(() => {
      this.setState({
        isOpen: false
      });
    });
  }

  // Jika ada anak yang menerima fokus, jangan tutup popover.
  onFocusHandler() {
    clearTimeout(this.timeOutId);
  }

  render() {
    // React membantu kita dengan melakukan bubbling 
    // pada event blur dan fokus ke elemen induk.
    return (
      <div onBlur={this.onBlurHandler}
           onFocus={this.onFocusHandler}>
        <button onClick={this.onClickHandler}
                aria-haspopup="true"
                aria-expanded={this.state.isOpen}>
          Pilih salah satu opsi
        </button>
        {this.state.isOpen && (
          <ul>
            <li>Opsi 1</li>
            <li>Opsi 2</li>
            <li>Opsi 3</li>
          </ul>
        )}
      </div>
    );
  }
}
```

Kode ini mengekspos fungsionalitas pada peranti penunjuk maupun pengguna _keyboard_. Perhatikan adanya tambahan _props_ `aria-*` untuk mendukung pengguna pembaca layar. Agar contoh ini ringkas, _event keyboard_ untuk mengaktifkan interaksi `arrow key` pada opsi-opsi _popover_ belum diimplementasikan.

<img src="../images/docs/blur-popover-close.gif" alt="Kotak daftar 'popover' yang menutup dengan benar baik untuk pengguna mouse maupun keyboard." />

Ini salah satu contoh dari banyak kasus di mana bergantung hanya pada _event mouse_ dan penunjuk akan merusak fungsionalitas untuk pengguna _keyboard_. Selalu lakukan pengujian dengan _keyboard_ agar dapat segera melihat area bermasalah, yang kemudian dapat diperbaiki dengan menggunakan _event handler_ yang sadar akan _keyboard_.

## _Widget_ yang Lebih Kompleks {#more-complex-widgets}

Pengalaman pengguna (_user experience_) yang lebih kompleks tidak semestinya mengurangi aksesibilitas. Meskipun aksesibilitas paling mudah dicapai dengan menulis kode yang sedekat mungkin dengan HTML, bahkan _widget_ paling rumit sekalipun dapat dibuat dengan aksesibel.

Di sini kita membutuhkan pengetahuan tentang [Peran (_Role_) ARIA](https://www.w3.org/TR/wai-aria/#roles), juga [_State_ dan Properti ARIA](https://www.w3.org/TR/wai-aria/#states_and_properties), yang merupakan “kotak peralatan” berisi atribut-atribut HTML yang sepenuhnya didukung di JSX dan memungkinkan kita untuk menyusun komponen-komponen React yang sepenuhnya aksesibel dan sangat fungsional.

Masing-masing jenis _widget_ memiliki pola desain yang spesifik; dan baik pengguna maupun perangkat (_agent_) sudah memiliki ekspekstasi tentang fungsi _widget_ tersebut:

- [Praktik-praktik Menulis WAI-ARIA - Pola Desain dan _Widget_](https://www.w3.org/TR/wai-aria-practices/#aria_ex)
- [Heydon Pickering - Contoh-contoh ARIA](http://heydonworks.com/practical_aria_examples/)
- [Komponen-komponen Inklusif](https://inclusive-components.design/)

## Hal-hal Lain untuk Dipertimbangkan {#other-points-for-consideration}

### Mengatur bahasa {#setting-the-language}

Beri keterangan bahasa manusia yang digunakan pada isi teks di halaman, karena perangkat lunak pembaca layar menggunakannya untuk memilih pengaturan suara yang tepat:

- [WebAIM - Bahasa Dokumen](http://webaim.org/techniques/screenreader/#language)

### Mengatur judul dokumen {#setting-the-document-title}

Atur `<title>` dokumen agar menggambarkan dengan tepat isi halaman yang sedang dibuka, untuk menmastikan pengguna tetap sadar tentang konteks halaman saat ini:

- [WCAG - Memahami Syarat Judul Dokumen](https://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-title.html)

Kita dapat mengaturnya di React menggunakan [komponen _React Document Title_](https://github.com/gaearon/react-document-title).

### Kontras warna {#color-contrast}

Pastikan seluruh teks yang dapat dibaca di situs web Anda  memiliki kontras warna yang cukup, agar semudah mungkin untuk dibaca oleh pengguna dengan kemampuan penglihatan lemah (_low vision_):

- [WCAG - Memahami Syarat Kontras Warna](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
- [Semua Tentang Kontras Warna dan Mengapa Anda Perlu Berpikir Ulang Tentangnya](https://www.smashingmagazine.com/2014/10/color-contrast-tips-and-tools-for-accessibility/)
- [A11yProject - Apa Itu Kontras Warna](http://a11yproject.com/posts/what-is-color-contrast/)

Akan membosankan jika harus menghitung kombinasi warna secara manual untuk setiap kasus penggunaan di halaman website Anda, maka Anda dapat [membuat perhitungan seluruh palet warna yang aksesibel dengan Colorable](http://jxnblk.com/colorable/).

Uji kontras warna juga termasuk dalam alat aXe maupun WAVE yang disebut di bawah ini. Alat-alat tersebut akan melaporkan jika ada kesalahan kontras.

Jika Anda ingin mengembangkan kemampuan uji kontras, Anda dapat menggunakan alat-alat ini:

- [WebAIM - Pemeriksa Kontras Warna](http://webaim.org/resources/contrastchecker/)
- [The Paciello Group - Penganalisa Kontras Warna](https://www.paciellogroup.com/resources/contrastanalyser/)

## Alat-alat Pengembangan dan Pengujian {#development-and-testing-tools}

Ada sejumlah alat yang dapat kita gunakan untuk membantu pembuatan aplikasi web yang aksesibel.

### _Keyboard_ {#the-keyboard}

Bentuk uji coba yang paling mudah sekaligus salah satu yang terpenting sejauh ini ialah menguji apakah seluruh situs web Anda dapat dijangkau dan digunakan hanya dengan menggunakan _keyboard_. Caranya adalah:

1. Cabut _mouse_ Anda.
1. Gunakan tombol `Tab` dan `Shift+Tab` untuk menjelajah.
1. Gunakan tombol `Enter` untuk mengaktifkan elemen.
1. Bila dibutuhkan, gunakan tombol panah pada _keyboard_ untuk berinteraksi dengan beberapa elemen, misalnya menu dan _dropdown_.

### Bantuan pengembangan {#development-assistance}

Kita dapat memeriksa beberapa fitur aksesibilitas secara langsung dalam kode JSX kita. Sering kali, pemeriksaan _intellisense_ untuk peran, _state_, dan properti ARIA sudah tersedia di IDE yang sadar akan JSX. Kita juga dapat mengakses peralatan berikut ini:

#### eslint-plugin-jsx-a11y {#eslint-plugin-jsx-a11y}

_Plugin_ [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) untuk ESLint menyediakan umpan balik _linting_ _Abstract Syntax Tree_ (AST) tentang masalah-masalah aksesibilitas di JSX Anda. Banyak IDE memungkinkan Anda untuk mengintegrasikan hasil penemuan tersebut langsung ke jendela analisa kode dan kode sumber.

[Create React App](https://github.com/facebookincubator/create-react-app) memiliki _plugin_ ini dengan sebagian aturan aksesibilitas yang sudah aktif. Jika Anda ingin mengaktifkan lebih banyak lagi aturan aksesibiltas, Anda dapat membuat file `.eslintrc` di _root_ projek Anda dengan isi seperti ini:

  ```json
  {
    "extends": ["react-app", "plugin:jsx-a11y/recommended"],
    "plugins": ["jsx-a11y"]
  }
  ```

### Menguji aksesibilitas di _browser_ {#testing-accessibility-in-the-browser}

Ada sejumlah alat yang dapat menjalankan audit aksesibilitas pada halaman-halaman web dari _browser_ Anda. Gunakanlah bersama metode pemeriksaan aksesibilitas lainnya yang disebutkan di sini, karena alat-alat ini hanya menguji aksesibilitas teknis kode HTML Anda.

#### aXe, aXe-core and react-axe {#axe-axe-core-and-react-axe}

Deque Systems menawarkan [aXe-core](https://github.com/dequelabs/axe-core) untuk menguji aksesibilitas aplikasi Anda secara otomatis dari awal hingga akhir. Modul ini mencakup integrasi Selenium.

[The Accessibility Engine](https://www.deque.com/products/axe/) atau aXe adalah ekstensi _browser_ pemeriksa aksesibilitas yang dibuat berdasarkan `aXe-core`.

<<<<<<< HEAD
Anda juga dapat menggunakan modul [react-axe](https://github.com/dylanb/react-axe) untuk melaporkan temuan-temuan aksesibilitas ini secara langsung ke _console_ saat melakukan pengembangan dan menelusuri kesalahan.
=======
You can also use the [@axe-core/react](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/react) module to report these accessibility findings directly to the console while developing and debugging.
>>>>>>> 07dbd86ca421c262157af673a2584a40fd3b2450

#### WebAIM WAVE {#webaim-wave}

[Web Accessibility Evaluation Tool](http://wave.webaim.org/extension/) adalah ekstensi _browser_ lainnya untuk memeriksa aksesibilitas.

#### Pemeriksa aksesibilitas dan Pohon Aksesibilitas {#accessibility-inspectors-and-the-accessibility-tree}

[Pohon Aksesibilitas (_Accessibility Tree_)](https://www.paciellogroup.com/blog/2015/01/the-browser-accessibility-tree/) adalah bagian dari pohon DOM yang berisi objek-objek aksesibel untuk setiap elemen DOM yang seharusnya terekspos ke teknologi asistif, misalnya pembaca layar.

Di beberapa _browser_, kita dapat dengan mudah melihat informasi aksesibilitas untuk masing-masing elemen di pohon aksesibilitas:

- [Menggunakan Pemeriksa Aksesibilitas di Firefox](https://developer.mozilla.org/en-US/docs/Tools/Accessibility_inspector)
- [Menggunakan Pemeriksa Aksesibilitas di Chrome](https://developers.google.com/web/tools/chrome-devtools/accessibility/reference#pane)
- [Menggunakan Pemeriksa Aksesibilitas di Safari OS X](https://developer.apple.com/library/content/documentation/Accessibility/Conceptual/AccessibilityMacOSX/OSXAXTestingApps.html)

### Pembaca layar {#screen-readers}

Menguji dengan pembaca layar harus menjadi bagian uji aksesibilitas Anda.

Harap perhatikan bahwa kombinasi _browser_ / pembaca layar berpengaruh. Anda disarankan menguji aplikasi Anda pada _browser_ yang paling sesuai dengan pembaca layar pilihan Anda.

### Pembaca Layar yang Umum Digunakan {#commonly-used-screen-readers}

#### NVDA di Firefox {#nvda-in-firefox}

[NonVisual Desktop Access](https://www.nvaccess.org/) atau NVDA adalah pembaca layar bersumber terbuka (_open source_) untuk Windows yang banyak digunakan.

Berikut ini panduan untuk menggunakan NVDA dengan baik:

- [WebAIM - Menggunakan NVDA untuk Evaluasi Aksesibilitas Web](http://webaim.org/articles/nvda/)
- [Deque - Pintasan _Keyboard_ NVDA](https://dequeuniversity.com/screenreaders/nvda-keyboard-shortcuts)

#### VoiceOver di Safari {#voiceover-in-safari}

VoiceOver adalah pembaca layar yang terintegrasi dengan peranti Apple.

Berikut ini panduan cara mengaktifkan dan menggunakan VoiceOver:

- [WebAIM - Menggunakan VoiceOver untuk Evaluasi Aksesibilitas Web](http://webaim.org/articles/voiceover/)
- [Deque - Pintasan _Keyboard_ VoiceOver untuk OS X](https://dequeuniversity.com/screenreaders/voiceover-keyboard-shortcuts)
- [Deque - Pintasan VoiceOver untuk iOS](https://dequeuniversity.com/screenreaders/voiceover-ios-shortcuts)

#### JAWS di Internet Explorer {#jaws-in-internet-explorer}

[Job Access With Speech](http://www.freedomscientific.com/Products/Blindness/JAWS) atau JAWS adalah pembaca layar untuk Windows yang banyak digunakan.

Berikut ini panduan untuk menggunakan JAWS dengan baik:

- [WebAIM - Menggunakan JAWS untuk Evaluasi Aksesibilitas Web](http://webaim.org/articles/jaws/)
- [Deque - Pintasan _Keyboard_ JAWS](https://dequeuniversity.com/screenreaders/jaws-keyboard-shortcuts)

### Pembaca Layar Lain {#other-screen-readers}

#### ChromeVox di Google Chrome {#chromevox-in-google-chrome}

[ChromeVox](http://www.chromevox.com/) adalah pembaca layar yang terintegrasi dengan Chromebook, dan tersedia [sebagai ekstensi _browser_](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn?hl=id) Google Chrome.

Berikut ini panduan untuk menggunakan ChromeVox dengan baik:

- [Bantuan Google Chromebook - Gunakan Pembaca Layar Bawaan](https://support.google.com/chromebook/answer/7031755?hl=id)
- [Referesi Pintasan _Keyboard_ ChromeVox Classic](http://www.chromevox.com/keyboard_shortcuts.html)
