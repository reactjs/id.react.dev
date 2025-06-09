---
title: 'Menggunakan ulang logika dengan Custom Hooks'
---

<Intro>

React dilengkapi dengan beberapa Hook bawaan seperti `useState`, `useContext`, dan `useEffect`. Terkadang, Anda mungkin ingin ada Hook untuk tujuan yang lebih spesifik: misalnya, untuk mengambil data, melacak apakah pengguna sedang online, atau terhubung ke ruang obrolan. Anda mungkin tidak menemukan Hook ini di React, tetapi Anda dapat membuat Hook Anda sendiri untuk kebutuhan aplikasi Anda.

</Intro>

<YouWillLearn>

- Apa itu custom Hooks, dan bagaimana menulis Hooks sendiri
- Bagaimana cara menggunakan ulang logika antara komponen
- Bagaimana memberi nama dan mengatur struktur Hooks yang dibuat sendiri
- Kapan dan mengapa harus mengekstrak custom Hooks

</YouWillLearn>

## Custom Hooks: Berbagi logika antar komponen {/*custom-hooks-sharing-logic-between-components*/}

Bayangkan Anda sedang mengembangkan aplikasi yang sangat bergantung pada jaringan (seperti kebanyakan aplikasi). Anda ingin memberi peringatan kepada pengguna jika koneksi jaringannya tiba-tiba terputus saat mereka menggunakan aplikasi Anda. Bagaimana cara melakukannya? Sepertinya Anda akan memerlukan dua hal dalam komponen Anda:

1. Sebuah keadaan (state) yang melacak apakah jaringan online.
2. Sebuah Efek yang berlangganan (subscribes) pada peristiwa (events) [`online`](https://developer.mozilla.org/en-US/docs/Web/API/Window/online_event) dan [`offline`](https://developer.mozilla.org/en-US/docs/Web/API/Window/offline_event) global, dan memperbarui state tersebut.

Hal ini akan menjaga [sinkronisasi](/learn/synchronizing-with-effects) komponen Anda dengan status jaringan. Anda mungkin memulainya dengan sesuatu seperti ini:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

</Sandpack>

Coba matikan dan nyalakan jaringan Anda, dan perhatikan bagaimana `StatusBar` ini diperbarui sebagai respons terhadap tindakan Anda.

Sekarang bayangkan Anda *juga* ingin menggunakan logika yang sama pada komponen yang berbeda. Anda ingin mengimplementasikan tombol Simpan yang akan menjadi tidak aktif dan menunjukkan "Sedang menghubungkan kembali..." alih-alih "Simpan" saat jaringan mati.

Untuk memulai, Anda dapat menyalin dan mem-paste state `isOnline` dan Efeknya ke dalam `SaveButton`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  function handleSaveClick() {
    console.log('✅ Progress saved');
  }

  return (
    <button disabled={!isOnline} onClick={handleSaveClick}>
      {isOnline ? 'Save progress' : 'Reconnecting...'}
    </button>
  );
}
```

</Sandpack>

Pastikan, jika Anda mematikan jaringan, tampilan tombol tersebut akan berubah.

Kedua komponen ini berfungsi dengan baik, tetapi duplikasi logika di antara keduanya tidak diinginkan. Meskipun mereka memiliki *tampilan visual* yang berbeda, Anda ingin menggunakan kembali logika yang sama di antara keduanya.

### Mengekstrak custom Hook Anda sendiri dari sebuah komponen {/*extracting-your-own-custom-hook-from-a-component*/}

Bayangkan bahwa, serupa dengan [`useState`](/reference/react/useState) dan [`useEffect`](/reference/react/useEffect), ada sebuah Hook `useOnlineStatus` bawaan. Kemudian kedua komponen ini bisa disederhanakan dan Anda dapat menghapus duplikasi di antara keduanya:

```js {2,7}
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
```
Meskipun tidak ada Hook bawaan seperti itu, Anda dapat menulisnya sendiri. Deklarasikan fungsi bernama `useOnlineStatus` dan pindahkan semua kode duplikat ke dalamnya dari komponen yang Anda tulis sebelumnya:

```js {2-16}
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

Di akhir fungsi, kembalikan `isOnline`. Ini memungkinkan komponen Anda membaca nilai itu:

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

```js src/useOnlineStatus.js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Pastikan bahwa mengubah jaringan on dan off memperbarui kedua komponen.

Sekarang komponen Anda tidak memiliki logika berulang. **Lebih penting lagi, kode di dalamnya menjelaskan *apa yang ingin mereka lakukan* (gunakan status online!) daripada *bagaimana melakukannya* (dengan berlangganan events browser).**

Ketika Anda mengekstrak logika ke dalam custom Hooks, Anda dapat menyembunyikan detail-detail rumit tentang bagaimana Anda menangani sistem eksternal atau API browser. Kode komponen Anda mengekspresikan niat Anda, bukan implementasi.

### Nama hook selalu diawali dengan `use` {/*hook-names-always-start-with-use*/}

Aplikasi React dibangun dari komponen. Komponen dibuat dari Hooks, baik bawaan maupun kustom. Anda mungkin akan sering menggunakan Hooks khusus yang dibuat oleh orang lain, tetapi kadang-kadang Anda mungkin menulisnya sendiri!

Anda harus mengikuti konvensi penamaan ini:

1. **Nama komponen React harus dimulai dengan huruf kapital,** seperti `StatusBar` dan `SaveButton`. Komponen React juga perlu mengembalikan sesuatu yang dapat ditampilkan oleh React, seperti sebuah potongan JSX.
2. **Nama hook harus dimulai dengan `use` diikuti dengan huruf kapital,** seperti [`useState`](/reference/react/useState) (bawaan) atau `useOnlineStatus` (kustom, seperti yang ditunjukkan pada contoh sebelumnya). Hooks dapat mengembalikan nilai arbitrer.

Konvensi ini menjamin bahwa Anda selalu dapat melihat sebuah komponen dan mengetahui di mana letak state, Efek, dan fitur React lainnya mungkin "bersembunyi". Misalnya, jika Anda melihat sebuah panggilan fungsi `getColor()` di dalam komponen Anda, Anda bisa yakin bahwa panggilan itu tidak mungkin mengandung state React di dalamnya karena namanya tidak dimulai dengan `use`. Namun, sebuah panggilan fungsi seperti `useOnlineStatus()` kemungkinan besar akan mengandung panggilan Hook lain di dalamnya!

<Note>

Jika linter Anda [dikonfigurasi untuk React,](/learn/editor-setup#linting) maka linter akan memberlakukan konvensi penamaan ini. Gulir ke atas ke sandbox di atas dan ganti nama `useOnlineStatus` menjadi `getOnlineStatus`. Perhatikan bahwa linter tidak mengizinkan Anda memanggil `useState` atau `useEffect` di dalamnya lagi. Hanya Hook dan komponen saja yang dapat memanggil Hook lainnya!

</Note>

<DeepDive>

#### Apakah semua fungsi yang dipanggil selama rendering harus diawali dengan awalan use? {/*should-all-functions-called-during-rendering-start-with-the-use-prefix*/}

Tidak. Fungsi yang tidak *memanggil* Hooks tidak perlu *menjadi* Hooks.

Jika fungsi Anda tidak memanggil Hooks apa pun, hindari awalan `use`. Sebagai gantinya, tulislah sebagai fungsi biasa *tanpa* awalan `use`. Misalnya, `useSorted` di bawah ini tidak memanggil Hooks, jadi panggil saja `getSorted`:

```js
// 🔴 Hindari: Sebuah Hook yang tidak menggunakan Hooks
function useSorted(items) {
  return items.slice().sort();
}

// ✅ Baik: Sebuah fungsi biasa yang tidak menggunakan Hooks
function getSorted(items) {
  return items.slice().sort();
}
```

Ini memastikan bahwa kode Anda dapat memanggil fungsi biasa ini di mana saja, termasuk pada sebuah kondisi:

```js
function List({ items, shouldSort }) {
  let displayedItems = items;
  if (shouldSort) {
    // ✅ Tidak apa-apa untuk memanggil getSorted() secara kondisional karena ini bukan sebuah Hook
    displayedItems = getSorted(items);
  }
  // ...
}
```

Anda harus memberikan awalan `use` ke sebuah fungsi (dan dengan demikian menjadikannya sebuah Hook) jika fungsi tersebut menggunakan setidaknya satu Hook di dalamnya:

```js
// ✅ Baik: Sebuah Hook yang menggunakan Hook lainnya
function useAuth() {
  return useContext(Auth);
}
```

Secara teknis, ini tidak diberlakukan oleh React. Pada prinsipnya, Anda dapat membuat sebuah Hook yang tidak memanggil Hook lain. Ini seringkali membingungkan dan membatasi jadi sebaiknya hindari pola itu. Namun, mungkin ada kasus yang jarang terjadi di mana itu sangat membantu. Misalnya, mungkin fungsi Anda tidak menggunakan Hooks saat ini, tetapi Anda berencana untuk menambahkan beberapa panggilan Hooks ke dalamnya di masa mendatang. Maka masuk akal untuk menamainya dengan awalan `use`:

```js {3-4}
// ✅ Baik: Sebuah Hook yang kemungkinan akan menggunakan beberapa Hook lainnya nanti
function useAuth() {
  // TODO: Ganti dengan baris ini saat autentikasi diterapkan:
  // return useContext(Auth);
  return TEST_USER;
}
```

Maka komponen tidak akan dapat memanggilnya secara kondisional. Ini akan menjadi penting ketika Anda benar-benar menambahkan panggilan Hook di dalamnya. Jika Anda tidak berencana untuk menggunakan Hooks di dalamnya (sekarang atau nanti), jangan menjadikannya sebagai Hook.

</DeepDive>

### Custom Hooks memungkinkan Anda berbagi logika yang berkelanjutan, bukan state itu sendiri {/*custom-hooks-let-you-share-stateful-logic-not-state-itself*/}

Pada contoh sebelumnya, ketika Anda menghidupkan dan mematikan jaringan, kedua komponen diperbarui secara bersamaan. Namun, salah jika berpikir bahwa satu variabel state `isOnline` dibagikan di antara keduanya. Lihat kode ini:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ini bekerja dengan cara yang sama seperti sebelumnya sebelum duplikasi diekstrak:

```js {2-5,10-13}
function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}

function SaveButton() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    // ...
  }, []);
  // ...
}
```

Ini adalah dua variabel state dan Efek yang sepenuhnya independen! Mereka kebetulan memiliki nilai yang sama pada saat yang sama karena Anda menyinkronkannya dengan nilai eksternal yang sama (apakah jaringan sedang hidup).

Untuk menggambarkan hal ini dengan lebih baik, kita memerlukan contoh yang berbeda. Pertimbangkan komponen `Form` ini:

<Sandpack>

```js
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Ada beberapa logika yang berulang untuk setiap kolom formulir:

1. Ada sebuah state (`firstName` dan `lastName`).
2. Ada handler perubahan (`handleFirstNameChange` dan `handleLastNameChange`).
3. Ada JSX yang menentukan atribut `value` dan `onChange` untuk input tersebut.

Anda dapat mengekstrak logika yang berulang ke dalam Custom Hook `useFormInput` ini:

<Sandpack>

```js
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

```js src/useFormInput.js active
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```

```css
label { display: block; }
input { margin-left: 10px; }
```

</Sandpack>

Perhatikan bahwa itu hanya mendeklarasikan *satu* variabel state yang disebut `value`.

Namun, komponen `Form` memanggil `useFormInput` *dua kali:*

```js
function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');
  // ...
```

Inilah sebabnya mengapa itu bekerja seperti mendeklarasikan dua variabel state yang terpisah!

**Custom Hooks memungkinkan Anda berbagi *logika berkelanjutan* tetapi tidak *state itu sendiri.* Setiap panggilan Hook sepenuhnya independen dari setiap panggilan ke Hook yang sama.** Inilah mengapa kedua sandbox di atas sepenuhnya setara. Jika Anda mau, gulir ke atas dan bandingkan. Perilaku sebelum dan sesudah mengekstrak Custom Hook itu identik.

Ketika Anda perlu membagikan state itu sendiri antara beberapa komponen, [angkat dan lewatkan ke bawah](/learn/sharing-state-between-components) sebagai gantinya.

## Mengirimkan nilai reaktif antara Hooks {/*passing-reactive-values-between-hooks*/}

Kode di dalam kustom Hooks akan dijalankan kembali setiap kali komponen Anda di-*render* ulang. Oleh karena itu, seperti halnya komponen, Custom Hooks [harus bersifat murni.](/learn/keeping-components-pure) Bayangkan kode kustom Hooks sebagai bagian dari badan komponen Anda!

Karena Custom Hooks di-*render* ulang bersama komponen Anda, mereka selalu menerima prop dan state terbaru. Untuk mengetahui apa artinya, pertimbangkan contoh ruang obrolan ini. Ubah URL server atau ruang obrolannya:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  //! A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Ketika Anda mengubah `serverUrl` atau `roomId`, Effect ["bereaksi" terhadap perubahan Anda](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) dan disinkronkan ulang. Anda dapat mengetahui dari pesan konsol bahwa obrolan terhubung kembali setiap kali Anda mengubah dependensi Effect Anda.

Sekarang pindahkan kode Effect ke dalam Custom Hook:

```js {2-13}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Ini memungkinkan komponen `ChatRoom` Anda memanggil Custom Hook tanpa perlu mengkhawatirkan cara kerjanya di dalam:

```js {4-7}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

Ini terlihat jauh lebih sederhana! (Tapi tetap melakukan hal yang sama.)

Perhatikan bahwa logika *tetap merespon* perubahan prop dan state. Coba edit URL server atau ruang yang dipilih:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  //! A real implementation would actually connect to the server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Perhatikan bagaimana Anda mengambil nilai pengembalian dari satu Hook:

```js {2}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

<<<<<<< HEAD
dan meneruskannya sebagai masukan ke Hook lain:
=======
and passing it as an input to another Hook:
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

```js {6}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
```

Setiap kali komponen `ChatRoom` Anda di-*render* ulang, komponen `roomId` dan `serverUrl` terbaru diteruskan ke Hook Anda. Inilah sebabnya Effect Anda terhubung kembali ke obrolan setiap kali nilainya berbeda setelah render ulang. (Jika Anda pernah bekerja dengan perangkat lunak pemrosesan audio atau video, merantai Hooks seperti ini mungkin mengingatkan Anda pada efek visual atau audio yang saling terkait. Seolah-olah output dari `useState` "diumpankan ke dalam" input dari `useChatRoom`.)

### Passing event handlers to custom Hooks {/*passing-event-handlers-to-custom-hooks*/}

<Wip>

Bagian ini menjelaskan **API eksperimental yang belum dirilis** di versi stabil React.

</Wip>

Saat Anda mulai menggunakan `useChatRoom` di lebih banyak komponen, Anda mungkin ingin membiarkan komponen menyesuaikan perilakunya. Sebagai contoh, saat ini, logika tentang apa yang harus dilakukan ketika sebuah pesan datang di-hardcode di dalam Hook:

```js {9-11}
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Katakanlah Anda ingin memindahkan logika ini kembali ke komponen Anda:

```js {7-9}
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });
  // ...
```

Untuk membuatnya berfungsi, ubah custom Hook Anda untuk menerima `onReceiveMessage` sebagai salah satu opsi bernama:

```js {1,10,13}
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ All dependencies declared
}
```

Ini akan berhasil, tetapi ada satu peningkatan lagi yang dapat Anda lakukan ketika custom Hook Anda menerima event handler.

Menambahkan dependensi pada `onReceiveMessage` tidak ideal karena akan menyebabkan chat terhubung kembali setiap kali komponen di-*render* ulang. [Bungkus event handler ini ke dalam Effect Event untuk menghapusnya dari dependensi:](/learn/removing-effect-dependencies#wrapping-an-event-handler-from-the-props)

```js {1,4,5,15,18}
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ Semua dependensi dideklarasikan
}
```

Sekarang obrolan tidak akan terhubung kembali setiap kali komponen `ChatRoom` di-*render* ulang. Berikut adalah demo yang berfungsi penuh untuk meneruskan event handler ke custom Hook yang dapat Anda mainkan:

<Sandpack>

```js src/App.js
import { useState } from 'react';
import ChatRoom from './ChatRoom.js';

export default function App() {
  const [roomId, setRoomId] = useState('general');
  return (
    <>
      <label>
        Choose the chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
      />
    </>
  );
}
```

```js src/ChatRoom.js active
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

```js src/useChatRoom.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

```js src/chat.js
export function createConnection({ serverUrl, roomId }) {
  // Implementasi yang sebenarnya akan terhubung ke server
  if (typeof serverUrl !== 'string') {
    throw Error('Expected serverUrl to be a string. Received: ' + serverUrl);
  }
  if (typeof roomId !== 'string') {
    throw Error('Expected roomId to be a string. Received: ' + roomId);
  }
  let intervalId;
  let messageCallback;
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (messageCallback) {
          if (Math.random() > 0.5) {
            messageCallback('hey')
          } else {
            messageCallback('lol');
          }
        }
      }, 3000);
    },
    disconnect() {
      clearInterval(intervalId);
      messageCallback = null;
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl + '');
    },
    on(event, callback) {
      if (messageCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'message') {
        throw Error('Only "message" event is supported.');
      }
      messageCallback = callback;
    },
  };
}
```

```js src/notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme = 'dark') {
  Toastify({
    text: message,
    duration: 2000,
    gravity: 'top',
    position: 'right',
    style: {
      background: theme === 'dark' ? 'black' : 'white',
      color: theme === 'dark' ? 'white' : 'black',
    },
  }).showToast();
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest",
    "toastify-js": "1.12.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Perhatikan bagaimana Anda tidak perlu lagi mengetahui *bagaimana* `useChatRoom` berfungsi untuk menggunakannya. Anda bisa menambahkannya ke komponen lain, meneruskan opsi lain, dan itu akan bekerja dengan cara yang sama. Itulah kekuatan custom Hooks.

## Kapan menggunakan custom Hooks {/*when-to-use-custom-hooks*/}

Anda tidak perlu mengekstrak custom Hook untuk setiap bit kode yang duplikat. Beberapa duplikasi memang diperbolehkan. Misalnya, mengekstrak Hook `useFormInput` untuk membungkus satu panggilan `useState` seperti sebelumnya mungkin tidak diperlukan.

Namun, kapan pun Anda menulis sebuah Effect, pertimbangkan apakah akan lebih jelas untuk juga membungkusnya dalam sebuah custom Hook. [Anda seharusnya tidak terlalu sering menggunakan Effect,](/learn/you-might-not-need-an-effect) jadi jika Anda menulisnya, itu berarti Anda perlu "keluar dari React" untuk menyinkronkan dengan beberapa sistem eksternal atau untuk melakukan sesuatu yang tidak memiliki API bawaan di React. Membungkusnya menjadi custom Hook memungkinkan Anda mengomunikasikan maksud Anda dengan tepat dan bagaimana data mengalir melewatinya.

Misalnya, pertimbangkan sebuah komponen `ShippingForm` yang menampilkan dua dropdown: satu menampilkan daftar kota, dan lainnya menampilkan daftar area di kota yang dipilih. Anda mungkin akan memulai dengan kode yang terlihat seperti ini:

```js {3-16,20-35}
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // Effect ini mengambil data kota untuk suatu negara
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // Effect ini mengambil data area untuk kota yang dipilih
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

Meskipun kode ini cukup berulang, [memisahkan Efek ini satu sama lain adalah benar.](/learn/removing-effect-dependencies#is-your-effect-doing-several-unrelated-things) Keduanya menyinkronkan dua hal yang berbeda, sehingga Anda tidak boleh menggabungkannya menjadi satu Efek. Sebagai gantinya, Anda dapat menyederhanakan komponen `ShippingForm` di atas dengan mengekstrak logika umum di antara mereka ke dalam `useData` Hook Anda sendiri:

```js {2-18}
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```

Sekarang Anda dapat mengganti kedua Efek di komponen `ShippingForm` dengan panggilan ke `useData`:

```js {2,4}
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Mengekstrak custom Hook membuat aliran data menjadi eksplisit. Anda memasukkan `url` dan Anda mengeluarkan `data`. Dengan "menyembunyikan" Efek Anda di dalam `useData`, Anda juga mencegah seseorang yang bekerja pada komponen `ShippingForm` menambahkan [dependensi yang tidak diperlukan](/learn/removing-effect-dependencies) ke dalamnya. Seiring waktu, sebagian besar Efek aplikasi Anda akan berada di dalam custom Hooks.

<DeepDive>

#### Tetap fokuskan custom Hooks Anda pada kasus penggunaan tingkat tinggi yang konkret {/*keep-your-custom-hooks-focused-on-concrete-high-level-use-cases*/}

Mulailah dengan memilih nama untuk custom Hook Anda. Jika Anda kesulitan memilih nama yang jelas, itu mungkin berarti Effect Anda terlalu terkait dengan logika komponen Anda yang lain, dan belum siap untuk diekstrak.

Idealnya, nama custom Hook Anda harus cukup jelas sehingga bahkan orang yang tidak sering menulis kode dapat memiliki tebakan yang baik tentang apa yang dilakukan oleh custom Hook Anda, apa yang diperlukan, dan apa yang dikembalikan:

* ✅ `useData(url)`
* ✅ `useImpressionLog(eventName, extraData)`
* ✅ `useChatRoom(options)`

Ketika Anda melakukan sinkronisasi dengan sistem eksternal, nama custom Hook Anda mungkin lebih teknis dan menggunakan jargon yang spesifik untuk sistem itu. Itu bagus selama jelas bagi orang yang akrab dengan sistem tersebut:

* ✅ `useMediaQuery(query)`
* ✅ `useSocket(url)`
* ✅ `useIntersectionObserver(ref, options)`

**Tetap fokuskan custom Hooks pada kasus penggunaan tingkat tinggi yang konkret.** Hindari membuat dan menggunakan custom "lifecycle" Hooks yang bertindak sebagai pembungkus alternatif dan praktis untuk API `useEffect` itu sendiri:

* 🔴 `useMount(fn)`
* 🔴 `useEffectOnce(fn)`
* 🔴 `useUpdateEffect(fn)`

Sebagai contoh, Hook `useMount` ini mencoba memastikan beberapa kode hanya berjalan "pada mount":

```js {4-5,14-15}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 🔴 Hindari: menggunakan custom "lifecycle" Hooks
  useMount(() => {
    const connection = createConnection({ roomId, serverUrl });
    connection.connect();

    post('/analytics/event', { eventName: 'visit_chat' });
  });
  // ...
}

// 🔴 Hindari: membuat custom "lifecycle" Hooks
function useMount(fn) {
  useEffect(() => {
    fn();
  }, []); // 🔴 React Hook useEffect memiliki dependensi yang hilang: 'fn'
}
```

**Custom "lifecycle" Hook seperti `useMount` tidak cocok dengan paradigma React.** Sebagai contoh, contoh kode ini memiliki kesalahan (tidak "merespons" terhadap perubahan `roomId` atau `serverUrl`) , tetapi linter tidak akan memperingatkan Anda tentang hal itu karena linter hanya memeriksa panggilan `useEffect` langsung. Itu tidak akan tahu tentang Hook Anda.

Jika Anda menulis sebuah Effect, mulailah dengan menggunakan API React secara langsung:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Baik: dua raw Effects yang dipisahkan berdasarkan tujuan

  useEffect(() => {
    const connection = createConnection({ serverUrl, roomId });
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]);

  useEffect(() => {
    post('/analytics/event', { eventName: 'visit_chat', roomId });
  }, [roomId]);

  // ...
}
```

Kemudian, Anda dapat (tetapi tidak harus) mengekstrak custom Hooks untuk kasus penggunaan tingkat tinggi yang berbeda:

```js
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // ✅ Hebat: custom Hooks dengan nama sesuai tujuan
  useChatRoom({ serverUrl, roomId });
  useImpressionLog('visit_chat', { roomId });
  // ...
}
```

**Custom Hook yang baik membuat kode yang dipanggil lebih deklaratif dengan membatasi apa yang dilakukannya.** Sebagai contoh, `useChatRoom(options)` hanya dapat terhubung ke ruang obrolan, sementara `useImpressionLog(eventName, extraData)` hanya dapat mengirim log impresi ke analitik. Jika API custom Hook Anda tidak membatasi kasus penggunaan dan sangat abstrak, dalam jangka panjang kemungkinan akan menimbulkan lebih banyak masalah daripada penyelesaiannya.

</DeepDive>

### Custom Hooks membantu Anda bermigrasi ke pola yang lebih baik {/*custom-hooks-help-you-migrate-to-better-patterns*/}

Effects merupakan sebuah ["escape hatch"](/learn/escape-hatches): Anda menggunakannya ketika Anda perlu "keluar dari React" dan ketika tidak ada solusi bawaan yang lebih baik untuk kasus penggunaan Anda. Seiring waktu, tujuan tim React adalah untuk mengurangi jumlah Effects di aplikasi Anda seminimal mungkin dengan memberikan solusi yang lebih spesifik untuk masalah yang lebih spesifik. Membungkus Effects Anda dalam custom Hooks memudahkan untuk memutakhirkan kode Anda ketika solusi-solusi ini tersedia.

Mari kita kembali ke contoh ini:

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

```js src/useOnlineStatus.js active
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

</Sandpack>

Dalam contoh di atas, `useOnlineStatus` diimplementasikan dengan sepasang [`useState`](/reference/react/useState) dan [`useEffect`.](/reference/react/useEffect) Namun, ini bukanlah solusi terbaik. Ada beberapa kasus tepi yang tidak dipertimbangkan. Misalnya, diasumsikan bahwa ketika komponen dipasang, `isOnline` sudah `benar`, tetapi hal ini mungkin salah jika jaringan sudah offline. Anda dapat menggunakan API browser [`navigator.onLine`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine) untuk memeriksanya, tetapi menggunakannya secara langsung tidak akan berhasil di server untuk menghasilkan HTML awal. Singkatnya, kode ini dapat diperbaiki.

<<<<<<< HEAD
Untungnya, React 18 menyertakan API khusus yang disebut [`useSyncExternalStore`](/reference/react/useSyncExternalStore) yang menangani semua masalah ini untuk Anda. Berikut adalah bagaimana Hook `useOnlineStatus` Anda, ditulis ulang untuk memanfaatkan API baru ini:
=======
React includes a dedicated API called [`useSyncExternalStore`](/reference/react/useSyncExternalStore) which takes care of all of these problems for you. Here is your `useOnlineStatus` Hook, rewritten to take advantage of this new API:
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

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

```js src/useOnlineStatus.js active
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // Bagaimana cara mendapatkan nilai di sisi klien
    () => true // Bagaimana cara mendapatkan nilai di sisi server
  );
}

```

</Sandpack>

Perhatikan bagaimana **Anda tidak perlu mengubah komponen apa pun** untuk melakukan migrasi ini:

```js {2,7}
function StatusBar() {
  const isOnline = useOnlineStatus();
  // ...
}

function SaveButton() {
  const isOnline = useOnlineStatus();
  // ...
}
```

Ini adalah alasan lain mengapa membungkus Effects di custom Hooks seringkali bermanfaat:

1. Anda membuat aliran data ke dan dari Effects Anda sangat eksplisit.
2. Anda membiarkan komponen Anda fokus pada maksud daripada pada implementasi yang tepat dari Effects Anda.
3. Saat React menambahkan fitur baru, Anda dapat menghapus Effects tersebut tanpa mengubah komponen apa pun.

Mirip dengan [sistem desain,](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969) Anda mungkin merasa terbantu untuk mulai mengekstraksi idiom umum dari komponen aplikasi Anda ke dalam custom Hooks. Ini akan membuat kode komponen Anda tetap fokus pada maksud, dan memungkinkan Anda menghindari menulis Effects mentah terlalu sering. Banyak custom Hooks yang sangat baik dikelola oleh komunitas React.

<DeepDive>

#### Akankah React akan menyediakan solusi bawaan untuk pengambilan data? {/*will-react-provide-any-built-in-solution-for-data-fetching*/}

Kami masih mengerjakan detailnya, tetapi kami berharap di masa mendatang, Anda akan menulis pengambilan data seperti ini:

```js {1,4,6}
import { use } from 'react'; // Belum tersedia!

function ShippingForm({ country }) {
  const cities = use(fetch(`/api/cities?country=${country}`));
  const [city, setCity] = useState(null);
  const areas = city ? use(fetch(`/api/areas?city=${city}`)) : null;
  // ...
```

Jika Anda menggunakan custom Hooks seperti `useData` di atas dalam aplikasi Anda, itu akan memerlukan lebih sedikit perubahan untuk bermigrasi ke pendekatan yang direkomendasikan daripada jika Anda menulis Effects mentah di setiap komponen secara manual. Namun, pendekatan lama akan tetap berfungsi dengan baik, jadi jika Anda merasa senang menulis Effects mentah, Anda dapat terus melakukannya.

</DeepDive>

### Ada lebih dari satu cara untuk melakukannya {/*there-is-more-than-one-way-to-do-it*/}

Katakanlah Anda ingin mengimplementasikan animasi fade-in *dari awal* menggunakan API browser [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame). Anda mungkin memulainya dengan sebuah Effect yang menyiapkan lingkaran animasi. Selama setiap frame animasi, Anda dapat mengubah opacity node DOM yang [disimpan di ref](/learn/manipulating-the-dom-with-refs) hingga mencapai `1`. Kode Anda mungkin dimulai seperti ini:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const duration = 1000;
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Masih ada banyak frame yang perlu diwarnai
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, []);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Untuk membuat komponen lebih mudah dibaca, Anda dapat mengekstrak logika ke dalam custom Hook `useFadeIn`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js
import { useEffect } from 'react';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const node = ref.current;

    let startTime = performance.now();
    let frameId = null;

    function onFrame(now) {
      const timePassed = now - startTime;
      const progress = Math.min(timePassed / duration, 1);
      onProgress(progress);
      if (progress < 1) {
        // Masih ada banyak frame yang perlu diwarnai
        frameId = requestAnimationFrame(onFrame);
      }
    }

    function onProgress(progress) {
      node.style.opacity = progress;
    }

    function start() {
      onProgress(0);
      startTime = performance.now();
      frameId = requestAnimationFrame(onFrame);
    }

    function stop() {
      cancelAnimationFrame(frameId);
      startTime = null;
      frameId = null;
    }

    start();
    return () => stop();
  }, [ref, duration]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Anda dapat mempertahankan kode `useFadeIn` apa adanya, tetapi Anda juga dapat merestrukturisasi lebih lanjut. Misalnya, Anda dapat mengekstrak logika untuk menyiapkan loop animasi dari `useFadeIn` menjadi custom Hook `useAnimationLoop`:

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useFadeIn(ref, duration) {
  const [isRunning, setIsRunning] = useState(true);

  useAnimationLoop(isRunning, (timePassed) => {
    const progress = Math.min(timePassed / duration, 1);
    ref.current.style.opacity = progress;
    if (progress === 1) {
      setIsRunning(false);
    }
  });
}

function useAnimationLoop(isRunning, drawFrame) {
  const onFrame = useEffectEvent(drawFrame);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startTime = performance.now();
    let frameId = null;

    function tick(now) {
      const timePassed = now - startTime;
      onFrame(timePassed);
      frameId = requestAnimationFrame(tick);
    }

    tick();
    return () => cancelAnimationFrame(frameId);
  }, [isRunning]);
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
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

Namun, Anda tidak *harus* melakukan itu. Seperti halnya fungsi biasa, pada akhirnya Anda yang memutuskan di mana harus menggambar batas antara berbagai bagian kode Anda. Anda juga bisa mengambil pendekatan yang sangat berbeda. Alih-alih mempertahankan logika dalam Effect, Anda dapat memindahkan sebagian besar logika imperatif ke dalam JavaScript [class:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { useFadeIn } from './useFadeIn.js';

function Welcome() {
  const ref = useRef(null);

  useFadeIn(ref, 1000);

  return (
    <h1 className="welcome" ref={ref}>
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```js src/useFadeIn.js active
import { useState, useEffect } from 'react';
import { FadeInAnimation } from './animation.js';

export function useFadeIn(ref, duration) {
  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(duration);
    return () => {
      animation.stop();
    };
  }, [ref, duration]);
}
```

```js src/animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    this.onProgress(0);
    this.startTime = performance.now();
    this.frameId = requestAnimationFrame(() => this.onFrame());
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress === 1) {
      this.stop();
    } else {
      // Masih ada banyak frame yang perlu diwarnai
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onProgress(progress) {
    this.node.style.opacity = progress;
  }
  stop() {
    cancelAnimationFrame(this.frameId);
    this.startTime = null;
    this.frameId = null;
    this.duration = 0;
  }
}
```

```css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
.welcome {
  opacity: 0;
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);
}
```

</Sandpack>

Effects memungkinkan Anda menghubungkan React dengan sistem eksternal. Semakin banyak koordinasi antara Effects yang dibutuhkan (misalnya, untuk menghubungkan beberapa animasi), semakin masuk akal untuk mengekstrak logika tersebut dari Effects dan Hooks *sepenuhnya* seperti yang ditunjukkan di sandbox di atas. Kemudian, kode yang Anda ekstrak *menjadi* "sistem eksternal". Ini memungkinkan Effects Anda tetap sederhana karena mereka hanya perlu mengirim pesan ke sistem yang telah Anda pindahkan ke luar React.

Contoh di atas mengasumsikan bahwa logika fade-in perlu ditulis dalam JavaScript. Namun, animasi fade-in khusus ini lebih sederhana dan jauh lebih efisien untuk diterapkan dengan [Animasi CSS:](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations/Using_CSS_animations) biasa

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import './welcome.css';

function Welcome() {
  return (
    <h1 className="welcome">
      Welcome
    </h1>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Remove' : 'Show'}
      </button>
      <hr />
      {show && <Welcome />}
    </>
  );
}
```

```css src/styles.css
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }
```

```css src/welcome.css active
.welcome {
  color: white;
  padding: 50px;
  text-align: center;
  font-size: 50px;
  background-image: radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%);

  animation: fadeIn 1000ms;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

```

</Sandpack>

Terkadang, Anda bahkan tidak perlu menggunakan Hook!

<Recap>

- Custom Hook memungkinkan Anda untuk berbagi logika antar komponen.
- Custom Hook harus diberi nama yang dimulai dengan `use` diikuti oleh huruf kapital.
- Custom Hook hanya berbagi logika yang berhubungan dengan state, bukan state itu sendiri.
- Anda dapat meneruskan nilai reaktif dari satu Hook ke Hook lainnya, dan nilai tersebut tetap up-to-date.
- Semua Hook dijalankan ulang setiap kali komponen Anda di-*render* ulang.
- Kode dari custom Hook Anda harus bersifat murni, seperti kode komponen Anda.
- Bungkus event handler yang diterima oleh custom Hook menjadi Effect Events.
- Jangan membuat Custom Hook seperti `useMount`. Jaga agar tujuan mereka tetap spesifik.
- Itu terserah Anda bagaimana dan di mana Anda memilih batasan dalam kode Anda.

</Recap>

<Challenges>

#### Ekstrak custom Hook `useCounter` {/*extract-a-usecounter-hook*/}

Komponen ini menggunakan variabel state dan Effect untuk menampilkan angka yang bertambah setiap detik. Ekstrak logika ini menjadi custom Hook bernama `useCounter`. Tujuan Anda adalah membuat implementasi komponen `Counter` terlihat persis seperti ini:

```js
export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

Anda perlu menulis custom Hook Anda di dalam file `useCounter.js` dan mengimpornya ke file `App.js`.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
// Tulis Hook kustom Anda di file ini!
```

</Sandpack>

<Solution>

Kode Anda harus terlihat seperti ini:

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter();
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

Perhatikan bahwa `App.js` tidak perlu mengimpor `useState` atau `useEffect` lagi.

</Solution>

#### Buat penundaan hitungan mundur dapat dikonfigurasi {/*make-the-counter-delay-configurable*/}

Pada contoh ini, terdapat variabel status `delay` yang dikontrol oleh slider, tetapi nilainya tidak digunakan. Teruskan nilai `delay` ke dalam custom Hook `useCounter` Anda, dan ubah Hook `useCounter` untuk menggunakan `delay` yang diteruskan daripada `1000` ms yang telah di-hardcode.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter();
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);
  return count;
}
```

</Sandpack>

<Solution>

Teruskan `delay` ke Hook Anda dengan `useCounter(delay)`. Kemudian, di dalam Hook, gunakan `delay` sebagai pengganti nilai `1000` yang telah di-hardcode. Anda perlu menambahkan `delay` ke dependencies Effect Anda. Hal ini memastikan bahwa perubahan pada `delay` akan mengatur ulang interval.

<Sandpack>

```js
import { useState } from 'react';
import { useCounter } from './useCounter.js';

export default function Counter() {
  const [delay, setDelay] = useState(1000);
  const count = useCounter(delay);
  return (
    <>
      <label>
        Tick duration: {delay} ms
        <br />
        <input
          type="range"
          value={delay}
          min="10"
          max="2000"
          onChange={e => setDelay(Number(e.target.value))}
        />
      </label>
      <hr />
      <h1>Ticks: {count}</h1>
    </>
  );
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

</Sandpack>

</Solution>

#### Ekstrak `useInterval` dari `useCounter` {/*extract-useinterval-out-of-usecounter*/}

Saat ini, custom Hook `useCounter` Anda melakukan dua hal. Ia mengatur interval, dan juga menambah variabel state pada setiap kali interval berjalan. Pisahkan logika yang mengatur interval menjadi custom Hook terpisah yang disebut `useInterval`. Ia harus menerima dua argumen: callback `onTick`, dan `delay`. Setelah perubahan ini, implementasi `useCounter` Anda akan terlihat seperti ini:

```js
export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

Tulislah `useInterval` di dalam file `useInterval.js` dan impor ke dalam file `useCounter.js`.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState, useEffect } from 'react';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1);
    }, delay);
    return () => clearInterval(id);
  }, [delay]);
  return count;
}
```

```js src/useInterval.js
// Tulislah Hook Anda di sini!
```

</Sandpack>

<Solution>

Logika di dalam `useInterval` harus mengatur dan menghapus interval. Ia tidak perlu melakukan hal lain.

<Sandpack>

```js
import { useCounter } from './useCounter.js';

export default function Counter() {
  const count = useCounter(1000);
  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [onTick, delay]);
}
```

</Sandpack>

Perhatikan bahwa ada sedikit masalah dengan solusi ini, yang akan Anda selesaikan pada tantangan berikutnya.

</Solution>

#### Perbaiki interval yang direset {/*fix-a-resetting-interval*/}

Dalam contoh ini, ada *dua* interval terpisah.

Komponen `App` memanggil `useCounter`, yang kemudian memanggil `useInterval` untuk memperbarui hitungan setiap detik. Namun komponen `App` *juga* memanggil `useInterval` untuk memperbarui warna latar belakang halaman secara acak setiap dua detik.

Untuk beberapa alasan, callback yang memperbarui warna latar belakang halaman tidak pernah berjalan. Tambahkan beberapa log di dalam `useInterval`:

```js {2,5}
  useEffect(() => {
    console.log('✅ Setting up an interval with delay ', delay)
    const id = setInterval(onTick, delay);
    return () => {
      console.log('❌ Clearing an interval with delay ', delay)
      clearInterval(id);
    };
  }, [onTick, delay]);
```

Apakah log tersebut sesuai dengan yang Anda harapkan? Jika beberapa Effect Anda tampaknya melakukan sinkronisasi ulang secara tidak perlu, dapatkah Anda menebak dependensi mana yang menyebabkan hal tersebut terjadi? Apakah ada cara untuk [menghilangkan dependensi tersebut](/learn/removing-effect-dependencies) dari Effect Anda?

Setelah Anda memperbaiki masalah ini, Anda seharusnya melihat perubahan warna latar belakang halaman setiap dua detik.

<Hint>

Sepertinya custom Hook `useInterval` Anda menerima sebuah event listener sebagai argumen. Bisakah Anda memikirkan cara untuk membungkus event listener tersebut sehingga tidak perlu menjadi dependensi Effect Anda?

</Hint>

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(onTick, delay) {
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => {
      clearInterval(id);
    };
  }, [onTick, delay]);
}
```

</Sandpack>

<Solution>

Di dalam `useInterval`, bungkus callback tick menjadi sebuah Event Effect, seperti yang Anda lakukan [sebelumnya di halaman ini.](/learn/reusing-logic-with-custom-hooks#passing-event-handlers-to-custom-hooks)

Ini akan memungkinkan Anda menghilangkan `onTick` dari *dependensi* Effect Anda. Effect tidak akan disinkronkan setiap kali komponen di-*render* ulang, sehingga interval perubahan warna latar belakang halaman tidak akan diatur ulang setiap detik sebelum sempat aktif.

Dengan perubahan ini, kedua interval akan berfungsi seperti yang diharapkan dan tidak saling mengganggu:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "react": "experimental",
    "react-dom": "experimental",
    "react-scripts": "latest"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```


```js
import { useCounter } from './useCounter.js';
import { useInterval } from './useInterval.js';

export default function Counter() {
  const count = useCounter(1000);

  useInterval(() => {
    const randomColor = `hsla(${Math.random() * 360}, 100%, 50%, 0.2)`;
    document.body.style.backgroundColor = randomColor;
  }, 2000);

  return <h1>Seconds passed: {count}</h1>;
}
```

```js src/useCounter.js
import { useState } from 'react';
import { useInterval } from './useInterval.js';

export function useCounter(delay) {
  const [count, setCount] = useState(0);
  useInterval(() => {
    setCount(c => c + 1);
  }, delay);
  return count;
}
```

```js src/useInterval.js active
import { useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export function useInterval(callback, delay) {
  const onTick = useEffectEvent(callback);
  useEffect(() => {
    const id = setInterval(onTick, delay);
    return () => clearInterval(id);
  }, [delay]);
}
```

</Sandpack>

</Solution>

#### Menerapkan gerakan bergiliran {/*implement-a-staggering-movement*/}

Dalam contoh ini, Hook `usePointerPosition()` melacak posisi pointer saat ini. Coba gerakkan kursor atau jari Anda ke area pratinjau dan lihat titik merah mengikuti gerakan Anda. Posisinya disimpan dalam variabel `pos1`.

Faktanya, ada lima (!) titik merah yang berbeda yang di-*render*. Anda tidak melihat semuanya karena saat ini mereka semua muncul di posisi yang sama. Inilah yang perlu Anda perbaiki. Yang ingin Anda implementasikan adalah gerakan "bergiliran": setiap titik harus "mengikuti" jalur titik sebelumnya. Misalnya, jika Anda memindahkan kursor dengan cepat, titik pertama harus segera mengikuti dengan segera, titik kedua harus mengikuti titik pertama dengan penundaan kecil, titik ketiga harus mengikuti titik kedua, dan seterusnya.

Anda perlu mengimplementasikan custom Hook `useDelayedValue`. Implementasi saat ini mengembalikan `value` yang diberikan kepadanya. Sebagai gantinya, Anda ingin mengembalikan nilai dari `delay` milidetik yang lalu. Anda mungkin memerlukan beberapa state dan sebuah Effect untuk melakukannya.

Setelah Anda mengimplementasikan `useDelayedValue`, Anda akan melihat titik-titik bergerak mengikuti satu sama lain.

<Hint>

Anda harus menyimpan `delayedValue` sebagai variabel state di dalam custom Hook Anda. Saat `value` berubah, Anda ingin menjalankan sebuah Effect. Effect ini harus memperbarui `delayedValue` setelah `delay`. Anda mungkin merasa terbantu dengan memanggil `setTimeout`.

Apakah Effect ini memerlukan pembersihan? Mengapa atau mengapa tidak?

</Hint>

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  // TODO: Implementasi Hook ini
  return value;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

<Solution>

Berikut ini adalah versi yang berfungsi. Anda menyimpan `delayedValue` sebagai variabel state. Ketika `value` diperbarui, Effect Anda menjadwalkan timeout untuk memperbarui `delayedValue`. Inilah mengapa `delayedValue` selalu "terlambat" dibandingkan `value` yang sebenarnya.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { usePointerPosition } from './usePointerPosition.js';

function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos3, 50);
  return (
    <>
      <Dot position={pos1} opacity={1} />
      <Dot position={pos2} opacity={0.8} />
      <Dot position={pos3} opacity={0.6} />
      <Dot position={pos4} opacity={0.4} />
      <Dot position={pos5} opacity={0.2} />
    </>
  );
}

function Dot({ position, opacity }) {
  return (
    <div style={{
      position: 'absolute',
      backgroundColor: 'pink',
      borderRadius: '50%',
      opacity,
      transform: `translate(${position.x}px, ${position.y}px)`,
      pointerEvents: 'none',
      left: -20,
      top: -20,
      width: 40,
      height: 40,
    }} />
  );
}
```

```js src/usePointerPosition.js
import { useState, useEffect } from 'react';

export function usePointerPosition() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
  }, []);
  return position;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

Perhatikan bahwa Effect ini *tidak* memerlukan pembersihan. Jika Anda memanggil `clearTimeout` dalam fungsi pembersihan, maka setiap kali `value` berubah, timeout yang sudah dijadwalkan akan diatur ulang. Agar gerakan terus berlanjut, Anda ingin semua timeout tersebut berjalan.

</Solution>

</Challenges>
