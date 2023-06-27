---
title: Mengelola State
---

<Intro>

Seiring berkembangnya aplikasi Anda, penting untuk memperhatikan bagaimana *state* Anda diatur dan memperhatikan bagaimana data mengalir diantara komponen-komponen yang ada. *State* yang redundan atau duplikat adalah sumber dari *bug* dikemudian hari. Dalam babak ini, Anda akan belajar bagaimana menata *state* dengan baik, bagaimana menjaga logika pembaruan *state* agar mudah dikelola, dan bagaimana Anda dapat berbagi *state* dengan komponen yang berjauhan.

</Intro>

<YouWillLearn isChapter={true}>

* [Bagaimana memikirkan perubahan UI sebagai perubahan *state*](/learn/reacting-to-input-with-state)
* [Bagaimana mengatur *state* dengan baik](/learn/choosing-the-state-structure)
* [Bagaimana "menjunjung *state*" untuk dibagikan ke komponen lain](/learn/sharing-state-between-components)
* [Bagaimana menentukan apakah *state* akan dipertahankan atau dimusnahkan](/learn/preserving-and-resetting-state)
* [Bagaimana menggabungkan logika *state* yang kompleks dalam sebuah fungsi](/learn/extracting-state-logic-into-a-reducer)
* [Bagaimana mengirimkan informasi tanpa "*prop drilling*"](/learn/passing-data-deeply-with-context)
* [Bagaimana meningkatkan manajemen *state* saat aplikasi masih dikembangkan](/learn/scaling-up-with-reducer-and-context)

</YouWillLearn>

## Merespon masukan dengan *State* {/*reacting-to-input-with-state*/}

Dalam React, Anda tidak perlu mengubah kode secara langsung untuk mengubah antar muka (UI). Misalnya, menulis baris perintah "nonaktifkan tombol ketika", "aktifkan tombol ketika", "tampilkan pesan sukses ketika", dll disetiap baris. Melainkan, cukup menggambarkan antar muka yang ingin ditampilkan sebagai *states* visual dari komponen Anda ("*state* awal", "*state* mengetik", "*state* sukses"), dan kemudian memicu perubahan *state* sebagai respons terhadap masukan pengguna. Sekilas mirip dengan bagaimana desainer merencanakan antar muka.

Berikut contoh formulir kuis yang dibangun menggunakan React. Perhatikan bagaimana ia menggunakan variabel *state* `status` untuk menentukan apakah tombol kirim diaktifkan atau dinonaktifkan, dan apakah pesan sukses ditampilkan sebagai gantinya.

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>Itu Benar!</h1>
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');
    try {
      await submitForm(answer);
      setStatus('success');
    } catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
  }

  return (
    <>
      <h2>Kuis Kota</h2>
      <p>
        Di kota manakah terdapat papan reklame yang mengubah udara menjadi air minum?
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          onChange={handleTextareaChange}
          disabled={status === 'submitting'}
        />
        <br />
        <button disabled={
          answer.length === 0 ||
          status === 'submitting'
        }>
          Submit
        </button>
        {error !== null &&
          <p className="Error">
            {error.message}
          </p>
        }
      </form>
    </>
  );
}

function submitForm(answer) {
  // Pretend it's hitting the network.
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      let shouldError = answer.toLowerCase() !== 'lima'
      if (shouldError) {
        reject(new Error('Tebakan yang bagus tetapi jawaban salah. Silahkan coba lagi!'));
      } else {
        resolve();
      }
    }, 1500);
  });
}
```

```css
.Error { color: red; }
```

</Sandpack>

<LearnMore path="/learn/reacting-to-input-with-state">

Baca **[Reacting to Input with State](/learn/reacting-to-input-with-state)** untuk belajar bagaimana mendekati interaksi dengan mindset yang didorong oleh *state*.

</LearnMore>

## Memilih Struktur *State* {/*choosing-the-state-structure*/}

Mengatur struktur *state* dengan baik dapat membuat perbedaan antara komponen yang mudah dimodifikasi dan didebug, dan komponen yang selalu menjadi sumber kesalahan. Perlu dicatat bahwa *state* tidak boleh mengandung informasi yang tidak perlu atau duplikat. Karena jika ada *state* yang tidak perlu, mudah untuk lupa memperbarui *state* tersebut, yang akhirnya memperkenalkan masalah baru!

Misalnya, formulir ini memiliki variabel *state* `fullName` yang **redundan**:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fullName, setFullName] = useState('');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
    setFullName(e.target.value + ' ' + lastName);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
    setFullName(firstName + ' ' + e.target.value);
  }

  return (
    <>
      <h2>Izinkan kami memeriksa Anda</h2>
      <label>
        Nama depan:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Tiket Anda akan diberikan kepada: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Anda dapat menghapus dan menyederhanakan kode dengan menghitung `fullName` saat komponen di-*render*:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName;

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Izinkan kami memeriksa Anda</h2>
      <label>
        Nama depan:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Nama belakang:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Tiket Anda akan diberikan kepada: <b>{fullName}</b>
      </p>
    </>
  );
}
```

```css
label { display: block; margin-bottom: 5px; }
```

</Sandpack>

Sekilas seperti perubahan sepele, tetapi umumnya cara ini banyak memperbaiki bug yang ada pada aplikasi React.

<LearnMore path="/learn/choosing-the-state-structure">

Baca **[Choosing the State Structure](/learn/choosing-the-state-structure)** untuk belajar cara merancang bentuk *state* untuk menghindari kesalahan (*bugs*).

</LearnMore>

## Berbagi *State* Antar Komponen {/*sharing-state-between-components*/}

Terkadang, Anda ingin *state* dari dua komponen yang berbeda selalu berubah bersama. Untuk melakukannya, hapus *state* dari keduanya, pindahkan *state* tersebut ke bagian induk (*parent*) yang paling berdekatan, dan kemudian teruskan ke kedua komponen melalui *props*. Hal ini dikenal sebagai "menjunjung *state*" (*lifting state up*), dan ini adalah salah satu hal lumrah saat menulis kode React.

Pada contoh ini, dalam satu waktu hanya akan ada satu panel yang aktif. Untuk mencapainya, daripada menyimpan *state* aktif di setiap panel secara individu, komponen induk menyimpan *state* dan menentukan *props* untuk anak-anaknya.

<Sandpack>

```js
import { useState } from 'react';

export default function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <h2>Almaty, Kazakhstan</h2>
      <Panel
        title="About"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Dengan populasi sekitar 2 juta orang, Almaty adalah kota terbesar di Kazakhstan. Dari tahun 1929 hingga 1997, kota ini menjadi ibu kota Kazakhstan.
      </Panel>
      <Panel
        title="Etymology"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Nama "Almaty" berasal dari kata <span lang="kk-KZ">алма</span>,dalam bahasa Kazakh yang berarti "apel"dan sering diterjemahkan sebagai "penuh dengan apel". Sebenarnya, wilayah sekitar Almaty dipercaya sebagai asal usul apel, dan <i lang="la">Malus sieversii</i> liar dianggap sebagai kandidat yang mungkin menjadi nenek moyang apel domestik modern.
      </Panel>
    </>
  );
}

function Panel({
  title,
  children,
  isActive,
  onShow
}) {
  return (
    <section className="panel">
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>
          Tampilkan
        </button>
      )}
    </section>
  );
}
```

```css
h3, p { margin: 5px 0px; }
.panel {
  padding: 10px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/sharing-state-between-components">

Baca **[Berbagi *State* Antar Komponen](/learn/sharing-state-between-components)** untuk mempelajari cara mengangkat *state* ke atas dan menjaga sinkronisasi antar komponen.

</LearnMore>

## Mempertahankan dan Mengatur Ulang *State* {/*preserving-and-resetting-state*/}

Saat Anda me-*render* ulang sebuah komponen, React perlu memutuskan bagian pohon mana yang dipertahankan (dan diperbarui), serta bagian mana yang harus dibuang atau dibuat kembali dari awal. Pada kebanyakan kasus, perilaku otomatis React ini sudah cukup baik. Secara *default*, React akan mempertahankan bagian-bagian pohon yang "cocok" dengan struktur pohon yang sebelumnya telah di-*render*.

Namun, ada kalanya hal ini bukan yang Anda harapkan. Dalam contoh aplikasi obrolan ini, ketika Anda mengetik pesan dan kemudian mengubah penerima pesan, itu tidak mengatur ulang bidang masukan yang ada. Hal ini bisa membuat pengguna secara tidak sengaja mengirim pesan ke orang yang salah:

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Mengobrol dengan ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Kirim ke {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

React memungkinkan Anda untuk mengesampingkan perilaku *default*, dan *memaksa* sebuah komponen untuk mengatur ulang statusnya (*state*) dengan memberikan `key` yang berbeda, seperti `<Chat key={email} />`. Hal ini memberitahu React bahwa jika penerima berbeda, itu harus dianggap sebagai komponen `Chat` yang *berbeda* yang perlu dibuat kembali dari awal dengan data (dan UI seperti input) yang baru. Sekarang, beralih antara penerima mengatur ulang input - meskipun Anda me-*render* komponen yang sama.

<Sandpack>

```js App.js
import { useState } from 'react';
import Chat from './Chat.js';
import ContactList from './ContactList.js';

export default function Messenger() {
  const [to, setTo] = useState(contacts[0]);
  return (
    <div>
      <ContactList
        contacts={contacts}
        selectedContact={to}
        onSelect={contact => setTo(contact)}
      />
      <Chat key={to.email} contact={to} />
    </div>
  )
}

const contacts = [
  { name: 'Taylor', email: 'taylor@mail.com' },
  { name: 'Alice', email: 'alice@mail.com' },
  { name: 'Bob', email: 'bob@mail.com' }
];
```

```js ContactList.js
export default function ContactList({
  selectedContact,
  contacts,
  onSelect
}) {
  return (
    <section className="contact-list">
      <ul>
        {contacts.map(contact =>
          <li key={contact.email}>
            <button onClick={() => {
              onSelect(contact);
            }}>
              {contact.name}
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
```

```js Chat.js
import { useState } from 'react';

export default function Chat({ contact }) {
  const [text, setText] = useState('');
  return (
    <section className="chat">
      <textarea
        value={text}
        placeholder={'Mengobrol dengan ' + contact.name}
        onChange={e => setText(e.target.value)}
      />
      <br />
      <button>Kirim ke {contact.email}</button>
    </section>
  );
}
```

```css
.chat, .contact-list {
  float: left;
  margin-bottom: 20px;
}
ul, li {
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

<LearnMore path="/learn/preserving-and-resetting-state">

Baca **[Preserving and Resetting State](/learn/preserving-and-resetting-state)** untuk mempelajari masa hidup status dan cara mengendalikannya.

</LearnMore>

## Mengekstrak logika *State* ke dalam *Reducer* {/*extracting-state-logic-into-a-reducer*/}

Komponen dengan banyak pembaruan *state* yang tersebar di banyak *event handler* dapat menjadi sangat membingungkan. Untuk kasus-kasus ini, Anda dapat mengkonsolidasikan semua logika pembaruan *state* di luar komponen Anda dalam sebuah fungsi tunggal, yang disebut "*reducer*". *Event handler* Anda menjadi lebih ringkas karena hanya menentukan "aksi" pengguna. Di bagian bawah file, fungsi reducer menentukan bagaimana *state* harus diperbarui sebagai respons terhadap setiap aksi!

<Sandpack>

```js App.js
import { useReducer } from 'react';
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';

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
      throw Error('Unknown action: ' + action.type);
    }
  }
}

let nextId = 3;
const initialTasks = [
  { id: 0, text: 'Mengunjungi Musium Kafka', done: true },
  { id: 1, text: 'Menonton Pertujukan Boneka', done: false },
  { id: 2, text: 'Foto Tembok Lennon', done: false }
];
```

```js AddTask.js hidden
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

```js TaskList.js hidden
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
          Sunting
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

<LearnMore path="/learn/extracting-state-logic-into-a-reducer">

Baca **[Extracting State Logic into a Reducer](/learn/extracting-state-logic-into-a-reducer)** untuk mempelajari cara mengkonsolidasikan logika dalam fungsi reducer.

</LearnMore>

## Melewatkan data secara dalam dengan *Context* {/*passing-data-deeply-with-context*/}

Biasanya, Anda akan melewatkan informasi dari komponen induk ke komponen anak (*children*) melalui *props*. Namun, melewatkan *props* dapat menjadi merepotkan jika Anda perlu melewatkan beberapa *prop* melalui banyak komponen, atau jika banyak komponen membutuhkan informasi yang sama. *Context* memungkinkan komponen induk membuat beberapa informasi tersedia untuk setiap komponen di bawahnya—tidak peduli seberapa dalam itu—tanpa melewatkan secara eksplisit melalui *props*.

Di sini, komponen `Heading` menentukan tingkat judulnya dengan "bertanya" pada `Section` terdekat untuk tingkatnya. Setiap `Section` melacak tingkatnya sendiri dengan bertanya pada `Section` induk dan menambahkan satu. Setiap `Section` menyediakan informasi kepada semua komponen di bawahnya tanpa melewatkan *props*—itu dilakukan melalui *context*.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Judul</Heading>
      <Section>
        <Heading>Judul</Heading>
        <Heading>Judul</Heading>
        <Heading>Judul</Heading>
        <Section>
          <Heading>Sub-judul</Heading>
          <Heading>Sub-judul</Heading>
          <Heading>Sub-judul</Heading>
          <Section>
            <Heading>Sub-sub-judul</Heading>
            <Heading>Sub-sub-judul</Heading>
            <Heading>Sub-sub-judul</Heading>
          </Section>
        </Section>
      </Section>
    </Section>
  );
}
```

```js Section.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Section({ children }) {
  const level = useContext(LevelContext);
  return (
    <section className="section">
      <LevelContext.Provider value={level + 1}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

```js Heading.js
import { useContext } from 'react';
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {
  const level = useContext(LevelContext);
  switch (level) {
    case 0:
      throw Error('Judul harus berada di dalam Bagian!');
    case 1:
      return <h1>{children}</h1>;
    case 2:
      return <h2>{children}</h2>;
    case 3:
      return <h3>{children}</h3>;
    case 4:
      return <h4>{children}</h4>;
    case 5:
      return <h5>{children}</h5>;
    case 6:
      return <h6>{children}</h6>;
    default:
      throw Error('Unknown level: ' + level);
  }
}
```

```js LevelContext.js
import { createContext } from 'react';

export const LevelContext = createContext(0);
```

```css
.section {
  padding: 10px;
  margin: 5px;
  border-radius: 5px;
  border: 1px solid #aaa;
}
```

</Sandpack>

<LearnMore path="/learn/passing-data-deeply-with-context">

Baca **[Passing Data Deeply with Context](/learn/passing-data-deeply-with-context)** untuk mempelajari penggunaan context sebagai alternatif dari melewatkan *props*.

</LearnMore>

## Peningkatan Skala dengan Reducer dan Context {/*scaling-up-with-reducer-and-context*/}

*Reducer* memungkinkan Anda mengonsolidasikan logika pembaruan *state* dari sebuah komponen. *Context* memungkinkan Anda melewatkan informasi ke komponen lain secara dalam. Anda dapat menggabungkan *reducer* dan *context* bersama-sama untuk mengelola *state* dari layar yang kompleks.

Dengan pendekatan ini, sebuah komponen induk dengan *state* yang kompleks dikelola dengan *reducer*. Komponen lain di dalam *tree* dapat membaca *state*-nya melalui *context*. Mereka juga dapat melakukan *dispatch* tindakan untuk memperbarui *state* tersebut.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Hari libur di Kyoto</h1>
      <AddTask />
      <TaskList />
    </TasksProvider>
  );
}
```

```js TasksContext.js
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

export function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    tasksReducer,
    initialTasks
  );

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider
        value={dispatch}
      >
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

export function useTasks() {
  return useContext(TasksContext);
}

export function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}

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
      throw Error('Unknown action: ' + action.type);
    }
  }
}

const initialTasks = [
  { id: 0, text: 'Jalan Filsuf', done: true },
  { id: 1, text: 'Kunjungi Kuil', done: false },
  { id: 2, text: 'Meminum matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask({ onAddTask }) {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Tambah Tugas"
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={() => {
        setText('');
        dispatch({
          type: 'added',
          id: nextId++,
          text: text,
        });
      }}>Tambah</button>
    </>
  );
}

let nextId = 3;
```

```js TaskList.js
import { useState, useContext } from 'react';
import { useTasks, useTasksDispatch } from './TasksContext.js';

export default function TaskList() {
  const tasks = useTasks();
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
}

function Task({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useTasksDispatch();
  let taskContent;
  if (isEditing) {
    taskContent = (
      <>
        <input
          value={task.text}
          onChange={e => {
            dispatch({
              type: 'changed',
              task: {
                ...task,
                text: e.target.value
              }
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
          Sunting
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
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: e.target.checked
            }
          });
        }}
      />
      {taskContent}
      <button onClick={() => {
        dispatch({
          type: 'deleted',
          id: task.id
        });
      }}>
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

<LearnMore path="/learn/scaling-up-with-reducer-and-context">

Baca **[Peningkatan Skala dengan Reducer dan Context](/learn/scaling-up-with-reducer-and-context)** untuk mempelajari bagaimana pengelolaan *state* mengembang pada aplikasi yang berkembang.

</LearnMore>

## Apa selanjutnya? {/*whats-next*/}

Lanjut ke halaman [Reacting to Input with *State*](/learn/reacting-to-input-with-state) untuk mulai membaca bab ini halaman per halaman!

Atau, jika Anda sudah familiar dengan topik-topik ini, mengapa tidak membaca tentang [Escape Hatches](/learn/escape-hatches)?
