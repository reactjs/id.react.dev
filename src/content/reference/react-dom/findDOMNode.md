---
title: findDOMNode
---

<Deprecated>

API ini akan dihapus pada versi mayor React yang akan datang. [Lihat alternatif lainnya.](#alternatives)

</Deprecated>

<Intro>

`findDOMNode` mencari simpul DOM peramban untuk *instance* dari [komponen kelas](/reference/react/Component) React

```js
const domNode = findDOMNode(componentInstance)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `findDOMNode(componentInstance)` {/*finddomnode*/}

Panggil `findDOMNode` untuk mencari simpul DOM peramban pada *instance* dari [komponen kelas](/reference/react/Component) React yang diberikan.

```js
import { findDOMNode } from 'react-dom';

const domNode = findDOMNode(componentInstance);
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

`componentInstance`: *Instance* dari subkelas [`Component`](/reference/react/Component). Misalnya, `this` di dalam komponen kelas.

#### Kembalian {/*returns*/}

`findDOMNode` mengembalikan simpul DOM peramban pertama yang terdekat dalam `componentInstance` yang diberikan. Ketika komponen di-*render* menjadi `null`, atau di-*render* menjadi `false`, `findDOMNode` mengembalikan `null`. Ketika komponen di-*render* menjadi string, `findDOMNode` mengembalikan simpul DOM teks yang berisi nilai tersebut.

#### Catatan Penting {/*caveats*/}

* Sebuah komponen dapat mengembalikan senarai atau [Fragment](/reference/react/Fragment) dengan beberapa anak. Dalam hal ini `findDOMNode`, akan mengembalikan simpul DOM yang berhubungan dengan anak pertama yang tidak kosong.

* `findDOMNode` hanya bekerja pada komponen yang sudah terpasang (yaitu komponen yang sudah ditempatkan di DOM). Jika Anda mencoba memanggil ini pada komponen yang belum terpasang (seperti memanggil `findDOMNode()` dalam `render()` pada komponen yang belum dibuat), sebuah *exception* akan dilemparkan.

* `findDOMNode` hanya mengembalikan hasil pada saat pemanggilan. Jika komponen anak me-*render* simpul yang nantinya berbeda, tidak ada cara untuk memberitahu Anda tentang perubahan ini.

* `findDOMNode` menerima instance komponen kelas, sehingga tidak dapat digunakan dengan komponen fungsi.

---

## Penggunaan {/*usage*/}

### Menemukan simpul DOM akar dari komponen kelas {/*finding-the-root-dom-node-of-a-class-component*/}

Panggil `findDOMNode` dengan sebuah *instance* dari [komponen kelas](/reference/react/Component) (biasanya, `this`) untuk menemukan simpul DOM yang telah di-*render*.

```js {3}
class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}
```

Di sini, variabel `input` akan disetel ke elemen DOM `<input>`. Hal ini memungkinkan Anda melakukan sesuatu dengannya. Sebagai contoh, ketika mengklik "Tampilkan contoh" di bawah ini untuk memasang *input*, [`input.select()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select) akan memilih semua teks di dalam *input*:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }

  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

---

## Alternatif {/*alternatives*/}

### Membaca simpul DOM komponen itu sendiri dari sebuah ref {/*reading-components-own-dom-node-from-a-ref*/}

Kode yang menggunakan `findDOMNode` mudah rusak karena hubungan antara simpul JSX dengan kode yang memanipulasi simpul DOM tersebut tidak eksplisit. Sebagai contoh, cobalah bungkus `<input />` dengan `<div>`:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <input defaultValue="Hello" />
  }
}

export default AutoselectingInput;
```

</Sandpack>

Hal ini akan merusak kode karena sekarang, `findDOMNode(this)` menemukan simpul DOM `<div>`, tetapi kode mengharapkan simpul DOM `<input>`. Untuk menghindari masalah seperti ini, gunakan [`createRef`](/reference/react/createRef) untuk mengelola simpul DOM tertentu.

Pada contoh ini, `findDOMNode` tidak lagi digunakan. Sebagai gantinya, `inputRef = createRef(null)` didefinisikan sebagai sebuah field instance pada kelas. Untuk membaca simpul DOM darinya, Anda bisa menggunakan `this.inputRef.current`. Untuk melampirkannya ke JSX, Anda me-*render* `<input ref = {this.inputRef} />`. Ini menghubungkan kode yang menggunakan simpul DOM ke JSX:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <input ref={this.inputRef} defaultValue="Hello" />
    );
  }
}

export default AutoselectingInput;
```

</Sandpack>

Pada React modern tanpa komponen kelas, kode yang setara akan memanggil [`useRef`](/reference/react/useRef) sebagai gantinya:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <input ref={inputRef} defaultValue="Hello" />
}
```

</Sandpack>

[Baca lebih lanjut tentang memanipulasi DOM dengan *refs*.](/learn/manipulating-the-dom-with-refs)

---

### Membaca simpul DOM komponen anak dari ref yang diteruskan {/*reading-a-child-components-dom-node-from-a-forwarded-ref*/}

Pada contoh ini, `findDOMNode(this)` menemukan simpul DOM yang dimiliki oleh komponen lain. `AutoselectingInput` me-*render* `MyInput`, yang merupakan komponen Anda sendiri yang me-*render* `<input>` pada browser.

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  componentDidMount() {
    const input = findDOMNode(this);
    input.select()
  }
  render() {
    return <MyInput />;
  }
}

export default AutoselectingInput;
```

```js MyInput.js
export default function MyInput() {
  return <input defaultValue="Hello" />;
}
```

</Sandpack>

Perhatikan bahwa memanggil `findDOMNode(this)` di dalam `AutoselectingInput` masih memberikan Anda DOM `<input>`, meskipun JSX untuk `<input>` ini disembunyikan di dalam komponen `MyInput`. Hal ini tampak mudah untuk contoh di atas, tetapi hal ini akan membuat kode tersebut mudah rusak. Bayangkan Anda ingin mengubah `MyInput` nanti dan membungkusnya dengan `<div>`. Hal ini akan merusak kode `AutoselectingInput` (yang memiliki ekspektasi untuk mendapatkan simpul `<input>`).

Untuk mengganti `findDOMNode` dalam contoh ini, kedua komponen harus berkoordinasi:

1. `AutoSelectingInput` harus mendeklarasikan sebuah ref, seperti [pada contoh sebelumnya](#membaca-komponen-memiliki-simpul-dom-dari-ref), lalu mengopernya ke `<MyInput>`.
2. `MyInput` harus dideklarasikan dengan [`forwardRef`](/reference/react/forwardRef) untuk mengambil ref tersebut dan meneruskannya ke simpul `<input>`.

Contoh di bawah ini melakukan hal tersebut, sehingga tidak lagi membutuhkan `findDOMNode`:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { createRef, Component } from 'react';
import MyInput from './MyInput.js';

class AutoselectingInput extends Component {
  inputRef = createRef(null);

  componentDidMount() {
    const input = this.inputRef.current;
    input.select()
  }

  render() {
    return (
      <MyInput ref={this.inputRef} />
    );
  }
}

export default AutoselectingInput;
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

Berikut ini adalah contoh kode jika kode tersebut menggunakan komponen fungsi, bukan komponen kelas:

<Sandpack>

```js App.js
import { useState } from 'react';
import AutoselectingInput from './AutoselectingInput.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Tampilkan contoh
      </button>
      <hr />
      {show && <AutoselectingInput />}
    </>
  );
}
```

```js AutoselectingInput.js active
import { useRef, useEffect } from 'react';
import MyInput from './MyInput.js';

export default function AutoselectingInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    input.select();
  }, []);

  return <MyInput ref={inputRef} defaultValue="Hello" />
}
```

```js MyInput.js
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  return <input ref={ref} defaultValue="Hello" />;
});

export default MyInput;
```

</Sandpack>

---

### Menambahkan elemen pembungkus `<div>` {/*adding-a-wrapper-div-element*/}

Terkadang sebuah komponen perlu mengetahui posisi dan ukuran anak-anaknya. Hal ini membuat Anda tertarik untuk mencari anaknya dengan `findDOMNode(this)`, kemudian menggunakan metode DOM seperti [`getBoundingClientRect`](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) untuk mendapatkan informasi ukuran.

Saat ini tidak ada solusi langsung untuk kasus penggunaan ini, itulah mengapa `findDOMNode` sudah di-*deprecate* tetapi belum dihapus sepenuhnya dari React. Untuk sementara ini, Anda dapat mencoba me-*render* simpul pembungkus `<div>` di sekitar konten sebagai solusi, dan mendapatkan ref ke simpul tersebut. Namun perlu diketahui bahwa pembungkus tambahan dapat merusak *styling*.

```js
<div ref={someRef}>
  {children}
</div>
```

Hal ini juga berlaku untuk pemfokusan dan *scrolling* ke sembarang anak.