---
title: 'Tutorial: Tic-Tac-Toe'
---

<Intro>

Dalam tutorial ini, Anda akan membuat sebuah gim *tic-tac-toe* sederhana. Tutorial ini berasumsi anda tidak memiliki pengetahuan sebelumnya mengenai React. Teknik-teknik yang akan Anda pelajari di tutorial ini akan menjadi fundamental untuk membuat aplikasi apapun dengan React, dan memahami ini dengan sepenuhnya akan memberikan Anda pemahaman mendalam mengenai React.

</Intro>

<Note>

Tutorial ini didesain untuk Anda yang ingin **mempelajari dengan mencoba secara langsung (*learning by doing*)** dan ingin segera mencoba membuat sesuatu yang nyata. Jika Anda lebih suka mempelajari setiap konsep selangkah demi selangkah, mulailah dengan [Menggambarkan Antarmuka Pengguna.](/learn/describing-the-ui)

</Note>

Tutorial ini dibagi menjadi beberapa bagian:

- [Persiapan untuk tutorial](#setup-for-the-tutorial) akan memberi Anda **titik awal** untuk memulai tutorial.
- [Gambaran umum](#overview) akan mengajarkan Anda **dasar-dasar** React: komponen, *props*, dan *state*.
- [Menyelesaikan gim](#completing-the-game) akan mengajarkan Anda **teknik-teknik yang paling umum** dalam pengembangan React.
- [Menambahkan perjalanan waktu](#adding-time-travel) akan memberi Anda **wawasan yang lebih dalam** tentang kekuatan unik React.

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

Anda juga dapat mengikuti tutorial ini dengan menggunakan *development environment* lokal Anda. Untuk melakukan ini, Anda perlu:

1. Menginstal [Node.js](https://nodejs.org/en/)
1. Pada tab CodeSandbox yang telah Anda buka sebelumnya, tekan tombol pojok kiri atas untuk membuka menu, lalu pilih **File > Export to ZIP** pada menu tersebut untuk mengunduh arsip berkas-berkas secara lokal
1. *Unzip* arsip tersebut, lalu buka terminal dan `cd` ke direktori yang telah Anda *unzip*
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

Kode dalam `App.js` membuat sebuah _komponen_. Dalam React, komponen adalah bagian dari kode yang dapat digunakan kembali yang merepresentasikan bagian dari antarmuka pengguna. Komponen digunakan untuk me-*render*, mengelola, dan memperbarui elemen UI dalam aplikasi Anda. Mari kita lihat komponen ini baris demi baris untuk melihat apa yang terjadi:

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

Kemudian Anda akan memperbarui komponen Board untuk me-*render* komponen `Square` tersebut dengan menggunakan sintaksis JSX:

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

Anda ingin me-*render* variabel JavaScript yang disebut `value` dari komponen Anda, bukan kata "value". Untuk "melarikan diri ke dalam JavaScript" dari JSX, Anda memerlukan kurung kurawal. Tambahkan tanda kurung kurawal di sekitar `nilai` di JSX seperti ini:

```js {2}
function Square({ value }) {
  return <button className="square">{value}</button>;
}
```

Untuk saat ini, Anda akan melihat papan kosong:

![papan kosong](../images/tutorial/empty-board.png)

Hal ini karena komponen `Board` belum meneruskan prop `value` ke setiap komponen `Square` yang di-render. Untuk memperbaikinya, Anda harus menambahkan prop `value` ke setiap komponen `Square` yang di-*render* oleh komponen `Board`:

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

Dengan memanggil fungsi `set` ini dari handler `onClick`, Anda memberi tahu React untuk me-*render* ulang `Square` setiap kali `<button>` diklik. Setelah pembaruan, nilai `Square` akan menjadi `'X'`, sehingga Anda akan melihat "X" pada papan permainan. Klik pada kotak mana pun, dan "X" akan muncul:

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

### Mengapa immutability itu penting {/*why-immutability-is-important*/}

Perhatikan bagaimana dalam `handleClick`, Anda memanggil `.slice()` untuk membuat salinan dari senarai `squares` dan bukannya memodifikasi senarai yang sudah ada. Untuk menjelaskan alasannya, kita perlu mendiskusikan immutability dan mengapa immutability penting untuk dipelajari.

Secara umum ada dua pendekatan untuk mengubah data. Pendekatan pertama adalah mengubah data (_mutate_) dengan mengubah nilai data secara langsung. Pendekatan kedua adalah mengganti data dengan salinan baru yang memiliki perubahan yang diinginkan. Berikut adalah tampilannya jika Anda mengubah senarai `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
squares[0] = 'X';
// Sekarang nilai `squares` adalah ["X", null, null, null, null, null, null, null, null];
```

Dan inilah tampilannya jika Anda mengubah data tanpa melakukan mutasi pada senarai `squares`:

```jsx
const squares = [null, null, null, null, null, null, null, null, null];
const nextSquares = ['X', null, null, null, null, null, null, null, null];
// Sekarang nilai `squares` tidak berubah, tetapi elemen pertama `nextSquares` adalah 'X', bukan `null`
```

Hasilnya sama, tetapi dengan tidak melakukan mutasi (mengubah data yang mendasarinya) secara langsung, Anda akan mendapatkan beberapa keuntungan.

Immutability membuat fitur-fitur yang kompleks menjadi lebih mudah untuk diimplementasikan. Kemudian dalam tutorial ini, Anda akan mengimplementasikan fitur "perjalanan waktu" yang memungkinkan Anda meninjau sejarah game dan "melompat kembali" ke gerakan sebelumnya. Fungsionalitas ini tidak spesifik untuk gim--kemampuan untuk membatalkan dan mengulang tindakan tertentu adalah persyaratan umum untuk aplikasi. Menghindari mutasi data secara langsung memungkinkan Anda menyimpan data versi sebelumnya, dan menggunakannya kembali nanti.

Ada juga manfaat lain dari immutability. Secara default, semua komponen anak di-*render* ulang secara otomatis ketika state komponen induk berubah. Hal ini termasuk komponen anak yang tidak terpengaruh oleh perubahan tersebut. Meskipun perenderan ulang tidak dengan sendirinya terlihat oleh pengguna (Anda tidak boleh secara aktif mencoba menghindarinya!), Anda mungkin ingin melewatkan perenderan ulang bagian dari pohon komponen yang jelas tidak terpengaruh oleh perubahan tersebut karena alasan kinerja. Immutability membuatnya sangat murah bagi komponen untuk membandingkan apakah datanya telah berubah atau tidak. Anda dapat mempelajari lebih lanjut tentang bagaimana React memilih kapan harus me-*render* ulang sebuah komponen di [referensi API `memo`](/reference/react/memo).

### Bergiliran {/*taking-turns*/}

Sekarang saatnya untuk memperbaiki kekurangan utama dalam gim *tic-tac-toe* ini: huruf "O" tidak dapat ditandai di papan permainan.

Anda akan mengatur langkah pertama menjadi "X" secara default. Mari kita pantau hal ini dengan menambahkan satu lagi state ke komponen Board:

```js {2}
function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));

  // ...
}
```

Setiap kali pemain bergerak, `xIsNext` (sebuah boolean) akan dibalik untuk menentukan pemain mana yang akan bergerak selanjutnya dan state permainan akan disimpan. Anda akan memperbarui fungsi `handleClick` pada `Board` untuk membalik nilai `xIsNext`:

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

Sekarang, saat Anda mengeklik kotak yang berbeda, kotak-kotak itu akan bergantian antara `X` dan `O`, sebagaimana mestinya!

Tapi tunggu, ada masalah. Coba klik kotak yang sama beberapa kali:

![Tanda O menimpa X](../images/tutorial/o-replaces-x.gif)

Tanda `X` ditimpa oleh tanda `O`! Meskipun hal ini akan menambah sentuhan yang sangat menarik pada gim ini, kami akan tetap berpegang pada aturan asli untuk saat ini.

Ketika Anda menandai kotak dengan `X` atau `O`, Anda tidak memeriksa terlebih dahulu apakah kotak tersebut telah memiliki nilai `X` atau `O`. Anda dapat memperbaikinya dengan *return lebih awal*. Anda akan memeriksa apakah kotak tersebut sudah memiliki nilai `X` atau `O`. Jika kotak sudah terisi, Anda akan `return` dalam fungsi `handleClick` lebih awal--sebelum fungsi ini mencoba untuk meng-update state papan.

```js {2,3,4}
function handleClick(i) {
  if (squares[i]) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Sekarang Anda hanya dapat menambahkan tanda `X` atau `O` pada kotak kosong! Berikut adalah tampilan kode Anda pada saat ini:

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

### Memutuskan pemenang {/*declaring-a-winner*/}

Sekarang setelah para pemain dapat bergiliran, Anda ingin menunjukkan kapan permainan dimenangkan dan tidak ada lagi giliran yang harus dilakukan. Untuk melakukan ini, Anda akan menambahkan fungsi pembantu yang disebut `calculateWinner` yang mengambil sebuah senarai berisi 9 kotak, memeriksa pemenang dan mengembalikan `'X'`, `'O'`, atau `null` yang sesuai. Jangan terlalu khawatir dengan fungsi `calculateWinner`; fungsi ini tidak spesifik terhadap React:

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

Tidak masalah apakah Anda mendefinisikan `calculateWinner` sebelum atau sesudah `Board`. Letakkan di bagian akhir agar Anda tidak perlu menggulir melawatinya setiap kali mengedit komponen.

</Note>

Anda akan memanggil `calculateWinner(squares)` dalam fungsi `handleClick` komponen `Board` untuk memeriksa apakah pemain telah menang. Anda dapat melakukan pengecekan ini bersamaan dengan pengecekan apakah pengguna telah mengklik kotak yang telah memiliki tanda `X` atau `O`. Kita ingin kembali lebih awal dalam kedua kasus tersebut:

```js {2}
function handleClick(i) {
  if (squares[i] || calculateWinner(squares)) {
    return;
  }
  const nextSquares = squares.slice();
  //...
}
```

Untuk memberi tahu para pemain ketika permainan berakhir, Anda dapat menampilkan teks seperti "Pemenang: X" atau "Pemenang: O". Untuk melakukannya, Anda akan menambahkan bagian `status` ke komponen `Board`. Status akan menampilkan pemenang jika permainan selesai dan jika permainan sedang berlangsung, Anda akan menampilkan giliran pemain berikutnya:

```js {3-9,13}
export default function Board() {
  // ...
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Pemenang: " + winner;
  } else {
    status = "Pemain selanjutnya: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        // ...
  )
}
```

Selamat! Anda sekarang memiliki permainan *tic-tac-toe* yang berfungsi. Dan Anda juga baru saja mempelajari dasar-dasar React. Jadi, _Anda_ adalah pemenang sebenarnya di sini. Berikut ini adalah tampilan kodenya:

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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

## Menambahkan perjalanan waktu {/*adding-time-travel*/}

Sebagai latihan terakhir, mari kita memungkinkan untuk "kembali ke masa lalu" ke gerakan sebelumnya dalam permainan ini.

### Menyimpan riwayat gerakan {/*storing-a-history-of-moves*/}

Jika Anda memutasi senarai `squares`, mengimplementasikan perjalanan waktu akan sangat sulit.

Namun, Anda menggunakan `slice()` untuk membuat salinan baru dari senarai `squares` setelah setiap perpindahan, dan memperlakukannya sebagai immutable. Hal ini akan memungkinkan Anda untuk menyimpan setiap versi senarai `squares` sebelumnya, dan menavigasi di antara giliran yang telah terjadi.

Anda akan menyimpan senarai `squares` sebelumnya dalam senarai lain yang disebut `history`, yang akan Anda simpan sebagai variabel state baru. Senarai `history` merepresentasikan semua state papan, dari langkah pertama hingga terakhir, dan memiliki bentuk seperti ini:

```jsx
[
  // Sebelum langkah pertama
  [null, null, null, null, null, null, null, null, null],
  // Setelah langkah pertama
  [null, null, null, null, 'X', null, null, null, null],
  // Setelah langkah kedua
  [null, null, null, null, 'X', null, null, null, 'O'],
  // ...
]
```

### Memindahkan state ke atas, lagi {/*lifting-state-up-again*/}

Sekarang Anda akan menulis komponen tingkat atas baru yang disebut `Game` untuk menampilkan daftar gerakan sebelumnya. Di situlah Anda akan menempatkan state `history` yang berisi riwayat permainan.

Menempatkan state `history` ke dalam komponen `Game` akan membuat Anda dapat menghapus state `squares` dari komponen `Board` turunannya. Sama seperti Anda "mengangkat state" dari komponen `Square` ke dalam komponen `Board`, sekarang Anda akan mengangkatnya dari `Board` ke dalam komponen `Game` tingkat atas. Hal ini memberikan komponen `Game` kontrol penuh atas data `Board` dan memungkinkannya menginstruksikan `Board` untuk me-*render* giliran sebelumnya dari `history`.

Pertama, tambahkan komponen `Game` dengan `export default`. Buatlah ia me-*render* komponen `Board` dan beberapa markup:

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

Perhatikan bahwa Anda menghapus kata kunci `export default` sebelum deklarasi `function Board() {` dan menambahkannya sebelum deklarasi `function Game() {`. Hal ini memberi tahu file `index.js` Anda untuk menggunakan komponen `Game` sebagai komponen tingkat atas, bukan komponen `Board`. Tambahan `div` yang dikembalikan oleh komponen `Game` menyediakan ruang untuk informasi permainan yang akan Anda tambahkan ke papan nanti.

Tambahkan state ke komponen `Game` untuk melacak pemain mana yang berikutnya dan riwayat gerakan:

```js {2-3}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // ...
```

Perhatikan bagaimana `[Array(9).fill(null)]` adalah sebuah senarai dengan satu item, yang merupakan senarai dari 9 buah `null`.

Untuk me-*render* kotak untuk pergerakan saat ini, Anda perlu membaca senarai kotak terakhir dari `history`. Anda tidak membutuhkan `useState` untuk ini - Anda sudah memiliki informasi yang cukup untuk menghitungnya selama render:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  // ...
```

Selanjutnya, buat fungsi `handlePlay` di dalam komponen `Game` yang akan dipanggil oleh komponen `Board` untuk memperbarui permainan. Berikan `xIsNext`, `currentSquares` dan `handlePlay` sebagai props ke komponen `Board`:

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

Mari kita buat komponen `Board` dikontrol sepenuhnya oleh props yang diterimanya. Ubah komponen `Board` untuk mengambil tiga props: `xIsNext`, `squares`, dan fungsi `onPlay` baru yang dapat dipanggil oleh `Board` dengan senarai kotak yang telah diperbarui saat pemain melakukan gerakan. Selanjutnya, hapus dua baris pertama dari fungsi `Board` yang memanggil `useState`:

```js {1}
function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    //...
  }
  // ...
}
```

Sekarang ganti panggilan `setSquares` dan `setXIsNext` di `handleClick` di komponen `Board` dengan satu panggilan ke fungsi `onPlay` yang baru, sehingga komponen `Game` dapat memperbarui `Board` saat pengguna mengeklik kotak:

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

Komponen `Board` sepenuhnya dikendalikan oleh props yang diteruskan oleh komponen `Game`. Anda perlu mengimplementasikan fungsi `handlePlay` di komponen `Game` untuk membuat game bekerja kembali.

Apa yang harus dilakukan oleh `handlePlay` ketika dipanggil? Ingat bahwa Board digunakan untuk memanggil `setSquares` dengan senarai yang telah diperbarui; sekarang fungsi ini meneruskan senarai `squares` yang telah diperbarui ke `onPlay`.

Fungsi `handlePlay` perlu memperbarui state `Game` untuk memicu render ulang, tetapi Anda tidak memiliki fungsi `setSquares` yang bisa Anda panggil lagi--Anda sekarang menggunakan variabel state `history` untuk menyimpan informasi ini. Anda perlu memperbarui `history` dengan menambahkan senarai `squares` yang telah diperbarui sebagai entri history baru. Anda juga ingin mengganti `xIsNext`, seperti yang dilakukan oleh Board:

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

Di sini, `[...history, nextSquares]` membuat senarai baru yang berisi semua item dalam `history`, diikuti dengan `nextSquares`. (Anda dapat membaca [*sintaks spread*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...history` sebagai "mencacah semua item dalam `history`".)

Sebagai contoh, jika `history` adalah `[[null,null,null], ["X",null,null]]` dan `nextSquares` adalah `["X",null, "O"]`, maka senarai `[...history, nextSquares]` yang baru adalah `[[null,null,null], ["X",null,null], ["X",null,"O"]]`.

Pada titik ini, Anda telah memindahkan state untuk berada di komponen `Game`, dan UI seharusnya berfungsi penuh, sama seperti sebelum refactor. Berikut adalah tampilan kode yang seharusnya pada saat ini:

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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

### Menampilkan gerakan masa lalu {/*showing-the-past-moves*/}

Karena Anda merekam riwayat permainan *tic-tac-toe* ini, Anda sekarang dapat menampilkan daftar gerakan sebelumnya kepada pemain.

Elemen React seperti `<button>` adalah objek JavaScript biasa; Anda dapat mengopernya di dalam aplikasi Anda. Untuk me-*render* beberapa item di React, Anda dapat menggunakan senarai elemen-elemen React.

Anda telah memiliki sebuah senarai `history` yang merupakan sejarah gerakan dalam state, jadi sekarang Anda perlu mengubahnya menjadi sebuah array elemen React. Dalam JavaScript, untuk mengubah satu senarai menjadi senarai lainnya, Anda dapat menggunakan metode [array `map`:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)

```jsx
[1, 2, 3].map((x) => x * 2) // [2, 4, 6]
```

Anda akan menggunakan `map` untuk mengubah `history` gerakan Anda menjadi elemen React yang merepresentasikan tombol di layar, dan menampilkan daftar tombol untuk "melompat" ke gerakan sebelumnya. Mari kita melakukan `map` pada `history` dalam komponen Game:

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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

Anda dapat melihat tampilan kode Anda di bawah ini. Perhatikan bahwa Anda akan melihat error pada konsol *developer tools* yang bertuliskan: ``Warning: Each child in an array or iterator should have a unique "key" prop. Check the render method of `Game`.`` Anda akan memperbaiki error ini di bagian selanjutnya.

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

Saat Anda mengulang senarai `history` di dalam fungsi yang Anda berikan ke `map`, argumen `squares` melewati setiap elemen dari `history`, dan argumen `move` melewati setiap indeks senarai: `0`, `1`, `2`, …. (Pada kebanyakan kasus, Anda akan membutuhkan elemen senarai yang sebenarnya, namun untuk membuat daftar gerakan, Anda hanya membutuhkan indeks.)

Untuk setiap langkah dalam riwayat permainan tic-tac-toe, Anda membuat item daftar `<li>` yang berisi tombol `<button>`. Tombol ini memiliki sebuah handler `onClick` yang memanggil sebuah fungsi yang disebut `jumpTo` (yang belum Anda implementasikan).

Untuk saat ini, Anda akan melihat daftar gerakan yang terjadi di dalam game dan error di konsol *developer tools*. Mari kita bahas apa arti dari error "key".

### Memilih key {/*picking-a-key*/}

Ketika Anda me-*render* sebuah list, React menyimpan beberapa informasi tentang setiap item list yang di-render. Ketika Anda memperbarui list, React perlu menentukan apa yang telah berubah. Anda bisa saja menambahkan, menghapus, mengatur ulang, atau memperbarui item pada list.

Bayangkan pergantian dari

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

menjadi

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Selain jumlah yang diperbarui, manusia yang membaca ini mungkin akan mengatakan bahwa Anda menukar urutan Alexa dan Ben dan menyisipkan Claudia di antara Alexa dan Ben. Namun, React adalah program komputer dan tidak dapat mengetahui apa yang Anda maksudkan, sehingga Anda perlu menentukan props _key_ untuk setiap item list untuk membedakan setiap item list dari saudaranya. Jika data Anda berasal dari database, ID database Alexa, Ben, dan Claudia dapat digunakan sebagai key.

```js {1}
<li key={user.id}>
  {user.name}: {user.taskCount} tasks left
</li>
```

Ketika sebuah list di-render ulang, React mengambil key dari setiap item list dan mencari item list sebelumnya untuk mendapatkan key yang cocok. Jika list saat ini memiliki key yang tidak ada sebelumnya, React akan membuat sebuah komponen. Jika list saat ini tidak memiliki key yang ada di list sebelumnya, React akan menghancurkan komponen sebelumnya. Jika dua key cocok, komponen yang sesuai akan dipindahkan.

Key memberi tahu React tentang identitas setiap komponen, yang memungkinkan React untuk mempertahankan state di antara render ulang. Jika key sebuah komponen berubah, komponen tersebut akan dihancurkan dan dibuat ulang dengan state yang baru.

`key` adalah props khusus dan dicadangkan di React. Ketika sebuah elemen dibuat, React mengekstrak properti `key` dan menyimpan key secara langsung pada elemen yang dikembalikan. Meskipun `key` mungkin terlihat seperti dioper sebagai properti, React secara otomatis menggunakan `key` untuk menentukan komponen mana yang akan diperbarui. Tidak ada cara bagi sebuah komponen untuk menanyakan `key` apa yang ditentukan oleh induknya.

**Sangat disarankan agar Anda menentukan key yang tepat setiap kali Anda membuat list dinamis.** Jika Anda tidak memiliki kunci yang sesuai, Anda dapat mempertimbangkan untuk merestrukturisasi data Anda agar memiliki key yang sesuai.

Jika tidak ada key yang ditentukan, React akan melaporkan error dan menggunakan indeks senarai sebagai key secara default. Menggunakan indeks senarai sebagai key akan menjadi masalah ketika mencoba mengurutkan ulang item dalam list atau menyisipkan/menghapus item dalam list. Secara eksplisit mengoper `key={i}` akan menghilangkan error tetapi memiliki masalah yang sama dengan indeks senarai dan tidak direkomendasikan dalam banyak kasus.

Key tidak perlu unik secara global; mereka hanya perlu unik di antara komponen dan saudaranya.

### Mengimplementasikan perjalanan waktu {/*implementing-time-travel*/}

Dalam riwayat permainan *tic-tac-toe*, setiap langkah sebelumnya memiliki ID unik yang terkait dengannya: ini adalah nomor urut langkah tersebut. Langkah tidak akan pernah diurutkan ulang, dihapus, atau disisipkan di tengah-tengah, jadi aman untuk menggunakan indeks langkah sebagai key.

Pada fungsi `Game`, Anda dapat menambahkan key sebagai `<li key={move}>`, dan jika Anda memuat ulang game yang telah di-render, error "key" pada React akan hilang:

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

Sebelum Anda dapat mengimplementasikan `jumpTo`, Anda memerlukan komponen `Game` untuk melacak langkah mana yang sedang dilihat oleh pengguna. Untuk melakukan ini, tentukan variabel state baru yang disebut `currentMove`, dengan nilai awal `0`:

```js {4}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[history.length - 1];
  //...
}
```

Selanjutnya, perbarui fungsi `jumpTo` di dalam `Game` untuk memperbarui `currentMove` tersebut. Anda juga akan mengatur `xIsNext` menjadi `true` jika angka yang Anda ubah menjadi `currentMove` adalah genap.

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

Anda sekarang akan membuat dua perubahan pada fungsi `handlePlay` pada `Game` yang dipanggil ketika Anda mengeklik sebuah kotak.

- Jika Anda "kembali ke masa lalu" dan kemudian membuat langkah baru dari titik tersebut, Anda hanya ingin menyimpan riwayat hingga titik tersebut. Alih-alih menambahkan `nextSquares` setelah semua item (sintaks spread `...`) di `history`, Anda akan menambahkannya setelah semua item di `history.slice(0, currentMove + 1)` sehingga Anda hanya menyimpan bagian dari riwayat lama.
- Setiap kali gerakan dilakukan, Anda perlu memperbarui `currentMove` untuk menunjuk ke entri riwayat terbaru.

```js {2-4}
function handlePlay(nextSquares) {
  const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
  setHistory(nextHistory);
  setCurrentMove(nextHistory.length - 1);
  setXIsNext(!xIsNext);
}
```

Terakhir, Anda akan memodifikasi komponen `Game` untuk me-*render* gerakan yang sedang dipilih, alih-alih selalu me-*render* gerakan terakhir:

```js {5}
export default function Game() {
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];

  // ...
}
```

Jika Anda mengeklik langkah mana pun dalam riwayat permainan, papan *tic-tac-toe* akan segera diperbarui untuk menunjukkan seperti apa papan tersebut setelah langkah itu terjadi.

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

### Pembersihan akhir {/*final-cleanup*/}

Jika Anda melihat kode tersebut dengan seksama, Anda mungkin melihat bahwa `xIsNext === true` ketika `currentMove` bernilai genap dan `xIsNext === false` ketika `currentMove` bernilai ganjil. Dengan kata lain, jika Anda mengetahui nilai dari `currentMove`, maka Anda selalu dapat mengetahui berapa nilai dari `xIsNext`.

Tidak ada alasan bagi Anda untuk menyimpan kedua nilai ini dalam state. Bahkan, selalu usahakan untuk menghindari state yang berlebihan. Menyederhanakan apa yang Anda simpan dalam state akan mengurangi bug dan membuat kode Anda lebih mudah dipahami. Ubah `Game` agar tidak menyimpan `xIsNext` sebagai variabel state yang terpisah dan sebagai gantinya mencari tahu berdasarkan `currentMove`:

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

Anda tidak lagi membutuhkan deklarasi state `xIsNext` atau pemanggilan `setXIsNext`. Sekarang, tidak ada kesempatan bagi `xIsNext` untuk tidak sinkron dengan `currentMove`, bahkan jika Anda melakukan kesalahan saat mengkodekan komponen.

### Penutup {/*wrapping-up*/}

Selamat! Anda telah membuat gim *tic-tac-toe* yang:

- Memungkinkan Anda bermain tic-tac-toe,
- Menunjukkan kapan seorang pemain telah memenangkan permainan,
- Menyimpan riwayat permainan saat permainan berlangsung,
- Memungkinkan pemain untuk meninjau riwayat permainan dan melihat versi sebelumnya dari papan permainan.

Kerja bagus! Kami harap Anda sekarang merasa memiliki pemahaman yang cukup baik tentang cara kerja React.

Lihat hasil akhirnya di sini:

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
    status = 'Pemenang: ' + winner;
  } else {
    status = 'Pemain selanjutnya: ' + (xIsNext ? 'X' : 'O');
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
      description = 'Pergi ke langkah #' + move;
    } else {
      description = 'Pergi ke awal permainan';
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

Jika Anda memiliki waktu tambahan atau ingin melatih keterampilan React yang baru, berikut ini adalah beberapa ide untuk peningkatan yang dapat Anda lakukan pada permainan tic-tac-toe ini, yang didaftarkan dalam urutan tingkat kesulitan:

1. Untuk langkah saat ini saja, tampilkan "Anda berada di langkah #..." sebagai pengganti tombol.
1. Tulis ulang `Board` untuk menggunakan dua loop untuk membuat kotak alih-alih mengodekannya.
1. Tambahkan tombol sakelar yang memungkinkan Anda mengurutkan langkah dalam urutan naik atau turun.
1. Ketika seseorang menang, sorot tiga kotak yang menyebabkan kemenangan tersebut (dan ketika tidak ada yang menang, tampilkan pesan bahwa hasilnya seri).
1. Menampilkan lokasi untuk setiap langkah dalam format (baris, kolom) dalam daftar riwayat langkah.

Di sepanjang tutorial ini, Anda telah mempelajari konsep-konsep React termasuk elemen, komponen, props, dan state. Sekarang Anda telah melihat bagaimana konsep-konsep ini bekerja ketika membuat sebuah game, lihat [Cara Berpikir dengan React](/learn/thinking-in-react) untuk melihat bagaimana konsep-konsep React yang sama bekerja ketika membuat UI aplikasi.
