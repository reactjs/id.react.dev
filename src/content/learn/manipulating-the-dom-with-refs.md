---
title: 'Memanipulasi DOM dengan Refs'
---

<Intro>

React secara otomatis memperbarui [DOM (*Document Object Model*)](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction) agar sesuai dengan keluaran *render*, sehingga komponen Anda tidak perlu sering memanipulasinya. Namun, terkadang Anda mungkin perlu mengakses elemen DOM yang dikelola oleh React--misalnya, untuk memberikan fokus pada sebuah simpul (*node*), menggulir ke sana, atau mengukur ukuran dan posisinya. Tidak ada cara bawaan untuk melakukan hal-hal tersebut di React, sehingga Anda memerlukan *ref* ke simpul DOM.

</Intro>

<YouWillLearn>

- Bagaimana cara mengakses sebuah simpul DOM yang diatur React dengan atribut `ref`
- Bagaimana atribut JSX `ref` berelasi dengan Hook `useRef`
- Bagaimana cara mengakses simpul DOM dari komponen lain
- Dalam kasus seperti apa memodifikasi DOM yang diatur React dengan aman.

</YouWillLearn>

## Mendapatkan sebuah ref untuk simpul {/*getting-a-ref-to-the-node*/}

Untuk mengakses sebuah simpul DOM yang diatur React, pertama, impor Hook `useRef`:

```js
import { useRef } from 'react';
```

Kemudian, deklarasikan *ref* di dalam komponen Anda:

```js
const myRef = useRef(null);
```

Terakhir, oper ref Anda sebagai atribut `ref` ke tag JSX yang Anda ingin dapatkan simpul DOM-nya:

```js
<div ref={myRef}>
```

Hook `useRef` mengembalikan objek dengan properti tunggal bernama `current`. Awalnya, `myRef.current` akan bernilai `null`. Saat React membuat simpul DOM untuk `<div>`, React akan mereferensikan simpul ini ke dalam `myRef.current`. Anda bisa mengakses simpul DOM ini dari [*event handlers*](/learn/responding-to-events) Anda dan menggunakan [API peramban](https://developer.mozilla.org/docs/Web/API/Element) bawaan.

```js
// Anda dapat menggunakan API peramban apa saja, sebagai contoh:
myRef.current.scrollIntoView();
```

### Contoh: Fokus ke sebuah input teks {/*example-focusing-a-text-input*/}

Pada contoh ini, meng-klik tombol tersebut akan fokus ke input:

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

Penerapannya:

1. Deklarasikan `inputRef` dengan `useRef` Hook.
2. Oper sebagai `<input ref={inputRef}>`. React akan **meletakkan `<input>` simpul DOM ke dalam `inputRef.current`.**
3. Pada fungsi `handleClick`, baca input simpul DOM dari `inputRef.current` dan panggil [`focus()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus) menggunakan `inputRef.current.focus()`.
4. Oper `handleClick` *event handler* ke `<button>` menggunakan `onClick`.

Mesikpun manipulasi DOM merupakan hal yang sangat umum untuk *ref*, Hook `useRef` dapat digunakan untuk menyimpan hal-hal lain di luar React, seperti ID *timer*. Sama halnya dengan *state*, *ref* tetap sama di antara proses *render*. *Ref* sama seperti variabel *state* yang tidak memicu banyak *render* saat Anda mengaturnya. Baca tentang *ref* pada [Mereferensikan nilai dengan *Ref*.](/learn/referencing-values-with-refs)

### Contoh: Menggulir ke sebuah Elemen {/*example-scrolling-to-an-element*/}

Anda dapat memiliki lebih dari satu *ref* dalam sebuah komponen. Pada contoh, terdapat *carousel* terdiri dari 3 gambar. Setiap tombol mengarahkan ke pusat gambar dengan memanggil metode peramban [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) pada simpul DOM terkait:

<Sandpack>

```js
import { useRef } from 'react';

export default function CatFriends() {
  const firstCatRef = useRef(null);
  const secondCatRef = useRef(null);
  const thirdCatRef = useRef(null);

  function handleScrollToFirstCat() {
    firstCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToSecondCat() {
    secondCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  function handleScrollToThirdCat() {
    thirdCatRef.current.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center'
    });
  }

  return (
    <>
      <nav>
        <button onClick={handleScrollToFirstCat}>
          Neo
        </button>
        <button onClick={handleScrollToSecondCat}>
          Millie
        </button>
        <button onClick={handleScrollToThirdCat}>
          Bella
        </button>
      </nav>
      <div>
        <ul>
          <li>
            <img
              src="https://placecats.com/neo/300/200"
              alt="Neo"
              ref={firstCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/millie/200/200"
              alt="Millie"
              ref={secondCatRef}
            />
          </li>
          <li>
            <img
              src="https://placecats.com/bella/199/200"
              alt="Bella"
              ref={thirdCatRef}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

<DeepDive>

#### Bagaimana mengatur daftar ref menggunakan ref callback {/*how-to-manage-a-list-of-refs-using-a-ref-callback*/}

Pada contoh di atas, terdapat beberapa *refs* yang telah didefinisikan. Namun, terkadang Anda mungkin butuh *ref* pada tiap *item* dalam daftar, dan Anda tidak tahu berapa banyak yang akan Anda dapatkan. Hal seperti ini **tidak akan berfungsi**:

```js
<ul>
  {items.map((item) => {
    // Tidak akan berfungsi
    const ref = useRef(null);
    return <li ref={ref} />;
  })}
</ul>
```

Ini dikarenakan **Hooks hanya dapat dipanggil di tingkat atas komponen Anda.** Anda tidak dapat memanggil `useRef` di dalam perulangan, di dalam kondisi, atau di dalam pemanggilan`map()`.

Satu cara yang memungkinkan adalah mendapatkan *ref* tunggal dari elemen *parent*, lalu gunakan metode manipulasi DOM seperti  [`querySelectorAll`](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelectorAll) untuk "menemukan" masing-masing *child node*. Namun, hal ini beresiko kacau jika struktur DOM Anda berubah.

Solusi lainnya adalah dengan **mengoper fungsi pada atribut `ref`.** hal ini dinamakan [`ref` callback.](/reference/react-dom/components/common#ref-callback) React akan memanggil *ref callback* Anda dengan *simpul DOM* saat menyiapkan *ref*, dan dengan `null` saat menghapusnya. hal ini memungkinkan anda mengatur *Array* Anda sendiri atau sebuah [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), dan mengakses *ref* dengan indeks atau sejenis ID.

Contoh di bawah menunjukan bagaimana Anda dapat menggunakan pendekatan ini untuk menggulir simpul di dalam daftar yang panjang:

<Sandpack>

```js
import { useRef, useState } from "react";

export default function CatFriends() {
  const itemsRef = useRef(null);
  const [catList, setCatList] = useState(setupCatList);

  function scrollToCat(cat) {
    const map = getMap();
    const node = map.get(cat);
    node.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }

  function getMap() {
    if (!itemsRef.current) {
      // menginisialisasi Map pada pertama kali penggunaan.
      itemsRef.current = new Map();
    }
    return itemsRef.current;
  }

  return (
    <>
      <nav>
        <button onClick={() => scrollToCat(catList[0])}>Neo</button>
        <button onClick={() => scrollToCat(catList[5])}>Millie</button>
        <button onClick={() => scrollToCat(catList[9])}>Bella</button>
      </nav>
      <div>
        <ul>
          {catList.map((cat) => (
            <li
              key={cat}
              ref={(node) => {
                const map = getMap();
                map.set(cat, node);

                return () => {
                  map.delete(cat);
                };
              }}
            >
              <img src={cat} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function setupCatList() {
  const catList = [];
  for (let i = 0; i < 10; i++) {
    catList.push("https://loremflickr.com/320/240/cat?lock=" + i);
  }

  return catList;
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}
```

</Sandpack>

Pada contoh ini, `itemsRef` tidak menyimpan simpul DOM. Namun,menyimpan sebuah [Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map) dari ID item ke simpul DOM. ([Refs dapat menyimpan nilai apa pun!](/learn/referencing-values-with-refs)) [`Ref` callback](/reference/react-dom/components/common#ref-callback) pada tiap daftar memperhatikan pembaruan *Map*:

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
<<<<<<< HEAD
    if (node) {
      // Add to the Map
      map.set(cat, node);
    } else {
      // Remove from the Map
      map.delete(cat);
    }
  }}
>
```

Hal ini memungkinkan Anda membaca simpul DOM individu dari *Map* nanti.

<Canary>

Contoh ini menunjukkan pendekatan lain untuk mengatur Map dengan fungsi *callback* `ref`.

```js
<li
  key={cat.id}
  ref={node => {
    const map = getMap();
=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
    // Add to the Map
    map.set(cat, node);

    return () => {
      // Remove from the Map
      map.delete(cat);
    };
  }}
>
```

This lets you read individual DOM nodes from the Map later.

<Note>

When Strict Mode is enabled, ref callbacks will run twice in development.

Read more about [how this helps find bugs](/reference/react/StrictMode#fixing-bugs-found-by-re-running-ref-callbacks-in-development) in callback refs.

</Note>

</DeepDive>

## Mengakses simpul DOM komponen lain {/*accessing-another-components-dom-nodes*/}

<<<<<<< HEAD
Saat Anda memasang *ref* pada komponen bawaan yang mana hasilnya adalah elemen peramban seperti `<input />`, React akan mengatur properti `current` *ref* pada simpul DOM tersebut (seperti aktual `<input />` pada peramban).

Namun, jika Anda mencoba mengatur *ref* pada komponen Anda sendiri, seperti `<MyInput />`, secara *default* Anda akan mendapatkan `null`. Ini contohnya. Perhatikan bagaimana meng-klik tombol **tidak** membuat fokus pada input:
=======
<Pitfall>
Refs are an escape hatch. Manually manipulating _another_ component's DOM nodes can make your code fragile.
</Pitfall>

You can pass refs from parent component to child components [just like any other prop](/learn/passing-props-to-a-component).

```js {3-4,9}
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

function MyForm() {
  const inputRef = useRef(null);
  return <MyInput ref={inputRef} />
}
```

In the above example, a ref is created in the parent component, `MyForm`, and is passed to the child component, `MyInput`. `MyInput` then passes the ref to `<input>`. Because `<input>` is a [built-in component](/reference/react-dom/components/common) React sets the `.current` property of the ref to the `<input>` DOM element.

The `inputRef` created in `MyForm` now points to the `<input>` DOM element returned by `MyInput`. A click handler created in `MyForm` can access `inputRef` and call `focus()` to set the focus on `<input>`.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

<Sandpack>

```js
import { useRef } from 'react';

function MyInput({ ref }) {
  return <input ref={ref} />;
}

export default function MyForm() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Untuk membantu Anda menanggapi *issue* tersebut, React juga mencetak *error* pada *console*:

<ConsoleBlock level="error">

Perhatian: fungsional komponen tidak dapat menerima *ref*. Mencoba mengaksesnya akan gagal. Apakah yang Anda maksud React.forwardRef()?

</ConsoleBlock>

Ini terjadi karena secara *default* React tidak mengizinkan komponen mengakses simpul DOM dari komponen lain. Bahkan *children* dari komponen tersebut! ini ada alasannya. *Ref* merupakan jalan darurat yang seharusnya jarang digunakan. Memanipulasi simpul DOM komponen lain secara manual membuat kode Anda lebih rentan.

Sebaliknya, komponen yang _ingin_ mengekspos simpul DOM harus *memilih* perilaku tersebut. Sebuah komponen dapat menentukan untuk meneruskan *ref* ke salah satu *children*nya. Contoh bagaimana `MyInput` dapat menggunakan API `forwardRef`:

```js
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});
```

Ini cara kerjanya:

1. `<MyInput ref={inputRef} />` memberitahu React untuk meletakkan simpul DOM yang sesuai ke dalam `inputRef.current`. Namun, itu terserah komponen `MyInput` untuk mengikutinya--secara *default*, tidak.
2. Komponen `MyInput` menggunakan `forwardRef`. **Dengan ini komponen menerima `inputRef` dari atas sebagai argumen `ref` kedua** yang dideklarasikan setelah `props`.
3. `MyInput` itu sendiri mengoper `ref` yang diterima ke dalam `<input>`.

Sekarang meng-klik tombol untuk fokus ke input berfungsi:

<Sandpack>

```js
import { forwardRef, useRef } from 'react';

const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

</Sandpack>

Dalam sistem desain, merupakan pola umum untuk komponen level rendah seperti tombol, input dan sejenisnya untuk meneruskan *ref* ke simpul DOM. Sebaliknya, komponen level atas seperti *form*, *list* atau bagian dari halaman biasanya tidak mengekspos simpul DOM untuk menghindari dependensi yang tidak disengaja pada struktur DOM.

=======
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff
<DeepDive>

#### Ekspos bagian dari API dengan imperatif handle {/*exposing-a-subset-of-the-api-with-an-imperative-handle*/}

<<<<<<< HEAD
Pada contoh di atas, `MyInput` mengekspos elemen input DOM. Ini memungkinkan komponen *parent* memanggil `focus()`. Namun, ini juga memungkinkan *parent* komponen melakukan hal lain--contohnya, mengubah CSS (Cascading Style Sheet) *style*. Dalam kasus umum, Anda mungkin ingin membatasi fungsionalitas yang akan diekspos. Anda dapat melakukannya dengan `useImperativeHandle`:
=======
In the above example, the ref passed to `MyInput` is passed on to the original DOM input element. This lets the parent component call `focus()` on it. However, this also lets the parent component do something else--for example, change its CSS styles. In uncommon cases, you may want to restrict the exposed functionality. You can do that with [`useImperativeHandle`](/reference/react/useImperativeHandle):
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

<Sandpack>

```js
import { useRef, useImperativeHandle } from "react";

function MyInput({ ref }) {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // Only expose focus and nothing else
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input ref={realInputRef} />;
};

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>Focus the input</button>
    </>
  );
}
```

</Sandpack>

<<<<<<< HEAD
Di sini, `realInputRef` di dalam `MyInput` memegang aktual simpul DOM input. Namun, `useImperativeHandle` menginstruksikan React untuk menyediakan spesial obyek tersendiri sebagai nilai dari *ref* ke komponen *parent*. Jadi `inputRef.current` di dalam komponen `Form` hanya akan memiliki metode `focus`. Dalam kasus ini, "handle" *ref* bukan simpul DOM, tetap kustom obyek yang Anda buat di dalam pemanggilan `useImperativeHandle`.
=======
Here, `realInputRef` inside `MyInput` holds the actual input DOM node. However, [`useImperativeHandle`](/reference/react/useImperativeHandle) instructs React to provide your own special object as the value of a ref to the parent component. So `inputRef.current` inside the `Form` component will only have the `focus` method. In this case, the ref "handle" is not the DOM node, but the custom object you create inside [`useImperativeHandle`](/reference/react/useImperativeHandle) call.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

</DeepDive>

## Ketika React menyematkan Ref {/*when-react-attaches-the-refs*/}

Dalam React, setiap pembaruan dibagi menjadi [dua fase](/learn/render-and-commit#step-3-react-commits-changes-to-the-dom):

* Selama proses **render,** React memanggil komponen Anda untuk mencari tahu apa yang seharusnya berada di layar.
* Selama proses **commit,** React menerapkan perubahan pada DOM.

Secara umum, Anda [tidak ingin](/learn/referencing-values-with-refs#best-practices-for-refs) mengakses *ref* selama proses *rendering*. Keadaan dimana *ref* menyimpan simpul DOM. Selama proses *render* pertama, simpul DOM belum dibuat, jadi `ref.current` bernilai `null`. Dan selama proses pembaharuan *render*, simpul DOM belum diperbarui. Jadi terlalu awal untuk membacanya.

React mengatur nilai `ref.current` selama commit. Sebelum memperbarui DOM, React mengatur nilai `ref.current` yang terpengaruh menjadi `null`. Setelah memperbarui DOM, React segera mengatur nilai `ref.current` tersebut menjadi simpul DOM yang sesuai.

**Biasanya, Anda akan mengakses ref dari *event handler*.** Jika Anda ingin melakukan sesuatu dengan sebuah *ref*, tetapi tidak ada *event* tertentu untuk melakukannya, Anda mungkin memerlukan *Effect*. Kami akan membahas *effect* pada halaman berikutnya.

<DeepDive>

#### Mengosongkan pembaruan state secara sinkron dengan flushSync {/*flushing-state-updates-synchronously-with-flush-sync*/}

Perhatikan kode ini, yang menambahkan *todo* baru dan menggulirkan layar ke bawah hingga pada elemen terakhir dari daftar. Perhatikan bagaimana, dengan alasan tertentu, hal ini selalu menggulirkan layar ke todo yang berada *sebelum* yang terakhir ditambahkan.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    setText('');
    setTodos([ ...todos, newTodo]);
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

Masalah terletak pada dua baris kode ini:

```js
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```

Di React, [pembaruan state dijadwalkan dalam antrian.](/learn/queueing-a-series-of-state-updates). Biasanya, ini adalah yang diinginkan. Namun, ini menyebabkan masalah karena `setTodos` tidak segera memperbarui DOM. Jadi, saat Anda menggulirkan daftar ke elemen terakhirnya, todo belum ditambahkan. Inilah sebabnya mengapa pengguliran selalu "terlambat" satu item.

Untuk memperbaiki masalah ini, Anda dapat memaksa React untuk memperbarui ("flush") DOM secara sinkron. Untuk melakukan ini, impor `flushSync` dari `react-dom` dan **bungkus pembaruan state** dengan pemanggilan flushSync:

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});
listRef.current.lastChild.scrollIntoView();
```

Ini akan memberitahu React untuk memperbarui DOM secara sinkron tepat setelah kode yang dibungkus dalam `flushSync` dieksekusi. Sebagai hasilnya, todo terakhir sudah ada di DOM pada saat Anda mencoba untuk menggulirnya:

<Sandpack>

```js
import { useState, useRef } from 'react';
import { flushSync } from 'react-dom';

export default function TodoList() {
  const listRef = useRef(null);
  const [text, setText] = useState('');
  const [todos, setTodos] = useState(
    initialTodos
  );

  function handleAdd() {
    const newTodo = { id: nextId++, text: text };
    flushSync(() => {
      setText('');
      setTodos([ ...todos, newTodo]);
    });
    listRef.current.lastChild.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  return (
    <>
      <button onClick={handleAdd}>
        Add
      </button>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <ul ref={listRef}>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}

let nextId = 0;
let initialTodos = [];
for (let i = 0; i < 20; i++) {
  initialTodos.push({
    id: nextId++,
    text: 'Todo #' + (i + 1)
  });
}
```

</Sandpack>

</DeepDive>

## Praktik terbaik memanipulasi DOM dengan refs. {/*best-practices-for-dom-manipulation-with-refs*/}

*Ref* adalah jalan keluar. Anda harus hanya menggunakannya ketika Anda harus "keluar dari React". Contoh umum dari hal ini termasuk mengelola fokus, posisi scroll, atau memanggil API peramban yang tidak diekspos React.

Jika Anda tetap menggunakan tindakan yang tidak merusak seperti fokus dan *scrolling*, Anda tidak akan mengalami masalah. Namun, jika Anda mencoba untuk **memodifikasi** DOM secara manual, Anda dapat berisiko konflik dengan perubahan yang dilakukan React.

Untuk mengilustrasikan masalah ini, contoh ini mencakup pesan selamat datang dan dua tombol. Tombol pertama menampilkan/menyembunyikan menggunakan [*conditional rendering*](/learn/conditional-rendering) dan [*state*](/learn/state-a-components-memory), seperti yang biasanya dilakukan di React. Tombol kedua menggunakan [`remove()` API DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element/remove) untuk menghapusnya secara paksa dari DOM di luar kendali React.

Coba tekan "Toggle with setState" beberapa kali. Pesan seharusnya menghilang dan muncul lagi. Kemudian tekan "Remove from the DOM". Ini akan menghapusnya secara paksa. Kemudian, tekan "Toggle with setState":

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function Counter() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  return (
    <div>
      <button
        onClick={() => {
          setShow(!show);
        }}>
        Toggle with setState
      </button>
      <button
        onClick={() => {
          ref.current.remove();
        }}>
        Remove from the DOM
      </button>
      {show && <p ref={ref}>Hello world</p>}
    </div>
  );
}
```

```css
p,
button {
  display: block;
  margin: 10px;
}
```

</Sandpack>

Setelah Anda menghapus elemen DOM secara manual, mencoba menggunakan `setState` untuk menampilkannya lagi akan menyebabkan masalah. Hal ini terjadi karena Anda telah mengubah DOM, dan React tidak tahu bagaimana melanjutkan mengelolanya dengan benar.

**Hindari mengubah simpul DOM yang dikelola oleh React.** Memodifikasi, menambahkan *children*, atau menghapus *children* dari elemen yang dikelola oleh React dapat menyebabkan hasil visual yang tidak konsisten atau masalah seperti di atas.

Namun, ini tidak berarti bahwa Anda sama sekali tidak dapat melakukannya. Ini membutuhkan kewaspadaan. **Anda dapat dengan aman mengubah bagian dari DOM yang tidak diperbarui oleh React dengan _alasan apa pun_**. Misalnya, jika beberapa `<div>` selalu kosong di JSX, React tidak akan memiliki alasan untuk menyentuh daftar *children*. Oleh karena itu, aman untuk menambahkan atau menghapus elemen secara manual di sana.

<Recap>

<<<<<<< HEAD
- Ref adalah konsep yang umum, tetapi paling sering digunakan untuk menyimpan elemen-elemen DOM.
- Anda menginstruksikan React untuk menempatkan simpul DOM ke `myRef.current` dengan mengoper `<div ref={myRef}>`.
- Biasanya, Anda akan menggunakan *ref* untuk tindakan non-destruktif seperti fokus, *scrolling*, atau mengukur elemen-elemen DOM.
- Komponen tidak secara *default* mengekspos simpul DOM-nya. Anda dapat memilih untuk mengekspos simpul DOM dengan menggunakan `forwardRef` dan mengoper argumen `ref` kedua ke simpul yang spesifik.
- Hindari mengubah simpul DOM yang dikelola oleh React.
- Jika Anda mengubah simpul DOM yang dikelola oleh React, ubah bagian yang tidak perlu diperbarui oleh React.
=======
- Refs are a generic concept, but most often you'll use them to hold DOM elements.
- You instruct React to put a DOM node into `myRef.current` by passing `<div ref={myRef}>`.
- Usually, you will use refs for non-destructive actions like focusing, scrolling, or measuring DOM elements.
- A component doesn't expose its DOM nodes by default. You can opt into exposing a DOM node by using the `ref` prop.
- Avoid changing DOM nodes managed by React.
- If you do modify DOM nodes managed by React, modify parts that React has no reason to update.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

</Recap>



<Challenges>

#### Putar dan jeda video {/*play-and-pause-the-video*/}

Dalam contoh ini, tombol mengalihkan *state* variabel untuk beralih antara *state* diputar atau dijeda. Namun, untuk benar-benar memutar atau menjeda video, mengalihkan *state* saja tidak cukup. Anda juga perlu memanggil [`play()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play) dan [`pause()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/pause) pada elemen DOM untuk `<video>`. Tambahkan sebuah *ref* pada elemen tersebut, dan buat tombol bekerja.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video width="250">
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Untuk tantangan tambahan, usahakan tombol "Play" selalu sejalan dengan apakah video sedang diputar meskipun pengguna mengklik kanan video dan memutarnya menggunakan kontrol media bawaan peramban. Anda mungkin ingin memperhatikan `onPlay` dan `onPause` pada video untuk melakukan hal tersebut.

<Solution>

Deklarasikan sebuah ref dan letakkan pada elemen `<video>`. Kemudian panggil `ref.current.play()` dan `ref.current.pause()` pada *event handler* tergantung pada state selanjutnya.

<Sandpack>

```js
import { useState, useRef } from 'react';

export default function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const ref = useRef(null);

  function handleClick() {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (nextIsPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <video
        width="250"
        ref={ref}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
          type="video/mp4"
        />
      </video>
    </>
  )
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

Untuk menangani kontrol bawaan peramban, Anda dapat menambahkan *handler* `onPlay` dan `onPause` ke elemen `<video>` dan memanggil `setIsPlaying` dari kedua *handler* tersebut. Dengan cara ini, jika pengguna memutar video menggunakan kontrol peramban, state akan menyesuaikan dengan benar.

</Solution>

#### Fokus ke input pencarian {/*focus-the-search-field*/}

Buat agar ketiak meng-klik tombol "Search" menempatkan fokus pada input.

<Sandpack>

```js
export default function Page() {
  return (
    <>
      <nav>
        <button>Search</button>
      </nav>
      <input
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Tambahkan *ref* ke dalam input, dan panggil `focus()` pada simpul DOM untuk fokus:

<Sandpack>

```js
import { useRef } from 'react';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <button onClick={() => {
          inputRef.current.focus();
        }}>
          Search
        </button>
      </nav>
      <input
        ref={inputRef}
        placeholder="Looking for something?"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

#### Menggulir sebuah carousel gambar. {/*scrolling-an-image-carousel*/}

Karusel gambar ini memiliki tombol "Next" yang mengubah gambar aktif. Buat galeri bergulir secara horizontal ke gambar aktif saat tombol ditekan. Anda mungkin ingin memanggil [`scrollIntoView()`](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView) pada simpul DOM dari gambar aktif:

```js
node.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
});
```

<Hint>

Anda tidak perlu *ref* ke setiap gambar untuk latihan ini. Cukup *ref* ke gambar yang sedang aktif, atau ke daftar itu sendiri. Gunakan `flushSync` untuk memastikan DOM diperbarui *sebelum* Anda melakukan scroll.

</Hint>

<Sandpack>

```js
import { useState } from 'react';

export default function CatFriends() {
  const [index, setIndex] = useState(0);
  return (
    <>
      <nav>
        <button onClick={() => {
          if (index < catList.length - 1) {
            setIndex(index + 1);
          } else {
            setIndex(0);
          }
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li key={cat.id}>
              <img
                className={
                  index === i ?
                    'active' :
                    ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

<Solution>

Anda dapat mendeklarasikan `selectedRef`, dan kemudian mengoper ref ini secara kondisional hanya ke gambar yang sedang dipilih:

```js
<li ref={index === i ? selectedRef : null}>
```

Ketika `index === i`, artinya gambar adalah yang dipilih, `<li>` akan menerima `selectedRef`. React akan memastikan bahwa `selectedRef.current` selalu menunjuk pada simpul DOM yang benar.

Perlu diperhatikan bahwa panggilan `flushSync` diperlukan untuk memaksa React memperbarui DOM sebelum scroll. Jika tidak, `selectedRef.current` akan selalu menunjuk pada item yang sebelumnya dipilih.

<Sandpack>

```js
import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';

export default function CatFriends() {
  const selectedRef = useRef(null);
  const [index, setIndex] = useState(0);

  return (
    <>
      <nav>
        <button onClick={() => {
          flushSync(() => {
            if (index < catList.length - 1) {
              setIndex(index + 1);
            } else {
              setIndex(0);
            }
          });
          selectedRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          });            
        }}>
          Next
        </button>
      </nav>
      <div>
        <ul>
          {catList.map((cat, i) => (
            <li
              key={cat.id}
              ref={index === i ?
                selectedRef :
                null
              }
            >
              <img
                className={
                  index === i ?
                    'active'
                    : ''
                }
                src={cat.imageUrl}
                alt={'Cat #' + cat.id}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

const catList = [];
for (let i = 0; i < 10; i++) {
  catList.push({
    id: i,
    imageUrl: 'https://loremflickr.com/250/200/cat?lock=' + i
  });
}

```

```css
div {
  width: 100%;
  overflow: hidden;
}

nav {
  text-align: center;
}

button {
  margin: .25rem;
}

ul,
li {
  list-style: none;
  white-space: nowrap;
}

li {
  display: inline;
  padding: 0.5rem;
}

img {
  padding: 10px;
  margin: -10px;
  transition: background 0.2s linear;
}

.active {
  background: rgba(0, 100, 150, 0.4);
}
```

</Sandpack>

</Solution>

#### Fokus ke input pencarian dengan Komponen terpisah {/*focus-the-search-field-with-separate-components*/}

Buat agar saat tombol "Search" diklik, fokus masuk ke dalam input. Perhatikan bahwa setiap komponen didefinisikan dalam file terpisah dan tidak seharusnya dipindahkan keluar dari file tersebut. Bagaimana cara menghubungkannya?

<Hint>

<<<<<<< HEAD
Anda akan memerlukan `forwardRef` untuk memungkinkan eksposisi sebuah simpul DOM dari komponen Anda sendiri seperti `SearchInput`.
=======
You'll need to pass `ref` as a prop to opt into exposing a DOM node from your own component like `SearchInput`.
>>>>>>> ab18d2f0f5151ab0c927a12eb0a64f8170762eff

</Hint>

<Sandpack>

```js src/App.js
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  return (
    <>
      <nav>
        <SearchButton />
      </nav>
      <SearchInput />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton() {
  return (
    <button>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput() {
  return (
    <input
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

<Solution>

Anda perlu menambahkan prop `onClick` ke `SearchButton`, dan membuat `SearchButton` meneruskannya ke peramban `<button>`. Anda juga akan meneruskan *ref* ke `<SearchInput>`, yang akan meneruskannya ke `<input>` yang sebenarnya lalu mengisinya. Terakhir, dalam handler klik, Anda akan memanggil `focus` pada simpul DOM yang disimpan dalam *ref* tersebut.

<Sandpack>

```js src/App.js
import { useRef } from 'react';
import SearchButton from './SearchButton.js';
import SearchInput from './SearchInput.js';

export default function Page() {
  const inputRef = useRef(null);
  return (
    <>
      <nav>
        <SearchButton onClick={() => {
          inputRef.current.focus();
        }} />
      </nav>
      <SearchInput ref={inputRef} />
    </>
  );
}
```

```js src/SearchButton.js
export default function SearchButton({ onClick }) {
  return (
    <button onClick={onClick}>
      Search
    </button>
  );
}
```

```js src/SearchInput.js
export default function SearchInput({ ref }) {
  return (
    <input
      ref={ref}
      placeholder="Looking for something?"
    />
  );
}
```

```css
button { display: block; margin-bottom: 10px; }
```

</Sandpack>

</Solution>

</Challenges>
