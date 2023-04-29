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

Most of your React components will only read data from their [props,](/learn/passing-props-to-a-component) [state,](/reference/react/useState) and [context.](/reference/react/useContext) However, sometimes a component needs to read some data from some store outside of React that changes over time. This includes:

* Third-party state management libraries that hold state outside of React.
* Browser APIs that expose a mutable value and events to subscribe to its changes.

Call `useSyncExternalStore` at the top level of your component to read a value from an external data store.

```js [[1, 5, "todosStore.subscribe"], [2, 5, "todosStore.getSnapshot"], [3, 5, "todos", 0]]
import { useSyncExternalStore } from 'react';
import { todosStore } from './todoStore.js';

function TodosApp() {
  const todos = useSyncExternalStore(todosStore.subscribe, todosStore.getSnapshot);
  // ...
}
```

It returns the <CodeStep step={3}>snapshot</CodeStep> of the data in the store. You need to pass two functions as arguments:

1. The <CodeStep step={1}>`subscribe` function</CodeStep> should subscribe to the store and return a function that unsubscribes.
2. The <CodeStep step={2}>`getSnapshot` function</CodeStep> should read a snapshot of the data from the store.

React will use these functions to keep your component subscribed to the store and re-render it on changes.

For example, in the sandbox below, `todosStore` is implemented as an external store that stores data outside of React. The `TodosApp` component connects to that external store with the `useSyncExternalStore` Hook. 

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
// This is an example of a third-party store
// that you might need to integrate with React.

// If your app is fully built with React,
// we recommend using React state instead.

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

When possible, we recommend using built-in React state with [`useState`](/reference/react/useState) and [`useReducer`](/reference/react/useReducer) instead. The `useSyncExternalStore` API is mostly useful if you need to integrate with existing non-React code.

</Note>

---

### Berlanggan ke sebuah API peramban {/*subscribing-to-a-browser-api*/}

Another reason to add `useSyncExternalStore` is when you want to subscribe to some value exposed by the browser that changes over time. For example, suppose that you want your component to display whether the network connection is active. The browser exposes this information via a property called [`navigator.onLine`.](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine)

This value can change without React's knowledge, so you should read it with `useSyncExternalStore`.

```js
import { useSyncExternalStore } from 'react';

function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}
```

To implement the `getSnapshot` function, read the current value from the browser API:

```js
function getSnapshot() {
  return navigator.onLine;
}
```

Next, you need to implement the `subscribe` function. For example, when `navigator.onLine` changes, the browser fires the [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) and [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) events on the `window` object. You need to subscribe the `callback` argument to the corresponding events, and then return a function that cleans up the subscriptions:

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

Now React knows how to read the value from the external `navigator.onLine` API and how to subscribe to its changes. Disconnect your device from the network and notice that the component re-renders in response:

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

Usually you won't write `useSyncExternalStore` directly in your components. Instead, you'll typically call it from your own custom Hook. This lets you use the same external store from different components.

For example, this custom `useOnlineStatus` Hook tracks whether the network is online:

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

Now different components can call `useOnlineStatus` without repeating the underlying implementation:

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

If your React app uses [server rendering,](/reference/react-dom/server) your React components will also run outside the browser environment to generate the initial HTML. This creates a few challenges when connecting to an external store:

- If you're connecting to a browser-only API, it won't work because it does not exist on the server.
- If you're connecting to a third-party data store, you'll need its data to match between the server and client.

To solve these issues, pass a `getServerSnapshot` function as the third argument to `useSyncExternalStore`:

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
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  // ...
}
```

The `getServerSnapshot` function is similar to `getSnapshot`, but it runs only in two situations:

- It runs on the server when generating the HTML.
- It runs on the client during [hydration](/reference/react-dom/client/hydrateRoot), i.e. when React takes the server HTML and makes it interactive.

This lets you provide the initial snapshot value which will be used before the app becomes interactive. If there is no meaningful initial value for the server rendering, omit this argument to [force rendering on the client.](/reference/react/Suspense#providing-a-fallback-for-server-errors-and-server-only-content)

<Note>

Make sure that `getServerSnapshot` returns the same exact data on the initial client render as it returned on the server. For example, if `getServerSnapshot` returned some prepopulated store content on the server, you need to transfer this content to the client. One way to do this is to emit a `<script>` tag during server rendering that sets a global like `window.MY_STORE_DATA`, and read from that global on the client in `getServerSnapshot`. Your external store should provide instructions on how to do that.

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