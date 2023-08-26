---
title: Children
---

<Pitfall>

Menggunakan `Children` tidaklah umum dan dapat menyebabkan kode yang mudah rusak. [Lihat alternatif umum.](#alternatives)

</Pitfall>

<Intro>

`Children` memungkinkan Anda memanipulasi dan mengubah JSX yang Anda terima sebagai [*prop* `children`.](/learn/passing-props-to-a-component#passing-jsx-as-children)

```js
const mappedChildren = Children.map(children, child =>
  <div className="Row">
    {child}
  </div>
);

```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `Children.count(children)` {/*children-count*/}

Panggil `Children.count(children)` untuk menghitung jumlah anak dalam struktur data `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <>
      <h1>Jumlah baris: {Children.count(children)}</h1>
      ...
    </>
  );
}
```

[Lihat contoh lainnya di bawah ini.](#counting-children)

#### Parameter {/*children-count-parameters*/}

* `children`: Nilai dari [*prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) yang diterima oleh komponen Anda.

#### Kembalian {/*children-count-returns*/}

Jumlah simpul dalam `children` ini.

#### Catatan Penting {/*children-count-caveats*/}

- Simpul kosong (`null`, `undefined`, dan *Boolean*), *string*, angka, dan [elemen React](/reference/react/createElement) dihitung sebagai simpul individu. Larik tidak dihitung sebagai simpul individu, tetapi anak-anaknya dihitung sebagai simpul individu. **Penjelajahan tidak masuk lebih dalam dari elemen React:** mereka tidak di-*render*, dan anak-anaknya tidak dijelajahi. [Fragmen](/reference/react/Fragment) tidak dijelajahi.

---

### `Children.forEach(children, fn, thisArg?)` {/*children-foreach*/}

Panggil `Children.forEach(children, fn, thisArg?)` untuk menjalankan beberapa kode untuk setiap anak dalam struktur data `children`.

```js RowList.js active
import { Children } from 'react';

function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  // ...
```

[Lihat contoh lainnya di bawah ini.](#running-some-code-for-each-child)

#### Parameter {/*children-foreach-parameters*/}

* `children`: Nilai dari [*prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) yang diterima oleh komponen Anda.
* `fn`: Fungsi yang ingin Anda jalankan untuk setiap anak, serupa dengan metode *callback* dari [larik `forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach). Fungsi ini akan dipanggil dengan anak sebagai argumen pertama dan indeksnya sebagai argumen kedua. Indeks dimulai dari `0` dan bertambah pada setiap pemanggilan.
* **opsional** `thisArg`: Nilai [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) yang digunakan untuk memanggil fungsi `fn`. Jika diabaikan, maka akan menjadi `undefined`.

#### Kembalian {/*children-foreach-returns*/}

`Children.forEach` mengembalikan `undefined`.

#### Catatan Penting {/*children-foreach-caveats*/}

- Simpul kosong (`null`, `undefined`, dan *Boolean*), *string*, angka, dan [elemen React](/reference/react/createElement) dihitung sebagai simpul individual. Larik tidak dihitung sebagai simpul individu, tetapi anak-anaknya dihitung sebagai simpul individu. **Penjelajahan tidak masuk lebih dalam dari elemen React:** mereka tidak di-*render*, dan anak-anaknya tidak dijelajahi. [Fragmen](/reference/react/Fragment) tidak dijelajahi.

---

### `Children.map(children, fn, thisArg?)` {/*children-map*/}

Panggil `Children.map(children, fn, thisArg?)` untuk memetakan atau mentransformasi setiap anak dalam struktur data `children`.

```js RowList.js active
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

[Lihat contoh lainnya di bawah ini.](#transforming-children)

#### Parameter {/*children-map-parameters*/}

* `children`: Nilai dari [*prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) yang diterima oleh komponen Anda.
* `fn`: Fungsi pemetaan, mirip dengan metode *callback* dari [larik `map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map). Fungsi ini akan dipanggil dengan anak sebagai argumen pertama dan indeksnya sebagai argumen kedua. Indeks dimulai dari `0` dan bertambah pada setiap pemanggilan. Anda harus mengembalikan sebuah simpul React dari fungsi ini. Node ini dapat berupa node kosong (`null`, `undefined`, atau *Boolean*), *string*, angka, elemen React, atau larik simpul React lainnya.
* **opsional** `thisArg`: Nilai [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this) yang digunakan untuk memanggil fungsi `fn`. Jika diabaikan, maka akan menjadi `undefined`.

#### Kembalian {/*children-map-returns*/}

Jika `children` adalah `null` atau `undefined`, akan mengembalikan nilai yang sama.

Jika tidak, kembalikan larik *flat* yang terdiri dari simpul yang Anda kembalikan dari fungsi `fn`. Larik yang dikembalikan akan berisi semua simpul yang Anda kembalikan kecuali `null` dan `undefined`.

#### Catatan Penting {/*children-map-caveats*/}

- Simpul kosong (`null`, `undefined`, dan *Boolean*), *string*, angka, dan [elemen React](/reference/react/createElement) dihitung sebagai simpul individual. Larik tidak dihitung sebagai simpul individu, tetapi anak-anaknya dihitung sebagai simpul individu. **Penjelajahan tidak masuk lebih dalam dari elemen React:** mereka tidak di-*render*, dan anak-anaknya tidak dijelajahi. [Fragmen](/reference/react/Fragment) tidak dijelajahi.

- Jika Anda mengembalikan sebuah elemen atau larik elemen dengan kunci dari `fn`, **kunci elemen yang dikembalikan akan secara otomatis digabungkan dengan kunci item asli yang sesuai dari `children`.** Jika Anda mengembalikan beberapa elemen dari `fn` dalam sebuah larik, kuncinya hanya perlu unik secara lokal satu sama lain.

---

### `Children.only(children)` {/*children-only*/}


Panggil `Children.only(children)` untuk menyatakan bahwa `children` merepresentasikan satu elemen React.

```js
function Box({ children }) {
  const element = Children.only(children);
  // ...
```

#### Parameter {/*children-only-parameters*/}

* `children`: Nilai dari [*prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) yang diterima oleh komponen Anda.

#### Kembalian {/*children-only-returns*/}

Jika `children` [adalah elemen yang valid,](/reference/react/isValidElement) kembalikan elemen tersebut.

Jika tidak, akan lemparkan sebuah *error*.

#### Catatan Penting {/*children-only-caveats*/}

- Metode ini selalu **melempar jika Anda mengoper sebuah array (seperti nilai kembalian dari `Children.map`) sebagai `children`.** Dengan kata lain, metode ini memaksakan bahwa `children` adalah sebuah elemen React, bukan sebuah array dengan satu elemen.

---

### `Children.toArray(children)` {/*children-toarray*/}

Panggil `Children.toArray(children)` untuk membuat larik dari struktur data `children`.

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  // ...
```

#### Parameter {/*children-toarray-parameters*/}

* `children`: Nilai dari [*prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) yang diterima oleh komponen Anda.

#### Kembalian {/*children-toarray-returns*/}

Mengembalikan larik yang *flat* dari elemen dalam `children`.

#### Catatan Penting {/*children-toarray-caveats*/}

- Simpul kosong (`null`, `undefined`, dan *Boolean*) akan dihilangkan dalam larik yang dikembalikan. **Kunci elemen yang dikembalikan akan dihitung dari kunci elemen asli dan tingkat persarangan serta posisinya.** Hal ini memastikan bahwa pe-*flatten*-an larik tidak mengakibatkan perubahan perilaku.

---

## Penggunaan {/*usage*/}

### Mentransformasikan anak-anak {/*transforming-children*/}

Untuk mentransformasi anak-anak JSX yang diterima komponen Anda [sebagai *prop* `children`,](/learn/passing-props-to-a-component#passing-jsx-as-children) panggil `Children.map`:

```js {6,10}
import { Children } from 'react';

function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

Pada contoh di atas, `RowList` membungkus setiap anak yang diterimanya ke dalam wadah `<div className="Row">`. Sebagai contoh, anggaplah komponen induk meneruskan tiga tag `<p>` sebagai *props* `children` ke `RowList`:

```js
<RowList>
  <p>Ini adalah butir pertama.</p>
  <p>Ini adalah butir kedua</p>
  <p>Ini adalah butir ketiga.</p>
</RowList>
```

Kemudian, dengan implementasi `RowList` di atas, hasil akhir yang di-*render* akan terlihat seperti ini:

```js
<div className="RowList">
  <div className="Row">
    <p>Ini adalah butir pertama.</p>
  </div>
  <div className="Row">
    <p>Ini adalah butir kedua</p>
  </div>
  <div className="Row">
    <p>Ini adalah butir ketiga.</p>
  </div>
</div>
```

`Children.map` mirip dengan [mentransformasi array dengan `map()`.](/learn/rendering-lists) Perbedaannya adalah bahwa struktur data `children` dianggap sebagai *buram*. Artinya, meskipun terkadang `children` berupa array, Anda tidak boleh mengasumsikannya sebagai array atau tipe data tertentu lainnya. Inilah sebabnya mengapa Anda harus menggunakan `Children.map` jika Anda perlu melakukan transformasi.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Ini adalah butir pertama.</p>
      <p>Ini adalah butir kedua</p>
      <p>Ini adalah butir ketiga.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<DeepDive>

#### Mengapa *prop* *children* tidak selalu berupa larik? {/*why-is-the-children-prop-not-always-an-array*/}

Dalam React, *prop* `children` dianggap sebagai struktur data *buram*. Artinya, Anda tidak boleh bergantung pada cara penytrukturannya. Untuk mengubah, memfilter, atau menghitung anak, Anda harus menggunakan metode-metode `Children`.

Pada praktiknya, struktur data `children` sering kali direpresentasikan sebagai sebuah larik secara internal. Namun, jika hanya ada satu child, maka React tidak akan membuat larik tambahan karena hal ini akan menyebabkan overhead memori yang tidak diperlukan. Selama Anda menggunakan metode `Children` dan tidak secara langsung mengintrospeksi *prop* `children`, kode Anda tidak akan rusak meskipun React mengganti bagaimana struktur datanya diimplementasikan.

Bahkan saat `children` berupa sebuah larik, `Children.map` memiliki perilaku khusus yang membantu. Sebagai contoh, `Children.map` menggabungkan [beberapa *key*](/learn/rendering-lists#keeping-list-items-in-order-with-key) pada elemen yang dikembalikan dengan kunci pada `children` yang telah Anda berikan padanya. Hal ini memastikan anak JSX asli tidak "kehilangan" kunci meskipun dibungkus seperti pada contoh di atas.

</DeepDive>

<Pitfall>

Struktur data `children` **tidak termasuk output yang di-*render*** dari komponen yang Anda berikan sebagai JSX. Pada contoh di bawah ini, `children` yang diterima oleh `RowList` hanya berisi dua item, bukan tiga:

1. `<p>Ini adalah butir pertama.</p>`
2. `<MoreRows />`

Inilah alasan mengapa hanya dua pembungkus baris yang dihasilkan dalam contoh ini:

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Ini adalah butir pertama.</p>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <p>Ini adalah butir kedua</p>
      <p>Ini adalah butir ketiga.</p>
    </>
  );
}
```

```js RowList.js
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

**Tidak ada cara untuk mendapatkan keluaran yang di-*render* dari komponen dalam,** seperti `<MoreRows />` saat memanipulasi `children`. Inilah mengapa [biasanya lebih baik menggunakan salah satu solusi alternatif.](#alternatives)

</Pitfall>

---

### Menjalankan beberapa kode untuk setiap anak {/*running-some-code-for-each-child*/}

Panggil `Children.forEach` untuk mengulang setiap anak dalam struktur data `children`. Metode ini tidak mengembalikan nilai apa pun dan mirip dengan metode [larik `forEach`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) Anda dapat menggunakannya untuk menjalankan logika khusus seperti membuat larik Anda sendiri.

<Sandpack>

```js
import SeparatorList from './SeparatorList.js';

export default function App() {
  return (
    <SeparatorList>
      <p>Ini adalah butir pertama.</p>
      <p>Ini adalah butir kedua</p>
      <p>Ini adalah butir ketiga.</p>
    </SeparatorList>
  );
}
```

```js SeparatorList.js active
import { Children } from 'react';

export default function SeparatorList({ children }) {
  const result = [];
  Children.forEach(children, (child, index) => {
    result.push(child);
    result.push(<hr key={index} />);
  });
  result.pop(); // Hapus *separator* terakhir
  return result;
}
```

</Sandpack>

<Pitfall>

Seperti yang telah disebutkan sebelumnya, tidak ada cara untuk mendapatkan hasil *render* dari komponen dalam ketika memanipulasi `children`. Inilah sebabnya mengapa [biasanya lebih baik menggunakan salah satu solusi alternatif.](#alternatives)

</Pitfall>

---

### Menghitung anak-anak {/*counting-children*/}

Panggil `Children.count(children)` untuk menghitung jumlah anak.

<Sandpack>

```js
import RowList from './RowList.js';

export default function App() {
  return (
    <RowList>
      <p>Ini adalah butir pertama.</p>
      <p>Ini adalah butir kedua</p>
      <p>Ini adalah butir ketiga.</p>
    </RowList>
  );
}
```

```js RowList.js active
import { Children } from 'react';

export default function RowList({ children }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Jumlah baris: {Children.count(children)}
      </h1>
      {Children.map(children, child =>
        <div className="Row">
          {child}
        </div>
      )}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

<Pitfall>

Seperti yang telah disebutkan sebelumnya, tidak ada cara untuk mendapatkan hasil *render* dari komponen dalam ketika memanipulasi `children`. Inilah sebabnya mengapa [biasanya lebih baik menggunakan salah satu solusi alternatif.](#alternatives)

</Pitfall>

---

### Mengonversi anak menjadi larik {/*converting-children-to-an-array*/}

Panggil `Children.toArray(children)` untuk mengubah struktur data `children` menjadi larik JavaScript biasa. Hal ini memungkinkan Anda memanipulasi larik dengan metode larik bawaan seperti [`filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), [`sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort), atau [`reverse`.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)

<Sandpack>

```js
import ReversedList from './ReversedList.js';

export default function App() {
  return (
    <ReversedList>
      <p>Ini adalah butir pertama.</p>
      <p>Ini adalah butir kedua</p>
      <p>Ini adalah butir ketiga.</p>
    </ReversedList>
  );
}
```

```js ReversedList.js active
import { Children } from 'react';

export default function ReversedList({ children }) {
  const result = Children.toArray(children);
  result.reverse();
  return result;
}
```

</Sandpack>

<Pitfall>

Seperti yang telah disebutkan sebelumnya, tidak ada cara untuk mendapatkan hasil *render* dari komponen dalam ketika memanipulasi `children`. Inilah sebabnya mengapa [biasanya lebih baik menggunakan salah satu solusi alternatif.](#alternatives)

</Pitfall>

---

## Alternatif {/*alternatives*/}

<Note>

Bagian ini menjelaskan alternatif untuk API `Children` (dengan huruf kapital `C`) yang diimpor seperti berikut ini:

```js
import { Children } from 'react';
```

Jangan tertukar dengan [penggunaan *prop* `children`](/learn/passing-props-to-a-component#passing-jsx-as-children) (huruf kecil `c`), yang merupakan hal yang baik dan dianjurkan.

</Note>

### Mengekspos beberapa komponen {/*exposing-multiple-components*/}

Memanipulasi anak dengan metode `Children` sering kali menghasilkan kode yang mudah rusak. Ketika Anda mengoper *children* ke sebuah komponen di JSX, biasanya Anda tidak mengharapkan komponen tersebut untuk memanipulasi atau mengubah masing-masing *children*.

Jika memungkinkan, hindari penggunaan metode `Children`. Misalnya, jika Anda ingin setiap anak dari `RowList` dibungkus dengan `<div className="Row">`, ekspor komponen `Row`, dan secara manual membungkus setiap baris ke dalamnya seperti ini:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Ini adalah butir pertama.</p>
      </Row>
      <Row>
        <p>Ini adalah butir kedua</p>
      </Row>
      <Row>
        <p>Ini adalah butir ketiga.</p>
      </Row>
    </RowList>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Tidak seperti menggunakan `Children.map`, pendekatan ini tidak membungkus setiap anak secara otomatis. **Namun, pendekatan ini memiliki manfaat yang signifikan dibandingkan dengan [contoh sebelumnya dengan `Children.map`](#transforming-children) karena pendekatan ini tetap bekerja meskipun Anda terus mengekstrak lebih banyak komponen, sebagai contoh, pendekatan ini tetap bekerja jika Anda mengekstrak komponen `MoreRows` Anda sendiri:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList>
      <Row>
        <p>Ini adalah butir pertama.</p>
      </Row>
      <MoreRows />
    </RowList>
  );
}

function MoreRows() {
  return (
    <>
      <Row>
        <p>Ini adalah butir kedua</p>
      </Row>
      <Row>
        <p>Ini adalah butir ketiga.</p>
      </Row>
    </>
  );
}
```

```js RowList.js
export function RowList({ children }) {
  return (
    <div className="RowList">
      {children}
    </div>
  );
}

export function Row({ children }) {
  return (
    <div className="Row">
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Hal ini tidak akan bekerja dengan `Children.map` karena fungsi tersebut akan "melihat" `<MoreRows />` sebagai satu anak (dan satu baris).
---

### Menerima larik objek sebagai *prop* {/*accepting-an-array-of-objects-as-a-prop*/}

Anda juga bisa secara eksplisit mengoper larik sebagai *prop*. Sebagai contoh, `RowList` ini menerima larik `baris` sebagai *prop*:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList rows={[
      { id: 'first', content: <p>Ini adalah butir pertama.</p> },
      { id: 'second', content: <p>Ini adalah butir kedua</p> },
      { id: 'third', content: <p>Ini adalah butir ketiga.</p> }
    ]} />
  );
}
```

```js RowList.js
export function RowList({ rows }) {
  return (
    <div className="RowList">
      {rows.map(row => (
        <div className="Row" key={row.id}>
          {row.content}
        </div>
      ))}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}
```

</Sandpack>

Karena `rows` adalah larik JavaScript biasa, komponen `RowList` dapat menggunakan metode larik bawaan seperti [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) di dalamnya.

Pola ini sangat berguna ketika Anda ingin memberikan lebih banyak informasi sebagai data terstruktur bersama dengan anak. Pada contoh di bawah ini, komponen `TabSwitcher` menerima larik objek sebagai *prop* `tabs`:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher tabs={[
      {
        id: 'first',
        header: 'First',
        content: <p>Ini adalah butir pertama.</p>
      },
      {
        id: 'second',
        header: 'Second',
        content: <p>Ini adalah butir kedua</p>
      },
      {
        id: 'third',
        header: 'Third',
        content: <p>Ini adalah butir ketiga.</p>
      }
    ]} />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabs }) {
  const [selectedId, setSelectedId] = useState(tabs[0].id);
  const selectedTab = tabs.find(tab => tab.id === selectedId);
  return (
    <>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setSelectedId(tab.id)}
        >
          {tab.header}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{selectedTab.header}</h3>
        {selectedTab.content}
      </div>
    </>
  );
}
```

</Sandpack>

Tidak seperti mengoper anak-anak sebagai JSX, pendekatan ini memungkinkan Anda untuk mengasosiasikan beberapa data tambahan seperti `header` dengan setiap item. Karena Anda bekerja dengan `tabs` secara langsung, dan `tabs` adalah sebuah larik sehingga Anda tidak memerlukan metode `Children`.

---

### Memanggil *render* *prop* untuk menyesuaikan *rendering* {/*calling-a-render-prop-to-customize-rendering*/}

Daripada menghasilkan JSX untuk setiap item, Anda juga bisa mengoper fungsi yang mengembalikan JSX, dan memanggil fungsi tersebut bila diperlukan. Pada contoh ini, komponen `Aplikasi` mengoper fungsi `renderContent` ke komponen `TabSwitcher`. Komponen `TabSwitcher` memanggil `renderContent` hanya untuk tab yang dipilih:

<Sandpack>

```js
import TabSwitcher from './TabSwitcher.js';

export default function App() {
  return (
    <TabSwitcher
      tabIds={['pertama', 'kedua', 'ketiga']}
      getHeader={tabId => {
        return tabId[0].toUpperCase() + tabId.slice(1);
      }}
      renderContent={tabId => {
        return <p>Ini adalah butir {tabId}.</p>;
      }}
    />
  );
}
```

```js TabSwitcher.js
import { useState } from 'react';

export default function TabSwitcher({ tabIds, getHeader, renderContent }) {
  const [selectedId, setSelectedId] = useState(tabIds[0]);
  return (
    <>
      {tabIds.map((tabId) => (
        <button
          key={tabId}
          onClick={() => setSelectedId(tabId)}
        >
          {getHeader(tabId)}
        </button>
      ))}
      <hr />
      <div key={selectedId}>
        <h3>{getHeader(selectedId)}</h3>
        {renderContent(selectedId)}
      </div>
    </>
  );
}
```

</Sandpack>

Sebuah *prop* seperti `renderContent` disebut sebagai *render prop* karena merupakan *prop* yang menentukan bagaimana cara me-*render* sebuah bagian dari antarmuka pengguna. Namun, tidak ada yang aneh dengan *prop* ini: *prop* ini adalah *prop* biasa yang kebetulan merupakan sebuah fungsi.

*Render props* adalah fungsi, sehingga Anda dapat meneruskan informasi kepada mereka. Misalnya, komponen `RowList` ini meneruskan `id` dan `index` dari setiap baris ke *props* *render* `renderRow`, yang menggunakan `index` untuk menonjolkan baris genap:

<Sandpack>

```js
import { RowList, Row } from './RowList.js';

export default function App() {
  return (
    <RowList
      rowIds={['pertama', 'kedua', 'ketiga']}
      renderRow={(id, index) => {
        return (
          <Row isHighlighted={index % 2 === 0}>
            <p>Ini adalah butir {tabId}.</p>
          </Row> 
        );
      }}
    />
  );
}
```

```js RowList.js
import { Fragment } from 'react';

export function RowList({ rowIds, renderRow }) {
  return (
    <div className="RowList">
      <h1 className="RowListHeader">
        Jumlah baris: {rowIds.length}
      </h1>
      {rowIds.map((rowId, index) =>
        <Fragment key={rowId}>
          {renderRow(rowId, index)}
        </Fragment>
      )}
    </div>
  );
}

export function Row({ children, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {children}
    </div>
  );
}
```

```css
.RowList {
  display: flex;
  flex-direction: column;
  border: 2px solid grey;
  padding: 5px;
}

.RowListHeader {
  padding-top: 5px;
  font-size: 25px;
  font-weight: bold;
  text-align: center;
}

.Row {
  border: 2px dashed black;
  padding: 5px;
  margin: 5px;
}

.RowHighlighted {
  background: #ffa;
}
```

</Sandpack>

Demikianlah contoh lain bagaimana komponen induk dan anak dapat bekerja sama tanpa memanipulasi anak-anaknya. 

---

## Pemecahan Masalah {/*troubleshooting*/}

### Saya mengoper komponen kustom, tetapi *method* `Children` tidak menampilkan hasil *render*-nya {/*i-pass-a-custom-component-but-the-children-methods-dont-show-its-render-result*/}

Misalkan Anda mengoper dua anak ke `RowList` seperti ini:

```js
<RowList>
  <p>Butir pertama</p>
  <MoreRows />
</RowList>
```

Jika Anda melakukan `Children.count(children)` di dalam `RowList`, Anda akan mendapatkan `2`. Bahkan jika `MoreRows` me-*render* 10 item yang berbeda, atau jika mengembalikan `null`, `Children.count(children)` akan tetap menjadi `2`. Dari sudut pandang `RowList`, ia hanya "melihat" JSX yang diterimanya. Ia tidak "melihat" bagian internal komponen `MoreRows`.

Limitasi ini menyulitkan untuk mengekstrak sebuah komponen. Inilah sebabnya mengapa [alternatif](#alternatif) lebih disarankan daripada menggunakan `Children`.