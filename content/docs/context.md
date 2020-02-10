---
id: context
title: Context
permalink: docs/context.html
---

Context menyediakan cara untuk oper data melalui diagram komponen tanpa harus oper *props* secara manual di setiap tingkat.

Dalam aplikasi React yang khusus, data dioper dari atas ke bawah (*parent* ke *child*) melalui *props*, tetapi ini bisa menjadi rumit untuk tipe *props* tertentu (mis. preferensi *locale*, tema UI) yang dibutuhkan oleh banyak komponen di dalam sebuah aplikasi. Context menyediakan cara untuk berbagi nilai seperti ini di antara komponen tanpa harus oper *prop* secara explisit melalui setiap tingkatan diagram.

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

Inversi kontrol ini dapat membuat kode Anda lebih bersih dalam banyak kasus dengan mengurangi jumlah *props* yang Anda butuhkan untuk melewati aplikasi Anda dan memberikan lebih banyak kontrol ke komponen *root*. Namun, ini bukan pilihan yang tepat dalam setiap kasus: memindahkan lebih banyak kerumitan lebih tinggi dalam diagram membuat *higher-level component* lebih rumit dan memaksa *lower-level component* menjadi lebih fleksibel daripada yang Anda inginkan.

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

<<<<<<< HEAD
Namun, kadang-kadang data yang sama harus dapat diakses oleh banyak komponen dalam diagram, dan pada tingkat bersarang yang berbeda. Context memungkinkan Anda "menyiarkan" data tersebut, dan mengubahnya, ke semua komponen di bawah. Contoh umum di mana menggunakan *context* mungkin lebih sederhana daripada alternatif termasuk mengelola *locale* saat ini, tema, atau *cache* data. 
=======
However, sometimes the same data needs to be accessible by many components in the tree, and at different nesting levels. Context lets you "broadcast" such data, and changes to it, to all components below. Common examples where using context might be simpler than the alternatives include managing the current locale, theme, or a data cache.
>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3

## API {#api}

### `React.createContext` {#reactcreatecontext}

```js
const MyContext = React.createContext(defaultValue);
```

Buat objek Context. Ketika React *render* komponen yang menerima objek Context ini akan membaca nilai *context* saat ini dari pencocokan terdekat `Provider` di atasnya dalam diagram.

Argumen `defaultValue` **hanya** digunakan ketika komponen tidak memiliki Provider yang cocok di atasnya dalam diagram. Ini dapat membantu untuk *testing* komponen secara terpisah tanpa membungkusnya. Catatan: mengoper `undefined` sebagai nilai Provider tidak menyebabkan konsumsi komponen menggunakan `defaultValue`.

### `Context.Provider` {#contextprovider}

```js
<MyContext.Provider value={/* beberapa nilai */}>
```

Setiap objek Context dilengkapi dengan komponen Provider React yang memungkinkan komponen konsumsi untuk menerima perubahan *context*.

Menerima *prop* `value` untuk dioper ke komponen konsumsi yang merupakan keturunan Provider ini. Satu Provider dapat dihubungkan ke banyak *consumer*. Provider dapat disarangkan untuk *override* nilai lebih dalam di dalam diagram.

<<<<<<< HEAD
Semua *consumer* yang merupakan keturunan Provider akan *render* ulang setiap kali *prop* `nilai` Provider berubah. Perambatan dari Provider ke *consumer* turunannya tidak tunduk ke *method* `shouldComponentUpdate`, sehingga *consumer* diperbarui bahkan ketika komponen leluhur menebus pembaruan tersebut.

Perubahan ditentukan dengan membandingkan nilai-nilai baru dan lama menggunakan algoritma yang sama dengan [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description). 

> Catatan
> 
> Cara perubahan ditentukan dapat menyebabkan beberapa masalah saat mengoper objek sebagai `value`: lihat [Peringatan](#caveats).
=======
All consumers that are descendants of a Provider will re-render whenever the Provider's `value` prop changes. The propagation from Provider to its descendant consumers (including [`.contextType`](#classcontexttype) and [`useContext`](/docs/hooks-reference.html#usecontext)) is not subject to the `shouldComponentUpdate` method, so the consumer is updated even when an ancestor component skips an update.

Changes are determined by comparing the new and old values using the same algorithm as [`Object.is`](//developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description).

> Note
>
> The way changes are determined can cause some issues when passing objects as `value`: see [Caveats](#caveats).
>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3

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

Properti `contextType` pada kelas dapat diberikan objek Context yang dibuat oleh [`React.createContext()`](#reactcreatecontext). Ini memungkinkan Anda menggunakan nilai saat ini terdekat dari tipe Context menggunakan `this.context`. Anda dapat merujuk ini dalam salah satu *method lifecycle* termasuk fungsi *render*.

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

Komponen React yang menerima perubahan *context*. Ini memungkinkan Anda menerima *context* di dalam [komponen fungsi](/docs/components-and-props.html#function-and-class-components).

Dibutuhkan sebuah [fungsi sebagai *child*](/docs/render-props.html#using-props-other-than-render). Fungsi menerima nilai *context* saat ini dan mengembalikkan *node* React. Argumen `value` yang diteruskan ke fungsi akan sama dengan *prop* `value` dari Provider terdekat untuk *context* ini di atas dalam diagram. Jika tidak ada Provider untuk *context* ini di atas, argumen `value` akan sama dengan `defaultValue` yang diteruskan ke `createContext()`.

<<<<<<< HEAD
> Catatan
> 
> Untuk lebih lanjut mengenai pola 'fungsi sebagai *child*', lihat [*render props*](/docs/render-props.html).
=======
> Note
>
> For more information about the 'function as a child' pattern, see [render props](/docs/render-props.html).
>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3

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

<<<<<<< HEAD
Untuk menjaga agar *rendering* ulang *context* tetap cepat, React perlu membuat setiap *context consumer* sebagai *node* yang terpisah dalam diagram. 
=======
To keep context re-rendering fast, React needs to make each context consumer a separate node in the tree.
>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3

`embed:context/multiple-contexts.js`

Jika dua atau lebih nilai *context* sering digunakan bersama, Anda mungkin ingin mempertimbangkan untuk membuat komponen *prop render* Anda sendiri yang menyediakan keduanya.

## Peringatan {#caveats}

Karena *context* menggunakan identitas referensi untuk menentukan kapan harus *render* ulang, ada beberapa *gotcha* yang dapat memicu *render* yang
tidak disengaja dalam *consumer* ketika *parent provider render* ulang. Misalnya kode di bawah ini akan *render* ulang semua *consumer* setiap kali Provider *render* ulang karena objek baru selalu dibuat untuk `value`:

`embed:context/reference-caveats-problem.js`


Untuk menyiasatinya, angkat nilai ke dalam *state* induk:

`embed:context/reference-caveats-solution.js`

## API Lawas {#legacy-api}

<<<<<<< HEAD
> Catatan
> 
> React sebelumnya dikirimkan dengan API *context* eksperimental. API lama akan di dukung di semua rilis 16.x, tetapi aplikasi yang menggunakannya harus migrasi ke versi yang baru. API lawas akan di hapus dalam versi *major* React di masa depan. Baca [dokumen *context* lawas di sini](/docs/legacy-context.html).
 
=======
> Note
>
> React previously shipped with an experimental context API. The old API will be supported in all 16.x releases, but applications using it should migrate to the new version. The legacy API will be removed in a future major React version. Read the [legacy context docs here](/docs/legacy-context.html).

>>>>>>> 4367566bddd06ed9dfbd6b1c3f45f9925e60b2c3
