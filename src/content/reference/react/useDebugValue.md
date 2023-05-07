---
title: useDebugValue
---

<Intro>

`useDebugValue` merupakan React Hook yang memungkinkan Anda untuk menambahkan label ke sebuah Hook kustom di dalam [React DevTools.](/learn/react-developer-tools)

```js
useDebugValue(value, format?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useDebugValue(value, format?)` {/*usedebugvalue*/}

Panggil `useDebugValue` di bagian atas [Hook kustom](/learn/reusing-logic-with-custom-hooks) Anda untuk manampilkan nilai *debug* yang dapat dibaca:

```js
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `value`: Nilai yang Anda inginkan untuk ditampilkan di dalam React DevTools. Nilai tersebut dapat memiliki tipe apa pun.
* `format` **opsional**: Fungsi untuk pemformatan. Ketika komponen diperiksa, React DevTools akan memanggil fungsi pemformatan dengan `value` sebagai argumennya, dan kemudian menampilkan nilai kembalian yang telah diformat (yang mungkin memiliki jenis apapun). Jika Anda tidak menentukan fungsi pemformatan, `value` asli itu sendiri yang akan ditampilkan.

#### Kembalian {/*returns*/}

`useDebugValue` tidak mengembalikan apapun.

## Penggunaan {/*usage*/}

### Menambahkan sebuah label ke sebuah Hook kustom {/*adding-a-label-to-a-custom-hook*/}

Panggil `useDebugValue` pada bagian atas [Hook kustom](/learn/reusing-logic-with-custom-hooks) Anda untuk menampilkan <CodeStep step={1}>nilai debug</CodeStep> yang dapat dibaca untuk [React DevTools.](/learn/react-developer-tools)

```js [[1, 5, "isOnline ? 'Online' : 'Offline'"]]
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

Hal ini akan mengakibatkan komponen yang memanggil  `useOnlineStatus` memiliki label seperti `OnlineStatus: "Online"` ketika Anda memeriksanya:

![Sebuah tangkapan layar React DevTools yang menunjukan nilai debug](/images/docs/react-devtools-usedebugvalue.png)

Tanpa panggilan `useDebugValue`, hanya data yang mendasarinya (dalam contoh ini, `true`) yang akan ditampilkan.

<Sandpack>

```js
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}

export default function App() {
  return <StatusBar />;
}
```

```js useOnlineStatus.js active
import { useSyncExternalStore, useDebugValue } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
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

<Note>

Jangan menambahkan nilai *debug* untuk setiap Hook kustom. Nilai tersebut paling berharga untuk Hooks kustom yang merupakan bagian dari pustaka bersama dan memiliki struktur data internal yang kompleks sehingga sulit untuk diperiksa.

</Note>

---

### Menunda pemformatan nilai *debug* {/*deferring-formatting-of-a-debug-value*/}

Anda juga bisa meneruskan fungsi pemformatan sebagai argumen kedua ke `useDebugValue`:

```js [[1, 1, "date", 18], [2, 1, "date.toDateString()"]]
useDebugValue(date, date => date.toDateString());
```

Fungsi pemformatan Anda akan menerima <CodeStep step={1}>nilai debug</CodeStep> sebagai sebuah parameter dan akan mengembalikan sebuah <CodeStep step={2}>nilai tampilan yang telah diformat</CodeStep>. Ketika komponen Anda diperiksa, React DevTools akan memanggil fungsi ini dan menampilkan hasilnya.

Ini memungkinkan Anda menghindari menjalankan logika pemformatan yang berpotensi mahal/berat (*potentially expensive formatting logic*) kecuali komponen benar-benar diperiksa. Sebagai contoh, jika `date` merupakan sebuah nilai *Date*, ini menghindari pemanggilan `toDateString()` pada setiap render.
