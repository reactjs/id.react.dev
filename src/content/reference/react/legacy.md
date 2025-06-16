---
title: "API React Lama"
---

<Intro>

API ini diekspor dari paket `react`, tapi tidak disarankan untuk digunakan dalam kode yang baru ditulis. Lihat halaman API individual tertaut untuk alternatif yang disarankan.

</Intro>

---

## API Lama {/*legacy-apis*/}

* [`Children`](/reference/react/Children) memungkinkan Anda memanipulasi dan mengubah JSX yang diterima sebagai *prop* `children`. [Lihat alternatif.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) memungkinkan Anda membuat elemen React menggunakan elemen lain sebagai titik awal. [Lihat alternatif.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) memungkinkan Anda mendefinisikan komponen React sebagai kelas JavaScript. [Lihat alternatif.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) memungkinkan Anda membuat elemen React. Biasanya Anda akan menggunakan JSX sebagai gantinya.
* [`createRef`](/reference/react/createRef) membuat objek ref yang dapat berisi nilai arbiter. [Lihat alternatif.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) memungkinkan komponen Anda mengekspos simpul DOM ke komponen induk dengan [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) memeriksa apakah suatu nilai adalah elemen React. Biasanya digunakan dengan [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) mirip dengan [`Component`,](/reference/react/Component) tetapi melewatkan render ulang dengan `props` yang sama. [Lihat alternatif.](/reference/react/PureComponent#alternatives)

---

## API Dihapus {/*removed-apis*/}

API berikut dihapus di React 19:

* [`createFactory`](https://18.react.dev/reference/react/createFactory): gunakan JSX.
* *Class Component*: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): gunakan [`static contextType`](#static-contexttype).
* *Class Component*: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): gunakan [`static contextType`](#static-contexttype).
* *Class Component*: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): gunakan [`Context`](/reference/react/createContext#provider).
* *Class Component*: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): gunakan sistem *type* seperti [TypeScript](https://www.typescriptlang.org/).
* *Class Component*: [`this.refs`](https://18.react.dev//reference/react/Component#refs): gunakan [`createRef`](/reference/react/createRef).
