---
id: components-and-props
title: Komponen and Props
permalink: docs/components-and-props.html
redirect_from:
  - "docs/reusable-components.html"
  - "docs/reusable-components-zh-CN.html"
  - "docs/transferring-props.html"
  - "docs/transferring-props-it-IT.html"
  - "docs/transferring-props-ja-JP.html"
  - "docs/transferring-props-ko-KR.html"
  - "docs/transferring-props-zh-CN.html"
  - "tips/props-in-getInitialState-as-anti-pattern.html"
  - "tips/communicate-between-components.html"
prev: rendering-elements.html
next: state-and-lifecycle.html
---

Komponen mempermudah anda untuk memecah UI menjadi bagian tersendiri, potongan yang bisa digunakan kembali, dan berpikir tentang setiap potongan di dalam lingkungan.

Secara konsep, komponen mirip dengan fungsi di Javascript. Mereka menerima beberapa masukan (biasa disebut *"props"*) dan mengembalikan element react yang mendeskripsikan apa yang seharusnya tampil di layar.

## Fungsi dan Komponen Kelas {#function-and-class-components}

Cara paling sederhana untuk mendefinisikan sebuah komponen adalah dengan
menuliskan sebuah fungsi Javascript:

```js
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}
```

Fungsi ini adalah komponen React yang benar karena menerima sebuah *"props"*
tunggal (yang bertindak sebagai *props*) atau argumen objek dengan data dan kembalian
sebuah Elemen React. Kita menyebut komponen karena itu benar - benear merupakan fungsi
Javascript.

Anda juga dapat menggunakan sebuah [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) untuk mendefinisikan sebuah komponen:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

Kedua komponen di atas mempunyai nilai yang sama dalam sudut pandang React.

Kelas mempunyai beberapa fitur tambahan yang akan kita diskusikan di [sesi selanjutnya](/docs/state-and-lifecycle.html). Sampai disitu, kita akan menggunakan fungsi komponen untuk mempersingkat mereka.

## Me-render sebuah Komponen {#rendering-a-component}

Sebelumnya, kita hanya menemui elemen React yang mewakili tag DOM:

```js
const element = <div />;
```

Namun, elemen juga dapat mewakilkan komponen yang di definisikan
oleh pengguna:

```js
const element = <Welcome name="Sara" />;
```

When React sees an element representing a user-defined component, it passes JSX attributes to this component as a single object. We call this object "props".
Ketika React melihat sebuah element mewakili sebuah komponen yang dibuat oleh
pengguna,

Sebagai contoh, kode ini akan me-render "Hello, Sara" pada halaman:

```js{1,5}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
ReactDOM.render(
  element,
  document.getElementById('root')
);
```

[](codepen://components-and-props/rendering-a-component)

Mari merangkum apa yang terjadi pada contoh kali ini:

1. Kita memanggil `ReactDOM.render()` dengan elemen `<Welcome name="Sara" />`.
2. React memanggil komponen `Welcome` dengan `{name: 'Sara'}` sebagai
   propertinya.
3. Komponen `Welcome` kita akan mengembalikan sebuah element `<h1>Hello,
   Sara</h1` sebagai hasilnya.
4. React DOM dengan efisien akan mengupdate DOM yang sesuai `<h1>Hello, Sara`.

>**Catatan:** Selalu awali nama komponen dengan sebuah huruf kapital.
>
>React memperlakukan awalan komponen dengan huruf kecil sebagai tag dari DOM.
>Sebagai contoh, `<div />`, merepresentasikan sebuah HTML div tag, tetapi
>`<Welcome />` merepresentasikan sebuah komponen dan membutuhkan Welcome to be
>in scope.
>
>Anda dapat membaca lebih lanjut tentang alasan dibalik Konvensi [disini.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

## Menyusun Komponen {#composing-components}

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.
Komponen dapat merujuk ke komponen lain pada akhirnya. Ini memungkinkan kita untuk menggunakan
abstraksi dari komponen yang sama untuk semua level detail. Sebuah tombol,
sebuah formulir, sebuah dialog, sebuah tampilan: di dalam aplikasi React,  semua
... dalam bentuk komponen.

Sebagai contoh, kita dapat membuat sebuah komponen `App` yang mencetak `Welcome`
berkali - kali.

```js{8-10}
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```

[](codepen://components-and-props/composing-components)

Secara khusus, aplikasi React yang baru mempunyai sebuah komponen `App` pada
bagian paling atas. Namun, jika anda mengintegrasi React kedalam aplikasi yang
ada, anda mungkin akan memulai secara *bottom-up* dengan komponen yang kecil
seperti `Button` dan secara bertahap bekerja kedalam hierarki paling atas.

## Mengekstraksi Komponen {#extracting-components}

Jangan ragu untuk memisahkan komponen ke dalam bentuk yang lebih kecil.

Sebagai contoh, pertimbangkan komponen `Comment` berikut ini:

```js
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <img className="Avatar"
          src={props.author.avatarUrl}
          alt={props.author.name}
        />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components)

Komponen menerima `author` (sebuah objek), `text` (sebuah string), dan `date`
(sebuah tanggal) sebagai props, dan mendeskripsikan sebuah komponen dalam
website media sosial.

Komponen ini sedikit rumit untuk diganti karena semua berada dalam sarang, dan
itu juga sulit untuk digunakan kembali sebagai komponen pribadi. Mari
mengekstraksi beberapa komponen darinya:

Pertama, kita akan mengekstraksi `Avatar`:

```js{3-6}
function Avatar(props) {
  return (
    <img className="Avatar"
      src={props.user.avatarUrl}
      alt={props.user.name}
    />
  );
}
```

The `Avatar` doesn't need to know that it is being rendered inside a `Comment`. This is why we have given its prop a more generic name: `user` rather than `author`.
`Avatar` tidak perlu mengetahu bahwa komponen ini di render dalam sebuah
`Comment`. Ini mengapa kita harus memberikan *prop* lebih umum seperti: `user`
daripada `author`.

Kami merekomendasikan penamaan *prop* from the component's own point of view
daripada konteks bagaimana komponen tersebut digunakan.

Kita sekarang dapat sedikit menyederhanakan `Comment`:

```js{5}
function Comment(props) {
  return (
    <div className="Comment">
      <div className="UserInfo">
        <Avatar user={props.author} />
        <div className="UserInfo-name">
          {props.author.name}
        </div>
      </div>
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

Selanjutnya, kita akan mengekstraksi sebuah komponen `UserInfo` yang me-render
sebuah komponen `Avatar` di sebelah nama pengguna:

```js{3-8}
function UserInfo(props) {
  return (
    <div className="UserInfo">
      <Avatar user={props.user} />
      <div className="UserInfo-name">
        {props.user.name}
      </div>
    </div>
  );
}
```

Ini memungkinkan kita untuk menyederhanakan `Comment` lebih jauh:

```js{4}
function Comment(props) {
  return (
    <div className="Comment">
      <UserInfo user={props.author} />
      <div className="Comment-text">
        {props.text}
      </div>
      <div className="Comment-date">
        {formatDate(props.date)}
      </div>
    </div>
  );
}
```

[](codepen://components-and-props/extracting-components-continued)

Mengekstraksi komponen mungkin terlihat seperti pekerjaan yang kasar pada
awalnya, namun mempunyai palet dari komponen yang bisa digunakan kembali akan
terbayar pada aplikasi yang lebih besar. Aturan praktik yang bagus adalah jika
pada bagian dari UI digunakan beberapa kali (Button, Panel, Avatar), atau yang cukup
kompleks (App, FeedStory, Comment), ini merupakan kandidat yang bagus untuk
dijadikan sebagai komponen yang dapat digunakan kembali.

## Props hanya Read-Only {#props-are-read-only}

Apakah anda mendeklarasikan sebuah komponen [sebagai sebuah fungsi atau sebuah
kelas](#function-and-class-components), jangan pernah mengganti properti nya sendiri. it must never modify its own props. Pertimbangkan fungsi `sum` ini:

```js
function sum(a, b) {
  return a + b;
}
```

Fungsi seperti itu disebut ["pure"](https://en.wikipedia.org/wiki/Pure_function)
karena mereka tidak mencoba untuk mengganti masukan mereka, dan selalu
mengembalikan hasil yang sama untuk setiap masukan yang sama.

Sebaliknya, fungsi dibawah bukan merupakan fungsi yang murni karna itu telah
mengubah masukannya:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React sangat fleksibel namun memiliki suatu peraturan yang ketat:

**Semua komponen React harus bertindak seperti fungsi yang murni dengan
menghargai properti mereka.**

Tentu saja, UI dari aplikasi akan dinamis dan selalu berganti. Di [sesi selanjutnya](), kita akan memperkenalkan sebuah konsep baru tentang "state". State memperbolehkan komponen React untuk mengganti keluaran mereka secara berkala untuk merespon aksi dari pengguna, respon dari jaringan, dan yang lainnya, tanpa melanggar aturan.
