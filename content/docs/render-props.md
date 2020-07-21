---
id: render-props
title: Render Props
permalink: docs/render-props.html
---

Istilah ["_render props_"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce) merujuk kepada sebuah teknik untuk berbagi kode antara komponen React menggunakan suatu prop yang nilainya merupakan suatu fungsi.

Sebuah komponen dengan _render props_ mengambil suatu fungsi yang mengembalikan suatu elemen React dan memanggilnya alih-alih mengimplementasikan logika _render_-nya sendiri

```jsx
<DataProvider render={data => (
  <h1>Halo {data.target}</h1>
)}/>
```

_Library_ yang menggunakan _render props_ termasuk [React Router](https://reacttraining.com/react-router/web/api/Route/Route-render-methods) dan [Downshift](https://github.com/paypal/downshift).

Pada dokumen ini kita akan mendiskusikan mengapa _render props_ berguna serta bagaimana cara menulisnya.

## Gunakan _Render Props_ untuk _*Urusan Lintas-Sektoral*_ {#use-render-props-for-cross-cutting-concerns}

Komponen merupakan unit utama dari penggunaan kembali kode di React, namun tidak selalu jelas bagaimana membagikan _state_ atau perilaku tertentu yang dimiliki suatu komponen ke komponen lainnya yang membutuhkan _state_ yang sama itu.

Sebagai contoh, komponen berikut ini mengikuti posisi tetikus di suatu aplikasi _web_:

```js
class MouseTracker extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100%' }} onMouseMove={this.handleMouseMove}>
        <h1>Gerak-gerakkan tetikus!</h1>
        <p>Posisi tetikus saat ini adalah ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}
```

Ketika kursor bergerak di layar, komponen menampilkan koordinat (x, y) dari kursor di sebuah `<p>`.

Kemudian muncul pertanyaan: Bagaimana kita bisa menggunakan kembali perilaku ini pada komponen lainnya? Dengan kata lain, apabila ada komponen lain yang membutuhkan informasi tentang posisi kursor, dapatkah kita mengenkapsulasi perilaku ini sehingga kita dapat dengan mudah membagikan informasi posisi kursor kepada komponen tersebut?

Karena komponen merupakan unit dasar penggunaan kembali kode di React, mari kita coba menyusun ulang kode sebelumnya sedikit untuk menggunakan komponen `<Mouse>` yang mengenkapsulasi perilaku yang perlu kita gunakan di tempat lain.

```js
// The <Mouse> component encapsulates the behavior we need...
class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/* ... namun bagaimana kita me-render sesuatu yang lain selain <p>? */}
        <p>Posisi tetikus saat ini adalah ({this.state.x}, {this.state.y})</p>
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Gerak-gerakkan tetikus!</h1>
        <Mouse />
      </>
    );
  }
}
```

Sekarang komponen `<Mouse>` telah mengenkapsulasi semua perilaku yang terkait dengan mendengar pada _event_ `mousemove` serta menyimpan posisi (x, y) dari kursor, namun hasil ini belum benar-benar dapat digunakan kembali di tempat lain (_reusable_).

Sebagai contoh, anggap kita memiliki sebuah komponen `<Cat>` yang me-_render_ gambar kucing sedang mengejar tetikus di layar. Kita dapat menggunakan props `<Cat mouse={{ x, y }}>` untuk memberitahu koordinat tetikus kepada komponen tersebut sehingga ia mengetahui di mana harus memposisikan gambar di layar.

Sebagai usaha pertama, Anda bisa mencoba me-_render_ `<Cat>` *di dalam metode `render` milik `<Mouse>`*, seperti ini:

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class MouseWithCat extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
         Kita bisa saja hanya menukar <p> dengan <Cat> di sini ... tapi
         kita akan harus membuat komponen lain <MouseWithSomethingElse>
         setiap kali kita perlu menggunakannya, sehingga komponen <MouseWithCat>
         belum benar-benar bisa dikatakan reusable (dapat digunakan kembali).
        */}
        <Cat mouse={this.state} />
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Gerak-gerakkan tetikus!</h1>
        <MouseWithCat />
      </div>
    );
  }
}
```

Pendekatan ini akan bekerja untuk kasus penggunaan ini secara spesifik, namun kita belum berhasil mencapai tujuan untuk benar-benar mengenkapsulasi perilaku yang kita inginkan (melacak posisi kursor) agar dapat dengan mudah digunakan kembali. Sekarang, setiap kali kita ingin mengetahui posisi kursor untuk kasus penggunaan yang lain, kita masih harus membuat sebuah komponen baru (dengan kata lain, komponen  `<MouseWithCat>` lainnya) yang me-_render_ sesuatu secara spesifik untuk kasus tersebut.

Di sinilah _render props_ bisa digunakan: alih-alih menuliskan sebuah `<Cat>` di dalam sebuah komponen '<Mouse>', dan secara efektif mengubah hasil _render_ nya, kita dapat memberikan `<Mouse>` sebuah props berupa suatu fungsi yang digunakan untuk menentukan secara dinamis apa yang akan di-_render_ - sebuah _render props_.

```js
class Cat extends React.Component {
  render() {
    const mouse = this.props.mouse;
    return (
      <img src="/cat.jpg" style={{ position: 'absolute', left: mouse.x, top: mouse.y }} />
    );
  }
}

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  render() {
    return (
      <div style={{ height: '100vh' }} onMouseMove={this.handleMouseMove}>

        {/*
          Instead of providing a static representation of what <Mouse> renders,
          use the `render` prop to dynamically determine what to render.
          Alih-alih memberikan representasi statis dari apa yang di _render_ oleh <Mouse>, gunakan prop `render` untuk secara dinamis menentukan apa yang seharusnya di _render_.
        */}
        {this.props.render(this.state)}
      </div>
    );
  }
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Gerak-gerakkan tetikus!</h1>
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dengan begini, alih-alih mengkloning komponen `<Mouse>` dan menulis secara eksplisit sesuatu yang berbeda di dalam metode `render` untuk setiap kasus penggunaan, kita memberikan suatu props `render` kepada komponen `<Mouse>` yang dapat digunakan untuk menentukan apa yang harus di-_render_ secara dinamis.

Secara lebih konkrit, **sebuah _render props_ adalah suatu _prop_ berupa sebuah fungsi yang digunakan suatu komponen untuk mengetahui apa yang harus ia _render_.**

Teknik ini membuat perilaku yang perlu kita bagikan menjadi amat portabel. Untuk mendapatkan perilaku tersebut, _render_-lah sebuah `<Mouse>` dengan sebuah _props_ `render` yang memberitahunya apa yang harus di-_render_ dengan posisi (x, y) kursor saat ini.

Satu hal menarik tentang _render props_ adalah bahwa Anda dapat mengimplementasikan kebanyakan [komponen tingkat tinggi/higher-order components](/docs/higher-order-components.html) (HOC) menggunakan komponen biasa dengan sebuah _render props_. Sebagai contoh, jika Anda lebih memilih untuk memiliki sebuah HOC `withMouse` daripada komponen `<Mouse>`, Anda dapat dengan mudah membuatnya menggunakan komponen `<Mouse>` biasa dengan suatu _render props_:

```js
// Jika Anda benar-benar ingin menggunakan HOC untuk alasan tertentu, Anda dapat dengan mudah
// membuatnya menggunakan komponen biasa dengan sebuah _render prop_!
function withMouse(Component) {
  return class extends React.Component {
    render() {
      return (
        <Mouse render={mouse => (
          <Component {...this.props} mouse={mouse} />
        )}/>
      );
    }
  }
}
```

Menggunakan _render props_ membuat pola manapun mungkin digunakan.

## Menggunakan Props Selain `render` {#using-props-other-than-render}

Penting untuk diingat bahwa meskipun pola ini disebut "_render props_" bukan berarti Anda *harus menggunakan* props *dengan nama `render` untuk menggunakannya.* Sebaliknya, [_props_ *apapun* yang merupakan sebuah fungsi yang digunakan oleh komponen untuk mengetahui apa yang harus di-_render_ secara teknis merupakan sebuah "_render prop_"](https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce).

Meskipun contoh-contoh di atas menggunakan kata kunci `render`, kita dapat dengan sama mudahnya menggunakan props `children`!

```js
<Mouse children={mouse => (
  <p>Posisi tetikus ada di {mouse.x}, {mouse.y}</p>
)}/>
```

Dan ingat, props `children` sesungguhnya tidak perlu disebutkan secara eksplisit sebagai daftar "atribut" di elemen JSX Anda. Malah, Anda dapat meletakkanya secara langsung *di dalam* suatu elemen!

```js
<Mouse>
  {mouse => (
    <p>Posisi kursor saat ini ada di {mouse.x}, {mouse.y}</p>
  )}
</Mouse>
```

Anda akan melihat teknik ini digunakan di API [react-motion](https://github.com/chenglou/react-motion).

Karena teknik ini sedikit tidak biasa, Anda mungkin ingin menyatakan secara eksplisit bahwa props `children` haruslah suatu fungsi pada `propTypes` Anda ketika mendesain suatu API seperti ini.

```js
Mouse.propTypes = {
  children: PropTypes.func.isRequired
};
```
## Peringatan {#caveats}

### Berhati-hatilah ketika menggunakan Render Props dengan React.PureComponent {#be-careful-when-using-render-props-with-reactpurecomponent}

Menggunakan sebuah _render props_ dapat menghilangkan keuntungan yang didapatkan dengan menggunakan [`React.PureComponent`](/docs/react-api.html#reactpurecomponent) jika Anda membuat fungsi di dalam metode `render`. Hal ini disebabkan karena perbandingan _props_ yang dangkal (_shallow prop comparison_) pada PureComponent akan selalu mengembalikan nilai `false` untuk props baru, dan setiap `render` dalam kasus ini akan menghasilkan nilai baru untuk _render props_.

Sebagai contoh, melanjutkan dengan komponen `<Mouse>` dari pembahasan di atas, jika `Mouse` meng-_extend_ `React.PureComponent` alih-alih `React.Component`, contoh kita akan menjadi seperti berikut:

```js
class Mouse extends React.PureComponent {
  // Same implementation as above...
}

class MouseTracker extends React.Component {
  render() {
    return (
      <div>
        <h1>Gerak-gerakkan tetikus!</h1>

        {/*
          Ini tidak baik! Nilai dari prop `render`
          akan selalu berbeda pada setiap render.
        */}
        <Mouse render={mouse => (
          <Cat mouse={mouse} />
        )}/>
      </div>
    );
  }
}
```

Dalam contoh ini, setiap kali `<MouseTracker>` di-_render_, ia akan menghasilkan sebuah fungsi baru sebagai nilai dari _props_ `<Mouse render>`, sehingga menghilangkan efek `<Mouse>` yang meng-_extend_ `React.PureComponent` sejak awal!

Untuk mengatasi permasalahan ini, Anda sesekali dapat mendefinisikan _props_ ini sebagai _instance_ dari sebuah metode, seperti contoh berikut:

```js
class MouseTracker extends React.Component {
  // Defined as an instance method, `this.renderTheCat` always
  // refers to *same* function when we use it in render
  // Didefinisikan sebagai *instance* dari metode, `this.renderTheCat` selalu
  // merujuk kepada fungsi yang *sama* ketika kita menggunakannya di render
  renderTheCat(mouse) {
    return <Cat mouse={mouse} />;
  }

  render() {
    return (
      <div>
        <h1>Gerak-gerakkan tetikus!</h1>
        <Mouse render={this.renderTheCat} />
      </div>
    );
  }
}
```

Pada kasus-kasus di mana Anda tidak dapat mendefinisikan _props_ secara statis (misalnya karena Anda harus menutup _props_ dan/atau _state_ dari komponen tertentu) `<Mouse>` seharusnya meng-_extend_ `React.Component` saja.
