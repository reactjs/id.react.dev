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

Dengan berkembangnya aplikasi kita, kit dapat menemukan banyak kesalahan atau *bugs* dengan pengecekan tipe. Untuk beberapa aplikasi, kita dapat menggunakan ekstensi JavaScript seperti [Flow](https://flow.org/) atau [TypeScript](https://www.typescriptlang.org/) untuk melakukan pengecekan tipe di aplikasi secara menyeluruh. Meskipun kamu tidak menggunakannya, React memiliki kemampuan pengecekan tipe. Untuk menjalankan pengecekan terhadap *props* disebuah komponen, kamu dapat menggunakan properti khusus `propTypes`:

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

`PropTypes` mengirimkan berbagai jenis validator yang dapat digunakan untuk memastikan bahwa data yang diterima valid. Contoh diatas, kita menggunakan `PropTypes.string`. Ketika nilai yang dikirimkan untuk sebuah *prop* keliru, sebuah peringatan akan muncul di konsol JavaScript. Untuk alasan performa, `propTypes` hanya melakukan pengecekan di mode pengembangan atau *development*.

### PropTypes {#proptypes}

Berikut contoh mendokumentasikan berbagai validator yang berbeda yang sudah disediakan:

```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  // You can declare that a prop is a specific JS type. By default, these
  // are all optional.
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalMessage: PropTypes.instanceOf(Message),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(['News', 'Photos']),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Message)
  ]),

  // An array of a certain type
  optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

  // An object with property values of a certain type
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectWithShape: PropTypes.shape({
    color: PropTypes.string,
    fontSize: PropTypes.number
  }),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function(props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      );
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
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

Dengan menggunakan `PropTypes.element` kita dapat menentukan hanya menerima satu komponen anak yang dapat dikirimkan ke komponen lain.

```javascript
import PropTypes from 'prop-types';

class MyComponent extends React.Component {
  render() {
    // This must be exactly one element or it will warn.
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

### Nilai Prop Default {#default-prop-values}

Kita dapat mendefinisikan nilai default untuk `props` dengan menambahkan properti khusus `defaultProps`:

```javascript
class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

// Specifies the default values for props:
Greeting.defaultProps = {
  name: 'Stranger'
};

// Renders "Hello, Stranger":
ReactDOM.render(
  <Greeting />,
  document.getElementById('example')
);
```

Jika kamu menggunakan alat transformasi Babel seperti [transform-class-properties](https://babeljs.io/docs/plugins/transform-class-properties/) , kamu dapat mendeklarasikan `defaultProps` sebagai properti tidak bergerak dalam komponen kelas React. Sintaks ini belum final dan akan membutuhkan tahapan kompilasi untuk berjalan di browser. Informasi lebih lanjut, silakan lihat [proposal class fields](https://github.com/tc39/proposal-class-fields).

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

Properti `defaultProps` akan digunakan untuk memastikan bahwa `this.props.name` akan memiliki sebuah nilai jika tidak ada nilai yang diberikan oleh komponen induknya. Proses pengecekan tipe `propTypes` akan dijalankan setelah `defaultProps` berjalan, sehingga proses pengecekan tipe juga akan berlaku untuk `defaultProps`.
