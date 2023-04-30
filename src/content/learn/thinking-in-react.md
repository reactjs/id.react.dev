---
title: Cara Berpikir dengan React
---

<Intro>

React dapat mengubah cara berpikir Anda tentang desain yang Anda lihat dan aplikasi yang Anda buat. Ketika Anda membuat antarmuka pengguna (*user interface*) dengan React, pertama-tama Anda akan memecahnya menjadi beberapa bagian yang disebut dengan *komponen*. Kemudian, Anda akan mendeskripsikan *state* visual yang berbeda untuk setiap komponen Anda. Terakhir, Anda akan menghubungkan komponen-komponen Anda bersama-sama sehingga data mengalir melaluinya. Dalam tutorial ini, kami akan memandu Anda melalui proses berpikir untuk membangun tabel data produk yang dapat dicari dengan React.

</Intro>

## Mulailah dengan sebuah rancang bangun {/*start-with-the-mockup*/}

Bayangkan Anda sudah memiliki API JSON dan rancang bangun dari seorang desainer.

API JSON tersebut mengembalikan beberapa data yang terlihat seperti ini:

```json
[
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" }
]
```

Rancang bangun tersebut terlihat seperti ini:

<img src="/images/docs/s_thinking-in-react_ui.png" width="300" style={{margin: '0 auto'}} />

Untuk mengimplementasikan antarmuka pengguna di React, Anda biasanya akan mengikuti lima langkah yang sama.

## Langkah 1: Bagi antarmuka pengguna menjadi hierarki komponen {/*step-1-break-the-ui-into-a-component-hierarchy*/}

Mulailah dengan menggambar kotak-kotak di sekitar setiap komponen dan subkomponen dalam rancang bangun dan berikan mereka nama. Jika Anda bekerja dengan seorang desainer, mereka mungkin telah menamai komponen-komponen ini di alat bantu desain mereka. Tanyakanlah mereka!

Tergantung pada latar belakang Anda, Anda dapat berpikir untuk membagi desain menjadi beberapa komponen dengan cara yang berbeda:

* **Pemrograman**--gunakan teknik yang sama untuk memutuskan apakah Anda harus membuat fungsi atau objek baru. Salah satu teknik tersebut adalah [*single responsibility principle*](https://en.wikipedia.org/wiki/Single_responsibility_principle), yaitu sebuah komponen idealnya hanya melakukan satu hal. Jika komponen tersebut berkembang, maka harus dipecah menjadi subkomponen yang lebih kecil.
* **CSS**--pertimbangkan untuk apa Anda akan membuat *class selector*. (Namun, komponen tidak terlalu terperinci.)
* **Desain**--pertimbangkan bagaimana Anda akan mengatur *layer* desain.

Jika JSON Anda terstruktur dengan baik, Anda akan sering menemukan bahwa JSON tersebut secara alami memetakan struktur komponen UI Anda. Hal ini karena UI dan model data sering kali memiliki arsitektur informasi yang sama--atau, bentuk yang sama. Pisahkan UI Anda menjadi beberapa komponen, di mana setiap komponen cocok dengan satu bagian dari model data Anda.

Terdapat lima komponen pada layar ini:

<FullWidth>

<CodeDiagram flip>

<img src="/images/docs/s_thinking-in-react_ui_outline.png" width="500" style={{margin: '0 auto'}} />

1. `FilterableProductTable` (abu-abu) berisi seluruh aplikasi.
2. `SearchBar` (biru) menerima masukan dari pengguna.
3. `ProductTable` (lavender) menampilkan dan memfilter *list* sesuai dengan masukan pengguna.
4. `ProductCategoryRow` (hijau) menampilkan judul untuk setiap kategori.
5. `ProductRow` (kuning) menampilkan baris untuk setiap produk.

</CodeDiagram>

</FullWidth>

Jika Anda melihat `ProductTable` (lavender), Anda akan melihat bahwa *header* tabel (yang berisi label "Name" dan "Price") bukan merupakan komponennya sendiri. Ini adalah masalah preferensi, dan Anda dapat memilih salah satu. Dalam contoh ini, header tersebut merupakan bagian dari `ProductTable` karena muncul di dalam *list* `ProductTable`. Namun, jika *header* ini menjadi kompleks (misalnya, jika Anda menambahkan pengurutan), Anda dapat memindahkannya ke dalam komponen `ProductTableHeader` sendiri.

Setelah Anda mengidentifikasi komponen-komponen dalam rancang bangun, susunlah komponen-komponen tersebut ke dalam sebuah hirarki. Komponen yang muncul di dalam komponen lain dalam rancang bangun harus muncul sebagai anak dalam hierarki:

* `FilterableProductTable`
    * `SearchBar`
    * `ProductTable`
        * `ProductCategoryRow`
        * `ProductRow`

## Langkah 2: Buat versi statis di React {/*step-2-build-a-static-version-in-react*/}

Setelah Anda memiliki hierarki komponen, sekarang saatnya mengimplementasikan aplikasi Anda. Pendekatan yang paling mudah adalah membuat versi yang me-*render* UI dari model data Anda tanpa menambahkan interaktivitas apa pun... untuk sementara! Sering kali lebih mudah untuk membuat versi statis terlebih dahulu dan menambahkan interaktivitas kemudian. Membangun versi statis membutuhkan banyak pengetikan dan tidak perlu berpikir, tetapi menambahkan interaktivitas membutuhkan banyak pemikiran dan tidak perlu banyak pengetikan.

Untuk membuat versi statis dari aplikasi Anda yang me-*render* model data Anda, Anda perlu membuat [komponen](/learn/your-first-component) yang menggunakan kembali komponen lain dan mengirimkan data menggunakan [props.](/learn/passing-props-to-a-component) Props adalah cara untuk mengoper data dari induk ke anak. (Jika Anda sudah terbiasa dengan konsep [state](/learn/state-a-components-memory), jangan gunakan state sama sekali untuk membangun versi statis ini. State hanya diperuntukkan bagi interaktivitas, yaitu data yang berubah seiring waktu. Karena ini adalah versi statis dari aplikasi, Anda tidak memerlukannya).

Anda bisa membangun "dari atas ke bawah" dengan memulai membangun komponen yang lebih tinggi dalam hierarki (seperti `FilterableProductTable`) atau "dari bawah ke atas" dengan bekerja dari komponen yang lebih rendah (seperti `ProductRow`). Dalam contoh yang lebih sederhana, biasanya lebih mudah untuk bekerja dari atas ke bawah, dan pada proyek yang lebih besar, lebih mudah untuk bekerja dari bawah ke atas.

<Sandpack>

```jsx App.js
function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar() {
  return (
    <form>
      <input type="text" placeholder="Search..." />
      <label>
        <input type="checkbox" />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

function FilterableProductTable({ products }) {
  return (
    <div>
      <SearchBar />
      <ProductTable products={products} />
    </div>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 10px;
}
td {
  padding: 2px;
  padding-right: 40px;
}
```

</Sandpack>

(Jika kode ini terlihat menyeramkan, bacalah [Quick Start](/learn/) terlebih dahulu!)

Setelah membuat komponen, Anda akan memiliki pustaka komponen yang dapat digunakan kembali untuk me-*render* model data Anda. Karena ini adalah aplikasi statis, komponen-komponennya hanya akan mengembalikan JSX. Komponen di bagian atas hirarki (`FilterableProductTable`) akan mengambil model data Anda sebagai *props*. Ini disebut *aliran data satu arah (one-way data flow)* karena data mengalir turun dari komponen tingkat atas ke komponen di bagian bawah pohon.

<Pitfall>

Pada titik ini, Anda tidak perlu menggunakan nilai state apa pun. Itu untuk langkah selanjutnya!

</Pitfall>

## Langkah 3: Identifikasi representasi minimal namun komplit dari state UI {/*step-3-find-the-minimal-but-complete-representation-of-ui-state*/}

Untuk membuat UI interaktif, Anda harus mengizinkan pengguna mengubah model data yang mendasarinya. Anda akan menggunakan *state* untuk ini.

Bayangkan state sebagai kumpulan data perubahan minimal yang perlu diingat oleh aplikasi Anda. Prinsip paling penting dalam menyusun state adalah menjaganya agar tetap [DRY (*Don't Repeat Yourself*)] (https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) Cari tahu representasi minimal absolut dari state yang dibutuhkan aplikasi Anda dan hitung semua yang lain sesuai permintaan. Sebagai contoh, jika Anda membuat daftar belanja, Anda dapat menyimpan item sebagai array dalam state. Jika Anda juga ingin menampilkan jumlah item dalam daftar, jangan simpan jumlah item sebagai nilai state lain--sebagai gantinya, baca panjang senarai Anda.

Sekarang pikirkan semua bagian data dalam contoh aplikasi ini:

1. Daftar produk asli
2. Teks pencarian yang dimasukkan pengguna
3. Nilai dari kotak centang
4. Daftar produk yang difilter

Manakah yang termasuk state? Identifikasi mana yang bukan:

* Apakah data **tetap tidak berubah** dari waktu ke waktu? Jika ya, data tersebut bukan state.
* Apakah data **diturunkan dari induk** melalui props? Jika ya, data tersebut bukan state.
* **Bisakah Anda menghitungnya** berdasarkan state atau props yang ada di komponen Anda? Jika iya, maka data tersebut *pasti* bukan state!

Yang tersisa mungkin adalah state.

Mari kita lihat satu per satu lagi:

1. Daftar produk asli **dioper sebagai props, jadi bukan merupakan state**.
2. Teks pencarian tampaknya adalah state karena berubah dari waktu ke waktu dan tidak dapat dihitung dari apa pun.
3. Nilai kotak centang tampaknya adalah state karena berubah dari waktu ke waktu dan tidak dapat dihitung dari apa pun.
4. Daftar produk yang difilter **bukan state karena dapat dihitung** dengan mengambil daftar produk asli dan memfilternya sesuai dengan teks pencarian dan nilai kotak centang.

Ini berarti, hanya teks pencarian dan nilai kotak centang yang merupakan state! Bagus sekali!

<DeepDive>

#### Props vs State {/*props-vs-state*/}

Ada dua jenis data "model" dalam React: props dan state. Keduanya sangat berbeda:

* [**Props** seperti argumen yang Anda berikan](/learn/passing-props-to-a-component) ke sebuah fungsi. Mereka memungkinkan komponen induk mengoper data ke komponen anak dan menyesuaikan tampilannya. Sebagai contoh, sebuah `Form` dapat mengoper sebuah props `color` ke sebuah `Button`.
* [**State** seperti memori sebuah komponen.](/learn/state-a-components-memory) Memungkinkan sebuah komponen melacak beberapa informasi dan mengubahnya sebagai respons terhadap interaksi. Sebagai contoh, sebuah `Button` dapat melacak state `isHovered`.

Props dan state berbeda, tetapi keduanya bekerja bersama. Komponen induk akan sering menyimpan beberapa informasi dalam state (sehingga dapat mengubahnya), dan *meneruskannya ke komponen anak* sebagai props mereka. Tidak apa-apa jika perbedaannya masih terasa kabur saat pertama kali dibaca. Dibutuhkan sedikit latihan agar benar-benar melekat!

</DeepDive>

## Step 4: Identifikasi dimana state Anda berada {/*step-4-identify-where-your-state-should-live*/}

Setelah mengidentifikasi data state minimal aplikasi Anda, Anda perlu mengidentifikasi komponen mana yang bertanggung jawab untuk mengubah state ini, atau *memiliki* state tersebut. Ingat: React menggunakan aliran data satu arah, mengoper data turun melalui hirarki komponen dari komponen induk ke komponen anak. Mungkin tidak langsung jelas komponen mana yang harus memiliki state apa. Hal ini dapat menjadi tantangan jika Anda baru mengenal konsep ini, tetapi Anda dapat mengetahuinya dengan mengikuti langkah-langkah berikut ini!

Untuk setiap bagian state dalam aplikasi Anda:

1. Identifikasi *setiap* komponen yang me-*render* sesuatu berdasarkan *state* tersebut.
2. Temukan komponen induk yang paling dekat--komponen yang berada di atas semua komponen dalam hirarki.
3. Tentukan di mana *state* tersebut harus berada:
    1. Sering kali, Anda dapat meletakkan *state* secara langsung ke dalam induknya.
    2. Anda juga dapat menempatkan *state* ke dalam beberapa komponen di atas induknya.
    3. Jika Anda tidak dapat menemukan komponen yang masuk akal untuk memiliki *state*, buatlah komponen baru hanya untuk menyimpan *state* dan tambahkan di suatu tempat di dalam hirarki di atas komponen induk umum.

Pada langkah sebelumnya, Anda menemukan dua bagian status dalam aplikasi ini: teks input pencarian, dan nilai kotak centang. Dalam contoh ini, keduanya selalu muncul bersamaan, sehingga masuk akal untuk meletakkannya di tempat yang sama.

Sekarang mari kita bahas strateginya:

1. **Identifikasi komponen yang menggunakan state:**
    * `ProductTable` perlu memfilter daftar produk berdasarkan status tersebut (teks pencarian dan nilai kotak centang). 
    * `SearchBar` perlu menampilkan status tersebut (teks pencarian dan nilai kotak centang).
1. **Temukan induk yang sama:** Komponen induk pertama yang dimiliki oleh kedua komponen tersebut adalah `FilterableProductTable`.
2. **Tentukan di mana state berada**: Kita akan menyimpan teks filter dan nilai state kotak centang di `FilterableProductTable`.

Jadi nilai state akan berada di dalam `FilterableProductTable`. 

Tambahkan state ke komponen menggunakan [Hook `useState()`.](/reference/react/useState) Hook adalah fungsi khusus yang memungkinkan Anda "mengaitkan ke dalam" React. Tambahkan dua variabel state di bagian atas `FilterableProductTable` dan tentukan state awalnya:

```js
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);  
```

Kemudian, berikan `filterText` dan `inStockOnly` ke `ProductTable` dan `SearchBar` sebagai props:

```js
<div>
  <SearchBar 
    filterText={filterText} 
    inStockOnly={inStockOnly} />
  <ProductTable 
    products={products}
    filterText={filterText}
    inStockOnly={inStockOnly} />
</div>
```

Anda dapat mulai melihat bagaimana aplikasi Anda akan berperilaku. Edit nilai awal `filterText` dari `useState('')` menjadi `useState('fruit')` pada kode *sandbox* di bawah ini. Anda akan melihat teks input pencarian dan tabel diperbarui:

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} />
      <ProductTable 
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding-top: 5px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Perhatikan bahwa pengeditan formulir belum berhasil. Ada galat di konsol di *sandbox* di atas yang menjelaskan alasannya:

<ConsoleBlock level="error">

You provided a \`value\` prop to a form field without an \`onChange\` handler. This will render a read-only field.

</ConsoleBlock>

Pada *sandbox* di atas, `ProductTable` dan `SearchBar` membaca props `filterText` dan `inStockOnly` untuk me-*render* tabel, input, dan kotak centang. Sebagai contoh, berikut ini cara `SearchBar` mengisi nilai input:

```js {1,6}
function SearchBar({ filterText, inStockOnly }) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} 
        placeholder="Search..."/>
```

Namun, Anda belum menambahkan kode apa pun untuk merespons tindakan pengguna seperti mengetik. Ini akan menjadi langkah terakhir Anda.


## Langkah 5: Tambahkan aliran data sebaliknya {/*step-5-add-inverse-data-flow*/}

Saat ini aplikasi Anda di-*render* dengan benar dengan props dan state yang mengalir ke bawah hirarki. Namun untuk mengubah state sesuai dengan masukan pengguna, Anda perlu mendukung pengaliran data ke arah sebaliknya: komponen form yang berada jauh di dalam hirarki perlu memperbarui state di `FilterableProductTable`.

React membuat aliran data ini menjadi eksplisit, tetapi membutuhkan pengetikan yang lebih banyak dibandingkan dengan pengikatan data dua arah. Jika Anda mencoba mengetik atau mencentang kotak pada contoh di atas, Anda akan melihat bahwa React mengabaikan masukan Anda. Hal ini memang disengaja. Dengan menulis `<input value={filterText} />`, Anda telah mengatur prop `value` dari `input` untuk selalu sama dengan state `filterText` yang dioperkan dari `FilterableProductTable`. Karena state `filterText` tidak pernah disetel, input tidak pernah berubah.

Anda ingin membuatnya agar setiap kali pengguna mengubah input form, state diperbarui untuk mencerminkan perubahan tersebut. State dimiliki oleh `FilterableProductTable`, sehingga hanya state tersebut yang dapat memanggil `setFilterText` dan `setInStockOnly`. Untuk memungkinkan `SearchBar` memperbarui state `FilterableProductTable`, Anda harus mengoper fungsi-fungsi ini ke `SearchBar`:

```js {2,3,10,11}
function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly} />
```

Di dalam `SearchBar`, Anda akan menambahkan *event handler* `onChange` dan mengatur state induk darinya:

```js {5}
<input 
  type="text" 
  value={filterText} 
  placeholder="Search..." 
  onChange={(e) => onFilterTextChange(e.target.value)} />
```

Sekarang aplikasi sepenuhnya berfungsi!

<Sandpack>

```jsx App.js
import { useState } from 'react';

function FilterableProductTable({ products }) {
  const [filterText, setFilterText] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);

  return (
    <div>
      <SearchBar 
        filterText={filterText} 
        inStockOnly={inStockOnly} 
        onFilterTextChange={setFilterText} 
        onInStockOnlyChange={setInStockOnly} />
      <ProductTable 
        products={products} 
        filterText={filterText}
        inStockOnly={inStockOnly} />
    </div>
  );
}

function ProductCategoryRow({ category }) {
  return (
    <tr>
      <th colSpan="2">
        {category}
      </th>
    </tr>
  );
}

function ProductRow({ product }) {
  const name = product.stocked ? product.name :
    <span style={{ color: 'red' }}>
      {product.name}
    </span>;

  return (
    <tr>
      <td>{name}</td>
      <td>{product.price}</td>
    </tr>
  );
}

function ProductTable({ products, filterText, inStockOnly }) {
  const rows = [];
  let lastCategory = null;

  products.forEach((product) => {
    if (
      product.name.toLowerCase().indexOf(
        filterText.toLowerCase()
      ) === -1
    ) {
      return;
    }
    if (inStockOnly && !product.stocked) {
      return;
    }
    if (product.category !== lastCategory) {
      rows.push(
        <ProductCategoryRow
          category={product.category}
          key={product.category} />
      );
    }
    rows.push(
      <ProductRow
        product={product}
        key={product.name} />
    );
    lastCategory = product.category;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

function SearchBar({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange
}) {
  return (
    <form>
      <input 
        type="text" 
        value={filterText} placeholder="Search..." 
        onChange={(e) => onFilterTextChange(e.target.value)} />
      <label>
        <input 
          type="checkbox" 
          checked={inStockOnly} 
          onChange={(e) => onInStockOnlyChange(e.target.checked)} />
        {' '}
        Only show products in stock
      </label>
    </form>
  );
}

const PRODUCTS = [
  {category: "Fruits", price: "$1", stocked: true, name: "Apple"},
  {category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit"},
  {category: "Fruits", price: "$2", stocked: false, name: "Passionfruit"},
  {category: "Vegetables", price: "$2", stocked: true, name: "Spinach"},
  {category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin"},
  {category: "Vegetables", price: "$1", stocked: true, name: "Peas"}
];

export default function App() {
  return <FilterableProductTable products={PRODUCTS} />;
}
```

```css
body {
  padding: 5px
}
label {
  display: block;
  margin-top: 5px;
  margin-bottom: 5px;
}
th {
  padding: 4px;
}
td {
  padding: 2px;
}
```

</Sandpack>

Anda dapat mempelajari semua tentang menangani *event* dan memperbarui state di bagian [Menambahkan Interaktivitas](/learn/adding-interactivity).

## Ke mana setelah ini {/*where-to-go-from-here*/}

Ini adalah pengenalan yang sangat singkat tentang bagaimana cara berpikir saat membangun komponen dan aplikasi dengan React. Anda dapat [memulai proyek React](/learn/installation) sekarang juga atau [mempelajari lebih dalam tentang semua sintaks](/learn/describing-the-ui) yang digunakan dalam tutorial ini.
