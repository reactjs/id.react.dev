---
title: Component
---

<Pitfall>

Kami merekomendasikan mendefinisikan komponen sebagai fungsi dari pada kelas. [Lihat bagaimana cara migrasi.](#alternatives)

</Pitfall>

<Intro>

`Component` adalah kelas dasar untuk komponen React yang didefinisikan segabai [JavaScript classes.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) Kelas komponen masih disuport oleh React, tetapi kami tidak merekomendasikan untuk menggunakannya di kode baru.

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

Untuk mendefinisikan sebuah komponen React sebagai sebuah kelas, *extend* kelas `Component` bawaan dan definisikan [`render` method:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Halo, {this.props.name}!</h1>;
  }
}
```

Hanya `render` *method* yang diperlukan, *methods* yang lain adalah opsional.

[Lihat lebih banyak contoh di bawah](#usage)

---

### `context` {/*context*/}

[Context](/learn/passing-data-deeply-with-context) dari sebuah *class component* tersedia sebagai `this.context`. Ini hanya tersedia jika Anda menentukan context *yang mana* yang ingin Anda terima menggunakan [`static contextType`](#static-contexttype) (modern) atau [`static contextTypes`](#static-contexttypes) (deprecated).

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

### `refs` {/*refs*/}

<Deprecated>

API ini akan dihapus pada versi utama React di masa depan. [Gunakan `createRef` sebagai gantinya.](/reference/react/createRef)

</Deprecated>

Memungkinkan Anda mengakses [legacy string refs](https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs) pada komponen ini.

---

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

#### Parameters {/*constructor-parameters*/}

* `props`: Props awal komponen.

#### Returns {/*constructor-returns*/}

`constructor` seharusnya tidak mengembalikan apapun.

#### Caveats {/*constructor-caveats*/}

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

#### Parameters {/*componentdidcatch-parameters*/}

* `error`: *Error* yang dilempar. Pada praktiknya, biasanya akan berupa sebuah *instance* dari [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) tetapi ini tidak dijamin karena JavaScript memungkinkan untuk [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) nilai apa pun, termasuk string atau bahkan null.

* `info`: Objek yang berisi informasi tambahan tentang *error*. *Field* `componentStack` berisi jejak tumpukan(*stack trace*) dengan komponen yang melempar kesalahan, serta nama-nama dan lokasi sumber dari semua komponen induknya. Di produksi, nama komponennya akan di-*minified*. Jika Anda mengatur *error reporting* di produksi, Anda dapat mendekode jejak tumpukan(*stack trace*) komponen menggunakan *sourcemaps* dengan cara yang sama seperti yang Anda lakukan untuk jejak tumpukan(*stack trace*) kesalahan JavaScript biasa.

#### Returns {/*componentdidcatch-returns*/}

`componentDidCatch` seharusnya tidak mengembalikan apapun.

#### Caveats {/*componentdidcatch-caveats*/}

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

#### Parameters {/*componentdidmount-parameters*/}

`componentDidMount` tidak mengambil parameter apa pun.

#### Returns {/*componentdidmount-returns*/}

`componentDidMount` seharusnya tidak mengembalikan apapun.

#### Caveats {/*componentdidmount-caveats*/}

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


#### Parameters {/*componentdidupdate-parameters*/}

* `prevProps`: Props sebelum update. Membandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum update. Membandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

* `snapshot`: Jika Anda mengimplementasikan [`getSnapshotBeforeUpdate`](#getsnapshotbeforeupdate), `snapshot` akan berisi nilai yang Anda kembalikan dari metode tersebut. Jika tidak, nilainya akan `undefined`.

#### Returns {/*componentdidupdate-returns*/}

`componentDidUpdate` seharusnya tidak mengembalikan apapun.

#### Caveats {/*componentdidupdate-caveats*/}

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

API ini telah diganti namanya dari `componentWillMount` ke [`UNSAFE_componentWillMount`.](#unsafe_componentwillmount) Nama lama sudah tidak digunakan lagi. Di versi utama React yang akan datang, hanya nama baru yang akan berfungsi.

Jalankan [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) untuk memperbaruhi komponen Anda secara otomatis.

</Deprecated>

---

### `componentWillReceiveProps(nextProps)` {/*componentwillreceiveprops*/}

<Deprecated>

API ini telah diganti namanya dari `componentWillReceiveProps` ke [`UNSAFE_componentWillReceiveProps`.](#unsafe_componentwillreceiveprops) Nama lama sudah tidak digunakan lagi. Di versi utama React yang akan datang, hanya nama baru yang akan berfungsi.

Jalankan [`rename-unsafe-lifecycles` codemod](https://github.com/reactjs/react-codemod#rename-unsafe-lifecycles) untuk memperbaruhi komponen Anda secara otomatis.

</Deprecated>

---

### `componentWillUpdate(nextProps, nextState)` {/*componentwillupdate*/}

<Deprecated>

API ini telah diganti namanya dari `componentWillUpdate` ke [`UNSAFE_componentWillUpdate`.](#unsafe_componentwillupdate) Nama lama sudah tidak digunakan lagi. Di versi utama React yang akan datang, hanya nama baru yang akan berfungsi.

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

#### Parameters {/*componentwillunmount-parameters*/}

`componentWillUnmount` tidak mengambil parameter apapun.

#### Returns {/*componentwillunmount-returns*/}

`componentWillUnmount` seharusnya tidak mengembalikan apapun.

#### Caveats {/*componentwillunmount-caveats*/}

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

#### Parameters {/*forceupdate-parameters*/}

* **optional** `callback` Jika ditentukan, React akan memanggil `callback` yang Anda berikan setelah pembaruan dilakukan.

#### Returns {/*forceupdate-returns*/}

`forceUpdate` tidak mengembalikan apapun.

#### Caveats {/*forceupdate-caveats*/}

- Jika Anda memanggil `forceUpdate`, React akan me-*render* ulang tanpa memanggil [`shouldComponentUpdate`.](#shouldcomponentupdate)

<Note>

Membaca sumber data eksternal dan memaksa komponen kelas untuk me-*render* ulang sebagai respons terhadap perubahannya `forceUpdate` telah digantikan oleh [`useSyncExternalStore`](/reference/react/useSyncExternalStore) pada *function components*.

</Note>

---

### `getChildContext()` {/*getchildcontext*/}

<Deprecated>

API ini akan dihapus di versi utama React yang akan datang. [Gunakan `Context.Provider` sebagai gantinya.](/reference/react/createContext#provider)

</Deprecated>

Memungkinkan Anda menentukan nilai untuk [legacy context](https://reactjs.org/docs/legacy-context.html) yang disediakan oleh komponen ini.

---

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
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      const list = this.listRef.current;
      return list.scrollHeight - list.scrollTop;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
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

#### Parameters {/*getsnapshotbeforeupdate-parameters*/}

* `prevProps`: *Props* sebelum pembaharuan. Membandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum pembaharuan. Membandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

#### Returns {/*getsnapshotbeforeupdate-returns*/}

Anda harus mengembalikan nilai snapshot dari jenis apa pun yang Anda inginkan, atau `null`. Nilai yang Anda kembalikan akan diteruskan sebagai argumen ketiga pada [`componentDidUpdate`.](#componentdidupdate)

#### Caveats {/*getsnapshotbeforeupdate-caveats*/}

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

#### Parameters {/*render-parameters*/}

* `prevProps`: *Props* sebelum pembaruan. Bandingkan `prevProps` ke [`this.props`](#props) untuk menentukan apa yang berubah.

* `prevState`: State sebelum pembaruan. Bandingkan `prevState` ke [`this.state`](#state) untuk menentukan apa yang berubah.

#### Returns {/*render-returns*/}

`render` dapat mengembalikan *node* React apa pun yang valid. Ini termasuk elemen-elemen React seperti `<div />`, strings, numbers, [portals](/reference/react-dom/createPortal), *nodes* kosong (`null`, `undefined`, `true`, dan `false`), dan arrays dari React *nodes*.

#### Caveats {/*render-caveats*/}

- `render` harus ditulis sebagai pure function dari *props*, *state*, dan *context*. Seharusnya tidak memiliki *side effects*.

- `render` tidak akan dipanggil jika [`shouldComponentUpdate`](#shouldcomponentupdate) didefinisikan dan mengembalikan `false`.

- Ketika [Strict Mode](/reference/react/StrictMode) aktif, React akan memanggil `render` dua kali dalam *development* dan kemudian membuang salah satu hasilnya. Ini membantu Anda melihat efek samping yang tidak disengaja yang perlu dipindahkan dari metode `render`.

- Tidak ada korespondensi one-to-one antara panggilan `render` dan panggilan `componentDidMount` atau panggilan `componentDidUpdate`. Beberapa hasil panggilan `render` mungkin dibuang oleh React jika bermanfaat.

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
        <p>Hello, {this.state.name}.
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

#### Parameters {/*setstate-parameters*/}

* `nextState`: Baik objek atau fungsi.
  * Jika Anda meneruskan objek sebagai `nextState`, objek tersebut akan digabungkan secara dangkal ke dalam `this.state`.
  * Jika Anda meneruskan fungsi sebagai `nextState`, fungsi tersebut akan diperlakukan sebagai _updater function_. Itu harus murni, harus mengambil `state` dan `props` yang tertunda sebagai argumen, dan harus mengembalikan objek untuk digabungkan secara dangkal ke dalam `this.state`. React akan menempatkan fungsi pembaru Anda dalam antrean dan merender ulang komponen Anda. Selama render berikutnya, React akan menghitung *state* selanjutnya dengan menerapkan semua pembaruan yang antri ke *state* sebelumnya.

* **opsional** `callback`: Jika ditentukan, React akan memanggil `callback` yang Anda berikan setelah pembaruan dilakukan.

#### Returns {/*setstate-returns*/}

`setState` tidak mengembalikan apapun.

#### Caveats {/*setstate-caveats*/}

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
      // Nothing has changed, so a re-render is unnecessary
      return false;
    }
    return true;
  }

  // ...
}

```

React memanggil `shouldComponentUpdate` sebelum *render*-ing ketika *props* baru atau *state* sedang diterima. Default `true`. Metode ini tidak dipanggil untuk *render* awal atau saat [`forceUpdate`](#forceupdate) digunakan.

#### Parameters {/*shouldcomponentupdate-parameters*/}

- `nextProps`: Props berikutnya yang akan dirender oleh komponen. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextState`: *State* berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextState` dengan [`this.state`](#props) untuk menentukan apa yang berubah.
- `nextContext`: Konteks berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextContext` dengan [`this.context`](#context) untuk menentukan apa yang berubah. Hanya tersedia jika Anda menetapkan [`static contextType`](#static-contexttypes) (modern) atau [`static contextTypes`](#static-contexttypes) (legacy).

#### Returns {/*shouldcomponentupdate-returns*/}

Mengembalikan `true` jika Anda ingin komponen di-*render* ulang. Itu merupakan perilaku default.

Mengembalikan `false` untuk memberitahu React bahwa *render* ulang dapat dilewati.

#### Caveats {/*shouldcomponentupdate-caveats*/}

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

#### Parameters {/*unsafe_componentwillmount-parameters*/}

`UNSAFE_componentWillMount` tidak menggunakan parameter apa pun.

#### Returns {/*unsafe_componentwillmount-returns*/}

`UNSAFE_componentWillMount` seharusnya tidak mengembalikan apa pun.

#### Caveats {/*unsafe_componentwillmount-caveats*/}

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

#### Parameters {/*unsafe_componentwillreceiveprops-parameters*/}

- `nextProps`: *Props* berikutnya yang akan diterima komponen dari komponen induknya. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextContext`: *Props* berikutnya yang akan diterima komponen dari penyedia terdekat. Bandingkan `nextContext` dengan [`this.context`](#context) untuk menentukan apa yang berubah. Hanya tersedia jika Anda menetapkan [`static contextType`](#static-contexttype) (modern) atau [`static contextTypes`](#static-contexttypes) (legacy).

#### Returns {/*unsafe_componentwillreceiveprops-returns*/}

`UNSAFE_componentWillReceiveProps` seharusnya tidak mengembalikan apa pun.

#### Caveats {/*unsafe_componentwillreceiveprops-caveats*/}

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

#### Parameters {/*unsafe_componentwillupdate-parameters*/}

- `nextProps`: *Props* berikutnya yang akan di-*render* oleh komponen. Bandingkan `nextProps` dengan [`this.props`](#props) untuk menentukan apa yang berubah.
- `nextState`: *State* selanjutnya yang akan di-*render* oleh komponen. Bandingkan `nextState` dengan [`this.state`](#state) untuk menentukan apa yang berubah.

#### Returns {/*unsafe_componentwillupdate-returns*/}

`UNSAFE_componentWillUpdate` seharusnya tidak mengembalikan apa pun.

#### Caveats {/*unsafe_componentwillupdate-caveats*/}

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

### `static childContextTypes` {/*static-childcontexttypes*/}

<Deprecated>

API ini akan dihapus di versi utama React yang akan datang. [Gunakan `static contextType` sebagai gantinya.](#static-contexttype)

</Deprecated>

Memungkinkan Anda menentukan [legacy context](https://reactjs.org/docs/legacy-context.html) mana yang disediakan oleh komponen ini.

---

### `static contextTypes` {/*static-contexttypes*/}

<Deprecated>

API ini akan dihapus di versi utama React yang akan datang. [Gunakan `static contextType` sebagai gantinya.](#static-contexttype)

</Deprecated>

Memungkinkan Anda menentukan [legacy context](https://reactjs.org/docs/legacy-context.html) yang dikonsumsi oleh komponen ini.

---

### `static contextType` {/*static-contexttype*/}

If you want to read [`this.context`](#context-instance-field) from your class component, you must specify which context it needs to read. The context you specify as the `static contextType` must be a value previously created by [`createContext`.](/reference/react/createContext)

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

Reading `this.context` in class components is equivalent to [`useContext`](/reference/react/useContext) in function components.

[See how to migrate.](#migrating-a-component-with-context-from-a-class-to-a-function)

</Note>

---

### `static defaultProps` {/*static-defaultprops*/}

You can define `static defaultProps` to set the default props for the class. They will be used for `undefined` and missing props, but not for `null` props.

For example, here is how you define that the `color` prop should default to `'blue'`:

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

If the `color` prop is not provided or is `undefined`, it will be set by default to `'blue'`:

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

Defining `defaultProps` in class components is similar to using [default values](/learn/passing-props-to-a-component#specifying-a-default-value-for-a-prop) in function components.

</Note>

---

### `static propTypes` {/*static-proptypes*/}

You can define `static propTypes` together with the [`prop-types`](https://www.npmjs.com/package/prop-types) library to declare the types of the props accepted by your component. These types will be checked during rendering and in development only.

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

We recommend using [TypeScript](https://www.typescriptlang.org/) instead of checking prop types at runtime.

</Note>

---

### `static getDerivedStateFromError(error)` {/*static-getderivedstatefromerror*/}

If you define `static getDerivedStateFromError`, React will call it when a child component (including distant children) throws an error during rendering. This lets you display an error message instead of clearing the UI.

Typically, it is used together with [`componentDidCatch`](#componentDidCatch) which lets you send the error report to some analytics service. A component with these methods is called an *error boundary.*

[See an example.](#catching-rendering-errors-with-an-error-boundary)

#### Parameters {/*static-getderivedstatefromerror-parameters*/}

* `error`: The error that was thrown. In practice, it will usually be an instance of [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) but this is not guaranteed because JavaScript allows to [`throw`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/throw) any value, including strings or even `null`.

#### Returns {/*static-getderivedstatefromerror-returns*/}

`static getDerivedStateFromError` should return the state telling the component to display the error message.

#### Caveats {/*static-getderivedstatefromerror-caveats*/}

* `static getDerivedStateFromError` should be a pure function. If you want to perform a side effect (for example, to call an analytics service), you need to also implement [`componentDidCatch`.](#componentdidcatch)

<Note>

There is no direct equivalent for `static getDerivedStateFromError` in function components yet. If you'd like to avoid creating class components, write a single `ErrorBoundary` component like above and use it throughout your app. Alternatively, use the [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) package which does that.

</Note>

---

### `static getDerivedStateFromProps(props, state)` {/*static-getderivedstatefromprops*/}

If you define `static getDerivedStateFromProps`, React will call it right before calling [`render`,](#render) both on the initial mount and on subsequent updates. It should return an object to update the state, or `null` to update nothing.

This method exists for [rare use cases](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state) where the state depends on changes in props over time. For example, this `Form` component resets the `email` state when the `userID` prop changes:

```js {7-18}
class Form extends Component {
  state = {
    email: this.props.defaultEmail,
    prevUserID: this.props.userID
  };

  static getDerivedStateFromProps(props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
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

Note that this pattern requires you to keep a previous value of the prop (like `userID`) in state (like `prevUserID`).

<Pitfall>

Deriving state leads to verbose code and makes your components difficult to think about. [Make sure you're familiar with simpler alternatives:](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html)

- If you need to **perform a side effect** (for example, data fetching or an animation) in response to a change in props, use [`componentDidUpdate`](#componentdidupdate) method instead.
- If you want to **re-compute some data only when a prop changes,** [use a memoization helper instead.](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#what-about-memoization)
- If you want to **"reset" some state when a prop changes,** consider either making a component [fully controlled](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-controlled-component) or [fully uncontrolled with a key](https://legacy.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#recommendation-fully-uncontrolled-component-with-a-key) instead.

</Pitfall>

#### Parameters {/*static-getderivedstatefromprops-parameters*/}

- `props`: The next props that the component is about to render with.
- `state`: The next state that the component is about to render with.

#### Returns {/*static-getderivedstatefromprops-returns*/}

`static getDerivedStateFromProps` return an object to update the state, or `null` to update nothing.

#### Caveats {/*static-getderivedstatefromprops-caveats*/}

- This method is fired on *every* render, regardless of the cause. This is different from [`UNSAFE_componentWillReceiveProps`](#unsafe_cmoponentwillreceiveprops), which only fires when the parent causes a re-render and not as a result of a local `setState`.

- This method doesn't have access to the component instance. If you'd like, you can reuse some code between `static getDerivedStateFromProps` and the other class methods by extracting pure functions of the component props and state outside the class definition.

<Note>

Implementing `static getDerivedStateFromProps` in a class component is equivalent to [calling the `set` function from `useState` during rendering](/reference/react/useState#storing-information-from-previous-renders) in a function component.

</Note>

---

## Usage {/*usage*/}

### Defining a class component {/*defining-a-class-component*/}

To define a React component as a class, extend the built-in `Component` class and define a [`render` method:](#render)

```js
import { Component } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}
```

React will call your [`render`](#render) method whenever it needs to figure out what to display on the screen. Usually, you will return some [JSX](/learn/writing-markup-with-jsx) from it. Your `render` method should be a [pure function:](https://en.wikipedia.org/wiki/Pure_function) it should only calculate the JSX.

Similarly to [function components,](/learn/your-first-component#defining-a-component) a class component can [receive information by props](/learn/your-first-component#defining-a-component) from its parent component. However, the syntax for reading props is different. For example, if the parent component renders `<Greeting name="Taylor" />`, then you can read the `name` prop from [`this.props`](#props), like `this.props.name`:

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

Note that Hooks (functions starting with `use`, like [`useState`](/reference/react/useState)) are not supported inside class components.

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-simple-component-from-a-class-to-a-function)

</Pitfall>

---

### Adding state to a class component {/*adding-state-to-a-class-component*/}

To add [state](/learn/state-a-components-memory) to a class, assign an object to a property called [`state`](#state). To update state, call [`this.setState`](#setstate).

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

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-state-from-a-class-to-a-function)

</Pitfall>

---

### Adding lifecycle methods to a class component {/*adding-lifecycle-methods-to-a-class-component*/}

There are a few special methods you can define on your class.

If you define the [`componentDidMount`](#componentdidmount) method, React will call it when your component is added *(mounted)* to the screen. React will call [`componentDidUpdate`](#componentdidupdate) after your component re-renders due to changed props or state. React will call [`componentWillUnmount`](#componentwillunmount) after your component has been removed *(unmounted)* from the screen.

If you implement `componentDidMount`, you usually need to implement all three lifecycles to avoid bugs. For example, if `componentDidMount` reads some state or props, you also have to implement `componentDidUpdate` to handle their changes, and `componentWillUnmount` to clean up whatever `componentDidMount` was doing.

For example, this `ChatRoom` component keeps a chat connection synchronized with props and state:

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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

```js chat.js
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

Note that in development when [Strict Mode](/reference/react/StrictMode) is on, React will call `componentDidMount`, immediately call `componentWillUnmount`, and then call `componentDidMount` again. This helps you notice if you forgot to implement `componentWillUnmount` or if its logic doesn't fully "mirror" what `componentDidMount` does.

<Pitfall>

We recommend defining components as functions instead of classes. [See how to migrate.](#migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function)

</Pitfall>

---

### Catching rendering errors with an error boundary {/*catching-rendering-errors-with-an-error-boundary*/}

By default, if your application throws an error during rendering, React will remove its UI from the screen. To prevent this, you can wrap a part of your UI into an *error boundary*. An error boundary is a special component that lets you display some fallback UI instead of the part that crashed--for example, an error message.

To implement an error boundary component, you need to provide [`static getDerivedStateFromError`](#static-getderivedstatefromerror) which lets you update state in response to an error and display an error message to the user. You can also optionally implement [`componentDidCatch`](#componentdidcatch) to add some extra logic, for example, to log the error to an analytics service.

```js {7-10,12-19}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Example "componentStack":
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    logErrorToMyService(error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback;
    }

    return this.props.children;
  }
}
```

Then you can wrap a part of your component tree with it:

```js {1,3}
<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Profile />
</ErrorBoundary>
```

If `Profile` or its child component throws an error, `ErrorBoundary` will "catch" that error, display a fallback UI with the error message you've provided, and send a production error report to your error reporting service.

You don't need to wrap every component into a separate error boundary. When you think about the [granularity of error boundaries,](https://aweary.dev/fault-tolerance-react/) consider where it makes sense to display an error message. For example, in a messaging app, it makes sense to place an error boundary around the list of conversations. It also makes sense to place one around every individual message. However, it wouldn't make sense to place a boundary around every avatar.

<Note>

There is currently no way to write an error boundary as a function component. However, you don't have to write the error boundary class yourself. For example, you can use [`react-error-boundary`](https://github.com/bvaughn/react-error-boundary) instead.

</Note>

---

## Alternatives {/*alternatives*/}

### Migrating a simple component from a class to a function {/*migrating-a-simple-component-from-a-class-to-a-function*/}

Typically, you will [define components as functions](/learn/your-first-component#defining-a-component) instead.

For example, suppose you're converting this `Greeting` class component to a function:

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

Define a function called `Greeting`. This is where you will move the body of your `render` function.

```js
function Greeting() {
  // ... move the code from the render method here ...
}
```

Instead of `this.props.name`, define the `name` prop [using the destructuring syntax](/learn/passing-props-to-a-component) and read it directly:

```js
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

Here is a complete example:

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

### Migrating a component with state from a class to a function {/*migrating-a-component-with-state-from-a-class-to-a-function*/}

Suppose you're converting this `Counter` class component to a function:

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

Start by declaring a function with the necessary [state variables:](/reference/react/useState#adding-state-to-a-component)

```js {4-5}
import { useState } from 'react';

function Counter() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  // ...
```

Next, convert the event handlers:

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

Finally, replace all references starting with `this` with the variables and functions you defined in your component. For example, replace `this.state.age` with `age`, and replace `this.handleNameChange` with `handleNameChange`.

Here is a fully converted component:

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

### Migrating a component with lifecycle methods from a class to a function {/*migrating-a-component-with-lifecycle-methods-from-a-class-to-a-function*/}

Suppose you're converting this `ChatRoom` class component with lifecycle methods to a function:

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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

```js chat.js
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

First, verify that your [`componentWillUnmount`](#componentwillunmount) does the opposite of [`componentDidMount`.](#componentdidmount) In the above example, that's true: it disconnects the connection that `componentDidMount` sets up. If such logic is missing, add it first.

Next, verify that your [`componentDidUpdate`](#componentdidupdate) method handles changes to any props and state you're using in `componentDidMount`. In the above example, `componentDidMount` calls `setupConnection` which reads `this.state.serverUrl` and `this.props.roomId`. This is why `componentDidUpdate` checks whether `this.state.serverUrl` and `this.props.roomId` have changed, and resets the connection if they did. If your `componentDidUpdate` logic is missing or doesn't handle changes to all relevant props and state, fix that first.

In the above example, the logic inside the lifecycle methods connects the component to a system outside of React (a chat server). To connect a component to an external system, [describe this logic as a single Effect:](/reference/react/useEffect#connecting-to-an-external-system)

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

This [`useEffect`](/reference/react/useEffect) call is equivalent to the logic in the lifecycle methods above. If your lifecycle methods do multiple unrelated things, [split them into multiple independent Effects.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Here is a complete example you can play with:

<Sandpack>

```js App.js
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

```js ChatRoom.js active
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

```js chat.js
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

<Note>

If your component does not synchronize with any external systems, [you might not need an Effect.](/learn/you-might-not-need-an-effect)

</Note>

---

### Migrating a component with context from a class to a function {/*migrating-a-component-with-context-from-a-class-to-a-function*/}

In this example, the `Panel` and `Button` class components read [context](/learn/passing-data-deeply-with-context) from [`this.context`:](#context)

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

When you convert them to function components, replace `this.context` with [`useContext`](/reference/react/useContext) calls:

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
