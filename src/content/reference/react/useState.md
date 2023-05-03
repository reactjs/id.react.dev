---
title: useState
---

<Intro>

`useState` merupakan React Hook yang memungkinkan Anda untuk menambahkan [*state variable*](/learn/state-a-components-memory) pada komponen anda.

```js
const [state, setState] = useState(initialState);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useState(initialState)` {/*usestate*/}

Panggil fungsi `useState` di tingkat atas komponen Anda untuk mendeklarasikan sebuah [*state variable*.](/learn/state-a-components-memory)

```js
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(28);
  const [name, setName] = useState('Taylor');
  const [todos, setTodos] = useState(() => createTodos());
  // ...
```

Konvensi dalam menamai *state variable* adalah menggunakan pola `[something, setSomething]` dengan [*array destructuring*.](https://javascript.info/destructuring-assignment)

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `initialState`: Nilai awal pada sebuah *state*. Nilainya dapat berupa jenis apa saja, namun terdapat perilaku khusus untuk fungsi. Argumen ini diabaikan setelah rendering awal.
  * Jika Anda mengoper sebuah fungsi sebagai `initialState`, itu akan diperlakukan sebagai *initializer function*. Fungsi tersebut harus murni (*pure*), tidak boleh menerima argumen, dan harus mengembalikan nilai dengan tipe apa pun. React akan memanggil *initializer function* ketika menginisialisasi komponen, dan menyimpan nilai kembaliannya sebagai *state* awal. [Lihat contoh lainnya di bawah ini.](#avoiding-recreating-the-initial-state)

#### Mengembalikan {/*returns*/}

`useState` mengembalikan sebuah senarai dengan tepat dua nilai:

1. *State* saat ini. Pada saat pertama kali *render*, itu akan cocok dengan `initialState` yang anda oper sebelumnya.
2. Fungsi [*`set` function*](#setstate) yang memungkinkan Anda memperbarui *state* menjadi nilai yang berbeda dan memicu pembaruan ulang (*re-render*).

#### Peringatan {/*caveats*/}

* `useState` merupakan sebuah *Hook*, sehingga Anda hanya dapat memanggilnya **di level atas komponen Anda** atau *Hooks* Anda sendiri. Anda tidak dapat memanggilnya di dalam perulangan atau kondisi. Jika Anda membutuhkannya, Anda dapat membuat komponen baru dan pindahkan state ke dalamnya.
* Dalam *Strict Mode*, React akan **memanggil fungsi inisialisasi Anda dua kali** untuk [membantu Anda menemukan kejadian yang tidak diharapkan.](#my-initializer-or-updater-function-runs-twice) Hal ini hanya terjadi pada pengembangan dan tidak mempengaruhi produksi. Jika *initializer function* Anda murni (sebagaimana mestinya), ini seharusnya tidak mempengaruhi perilakunya. Hasil dari salah satu pemanggilan akan diabaikan.

---

### Fungsi `set`, seperti `setSomething(nextState)` {/*setstate*/}

Fungsi `set` yang dikembalikan oleh `useState` memungkinkan Anda memperbarui state ke nilai yang berbeda dan memicu pembaruan ulang (*re-render*). Anda dapat mengoper *state* berikutnya secara langsung, atau sebuah fungsi yang mengkalkulasi dari *state* sebelumnya:

```js
const [name, setName] = useState('Edward');

function handleClick() {
  setName('Taylor');
  setAge(a => a + 1);
  // ...
```

#### Parameters {/*setstate-parameters*/}

* `nextState`: Nilai yang anda inginkan untuk menjadi *state* berikutnya. Ini dapat berupa nilai dari jenis apa pun, tetapi ada perilaku khusus untuk sebuah fungsi.
  * Jika Anda mengoper sebuah fungsi sebagai `nextState`, itu akan diperlakukan sebagai fungsi pembaruan (*updater function*). Fungsi ini harus murni (*pure*), hanya menerima *state* yang tertunda sebagai argumen satu-satunya, dan harus mengembalikan state berikutnya. React akan menempatkan fungsi pembaruan Anda dalam antrian dan memperbarui ulang komponen Anda. Selama *render* berikutnya, React akan mengkalkulasi *state* berikutnya dengan menerapkan semua pembaruan dalam antrian ke state sebelumnya [Lihat contoh lainnya di bawah ini.](#updating-state-based-on-the-previous-state)

#### Returns {/*setstate-returns*/}

Fungsi `set` tidak memiliki nilai kembali.

#### Peringatan {/*setstate-caveats*/}

* Fungsi `set` **hanya memperbarui variabel *state* untuk *render* berikutnya**. Jika Anda membaca variabel *state* setelah memanggil fungsi `set`, [Anda akan tetap mendapatkan nilai lama](#ive-updated-the-state-but-logging-gives-me-the-old-value) yang ada di layar sebelum panggilan Anda.

* Jika nilai baru yang Anda berikan identik dengan `state` saat ini, seperti yang ditentukan oleh perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React akan **melewatkan proses pembaruan ulang komponen dan anak-anaknya** Ini merupakan sebulah optimisasi. Meskipun dalam beberapa kasus React mungkin masih perlu memanggil komponen Anda sebelum melewatkan anak-anaknya, ini seharusnya tidak mempengaruhi kode Anda.

* React [pembaruan state berkelompok.](/learn/queueing-a-series-of-state-updates) Fungsi `set` akan memperbarui tampilan **setelah semua *event handler* selesai dijalankan** dan memanggil fungsi `set` masing-masing. Hal ini mencegah terjadinya beberapa pembaruan ulang selama satu *event*. Dalam kasus yang jarang terjadi di mana Anda perlu memaksa React untuk memperbarui tampilan lebih awal, misalnya untuk mengakses DOM, Anda dapat menggunakan [`flushSync`.](/reference/react-dom/flushSync)

* Memanggil fungsi `set` selama *rendering* hanya diperbolehkan dari dalam komponen yang sedang dirender saat ini. React akan membuang outputnya dan segera mencoba me-*render* kembali dengan *state* yang baru. Pola ini jarang dibutuhkan, tetapi bisa digunakan untuk **menyimpan informasi dari render sebelumnya**. [See an example below.](#storing-information-from-previous-renders)

* Pada *Strict Mode*, React akan **memanggil fungsi updater Anda dua kali** untuk [membantu Anda menemukan kejadian yang tidak diharapkan.](#my-initializer-or-updater-function-runs-twice) Ini hanya terjadi di lingkungan pengembangan dan tidak memengaruhi produksi. Jika fungsi updater Anda murni (seperti seharusnya), ini tidak akan memengaruhi perilakunya. Hasil dari salah satu panggilan akan diabaikan.

---

## Penggunaan {/*usage*/}

### Menambahkan *state* pada sebuah komponen {/*adding-state-to-a-component*/}

Memanggil `useState` di tingkat atas komponen Anda untuk mendeklarasikan satu atau lebih [*state variables*.](/learn/state-a-components-memory)

```js [[1, 4, "age"], [2, 4, "setAge"], [3, 4, "42"], [1, 5, "name"], [2, 5, "setName"], [3, 5, "'Taylor'"]]
import { useState } from 'react';

function MyComponent() {
  const [age, setAge] = useState(42);
  const [name, setName] = useState('Taylor');
  // ...
```

Konvensi dalam menamai *state variable* adalah menggunakan pola `[something, setSomething]` dengan [*array destructuring*.](https://javascript.info/destructuring-assignment)

`useState` mengembalikan sebuah senarai dengan tepat dua nilai:

[comment]: # (TODO)

1. The <CodeStep step={1}>current state</CodeStep> of this state variable, initially set to the <CodeStep step={3}>initial state</CodeStep> you provided.
2. The <CodeStep step={2}>`set` function</CodeStep> that lets you change it to any other value in response to interaction.

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

#### Counter (number) {/*counter-number*/}

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

#### Text field (string) {/*text-field-string*/}

Dalam contoh ini, variabel *state* `text` menyimpan sebuah string. Ketika Anda mengetik, `handleChange` membaca nilai masukan terbaru dari elemen DOM masukan pada peramban, dan memanggil `setText` untuk memperbarui keadaan. Ini memungkinkan Anda untuk menampilkan `text` saat ini di bawahnya.

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

#### Checkbox (boolean) {/*checkbox-boolean*/}

Dalam contoh ini, variabel *state* `liked` menyimpan sebuah boolean. Ketika Anda mengklik input, `setLiked` memperbarui variabel *state* `liked` dengan nilai *true* atau *false* tergantung pada apakah masukan *checkbox* pada peramban dicentang atau tidak. Variabel `liked` digunakan untuk me-*render* teks di bawah *checkbox*.

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

#### Form (two variables) {/*form-two-variables*/}

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

Untuk memecahkan masalah ini, **anda dapat mengoper sebuah fungsi pembaruan (*updater function*)** pada `setAge` daripada *state* berikutnya:

```js [[1, 2, "a", 0], [2, 2, "a + 1"], [1, 3, "a", 0], [2, 3, "a + 1"], [1, 4, "a", 0], [2, 4, "a + 1"]]
function handleClick() {
  setAge(a => a + 1); // setAge(42 => 43)
  setAge(a => a + 1); // setAge(43 => 44)
  setAge(a => a + 1); // setAge(44 => 45)
}
```

[comment]: # (TODO)

Here, `a => a + 1` is your updater function. It takes the <CodeStep step={1}>pending state</CodeStep> and calculates the <CodeStep step={2}>next state</CodeStep> from it.

React menempatkan fungsi pembaruan Anda dalam sebuah [antrian.](/learn/queueing-a-series-of-state-updates) Selanjutnya, selama *render* berikutnya, React akan memanggil fungsi-fungsi tersebut dalam urutan yang sama:

1. `a => a + 1` akan menerima `42` sebagai *state* yang tertunda dan mengembalikan `43` sebagai *state* berikutnya.
1. `a => a + 1` akan menerima `43` sebagai *state* yang tertunda dan mengembalikan `44` sebagai *state* berikutnya.
1. `a => a + 1` akan menerima `44` sebagai *state* yang tertunda dan mengembalikan `45` sebagai *state* berikutnya.

Karena tidak ada pembaruan antrian lainnya, maka React akan menyimpan `45` sebagai *state* saat ini.

Secara konvensi, umumnya disepakati untuk memberi nama argumen *state* tertunda dengan huruf pertama dari nama variabel *state*, seperti `a` untuk `age`. Namun, Anda juga dapat memberinya nama seperti `prevAge` atau sesuatu yang menurut Anda lebih jelas.

React mungkin [akan memanggil pembaruan Anda dua kali](#my-initializer-or-updater-function-runs-twice) pada saat pengembangan untuk memeriksa apakah mereka [murni.](/learn/keeping-components-pure)

<DeepDive>

#### Apakah selalu lebih disarankan untuk menggunakan fungsi pembaruan? {/*is-using-an-updater-always-preferred*/}

Anda mungkin mendengar rekomendasi untuk selalu menulis kode seperti `setAge(a => a + 1)` jika *state* yang Anda atur d
ikalkulasi dari *state* sebelumnya. Tidak ada masalah dengan itu, tetapi juga tidak selalu diperlukan.

Pada kebanyakan kasus, tidak ada perbedaan antara kedua pendekatan tersebut. React selalu memastikan bahwa untuk tindakan pengguna yang disengaja, seperti klik, variabel *state* `age` akan diperbarui sebelum klik berikutnya. Ini berarti tidak ada risiko klik *handler* melihat `age` yang "usang" di awal *event handler*.

Namun, jika Anda melakukan beberapa pembaruan dalam satu *event*, fungsi pembaruan dapat membantu. Mereka juga membantu jika mengakses variabel *state* itu sendiri merepotkan (Anda mungkin mengalaminya saat mengoptimalkan re-*render*).

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

### Mengupdate objek dan senarai di dalam *state*. {/*updating-objects-and-arrays-in-state*/}

Anda dapat menempatkan objek dan senarai ke dalam *state*. Di React, *state* dianggap sebagai sesuatu yang hanya bisa dibaca, sehingga **Anda harus menggantinya (*replace*) daripada mutasi (*mutate*) objek yang sudah ada**. Misalnya, jika Anda memiliki objek `form` di dalam *state*, jangan mutasi (*mutate*) secara langsung:

```js
// 🚩 Don't mutate an object in state like this:
form.firstName = 'Taylor';
```

Instead, replace the whole object by creating a new one:

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

Pada contoh ini, *state*-nya bersarang. Ketika Anda memperbarui *state* yang bersarang, Anda perlu membuat salinan dari objek yang Anda perbarui, serta setiap objek "yang terkandung" di sepanjang jalurnya ke atas. [memperbarui objek bersarang](/learn/updating-objects-in-state#updating-a-nested-object) to learn more.

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

Dalam contoh ini, variabel *state* `todos` menyimpan sebuah senarai. setiap pengendali tombol memanggil `setTodos` dengan versi selanjutnya dari senarai tersebut. *Speading syntax* `[...todos]`, `todos.map()`, dan `todos.filter()` memastikan senarai *state* diganti daripada dimutasi (*mutate*).

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

Jika terasa merepotkan untuk memperbarui senarai dan objek tanpa *mutation*, Anda dapat menggunakan pustaka seperti [Immer](https://github.com/immerjs/use-immer) untuk mengurangi kode yang berulang. Immer memungkinkan Anda menulis kode yang ringkas seolah-olah Anda melakukan mutasi pada objek, tetapi sebenarnya ia melakukan pembaruan *immutable* di belakang layar:

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

#### Passing the initializer function {/*passing-the-initializer-function*/}

This example passes the initializer function, so the `createInitialTodos` function only runs during initialization. It does not run when component re-renders, such as when you type into the input.

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

#### Passing the initial state directly {/*passing-the-initial-state-directly*/}

This example **does not** pass the initializer function, so the `createInitialTodos` function runs on every render, such as when you type into the input. There is no observable difference in behavior, but this code is less efficient.

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

### Resetting state with a key {/*resetting-state-with-a-key*/}

You'll often encounter the `key` attribute when [rendering lists.](/learn/rendering-lists) However, it also serves another purpose.

You can **reset a component's state by passing a different `key` to a component.** In this example, the Reset button changes the `version` state variable, which we pass as a `key` to the `Form`. When the `key` changes, React re-creates the `Form` component (and all of its children) from scratch, so its state gets reset.

Read [preserving and resetting state](/learn/preserving-and-resetting-state) to learn more.

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

### Storing information from previous renders {/*storing-information-from-previous-renders*/}

Usually, you will update state in event handlers. However, in rare cases you might want to adjust state in response to rendering -- for example, you might want to change a state variable when a prop changes.

In most cases, you don't need this:

* **If the value you need can be computed entirely from the current props or other state, [remove that redundant state altogether.](/learn/choosing-the-state-structure#avoid-redundant-state)** If you're worried about recomputing too often, the [`useMemo` Hook](/reference/react/useMemo) can help.
* If you want to reset the entire component tree's state, [pass a different `key` to your component.](#resetting-state-with-a-key)
* If you can, update all the relevant state in the event handlers.

In the rare case that none of these apply, there is a pattern you can use to update state based on the values that have been rendered so far, by calling a `set` function while your component is rendering.

Here's an example. This `CountLabel` component displays the `count` prop passed to it:

```js CountLabel.js
export default function CountLabel({ count }) {
  return <h1>{count}</h1>
}
```

Say you want to show whether the counter has *increased or decreased* since the last change. The `count` prop doesn't tell you this -- you need to keep track of its previous value. Add the `prevCount` state variable to track it. Add another state variable called `trend` to hold whether the count has increased or decreased. Compare `prevCount` with `count`, and if they're not equal, update both `prevCount` and `trend`. Now you can show both the current count prop and *how it has changed since the last render*.

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

Note that if you call a `set` function while rendering, it must be inside a condition like `prevCount !== count`, and there must be a call like `setPrevCount(count)` inside of the condition. Otherwise, your component would re-render in a loop until it crashes. Also, you can only update the state of the *currently rendering* component like this. Calling the `set` function of *another* component during rendering is an error. Finally, your `set` call should still [update state without mutation](#updating-objects-and-arrays-in-state) -- this doesn't mean you can break other rules of [pure functions.](/learn/keeping-components-pure)

This pattern can be hard to understand and is usually best avoided. However, it's better than updating state in an effect. When you call the `set` function during render, React will re-render that component immediately after your component exits with a `return` statement, and before rendering the children. This way, children don't need to render twice. The rest of your component function will still execute (and the result will be thrown away). If your condition is below all the Hook calls, you may add an early `return;` to restart rendering earlier.

---

## Troubleshooting {/*troubleshooting*/}

### I've updated the state, but logging gives me the old value {/*ive-updated-the-state-but-logging-gives-me-the-old-value*/}

Calling the `set` function **does not change state in the running code**:

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

This is because [states behaves like a snapshot.](/learn/state-as-a-snapshot) Updating state requests another render with the new state value, but does not affect the `count` JavaScript variable in your already-running event handler.

If you need to use the next state, you can save it in a variable before passing it to the `set` function:

```js
const nextCount = count + 1;
setCount(nextCount);

console.log(count);     // 0
console.log(nextCount); // 1
```

---

### I've updated the state, but the screen doesn't update {/*ive-updated-the-state-but-the-screen-doesnt-update*/}

React will **ignore your update if the next state is equal to the previous state,** as determined by an [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) comparison. This usually happens when you change an object or an array in state directly:

```js
obj.x = 10;  // 🚩 Wrong: mutating existing object
setObj(obj); // 🚩 Doesn't do anything
```

You mutated an existing `obj` object and passed it back to `setObj`, so React ignored the update. To fix this, you need to ensure that you're always [_replacing_ objects and arrays in state instead of _mutating_ them](#updating-objects-and-arrays-in-state):

```js
// ✅ Correct: creating a new object
setObj({
  ...obj,
  x: 10
});
```

---

### I'm getting an error: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

You might get an error that says: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Typically, this means that you're unconditionally setting state *during render*, so your component enters a loop: render, set state (which causes a render), render, set state (which causes a render), and so on. Very often, this is caused by a mistake in specifying an event handler:

```js {1-2}
// 🚩 Wrong: calls the handler during render
return <button onClick={handleClick()}>Click me</button>

// ✅ Correct: passes down the event handler
return <button onClick={handleClick}>Click me</button>

// ✅ Correct: passes down an inline function
return <button onClick={(e) => handleClick(e)}>Click me</button>
```

If you can't find the cause of this error, click on the arrow next to the error in the console and look through the JavaScript stack to find the specific `set` function call responsible for the error.

---

### My initializer or updater function runs twice {/*my-initializer-or-updater-function-runs-twice*/}

In [Strict Mode](/reference/react/StrictMode), React will call some of your functions twice instead of once:

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

This is expected and shouldn't break your code.

This **development-only** behavior helps you [keep components pure.](/learn/keeping-components-pure) React uses the result of one of the calls, and ignores the result of the other call. As long as your component, initializer, and updater functions are pure, this shouldn't affect your logic. However, if they are accidentally impure, this helps you notice the mistakes.

For example, this impure updater function mutates an array in state:

```js {2,3}
setTodos(prevTodos => {
  // 🚩 Mistake: mutating state
  prevTodos.push(createTodo());
});
```

Because React calls your updater function twice, you'll see the todo was added twice, so you'll know that there is a mistake. In this example, you can fix the mistake by [replacing the array instead of mutating it](#updating-objects-and-arrays-in-state):

```js {2,3}
setTodos(prevTodos => {
  // ✅ Correct: replacing with new state
  return [...prevTodos, createTodo()];
});
```

Now that this updater function is pure, calling it an extra time doesn't make a difference in behavior. This is why React calling it twice helps you find mistakes. **Only component, initializer, and updater functions need to be pure.** Event handlers don't need to be pure, so React will never call your event handlers twice.

Read [keeping components pure](/learn/keeping-components-pure) to learn more.

---

### I'm trying to set state to a function, but it gets called instead {/*im-trying-to-set-state-to-a-function-but-it-gets-called-instead*/}

You can't put a function into state like this:

```js
const [fn, setFn] = useState(someFunction);

function handleClick() {
  setFn(someOtherFunction);
}
```

Because you're passing a function, React assumes that `someFunction` is an [initializer function](#avoiding-recreating-the-initial-state), and that `someOtherFunction` is an [updater function](#updating-state-based-on-the-previous-state), so it tries to call them and store the result. To actually *store* a function, you have to put `() =>` before them in both cases. Then React will store the functions you pass.

```js {1,4}
const [fn, setFn] = useState(() => someFunction);

function handleClick() {
  setFn(() => someOtherFunction);
}
```
