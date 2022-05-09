---
id: refs-and-the-dom
<<<<<<< HEAD
title: Ref dan DOM
prev: static-type-checking.html
next: uncontrolled-components.html
=======
title: Refs and the DOM
permalink: docs/refs-and-the-dom.html
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985
redirect_from:
  - "docs/working-with-the-browser.html"
  - "docs/more-about-refs.html"
  - "docs/more-about-refs-ko-KR.html"
  - "docs/more-about-refs-zh-CN.html"
  - "tips/expose-component-functions.html"
  - "tips/children-undefined.html"
---

*Ref* menyediakan cara untuk mengakses simpul DOM atau elemen React yang dibuat dalam *render method*.

Dalam aliran data React yang umum, [*props*](/docs/components-and-props.html) adalah satu-satunya cara bagi komponen induk untuk berinteraksi dengan anaknya. Untuk memodifikasi anak, Anda me-*render* ulang dengan *props* yang baru. Tetapi ada beberapa kasus ketika Anda harus memodifikasi anak secara imperatif di luar aliran data yang umum. Anak yang akan dimodifikasi bisa berupa komponen React atau elemen DOM. Pada kedua kasus ini, React menyediakan jalan keluar.

### Kapan Harus Menggunakan *Ref* {#when-to-use-refs}

Ada beberapa kasus yang cocok untuk *ref*:

* Mengelola fokus, pemilihan teks, atau pemutaran media.
* Memicu animasi secara imperatif.
* Mengintegrasikan dengan *library* DOM pihak ketiga.

Hindari penggunaan *ref* untuk semua yang bisa dilakukan secara deklaratif.

Misalnya, alih-alih mengekspos *method* `open()` dan `close()` pada komponen `Dialog`, kirimkan *props* `isOpen` kepadanya.

### Jangan Berlebihan Menggunakan *Ref* {#dont-overuse-refs}

Godaan pertama mungkin adalah menggunakan *ref* agar aplikasi "bisa berfungsi". Jika benar demikian, hentikan sejenak dan pikirkan secara kritis, tempat *state* harus berada dalam hierarki komponen. Sering kali nantinya ditemukan bahwa tempat yang lebih baik untuk "memiliki" *state* tersebut adalah di tingkat yang lebih tinggi dalam hierarki. Lihat panduan [Memindahkan *State* ke Atas](/docs/lifting-state-up.html) untuk contohnya.

> Catatan
>
> Contoh berikut telah diperbarui untuk menggunakan API `React.createRef()` yang diperkenalkan dalam React 16.3. Jika Anda menggunakan versi React sebelumnya, kami sarankan untuk menggunakan [*callback ref*](#callback-refs).

### Membuat *Ref* {#creating-refs}

*Ref* dibuat menggunakan `React.createRef()` dan disematkan ke elemen React lewat atribut `ref`. *Ref* umumnya ditetapkan ke properti *instance* saat komponen dibuat agar mereka bisa dirujuk dalam komponen.

```javascript{4,7}
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

### Mengakses *Ref* {#accessing-refs}

Ketika *ref* dioper ke elemen dalam `render`, sebuah referensi ke simpul akan tersedia untuk diakses pada atribut `current` milik *ref*.

```javascript
const node = this.myRef.current;
```

Nilai *ref* berbeda-beda tergantung jenis simpulnya:

- Ketika atribut `ref` digunakan pada elemen HTML, `ref` yang dibuat dalam konstruktor dengan `React.createRef()` menerima elemen DOM yang mendasari sebagai properti `current` miliknya.
- Saat atribut `ref` digunakan pada *class component* khusus, objek `ref` menerima instans yang dipasang milik komponen sebagai `current`-nya.
- **Anda tidak diizinkan untuk menggunakan atribut `ref` pada *function component*** karena komponen tersebut tidak memiliki instans.

Contoh berikut menunjukkan perbedaannya.

#### Menambahkan *Ref* pada elemen DOM {#adding-a-ref-to-a-dom-element}

Kode berikut menggunakan `ref` untuk menyimpan referensi ke simpul DOM:

```javascript{5,12,22}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    // buat ref untuk menyimpan elemen DOM textInput
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }

  focusTextInput() {
    // Fokuskan secara eksplisit pada input teks menggunakan API DOM dasar
    // Catatan: kita sedang mengakses "current" untuk mendapatkan simpul DOM
    this.textInput.current.focus();
  }

  render() {
    // beri tahu React bahwa kita ingin mengasosiasikan *ref* <input>
    // dengan `textInput` yang kita buat dalam konstruktor
    return (
      <div>
        <input
          type="text"
          ref={this.textInput} />
        <input
          type="button"
          value="Fokus pada masukan teks"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React akan menetapkan properti `current` menjadi elemen DOM saat komponen dipasang dan menetapkannya kembali menjadi `null` saat dilepas. Pembaruan `ref` terjadi sebelum *lifecycle method* `componentDidMount` atau `componentDidUpdate`.

#### Menambahkan *Ref* ke *Class Component* {#adding-a-ref-to-a-class-component}

Jika kita ingin membungkus `CustomTextInput` di atas untuk mensimulasikan peristiwa klik pada masukan teks segera setelah dipasang, kita bisa menggunakan *ref* untuk mendapatkan akses ke input khususnya dan memanggil *method* `focusTextInput` secara manual:

```javascript{4,8,13}
class AutoFocusTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    this.textInput.current.focusTextInput();
  }

  render() {
    return (
      <CustomTextInput ref={this.textInput} />
    );
  }
}
```

Perhatikan bahwa ini hanya akan berfungsi jika `CustomTextInput` dideklarasikan sebagai kelas:

```js{1}
class CustomTextInput extends React.Component {
  // ...
}
```

#### *Ref* dan *Function Component* {#refs-and-function-components}

Pada dasarnya, **Anda tidak diizinkan untuk menggunakan atribut `ref` dalam *function component*** karena komponen tersebut tidak memiliki instans:

```javascript{1,8,13}
function MyFunctionComponent() {
  return <input />;
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }
  render() {
    // Ini *tidak akan* berfungsi!
    return (
      <MyFunctionComponent ref={this.textInput} />
    );
  }
}
```

Jika Anda ingin mengizinkan seseorang membawa `ref` ke komponen fungsi Anda, Anda dapat menggunakan [`forwardRef`](/docs/forwarding-refs.html) (kemungkinan bersamaan dengan [`useImperativeHandle`](/docs/hooks-reference.html#useimperativehandle)), atau Anda dapat mengubah komponen tersebut menjadi komponen kelas.

Tetapi Anda bisa **menggunakan atribut `ref` di dalam *function component*** selama Anda merujuk ke elemen DOM atau *class component*:

```javascript{2,3,6,13}
function CustomTextInput(props) {
  // textInput harus dideklarasikan di sini agar ref bisa merujuknya
  const textInput = useRef(null);
  
  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Fokus pada masukan teks"
        onClick={handleClick}
      />
    </div>
  );
}
```

### Mengekspos *Ref* DOM ke Komponen Induk {#exposing-dom-refs-to-parent-components}

Pada sebagian kecil kasus, Anda mungkin ingin mendapatkan akses ke simpul DOM anak dari komponen induk. Hal ini tidak disarankan karena akan merusak enkapsulasi komponen, tetapi terkadang berguna untuk memicu fokus atau mengukur ukuran atau posisi simpul DOM anak.

Walau Anda bisa [menambahkan *ref* ke *child component*](#adding-a-ref-to-a-class-component), ini bukan solusi yang ideal, karena Anda hanya akan mendapatkan instans komponen, bukan simpul DOM. Selain itu, hal ini tidak akan berfungsi dengan *function component*.

Jika Anda menggunakan React 16.3 atau yang lebih baru, kami sarankan untuk menggunakan [*ref forwarding*](/docs/forwarding-refs.html) untuk kasus semacam ini. ***Ref forwarding* memungkinkan komponen untuk memilih untuk mengekspos semua *ref* komponen anak sebagai miliknya sendiri**. Anda bisa menemukan contoh mendetail tentang cara mengekspos simpul DOM anak ke komponen induk [dalam dokumentasi *ref forwarding*](/docs/forwarding-refs.html#forwarding-refs-to-dom-components).

Jika Anda menggunakan React 16.2 atau yang lebih lawas, atau jika Anda membutuhkan lebih banyak fleksibilitas dibandingkan dengan yang disediakan oleh *ref forwarding*, Anda bisa menggunakan [pendekatan alternatif ini](https://gist.github.com/gaearon/1a018a023347fe1c2476073330cc5509) dan secara eksplisit mengoper sebuah *ref* sebagai *props* dengan nama yang berbeda.

Jika dimungkinkan, kami sarankan untuk tidak mengekspos simpul DOM, walau bisa berguna sebagai jalan keluar. Perhatikan bahwa pendekatan ini membutuhkan tambahan kode pada komponen anak Jika Anda sama sekali tidak memiliki kontrol pada implementasi komponen anak, opsi terakhir Anda adalah menggunakan [`findDOMNode()`](/docs/react-dom.html#finddomnode). Tetapi hal ini tidak disarankan dan akan menjadi *deprecated* dalam [`StrictMode`](/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage).

### *Callback Ref* {#callback-refs}

React juga mendukung cara lain untuk menetapkan *ref* yang disebut sebagai *"callback ref"*, yang memberikan kontrol lebih mendetail kapan *ref* akan di-*set* dan di-*unset*.

Alih-alih mengoper atribut `ref` yang dibuat oleh `createRef()`, Anda mengoper sebuah fungsi. Fungsi tersebut menerima instans komponen React atau elemen DOM HTML sebagai argumennya, yang bisa disimpan dan diakses di tempat lain. 

Contoh berikut mengimplementasikan sebuah pola umum: menggunakan *callback* `ref` untuk menyimpan rujukan ke simpul DOM dalam properti instans.

```javascript{5,7-9,11-14,19,29,34}
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = null;

    this.setTextInputRef = element => {
      this.textInput = element;
    };

    this.focusTextInput = () => {
      // Fokus pada input teks menggunakan API DOM dasar
      if (this.textInput) this.textInput.focus();
    };
  }

  componentDidMount() {
    // autofocus pada input saat mount
    this.focusTextInput();
  }

  render() {
    // Gunakan callback `ref` untuk menyimpan rujukan ke elemen DOM
    // input teks dalam field instans (misalnya, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={this.setTextInputRef}
        />
        <input
          type="button"
          value="Fokus pada masukan teks"
          onClick={this.focusTextInput}
        />
      </div>
    );
  }
}
```

React akan memanggil *callback* `ref` dengan elemen DOM saat komponen dipasang dan memanggilnya dengan `null` saat dilepas. *Ref* dijamin untuk selalu diperbarui sebelum `componentDidMount` atau `componentDidUpdate` dijalankan.

Anda bisa mengoper *callback ref* antarkomponen seperti halnya yang bisa Anda lakukan dengan *object ref* yang dibuat dengan `React.createRef()`.

```javascript{4,13}
function CustomTextInput(props) {
  return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}

class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
        inputRef={el => this.inputElement = el}
      />
    );
  }
}
```

Pada contoh di atas, `Parent` mengoper *callback ref*-nya sebagai *props* `inputRef` kepada `CustomTextInput` dan `CustomTextInput` mengoper fungsi yang sama sebagai atribut `ref` khusus kepada `<input>`. Hasilnya, `this.inputElement` pada `Parent` akan disetel ke simpul DOM yang sesuai dengan elemen `<input>` pada `CustomTextInput`.

### API *Legacy*: *String Ref* {#legacy-api-string-refs}

Jika sebelumnya Anda bekerja dengan React, Anda mungkin sudah mengenal API lawas dengan atribut `ref` berupa *string*, misalnya `"textInput"`, dan simpul DOM yang diakses dengan `this.refs.textInput`. Kami sarankan untuk tidak melakukannya karena *string ref* memiliki [beberapa masalah](https://github.com/facebook/react/pull/8333#issuecomment-271648615) dan dipertimbangkan sebagai *legacy*, serta **kemungkinan besar akan dihapus dalam salah satu rilis di masa mendatang**. 

> Catatan
>
> Jika saat ini Anda menggunakan `this.refs.textInput` untuk mengakses *ref*, kami sarankan untuk beralih menggunakan [*callback pattern*](#callback-refs) atau [API `createRef`](#creating-refs).

### Kekurangan pada *callback ref* {#caveats-with-callback-refs}

Jika *callback* `ref` didefinisikan sebagai fungsi *inline*, fungsi ini akan dipanggil dua kali dalam proses pembaruan, yang pertama dengan argumen `null`, yang kedua dengan argumen elemen DOM. Ini terjadi karena instans baru dari fungsi akan dibuat dalam setiap proses *render*, karena React harus membersihkan *ref* yang lama dan menyiapkan yang baru. Anda bisa menghindari hal ini dengan mendefinisikan *callback* `ref` sebagau *bound method* pada kelas, tetapi perhatikan bahwa dalam sebagian besar kasus hal ini tidak berpengaruh.
