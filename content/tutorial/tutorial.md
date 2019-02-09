---
id: tutorial
title: "Tutorial: Pengantar React"
layout: tutorial
sectionid: tutorial
permalink: tutorial/tutorial.html
redirect_from:
  - "docs/tutorial.html"
  - "docs/why-react.html"
  - "docs/tutorial-ja-JP.html"
  - "docs/tutorial-ko-KR.html"
  - "docs/tutorial-zh-CN.html"
---

Tutorial ini tidak mengasumsikan setiap pengetahuan tentang React yang sudah ada. 

## Sebelum Kita Memulai Tutorial {#before-we-start-the-tutorial}

Kita akan membangun sebuah *game* kecil sepanjang tutorial ini. **Anda bisa jadi tergoda untuk melewati tutorial ini karena Anda membuat *game* bukan pekerjaan utama Anda -- Namun, luangkan waktu untuk mencobanya.** Teknik-teknik yang akan dipelajari pada tutorial ini adalah hal-hal dasar yang digunakan untuk membangun aplikasi React. Dengan menguasai teknik-teknik tersebut, Anda akan memehami React secara mendalam.

>Tips
>
> Tutorial ini didesain untuk orang yang lebih suka **belajar dengan mempraktikan**. Jika Anda lebih suka belajar mempelajari konsep dari bawah ke atas, lihat [panduan langkah demi langkah](/docs/hello-world.html) kami. Anda akan menyadari bahwa tutorial dan panduan akan saling melengkapi.

Tutorial ini akan dibagi ke beberapa bagian:

* [Mempersiapkan Tutorial](#setup-for-the-tutorial) merupakan **titik awal** Anda untuk mengikuti tutorial.
* [Ikhtisar](#overview) bagian ini berisi **hal-hal mendasar** React: komponen, *props*, dan *state*.
* [Menyelesaikan Permainan](#completing-the-game) bagian ini berisi **teknik-teknik yang paling umum** pada pengembangan aplikasi React.
* [Menambahkan Penjelajahan Waktu](#adding-time-travel) bagian ini akan memberikan **wawasan yang mendalam** pada kekuatan unik dari React.

Anda tidak perlu menyelesaikan semua bagian sekaligus untuk mendapatkan pembelajaran dari tutorial ini. Cobalah mengerjakan semampu Anda walaupun hanya satu atau dua bagian.

Tidak masalah jika Anda melakukan *copy*+*paste* kode selama menjalani tutorial. Namun, kami merekomendasikan untuk tetap mengetik ulang. Mengetik ulang akan membantu Anda mengembangkan ingatan otot dan pemahaman yang lebih kuat.

### Apa yang Kita Kembangkan? {#what-are-we-building}

Dalam tutorial ini, kami akan menunjukan cara membuat permainan *tic-tac-toe* interaktif menggunakan React.

Anda dapat melihat gambaran aplikasi yang akan kita buat disini: **[Hasil Akhir](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Jika kode tersebut tidak masuk akal untuk Anda atau Anda tidak akrab dengan sintaks kode tersebut, jangan khawatir! Tujuan dari tutorial ini adalah untuk membantu Anda mengerti React dan sintaksnya.

Kami merekomendasikan Anda untuk mencari tahu tentang permainan *tic-tac-toe* sebelum melanjutkan tutorial ini. Salah satu fitur yang akan Anda lihat adalah adanya daftar bernomor di sebelah kanan *board* permainan. Daftar ini memberikan semua riwayat langkah yang sudah terjadi dalam permainan dan terus diperbarui selama permainan berlangsung.

Anda bisa menutup laman permainan *tic-tac-toe* setelah Anda paham dengan permainan tersebut. Kita akan memulai dari templat sederhana. Langkah selanjutnya adalah mempersiapkan Anda sehingga Anda dapat memulai mengembangkan permainan *tic-tac-toe*.

### Prasyarat {#prerequisites}

Kami mengasumsikan bahwa Anda memiliki pemahaman akan HTML dan JavaScript, namun Anda seharusnya tetap dapat mengikuti tutorial ini jika Anda memiliki pemahaman pada bahasa pemrograman lainnya. Kami juga berasumsi bahwa Anda memiliki pemahaman dengan konsep pemrograman seperti fungsi, object, *array*, dan kelas.

Jika Anda memerlukan ulasan tentang JavaScript, kami merekomendasikan [panduan ini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Perlu diperhatikan juga jika kita menggunakan beberapa fiture dari ES6 -- versi terbaru JavaScript. Di tutorial ini, kita menggunakan *[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)*, [kelas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), *[`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let)*, dan *[`const`]*(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) *statements*. Anda dapat menggunakan [Babel REPL](babel://es5-syntax-example) untuk melihat kode ES6 di-*compile* menjadi apa.

## Mempersiapkan Tutorial {#setup-for-the-tutorial}

Ada dua cara untuk menyelesaikan tutorial ini: Anda dapat menulis kode pada *browser* Anda atau mempersiapan *local development environment* pada komputer Anda.

### Persiapan Cara 1: Menulis Kode pada Browser {#setup-option-1-write-code-in-the-browser}

Ini adalah cara tercepat untuk memulai!

Pertama, buka **[kode permulaan](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** ini pada *tab* baru. *Tab* baru tersebut seharusnya menunjukan *board* permainan *tic-tac-toe* yang kosong dan kode React. Kita akan mengedit kode React tersebut pada tutorial ini.

Anda dapat melewati cara kedua untuk persiapan dan menuju ke bagian [Ikhtisar](#overview) untuk mendapatkan ikhtisar dari React.

### Persiapan Cara 2: Local Development Environment {#setup-option-2-local-development-environment}

Cara ini murni opsional dan tidak wajib pada tutorial ini!

<br>

<details>

<summary><b>Opsional: Instruksi untuk mengikuti secara lokal menggunakan editor teks pilihan Anda</b></summary>

Persiapan ini membutuhkan lebih banyak langkah tetapi membuat Anda dapat menyelesaikan tutorial ini menggunakan editor text pilihan Anda. Berikut adalah beberapa langkah yang harus diikuti:

1. Pastikan Anda sudah meng-*install* [Node.js](https://nodejs.org/en/) versi terbaru.
2. Ikuti [langkah instalasi Create React App](/docs/create-a-new-react-app.html#create-react-app) untuk membuat *project* baru.

```bash
npx create-react-app my-app
```

3. Hapus semua file pada folder `src/` dari *project* baru Anda.

> Catatan: **jangan hapus folder `src`, hanya *file-file* yang ada di dalamnya.** Kita akan menggantikan *file-file* tersebut dengan contoh-contoh yang akan diberikan melalui tutorial ini.

```bash
cd my-app
cd src

# Jika Anda menggunakan Mac atau Linux:
rm -f *

# Atau jika Anda menggunakan Windows:
del *

# Kemudian, kembali ke folder project
cd ..
```

4. Tambahan file bernama `index.css` ke dalam folder `src/` dengan [kode CSS ini](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Tambahkan file bernama `index.js` ke dalam folder `src/` dengan [kode JS ini](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Tambahkan 3 baris kode berikut pada bagian paling atas `index.js` di dalam folder `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Jika Anda menjalankan `npm start` pada folder *project* Anda dan mengakses `http://localhost:3000` pada *browser* Anda, Anda akan melihat *board tic-tac-toe* yang kosong.

Kami merekomendasikan Anda untuk mengikuti [instruksi ini](https://babeljs.io/docs/editors/) untuk mengkonfigurasi *syntax highlighting* untuk editor Anda.

</details>

### Tolong, Saya Memiliki Hambatan! {#help-im-stuck}

Jika Anda memiliki hambatan, silahkan kunjungi [sumber dukungan komunitas](/community/support.html). Secara khusus, [Reactiflux Chat](https://discord.gg/0ZcbPKXt5bZjGY5n) adalah langkah yang baik untuk mendapat bantuan dengan cepat. Jika Anda tidak mendapat jawaban atau tetap memiliki hambatan, maka silahkan mengajukan *issue*. Kami akan membantu Anda.

## Ikhtisar {#overview}

Sekarang karena Anda sudah siap, mari mempelajari ikhtisar dari React!

### Apa Itu React? {#what-is-react}

React adalah *library* JavaScript yang deklaratif, efisien, dan fleksible untuk membangun antarmuka pengguna. React memungkinkan Anda untuk membuat antarmuka kompleks dari kumpulan kode yang kecil dan terisolasi yang disebut "komponen".

React memiliki beberapa jenis komponen, tetapi kita akan memulai dengan subkelas `React.Component`:

```javascript
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Daftar Belanja untuk {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}

// Contoh Penggunaan: <ShoppingList name="Mark" />
```

Kita akan membahas *tag* aneh yang seperti XML sesaat lagi. Kita menggunakan komponen untuk memberi tahu React apa yang ingin kita lihat pada layar. Ketika data kita berubah, React akan memperbarui dan me-*render* ulang komponen kita dengan efisien.

Di sini, ShoppingList adalah **kelas komponen React** atau **tipe komponen React**. Sebuah komponen dapat menerima parameter yang disebut dengan `props` (singkatan dari `properties`) dan mengembalikan sebuah hirarki dari tampilan-tampilan yang akan ditampilkan via *method* `render`.

*Method* `render` mengembalikan sebuah *deskripsi* dari benda yang Anda akan lihat pada layar. React mengambil deskripsi tersebut dan menampilkan hasilnya ke layar. Secara khusus, `render` mengembalikan **elemen React**, yang merupakan deskripsi ringan tentang apa yang harus di-`render`. Kebanyakan React *developer* menggunakan sintaks khusus yang disebut "JSX" yang memudahkan struktur dari React mudah untuk ditulis. Sintaks `<div />` akan diubah menjadi `React.createElement('div')` pada saat *build*. Contoh di atas sama dengan sintaks berikut:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Lihat versi expanded lengkap.](babel://tutorial-expanded-version)

Jika Anda penasaran, `createElement()` dideskripsikan dengan lebih rinci pada bagian [referensi API](/docs/react-api.html#createelement), tetapi kita tidak akan menggunakannya pada tutorial ini. Kita akan tetap menggunakan JSX.

JSX hadir dengan kekuatan penuh dari JavaScript. Anda dapat menulis *setiap* ekspresi JavaScript di antara tanda kurung kurawal di dalam JSX. Setiap elemen React adalah objek JavaScript yang dapat Anda simpan di dalam variabel atau Anda *passing* ke seputar program Anda.

Komponen `ShoppingList` di atas hanya me-*render* komponen DOM *built-in* seperti `<div />` dan `<li />`. Namun, Anda juga dapat membuat dan me-*render* komponen React Anda sendiri. Contohnya, kita dapat mengacu ke seluruh daftar belanja di atas dengan menuliskan `<ShoppingList />`. Setiap komponen React terenkapsulasi dan dapat beroperasi secara mandiri. Hal ini memungkinkan Anda untuk membangun sebuah antarmuka pengguna yang kompleks dari komponen sederhana.

## Melihat Kode Permulaan {#inspecting-the-starter-code}

Jika Anda akan mengikuti tutorial ini **di *browser* Anda**, buka kode ini pada *tab* baru: **[Kode Permulaan](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Jika Anda mengikuti tutorial ini dengan *local environment* Anda, bukalah `src/index.js` pada folder *project* Anda (Anda sudah pernah menyentuh *file* ini selama [persiapan]](#setup-option-2-local-development-environment)).

Kode Permulaan ini berdasarkan pada aplikasi yang akan kita buat. Kami sudah menyediakan *style CSS* sehingga Anda bisa fokus mempelajari React dan memprogram permainan *tic-tac-toe*.

Dengan melihat kode permulaan, Anda akan melihat bahwa kita memiliki tiga komponen React:

* Square
* Board
* Game

Komponen Square akan me-*render* sebuah `<button>` dan komponen Board akan me-*render* 9 persegi. Komponen Game akan me-*render* sebuah *board* dengan nilai sementara yang akan kita ganti nanti. Saat ini belum ada komponen interaktif.

### Passing Data Melalui Props {#passing-data-through-props}

Untuk memulai mendalami React, mari kita mencoba untuk mem-*passing* data dari komponen Board ke komponen Square kita.

Di dalam *method* `renderSquare` Board, ubah kodenya sehingga Square menerima *prop* bernama `value`:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Ubah *method* `render` sehingga dapat menampilkan nilai dari `value` dengan mengganti `{/* TODO */}` dengan `{this.props.value}`:

```js{5}
class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {this.props.value}
      </button>
    );
  }
}
```

Sebelum:

![React Devtools](../images/tutorial/tictac-empty.png)

Sesudah: Anda seharusnya dapat melihat angka dari setiap persegi pada keluaran yang telah di-*render*.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Selamat! Anda baru saja "memberikan sebuah *prop*" dari komponen Board ke komponen Square. *Passing props* adalah cara informasi dapat mengalir dalam aplikasi React dari *parent* ke *children*.

### Membuat Komponen Interaktif {#making-an-interactive-component}

Mari mengisi komponen Square dengan sebuah "X" ketika kita mengklik komponen tersebut.
Pertama, ubah *button tag* yang dikembalikan dari fungsi `render()` komponen Square menjadi:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { alert('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

Jika kita mengklik salah satu Square, kita akan mendapatkan *alert* pada *browser* kita.

>Catatan
>
>Untuk mempercepat proses mengetik dan menghindari [perilaku membingungkan `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), kita akan menggunakan [sintaks arrow function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) untuk setiap *event handler* yang akan kita buat:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => alert('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
>Perhatikan bahwa dengan `onClick={() => alert('click')}`, kita memberikan *sebuah fungsi* sebagai `onClick` *prop*. Fungsi tersebut hanya dieksekusi setelah klik. Lupa untuk menulis `() =>` dan menulis `onClick={alert('click')}` adalah kesalahan yang sering terjadi. Hal tersebut menyebabkan fungsi akan terus dijalankan setiap komponen di-*render* ulang.

Selanjutnya, kita ingin agar komponen Square "mengingat" bahwa komponen tersebut sudah diklik dan mengisinya dengan "X". Untuk "mengingat" sesuatu, komponen menggunakan **_state_**.

Komponen React dapat memiliki *state* dengan mendefinisikan `this.state` pada konstruktornya. `this.state` harus dianggap *private* oleh komponen React tempat ia didefinisikan. Mari menyimpan nilai Square saat ini pada `this.state` dan mengubahnya ketika Square diklik.

Pertama, kita akan menambahkan konstruktor pada kelas untuk menginisialisasi *state*:

```javascript{2-7}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button className="square" onClick={() => alert('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Catatan
>
>Pada [kelas JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), Anda harus selalu memanggil `super` ketika mendefinisikan konstruktor dari sebuah subkelas. Semua kelas komponen React yang memiliki `konstruktor` harus dimulai dengan `super(props)` *call*.

Sekarang kita akan mengubah *method* `render` Square untuk menampilkan nilai *state* saat ini ketika diklik:

* Mengganti `this.props.value` dengan `this.state.value` di dalam `<button>` *tag*.
* Mengganti *event handler* `() => alert()` dengan `() => this.setState({value: 'X'})`.
* Pisahkan *props* `className` dan `onClick` pada baris yang berbeda agar lebih mudah dibaca.

Setelah perubahan di atas, *tag* `<button>` yang dikembalikan dari *method* `render` Square akan terlihat seperti ini:

```javascript{12-13,15}
class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }

  render() {
    return (
      <button
        className="square"
        onClick={() => this.setState({value: 'X'})}
      >
        {this.state.value}
      </button>
    );
  }
}
```

Dengan memanggil `this.setState` dari `onClick` *handler* pada *method* `render` Square, kita akan memberi tahu React untuk me-*render* ulang Square setiap `<button>` diklik. Setelah *update* terjadi, `this.state.value` dari Square akan menjadi `'X'`, jadi kita akan melihat `X` pada *board* permainan. Jika Anda mengklik salah satu Square, maka akan muncul `X`.

Ketika Anda memanggil `setState` di sebuah component, React akan memperbarui komponen *child* di dalamnya secara otomatis.

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Developer Tools {#developer-tools}

Ekstensi React Devtools untuk [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) dan [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
memungkinkan Anda untuk melihat *component tree* dari React dengan menggunakan *developer tools browser* Anda.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React Devtools memungkinkan Anda untuk mengecek *props* dan *state* komponen React Anda.

Setelah meng-*install* React Devtools, Anda dapat mengklik kanan elemen manapun pada halaman Anda, kemudian klik "Inspect" untuk membuka *developer tools* dan *tab* React akan muncul sebagai *tab* terakhir di sebalah kanan.

**Walaupun demikian, perlu diperhatikan bahwa ada beberapa langkah tambahan untuk membuat aplikasi Anda bekerja dengan CodePen:**

1. Masuk atau daftar dan konfirmasi email Anda (diperlukan untuk mencegah *spam*)
2. Klik tombol "Fork".
3. Klik "Change View" dan pilih "Debug mode".
4. Pada *tab* yang terbuka, *devtools* saat ini seharusnya memiliki *tab* React.

## Completing the Game {#completing-the-game}

We now have the basic building blocks for our tic-tac-toe game. To have a complete game, we now need to alternate placing "X"s and "O"s on the board, and we need a way to determine a winner.

### Lifting State Up {#lifting-state-up}

Currently, each Square component maintains the game's state. To check for a winner, we'll maintain the value of each of the 9 squares in one location.

We may think that Board should just ask each Square for the Square's state. Although this approach is possible in React, we discourage it because the code becomes difficult to understand, susceptible to bugs, and hard to refactor. Instead, the best approach is to store the game's state in the parent Board component instead of in each Square. The Board component can tell each Square what to display by passing a prop, [just like we did when we passed a number to each Square](#passing-data-through-props).

**To collect data from multiple children, or to have two child components communicate with each other, you need to declare the shared state in their parent component instead. The parent component can pass the state back down to the children by using props; this keeps the child components in sync with each other and with the parent component.**

Lifting state into a parent component is common when React components are refactored -- let's take this opportunity to try it out. We'll add a constructor to the Board and set the Board's initial state to contain an array with 9 nulls. These 9 nulls correspond to the 9 squares:

```javascript{2-7}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  renderSquare(i) {
    return <Square value={i} />;
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

When we fill the board in later, the board will look something like this:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

The Board's `renderSquare` method currently looks like this:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

In the beginning, we [passed the `value` prop down](#passing-data-through-props) from the Board to show numbers from 0 to 8 in every Square. In a different previous step, we replaced the numbers with an "X" mark [determined by Square's own state](#making-an-interactive-component). This is why Square currently ignores the `value` prop passed to it by the Board.

We will now use the prop passing mechanism again. We will modify the Board to instruct each individual Square about its current value (`'X'`, `'O'`, or `null`). We have already defined the `squares` array in the Board's constructor, and we will modify the Board's `renderSquare` method to read from it:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Each Square will now receive a `value` prop that will either be `'X'`, `'O'`, or `null` for empty squares.

Next, we need to change what happens when a Square is clicked. The Board component now maintains which squares are filled. We need to create a way for the Square to update the Board's state. Since state is considered to be private to a component that defines it, we cannot update the Board's state directly from Square.

To maintain the Board's state's privacy, we'll pass down a function from the Board to the Square. This function will get called when a Square is clicked. We'll change the `renderSquare` method in Board to:

```javascript{5}
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
```

>Note
>
>We split the returned element into multiple lines for readability, and added parentheses so that JavaScript doesn't insert a semicolon after `return` and break our code.

Now we're passing down two props from Board to Square: `value` and `onClick`. The `onClick` prop is a function that Square can call when clicked. We'll make the following changes to Square:

* Replace `this.state.value` with `this.props.value` in Square's `render` method
* Replace `this.setState()` with `this.props.onClick()` in Square's `render` method
* Delete the `constructor` from Square because Square no longer keeps track of the game's state

After these changes, the Square component looks like this:

```javascript{1,2,6,8}
class Square extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}
```

When a Square is clicked, the `onClick` function provided by the Board is called. Here's a review of how this is achieved:

1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls `this.handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes.

>Note
>
>The DOM `<button>` element's `onClick` attribute has a special meaning to React because it is a built-in component. For custom components like Square, the naming is up to you. We could name the Square's `onClick` prop or Board's `handleClick` method differently. In React, however, it is a convention to use `on[Event]` names for props which represent events and `handle[Event]` for the methods which handle the events.

When we try to click a Square, we should get an error because we haven't defined `handleClick` yet. We'll now add `handleClick` to the Board class:

```javascript{9-13}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: X';

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

After these changes, we're again able to click on the Squares to fill them. However, now the state is stored in the Board component instead of the individual Square components. When the Board's state changes, the Square components re-render automatically. Keeping the state of all squares in the Board component will allow it to determine the winner in the future.

Since the Square components no longer maintain state, the Square components receive values from the Board component and inform the Board component when they're clicked. In React terms, the Square components are now **controlled components**. The Board has full control over them.

Note how in `handleClick`, we call `.slice()` to create a copy of the `squares` array to modify instead of modifying the existing array. We will explain why we create a copy of the `squares` array in the next section.

### Why Immutability Is Important {#why-immutability-is-important}

In the previous code example, we suggested that you use the `.slice()` operator to create a copy of the `squares` array to modify instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to *mutate* the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes.

#### Data Change with Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Now player is {score: 2, name: 'Jeff'}
```

#### Data Change without Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Now player is unchanged, but newPlayer is {score: 2, name: 'Jeff'}

// Or if you are using object spread syntax proposal, you can write:
// var newPlayer = {...player, score: 2};
```

The end result is the same but by not mutating (or changing the underlying data) directly, we gain several benefits described below.

#### Complex Features Become Simple {#complex-features-become-simple}

Immutability makes complex features much easier to implement. Later in this tutorial, we will implement a "time travel" feature that allows us to review the tic-tac-toe game's history and "jump back" to previous moves. This functionality isn't specific to games -- an ability to undo and redo certain actions is a common requirement in applications. Avoiding direct data mutation lets us keep previous versions of the game's history intact, and reuse them later.

#### Detecting Changes {#detecting-changes}

Detecting changes in mutable objects is difficult because they are modified directly. This detection requires the mutable object to be compared to previous copies of itself and the entire object tree to be traversed.

Detecting changes in immutable objects is considerably easier. If the immutable object that is being referenced is different than the previous one, then the object has changed.

#### Determining When to Re-render in React {#determining-when-to-re-render-in-react}

The main benefit of immutability is that it helps you build _pure components_ in React. Immutable data can easily determine if changes have been made which helps to determine when a component requires re-rendering.

You can learn more about `shouldComponentUpdate()` and how you can build *pure components* by reading [Optimizing Performance](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

We'll now change the Square to be a **function component**.

In React, **function components** are a simpler way to write components that only contain a `render` method and don't have their own state. Instead of defining a class which extends `React.Component`, we can write a function that takes `props` as input and returns what should be rendered. Function components are less tedious to write than classes, and many components can be expressed this way.

Replace the Square class with this function:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

We have changed `this.props` to `props` both times it appears.

**[View the full code at this point](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Note
>
>When we modified the Square to be a function component, we also changed `onClick={() => this.props.onClick()}` to a shorter `onClick={props.onClick}` (note the lack of parentheses on *both* sides). In a class, we used an arrow function to access the correct `this` value, but in a function component we don't need to worry about `this`.

### Taking Turns {#taking-turns}

We now need to fix an obvious defect in our tic-tac-toe game: the "O"s cannot be marked on the board.

We'll set the first move to be "X" by default. We can set this default by modifying the initial state in our Board constructor:

```javascript{6}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. We'll update the Board's `handleClick` function to flip the value of `xIsNext`:

```javascript{3,6}
  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

With this change, "X"s and "O"s can take turns. Let's also change the "status" text in Board's `render` so that it displays which player has the next turn:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // the rest has not changed
```

After applying these changes, you should have this Board component:

```javascript{6,11-16,29}
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

**[View the full code at this point](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Declaring a Winner {#declaring-a-winner}

Now that we show which player's turn is next, we should also show when the game is won and there are no more turns to make. We can determine a winner by adding this helper function to the end of the file:

```javascript
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
```

We will call `calculateWinner(squares)` in the Board's `render` function to check if a player has won. If a player has won, we can display text such as "Winner: X" or "Winner: O". We'll replace the `status` declaration in Board's `render` function with this code:

```javascript{2-8}
  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      // the rest has not changed
```

We can now change the Board's `handleClick` function to return early by ignoring a click if someone has won the game or if a Square is already filled:

```javascript{3-5}
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So *you're* probably the real winner here.

## Adding Time Travel {#adding-time-travel}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a History of Moves {#storing-a-history-of-moves}

If we mutated the `squares` array, implementing time travel would be very difficult.

However, we used `slice()` to create a new copy of the `squares` array after every move, and [treated it as immutable](#why-immutability-is-important). This will allow us to store every past version of the `squares` array, and navigate between the turns that have already happened.

We'll store the past `squares` arrays in another array called `history`. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```javascript
history = [
  // Before first move
  {
    squares: [
      null, null, null,
      null, null, null,
      null, null, null,
    ]
  },
  // After first move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, null,
    ]
  },
  // After second move
  {
    squares: [
      null, null, null,
      null, 'X', null,
      null, null, 'O',
    ]
  },
  // ...
]
```

Now we need to decide which component should own the `history` state.

### Lifting State Up, Again {#lifting-state-up-again}

We'll want the top-level Game component to display a list of past moves. It will need access to the `history` to do that, so we will place the `history` state in the top-level Game component.

Placing the `history` state into the Game component lets us remove the `squares` state from its child Board component. Just like we ["lifted state up"](#lifting-state-up) from the Square component into the Board component, we are now lifting it up from the Board into the top-level Game component. This gives the Game component full control over the Board's data, and lets it instruct the Board to render previous turns from the `history`.

First, we'll set up the initial state for the Game component within its constructor:

```javascript{2-10}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
```

Next, we'll have the Board component receive `squares` and `onClick` props from the Game component. Since we now have a single click handler in Board for many Squares, we'll need to pass the location of each Square into the `onClick` handler to indicate which Square was clicked. Here are the required steps to transform the Board component:

* Delete the `constructor` in Board.
* Replace `this.state.squares[i]` with `this.props.squares[i]` in Board's `renderSquare`.
* Replace `this.handleClick(i)` with `this.props.onClick(i)` in Board's `renderSquare`.

The Board component now looks like this:

```javascript{17,18}
class Board extends React.Component {
  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

We'll update the Game component's `render` function to use the most recent history entry to determine and display the game's status:

```javascript{2-11,16-19,22}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
```

Since the Game component is now rendering the game's status, we can remove the corresponding code from the Board's `render` method. After refactoring, the Board's `render` function looks like this:

```js{1-4}
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
```

Finally, we need to move the `handleClick` method from the Board component to the Game component. We also need to modify `handleClick` because the Game component's state is structured differently. Within the Game's `handleClick` method, we concatenate new history entries onto `history`.

```javascript{2-4,10-12}
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }
```

>Note
>
>Unlike the array `push()` method you might be more familiar with, the `concat()` method doesn't mutate the original array, so we prefer it.

At this point, the Board component only needs the `renderSquare` and `render` methods. The game's state and the `handleClick` method should be in the Game component.

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Showing the Past Moves {#showing-the-past-moves}

Since we are recording the tic-tac-toe game's history, we can now display it to the player as a list of past moves.

We learned earlier that React elements are first-class JavaScript objects; we can pass them around in our applications. To render multiple items in React, we can use an array of React elements.

In JavaScript, arrays have a [`map()` method](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) that is commonly used for mapping data to other data, for example:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
``` 

Using the `map` method, we can map our history of moves to React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves.

Let's `map` over the `history` in the Game's `render` method:

```javascript{6-15,34}
  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
```

**[View the full code at this point](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

For each move in the tic-tac-toes's game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Let's discuss what the above warning means.

### Picking a Key {#picking-a-key}

When we render a list, React stores some information about each rendered list item. When we update a list, React needs to determine what has changed. We could have added, removed, re-arranged, or updated the list's items.

Imagine transitioning from

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

to

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

In addition to the updated counts, a human reading this would probably say that we swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and does not know what we intended. Because React cannot know our intentions, we need to specify a *key* property for each list item to differentiate each list item from its siblings. One option would be to use the strings `alexa`, `ben`, `claudia`. If we were displaying data from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved. Keys tell React about the identity of each component which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React (along with `ref`, a more advanced feature). When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it belongs in `props`, `key` cannot be referenced using `this.props.key`. React automatically uses `key` to decide which components to update. A component cannot inquire about its `key`.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will present a warning and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the warning but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.


### Implementing Time Travel {#implementing-time-travel}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. The moves are never re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the Game component's `render` method, we can add the key as `<li key={move}>` and React's warning about keys should disappear:

```js{6}
    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
```

**[View the full code at this point](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Clicking any of the list item's buttons throws an error because the `jumpTo` method is undefined. Before we implement `jumpTo`, we'll add `stepNumber` to the Game component's state to indicate which step we're currently viewing.

First, add `stepNumber: 0` to the initial state in Game's `constructor`:

```js{8}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }
```

Next, we'll define the `jumpTo` method in Game to update that `stepNumber`. We also set `xIsNext` to true if the number that we're changing `stepNumber` to is even:

```javascript{5-10}
  handleClick(i) {
    // this method has not changed
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    // this method has not changed
  }
```

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.

The `stepNumber` state we've added reflects the move displayed to the user now. After we make a new move, we need to update `stepNumber` by adding `stepNumber: history.length` as part of the `this.setState` argument. This ensures we don't get stuck showing the same move after a new one has been made.

We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now become incorrect.

```javascript{2,13}
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }
```

Finally, we will modify the Game component's `render` method from always rendering the last move to rendering the currently selected move according to `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // the rest has not changed
```

If we click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

**[View the full code at this point](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Wrapping Up {#wrapping-up}

Congratulations! You've created a tic-tac-toe game that:

* Lets you play tic-tac-toe,
* Indicates when a player has won the game,
* Stores a game's history as a game progresses,
* Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp on how React works.

Check out the final result here: **[Final Result](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw.

Throughout this tutorial, we touched on React concepts including elements, components, props, and state. For a more detailed explanation of each of these topics, check out [the rest of the documentation](/docs/hello-world.html). To learn more about defining components, check out the [`React.Component` API reference](/docs/react-component.html).
