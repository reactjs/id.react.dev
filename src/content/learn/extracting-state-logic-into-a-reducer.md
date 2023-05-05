---
title: Mengekstraksi Logika State ke Sebuah Reducer
---

<Intro>

Components with many state updates spread across many event handlers can get overwhelming. For these cases, you can consolidate all the state update logic outside your component in a single function, called a _reducer._

</Intro>

<YouWillLearn>

- Apa itu fungsi _reducer_
- Bagaimana cara untuk menuliskan kembali `useState` menjadi `useReducer`   
- Kapan menggunakan _reducer_
- Bagaimana cara menulis dengan baik

</YouWillLearn>

## Mengkonsolidasikan logika state menggunakan reducer {/*consolidate-state-logic-with-a-reducer*/}

Saat komponen-komponen Anda semakin kompleks, hal ini mengakibatkan berbagai cara memperbaharui state komponen dalam kode menjadi sulit untuk dilihat secara sekilas. Contoh, komponent `TaskApp` dibawah menyimpan senarai `tasks` dalam state dan menggunakan tiga _handler_ untuk menabahkan, menghapus dan menyunting tasks:

<Sandpack>

```js App.js
import { useState } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, setTasks] = useState(initialTasks);

  function handleAddTask(text) {
    setTasks([
      ...tasks,
      {
        id: nextId++,
        text: text,
        done: false,
      },
    ]);
  }

  function handleChangeTask(task) {
    setTasks(
      tasks.map((t) => {
        if (t.id === task.id) {
          return task;
        } else {
          return t;
        }
      })
    );
  }

  function handleDeleteTask(taskId) {
    setTasks(tasks.filter((t) => t.id !== taskId));
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Mengunjungi Museum Kafka', done: true},
  {id: 1, text: 'Tonton pertunjukan boneka', done: false},
  {id: 2, text: 'Foto Lennon Wall', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Setiap _event handler_ pada komponen `TaskApp` akan memangil `setTask` untuk melakukan pembaharuan _state_. Saat komponen ini bertumbuh besar, logika _state_ akan semakin rumit. Untuk mengurangi kompleksitas dan menyimpan semua logika Anda di satu tempat yang mudah diakses. Anda dapat memindahkan logika status tersebut ke dalam satu fungsi di luar komponen Anda, **disebut _"reducer"_.**

_Reducer_ merupakan sebuah alternatif untuk menangani _state_. Anda dapat migrasi dari `useState` ke `useReducer` dalam tiga langkah:

1. **Pindah** dari memanggil fungsi menetapkan _state_ menjadi aksi _dispatch_.
2. **Tulis** fungsi _reducer_.
3. **Gunakan** _reducer_ pada komponen Anda.

### Langkah 1: Pindah dari memanggil fungsi menetapkan state menjadi aksi dispatch {/*step-1-move-from-setting-state-to-dispatching-actions*/}

_Event handler_ Anda sekarang menentukan apa _yang harus dilakukan_ dengan memanggil menetapkan state:

```js
function handleAddTask(text) {
  setTasks([
    ...tasks,
    {
      id: nextId++,
      text: text,
      done: false,
    },
  ]);
}

function handleChangeTask(task) {
  setTasks(
    tasks.map((t) => {
      if (t.id === task.id) {
        return task;
      } else {
        return t;
      }
    })
  );
}

function handleDeleteTask(taskId) {
  setTasks(tasks.filter((t) => t.id !== taskId));
}
```

Hapus semua logika untuk mengatur _state_. Yang tersisa adalah tiga _event handlers_:

- `handleAddTask(text)` akan dipanggil ketika pengguna menekan tombol "Add".
- `handleChangeTask(task)` akan dipanggil ketika pengguna matikan sebuah task atau menekan tombol "Save".
- `handleDeleteTask(taskId)` akan dipanggil ketika pengguna menekan tombol "Delete".

Mengelola _state_ dengan fungsi _reducer_ sedikit berbeda dari memanggil fungsi untuk menetapkan _state_ secara langsung. Alih-alih memberi tahu React "apa yang harus dilakukan" dengan menetapkan _state_, Anda merincis "apa yang baru saja dilakukan pengguna" dengan mengirim "aksi" dari _event handler_ Anda. (Logika pembaruan _state_ akan berada di tempat lain!) Jadi, alih-alih "mengatur `tasks`" melalui _event handler_, Anda mengirim aksi "menambahkan/mengubah/menghapus task". Cara ini lebih deskriptif untuk mengetahui intensi pengguna.

```js
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
    task: task,
  });
}

function handleDeleteTask(taskId) {
  dispatch({
    type: 'deleted',
    id: taskId,
  });
}
```

Objek yang anda masukan ke `dispatch` dapat disebut dengan "aksi":

```js {3-7}
function handleDeleteTask(taskId) {
  dispatch(
    // obyek "aksi":
    {
      type: 'deleted',
      id: taskId,
    }
  );
}
```

Contoh diatas merupakan objek JavaScript biasa. Anda dapat menentukan objek apa yang akan dimasukkan ke dalamnya, tetapi umumnya harus berisi sebuah objek yang setidaknya berisi informasi _Apa yang terjadi_. (Anda akan menambahkan fungsi `dispatch` itu sendiri di langkah selanjutnya.)

<Note>

Objek aksi bisa memiliki berbagai macam bentuk.

Secara konvensi, umumnya objek aksi diberikan sebuah properti `type` bertipe _string_ yang menjelaskan aksi apa yang telah terjadi. Dan menambahkan informasi tambahan pada properti lainnya. Properti `type` ini khusus untuk komponen, maka untuk contoh ini nilai `'added'` atau `'added_task'` akan baik-baik saja diberikan pada properti `type`. Tentukan nama yang dapat menjelaskan aksi apa yang terjadi!

```js
dispatch({
  // khusus untuk komponen
  type: 'what_happened',
  // properti lain disini
});
```

</Note>

### Langkah 2: Tulis fungsi reducer {/*step-2-write-a-reducer-function*/}

Fungsi _reducer_ merupakan tempat dimana Anda meletakkan logika _state_. Fungsi _reducer_ menerima dua argumen yaitu _state_ sekarang dan object aksi, dan mengembalikan _state_ berikutnya:

```js
function yourReducer(state, action) {
  // mengembalikan state berikutnya untuk di tetapkan oleh React
}
```

React akan menetapkan _state_ yang dikembalikan oleh _reducer_ Anda.

Untuk memindahkan logika fungsi penetap _state_ dari _event handler_ Anda menjadi fungsi reducer pada contoh berikut, Anda akan:

1. Deklarasikan _state_(`tasks`) saat ini sebagai argumen pertama.
2. Deklarasikan objek `action` sebagai argumen kedua.
3. Mengembalikan _state_ berikutnya melalui reducer (di mana React akan mengatur statusnya).

Berikut merupakan logika funsi penetapan _state_ yang dimigrasikan ke fungsi _reducer_:

```js
function tasksReducer(tasks, action) {
  if (action.type === 'added') {
    return [
      ...tasks,
      {
        id: action.id,
        text: action.text,
        done: false,
      },
    ];
  } else if (action.type === 'changed') {
    return tasks.map((t) => {
      if (t.id === action.task.id) {
        return action.task;
      } else {
        return t;
      }
    });
  } else if (action.type === 'deleted') {
    return tasks.filter((t) => t.id !== action.id);
  } else {
    throw Error('Unknown action: ' + action.type);
  }
}
```
Karena fungsi _reducer_ menerima _state_ (`tasks`) sebagai sebuah argument, **Anda dapat mendeklarisikannya di luar komponen Anda.** Dengan ini kode yang Anda tulis tingkat indentasinya akan berkurang dan akan lebih mudah di baca.

<Note>

Kode di atas menggunakan pernyataan _if/else_, namun secara konvensi ketika menggunakan fungsi reducer Anda harus menggunakan [pernyataan _switch_](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/switch) pada fungsi tersebut. Secara hasil akan sama, tetapi akan lebih mudah dibaca secara sekilas.


Kami akan menggunakan pernyataan _switch_ sepanjang sisa dokumentasi ini seperti berikut:

```js
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

Kami merekomendasikan sebaiknya menggabungkan masing-masing blok `case` ke dalam kurung kurawal `{` dan `}` sehingga variabel yang dideklarasikan di dalam `case` berbeda tidak bentrok satu sama lain. Dan juga, sebuah `case` biasanya diakhiri dengan `return`. Jika Anda lupa mengakhiri dengan `return`, kode akan lanjut ke `case` berikutnya, yang akan menyebabkan keselahan.

Jika Anda belum nyaman menggunakan pernyataan _switch_, menggunakan pernyataan _if/else_ itu tidak apa-apa.

</Note>

<DeepDive>

#### Mengapa fungsi _reducer_ disebut seperti ini? {/*why-are-reducers-called-this-way*/}

Meskipun reducer dapat "mengurangi" jumlah kode di dalam komponen Anda, sebenarnya mereka dinamakan setelah operasi [`reduce()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce) yang dapat dilakukan pada senarai.

Operasi `reduce()` memungkinkan Anda untuk mengambil sebuah senarai dan "mengakumulasi" sebuah nilai tunggal dari banyak nilai:

```
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce(
  (result, number) => result + number
); // 1 + 2 + 3 + 4 + 5
```

Fungsi yang Anda berikan ke `reduce` dikenal sebagai "reducer". Fungsi tersebut mengambil _hasil sejauh ini_ dan _item saat ini_, kemudian mengembalikan _hasil berikutnya_. _Reducer_ di React adalah contoh dari ide yang sama: mereka mengambil _state sejauh ini_ dan _aksi_, lalu mengembalikan state berikutnya. Dengan cara ini, _reducer_ mengakumulasi aksi dari waktu ke waktu ke dalam _state_.

Anda bahkan dapat menggunakan metode `reduce()` dengan `initialState` dan sebuah senarai `aksi` untuk menghitung state akhir dengan melewatkan fungsi _reducer_ ke dalamnya:

<Sandpack>

```js index.js active
import tasksReducer from './tasksReducer.js';

let initialState = [];
let actions = [
  {type: 'added', id: 1, text: 'Visit Kafka Museum'},
  {type: 'added', id: 2, text: 'Watch a puppet show'},
  {type: 'deleted', id: 1},
  {type: 'added', id: 3, text: 'Lennon Wall pic'},
];

let finalState = actions.reduce(tasksReducer, initialState);

const output = document.getElementById('output');
output.textContent = JSON.stringify(finalState, null, 2);
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```html public/index.html
<pre id="output"></pre>
```

</Sandpack>

Anda mungkin tidak perlu melakukannya sendiri, tetapi ini mirip dengan apa yang dilakukan oleh React!

</DeepDive>

### Langkah 3: Gunakan reducer pada komponen Anda {/*step-3-use-the-reducer-from-your-component*/}

Terakhir, Anda perlu menghubungkan `tasksReducer` ke komponen Anda. Impor _Hook_ `useReducer` dari React:

```js
import { useReducer } from 'react';
```

Kemudian Anda dapat mengganti `useState`:

```js
const [tasks, setTasks] = useState(initialTasks);
```

dengan `useReducer` seperti ini:

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

Hook `useReducer` mirip dengan `useState` — Anda harus melewatkan state awal ke dalamnya dan ia mengembalikan nilai _stateful_ dan cara untuk mengatur _state_ (dalam kasus ini, fungsi _dispatch_). Namun, sedikit berbeda.

_Hook_ `useReducer` mengambil dua argumen:

1. Fungsi _reducer_
2. _State_ awal

Dan _hook_ `useReducer` mengembalikan:

1. Nilai _stateful_
2. Fungsi _dispatch_ (untuk "men-dispatch" aksi pengguna ke _reducer_)

Sekarang fungsi _reducer_ sudah sepenuhnya terhubung! Di sini, _reducer_ dinyatakan di bagian bawah file komponen:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onChangeTask={handleChangeTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
}

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Hal ini opsional, namun jika Anda ingin, Anda bahkan dapat memindahkan reducer ke file yang berbeda:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import tasksReducer from './tasksReducer.js';

export default function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js tasksReducer.js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
}
```

</Sandpack>

Logika komponen dapat lebih mudah dibaca ketika Anda memisahkan aspek seperti ini. Sekarang, handler acara hanya menentukan _apa yang terjadi_ dengan mengirimkan aksi, dan fungsi reducer menentukan _bagaimana state diperbarui_ sebagai respons terhadapnya.

## Membandingkan `useState` dan `useReducer` {/*comparing-usestate-and-usereducer*/}

_Reducers_ tidaklah tanpa kekurangan! Berikut adalah beberapa cara untuk membandingkannya:

- **Ukuran kode:** Secara umum, dengan `useState` kamu harus menulis lebih sedikit kode di awal. Dengan `useReducer`, kamu harus menulis baik fungsi reducer _dan_ dispatch actions. Namun, `useReducer` dapat membantu mengurangi jumlah kode jika banyak event handler memodifikasi state dengan cara yang serupa.
- **Keterbacaan:** `useState` sangat mudah dibaca ketika pembaruan state sederhana. Ketika pembaruan semakin kompleks, mereka dapat membesarkan kode komponen dan sulit untuk dipindai. Dalam hal ini, `useReducer` memungkinkan kamu untuk memisahkan dengan jelas _bagaimana_ logika pembaruan dipisahkan dari _apa yang terjadi_ pada _event handler_.
- **Debugging:** Ketika kamu memiliki bug dengan `useState`, sulit untuk mengetahui di mana state diatur dengan tidak benar, dan mengapa. Dengan `useReducer`, kamu dapat menambahkan log konsol ke reducer kamu untuk melihat setiap pembaruan state, dan _mengapa_ itu terjadi (karena `aksi` apa). Jika setiap `aksi` benar, kamu akan tahu bahwa kesalahan ada di logika reducer itu sendiri. Namun, kamu harus melalui kode yang lebih banyak daripada `useState`.
- **Testing:** Sebuah reducer adalah fungsi murni yang tidak bergantung pada komponen kamu. Ini berarti kamu dapat mengekspor dan mengujinya secara terpisah dalam isolasi. Meskipun secara umum lebih baik untuk menguji komponen dalam lingkungan yang lebih realistis, untuk logika pembaruan state yang kompleks dapat berguna untuk menegaskan bahwa reducer kamu mengembalikan state tertentu untuk initialState dan action tertentu.
- **Preferensi pribadi:** Beberapa orang suka reducers, yang lain tidak. Itu oke. Ini adalah masalah preferensi. Kamu selalu dapat mengonversi antara `useState` dan `useReducer` bolak-balik: mereka setara!

Kami merekomendasikan menggunakan reducer jika kamu sering menghadapi bug karena pembaruan state yang salah di beberapa komponen, dan ingin memperkenalkan lebih banyak struktur pada kode-nya. Kamu tidak harus menggunakan reducers untuk semuanya: bebas untuk mencampur dan mencocokkan! Kamu bahkan dapat menggunakan `useState` dan `useReducer` di komponen yang sama.

## Menulis fungsi reduksi dengan baik {/*writing-reducers-well*/}

Keep these two tips in mind when writing reducers:

- **Reducer harus murni (pure).** Sama seperti [fungsi updater state](/learn/queueing-a-series-of-state-updates), reducer dijalankan selama proses rendering! (Aksi diantre sampai render selanjutnya.) Ini berarti bahwa reducer [harus murni](/learn/keeping-components-pure) - input yang sama selalu menghasilkan output yang sama. Mereka tidak boleh mengirim permintaan, menjadwalkan waktu tunggu, atau melakukan efek samping (operasi yang memengaruhi hal-hal di luar komponen). Mereka harus memperbarui [objek](/learn/updating-objects-in-state) dan [senarai](/learn/updating-arrays-in-state) tanpa mutasi.
- **Setiap aksi menjelaskan satu interaksi pengguna, meskipun itu mengakibatkan beberapa perubahan pada data.** Sebagai contoh, jika pengguna menekan "Reset" pada formulir dengan lima field yang dikelola oleh reducer, lebih baik untuk mengirimkan satu aksi `reset_form` daripada lima aksi `set_field` terpisah. Jika Anda mencatat setiap aksi dalam reducer, log tersebut harus cukup jelas bagi Anda untuk merekonstruksi interaksi atau respon apa yang terjadi dalam urutan apa. Ini membantu dalam proses debugging!

## Menulis Reducer yang singkat dengan Immer {/*writing-concise-reducers-with-immer*/}

Sama seperti [memperbarui objek](/learn/updating-objects-in-state#write-concise-update-logic-with-immer) dan [array](/learn/updating-arrays-in-state#write-concise-update-logic-with-immer) pada state biasa, Anda dapat menggunakan pustaka Immer untuk membuat reducer lebih ringkas. Di sini, [`useImmerReducer`](https://github.com/immerjs/use-immer#useimmerreducer) memungkinkan Anda memutasi state dengan `push` atau `arr[i] =` assignment:

<Sandpack>

```js App.js
import { useImmerReducer } from 'use-immer';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

function tasksReducer(draft, action) {
  switch (action.type) {
    case 'added': {
      draft.push({
        id: action.id,
        text: action.text,
        done: false,
      });
      break;
    }
    case 'changed': {
      const index = draft.findIndex((t) => t.id === action.task.id);
      draft[index] = action.task;
      break;
    }
    case 'deleted': {
      return draft.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export default function TaskApp() {
  const [tasks, dispatch] = useImmerReducer(tasksReducer, initialTasks);

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
      task: task,
    });
  }

  function handleDeleteTask(taskId) {
    dispatch({
      type: 'deleted',
      id: taskId,
    });
  }

  return (
    <>
      <h1>Prague itinerary</h1>
      <AddTask onAddTask={handleAddTask} />
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
  {id: 0, text: 'Visit Kafka Museum', done: true},
  {id: 1, text: 'Watch a puppet show', done: false},
  {id: 2, text: 'Lennon Wall pic', done: false},
];
```

```js AddTask.js hidden
import { useState } from 'react';

export default function AddTask({onAddTask}) {
  const [text, setText] = useState('');
  return (
    <>
      <input
        placeholder="Add task"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={() => {
          setText('');
          onAddTask(text);
        }}>
        Add
      </button>
    </>
  );
}
```

```js TaskList.js hidden
import { useState } from 'react';

export default function TaskList({tasks, onChangeTask, onDeleteTask}) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          <Task task={task} onChange={onChangeTask} onDelete={onDeleteTask} />
        </li>
      ))}
    </ul>
  );
}

function Task({task, onChange, onDelete}) {
  const [isEditing, setIsEditing] = useState(false);
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={(e) => {
            onChange({
              ...task,
              text: e.target.value,
            });
          }}
        />
        <button onClick={() => setIsEditing(false)}>Save</button>
      </>
    );
  } else {
    taskContent = (
      <>
        {task.text}
        <button onClick={() => setIsEditing(true)}>Edit</button>
      </>
    );
  }
  return (
    <label>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => {
          onChange({
            ...task,
            done: e.target.checked,
          });
        }}
      />
      {taskContent}
      <button onClick={() => onDelete(task.id)}>Delete</button>
    </label>
  );
}
```

```css
button {
  margin: 5px;
}
li {
  list-style-type: none;
}
ul,
li {
  margin: 0;
  padding: 0;
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

Reducers harus bersifat pure, sehingga tidak boleh mengubah state. Tetapi Immer memberikan objek khusus `draft` yang aman untuk dimutasi. Di bawah kap mesin, Immer akan membuat salinan dari state Anda dengan perubahan yang dibuat pada `draft`. Inilah sebabnya mengapa reducer yang dikelola oleh `useImmerReducer` dapat memutasi argumen pertama mereka dan tidak perlu mengembalikan state.

<Recap>

- Untuk mengkonversi dari `useState` ke `useReducer`:
  1. Kirim aksi dari _event handler_.
  2. Tulis fungsi _reducer_ yang mengembalikan state selanjutnya untuk state dan aksi yang diberikan.
  3. Ganti `useState` dengan `useReducer`.
- Reducer membutuhkan Anda untuk menulis sedikit lebih banyak kode, tetapi membantu dengan debugging dan pengujian.
- Reducer harus murni.
- Setiap aksi menggambarkan satu interaksi pengguna.
- Gunakan Immer jika Anda ingin menulis reducer dalam gaya yang dapat dimutasi.

</Recap>

<Challenges>

#### Meneruskan aksi dari event handlers {/*dispatch-actions-from-event-handlers*/}

Meneruskan tindakan dari penangan acara

Saat ini, penangan acara di `ContactList.js` dan `Chat.js` memiliki komentar `// TODO`. Inilah mengapa mengetik ke input tidak berfungsi, dan mengklik tombol tidak mengubah penerima yang dipilih.

Gantikan dua `// TODO` ini dengan kode untuk `meneruskan` tindakan yang sesuai. Untuk melihat bentuk yang diharapkan dan jenis tindakan, periksa pengurang dalam `messengerReducer.js`. Pengurang sudah ditulis sehingga Anda tidak perlu mengubahnya. Anda hanya perlu meneruskan tindakan di `ContactList.js` dan `Chat.js`.

<Hint>

Fungsi `dispatch` sudah tersedia di kedua komponen ini karena telah dilewatkan sebagai prop. Jadi, Anda perlu memanggil `dispatch` dengan objek tindakan yang sesuai.

Untuk memeriksa bentuk objek tindakan, Anda dapat melihat reducer dan melihat bidang `action` apa yang diharapkan. Misalnya, kasus `changed_selection` dalam reducer terlihat seperti ini:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId
  };
}
```
Ini berarti bahwa objek aksi Anda harus memiliki `type: 'changed_selection'`. Anda juga melihat penggunaan `action.contactId`, sehingga Anda perlu menyertakan properti `contactId` ke dalam aksi Anda.

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                // TODO: dispatch changed_selection
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          // TODO: dispatch edited_message
          // (Read the input value from e.target.value)
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Dari kode reducer, kamu dapat menyimpulkan bahwa tampilan aksi seperti ini:

```js
// When the user presses "Alice"
dispatch({
  type: 'changed_selection',
  contactId: 1,
});

// When user types "Hello!"
dispatch({
  type: 'edited_message',
  message: 'Hello!',
});
```

Berikut adalah contoh yang diperbarui untuk mengirimkan pesan yang sesuai:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

</Solution>

#### Kosongkan input setelah mengirim pesan {/*clear-the-input-on-sending-a-message*/}

Saat ini, menekan tombol "Kirim" tidak melakukan apa-apa. Tambahkan handler acara ke tombol "Kirim" yang akan:

1. Menampilkan `alert` dengan email penerima dan pesan.
2. Membersihkan input pesan.

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button>Send to {contact.email}</button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Ada beberapa cara yang dapat Anda lakukan pada event handler tombol "Kirim". Salah satu pendekatan yang bisa digunakan adalah menampilkan sebuah alert dan kemudian melewatkan aksi `edited_message` dengan `message` kosong:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'edited_message',
            message: '',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Ini bekerja dan menghapus input saat Anda mengklik "Kirim".

Namun, _dari perspektif pengguna_, mengirim pesan adalah tindakan yang berbeda dengan mengedit kolom input. Untuk mencerminkan hal tersebut, Anda dapat membuat tindakan _baru_ yang disebut `sent_message`, dan menanganinya secara terpisah di reducer:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js active
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js active
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Perilaku hasilnya sama. Namun, perlu diingat bahwa jenis tindakan sebaiknya menjelaskan "apa yang dilakukan pengguna" daripada "bagaimana Anda ingin mengubah status". Ini memudahkan untuk menambahkan fitur lebih lanjut di kemudian hari.

Dengan salah satu solusi tersebut, penting bahwa Anda **tidak** menempatkan `alert` di dalam reducer. Reducer harus menjadi fungsi murni - hanya menghitung status selanjutnya. Ini tidak boleh "melakukan" apa pun, termasuk menampilkan pesan ke pengguna. Itu harus terjadi di event handler. (Untuk membantu menangkap kesalahan seperti ini, React akan memanggil reducer Anda beberapa kali di Strict Mode. Ini sebabnya, jika Anda menempatkan alert dalam reducer, alert itu akan muncul dua kali.)

</Solution>

#### Memulihkan nilai input saat beralih antar tab {/*restore-input-values-when-switching-between-tabs*/}

Pada contoh ini, beralih antara penerima yang berbeda selalu menghapus input teks:

```js
case 'changed_selection': {
  return {
    ...state,
    selectedId: action.contactId,
    message: '' // Clears the input
  };
```

Ini karena Anda tidak ingin membagikan draf pesan tunggal di antara beberapa penerima. Namun, lebih baik jika aplikasi Anda "mengingat" draf untuk setiap kontak secara terpisah, mengembalikannya saat Anda beralih kontak.

Tugas Anda adalah mengubah cara struktur state sehingga Anda mengingatkan draf pesan terpisah per kontak. Anda perlu melakukan beberapa perubahan pada reducer, state awal, dan komponen.

<Hint>

Anda dapat strukturkan state Anda seperti ini:

```js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor', // Draft for contactId = 0
    1: 'Hello, Alice', // Draft for contactId = 1
  },
};
```

Syntax `[key]: value` [properti terhitung](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names) dapat membantu Anda memperbarui objek `messages`:

```js
{
  ...state.messages,
  [id]: message
}
```

</Hint>

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.message;
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  message: 'Hello',
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
        message: '',
      };
    }
    case 'edited_message': {
      return {
        ...state,
        message: action.message,
      };
    }
    case 'sent_message': {
      return {
        ...state,
        message: '',
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Anda perlu memperbarui reducer untuk menyimpan dan memperbarui draft pesan terpisah untuk setiap kontak:

```js
// When the input is edited
case 'edited_message': {
  return {
    // Keep other state like selection
    ...state,
    messages: {
      // Keep messages for other contacts
      ...state.messages,
      // But change the selected contact's message
      [state.selectedId]: action.message
    }
  };
}
```

Anda juga harus memperbarui komponen `Messenger` untuk membaca pesan untuk kontak yang sedang dipilih:

```js
const message = state.messages[state.selectedId];
```

Inilah solusi lengkapnya:

<Sandpack>

```js App.js
import { useReducer } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js ContactList.js
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Anda tidak perlu mengubah event handler mana pun untuk mengimplementasikan perilaku yang berbeda ini. Tanpa pengurang, Anda harus mengubah setiap event handler yang memperbarui state.

</Solution>

#### Menerapkan `useReducer` dari awal {/*implement-usereducer-from-scratch*/}

Pada contoh sebelumnya, Anda mengimpor Hook `useReducer` dari React. Kali ini, Anda akan mengimplementasikan Hook `useReducer` itu sendiri! Berikut adalah kerangka kode untuk memulai. Ini tidak memerlukan lebih dari 10 baris kode.

Untuk menguji perubahan Anda, coba ketik ke input atau pilih kontak.

<Hint>

Berikut adalah gambaran implementasi yang lebih detail:

```js
export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    // ???
  }

  return [state, dispatch];
}
```

Ingat bahwa sebuah fungsi reducer memiliki dua argumen--state saat ini dan objek action--dan mengembalikan state berikutnya. Apa yang seharusnya dilakukan oleh implementasi `dispatch` Anda dengannya?

</Hint>

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  // ???

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

<Solution>

Mengirimkan aksi akan memanggil reducer dengan state saat ini dan aksi tersebut, dan menyimpan hasilnya sebagai state berikutnya. Ini adalah contoh kodenya:

<Sandpack>

```js App.js
import { useReducer } from './MyReact.js';
import Chat from './Chat.js';
import ContactList from './ContactList.js';
import { initialState, messengerReducer } from './messengerReducer';

export default function Messenger() {
  const [state, dispatch] = useReducer(messengerReducer, initialState);
  const message = state.messages[state.selectedId];
  const contact = contacts.find((c) => c.id === state.selectedId);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedId={state.selectedId}
        dispatch={dispatch}
      />
      <Chat
        key={contact.id}
        message={message}
        contact={contact}
        dispatch={dispatch}
      />
    </div>
  );
}

const contacts = [
  {id: 0, name: 'Taylor', email: 'taylor@mail.com'},
  {id: 1, name: 'Alice', email: 'alice@mail.com'},
  {id: 2, name: 'Bob', email: 'bob@mail.com'},
];
```

```js messengerReducer.js
export const initialState = {
  selectedId: 0,
  messages: {
    0: 'Hello, Taylor',
    1: 'Hello, Alice',
    2: 'Hello, Bob',
  },
};

export function messengerReducer(state, action) {
  switch (action.type) {
    case 'changed_selection': {
      return {
        ...state,
        selectedId: action.contactId,
      };
    }
    case 'edited_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: action.message,
        },
      };
    }
    case 'sent_message': {
      return {
        ...state,
        messages: {
          ...state.messages,
          [state.selectedId]: '',
        },
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}
```

```js MyReact.js active
import { useState } from 'react';

export function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

```js ContactList.js hidden
export default function ContactList({contacts, selectedId, dispatch}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            <button
              onClick={() => {
                dispatch({
                  type: 'changed_selection',
                  contactId: contact.id,
                });
              }}>
              {selectedId === contact.id ? <b>{contact.name}</b> : contact.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

```js Chat.js hidden
import { useState } from 'react';

export default function Chat({contact, message, dispatch}) {
  return (
    <section className="chat">
      <textarea
        value={message}
        placeholder={'Chat to ' + contact.name}
        onChange={(e) => {
          dispatch({
            type: 'edited_message',
            message: e.target.value,
          });
        }}
      />
      <br />
      <button
        onClick={() => {
          alert(`Sending "${message}" to ${contact.email}`);
          dispatch({
            type: 'sent_message',
          });
        }}>
        Send to {contact.email}
      </button>
    </section>
  );
}
```

```css
.chat,
.contact-list {
  float: left;
  margin-bottom: 20px;
}
ul,
li {
  list-style: none;
  margin: 0;
  padding: 0;
}
li button {
  width: 100px;
  padding: 10px;
  margin-right: 10px;
}
textarea {
  height: 150px;
}
```

</Sandpack>

Meskipun tidak terlalu penting dalam kebanyakan kasus, implementasi yang sedikit lebih akurat terlihat seperti ini:

```js
function dispatch(action) {
  setState((s) => reducer(s, action));
}
```

Ini karena tindakan yang dipicu akan diantre sampai render berikutnya, serupa dengan fungsi updater.

</Solution>

</Challenges>
