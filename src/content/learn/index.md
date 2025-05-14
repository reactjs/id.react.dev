---
title: Mulai Cepat
---

<Intro>

<<<<<<< HEAD
Selamat datang di dokumentasi React! Halaman ini akan memberikan Anda pengenalan tentang 80% konsep React yang akan Anda gunakan sehari-hari.
=======
Welcome to the React documentation! This page will give you an introduction to 80% of the React concepts that you will use on a daily basis.
>>>>>>> a3e9466dfeea700696211533a3570bc48d7bc3d3

</Intro>

<YouWillLearn>

- Cara membuat dan menyarangkan (*nest*) komponen-komponen
- Cara menambahkan *markup* dan *styles*
- Cara menampilkan data
- Cara me-*render* kondisi dan daftar (*lists*)
- Cara merespons *events* dan memperbarui layar
- Cara berbagi data antar komponen

</YouWillLearn>

## Membuat dan menyarangkan (nesting) komponen {/*components*/}

Aplikasi React dibuat dari *komponen*. Komponen adalah bagian dari UI (*user interface*, antarmuka pengguna) yang memiliki logika dan tampilan tersendiri. Sebuah komponen dapat berukuran sekecil tombol, atau sebesar seluruh halaman.

Komponen React adalah fungsi JavaScript yang mengembalikan *markup*:

```js
function MyButton() {
  return (
    <button>Saya adalah tombol</button>
  );
}
```

Sekarang setelah Anda mendeklarasikan `MyButton`, Anda dapat menyarangkannya ke dalam komponen lain:

```js {5}
export default function MyApp() {
  return (
    <div>
      <h1>Selamat datang di aplikasi saya</h1>
      <MyButton />
    </div>
  );
}
```

Perhatikan bahwa `<MyButton />` dimulai dengan huruf kapital. Dengan cara itulah Anda mengetahui bahwa itu adalah sebuah komponen React. Nama komponen React harus selalu dimulai dengan huruf kapital, sedangkan *tag* HTML harus menggunakan huruf kecil.

Lihatlah hasilnya:

<Sandpack>

```js
function MyButton() {
  return (
    <button>
      Saya adalah tombol
    </button>
  );
}

export default function MyApp() {
  return (
    <div>
      <h1>Selamat datang di aplikasi saya</h1>
      <MyButton />
    </div>
  );
}
```

</Sandpack>

Kata-kata kunci `export default` menentukan komponen utama di dalam berkas (*file*). Jika Anda tidak terbiasa dengan beberapa bagian dari sintaksis JavaScript, [MDN](https://developer.mozilla.org/en-US/docs/web/javascript/reference/statements/export) dan [javascript.info](https://javascript.info/import-export) memiliki referensi yang bagus.

## Menulis markup dengan JSX {/*writing-markup-with-jsx*/}

Sintaksis *markup* yang Anda lihat di atas disebut dengan *JSX*. JSX ini opsional, tetapi sebagian besar proyek React menggunakan JSX untuk kenyamanannya. Semua [alat yang kami rekomendasikan untuk pengembangan lokal](/learn/installation) mendukung JSX secara langsung.

JSX lebih ketat daripada HTML. Anda harus menutup *tag* seperti `<br />`. Komponen Anda juga tidak boleh mengembalikan beberapa *tag* JSX. Anda harus membungkusnya menjadi induk bersama (*shared parent*), seperti `<div>...</div>` atau sebuah pembungkus kosong `<>...</>`:

```js {3,6}
function AboutPage() {
  return (
    <>
      <h1>Tentang</h1>
      <p>Halo.<br />Apa kabar?</p>
    </>
  );
}
```

Jika Anda memiliki banyak HTML untuk dipindahkan (*port*) ke JSX, Anda dapat menggunakan [konverter online.](https://transform.tools/html-to-jsx).

## Menambahkan styles {/*adding-styles*/}

Di React, Anda menentukan kelas (*class*) CSS dengan `className`. Ini bekerja dengan cara yang sama seperti atribut HTML [`class`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/class):

```js
<img className="avatar" />
```

Kemudian Anda menulis aturan CSS untuk itu di dalam berkas CSS terpisah:

```css
/* Di dalam CSS Anda */
.avatar {
  border-radius: 50%;
}
```

React tidak mengatur (*prescribe*) bagaimana cara Anda menambahkan berkas CSS. Di dalam kasus yang paling sederhana, Anda akan menambahkan *tag* [`<link>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link) ke HTML Anda. Jika Anda menggunakan *build tool* atau *framework*, bacalah dokumentasinya untuk mempelajari bagaimana cara menambahkan berkas CSS ke dalam proyek Anda.

## Menampilkan data {/*displaying-data*/}

JSX memungkinkan Anda memasukkan *markup* ke dalam JavaScript. Kurung kurawal (*curly braces*) memungkinkan Anda "kembali" (*escape back*) ke dalam JavaScript sehingga Anda dapat menanamkan (*embed*) beberapa variabel dari kode Anda dan menampilkannya kepada pengguna. Sebagai contoh, ini akan menampilkan `user.name`:

```js {3}
return (
  <h1>
    {user.name}
  </h1>
);
```

Anda juga dapat "kembali ke JavaScript" dari atribut JSX, tetapi Anda harus menggunakan tanda kurung kurawal *daripada* tanda kutip (*quotes*). Sebagai contoh, `className="avatar"` mengoper *string* `"avatar"` sebagai kelas CSS (*CSS class*), tetapi `src={user.imageUrl}` membaca nilai variabel JavaScript `user.imageUrl`, dan kemudian mengoper nilai tersebut sebagai atribut `src`:

```js {3,4}
return (
  <img
    className="avatar"
    src={user.imageUrl}
  />
);
```

Anda dapat menaruh ekspresi yang lebih kompleks (*complex expressions*) di dalam kurung kurawal JSX juga, contohnya, [penggabungan *string*](https://javascript.info/operators#string-concatenation-with-binary) (*string concatenation*):

<Sandpack>

```js
const user = {
  name: 'Hedy Lamarr',
  imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
  imageSize: 90,
};

export default function Profile() {
  return (
    <>
      <h1>{user.name}</h1>
      <img
        className="avatar"
        src={user.imageUrl}
        alt={'Foto ' + user.name}
        style={{
          width: user.imageSize,
          height: user.imageSize
        }}
      />
    </>
  );
}
```

```css
.avatar {
  border-radius: 50%;
}

.large {
  border: 4px solid gold;
}
```

</Sandpack>

Pada contoh di atas, `style={{}}` bukanlah sintaksis khusus, melainkan objek `{}` biasa di dalam kurung kurawal JSX. Anda dapat menggunakan atribut `style` ketika *styles* Anda bergantung pada variabel JavaScript.

## Pe-render-an secara kondisional {/*conditional-rendering*/}

Di dalam React, tidak ada sintaksis khusus untuk menulis kondisi. Sebagai gantinya, Anda akan menggunakan teknik yang sama dengan yang Anda gunakan saat menulis kode JavaScript biasa. Sebagai contoh, Anda dapat menggunakan pernyataan (*statement*) [`if`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else) untuk menyertakan JSX secara kondisional:

```js
let content;
if (isLoggedIn) {
  content = <AdminPanel />;
} else {
  content = <LoginForm />;
}
return (
  <div>
    {content}
  </div>
);
```

Jika Anda lebih menyukai kode yang lebih ringkas, Anda dapat menggunakan [operator kondisional `?`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator) Tidak seperti `if`, operator ini bekerja di dalam JSX:

```js
<div>
  {isLoggedIn ? (
    <AdminPanel />
  ) : (
    <LoginForm />
  )}
</div>
```

Ketika Anda tidak membutuhkan cabang (*branch*) `lain`, Anda juga dapat menggunakan sintaksis [logika `&&` yang lebih pendek](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_AND#short-circuit_evaluation):

```js
<div>
  {isLoggedIn && <AdminPanel />}
</div>
```

Semua pendekatan ini juga dapat digunakan untuk menentukan atribut secara kondisional. Jika Anda tidak terbiasa dengan beberapa sintaksis JavaScript ini, Anda dapat memulai dengan selalu menggunakan `if...else`.

## Me-render daftar {/*rendering-lists*/}

Anda akan mengandalkan fitur JavaScript seperti perulangan [`for`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) dan [fungsi senarai (*array*) `map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) untuk me-render daftar komponen.

Sebagai contoh, katakanlah Anda memiliki serangkaian (*array*) produk:

```js
const products = [
  { title: 'Kubis', id: 1 },
  { title: 'Bawang Putih', id: 2 },
  { title: 'Apel', id: 3 },
];
```

Di dalam komponen Anda, gunakan fungsi `map()` untuk mengubah serangkaian produk menjadi serangkaian *item* `<li>`:

```js
const listItems = products.map(product =>
  <li key={product.id}>
    {product.title}
  </li>
);

return (
  <ul>{listItems}</ul>
);
```

Perhatikan bagaimana `<li>` memiliki atribut `key`. Untuk setiap *item* dalam daftar, Anda harus mengoper *string* atau angka yang secara unik mengidentifikasi *item* tersebut di antara saudara-saudaranya (*siblings*). Biasanya, *key* harus berasal dari data Anda, seperti sebuah ID basis data (*database*). React menggunakan *key* untuk mengetahui apa yang terjadi jika Anda menyisipkan (*insert*), menghapus, atau mengurutkan ulang *item*.

<Sandpack>

```js
const products = [
  { title: 'Kubis', isFruit: false, id: 1 },
  { title: 'Bawang Putih', isFruit: false, id: 2 },
  { title: 'Apel', isFruit: true, id: 3 },
];

export default function ShoppingList() {
  const listItems = products.map(product =>
    <li
      key={product.id}
      style={{
        color: product.isFruit ? 'magenta' : 'darkgreen'
      }}
    >
      {product.title}
    </li>
  );

  return (
    <ul>{listItems}</ul>
  );
}
```

</Sandpack>

## Merespon ke event {/*responding-to-events*/}

Anda dapat merespon ke *event* dengan mendeklarasikan fungsi *event handler* di dalam komponen Anda:

```js {2-4,7}
function MyButton() {
  function handleClick() {
    alert('Anda mengeklik saya!');
  }

  return (
    <button onClick={handleClick}>
      Klik saya
    </button>
  );
}
```

Perhatikan bagaimana `onClick={handleClick}` tidak memiliki tanda kurung (*parentheses*) di bagian akhir! Jangan _memanggil_ fungsi *event handler*: Anda hanya perlu *mengopernya ke bawah*. React akan memanggil *event handler* Anda ketika pengguna mengeklik tombol.

## Memperbarui layar {/*updating-the-screen*/}

Sering kali, Anda ingin komponen Anda "mengingat" beberapa informasi dan menampilkannya. Sebagai contoh, mungkin Anda ingin menghitung berapa kali sebuah tombol diklik. Untuk melakukan hal ini, tambahkan *state* ke komponen Anda.

Pertama, impor [`useState`](/reference/react/useState) dari React:

```js
import { useState } from 'react';
```

Sekarang Anda dapat mendeklarasikan *variabel state* di dalam komponen Anda:

```js
function MyButton() {
  const [count, setCount] = useState(0);
  // ...
```

Anda akan mendapatkan dua hal dari `useState`: *state* saat ini (`count`), dan fungsi yang memungkinkan Anda memperbaruinya (`setCount`). Anda dapat memberi nama apa saja, tetapi konvensi yang berlaku adalah menulis `[something, setSomething]`.

Saat pertama kali tombol ditampilkan, `count` akan menjadi `0` karena Anda mengoper `0` ke `useState()`. Ketika Anda ingin mengubah *state*, panggil `setCount()` dan berikan nilai baru padanya. Mengeklik tombol ini akan menambah penghitung (*counter*):

```js {5}
function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Diklik {count} kali
    </button>
  );
}
```

React akan memanggil fungsi komponen Anda lagi. Kali ini, `count` akan menjadi `1`. Kemudian akan menjadi `2`. Dan seterusnya.

Jika Anda me-*render* komponen yang sama beberapa kali, masing-masing akan mendapatkan *state*-nya sendiri. Klik setiap tombol secara terpisah:

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  return (
    <div>
      <h1>Penghitung yang diperbarui secara terpisah</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      Diklik {count} kali
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

Perhatikan bagaimana setiap tombol "mengingat" *state* `count`-nya sendiri dan tidak memengaruhi tombol lainnya.

## Menggunakan Hooks {/*using-hooks*/}

Fungsi yang dimulai dengan `use` disebut dengan *Hooks*. `useState` adalah *Hook* bawaan yang disediakan oleh React. Anda dapat menemukan *Hooks* bawaan lainnya di [referensi API.](/reference/react) Anda juga dapat menulis *Hooks* Anda sendiri dengan menggabungkan *Hooks* yang sudah ada.

*Hooks* lebih terbatas dibandingkan fungsi-fungsi lainnya. Anda hanya bisa memanggil *Hooks* *di bagian atas* komponen Anda (atau *Hooks* lainnya). Jika Anda ingin menggunakan `useState` dalam sebuah kondisi atau perulangan, ekstrak komponen baru dan letakkan di sana.

## Berbagi data antar komponen {/*sharing-data-between-components*/}

Pada contoh sebelumnya, setiap `MyButton` memiliki `count` tersendiri, dan ketika setiap tombol diklik, hanya `count` untuk tombol yang diklik yang berubah:

<DiagramGroup>

<Diagram name="sharing_data_child" height={367} width={407} alt="Diagram yang menunjukkan sebuah pohon dengan tiga komponen, satu induk berlabel MyApp dan dua anak berlabel MyButton. Kedua komponen MyButton berisi hitungan (count) dengan nilai nol.">

Awalnya, setiap *state* `count` `MyButton` adalah `0`

</Diagram>

<Diagram name="sharing_data_child_clicked" height={367} width={407} alt="Diagram yang sama dengan diagram sebelumnya, dengan hitungan komponen MyButton anak pertama yang disorot mengindikasikan klik dengan nilai hitungan yang bertambah satu. Komponen MyButton kedua masih berisi nilai nol." >

`MyButton` pertama memperbarui `count`-nya menjadi `1`

</Diagram>

</DiagramGroup>

Namun, sering kali Anda memerlukan komponen untuk *berbagi data dan selalu diperbarui bersamaan*.

Untuk membuat kedua komponen `MyButton` menampilkan `count` yang sama dan memperbarui secara bersamaan, Anda harus memindahkan *state* dari masing-masing tombol "ke atas" ke komponen terdekat yang berisi semuanya.

Dalam contoh ini, adalah `MyApp`:

<DiagramGroup>

<Diagram name="sharing_data_parent" height={385} width={410} alt="Diagram yang menunjukkan sebuah pohon yang terdiri dari tiga komponen, satu induk (parent) berlabel MyApp dan dua anak (children) berlabel MyButton. MyApp berisi nilai hitungan nol yang dioper ke bawah ke kedua komponen MyButton, yang juga menunjukkan nilai nol." >

Awalnya, *state* `count` `MyApp` adalah `0` dan dioper ke bawah ke kedua anak (*children*)

</Diagram>

<Diagram name="sharing_data_parent_clicked" height={385} width={410} alt="Diagram yang sama dengan diagram sebelumnya, dengan hitungan komponen MyApp induk yang disorot menunjukkan klik dengan nilai bertambah menjadi satu. Aliran ke kedua anak komponen MyButton juga disorot, dan nilai hitungan di setiap anak diatur ke satu yang menunjukkan nilai tersebut dioper ke bawah." >

Saat diklik, `MyApp` memperbarui *state* `count` menjadi `1` dan menurunkannya ke kedua anak

</Diagram>

</DiagramGroup>

Sekarang ketika Anda mengeklik salah satu tombol, `count` di `MyApp` akan berubah, yang akan mengubah kedua hitungan di `MyButton`. Berikut adalah cara untuk mengekspresikannya di dalam kode.

Pertama, *pindahkan state ke atas* dari `MyButton` ke `MyApp`:

```js {2-6,18}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Penghitung yang diperbarui secara terpisah</h1>
      <MyButton />
      <MyButton />
    </div>
  );
}

function MyButton() {
  // ... kita memindahkan kode dari sini ...
}

```

Kemudian, *oper state ke bawah* dari `MyApp` ke setiap `MyButton`, bersama dengan *shared click handler*. Anda dapat mengoper informasi ke `MyButton` menggunakan kurung kurawal JSX, seperti yang sebelumnya Anda lakukan dengan *tag* bawaan seperti `<img>`:

```js {11-12}
export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Counters that update together</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}
```

Informasi yang Anda berikan seperti ini disebut *props*. Sekarang komponen `MyApp` berisi *state* `count` dan *event handler* `handleClick`, dan *mengoper keduanya sebagai props* ke masing-masing tombol.

Terakhir, ubah `MyButton` untuk *membaca* *props* yang telah Anda lewati dari komponen induknya:

```js {1,3}
function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Diklik {count} kali
    </button>
  );
}
```

Ketika Anda mengeklik tombol, *handler* `onClick` akan dijalankan (*fires*). *Prop* `onClick` pada setiap tombol diatur ke fungsi `handleClick` di dalam `MyApp`, sehingga kode di dalamnya dapat berjalan. Kode tersebut memanggil `setCount(count + 1)`, yang menambah variabel *state* `count`. Nilai `count` yang baru dioper sebagai *prop* ke setiap tombol, sehingga semuanya menampilkan nilai yang baru. Hal ini disebut "mengangkat state ke atas" (*"lifting state up"*). Dengan mengangkat *state* ke atas, Anda telah membagikannya di antara komponen.

<Sandpack>

```js
import { useState } from 'react';

export default function MyApp() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <h1>Penghitung yang diperbarui bersamaan</h1>
      <MyButton count={count} onClick={handleClick} />
      <MyButton count={count} onClick={handleClick} />
    </div>
  );
}

function MyButton({ count, onClick }) {
  return (
    <button onClick={onClick}>
      Diklik {count} kali
    </button>
  );
}
```

```css
button {
  display: block;
  margin-bottom: 5px;
}
```

</Sandpack>

## Langkah Selanjutnya {/*next-steps*/}

Sekarang, Anda telah mengetahui dasar-dasar cara menulis kode React!

Lihat [Tutorial](/learn/tutorial-tic-tac-toe) untuk mempraktikkannya dan membangun aplikasi mini pertama Anda dengan React.
