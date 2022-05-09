---
id: jsx-in-depth
title: JSX In Depth
permalink: docs/jsx-in-depth.html
redirect_from:
  - "docs/jsx-spread.html"
  - "docs/jsx-gotchas.html"
  - "tips/if-else-in-JSX.html"
  - "tips/self-closing-tag.html"
  - "tips/maximum-number-of-jsx-root-nodes.html"
  - "tips/children-props-type.html"
  - "docs/jsx-in-depth-zh-CN.html"
  - "docs/jsx-in-depth-ko-KR.html"
---

Pada dasarnya, JSX hanya menyediakan sintaksis-sintaksis yang mudah ditulis dan dimengerti (*syntatic sugar*) untuk fungsi *`React.createElement(component, prop, ...children)`*. Kode JSX:

```js
<MyButton color="blue" shadowSize={2}>
  Klik saya
</MyButton>
```

di-*compile* menjadi:

```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Klik saya'
)
```

Anda juga dapat menggunakan *self-closing form* dari *tag* jika tidak ada turunan (*children*). Jadinya:

```js
<div className="sidebar" />
```

di-*compile* menjadi:

```js
React.createElement(
  'div',
  {className: 'sidebar'}
)
```

Jika Anda ingin mencoba bagaimana JSX yang spesifik JSX dikonversi menjadi JavaScript, cobalah [*Babel compiler* daring](babel://jsx-simple-example) ini.

## Spesifikasi Jenis Elemen React {#specifying-the-react-element-type}

Bagian pertama dari sebuah penanda (*tag*) JSX menentukan jenis dari elemen React.

Jenis-jenis yang dikapitalisasi menandakan bahwa penanda JSX merujuk pada sebuah komponen React.  Penanda-penanda ini dikompilasi menjadi sebuah acuan langsung ke variabe yang sudah diberi nama, jadi jika Anda menggunakan ekspresi JSX `<Foo />`, `Foo` harus berada dalam cakupan (*scope*).

### React Harus Berada dalam Cakupan {#react-must-be-in-scope}

Semenjak JSX mengompilasi jadi panggilan-panggilan pada `React.createElement`, `React` library juga harus selalu berada dalam cakupan dari kode JSX Anda.

Contohnya, kedua import tersebut dibutuhkan dalam kode ini, bahkan ketika `React` dan `CustomButton` tidak secara langsung mengacu dari JavaScript:

```js{1,2,5}
import React from 'react';
import CustomButton from './CustomButton';

function WarningButton() {
  // return React.createElement(CustomButton, {color: 'red'}, null);
  return <CustomButton color="red" />;
}
```

Jika Anda tidak menggunakan sebuah *bundler* JavaScript dan memuat React dari penanda `<script>`, penanda tersebut sudah termasuk di dalam cakupan seperti halnya `React` secara global.

### Menggunakan Notasi Titik untuk Jenis JSX {#using-dot-notation-for-jsx-type}

Anda juga bisa merujuk pada sebuah komponen React menggunakan notasi titik dari dalam JSX. Ini memudahkan jika Anda memiliki sebuah modul tunggal yang mengekspor bnayak komponen React. Contohnya, jika `MyComponents.DatePicker` adalah sebuah komponen, Anda bisa menggunakannya langsung dari JSX dengan cara:

```js{10}
import React from 'react';

const MyComponents = {
  DatePicker: function DatePicker(props) {
    return <div>Imagine a {props.color} datepicker here.</div>;
  }
}

function BlueDatePicker() {
  return <MyComponents.DatePicker color="blue" />;
}
```

### Komponen *User-Defined* Harus Dikapitalisasi {#user-defined-components-must-be-capitalized}

Ketika sebuah tipe elemen dimulai dengan sebuah huruf kecil (*lowercase*), hal tersebut merujuk pada sebuah komponen bawaan seperti `<div>` atau `<span>` dan menghasilkan sebuah *string* `'div'` atau `'span'` yang dioper ke `React.createElement`. Pengetikan yang dimulai dengan huruf kapital seperti `<Foo />` dikompilasi ke `React.createElement(Foo)` dan sesuai dengan sebuah komponen yang didefinisikan atau diimpor dalam *file* JavaScript Anda.

Kami merekomendasikan pemberian nama komponen dengan huruf kapital. Jika Anda memiliki sebuah komponen yang dimulai dengan sebuah huruf *lowercase*, serahkan komponen tersebut ke variabel yang dikapitalisasi sebelum menggunakannya dalam JSX.

Sebagai contoh, kode ini tidak akan berjalan seperti yang diharapkan:

```js{3,4,10,11}
import React from 'react';

// Salah! Ini adalah sebuah komponen dan seharusnya dikapitalisasi:
function hello(props) {
  // Benar! Penggunaan <div> ini sesuai dengan aturan karena div adalah penanda HTML yang valid:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Salah! React pikir bahwa <hello /> adalah sebuah penanda HTML karena tidak dikapitalisasi:
  return <hello toWhat="World" />;
}
```

Untuk memperbaiki ini, kita akan menamakan ulang `hello` menjadi `Hello` dan menggunakan `<Hello />` ketika mengacu ke sana:

```js{3,4,10,11}
import React from 'react';

// Benar! Ini adalah sebuah komponen dan memang seharusnya dikapitalisasi:
function Hello(props) {
  // Benar! Penggunaan <div> ini sesuai aturan karena div adalah sebuah penanda HTML yang valid:
  return <div>Hello {props.toWhat}</div>;
}

function HelloWorld() {
  // Benar! React tahu bahwa <Hello /> adalah sebuah komponen karena dikapitalisasi.
  return <Hello toWhat="World" />;
}
```

### Memilih Jenis yang Tepat pada *Runtime* {#choosing-the-type-at-runtime}

Anda tidak bisa menggunakan sebuah ekspresi umum sebagai jenis elemen React. Jika ingin menggunakan sebuah ekspresi umum untuk mengindikasikan jenis elemen, serahkan saja ekspresi umum tersebut ke variabel yang dikapitalisasi dahulu. Ini seringkali muncul ketika Anda ingin me-*render* sebuah komponen berbeda berdasarkan sebuah *prop*:

```js{10,11}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Salah! Tipe JSX tidak boleh berupa ekspresi.
  return <components[props.storyType] story={props.story} />;
}
```

Untuk memperbaiki ini, kita akan menyerahkan jenis tersebut ke sebuah variabel yang dikapitalisasi terlebih dahulu:

```js{10-12}
import React from 'react';
import { PhotoStory, VideoStory } from './stories';

const components = {
  photo: PhotoStory,
  video: VideoStory
};

function Story(props) {
  // Benar! Jenis JSX belum berupa sebuah variable yang dikapitalisasi.
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```

## *Prop* dalam JSX {#props-in-jsx}

Terdapat beberapa cara berbeda untuk men-spesifikasikan *prop* dalam JSX.

### JavaScript Expressions as Props {#javascript-expressions-as-props}

Anda bisa mengoper ekspresi JavaScript sebagai sebuah *prop*, dengan cara melingkunginya dengan `{}`. Contohnya, dalam JSX ini:

```js
<MyComponent foo={1 + 2 + 3 + 4} />
```

Untuk `MyComponent`, nilai `props.foo` akan menjadi `10` karena ekspresi `1 + 2 + 3 + 4` telah ditaksi.

Pernyataan-pernyataan `if` dan pengulangan-pengulangan (*loop*) `for` bukanlah ekspresi dalam JavaScript, jadi hal-hal tersebut tidak bisa digunakan secara langsung dalam JSX. Sebagai gantinya, Anda bisa menempatkan ini di dalam kode yang melingkupi. Contohnya:

```js{3-7}
function NumberDescriber(props) {
  let description;
  if (props.number % 2 == 0) {
    description = <strong>even</strong>;
  } else {
    description = <i>odd</i>;
  }
  return <div>{props.number} is an {description} number</div>;
}
```

Anda bisa mempelajari lebuh lanjut [proses *render* kondisional](/docs/conditional-rendering.html) dan [pengulangan](/docs/lists-and-keys.html) di bagian-bagian yang sesuai.

### *String Literal* {#string-literals}

Anda dapat mengoper sebuah *string literal* sebagai sebuah *prop*. Kedua ekspresi JSX berikut ini sama:

```js
<MyComponent message="hello world" />

<MyComponent message={'hello world'} />
```

Ketika Anda mengoper sebuah *string literal*, nilainya tidak luput dari HTML (*HTML-unescaped*). Jadi kedua eskpresi JSX berikut ini sama:

```js
<MyComponent message="&lt;3" />

<MyComponent message={'<3'} />
```

Perilaku ini biasanya tidak relevan. Dan hanya disebutkan di sini untuk melengkapi.

### Nilai *Default* Prop adalah "True" {#props-default-to-true}

Jika Anda tidak mengoper nilai apapun ke sebuah *prop*, nilai *default*-nya adalah 'true'. Kedua ekspresi JSX ini adalah sama:

```js
<MyTextBox autocomplete />

<MyTextBox autocomplete={true} />
```

Secara umum, kami tidak merekomendasikan menggunakan cara ini karena bisa membingungkan Anda dengan [*shorthand* objek *ES6*](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015) `{foo}` yang merupakan kependekan dari `{foo: foo}` ketimbang `{foo: true}`. Perilaku ini demikian adanya karena cocok dengan perilaku HTML.

### Menyebarkan Atribut {#spread-attributes}

<<<<<<< HEAD
Jika Anda memiliki `props` sebagai sebuah objek, dan ingin mengopernya ke JSX, Anda bisa gunakan `...` sebagai sebuah operator "penyebaran" (*spread*) untuk mengoper ke objek *prop* yang utuh. Kedua komponen ini adalah sama:
=======
If you already have `props` as an object, and you want to pass it in JSX, you can use `...` as a "spread" syntax to pass the whole props object. These two components are equivalent:
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

```js{7}
function App1() {
  return <Greeting firstName="Ben" lastName="Hector" />;
}

function App2() {
  const props = {firstName: 'Ben', lastName: 'Hector'};
  return <Greeting {...props} />;
}
```

<<<<<<< HEAD
Anda juga bisa mengambil *prop* tertentu yang mana komponen Anda akan gunakan ketika mengoperkan semua *prop* lainnya menggunakan operator penyebaran.
=======
You can also pick specific props that your component will consume while passing all other props using the spread syntax.
>>>>>>> 26a870e1c6e232062b760d37620d85802750e985

```js{2}
const Button = props => {
  const { kind, ...other } = props;
  const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
  return <button className={className} {...other} />;
};

const App = () => {
  return (
    <div>
      <Button kind="primary" onClick={() => console.log("clicked!")}>
        Hello World!
      </Button>
    </div>
  );
};
```

Pada contoh di atas, *prop* `kind` tersebut secara aman digunakan dan *tidak* dioper kepada elemen `<button>` dalam DOM.
Semua *prop* lainnya dioper melalui objek `...other` membuat komponen ini begitu fleksibel. Anda bisa lihat bahwa komponen tersebut mengoper sebuah *prop* `onClick` dan *prop* `children`.

Penyebaran atribut bisa berguna tetapi juga membuatnya mudah mengoper *prop* yang tidak perlu ke komponen-komponen yang tidak memperdulikan *prop* tersebut atau mengoper atribut-atribut HTML yang tidak valid ke DOM. Kami rekomendasikan menggunakan sintaks ini seperlunya.  

## *Children* dalam JSX {#children-in-jsx}

Dalam ekspresi JSX yang mengandung penanda (*tag*) pembuka dan *tag* penutup, konten yang ada di antara penanda tersebut dioper sebagai *prop* khusus: `props.children`. Ada beberapa cara berbeda untuk mengoper turunan (*children*):

### *String Literal* {#string-literals-1}

Anda dapat menempatkan sebuah *string* di antara *tag* pembuka dan penutup dan `props.children` akan menjadi *string* tersebut. Ini berguna untuk banyak elemen HTML yang *built-in*. Contohnya:

```js
<MyComponent>Hello world!</MyComponent>
```

Ini adalah JSX yang valid , dan `props.children` dalam `MyComponent` secara sederhana akan menjadi *string* `"Hello world!"`. HTML tersebut tidak terhindarkan, jadi Anda secara umum akan menuliskan JSX selayaknya Anda menuliskan HTML dengan cara berikut:

```html
<div>Ini adalah HTML valid &amp; JSX pada waktu yang sama.</div>
```

JSX mentingkirkan ruang putih (*whitespace*) di awal dan akhir sebuah baris. JSX juga menyingkirkan baris-baris yang kosong. Baris-baris baru yang berbatasan dengan *tag* juga disingkirkan; baris-baris baru yang muncul di tengah *string literal* dipadatkan menjadi sebuah *space* tunggal. Jadi semua ini akan me-*render* hasil yang sama:

```js
<div>Hello World</div>

<div>
  Hello World
</div>

<div>
  Hello
  World
</div>

<div>

  Hello World
</div>
```

### Turunan (*Children*) JSX {#jsx-children}

Anda juga bisa menyediakan lebih banyak elemen JSX sebagai turunan (*children*). Hal ini berguna untuk menampilkan komponen yang *nested*:

```js
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

Anda juga bisa mencampurkan jenis-jenis turunan yang berbeda, jadi Anda bisa mengguankan *string literal* bersamaan dengan turunan JSX. Inin adalah cara lain yang mana JSX seperti halnya HTML, jadi hasilnya JSX yang valid dan HTML yang valid:

```html
<div>
  Here is a list:
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
</div>
```

Sebuah komponen React juga bisa memberi hasil balikan (*return*) berupa sebuah *array* elemen:

```js
render() {
  // Tidak perlu untuk membungkus daftar itemd dalam sebuah elemen tambahan!
  return [
    // Jangan lupa kuncinya :)
    <li key="A">Item pertama</li>,
    <li key="B">Item kedua</li>,
    <li key="C">Item ketiga</li>,
  ];
}
```

### Ekspresi JavaScript sebagai *Children* {#javascript-expressions-as-children}

Anda dapat mengoper ekspresi JavaScript apapun sebagai turunan, dengan cara memenyertakannya di antara `{}`. Sebagai contoh, ekspresi-ekspresi ini adalah sama:

```js
<MyComponent>foo</MyComponent>

<MyComponent>{'foo'}</MyComponent>
```

Ini seringkali berguna untuk me-*render* sebuah daftar ekspresi JSX yang panjangnya dapat berubah-ubah. Contohnya, berikut ini me-*render* sebuah daftar HTML:

```js{2,9}
function Item(props) {
  return <li>{props.message}</li>;
}

function TodoList() {
  const todos = ['menyelesaikan doc', 'men-submit pr', 'nag dan untuk di-review'];
  return (
    <ul>
      {todos.map((message) => <Item key={message} message={message} />)}
    </ul>
  );
}
```

Ekspresi-ekspresi JavaScript juga dapat dicampurkan dengan jenis-jenis turunan lain. Ini seringkali berguna dalam pengganti *string template*:

```js{2}
function Hello(props) {
  return <div>Hello {props.addressee}!</div>;
}
```

### Fungsi sebagai Turunan (*Children*) {#functions-as-children}

Normalnya, ekspresi JavaScript dimasukkan ke dalam JSX akan ditaksir menjadis sebuah *string*, sebuah elemen React, atau menjadi daftar hal-hal semacam itu. Bagaimanapun, `props.children` bekerja seperti halnya *prop* apapun yang mana bisa mengoper jenis data apapun, tidak hanya jenis data yang React tahu bagaimana cara untuk me-*render*-nya. Contohnya, jika Anda memiliki sebuah komponen *custom*, Anda bisa melakukan *callback* pada komponen tersebut sebagai `props.children`:

```js{4,13}
// Memanggil callback turunan numTimes untuk menghasilkan sebuah komponen berulang
function Repeat(props) {
  let items = [];
  for (let i = 0; i < props.numTimes; i++) {
    items.push(props.children(i));
  }
  return <div>{items}</div>;
}

function ListOfTenThings() {
  return (
    <Repeat numTimes={10}>
      {(index) => <div key={index}>This is item {index} in the list</div>}
    </Repeat>
  );
}
```

Turunan dioper ke sebuah komponen *custom* bisa berarti apa saja, selama komponen itu mengubah turunan-turunan tersbut menjadi sesuatu yang bisa dimengerti React sebelum proses *render*. Penggunaan ini tidak lazim, namun berkerja jika Anda ingin melebarkan apa saja yang dapat dilakukan JSX.

### *Boolean, Null,* dan *Undefined* Diabaikan {#booleans-null-and-undefined-are-ignored}

`false`, `null`, `undefined`, dan `true` adalah turunan yang valid. Itu semua tidak di-*render*. Ekspresi-ekspresi JSX akan me-*render* hasil yang sama:

```js
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

Ini berguna untuk secara kondisional me-*render* elemen-elemen React. JSX ini me-*render* komponen `<Header />` hanya jika `showHeader` bernilai `true`:

```js{2}
<div>
  {showHeader && <Header />}
  <Content />
</div>
```

Satu peringatan bahwa beberapa [nilai "salah"](https://developer.mozilla.org/en-US/docs/Glossary/Falsy), seperti angka `0`, masih di-*render* oleh React. Contohnya, kode berikut ini tidak akan berlaku seperi yang Anda kira karena `0` akan dicetak ketika `props.messages` adalah *array* kosong:

```js 2}
<div>
  {props.messages.length &&
    <MessageList messages={props.messages} />
  }
</div>
```

Untuk memperbaiki ini, pastikan bahwa ekspresi sebelum `&&` adalah *boolean*:

```js{2}
<div>
  {props.messages.length > 0 &&
    <MessageList messages={props.messages} />
  }
</div>
```

Sebaliknya, jika Anda ingin sebuah nilai seperti `false`, `true`, `null`, atau `undefined` untuk muncul di *output*, Anda harus [mengkonversinya menjadi sebuah *string*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#String_conversion) terlebih dahulu:

```js{2}
<div>
  My JavaScript variable is {String(myVariable)}.
</div>
```
