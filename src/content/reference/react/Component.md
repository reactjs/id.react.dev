---
title: Component
---

<Pitfall>

Kami merekomendasikan mendefinisikan komponen sebagai fungsi daripada kelas. [Lihat bagaimana cara migrasi.](#alternatives)

</Pitfall>

<Intro>

`Component` adalah kelas dasar untuk komponen React yang didefinisikan sebagai [JavaScript classes.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) Kelas komponen masih didukung oleh React, tetapi kami tidak merekomendasikan untuk menggunakannya di kode baru.

```js
class Greeting extends Component {
  render() {
    return <h1>Halo, {this.props.name}!</h1>;
  }
}
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `Component` {/*component*/}

Untuk mendefinisikan sebuah komponen React sebagai sebuah kelas, *extend* kelas `Component` bawaan dan definisikan [*method* `render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Halo, {this.props.name}!</h1>;
  }
}
```

Hanya *method* `render` yang diperlukan, *method* yang lain adalah opsional.

[Lihat lebih banyak contoh di bawah](#usage)

---

### `context` {/*context*/}

<<<<<<< HEAD
[Context](/learn/passing-data-deeply-with-context) dari sebuah *class component* tersedia sebagai `this.context`. Ini hanya tersedia jika Anda menentukan context *yang mana* yang ingin Anda terima menggunakan [`static contextType`](#static-contexttype) (modern) atau [`static contextTypes`](#static-contexttypes) (deprecated).
=======
The [context](/learn/passing-data-deeply-with-context) of a class component is available as `this.context`. It is only available if you specify *which* context you want to receive using [`static contextType`](#static-contexttype).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

*Class component* hanya bisa membaca satu *context* pada satu waktu.

```js {2,5}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

```

<Note>

Membaca `this.context` pada *class components* setara dengan [`useContext`](/reference/react/useContext) pada *function components*.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `props` {/*props*/}

*props* yang dioper ke sebuah *class component* tersedia sebagai `this.props`.

```js {3}
class Greeting extends Component {
  render() {
    return <h1>Halo, {this.props.name}!</h1>;
  }
}

<Greeting name="Taylor" />
```

<Note>

Membaca `this.props` pada *class components* setara dengan [mendeklarasikan props](/learn/passing-props-to-a-component#step-2-read-props-inside-the-child-component) pada *function components*.

[Lihat bagaimana cara migrasi.](#migrating-a-simple-component-from-a-class-to-a-function)

</Note>

---

<<<<<<< HEAD
### `refs` {/*refs*/}

<Deprecated>

API ini akan dihapus pada versi mayor React di masa depan. [Gunakan `createRef` sebagai gantinya.](/reference/react/createRef)

</Deprecated>

Memungkinkan Anda mengakses [legacy string refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) pada komponen ini.

---

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
### `state` {/*state*/}

*State* dari *class component* tersedia sebagai `this.state`. *Field state* harus berupa objek. Jangan mengubah *state* secara langsung. Jika Anda ingin mengubah *state*, panggil `setState` dengan *state* baru.

```js {2-4,7-9,18}
class Counter extends Component {
  state = {
    age: 42,
  };

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <button onClick={this.handleAgeChange}>
        Increment age
        </button>
        <p>You are {this.state.age}.</p>
      </>
    );
  }
}
```

<Note>

Mendefinisikan `state` pada *class components* setara dengan [`useState`](/reference/react/useState) pada *function components*.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `constructor(props)` {/*constructor*/}

[Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) dijalankan sebelum *class component* Anda *dipasang* (ditambahkan ke layar). Biasanya, sebuah *constructor* hanya digunakan untuk dua tujuan dalam React. Ini memungkinkan Anda mendeklarasikan *state* dan [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind) *class methods* Anda ke *class instance*:

```js {2-6}
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // ...
  }
```

Jika Anda menggunakan sintaksis JavaScript modern, *constructors* jarang diperlukan. Sebagai gantinya, Anda dapat menulis ulang kode di atas menggunakan [public class field syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields) yang didukung oleh browser modern dan alat seperti [Babel:](https://babeljs.io/)

```js {2,4}
class Counter extends Component {
  state = { counter: 0 };

  handleClick = () => {
    // ...
  }
```

Sebuah *constructor* sebaiknya tidak mengandung *side effects* atau *subscriptions*.

#### Parameter {/*constructor-parameters*/}

* `props`: Props awal komponen.

#### Kembalian {/*constructor-returns*/}

`constructor` seharusnya tidak mengembalikan apapun.

#### Catatan penting {/*constructor-caveats*/}

* Jangan menjalankan *side effects* atau *subscriptions* dalam *constructor*. Sebagai gantinya, gunakan [`componentDidMount`](#componentdidmount) untuk itu.

* Dalam sebuah *constructor*, Anda perlu memanggil `super(props)` sebelum pernyataan lainnya. Jika Anda tidak melakukannya, `this.props` akan menjadi `undefined` saat *constructor* berjalan, yang dapat membingungkan dan menyebabkan bug.

* *Constructor* adalah satu-satunya tempat di mana Anda dapat langsung mengisi nilai [`this.state`](#state). Pada semua metode lainnya, Anda perlu menggunakan [`this.setState()`](#setstate) sebagai gantinya. Jangan memanggil `setState` di dalam *constructor*.

* Ketika Anda menggunakan [pe-render-an di server,](/reference/react-dom/server) *constructor* juga akan dijalankan di server, diikuti oleh metode [`render`](#render). Namun, *lifecycle methods* seperti `componentDidMount` atau `componentWillUnmount` tidak akan dijalankan di server.

* Ketika [Strict Mode](/reference/react/StrictMode) diaktifkan, React akan memanggil `constructor` dua kali dalam pengembangan kemudian membuang salah satu *instances*. Ini membantu Anda memperhatikan *side effects* yang tidak disengaja yang perlu dipindahkan dari `constructor`.

<Note>

Tidak ada yang setara dengan `constructor` pada *function components*. Untuk mendeklarasikan *state* pada *function component*, panggil [`useState`.](/reference/react/useState) Untuk menghindari perhitungan ulang pada *state* awal, [oper fungsi ke `useState`.](/reference/react/useState#avoiding-recreating-the-initial-state)

</Note>

---

### `componentDidCatch(error, info)` {/*componentdidcatch*/}

Jika Anda mendefinisikan `componentDidCatch`, React akan memanggilnya ketika beberapa komponen anak(termasuk anak-anak yang jauh) melempar sebuah kesalahan saat rendering. Hal ini memungkinkan Anda untuk mencatat kesalahan tersebut ke *error reporting service* di produksi.

Biasanya, digunakan bersama dengan [`static getDerivedStateFromError`](#static-getderivedstatefromerror) yang memungkinkan Anda memperbarui *state* sebagai respons terhadap kesalahan dan menampilkan pesan kesalahan kepada pengguna. Komponen dengan metode-metode ini disebut sebagai *error boundary*.

[Lihat contoh.](#catching-rendering-errors-with-an-error-boundary)

#### Parameter {/*componentdidcatch-parameters*/}

* `error`: *Error* yang dilempar. Pada praktiknya, biasanya akan berupa sebuah *instance* dari [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) tetapi ini tidak dijamin karena JavaScript memungkinkan untuk [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) nilai apa pun, termasuk string atau bahkan null.

* `info`: Objek yang berisi informasi tambahan tentang *error*. *Field* `componentStack` berisi jejak tumpukan(*stack trace*) dengan komponen yang melempar kesalahan, serta nama-nama dan lokasi sumber dari semua komponen induknya. Di produksi, nama komponennya akan di-*minified*. Jika Anda mengatur *error reporting* di produksi, Anda dapat mendekode jejak tumpukan(*stack trace*) komponen menggunakan *sourcemaps* dengan cara yang sama seperti yang Anda lakukan untuk jejak tumpukan(*stack trace*) kesalahan JavaScript biasa.

#### Kembalian {/*componentdidcatch-returns*/}

`componentDidCatch` seharusnya tidak mengembalikan apapun.

#### Catatan penting {/*componentdidcatch-caveats*/}

* Di masa lalu, umumnya memanggil `setState` di dalam `componentDidCatch` untuk memperbarui antarmuka pengguna(UI) dan menampilkan pesan kesalahan pengganti. Ini sudah ditinggalkan karena mendefinisikan [`static getDerivedStateFromError`.](#static-getderivedstatefromerror)

* Build produksi dan pengembangan dari React sedikit berbeda dalam cara `componentDidCatch` menangani kesalahan. Pada pengembangan, kesalahan akan naik ke `window`, yang berarti `window.onerror` atau `window.addEventListener('error', callback)` akan menangkap kesalahan yang telah ditangkap oleh `componentDidCatch`. Pada produksi, sebaliknya, kesalahan tidak akan naik, yang berarti penangan kesalahan induk hanya akan menerima kesalahan yang tidak ditangkap secara eksplisit oleh `componentDidCatch`.

<Note>

Belum ada yang setara dengan `componentDidCatch` pada *function components*. Jika Anda ingin menghindari membuat *class components*, tulis satu komponen `ErrorBoundary` seperti di atas dan gunakan di seluruh aplikasi Anda. Sebagai alternatif, Anda dapat menggunakan paket  [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) yang akan melakukannya untuk Anda.

</Note>

---

### `componentDidMount()` {/*componentdidmount*/}

Jika Anda mendefinisikan metode `componentDidMount`, React akan memanggilnya ketika komponen Anda ditambahkan*(mounted)* ke layar. Ini adalah tempat umum untuk memulai pengambilan data, menyiapkan *subscriptions*, atau memanipulasi *DOM nodes*.

Jika Anda mengimplementasikan `componentDidMount`, biasanya Anda juga perlu mengimplementasikan *lifecycle methods* lainnya untuk menghindari bug. Sebagai contoh, jika `componentDidMount` membaca sebuah *state* atau *props*, Anda juga harus mengimplementasikan [`componentDidUpdate`](#componentdidupdate) untuk menangani perubahan mereka, dan [`componentWillUnmount`](#componentwillunmount) untuk membersihkan apa pun yang dilakukan oleh `componentDidMount`.

```js {6-8}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Lihat contoh lebih banyak.](#adding-lifecycle-methods-to-a-class-component)

#### Parameter {/*componentdidmount-parameters*/}

`componentDidMount` tidak mengambil parameter apa pun.

#### Kembalian {/*componentdidmount-returns*/}

`componentDidMount` seharusnya tidak mengembalikan apapun.

#### Catatan penting {/*componentdidmount-caveats*/}

- Ketika [Strict Mode](/reference/react/StrictMode) aktif, di pengembangan React kan memanggil `componentDidMount`, kemudian segera memanggil [`componentWillUnmount`,](#componentwillunmount) dan kemudian memanggil `componentDidMount` lagi. Ini membantu Anda melihai jika Anda lupa untuk mengimplementasikan `componentWillUnmount` atau jika logikanya tidak sepenuhnya "mencerminkan" apa yang dilakukan oleh `componentDidMount`.

- Meskipun Anda dapat langsung memanggil [`setState`](#setstate) di `componentDidMount`, sebaiknya hindari hal itu jika bisa. Ini akan memicu *render*-ing ekstra, tetapi itu akan terjadi sebelum browser memperbarui layar. Ini menjamin bahwa meskipun [`render`](#render) akan dipanggil dua kali dalam kasus ini, pengguna tidak akan melihat *state* perantara. Gunakan pola ini dengan hati-hati karena sering menyebabkan masalah performa. Dalam kebanyakan kasus, Anda seharusnya dapat menetapkan *state* awal di [`constructor`](#constructor) sebagai gantinya. Namun, dalam beberapa kasus seperti *modal* dan *tooltip* ketika Anda perlu mengukur sebuah *DOM node* sebelum me-*render* sesuatu yang bergantung pada ukuran atau posisinya.

<Note>

Untuk banyak kasus penggunaan, mendefinisikan `componentDidMount`, `componentDidUpdate`, dan `componentWillUnmount` bersama pada *class components* itu setara dengan memanggil [`useEffect`](/reference/react/useEffect) pada *function components*. Dalam kasus yang jarang terjadi di mana penting bagi kode untuk dijalankan sebelum tampilan browser dilakukan, [`useLayoutEffect`](/reference/react/useLayoutEffect) merupakan pilihan yang lebih tepat.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `componentDidUpdate(prevProps, prevState, snapshot?)` {/*componentdidupdate*/}

Jika Anda mendefinisikan metode `componentDidUpdate`, React akan memanggilnya segera setelah komponen Anda di-*render* ulang dengan *prop* atau *state* yang diperbarui. Metode ini tidak dipanggil saat *render* awal.

Anda dapat menggunakannya untuk memanipulasi DOM setelah pembaruan. Ini juga tempat umum untuk melakukan permintaan jaringan selama Anda membandingkan *prop* saat ini dengan *prop* sebelumnya (misalnya, permintaan jaringan mungkin tidak diperlukan jika *prop* tidak berubah). Biasanya, Anda akan menggunakannya bersama dengan [`componentDidMount`](#componentdidmount) dan [`componentWillUnmount`:](#componentwillunmount)

```js {10-18}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Lihat contoh lebih banyak.](#adding-lifecycle-methods-to-a-class-component)


#### Parameter {/*componentdidupdate-parameters*/}

* `prevProps`: Props sebelum update. Membandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum update. Membandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

* `snapshot`: Jika Anda mengimplementasikan [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` akan berisi nilai yang Anda kembalikan dari metode tersebut. Jika tidak, nilainya akan `undefined`.

#### Kembalian {/*componentdidupdate-returns*/}

`componentDidUpdate` seharusnya tidak mengembalikan apapun.

#### Catatan penting {/*componentdidupdate-caveats*/}

- `componentDidUpdate` tidak akan dipanggil jika [`shouldComponentUpdate`](#shouldcomponentupdate) didefinisikan dan mengembalikan `false`.

- Logika di dalam `componentDidUpdate` biasanya harus dibungkus dalam kondisi yang membandingkan `this.props` dengan `prevProps`, dan `this.state` dengan `prevState`. Jika tidak, ada risiko terjadi perulangan tak terbatas.

- Meskipun Anda dapat memanggil [`setState`](#setstate) langsung di dalam `componentDidUpdate`, sebaiknya hindari hal itu jika memungkinkan. Ini akan memicu *render* tambahan, tetapi akan terjadi sebelum browser memperbarui tampilan. Ini menjamin bahwa meskipun [`render`](#render) akan dipanggil dua kali dalam kasus ini, pengguna tidak akan melihat *intermediate state*. Pola ini sering menyebabkan isu *performance*, tetapi mungkin diperlukan untuk kasus-kasus langka seperti *modal* dan *tooltip* ketika Anda perlu mengukur node DOM sebelum me-*render* sesuatu yang bergantung pada ukuran atau posisinya.

<Note>

Untuk banyak kasus penggunaan, mendefinisikan `componentDidMount`, `componentDidUpdate`, dan `componentWillUnmount` bersama dalam *class components* setara dengan menggunakan [`useEffect`](/reference/react/useEffect) di *function components*. Dalam kasus yang jarang terjadi di mana penting bagi kode untuk dijalankan sebelum tampilan browser, [`useLayoutEffect`](/reference/react/useLayoutEffect) adalah pilihan yang lebih tepat.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>
---

### `componentWillMount()` {/*componentwillmount*/}

<Deprecated>

API ini telah diganti namanya dari `componentWillMount` ke [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) Nama lama sudah tidak digunakan lagi. Di versi mayor React yang akan datang, hanya nama baru yang akan berfungsi.

Jalankan [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) untuk memperbaruhi komponen Anda secara otomatis.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

API ini telah diganti namanya dari `componentWillReceiveProps` ke [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) Nama lama sudah tidak digunakan lagi. Di versi mayor React yang akan datang, hanya nama baru yang akan berfungsi.

Jalankan [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) untuk memperbaruhi komponen Anda secara otomatis.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

API ini telah diganti namanya dari `componentWillUpdate` ke [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) Nama lama sudah tidak digunakan lagi. Di versi mayor React yang akan datang, hanya nama baru yang akan berfungsi.

Jalankan [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) untuk memperbaruhi komponen Anda secara otomatis.

</Deprecated>

---

### `componentWillUnmount()` {/*componentwillunmount*/}

Jika Anda mendefinisikan metode `componentWillUnmount`, React akan memanggilnya sebelum komponen Anda dihapus *(unmounted)* dari layar. Ini adalah tempat umum untuk membatalkan pengambilan data atau menghapus langganan.

Logika di dalam `componentWillUnmount` harus "mencerminkan" logika di dalam [`componentDidMount`.](#componentdidmount) Sebagai contoh, jika `componentDidMount` mempersiapkan langganan, `componentWillUnmount` harus membersihkan langganan itu. Jika logika pembersihan di `componentWillUnmount` membaca beberapa *props* atau *state*, Anda biasanya juga perlu menerapkan [`componentDidUpdate`](#componentdidupdate) untuk membersihkan sumber daya (seperti langganan) yang sesuai dengan *props* dan *state* lama.

```js {20-22}
class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  // ...
}
```

[Lihat contoh lebih banyak.](#adding-lifecycle-methods-to-a-class-component)

#### Parameter {/*componentwillunmount-parameters*/}

`componentWillUnmount` tidak mengambil parameter apapun.

#### Kembalian {/*componentwillunmount-returns*/}

`componentWillUnmount` seharusnya tidak mengembalikan apapun.

#### Catatan penting {/*componentwillunmount-caveats*/}

- Ketika [Strict Mode](/reference/react/StrictMode) aktif, pada *development* React akan memanggil [`componentDidMount`,](#componentdidmount) kemudian segera memanggil `componentWillUnmount`, dan kemudian memanggil `componentDidMount` lagi. Ini membantu Anda memperhatikan jika Anda lupa menerapkan `componentWillUnmount` atau jika logikanya tidak sepenuhnya "mencerminkan" apa yang `componentDidMount` lakukan.

<Note>

Untuk banyak kasus penggunaan, mendefinisikan `componentDidMount`, `componentDidUpdate`, dan `componentWillUnmount` bersama pada *class components* setara dengan memanggil [`useEffect`](/reference/react/useEffect) pada *function components*. Dalam kasus yang jarang terjadi di mana penting bagi kode untuk dijalankan sebelum tampilan browser, [`useLayoutEffect`](/reference/react/useLayoutEffect) adalah pilihan yang lebih tepat.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Note>

---

### `forceUpdate(callback?)` {/*forceupdate*/}

Memaksa komponen untuk me-*render* ulang.

Biasanya, ini tidak perlu. Jika metode [`render`](#render) komponen Anda hanya baca(only reads) dari [`this.props`](#props), [`this.state`](#state), atau [`this.context`,](#context) akan me-*render* ulang otomatis ketika Anda memanggil [`setState`](#setstate) di dalam komponen Anda atau salah satu dari *parent*. Namun, Jika metode `render` komponen Anda membaca secara langsung dari sumber data eksternal, Anda harus memberi tahu React untuk memperbarui antarmuka pengguna saat sumber data itu berubah. Itulah yang `forceUpdate` memungkinkan Anda melakukannya.

Cobalah untuk menghindari semua penggunaan `forceUpdate` dan hanya membaca dari `this.props` dan `this.state` pada `render`.

#### Parameter {/*forceupdate-parameters*/}

* **optional** `callback` Jika ditentukan, React akan memanggil `callback` yang Anda berikan setelah pembaruan dilakukan.

#### Kembalian {/*forceupdate-returns*/}

`forceUpdate` tidak mengembalikan apapun.

#### Catatan penting {/*forceupdate-caveats*/}

- Jika Anda memanggil `forceUpdate`, React akan me-*render* ulang tanpa memanggil [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Membaca sumber data eksternal dan memaksa komponen kelas untuk me-*render* ulang sebagai respons terhadap perubahannya `forceUpdate` telah digantikan oleh [`useSyncExternalStore`](/reference/react/useSyncExternalStore) pada *function components*.

</Note>

---

<<<<<<< HEAD
### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

API ini akan dihapus di versi mayor React yang akan datang. [Gunakan `Context.Provider` sebagai gantinya.](/reference/react/createContext#provider)

</Deprecated>

Memungkinkan Anda menentukan nilai untuk [legacy context](https://reactjs.org/docs/legacy-context.html) yang disediakan oleh komponen ini.

---

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
### `getSnapshotBeforeUpdate(prevProps, prevState)` {/*getsnapshotbeforeupdate*/}

Jika Anda mengimplementasikan `getSnapshotBeforeUpdate`, React akan segera memanggilnya sebelum React memperbarui DOM. Ini memungkinkan komponen Anda untuk menangkap beberapa informasi dari DOM (e.g. posisi *scroll*) sebelum berpotensi diubah. Nilai apa pun yang dikembalikan oleh *lifecycle method* ini akan diteruskan sebagai parameter ke [`componentDidUpdate`.](#componentdidupdate)

Misalnya, Anda dapat menggunakannya di UI seperti utas obrolan yang perlu mempertahankan posisi *scroll*-nya selama pembaruan:

```js {7-15,17}
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Apakah kita menambahkan item baru ke dalam list?
    // Tangkap posisi scroll supaya kita dapat mengatur scroll nanti.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // Apabila kita memiliki nilai snapshot, kita baru saja menambahkan item baru.
    // Atur scroll supaya item-item baru ini tidak mendorong item-item lama ke luar tampilan.
    // (snapshot adalah nilai yang dikembalikan dari getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      const list = this.listRef.current;
      list.scrollTop = list.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.listRef}>{/* ...contents... */}</div>
    );
  }
}
```

Pada contoh di atas, penting untuk membaca properti `scrollHeight` secara langsung di `getSnapshotBeforeUpdate`. Tidak aman untuk membacanya di [`render`](#render), [`UNSAFE_componentWillReceiveProps`](#unsafe_componentwillreceiveprops), atau [`UNSAFE_componentWillUpdate`](#unsafe_componentwillupdate) karena ada potensi jeda waktu antara pemanggilan metode ini dan React memperbarui DOM.

#### Parameter {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: *Props* sebelum pembaharuan. Membandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum pembaharuan. Membandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

#### Kembalian {/*getsnapshotbeforeupdate-returns*/}

Anda harus mengembalikan nilai snapshot dari jenis apa pun yang Anda inginkan, atau `null`. Nilai yang Anda kembalikan akan diteruskan sebagai argumen ketiga pada [`componentDidUpdate`.](#componentdidupdate)

#### Catatan penting {/*getsnapshotbeforeupdate-caveats*/}

- `getSnapshotBeforeUpdate` tidak akan dipanggil jika [`shouldComponentUpdate`](#shouldcomponentupdate) didefinisikan dan mengembalikan `false`.

<Note>

Saat ini, tidak ada yang setara dengan `getSnapshotBeforeUpdate` untuk *function components*. Kasus penggunaan ini sangat jarang, tetapi jika Anda membutuhkannya, untuk sekarang Anda harus menulis sebuah *class component*.

</Note>

---

### `render()` {/*render*/}

Metode `render` adalah satu-satunya metode yang diperlukan dalam *class component*.

Metode `render` harus menentukan apa yang ingin Anda tampilkan di layar, misalnya:

```js {4-6}
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React dapat memanggil `render` kapan saja, jadi Anda tidak boleh berasumsi bahwa itu berjalan pada waktu tertentu. Biasanya, metode `render` harus mengembalikan sebagian dari [JSX](/learn/writing-markup-with-jsx), tetapi beberapa [jenis *return* lainnya](#render-returns) (seperti strings) didukung. Untuk menghitung JSX yang dikembalikan, metode `render` dapat membaca[`this.props`](#props), [`this.state`](#state), dan [`this.context`](#context).

Anda harus menulis metode `render` sebagai *pure function*, artinya ia harus mengembalikan hasil yang sama jika *props*, *state*, dan *context*-nya sama. Itu juga tidak boleh mengandung *side effects* (seperti menyiapkan *subscriptions*) atau interaksi dengan API peramban. Side effects harus terjadi baik dalam *event handlers* atau metode seperti [`componentDidMount`.](#componentdidmount)

#### Parameter {/*render-parameters*/}

* `prevProps`: *Props* sebelum pembaruan. Bandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum pembaruan. Bandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

#### Kembalian {/*render-returns*/}

`render` dapat mengembalikan *node* React apa pun yang valid. Ini termasuk elemen-elemen React seperti `<div />`, strings, numbers, [portals](/reference/react-dom/createPortal), *nodes* kosong (`null`, `undefined`, `true`, dan `false`), dan arrays dari React *nodes*.

#### Catatan penting {/*render-caveats*/}

- `render` harus ditulis sebagai pure function dari *props*, *state*, dan *context*. Seharusnya tidak memiliki *side effects*.

- `render` tidak akan dipanggil jika [`shouldComponentUpdate`](#shouldcomponentupdate) didefinisikan dan mengembalikan `false`.

- Ketika [Strict Mode](/reference/react/StrictMode) aktif, React akan memanggil `render` dua kali dalam *development* dan kemudian membuang salah satu hasilnya. Ini membantu Anda melihat efek samping yang tidak disengaja yang perlu dipindahkan dari metode `render`.

- Tidak ada korespondensi satu-satu antara panggilan `render` dan panggilan `componentDidMount` atau panggilan `componentDidUpdate`. Beberapa hasil panggilan `render` mungkin dibuang oleh React jika bermanfaat.

---

### `setState(nextState, callback?)` {/*setstate*/}

Memanggil `setState` untuk mengupdate *state* dari komponen React Anda.

```js {8-10}
class Form extends Component {
  state = {
    name: 'Taylor',
  };

  handleNameChange = (e) => {
    const newName = e.target.value;
    this.setState({
      name: newName
    });
  }

  render() {
    return (
      <>
        <input value={this.state.name} onChange={this.handleNameChange} />
        <p>Hello, {this.state.name}.</p>
      </>
    );
  }
}
```

`setState` mengantrekan perubahan ke *state* komponen. Ini memberi tahu React bahwa komponen ini dan turunannya perlu di-*render* ulang dengan *state* baru. Ini adalah cara utama Anda memperbarui antarmuka pengguna sebagai respons terhadap interaksi.

<Pitfall>

Memanggil `setState` **tidak** mengubah *state* saat ini di kode yang sudah dieksekusi:

```js {6}
function handleClick() {
  console.log(this.state.name); // "Taylor"
  this.setState({
    name: 'Robin'
  });
  console.log(this.state.name); // Still "Taylor"!
}
```

Ini hanya memengaruhi apa yang akan dikembalikan oleh `this.state` mulai dari render *berikutnya*.

</Pitfall>

Anda juga dapat meneruskan fungsi ke `setState`. Ini memungkinkan Anda memperbarui *state* berdasarkan *state* sebelumnya:

```js {2-6}
  handleIncreaseAge = () => {
    this.setState(prevState => {
      return {
        age: prevState.age + 1
      };
    });
  }
```

Anda tidak harus melakukan ini, tetapi akan berguna jika Anda ingin memperbarui *state* beberapa kali selama *event* yang sama.

#### Parameter {/*setstate-parameters*/}

* `nextState`: Baik objek atau fungsi.
  * Jika Anda meneruskan objek sebagai `nextState`, objek tersebut akan digabungkan secara dangkal ke dalam `this.state`.
  * Jika Anda meneruskan fungsi sebagai `nextState`, fungsi tersebut akan diperlakukan sebagai _updater function_. Itu harus murni, harus mengambil `state` dan `props` yang tertunda sebagai argumen, dan harus mengembalikan objek untuk digabungkan secara dangkal ke dalam `this.state`. React akan menempatkan fungsi pembaru Anda dalam antrean dan merender ulang komponen Anda. Selama render berikutnya, React akan menghitung *state* selanjutnya dengan menerapkan semua pembaruan yang antri ke *state* sebelumnya.

* **opsional** `callback`: Jika ditentukan, React akan memanggil `callback` yang Anda berikan setelah pembaruan dilakukan.

#### Kembalian {/*setstate-returns*/}

`setState` tidak mengembalikan apapun.

#### Catatan penting {/*setstate-caveats*/}

- Pikirkan `setState` sebagai *permintaan* daripada perintah langsung untuk memperbarui komponen. Ketika beberapa komponen memperbarui *state*-nya sebagai respons terhadap suatu *event*, React akan mengelompokkan pembaruannya dan merendernya kembali bersama-sama dalam satu lintasan di akhir *event*. Dalam kasus yang jarang terjadi saat Anda perlu memaksa pembaruan *state* tertentu untuk diterapkan secara sinkron, Anda dapat menggabungkannya dalam [`flushSync`,](/reference/react-dom/flushSync) tetapi ini dapat mengganggu kinerja.

- `setState` tidak segera memperbarui `this.state`. Hal ini membuat pembacaan `this.state` tepat setelah memanggil `setState` menjadi potensial jebakan. Sebagai gantinya, gunakan [`componentDidUpdate`](#componentdidupdate) atau argumen setState `callback`, yang keduanya dijamin akan aktif setelah pembaruan diterapkan. Jika Anda perlu menyetel *state* berdasarkan *state* sebelumnya, Anda dapat meneruskan fungsi ke `nextState` seperti yang dijelaskan di atas.

<Note>

Memanggil `setState` pada *class components* mirip dengan memanggil [fungsi `set`](/reference/react/useState#setstate) pada *function components*.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Note>

---

### `shouldComponentUpdate(nextProps, nextState, nextContext)` {/*shouldcomponentupdate*/}

Jika Anda mendefinisikan `shouldComponentUpdate`, React akan memanggilnya untuk menentukan apakah *render* ulang dapat dilewati.

Jika Anda yakin ingin menulisnya dengan tangan, Anda dapat membandingkan `this.props` dengan `nextProps` dan `this.state` dengan `nextState` dan mengembalikan `false` untuk memberi tahu React bahwa pembaruan dapat dilewati.

```js {6-18}
class Rectangle extends Component {
  state = {
    isHovered: false
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.position.x === this.props.position.x &&
      nextProps.position.y === this.props.position.y &&
      nextProps.size.width === this.props.size.width &&
      nextProps.size.height === this.props.size.height &&
      nextState.isHovered === this.state.isHovered
    ) {
      // Tidak ada yang berubah, jadi tidak perlu render ulang
      return false;
    }
    return true;
  }

  // ...
}

```

React memanggil `shouldComponentUpdate` sebelum *render*-ing ketika *props* baru atau *state* sedang diterima. Default `true`. Metode ini tidak dipanggil untuk *render* awal atau saat [`forceUpdate`](#forceupdate) digunakan.

#### Parameter {/*shouldcomponentupdate-parameters*/}

<<<<<<< HEAD
- `nextProps`: Props berikutnya yang akan dirender oleh komponen. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextState`: *State* berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextState` dengan [`this.state`](#props) untuk menentukan apa yang berubah.
- `nextContext`: Konteks berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextContext` dengan [`this.context`](#context) untuk menentukan apa yang berubah. Hanya tersedia jika Anda menetapkan [`static contextType`](#static-contexttypes) (modern) atau [`static contextTypes`](#static-contexttypes) (legacy).
=======
- `nextProps`: The next props that the component is about to render with. Compare `nextProps` to [`this.props`](#props) to determine what changed.
- `nextState`: The next state that the component is about to render with. Compare `nextState` to [`this.state`](#props) to determine what changed.
- `nextContext`: The next context that the component is about to render with. Compare `nextContext` to [`this.context`](#context) to determine what changed. Only available if you specify [`static contextType`](#static-contexttype).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

#### Kembalian {/*shouldcomponentupdate-returns*/}

Mengembalikan `true` jika Anda ingin komponen di-*render* ulang. Itu merupakan perilaku default.

Mengembalikan `false` untuk memberitahu React bahwa *render* ulang dapat dilewati.

#### Catatan penting {/*shouldcomponentupdate-caveats*/}

- Metode ini *hanya* ada sebagai pengoptimalan kinerja. Jika komponen Anda rusak tanpanya, perbaiki terlebih dahulu. 

- Pertimbangkan untuk menggunakan [`PureComponent`](/reference/react/PureComponent) daripada menulis `shouldComponentUpdate` secara manual. `PureComponent` secara dangkal membandingkan *props* dan *state*, dan mengurangi kemungkinan Anda melewati pembaruan yang diperlukan.

- Kami tidak menyarankan melakukan pemeriksaan kesetaraan mendalam atau menggunakan `JSON.stringify` di `shouldComponentUpdate`. Itu membuat kinerja tidak dapat diprediksi dan bergantung pada struktur data setiap *prop* dan *state*. Dalam kasus terbaik, Anda berisiko memperkenalkan henti selama beberapa detik pada aplikasi Anda, dan dalam kasus terburuk Anda berisiko membuatnya crash.

- Mengembalikan `false` tidak mencegah komponen turunan dari *render*-ing ulang ketika *state* *mereka* berubah.

- Mengembalikan `false` tidak *menjamin* bahwa komponen tidak akan di-*render* ulang. React akan menggunakan nilai yang dikembalikan sebagai petunjuk tetapi mungkin masih memilih untuk me-*render* ulang komponen Anda jika masuk akal untuk dilakukan karena alasan lain.

<Note>

Mengoptimalkan *class components* dengan `shouldComponentUpdate` serupa dengan mengoptimalkan *function components* dengan [`memo`.](/reference/react/memo) *Function components* juga menawarkan pengoptimalan yang lebih terperinci dengan [`useMemo`.](/reference/react/useMemo)

</Note>

---

### `UNSAFE_componentWillMount()` {/*unsafe_componentwillmount*/}

Jika Anda mendefinisikan `UNSAFE_componentWillMount`, React akan memanggilnya segera setelah [`constructor`.](#constructor) Itu hanya ada karena alasan historis dan tidak boleh digunakan dalam kode baru apa pun. Sebagai gantinya, gunakan salah satu alternatif:

- Untuk menginisialisasi *state*, deklarasikan [`state`](#state) sebagai bidang kelas atau setel `this.state` di dalam [`konstruktor`.](#konstruktor)
- Jika Anda perlu menjalankan efek samping atau menyiapkan langganan, pindahkan logika tersebut ke [`componentDidMount`](#componentdidmount) sebagai gantinya.

[Lihat contoh migrasi dari *unsafe lifecycles*.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameter {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` tidak menggunakan parameter apa pun.

#### Kembalian {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` seharusnya tidak mengembalikan apa pun.

#### Catatan penting {/*unsafe_componentwillmount-caveats*/}

- `UNSAFE_componentWillMount` tidak akan dipanggil jika komponen mengimplementasikan [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) atau [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Terlepas dari namanya, `UNSAFE_componentWillMount` tidak menjamin bahwa komponen *akan* dipasang jika aplikasi Anda menggunakan fitur React modern seperti [`Suspense`.](/reference/react/Suspense) Jika upaya render ditangguhkan (misalnya, karena kode untuk beberapa komponen anak belum dimuat), React akan membuang pohon yang sedang berjalan dan mencoba membangun komponen dari awal selama upaya berikutnya. Inilah mengapa metode ini "tidak aman". Kode yang bergantung pada pemasangan (seperti menambahkan langganan) harus masuk ke [`componentDidMount`.](#componentdidmount)

- `UNSAFE_componentWillMount` adalah satu-satunya metode siklus hidup yang berjalan selama [server rendering.](/reference/react-dom/server) Untuk semua tujuan praktis, ini identik dengan [`constructor`,](#constructor) sehingga Anda harus menggunakan `konstruktor` untuk jenis logika ini.

<Note>

Memanggil [`setState`](#setstate) di dalam `UNSAFE_componentWillMount` dalam *class component* untuk menginisialisasi *state* sama dengan meneruskan *state* tersebut sebagai *state* awal ke [`useState`](/reference/react/useState) dalam *function components*.

</Note>

---

### `UNSAFE_componentWillReceiveProps(nextProps, nextContext)` {/*unsafe_componentwillreceiveprops*/}

Jika Anda mendefinisikan `UNSAFE_componentWillReceiveProps`, React akan memanggilnya ketika komponen menerima *props* baru. Itu hanya ada karena alasan historis dan tidak boleh digunakan dalam kode baru apa pun. Sebagai gantinya, gunakan salah satu alternatif:

- Jika Anda perlu **menjalankan efek samping** (misalnya, mengambil data, menjalankan animasi, atau menginisialisasi ulang langganan) sebagai respons terhadap perubahan *prop*, pindahkan logika tersebut ke [`componentDidUpdate`](#componentdidupdate) sebagai gantinya.
- Jika Anda perlu **menghindari komputasi ulang beberapa data hanya saat prop berubah,** gunakan [memoization helper](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization) sebagai gantinya.
- Jika Anda perlu **"mereset" beberapa state saat prop berubah,** pertimbangkan untuk membuat komponen [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) atau [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) sebagai gantinya.
- Jika Anda perlu **"menyesuaikan" beberapa status saat prop berubah,** periksa apakah Anda dapat menghitung semua informasi yang diperlukan hanya dari *prop* selama *render*-ing. Jika tidak bisa, gunakan [`static getDerivedStateFromProps`](/reference/react/Component#static-getderivedstatefromprops) sebagai gantinya.

[Lihat contoh migrasi dari *unsafe lifecycles*.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#updating-state-based-on-props)

#### Parameter {/*unsafe_componentwillreceiveprops-parameters*/}

<<<<<<< HEAD
- `nextProps`: *Props* berikutnya yang akan diterima komponen dari komponen induknya. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextContext`: *Props* berikutnya yang akan diterima komponen dari penyedia terdekat. Bandingkan `nextContext` dengan [`this.context`](#context) untuk menentukan apa yang berubah. Hanya tersedia jika Anda menetapkan [`static contextType`](#static-contexttype) (modern) atau [`static contextTypes`](#static-contexttypes) (legacy).
=======
- `nextProps`: The next props that the component is about to receive from its parent component. Compare `nextProps` to [`this.props`](#props) to determine what changed.
- `nextContext`: The next context that the component is about to receive from the closest provider. Compare `nextContext` to [`this.context`](#context) to determine what changed. Only available if you specify [`static contextType`](#static-contexttype).
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e

#### Kembalian {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` seharusnya tidak mengembalikan apa pun.

#### Catatan penting {/*unsafe_componentwillreceiveprops-caveats*/}

- `UNSAFE_componentWillReceiveProps` tidak akan dipanggil jika komponen mengimplementasikan [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) atau [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Terlepas dari namanya, `UNSAFE_componentWillReceiveProps` tidak menjamin bahwa komponen *akan* menerima props tersebut jika aplikasi Anda menggunakan fitur React modern seperti [`Suspense`.](/reference/react/Suspense) Jika upaya *render* ditangguhkan (misalnya , karena kode untuk beberapa komponen anak belum dimuat), React akan membuang pohon yang sedang dalam proses dan mencoba membangun komponen dari awal selama upaya berikutnya. Pada saat percobaan *render* berikutnya, *props* mungkin berbeda. Inilah mengapa metode ini "tidak aman". Kode yang harus dijalankan hanya untuk pembaruan yang dilakukan (seperti menyetel ulang langganan) harus masuk ke [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillReceiveProps` tidak berarti bahwa komponen telah menerima props yang *berbeda* dari sebelumnya. Anda perlu membandingkan `nextProps` dan `this.props` sendiri untuk memeriksa apakah ada yang berubah.

- React tidak memanggil `UNSAFE_componentWillReceiveProps` dengan *props awal* selama *mounting*. Itu hanya memanggil metode ini jika beberapa *props* komponen akan diperbarui. Misalnya, memanggil [`setState`](#setstate) biasanya tidak memicu `UNSAFE_componentWillReceiveProps` di dalam komponen yang sama.

<Note>

Memanggil [`setState`](#setstate) dalam `UNSAFE_componentWillReceiveProps` pada *class component* untuk "menyesuaikan" state sama dengan  [memanggil fungsi `set` dari `useState` selama *render*-ing](/reference/react/useState#storing-information-from-previous-renders) dalam *function component*.

</Note>

---

### `UNSAFE_componentWillUpdate(nextProps, nextState)` {/*unsafe_componentwillupdate*/}


Jika Anda mendefinisikan `UNSAFE_componentWillUpdate`, React akan memanggilnya sebelum me-*render* dengan *props* atau *state* baru. Itu hanya ada karena alasan historis dan tidak boleh digunakan dalam kode baru apa pun. Sebagai gantinya, gunakan salah satu alternatif:

- Jika Anda perlu menjalankan efek samping (misalnya, mengambil data, menjalankan animasi, atau menginisialisasi ulang langganan) sebagai respons terhadap perubahan *prop* atau *state*, pindahkan logika tersebut ke [`componentDidUpdate`](#componentdidupdate) sebagai gantinya.
- Jika Anda perlu membaca beberapa informasi dari DOM (misalnya, untuk menyimpan posisi gulir saat ini) sehingga Anda dapat menggunakannya di [`componentDidUpdate`](#componentdidupdate) nanti, baca di dalam [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate ) sebagai gantinya.

[Lihat contoh migrasi dari *unsafe lifecycles*.](https://legacy.reactjs.org/blog/2018/03/27/update-on-async-rendering.html#examples)

#### Parameter {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: *Props* berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextState`: *State* selanjutnya yang akan di-*render* oleh komponen. Bandingkan `nextState` dengan [`this.state`](#state) untuk menentukan apa yang berubah.

#### Kembalian {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` seharusnya tidak mengembalikan apa pun.

#### Catatan penting {/*unsafe_componentwillupdate-caveats*/}

- `UNSAFE_componentWillUpdate` tidak akan dipanggil jika [`shouldComponentUpdate`](#shouldcomponentupdate) ditentukan dan mengembalikan `false`.

- `UNSAFE_componentWillUpdate` tidak akan dipanggil jika komponen mengimplementasikan [`static getDerivedStateFromProps`](#static-getderivedstatefromprops) atau [`getSnapshotBeforeUpdate`.](#getsnapshotbeforeupdate)

- Tidak didukung untuk memanggil [`setState`](#setstate) (atau metode apa pun yang menyebabkan `setState` dipanggil, seperti *dispatching Redux action*) selama `componentWillUpdate`.

- Terlepas dari namanya, `UNSAFE_componentWillUpdate` tidak menjamin bahwa komponen *akan* diupdate jika aplikasi Anda menggunakan fitur React modern seperti [`Suspense`.](/reference/react/Suspense) Jika upaya *render* ditangguhkan (misalnya, karena kode untuk beberapa komponen anak belum dimuat), React akan membuang pohon yang sedang berjalan dan mencoba membangun komponen dari awal selama upaya berikutnya. Pada saat upaya *render* berikutnya, *props* dan *state* mungkin berbeda. Inilah mengapa metode ini "tidak aman". Kode yang harus dijalankan hanya untuk pembaruan yang dilakukan (seperti menyetel ulang langganan) harus masuk ke [`componentDidUpdate`.](#componentdidupdate)

- `UNSAFE_componentWillUpdate` tidak berarti bahwa komponen telah menerima *props* atau *state* yang *berbeda* dari sebelumnya. Anda perlu membandingkan `nextProps` dengan `this.props` dan `nextState` dengan `this.state` sendiri untuk memeriksa apakah ada yang berubah.

- React tidak memanggil `UNSAFE_componentWillUpdate` dengan *props* awal dan *state* selama pemasangan.

<Note>

Tidak ada persamaan langsung dengan `UNSAFE_componentWillUpdate` dalam *function components*.

</Note>

---

<<<<<<< HEAD
### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

API ini akan dihapus di versi mayor React yang akan datang. [Gunakan `static contextType` sebagai gantinya.](#static-contexttype)

</Deprecated>

Memungkinkan Anda menentukan [legacy context](https://reactjs.org/docs/legacy-context.html) mana yang disediakan oleh komponen ini.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

API ini akan dihapus di versi mayor React yang akan datang. [Gunakan `static contextType` sebagai gantinya.](#static-contexttype)

</Deprecated>

Memungkinkan Anda menentukan [legacy context](https://reactjs.org/docs/legacy-context.html) yang dikonsumsi oleh komponen ini.

---

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
### `static contextType` {/*static-contexttype*/}

Jika Anda ingin membaca [`this.context`](#context-instance-field) dari *class component* Anda, Anda harus menentukan *context* mana yang perlu dibaca. *Context* yang Anda tentukan sebagai `static contextType` harus berupa nilai yang dibuat sebelumnya oleh [`createContext`.](/reference/react/createContext)

```js {2}
class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}
```

<Note>

Membaca `this.context` pada *class components* setara dengan [`useContext`](/reference/react/useContext) pada *function components*.

[Lihat bagaimana cara migrasi.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

Anda dapat mendefinisikan `static defaultProps` untuk mengatur *props* bawaan untuk *class*. Mereka akan digunakan untuk `undefined` dan *props* yang hilang, tetapi tidak untuk *props* `null`.

Sebagai contoh, di sini adalah bagaimana Anda mendefinisikan bahwa *prop* `color` harus default ke `'blue'`:

```js {2-4}
class Button extends Component {
  static defaultProps = {
    color: 'blue'
  };

  render() {
    return <button className={this.props.color}>click me</button>;
  }
}
```

Jika *prop* `color` tidak disediakan atau `undefined`, maka akan disetel secara default ke `'blue'`:

```js
<>
  {/* this.props.color is "blue" */}
  <Button />

  {/* this.props.color is "blue" */}
  <Button color={undefined} />

  {/* this.props.color is null */}
  <Button color={null} />

  {/* this.props.color is "red" */}
  <Button color="red" />
</>
```

<Note>

Mendefinisikan `defaultProps` pada *class components* serupa dengan menggunakan [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) pada *function components*.

</Note>

---

<<<<<<< HEAD
### `static propTypes` {/*static-proptypes*/}

Anda dapat mendefinisikan `static propTypes` bersama dengan pustaka [`prop-types`](https://www.npmjs.com/package/prop-types) untuk mendeklarasikan jenis *props* yang diterima oleh komponen Anda. Jenis ini akan diperiksa selama *render*-ing dan hanya dalam pengembangan.

```js
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  static propTypes = {
    name: PropTypes.string
  };

  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}
```

<Note>

Kami merekomendasikan menggunakan [TypeScript](https://www.typescriptlang.org/) daripada memeriksa *prop types* pada *runtime*.

</Note>

---

=======
>>>>>>> 69edd845b9a654c6ac9ed68da19d5b42897e636e
### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

Jika Anda mendefinisikan `static getDerivedStateFromError`, React akan memanggilnya ketika komponen anak (termasuk anak jauh) melemparkan kesalahan selama *render*-ing. Ini memungkinkan Anda menampilkan pesan kesalahan alih-alih menghapus UI.

Biasanya, ini digunakan bersama dengan [`componentDidCatch`](#componentDidCatch) yang memungkinkan Anda mengirim laporan kesalahan ke beberapa layanan analitik. Komponen dengan metode ini disebut *error boundary.*

[Lihat contoh.](#catching-rendering-errors-with-an-error-boundary)

#### Parameter {/*static-getderivedstatefromerror-parameters*/}

* `error`: Kesalahan yang dilemparkan. Dalam prakteknya, biasanya akan menjadi *instance* dari [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) tetapi ini tidak dijamin karena JavaScript memungkinkan untuk [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) nilai apa saja, termasuk *strings* atau bahkan `null`.

#### Kembalian {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` harus mengembalikan *state* yang memberi tahu komponen untuk menampilkan pesan kesalahan.

#### Catatan penting {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` harus berupa *pure function*. Jika Anda ingin melakukan efek samping (misalnya, untuk memanggil layanan analitik), Anda juga perlu mengimplementasikan [`componentDidCatch`.](#componentdidcatch)

<Note>

Belum ada padanan langsung untuk `static getDerivedStateFromError` dalam *function components*. Jika Anda ingin menghindari pembuatan *class components*, tulis satu komponen `ErrorBoundary` seperti di atas dan gunakan di seluruh aplikasi Anda. Sebagai alternatif, gunakan *package*[`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) yang melakukan itu.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

Jika Anda mendefinisikan `static getDerivedStateFromProps`, React akan memanggilnya tepat sebelum memanggil [`render`,](#render) baik pada pemasangan awal maupun pembaruan berikutnya. Itu harus mengembalikan objek untuk memperbarui *state*, atau `null` untuk tidak memperbarui apa pun.

Metode ini ada untuk [kasus penggunaan yang jarang](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) di mana *states* tergantung pada perubahan *props* dari waktu ke waktu. Misalnya, komponen `Form` ini menyetel ulang *state* `email` saat *prop* `userID` berubah:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Setiap kali user saat ini berubah,
    // Setel ulang bagian state mana pun yang terkait ke user itu.
    // Dalam contoh simpel ini, hanya ada email.
    if (props.userID !== state.prevUserID) {
      return {
        prevUserID: props.userID,
        email: props.defaultEmail
      };
    }
    return null;
  }

  // ...
}
```

Perhatikan bahwa pola ini mengharuskan Anda mempertahankan nilai *prop* sebelumnya (seperti `userID`) dalam *state* (seperti `prevUserID`).

<Pitfall>

*Deriving state* mengarah ke kode *verbose* dan membuat komponen Anda sulit untuk dipikirkan. [Pastikan Anda terbiasa dengan alternatif yang lebih sederhana:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- Jika Anda perlu **melakukan efek samping** (misalnya, pengambilan data atau animasi) sebagai respons terhadap perubahan *props*, gunakan metode [`componentDidUpdate`](#componentdidupdate) sebagai gantinya.
- Jika Anda ingin **menghitung ulang beberapa data hanya saat prop berubah,** [gunakan pembantu memoisasi sebagai gantinya.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- Jika Anda ingin **"mereset" beberapa *state* saat *prop* berubah,** pertimbangkan untuk membuat komponen [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) atau [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key).

</Pitfall>

#### Parameter {/*static-getderivedstatefromprops-parameters*/}

- `props`: *Props* berikutnya yang akan di-*render* oleh komponen.
- `state`: *State* berikutnya yang akan di-*render* oleh komponen.

#### Kembalian {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` mengembalikan objek untuk memperbarui *state*, atau `null` untuk tidak memperbarui apa pun.

#### Catatan penting {/*static-getderivedstatefromprops-caveats*/}

- Metode ini diaktifkan pada *setiap* *render*, apa pun penyebabnya. hal ini berbeda dengan [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), yang hanya aktif bila induk menyebabkan *render* ulang dan bukan sebagai akibat dari `setState` lokal.

- Metode ini tidak memiliki akses ke instance komponen. Jika mau, Anda bisa menggunakan kembali beberapa kode antara `static getDerivedStateFromProps` dan metode kelas lainnya dengan mengekstraksi fungsi murni dari *props* komponen dan *state* di luar definisi kelas.

<Note>

Menerapkan `static getDerivedStateFromProps` pada *class component* setara dengan [memanggil fungsi `set` dari `useState` selama rendering](/reference/react/useState#storing-information-from-previous-renders) pada *function component*.

</Note>

---

## Penggunaan {/*usage*/}

### Mendefinisikan class component {/*defining-a-class-component*/}

Untuk mendefinisikan komponen React sebagai sebuah *class*, *extend* `Component` *class* bawaan dan definisikan [*method* `render`:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React akan memanggil metode [`render`](#render) Anda kapan pun diperlukan untuk mencari tahu apa yang akan ditampilkan di layar. Biasanya, Anda akan mengembalikan beberapa [JSX](/learn/writing-markup-with-jsx) darinya. Metode `render` Anda harus berupa [pure function:](https://en.wikipedia.org/wiki/Pure_function) yang seharusnya hanya menghitung JSX.

Mirip dengan [*function components*,](/learn/your-first-component#defining-a-component) sebuah *class component* dapat [menerima informasi dengan *props*](/learn/your-first-component#defining-a-component) dari komponen induknya. Namun, sintaks untuk membaca *props* berbeda. Misalnya, jika komponen induk me-*render* `<Greeting name="Taylor" />`, maka Anda dapat membaca *prop* `name` dari [`this.props`](#props), seperti `this.props.name`:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Perhatikan bahwa Hooks (fungsi yang dimulai dengan `use`, seperti [`useState`](/reference/react/useState)) tidak didukung di dalam *class components*.

<Pitfall>

Kami merekomendasikan mendefinisikan komponen sebagai fungsi, bukan kelas. [Lihat cara bermigrasi.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Menambahkan state pada class component {/*adding-state-to-a-class-component*/}

Untuk menambahkan [state](/learn/state-a-components-memory) ke dalam sebuah kelas, menetapkan objek ke properti yang disebut [`state`](#state). Untuk mengupdate *state*, panggil [`this.setState`](#setstate).

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = () => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack> 

<Pitfall>

Kami merekomendasikan mendefinisikan komponen sebagai fungsi, bukan kelas. [Lihat cara bermigrasi.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Menambahkan *lifecycle methods* ke *class component* {/*adding-lifecycle-methods-to-a-class-component*/}

Ada beberapa metode khusus yang dapat Anda tentukan di kelas Anda.

Jika Anda mendefinisikan metode [`componentDidMount`](#componentdidmount), React akan memanggilnya ketika komponen Anda ditambahkan *(mounted)* ke layar. React akan memanggil [`componentDidUpdate`](#componentdidupdate) setelah komponen Anda di-*render* ulang karena perubahan *props* atau *state*. React akan memanggil [`componentWillUnmount`](#componentwillunmount) setelah komponen Anda dihapus *(unmount)* dari layar.

Jika Anda mengimplementasikan `componentDidMount`, biasanya Anda perlu mengimplementasikan ketiga *lifecycles* untuk menghindari bug. Misalnya, jika `componentDidMount` membaca beberapa *state* atau *props*, Anda juga harus mengimplementasikan `componentDidUpdate` untuk menangani perubahannya, dan `componentWillUnmount` untuk membersihkan apa pun yang dilakukan `componentDidMount`.

Misalnya, komponen `ChatRoom` ini menjaga koneksi obrolan tetap tersinkronisasi dengan *props* dan *state*:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Perhatikan bahwa dalam pengembangan saat [Strict Mode](/reference/react/StrictMode) aktif, React akan memanggil `componentDidMount`, segera memanggil `componentWillUnmount`, lalu memanggil `componentDidMount` lagi. Ini membantu Anda menyadari jika Anda lupa mengimplementasikan `componentWillUnmount` atau jika logikanya tidak sepenuhnya "mencerminkan" apa yang dilakukan `componentDidMount`.

<Pitfall>

Kami merekomendasikan mendefinisikan komponen sebagai fungsi, bukan kelas. [Lihat cara bermigrasi.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Catching rendering errors with an error boundary {/*catching-rendering-errors-with-an-error-boundary*/}

Secara default, jika aplikasi Anda menampilkan kesalahan selama *render*-ing, React akan menghapus UI-nya dari layar. Untuk mencegah hal ini, Anda dapat menggabungkan sebagian UI ke dalam *error boundary*. *Error Boundary* adalah komponen khusus yang memungkinkan Anda menampilkan beberapa UI cadangan, bukan bagian yang mengalami kesalahan misalnya, pesan kesalahan.

Untuk mengimplementasikan komponen batas kesalahan (error boundary), Anda perlu menyediakan [`static getDerivedStateFromError`](#static-getderivedstatefromerror) yang memungkinkan Anda memperbarui *state* sebagai respons terhadap kesalahan dan menampilkan pesan kesalahan kepada pengguna. Anda juga dapat secara opsional mengimplementasikan [`componentDidCatch`](#componentdidcatch) untuk menambahkan beberapa logika tambahan, misalnya, untuk mencatat kesalahan ke layanan analitik.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Perbarui state sehingga render selanjutnya menunjukkan UI fallback.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Contoh "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // Anda dapat me-render UI fallback apa pun.
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Kemudian Anda dapat membungkus bagian dari pohon komponen Anda dengannya:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

Jika `Profile` atau komponen anaknya mengalami kesalahan, `ErrorBoundary` akan "menangkap" kesalahan tersebut, menampilkan UI cadangan dengan pesan kesalahan yang telah Anda sediakan, dan mengirim laporan kesalahan produksi ke layanan pelaporan kesalahan Anda.

Anda tidak perlu melibatkan setiap komponen ke dalam batas kesalahan (error boundary) yang terpisah. Saat Anda mempertimbangkan [granularitas dari batas kesalahan,](https://aweary.dev/fault-tolerance-react/) pertimbangkan di mana tepatnya menampilkan pesan kesalahan. Sebagai contoh, dalam aplikasi pesan, masuk akal untuk menempatkan batas kesalahan di sekitar daftar percakapan. Juga masuk akal untuk menempatkannya di sekitar setiap pesan individu. Namun, tidak masuk akal untuk menempatkan batasan di sekitar setiap avatar.

<Note>

Saat ini, belum ada cara untuk menulis batas kesalahan sebagai *function component*. Namun, Anda tidak perlu menulis kelas batas kesalahan sendiri. Sebagai contoh, Anda dapat menggunakan [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) sebagai gantinya.

</Note>

---

## Alternatif {/*alternatives*/}

### Migrasi komponen sederhana dari *class* ke sebuah *function* {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Biasanya, Anda akan [mendefinisikan komponen sebagai `functions`](/learn/your-first-component#defining-a-component).

Sebagai contoh, asumsikan Anda sedang mengonversi komponen kelas `Greeting` ini menjadi sebuah fungsi:

<Sandpack>

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

Tentukan sebuah fungsi yang disebut `Greeting`. Di sinilah Anda akan memindahkan tubuh fungsi `render` Anda.

```js
function Greeting() {
  // ... pindahkan kode dari `render method` di sini ...
}
```

Sebagai pengganti `this.props.name`, definisikan prop `name` [menggunakan sintaks *destructuring*](/learn/passing-props-to-a-component) dan gunakan secara langsung:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Berikut contoh lengkapnya:

<Sandpack>

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sara" />
      <Greeting name="Cahal" />
      <Greeting name="Edite" />
    </>
  );
}
```

</Sandpack>

---

### Migrasi komponen dengan `state` dari kelas ke fungsi {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Asumsikan Anda sedang mengonversi komponen kelas `Counter` ini menjadi sebuah fungsi.

<Sandpack>

```js
import { Component } from 'react';

export default class Counter extends Component {
  state = {
    name: 'Taylor',
    age: 42,
  };

  handleNameChange = (e) => {
    this.setState({
      name: e.target.value
    });
  }

  handleAgeChange = (e) => {
    this.setState({
      age: this.state.age + 1 
    });
  };

  render() {
    return (
      <>
        <input
          value={this.state.name}
          onChange={this.handleNameChange}
        />
        <button onClick={this.handleAgeChange}>
          Increment age
        </button>
        <p>Hello, {this.state.name}. You are {this.state.age}.</p>
      </>
    );
  }
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

Mulai dengan mendeklarasikan sebuah fungsi dengan variabel [state](/reference/react/useState#adding-state-to-a-component) yang diperlukan:

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Selanjutnya, konversi  `event handlers`:

```js {5-7,9-11}
function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }
  // ...
```

Terakhir, gantikan semua referensi yang dimulai dengan `this` dengan variabel dan fungsi yang Anda definisikan di komponen Anda. Misalnya, gantikan `this.state.age` dengan `age`, dan gantikan `this.handleNameChange` dengan `handleNameChange`.

Berikut adalah komponen yang telah sepenuhnya dikonversi:

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  function handleNameChange(e) {
    setName(e.target.value);
  }

  function handleAgeChange() {
    setAge(age + 1);
  }

  return (
    <>
      <input
        value={name}
        onChange={handleNameChange}
      />
      <button onClick={handleAgeChange}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  )
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

---

### Migrasi sebuah komponen dengan *lifecycle methods* dari kelas ke fungsi {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Asumsikan Anda sedang mengonversi komponen kelas `ChatRoom` ini dengan *lifecycle methods* ke sebuah fungsi:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { Component } from 'react';
import { createConnection } from './chat.js';

export default class ChatRoom extends Component {
  state = {
    serverUrl: 'https://localhost:1234'
  };

  componentDidMount() {
    this.setupConnection();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.roomId !== prevProps.roomId ||
      this.state.serverUrl !== prevState.serverUrl
    ) {
      this.destroyConnection();
      this.setupConnection();
    }
  }

  componentWillUnmount() {
    this.destroyConnection();
  }

  setupConnection() {
    this.connection = createConnection(
      this.state.serverUrl,
      this.props.roomId
    );
    this.connection.connect();    
  }

  destroyConnection() {
    this.connection.disconnect();
    this.connection = null;
  }

  render() {
    return (
      <>
        <label>
          Server URL:{' '}
          <input
            value={this.state.serverUrl}
            onChange={e => {
              this.setState({
                serverUrl: e.target.value
              });
            }}
          />
        </label>
        <h1>Welcome to the {this.props.roomId} room!</h1>
      </>
    );
  }
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Sebuah implementasi nyata sebenarnya akan terhubung ke server.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Pertama, verifikasi bahwa metode [`componentWillUnmount`](#componentwillunmount) Anda melakukan kebalikan dari [`componentDidMount`](#componentdidmount). Pada contoh di atas, hal ini terjadi: metode tersebut memutuskan koneksi yang dibuat oleh `componentDidMount`. Jika logika semacam itu tidak ada, tambahkan terlebih dahulu.

Selanjutnya, pastikan metode [`componentDidUpdate`](#componentdidupdate) Anda menangani perubahan pada semua prop dan state yang Anda gunakan di `componentDidMount`. Pada contoh di atas, `componentDidMount` memanggil `setupConnection` yang membaca `this.state.serverUrl` dan `this.props.roomId`. Oleh karena itu, `componentDidUpdate` memeriksa apakah `this.state.serverUrl` dan `this.props.roomId` telah berubah, dan mereset koneksi jika iya. Jika logika `componentDidUpdate` Anda tidak ada atau tidak menangani perubahan pada semua prop dan state yang relevan, perbaiki terlebih dahulu.

Pada contoh di atas, logika di dalam metode siklus hidup menghubungkan komponen ke sistem di luar React (sebuah server obrolan). Untuk menghubungkan sebuah komponen ke sistem eksternal, [jelaskan logika ini sebagai sebuah Efek tunggal:](/reference/react/useEffect#connecting-to-an-external-system)

```js {6-12}
import { useState, useEffect } from 'react';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  // ...
}
```

Panggilan [`useEffect`](/reference/react/useEffect) ini setara dengan logika dalam *lifecycle methods* di atas. Jika *lifecycle methods* Anda melakukan beberapa hal yang tidak terkait, [pisahkan mereka menjadi beberapa Efek independen.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Berikut adalah contoh lengkap yang dapat Anda coba:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection(serverUrl, roomId) {
  // Sebuah implementasi nyata sebenarnya akan terhubung ke server.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

<Note>

Jika komponen Anda tidak disinkronkan dengan sistem eksternal apapun, [Anda mungkin tidak membutuhkan sebuah *Effect*.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrasi komponen dengan `context` dari kelas ke fungsi {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

Pada contoh ini, kelas komponen `Panel` dan `Button` membaca [context](/learn/passing-data-deeply-with-context) dari [`this.context`:](#context)

<Sandpack>

```js
import { createContext, Component } from 'react';

const ThemeContext = createContext(null);

class Panel extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'panel-' + theme;
    return (
      <section className={className}>
        <h1>{this.props.title}</h1>
        {this.props.children}
      </section>
    );    
  }
}

class Button extends Component {
  static contextType = ThemeContext;

  render() {
    const theme = this.context;
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {this.props.children}
      </button>
    );
  }
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Ketika Anda mengonversi ke komponen fungsi, ubah `this.context` dengan memanggil [`useContext`](/reference/react/useContext):

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>
