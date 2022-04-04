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

Tutorial ini tidak membutuhkan pengetahuan tentang React sebelumnya. 

## Sebelum Kita Memulai Tutorial {#before-we-start-the-tutorial}

Kita akan membangun sebuah gim kecil sepanjang tutorial ini. **Anda bisa jadi tergoda untuk melewati tutorial ini karena Anda tidak benar-benar membuat gim -- namun luangkanlah sedikit waktu untuk mencobanya.** Teknik-teknik yang akan Anda pelajari pada tutorial ini adalah hal-hal dasar yang digunakan untuk membangun aplikasi React, dan menguasai teknik-teknik tersebut akan memberikan pemahaman terhadap React secara lebih mendalam.

>Tips
>
>Tutorial ini didesain untuk orang yang lebih suka **belajar dengan mempraktikkan**. Jika Anda lebih suka mempelajari konsep dari tingkat dasar sampai tingkat lanjut, lihat [panduan langkah demi langkah](/docs/hello-world.html) kami. Anda akan menyadari bahwa tutorial dan panduan akan saling melengkapi.

Tutorial ini akan dibagi menjadi beberapa bagian:

* [Mempersiapkan Tutorial](#setup-for-the-tutorial) merupakan **titik awal** Anda untuk mengikuti tutorial.
* [Ikhtisar](#overview) bagian ini berisi **hal-hal mendasar** React: komponen, *props*, dan *state*.
* [Menyelesaikan Permainan](#completing-the-game) bagian ini berisi **teknik-teknik yang paling umum** pada pengembangan aplikasi React.
* [Menambahkan Penjelajahan Waktu](#adding-time-travel) bagian ini akan memberikan **pemahaman yang lebih mendalam** pada kekuatan unik dari React.

Anda tidak perlu menyelesaikan semua bagian sekaligus untuk mendapatkan pembelajaran dari tutorial ini. Cobalah mengerjakan semampu Anda -- walaupun hanya satu atau dua bagian.

### Apa yang Kita Kembangkan? {#what-are-we-building}

Dalam tutorial ini, kami akan menunjukkan cara membuat permainan *tic-tac-toe* interaktif menggunakan React.

Anda dapat melihat gambaran aplikasi yang akan kita buat di sini: **[Hasil Akhir](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**. Jika kode tersebut tidak masuk akal untuk Anda, atau Anda tidak akrab dengan sintaks kode tersebut, jangan khawatir! Tujuan dari tutorial ini adalah untuk membantu Anda mengerti React dan sintaksnya.

Kami merekomendasikan Anda untuk mencari tahu tentang permainan *tic-tac-toe* sebelum melanjutkan tutorial ini. Salah satu fitur yang akan Anda lihat adalah adanya daftar bernomor di sebelah kanan papan permainan. Daftar ini memberikan Anda semua riwayat langkah yang sudah terjadi dalam permainan, dan terus diperbarui selama permainan berlangsung.

Anda bisa menutup laman permainan *tic-tac-toe* setelah Anda paham dengan permainan tersebut. Kita akan memulai dari templat sederhana pada tutorial ini. Langkah selanjutnya adalah mempersiapkan Anda sehingga Anda dapat memulai mengembangkan permainan *tic-tac-toe*.

### Prasyarat {#prerequisites}

Kami mengasumsikan bahwa Anda memiliki pemahaman akan HTML dan JavaScript, namun Anda seharusnya tetap dapat mengikuti tutorial ini jika Anda memiliki pemahaman pada bahasa pemrograman lainnya. Kami juga berasumsi bahwa Anda memiliki pemahaman akan konsep pemrograman seperti fungsi, objek, senarai, dan pada tingkat yang lebih rendah, kelas.

Jika Anda memerlukan pengingat tentang JavaScript, kami merekomendasikan Anda untuk membaca [panduan ini](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript). Perlu diperhatikan juga bahwa kita menggunakan beberapa fitur dari ES6 -- versi terbaru JavaScript. Di tutorial ini, kita menggunakan *statement* *[arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)*, [kelas](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let), dan [`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const). Anda dapat menggunakan [Babel REPL](babel://es5-syntax-example) untuk melihat hasil kompilasi kode ES6.

## Mempersiapkan Tutorial {#setup-for-the-tutorial}

Ada dua cara untuk menyelesaikan tutorial ini: Anda dapat menulis kode pada *browser* Anda atau mempersiapkan *local development environment* pada komputer Anda.

### Persiapan Cara 1: Menulis Kode pada Browser {#setup-option-1-write-code-in-the-browser}

Ini adalah cara tercepat untuk memulai!

Pertama, buka **[kode permulaan](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)** ini pada *tab* baru. *Tab* baru tersebut seharusnya menunjukan papan permainan *tic-tac-toe* yang kosong dan kode React. Kita akan mengedit kode React tersebut pada tutorial ini.

Anda dapat melewati cara kedua untuk persiapan dan menuju ke bagian [Ikhtisar](#overview) untuk mendapatkan ikhtisar dari React.

### Persiapan Cara 2: Local Development Environment {#setup-option-2-local-development-environment}

Cara ini murni opsional dan tidak wajib pada tutorial ini!

<br>

<details>

<summary><b>Opsional: Instruksi untuk mengikuti secara lokal menggunakan editor teks pilihan Anda</b></summary>

Persiapan ini membutuhkan lebih banyak langkah tetapi membuat Anda dapat menyelesaikan tutorial ini menggunakan editor teks pilihan Anda. Berikut adalah beberapa langkah yang harus diikuti:

1. Pastikan Anda sudah meng-*install* [Node.js](https://nodejs.org/en/) versi terbaru.
2. Ikuti [langkah instalasi Create React App](/docs/create-a-new-react-app.html#create-react-app) untuk membuat *project* baru.

```bash
npx create-react-app my-app
```

3. Hapus semua *file* pada folder `src/` dari *project* baru Anda.

> Catatan: **jangan hapus seluruh folder `src`, cukup *file-file* yang ada di dalamnya saja.** Kita akan menggantikan *file-file* tersebut dengan contoh-contoh yang akan diberikan melalui tutorial ini.

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

4. Tambahkan *file* bernama `index.css` ke dalam folder `src/` dengan [kode CSS ini](https://codepen.io/gaearon/pen/oWWQNa?editors=0100).

5. Tambahkan *file* bernama `index.js` ke dalam folder `src/` dengan [kode JS ini](https://codepen.io/gaearon/pen/oWWQNa?editors=0010).

6. Tambahkan tiga baris kode berikut pada bagian paling atas `index.js` di dalam folder `src/`:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
```

Sekarang, jika Anda menjalankan `npm start` pada folder *project* Anda dan mengakses `http://localhost:3000` pada *browser* Anda, Anda akan melihat papan *tic-tac-toe* yang kosong.

Kami merekomendasikan Anda untuk mengikuti [instruksi ini](https://babeljs.io/docs/editors/) untuk mengkonfigurasi *syntax highlighting* untuk editor Anda.

</details>

### Tolong, Saya Mengalami Masalah! {#help-im-stuck}

Jika Anda mengalami masalah, silahkan kunjungi [sumber dukungan komunitas](/community/support.html). Secara khusus, [Reactiflux Chat](https://discord.gg/reactiflux) adalah langkah yang baik untuk mendapat bantuan dengan cepat. Jika Anda tidak mendapat jawaban, atau tetap mengalami masalah, maka silahkan mengajukan *issue*, dan kami akan membantu Anda.

## Ikhtisar {#overview}

Sekarang karena Anda sudah siap, mari mempelajari ikhtisar dari React!

### Apa Itu React? {#what-is-react}

React adalah *library* JavaScript yang deklaratif, efisien, dan fleksibel untuk membangun antarmuka pengguna. React memungkinkan Anda untuk membuat antarmuka kompleks dari kumpulan kode yang kecil dan terisolasi yang disebut "komponen".

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

Kita akan membahas *tag* aneh yang seperti XML sesaat lagi. Kita menggunakan komponen untuk memberi tahu React yang ingin kita lihat pada layar. Ketika data kita berubah, React akan memperbarui dan me-*render* ulang komponen kita dengan efisien.

Di sini, ShoppingList adalah **kelas komponen React** atau **tipe komponen React**. Sebuah komponen dapat menerima parameter yang disebut dengan *`props`* (singkatan dari *`properties`*) dan mengembalikan sebuah hirarki dari tampilan-tampilan yang akan ditampilkan via *method* `render`.

*Method* `render` mengembalikan sebuah *deskripsi* dari benda yang akan Anda lihat pada layar. React mengambil deskripsi tersebut dan menampilkan hasilnya ke layar. Secara khusus, `render` mengembalikan **elemen React**, yang merupakan deskripsi ringan tentang yang harus di-`render`. Kebanyakan pengembang React menggunakan sintaks khusus yang disebut "JSX" yang memudahkan struktur dari React mudah untuk ditulis. Sintaks `<div />` akan diubah menjadi `React.createElement('div')` pada saat *build*. Contoh di atas sama dengan sintaks berikut:

```javascript
return React.createElement('div', {className: 'shopping-list'},
  React.createElement('h1', /* ... h1 children ... */),
  React.createElement('ul', /* ... ul children ... */)
);
```

[Lihat versi lengkap.](babel://tutorial-expanded-version)

Jika Anda penasaran, `createElement()` dideskripsikan dengan lebih rinci pada bagian [referensi API](/docs/react-api.html#createelement), tetapi kita tidak akan menggunakannya pada tutorial ini. Kita akan tetap menggunakan JSX.

JSX hadir dengan kekuatan penuh dari JavaScript. Anda dapat menulis *setiap* ekspresi JavaScript di antara tanda kurung kurawal di dalam JSX. Setiap elemen React adalah objek JavaScript yang dapat Anda simpan di dalam variabel atau Anda oper ke seputar program Anda.

Komponen `ShoppingList` di atas hanya me-*render* komponen DOM *built-in* seperti `<div />` dan `<li />`. Namun, Anda juga dapat membuat dan me-*render* komponen React Anda sendiri. Contohnya, kita dapat mengacu ke seluruh daftar belanja di atas dengan menuliskan `<ShoppingList />`. Setiap komponen React terenkapsulasi dan dapat beroperasi secara mandiri; hal ini memungkinkan Anda untuk membangun sebuah antarmuka pengguna yang kompleks dari komponen sederhana.

<<<<<<< HEAD
## Melihat Kode Permulaan {#inspecting-the-starter-code}
=======
### Inspecting the Starter Code {#inspecting-the-starter-code}
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Jika Anda akan mengikuti tutorial ini **di *browser* Anda**, buka kode ini pada *tab* baru: **[Kode Permulaan](https://codepen.io/gaearon/pen/oWWQNa?editors=0010)**. Jika Anda mengikuti tutorial ini dengan *local environment* Anda, bukalah `src/index.js` pada folder *project* Anda (Anda sudah pernah menyentuh *file* ini selama [persiapan](#setup-option-2-local-development-environment)).

Kode Permulaan ini berdasarkan pada aplikasi yang akan kita buat. Kami sudah menyediakan *style CSS* sehingga Anda bisa fokus mempelajari React dan memprogram permainan *tic-tac-toe*.

Dengan melihat kode permulaan, Anda akan melihat bahwa kita memiliki tiga komponen React:

* Square
* Board
* Game

Komponen Square akan me-*render* sebuah `<button>` dan komponen Board akan me-*render* 9 persegi. Komponen Game akan me-*render* sebuah papan dengan nilai sementara yang akan kita ganti nanti. Saat ini belum ada komponen interaktif.

### Mengoper Data Melalui Props {#passing-data-through-props}

Untuk memulai mendalami React, mari kita mencoba untuk mengoper data dari komponen Board ke komponen Square kita.

Kami menyarankan mengetik kode-kode berikut secara manual selama Anda mengikuti tutorial ini dan menghindari menggunakan *copy*/*paste*. Ini akan membantu mengembangkan memori otot Anda dan meningkatkan pemahaman Anda mengenai React.

Di dalam *method* `renderSquare` Board, ubah kodenya untuk mengoperkan *prop* bernama `value` ke Square:

```js{3}
class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />;
  }
}
```

Ubah *method* `render` Square untuk menampilkan nilai tersebut dengan mengganti `{/* TODO */}` dengan `{this.props.value}`:

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

Sesudah: Anda seharusnya melihat angka dari setiap persegi pada keluaran yang telah di-*render*.

![React Devtools](../images/tutorial/tictac-numbers.png)

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/aWWQOG?editors=0010)**

Selamat! Anda baru saja "mengoperkan sebuah *prop*" dari komponen Board ke komponen Square. Mengoperkan *props* adalah cara informasi dapat mengalir dalam aplikasi React dari (komponen) induk ke anak.

### Membuat Komponen Interaktif {#making-an-interactive-component}

Mari mengisi komponen Square dengan sebuah "X" ketika kita mengklik komponen tersebut.
Pertama, ubah *button tag* yang dikembalikan dari fungsi `render()` komponen Square menjadi:

```javascript{4}
class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={function() { console.log('click'); }}>
        {this.props.value}
      </button>
    );
  }
}
```

<<<<<<< HEAD
Jika kita mengklik salah satu Square, kita akan mendapatkan *alert* pada *browser* kita.
=======
If you click on a Square now, you should see 'click' in your browser's devtools console.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

>Catatan
>
>Untuk mempercepat proses mengetik dan menghindari [perilaku membingungkan `this`](https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/), kita akan menggunakan [sintaks *arrow function*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) untuk setiap *event handler* yang akan kita buat:
>
>```javascript{4}
>class Square extends React.Component {
>  render() {
>    return (
>      <button className="square" onClick={() => console.log('click')}>
>        {this.props.value}
>      </button>
>    );
>  }
>}
>```
>
<<<<<<< HEAD
>Perhatikan bahwa dengan `onClick={() => alert('click')}`, kita mengoperkan *sebuah fungsi* sebagai *prop* `onClick`. Fungsi tersebut hanya dieksekusi setelah klik. Lupa untuk menulis `() =>` dan menulis `onClick={alert('click')}` adalah kesalahan yang sering terjadi, dan menyebabkan fungsi akan terus dijalankan setiap komponen di-*render* ulang.
=======
>Notice how with `onClick={() => console.log('click')}`, we're passing *a function* as the `onClick` prop. React will only call this function after a click. Forgetting `() =>` and writing `onClick={console.log('click')}` is a common mistake, and would fire every time the component re-renders.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Selanjutnya, kita ingin agar komponen Square "mengingat" bahwa komponen tersebut sudah diklik dan mengisinya dengan "X". Untuk "mengingat" sesuatu, komponen menggunakan **_state_**.

Komponen React dapat memiliki *state* dengan mengatur `this.state` pada konstruktornya. `this.state` harus dianggap *private* oleh komponen React tempat ia didefinisikan. Mari menyimpan nilai Square saat ini pada `this.state` dan mengubahnya ketika Square diklik.

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
      <button className="square" onClick={() => console.log('click')}>
        {this.props.value}
      </button>
    );
  }
}
```

>Catatan
>
>Pada [kelas JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes), Anda harus selalu memanggil `super` ketika mendefinisikan konstruktor dari sebuah subkelas. Semua kelas komponen React yang memiliki `constructor` harus dimulai dengan `super(props)`.

Sekarang kita akan mengubah *method* `render` Square untuk menampilkan nilai *state* saat ini ketika diklik:

* Mengganti `this.props.value` dengan `this.state.value` di dalam `<button>` *tag*.
* Mengganti *event handler* `onClick={...}` dengan `onClick={() => this.setState({value: 'X'})}`.
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

Dengan memanggil `this.setState` dari *handler* `onClick` pada *method* `render` Square, kita memberi tahu React untuk me-*render* ulang Square setiap `<button>` diklik. Setelah diperbarui, `this.state.value` dari Square akan menjadi `'X'`, jadi kita akan melihat `X` pada papan permainan. Jika Anda mengklik salah satu Square, maka akan muncul `X`.

Ketika Anda memanggil `setState` di sebuah component, React akan memperbarui komponen anak di dalamnya secara otomatis.

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/VbbVLg?editors=0010)**

### Developer Tools {#developer-tools}

Ekstensi React Devtools untuk [Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) dan [Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)
memungkinkan Anda untuk melihat pohon komponen dari React dengan menggunakan perangkat pengembang *browser* Anda.

<img src="../images/tutorial/devtools.png" alt="React Devtools" style="max-width: 100%">

React Devtools memungkinkan Anda untuk mengecek *props* dan *state* dari komponen React Anda.

Setelah meng-*install* React Devtools, Anda dapat mengklik kanan elemen manapun pada halaman Anda, kemudian klik "Inspect" untuk membuka perangkat pengembang dan *tab* React ("⚛️ Components" and "⚛️ Profiler") akan muncul sebagai *tab* terakhir di sebalah kanan. Gunakan "⚛️ Components" untuk menginspeksi pohon komponen.

**Walaupun demikian, perlu diperhatikan bahwa ada beberapa langkah tambahan untuk membuat aplikasi Anda bekerja dengan CodePen:**

1. Masuk atau daftar dan konfirmasi email Anda (diperlukan untuk mencegah *spam*)
2. Klik tombol "Fork".
3. Klik "Change View" dan pilih "Debug mode".
4. Pada *tab* baru yang terbuka, *devtools* saat ini seharusnya memiliki *tab* React.

## Menyelesaikan Permainan {#completing-the-game}

Sekarang kita sudah memiliki blok-blok dasar untuk membangun permainan *tic-tac-toe*. Untuk menyelesaikan permainan ini, kita memerlukan penempatan alternatif "X" dan "O" pada papan dan kita memerlukan cara untuk menentukan pemenangnya.

### Menaikkan State {#lifting-state-up}

Saat ini, setiap komponen Square mengurus *state* dari permainan. Untuk menentukan pemenang, kita akan mengurus nilai dari setiap persegi di satu lokasi.

Kita dapat memikirkan Board seharusnya cukup mengambil *state* setiap Square. Walaupun pendekatan ini mungkin di React, tetapi kami tidak menyarankannya karena kodenya akan sulit untuk dimengerti, rentan terhadap *bugs*, dan sulit untuk di-*refactor*. Sebagai gantinya, pendekatan terbaik untuk adalah untuk menyimpan *state* dari permainan pada komponen Board. Komponen Board dapat memberitahu setiap Square untuk menampilkan data dengan memberikannya melalui *prop* [seperti yang kita lakukan saat kita memberikan angka ke setiap Square](#passing-data-through-props).

**Untuk mengambil data dari beberapa anak atau membuat dua komponen anak berkomunikasi satu sama lain, Anda perlu mendeklarasikan *state* pada komponen induk. Komponen induk dapat memberikan *state* ke anak dengan menggunakan *props*; pola ini dapat membuat komponen-komponen anak tetap sinkron satu sama lain dan dengan komponen induk.**

Menaikkan *state* ke komponen induk lazim ketika me-*refactor* komponen React. Mari memanfaatkan kesempatan ini untuk mencobanya.

Kita akan menambahkan konstruktor ke Board dan menginisialisasi *state* dari Board berisi array dengan 9 *null*. Sembilan nilai ini melambangkan 9 persegi:

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
```

Ketika kita mengisi papan permainan nanti, senarai `this.state.squares` akan terlihat seperti ini:

```javascript
[
  'O', null, 'X',
  'X', 'X', 'O',
  'O', null, null,
]
```

*Method* `renderSquare` dari Board saat ini terlihat seperti ini:

```javascript
  renderSquare(i) {
    return <Square value={i} />;
  }
```

Awalnya, kita [mengoperkan *prop value*](#passing-data-through-props) dari Board untuk menampilkan angka 0 sampai 8 di setiap Square. Pada langkah berbeda sebelumnya, kita menggantikan angka dengan "X" yang [ditentukan oleh *state* dari Square itu sendiri](#making-an-interactive-component). Ini sebabnya Square saat ini mengabaikan *prop* `value` yang diberikan oleh Board.

Sekarang kita akan menggunakan mekanisme pengoperan *prop* lagi. Kita akan memodifikasi Board untuk memberi instruksi pada setiap Square untuk mengubah nilai saat ini (`'X'`, `'O'`, atau `null`). Kita sudah mendefinisikan senarai `squares` pada konstruktor Board dan kita akan memodifikasi *method* `renderSquare` Board untuk membaca dari state:

```javascript{2}
  renderSquare(i) {
    return <Square value={this.state.squares[i]} />;
  }
```

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/gWWQPY?editors=0010)**

Setiap Square akan menerima *prop* `value` yang dapat berupa `'X'`, `'O'`, atau `null` untuk persegi kosong.

Selanjutnya, kita perlu mengubah perilaku Square saat diklik. Komponen Board saat ini mengatur persegi yang sedang diisi. Kita perlu memikirkan sebuah cara agar Square dapat memperbarui *state* di Board. Karena *state* dianggap sebagai *private* di dalam suatu komponen, kita tidak dapat mengubah *state* Board melalui Square secara langsung.

Untuk mempertahankan *state privacy* dari Board, kita akan memberikan sebuah fungsi dari Board ke Square. Fungsi ini akan dipanggil ketika komponen Square diklik. Kita akan mengubah *method* `renderSquare` di dalam Board menjadi:

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

>Catatan
>
>Kita membagi elemen yang dikembalikan menjadi beberapa baris agar lebih mudah dibaca. Kami juga menambahkan tanda kurung sehingga JavaScript tidak menyisipkan titik koma setelah `return` dan merusak kode kita.

Sekarang kita memberikan dua *prop* dari Board ke Square: `value` dan `onClick`. *Prop* `onClick` adalah sebuah fungsi yang dapat dipanggil oleh Square ketika diklik. Kita akan membuat perubahan berikut pada Square:

* Mengganti `this.state.value` dengan `this.props.value` pada *method* `render` Square.
* Mengganti `this.setState()` dengan `this.props.onClick()` pada *method* `render` Square.
* Menghapus `constructor` Square karena Square sudah tidak menyimpan *state* dari permainan.

Setelah perubahan tersebut, komponen Square akan terlihat seperti ini:

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

Ketika sebuah Square diklik, fungsi `onClick` yang disediakan oleh Board akan dipanggil. Berikut adalah ulasan bagaimana kita dapat memperoleh hasil saat ini:

<<<<<<< HEAD
1. *Prop* `onClick` pada komponen *built-in DOM* `<button>` memberi tahu React untuk menyiapkan *event listener* klik.
2. Ketika tombol diklik, React akan memanggil *event handler* `onClick` yang sudah didefinisikan pada *method* `render()` Square.
3. *Event handler* ini memanggil `this.props.onClick()`. *Prop* `onClick` dari Square ditentukan oleh Board.
4. Karena Board mengoperkan `onClick={() => this.handleClick(i)}` ke Square, Square memanggil `this.handleClick(i)` ketika diklik.
5. Kita belum mendefinisikan *method* `handleClick()`, sehingga kode kita akan *crash*. Ketika Anda mengeklik sebuah persegi, Anda akan melihat teks *error* berwarna merah yang bertuliskan semacam *"this.handleClick is not a function"*.
=======
1. The `onClick` prop on the built-in DOM `<button>` component tells React to set up a click event listener.
2. When the button is clicked, React will call the `onClick` event handler that is defined in Square's `render()` method.
3. This event handler calls `this.props.onClick()`. The Square's `onClick` prop was specified by the Board.
4. Since the Board passed `onClick={() => this.handleClick(i)}` to Square, the Square calls the Board's `handleClick(i)` when clicked.
5. We have not defined the `handleClick()` method yet, so our code crashes. If you click a square now, you should see a red error screen saying something like "this.handleClick is not a function".
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

>Catatan
>
>Atribut `onClick` pada elemen DOM `<button>` memiliki arti khusus untuk React karena merupakan komponen *built-in*. Untuk komponen komponen *custom* seperti Square, penamaan bersifat bebas. Kita dapat menamakan prop `onClick` Square atau `handleClick` Board dengan nama lain. Namun demikian, dalam React, hal ini adalah sebuah konvensi untuk menggunakan penamaan `on[Event]` pada *props* yang merepresentasikan *event* dan `handle[Event]` untuk *method* yang menangani *event* tersebut.

Ketika kita mencoba untuk mengklik salah satu Square, kita seharusnya akan mendapatkan sebuah pesan *error* karena kita belum mendefinisikan `handleClick`. Sekarang kita akan menambahkan `handleClick` pada kelas Board:

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

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/ybbQJX?editors=0010)**

Setelah perubahan ini, kita dapat mengklik Square kembali untuk mengisinya. Tetapi, sekarang *state* disimpan pada komponen Board, bukan pada setiap komponen Square. Ketika *state* Board berubah, komponen Square akan di-*render* ulang secara otomatis. Dengan menyimpan *state* dari setiap persegi pada komponen Board, kita dapat menentukan pemenangnya pada tahap berikutnya.

Karena komponen Square tidak lagi mengatur *state*, komponen Square menerima nilai dari komponen Board dan memberikan informasi ke komponen Board ketika diklik. Dalam istilah React, komponen Square sekarang disebut dengan ***controlled components***. Komponen Board memiliki kontrol penuh pada komponen Square.

Perhatikan bahwa di dalam `handleClick`, kita memanggil `.slice()` untuk membuat kopi senarai `squares` untuk memodifikasinya sebagai ganti dari memodifikasi senarai yang ada. Kami akan menjelaskan alasan kita membuat kopi dari senarai `squares` di bagian selanjutnya.

### Mengapa Immutablility Itu Penting {#why-immutability-is-important}

<<<<<<< HEAD
Pada contoh kode sebelumnya, kami menyarankan Anda untuk menggunakan `.slice()` untuk membuat kopi dari senarai `squares` untuk memodifikasinya sebagai ganti dari memodifikasi senarai yang ada. Kita akan membahas *immutability* dan mengapa *immutability* penting untuk dipelajari.
=======
In the previous code example, we suggested that you create a copy of the `squares` array using the `slice()` method instead of modifying the existing array. We'll now discuss immutability and why immutability is important to learn.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

Secara umum, ada dua pendekatan untuk mengubah data. Pendekatan pertama adalah untuk me-*mutate* data dengan mengubah nilai dari data secara langsung. Pendekatan kedua adalah dengan mengganti data dengan kopi baru yang memiliki perubahan yang diinginkan.

#### Perubahan Data dengan Mutation {#data-change-with-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};
player.score = 2;
// Sekarang player adalah {score: 2, name: 'Jeff'}
```

#### Perubahan Data Tanpa Mutation {#data-change-without-mutation}
```javascript
var player = {score: 1, name: 'Jeff'};

var newPlayer = Object.assign({}, player, {score: 2});
// Sekarang player tidak berubah, tetapi newPlayer adalah {score: 2, name: 'Jeff'}

// Atau jika Anda menggunakan sintaks object spread, Anda dapat menuliskan:
// var newPlayer = {...player, score: 2};
```

Hasil akhir dari kedua pendekatan sama tetapi dengan tidak melakukan *mutate* (atau mengganti data di dalamnya) secara langsung, kita mendapatkan keuntungan sebagai berikut.

#### Fitur Kompleks Menjadi Lebih Sederhana {#complex-features-become-simple}

*Immutability* membuat fitur kompleks menjadi lebih mudah untuk diimplementasikan. Nanti pada tutorial ini juga, kita akan mengimplementasikan fitur "penjelajahan waktu" yang memungkinkan kita untuk mengulas riwayat permainan *tic-tac-toe* kita dan "lompat kembali" ke langkah sebelumnya. Fungsionalitas ini tidak spesifik ke permainan -- sebuah kemampuan untuk *undo* dan *redo* beberapa aksi adalah kebutuhan yang umum dalam sebuah aplikasi. Menghindari mutasi data memungkinkan kita untuk menyimpan riwayat permainan sebelumnya utuh dan menggunakannya kembali kemudian.

#### Mendeteksi Perubahan {#detecting-changes}

Mendeteksi perubahan pada objek *mutable* sulit karena mereka dimodifikasi secara langsung. Deteksi ini membutuhkan objek *mutable* tersebut dibandingkan dengan beberapa kopi sebelumnya dari dirinya dan seluruh melintasi seluruh pohon objek.

Mendeteksi perubahan pada objek *immutable* dianggap lebih mudah. Jika objek *immutable* yang ditunjuk berbeda dengan objek sebelumnya, maka objeknya sudah berubah.

#### Menentukan Waktu Untuk Melakukan Render Ulang di React {#determining-when-to-re-render-in-react}

Keuntungan utama dari *immutability* adalah membantu Anda untuk membuat *pure component* di React. Data yang *immutable* dapat dengan mudah memastikan apakah perubahan sudah terjadi, yang juga membantu untuk menentukan apakah komponen perlu di-*render* ulang.  

Anda dapat mempelajari `shouldComponentUpdate()` lebih lanjut dan bagaimana cara membuat *pure components* dengan membaca [Optimisasi Performa](/docs/optimizing-performance.html#examples).

### Function Components {#function-components}

Sekarang kita akan mengubah Square menjadi **function component**.

Dalam React, **function component** adalah cara lebih mudah untuk menulis komponen yang hanya berisi *method* `render` dan tidak memiliki *state*. Sebagai ganti menulis kelas yang merupakan turunan dari `React.Component`, kita dapat menulis sebuah fungsi yang menerima *`props`* sebagai masukan dan mengembalikan apa yang harus di-*render*. Menulis *function component* lebih tidak jemu dibanding menulis kelas dan banyak komponen dapat ditulis dengan cara ini.

Ganti kelas Square dengan fungsi berikut:

```javascript
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Kita sudah mengganti `this.props` dengan `props` saat muncul.

**[Lihat kode lengkap sampai saat ini](https://codepen.io/gaearon/pen/QvvJOv?editors=0010)**

>Catatan
>
>Ketika mengubah Square menjadi *function component*, kita juga mengubah `onClick={() => this.props.onClick()}` menjadi lebih pendek `onClick={props.onClick}` (perhatikan hilangnya tanda kurung pada *kedua* sisi). Pada kelas, kita menggunakan *arrow function* untuk mengakses nilai `this` yang benar, tetapi di *function component* kita tidak perlu mengkhawatirkan `this`.

### Mengambil Giliran {#taking-turns}

Sekarang kita perlu memperbaiki kerusakan yang cukup jelas pada permainan *tic-tac-toe* kita: "O" tidak dapat dituliskan ke dalam papan.

Kita akan menentukan "X" mengambil giliran pertama sebagai nilai *default*. Kita dapat menentukan nilai *default* dengan mengubah *state* awal pada konstruktor Board:

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

Setiap pemain selesai dengan langkahnya, `xIsNext` (sebuah *boolean*) akan diubah nilainya untuk menentukan siapa yang akan membuat langkah selanjutnya dan *state* dari permainan akan disimpan. Kita akan mengubah fungsi `handleClick` dari Board untuk mengubah nilai dari `xIsNext`:

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

Dengan perubahan ini, "X" dan "O" akan mendapatkan giliran setiap satu langkah selesai.

Mari mengubah teks "status" pada `render` di Board, sehingga teks menampilkan pemain mana yang sedang mendapat giliran selanjutnya:

```javascript{2}
  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      // sisanya tidak berubah
```

Setelah mengubahnya, Anda akan memiliki komponen Board berikut:

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

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/KmmrBy?editors=0010)**

### Menentukan Pemenang {#declaring-a-winner}

Sekarang kita sudah menampilkan pemain mana yang akan mendapat giliran selanjutnya, kita juga perlu menampilkan sesuatu ketika permainan sudah dimenangkan oleh salah satu pemain dan tidak ada giliran lagi. Kita dapat menentukan pemenang dengan menambahkan fungsi berikut pada akhir file:

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

Ketika diberi senarai dari kesembilan persegi, fungsi ini akan mengecek pemenang dan `'X'`, `'O'`, atau `null` sesuai dengan hasil.

Kita akan memanggil `caluclateWinner(squares)` pada fungsi `render` Board untuk mengecek adanya salah satu pemain yang sudah menang. Jika salah satu pemain sudah menang, kita dapat menampilkan teks seperti *"Winner: X"* atau *"Winner: O"*. Kita akan mengganti deklarasi `status` pada fungsi `render` Board dengan kode berikut:

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
      // sisanya tidak berubah
```
Kita dapat mengubah fungsi `handleClick` Board untuk kembali lebih awal dengan mengabaikan klik jika salah satu pemain sudah menang atau jika sebuah Square sudah diisi:

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

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/LyyXgK?editors=0010)**

Selamat! Anda sekarang sudah memiliki permainan *tic-tac-toe* yang berjalan dengan baik. Anda juga telah belajar dasar-dasar dari React. Jadi *Anda* mungkin adalah pemenang yang sebenarnya disini.

## Menambahkan Penjelajahan Waktu {#adding-time-travel}

Sebagai latihan terakhir, mari kita membuat permainan kita dapat "kembali" ke langkah sebelumnya pada permainan.

### Menyimpan Riwayat Langkah {#storing-a-history-of-moves}

Jika kita melakukan *mutate* pada senarai `squares`, mengimplementasikan penjelajahan waktu akan sangat sulit.

Tetapi, kita menggunakan `slice()` untuk membuat kopi baru dari senarai `squares` setelah setiap langkah dan [memperlakukannya sebagai *immutable*](#why-immutability-is-important). Hal ini akan membuat kita dapat menyimpan setiap versi sebelumnya dari senarai `squares` dan melakukan navigasi di antara giliran-giliran yang sudah terjadi.

Kita akan menyimpan riwayat senarai `squares` pada senarai lain yang bernama `history`. Senarai `history` menggambarkan semua *state* dari Board dari awal hingga akhir, dan memiliki bentuk seperti ini:

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

Sekarang kita akan menentukan komponen yang akan memiliki *state* `history`.

### Menaikkan State, Lagi {#lifting-state-up-again}

Kita ingin komponen Game teratas untuk menampilkan riwayat langkah. Untuk melakukan hal tersebut, komponen Game memerlukan akses ke `history`, sehingga kita akan menempatkan *state* `history` pada komponen teratas Game.

Menempatkan *state* `history` ke komponen Game memungkinkan kita menghapus *state* `squares` dari komponen anaknya, komponen Board. Seperti yang kita lakukan pada bagian ["menaikan state"](#lifting-state-up) dari komponen Square ke komponen Board, sekarang kita akan menaikkannya dari Board ke komponen teratas Game. Hal ini memberikan komponen Game kontrol penuh pada data Board dan memungkinkannya untuk memberi instruksi ke Board untuk me-*render* giliran sebelumnya dari `history`.

Pertama, mari kita mempersiapkan *state* awal untuk komponen Game di dalam konstruktornya:

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

Selanjutnya, kita akan membuat komponen Board menerima *prop* `squares` dan `onClick` dari komponen Game. Karena sekarang kita sudah memiliki *handler* untuk klik di dalam Board untuk banyak Square, kita akan perlu memberikan lokasi dari setiap Square ke *handler* `onClick` untuk memberi tahu Square mana yang diklik. Berikut adalah langkah yang diperlukan untuk mengubah komponen Board:

* Menghapus `constructor` di Board.
* Mengganti `this.state.squares[i]` dengan `this.props.squares[i]` pada `renderSquare` di Board.
* Mengganti `this.handleClick(i)` dengan `this.props.onClick(i)` pada `renderSquare` di Board.

Sekarang komponen Board akan terlihat seperti ini:

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

Kita akan mengubah fungsi `render` pada komponen Game agar fungsi tersebut menggunakan entri riwayat terakhir untuk menentukan dan menampilkan status permainan:

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

Karena sekarang komponen Game me-*render* status permainan, kita dapat menghapus kode yang bersangkutan dari *method `render`* Board. Setelah melakukan *refactor*, fungsi *`render`* Board akan terlihat seperti ini:

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

Terakhir, kita perlu memindahkan *method* `handleClick` dari komponen Board ke komponen Game. Kita juga perlu mengubah `handleClick` karena *state* komponen Game memiliki struktur yang berbeda. Di dalam *method* `handleClick` Game, kita menggabungkan (*concat*) entri riwayat baru ke dalam `history`.

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

>Catatan
>
>Tidak seperti *method* `push()` pada senarai, yang mungkin Anda lebih kenal, *method* `concat()` tidak melakukan *mutate* pada senarai sebenarnya, jadi kami lebih memilih `concat()`.

Sampai tahap ini, komponen Board hanya memerlukan *method* `renderSquare` dan `render`. *State* permainan dan *method* `handleClick` seharusnya ada di dalam komponen Game.

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/EmmOqJ?editors=0010)**

### Menampilakan Langkah-Langkah Sebelumnya {#showing-the-past-moves}

Karena kita merekam riwayat permainan *tic-tac-toe*, sekarang kita dapat menampilkannya ke pemain sebagai daftar langkah sebelumnya.

Kita mengetahui sebelumnya bahwa elemen React adalah object *first-class* JavaScript; kita dapat mengoperkannya ke manapun pada aplikasi kita. Untuk me-*render* banyak elemen React, kita dapat menggunakan senarai berisi elemen React.

Di JavaScript, senarai memiliki [*method* `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) yang sering digunakan untuk melakukan pemetaan data ke data lain, contohnya:

```js
const numbers = [1, 2, 3];
const doubled = numbers.map(x => x * 2); // [2, 4, 6]
```

Dengan menggunakan *method* `map`, kita dapat memetakan riwayat langkah kita ke elemen React yang melambangkan tombol pada layar dan menampilkan daftar tombol untuk "melompat" ke langkah sebelumnya.

Mari menerapkan `map` pada `history` di *method* `render` Game:

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

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/EmmGEa?editors=0010)**

<<<<<<< HEAD
Untuk setiap langkah pada riwayat permainan *tic-tac-toe*, kita membuat `<li>` yang berisi `<button>`. Tombol (`<button>`) memiliki *handler* `onClick` yang akan memanggil *method* bernama `this.jumpTo()`. Kita belum mengimplementasikan *method* `jumpTo()`. Untuk sekarang, kita seharusnya sudah melihat daftar langkah yang sudah terjadi dalam permainan dan peringatan pada *developer tools console* yang bertuliskan:
=======
As we iterate through `history` array, `step` variable refers to the current `history` element value, and `move` refers to the current `history` element index. We are only interested in `move` here, hence `step` is not getting assigned to anything.

For each move in the tic-tac-toe game's history, we create a list item `<li>` which contains a button `<button>`. The button has a `onClick` handler which calls a method called `this.jumpTo()`. We haven't implemented the `jumpTo()` method yet. For now, we should see a list of the moves that have occurred in the game and a warning in the developer tools console that says:
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

>  Warning:
>  Each child in an array or iterator should have a unique "key" prop. Check the render method of "Game".

Mari membahas makna dari peringatan tersebut.

### Memilih Sebuah Key {#picking-a-key}

Ketika kita me-*render* sebuah *list*, React menyimpan informasi tentang setiap elemen dalam *list* yang di-*render*. Ketika kita memperbarui sebuah *list*, React perlu menentukan elemen yang sudah berubah. Kita bisa saja menambahkan, menghapus, mengatur ulang, atau memperbarui elemen pada *list*.

Bayangkan perubahan dari

```html
<li>Alexa: 7 tasks left</li>
<li>Ben: 5 tasks left</li>
```

ke

```html
<li>Ben: 9 tasks left</li>
<li>Claudia: 8 tasks left</li>
<li>Alexa: 5 tasks left</li>
```

Selain jumlah yang diperbarui, kemampuan baca manusia mungkin akan mengatakan bahwa kita menukar urutan Ben dan Alexa dan menyisipkan Claudia di antara Alexa dan Ben. Tetapi, React adalah program komputer dan tidak tahu intensi kita. Karena React tidak tahu intensi kita, kita perlu memberikan properti *key* dari setiap elemen pada *list* untuk membedakan setiap elemen *list* dari saudaranya (elemen lain dalam satu hirarki). Salah satu opsi adalah dengan menggunakan *string* `alexa`, `ben`, `claudia`. Jika kita menampilkan data dari basisdata, ID Alexa, Ben, Claudia pada database dapat digunakan sebagai *key*.

```html
<li key={user.id}>{user.name}: {user.taskCount} tasks left</li>
```
**
Ketika *list* di-*render* ulang, React mengambil seluruh *key* dari elemen *list* dan mencari elemen sebelumnya yang memiliki *key* yang sama. Jika *list* saat ini memiliki *key* yang tidak ada sebelumnya, React akan membuat komponen. Jika *list* saat ini kehilangan sebuah *key* yang ada pada *list* sebelumnya, React menghapus (*destroy*) komponen sebelumnya. Jika ada dua *key* yang sama, komponen yang bersangkutan dipindahkan. *Key* memberi tahu React identitas dari tiap komponen, sehingga membuat React dapat mempertahankan *state* di setiap *render* ulang. Jika *key* dari sebuah komponen berubah, komponen akan dihapus dan dibuat ulang dengan *state* baru.

`key` adalah properti khusus dan sudah dipesan di React (bersama dengan `ref`, fitur yang lebih lanjut). Ketika sebuah elemen dibuat, React mengekstrak properti `key` dan menyimpannya langsung ke elemen yang dikembalikan. Walaupun `key` terlihat seperti bagian dari `props`, `key` tidak dapat diacu menggunakan `this.props.key`. React menggunakan `key` untuk menentukan komponen yang akan diubah secara otomatis. Sebuah komponen tidak dapat menanyakan `key` yang dia miliki.

**Kami sangat merekomendasikan Anda untuk memberikan *key* yang baik ketika membuat *list* dinamik**. Jika Anda tidak memiliki *key* yang baik, Anda dapat mempertimbangkan restukturisasi data Anda sehingga Anda memiliki *key* yang baik.

Jika tidak ada *key* yang diberikan, React akan menampilkan sebuah peringatan dan menggunakan indeks senarai sebagai nilai *default*. Menggunakan indeks senarai bermasalah ketika kita mencoba untuk mengatur ulang elemen *list* atau menyisipkan/menghapus elemen *list*. Memberikan `key={i}` secara eksplisit menghilangkan peringatannya, tetapi memiliki masalah yang sama, sehingga tidak direkomendasikan pada banyak kasus.

*Key* tidak perlu unik secara global. *Key* hanya perlu unik di antara komponen dan saudaranya.


### Mengimplementasikan Penjelajahan Waktu {#implementing-time-travel}

Di dalam riwayat permainan *tic-tac-toe*, setiap langkah sebelumnya memiliki ID unik yang bersangkutan dengan langkah tersebut: ID tersebut adalah angka terutut yang melambangkan urutan langkah. Riwayat langkah tidak pernah di atur ulang, dihapus, atau disisipi elemen lain di tengah, jadi pada kasus ini kita dapat menggunakan indeks langkah sebagai *key*.

Dalam *method* `render` komponen Game, kita dapat menambahkan *key* sebagai `<li key={move}>` dan peringatan React tentang *key* akan menghilang:

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

**[Lihat kode lengkap sampai tahap ini](https://codepen.io/gaearon/pen/PmmXRE?editors=0010)**

Mengklik salah satu tombol pada elemen *list* akan menghasilkan *error* karena *method* `jumpTo` tidak didefinisikan (*undefined*). Sebelum kita mengimplementasikan `jumpTo`, kita akan menambahkan `stepNumber` di dalam *state* komponen Game untuk melambangkan langkah yang sedang kita lihat.

Pertama, tambahkan `stepNumber: 0` pada *state* awal di `constructor` Game:

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

Kemudian, kita akan mendefinisikan *method* `jumpTo` di dalam Game untuk memperbarui `stepNumber`. Kita juga dapat membuat `xIsNext` *true* jika angka yang kita berikan pada `stepNumber` adalah genap:

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

<<<<<<< HEAD
Sekarang kita akan mengubah beberapa bagian *method* `handleClick` pada Game yang akan dipicu ketika Anda mengklik sebuah persegi.
=======
Notice in `jumpTo` method, we haven't updated `history` property of the state. That is because state updates are merged or in more simple words React will update only the properties mentioned in `setState` method leaving the remaining state as is. For more info **[see the documentation](/docs/state-and-lifecycle.html#state-updates-are-merged)**.

We will now make a few changes to the Game's `handleClick` method which fires when you click on a square.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

*State* `stepNumber` yang sudah kita tambahkan menggambarkan langkah yang sedang ditampilkan ke pengguna saat ini. Setelah kita membuat langkah baru, kita perlu memperbarui `stepNumber` dengan menambahkan `stepNumber: history.length` sebagai bagian dari argumen `this.setState`. Hal ini memastikan kita tidak selalu menampilkan langkah yang sama setelah langkah baru berhasil dibuat.

<<<<<<< HEAD
Kita juga akan mengganti `this.state.history` dengan `this.state.history.slice(0, this.state.stepNumber = 1)`. Hal ini untuk memastikan jika kita "kembali" dan membuat langkah baru dari titik tersebut, kita membuang semua riwayat "masa depan" yang sekarang menjadi tidak benar.
=======
We will also replace reading `this.state.history` with `this.state.history.slice(0, this.state.stepNumber + 1)`. This ensures that if we "go back in time" and then make a new move from that point, we throw away all the "future" history that would now be incorrect.
>>>>>>> 707f22d25f5b343a2e5e063877f1fc97cb1f48a1

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

Terakhir, kita dapat mengubah *method* `render` dari komponen Game dari yang selalu me-*render* langkah terakhir menjadi me-*render* langkah yang saat ini dipilih berdasarkan `stepNumber`:

```javascript{3}
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    // sisanya tidak berubah
```

Jika kita mengklik salah satu langkah pada riwayat permainan, papan *tic-tac-toe* seharusnya langsung memperbarui dirinya dan menampilkan papan setelah langkah tersebut dijalankan.

**[Lihat kode penuh sampai saat ini](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**

### Ulasan {#wrapping-up}

Selamat! Anda sudah membuat permainan *tic-tac-toe* yang:

* Memungkinkan Anda bermain *tic-tac-toe*,
* Memberi tahu pemain yang sudah memenangkan permainan,
* Menyimpan riwayat permainan selama permainan berlangsung,
* Memungkinkan pemain untuk mengulas riwayat permainan dan melihat versi sebelumnya dari papan permainan.

Kerja bagus! Kami berharap sekarang Anda merasa Anda memiliki pemahaman yang baik tentang bagaimana React bekerja.

Lihat hasil akhirnya disini: **[Hasil Akhir](https://codepen.io/gaearon/pen/gWWZgR?editors=0010)**.

Jika Anda memiliki waktu luang atau ingin melatih kemampuan baru React Anda, berikut terdapat beberapa ide untuk perbaikan yang dapat Anda aplikasikan pada permainan *tic-tac-toe* terurut berdasarkan tingkat kesulitan paling mudah ke yang paling sulit:

1. Menampilkan lokasi dari setiap langkah dalam format (kolom, baris) pada daftar riwayat langkah.
2. Menebalkan elemen yang sedang dipilih pada daftar langkah.
3. Menulis ulang Board sehingga menggunakan dua perulangan untuk membuat persegi, bukan melakukan *hardcode*.
4. Menambahkan *toggle* yang memungkinkan Anda untuk mengurutkan langkah terutur membesar atau mengecil.
5. Ketika salah satu pemain menang, tandai 3 persegi yang membuatnya menang.
6. Ketika tidak ada yang menang, tampilan pesan bahwa hasilnya seri.

Melalui tutorial ini, kita menyentuh beberapa konsep React termasuk di dalamnya elemen, komponen, *props*, dan *state*. Untuk penjelasan lebih rinci dari setiap topik tersebut, kunjungi [dokumentasi](/docs/hello-world.html). Untuk mempelajari lebih lanjut mengenai cara mendefinisikan komponen, kunjungi [Referensi API `React.Component`](/docs/react-component.html).
