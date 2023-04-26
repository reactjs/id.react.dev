---
title: 'Tutorial: Tic-Tac-Toe'
---

<Intro>

Dalam tutorial ini, Anda akan membuat sebuah gim *tic-tac-toe* sederhana. Tutorial ini berasumsi anda tidak memiliki pengetahuan sebalumnya mengenai React. Teknik-teknik yang akan Anda pelajari di tutorial ini akan menjadi fundamental untuk membuat aplikasi apapun dengan React, dan memahami ini dengan sepenuhnya akan memberikan Anda pemahaman mendalam mengenai React.

</Intro>

<Note>

Tutorial ini didesain untuk Anda yang ingin **mempelajari dengan mencoba secara langsung (*learning by doing*)** dan ingin segera mencoba membuat sesuatu yang nyata. Jika Anda lebih suka mempelajari setiap konsep selangkah demi selangkah, mulailah dengan [Describing the UI.](/learn/describing-the-ui)

</Note>

Tutorial ini dibagi menjadi beberapa bagian:

- [Persiapan untuk tutorial](#setup-for-the-tutorial) akan memberi Anda **titik awal** untuk memulai tutorial.
- [Gambaran umum](#overview) akan mengajarkan Anda **dasar-dasar** React: komponen, *props*, dan *state*.
- [Menyelesaikan gim](#completing-the-game) akan mengajarkan Anda **teknik-teknik yang paling umum** dalam pengembangan React.
- [Menambahkan *time travel*](#adding-time-travel) akan memberi Anda **wawasan yang lebih dalam** tentang kekuatan unik React.

### Apa yang akan Anda buat? {/*what-are-you-building*/}

Dalam tutorial ini, Anda akan membuat gim *tic-tac-toe* interaktif dengan React.

Anda dapat melihat seperti apa tampilannya setelah Anda selesai di sini:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Jika kode tersebut masih belum masuk akal bagi Anda, atau jika Anda tidak terbiasa dengan sintaksis kode tersebut, jangan khawatir! Tujuan dari tutorial ini adalah untuk membantu Anda memahami React dan sintaksnya.

Kami sarankan Anda untuk melihat gim *tic-tac-toe* di atas sebelum melanjutkan dengan tutorial ini. Salah satu fitur yang akan Anda perhatikan adalah adanya daftar bernomor di sebelah kanan papan permainan. Daftar ini memberi Anda riwayat semua gerakan yang telah terjadi dalam permainan, dan diperbarui saat permainan berlangsung.

Setelah Anda bermain-main dengan gim *tic-tac-toe* yang sudah jadi, lanjutkan menggulir. Anda akan mulai dengan template yang lebih sederhana dalam tutorial ini. Langkah kami selanjutnya adalah menyiapkan Anda agar Anda dapat mulai membuat gim.

## Persiapan untuk tutorial {/*setup-for-the-tutorial*/}

Pada editor kode langsung di bawah ini, klik **Fork** di pojok kanan atas untuk membuka editor di tab baru menggunakan situs web CodeSandbox. CodeSandbox memungkinkan Anda menulis kode di browser dan melihat pratinjau bagaimana pengguna akan melihat aplikasi yang Anda buat. Tab baru akan menampilkan kotak kosong dan kode awal untuk tutorial ini.

<Sandpack>

```js App.js
export default function Square() {
  return <button className="square">X</button>;
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Anda juga dapat mengikuti tutorial ini dengan menggunakan _development environment_ lokal Anda. Untuk melakukan ini, Anda perlu:

1. Menginstal [Node.js](https://nodejs.org/en/)
1. Pada tab CodeSandbox yang telah Anda buka sebelumnya, tekan tombol pojok kiri atas untuk membuka menu, lalu pilih **File > Export to ZIP** pada menu tersebut untuk mengunduh arsip berkas-berkas secara lokal
1. *Unzip* arsip tersebut, lalu buka terminal dan `cd` ke direktori yang telah Anda _unzip_
1. Instal dependensi dengan `npm install`
1. Jalankan `npm start` memulai server lokal dan ikuti petunjuknya untuk melihat kode yang berjalan di peramban

Jika Anda mengalami kebuntuan, jangan biarkan hal ini menghentikan Anda! Ikuti saja secara online dan coba lagi penyiapan lokal nanti.

</Note>

## Gambaran umum {/*overview*/}

Sekarang setelah Anda siap, mari kita lihat gambaran umum tentang React!

### Memeriksa kode awal {/*inspecting-the-starter-code*/}

Di CodeSandbox Anda akan melihat tiga bagian utama:

![CodeSandbox dengan kode awal](../images/tutorial/react-starter-code-codesandbox.png)

1. Bagian _Files_ dengan daftar file seperti `App.js`, `index.js`, `styles.css`, dan sebuah folder bernama `public`
1. _Editor kode_ di mana Anda akan melihat kode sumber dari berkas yang Anda pilih
1. Bagian _browser_ di mana Anda akan melihat bagaimana kode yang Anda tulis akan ditampilkan

File `App.js` juga sudah terpilih di bagian _Files_. Isi dari file tersebut di dalam _code editor_ seharusnya:

```jsx
export default function Square() {
  return <button className="square">X</button>;
}
```

Bagian _browser_ seharusnya menampilkan sebuah kotak dengan tanda X di dalamnya seperti ini:

![kotak berisikan x](../images/tutorial/x-filled-square.png)

Sekarang mari kita lihat file-file dalam kode awal.

#### `App.js` {/*appjs*/}

Kode dalam `App.js` membuat sebuah _komponen_. Dalam React, komponen adalah bagian dari kode yang dapat digunakan kembali yang merepresentasikan bagian dari antarmuka pengguna. Komponen digunakan untuk merender, mengelola, dan memperbarui elemen UI dalam aplikasi Anda. Mari kita lihat komponen ini baris demi baris untuk melihat apa yang terjadi:

```js {1}
export default function Square() {
  return <button className="square">X</button>;
}
```

Baris pertama mendefinisikan sebuah fungsi bernama `Square`. Kata kunci JavaScript `export` membuat fungsi ini dapat diakses di luar berkas ini. Kata kunci `default` memberi tahu berkas lain yang menggunakan kode Anda bahwa ini adalah fungsi utama dalam berkas Anda.

```js {2}
export default function Square() {
  return <button className="square">X</button>;
}
```

Baris kedua mengembalikan sebuah tombol. Kata kunci JavaScript `return` berarti apa pun yang muncul setelahnya akan dikembalikan sebagai nilai kepada pemanggil fungsi. `<button>` adalah sebuah *elemen JSX*. Elemen JSX adalah kombinasi kode JavaScript dan tag HTML yang menjelaskan apa yang ingin Anda tampilkan. `className="square"` adalah properti tombol atau *prop* yang memberi tahu CSS cara menata tombol. `X` adalah teks yang ditampilkan di dalam tombol dan `</button>` menutup elemen JSX untuk mengindikasikan bahwa konten berikutnya tidak boleh ditempatkan di dalam tombol.

#### `styles.css` {/*stylescss*/}

Klik pada file berlabel `styles.css` di bagian _Files_ pada CodeSandbox. File ini mendefinisikan *style* untuk aplikasi React Anda. Dua _CSS selector_ pertama (`*` dan `body`) mendefinisikan *style* dari sebagian besar aplikasi Anda, sementara selektor `.square` mendefinisikan *style* dari setiap komponen di mana properti `className` disetel ke `square`. Dalam kode Anda, itu akan mereferensikan tombol dari komponen Square Anda di file `App.js`.

#### `index.js` {/*indexjs*/}

Klik pada file berlabel `index.js` di bagian _Files_ pada CodeSandbox. Anda tidak akan mengedit file ini selama tutorial, namun file ini merupakan penghubung antara komponen yang Anda buat di file `App.js` dengan peramban web.

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';
```

Baris 1-5 menyatukan semua bagian yang diperlukan:

* React
* *Library* React untuk berkomunikasi dengan peramban web (React DOM)
* *style* untuk komponen Anda
* komponen yang Anda buat di `App.js`.

Sisa dari berkas ini menyatukan semua bagian dan menyuntikkan hasil akhir ke dalam `index.html` di dalam folder `public`.

### Membuat papan permainan {/*building-the-board*/}

Mari kembali ke `App.js`. Di sinilah Anda akan menghabiskan sisa tutorial ini.

Saat ini papannya hanya terdiri dari satu kotak, tetapi Anda membutuhkan sembilan kotak! Jika Anda hanya mencoba menyalin dan menempelkan kotak Anda untuk membuat dua kotak seperti ini:

```js {2}
export default function Square() {
  return <button className="square">X</button><button className="square">X</button>;
}
```

Anda akan mendapatkan *error* berikut:

<ConsoleBlock level="error">

/src/App.js: Adjacent JSX elements must be wrapped in an enclosing tag. Did you want a JSX fragment `<>...</>`?

</ConsoleBlock>

Komponen React harus mengembalikan satu elemen JSX dan bukan beberapa elemen JSX yang berdekatan seperti dua buah tombol. Untuk memperbaikinya, Anda dapat menggunakan *fragment* (`<>` dan `</>`) untuk membungkus beberapa elemen JSX yang berdekatan seperti ini:

```js {3-6}
export default function Square() {
  return (
    <>
      <button className="square">X</button>
      <button className="square">X</button>
    </>
  );
}
```

Sekarang Anda bisa melihat:

![dua kotak berisikan x](../images/tutorial/two-x-filled-squares.png)

Bagus! Sekarang Anda hanya perlu menyalin-tempel beberapa kali untuk menambahkan sembilan kotak dan...

![sembilan kotak berisikan x dalam satu baris](../images/tutorial/nine-x-filled-squares.png)

Oh tidak! Kotak-kotak tersebut berada dalam satu baris, bukan dalam *grid* seperti yang Anda perlukan untuk papan permainannya. Untuk mengatasinya, Anda perlu mengelompokkan kotak-kotak Anda ke dalam baris dengan `div` dan menambahkan beberapa kelas CSS. Selagi Anda melakukannya, Anda akan memberikan nomor pada setiap kotak untuk memastikan Anda tahu di mana setiap kotak ditampilkan.

Pada file `App.js`, perbarui komponen `Square` menjadi seperti ini:

```js {3-19}
export default function Square() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

CSS yang didefinisikan di `styles.css` memberi *style* pada div dengan `className` berupa `board-row`. Sekarang Anda telah mengelompokkan komponen Anda ke dalam baris dengan `div` yang diberi *style*, Anda telah memiliki papan tic-tac-toe:

![papan tic-tac-toe berisikan nomor 1 hingga 9](../images/tutorial/number-filled-board.png)

Tetapi sekarang ada masalah. Komponen Anda yang bernama `Square`, sebenarnya bukan sebuah persegi lagi. Mari kita perbaiki dengan mengubah namanya menjadi `Board`:

```js {1}
export default function Board() {
  //...
}
```

Saat ini, kode Anda akan terlihat seperti ini:

<Sandpack>

```js
export default function Board() {
  return (
    <>
      <div className="board-row">
        <button className="square">1</button>
        <button className="square">2</button>
        <button className="square">3</button>
      </div>
      <div className="board-row">
        <button className="square">4</button>
        <button className="square">5</button>
        <button className="square">6</button>
      </div>
      <div className="board-row">
        <button className="square">7</button>
        <button className="square">8</button>
        <button className="square">9</button>
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

<Note>

Psssst... Banyak sekali yang harus diketik! Tidak masalah untuk menyalin dan menempelkan kode dari halaman ini. Namun, jika Anda ingin sedikit tantangan, kami sarankan untuk hanya menyalin kode yang sudah Anda ketik sendiri secara manual setidaknya satu kali.

</Note>

### Mengirimkan data melalui props {/*passing-data-through-props*/}

Selanjutnya, Anda ingin mengubah nilai kotak dari kosong menjadi "X" ketika pengguna mengklik kotak tersebut. Dengan cara Anda membuat papan sejauh ini, Anda perlu menyalin-tempel kode yang memperbarui kotak sebanyak sembilan kali (satu kali untuk setiap kotak yang Anda miliki)! Alih-alih menyalin-tempel, arsitektur komponen React memungkinkan Anda untuk membuat komponen yang dapat digunakan kembali untuk menghindari kode yang berantakan dan terduplikasi.

Pertama, Anda akan menyalin baris yang mendefinisikan kotak pertama Anda (`<button className="square">1</button>`) dari komponen `Board` ke dalam komponen `Square` yang baru:

```js {1-3}
function Square() {
  return <button className="square">1</button>;
}

export default function Board() {
  // ...
}
```

Kemudian Anda akan memperbarui komponen Board untuk merender komponen `Square` tersebut dengan menggunakan sintaksis JSX:

```js {5-19}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Perhatikan bagaimana tidak seperti `div` yang merupakan elemen untuk peramban, komponen Anda sendiri seperti `Board` dan `Square` harus dimulai dengan huruf kapital.

Mari kita lihat:

![papan berisikan angka satu](../images/tutorial/board-filled-with-ones.png)

Oh tidak! Anda kehilangan kotak bernomor yang Anda miliki sebelumnya. Sekarang setiap kotak bertuliskan "1". Untuk memperbaikinya, Anda akan menggunakan _props_ untuk memberikan nilai yang seharusnya dimiliki setiap kotak dari komponen induk (`Board`) ke anaknya (`Square`).

Perbarui komponen `Square` untuk membaca props `value` yang akan Anda berikan dari `Board`:

```js {1}
function Square({ value }) {
  return <button className="square">1</button>;
}
```

`function Square({ value })` menunjukkan komponen Square dapat dioper sebuah prop yang disebut `value`.

Sekarang Anda ingin menampilkan `value` tersebut, bukan `1` di setiap kotak. Coba lakukan seperti ini:

```js {2}
function Square({ value }) {
  return <button className="square">value</button>;
}
```

Ups, ini bukan yang Anda inginkan:

![papan berisikan value](../images/tutorial/board-filled-with-value.png)

Anda ingin me-render variabel JavaScript yang disebut `value` dari komponen Anda, bukan kata "value". Untuk "melarikan diri ke dalam JavaScript" dari JSX, Anda memerlukan kurung kurawal. Tambahkan tanda kurung kurawal di sekitar `nilai` di JSX seperti ini:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Untuk saat ini, Anda akan melihat papan kosong:

![papan kosong](../images/tutorial/empty-board.png)

Hal ini karena komponen `Board` belum meneruskan prop `value` ke setiap komponen `Square` yang di-render. Untuk memperbaikinya, Anda harus menambahkan prop `value` ke setiap komponen `Square` yang dirender oleh komponen `Board`:

```js {5-7,10-12,15-17}
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

Sekarang, Anda akan melihat grid berisikan angka lagi:

![papan tic-tac-toe berisikan angka dari 1 hingga 9](../images/tutorial/number-filled-board.png)

Kode Anda yang telah diperbarui akan terlihat seperti ini:

<Sandpack>

```js App.js
function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square value="1" />
        <Square value="2" />
        <Square value="3" />
      </div>
      <div className="board-row">
        <Square value="4" />
        <Square value="5" />
        <Square value="6" />
      </div>
      <div className="board-row">
        <Square value="7" />
        <Square value="8" />
        <Square value="9" />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Membuat komponen interaktif {/*making-an-interactive-component*/}

Mari isi komponen `Square` dengan sebuah `X` ketika Anda mengkliknya. Deklarasikan sebuah fungsi bernama `handleClick` di dalam `Square`. Kemudian, tambahkan `onClick` ke properti elemen JSX tombol yang dikembalikan dari `Square`:

```js {2-4,9}
function Square({ value }) {
  function handleClick() {
    console.log('telah diklik!');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Jika Anda mengklik kotak sekarang, Anda akan melihat log yang bertuliskan `"telah diklik!"` pada tab _Console_ di bagian bawah bagian _Browser_ di CodeSandbox. Mengklik kotak lebih dari satu kali akan mencatat `"telah diklik!"` lagi. Log konsol yang berulang dengan pesan yang sama tidak akan membuat lebih banyak baris di konsol. Sebaliknya, Anda akan melihat penghitung yang bertambah di sebelah log `"telah diklik!"` pertama Anda.

<Note>

Jika Anda mengikuti tutorial ini menggunakan _development environment_ lokal, Anda perlu membuka *Console* browser Anda. Misalnya, jika Anda menggunakan browser Chrome, Anda dapat melihat *Console* dengan pintasan keyboard **Shift + Ctrl + J** (di Windows/Linux) atau **Option + ⌘ + J** (di macOS).

</Note>

Sebagai langkah selanjutnya, Anda ingin komponen Square "mengingat" bahwa komponen tersebut telah diklik, dan mengisinya dengan tanda "X". Untuk "mengingat" sesuatu, komponen menggunakan _state_.

React menyediakan fungsi khusus bernama `useState` yang dapat Anda panggil dari komponen Anda untuk membuatnya "mengingat" sesuatu. Mari kita menyimpan nilai saat ini dari `Square` dalam state, dan mengubahnya ketika `Square` diklik.

Import `useState` di bagian atas file. Hapus props `value` dari komponen `Square`. Sebagai gantinya, tambahkan baris baru di awal `Square` yang memanggil `useState`. Buatlah ia mengembalikan sebuah variabel state yang disebut `value`:

```js {1,3,4}
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    //...
```

`value` menyimpan nilai dan `setValue` adalah sebuah fungsi yang dapat digunakan untuk mengubah nilai. Nilai `null` yang dioper ke `useState` digunakan sebagai nilai awal untuk variabel state ini, sehingga `value` di sini dimulai dengan nilai yang sama dengan `null`.

Karena komponen `Square` tidak lagi menerima props, Anda akan menghapus props `value` dari kesembilan komponen Square yang dibuat oleh komponen Board:

```js {6-8,11-13,16-18}
// ...
export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

Sekarang Anda akan mengubah `Square` untuk menampilkan "X" ketika diklik. Ganti _event handler_ `console.log("telah diklik!");` dengan `setValue('X');`. Sekarang komponen `Square` Anda terlihat seperti ini:

```js {5}
function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}
```

Dengan memanggil fungsi `set` ini dari handler `onClick`, Anda memberi tahu React untuk me-render ulang `Square` setiap kali `<button>` diklik. Setelah pembaruan, nilai `Square` akan menjadi `'X'`, sehingga Anda akan melihat "X" pada papan permainan. Klik pada kotak mana pun, dan "X" akan muncul:

![menambahkan x ke papan permainan](../images/tutorial/tictac-adding-x-s.gif)

Setiap kotak memiliki state-nya sendiri: `value` yang disimpan di setiap kotak sepenuhnya independen dari yang lain. Ketika Anda memanggil fungsi `set` di dalam sebuah komponen, React akan secara otomatis memperbarui komponen turunan di dalamnya.

Setelah Anda melakukan perubahan di atas, kode Anda akan terlihat seperti ini:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square() {
  const [value, setValue] = useState(null);

  function handleClick() {
    setValue('X');
  }

  return (
    <button
      className="square"
      onClick={handleClick}
    >
      {value}
    </button>
  );
}

export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
      <div className="board-row">
        <Square />
        <Square />
        <Square />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### React Developer Tools {/*react-developer-tools*/}

React DevTools memungkinkan Anda untuk memeriksa props dan state dari komponen React Anda. Anda dapat menemukan tab React DevTools di bagian bawah bagian _browser_ di CodeSandbox:

![React DevTools dalam CodeSandbox](../images/tutorial/codesandbox-devtools.png)

Untuk memeriksa komponen tertentu di layar, gunakan tombol di sudut kiri atas React DevTools:

![Memilih komponen dalam halaman dengan React DevTools](../images/tutorial/devtools-select.gif)

<Note>

Untuk pengembangan lokal, React DevTools tersedia sebagai ekstensi peramban [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en), [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/), dan [Edge](https://microsoftedge.microsoft.com/addons/detail/react-developer-tools/gpphkfbcpidddadnkolkpfckpihlkkil). Instal, dan tab *Components* akan muncul di tab Developer Tools peramban Anda untuk situs yang menggunakan React.

</Note>

## Menyelesaikan gim {/*completing-the-game*/}

Sampai di sini, Anda sudah memiliki semua blok bangunan dasar untuk permainan *tic-tac-toe*. Untuk memiliki permainan yang lengkap, Anda sekarang perlu menempatkan "X" dan "O" secara bergantian di papan, dan Anda perlu cara untuk menentukan pemenang.

### Memindahkan state ke atas {/*lifting-state-up*/}

Saat ini, setiap komponen `Square` menyimpan sebagian dari state gim. Untuk memeriksa pemenang dalam permainan *tic-tac-toe*, `Board` harus mengetahui state masing-masing dari 9 komponen `Square`.

Bagaimana pendekatannya? Pada awalnya, Anda mungkin menduga bahwa `Board` perlu "meminta" setiap `Square` untuk mengetahui state dari `Square` tersebut. Meskipun pendekatan ini secara teknis mungkin dilakukan di React, kami tidak menyarankannya karena kodenya menjadi sulit untuk dipahami, rentan terhadap bug, dan sulit untuk di-refactor. Sebagai gantinya, pendekatan terbaik adalah dengan menyimpan state game di komponen `Board` induk, bukan di setiap `Square`. Komponen `Board` dapat memberi tahu setiap `Square` apa yang akan ditampilkan dengan mengoperkan sebuah prop, seperti yang Anda lakukan saat Anda mengoperkan sebuah angka ke setiap kotak.

**Untuk mengumpulkan data dari beberapa anak, atau untuk membuat dua komponen anak berkomunikasi satu sama lain, deklarasikan state bersama dalam komponen induknya. Komponen induk dapat meneruskan state tersebut kembali ke anak melalui props. Hal ini membuat komponen anak tetap sinkron satu sama lain dan dengan induknya.**

Mengangkat state ke dalam komponen induk adalah hal yang umum terjadi ketika komponen React direfaktor.

Mari kita gunakan kesempatan ini untuk mencobanya. Edit komponen `Board` sehingga komponen tersebut mendeklarasikan variabel state bernama `squares` yang secara default merupakan sebuah senarai berisi 9 null yang sesuai dengan 9 kotak:

```js {3}
// ...
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    // ...
  );
}
```

`Array(9).fill(null)` membuat senarai dengan sembilan elemen dan menetapkan masing-masing elemen menjadi `null`. Panggilan `useState()` di sekelilingnya mendeklarasikan variabel status `squares` yang pada awalnya disetel ke senarai tersebut. Setiap entri dalam senarai berhubungan dengan nilai sebuah kotak. Ketika Anda mengisi papan nanti, senarai `squares` akan terlihat seperti ini:

```jsx
['O', null, 'X', 'X', 'X', 'O', 'O', null, null]
```

Sekarang komponen `Board` Anda harus meneruskan props `value` ke setiap `Square` yang di-render:

```js {6-8,11-13,16-18}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

Selanjutnya, Anda akan mengedit komponen `Square` untuk menerima prop `value` dari komponen Board. Hal ini akan membutuhkan penghapusan pelacakan *stateful* komponen Square sendiri terhadap `value` dan prop `onClick` tombol:

```js {1,2}
function Square({value}) {
  return <button className="square">{value}</button>;
}
```

Pada titik ini, Anda akan melihat papan *tic-tac-toe* yang kosong:

![papan kosong](../images/tutorial/empty-board.png)

Dan kode Anda akan terlihat seperti ini:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value }) {
  return <button className="square">{value}</button>;
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} />
        <Square value={squares[1]} />
        <Square value={squares[2]} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} />
        <Square value={squares[4]} />
        <Square value={squares[5]} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} />
        <Square value={squares[7]} />
        <Square value={squares[8]} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Setiap Square sekarang akan menerima sebuah props `value` yang akan menjadi `'X'`, `'O'`, atau `null` untuk kotak kosong.

Selanjutnya, Anda perlu mengubah apa yang terjadi ketika sebuah `Square` diklik. Komponen `Board` sekarang mempertahankan kotak mana yang terisi. Anda perlu membuat cara agar `Square` memperbarui state `Board`. Karena state bersifat privat bagi komponen yang mendefinisikannya, Anda tidak dapat memperbarui state `Board` secara langsung dari `Square`.

Sebagai gantinya, Anda akan mewariskan fungsi dari komponen `Board` ke komponen `Square`, dan Anda akan membuat `Square` memanggil fungsi tersebut saat kotak diklik. Anda akan mulai dengan fungsi yang akan dipanggil oleh komponen `Square` ketika diklik. Anda akan menamakan fungsi tersebut `onSquareClick`:

```js {3}
function Square({ value }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Selanjutnya, Anda akan menambahkan fungsi `onSquareClick` ke props komponen `Square`:

```js {1}
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}
```

Sekarang Anda akan menghubungkan prop `onSquareClick` ke sebuah fungsi di komponen `Board` yang akan Anda beri nama `handleClick`. Untuk menghubungkan `onSquareClick` ke `handleClick`, Anda akan mengoper sebuah fungsi ke prop `onSquareClick` pada komponen `Square` pertama: 

```js {7}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={handleClick} />
        //...
  );
}
```

Terakhir, Anda akan mendefinisikan fungsi `handleClick` di dalam komponen Board untuk memperbarui senarai `squares` yang menyimpan state papan Anda:

```js {4-8}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick() {
    const nextSquares = squares.slice();
    nextSquares[0] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Fungsi `handleClick` membuat salinan senarai `squares` (`nextSquares`) dengan metode senarai JavaScript `slice()`. Kemudian, `handleClick` memperbarui senarai `nextSquares` untuk menambahkan `X` ke kotak pertama (indeks `[0]`).

Memanggil fungsi `setSquares` akan membuat React mengetahui bahwa state dari komponen telah berubah. Hal ini akan memicu render ulang komponen yang menggunakan state `squares` (`Board`) dan juga komponen turunannya (komponen `Square` yang membentuk board).

<Note>

JavaScript mendukung [closures](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) yang berarti fungsi dalam (misalnya `handleClick`) memiliki akses ke variabel dan fungsi yang didefinisikan di fungsi luar (misalnya `Board`). Fungsi `handleClick` dapat membaca state `squares` dan memanggil metode `setSquares` karena keduanya didefinisikan di dalam fungsi `Board`.

</Note>

Sekarang Anda dapat menambahkan tanda X pada papan tulis... tetapi hanya pada kotak kiri atas. Fungsi `handleClick` Anda telah dikodekan untuk meng-update indeks untuk kotak kiri atas (`0`). Mari kita perbarui `handleClick` agar dapat memperbarui kotak manapun. Tambahkan argumen `i` ke fungsi `handleClick` yang mengambil indeks kotak yang akan diperbarui:

```js {4,6}
export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = "X";
    setSquares(nextSquares);
  }

  return (
    // ...
  )
}
```

Selanjutnya, Anda harus mengoper `i` tersebut ke `handleClick`. Anda dapat mencoba untuk mengatur props `onSquareClick` dari kotak menjadi `handleClick(0)` secara langsung pada JSX seperti ini, tetapi tidak akan berhasil:

```jsx
<Square value={squares[0]} onSquareClick={handleClick(0)} />
```

Inilah alasan mengapa kode ini tidak bekerja. Panggilan `handleClick(0)` akan menjadi bagian dari proses rendering komponen papan. Karena `handleClick(0)` mengubah keadaan komponen papan dengan memanggil `setSquares`, seluruh komponen papan Anda akan di-render kembali. Tapi ini akan menjalankan `handleClick(0)` lagi, yang menyebabkan perulangan tak terbatas:

<ConsoleBlock level="error">

Too many re-renders. React limits the number of renders to prevent an infinite loop.

</ConsoleBlock>

Mengapa masalah ini tidak terjadi sebelumnya?

Ketika Anda mengoper `onSquareClick={handleClick}`, Anda mengoper fungsi `handleClick` sebagai sebuah prop. Anda tidak memanggilnya! Tetapi sekarang Anda langsung memanggil fungsi tersebut - perhatikan tanda kurung pada `handleClick(0)` - dan itulah mengapa fungsi tersebut berjalan terlalu cepat. Anda tidak *ingin* memanggil `handleClick` sampai pengguna mengklik!

Anda dapat memperbaikinya dengan membuat fungsi seperti `handleFirstSquareClick` yang memanggil `handleClick(0)`, fungsi seperti `handleSecondSquareClick` yang memanggil `handleClick(1)`, dan seterusnya. Anda akan meneruskan (daripada memanggil) fungsi-fungsi ini sebagai props seperti `onSquareClick={handleFirstSquareClick}`. Hal ini akan menyelesaikan perulangan tak terbatas.

Namun demikian, mendefinisikan sembilan fungsi yang berbeda dan memberikan nama untuk masing-masing fungsi itu terlalu bertele-tele. Sebagai gantinya, mari kita lakukan ini:

```js {6}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        // ...
  );
}
```

Perhatikan sintaks `() =>` yang baru. Di sini, `() => handleClick(0)` adalah sebuah fungsi *arrow function,* yang merupakan cara yang lebih singkat untuk mendefinisikan fungsi. Ketika kotak diklik, kode setelah tanda "panah" `=>` akan berjalan, memanggil `handleClick(0)`.

Sekarang Anda perlu memperbarui delapan kotak lainnya untuk memanggil `handleClick` dari fungsi panah yang Anda berikan. Pastikan bahwa argumen untuk setiap pemanggilan `handleClick` sesuai dengan indeks kotak yang benar:

```js {6-8,11-13,16-18}
export default function Board() {
  // ...
  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
};
```

Sekarang Anda dapat kembali menambahkan tanda X ke kotak mana pun di papan tulis dengan mengekliknya:

![mengisi papan permainan dengan X](../images/tutorial/tictac-adding-x-s.gif)

Tapi kali ini semua manajemen state ditangani oleh komponen `Board`!

Seperti inilah tampilan kode Anda:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    nextSquares[i] = 'X';
    setSquares(nextSquares);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Karena sekarang penanganan state Anda ada di komponen `Board`, komponen `Board` induk meneruskan props ke komponen `Square` anak sehingga dapat ditampilkan dengan benar. Ketika mengklik `Square`, komponen `Square` anak sekarang meminta komponen `Board` induk untuk memperbarui state papan. Ketika state `Board` berubah, komponen `Board` dan semua anak `Square` akan di-render ulang secara otomatis. Menyimpan state semua kotak dalam komponen `Board` akan memungkinkan komponen tersebut untuk menentukan pemenang di masa mendatang.

Mari kita rekap apa yang terjadi ketika pengguna mengeklik kotak kiri atas pada papan Anda untuk menambahkan tanda `X`:

1. Mengklik kotak kiri atas akan menjalankan fungsi yang diterima `tombol` sebagai prop `onClick` dari `Square`. Komponen `Square` menerima fungsi tersebut sebagai props `onSquareClick` dari `Board`. Komponen `Board` mendefinisikan fungsi tersebut secara langsung di JSX. Komponen ini memanggil `handleClick` dengan argumen `0`.
1. `handleClick` menggunakan argumen (`0`) untuk meng-update elemen pertama dari array `squares` dari `null` menjadi `X`.
1. State `squares` dari komponen `Board` telah diperbarui, sehingga `Board` dan semua anak komponennya di-render ulang. Hal ini menyebabkan prop `value` dari komponen `Square` dengan indeks `0` berubah dari `null` menjadi `X`.

Pada akhirnya pengguna akan melihat bahwa kotak kiri atas telah berubah dari kosong menjadi bertanda `X` setelah mengekliknya.

<Note>

Atribut `onClick` pada elemen DOM `<button>` memiliki arti khusus untuk React karena merupakan komponen bawaan. Untuk komponen kustom seperti Square, penamaan terserah Anda. Anda dapat memberikan nama apa pun pada prop `Square` dengan `onSquareClick` atau fungsi `handleClick` pada `Board`, dan kodenya akan bekerja secara sama. Dalam React, sudah menjadi hal yang lazim untuk menggunakan nama `onSomething` untuk props yang merepresentasikan _event_ dan `handleSomething` untuk definisi fungsi yang menangani _event_ tersebut.

</Note>

### Why immutability is important {/*why-immutability-is-important*/}

Note how in `handleClick`, you call `.slice()` to create a copy of the `squares` array instead of modifying the existing array. To explain why, we need to discuss immutability and why immutability is important to learn.

There are generally two approaches to changing data. The first approach is to _mutate_ the data by directly changing the data's values. The second approach is to replace the data with a new copy which has the desired changes. Here is what it would look like if you mutated the `squares` array:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Now `squares` is ["X", null, null, null, null, null, null, null, null];
```

And here is what it would look like if you changed data without mutating the `squares` array:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Now `squares` is unchanged, but `nextSquares` first element is 'X' rather than `null`
```

The result is the same but by not mutating (changing the underlying data) directly, you gain several benefits.

Immutability makes complex features much easier to implement. Later in this tutorial, you will implement a "time travel" feature that lets you review the game's history and "jump back" to past moves. This functionality isn't specific to games--an ability to undo and redo certain actions is a common requirement for apps. Avoiding direct data mutation lets you keep previous versions of the data intact, and reuse them later.

There is also another benefit of immutability. By default, all child components re-render automatically when the state of a parent component changes. This includes even the child components that weren't affected by the change. Although re-rendering is not by itself noticeable to the user (you shouldn't actively try to avoid it!), you might want to skip re-rendering a part of the tree that clearly wasn't affected by it for performance reasons. Immutability makes it very cheap for components to compare whether their data has changed or not. You can learn more about how React chooses when to re-render a component in [the `memo` API reference](/reference/react/memo).

### Taking turns {/*taking-turns*/}

It's now time to fix a major defect in this tic-tac-toe game: the "O"s cannot be marked on the board.

You'll set the first move to be "X" by default. Let's keep track of this by adding another piece of state to the Board component:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Each time a player moves, `xIsNext` (a boolean) will be flipped to determine which player goes next and the game's state will be saved. You'll update the `Board`'s `handleClick` function to flip the value of `xIsNext`:

```js {7,8,9,10,11,13}
export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    //...
  );
}
```

Now, as you click on different squares, they will alternate between `X` and `O`, as they should!

But wait, there's a problem. Try clicking on the same square multiple times:

![O overwriting an X](../images/tutorial/o-replaces-x.gif)

The `X` is overwritten by an `O`! While this would add a very interesting twist to the game, we're going to stick to the original rules for now.

When you mark a square with a `X` or an `O` you aren't first checking to see if the square already has a `X` or `O` value. You can fix this by *returning early*. You'll check to see if the square already has a `X` or an `O`. If the square is already filled, you will `return` in the `handleClick` function early--before it tries to update the board state.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Now you can only add `X`'s or `O`'s to empty squares! Here is what your code should look like at this point:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  return (
    <>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}
```

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Declaring a winner {/*declaring-a-winner*/}

Now that the players can take turns, you'll want to show when the game is won and there are no more turns to make. To do this you'll add a helper function called `calculateWinner` that takes an array of 9 squares, checks for a winner and returns `'X'`, `'O'`, or `null` as appropriate. Don't worry too much about the `calculateWinner` function; it's not specific to React:

```js App.js
export default function Board() {
  //...
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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

<Note>

It does not matter whether you define `calculateWinner` before or after the `Board`. Let's put it at the end so that you don't have to scroll past it every time you edit your components.

</Note>

You will call `calculateWinner(squares)` in the `Board` component's `handleClick` function to check if a player has won. You can perform this check at the same time you check if a user has clicked a square that already has a `X` or and `O`. We'd like to return early in both cases:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

To let the players know when the game is over, you can display text such as "Winner: X" or "Winner: O". To do that you'll add a `status` section to the `Board` component. The status will display the winner if the game is over and if the game is ongoing you'll display which player's turn is next:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Congratulations! You now have a working tic-tac-toe game. And you've just learned the basics of React too. So _you_ are the real winner here. Here is what the code should look like:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

## Adding time travel {/*adding-time-travel*/}

As a final exercise, let's make it possible to "go back in time" to the previous moves in the game.

### Storing a history of moves {/*storing-a-history-of-moves*/}

If you mutated the `squares` array, implementing time travel would be very difficult.

However, you used `slice()` to create a new copy of the `squares` array after every move, and treated it as immutable. This will allow you to store every past version of the `squares` array, and navigate between the turns that have already happened.

You'll store the past `squares` arrays in another array called `history`, which you'll store as a new state variable. The `history` array represents all board states, from the first to the last move, and has a shape like this:

```jsx
[
  // Before first move
  [null, null, null, null, null, null, null, null, null],
  // After first move
  [null, null, null, null, 'X', null, null, null, null],
  // After second move
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Lifting state up, again {/*lifting-state-up-again*/}

You will now write a new top-level component called `Game` to display a list of past moves. That's where you will place the `history` state that contains the entire game history.

Placing the `history` state into the `Game` component will let you remove the `squares` state from its child `Board` component. Just like you "lifted state up" from the `Square` component into the `Board` component, you will now lift it up from the `Board` into the top-level `Game` component. This gives the `Game` component full control over the `Board`'s data and lets it instruct the `Board` to render previous turns from the `history`.

First, add a `Game` component with `export default`. Have it render the `Board` component and some markup:

```js {1,5-16}
function Board() {
  // ...
}

export default function Game() {
  return (
    <div className="game">
      <div className="game-board">
        <Board />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}
```

Note that you are removing the `export default` keywords before the `function Board() {` declaration and adding them before the `function Game() {` declaration. This tells your `index.js` file to use the `Game` component as the top-level component instead of your `Board` component. The additional `div`s returned by the `Game` component are making room for the game information you'll add to the board later.

Add some state to the `Game` component to track which player is next and the history of moves:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Notice how `[Array(9).fill(null)]` is an array with a single item, which itself is an array of 9 `null`s.

To render the squares for the current move, you'll want to read the last squares array from the `history`. You don't need `useState` for this--you already have enough information to calculate it during rendering:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Next, create a `handlePlay` function inside the `Game` component that will be called by the `Board` component to update the game. Pass `xIsNext`, `currentSquares` and `handlePlay` as props to the `Board` component:

```js {6-8,13}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    // TODO
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        //...
  )
}
```

Let's make the `Board` component fully controlled by the props it receives. Change the `Board` component to take three props: `xIsNext`, `squares`, and a new `onPlay` function that `Board` can call with the updated squares array when a player makes a move. Next, remove the first two lines of the `Board` function that call `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Now replace the `setSquares` and `setXIsNext` calls in `handleClick` in the `Board` component with a single call to your new `onPlay` function so the `Game` component can update the `Board` when the user clicks a square:

```js {12}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  //...
}
```

The `Board` component is fully controlled by the props passed to it by the `Game` component. You need to implement the `handlePlay` function in the `Game` component to get the game working again.

What should `handlePlay` do when called? Remember that Board used to call `setSquares` with an updated array; now it passes the updated `squares` array to `onPlay`.

The `handlePlay` function needs to update `Game`'s state to trigger a re-render, but you don't have a `setSquares` function that you can call any more--you're now using the `history` state variable to store this information. You'll want to update `history` by appending the updated `squares` array as a new history entry. You also want to toggle `xIsNext`, just as Board used to do:

```js {4-5}
export default function Game() {
  //...
  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }
  //...
}
```

Here, `[...history, nextSquares]` creates a new array that contains all the items in `history`, followed by `nextSquares`. (You can read the `...history` [*spread syntax*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) as "enumerate all the items in `history`".)

For example, if `history` is `[[null,null,null], ["X",null,null]]` and `nextSquares` is `["X",null,"O"]`, then the new `[...history, nextSquares]` array will be `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

At this point, you've moved the state to live in the `Game` component, and the UI should be fully working, just as it was before the refactor. Here is what the code should look like at this point:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{/*TODO*/}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Showing the past moves {/*showing-the-past-moves*/}

Since you are recording the tic-tac-toe game's history, you can now display a list of past moves to the player.

React elements like `<button>` are regular JavaScript objects; you can pass them around in your application. To render multiple items in React, you can use an array of React elements.

You already have an array of `history` moves in state, so now you need to transform it to an array of React elements. In JavaScript, to transform one array into another, you can use the [array `map` method:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

You'll use `map` to transform your `history` of moves into React elements representing buttons on the screen, and display a list of buttons to "jump" to past moves. Let's `map` over the `history` in the Game component:

```js {11-13,15-27,35}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
```

You can see what your code should look like below. Note that you should see an error in the developer tools console that says: ``Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.`` You'll fix this error in the next section.

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

As you iterate through `history` array inside the function you passed to `map`, the `squares` argument goes through each element of `history`, and the `move` argument goes through each array index: `0`, `1`, `2`, …. (In most cases, you'd need the actual array elements, but to render a list of moves you will only need indexes.)

For each move in the tic-tac-toe game's history, you create a list item `<li>` which contains a button `<button>`. The button has an `onClick` handler which calls a function called `jumpTo` (that you haven't implemented yet).

For now, you should see a list of the moves that occurred in the game and an error in the developer tools console. Let's discuss what the "key" error means.

### Picking a key {/*picking-a-key*/}

When you render a list, React stores some information about each rendered list item. When you update a list, React needs to determine what has changed. You could have added, removed, re-arranged, or updated the list's items.

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

In addition to the updated counts, a human reading this would probably say that you swapped Alexa and Ben's ordering and inserted Claudia between Alexa and Ben. However, React is a computer program and can't know what you intended, so you need to specify a _key_ property for each list item to differentiate each list item from its siblings. If your data was from a database, Alexa, Ben, and Claudia's database IDs could be used as keys.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

When a list is re-rendered, React takes each list item's key and searches the previous list's items for a matching key. If the current list has a key that didn't exist before, React creates a component. If the current list is missing a key that existed in the previous list, React destroys the previous component. If two keys match, the corresponding component is moved.

Keys tell React about the identity of each component, which allows React to maintain state between re-renders. If a component's key changes, the component will be destroyed and re-created with a new state.

`key` is a special and reserved property in React. When an element is created, React extracts the `key` property and stores the key directly on the returned element. Even though `key` may look like it is passed as props, React automatically uses `key` to decide which components to update. There's no way for a component to ask what `key` its parent specified.

**It's strongly recommended that you assign proper keys whenever you build dynamic lists.** If you don't have an appropriate key, you may want to consider restructuring your data so that you do.

If no key is specified, React will report an error and use the array index as a key by default. Using the array index as a key is problematic when trying to re-order a list's items or inserting/removing list items. Explicitly passing `key={i}` silences the error but has the same problems as array indices and is not recommended in most cases.

Keys do not need to be globally unique; they only need to be unique between components and their siblings.

### Implementing time travel {/*implementing-time-travel*/}

In the tic-tac-toe game's history, each past move has a unique ID associated with it: it's the sequential number of the move. Moves will never be re-ordered, deleted, or inserted in the middle, so it's safe to use the move index as a key.

In the `Game` function, you can add the key as `<li key={move}>`, and if you reload the rendered game, React's "key" error should disappear:

```js {4}
const moves = history.map((squares, move) => {
  //...
  return (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{description}</button>
    </li>
  );
});
```

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    // TODO
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}

.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

Before you can implement `jumpTo`, you need the `Game` component to keep track of which step the user is currently viewing. To do this, define a new state variable called `currentMove`, defaulting to `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Next, update the `jumpTo` function inside `Game` to update that `currentMove`. You'll also set `xIsNext` to `true` if the number that you're changing `currentMove` to is even.

```js {4-5}
export default function Game() {
  // ...
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }
  //...
}
```

You will now make two changes to the `Game`'s `handlePlay` function which is called when you click on a square.

- If you "go back in time" and then make a new move from that point, you only want to keep the history up to that point. Instead of adding `nextSquares` after all items (`...` spread syntax) in `history`, you'll add it after all items in `history.slice(0, currentMove + 1)` so that you're only keeping that portion of the old history.
- Each time a move is made, you need to update `currentMove` to point to the latest history entry.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Finally, you will modify the `Game` component to render the currently selected move, instead of always rendering the final move:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

If you click on any step in the game's history, the tic-tac-toe board should immediately update to show what the board looked like after that step occurred.

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
    setXIsNext(nextMove % 2 === 0);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

### Final cleanup {/*final-cleanup*/}

If you look at the code very closely, you may notice that `xIsNext === true` when `currentMove` is even and `xIsNext === false` when `currentMove` is odd. In other words, if you know the value of `currentMove`, then you can always figure out what `xIsNext` should be.

There's no reason for you to store both of these in state. In fact, always try to avoid redundant state. Simplifying what you store in state reduces bugs and makes your code easier to understand. Change `Game` so that it doesn't store `xIsNext` as a separate state variable and instead figures it out based on the `currentMove`:

```js {4,11,15}
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  // ...
}
```

You no longer need the `xIsNext` state declaration or the calls to `setXIsNext`. Now, there's no chance for `xIsNext` to get out of sync with `currentMove`, even if you make a mistake while coding the components.

### Wrapping up {/*wrapping-up*/}

Congratulations! You've created a tic-tac-toe game that:

- Lets you play tic-tac-toe,
- Indicates when a player has won the game,
- Stores a game's history as a game progresses,
- Allows players to review a game's history and see previous versions of a game's board.

Nice work! We hope you now feel like you have a decent grasp of how React works.

Check out the final result here:

<Sandpack>

```js App.js
import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

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

```css styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

.square {
  background: #fff;
  border: 1px solid #999;
  float: left;
  font-size: 24px;
  font-weight: bold;
  line-height: 34px;
  height: 34px;
  margin-right: -1px;
  margin-top: -1px;
  padding: 0;
  text-align: center;
  width: 34px;
}

.board-row:after {
  clear: both;
  content: '';
  display: table;
}

.status {
  margin-bottom: 10px;
}
.game {
  display: flex;
  flex-direction: row;
}

.game-info {
  margin-left: 20px;
}
```

</Sandpack>

If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game, listed in order of increasing difficulty:

1. For the current move only, show "You are at move #..." instead of a button.
1. Rewrite `Board` to use two loops to make the squares instead of hardcoding them.
1. Add a toggle button that lets you sort the moves in either ascending or descending order.
1. When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
1. Display the location for each move in the format (row, col) in the move history list.

Throughout this tutorial, you've touched on React concepts including elements, components, props, and state. Now that you've seen how these concepts work when building a game, check out [Thinking in React](/learn/thinking-in-react) to see how the same React concepts work when build an app's UI.
