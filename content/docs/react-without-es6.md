---
id: react-without-es6
title: React Tanpa ES6
permalink: docs/react-without-es6.html
prev: optimizing-performance.html
next: react-without-jsx.html
---

Umumnya Anda mendefinisikan komponen React sebagai kelas JavaScript biasa:

```javascript
class Greeting extends React.Component {
  render() {
    return <h1>Halo {this.props.name}</h1>;
  }
}
```

Jika Anda belum menggunakan ES6, Anda bisa menggunakan modul `create-react-class`:


```javascript
var createReactClass = require('create-react-class');
var Greeting = createReactClass({
  render: function() {
    return <h1>Halo {this.props.name}</h1>;
  }
});
```

API untuk kelas ES6 mirip dengan `createReactClass()`, dengan beberapa pengecualian.

## Mendeklarasikan *Props* *Default* {#declaring-default-props}

Dengan kelas dan fungsi ES6, `defaultProps` didefinisikan sebagai properti komponennya sendiri:

```javascript
class Greeting extends React.Component {
  // ...
}

Greeting.defaultProps = {
  name: 'Maria'
};
```

Dengan `createReactClass()`, Anda harus mendefinisikan `getDefaultProps()` sebagai fungsi pada objek yang dioperkan:

```javascript
var Greeting = createReactClass({
  getDefaultProps: function() {
    return {
      name: 'Maria'
    };
  },

  // ...

});
```

## Menyetel *State* Awal {#setting-the-initial-state}

Pada kelas ES6, Anda bisa mendefinisikan *state* awal dengan menetapkan `this.state` pada konstruktor:

```javascript
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.initialCount};
  }
  // ...
}
```

Dengan `createReactClass()`, Anda harus menyediakan *method* `getInitialState` terpisah yang mengembalikan *state* awal:

```javascript
var Counter = createReactClass({
  getInitialState: function() {
    return {count: this.props.initialCount};
  },
  // ...
});
```

## *Autobinding* {#autobinding}

Pada komponen React yang dideklarasikan sebagai kelas ES6, *method* mengikuti semantik yang sama seperti kelas ES6 reguler. Ini berarti *method* tersebut tidak secara otomatis mem-*bind* `this` kepada *instance*. Anda harus secara eksplisit menggunakan `.bind(this)` pada konstruktor:

```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Halo!'};
    // Baris berikut penting!
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.message);
  }

  render() {
    // Karena `this.handleClick` telah di-bind, kita bisa menggunakannya
    // sebagai event handler.
    return (
      <button onClick={this.handleClick}>
        Ucapkan halo
      </button>
    );
  }
}
```

Dengan `createReactClass()`, hal tersebut tidak diperlukan karena semua *method* akan di-*bind*:

```javascript
var SayHello = createReactClass({
  getInitialState: function() {
    return {message: 'Halo!'};
  },

  handleClick: function() {
    alert(this.state.message);
  },

  render: function() {
    return (
      <button onClick={this.handleClick}>
        Ucapkan halo
      </button>
    );
  }
});
```

Ini berarti penulisan dengan kelas ES6 disertai dengan kode *boilerplate* untuk *event handler* tetapi manfaatnya adalah kinerja yang sedikit lebih baik dalam aplikasi yang besar.

Jika kode *boilerplate* sangat tidak menarik bagi Anda, Anda bisa mengaktifkan sintaksis [*Class Property*](https://babeljs.io/docs/plugins/transform-class-properties/) yang bersifat **eksperimental** dengan Babel:


```javascript
class SayHello extends React.Component {
  constructor(props) {
    super(props);
    this.state = {message: 'Halo!'};
  }
  // PERINGATAN: sintaksis ini bersifat eksperimental!
  // Menggunakan *arrow* akan mem-bind method:
  handleClick = () => {
    alert(this.state.message);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Ucapkan halo
      </button>
    );
  }
}
```

Perhatikan bahwa sintaksis di atas bersifat **eksperimental** dan sintaksis mungkin akan berubah, atau proposal ini tidak akan disertakan dalam bahasa.

Jika Anda ingin bermain pada area yang aman, Anda memiliki beberapa opsi:

* Mem-*bind* *method* dalam konstruktor.
* Gunakan *arrow function*, misalnya `onClick={(e) => this.handleClick(e)}`.
* Terus gunakan `createReactClass`.

## Mixin {#mixins}

>**Catatan:**
>
>ES6 diluncurkan tanpa adanya dukungan *mixin*. Oleh sebab itu, tidak ada dukungan untuk *mixin* saat Anda menggunakan React dengan kelas ES6.
>
>**Kami juga menemukan banyak masalah pada basis kode yang menggunakan *mixin*, [dan tidak menyarankan untuk menggunakannya untuk kode yang baru](/blog/2016/07/13/mixins-considered-harmful.html).**
>
>Bagian berikut hanya digunakan untuk rujukan.

Terkadang komponen yang sangat berbeda bisa berbagi fungsionalitas yang sama. Hal ini terkadang disebut sebagai [*cross-cutting concern*](https://en.wikipedia.org/wiki/Cross-cutting_concern). `createReactClass` memungkinkan Anda untuk menggunakan sistem `mixin` yang bersifat *legacy* untuk hal tersebut.

Salah satu kasus penggunaan yang umum adalah sebuah komponen ingin memperbarui dirinya sendiri secara periodik. Sangat mudah untuk menggunakan `setInterval()`, tetapi sangat penting untuk membatalkan interval jika Anda tidak membutuhkannya lagi untuk menghemat memori. React menyediakan [*lifecycle method*](/docs/react-component.html#the-component-lifecycle) yang bisa memberi tahu Anda kapan komponen akan diciptakan atau dihancurkan. Sebagai contoh, mari kita buat *mixin* yang sederhana yang menggunakan *method* berikut untuk menyediakan fungsi `setInterval()` yang mudah, yang akan dibersihkan secara otomatis ketika komponen Anda dihancurkan.

```javascript
var SetIntervalMixin = {
  componentWillMount: function() {
    this.intervals = [];
  },
  setInterval: function() {
    this.intervals.push(setInterval.apply(null, arguments));
  },
  componentWillUnmount: function() {
    this.intervals.forEach(clearInterval);
  }
};

var createReactClass = require('create-react-class');

var TickTock = createReactClass({
  mixins: [SetIntervalMixin], // Gunakan mixin
  getInitialState: function() {
    return {seconds: 0};
  },
  componentDidMount: function() {
    this.setInterval(this.tick, 1000); // Panggil method pada mixin
  },
  tick: function() {
    this.setState({seconds: this.state.seconds + 1});
  },
  render: function() {
    return (
      <p>
        React telah berjalan selama {this.state.seconds} detik.
      </p>
    );
  }
});

ReactDOM.render(
  <TickTock />,
  document.getElementById('example')
);
```

Jika komponen menggunakan beberapa *mixin* dan beberapa *mixin* mendefinisikan *lifecycle method* yang sama (contohnya, beberapa *mixin* ingin melakukan pembersihan ketika komponen dihancurkan), semua *lifecycle method* dijamin untuk dipanggil. *Method* yang didefinisikan pada *mixin* dijalankan secara berurutan sesuai dengan dengan proses pendaftarannya, diikuti dengan pemanggilan *method* pada komponen.
