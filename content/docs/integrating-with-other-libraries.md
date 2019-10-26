---
id: integrating-with-other-libraries
title: Integrasi dengan _Library_ Lain
permalink: docs/integrating-with-other-libraries.html
---

React dapat digunakan pada aplikasi peramban apapun. React juga dapat ditanamkan di aplikasi lain, dan dengan sedikit pengaturan, aplikasi lain dapat ditanamkan di React. Panduan ini akan membahas beberapa kasus penggunaan yang lebih umum, memfokuskan pada integrasi dengan [jQuery](https://jquery.com/) dan [Backbone](https://backbonejs.org/), tetapi ide yang sama dapat diaplikasikan untuk mengintegrasikan komponen dengan kode yang ada.

## Integrasi dengan Plugin Manipulasi DOM {#integrating-with-dom-manipulation-plugins}

React tidak akan menyadari perubahan yang dilakukan pada DOM diluar dari React. Ini menentukan pembaharuan berdasarkan representasi internal sendiri, dan jika *node* DOM yang sama dimanipulasi oleh *library* lain, React menjadi bingung dan tidak memiliki cara untuk memulihkannya.

Ini tidak berarti tidak mungkin atau bahkan sulit untuk menggabungkan React dengan cara-cara lain untuk mempengaruhi DOM, Anda hanya perlu memperhatikan apa yang dilakukan oleh masing-masing.

Cara termudah untuk menghindari konflik adalah mencegah komponen React terbarui. Kamu dapat melakukannya dengan me-_render_ elemen-elemen yang React tidak punya alasan untuk mengubahnya, seperti sebuah `<div />` kosong.

### Cara Pendekatan Masalah {#how-to-approach-the-problem}

Untuk mendemonstrasikan ini, mari kita menggambarkan sebuah pembungkus untuk sebuah plugin generik jQuery.

Kita akan melampirkan [ref](/docs/refs-and-the-dom.html) kepada akar elemen DOM. Di dalam `componentDidMount`, kita akan mendapat sebuah referensi sehingga kita dapat menyampaikannya kepada _plugin_ jQuery.

Untuk mencegah React menyentuh DOM setelah pemasangan, kami akan mengembalikan sebuah `<div />` kosong dari *method* `render()`. Elemen `<div />` tidak memiliki properti atau anak, sehingga React tidak memiliki alasan untuk memperbaruinya, meninggalkan *plugin* jQuery bebas untuk mengelola bagian itu dari DOM:

```js{3,4,8,12}
class SomePlugin extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.somePlugin();
  }

  componentWillUnmount() {
    this.$el.somePlugin('destroy');
  }

  render() {
    return <div ref={el => this.el = el} />;
  }
}
```

Perhatikan bahwa kami mendefinisikan keduanya `componentDidMount` dan `componentWillUnmount` [lifecycle methods](/docs/react-component.html#the-component-lifecycle). Banyak *plugin* jQuery melampirkan pendengar *event* pada DOM sehingga ini penting untuk melepaskan mereka dalam `componentWillUnmount`. Jika *plugin* tidak menyediakan sebuah *method* untuk membersihkan, kamu mungkin akan menyediakannya sendiri, ingat untuk menghapus pendengar *event* apapun yang didaftarkan ke *plugin* untuk mencegah kebocoran memori.

### Integrasi dengan Plugin Chosen jQuery {#integrating-with-jquery-chosen-plugin}

Untuk contoh yang lebih konkret dari konsep-konsep ini, mari kita tulis pembungkus minimal untuk plugin [Chosen](https://harvesthq.github.io/chosen/), yang menambah masukan `<select>`.

>**Catatan:**
>
>Hanya karena itu mungkin, bukan berarti itu adalah pendekatan terbaik untuk aplikasi React. Kami menganjurkan kamu untuk menggunakan komponen React saat kamu bisa. komponen React lebih mudah untuk digunakan ulang dalam aplikasi React, dan sering kali menyediakan kontrol yang lebih pada perilaku dan penampilannya.

Pertama-tama, mari kita lihat apa yang Chosen lakukan pada DOM.

Jika kamu memanggilnya pada sebuah `<select>` node DOM, itu membaca attribut dari node DOM asli, menyembunyikannya dengan sebuah gaya inline, dan setelah itu tambahkan sebuah DOM node yang terpisah dengan representasi visualnya sendiri tepat setelah `<select>`. Setelah itu menembakan event jQuery untuk memberitahu kita tentang perubahannya.

Mari sebutkan bahwa ini adalah API yang kita perjuangkan untuk komponen pembungkus `<Chosen>` React kita:

```js
function Example() {
  return (
    <Chosen onChange={value => console.log(value)}>
      <option>vanilla</option>
      <option>chocolate</option>
      <option>strawberry</option>
    </Chosen>
  );
}
```

Kita akan mengimplementasikannya sebagai sebuah [uncontrolled component](/docs/uncontrolled-components.html) untuk sederhananya.

Pertama tama, kira akan membuat komponen kosong dengan sebuah *method* `render()` dimana kita mengembalikan `<select>` dibungkus didalam sebuah `<div>`:

```js{4,5}
class Chosen extends React.Component {
  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

Lihat bagaimana kita membungkus `<select>` dalam sebuah `<div>` ekstra. Ini penting karena Chosen akan menambahkan elemen DOM lainnya tepat setelah *node* `<select>` yang kita berikan pada itu. Namun, sejauh yang React ketahui, `<div>` hanya selalu memiliki satu *children*. Ini adalah bagaimana kita memastikan pembaharuan React tidak akan konflik dengan ekstra *node* DOM yang ditambahkan Chosen. Ini juga penting bahwa jika kamu memodifikasi DOM di luar alur React, kamu harus memastikan React tidak punya alasan untuk menyentuh *node* DOM tersebut.

Selanjutnya, kita akan mengimplementasikan *lifecycle method*. Kita akan menginisialisasi Chosen dengan ref kepada `<select>` node pada `componentDidMount`, dan merobohkannya dalam `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Catat bahwa React tidak memberikan arti khusus kepada *field* `this.el`. Ini hanya berfungsi karena sebelumnya kita menugaskan *field* ini dari sebuah `ref` dalam method `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Ini cukup untuk mengambil komponen kita pada render, tapi kita juga akan diberitahu tentang perubahan nilai. Untuk melakukan ini, kita akan berlangganan pada jQuery event `change` di `<select>` yang diatur oleh Chosen.

Kita tidak akan mengoper `this.props.onChange` secara langsung pada Chosen karena *props* komponen mungkin berubah seiring waktu, dan itu termasuk *event handler*. Sebagai gantinya, kita akan mendeklarasikan sebuah method `handleChange()` yang memanggil `this.props.onChange`, dan berlangganan pada event `change` di jQuery:

```js{5,6,10,14-16}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();

  this.handleChange = this.handleChange.bind(this);
  this.$el.on('change', this.handleChange);
}

componentWillUnmount() {
  this.$el.off('change', this.handleChange);
  this.$el.chosen('destroy');
}

handleChange(e) {
  this.props.onChange(e.target.value);
}
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Akhirnya, tinggal satu hal lagi yang harus dilakukan. Di React, *props* bisa berganti seiring waktu. Contohnya, komponen `<Chosen>` dapat mengambil *children* yang berbeda jika komponen *parent* berganti *state*. Ini berarti pada poin integrasi ini sangatlah penting jika kita secara manual memperbarui DOM sebagai tanggapan pada pembaharuan prop, sejak kita tidak perlu membiarkan React mengatur DOM untuk kita.

Dokumentasi Chosen menyarankan bahwa kita menggunakan API `trigger()` jQuery untuk memberitahu tentang perubahan pada DOM elemen yang asli. Kita akan membiarkan React mengurus pembaharuan `this.props.children` didalam `<select>`, tapi kita juga akan menambahkan sebuah *lifecycle method* `componentDidUpdate()` yang memberitahu Chosen tentang perubahan didalam daftar *children*:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Cara ini, Chosen akan tahu untuk pembaharuan pada DOM elemennya saat `<select>` *children* diatur oleh perubahan React.

Implementasi lengkap dari komponen `Chosen` terlihat seperti ini:

```js
class Chosen extends React.Component {
  componentDidMount() {
    this.$el = $(this.el);
    this.$el.chosen();

    this.handleChange = this.handleChange.bind(this);
    this.$el.on('change', this.handleChange);
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.children !== this.props.children) {
      this.$el.trigger("chosen:updated");
    }
  }

  componentWillUnmount() {
    this.$el.off('change', this.handleChange);
    this.$el.chosen('destroy');
  }
  
  handleChange(e) {
    this.props.onChange(e.target.value);
  }

  render() {
    return (
      <div>
        <select className="Chosen-select" ref={el => this.el = el}>
          {this.props.children}
        </select>
      </div>
    );
  }
}
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrasi dengan *Library* Tampilan lainnya {#integrating-with-other-view-libraries}

React dapat ditanamkan pada aplikasi-aplikasi lainnya terima kasih pada kefleksiblelannya [`ReactDOM.render()`](/docs/react-dom.html#render).

Meskipun React umum digunakan di *startup* untuk memuat komponen akar React tunggal pada DOM, `ReactDOM.render()` juga bisa dipanggil beberapa kali untuk bagian independen dari UI yang dimana dapat sekecil tombol, atau sebesar sebuah aplikasi.

Faktanya, inilah tepatnya bagaimana React digunakan di Facebook. Ini membuat kira menulis aplikasi pada React sepotong demi sepotong, dan mengkombinasikannya dengan templat yang dihasilkan server kami dan kode sisi klien lainnya.

### Mengganti Rendering Berbasis String dengan React {#replacing-string-based-rendering-with-react}

Sebuah pola yang umum pada aplikasi peramban lama adalah untuk mendeskripsikan bingkah dari DOM sebagai *string* dan memasukannya kepada DOM seperti: `$el.html(htmlString)`. Poin ini dalam sebuah basis kode sempurna untuk memperkenalkan React. Cukup tulis ulang *rendering* berbasis *string* sebagai komponen React.

Berikut adalah implementasi jQuery...

```js
$('#container').html('<button id="btn">Say Hello</button>');
$('#btn').click(function() {
  alert('Hello!');
});
```

...dapat ditulis ulang menggunakan sebuah komponen React:

```js
function Button() {
  return <button id="btn">Say Hello</button>;
}

ReactDOM.render(
  <Button />,
  document.getElementById('container'),
  function() {
    $('#btn').click(function() {
      alert('Hello!');
    });
  }
);
```

Dari sini kamu dapat mulai memindahkan lebih banyak logika ke komponen dan mulai mengadopsi lebih banyak praktik React yang lebih umum. Contoh nya, dikomponen yang terbaik adalah tidak bergantung pada ID karena komopnent yang sama  dapat di render beberapa kali. Sebagai gantinya, kira dapat menggunakan [React event system](/docs/handling-events.html) dan meregistrasi *handler* klik langsung pada React `<button>` elemen:

```js{2,6,9}
function Button(props) {
  return <button onClick={props.onClick}>Say Hello</button>;
}

function HelloButton() {
  function handleClick() {
    alert('Hello!');
  }
  return <Button onClick={handleClick} />;
}

ReactDOM.render(
  <HelloButton />,
  document.getElementById('container')
);
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Kamu dapat memiliki komponen yang terisolasi sebanyak yang kamu suka, dan menggunakan `ReactDOM.render()` untuk merendernya pada kontainer DOM yang berbeda. Sedikit demi sedikit, saat Anda mengonversi lebih banyak bagian dari aplikasi Anda ke React, kamu akan bisa mengkombinasikannya menjadi komponen yang lebih besar, dan memindahkan beberapa dari hirarki pemanggilan `ReactDOM.render()`.

### Menanamkan React didalam sebuah Tampilan Backbone {#embedding-react-in-a-backbone-view}

Tampilan [Backbone](https://backbonejs.org/) secara khusus menggunakan string HTML, atau templat fungsi pembuat string, untuk membuat content untuk DOM elemen mereka. Proses ini, juga, dapat digantikan dengan merender sebuah komponen React.

Dibawah ini, kita dapat membuat sebuah tampilan Backbone yang dipanggil `ParagraphView`. Ini akan mengesampingkan fungsi `render()` Backbone untuk merender sebuah komponen `<Paragraph>` React pada DOM elemen yang disediakan oleh Backbone (`this.el`). Disini, juga, kita menggunakan [`ReactDOM.render()`](/docs/react-dom.html#render):

```js{1,5,8,12}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  render() {
    const text = this.model.get('text');
    ReactDOM.render(<Paragraph text={text} />, this.el);
    return this;
  },
  remove() {
    ReactDOM.unmountComponentAtNode(this.el);
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Ini juga penting bahwa kita juga dapat memanggil `ReactDOM.unmountComponentAtNode()` pada method `remove` sehingga React membatalkan *event handlers* registrasi dan sumber lainnya yang terkait dengan pohon komponen saat itu dicopot.

Saat sebuah komponen dihapus *dari dalam* sebuah pohon React, pembersihan dilakukan secara otomatis, tapi karena kita menghapus seluruh pohon dengan tangan, kita harus memanggil method ini.

## Integrasi degan Lapisan-Lapisan Model {#integrating-with-model-layers}

Meskipun pada umumnya ini dianjurkan untuk menggunakan aliran data searah seperti [React state](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), atau [Redux](https://redux.js.org/), komopnen React juga dapat menggunakan lapisan model dari kerangkai kerja dan *library* lainnya.

### Menggunakan Model Backbone di Komponen-Komponen React {#using-backbone-models-in-react-components}

Cara termudah untuk menggunakan model [Backbone](https://backbonejs.org/) dan koleksi-koleksi dari sebuah komponen React adalah dengan mendengar pada berbagai macam perubahan *event* dan secara manual memaksakan sebuah perubahan.

Komponen bertanggung jawab untuk merender model-model yang mau mendengar pada *event* `'change'`, Sementara komponen bertanggung jawab untuk merender koleksi-koleksi akan mendengarkan untuk *event* `'add'` dan `'remove'`. Pada kedua kasus tersebut, panggil [`this.forceUpdate()`](/docs/react-component.html#forceupdate) untuk merender ulang komponen dengan data yang baru.

In the example below, the `List` component renders a Backbone collection, using the `Item` component to render individual items.

```js{1,7-9,12,16,24,30-32,35,39,46}
class Item extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.model.on('change', this.handleChange);
  }

  componentWillUnmount() {
    this.props.model.off('change', this.handleChange);
  }

  render() {
    return <li>{this.props.model.get('text')}</li>;
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.props.collection.on('add', 'remove', this.handleChange);
  }

  componentWillUnmount() {
    this.props.collection.off('add', 'remove', this.handleChange);
  }

  render() {
    return (
      <ul>
        {this.props.collection.map(model => (
          <Item key={model.cid} model={model} />
        ))}
      </ul>
    );
  }
}
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Mengekstrak Data dari Model Backbone {#extracting-data-from-backbone-models}

Pendekatan diatas membutuhkan komponen React mu untuk sadar akan model dan koleksi Backbone. Jika kamu nantinya merencanakan untuk migrasi kepada solusi manajemen data lainnya, kamu mungkin akan memusatkan pengetahuan tentang Backbone di beberapa bagian kode yang memungkinkan.

Salah satu solusi untuk ini adalah untuk mengekstrak atribut model sebagai data polos setiap kali itu berubah, dan menjaga logika ini pada satu tempat. Berikut ini adalah [a higher-order component](/docs/higher-order-components.html) yang mengekstrak seluruh atribut dari sebuah model Backbone pada *state*, Mengoper data pada komponen yang dibungkus.

Cara ini, hanya *higher-order component* yang perlu tahu tentang internal model Backbone, dan sebagian besar komponen di aplikasi dapat tetap agnostik dari Backbone.

Pada contoh dibawah ini, kita akan membuat sebuah salinan dari atribut model untuk membentuk *state* awal. Kita berlangganan pada *event* `change` (dan berhenti berlangganan saat sedang melakukan *unmount*), dan saat itu terjadi, kita ubah *state* dengan atribut model saat ini. Akhirnya, kita pastikan jika _prop_ `model` itu sendiri berubah, kita tidak lupa untuk berhenti berlangganan dari model yang lama, dan berlangganan pada model yang baru.

Catat bahwa contoh ini tidak dimaksudkan sebagai contoh yang menyeluruh untuk bekerja dengan Backbone. Tapi ini seharusnya memberi kamu sebuah gagasan tentang bagaimana cara mendekatinya dengan cara yang umum:

```js{1,5,10,14,16,17,22,26,32}
function connectToBackboneModel(WrappedComponent) {
  return class BackboneComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = Object.assign({}, props.model.attributes);
      this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
      this.props.model.on('change', this.handleChange);
    }

    componentWillReceiveProps(nextProps) {
      this.setState(Object.assign({}, nextProps.model.attributes));
      if (nextProps.model !== this.props.model) {
        this.props.model.off('change', this.handleChange);
        nextProps.model.on('change', this.handleChange);
      }
    }

    componentWillUnmount() {
      this.props.model.off('change', this.handleChange);
    }

    handleChange(model) {
      this.setState(model.changedAttributes());
    }

    render() {
      const propsExceptModel = Object.assign({}, this.props);
      delete propsExceptModel.model;
      return <WrappedComponent {...propsExceptModel} {...this.state} />;
    }
  }
}
```

Untuk mendemonstrasikan bagaimana cara menggunakannya, kita akan menghubungkan sebuah komponen React `NameInput` pada sebuah model Backbone, dan memperbarui atribut `firstName` setiap kali terjadi perubahan masukan:

```js{4,6,11,15,19-21}
function NameInput(props) {
  return (
    <p>
      <input value={props.firstName} onChange={props.handleChange} />
      <br />
      My name is {props.firstName}.
    </p>
  );
}

const BackboneNameInput = connectToBackboneModel(NameInput);

function Example(props) {
  function handleChange(e) {
    props.model.set('firstName', e.target.value);
  }

  return (
    <BackboneNameInput
      model={props.model}
      handleChange={handleChange}
    />
  );
}

const model = new Backbone.Model({ firstName: 'Frodo' });
ReactDOM.render(
  <Example model={model} />,
  document.getElementById('root')
);
```

[**Coba ini di CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Teknik ini tidak terbatas pada Backbone. Kamu dapat menggunakan React dengan *library* model apapun dengan berlangganan pada perubahannya di metode *lifecycle*, dan, secara opsional, menyalin data pada *state* lokal React.
