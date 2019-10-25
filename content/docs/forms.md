---
id: forms
title: Form
permalink: docs/forms.html
prev: lists-and-keys.html
next: lifting-state-up.html
redirect_from:
  - "tips/controlled-input-null-value.html"
  - "docs/forms-zh-CN.html"
---

HTML form elemen bekerja sedikit berbeda dari DOM elemen lainnya di React, karena form elemen secara natural menyimpan beberapa state internal. Sebagai contoh, form ini pada HTML biasa menerima nama tunggal:

```html
<form>
  <label>
    Name:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="Submit" />
</form>
```

Form ini memiliki perilaku dasar dari form HTML biasa yakni menuju ke laman baru ketika user mengirim form tersebut. Jika Anda menginginkan perilaku seperti ini di React, ini sebenarnya dapat bekerja. Namun di banyak kasus, akan lebih mudah untuk memiliki sebuah fungsi JavaScript yang menangani sebuah submisi dari sebuah form dan memiliki akses terhadap data yang dimasukkan pengguna ke dalam form. Cara standar untuk mencapai hal ini adalah dengan teknik yang disebut "_controlled component_".

## Controlled Component {#controlled-components}

Pada HTML, elemen form seperti `<input>`, `<textarea>`, dan `<select>` biasanya menyimpan _state_ mereka sendiri dan memperbaruinya berdasarkan masukan dari pengguna. Di React, _state_ yang dapat berubah seperti ini biasanya disimpan pada properti dari komponen, dan hanya akan diubah menggunakan [`setState()`](/docs/react-component.html#setstate).

Kita dapat menggabungkan keduanya dengan menggunakan state pada React sebagai "sumber kebenaran satu-satunya". Kemudian komponen React yang me-render sebuah form juga mengontrol apa yang terjadi dalam form tersebut pada input pengguna selanjutnya. Sebuah elemen from input yang nilainya dikontrol oleh React melalui cara seperti ini disebut sebagai "*controlled component*".

Sebagai contoh, jika kita ingin membuat form pada contoh sebelumnya mencatat sebuah nama ketika nama dikirim, kita dapat menuliskan form sebagai sebuah _controlled component_:

```javascript{4,10-12,24}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Karena atribut `value` telah kita set pada elemen form, nilai yang ditampilkan akan selalu sama dengan `this.state.value`, yang menjadikan React sebagai sumber kebenaran tunggal dari _state_. Dan karena `handleChange` dijalankan setiap ketikan untuk memperbarui _state_ React, nilai yang ditampilkan akan terbarui ketika pengguna mengetik.

Dengan sebuah *controlled component*, setiap perubahan state akan memiliki sebuah fungsi *handler* yang terkait. Hal ini membuat lebih mudah untuk memodifikasi atau memvalidasi input pengguna. Sebagai contoh, jika kita ingin mengharuskan nama untuk seluruhnya ditulis dengan huruf kapital, kita dapat menuliskan `handleChange` sebagai:

```javascript{2}
handleChange(event) {
  this.setState({value: event.target.value.toUpperCase()});
}
```

## Tag textarea {#the-textarea-tag}

Pada HTML, sebuah elemen `<textarea>` mendefinisikan teks di dalamnya dengan menaruh teks sebagai elemen anaknya:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

Di React, kita dapat menggunakan atribut `value` pada `<textarea>`. Dengan cara ini, sebuah form yang menggunakan `<textarea>` dapat ditulis dengan cara yang sangat mirip dengan sebuah form yang menggunakan input satu baris:

```javascript{4-6,12-14,26}
class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 'Please write an essay about your favorite DOM element.'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('An essay was submitted: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Essay:
          <textarea value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

Perhatikan bahwa `this.state.value` diinisialisasi di constructor, sehingga textarea mula-mula akan memiliki teks di dalamnya.

## Tag select {#the-select-tag}

Pada HTML, `<select>` membuat sebuah daftar *drop-down*. Sebagai contoh, HTML ini membuat sebuah daftar *drop-down* dari beberapa bumbu:

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Perhatikan bahwa the opsi Coconut mula-mula dipilih, karena adanya atribut `selected`. Di React, daripada menggunakan atribut `selected`, kita menggunakan atribut `value` di tag `select`. Hal ini lebih nyaman dalam sebuah *controlled component* karena anda hanya perlu meng-updatenya di satu tempat saja. Sebagai contoh:

```javascript{4,10-12,24}
class FlavorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: 'coconut'};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('Your favorite flavor is: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Pick your favorite flavor:
          <select value={this.state.value} onChange={this.handleChange}>
            <option value="grapefruit">Grapefruit</option>
            <option value="lime">Lime</option>
            <option value="coconut">Coconut</option>
            <option value="mango">Mango</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Secara keseluruhan, perubahan-perubahan ini membuat `<input type="text">`, `<textarea>`, dan `<select>` semuanya bekerja dengan cara yang mirip - mereka masing-masing menerima atribut `value` yang dapat anda gunakan untuk mengimplementasikan *controlled component*.

> Catatan
>
> Anda bisa memasukan array ke atribut `value`, yang memungkinkan anda memilih beberapa opsi dalam tag `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## Masukkan Tag File {#the-file-input-tag}

Dalam HTML, sebuah `<input type="file">` membiarkan pengguna untuk memilih satu atau lebih berkas dari penyimpanan perangkat mereka untuk diunggah ke sebuah server atau dimanipulasi oleh JavaScript melalui [Berkas API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Karena nilai yang dimiliki adalah hanya-baca, ini termasuk ke dalam ***uncontrolled*** *component* di React. Hal ini akan dibahas bersama dengan *uncontrolled components* lainnya [selanjutnya di dokumentasi](/docs/uncontrolled-components.html#the-file-input-tag).

## Menangani Banyak Input {#handling-multiple-inputs}

Ketika anda membutuhkan penanganan banyak elemen `input` terkontrol, anda dapat menambahkan atribut `name` pada setiap elemen dan membiarkan fungsi *handler* memilih apa yang harus dilakukan berdasarkan nilai dari `event.target.name`.

Sebagai contoh:

```javascript{15,18,28,37}
class Reservation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGoing: true,
      numberOfGuests: 2
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <form>
        <label>
          Is going:
          <input
            name="isGoing"
            type="checkbox"
            checked={this.state.isGoing}
            onChange={this.handleInputChange} />
        </label>
        <br />
        <label>
          Number of guests:
          <input
            name="numberOfGuests"
            type="number"
            value={this.state.numberOfGuests}
            onChange={this.handleInputChange} />
        </label>
      </form>
    );
  }
}
```

[**Cobalah di CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Perhatikan bagaimana kita meggunakan sintaks [computed property name](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) ES6 untuk meng-update state dengan *key* yang sesuai dengan nama dari input:

```js{2}
this.setState({
  [name]: value
});
```

Kode diatas setara dengan kode ES5 berikut:

```js{2}
var partialState = {};
partialState[name] = value;
this.setState(partialState);
```

Dan juga, karena `setState()` secara otomatis [menggabungkan state parsial ke state yang sufah ada](/docs/state-and-lifecycle.html#state-updates-are-merged), kita hanya perlu memanggilnya dengan bagian yang berubah saja.

## Mengendalikan Masukkan Nilai Kosong {#controlled-input-null-value}

Menentukan nilai prop pada [controlled component](/docs/forms.html#controlled-components) mencegah pengguna mengubah masukan kecuali jika anda menginginkannya. Jika anda telah menetapkan nilai `value` namun masukan masih dapat diedit, anda mungkin telah secara tidak sengaja menetapkan `value` ke `undefined` atau `null`.

Kode berikut menunjukkan contoh ini. (Mula-mula masukan terkunci tetapi menjadi dapat diedit setelah jeda singkat.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatif dari Controlled Components {#alternatives-to-controlled-components}

Terkadang akan menjadi sulit untuk menggunakan *controlled components*, karena anda perlu menulis *event handler* untuk setiap cara data anda berubah dan menyalurkan semua state input melalui komponen React. Ini dapat menjadi sangat menjengkelkan ketika anda sedang mengkonversi basis kode yang sudah ada ke React, atau mengintegrasikan sebuah aplikasi React dengan sebuah *library* bukan-React. Pada situasi seperti ini, anda mungkin ingin menggunakan [uncontrolled components](/docs/uncontrolled-components.html), sebuah teknik alternatif untuk mengimplementasikan form input.

## Solusi Selengkapnya {#fully-fledged-solutions}

Jika anda mencari solusi komplit termasuk validasi, melacak *fields* yang dikunjungi, dan menangani form submisi, [Formik](https://jaredpalmer.com/formik) adalah salah satu pilihan populer. Meski begitu, itu dibuat dengan prinsip yang sama dengan *controlled components* dan mengelola state — jadi jangan lalai untuk mempelajarinya.
