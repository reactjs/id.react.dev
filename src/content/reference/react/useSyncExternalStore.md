---
title: useSyncExternalStore
---

<Intro>

`useSyncExternalStore` adalah sebuah *Hook* React yang membiarkan Anda berlangganan ke tempat penyimpanan eksternal.

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

[Lihat lebih banyak contoh di bawah.](#usage)

#### Parameter {/*parameters*/}

* `subscribe`: Sebuah fungsi yang menerima sebuah argumen `callback` dan berlangganan ke tempat penyimpanan. Saat tempat penyimpanan berubah, fungsi ini akan memanggil `callback`. Ini akan menyebakan komponen di-*render* ulang. Fungsi `subscribe` harus mengembalikan fungsi yang membersihkan langganan tersebut.

* `getSnapshot`: Sebuah fungsi yang mengembalikan sebuah *snapshot* dari data, di tempat penyimpanan, yang dibutuhkan komponen. Saat tempat penyimpanan masih belum berubah, pemanggilan `getSnapshot` berulang kali tetap harus mengembalikan nilai yang sama. Jika tempat penyimpanan berubah dan nilai kembalian juga berubah (saat dibandingkan dengan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)), React me-*render* ulang komponen tersebut.

* **opsional** `getServerSnapshot`: Sebuah fungsi yang mengembalikan *snapshot* awal dari data yang ada di tempat penyimpanan. *Snapshot* hanya akan digunakan saat proses *render* dilakukan oleh server dan saat hidrasi konten yang telah di-*render* oleh server ke klien. *Snapshot* server harus sama antara klien dan server, dan biasanya diserialisasi dan diserahkan dari server ke klien. Jika Anda mengabaikan argumen ini, proses *render* komponen di server akan memunculkan kesalahan.

#### Kembalian {/*returns*/}

*Snapshot* saat ini dari tempat penyimpanan yang dapat Anda gunakan di logika *render* Anda.

#### Caveat {/*caveats*/}

* *Snapshot* tempat penyimpanan yang dikembalikan `getSnapshot` tidak boleh bisa dimutasi. Jika tempat penyimpanan mengandung data yang dapat dimutasi, Anda harus mengembalikan *snapshot* yang tidak dapat dimutasi saat data berubah. Jika data tidak berubah, Anda dapat mengembalikan *snapshot* terakhir yang sudah di-*cache*.

* Jika fungsi `subscribe` yang berbeda diberikan saat *render* ulang, React akan berlangganan ulang ke tempat penyimpanan menggunakan fungsi `subscribe` yang baru. Anda bisa menghindari ini dengan mendeklarasi `subscribe` di luar komponen.

---

## Penggunaan {/*usage*/}

### Berlangganan ke tempat penyimpanan eksternal {/*subscribing-to-an-external-store*/}

Sebagian besar komponen React Anda akan membaca data dari [*props*](/learn/passing-props-to-a-component), [*state*](/reference/react/useState), dan [*context*](/reference/react/useContext) mereka. Walaupun begitu, kadang-kadang ada komponen yang harus membaca dari tempat penyimpanan yang ada di luar React dan berubah seiring waktu berjalan. Ini termasuk:

* Pustaka manajemen *state* dari pihak ketiga yang menyimpan *state* di luar React.
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

Misalnya, di *sandbox* di bawah, `todosStore` diimplementasi sebagai tempat penyimpanan eksternal yang menyimpan data di luar React. Komponen `TodosApp` terhubung ke tempat penyimpanan eksternal tersebut melalui *Hook* `useSyncExternalStore`. 

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

Ketika memungkinkan, kami merekomendasikan untuk menggunakan *state* yang sudah ada di dalam React dengan menggunakan [`useState`](/reference/react/useState) dan [`useReducer`](/reference/react/useReducer). API `useSyncExternalStore` biasanya berguna jika Anda ingin mengintegrasi komponen Anda dengan kode non-React.

</Note>

---

### Berlangganan ke sebuah API peramban {/*subscribing-to-a-browser-api*/}

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

### Mengekstrak logika ke Hook buatan sendiri {/*extracting-the-logic-to-a-custom-hook*/}

Biasanya Anda tidak akan menulis `useSyncExternalStore` langsung di dalam komponen Anda. Alih-alih, Anda akan memanggil `Hook` tersebut dari `Hook` buatan Anda sendiri. Ini membiarkan Anda menggunakan tempat penyimpanan eksternal yang sama untuk berbagai komponen.

Sebagai contoh, `Hook` `useOnlineStatus` ini mengikuti apakah jaringan menyala:

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

### Menambahkan dukungan untuk render di server {/*adding-support-for-server-rendering*/}

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

### Saya mendapat pesan kesalahan: "The result of `getSnapshot` should be cached" {/*im-getting-an-error-the-result-of-getsnapshot-should-be-cached*/}

Pesan kesalahan ini berarti fungsi `getSnapshot` mengembalikan sebuah objek baru pada setiap pemanggilannya, seperti:

```js {2-5}
function getSnapshot() {
  // 🔴 Jangan selalu mengembalikan objek yang berbeda pada setiap pemanggilan
  return {
    todos: myStore.todos
  };
}
```

React akan me-*render* ulang sebuah komponen jika `getSnapshot` mengembalikan nilai yang berbeda dari sebelumnya. Ini mengapa, jika Anda selalu mengembalikan nilai yang berbeda, Anda akan melihat pengulangan tak berhingga dan mendapatkan pesan kesalahan ini.

Objek `getSnapshot` Anda hanya mengembalikan objek yang berbeda jika memang ada yang berubah. Jika tempat penyimpanan Anda mengandung data yang tidak dapat dimutasi, Anda dapat langsung mengembalikan data tersebut:

```js {2-3}
function getSnapshot() {
  // ✅ Anda dapat mengembalikan data yang tidak dapat dimutasi
  return myStore.todos;
}
```

Jika tempat penyimpanan Anda dapat dimutasi, fungsi `getSnapshot` Anda harus mengembalikan *snapshot* yang tidak dapat dimutasi dari data tersebut. Ini berarti fungsi tersebut *harus* membuat objek baru, tetapi tidak pada setiap pemanggilan. Justru, fungsi tersebut sebaiknya menyimpan *snapshot* terakhir dan mengembalikan *snapshot* tersebut jika data belum berubah. Bagaimana Anda menentukan apakah data tersebut sudah berubah atau tidak bergantung kepada tempat penyimpanan Anda.

---

### Fungsi `subscribe` saya tidak dipanggil setelah tiap tahap *render* {/*my-subscribe-function-gets-called-after-every-re-render*/}

Fungsi `subscribe` ini ditulis *di dalam* komponen sehingga fungsi tersebut selalu berbeda di setiap *render*:

```js {4-7}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // 🚩 Selalu fungsi berbeda sehingga React akan berlangganan ulang setiap render
  function subscribe() {
    // ...
  }

  // ...
}
```
  
React akan berlangganan ulang ke tempat penyimpanan Anda jika Anda memberikan fungsi `subscribe` berbeda antar-*render*. Jika ini memberikan masalah terhadap performa dan Anda ingin menghindari proses berlangganan ulang, Anda dapat memindahkan fungsi `subscribe` keluar:

```js {6-9}
function ChatIndicator() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  // ...
}

// ✅ Selalu fungsi yang sama sehingga React tidak perlu berlangganan ulang
function subscribe() {
  // ...
}
```

Cara alternatif adalah dengan membungkus `subscribe` ke dalam [`useCallback`](/reference/react/useCallback) untuk berlangganan ulang hanya jika beberapa argumen berubah:

```js {4-8}
function ChatIndicator({ userId }) {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  
  // ✅ Fungsi yang sama selama userId tidak berubah
  const subscribe = useCallback(() => {
    // ...
  }, [userId]);

  // ...
}
```