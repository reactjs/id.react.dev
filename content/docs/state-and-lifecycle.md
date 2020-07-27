---
id: state-and-lifecycle
title: State dan Lifecycle
permalink: docs/state-and-lifecycle.html
redirect_from:
  - "docs/interactivity-and-dynamic-uis.html"
prev: components-and-props.html
next: handling-events.html
---

Halaman ini akan mengenalkan tentang konsep dari _state_ dan _lifecycle_ di sebuah komponen React. Anda bisa menemukan [referensi detail _API_ komponen disini](/docs/react-component.html).

Pertimbangkan contoh detak jam dari [salah satu bagian sebelumnya](/docs/rendering-elements.html#updating-the-rendered-element). Di [_Rendering Element_](/docs/rendering-elements.html#rendering-an-element-into-the-dom), kita baru saja mempelajari satu cara untuk memperbarui _UI_. Kita memanggil `ReactDOM.render()` untuk mengubah hasil _render_:

```js{8-11}
function tick() {
  const element = (
    <div>
      <h1>Halo, dunia!</h1>
      <h2>Ini {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(
    element,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/gwoJZk?editors=0010)

Di bagian ini, Kita akan belajar cara membuat komponen `Clock`  benar-benar dapat digunakan kembali dan terenkapsulasi. Ini akan mengatur _timer_-nya sendiri dan memperbaruinya setiap detik.

Kita dapat memulai dengan mengenkapsulasi bagaimana jam terlihat:

```js{3-6,12}
function Clock(props) {
  return (
    <div>
      <h1>Halo, dunia!</h1>
      <h2>Ini {props.date.toLocaleTimeString()}.</h2>
    </div>
  );
}

function tick() {
  ReactDOM.render(
    <Clock date={new Date()} />,
    document.getElementById('root')
  );
}

setInterval(tick, 1000);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/dpdoYR?editors=0010)

Namun, ia melewatkan persyaratan penting: faktanya bahwa `Clock` mengatur _timer_ dan memperbarui _UI_ setiap detik harus merupakan detail implementasi dari `Clock`.

Idealnya kita butuh untuk menulis ini sekali dan `Clock` dapat memperbarui dirinya sendiri:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Untuk mengimplementasikan ini, kita perlu untuk menambahkan _"state"_ ke komponen `Clock`.

_State_ mirip dengan _props_, tetapi bersifat pribadi dan sepenuhnya dikendalikan oleh komponen.

## Mengubah Sebuah Fungsi ke Sebuah Kelas {#converting-a-function-to-a-class}

Anda bisa mengubah sebuah _function component_ seperti `Clock` ke sebuah kelas dalam lima langkah:

1. Buat sebuah [kelas ES6](https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Classes), dengan nama yang sama, yang diturunkan dari `React.Component`.

2. Tambah sebuah _method_ kosong yang bernama `render()`.

3. Pindahkan isi fungsi ke dalam _method_ `render()`.

4. Ganti `props` dengan `this.props` di dalam `render()`.

5. Hapus deklarasi fungsi kosong yang tersisa.

```js
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Halo, dunia!</h1>
        <h2>Ini {this.props.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/zKRGpo?editors=0010)

`Clock` sekarang terdefinisikan sebagai sebuah kelas daripada fungsi

_method_ `render` akan dipanggil setiap waktu ketika pembaruan terjadi, tapi selama kita me-_render_ `<Clock />` simpul _DOM_ yang sama, hanya satu instansi dari kelas `Clock` yang akan digunakan. Ini memungkinkan kita untuk mengunakan fitur tambahan seperti _local state_ dan _lifecycle method_.

## Menambahkan _State_ lokal ke sebuah kelas {#adding-local-state-to-a-class}

Kita akan memindahkan `date` dari _props_ ke _state_ dalam tiga langkah:

1) Ubah `this.props.date`_ dengan `this.state.date` di _method_ `render()`:

```js{6}
class Clock extends React.Component {
  render() {
    return (
      <div>
        <h1>Halo, dunia!</h1>
        <h2>Ini {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

1) Tambah sebuah [konstruktor kelas](https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Classes#Konstruktor) yang menetapkan nilai awal `this.state`:

```js{4}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Halo, dunia!</h1>
        <h2>Ini {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

Perhatikan bagaimana kami meneruskan `props` ke konstruktor dasar:

```js{2}
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }
```

Kelas komponen harus selalu memanggil ke konstruktor dasar dengan `props`.

1) Hapus properti `date` dari elemen `<Clock />`:

```js{2}
ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

Kita nanti akan menambahkan kode _timer_ kembali ke komponen itu sendiri.

Hasilnya akan terlihat seperti ini:

```js{2-5,11,18}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  render() {
    return (
      <div>
        <h1>Halo, dunia!</h1>
        <h2>Ini {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/KgQpJd?editors=0010)

Selanjutnya, kami akan membuat `Clock` mengatur _timer_ sendiri dan memperbarui dirinya sendiri setiap detik.

## Menambah _Method Lifecycle_ ke Kelas {#adding-lifecycle-methods-to-a-class}

Dalam aplikasi dengan banyak komponen, sangat penting untuk membebaskan sumber daya yang diambil oleh komponen ketika mereka dihancurkan.

Kami ingin [mengatur _timer_](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval) setiap kali `Clock` di-_render_ di DOM untuk pertama kalinya . Ini disebut _"mounting"_ di React.

Kita juga ingin untuk [menghapus timer tersebut](https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/clearInterval) setiap kali DOM yang diproduksi oleh `Clock` dihapus. Ini disebut _"unmounting"_ di React.

Kita dapat mendeklarasi _method_ spesial di kelas komponen untuk menjalankan beberapa kode ketika sebuah komponen _mounts_ dan _unmounts_:

```js{7-9,11-13}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }

  render() {
    return (
      <div>
        <h1>Halo, dunia!</h1>
        <h2>Ini {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}
```

_Method_ ini disebut "_lifecycle method_".

_Method_ `componentDidMount()` berjalan setelah hasil komponen sudah ter-_render_ di DOM. Ini adalah tempat yang bagus untuk mengatur _timer_:

```js{2-5}
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }
```

Perhatikan bagaimana kami menyimpan ID _timer_ langsung pada `this` (`this.timerID`).

Ketika `this.props` diatur oleh React sendiri dan `this.state` punya arti spesial, Anda dapat dengan bebas untuk menambah _field_ tambahan di kelas secara manual jika Anda butuh untuk menyimpan sesuatu yang tidak ikut berpartisipasi di alur data (seperti _ID timer_).

Kita akan menghapus _timer_ di _method lifecycle_ `componentWillUnmount()`:

```js{2}
  componentWillUnmount() {
    clearInterval(this.timerID);
  }
```

Akhirnya, kita akan mengimplementasi sebuah _method_ bernama `tick()` yang dijalankan oleh komponen `Clock` setiap detik.

Itu akan mengunakan `this.setState()` untuk menjadwal pembaruan ke _state_ lokal milik komponen:

```js{18-22}
class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {date: new Date()};
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState({
      date: new Date()
    });
  }

  render() {
    return (
      <div>
        <h1>Hello, dunia!</h1>
        <h2>Ini {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}

ReactDOM.render(
  <Clock />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/amqdNA?editors=0010)

Sekarang jam akan berdetak setiap waktu.

Mari kita rekap dengan cepat apa yang terjadi dan urutan _method_ yang dipanggil:

1) Ketika `<Clock />` diberikan ke `ReactDOM.render()`, React memanggil konstruktor dari komponen `Clock`. Ketika `Clock` perlu untuk menampilkan waktu saat ini, dia menginisialisai `this.state` dengan sebuah obyek termasuk waktu saat ini. Kita nantinya akan memperbarui status ini.

2) React kemudian memanggil _method_ `render()` milik komponen `Clock`. Beginilah cara React belajar apa yang harusnya ditampilkan di layar. React kemudian memperbarui _DOM_ untuk mencocokan hasil _render_ `Clock`.

3) Ketika hasil `Clock` dimasukkan ke dalam _DOM_, React memanggil _method lifecycle_ `componentDidMount()`. Didalamnya, komponen `Clock` menyuruh _browser_ untuk mengatur sebuah _timer_ untuk memanggil _method_ `tick()` milik komponen sekali per detik.

4) Setiap detik _browser_ memanggil _method_ `tick()`. Didalamnya, komponen `Clock` menjadwal pembaruan _UI_ dengan memanggil `setState()` dengan sebuah obyek berisi waktu sekarang. Berkat panggilan `setState()`, React mengetahui _state_ sudah berubah, dan memanggil _method_ `render()` lagi untuk mempelajari apa yang harusnya ada di layar. Kali ini, `this.state.date` di `render()` _method_ akan berbeda, dan jadi hasil _render_ akan mencakup waktu yang diperbarui. React telah memperbarui _DOM_ dengan sesuai.

5) Jika komponen `Clock` dihapus dari _DOM_, React memanggil _method lifecycle_ `componentWillUnmount()` jadi  _timer_ akan berhenti.

## Menggunakan _State_ Dengan Benar {#using-state-correctly}

Ada tiga hal yang harus Anda ketahui tentang `setState()`.

### Jangan mengubah _State_ Secara Langsung {#do-not-modify-state-directly}

Sebagai contoh, ini tidak akan me-_render_ komponen :

```js
// Salah
this.state.comment = 'Halo';
```

Sebagai gantinya, gunakan `setState()`:

```js
// Benar
this.setState({comment: 'Halo'});
```

Satu-satunya tempat di mana Anda dapat menetapkan `this.state` adalah di konstruktor.

### Pembaruan _State_ Mungkin _Asynchronous_ {#state-updates-may-be-asynchronous}

React dapat mengelompokkan beberapa panggilan `setState()`  menjadi satu untuk kinerja lebih baik.

Karena `this.props` dan `this.state` mungkin diperbarui secara _asynchronous_, Anda seharusnya tidak mengandalkan nilai-nilai tersebut untuk menghitung _State_ berikutnya.

Sebagai contoh, kode ini mungkin gagal untuk memperbarui penghitung:

```js
// Salah
this.setState({
  counter: this.state.counter + this.props.increment,
});
```

Untuk memperbaikinya, pakai bentuk kedua dari `setState()` yang menerima fungsi daripada sebuah objek. Fungsi itu akan menerima _state_ sebelumnya sebagai argumen pertama, dan _props_ pada waktu itu pembaruanya di terapkan ke argumen kedua:

```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
``` 

Kita menggunakan [_arrow function_](https://developer.mozilla.org/id/docs/Web/JavaScript/Reference/Functions/Arrow_functions) diatas, tetapi juga bisa menggunakan fungsi biasa:

```js
// Benar
this.setState(function(state, props) {
  return {
    counter: state.counter + props.increment
  };
});
```

### Pembaruan _State_ Digabungkan {#state-updates-are-merged}

Ketika Anda memanggil `setState()`, React mengabungkan obyek yang Anda siapkan ke _state_ saat ini.

Sebagai contoh, _state_ Anda mungkin menganduk beberapa variabel independen:

```js{4,5}
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      comments: []
    };
  }
```

Kemudian Anda dapat memperbarui mereka secara terpisah dengan memanggil `setState()` yang terpisah:

```js{4,10}
  componentDidMount() {
    fetchPosts().then(response => {
      this.setState({
        posts: response.posts
      });
    });

    fetchComments().then(response => {
      this.setState({
        comments: response.comments
      });
    });
  }
```

Pengabunganya dangkal, jadi `this.setState({comments})` meninggalkan `this.state.posts` dengan utuh, tetapi sepenuhnya menggantikan `this.state.comments`.

## Data Mengalir ke Bawah {#the-data-flows-down}

Baik komponen induk maupun anak tidak tahu apakah komponen tertentu mengandung _state_ atau tidak, dan mereka tidak seharusnya peduli apakah itu didefinisikan sebagai fungsi atau kelas.

Inilah sebabnya mengapa _state_ kadang disebut lokal atau terenkapsulasi. Itu tidak dapat diakses oleh komponen apa pun selain dari yang memiliki dan menetapkannya.

Sebuah komponen dapat memilih untuk menurunkan _state_ sebagai _props_ ke komponen turunannya:

```js
<FormattedDate date={this.state.date} />
```

Komponen `FormattedDate` akan menerima `date` _props_-nya dan tidak akan tahu apakah itu datang dari _state_ milik `Clock`, dari _props_ milik `Clock`, atau itu diketik dengan tangan:

```js
function FormattedDate(props) {
  return <h2>Ini {props.date.toLocaleTimeString()}.</h2>;
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/zKRqNB?editors=0010)

Ini umumnya memanggil aliran data "atas-bawah" atau "searah". Semua _state_ selalu dimiliki oleh komponen spesifik, dan semua data atau _UI_ yang berasal dari _state_ tersebut hanya bisa mempengaruhi pohon komponen "di bawah" mereka.

Jika Anda membanyangkan pohon komponen sebagai air terjun dari _props_, tiap _state_ milik komponen seperti sebuah sumber air yang bergabung dengannya pada titik acak tetapi juga mengalir ke bawah.

Untuk menunjukkan jika semua komponen benar-benar terisolasi, Kita dapat membuat sebuah komponen `App` yang me-_render_ tiga `<Clock>`:

```js{4-6}
function App() {
  return (
    <div>
      <Clock />
      <Clock />
      <Clock />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/vXdGmd?editors=0010)

Setiap `Clock` membuat _timer_-nya sendiri dan memperbaruinya secara independen.

Di aplikasi React, apakah suatu komponen memiliki _state_ atau tidak itu dianggap sebagai detail implementasi komponen yang dapat berubah dari waktu ke waktu. Anda dapat menggunakan komponen tanpa _state_ di dalam komponen dengan _state_, dan sebaliknya.
