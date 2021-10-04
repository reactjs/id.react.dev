---
id: context
title: Context
permalink: docs/context.html
---

Context menyediakan cara untuk oper data melalui diagram komponen tanpa harus oper *props* secara manual di setiap tingkat.

<<<<<<< HEAD
Dalam aplikasi React yang khusus, data dioper dari atas ke bawah (*parent* ke *child*) melalui *props*, tetapi ini bisa menjadi rumit untuk tipe *props* tertentu (mis. preferensi *locale*, tema UI) yang dibutuhkan oleh banyak komponen di dalam sebuah aplikasi. Context menyediakan cara untuk berbagi nilai seperti ini di antara komponen tanpa harus oper *prop* secara explisit melalui setiap tingkatan diagram.
=======
In a typical React application, data is passed top-down (parent to child) via props, but such usage can be cumbersome for certain types of props (e.g. locale preference, UI theme) that are required by many components within an application. Context provides a way to share values like these between components without having to explicitly pass a prop through every level of the tree.
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

- [Kapan menggunakan Context](#when-to-use-context)
- [Sebelum Anda Menggunakan Context](#before-you-use-context)
- [API](#api)
  - [React.createContext](#reactcreatecontext)
  - [Context.Provider](#contextprovider)
  - [Class.contextType](#classcontexttype)
  - [Context.Consumer](#contextconsumer)
  - [Context.displayName](#contextdisplayname)
- [Contoh](#examples)
  - [Context Dinamis](#dynamic-context)
  - [Memperbarui Context dari Komponen Bersarang](#updating-context-from-a-nested-component)
  - [Mengkonsumi Banyak Context](#consuming-multiple-contexts)
- [Peringatan](#caveats)
- [API Lawas](#legacy-api)

## Kapan Menggunakan Context {#when-to-use-context}

Context dirancang untuk berbagi data yang dapat dianggap "global" untuk diagram komponen React, seperti pengguna terotentikasi saat ini, tema, atau bahasa yang disukai. Misalnya, dalam kode di bawah ini kita secara manual memasang *prop* "theme" untuk memberi *style* pada komponen Button:

`embed:context/motivation-problem.js`

Menggunakan *context*, kita dapat menghindari mengoper *props* melalui elemen perantara:

`embed:context/motivation-solution.js`

## Sebelum Anda Menggunakan Context {#before-you-use-context}

Context terutama digunakan ketika beberapa data harus dapat diakses oleh *banyak* komponen pada tingkat bersarang yang berbeda. Gunakan dengan hemat karena membuat penggunaan kembali komponen menjadi lebih sulit.

**Jika Anda hanya ingin menghindari mengoper beberapa *props* melalui banyak tingkatan, [komposisi komponen](/docs/composition-vs-inheritance.html) seringkali menjadi solusi yang lebih sederhana daripada *context*.**

Misalnya, pertimbangkan komponen `Page` yang mengoper *prop* `user` dan `avatarSize` beberapa tingkat ke bawah sehingga komponen `Link` dan `Avatar` yang bersarang dapat membaca *prop*-nya:

```js
<Page user={user} avatarSize={avatarSize} />
// ... yang *render* ...
<PageLayout user={user} avatarSize={avatarSize} />
// ... yang *render* ...
<NavigationBar user={user} avatarSize={avatarSize} />
// ... yang *render* ...
<Link href={user.permalink}>
  <Avatar user={user} size={avatarSize} />
</Link>
```

Mungkin terasa berlebihan untuk mewariskan *props* `user` dan `avatarSize` melalui banyak tingkatan jika pada akhirnya komponen `Avatar`yang benar-benar membutuhkannya. Ini juga menjengkelkan bahwa setiap kali komponen `Avatar` membutuhkan lebih banyak *props* dari atas, Anda harus menambahkannya di semua tingkatan menengah juga.

Salah satu cara untuk mengatasi masalah ini **tanpa context** adalah [dengan mengoper komponen `Avatar` itu sendiri](/docs/composition-vs-inheritance.html#containment) sehingga komponen perantara tidak perlu tahu tentang *props* `user` atau `avatarSize`:

```js
function Page(props) {
  const user = props.user;
  const userLink = (
    <Link href={user.permalink}>
      <Avatar user={user} size={props.avatarSize} />
    </Link>
  );
  return <PageLayout userLink={userLink} />;
}

// Sekarang, kita memiliki:
<Page user={user} avatarSize={avatarSize} />
// ... yang *render* ...
<PageLayout userLink={...} />
// ... yang *render* ...
<NavigationBar userLink={...} />
// ... yang *render* ...
{props.userLink}
```

Dengan perubahan ini, hanya komponen Page paling atas yang perlu tahu tentang penggunaan komponen `Link` dan `Avatar` oleh `user` dan `avatarSize`.

<<<<<<< HEAD
Inversi kontrol ini dapat membuat kode Anda lebih bersih dalam banyak kasus dengan mengurangi jumlah *props* yang Anda butuhkan untuk melewati aplikasi Anda dan memberikan lebih banyak kontrol ke komponen *root*. Namun, ini bukan pilihan yang tepat dalam setiap kasus: memindahkan lebih banyak kerumitan lebih tinggi dalam diagram membuat *higher-level component* lebih rumit dan memaksa *lower-level component* menjadi lebih fleksibel daripada yang Anda inginkan.
=======
This *inversion of control* can make your code cleaner in many cases by reducing the amount of props you need to pass through your application and giving more control to the root components. Such inversion, however, isn't the right choice in every case; moving more complexity higher in the tree makes those higher-level components more complicated and forces the lower-level components to be more flexible than you may want.
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

Anda tidak terbatas pada satu *child* untuk satu komponen. Anda dapat mengoper beberapa *children*, atau bahkan memiliki beberapa "slot" terpisah untuk *children*, [seperti yang didokumentasikan di sini](/docs/composition-vs-inheritance.html#containment):

```js
function Page(props) {
  const user = props.user;
  const content = <Feed user={user} />;
  const topBar = (
    <NavigationBar>
      <Link href={user.permalink}>
        <Avatar user={user} size={props.avatarSize} />
      </Link>
    </NavigationBar>
  );
  return (
    <PageLayout
      topBar={topBar}
      content={content}
    />
  );
}
```

Pola ini cukup untuk banyak kasus ketika Anda perlu memisahkan *child* dari *parent* terdekatnya. Anda dapat membawanya lebih jauh dengan [*render props*](/docs/render-props.html) jika *child* perlu berkomunikasi dengan *parent* sebelum *rendering*.

Namun, kadang-kadang data yang sama harus dapat diakses oleh banyak komponen dalam diagram, dan pada tingkat bersarang yang berbeda. Context memungkinkan Anda "menyiarkan" data tersebut, dan mengubahnya, ke semua komponen di bawah. Contoh umum di mana menggunakan *context* mungkin lebih sederhana daripada alternatif termasuk mengelola *locale* saat ini, tema, atau *cache* data. 

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Buat objek Context. Ketika React *render* komponen yang menerima objek Context ini akan membaca nilai *context* saat ini dari pencocokan terdekat `Provider` di atasnya dalam diagram.

<<<<<<< HEAD
Argumen `defaultValue` **hanya** digunakan ketika komponen tidak memiliki Provider yang cocok di atasnya dalam diagram. Ini dapat membantu untuk *testing* komponen secara terpisah tanpa membungkusnya. Catatan: mengoper `undefined` sebagai nilai Provider tidak menyebabkan konsumsi komponen menggunakan `defaultValue`.
=======
The `defaultValue` argument is **only** used when a component does not have a matching Provider above it in the tree. This default value can be helpful for testing components in isolation without wrapping them. Note: passing `undefined` as a Provider value does not cause consuming components to use `defaultValue`.
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* beberapa nilai */}>
```

Setiap objek Context dilengkapi dengan komponen Provider React yang memungkinkan komponen konsumsi untuk menerima perubahan *context*.

<<<<<<< HEAD
Menerima *prop* `value` untuk dioper ke komponen konsumsi yang merupakan keturunan Provider ini. Satu Provider dapat dihubungkan ke banyak *consumer*. Provider dapat disarangkan untuk *override* nilai lebih dalam di dalam diagram.
=======
The Provider component accepts a `value` prop to be passed to consuming components that are descendants of this Provider. One Provider can be connected to many consumers. Providers can be nested to override values deeper within the tree.
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

Semua *consumer* yang merupakan keturunan Provider akan *render* ulang setiap kali *prop* `value` dalam Provider berubah. Perambatan dari Provider ke *consumer* turunannya (termasuk [`.contextType`](#classcontexttype) dan [`useContext`](/docs/hooks-reference.html#usecontext)) tidak tunduk ke *method* `shouldComponentUpdate`, sehingga *consumer* diperbarui bahkan ketika komponen leluhur menebus pembaruan tersebut.

Perubahan ditentukan dengan membandingkan nilai-nilai baru dan lama menggunakan algoritma yang sama dengan [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description). 

> Catatan
> 
> Cara perubahan ditentukan dapat menyebabkan beberapa masalah saat mengoper objek sebagai `value`: lihat [Peringatan](#caveats).

### `Class.contextType` {#classcontexttype}

```js
class MyClass extends React.Component {
  componentDidMount() {
    let value = this.context;
    /* melakukan efek samping saat *mount* menggunakan nilai MyContext */
  }
  componentDidUpdate() {
    let value = this.context;
    /* ... */
  }
  componentWillUnmount() {
    let value = this.context;
    /* ... */
  }
  render() {
    let value = this.context;
    /* *render* sesuatu berdasarkan nilai dari MyContext */
  }
}
MyClass.contextType = MyContext;
```

<<<<<<< HEAD
Properti `contextType` pada kelas dapat diberikan objek Context yang dibuat oleh [`React.createContext()`](#reactcreatecontext). Ini memungkinkan Anda menggunakan nilai saat ini terdekat dari tipe Context menggunakan `this.context`. Anda dapat merujuk ini dalam salah satu *method lifecycle* termasuk fungsi *render*.
=======
The `contextType` property on a class can be assigned a Context object created by [`React.createContext()`](#reactcreatecontext). Using this property lets you consume the nearest current value of that Context type using `this.context`. You can reference this in any of the lifecycle methods including the render function.
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

> Catatan:
>
> Anda hanya bisa menerima satu *context* menggunakan API ini. Jika Anda perlu membaca lebih dari satu lihat [Mengkonsumsi Banyak Contexts](#consuming-multiple-contexts).
>
> Jika Anda menggunakan eksperimental [sintaksis *public class fields*](https://babeljs.io/docs/plugins/transform-class-properties/), Anda bisa menggunakan *class field* **static** untuk menginisialisasi `contextType` Anda.


```js
class MyClass extends React.Component {
  static contextType = MyContext;
  render() {
    let value = this.context;
    /* *render* sesuatu berdasarkan nilainya */
  }
}
```

### `Context.Consumer` {#contextconsumer}

```js
<MyContext.Consumer>
  {value => /* render sesuatu berdasarkan nilai *context*-nya */}
</MyContext.Consumer>
```

<<<<<<< HEAD
Komponen React yang menerima perubahan *context*. Ini memungkinkan Anda menerima *context* di dalam [komponen fungsi](/docs/components-and-props.html#function-and-class-components).
=======
A React component that subscribes to context changes. Using this component lets you subscribe to a context within a [function component](/docs/components-and-props.html#function-and-class-components).
>>>>>>> 23d03a854ba21aeea0a03a0bd5185e0def9237d6

Dibutuhkan sebuah [fungsi sebagai *child*](/docs/render-props.html#using-props-other-than-render). Fungsi menerima nilai *context* saat ini dan mengembalikkan *node* React. Argumen `value` yang diteruskan ke fungsi akan sama dengan *prop* `value` dari Provider terdekat untuk *context* ini di atas dalam diagram. Jika tidak ada Provider untuk *context* ini di atas, argumen `value` akan sama dengan `defaultValue` yang diteruskan ke `createContext()`.

> Catatan
> 
> Untuk lebih lanjut mengenai pola 'fungsi sebagai *child*', lihat [*render props*](/docs/render-props.html).

### `Context.displayName` {#contextdisplayname}

Objek Context menerima properti *string* `displayName`. React DevTools menggunakan *string* ini untuk menentukan apa yang harus di tampilkan untuk *context* tersebut.

Misalnya, komponen berikut ini akan muncul sebagai MyDisplayName di DevTools:

```js{2}
const MyContext = React.createContext(/* beberapa nilai */);
MyContext.displayName = 'MyDisplayName';

<MyContext.Provider> // "MyDisplayName.Provider" in DevTools
<MyContext.Consumer> // "MyDisplayName.Consumer" in DevTools
```

## Contoh {#examples}

### Context Dinamis {#dynamic-context}

Contoh lain yang lebih kompleks dengan nilai dinamis untuk sebuah tema:

**theme-context.js**
`embed:context/theme-detailed-theme-context.js`

**themed-button.js**
`embed:context/theme-detailed-themed-button.js`

**app.js**
`embed:context/theme-detailed-app.js`

### Memperbarui Context Dari Komponen Bersarang {#updating-context-from-a-nested-component}

Sering diperlukan untuk memperbarui *context* dari komponen yang bersarang di suatu tempat dalam diagram komponen. Dalam hal ini Anda oper sebuah fungsi melewati *context* untuk memungkinkan *consumer* memperbarui *context*:

**theme-context.js**
`embed:context/updating-nested-context-context.js`

**theme-toggler-button.js**
`embed:context/updating-nested-context-theme-toggler-button.js`

**app.js**
`embed:context/updating-nested-context-app.js`

### Mengonsumsi Banyak Context {#consuming-multiple-contexts}

Untuk menjaga agar *rendering* ulang *context* tetap cepat, React perlu membuat setiap *context consumer* sebagai *node* yang terpisah dalam diagram. 

`embed:context/multiple-contexts.js`

Jika dua atau lebih nilai *context* sering digunakan bersama, Anda mungkin ingin mempertimbangkan untuk membuat komponen *prop render* Anda sendiri yang menyediakan keduanya.

## Peringatan {#caveats}

Karena *context* menggunakan identitas referensi untuk menentukan kapan harus *render* ulang, ada beberapa *gotcha* yang dapat memicu *render* yang
tidak disengaja dalam *consumer* ketika *parent provider render* ulang. Misalnya kode di bawah ini akan *render* ulang semua *consumer* setiap kali Provider *render* ulang karena objek baru selalu dibuat untuk `value`:

`embed:context/reference-caveats-problem.js`


Untuk menyiasatinya, angkat nilai ke dalam *state* induk:

`embed:context/reference-caveats-solution.js`

## API Lawas {#legacy-api}

> Catatan
> 
> React sebelumnya dikirimkan dengan API *context* eksperimental. API lama akan di dukung di semua rilis 16.x, tetapi aplikasi yang menggunakannya harus migrasi ke versi yang baru. API lawas akan dihapus dalam versi *major* React di masa depan. Baca [dokumen *context* lawas di sini](/docs/legacy-context.html).
 
