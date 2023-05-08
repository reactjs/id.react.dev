---
title: useState
---

<Intro>

`useState` merupakan React Hook yang memungkinkan Anda untuk menambahkan [variabel *state*](/learn/state-a-components-memory) pada komponen Anda.

```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Panggil fungsi `useState` di tingkat atas komponen Anda untuk mendeklarasikan sebuah [variabel *state*.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Konvensi dalam menamai variable *state* adalah menggunakan pola `[something, setSomething]` dengan [*array destructuring*.](https://javascript.info/destructuring-assignment)

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `initialState`: Nilai awal pada sebuah *state*. Nilainya dapat berupa jenis apa saja, namun terdapat perilaku khusus untuk fungsi. Argumen ini diabaikan setelah *rendering* awal.
  * Jika Anda mengoper sebuah fungsi sebagai `initialState`, itu akan diperlakukan sebagai fungsi inisialisasi (*initializer function*). Fungsi tersebut harus murni (*pure*), tidak boleh menerima argumen, dan harus mengembalikan nilai dengan tipe apa pun. React akan memanggil fungsi inisialisasi ketika menginisialisasi komponen, dan menyimpan nilai kembaliannya sebagai *state* awal. [Lihat contoh lainnya di bawah ini.](#avoiding-recreating-the-initial-state)

#### Kembalian {/*returns*/}

`useState` mengembalikan sebuah senarai yang memiliki dua nilai:

1. *State* saat ini. Pada saat pertama kali *render*, itu akan sama dengan `initialState` yang Anda oper sebelumnya.
2. Fungsi [*`set` function*](#setstate) yang memungkinkan Anda memperbarui *state* menjadi nilai yang berbeda dan memicu pembaruan ulang (*re-render*).

#### Catatan Penting {/*caveats*/}

* `useState` merupakan sebuah Hook, sehingga Anda hanya dapat memanggilnya **di level atas komponen Anda** atau Hooks Anda sendiri. Anda tidak dapat memanggilnya di dalam perulangan atau kondisi. Jika Anda membutuhkannya, Anda dapat membuat komponen baru dan pindahkan *state* ke dalamnya.
* Dalam mode ketat (*Strict Mode*), React akan **memanggil fungsi inisialisasi Anda dua kali** untuk [membantu Anda menemukan kejadian yang tidak diharapkan.](#my-initializer-or-updater-function-runs-twice) Hal ini hanya terjadi pada pengembangan dan tidak mempengaruhi produksi. Jika *initializer function* Anda murni (sebagaimana mestinya), ini seharusnya tidak mempengaruhi perilakunya. Hasil dari salah satu pemanggilan akan diabaikan.

---

### Fungsi `set`, seperti `setSomething(nextState)` {/*setstate*/}

Fungsi `set` yang dikembalikan oleh `useState` memungkinkan Anda memperbarui *state* ke nilai yang berbeda dan memicu pembaruan ulang (*re-render*). Anda dapat mengoper *state* berikutnya secara langsung, atau sebuah fungsi yang akan mengkalkulasi dari *state* sebelumnya:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameter {/*setstate-parameters*/}

* `nextState`: Nilai yang Anda inginkan untuk menjadi *state* berikutnya. Ini dapat berupa nilai dari jenis apa pun, tetapi ada perilaku khusus untuk sebuah fungsi.
  * Jika Anda mengoper sebuah fungsi sebagai `nextState`, itu akan diperlakukan sebagai fungsi pembaruan (*updater function*). Fungsi ini harus murni (*pure*), hanya menerima *state* yang tertunda sebagai argumen satu-satunya, dan harus mengembalikan *state* berikutnya. React akan menempatkan fungsi pembaruan Anda dalam antrian dan memperbarui ulang komponen Anda. Selama *render* berikutnya, React akan mengkalkulasi *state* berikutnya dengan menerapkan semua pembaruan dalam antrian ke *state* sebelumnya [Lihat contoh lainnya di bawah ini.](#updating-state-based-on-the-previous-state)

#### Kembalian {/*setstate-returns*/}

Fungsi `set` tidak memiliki nilai kembalian.

#### Catatan Penting {/*setstate-caveats*/}

* Fungsi `set` **hanya memperbarui variabel *state* ketika *render* berikutnya**. Jika Anda membaca variabel *state* setelah memanggil fungsi `set`, [Anda akan tetap mendapatkan nilai lama](#ive-updated-the-state-but-logging-gives-me-the-old-value) yang ada di layar sebelum pemanggilan Anda.

* Jika nilai baru yang Anda berikan identik dengan `state` saat ini, seperti yang ditentukan oleh perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React akan **melewatkan proses pembaruan ulang komponen dan anak-anaknya** Ini merupakan sebulah optimisasi. Meskipun dalam beberapa kasus React mungkin masih perlu memanggil komponen Anda sebelum melewatkan anak-anaknya, ini seharusnya tidak mempengaruhi kode Anda.

* React [pembaruan state berkelompok.](/learn/queueing-a-series-of-state-updates) Fungsi `set` akan memperbarui tampilan **setelah semua *event handler* selesai dijalankan** dan memanggil fungsi `set` masing-masing. Hal ini mencegah terjadinya beberapa pembaruan ulang selama satu *event*. Dalam kasus yang jarang terjadi di mana Anda perlu memaksa React untuk memperbarui tampilan lebih awal, misalnya untuk mengakses DOM, Anda dapat menggunakan [`flushSync`.](/reference/react-dom/flushSync)

* Memanggil fungsi `set` selama *rendering* hanya diperbolehkan dari dalam komponen yang sedang di-*render* saat ini. React akan membuang hasilnya dan segera mencoba me-*render* kembali dengan *state* yang baru. Pola ini jarang dibutuhkan, tetapi bisa digunakan untuk **menyimpan informasi dari render sebelumnya**. [See an example below.](#storing-information-from-previous-renders)

* Pada mode ketat, React akan **memanggil fungsi pembaruan Anda dua kali** untuk [membantu Anda menemukan kejadian yang tidak diharapkan.](#my-initializer-or-updater-function-runs-twice) Ini hanya terjadi di lingkungan pengembangan dan tidak memengaruhi produksi. Jika fungsi pembaruan Anda murni (seperti seharusnya), ini tidak akan memengaruhi perilakunya. Hasil dari salah satu panggilan akan diabaikan.

---

## Penggunaan {/*usage*/}

### Menambahkan *state* pada sebuah komponen {/*adding-state-to-a-component*/}

Memanggil `useState` di tingkat atas komponen Anda untuk mendeklarasikan satu atau lebih [variabel *state*.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

Konvensi dalam menamai variabel *state* adalah menggunakan pola `[something, setSomething]` dengan [*array destructuring*.](https://javascript.info/destructuring-assignment)

`useState` mengembalikan sebuah senarai yang memiliki dua nilai:

1. <CodeStep step={1}>*state* saat ini</CodeStep> dari variabel *state* ini, awalnya diatur ke <CodeStep step={3}>*state* awal</CodeStep> yang Anda berikan.
2. <CodeStep step={2}>fungsi `set`</CodeStep> yang memungkinkan Anda mengubahnya ke nilai lain sebagai respons terhadap suatu interaksi.

Untuk memperbarui tampilan layar, panggil fungsi `set` dengan *state* berikutnya:

```js [[2, 2, "setName"]]
function handleClick() {
  setName('Robin');
}
```

React akan menyimpan *state* berikutnya, me-*render* komponen Anda kembali dengan nilai baru, dan memperbarui antarmuka pengguna.

<Pitfall>

Memanggil fungsi `set` [**tidak mengubah** keadaan saat ini dalam kode yang sudah dieksekusi](#ive-updated-the-state-but-logging-gives-me-the-old-value):

```js {3}
function handleClick() {
  setName('Robin');
  console.log(name); // Still "Taylor"!
}
```

Ini hanya mempengaruhi apa yang akan dikembalikan oleh `useState` mulai dari *render* berikutnya.

</Pitfall>

<Recipes titleText="Basic useState examples" titleId="examples-basic">

#### Penghitung (angka) {/*counter-number*/}

Dalam contoh ini, variabel *state* `count` menyimpan sebuah angka. Dengan mengklik tombol, angka tersebut akan bertambah.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      You pressed me {count} times
    </button>
  );
}
```

</Sandpack>

<Solution />

#### *Text field* (*string*) {/*text-field-string*/}

Dalam contoh ini, variabel *state* `text` menyimpan sebuah *string*. Ketika Anda mengetik, `handleChange` membaca nilai masukan terbaru dari elemen DOM masukan pada peramban, dan memanggil `setText` untuk memperbarui keadaan. Ini memungkinkan Anda untuk menampilkan `text` saat ini di bawahnya.

<Sandpack>

```js
import { useState } from 'react';

export default function MyInput() {
  const [text, setText] = useState('hello');

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <>
      <input value={text} onChange={handleChange} />
      <p>You typed: {text}</p>
      <button onClick={() => setText('hello')}>
        Reset
      </button>
    </>
  );
}
```

</Sandpack>

<Solution />

#### *Checkbox* (*boolean*) {/*checkbox-boolean*/}

Dalam contoh ini, variabel *state* `liked` menyimpan sebuah *boolean*. Ketika Anda mengklik input, `setLiked` memperbarui variabel *state* `liked` dengan nilai *true* atau *false* tergantung pada apakah masukan *checkbox* pada peramban dicentang atau tidak. Variabel `liked` digunakan untuk me-*render* teks di bawah *checkbox*.

<Sandpack>

```js
import { useState } from 'react';

export default function MyCheckbox() {
  const [liked, setLiked] = useState(true);

  function handleChange(e) {
    setLiked(e.target.checked);
  }

  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={liked}
          onChange={handleChange}
        />
        I liked this
      </label>
      <p>You {liked ? 'liked' : 'did not like'} this.</p>
    </>
  );
}
```

</Sandpack>

<Solution />

#### *Form* (dua variabel) {/*form-two-variables*/}

Anda dapat mendeklarasikan lebih dari satu variabel *state* dalam komponen yang sama. Setiap variabel *state* sepenuhnya bersifat independen.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={() => setAge(age + 1)}>
        Increment age
      </button>
      <p>Hello, {name}. You are {age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Memperbarui *state* berdasarkan *state* sebelumnya {/*updating-state-based-on-the-previous-state*/}

Misalkan `age` adalah `42`. Lalu *handler* ini memanggil `setAge(age + 1)` sebanyak tiga kali:

```js
function handleClick() {
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
  setAge(age + 1); // setAge(42 + 1)
}
```

Namun, setelah satu kali klik, `age` hanya akan menjadi `43` daripada `45`! Hal ini terjadi karena memanggil fungsi `set` [tidak memperbarui](/learn/state-as-a-snapshot) variabel *state* `age` pada kode yang sudah dieksekusi. Oleh karena itu, setiap panggilan `setAge(age + 1)` menjadi `setAge(43)`.

Untuk memecahkan masalah ini, **Anda dapat mengoper sebuah fungsi pembaruan (*updater function*)** pada `setAge` daripada mengoper *state* berikutnya:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

Di sini, `a => a + 1` adalah fungsi pembaruan Anda. Fungsi ini mengambil <CodeStep step={1}>*state* tertunda</CodeStep> dan mengkalkulasi <CodeStep step={2}>*state* selanjutnya</CodeStep> darinya.

React menempatkan fungsi pembaruan Anda dalam sebuah [antrian.](/learn/queueing-a-series-of-state-updates) Selanjutnya, selama *render* berikutnya, React akan memanggil fungsi-fungsi tersebut dalam urutan yang sama:

1. `a => a + 1` akan menerima `42` sebagai *state* yang tertunda dan mengembalikan `43` sebagai *state* berikutnya.
1. `a => a + 1` akan menerima `43` sebagai *state* yang tertunda dan mengembalikan `44` sebagai *state* berikutnya.
1. `a => a + 1` akan menerima `44` sebagai *state* yang tertunda dan mengembalikan `45` sebagai *state* berikutnya.

Karena tidak ada pembaruan antrian lainnya, maka React akan menyimpan `45` sebagai *state* saat ini.

Secara konvensi, umumnya disepakati untuk memberi nama argumen *state* tertunda dengan huruf pertama dari nama variabel *state*, seperti `a` untuk `age`. Namun, Anda juga dapat memberinya nama seperti `prevAge` atau sesuatu yang menurut Anda lebih jelas.

React mungkin [akan memanggil pembaruan Anda dua kali](#my-initializer-or-updater-function-runs-twice) pada saat pengembangan untuk memeriksa apakah mereka [murni.](/learn/keeping-components-pure)

<DeepDive>

#### Apakah selalu lebih disarankan untuk menggunakan fungsi pembaruan? {/*is-using-an-updater-always-preferred*/}

Anda mungkin mendengar rekomendasi untuk selalu menulis kode seperti `setAge(a => a + 1)` jika *state* yang Anda atur dikalkulasi dari *state* sebelumnya. Tidak ada masalah dengan itu, tetapi juga tidak selalu diperlukan.

Pada kebanyakan kasus, tidak ada perbedaan antara kedua pendekatan tersebut. React selalu memastikan bahwa untuk tindakan pengguna yang disengaja, seperti klik, variabel *state* `age` akan diperbarui sebelum klik berikutnya. Ini berarti tidak ada risiko klik *handler* melihat `age` yang "usang" di awal *event handler*.

Namun, jika Anda melakukan beberapa pembaruan dalam satu *event*, fungsi pembaruan dapat membantu. Mereka juga membantu jika mengakses variabel *state* itu sendiri merepotkan (Anda mungkin mengalaminya saat mengoptimalkan *render* ulang).

Jika Anda lebih suka konsistensi daripada sintaks yang sedikit lebih panjang, masuk akal untuk selalu menulis fungsi pembaruan jika *state* yang Anda atur dikalkulasi dari *state* sebelumnya. Jika dihitung dari *state* sebelumnya dari beberapa variabel *state* yang lain, Anda mungkin ingin menggabungkannya menjadi satu objek dan [menggunakan *reducer*.](/learn/extracting-state-logic-into-a-reducer)

</DeepDive>

<Recipes titleText="The difference between passing an updater and passing the next state directly" titleId="examples-updater">

#### Mengoper fungsi pembaruan {/*passing-the-updater-function*/}

Contoh ini menggunakan fungsi pembaruan, sehingga tombol "+3" berfungsi.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(a => a + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

#### Mengoper *state* selanjutnya secara langsung {/*passing-the-next-state-directly*/}

Contoh ini **tidak** mengoper fungsi pembaruan, sehinggal tombol "+3" **tidak berfungsi seperti yang diharapkan**.

<Sandpack>

```js
import { useState } from 'react';

export default function Counter() {
  const [age, setAge] = useState(42);

  function increment() {
    setAge(age + 1);
  }

  return (
    <>
      <h1>Your age: {age}</h1>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <button onClick={() => {
        increment();
      }}>+1</button>
    </>
  );
}
```

```css
button { display: block; margin: 10px; font-size: 20px; }
h1 { display: block; margin: 10px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Memperbarui objek dan senarai di dalam *state*. {/*updating-objects-and-arrays-in-state*/}

Anda dapat menempatkan objek dan senarai ke dalam *state*. Di React, *state* dianggap sebagai sesuatu yang hanya bisa dibaca, sehingga **Anda harus menggantinya (*replace*) daripada mutasi (*mutate*) objek yang sudah ada**. Misalnya, jika Anda memiliki objek `form` di dalam *state*, jangan mutasi secara langsung:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Seharusnya, gantikan seluruh objek dengan membuat objek baru:

```js
// ✅ Replace state with a new object
setForm({
  ...form,
  firstName: 'Taylor'
});
```

Baca [memperbarui objek pada *state*](/learn/updating-objects-in-state) dan [memperbarui senarai pada *state](/learn/updating-arrays-in-state) untuk belajar lebih lanjut.

<Recipes titleText="Examples of objects and arrays in state" titleId="examples-objects">

#### *Form* (objek) {/*form-object*/}

Pada contoh ini, variabel *state* `form` menampung sebuah objek. Setiap masukan memiliki pengendali perubahan yang memanggil `setForm` dengan *state* berikutnya dari keseluruhan *form*. *Spead syntax* `{ ...form }` memastikan bahwa objek *state* diganti daripada dimutasi (*mutated*).

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [form, setForm] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com',
  });

  return (
    <>
      <label>
        First name:
        <input
          value={form.firstName}
          onChange={e => {
            setForm({
              ...form,
              firstName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Last name:
        <input
          value={form.lastName}
          onChange={e => {
            setForm({
              ...form,
              lastName: e.target.value
            });
          }}
        />
      </label>
      <label>
        Email:
        <input
          value={form.email}
          onChange={e => {
            setForm({
              ...form,
              email: e.target.value
            });
          }}
        />
      </label>
      <p>
        {form.firstName}{' '}
        {form.lastName}{' '}
        ({form.email})
      </p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### *Form* (objek bersarang) {/*form-nested-object*/}

Pada contoh ini, *state*-nya bersarang. Ketika Anda memperbarui *state* yang bersarang, Anda perlu membuat salinan dari objek yang Anda perbarui, serta setiap objek "yang terkandung" di sepanjang jalurnya ke atas. [memperbarui objek bersarang](/learn/updating-objects-in-state#updating-a-nested-object) untuk belajar lebih lanjut.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img 
        src={person.artwork.image} 
        alt={person.artwork.title}
      />
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 5px; margin-bottom: 5px; }
img { width: 200px; height: 200px; }
```

</Sandpack>

<Solution />

#### Daftar (senarai) {/*list-array*/}

Dalam contoh ini, variabel *state* `todos` menyimpan sebuah senarai. setiap pengendali tombol memanggil `setTodos` dengan versi selanjutnya dari senarai tersebut. *Speading syntax* `[...todos]`, `todos.map()`, dan `todos.filter()` memastikan senarai *state* diganti daripada dimutasi.

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTodo from './AddTodo.js';
import TaskList from './TaskList.js';

let nextId = 3;
const initialTodos = [
  { id: 0, title: 'Buy milk', done: true },
  { id: 1, title: 'Eat tacos', done: false },
  { id: 2, title: 'Brew tea', done: false },
];

export default function TaskApp() {
  const [todos, setTodos] = useState(initialTodos);

  function handleAddTodo(title) {
    setTodos([
      ...todos,
      {
        id: nextId++,
        title: title,
        done: false
      }
    ]);
  }

  function handleChangeTodo(nextTodo) {
    setTodos(todos.map(t => {
      if (t.id === nextTodo.id) {
        return nextTodo;
      } else {
        return t;
      }
    }));
  }

  function handleDeleteTodo(todoId) {
    setTodos(
      todos.filter(t => t.id !== todoId)
    );
  }

  return (
    <>
      <AddTodo
        onAddTodo={handleAddTodo}
      />
      <TaskList
        todos={todos}
        onChangeTodo={handleChangeTodo}
        onDeleteTodo={handleDeleteTodo}
      />
    </>
  );
}
```

```js AddTodo.js
import { useState } from 'react';

export default function AddTodo({ onAddTodo }) {
  const [title, setTitle] = useState('');
  return (
    <>
      <input
        placeholder="Add todo"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <button onClick={() => {
        setTitle('');
        onAddTodo(title);
      }}>Add</button>
    </>
  )
}
```

```js TaskList.js
import { useState } from 'react';

export default function TaskList({
  todos,
  onChangeTodo,
  onDeleteTodo
}) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>
          <Task
            todo={todo}
            onChange={onChangeTodo}
            onDelete={onDeleteTodo}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ todo, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let todoContent;
  if (isEditing) {
    todoContent = (
      <>
        <input
          value={todo.title}
          onChange={e => {
            onChange({
              ...todo,
              title: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Save
        </button>
      </>
    );
  } else {
    todoContent = (
      <>
        {todo.title}
        <button onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={e => {
          onChange({
            ...todo,
            done: e.target.checked
          });
        }}
      />
      {todoContent}
      <button onClick={() => onDelete(todo.id)}>
        Delete
      </button>
    </label>
  );
}
```

```css
button { margin: 5px; }
li { list-style-type: none; }
ul, li { margin: 0; padding: 0; }
```

</Sandpack>

<Solution />

#### Menulis logika pembaruan ringkas menggunakan Immer {/*writing-concise-update-logic-with-immer*/}

Jika terasa merepotkan untuk memperbarui senarai dan objek tanpa mutasi, Anda dapat menggunakan pustaka seperti [Immer](https://github.com/immerjs/use-immer) untuk mengurangi kode yang berulang. Immer memungkinkan Anda menulis kode yang ringkas seolah-olah Anda melakukan mutasi pada objek, tetapi sebenarnya ia melakukan pembaruan *immutable* di belakang layar:

<Sandpack>

```js
import { useState } from 'react';
import { useImmer } from 'use-immer';

let nextId = 3;
const initialList = [
  { id: 0, title: 'Big Bellies', seen: false },
  { id: 1, title: 'Lunar Landscape', seen: false },
  { id: 2, title: 'Terracotta Army', seen: true },
];

export default function BucketList() {
  const [list, updateList] = useImmer(initialList);

  function handleToggle(artworkId, nextSeen) {
    updateList(draft => {
      const artwork = draft.find(a =>
        a.id === artworkId
      );
      artwork.seen = nextSeen;
    });
  }

  return (
    <>
      <h1>Art Bucket List</h1>
      <h2>My list of art to see:</h2>
      <ItemList
        artworks={list}
        onToggle={handleToggle} />
    </>
  );
}

function ItemList({ artworks, onToggle }) {
  return (
    <ul>
      {artworks.map(artwork => (
        <li key={artwork.id}>
          <label>
            <input
              type="checkbox"
              checked={artwork.seen}
              onChange={e => {
                onToggle(
                  artwork.id,
                  e.target.checked
                );
              }}
            />
            {artwork.title}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

```json package.json
{
  "dependencies": {
    "immer": "1.7.3",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "use-immer": "0.5.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Menghindari membuat ulang *state* awal {/*avoiding-recreating-the-initial-state*/}

React menyimpan *state* awal sekali dan mengabaikannya pada *render* berikutnya.

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  // ...
```

Meskipun hasil dari `createInitialTodos()` hanya digunakan untuk *render* awal, Anda tetap memanggil fungsi ini pada setiap render. Hal ini dapat menjadi pemborosan jika membuat senarai yang besar atau melakukan kalkulasi yang mahal

Untuk mengatasi hal tersebut, kamu dapat **mengopernya sebagai fungsi *initializer*** ke `useState` sebagai gantinya:

```js
function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  // ...
```

Perhatikan bahwa Anda mengoper `createInitialTodos`, yang merupakan *fungsi itu sendiri* dan bukan `createInitialTodos()`, yang merupakan hasil dari pemanggilannya. Jika Anda mengoper sebuah fungsi ke `useState`, React hanya akan memanggilnya selama inisialisasi.

React dapat [memanggil inisialisator Anda dua kali](#my-initializer-or-updater-function-runs-twice) pada saat pengembangan untuk memeriksa apakah mereka [murni.](/learn/keeping-components-pure)

<Recipes titleText="The difference between passing an initializer and passing the initial state directly" titleId="examples-initializer">

#### Mengoper fungsi inisialisasi {/*passing-the-initializer-function*/}

Contoh ini mengoper sebuah fungsi inisialisasi, sehingga fungsi `createInitialTodos` hanya berjalan ketika inisalisasi. Ini tidak berjalan ketika komponen di-*render* ulang, seperti ketika Anda mengetikkan masukan.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos);
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

#### Mengoper *state* awal secara langsung {/*passing-the-initial-state-directly*/}

Contoh ini **tidak** mengoper fungsi inisialisasi, sehingga fungsi `createInitialTodos` akan berjalan pada setiap *render*, seperti ketika Anda mengetikkan suatu masukan. Tidak ada perbedaan perilaku yang terlihat, tetapi kode ini kurang efisien.

<Sandpack>

```js
import { useState } from 'react';

function createInitialTodos() {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: 'Item ' + (i + 1)
    });
  }
  return initialTodos;
}

export default function TodoList() {
  const [todos, setTodos] = useState(createInitialTodos());
  const [text, setText] = useState('');

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        setTodos([{
          id: todos.length,
          text: text
        }, ...todos]);
      }}>Add</button>
      <ul>
        {todos.map(item => (
          <li key={item.id}>
            {item.text}
          </li>
        ))}
      </ul>
    </>
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Mereset *state* menggunakan kunci (*key*) {/*resetting-state-with-a-key*/}

Anda sering melihat atribut `key` saat [me-*render* daftar.](/learn/rendering-lists) Namun, atribut ini juga memiliki tujuan lain.

Anda dapat **mereset *state* komponen dengan memberikan `key` yang berbeda pada komponen.** Pada contoh ini, tombol Reset mengubah variabel *state* `version`, yang kami oper sebagai `key` pada `Form`. Ketika `key` berubah, React membuat ulang komponen `Form` (dan semua komponen anaknya) dari awal, sehingga *state*-nya di reset.

Baca [menjaga dan mereset *state*](/learn/preserving-and-resetting-state) untuk mempelajari lebih lanjut.

<Sandpack>

```js App.js
import { useState } from 'react';

export default function App() {
  const [version, setVersion] = useState(0);

  function handleReset() {
    setVersion(version + 1);
  }

  return (
    <>
      <button onClick={handleReset}>Reset</button>
      <Form key={version} />
    </>
  );
}

function Form() {
  const [name, setName] = useState('Taylor');

  return (
    <>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <p>Hello, {name}.</p>
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
```

</Sandpack>

---

### Menyimpan informasi dari *render* sebelumnya {/*storing-information-from-previous-renders*/}

Biasanya, Anda akan memperbarui *state* pada *event handler*. Namun, dalam kasus yang jarang terjadi, Anda mungkin ingin menyesuaikan *state* sebagai respons terhadap *rendering* -- misalnya, Anda mungkin ingin mengubah variabel *state* ketika *prop* berubah.

Dalam kebanyakan kasus, Anda tidak memerlukannya:

* **Jika nilai yang Anda butuhkan dapat dikomputasi sepenuhnya dari *props* saat ini atau *state* lain, [hapus *state* yang redundan tersebut.](/learn/choosing-the-state-structure#avoid-redundant-state)** Jika Anda khawatir tentang komputasi ulang yang terlalu sering, [`useMemo` Hook](/reference/react/useMemo) dapat membantu.
* Jika Anda ingin mereset seluruh *state* komponen, [berikan `key` yang berbeda pada komponen Anda.](#resetting-state-with-a-key)
* Jika Anda bisa, perbarui semua *state* yang relevan pada *event handler*.

Dalam kasus yang jarang terjadi bahwa tidak satu pun dari yang disebutkan di atas berlaku, ada pola yang dapat Anda gunakan untuk memperbarui *state* berdasarkan nilai-nilai yang telah di-*render*, dengan memanggil fungsi `set` ketika komponen Anda sedang di-*render*..

Berikut contohnya. Komponen `CountLabel` ini menampilkan *prop* `count` yang dioper kepadanya::

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Misalkan Anda ingin menunjukan apakah penghitung telah meningkat atau menurun sejak perubahan terakhir. *Prop* `count` tidak memberi tahu hal ini -- Anda perlu menelusuri dari nilai sebelumnya. Tambahkan variabel *state* `prevCount` untuk menelusurinya. Tambahkan variabel *state* lain bernama `trend` untuk menampung apakah hitungan telah meningkat atau menurun. Bandingkan `prevCount` dengan `count`, dan jika tidak sama, perbarui `prevCount` dan `trend`. Sekarang Anda dapat menampilkan *prop* hitungan saat ini dan bagaimana ia telah berubah sejak *render* terakhir.

<Sandpack>

```js App.js
import { useState } from 'react';
import CountLabel from './CountLabel.js';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <CountLabel count={count} />
    </>
  );
}
```

```js CountLabel.js active
import { useState } from 'react';

export default function CountLabel({ count }) {
  const [prevCount, setPrevCount] = useState(count);
  const [trend, setTrend] = useState(null);
  if (prevCount !== count) {
    setPrevCount(count);
    setTrend(count > prevCount ? 'increasing' : 'decreasing');
  }
  return (
    <>
      <h1>{count}</h1>
      {trend && <p>The count is {trend}</p>}
    </>
  );
}
```

```css
button { margin-bottom: 10px; }
```

</Sandpack>

Perhatikan bahwa jika Anda memanggil fungsi `set` saat *rendering*, itu harus berada dalam kondisi seperti `prevCount !== count`, dan harus ada pemanggilan seperti `setPrevCount(count)` di dalam kondisi tersebut. Jika tidak, komponen Anda akan di-*render* dalam perulangan hingga terjadi *crash*. Selain itu, Anda hanya dapat memperbarui *state* dari komponen yang sedang di-*render* seperti ini. Memanggil fungsi `set` dari komponen lain selama *rendering* adalah kesalahan. Terakhir, pemanggilan `set` Anda harus [memperbarui *state* tanpa mutasi](#updating-objects-and-arrays-in-state) -- ini bukan berarti Anda dapat melanggar aturan [fungsi murni.](/learn/keeping-components-pure)

Pola ini bisa sulit dipahami dan biasanya lebih baik untuk dihindari. Namun, ini lebih baik daripada memperbarui *state* dalam efek. Ketika Anda memanggil fungsi `set` selama *render*, React akan me-*render* ulang komponen tersebut sesaat setelah komponen Anda keluar dengan pernyataan `return`, dan sebelum me-*render* anak-anak. Dengan begitu, anak-anak tidak perlu me-*render* dua kali. Sisa fungsi komponen Anda tetap akan dieksekusi (dan hasilnya akan dibuang). Jika kondisi Anda berada di bawah semua panggilan Hook, Anda dapat menambahkan `return` lebih awal untuk memulai ulang *render* sebelumnya.

---

## Pemecahan Masalah {/*troubleshooting*/}

### Saya sudah memperbarui *state*, tetapi saat saya mencetak log nilainya masih yang lama {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Memanggil fungsi `set` **tidak mengubah *state* pada kode yang sedang berjalan**:

```js {4,5,8}
function handleClick() {
  console.log(count);  // 0

  setCount(count + 1); // Request a re-render with 1
  console.log(count);  // Still 0!

  setTimeout(() => {
    console.log(count); // Also 0!
  }, 5000);
}
```

Ini terjadi karena [*state* berperilaku seperti *snapshot*.](/learn/state-as-a-snapshot) Memperbarui *state* membutuhkan *render* ulang dengan nilai *state* baru, tetapi tidak memengaruhi variabel JavaScript `count` pada *event handler* yang sedang berjalan.

Jika Anda perlu menggunakan *state* selanjutnya, Anda dapat menyimpannya dalam variabel sebelum mengopernya pada fungsi `set`:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### Saya telah memperbarui *state*, tetapi tidak ada perbaruan pada layar {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React akan **mengabaikan pembaruan Anda jika *state* berikutnya sama dengan state sebelumnya,** yang ditentukan oleh perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Ini biasanya terjadi ketika Anda mengubah objek atau senarai di dalam *state* secara langsung:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

Anda mengubah objek `obj` yang ada dan mengirimkannya kembali ke `setObj`, sehingga React mengabaikan pembaruan tersebut. Untuk memperbaikinya, pastikan Anda selalu [mengganti objek dan senarai di dalam *state* daripada memutasi mereka](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### Saya mendapatkan galat: *"Too many re-renders"* {/*im-getting-an-error-too-many-re-renders*/}

Anda mungkin mendapatkan galat yang mengatakan: `*Too many re-renders*. React membatasi jumlah render untuk mencegah pengulangan tak terbatas.` Biasanya ini berarti bahwa Anda secara tidak kondisional mengatur *state* selama *render*, sehingga komponen Anda masuk ke dalam perulangan: *render*, *set state* (yang menyebabkan *render*), *render*, *set state* (yang menyebabkan render), dan seterusnya. Sangat sering, ini disebabkan oleh kesalahan dalam menentukan *event handler*:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

Jika Anda tidak dapat menemukan penyebab kesalahan ini, klik pada panah di sebelah galat pada konsol dan lihat melalui tumpukan JavaScript untuk menemukan panggilan fungsi `set` yang bertanggung jawab atas kesalahan tersebut.

---

### Fungsi inisialisasi atau pembaruan saya berjalan dua kali {/*my-initializer-or-updater-function-runs-twice*/}

Pada [*Strict Mod*e*](/reference/react/StrictMode), React akan memanggil beberapa fungsi Anda sebanyak dua kali alih-alih hanya satu kali:

```js {2,5-6,11-12}
function TodoList() {
  // This component function will run twice for every render.

  const [todos, setTodos] = useState(() => {
    // This initializer function will run twice during initialization.
    return createTodos();
  });

  function handleClick() {
    setTodos(prevTodos => {
      // This updater function will run twice for every click.
      return [...prevTodos, createTodo()];
    });
  }
  // ...
```

Ini sesuatu yang sudah diperkirakan dan seharusnya tidak merusak kode Anda.

Perikalu ini hanya terjadi pada **saat pengembangan** dan membantu Anda [menjaga komponen bersifat murni.](/learn/keeping-components-pure) React menggunakan hasil dari salah satu pangiglan, dan mengabaikan hasil panggilan yang lain. Selama fungsi komponen, insialisasi, dan pembaruan Anda murni, ini tidak akan mempengaruhi logika Anda. Namun, jika secara tidak sengaja terdapat fungsi tidak murni (*impure*), ini akan membantu Anda untuk mengetahui kesalahan.

Sebagai contoh, fungsi pembaruan tidak murni ini mengubah sebuah senarai di dalam *state*:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Karena React memanggil fungsi pembaruan dua kali, Anda akan melihat *todo* ditambahkan dua kali, sehingga Anda akan tahu bahwa ada kesalahan. Dalam contoh ini, Anda dapat memperbaiki kesalahan dengan [mengganti senarai tersebut daripada memutasi](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

Apabila fungsi pembaruan ini murni, memanggilnya beberapa kali tidak membuat perbedaan perilaku. Inilah mengapa React memanggilnya dua kali untuk membantu Anda menemukan kesalahan. **Hanya fungsi komponen, inisialisasi, dan pembaruan yang perlu bersifat murni.** *Event handler* tidak perlu murni, sehingga React tidak akan pernah memanggil *event handler* Anda dua kali.

Baca [menjaga komponen murni](/learn/keeping-components-pure) untuk belajar lebih lanjut.

---

### Saya mencoba mengatur *state* ke sebuah fungsi, namun malah dipanggil {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

Anda tidak dapat mengoper sebuah fungsi ke dalam *state* seperti ini.:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Karena Anda mengoper sebuah fungsi, React menganggap bahwa `someFunction` adalah [fungsi inisialisasi](#avoiding-recreating-the-initial-state), dan bahwa `someOtherFunction` adalah [fungsi pembaruan](#updating-state-based-on-the-previous-state), sehingga mencoba memanggil mereka dan menyimpan hasilnya. Untuk *benar-benar* menyimpan fungsi, Anda harus menambahkan `() =>` sebelum keduanya. Kemudian React akan menyimpan fungsi yang Anda oper.


```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
