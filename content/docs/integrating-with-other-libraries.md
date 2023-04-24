---
id: integrating-with-other-libraries
title: Integrasi dengan Library Lain
permalink: docs/integrating-with-other-libraries.html
---

<div class="scary">

> These docs are old and won't be updated. Go to [react.dev](https://react.dev/) for the new React docs.
> 
> These new documentation pages teach modern React:
>
> - [`useSyncExternalStore`: Subscribing to an external store 
](https://react.dev/reference/react/useSyncExternalStore#subscribing-to-an-external-store)
> - [`createPortal`: Rendering React components into non-React DOM nodes 
](https://react.dev/reference/react-dom/createPortal#rendering-react-components-into-non-react-dom-nodes)

</div>

React dapat digunakan pada aplikasi peramban apapun. React juga dapat ditanamkan di aplikasi lain, dan dengan sedikit pengaturan, aplikasi lain dapat ditanamkan di React. Panduan ini akan membahas beberapa kasus penggunaan yang lebih umum, memfokuskan pada integrasi dengan [jQuery](https://jquery.com/) dan [Backbone](https://backbonejs.org/), tetapi ide yang sama dapat diaplikasikan untuk mengintegrasikan komponen dengan kode yang ada.

## Integrasi dengan Plugin Manipulasi DOM {#integrating-with-dom-manipulation-plugins}

React tidak akan menyadari perubahan yang dilakukan pada DOM diluar dari React. Ini menentukan pembaharuan berdasarkan representasi internal sendiri, dan jika *node* DOM yang sama dimanipulasi oleh *library* lain, React menjadi bingung dan tidak memiliki cara untuk memulihkannya.

Ini tidak berarti tidak mungkin atau bahkan sulit untuk menggabungkan React dengan cara-cara lain untuk mempengaruhi DOM, Anda hanya perlu memperhatikan apa yang dilakukan oleh masing-masing.

Cara termudah untuk menghindari konflik adalah mencegah komponen React terbarui. Anda dapat melakukannya dengan me-_render_ elemen-elemen yang React tidak punya alasan untuk mengubahnya, seperti sebuah `<div />` kosong.

### Cara Pendekatan Masalah {#how-to-approach-the-problem}

Untuk mendemonstrasikan ini, mari kita menggambarkan sebuah pembungkus untuk sebuah plugin generik jQuery.

Kita akan melampirkan [ref](/docs/refs-and-the-dom.html) kepada akar elemen DOM. Di dalam `componentDidMount`, kita akan mendapat sebuah referensi sehingga kita dapat menyampaikannya kepada _plugin_ jQuery.

Untuk mencegah React menyentuh DOM setelah pemasangan, kami akan mengembalikan sebuah `<div />` kosong dari *method* `render()`. Elemen `<div />` tidak memiliki properti atau anak, sehingga React tidak memiliki alasan untuk memperbaruinya, meninggalkan *plugin* jQuery bebas untuk mengelola bagian dari DOM tersebut:

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

Perhatikan bahwa kami mendefinisikan keduanya `componentDidMount` dan `componentWillUnmount` [lifecycle methods](/docs/react-component.html#the-component-lifecycle). Banyak *plugin* jQuery melampirkan pendengar *event* pada DOM sehingga ini penting untuk melepaskan mereka dalam `componentWillUnmount`. Jika *plugin* tidak menyediakan sebuah *method* untuk membersihkan, Anda mungkin akan menyediakannya sendiri, ingat untuk menghapus pendengar *event* apapun yang didaftarkan ke *plugin* untuk mencegah kebocoran memori.

### Integrasi dengan Plugin Chosen jQuery {#integrating-with-jquery-chosen-plugin}

Untuk contoh yang lebih konkret dari konsep-konsep ini, mari kita tulis pembungkus minimal untuk _plugin_ [Chosen](https://harvesthq.github.io/chosen/), yang menambah masukan `<select>`.

>**Catatan:**
>
>Hanya karena hal tersebut memungkinan, bukan berarti itu adalah pendekatan yang terbaik untuk aplikasi React. Kami menganjurkan Anda untuk menggunakan komponen React saat Anda bisa. Komponen React lebih mudah untuk digunakan ulang dalam aplikasi React, dan sering kali menyediakan kontrol yang lebih pada perilaku dan tampilannya.

Pertama-tama, mari kita lihat apa yang Chosen lakukan pada DOM.

Jika Anda memanggilnya pada sebuah `<select>` node DOM, dia akan membaca attribut dari node DOM asli, menyembunyikannya dengan sebuah gaya _inline_, dan setelah itu menambahkan sebuah DOM node yang terpisah dengan representasi visualnya sendiri tepat setelah `<select>`. Setelahnya, dia akan memanggil _event_ jQuery untuk memberitahu kita tentang perubahannya.

Anggaplah bahwa ini adalah API yang kita perjuangkan untuk komponen pembungkus `<Chosen>` React kita:

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

Kita akan mengimplementasikannya sebagai sebuah [uncontrolled component](/docs/uncontrolled-components.html) untuk penyederhanaan.

Pertama, kita akan membuat komponen kosong dengan sebuah metode `render()` di mana kita mengembalikan `<select>` yang dibungkus di dalam sebuah `<div>`:

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

Lihat bagaimana kita membungkus `<select>` dalam sebuah `<div>` ekstra. Ini penting karena Chosen akan menambahkan elemen DOM lainnya tepat setelah *node* `<select>` yang kita berikan padanya. Namun, sejauh yang React ketahui, `<div>` hanya selalu memiliki satu *children*. Ini adalah bagaimana kita memastikan pembaharuan React tidak akan konflik dengan ekstra *node* DOM yang ditambahkan Chosen. Ini juga penting bahwa jika Anda memodifikasi DOM di luar alur React, Anda harus memastikan React tidak punya alasan untuk menyentuh *node* DOM tersebut.

Selanjutnya, kita akan mengimplementasikan metode *lifecycle*. Kita akan menginisialisasi Chosen dengan _ref_ kepada _node_ `<select>` pada `componentDidMount`, dan menghancurkannya dalam `componentWillUnmount`:

```js{2,3,7}
componentDidMount() {
  this.$el = $(this.el);
  this.$el.chosen();
}

componentWillUnmount() {
  this.$el.chosen('destroy');
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/qmqeQx?editors=0010)

Catat bahwa React tidak memberikan arti khusus kepada *field* `this.el`. Ini hanya berfungsi karena sebelumnya kita menugaskan *field* ini dari sebuah `ref` dalam metode `render()`:

```js
<select className="Chosen-select" ref={el => this.el = el}>
```

Ini cukup untuk mengambil komponen kita untuk di-_render_, tapi kita juga ingin diberitahu tentang perubahan nilai. Untuk melakukan ini, kita akan berlangganan pada jQuery _event_ `change` di `<select>` yang diatur oleh Chosen.

Kita tidak akan mengoper `this.props.onChange` secara langsung pada Chosen karena *props* komponen mungkin berubah seiring waktu, dan itu termasuk *event handler*. Sebagai gantinya, kita akan mendeklarasikan sebuah metode `handleChange()` yang memanggil `this.props.onChange`, dan berlangganan pada _event_ `change` di jQuery:

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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/bWgbeE?editors=0010)

Akhirnya, tinggal satu hal lagi yang harus dilakukan. Di React, *props* bisa berganti seiring waktu. Contohnya, komponen `<Chosen>` dapat mengambil *children* yang berbeda jika komponen *parent* berganti *state*. Ini berarti pada poin integrasi ini sangatlah penting jika kita secara manual memperbarui DOM sebagai tanggapan pada pembaruan _prop_, karena kita tidak perlu membiarkan React mengatur DOM untuk kita.

Dokumentasi Chosen menyarankan kita untuk menggunakan API `trigger()` jQuery untuk memberitahu tentang perubahan pada DOM elemen yang asli. Kita akan membiarkan React mengurus pembaruan `this.props.children` di dalam `<select>`, tapi kita juga akan menambahkan sebuah metode *lifecycle* `componentDidUpdate()` yang memberitahu Chosen tentang perubahan di dalam daftar *children*:

```js{2,3}
componentDidUpdate(prevProps) {
  if (prevProps.children !== this.props.children) {
    this.$el.trigger("chosen:updated");
  }
}
```

Dengan cara ini, Chosen akan tahu untuk mengubah DOM elemennya saat `<select>` *children* diatur oleh perubahan pada React.

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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/xdgKOz?editors=0010)

## Integrasi dengan *Library* Tampilan Lain {#integrating-with-other-view-libraries}

React dapat ditanamkan pada aplikasi lain karena kefleksiblelannya [`createRoot()`](/docs/react-dom-client.html#createRoot).

Meskipun React umum digunakan di *startup* untuk memuat komponen akar tunggal React pada DOM, `createRoot()` juga bisa dipanggil beberapa kali untuk bagian independen dari UI yang di mana dapat berupa sekecil tombol, atau sebesar sebuah aplikasi.

Faktanya, seperti inilah bagaimana React digunakan di Facebook. Ini membuat kita menulis aplikasi pada React sedikit demi sedikit, dan mengkombinasikannya dengan templat yang dihasilkan server kami dan kode sisi klien lainnya.

### Mengganti _Rendering_ Berbasis _String_ dengan React {#replacing-string-based-rendering-with-react}

Sebuah pola yang umum pada aplikasi peramban lama adalah untuk mendeskripsikan bingkah dari DOM sebagai *string* dan memasukannya kepada DOM seperti: `$el.html(htmlString)`. Poin ini dalam sebuah basis kode sempurna untuk memperkenalkan React. Cukup tulis ulang *rendering* berbasis *string* sebagai komponen React.

Implementasi jQuery berikut ini...

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

$('#btn').click(function() {
  alert('Hello!');
});
```

Dari sini Anda dapat mulai memindahkan lebih banyak logika ke komponen dan mulai mengadopsi lebih banyak praktik React yang lebih umum. Contohnya, dalam komponen yang terbaik adalah untuk tidak bergantung pada ID karena komopnen yang sama  dapat di-_render_ beberapa kali. Sebagai gantinya, kira dapat menggunakan [sistem _event_ React](/docs/handling-events.html) dan meregistrasi *handler* klik langsung pada elemen `<button>` React:

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
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/RVKbvW?editors=1010)

Anda dapat memiliki komponen yang terisolasi sebanyak yang Anda suka, dan menggunakan `ReactDOM.createRoot()` untuk merendernya pada kontainer DOM yang berbeda. Sedikit demi sedikit, saat Anda mengonversi lebih banyak bagian dari aplikasi Anda ke React, Anda akan bisa mengkombinasikannya menjadi komponen yang lebih besar, dan memindahkan beberapa dari hirarki pemanggilan `ReactDOM.createRoot()`.

### Menanamkan React dalam Tampilan Backbone {#embedding-react-in-a-backbone-view}

Tampilan [Backbone](https://backbonejs.org/) secara khusus menggunakan _string_ HTML, atau templat fungsi pembuat _string_, untuk membuat konten untuk elemen DOM mereka. Proses ini juga dapat digantikan dengan me-_render_ sebuah komponen React.

Di bawah ini, kita dapat membuat sebuah tampilan Backbone bernama `ParagraphView`. Tampilan ini akan mengesampingkan fungsi `render()` Backbone untuk me-_render_ sebuah komponen `<Paragraph>` React pada elemen DOM yang disediakan oleh Backbone (`this.el`). Di sini kita juga menggunakan [`ReactDOM.createRoot()`](/docs/react-dom-client.html#createroot):

```js{7,11,15}
function Paragraph(props) {
  return <p>{props.text}</p>;
}

const ParagraphView = Backbone.View.extend({
  initialize(options) {
    this.reactRoot = ReactDOM.createRoot(this.el);
  },
  render() {
    const text = this.model.get('text');
    this.reactRoot.render(<Paragraph text={text} />);
    return this;
  },
  remove() {
    this.reactRoot.unmount();
    Backbone.View.prototype.remove.call(this);
  }
});
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/gWgOYL?editors=0010)

Adalah penting bahwa kita juga dapat memanggil `root.unmount()` pada metode `remove` sehingga React membatalkan *event handler* registrasi dan sumber lainnya yang terkait dengan pohon komponen saat dicopot.

Saat sebuah komponen dihapus *dari dalam* sebuah pohon React, pembersihan dilakukan secara otomatis, tapi karena kita menghapus seluruh pohon secara manual, kita harus memanggil metode ini.

## Integrasi dengan Lapisan Model {#integrating-with-model-layers}

Meskipun pada umumnya dianjurkan untuk menggunakan aliran data searah seperti [_state_ React](/docs/lifting-state-up.html), [Flux](https://facebook.github.io/flux/), atau [Redux](https://redux.js.org/), komponen React juga dapat menggunakan lapisan model dari _framework_ dan *library* lainnya.

### Menggunakan Model Backbone pada Komponen React {#using-backbone-models-in-react-components}

Cara termudah untuk menggunakan model [Backbone](https://backbonejs.org/) dan koleksi dari sebuah komponen React adalah dengan mendengarkan berbagai macam perubahan *event* dan memaksakan sebuah perubahan secara manual.

Komponen yang bertanggung jawab untuk me-_render_ model akan mendengarkan *event* `'change'`, sementara komponen yang bertanggung jawab untuk me-_render_ koleksi akan mendengarkan *event* `'add'` dan `'remove'`. Pada kedua kasus tersebut, panggil [`this.forceUpdate()`](/docs/react-component.html#forceupdate) untuk me-_render_ ulang komponen dengan data yang baru.

Pada contoh dibawah ini, komponen `List` me-_render_ sebuah koleksi backbone, menggunakan komponen `Item` untuk me-_render_ item individual.

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

[**Coba di CodePen**](https://codepen.io/gaearon/pen/GmrREm?editors=0010)

### Mengekstrak Data dari Model Backbone {#extracting-data-from-backbone-models}

Pendekatan di atas membutuhkan komponen React Anda mengetahui model dan koleksi Backbone. Jika Anda nantinya merencanakan untuk melakukan migrasi ke solusi manajemen data lainnya, Anda mungkin ingin memusatkan pengetahuan tentang Backbone hanya di sebagian kecil kode.

Salah satu solusi untuk ini adalah untuk mengekstrak atribut model sebagai data polos setiap kali terjadi perubahan, dan menjaga logika ini pada satu tempat. Berikut ini adalah _[higher-order component](/docs/higher-order-components.html)_ yang mengekstrak seluruh atribut dari sebuah model Backbone pada *state*, mengoper data pada komponen yang dibungkus.

Dengan ini, hanya *higher-order component* yang perlu tahu tentang model internal Backbone, dan sebagian besar komponen di aplikasi dapat tetap terpisah dari Backbone.

Pada contoh dibawah ini, kita akan membuat sebuah salinan dari atribut model untuk membentuk *state* awal. Kita berlangganan pada *event* `change` (dan berhenti berlangganan saat sedang melakukan *unmount*), dan saat itu terjadi, kita ubah *state* dengan atribut model saat ini. Akhirnya, kita pastikan jika _prop_ `model` itu sendiri berubah, kita tidak lupa untuk berhenti berlangganan dari model yang lama, dan berlangganan pada model yang baru.

Catat bahwa contoh ini tidak dimaksudkan sebagai contoh yang menyeluruh untuk bekerja dengan Backbone. Tapi ini seharusnya memberi Anda sebuah gagasan tentang bagaimana cara mendekatinya dengan cara yang umum:

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
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Example model={model} />);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/PmWwwa?editors=0010)

Teknik ini tidak terbatas pada Backbone. Anda dapat menggunakan React dengan *library* model apapun dengan berlangganan pada perubahannya di metode *lifecycle*, dan, secara opsional, menyalin data pada *state* lokal React.
