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

<<<<<<< HEAD
Elemen form HTML bekerja sedikit berbeda dari elemen DOM lainnya di React, karena elemen form secara natural menyimpan beberapa _state_ internal. Sebagai contoh, form ini pada HTML biasa menerima nama tunggal:
=======
HTML form elements work a bit differently from other DOM elements in React, because form elements naturally keep some internal state. For example, this form in plain HTML accepts a single name:
>>>>>>> 6bd09fe682e18ccd7747fcd7798fa8fb4d3edc42

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

Kita dapat menggabungkan keduanya dengan menggunakan _state_ pada React sebagai "sumber kebenaran satu-satunya". Kemudian komponen React yang me-_render_ sebuah form juga mengontrol apa yang terjadi dalam form tersebut pada masukan pengguna selanjutnya. Sebuah elemen masukan form yang nilainya dikontrol oleh React melalui cara seperti ini disebut sebagai "_controlled component_".

Sebagai contoh, jika kita ingin membuat form pada contoh sebelumnya mencatat sebuah nama ketika nama dikirim, kita dapat menuliskan form sebagai sebuah _controlled component_:

```javascript{4,10-12,21,24}
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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/VmmPgp?editors=0010)

Karena atribut `value` telah kita set pada elemen form, nilai yang ditampilkan akan selalu sama dengan `this.state.value`, yang menjadikan React sebagai sumber kebenaran tunggal dari _state_. Dan karena `handleChange` dijalankan setiap ketikan untuk memperbarui _state_ React, nilai yang ditampilkan akan terbarui ketika pengguna mengetik.

Dengan sebuah _controlled component_, nilai input akan selalu didorong oleh _state_ di React. Meskipun ini mengharuskan Anda untuk menulis lebih banyak kode, sekarang Anda juga bisa mengoper nilai ini ke elemen antarmuka lain, atau me-_reset_ nilai tersebut dari _event handler_ lain.

## Tag textarea {#the-textarea-tag}

Pada HTML, elemen `<textarea>` mendefinisikan teks di dalamnya sebagai elemen anaknya:

```html
<textarea>
  Hello there, this is some text in a text area
</textarea>
```

Di React, `<textarea>` menggunakan atribut `value`. Dengan cara ini, sebuah form yang menggunakan `<textarea>` dapat ditulis dengan cara yang sangat mirip dengan sebuah form yang menggunakan masukan satu baris:

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

Perhatikan bahwa `this.state.value` diinisialisasi di constructor, sehingga area teks akan memiliki teks di dalamnya.

## Tag select {#the-select-tag}

Pada HTML, `<select>` membuat sebuah daftar _drop-down_. Sebagai contoh, HTML ini membuat sebuah daftar _drop-down_ dari beberapa bumbu:

```html
<select>
  <option value="grapefruit">Grapefruit</option>
  <option value="lime">Lime</option>
  <option selected value="coconut">Coconut</option>
  <option value="mango">Mango</option>
</select>
```

Perhatikan bahwa opsi Coconut mula-mula dipilih, karena adanya atribut `selected`. Di React, alih-alih menggunakan atribut `selected`, kita menggunakan atribut `value` di tag `select`. Hal ini lebih mudah dalam sebuah _controlled component_ karena Anda hanya perlu mengubahnya di satu tempat saja. Sebagai contoh:

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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/JbbEzX?editors=0010)

Secara keseluruhan, perubahan-perubahan ini membuat `<input type="text">`, `<textarea>`, dan `<select>` bekerja dengan cara yang mirip - mereka masing-masing menerima atribut `value` yang dapat Anda gunakan untuk mengimplementasikan _controlled component_.

> Catatan
>
> Anda bisa memasukan array ke atribut `value`, yang memungkinkan Anda memilih beberapa opsi dalam tag `select`:
>
>```js
><select multiple={true} value={['B', 'C']}>
>```

## Masukkan Tag File {#the-file-input-tag}

Dalam HTML, sebuah `<input type="file">` membiarkan pengguna untuk memilih satu atau lebih berkas dari penyimpanan perangkat mereka untuk diunggah ke sebuah server atau dimanipulasi oleh JavaScript melalui [Berkas API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Karena nilai yang dimiliki adalah _read-only_, ini termasuk ke dalam _***uncontrolled*** component_ di React. Hal ini akan dibahas bersama dengan _uncontrolled component_ lainnya [selanjutnya di dokumentasi](/docs/uncontrolled-components.html#the-file-input-tag).

## Menangani Banyak Input {#handling-multiple-inputs}

Ketika Anda membutuhkan penanganan banyak elemen `input` terkontrol, Anda dapat menambahkan atribut `name` pada setiap elemen dan membiarkan fungsi _handler_ memilih apa yang harus dilakukan berdasarkan nilai dari `event.target.name`.

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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/wgedvV?editors=0010)

Perhatikan bagaimana kita meggunakan sintaks [_computed property name_](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#Computed_property_names) ES6 untuk mengubah _state_ dengan _key_ yang sesuai dengan nama dari masukan:

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

Dan juga, karena `setState()` secara otomatis [menggabungkan _state_ parsial ke _state_ yang sudah ada](/docs/state-and-lifecycle.html#state-updates-are-merged), kita hanya perlu memanggilnya dengan bagian yang berubah saja.

## Mengendalikan Masukkan Nilai Kosong {#controlled-input-null-value}

<<<<<<< HEAD
Menentukan nilai _prop_ pada [controlled component](/docs/forms.html#controlled-components) mencegah pengguna mengubah masukan kecuali Anda menginginkannya. Jika Anda telah menetapkan nilai `value` namun masukan masih dapat diubah, Anda mungkin telah secara tidak sengaja menetapkan `value` ke `undefined` atau `null`.
=======
Specifying the `value` prop on a [controlled component](/docs/forms.html#controlled-components) prevents the user from changing the input unless you desire so. If you've specified a `value` but the input is still editable, you may have accidentally set `value` to `undefined` or `null`.
>>>>>>> 6bd09fe682e18ccd7747fcd7798fa8fb4d3edc42

Kode berikut menunjukkan contoh ini. (Mula-mula masukan terkunci tetapi menjadi dapat diubah setelah jeda singkat.)

```javascript
ReactDOM.render(<input value="hi" />, mountNode);

setTimeout(function() {
  ReactDOM.render(<input value={null} />, mountNode);
}, 1000);

```

## Alternatif dari Controlled Components {#alternatives-to-controlled-components}

Terkadang akan menjadi sulit untuk menggunakan _controlled components_, karena Anda perlu menulis _event handler_ untuk setiap cara data Anda berubah dan menyalurkan semua masukan _state_ melalui komponen React. Ini dapat menjadi sangat menjengkelkan ketika Anda sedang mengkonversi basis kode yang sudah ada ke React, atau mengintegrasikan sebuah aplikasi React dengan sebuah _library_ bukan-React. Pada situasi seperti ini, Anda mungkin ingin menggunakan [uncontrolled components](/docs/uncontrolled-components.html), sebuah teknik alternatif untuk mengimplementasikan masukan form.

## Solusi Selengkapnya {#fully-fledged-solutions}

Jika Anda mencari solusi komplit termasuk validasi, melacak _fields_ yang dikunjungi, dan menangani pengiriman form, [Formik](https://jaredpalmer.com/formik) adalah salah satu pilihan populer. Namun, itu dibuat dengan prinsip yang sama dengan _controlled components_ dan pengelolaan _state_ — jadi jangan lalai untuk mempelajarinya.
