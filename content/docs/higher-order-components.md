---
id: higher-order-components
title: Higher-Order Components
permalink: docs/higher-order-components.html
---

_Higher-order component_ (HOC) merupakan teknik lanjutan dalam React untuk menggunakan kembali logika komponen. HOCs sendiri bukan merupakan bagian dari API React. Hal tersebut merupakan pola yang muncul dari sifat komposisi React.

Konkritnya, **_higher-order component_ merupakan fungsi yang mengambil sebuah komponen dan mengembalikan sebuah komponen baru**

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

Sebaliknya saat sebuah komponen mengubah _props_ menjadi antarmuka pengguna (UI), _higher-order component_ mengubah sebuah komponen menjadi komponen yang lainnya.

<<<<<<< HEAD
HOC umum dipakai oleh pustaka pihak ketiga React, seperti [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) milik Redux dan [`createFragmentContainer`](http://facebook.github.io/relay/docs/en/fragment-container.html) milik Relay.
=======
HOCs are common in third-party React libraries, such as Redux's [`connect`](https://github.com/reduxjs/react-redux/blob/master/docs/api/connect.md#connect) and Relay's [`createFragmentContainer`](https://relay.dev/docs/v10.1.3/fragment-container/#createfragmentcontainer).
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c

Pada dokumen ini, kita akan mendiskusikan mengapa _higher-order components_ bermanfaat dan bagaimana menulis _higher-order components_ anda sendiri.

## Penggunaan HOC untuk *Cross-Cutting Concerns* {#use-hocs-for-cross-cutting-concerns}

> **Catatan**
>
> Kita sebelumnya merekomendasikan _mixins_ sebagai cara menangani _cross-cutting concerns_. Kita telah menyadari bahwa _mixins_ menimbulkan lebih banyak masalah daripada keuntungan. [Baca detail](/blog/2016/07/13/mixins-considered-harmful.html) tentang mengapa kita beralih dari _mixins_ dan bagaimana Anda dapat mentransisikan komponen yang ada.

Komponen merupakan unit utama dari penggunaan ulang kode di React. Namun, Anda akan menemukan bahwa beberapa pola tidak cocok untuk komponen tradisional.

Contohnya, Anda memiliki komponen `CommentList` yang berlangganan ke sumber data eksternal untuk me-_render_ daftar komentar:

```js
class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      // "DataSource" merupakan data sumber global
      comments: DataSource.getComments()
    };
  }

  componentDidMount() {
    // Berlangganan terhadap perubahan
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    // Membersihkan listener
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    // Memperbarui *state* komponen pada saat sumber data berubah
    this.setState({
      comments: DataSource.getComments()
    });
  }

  render() {
    return (
      <div>
        {this.state.comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    );
  }
}
```

Kemudian, Anda menulis sebuah komponen untuk berlangganan ke posting blog yang mengikuti pola yang sama:

```js
class BlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      blogPost: DataSource.getBlogPost(props.id)
    };
  }

  componentDidMount() {
    DataSource.addChangeListener(this.handleChange);
  }

  componentWillUnmount() {
    DataSource.removeChangeListener(this.handleChange);
  }

  handleChange() {
    this.setState({
      blogPost: DataSource.getBlogPost(this.props.id)
    });
  }

  render() {
    return <TextBlock text={this.state.blogPost} />;
  }
}
```

`CommentList` dan `BlogPost` tidaklah sama — Keduanya memanggil metode yang berbeda `DataSource`, dan keduanya me-_render_ keluaran yang berbeda. Namun, implementasinya kebanyakan sama:

- Saat dilakukan pemasangan, tambah _change listener_ ke `DataSource`.
- Di dalam _listener_, panggil `setState` pada saat sumber data berubah.
- Saat dilakukan pelepasan, hapus _change listener_.

Anda dapat bayangkan bahwa dalam aplikasi berskala besar, pola yang sama pada proses berlangganan `DataSource` dan pemanggilan `setState` akan terjadi berulang kali. Kita ingin sebuah abstraksi yang mengizinkan kita mendefinisikan logika ini pada satu tempat dan membaginya antar komponen. Dalam kondisi ini, _higher-order components_ unggul.

Kita dapat menulis sebuah fungsi yang dapat membuat komponen, seperti `CommentList` dan `BlogPost` yang berlangganan ke `DataSource`. Fungsi tersebut akan menerima salah satu argumennya ialah komponen turunan yang menerima data langganan sebagai _props_. Mari kita panggil fungsi `withSubscription`:

```js
const CommentListWithSubscription = withSubscription(
  CommentList,
  (DataSource) => DataSource.getComments()
);

const BlogPostWithSubscription = withSubscription(
  BlogPost,
  (DataSource, props) => DataSource.getBlogPost(props.id)
);
```

Parameter pertama ialah _Wrapped Component_. Parameter kedua mengambil data yang kita inginkan, contohnya  ialah `DataSource` dan _props_ saat ini.

Saat `CommentListWithSubscription` dan `BlogPostWithSubscription` di-_render_, `CommentList` dan `BlogPost` akan dioper sebuah `data` _prop_ dengan data paling baru yang diperoleh dari `DataSource`:

```js
// Fungsi ini mengambil sebuah komponen...
function withSubscription(WrappedComponent, selectData) {
  // ...dan mengembalikan komponen yang lain...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ... menangani langganan...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... dan me-*render* _Wrapped Component_ dengan data baru!
      // Perhatikan bahwa kita mengoper *props* tambahan apapun
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

Catat bahwa sebuah HOC tidak mengubah komponen masukan, tidak pula menggunakan _inheritance_ untuk menyalin perilakunya. Sebaliknya, sebuah HOC *menyusun* komponen asli dengan cara *membungkusnya* ke dalam sebuah _container_. Sebuah HOC merupakan fungsi murni bebas dari _side-effects_.

Dan jadilah! _Wrapped Component_ menerima semua _props_ dari _container_ sejalan dengan _prop_ baru, `data`, yang mana digunakan untuk me-_render_ keluaranya. HOC tidak memperhatikan bagaimana data digunakan dan _Wrapped Component_ tidak memperhatikan darimana data berasal.

Karena `withSubscription` merupakan fungsi normal, Anda dapat menambahkan sebanyak atau pun sesedikit mungkin argumen yang anda inginkan. Contohnya, Anda ingin membuat nama dari `data` _props_ dapat diatur untuk nantinya dapat mengisolasi HOC dari _Wrapped Component_. Atau Anda dapat menerima sebuah argumen yang mengatur `shouldComponentUpdate`, atau satu yang mengatur sumber data. Hal ini memungkinkan karena HOC memiliki kontrol penuh terhadap bagaimana komponen didefinisikan.

Seperti komponen, kontrak antara `withSubscription` dan _Wrapped Component_ seluruhnya merupakan _props-based_. Hal ini memudahkan bertukar dari satu HOC ke yang lainnya, selama menyediakan _props_ yang sama ke _Wrapped Component_. Hal ini berguna contohnya jika Anda mengubah pustaka _data-fetching_.

## Jangan Memutasi Komponen Asli. Gunakan _Composition_. {#dont-mutate-the-original-component-use-composition}

Tahan godaan untuk memodifikasi prototipe komponen (jika tidak, lakukan mutasi) di dalam  HOC.

```js
function logProps(InputComponent) {
  InputComponent.prototype.componentDidUpdate = function(prevProps) {
    console.log('Current props: ', this.props);
    console.log('Previous props: ', prevProps);
  };
  // Fakta bahwa kita mengembalikan masukan original merupakan petunjuk bahwa hal itu 
  // telah dimutasi
  return InputComponent;
}

// EnhancedComponent akan melakukan log pada saat *props* diterima
const EnhancedComponent = logProps(InputComponent);
```

Ada sedikit masalah dengan kode ini. Salah satunya ialah komponen masukan tidak dapat digunakan kembali secara terpisah dari komponen yang ditingkatkan. lebih petingnya lagi, jika Anda menerapkan HOC yang lain ke `EnhancedComponent` yang *juga* memutasi `componentWillReceiveProps`, fungsionalitas HOC pertama akan ditimpa! HOC ini juga tidak akan bekerja dengan fungsional komponen, yang mana tidak memiliki sikuls metode.

Mengubah HOC merupakan kebocoran abstraksi - pengguna harus mengerti bagaimana mereka diimplementasikan untuk menghindari konflik dengan HOC lainnya.

Daripada mutasi, HOC seharusnya menggunakan _composition_, dengan membungkus komponen masukan ke dalam _container_ komponen:

```js
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('Current props: ', this.props);
      console.log('Previous props: ', prevProps);
    }
    render() {
      // Bungkus komponen masukan dalam *container*, tanpa memutasinya. Bagus!
      return <WrappedComponent {...this.props} />;
    }
  }
}
```

HOC memiliki fungsionalitas yang sama dengan versi mutasi sembari menghindari potensi bentrok. Hal itu berfungsi sama baiknya dengan kelas dan fungsional komponen. Dan karena merupakan fungsi murni, hal tersebut dapat disusun dengan komponen HOC lainnya, atau bahkan dengan komponen itu sendiri.

Anda mungkin memperhatikan kemiripan antara HOC dan pola yang disebut *komponen container*. *Komponen container* merupakan bagian dari strategi pemisahan *responsibility* antara kepentingan *high-level* dan *low-level*. Container menangani hal seperti langganan dan *state*, dan mengoper ke komponen yang menangani hal seperti *rendering* antar muka pengguna(UI). HOC menggunakan *container* sebagai bagian dari implementasinya. Anda dapat berfikir bahwa HOC merupakan *komponen container* terdefinisi yang berparameter.

## Kesepakatan: Oper _Props_ yang Terkait Melalui Komponen yang Dibungkus {#convention-pass-unrelated-props-through-to-the-wrapped-component}

HOC menambahkan fitur ke komponen. Mereka tidak seharusnya secara drastis mengubah kontraknya. Diharapkan bahwa komponen yang dikembalikan dari HOC memiliki antarmuka yang mirip dengan komponen yang dibungkus.

HOC seharusnya mengoper melalui _props_ yang tidak terkait ke perhatian khususnya. Sebagian besar HOC berisi metode _render_ yang terlihat seperti ini:

```js
render() {
  // Menyaring *props* tambahan yang spesifik ke HOC ini dan semestinya tidak 
  // dioper 
  const { extraProp, ...passThroughProps } = this.props;

  // Masukan *props* kedalam _Wrapped Component_. Biasanya nilai 
  // metode *instance*
  const injectedProp = someStateOrInstanceMethod;

  // Oper *props* ke _Wrapped Component_
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```

Kesepakatan ini membantu memastikan bahwa HOC sebisa mungkin fleksibel dan dapat digunakan ulang.

## Kesepakatan: Maksimalkan _Composability_ {#convention-maximizing-composability}

Tidak semua HOC terlihat sama. Terkadang mereka menerima hanya argumen tunggal, komponen yang dibungkus:

```js
const NavbarWithRouter = withRouter(Navbar);
```

Biasanya, HOC menerima argumen tambahan. Dalam contoh dari Relay, _config_ obyek digunakan untuk menentukan sebuah ketergantungan data komponen:

```js
const CommentWithRelay = Relay.createContainer(Comment, config);
```

Tanda tangan paling umum untuk HOC terlihat seperti ini:

```js
//`connect` milik React Redux
const ConnectedComment = connect(commentSelector, commentActions)(CommentList);
```

*Bagaimana* jika Anda memecahnya? Akan lebih mudah untuk melihat apa yang terjadi.

```js
// connect merupakan sebuah fungsi yang mengembalikan fungsi lainnya
const enhance = connect(commentListSelector, commentListActions);
// fungsi yang dikembalikan merupakan HOC, yang mengembalikan sebuah komponen terhubung dengan
// Redux store
const ConnectedComment = enhance(CommentList);
```
Dengan kata lain, `connect` merupakan fungsi *higher-order* yang mengembalikan HOC!

Bentuk ini mungkin terlihat membingungkan atau tidak perlu, tapi itu merupakan properti yang berguna. HOC argumen tunggal seperti contoh di atas yang dikembalikan oleh fungsi `connect` memiliki tanda tangan `Component => Component`. Fungsi yang tipe keluarannya sama dengan masukannya sangat mudah untuk dibentuk bersama.

```js
// Daripada melakukan ini...
const EnhancedComponent = withRouter(connect(commentSelector)(WrappedComponent))

// ... Anda dapat menggunakan fungsi utilitas *composition*
// compose(f, g, h) sama dengan (...args) => f(g(h(...args)))
const enhance = compose(
  // Keduanya merupakan HOC dengan argumen tunggal
  withRouter,
  connect(commentSelector)
)
const EnhancedComponent = enhance(WrappedComponent)
```

(Properti yang sama ini juga mengizinkan `connect` dan _enhancer-style_ HOC lainnya untuk digunakan sebagai _decorators_, proposal JavaScript eksperimental).

Fungsi utilitas `compose` disediakan oleh banyak pustaka pihak ketiga termasuk lodash (as [`lodash.flowRight`](https://lodash.com/docs/#flowRight)), [Redux](https://redux.js.org/api/compose), dan [Ramda](https://ramdajs.com/docs/#compose).

## Kesepakatan: Bungkus Nama Tampilan untuk Kemudahan _Debugging_ {#convention-wrap-the-display-name-for-easy-debugging}

<<<<<<< HEAD
Komponen *container* dibuat oleh HOC yang akan muncul di [React Developer Tools](https://github.com/facebook/react-devtools) seperti komponen lainnya. Untuk kemudah _debugging_, pilih nama tampilan yang berhubungan bahwa itu merupakan hasil dari HOC.
=======
The container components created by HOCs show up in the [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools) like any other component. To ease debugging, choose a display name that communicates that it's the result of a HOC.
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c

Teknik paling umum ialah dengan membungkus nama tampilan dari komponen yang dibungkus. Jadi, jika nama HOC Anda `withSubscription`, dan nama tampilan komponen yang dibungkus ialah `CommentList`, gunakan nama tampilan `WithSubscription(CommentList)`:

```js
function withSubscription(WrappedComponent) {
  class WithSubscription extends React.Component {/* ... */}
  WithSubscription.displayName = `WithSubscription(${getDisplayName(WrappedComponent)})`;
  return WithSubscription;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
```


## Batasan {#caveats}

Komponen HOC datang dengan beberapa batasan yang kurang jelas jika Anda baru menggunakan React.

### Jangan Menggunakan HOC di dalam Metode _render_ {#dont-use-hocs-inside-the-render-method}

<<<<<<< HEAD
Algoritma _diffing_ React (disebut _reconciliation_) menggunakan identitas komponen untuk menentukan apakah subtree yang ada perlu diperbarui atau _mount_ yang baru. Jika komponen yang dikembalikan dari `render` sama (`===`) dengan _render_ komponen sebelumnya, React memperbarui subtree secara rekursif dengan membandingkan dengan yang baru. Jika tidak sama, subtree sebelumnya akan diganti seluruhnya.
=======
React's diffing algorithm (called [Reconciliation](/docs/reconciliation.html)) uses component identity to determine whether it should update the existing subtree or throw it away and mount a new one. If the component returned from `render` is identical (`===`) to the component from the previous render, React recursively updates the subtree by diffing it with the new one. If they're not equal, the previous subtree is unmounted completely.
>>>>>>> 95e15d063b205007a92c52efb5311f76ad5a0b6c

Normalnya, Anda tidak perlu memikirkan tentang ini. Namun itu penting bagi HOC karena itu berarti Anda tidak dapat menerapkan HOC ke komponen di dalam metode *render* dari sebuah komponen:

```js
render() {
  // Sebuah versi baru dari EnhancedComponent dibuat tiap *render*
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // Ini menyebabkan seluruh subtree lepas/kembali dipasang tiap waktu!
  return <EnhancedComponent />;
}
```

Masalah di sini bukan hanya soal kinerja - *remounting* sebuah komponen menyebabkan *state* komponen tersebut dan *children*-nya hilang.

Sebagai gantinya, terapkan HOC di luar definisi komponen sehingga komponen tersebut dibuat hanya sekali. Lalu, identitasnya akan konsisten terhadap _render_. Hal ini biasanya yang Anda inginkan.

Dalam kasus langka dimana Anda butuh menerapkan HOC secara dinamis, Anda dapat juga meletakannya di dalam metode pada *lifecycle* atau konstruktornya.

### Metode Statis Harus Disalin {#static-methods-must-be-copied-over}

Terkadang berguna mendefinisikan metode statis dalam sebuah komponen React. Sebagai contoh, *container* Relay membuka metode statis `getFragment` untuk memfasilitasi komposisi dari GraphQL *fragments*.

Saat Anda menerapkan HOC ke suatu komponen, komponen original dibungkus dengan komponen *container*. Ini berarti komponen baru tersebut tidak memiliki metode statis apapun dari komponen original.

```js
// Definisikan metode statis
WrappedComponent.staticMethod = function() {/*...*/}
// Sekarang terapkan HOC
const EnhancedComponent = enhance(WrappedComponent);

// Komponen yang ditingkatkan tidak memiliki metode statis
typeof EnhancedComponent.staticMethod === 'undefined' // true
```

Untuk menyelesaikan ini, Anda dapat menyalin metode ke dalam *container* sebelum mengembalikannya:

```js
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  // Harus benar-benar paham metode yang mana yang akan disalin :(
  Enhance.staticMethod = WrappedComponent.staticMethod;
  return Enhance;
}
```

Namun, Anda perlu benar-benar memahami metode mana yang perlu disalin. Anda dapat menggunakan [hoist-non-react-statics](https://github.com/mridgway/hoist-non-react-statics) untuk secara otomatis menyalin semua metode statis non-React:

```js
import hoistNonReactStatic from 'hoist-non-react-statics';
function enhance(WrappedComponent) {
  class Enhance extends React.Component {/*...*/}
  hoistNonReactStatic(Enhance, WrappedComponent);
  return Enhance;
}
```

Solusi lainnya yang memungkinkan ialah mengekspor metode statis secara terpisah dari komponen itu sendiri.

```js
// Daripada...
MyComponent.someFunction = someFunction;
export default MyComponent;

// ...ekspor metode secara terpisah...
export { someFunction };

// ...dan pada modul, impor keduanya
import MyComponent, { someFunction } from './MyComponent.js';
```

### Jangan mengoper _Ref_ {#refs-arent-passed-through}

Sementara kesepakatan untuk komponen HOC mengoper semua _props_ ke komponen yang dibungkus, hal ini tidak bekerja untuk *refs*. Ini dikarenakan `ref` sebenarnya bukan *prop* — sama seperti `key`, hal itu ditangani secara khusus oleh React. Jika Anda menambahkan sebuah *ref* ke sebuah elemen yang mana komponen merupakan hasil dari sebuah HOC, *ref* merujuk ke sebuah *instance* dari komponen *container* paling luar, bukan _Wrapped Component_.

Solusi dari masalah ini ialah dengan menggunakan `React.forwardRef` API (diperkenalkan di React 16.3). [ Pelajari lebih lanjut tentang ini pada bagian forwarding refs](/docs/forwarding-refs.html).
