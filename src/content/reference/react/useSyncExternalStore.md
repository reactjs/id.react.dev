---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` adalah sebuah *hook* React yang membiarkan Anda berlangganan ke tempat penyimpanan eksternal.

```js
const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)` {/*usesyncexternalstore*/}

Panggil `useSyncExternalStore` di tingkat paling atas dari komponen Anda untuk membaca sebuah nilai dari tempat penyimpanan data eksternal.

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

*Hook* ini mengembalikan sebuah *snapshot* dari data yang ada di tempat penyimpanan. Anda harus memberikan dua fungsi sebagai argumen:

1. Fungsi `subscribe` harus berlangganan ke tempat penyimpanan dan mengembalikan fungsi untuk berhenti berlangganan.
2. Fungsi `getSnapshot` harus membaca sebuah *snapshot* dari data yang ada di tempat penyimpanan.

[Lihat contoh yang ada di bawah.](#usage)

#### Parameter {/*parameters*/}

* `subscribe`: Sebuah fungsi yang menerima sebuah argumen `callback` dan melanggankan itu ke tempat penyimpanan. Saat tempat penyimpanan berubah, fungsi ini akan memanggil `callback`. Ini akan menyebakan komponen di-*render* ulang. Fungsi `subscribe` harus mengembalikan fungsi yang membersihkan langganan tersebut.

* `getSnapshot`: Sebuah fungsi yang mengembalikan sebuah *snapshot* dari data yang dibutuhkan komponen yang berada di tempat penyimpanan. Saat tempat penyimpanan masih belum berubah, pemanggilan `getSnapshot` berulang kali tetap harus mengembalikan nilai yang sama. Jika tempat penyimpanan berubah dan nilai kembalian juga berubah (saat dibandingkan dengan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React me-*render* ulang komponen tersebut.

* **opsional** `getServerSnapshot`: Sebuah fungsi yang mengembalikan *snapshot* awal dari data yang ada di tempat penyimpanan. *Snapshot* hanya akan digunakan saat proses *render* dilakukan oleh server dan saat hidrasi konten yang telah di-*render* oleh server ke klien. *Snapshot* server harus sama antara klien dan server, dan biasanya diserialisasi dan diserahkan dari server ke klien. Jika Anda mengabaikan argumen ini, proses *render* komponen di server akan memunculkan kesalahan.

#### Kembalian {/*returns*/}

*Snapshot* saat ini dari tempat penyimpanan yang dapat Anda gunakan di logika *render* Anda.

#### Perhatian {/*caveats*/}

* *Snapshot* tempat penyimpanan yang dikembalikan `getSnapshot` tidak boleh bisa dimutasi. Jika tempat penyimpanan mengandung data yang dapat dimutasi, Anda harus mengembalikan *snapshot* yang tidak dapat dimutasi saat data berubah. Jika data tidak berubah, Anda dapat mengembalikan *snapshot* terakhir yang sudah di-*cache*.

* Jika fungsi `subscribe` yang berbeda diberikan saat *render* ulang, React akan berlangganan ulang ke tempat penyimpanan menggunakan fungsi `subscribe` yang baru. Anda bisa menghindari ini dengan mendeklarasi `subscribe` di luar komponen.

---

## Penggunaan {/*usage*/}

### Berlangganan ke tempat penyimpanan eksternal {/*subscribing-to-an-external-store*/}

Sebagian besar komponen React Anda akan membaca data dari [*props*](/learn/passing-props-to-a-component), [*state*](/reference/react/useState), dan [*context*](/reference/react/useContext) mereka. Walaupun begitu, kadang-kadang ada komponen yang harus membaca dari tempat penyimpanan yang ada di luar React dan berubah seiring waktu berjalan. Ini termasuk:

* *Library* manajemen *state* dari pihak ketiga yang menyimpan *state* di luar React.
* API peramban yang mengekspos nilai yang dapat dimutasi dan *event* untuk berlangganan ke perubahannya.

Panggil `useSyncExternalStore` di tingkat paling atas dari komponen Anda untuk membaca sebuah nilai dari tempat penyimpanan data eksternal.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

Fungsi ini mengembalikan <CodeStep step={3}>*snapshot*</CodeStep> dari data yang ada di tempat penyimpanan. Anda harus memberikan dua fungsi sebagai argumen:

1. <CodeStep step={1}>Fungsi `subscribe`</CodeStep> harus berlangganan ke tempat penyimpanan dan mengembalikan sebuah fungsi untuk berhenti berlangganan.
2. <CodeStep step={2}>Fungsi `getSnapshot`</CodeStep> harus membaca sebuah *snapshot* dari data yang ada di tempat penyimpanan.

React akan menggunakan dua fungsi ini untuk menjaga status langganan komponen Anda ke tempat penyimpanan tersebut dan me-*render* ulang saat ada perubahan.

Misalnya, di *sandbox* di bawah, `todosStore` diimplementasi sebagai tempat penyimpanan eksternal yang menyimpan data di luar React. Komponen `TodosApp` terhubung ke tempat penyimpanan eksternal tersebut melalui *hook* `useSyncExternalStore`. 

<Sandpack>

```js
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

export default function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  return (
    <>
      <button onClick={() => todosStore.addTodo()}>Add todo</button>
      <hr />
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>{todo.text}</li>
        ))}
      </ul>
    </>
  );
}
```

```js todoStore.js
// Ini adalah contoh dari sebuah tempat penyimpanan
// dari pihak ketiga yang Anda perlu integrasikan
// dengan React.

// Jika aplikasi Anda dibangun sepenuhnya oleh React,
// kami merekomendasikan untuk menggunakan React state.

let nextId = 0;
let todos = [{ id: nextId++, text: 'Todo #1' }];
let listeners = [];

export const todosStore = {
  addTodo() {
    todos = [...todos, { id: nextId++, text: 'Todo #' + nextId }]
    emitChange();
  },
  subscribe(listener) {
    listeners = [...listeners, listener];
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  },
  getSnapshot() {
    return todos;
  }
};

function emitChange() {
  for (let listener of listeners) {
    listener();
  }
}
```

</Sandpack>

<Note>

Di situasi yang memungkinkan, kami merekomendasikan untuk menggunakan *state* yang sudah ada di dalam React dengan menggunakan [`useState`](/reference/react/useState) dan [`useReducer`](/reference/react/useReducer). API `useSyncExternalStore` biasanya berguna jika Anda ingin mengintegrasi komponen Anda dengan kode non-React.

</Note>

---

### Melanggan ke sebuah API peramban {/*subscribing-to-a-browser-api*/}

Alasan lain untuk menggunakan `useSyncExternalStore` adalah ketika Anda ingin berlangganan ke sebuah nilai yang diekspos peramban yang berubah seiring berjalannya waktu. Contohnya, saat Anda ingin komponen Anda menampilkan apakah koneksi jaringan masih aktif. Peramban mengekspos informasi ini melalui sebuah *property* yang disebut [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

Nilai ini dapat berubah tanpa pengetahuan React sehingga Anda harus membacanya dengan `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

Untuk mengimplementasi fungsi `getSnapshot`, Anda cukup membaca nilai saat ini dari API peramban:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Selanjutnya, Anda perlu mengimplementasi fungsi `subscribe`. Contohnya, saat `navigator.onLine` berubah, peramban menembakkan *event* [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) dan [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) ke objek `window`. Anda perlu melanggankan argument `callback` ke *event* yang bersangkutan, kemudian mengembalikan sebuah fungsi yang membersihkan langganan tersebut:

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

Sekarang React tahu bagaimana membaca nilai yang ada di API eksternal `navigator.onLine` dan bagaimana berlangganan ke perubahannya. Putuskan koneksi perangkat Anda dari jaringan dan Anda akan melihat komponen di-*render* ulang sebagai respons:

<Sandpack>

```js
import { useSyncExternalStore } from 'react';

export default function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Mengekstrak logika ke *hook* buatan sendiri {/*extracting-the-logic-to-a-custom-hook*/}

Biasanya Anda tidak akan menulis `useSyncExternalStore` langsung di dalam komponen Anda. Alih-alih, Anda akan memanggil `hook` tersebut dari `hook` buatan Anda sendiri. Ini membiarkan Anda menggunakan tempat penyimpanan eksternal yang sama untuk berbagai komponen.

Sebagai contoh, `hook` `useOnlineStatus` ini mengikuti apakah jaringan menyala:

```js {3,6}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  // ...
}

function subscribe(callback) {
  // ...
}
```

Sekarang, berbagai komponen bisa memanggil `useOnlineStatus` tanpa harus mengulang implementasinya:

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

function SaveButton() {
  const isOnline = useOnlineStatus();

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}

export default function App() {
  return (
    <>
      <SaveButton />
      <StatusBar />
    </>
  );
}
```

```js useOnlineStatus.js
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

</Sandpack>

---

### Menambahkan dukungan untuk *render* di server {/*adding-support-for-server-rendering*/}

Jika aplikasi React Anda melakukan [*render* di server](/reference/react-dom/server), komponen React Anda akan berjalan di luar lingkungan peramban untuk membuat HTML awal. Ini menimbulkan beberapa tantangan saat ingin berhubungan dengan tempat penyimpanan eksternal:

- Jika Anda berusaha untuk terhubung dengan API peramban, ini tidak akan bekerja karena API tersebut tidak ada di server.
- Jika Anda berusaha untuk terhubung dengan tempat penyimpanan pihak ketiga, Anda harus mencocokkan data yang ada di server dan klien.

Untuk menyelesaikan masalah ini, Anda dapat memberikan fungsi `getServerSnapshot` sebagai argumen ketiga ke `useSyncExternalStore`:

```js {4,12-14}
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Selalu menunjukkan "Online" untuk HTML yang dibuat server
}

function subscribe(callback) {
  // ...
}
```

Fungsi `getServerSnapshot` cukup mirip dengan `getSnapshot`, tetapi hanya berjalan di dua situasi:

- Fungsi tersebut berjalan di server saat membuat HTML.
- Fungsi tersebut berjalan di klien saat [hidrasi](/reference/react-dom/client/hydrateRoot), misalnya saat React mengambil HTML dari server dan membuatnya interaktif.

Hal ini membiarkan Anda untuk menyediakan nilai *snapshot* awal yang akan digunakan sebelum aplikasi menjadi interaktif. Jika tidak ada nilai awal yang cukup bermakna untuk proses *render* di server, Anda bisa mengabaikan argumen ini untuk [memaksa proses *render* terjadi di klien](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content).

<Note>

Pastikan `getServerSnapshot` mengembalikan data yang sama persis di proses *render* awal di klien dan juga di server. Sebagai contoh, jika `getServerSnapshot` mengembalikan sebuah data yang sudah disiapkan di server, Anda juga harus memberikan data ini ke klien. Salah satu cara adalah dengan mengirim sebuah *tag* `<script>`, saat proses *render* di server, yang menetapkan sebuah global seperti `window.MY_STORE_DATA` dan klien membaca nilai dari global tersebut di `getServerSnapshot`. Tempat penyimpanan eksternal Anda seharusnya memberikan instruksi mengenai hal ini.

</Note>

---

## Pemecahan masalah {/*troubleshooting*/}

### Saya mendapat kesalahan: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

This error means your `getSnapshot` function returns a new object every time it's called, for example:

```js {2-5}
function getSnapshot() {
  // 🔴 Do not return always different objects from getSnapshot
  return {
    todos: myStore.todos
  };
}
```

React will re-render the component if `getSnapshot` return value is different from the last time. This is why, if you always return a different value, you will enter an infinite loop and get this error.

Your `getSnapshot` object should only return a different object if something has actually changed. If your store contains immutable data, you can return that data directly:

```js {2-3}
function getSnapshot() {
  // ✅ You can return immutable data
  return myStore.todos;
}
```

If your store data is mutable, your `getSnapshot` function should return an immutable snapshot of it. This means it *does* need to create new objects, but it shouldn't do this for every single call. Instead, it should store the last calculated snapshot, and return the same snapshot as the last time if the data in the store has not changed. How you determine whether mutable data has changed depends on your mutable store.

---

### Fungsi `subscribe` saya tidak dipanggil setelah tiap tahap *render* {/*my-subscribe-function-gets-called-after-every-re-render*/}

This `subscribe` function is defined *inside* a component so it is different on every re-render:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Always a different function, so React will resubscribe on every re-render
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React will resubscribe to your store if you pass a different `subscribe` function between re-renders. If this causes performance issues and you'd like to avoid resubscribing, move the `subscribe` function outside:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Always the same function, so React won't need to resubscribe
function subscribe() {
  // ...
}
```

Alternatively, wrap `subscribe` into [`useCallback`](/reference/react/useCallback) to only resubscribe when some argument changes:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Same function as long as userId doesn't change
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```