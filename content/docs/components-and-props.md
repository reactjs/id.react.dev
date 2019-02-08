---
id: components-and-props
title: Components and Props
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

Component membolehkan kamu untuk memecah UI secara independen, potongan yang bisa digunakan kembali, dan berpikir tentang setiap potongan di dalam lingkungan.

Secara konsep, komponen mirip seperti fungsi di Javascript. Mereka menerima beberapa masukan (biasa disebut "props") dan mengembalikan element react yang mendeskripsikan apa yang seharusnya tampil di layar.

## Fungsi dan Kelas Komponen {#function-and-class-components}

Cara paling sederhana untuk mendefinisikan sebuah komponen adalah dengan
menguliskan sebuah fungsi Javascript:

```js
function Welcome(props) {
  return <h1>Halo, {props.name}</h1>;
}
```

Fungsi ini adalah komponent React yang sah karena menerima sebuah "props"
tunggal (yang berdiri untuk properti) argumen objek dengan data dan kembalian
sebuah Elemen React. Kami menyebut komponen karena mereka adalah fungsi
Javascript secara harfiah.

Kamu juga dapat menggunakan sebuah [ES6 class](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes) untuk mendefinisikan sebuah komponen:

```js
class Welcome extends React.Component {
  render() {
    return <h1>Halo, {this.props.name}</h1>;
  }
}
```

The above two components are equivalent from React's point of view.
Kedua komponen di atas adalah sama dalam pandangan React.

Classes have some additional features that we will discuss in the [next sections](/docs/state-and-lifecycle.html). Until then, we will use function components for their conciseness.
Kelas mempunyai beberapa fitur tambahan yang akan kami diskusikan di [sesi selanjutnya](/docs/state-and-lifecycle.html). Until then, kita akan menggunakan fungsi komponen untuk keringkasan mereka.

## Me-render sebuah Komponen {#rendering-a-component}

Previously, we only encountered React elements that represent DOM tags:

```js
const element = <div />;
```

However, elements can also represent user-defined components:
Namun, element juga dapat di representasikan component yang di representasikan
oleh pengguna:

```js
const element = <Welcome name="Sara" />;
```

When React sees an element representing a user-defined component, it passes JSX attributes to this component as a single object. We call this object "props".

For example, this code renders "Hello, Sara" on the page:
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

Let's recap what happens in this example:
Mari merangkum apa yang terjadi pada contoh ini:

1. We call `ReactDOM.render()` with the `<Welcome name="Sara" />` element.
1. Kita memanggil `ReactDOM.render()` dengan element `<Welcome name="Sara" />`.
2. React calls the `Welcome` component with `{name: 'Sara'}` as the props.
2. React memanggil komponen `Welcome` dengan `{name: 'Sara'}` sebagai
   propertinya.
3. Our `Welcome` component returns a `<h1>Hello, Sara</h1>` element as the result.
4. React DOM efficiently updates the DOM to match `<h1>Hello, Sara</h1>`.

>**Catatan:** Selalu awali nama komponen dengan sebuah huruf kapital.
>
>React treats components starting with lowercase letters as DOM tags. For example, `<div />` represents an HTML div tag, but `<Welcome />` represents a component and requires `Welcome` to be in scope.
>React memperlakukan awalan komponen dengan huruf kecil sebagai tag dari DOM.
>Sebagai contoh, `<div />`, merepresentasikan sebuah HTML div tag, tetapi
>`<Welcome />` merepresentasikan sebuah komponen dan membutuhkan Welcome to be
>in scope.
>
>Kamu dapat membaca lebih lanjut tentang alasan dibalik Konvensi [disini.](/docs/jsx-in-depth.html#user-defined-components-must-be-capitalized)

## Composing Components {#composing-components}
## Menyusun Komponen {#composing-components}

Components can refer to other components in their output. This lets us use the same component abstraction for any level of detail. A button, a form, a dialog, a screen: in React apps, all those are commonly expressed as components.
Komponen dapat merujuk ke komponen lain pada akhirnya. Ini memungkinkan kita untuk menggunakan
abstraksi dari komponen yang sama untuk semua level detail. Sebuah tombol,
sebuah formulir, sebuah dialog, sebuah tampilan: di dalam aplikasi React,  semua
... dalam bentuk komponen.

For example, we can create an `App` component that renders `Welcome` many times:
Sebagai contoh, kita dapat membuat sebuah komponen `App` yang mencetak `Welcome`
berkali - kali.

```js{8-10}
function Welcome(props) {
  return <h1>Halo, {props.name}</h1>;
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

Typically, new React apps have a single `App` component at the very top. However, if you integrate React into an existing app, you might start bottom-up with a small component like `Button` and gradually work your way to the top of the view hierarchy.
Secara khusus, aplikasi React yang baru mempunyai sebuah komponen `App` pada
bagian paling atas. Namun, jika kamu mengintegrasi React kedalam

## Extracting Components {#extracting-components}

Don't be afraid to split components into smaller components.
Jangan takut untuk memisahkan komponen ke dalam bentuk yang lebih kecil.

For example, consider this `Comment` component:
Sebagai contoh, 

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

It accepts `author` (an object), `text` (a string), and `date` (a date) as props, and describes a comment on a social media website.
Komponen menerima `author` (sebuah objek), `text` (sebuah string), dan `date`
(sebuah tanggal) sebagai props, dan mendeskripsikan sebuah komponen dalam

This component can be tricky to change because of all the nesting, and it is also hard to reuse individual parts of it. Let's extract a few components from it.

First, we will extract `Avatar`:

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

We recommend naming props from the component's own point of view rather than the context in which it is being used.
Kami merekomendasikan

We can now simplify `Comment` a tiny bit:

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

Next, we will extract a `UserInfo` component that renders an `Avatar` next to the user's name:

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

This lets us simplify `Comment` even further:

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

Extracting components might seem like grunt work at first, but having a palette of reusable components pays off in larger apps. A good rule of thumb is that if a part of your UI is used several times (`Button`, `Panel`, `Avatar`), or is complex enough on its own (`App`, `FeedStory`, `Comment`), it is a good candidate to be a reusable component.

## Props are Read-Only {#props-are-read-only}

Whether you declare a component [as a function or a class](#function-and-class-components), it must never modify its own props. Consider this `sum` function:

```js
function sum(a, b) {
  return a + b;
}
```

Such functions are called ["pure"](https://en.wikipedia.org/wiki/Pure_function) because they do not attempt to change their inputs, and always return the same result for the same inputs.

In contrast, this function is impure because it changes its own input:

```js
function withdraw(account, amount) {
  account.total -= amount;
}
```

React is pretty flexible but it has a single strict rule:
React sangat fleksibel tapi mempunyai satu peraturan yang ketat:

**All React components must act like pure functions with respect to their props.**

Of course, application UIs are dynamic and change over time. In the [next section](/docs/state-and-lifecycle.html), we will introduce a new concept of "state". State allows React components to change their output over time in response to user actions, network responses, and anything else, without violating this rule.
Tentu saja, UI dari aplikasi akan dinamis dan selalu berganti. Di [sesi selanjutnya]()
