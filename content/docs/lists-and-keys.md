---
id: lists-and-keys
title: Lists dan Keys
permalink: docs/lists-and-keys.html
prev: conditional-rendering.html
next: forms.html
---

Pertama-tama, mari kita tinjau kembali bagaimana Anda dapat mentransformasi *list* di JavaScript.

Jika melihat kode di bawah, kita menggunakan fungsi [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) untuk mengambil senarai `numbers` dan menggandakan nilainya.
Kita akan menaruh senarai baru yang dikembalikan oleh `map()` ke dalam sebuah variabel `doubled` dan me-*log*-nya:

```javascript{2}
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((number) => number * 2);
console.log(doubled);
```

Kode ini akan me-*log* `[2,4,6,8,10]` ke dalam konsol.

Di React, mengubah senarai ke dalam *list* [elemen](/docs/rendering-elements.html) kurang lebih sama.

### Me-render Banyak Komponen {#rendering-multiple-components}

Anda dapat membangun koleksi dari beberapa elemen dan [menyertakannya dalam JSX](/docs/introducing-jsx.html#embedding-expressions-in-jsx) menggunakan tanda kurung kurawal `{}`.

Di bawah ini, kita mengulang-ulang melalui senarai `numbers` menggunakan fungsi [`map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) JavaScript.
Kita akan mengembalikan elemen `<li>` untuk setiap *item*.
Akhirnya, kita akan menetapkan senarai elemen dari hasil proses tersebut ke dalam `listItems`:

```javascript{2-4}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li>{number}</li>
);
```

Kita akan menyertakan seluruh senarai `listItems` ke dalam elemen `<ul>` dan [me-*render*-nya ke dalam DOM](/docs/rendering-elements.html#rendering-an-element-into-the-dom):

```javascript{2}
ReactDOM.render(
  <ul>{listItems}</ul>,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/GjPyQr?editors=0011)

Kode ini akan menampilkan sebuah *list bullet* dari angka 1 sampai 5.

### Daftar Komponen Dasar {#basic-list-component}

Biasanya Anda akan me-*render list* di dalam sebuah [komponen](/docs/components-and-props.html).

Kita bisa me-refaktor contoh sebelumnya ke dalam sebuah komponen yang menerima senarai `numbers` dan mengeluarkan sebuah *list* elemen yang tidak berurutan.

```javascript{3-5,7,13}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Ketika Anda menjalankan kode ini, Anda akan mendapatkan peringatan bahwa *key* harus disediakan untuk *item* di dalam *list*. Sebuah "*key*" adalah atribut *string* spesial yang perlu Anda sertakan dalam pembuatan *list* elemen. Kita akan mendiskusikan mengapa ini penting di bagian berikutnya.

Mari kita sertakan `*key*` ke dalam *list item* kita pada `numbers.map()` dan memperbaiki masalah *key* yang hilang.

```javascript{4}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/jrXYRR?editors=0011)

## Key {#keys}

*Key* membantu React untuk mengidentifikasi *item* mana yang telah diubah, ditambahkan, atau dihilangkan. *Key* harus diberikan di dalam elemen yang terdapat di dalam sebuah senarai untuk memberikan elemen tersebut identitas yang stabil:

```js{3}
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number.toString()}>
    {number}
  </li>
);
```

Cara terbaik untuk menentukan *key* yang akan digunakan adalah menggunakan *string* unik untuk mengidentifikasikan *item* dalam sebuah *list* dari *list item* lain yang menjadi saudaranya. Seringkali Anda akan menggunakan ID dari data Anda sebagai *key*:

```js{2}
const todoItems = todos.map((todo) =>
  <li key={todo.id}>
    {todo.text}
  </li>
);
```

Ketika Anda tidak memiliki ID yang stabil untuk me-*render item*, Anda bisa menggunakan indeks dari *item* sebagai *key* untuk pilihan terakhir:

```js{2,3}
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  // Hanya lakukan ini jika *item* tidak memiliki ID yang stabil
  <li key={index}>
    {todo.text}
  </li>
);
```

Kami tidak merekomendasikan menggunakan indeks untuk *key* jika urutan *item* nantinya berubah. Ini berdampak negatif terhadap kinerja dan dapat menyebabkan masalah dengan *state* komponen. Simak artikel Robin Pokorny untuk [penjelasan lebih dalam mengenai dampak negatif penggunaan indeks sebagai *key*](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318). Jika Anda memilih untuk tidak menetapkan *key* pada *list item* maka React secara bawaan akan menggunakan indeks sebagai *key*.

Berikut adalah [penjelasan lebih dalam tentang kenapa *key* sangat diperlukan](/docs/reconciliation.html#recursing-on-children) Jika Anda tertarik untuk mempelajari lebih lanjut.

### Mengekstrak Komponen dengan Key {#extracting-components-with-keys}

*Key* hanya perlu digunakan di dalam konteks senarai yang mengurung *item* dengan *key* tersebut.

Sebagai contoh, jika Anda [mengekstrak](/docs/components-and-props.html#extracting-components) sebuah komponen `ListItem`, Anda harus menyimpan *key* pada elemen `<ListItem />` di dalam senarai daripada di elemen `<li>` yang ada pada `ListItem`.

**Contoh: Penggunaan *Key* yang Salah**

```javascript{4,5,14,15}
function ListItem(props) {
  const value = props.value;
  return (
    // Salah! Tidak diperlukan untuk menentukan *key* di sini:
    <li key={value.toString()}>
      {value}
    </li>
  );
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Salah! *Key* seharusnya ditentukan di sini:
    <ListItem value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

**Contoh: Penggunaan *Key* yang Benar**

```javascript{2,3,9,10}
function ListItem(props) {
  // Benar! Karena tidak perlu menentukan *key* di sini:
  return <li>{props.value}</li>;
}

function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    // Benar! *Key* harus ditentukan di dalam senarai
    <ListItem key={number.toString()} value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/ZXeOGM?editors=0010)

Sebuah aturan yang mudah diingat adalah elemen di dalam pemanggilan `map()` akan membutuhkan *key*.

### Key Harus Bersifat Unik Diantara Saudaranya {#keys-must-only-be-unique-among-siblings}

<<<<<<< HEAD

*Key* digunakan didalam senarai harus bersifat unik di antara saudaranya. Namun mereka tidak perlu unik secara global. Kita dapat menggunakan *key* yang sama ketika kita menghasilkan dua senarai yang berbeda:
=======
Keys used within arrays should be unique among their siblings. However, they don't need to be globally unique. We can use the same keys when we produce two different arrays:
>>>>>>> f2158e36715acc001c8317e20dc4f45f9e2089f3

```js{2,5,11,12,19,21}
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/NRZYGN?editors=0010)

*Key* berfungsi sebagai petunjuk bagi React namun mereka tidak akan muncul di komponen Anda. Jika Anda membutuhkan nilai yang sama di dalam komponen Anda, oper secara eksplisit sebagai sebuah *props* dengan nama yang berbeda:

```js{3,4}
const content = posts.map((post) =>
  <Post
    key={post.id}
    id={post.id}
    title={post.title} />
);
```

Dengan contoh di atas, komponen `Post` dapat membaca `props.id`, bukan `props.key`.

### Menanamkan map() pada JSX {#embedding-map-in-jsx}

Pada contoh di atas kita mendeklarasikan variabel terpisah `listItems` dan memasukkannya ke dalam JSX:

```js{3-6}
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <ListItem key={number.toString()}
              value={number} />
  );
  return (
    <ul>
      {listItems}
    </ul>
  );
}
```

JSX memperbolehkan [menanamkan ekspresi](/docs/introducing-jsx.html#embedding-expressions-in-jsx) di dalam tanda kurung kurawal oleh karenanya kita dapat memasukkan hasil `map()` secara *inline*:

```js{5-8}
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

[**Coba di CodePen**](https://codepen.io/gaearon/pen/BLvYrB?editors=0010)

Terkadang penulisan seperti ini akan menghasilkan kode yang lebih jelas, namun cara seperti ini juga dapat disalahgunakan.
Seperti di JavaScript, menjadi pilihan Anda apakah mengekstrak sebuah variabel tersendiri agar lebih mudah di baca penting bagi Anda. Perlu diingat bahwa jika di dalam `map()` terdapat banyak perulangan, bisa jadi ini adalah saat yang tepat untuk [mengekstrak sebuah komponen](/docs/components-and-props.html#extracting-components).
