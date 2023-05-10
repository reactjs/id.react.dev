---
title: createRef
---

<Pitfall>

`createRef` kebanyakan digunakan untuk [komponen kelas.](/reference/react/Component) Sedangkan komponen fungsi biasanya mengandalkan [`useRef`](/reference/react/useRef).

</Pitfall>

<Intro>

`createRef` membuat sebuah objek [*ref*](/learn/referencing-values-with-refs) yang menyimpan nilai apapun.

```js
class MyInput extends Component {
  inputRef = createRef();
  // ...
}
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createRef()` {/*createref*/}

Panggil `createRef` untuk mendeklarasikan sebuah [*ref*](/learn/referencing-values-with-refs) di dalam sebuah [komponen kelas.](/reference/react/Component)

```js
import { createRef, Component } from 'react';

class MyComponent extends Component {
  intervalRef = createRef();
  inputRef = createRef();
  // ...
```

[Lihat contoh lebih banyak di bawah.](#usage)

#### Parameter {/*parameters*/}

`createRef` tidak memerlukan parameter.

#### Kembalian {/*returns*/}

`createRef` mengembalikan sebuah objek dengan properti tunggal:

* `current`: Awalnya, bernilai `null`. Anda dapat menggantinya dengan nilai lain kemudian. Jika Anda mengoper objek *ref* ke React sebagai sebuah atribut `ref` di dalam simpul JSX, React akan menetapkannya sebagai properti `current`.

#### Caveats {/*caveats*/}

* `createRef` selalu mengembalikan objek yang berbeda. Sama halnya dengan menulis `{ current: null }` manual.
* Dalam komponen fungsional, Anda mungkin menginginkan [`useRef`](/reference/react/useRef) yang selalu mengembalikan obyek yang sama.
* `const ref = useRef()` sama dengan `const [ref, _] = useState(() => createRef(null))`.

---

## Penggunaan {/*usage*/}

### Mendeklarasikan sebuah ref di dalam komponen kelas {/*declaring-a-ref-in-a-class-component*/}

Untuk mendeklarasikan *ref* di dalam sebuah [komponen kelas,](/reference/react/Component) panggil `createRef` dan tetapkan hasilnya ke anggota (*field*) kelas:

```js {4}
import { Component, createRef } from 'react';

class Form extends Component {
  inputRef = createRef();

  // ...
}
```

Jika Anda mengoper `ref={this.inputRef}` ke sebuah `<input>` di dalam JSX Anda, React akan menempatkan input simpul DOM ke `this.inputRef.current`. Ini Contohnya bagaimana Anda membuat tombol yang memfokuskan ke input:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

<Pitfall>

`createRef` kebanyakan digunakan untuk [komponen kelas.](/reference/react/Component) sedangkan komponen fungsional biasanya mengandalkan [`useRef`](/reference/react/useRef).

</Pitfall>

---

## Alternatif {/*alternatives*/}

### Migrasi dari kelas dengan `createRef` ke fungsi dengan `useRef` {/*migrating-from-a-class-with-createref-to-a-function-with-useref*/}

Kami merekomendasikan untuk menggunakan komponen fungsi dari pada [komponen kelas](/reference/react/Component) pada kode baru. Jika Anda memiliki komponen kelas yang menggunakan `createRef`, ini cara bagaimana mengubahnya. Ini merupakan kode awal:

<Sandpack>

```js
import { Component, createRef } from 'react';

export default class Form extends Component {
  inputRef = createRef();

  handleClick = () => {
    this.inputRef.current.focus();
  }

  render() {
    return (
      <>
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>
          Focus the input
        </button>
      </>
    );
  }
}
```

</Sandpack>

Saat Anda [mengubah komponen ini dari kelas ke fungsi,](/reference/react/Component#alternatives) ganti pemanggilan `createRef` dengan [`useRef`:](/reference/react/useRef)

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>
