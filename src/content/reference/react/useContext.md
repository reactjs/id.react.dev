---
title: useContext
---

<Intro>

`useContext` adalah sebuah React Hook yang memungkinkan Anda membaca dan berlangganan dengan [context](/learn/passing-data-deeply-with-context) dari komponen Anda.

```js
const value = useContext(SomeContext)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useContext(SomeContext)` {/*usecontext*/}

Panggil fungsi `useContext` di tingkat atas komponen Anda untuk membaca dan berlangganan dengan [context.](/learn/passing-data-deeply-with-context)

```js
import { useContext } from 'react';

function MyComponent() {
  const theme = useContext(ThemeContext);
  // ...
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameters {/*parameters*/}

* `SomeContext`: Konteks yang sebelumnya telah Anda buat dengan [`createContext`](/reference/react/createContext). Konteks itu sendiri tidak menyimpan informasi, konteks hanya merepresentasikan jenis informasi yang dapat Anda berikan atau baca dari komponen.

#### Returns {/*returns*/}

`useContext` mengembalikan nilai konteks untuk komponen yang dipanggil. Nilai ini ditentukan sebagai `value` yang dioper ke `SomeContext.Provider` terdekat di atas komponen pemanggil dalam pohon. Jika tidak ada penyedia tersebut, maka nilai yang dikembalikan adalah `defaultValue` yang telah Anda berikan ke [`createContext`](/reference/react/createContext) untuk konteks tersebut. Nilai yang dikembalikan selalu mutakhir. React secara otomatis me-*render* ulang komponen yang membaca suatu konteks jika konteks tersebut berubah.

#### Caveats {/*caveats*/}

* Pemanggilan `useContext()` dalam sebuah komponen tidak terpengaruh oleh provider yang dikembalikan dari komponen yang *sama*. `<Context.Provider>` yang sesuai harus berada di atas komponen yang melakukan pemanggilan `useContext()`.
* React **secara otomatis me-*render* ulang** semua anak yang menggunakan konteks tertentu mulai dari penyedia yang menerima `nilai` yang berbeda. Nilai sebelumnya dan nilai berikutnya dibandingkan dengan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is). Melewatkan render ulang dengan [`memo`](/reference/react/memo) tidak mencegah anak-anak menerima nilai konteks yang baru.
* Jika sistem build Anda menghasilkan modul duplikat pada keluaran (yang dapat terjadi pada *symlink*), ini dapat merusak konteks. Mengoper sesuatu melalui konteks hanya berfungsi jika `SomeContext` yang Anda gunakan untuk memberikan konteks dan `SomeContext` yang Anda gunakan untuk membacanya adalah objek yang sama persis, seperti yang ditentukan oleh perbandingan `===`.

---

## Penggunaan {/*usage*/}


### Mengoper data secara mendalam ke dalam pohon {/*passing-data-deeply-into-the-tree*/}

Panggil `useContext` di tingkat atas komponen Anda untuk membaca dan berlangganan ke [context.](/learn/passing-data-deeply-with-context)

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { useContext } from 'react';

function Button() {
  const theme = useContext(ThemeContext);
  // ... 
```

`useContext` mengembalikan <CodeStep step={2}>nilai konteks</CodeStep> untuk <CodeStep step={1}>konteks</CodeStep> yang telah Anda oper. Untuk menentukan nilai konteks, React mencari di pohon komponen dan menemukan **penyedia konteks terdekat di atas** untuk konteks tertentu.

Untuk mengoper konteks ke sebuah `Button`, bungkus komponen tersebut atau salah satu komponen induknya ke dalam penyedia konteks yang sesuai:

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  );
}

function Form() {
  // ... renders buttons inside ...
}
```

Tidak masalah berapa banyak lapisan komponen yang ada di antara penyedia dan `Button`. Ketika sebuah `Button` *di mana saja* di dalam `Form` memanggil `useContext(ThemeContext)`, maka akan menerima `"dark"` sebagai nilai.

<Pitfall>

`useContext()` selalu mencari penyedia terdekat *di atas* komponen yang memanggilnya. Ia mencari ke atas dan **tidak** mempertimbangkan penyedia di dalam komponen dari yang Anda panggil `useContext()`.

</Pitfall>

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Memperbarui data yang dioper melalui konteks {/*updating-data-passed-via-context*/}

Sering kali, Anda ingin konteks berubah seiring berjalannya waktu. Untuk memperbarui konteks, kombinasikan dengan [state.](/reference/react/useState) Deklarasikan variabel state dalam komponen induk, dan berikan state saat ini sebagai <CodeStep step={2}>context value</CodeStep> ke penyedia.

```js {2} [[1, 4, "ThemeContext"], [2, 4, "theme"], [1, 11, "ThemeContext"]]
function MyPage() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <Button onClick={() => {
        setTheme('light');
      }}>
        Switch to light theme
      </Button>
    </ThemeContext.Provider>
  );
}
```

Sekarang setiap `Button` di dalam penyedia akan menerima nilai `theme` saat ini. Jika Anda memanggil `setTheme` untuk memperbarui nilai `theme` yang Anda berikan ke penyedia, semua komponen `Button` akan di-*render* ulang dengan nilai `'light' yang baru.

<Recipes titleText="Examples of updating context" titleId="examples-basic">

#### Memperbarui nilai melalui konteks {/*updating-a-value-via-context*/}

Dalam contoh ini, komponen `MyApp` menyimpan variabel status yang kemudian diteruskan ke penyedia `ThemeContext`. Mencentang kotak centang "Dark mode" akan memperbarui *state*. Mengubah nilai yang disediakan akan me-*render* ulang semua komponen yang menggunakan konteks tersebut.


<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={theme}>
      <Form />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </ThemeContext.Provider>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

Perhatikan bahwa `value="dark"` meneruskan string `"dark"`, tetapi `value={theme}` meneruskan nilai variabel `theme` JavaScript dengan [kurung kurawal JSX.](/learn/javascript-in-jsx-with-curly-braces) Kurung kurawal juga memungkinkan Anda mengoper nilai konteks yang bukan *string*.

<Solution />

#### Memperbarui objek melalui konteks {/*updating-an-object-via-context*/}

Pada contoh ini, terdapat variabel *state* `currentUser` yang menyimpan sebuah objek. Anda menggabungkan `{ currentUser, setCurrentUser }` ke dalam suatu objek dan meneruskannya melalui konteks di dalam `value={}`. Hal ini memungkinkan komponen di bawahnya, seperti `LoginButton`, membaca `currentUser` dan `setCurrentUser`, dan kemudian memanggil `setCurrentUser` saat dibutuhkan.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        setCurrentUser
      }}
    >
      <Form />
    </CurrentUserContext.Provider>
  );
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <LoginButton />
    </Panel>
  );
}

function LoginButton() {
  const {
    currentUser,
    setCurrentUser
  } = useContext(CurrentUserContext);

  if (currentUser !== null) {
    return <p>You logged in as {currentUser.name}.</p>;
  }

  return (
    <Button onClick={() => {
      setCurrentUser({ name: 'Advika' })
    }}>Log in as Advika</Button>
  );
}

function Panel({ title, children }) {
  return (
    <section className="panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}

.button {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}
```

</Sandpack>

<Solution />

#### Beberapa konteks {/*multiple-context*/}

Pada contoh ini, terdapat dua konteks yang berdiri sendiri. `ThemeContext` menyediakan tema saat ini, yang merupakan sebuah string, sedangkan `CurrentUserContext` menyimpan objek yang mewakili pengguna saat ini.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        <WelcomePanel />
        <label>
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={(e) => {
              setTheme(e.target.checked ? 'dark' : 'light')
            }}
          />
          Use dark mode
        </label>
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  )
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Mengekstrak penyedia ke sebuah komponen {/*extracting-providers-to-a-component*/}

Seiring dengan pertumbuhan aplikasi Anda, diharapkan Anda akan memiliki "piramida" konteks yang lebih dekat dengan akar aplikasi Anda. Tidak ada yang salah dengan hal itu. Namun, jika Anda tidak menyukai susunan tersebut secara estetika, Anda bisa mengekstrak penyedia ke dalam satu komponen. Dalam contoh ini, `MyProviders` menyembunyikan "cara kerja" dan membuat anak-anak yang diteruskan ke cara kerja tersebut di dalam penyedia yang diperlukan. Perhatikan bahwa *state* `theme` dan `setTheme` dibutuhkan di dalam `MyApp` itu sendiri, jadi `MyApp` masih memiliki bagian *state* tersebut.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext(null);
const CurrentUserContext = createContext(null);

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <MyProviders theme={theme} setTheme={setTheme}>
      <WelcomePanel />
      <label>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={(e) => {
            setTheme(e.target.checked ? 'dark' : 'light')
          }}
        />
        Use dark mode
      </label>
    </MyProviders>
  );
}

function MyProviders({ children, theme, setTheme }) {
  const [currentUser, setCurrentUser] = useState(null);
  return (
    <ThemeContext.Provider value={theme}>
      <CurrentUserContext.Provider
        value={{
          currentUser,
          setCurrentUser
        }}
      >
        {children}
      </CurrentUserContext.Provider>
    </ThemeContext.Provider>
  );
}

function WelcomePanel({ children }) {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <Panel title="Welcome">
      {currentUser !== null ?
        <Greeting /> :
        <LoginForm />
      }
    </Panel>
  );
}

function Greeting() {
  const {currentUser} = useContext(CurrentUserContext);
  return (
    <p>You logged in as {currentUser.name}.</p>
  )
}

function LoginForm() {
  const {setCurrentUser} = useContext(CurrentUserContext);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const canLogin = firstName !== '' && lastName !== '';
  return (
    <>
      <label>
        First name{': '}
        <input
          required
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last name{': '}
        <input
        required
          value={lastName}
          onChange={e => setLastName(e.target.value)}
        />
      </label>
      <Button
        disabled={!canLogin}
        onClick={() => {
          setCurrentUser({
            name: firstName + ' ' + lastName
          });
        }}
      >
        Log in
      </Button>
      {!canLogin && <i>Fill in both fields.</i>}
    </>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, disabled, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

```css
label {
  display: block;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Peningkatan skala dengan konteks dan peredam {/*scaling-up-with-context-and-a-reducer*/}

Pada aplikasi yang lebih besar, adalah hal yang umum untuk menggabungkan konteks dengan [reducer](/reference/react/useReducer) untuk mengekstrak logika yang terkait dengan beberapa *state* dari komponen. Dalam contoh ini, semua "penyambungan" disembunyikan di dalam `TasksContext.js`, yang berisi reducer dan dua konteks terpisah.

Baca [panduan lengkap](/learn/scaling-up-with-reducer-and-context) dari contoh ini.

<Sandpack>

```js App.js
import AddTask from './AddTask.js';
import TaskList from './TaskList.js';
import { TasksProvider } from './TasksContext.js';

export default function TaskApp() {
  return (
    <TasksProvider>
      <h1>Day off in Kyoto</h1>
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
      <TasksDispatchContext.Provider value={dispatch}>
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
  { id: 0, text: 'Philosopher’s Path', done: true },
  { id: 1, text: 'Visit the temple', done: false },
  { id: 2, text: 'Drink matcha', done: false }
];
```

```js AddTask.js
import { useState, useContext } from 'react';
import { useTasksDispatch } from './TasksContext.js';

export default function AddTask() {
  const [text, setText] = useState('');
  const dispatch = useTasksDispatch();
  return (
    <>
      <input
        placeholder="Add task"
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
      }}>Add</button>
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
          Save
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

</Recipes>

---

### Menentukan nilai default fallback {/*specifying-a-fallback-default-value*/}

Jika React tidak dapat menemukan penyedia <CodeStep step={1}>context</CodeStep> tertentu di pohon induk, nilai konteks yang dikembalikan oleh `useContext()` akan sama dengan <CodeStep step={3}>default value</CodeStep> yang Anda tentukan ketika Anda [membuat konteks tersebut](/reference/react/createContext):

```js [[1, 1, "ThemeContext"], [3, 1, "null"]]
const ThemeContext = createContext(null);
```

Nilai default **tidak pernah berubah**. Jika Anda ingin memperbarui konteks, gunakan dengan status seperti [yang dijelaskan di atas.](#updating-data-passed-via-context)

Sering kali, alih-alih `null`, ada beberapa nilai yang lebih berarti yang dapat Anda gunakan sebagai default, misalnya:

```js [[1, 1, "ThemeContext"], [3, 1, "light"]]
const ThemeContext = createContext('light');
```

Dengan cara ini, jika Anda secara tidak sengaja me-*render* beberapa komponen tanpa penyedia yang sesuai, komponen tersebut tidak akan rusak. Hal ini juga membantu komponen Anda bekerja dengan baik di lingkungan pengujian tanpa menyiapkan banyak provider dalam pengujian.

Pada contoh di bawah ini, tombol "Toggle theme" selalu berwarna terang karena tombol tersebut berada di luar penyedia konteks tema apa pun dan nilai tema konteks *default* adalah `'light'. Cobalah mengedit tema default menjadi 'dark'.

<Sandpack>

```js
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

export default function MyApp() {
  const [theme, setTheme] = useState('light');
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <Form />
      </ThemeContext.Provider>
      <Button onClick={() => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
      }}>
        Toggle theme
      </Button>
    </>
  )
}

function Form({ children }) {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ children, onClick }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 10px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

---

### Menggantikan konteks untuk bagian dari pohon {/*overriding-context-for-a-part-of-the-tree*/}

Anda dapat mengganti konteks untuk suatu bagian pohon dengan membungkus bagian tersebut dengan penyedia bersama nilai yang berbeda.

```js {3,5}
<ThemeContext.Provider value="dark">
  ...
  <ThemeContext.Provider value="light">
    <Footer />
  </ThemeContext.Provider>
  ...
</ThemeContext.Provider>
```

Anda bisa membuat sarang dan menimpa penyedia sebanyak yang Anda butuhkan.

<Recipes title="Examples of overriding context">

#### Menggantikan sebuah tema {/*overriding-a-theme*/}

Di sini, tombol *di dalam* `Footer` menerima nilai konteks yang berbeda (`"light"`) daripada tombol di luar (`"dark"`).

<Sandpack>

```js
import { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext.Provider value="dark">
      <Form />
    </ThemeContext.Provider>
  )
}

function Form() {
  return (
    <Panel title="Welcome">
      <Button>Sign up</Button>
      <Button>Log in</Button>
      <ThemeContext.Provider value="light">
        <Footer />
      </ThemeContext.Provider>
    </Panel>
  );
}

function Footer() {
  return (
    <footer>
      <Button>Settings</Button>
    </footer>
  );
}

function Panel({ title, children }) {
  const theme = useContext(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      {title && <h1>{title}</h1>}
      {children}
    </section>
  )
}

function Button({ children }) {
  const theme = useContext(ThemeContext);
  const className = 'button-' + theme;
  return (
    <button className={className}>
      {children}
    </button>
  );
}
```

```css
footer {
  margin-top: 20px;
  border-top: 1px solid #aaa;
}

.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

<Solution />

#### Judul bersarang secara otomatis {/*automatically-nested-headings*/}

Anda dapat "mengumpulkan" informasi ketika Anda menyarangkan penyedia konteks. Dalam contoh ini, komponen `Section` melacak `LevelContext` yang menentukan kedalaman penelusuran bagian. Komponen ini membaca `LevelContext` dari bagian induk, dan penomoran `LevelContext` yang ditambah satu kepada anak-anaknya. Hasilnya, komponen `Heading` dapat secara otomatis memutuskan tanda `<h1>`, `<h2>`, `<h3>`,..., yang mana yang akan digunakan berdasarkan jumlah komponen `Section` yang bersarang di dalamnya.

Baca [panduan rinci](/learn/passing-data-deeply-with-context) dari contoh ini.

<Sandpack>

```js
import Heading from './Heading.js';
import Section from './Section.js';

export default function Page() {
  return (
    <Section>
      <Heading>Title</Heading>
      <Section>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Heading>Heading</Heading>
        <Section>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Heading>Sub-heading</Heading>
          <Section>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
            <Heading>Sub-sub-heading</Heading>
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
      throw Error('Heading must be inside a Section!');
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

<Solution />

</Recipes>

---

### Mengoptimalkan render ulang saat mengoper objek dan fungsi {/*optimizing-re-renders-when-passing-objects-and-functions*/}

Anda dapat mengoper nilai apa pun melalui konteks, termasuk objek dan fungsi.

```js [[2, 10, "{ currentUser, login }"]] 
function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  function login(response) {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Di sini, <CodeStep step={2}>context value</CodeStep> adalah sebuah objek JavaScript dengan dua properti, salah satunya adalah sebuah fungsi. Setiap kali `MyApp` di-*render* ulang (misalnya, pada pembaruan rute), ini akan menjadi objek *berbeda* yang menunjuk ke fungsi *berbeda*, sehingga React juga harus me-render ulang semua komponen di dalam pohon yang memanggil `useContext(AuthContext)`.

Pada aplikasi yang lebih kecil, hal ini tidak menjadi masalah. Namun, tidak perlu me-render ulang jika data yang mendasarinya, seperti `currentUser`, tidak berubah. Untuk membantu React memanfaatkan fakta tersebut, Anda dapat membungkus fungsi `login` dengan [`useCallback`](/reference/react/useCallback) dan membungkus pembuatan objek ke dalam [`useMemo`](/reference/react/useMemo). Hal ini merupakan pengoptimalan kinerja:

```js {6,9,11,14,17}
import { useCallback, useMemo } from 'react';

function MyApp() {
  const [currentUser, setCurrentUser] = useState(null);

  const login = useCallback((response) => {
    storeCredentials(response.credentials);
    setCurrentUser(response.user);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

  return (
    <AuthContext.Provider value={contextValue}>
      <Page />
    </AuthContext.Provider>
  );
}
```

Sebagai hasil dari perubahan ini, meskipun `MyApp` perlu di-*render* ulang, komponen yang memanggil `useContext(AuthContext)` tidak perlu di-*render* ulang kecuali jika `currentUser` telah berubah.

Baca lebih lanjut tentang [`useMemo`]((/reference/react/useMemo#skipping-re-rendering-of-components) dan [`useCallback`.](/reference/react/useCallback#skipping-re-rendering-of-components)

---

## Pemecahan Masalah {/*troubleshooting*/}

### Komponen saya tidak melihat nilai dari penyedia saya {/*my-component-doesnt-see-the-value-from-my-provider*/}

Ada beberapa cara umum yang dapat menyebabkan hal ini terjadi:

1. Anda me-*render* `<SomeContext.Provider>` di komponen yang sama (atau di bawahnya) dengan tempat Anda memanggil `useContext()`. Pindahkan `<SomeContext.Provider>` *di atas dan di luar* komponen yang memanggil `useContext()`.
2. Anda mungkin lupa membungkus komponen Anda dengan `<SomeContext.Provider>`, atau Anda mungkin meletakkannya di bagian pohon yang berbeda dari yang Anda kira. Periksa apakah hirarki sudah benar dengan menggunakan [React DevTools.] (/learn/react-developer-tools)
3. Anda mungkin mengalami masalah build dengan tooling Anda yang menyebabkan `SomeContext` yang terlihat dari komponen penyedia dan `SomeContext` yang terlihat oleh komponen pembacaan menjadi dua objek yang berbeda. Hal ini dapat terjadi jika Anda menggunakan *symlink*, misalnya. Anda dapat memverifikasi hal ini dengan menugaskan mereka ke global seperti `window.SomeContext1` dan `window.SomeContext2` dan kemudian memeriksa apakah `window.SomeContext1 === window.SomeContext2` di konsol. Jika tidak sama, perbaiki masalah tersebut di tingkat build tool.

### Saya selalu mendapatkan `undefined` dari konteks saya meskipun nilai defaultnya berbeda {/*i-am-always-getting-undefined-from-my-context-although-the-default-value-is-different*/}

Anda mungkin memiliki penyedia tanpa `value` di dalam pohon:

```js {1,2}
// 🚩 Doesn't work: no value prop
<ThemeContext.Provider>
   <Button />
</ThemeContext.Provider>
```

Jika Anda lupa menentukan `value`, ini sama saja dengan mengoper `value={undefined}`.

Anda mungkin juga tidak sengaja menggunakan nama *prop* yang berbeda:

```js {1,2}
// 🚩 Doesn't work: prop should be called "value"
<ThemeContext.Provider theme={theme}>
   <Button />
</ThemeContext.Provider>
```

Pada kedua kasus ini, Anda akan melihat peringatan dari React di konsol. Untuk memperbaikinya, panggil *prop* `value`:

```js {1,2}
// ✅ Passing the value prop
<ThemeContext.Provider value={theme}>
   <Button />
</ThemeContext.Provider>
```

Perhatikan bahwa [nilai *default* dari panggilan `createContext(defaultValue)` Anda] (#specifying-a-fallback-default-value) hanya digunakan **jika tidak ada penyedia yang cocok di atas sama sekali **Jika ada komponen `<SomeContext.Provider value = {undefined}>` di suatu tempat di dalam pohon induk, komponen yang memanggil `useContext(SomeContext)` ` akan menerima `undefined` sebagai nilai konteks.
