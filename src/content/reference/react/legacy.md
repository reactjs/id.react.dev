---
title: "API React Lama"
---

<Intro>

API ini diekspor dari paket `react`, tapi tidak disarankan untuk digunakan dalam kode yang baru ditulis. Lihat halaman API individual tertaut untuk alternatif yang disarankan.

</Intro>

---

<<<<<<< HEAD
## API Lama {/*legacy-apis*/}

* [`Children`](/reference/react/Children) memungkinkan Anda memanipulasi dan mengubah JSX yang diterima sebagai *prop* `children`. [Lihat alternatif.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) memungkinkan Anda membuat elemen React menggunakan elemen lain sebagai titik awal. [Lihat alternatif.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) memungkinkan Anda mendefinisikan komponen React sebagai kelas JavaScript. [Lihat alternatif.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) memungkinkan Anda membuat elemen React. Biasanya Anda akan menggunakan JSX sebagai gantinya.
* [`createRef`](/reference/react/createRef) membuat objek ref yang dapat berisi nilai arbiter. [Lihat alternatif.](/reference/react/createRef#alternatives)
* [`isValidElement`](/reference/react/isValidElement) memeriksa apakah suatu nilai adalah elemen React. Biasanya digunakan dengan [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) mirip dengan [`Component`,](/reference/react/Component) tetapi melewatkan render ulang dengan `props` yang sama. [Lihat alternatif.](/reference/react/PureComponent#alternatives)

---

## API yang tidak digunakan lagi {/*deprecated-apis*/}
=======
## Legacy APIs {/*legacy-apis*/}

* [`Children`](/reference/react/Children) lets you manipulate and transform the JSX received as the `children` prop. [See alternatives.](/reference/react/Children#alternatives)
* [`cloneElement`](/reference/react/cloneElement) lets you create a React element using another element as a starting point. [See alternatives.](/reference/react/cloneElement#alternatives)
* [`Component`](/reference/react/Component) lets you define a React component as a JavaScript class. [See alternatives.](/reference/react/Component#alternatives)
* [`createElement`](/reference/react/createElement) lets you create a React element. Typically, you'll use JSX instead.
* [`createRef`](/reference/react/createRef) creates a ref object which can contain arbitrary value. [See alternatives.](/reference/react/createRef#alternatives)
* [`forwardRef`](/reference/react/forwardRef) lets your component expose a DOM node to parent component with a [ref.](/learn/manipulating-the-dom-with-refs)
* [`isValidElement`](/reference/react/isValidElement) checks whether a value is a React element. Typically used with [`cloneElement`.](/reference/react/cloneElement)
* [`PureComponent`](/reference/react/PureComponent) is similar to [`Component`,](/reference/react/Component) but it skip re-renders with same props. [See alternatives.](/reference/react/PureComponent#alternatives)

---

## Removed APIs {/*removed-apis*/}
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80

These APIs were removed in React 19:

<<<<<<< HEAD
API-API ini akan dihapus di versi mayor React yang akan datang.

</Deprecated>

* [`createFactory`](/reference/react/createFactory) memungkinkan Anda membuat fungsi yang menghasilkan elemen React dari tipe tertentu.
=======
* [`createFactory`](https://18.react.dev/reference/react/createFactory): use JSX instead.
* Class Components: [`static contextTypes`](https://18.react.dev//reference/react/Component#static-contexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static childContextTypes`](https://18.react.dev//reference/react/Component#static-childcontexttypes): use [`static contextType`](#static-contexttype) instead.
* Class Components: [`static getChildContext`](https://18.react.dev//reference/react/Component#getchildcontext): use [`Context.Provider`](/reference/react/createContext#provider) instead.
* Class Components: [`static propTypes`](https://18.react.dev//reference/react/Component#static-proptypes): use a type system like [TypeScript](https://www.typescriptlang.org/) instead.
* Class Components: [`this.refs`](https://18.react.dev//reference/react/Component#refs): use [`createRef`](/reference/react/createRef) instead.
>>>>>>> 9000e6e003854846c4ce5027703b5ce6f81aad80
