---
id: uncontrolled-components
title: Uncontrolled Component
permalink: docs/uncontrolled-components.html
---

Pada sebagian besar kasus, kami sarankan untuk menggunakan [*controlled component*](/docs/forms.html) untuk mengimpementasikan *form*. Pada *controlled component*, data *form* ditangani oleh komponen React. Cara alternatifnya adalah menggunakan *uncontrolled component*, di mana data *form* akan ditangani oleh DOM-nya sendiri.

Untuk menulis *uncontrolled component*, alih-alih menulis *event handler* untuk setiap pembaruan *state*, Anda bisa [menggunakan *ref*](/docs/refs-and-the-dom.html) untuk mendapatkan nilai *form* dari DOM.

Misalnya, kode berikut menerima sebuah nama dari sebuah *uncontrolled component*:

```javascript{5,9,18}
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('Sebuah nama telah dikirim: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Nama:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Kirim" />
      </form>
    );
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/WooRWa?editors=0010)

Oleh karena *uncontrolled component* menyimpan sumber kebenaran dalam DOM, terkadang lebih mudah untuk mengintegrasikan kode React dan non-React jika menggunakan *uncontrolled component*. Ini juga berarti lebih sedikit kode jika Anda menginginkan solusi cepat walau tak rapi. Selain itu pada umumnya Anda harus menggunakan *controlled component*.

Jika masih belum jelas jenis komponen mana yang harus Anda gunakan untuk situasi tertentu, mungkin [artikel tentang *controlled input* versus *uncontrolled input*](https://goshakkk.name/controlled-vs-uncontrolled-inputs-react/) bisa membantu.

### Nilai Default {#default-values}

<<<<<<< HEAD
Pada *lifecycle rendering* React, atribut `value` pada elemen *form* akan menimpa nilai pada DOM. Dengan *uncontrolled component*, sering kali Anda menginginkan React untuk menentukan nilai awal tetapi pembaruan berikutnya dilakukan secara *uncontrolled*. Untuk menangani kasus ini, Anda bisa menentukan atribut `defaultValue` alih-alih menggunakan `value`.
=======
In the React rendering lifecycle, the `value` attribute on form elements will override the value in the DOM. With an uncontrolled component, you often want React to specify the initial value, but leave subsequent updates uncontrolled. To handle this case, you can specify a `defaultValue` attribute instead of `value`. Changing the value of `defaultValue` attribute after a component has mounted will not cause any update of the value in the DOM.
>>>>>>> 968f09159512b59afd5246a928789ae52592c923

```javascript{7}
render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Nama:
        <input
          defaultValue="Budi"
          type="text"
          ref={this.input} />
      </label>
      <input type="submit" value="Kirim" />
    </form>
  );
}
```

Ini juga berlaku pada dukungan `defaultChecked` untuk `<input type="checkbox">` dan `<input type="radio">`, serta dukungan `defaultValue` untuk `<select>` dan `<textarea>`.

## Tag file input {#the-file-input-tag}

Pada HTML, sebuah `<input type="file">` memungkinkan pengguna untuk memilih satu atau beberapa flle dari media penyimpanan mereka untuk diunggah ke server atau dimanipulasi dengan JavaScript lewat [File API](https://developer.mozilla.org/en-US/docs/Web/API/File/Using_files_from_web_applications).

```html
<input type="file" />
```

Dalam React, sebuah `<input type="file" />` selalu merupakan *uncontrolled component* karena nilainya hanya bisa disetel oleh pengguna, bukan oleh kode program.

Anda harus menggunakan File API untuk berinteraksi dengan berkas. Contoh berikut menunjukkan cara membuat [*ref* ke simpul DOM](/docs/refs-and-the-dom.html) untuk mengakses berkas dalam *submit handler*:

`embed:uncontrolled-components/input-type-file.js`

[](codepen://uncontrolled-components/input-type-file)

