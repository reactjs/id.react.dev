---
title: cloneElement
---

<Pitfall>

Menggunakan `cloneElement` adalah hal yang jarang terjadi dan dapat menyebabkan kode yang rentan. [Lihat alternatif yang umum.](#alternatives)

</Pitfall>

<Intro>

`cloneElement` memungkinkan anda untuk membuat elemen React baru dengan menggunakan elemen lain sebagai titik awal.

```js
const clonedElement = cloneElement(element, props, ...children)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `cloneElement(element, props, ...children)` {/*cloneelement*/}

Panggil `cloneElement` untuk membuat elemen React berdasarkan `element`, tetapi dengan `props` dan `children` yang berbeda:

```js
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage">
    Hello
  </Row>,
  { isHighlighted: true },
  'Goodbye'
);

console.log(clonedElement); // <Row title="Cabbage">Goodbye</Row>
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `element`: Argumen `element` harus merupakan elemen React yang valid. Misalnya, dapat berupa simpul JSX seperti `<Something />`, hasil dari pemanggilan [`createElement`](/reference/react/createElement), atau hasil dari pemanggilan `cloneElement` lainnya.

* `props`: Argumen `props` harus berupa objek atau `null`. Jika anda mengoper `null`, elemen yang di-kloning akan mempertahankan semua  `element.props` yang orisinal. Sebaliknya, untuk setiap *prop* di objek `props`, elemen yang dikembalikan akan "memilih" nilai dari `props` daripada nilai dari `element.props`. Sisa *props* lainnya akan diisi dari `element.props` yang orisinal. Jika anda mengoper `props.key` atau `props.ref`, mereka akan menggantikan yang orisinal.

* **opsional** `...children`: Nol atau lebih simpul anak. Bisa dari simpul React apa pun, termasuk elemen React, *string*, dan *number*. [*portal*](/reference/react-dom/createPortal), simpul kosong (`null`, `undefined`, `true`, dan `false`), dan senarai dari simpul-simpul React. Jika anda tidak mengoper argumen `...children` apa pun, `element.props.children` yang orisinal akan tetap dipertahankan.

#### Kembalian {/*returns*/}

`cloneElement` mengembalikan objek elemen React dengan beberapa properti:

* `type`: Sama seperti `element.type`.
* `props`: Hasil dari penggabungan dangkal antara `element.props` dengan `props` yang anda oper untuk menimpanya.
* `ref`: `element.ref` yang orisinal, kecuali telah ditimpa oleh `props.ref`.
* `key`: `element.key`, yang orisinal, kecuali telah ditimpa oleh `props.key`.

Biasanya, anda akan mengembalikan elemen dari sebuah komponen atau membuatnya sebagai anak dari elemen lain. Meskipun anda mungkin membaca properti elemen tersebut, sebaiknya anda memperlakukan setiap elemen sebagai objek tersembunyi setelah dibuat, dan hanya me-*render*-nya.

#### Catatan penting {/*caveats*/}

* Mengkloning sebuah elemen **tidak mengubah elemen yang orisinal**.

* Sebaiknya anda hanya **mengoper *children* sebagai beberapa argumen ke `cloneElement` jika semuanya diketahui secara statis,** seperti `cloneElement(element, null, child1, child2, child3)`. Jika *children* anda dinamis, oper seluruh senarai sebagai argumen ketiga: `cloneElement(element, null, listItems)`. Ini memastikan bahwa React akan [memperingatkan anda tentang `key` yang hilang](/learn/rendering-lists#keeping-list-items-in-order-with-key) untuk setiap *list* dinamis. Untuk *list* statis hal tersebut tidak diperlukan karena tidak pernah diurutkan ulang.

* `cloneElement` membuat pelacakan aliran data lebih sulit, jadi **cobalah beberapa [alternatif](#alternatives) sebagai gantinya.**

---

## Penggunaan {/*usage*/}

### Menimpa props dari suatu elemen {/*overriding-props-of-an-element*/}

Untuk menimpa *prop* dari beberapa <CodeStep step={1}>elemen React</CodeStep>, oper ke `cloneElement` dengan <CodeStep step={2}>*props* yang ingin anda timpa</CodeStep>:

```js [[1, 5, "<Row title=\\"Cabbage\\" />"], [2, 6, "{ isHighlighted: true }"], [3, 4, "clonedElement"]]
import { cloneElement } from 'react';

// ...
const clonedElement = cloneElement(
  <Row title="Cabbage" />,
  { isHighlighted: true }
);
```

Hasil dari <CodeStep step={3}>elemen yang dikloning</CodeStep> akan menjadi `<Row title="Cabbage" isHighlighted={true} />`.

**Mari telusuri contoh untuk melihat kapan hal tersebut berguna.**

Bayangkan komponen `List` yang me-*render* [`children`](/learn/passing-props-to-a-component#passing-jsx-as-children)nya sebagai daftar baris yang dapat dipilih dengan tombol "Next" yang dapat merubah baris mana yang dipilih. Komponen `List` perlu me-*render* `Row` yang dipilih secara terpisah, lalu mengkloning setiap anak `<Row>` yang telah diterima, dan menambahkan *prop* `isHighlighted: true` atau `isHighlighted: false`:

```js {6-8}
export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
```

Katakanlah JSX asli yang diterima oleh `List` terlihat seperti ini:

```js {2-4}
<List>
  <Row title="Cabbage" />
  <Row title="Garlic" />
  <Row title="Apple" />
</List>
```

Dengan mengkloning anaknya, `List` dapat meneruskan informasi tambahan ke setiap `Row` di dalamnya. Hasilnya terlihat seperti ini:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Perhatikan saat menekan "Next" akan memperbarui *state* dari `List`, dan menyorot baris yang berbeda:

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List>
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title} 
        />
      )}
    </List>
  );
}
```

```js List.js active
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Ringkasnya, `List` mengkloning elemen `<Row />` yang diterimanya dan menambahkan *prop* tambahan ke dalamnya.

<Pitfall>

Mengkloning *children* mempersulit untuk mengetahui bagaimana aliran data di aplikasi anda. Coba salah satu [alternatif.](#alternatives)

</Pitfall>

---

## Alternatif {/*alternatives*/}

### Mengoper data dengan render prop {/*passing-data-with-a-render-prop*/}

Daripada menggunakan `cloneElement`, pertimbangkan untuk menerima *render prop* seperti `renderItem`. Di sini, `List` menerima `renderItem` sebagai *prop*. `List` memanggil `renderItem` untuk setiap item dan mengoper `isHighlighted` sebagai argumen:

```js {1,7}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
```

*Prop* `renderItem` disebut "render prop" karena merupakan *prop* yang menentukan cara me-*render* sesuatu. Misalnya, anda dapat mengoper `renderItem` yang me-*render* `<Row>` dengan nilai `isHighlighted` yang diberikan:

```js {3,7}
<List
  items={products}
  renderItem={(product, isHighlighted) =>
    <Row
      key={product.id}
      title={product.title}
      isHighlighted={isHighlighted}
    />
  }
/>
```

Hasil akhirnya sama dengan `cloneElement`:

```js {4,8,12}
<List>
  <Row
    title="Cabbage"
    isHighlighted={true} 
  />
  <Row
    title="Garlic"
    isHighlighted={false} 
  />
  <Row
    title="Apple"
    isHighlighted={false} 
  />
</List>
```

Namun, anda dapat dengan mudah melacak dari mana nilai `isHighlighted` berasal.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product, isHighlighted) =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={isHighlighted}
        />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return renderItem(item, isHighlighted);
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Pola ini lebih anjurkan daripada `cloneElement` karena lebih eksplisit.

---

### Mengoper data melalui context {/*passing-data-through-context*/}

Alternatif lain untuk `cloneElement` adalah [mengoper data melalui *context*.](/learn/passing-data-deeply-with-context)

Sebagai contoh, anda dapat memanggil [`createContext`](/reference/react/createContext) untuk mendefinisikan `HighlightContext`:

```js
export const HighlightContext = createContext(false);
```

Komponen `List` dapat menggabungkan setiap item yang di-*render* ke dalam *provider* `HighlightContext`:

```js {8,10}
export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider key={item.id} value={isHighlighted}>
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
```

Dengan pendekatan ini, `Row` tidak perlu menerima *prop* `isHighlighted` sama sekali. Sebaliknya, dengan membaca *context*-nya:

```js Row.js {2}
export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  // ...
```

Hal ini memungkinkan komponen pemanggil untuk tidak mengetahui atau peduli tentang pengoperan `isHighlighted` ke `<Row>`:

```js {4}
<List
  items={products}
  renderItem={product =>
    <Row title={product.title} />
  }
/>
```

Sebagai gantinya, `List` dan `Row` mengoordinasikan logika penyorotan melalui *context*.

<Sandpack>

```js
import List from './List.js';
import Row from './Row.js';
import { products } from './data.js';

export default function App() {
  return (
    <List
      items={products}
      renderItem={(product) =>
        <Row title={product.title} />
      }
    />
  );
}
```

```js List.js active
import { useState } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function List({ items, renderItem }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {items.map((item, index) => {
        const isHighlighted = index === selectedIndex;
        return (
          <HighlightContext.Provider
            key={item.id}
            value={isHighlighted}
          >
            {renderItem(item)}
          </HighlightContext.Provider>
        );
      })}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % items.length
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

```js Row.js
import { useContext } from 'react';
import { HighlightContext } from './HighlightContext.js';

export default function Row({ title }) {
  const isHighlighted = useContext(HighlightContext);
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js HighlightContext.js
import { createContext } from 'react';

export const HighlightContext = createContext(false);
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

[Pelajari lebih lanjut tentang mengoper data melalui *context*.](/reference/react/useContext#passing-data-deeply-into-the-tree)

---

### Mengekstraksi logika ke dalam Hook kustom {/*extracting-logic-into-a-custom-hook*/}

Pendekatan lain yang dapat anda coba adalah mengekstrak logika "non-visual" ke dalam Hook anda sendiri, dan menggunakan informasi yang dikembalikan oleh Hook anda untuk memutuskan apa yang akan di-*render*. Misalnya, anda dapat menulis Hook kustom `useList` seperti ini:

```js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

Lalu anda dapat menggunakannya seperti ini:

```js {2,9,13}
export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

Aliran datanya eksplisit, tetapi *state* ada di dalam Hook kustom `useList` yang dapat anda gunakan dari komponen apa pun:

<Sandpack>

```js
import Row from './Row.js';
import useList from './useList.js';
import { products } from './data.js';

export default function App() {
  const [selected, onNext] = useList(products);
  return (
    <div className="List">
      {products.map(product =>
        <Row
          key={product.id}
          title={product.title}
          isHighlighted={selected === product}
        />
      )}
      <hr />
      <button onClick={onNext}>
        Next
      </button>
    </div>
  );
}
```

```js useList.js
import { useState } from 'react';

export default function useList(items) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  function onNext() {
    setSelectedIndex(i =>
      (i + 1) % items.length
    );
  }

  const selected = items[selectedIndex];
  return [selected, onNext];
}
```

```js Row.js
export default function Row({ title, isHighlighted }) {
  return (
    <div className={[
      'Row',
      isHighlighted ? 'RowHighlighted' : ''
    ].join(' ')}>
      {title}
    </div>
  );
}
```

```js data.js
export const products = [
  { title: 'Cabbage', id: 1 },
  { title: 'Garlic', id: 2 },
  { title: 'Apple', id: 3 },
];
```

```css
.List {
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

.RowHighlighted {
  background: #ffa;
}

button {
  height: 40px;
  font-size: 20px;
}
```

</Sandpack>

Pendekatan ini sangat berguna jika anda ingin menggunakan kembali logika ini di komponen yang berbeda.