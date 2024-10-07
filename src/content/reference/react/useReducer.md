---
title: useReducer
---

<Intro>

`useReducer` adalah React Hook yang memungkinkan Anda menambahkan [reducer](/learn/extracting-state-logic-into-a-reducer) ke komponen Anda.

```js
const [state, dispatch] = useReducer(reducer, initialArg, init?)
```

</Intro>

<InlineToc />

---

## Reference {/*reference*/}

### `useReducer(reducer, initialArg, init?)` {/*usereducer*/}

Panggil `useReducer` di tingkat atas komponen Anda untuk mengelola statenya dengan [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

[Lihat contoh lainnya di bawah.](#usage)

#### Parameter {/*parameters*/}

* `reducer`: Fungsi reducer yang menentukan bagaimana *state* diperbarui. Itu harus murni, harus mengambil *state* dan *action* sebagai argumen, dan harus mengembalikan *state* berikutnya. *State* dan *action* bisa dari tipe apa saja.
* `initialArg`: Nilai dari mana *initial state* dihitung. Bisa menjadi nilai dari tipe apapun. Bagaimana *initial state* dihitung darinya bergantung pada argumen `init` berikutnya.
* **opsional** `init`: Fungsi penginisialisasi yang harus mengembalikan *initial state*. Jika tidak ditentukan, *initial state* disetel ke `initialArg`. Jika tidak, *initial state* disetel ke hasil pemanggilan `init(initialArg)`.

#### Pengembalian {/*returns*/}

`useReducer` mengembalikan sebuah array dengan dua nilai:

1. State saat ini. Selama render pertama, ini disetel ke `init(initialArg)` atau `initialArg` (jika tidak ada `init`).
2. [Fungsi `dispatch`](#dispatch) yang memungkinkan Anda memperbarui state ke nilai yang berbeda dan memicu render ulang.

#### Peringatan {/*caveats*/}

<<<<<<< HEAD
* `useReducer` adalah sebuah Hook, jadi Anda hanya dapat memanggilnya **di tingkat atas komponen Anda** atau Hook Anda sendiri. Anda tidak dapat memanggilnya di dalam loop atau pengkondisian. Jika Anda perlu melakukannya, ekstrak komponen baru dan pindahkan state ke dalamnya.
* Dalam Strict Mode, React akan **memanggil reducer dan inisialisasi Anda sebanyak dua kali** untuk [membantu Anda menemukan ketidakmurnian yang tidak disengaja.](#my-reducer-or-initializer-function-runs-twice) Ini adalah perilaku khusus untuk tahap pengembangan dan tidak mempengaruhi tahap produksi. Jika reducer dan inisialisasi Anda murni (sebagai mestinya), ini tidak akan mempengaruhi logika Anda. Hasil dari salah satu panggilan diabaikan.
=======
* `useReducer` is a Hook, so you can only call it **at the top level of your component** or your own Hooks. You can't call it inside loops or conditions. If you need that, extract a new component and move the state into it.
* The `dispatch` function has a stable identity, so you will often see it omitted from effect dependencies, but including it will not cause the effect to fire. If the linter lets you omit a dependency without errors, it is safe to do. [Learn more about removing Effect dependencies.](/learn/removing-effect-dependencies#move-dynamic-objects-and-functions-inside-your-effect)
* In Strict Mode, React will **call your reducer and initializer twice** in order to [help you find accidental impurities.](#my-reducer-or-initializer-function-runs-twice) This is development-only behavior and does not affect production. If your reducer and initializer are pure (as they should be), this should not affect your logic. The result from one of the calls is ignored.
>>>>>>> 1697ae89a3bbafd76998dd7496754e5358bc1e9a

---

### Fungsi `dispatch` {/*dispatch*/}

Fungsi `dispatch` yang dikembalikan oleh `useReducer` memungkinkan Anda memperbarui state ke nilai yang berbeda dan memicu render ulang. Anda harus meneruskan action sebagai satu-satunya argumen ke fungsi `dispatch`:

```js
const [state, dispatch] = useReducer(reducer, { age: 42 });

function handleClick() {
  dispatch({ type: 'incremented_age' });
  // ...
```

React akan mengatur state berikutnya ke hasil pemanggilan fungsi `reducer` yang telah Anda sediakan dengan `state` saat ini dan action yang telah Anda teruskan ke `dispatch`.

#### Parameter {/*dispatch-parameters*/}

* `action`: Tindakan yang dilakukan oleh pengguna. Ini bisa menjadi nilai tipe apapun. Menurut konvensi, suatu action biasanya berupa objek dengan properti `type` yang mengidentifikasinya dan, secara opsional, properti lain dengan informasi tambahan.

#### Pengembalian {/*dispatch-returns*/}

Fungsi `dispatch` tidak memiliki nilai pengembalian.

#### Peringatan {/*setstate-caveats*/}

* Fungsi `dispatch` **hanya memperbarui variabel state untuk render berikutnya**. Jika Anda membaca variabel state setelah memanggil fungsi `dispatch`, [anda masih akan mendapatkan nilai lama](#ive-dispatched-an-action-but-logging-gives-me-the-old-state-value) yang ada di layar sebelum panggilan Anda.

* Jika nilai baru yang Anda berikan identik dengan `state` saat ini, sebagaimana ditentukan oleh perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is), React akan **melewati rendering ulang komponen dan childrennya.** Ini adalah pengoptimalan. React mungkin masih perlu memanggil komponen Anda sebelum mengabaikan hasilnya, tetapi itu tidak akan memengaruhi kode Anda.

* React [mengelompokkan pembaruan state.](/learn/queueing-a-series-of-state-updates) Itu memperbarui layar **setelah semua event handler berjalan** dan telah memanggil fungsi `set` mereka. Ini mencegah beberapa render ulang selama event tunggal. Dalam kasus yang jarang terjadi, Anda perlu memaksa React untuk memperbarui layar lebih awal, misalnya untuk mengakses DOM, Anda dapat menggunakan [`flushSync`.](/reference/react-dom/flushSync)

---

## Penggunaan {/*usage*/}

### Menambahkan reducer ke komponen {/*adding-a-reducer-to-a-component*/}

Panggil `useReducer` di tingkat atas komponen Anda untuk mengelola state dengan [reducer.](/learn/extracting-state-logic-into-a-reducer)

```js [[1, 8, "state"], [2, 8, "dispatch"], [4, 8, "reducer"], [3, 8, "{ age: 42 }"]]
import { useReducer } from 'react';

function reducer(state, action) {
  // ...
}

function MyComponent() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });
  // ...
```

`useReducer` mengembalikan sebuah array dengan dua item:

1. <CodeStep step={1}>State saat ini</CodeStep> dari variabel state, awalnya diatur ke <CodeStep step={3}>initial state</CodeStep> yang Anda berikan.
2. <CodeStep step={2}>Fungsi `dispatch`</CodeStep> yang memungkinkan Anda mengubahnya sebagai respon terhadap interaksi.

Untuk memperbarui apa yang ada di layar, panggil <CodeStep step={2}>`dispatch`</CodeStep> dengan objek yang mewakili apa yang dilakukan pengguna, yang disebut *action*:

```js [[2, 2, "dispatch"]]
function handleClick() {
  dispatch({ type: 'incremented_age' });
}
```

React akan meneruskan state saat ini dan action ke <CodeStep step={4}>fungsi reducer</CodeStep> Anda. Reducer Anda akan menghitung dan mengembalikan state berikutnya. React akan menyimpan state berikutnya, merender komponen Anda dengannya, dan memperbarui UI.

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  if (action.type === 'incremented_age') {
    return {
      age: state.age + 1
    };
  }
  throw Error('Action tidak diketahui.');
}

export default function Counter() {
  const [state, dispatch] = useReducer(reducer, { age: 42 });

  return (
    <>
      <button onClick={() => {
        dispatch({ type: 'incremented_age' })
      }}>
        Tambahkan umur
      </button>
      <p>Halo! Anda berumur {state.age}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

`useReducer` sangat mirip dengan [`useState`](/reference/react/useState), tetapi memungkinkan Anda memindahkan logika pembaruan state dari event handler ke dalam satu fungsi di luar komponen Anda. Baca selengkapnya tentang [memilih antara `useState` dan `useReducer`.](/learn/extracting-state-logic-into-a-reducer#comparing-usestate-and-usereducer)

---

### Menulis fungsi reducer {/*writing-the-reducer-function*/}

Fungsi reducer dideklarasikan seperti ini:

```js
function reducer(state, action) {
  // ...
}
```

Lalu Anda perlu mengisi kode yang akan menghitung dan mengembalikan state berikutnya. Menurut konvensi, biasanya ditulis sebagai [`switch` statement.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) Untuk setiap `case` di `switch`, hitung dan kembalikan beberapa state berikutnya.

```js {4-7,10-13}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Action tidak diketahui: ' + action.type);
}
```

Action dapat berbentuk apa saja. Menurut konvensi, meneruskan objek dengan properti `type` yang mengidentifikasi action adalah hal yang umum. Itu harus mencakup informasi minimal yang diperlukan yang dibutuhkan reducer untuk menghitung state berikutnya.

```js {5,9-12}
function Form() {
  const [state, dispatch] = useReducer(reducer, { name: 'Taylor', age: 42 });
  
  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    });
  }
  // ...
```

Nama action type bersifat lokal untuk komponen Anda. [Setiap action menjelaskan satu interaksi, meskipun hal itu menyebabkan beberapa perubahan pada data.](/learn/extracting-state-logic-into-a-reducer#writing-reducers-well) Bentuk dari state bersifat arbitrer, tetapi biasanya berupa objek atau array.

Baca [mengekstrak logika state menjadi reducer](/learn/extracting-state-logic-into-a-reducer) untuk mempelajari lebih lanjut.

<Pitfall>

State bersifat read-only. Jangan ubah objek atau array apapun dalam state:

```js {4,5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Jangan memutasikan objek dalam state seperti ini:
      state.age = state.age + 1;
      return state;
    }
```

Sebagai gantinya, selalu kembalikan objek baru dari reducer Anda:

```js {4-8}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Sebagai gantinya, kembalikan objek baru
      return {
        ...state,
        age: state.age + 1
      };
    }
```

Baca [memperbarui objek dalam state](/learn/updating-objects-in-state) dan [memperbarui array dalam state](/learn/updating-arrays-in-state) untuk mempelajari lebih lanjut.

</Pitfall>

<Recipes titleText="Contoh penggunaan dasar useReducer" titleId="examples-basic">

#### Form (object) {/*form-object*/}

Dalam contoh ini, reducer mengelola objek state dengan dua field: `name` dan `age`

<Sandpack>

```js
import { useReducer } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        name: state.name,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      return {
        name: action.nextName,
        age: state.age
      };
    }
  }
  throw Error('Action tidak diketahui: ' + action.type);
}

const initialState = { name: 'Taylor', age: 42 };

export default function Form() {
  const [state, dispatch] = useReducer(reducer, initialState);

  function handleButtonClick() {
    dispatch({ type: 'incremented_age' });
  }

  function handleInputChange(e) {
    dispatch({
      type: 'changed_name',
      nextName: e.target.value
    }); 
  }

  return (
    <>
      <input
        value={state.name}
        onChange={handleInputChange}
      />
      <button onClick={handleButtonClick}>
        Tambahkan umur
      </button>
      <p>Halo, {state.nama}. Anda berumur {state.umur}.</p>
    </>
  );
}
```

```css
button { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution />

#### Todo list (array) {/*todo-list-array*/}

Dalam contoh ini, reducer memgelola sebuah array serangkaian tugas. Array perlu diperbarui [tanpa mutasi.](/learn/updating-arrays-in-state)

<Sandpack>

```js src/App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [...tasks, {
        id: action.id,
        text: action.text,
        done: false
      }];
    }
    case 'changed': {
      return tasks.map(t => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Action tidak diketahui: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Rencana perjalanan Praha</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Kunjungi Museum Kafka', done: true },
  { id: 1, text: 'Menonton pertunjukan boneka', done: false },
  { id: 2, text: 'Foto Lennon Wall', done: false }
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Tambah tugas"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Hapus
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

#### Menulis logika pembaruan yang ringkas dengan Immer {/*writing-concise-update-logic-with-immer*/}

Jika memperbarui array dan objek tanpa mutasi terasa membosankan, Anda bisa menggunakan library seperti Immer untuk mengurangi kode yang berulang. Immer memungkinkan Anda menulis kode ringkas seolah-olah Anda melakukan mutasi objek, tetapi di balik itu, Immer melakukan pembaruan yang tidak berubah:

<Sandpack>

```js src/App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex(t =>
        t.id === action.task.id
      );
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter(t => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(
    tasksReducer,
    initialTasks
  );

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: nextId++,
      text: text,
    });
  }

  function handleChangeTask(task) {
    dispatch({
      type: 'changed',
      task: task
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId
    });
  }

  return (
    <>
      <h1>Rencana perjalanan Praha</h1>
      <AddTask
        onAddTask={handleAddTask}
      />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Kunjungi Museum Kafka', done: true },
  { id: 1, text: 'Menonton pertunjukan boneka', done: false },
  { id: 2, text: 'Foto Lennon Wall', done: false },
];
```

```js src/AddTask.js hidden
import { useState } from 'react';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        onAddTask(text);
      }}>Tambah</button>
    </>
  )
}
```

```js src/TaskList.js hidden
import { useState } from 'react';

export default function TaskList({
  tasks,
  onChangeTask,
  onDeleteTask
}) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task
            task={task}
            onChange={onChangeTask}
            onDelete={onDeleteTask}
          />
        </li>
      ))}
    </ul>
  );
}

function Task({ task, onChange, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            onChange({
              ...task,
              text: e.target.value
            });
          }} />
        <button onClick={() => setIsEditing(false)}>
          Simpan
        </button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
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
        checked={task.done}
        onChange={e => {
          onChange({
            ...task,
            done: e.target.checked
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>
        Hapus
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

### Menghindari membuat ulang initial state {/*avoiding-recreating-the-initial-state*/}

React menyimpan initial state sekali dan mengabaikannya pada render berikutnya.

```js
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, createInitialState(username));
  // ...
```

Meskipun hasil dari `createInitialState(username)` hanya digunakan untuk render awal, Anda tetap memanggil fungsi ini pada setiap render. Hal ini dapat menjadi boros jika Anda membuat array yang besar atau melakukan perhitungan yang rumit.

Untuk mengatasi hal ini, Anda dapat **meneruskannya sebagai fungsi _initializer_** ke `useReducer` sebagai argumen ketiga:

```js {6}
function createInitialState(username) {
  // ...
}

function TodoList({ username }) {
  const [state, dispatch] = useReducer(reducer, username, createInitialState);
  // ...
```

Perhatikan bahwa Anda meneruskan `createInitialState` yang merupakan *fungsi itu sendiri*, dan bukan `createInitialState()`, yang merupakan hasil dari pemanggilan fungsi tersebut. Dengan cara ini, initial state tidak dibuat ulang setelah inisialisasi.

Pada contoh di atas, `createInitialState` mengambil argumen `username`. Jika inisialisasi Anda tidak memerlukan informasi apa pun untuk menghitung initial state, Anda bisa meneruskan `null` sebagai argumen kedua ke `useReducer`.

<Recipes titleText="Perbedaan antara meneruskan inisialisasi dan meneruskan initial state secara langsung" titleId="examples-initializer">

#### Meneruskan fungsi inisialisasi {/*passing-the-initializer-function*/}

Contoh ini meneruskan fungsi inisialisasi, sehingga fungsi `createInitialState` hanya berjalan selama inisialisasi. Fungsi ini tidak berjalan ketika komponen dirender ulang, seperti ketika Anda mengetikkan input.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Action tidak diketahui: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    username,
    createInitialState
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Tambah</button>
      <ul>
        {state.todos.map(item => (
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

#### Meneruskan initial state secara langsung {/*passing-the-initial-state-directly*/}

Contoh ini **tidak** meneruskan fungsi inisialisasi, sehingga fungsi `createInitialState` berjalan pada setiap render, seperti saat Anda mengetikkan input. Tidak ada perbedaan perilaku yang dapat diamati, tetapi kode ini kurang efisien.

<Sandpack>

```js src/App.js hidden
import TodoList from './TodoList.js';

export default function App() {
  return <TodoList username="Taylor" />;
}
```

```js src/TodoList.js active
import { useReducer } from 'react';

function createInitialState(username) {
  const initialTodos = [];
  for (let i = 0; i < 50; i++) {
    initialTodos.push({
      id: i,
      text: username + "'s task #" + (i + 1)
    });
  }
  return {
    draft: '',
    todos: initialTodos,
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'changed_draft': {
      return {
        draft: action.nextDraft,
        todos: state.todos,
      };
    };
    case 'added_todo': {
      return {
        draft: '',
        todos: [{
          id: state.todos.length,
          text: state.draft
        }, ...state.todos]
      }
    }
  }
  throw Error('Action tidak diketahui: ' + action.type);
}

export default function TodoList({ username }) {
  const [state, dispatch] = useReducer(
    reducer,
    createInitialState(username)
  );
  return (
    <>
      <input
        value={state.draft}
        onChange={e => {
          dispatch({
            type: 'changed_draft',
            nextDraft: e.target.value
          })
        }}
      />
      <button onClick={() => {
        dispatch({ type: 'added_todo' });
      }}>Tambah</button>
      <ul>
        {state.todos.map(item => (
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

## Pemecahan masalah {/*troubleshooting*/}

### Saya telah mendispatch suatu action, tetapi catatan log memberi saya nilai state lama {/*ive-dispatched-an-action-but-logging-gives-me-the-old-state-value*/}

Memanggil fungsi `dispatch` **tidak mengubah state dalam kode yang sedang berjalan**:

```js {4,5,8}
function handleClick() {
  console.log(state.umur);  // 42

  dispatch({ type: 'incremented_age' }); // Request render ulang dengan 43
  console.log(state.umur);  // Masih 42!

  setTimeout(() => {
    console.log(state.umur); // Juga masih 42!
  }, 5000);
}
```

Hal ini karena [state berperilaku seperti snapshot.](/learn/state-as-a-snapshot) Memperbarui state akan merequest render ulang dengan nilai state yang baru, tetapi tidak memengaruhi variabel JavaScript `state` di dalam event handler yang sudah berjalan.

Jika Anda perlu menebak nilai state berikutnya, Anda dapat menghitungnya secara manual dengan memanggil reducer sendiri:

```js
const action = { type: 'incremented_age' };
dispatch(action);

const nextState = reducer(state, action);
console.log(state);     // { age: 42 }
console.log(nextState); // { age: 43 }
```

---

### Saya telah mendispatch sebuah action, tetapi layar tidak diperbarui {/*ive-dispatched-an-action-but-the-screen-doesnt-update*/}

React akan **mengabaikan pembaruan Anda jika state berikutnya sama dengan state sebelumnya,** seperti yang ditentukan oleh perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Hal ini biasanya terjadi ketika Anda mengubah sebuah objek atau sebuah array pada state secara langsung:

```js {4-5,9-10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // 🚩 Salah: mengubah objek yang sudah ada
      state.age++;
      return state;
    }
    case 'changed_name': {
      // 🚩 Salah: mengubah objek yang sudah ada
      state.name = action.nextName;
      return state;
    }
    // ...
  }
}
```

Anda mengubah objek `state` yang sudah ada dan mengembalikannya, sehingga React mengabaikan pembaruan tersebut. Untuk memperbaikinya, Anda harus memastikan bahwa Anda selalu [memperbarui objek dalam state](/learn/updating-objects-in-state) dan [memperbarui array dalam state](/learn/updating-arrays-in-state), bukannya memutasi objek tersebut:

```js {4-8,11-15}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ✅ Benar: membuat objek baru
      return {
        ...state,
        age: state.age + 1
      };
    }
    case 'changed_name': {
      // ✅ Benar: membuat objek baru
      return {
        ...state,
        name: action.nextName
      };
    }
    // ...
  }
}
```

---

### Bagian dari reducer state menjadi undefined setelah dispatching {/*a-part-of-my-reducer-state-becomes-undefined-after-dispatching*/}

Pastikan bahwa setiap cabang `case` **menyalin semua field yang ada** saat mengembalikan state yang baru:

```js {5}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      return {
        ...state, // Jangan lupakan ini!
        age: state.age + 1
      };
    }
    // ...
```

Tanpa `...state` di atas, state berikutnya yang dikembalikan hanya akan berisi field `age` dan tidak ada yang lain.

---

### Seluruh reducer state saya menjadi undefined setelah dispatching {/*my-entire-reducer-state-becomes-undefined-after-dispatching*/}

Jika state Anda secara tidak terduga menjadi `undefined`, kemungkinan Anda lupa untuk `return` state di salah satu case, atau action type Anda tidak sesuai dengan pernyataan `case` mana pun. Untuk mengetahui penyebabnya, buat Throw error di luar `switch`:

```js {10}
function reducer(state, action) {
  switch (action.type) {
    case 'incremented_age': {
      // ...
    }
    case 'edited_name': {
      // ...
    }
  }
  throw Error('Action tidak diketahui: ' + action.type);
}
```

Anda juga dapat menggunakan pemeriksa tipe statis seperti TypeScript untuk menangkap error tersebut.

---

### Saya mendapat error: "Too many re-renders" {/*im-getting-an-error-too-many-re-renders*/}

Anda mungkin akan mendapatkan pesan error yang berbunyi: `Too many re-renders. React limits the number of renders to prevent an infinite loop.` Biasanya, ini berarti Anda mendispatch sebuah action tanpa syarat *selama render*, sehingga komponen Anda masuk ke dalam perulangan: render, dispatch (yang menyebabkan render), dan seterusnya. Sering kali, hal ini disebabkan oleh kesalahan dalam menentukan event handler:

```js {1-2}
// 🚩 Salah: memanggil handler selama render
return <button onClick={handleClick()}>Klik aku</button>

// ✅ Benar: meneruskan event handler
return <button onClick={handleClick}>Klik aku</button>

// ✅ Benar: meneruskan fungsi sebaris
return <button onClick={(e) => handleClick(e)}>Klik aku</button>
```

Jika Anda tidak dapat menemukan penyebab error ini, klik tanda panah di samping error di konsol dan lihat tumpukan JavaScript untuk menemukan pemanggilan fungsi `dispatch` yang bertanggungjawab atas error tersebut.

---

### Fungsi reducer atau inisialisasi saya berjalan dua kali {/*my-reducer-or-initializer-function-runs-twice*/}

Pada [Strict Mode](/reference/react/StrictMode), React akan memanggil fungsi reducer dan inisialisasi dua kali. Hal ini seharusnya tidak akan merusak kode Anda.

Perilaku **development-only** ini membantu Anda [menjaga komponen tetap murni.](/learn/keeping-components-pure) React menggunakan hasil dari salah satu pemanggilan, dan mengabaikan hasil dari pemanggilan lainnya. Selama fungsi komponen, inisialisasi, dan reducer Anda murni, hal ini tidak akan mempengaruhi logika Anda. Namun, jika mereka tidak murni secara tidak sengaja, hal ini akan membantu Anda untuk mengetahui kesalahannya.

Sebagai contoh, fungsi reducer yang tidak murni ini mengubah sebuah array dalam state:

```js {4-6}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // 🚩 Kesalahan: mengubah state
      state.todos.push({ id: nextId++, text: action.text });
      return state;
    }
    // ...
  }
}
```

Karena React memanggil fungsi reducer dua kali, Anda akan melihat todo ditambahkan dua kali, sehingga Anda akan tahu bahwa ada kesalahan. Pada contoh ini, Anda dapat memperbaiki kesalahan dengan [mengganti array alih-alih melakukan mutasi](/learn/updating-arrays-in-state#adding-to-an-array):

```js {4-11}
function reducer(state, action) {
  switch (action.type) {
    case 'added_todo': {
      // ✅ Benar: mengganti dengan state baru
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: nextId++, text: action.text }
        ]
      };
    }
    // ...
  }
}
```

Karena fungsi reducer ini murni, maka memanggilnya sebagai waktu tambahan tidak akan membuat perbedaan pada perilakunya. Inilah sebabnya mengapa React memanggilnya dua kali akan membantu Anda menemukan kesalahan. **Hanya fungsi komponen, inisialisasi, dan reducer yang harus murni.** Event handler tidak perlu murni, sehingga React tidak akan pernah memanggil event handler dua kali.

Baca [menjaga komponen tetap murni](/learn/keeping-components-pure) untuk mempelajari lebih lanjut.
