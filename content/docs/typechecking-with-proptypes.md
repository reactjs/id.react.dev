---
id: typechecking-with-proptypes
title: Pengecekan Tipe Dengan PropTypes
permalink: docs/typechecking-with-proptypes.html
redirect_from:
  - "docs/react-api.html#typechecking-with-proptypes"
---

> Note:
>
> `React.PropTypes` sudah dipindahkan ke paket yang berbeda sejak React v15.5. Silakan gunakan [pustaka `prop-types`](https://www.npmjs.com/package/prop-types).
>
>Kami menyediakan [*codemod script*](/blog/2017/04/07/react-v15.5.0.html#migrating-from-reactproptypes) untuk melakukan konversi secara otomatis.

Dengan berkembangnya aplikasi Anda, kit dapat menemukan banyak kesalahan atau *bugs* dengan pengecekan tipe. Untuk beberapa aplikasi, Anda dapat menggunakan ekstensi JavaScript seperti [Flow](https://flow.org/) atau [TypeScript](https://www.typescriptlang.org/) untuk melakukan pengecekan tipe di aplikasi secara menyeluruh. Meskipun Anda tidak menggunakannya, React memiliki kemampuan pengecekan tipe. Untuk menjalankan pengecekan terhadap *props* disebuah komponen, Anda dapat menggunakan properti khusus `propTypes`:

```javascript
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.propTypes = {
  name: PropTypes.string
};
```

<<<<<<< HEAD
Dalam contoh ini, kita menggunakan *class component*, tapi fungsionalitas yang sama dapat juga diterapkan kepada *function component*, atau komponen yang dibuat dengan [`React.memo`](https://id.reactjs.org/docs/react-api.html#reactmemo) atau [`React.forwardRef`](https://id.reactjs.org/docs/react-api.html#reactforwardref).
=======
In this example, we are using a class component, but the same functionality could also be applied to function components, or components created by [`React.memo`](/docs/react-api.html#reactmemo) or [`React.forwardRef`](/docs/react-api.html#reactforwardref).
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3

`PropTypes` mengirimkan berbagai jenis *validator* yang dapat digunakan untuk memastikan bahwa data yang diterima valid. Contoh diatas, Anda menggunakan `PropTypes.string`. Ketika nilai yang dikirimkan untuk sebuah *prop* keliru, sebuah peringatan akan muncul di konsol JavaScript. Untuk alasan performa, `propTypes` hanya melakukan pengecekan di mode pengembangan atau *development*.

### PropTypes {#proptypes}

Berikut contoh mendokumentasikan berbagai validator yang berbeda yang sudah disediakan:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // Anda dapat menyatakan bahwa sebuah prop adalah tipe khusus yang berasal dari JS. Secara default,
  // hal ini sifatnya opsional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Apapun dapat di-render: numbers, strings, elements ataupun sebuah array
  // (atau fragmen) yang mengandung tipe-tipe tersebut.
  optionalNode: PropTypes.node,

  // Sebuah elemen React.
  optionalElement: PropTypes.element,

  // Sebuah tipe elemen React. (contoh: MyComponent).
  optionalElementType: PropTypes.elementType,

<<<<<<< HEAD
  // Anda dapat juga menyatakan bahwa sebuah prop adalah instance dari sebuah kelas. Ini menggunakan
  // operator instanceof dari JS.
=======
  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3
  optionalMessage: PropTypes.instanceOf(Message),

  // Anda dapat memastikan bahwa prop Anda dibatasi khusus untuk nilai tertentu dengan memperlakukan
  // sebagai sebuah enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // Sebuah objek dapat memiliki satu dari banyak tipe-tipe.
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // Sebuah array dari tipe tertentu.
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // Sebuah objek dengan nilai properti dari tipe tertentu.
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // Sebuah objek yang menerima bentuk tertentu.
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

<<<<<<< HEAD
  // Sebuah objek dengan peringatan pada properti ekstra.
=======
  // An object with warnings on extra properties
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3
  optionalObjectWithStrictShape: PropTypes.exact({
    name: PropTypes.string,
    quantity: PropTypes.number
  }),

  // Anda dapat merangkai dari contoh diatas dengan `isRequired` untuk memastikan sebuah peringatan
  // akan muncul jika sebuah prop tidak disertakan.
  requiredFunc: PropTypes.func.isRequired,

<<<<<<< HEAD
  // Sebuah nilai dari tipe data apapun.
=======
  // A required value of any data type
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3
  requiredAny: PropTypes.any.isRequired,

  // Anda dapat juga menentukan validator khusus. Akan menghasilkan objek Error
  // jika validasi gagal. Jangan `console.warn` atau `throw`, hal seperti ini
  // tidak akan berfungsi jika didalam `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // Anda dapat juga menyediakan sebuah validator tambahan ke `arrayOf` dan `objectOf`.
  // Hal ini sebaiknya menghasilkan objek Error jika validasi gagal. Validator
  // akan dipanggil untuk setiap nilai didalam array atau objek. Dua pertama
  // dari argumen validator adalah array atau objek itu sendiri, dan
  // identitas dari nilai saat itu.
  customArrayProp: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  })
};
```

### Membutuhkan Satu Komponen Anak {#requiring-single-child}

Dengan menggunakan `PropTypes.element` Anda dapat menentukan bahwa hanya menerima satu komponen anak yang dapat dikirimkan ke komponen lain.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // Harus memiliki hanya satu elemen atau akan diberi peringatan.
    const children = this.props.children;
    return (
      <div>
        {children}
      </div>
    );
  }
}

MyComponent.propTypes = {
  children: PropTypes.element.isRequired
};
```

### Nilai Default Prop {#default-prop-values}

Anda dapat mendefinisikan nilai *default* untuk `props` dengan menambahkan properti khusus `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Menentukan nilai default dari props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Render "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

<<<<<<< HEAD
Jika Anda menggunakan alat transformasi Babel seperti [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , Anda dapat mendeklarasikan `defaultProps` sebagai properti *static* dalam komponen kelas React. Sintaks ini belum final dan akan membutuhkan tahapan kompilasi untuk berjalan di browser. Informasi lebih lanjut, silakan lihat [proposal class fields](https://github.com/tc39/proposal-class-fields).
=======
If you are using a Babel transform like [plugin-proposal-class-properties](https://babeljs.io/docs/en/babel-plugin-proposal-class-properties/) (previously _plugin-transform-class-properties_), you can also declare `defaultProps` as static property within a React component class. This syntax has not yet been finalized though and will require a compilation step to work within a browser. For more information, see the [class fields proposal](https://github.com/tc39/proposal-class-fields).
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3

```javascript
class Greeting extends React.Component {
  static defaultProps = {
    name: 'stranger'
  }

  render() {
    return (
      <div>Hello, {this.props.name}</div>
    )
  }
}
```

<<<<<<< HEAD
Properti `defaultProps` akan digunakan untuk memastikan bahwa `this.props.name` akan memiliki sebuah nilai jika tidak ada nilai yang diberikan oleh komponen induknya. Proses pengecekan tipe `propTypes` akan dijalankan setelah `defaultProps` berjalan, sehingga proses pengecekan tipe juga akan berlaku untuk `defaultProps`.
=======
The `defaultProps` will be used to ensure that `this.props.name` will have a value if it was not specified by the parent component. The `propTypes` typechecking happens after `defaultProps` are resolved, so typechecking will also apply to the `defaultProps`.

### Function Components {#function-components}

If you are using function components in your regular development, you may want to make some small changes to allow PropTypes to be properly applied.

Let's say you have a component like this:

```javascript
export default function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}
```

To add PropTypes, you may want to declare the component in a separate function before exporting, like this:

```javascript
function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

export default HelloWorldComponent
```

Then, you can add PropTypes directly to the `HelloWorldComponent`:

```javascript
import PropTypes from 'prop-types'

function HelloWorldComponent({ name }) {
  return (
    <div>Hello, {name}</div>
  )
}

HelloWorldComponent.propTypes = {
  name: PropTypes.string
}

export default HelloWorldComponent
```
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3
