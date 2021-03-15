---
id: portals
title: Portal
permalink: docs/portals.html
---

Portal menyediakan cara utama untuk me-*render* anak ke dalam simpul DOM yang berada di luar hierarki komponen induk.

```js
ReactDOM.createPortal(child, container)
```

Argumen pertama (`child`) berupa [anak React yang bisa di-*render*](/docs/react-component.html#render), misalnya sebuah elemen, *string*, atau *fragment*. Argumen kedua (`container`) merupakan elemen DOM.

## Penggunaan {#usage}

Umumnya saat Anda mengembalikan sebuah elemen dari *method* *render* komponen, elemen tersebut dipasang ke DOM sebagai anak pada simpul induk terdekat:

```js{4,6}
render() {
  // React memasang div baru dan me-render anaknya kepadanya
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

Akan tetapi terkadang ada gunanya untuk menyisipkan sebuah anak ke lokasi yang berbeda dalam DOM:

```js{6}
render() {
  // React *tidak* membuat div baru. React me-render anak ke dalam `domNode`.
  // `domNode` berupa simpul DOM apa saja yang valid, tidak tergantung pada 
  // lokasinya dalam DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Penggunaan umum untuk portal adalah ketika komponen induk memiliki gaya `overflow: hidden` atau `z-index`, tetapi Anda harus "memisahkan" anak secara visual dari kontainernya. Misalnya pada dialog, *hovercard*, atau *tooltip*.

> Catatan:
>
> Saat bekerja dengan portal, perhatikan bahwa [mengelola fokus papan ketik](/docs/accessibility.html#programmatically-managing-focus) menjadi sangat penting.
>
> Untuk dialog modal, pastikan semua pihak bisa berinteraksi dengannya dengan mengikuti [WAI-ARIA Modal Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal).

[**Coba di CodePen**](https://codepen.io/gaearon/pen/yzMaBd)

## *Event Bubbling* lewat Portal {#event-bubbling-through-portals}

Walau sebuah portal bisa berada di mana saja dalam pohon DOM, portal tersebut berperilaku seperti halnya anak React yang normal. Fitur seperti *context* bekerja sama persis tanpa tergantung apakah sebuah anak adalah sebuah portal, karena portal masih berada dalam *pohon React* tanpa memandang posisinya dalam *pohon DOM*.

Ini mencakup *event bubbling*. Sebuah *event* yang dijalankan dari dalam portal akan dipropagasikan ke induknya dalam *pohon React* yang memuatnya, walau elemen tersebut bukan merupakan induk dalam *pohon DOM*. Misalnya pada struktur HTML berikut:

```html
<html>
  <body>
    <div id="app-root"></div>
    <div id="modal-root"></div>
  </body>
</html>
```

Komponen `Parent` pada `#app-root` akan bisa menangkap *event bubbling* yang belum ditangkap dari simpul sederajat `#modal-root`.

```js{28-31,42-49,53,61-63,70-71,74}
// Kedua kontainer berikut sederajat dalam DOM
const appRoot = document.getElementById('app-root');
const modalRoot = document.getElementById('modal-root');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    // Elemen portal disisipkan dalam pohon DOM setelah
    // anak dari Modal dipasang, yang berarti anak tersebut
    // akan dipasang pada simpul DOM yang terpisah. Jika 
    // komponen anak harus disematkan ke dalam pohon DOM
    // segera setelah dipasang, misalnya untuk mengukur dimensi
    // simpul DOM, atau menggunakan 'autoFocus' pada turunannya, 
    // tambahkan state pada Modal dan hanya render para anak saat
    // Modal disisipkan dalam pohon DOM.
    modalRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    );
  }
}

class Parent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {clicks: 0};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // Ini akan dijalankan ketika tombol pada Child diklik,
    // memperbarui state Parent, walau tombol tersebut
    // bukan turunan langsung dalam DOM.
    this.setState(state => ({
      clicks: state.clicks + 1
    }));
  }

  render() {
    return (
      <div onClick={this.handleClick}>
        <p>Jumlah klik: {this.state.clicks}</p>
        <p>
          Buka DevTools browser
          untuk mengamati bahwa tombol
          bukan anak dari div
          pada handler onClick.
        </p>
        <Modal>
          <Child />
        </Modal>
      </div>
    );
  }
}

function Child() {
  // Event klik pada tombol ini akan meluap ke induk,
  // karena tidak ada atribut 'onClick' yang didefinisikan
  return (
    <div className="modal">
      <button>Klik</button>
    </div>
  );
}

ReactDOM.render(<Parent />, appRoot);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/jGBWpE)

Menangkap *event bubbling* yang meluap dari portal pada komponen induk mengizinkan pengembangan abstraksi yang lebih fleksibel yang tidak mengandalkan portal. Misalnya jika Anda me-*render* komponen `<Modal />`, induk bisa menangkap *event*-nya tanpa tergantung apakah diimplementasikan dengan portal atau tidak.
