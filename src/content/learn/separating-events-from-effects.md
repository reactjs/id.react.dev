---
title: 'Membedakan Event dengan Effect'
---

<Intro>

*Event handler* hanya akan dijalankan ulang ketika kita melakukan interaksi yang sama kembali. Berbeda dengan *event handler*, *Effect* akan disinkronisasi ulang jika beberapa nilai yang dibaca,seperti *prop* atau variabel *state*, berbeda dari apa yang ada pada *render* sebelumnya. Terkadang Anda juga ingin mencampur perilaku keduanya: Sebuah *Effect* yang dijalankan ulang menanggapi beberapa nilai tertentu tapi tidak pada yang lainnya. Halaman ini akan mengajari Anda cara melakukannya.

</Intro>

<YouWillLearn>

- Cara memilih antara *event handler* dan *Effect*
- Mengapa Effect bersifat reaktif, dan event handler tidak
- Bagaimana cara kita membuat beberapa bagian dari kode Effect agar tidak reaktif
- Apa yang dimaksud *Effect Event*, dan bagaimana untuk mengeluarkan dari *Effect* Anda
- Bagaimana cara membaca nilai *props* dan *state terbaru dari *Effects* menggunakan *Effect Event*

</YouWillLearn>

## Memilih antara *event handler* atau Effect {/*choosing-between-event-handlers-and-effects*/}

Pertama, mari kita rangkum perbedaan antara *event handler* dan *Effects*.

Bayangkan Anda sedang menerapkan suatu komponen ruang obrolan (*chatroom*). Persyaratan Anda terlihat seperti ini:

1. Komponen Anda harus terhubung secara otomatis ke ruang obrolan yang terpilih.
1. Ketika Anda menekan tombol 'Kirim, itu harus mengirimkan pesan ke dalam obrolan.

Katakanlah Anda telah mengimplementasikan kode tersebut, tapi Anda tidak yakin dimana meletakannya. Apakah Anda perlu menggunakan *event handler* atau *Effects*? Setiap kali Anda butuh jawaban dari pertanyaan ini, pertimbangkan [*mengapa* kode tersebut perlu dijalankan](/learn/synchronizing-with-effects#what-are-effects-and-how-are-they-different-from-events).

### *Event handler* tereksekusi karena interaksi tertentu {/*event-handlers-run-in-response-to-specific-interactions*/}

Dari sudut pandang pengguna, pengiriman pesan harus terjadi karena tombol "Kirim" tertentu diklik. Pengguna akan agak kesal jika kita mengirim pesan mereka di waktu lain atau karena alasan lain. Inilah sebabnya mengapa mengirim pesan harus menjadi *event handler*. *Event handler* memungkinkan kita menangani interaksi tertentu:

```js {4-6}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');
  // ...
  function handleSendClick() {
    sendMessage(message);
  }
  // ...
  return (
    <>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Kirim</button>;
    </>
  );
}
```

Dengan *event handler*, kita bisa yakin bahwa `sendMessage(message)` *hanya* akan tereksekusi jika pengguna menekan tombol. 

### Effect tereksekusi ketika sinkronisasi diperlukan {/*effects-run-whenever-synchronization-is-needed*/}

Jangan lupa bahwa kita juga harus menjaga agar komponen kita tetap terhubung dengan ruang obrolan. Kita perlu memikirkan ke mana kode tersebut seharusnya ditempatkan.

Kita harus menjalankan kode tersebut untuk memastikan komponen ini tetap terhubung ke server obrolan yang dipilih, *bukan* karena interaksi tertentu. Tidak peduli bagaimana atau mengapa pengguna berpindah ke layar ruang obrolan, yang penting adalah sekarang mereka melihatnya dan dapat berinteraksi dengannya. Oleh karena itu, kita perlu memastikan komponen kita tetap terhubung ke server obrolan yang dipilih, bahkan jika pengguna tidak berinteraksi dengan aplikasi kita sama sekali. Inilah sebab mengapa kita perlu menggunakan Effect untuk memastikan hal tersebut terjadi:

```js {3-9}
function ChatRoom({ roomId }) {
  // ...
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId]);
  // ...
}
```

Dengan kode ini, kita dapat memastikan adanya koneksi aktif ke server obrolan yang dipilih saat ini, *tanpa* perlu bergantung pada interaksi pengguna. Tidak peduli apakah pengguna hanya membuka aplikasi kita, memilih ruangan yang berbeda, atau menavigasi ke layar lain kemudian kembali, Effect dapat memberikan jaminan bahwa komponen akan *tetap disinkronisasi* dengan ruangan obrolan yang dipilih saat ini. Sehingga, komponen akan selalu terhubung ke server obrolan yang dipilih saat ini dan akan [tersambung kembali setiap kali diperlukan.](/learn/lifecycle-of-reactive-effects#why-synchronization-may-need-to-happen-more-than-once)

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  function handleSendClick() {
    sendMessage(message);
  }

  return (
    <>
      <h1>Selamat datang di room {roomId}!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
      <button onClick={handleSendClick}>Kirim</button>
    </>
  );
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <button onClick={() => setShow(!show)}>
        {show ? 'Tutup chat' : 'Buka chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
export function sendMessage(message) {
  console.log('🔵 Anda mengirim: ' + message);
}

export function createConnection(serverUrl, roomId) {
  // Implementasi yang sesungguhnya akan terhubung ke server.
  return {
    connect() {
      console.log('✅ Menghubungkan ke room "' + roomId + '" pada url ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Room "' + roomId + '" terputus pada url ' + serverUrl);
    }
  };
}
```

```css
input, select { margin-right: 20px; }
```

</Sandpack>

## Nilai reaktif dan logika reaktif {/*reactive-values-and-reactive-logic*/}

Secara intuitif, kita bisa mengatakan bahwa event handler selalu dipicu "secara manual", misalnya dengan mengklik sebuah tombol. Sementara itu, Effect berjalan "secara otomatis". Mereka berjalan dan berjalan kembali sesering yang diperlukan untuk memastikan sinkronisasi tetap terjaga.

Namun, ada cara yang lebih tepat untuk memikirkan perbedaan antara keduanya. 

*Props*, *state*, dan variabel yang dideklarasikan di dalam komponen disebut <CodeStep step={2}>nilai reaktif</CodeStep>. Dalam contoh ini, `serverUrl` bukan merupakan nilai reaktif, melainkan `roomId` dan `message`. Keduanya berpartisipasi dalam aliran data *rendering*, sehingga harus diatur sebagai nilai reaktif agar sinkronisasi dapat terjaga:

```js [[2, 3, "roomId"], [2, 4, "message"]]
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  // ...
}
```

Nilai reaktif seperti ini dapat berubah karena *rendering* ulang suatu komponen. Misalnya, pengguna dapat melakukan beberapa tindakan, seperti mengedit `message` atau memilih `roomId` yang berbeda di menu drop-down. *Event handler* dan Effect merespon perubahan tersebut dengan cara yang berbeda:

- **Kode di dalam *event handler* bersifat *non-reaktif.*** Ketika sebuah *event handler* dijalankan (yang disebabkan oleh tindakan pengguna seperti tombol diklik), mereka membaca nilai reaktif tanpa bereaksi terhadap perubahannya. Artinya, jika kita ingin *event handler* membaca suatu nilai reaktif, mereka tidak akan merespon ketika nilainya berubah kecuali tindakan pengguna yang sama kembali dijalankan.
- **Kode di dalam Effect bersifat *reaktif.*** Jika kita menggunakan Effect untuk membaca nilai reaktif, kita harus [mendeklarasikannya sebagai salah satu dependensi Effect tersebut.](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) Kemudian jika *render* ulang menyebabkan nilai tersebut berubah, React akan menjalankan kembali logika Effect dengan nilai yang baru, sehingga memastikan sinkronisasi data terjaga. 

Mari kita lihat kembali contoh sebelumnya untuk mengilustrasikan perbedaan ini.

### Kode di dalam *event handler* bersifat tidak reaktif {/*logic-inside-event-handlers-is-not-reactive*/}

Mari kita lihat baris kode ini. Apakah kode ini seharusnya merupakan nilai reaktif atau tidak?

```js [[2, 2, "message"]]
    // ...
    sendMessage(message);
    // ...
```

Dari sudut pandang pengguna, **perubahan dalam nilai `message` *tidak* selalu berarti mereka hendak mengirim pesan**. Hal ini mungkin hanya berarti bahwa pengguna sedang mengetik. Oleh karena itu, logika pengiriman pesan tidak seharusnya diatur sebagai <CodeStep step={2}>nilai reaktif</CodeStep>, agar tidak dipicu secara otomatis setiap kali nilai message berubah. Sebaliknya, logika ini sebaiknya diimplementasikan pada *event handler*:

```js {2}
  function handleSendClick() {
    sendMessage(message);
  }
```

*Event handler* bersifat tidak reaktif, jadi `sendMessage(message)` hanya akan tereksekusi saat pengguna mengklik tombol Kirim.

### Kode didalam Effect bersifat reaktif {/*logic-inside-effects-is-reactive*/}

Sekarang mari kita kembali ke baris ini:

```js [[2, 2, "roomId"]]
    // ...
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    // ...
```

Dari sudut pandang pengguna, **perubahan pada `roomId` *berarti* mereka ingin terhubung ke ruangan yang berbeda**. Dengan kata lain, logika untuk menghubungkan ke *chatroom* harus reaktif. Kita *ingin* baris kode ini "mengikuti" <CodeStep step={2}>nilai reaktif</CodeStep>, dan berjalan lagi jika nilai tersebut berubah. Itu sebabnya kita implementasikan sebagai Effect:

```js {2-3}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId]);
```

Effect bersifat reaktif, jadi `createConnection(serverUrl, roomId)` dan `connection.connect()` akan terksekusi setiap kali nilai `roomId` berubah. Effect ini membantu kita menjaga koneksi tetap tersinkronasi sesuai *chatroom* yang dipilih saat ini.

## Mengekstrak logika non-reaktif dari Effect {/*extracting-non-reactive-logic-out-of-effects*/}

Semuanya menjadi lebih kompleks ketika kita ingin menggabungkan logika reaktif dengan logika non-reaktif.

Misalnya, pertimbangkan skenario di mana kita ingin menampilkan notifikasi saat pengguna terhubung ke obrolan. Serta kita juga ingin membaca nilai tema saat ini (terang atau gelap) dari *props* dari komponen, sehingga notifikasi yang ditampilkan akan memiliki warna yang tepat sesuai dengan tema yang digunakan:

```js {1,4-6}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Terhubung!', theme);
    });
    connection.connect();
    // ...
````

Namun, `theme` adalah nilai reaktif (dapat berubah sebagai hasil dari *render* ulang), dan [setiap nilai reaktif yang dibaca oleh Effect harus dideklarasikan sebagai dependensi Effect tersebut.](/learn/lifecycle-of-reactive-effects#react-verifies-that-you-specified-every-reactive-value-as-a-dependency) Sekarang kita harus menentukan `theme` sebagai dependensi Effect:

```js {5,11}
function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Terhubung!', theme);
    });
    connection.connect();
    return () => {
      connection.disconnect()
    };
  }, [roomId, theme]); // ✅ Semua dependensi telah didelarasikan
  // ...
````

Cobalah contoh di bawah ini dan cari tahu apakah kamu bisa menemukan masalah pada program berikut:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      showNotification('Terhubung!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Selamat datang di room {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Pakai dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi sebenarnya akan terhubung ke server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Ketika `roomId` berubah, *chat* terhubung kembali seperti yang diharapkan. Tetapi karena `theme` juga termasuk dependensi Effect, *chat* *juga* terhubung kembali setiap kita beralih antara tema gelap dan terang. Itu tidak bagus!

Dengan kata lain, kita *tidak* ingin baris ini menjadi reaktif, meskipun berada di dalam Effect (yang reaktif):

```js
      // ...
      showNotification('Connected!', theme);
      // ...
```

Kita memerlukan cara untuk memisahkan logika non-reaktif ini dari logika Effect reaktif di sekitarnya.

### Mendeklarasikan Effect Event {/*declaring-an-effect-event*/}

<Wip>

Bagian ini menjelaskan **API eksperimental yang belum dirilis** dalam versi React yang stabil.

</Wip>

Gunakan Hook khusus [`useEffectEvent`](/reference/react/experimental_useEffectEvent) untuk mengekstrak logika non-reaktif ini dari Effect:

```js {1,4-6}
import { useEffect, useEffectEvent } from 'react';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Terhubung!', theme);
  });
  // ...
````

Disini, `onConnected` disebut dengan Effect Event. Meskipun merupakan bagian dari logika Effect, namun mempunyai sifat seperti *event handler*. Logika di dalamnya tidak reaktif, dan selalu memperhatikan nilai terbaru dari *props* dan *state*.

Sekarang kita dapat memanggil Effect Event `onConnected` dari dalam Effect:

```js {2-4,9,13}
function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Terhubung!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected(); 
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ Semua dependensi dideklarasikan, karena theme tidak lagi merupakan dependensi Effect, maka tidak akan tereksekusi ulang jika nilai theme berubah.
  // ...
```

Masalah terpecahkan.  Perhatikan bahwa kita harus *menghapus* `onConnected` dari daftar dependensi Effect. **Effect Event tidak reaktif dan harus dihilangkan dari dependensi.**

Pastikan bahwa program baru berfungsi seperti yang kita harapkan:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Terhubung!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Selamat datang di room {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi sebenarnya akan menggunakan koneksi server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Kita dapat menganggap Effect Event sangat mirip dengan *event handler*. Perbedaan utamanya adalah *event handler* dijalankan sebagai respons terhadap interaksi pengguna, sedangkan Effect Event dipicu oleh Anda dari Effect. Effect Event memungkinkan kita "memutus rantai" antara reaktivitas Effect dan kode yang seharusnya tidak reaktif.

### Membaca *props* dan *state* terbaru dengan Effect Event {/*reading-latest-props-and-state-with-effect-events*/}

<Wip>

Bagian ini menjelaskan **API eksperimental yang belum dirilis** dalam versi React yang stabil.

</Wip>

Effect Event memungkinkan kita memperbaiki banyak pola di mana kamu mungkin tergoda untuk menonaktifkan warning dari *dependency linter*.

Misalnya, kita memiliki Effect untuk mencatat *log* kunjungan halaman:

```js
function Page() {
  useEffect(() => {
    logVisit();
  }, []);
  // ...
}
```

Kemudian, kita menambahkan beberapa rute ke situs tersebut. Sekarang komponen `Page` kita menerima *prop* `url` dengan *path* saat ini. Kita ingin pass `url` ke parameter function `logVisit`, tetapi *dependency linter* pasti akan mengeluarkan warning:

```js {1,3}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, []); // 🔴 React Hook useEffect has a missing dependency: 'url'
  // ...
}
```

Sekarang mari pikirkan apa tujuan awal dari kode ini. Kita *ingin* mencatat setiap kunjungan terpisah untuk tiap URL karena setiap URL merepresentasikan halaman yang berbeda. Artinya, pemanggilan `logVisit` ini seharusnya *berperilaku reaktif* terhadap `url`. Oleh karena itu, dalam kasus ini, akan lebih baik jika kita mengikuti *dependency linter* dan menambahkan `url` sebagai salah satu dependensi Effect.

```js {4}
function Page({ url }) {
  useEffect(() => {
    logVisit(url);
  }, [url]); // ✅ Semua dependensi telah dideklarasikan
  // ...
}
```

Sekarang katakanlah kita ingin memasukkan jumlah barang di keranjang belanja bersama dengan setiap kunjungan halaman:

```js {2-3,6}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
  }, [url]); // 🔴 React Hook useEffect has a missing dependency: 'numberOfItems'
  // ...
}
```

Kita menggunakan `numberOfItems` di dalam Effect, sehingga *linter* meminta agar kita menambahkannya sebagai salah satu dependensi. Namun, sebenarnya kita *tidak ingin* memanggil `logVisit` secara reaktif terhadap `numberOfItems`. Jika pengguna menambahkan barang ke dalam keranjang belanja dan `numberOfItems` berubah, ini tidak berarti bahwa pengguna telah mengunjungi kembali halaman tersebut. Dalam artian lain, melakukan *kunjungan ke halaman* adalah suatu "peristiwa (*event*)" yang terjadi pada saat tertentu.

Sebaiknya, pisahkan kode tersebut menjadi dua bagian:

```js {5-7,10}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ Semua dependensi telah dideklarasikan
  // ...
}
```

Di sini, `onVisit` adalah suatu Effect Event. Kode di dalamnya tidak bersifat reaktif. Oleh karena itu, kita dapat menggunakan `numberOfItems` (atau reactive value lain!) tanpa khawatir mengakibatkan kode di sekitarnya dijalankan ulang saat terjadi perubahan.

Namun di sisi lain, Effect itu sendiri tetap bersifat reaktif. Kode di dalam Effect menggunakan *prop* `url`, sehingga Effect tersebut akan dijalankan ulang setelah setiap *render* dengan `url` yang berbeda. Hal ini pada akhirnya akan memanggil Effect Event `onVisit`.

Akibatnya, `logVisit` akan terpanggil untuk setiap perubahan pada `url`, dan selalu membaca `numberOfItems` yang terbaru. Namun jika hanya nilai `numberOfItems` yang berubah, hal ini tidak akan menyebabkan kode berjalan ulang.

<Note>

Mungkin kamu bertanya-tanya apakah bisa memanggil `onVisit()` tanpa argumen, dan membaca nilai `url` di dalamnya:

```js {2,6}
  const onVisit = useEffectEvent(() => {
    logVisit(url, numberOfItems);
  });

  useEffect(() => {
    onVisit();
  }, [url]);
```

Cara tersebut memang bisa dilakukan, tetapi sebaiknya kita memasukkan nilai `url` secara eksplisit ke dalam Effect Event. **Dengan memasukkan `url` sebagai argumen ke dalam Effect Event, kita menyatakan bahwa kunjungan halaman dengan `url` yang berbeda merupakan sebuah "*event*" yang terpisah bagi pengguna.** Artinya, `visitedUrl` merupakan *bagian* dari "*event*" tersebut.

```js {1-2,6}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    onVisit(url);
  }, [url]);
```

Karena Effect Event kita secara eksplisit "meminta" nilai `visitedUrl`, maka sekarang kita tidak dapat secara tidak sengaja menghapus `url` dari dependensi Effect tersebut. Jika kita menghapus `url` dari dependensi (dan menyebabkan penghitungan kunjungan halaman yang berbeda terhitung sebagai satu), maka *linter* akan memberikan peringatan. Kita ingin `onVisit` berperilaku reaktif terhadap `url`, sehingga daripada membaca nilai `url` dari dalam (yang tidak bersifat reaktif), kita *pass* nilai url *dari* dalam Effect.

Hal ini menjadi semakin penting jika terdapat beberapa logika asinkron di dalam Effect tersebut:

```js {6,8}
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, numberOfItems);
  });

  useEffect(() => {
    setTimeout(() => {
      onVisit(url);
    }, 5000); // Delay logging visits
  }, [url]);
```

Di sini, nilai `url` di dalam `onVisit` merujuk pada nilai `url` yang *terbaru* (yang mungkin sudah berubah), sedangkan `visitedUrl` merujuk pada `url` yang awalnya menyebabkan Effect ini (dan pemanggilan `onVisit` ini) dijalankan.

</Note>

<DeepDive>

#### Apakah boleh untuk tetap menonaktifkan *dependency linter*? {/*is-it-okay-to-suppress-the-dependency-linter-instead*/}

Di dalam basis kode yang sudah ada, terkadang kamu akan melihat aturan *lint* dinonaktifkan seperti ini:

```js {7-9}
function Page({ url }) {
  const { items } = useContext(ShoppingCartContext);
  const numberOfItems = items.length;

  useEffect(() => {
    logVisit(url, numberOfItems);
    // 🔴 Avoid suppressing the linter like this:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  // ...
}
```

Setelah `useEffectEvent` menjadi bagian versi stabil dari React, kami merekomendasikan untuk tidak menonaktifkan *linter*.

Kekurangan pertama dari menonaktifkan aturan tersebut adalah bahwa React tidak akan memberikan peringatan lagi ketika Effect yang kita buat perlu "bereaksi" terhadap dependensi reaktif baru yang kita tambahkan ke dalam kode. Pada contoh sebelumnya, kita menambahkan `url` sebagai dependensi karena React mengingatkannya. Jika kita menonaktifkan *linter*, secara otomatis tidak akan ada lagi pengingat yang sama untuk perubahan Effect tersebut ke depannya. Hal ini dapat menyebabkan terjadinya bug.

Berikut ini contoh dari *bug* yang membingungkan yang terjadi karena penonaktifan *linter*. Pada contoh ini, fungsi `handleMove` seharusnya membaca nilai variabel *state* `canMove` yang terbaru untuk menentukan apakah titik harus mengikuti kursor atau tidak. Namun, `canMove` selalu bernilai `true` di dalam `handleMove`.

Apakah kamu dapat menemukan penyebabnya?

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  function handleMove(e) {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  }

  useEffect(() => {
    window.addEventListener('pointermove', handleMove);
    return () => window.removeEventListener('pointermove', handleMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Titik bisa bergerak
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Masalah pada kode tersebut terletak pada penonaktifan *lint dependency*. Jika kita hapus penonaktifannya, maka kita akan melihat bahwa Effect tersebut harus membutuhkan fungsi `handleMove` sebagai dependensi. Hal ini masuk akal, karena `handleMove` dideklarasikan di dalam badan komponen, yang membuatnya menjadi sebuah nilai reaktif. Setiap nilai reaktif harus dijadikan dependensi, jika tidak, maka nilai tersebut berpotensi menjadi usang dari waktu ke waktu!

Penulis kode tersebut "membohongi" React dengan mengatakan bahwa Effect tersebut tidak memiliki dependensi (`[]`) pada nilai yang reaktif. Inilah yang menyebabkan React tidak mensinkronisasikan kembali Effect tersebut setelah terjadinya perubahan pada `canMove` (dan `handleMove`). Karena React tidak mensinkronisasikan kembali Effect tersebut, maka `handleMove` yang digunakan sebagai *listener* adalah fungsi `handleMove` yang dibuat selama *render* awal. Selama *render* awal, `canMove` bernilai `true`, itulah sebabnya fungsi `handleMove` dari *render* awal akan selalu melihat nilai tersebut.

**Dengan tidak pernah menonaktifkan *linter dependency*, kita tidak akan pernah mengalami masalah dengan nilai yang usang.**

Dengan `useEffectEvent`, tidak perlu "berbohong" pada *linter*, dan kode dapat bekerja sesuai dengan yang kita harapkan:

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [canMove, setCanMove] = useState(true);

  const onMove = useEffectEvent(e => {
    if (canMove) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
  });

  useEffect(() => {
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <label>
        <input type="checkbox"
          checked={canMove}
          onChange={e => setCanMove(e.target.checked)}
        />
        Titik bisa bergerak
      </label>
      <hr />
      <div style={{
        position: 'absolute',
        backgroundColor: 'pink',
        borderRadius: '50%',
        opacity: 0.6,
        transform: `translate(${position.x}px, ${position.y}px)`,
        pointerEvents: 'none',
        left: -20,
        top: -20,
        width: 40,
        height: 40,
      }} />
    </>
  );
}
```

```css
body {
  height: 200px;
}
```

</Sandpack>

Hal ini tidak berarti bahwa `useEffectEvent` *selalu* menjadi solusi yang tepat. Kita hanya perlu menerapkannya pada baris kode yang tidak ingin bersifat reaktif. Di dalam sandbox di atas, kita tidak ingin kode Effect bersifat reaktif terhadap `canMove`. Itulah sebabnya masuk akal untuk mengekstrak ke Effect Event.

Baca [Menghapus dependensi Effect](/learn/removing-effect-dependencies) untuk mengetahui alternatif lain yang tepat selain menonaktifkan *linter*.

</DeepDive>

### Keterbatasan Effect Event {/*limitations-of-effect-events*/}

<Wip>

Bagian ini menjelaskan **API eksperimental yang belum dirilis** dalam versi React yang stabil.

</Wip>

Effect Event memiliki keterbatasan sebagai berikut:

* **Kita hanya bisa memanggilnya dari dalam Effect.**
* **Kita tidak boleh *pass* Effect Event (sebagai argumen) ke komponen atau Hook lain.**

Sebagai contoh, jangan menggunakan Effect Event seperti ini:

```js {4-6,8}
function Timer() {
  const [count, setCount] = useState(0);

  const onTick = useEffectEvent(() => {
    setCount(count + 1);
  });

  useTimer(onTick, 1000); // 🔴 Hindari: Pass Effect Event

  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  useEffect(() => {
    const id = setInterval(() => {
      callback();
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay, callback]); // Harus mendeklarasikan "callback" pada dependensi
}
```

Sebaliknya, selalu deklarasikan Effect Event di dekat Effect yang akan menggunakannya:

```js {10-12,16,21}
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Bagus: Hanya dipanggil di dalam Effect
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // Tidak perlu mendeklarasikan "onTick" (Effect Event) sebagai dependensi
}
```

Effect Event merupakan "bagian" yang tidak reaktif dari kode Effect. Effect Event harus dideklarasikan di dekat Effect yang menggunakannya.

<Recap>

- Event handler berjalan sebagai respons terhadap interaksi tertentu.
- Effect berjalan ketika sinkronisasi diperlukan.
- Logika di dalam event handler tidak bersifat reaktif.
- Logika di dalam Effect bersifat reaktif.
- Kita dapat memindahkan logika yang tidak bersifat reaktif dari Effect ke dalam Effect Event.
- Hanya panggil Effect Event dari dalam Effect.
- Jangan *pass* Effect Event (sebagai argumen) ke dalam komponen atau Hook lain.

</Recap>

<Challenges>

#### Memperbaiki variabel yang tidak terupdate {/*fix-a-variable-that-doesnt-update*/}

Komponen `Timer` ini menyimpan variabel *state* `count` yang bertambah setiap satu detik. Nilai penambahan disimpan di dalam variabel *state* `increment`. Kamu dapat mengontrol variabel `increment` dengan tombol plus dan minus.

Namun, tidak peduli berapa kali kamu menekan tombol plus, nilai `count` selalu bertambah satu setiap satu detik. Apa yang salah dengan kode ini? Mengapa `increment` selalu sama dengan `1` di dalam kode Effect? Cari kesalahan tersebut dan perbaiki.

<Hint>

Untuk memperbaiki kode ini, hanya perlu mengikuti aturannya saja.

</Hint>

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Setiap detik, nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>
  
Sama seperti biasanya, jika kamu mencari bug di dalam Effect, mulailah dengan mencari *comment* yang menonaktifkan *linter*.

Jika kamu menghapus *comment* tersebut, React akan memberitahumu bahwa kode Effect ini bergantung pada nilai `increment`, tetapi kamu "berbohong" kepada React dengan mengatakan bahwa Effect tersebut tidak memiliki dependensi pada nilai reaktif manapun (`[]`). Tambahkan `increment` ke dalam array dependency:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Setiap detik, nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Sekarang, ketika nilai `increment` berubah, React akan mensinkronisasi kembali Effect, dan *interval* akan diulang kembali.

</Solution>

#### Memperbaiki counter yang hang {/*fix-a-freezing-counter*/}

Komponen `Timer` ini menyimpan variabel *state* `count` yang bertambah setiap satu detik. Nilai penambahan disimpan di dalam variabel *state* `increment`, yang dapat kamu kendalikan dengan tombol plus dan minus. Sebagai contoh, coba tekan tombol plus sembilan kali, dan perhatikan jika `count` sekarang bertambah sepuluh setiap satu detik daripada satu.

Ada masalah kecil dengan antarmuka pengguna ini. Kamu mungkin melihatnya, jika kamu terus menekan tombol plus atau minus lebih cepat dari sekali dalam satu detik, *timer* tampaknya terhenti. *Timer* baru akan berjalan lagi setelah satu detik berlalu sejak terakhir kali kamu menekan tombol tersebut. Temukan penyebabnya dan perbaiki masalah sehingga *timer* berjalan *setiap detik* tanpa jeda.

<Hint>

Tampaknya Effect yang mengatur *timer* "bereaksi" terhadap nilai `increment`. Apakah baris yang menggunakan nilai `increment` terbaru untuk memanggil `setCount` benar-benar perlu bersifat reaktif?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + increment);
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, [increment]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Setiap detik, nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Masalahnya adalah kode di dalam Effect menggunakan variabel *state* `increment`. Karena itu menjadi sebuah dependensi dari Effect-mu, setiap kali terjadi perubahan pada variabel `increment`, *Effect* akan tereksekusi kembali, yang menyebabkan *interval* tersebut terhapus. Jika kamu terus menghapus *interval* sebelum sempat berjalan, maka *timer* akan terlihat terhenti.

Untuk memperbaiki masalahnya, extract ke Effect Event `onTick` dari dalam Effect-mu:

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, 1000);
    return () => {
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Setiap detik, nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

Karena `onTick` merupakan sebuah Effect Event, kode di dalamnya tidak bersifat reaktif. Perubahan pada `increment` tidak akan memicu Effect apapun.

</Solution>

#### Memperbaiki waktu jeda yang tidak dapat disesuaikan {/*fix-a-non-adjustable-delay*/}

Pada contoh ini, kamu dapat menyesuaikan waktu jeda *interval*. Nilainya disimpan di dalam variabel *state* `delay` yang diperbarui oleh dua tombol. Namun, bahkan jika kamu menekan tombol "tambah 100 ms" beberapa kali sampai nilai delay menjadi 1000 milidetik (yakni satu detik), kamu akan melihat bahwa *timer* masih bertambah sangat cepat (setiap 100 ms). Seolah-olah perubahan dalam variabel `delay` diabaikan. Temukan dan perbaiki kesalahannya.

<Hint>

Kode di dalam Effect Event tidak bersifat reaktif. Apakah ada kasus di mana kamu ingin memanggil `setInterval` kembali?

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  const onMount = useEffectEvent(() => {
    return setInterval(() => {
      onTick();
    }, delay);
  });

  useEffect(() => {
    const id = onMount();
    return () => {
      clearInterval(id);
    }
  }, []);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Delay penambahan sebanyak:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```


```css
button { margin: 10px; }
```

</Sandpack>

<Solution>

Masalah pada contoh di atas adalah kode mengekstrak sebuah Effect Event bernama `onMount` tanpa mempertimbangkan apa yang seharusnya dilakukan oleh kode tersebut. Kamu seharusnya hanya mengekstrak Effect Event untuk alasan tertentu: ketika ingin membuat bagian dari kodemu bersifat tak reaktif. Namun, `setInterval` memang *harus* bersifat reaktif terhadap variabel *state* `delay`. Jika `delay` berubah, kamu ingin menyiapkan *interval* tersebut kembali dari awal! Untuk memperbaiki kode ini, letakkan semua kode yang bersifat reaktif di dalam Effect: 

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
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';

export default function Timer() {
  const [count, setCount] = useState(0);
  const [increment, setIncrement] = useState(1);
  const [delay, setDelay] = useState(100);

  const onTick = useEffectEvent(() => {
    setCount(c => c + increment);
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick();
    }, delay);
    return () => {
      clearInterval(id);
    }
  }, [delay]);

  return (
    <>
      <h1>
        Counter: {count}
        <button onClick={() => setCount(0)}>Reset</button>
      </h1>
      <hr />
      <p>
        Nilai bertambah sebanyak:
        <button disabled={increment === 0} onClick={() => {
          setIncrement(i => i - 1);
        }}>–</button>
        <b>{increment}</b>
        <button onClick={() => {
          setIncrement(i => i + 1);
        }}>+</button>
      </p>
      <p>
        Delay penambahan sebanyak:
        <button disabled={delay === 100} onClick={() => {
          setDelay(d => d - 100);
        }}>–100 ms</button>
        <b>{delay} ms</b>
        <button onClick={() => {
          setDelay(d => d + 100);
        }}>+100 ms</button>
      </p>
    </>
  );
}
```

```css
button { margin: 10px; }
```

</Sandpack>

Pada umumnya, kamu harus meragukan fungsi seperti `onMount` yang berfokus pada *timing* daripada *tujuan* suatu dari bagian kode. Pada awalnya, hal tersebut mungkin terasa "lebih deskriptif", tetapi hal itu dapat menyembunyikan niatmu. Sebagai aturan praktis, Effect Event harus sesuai dengan sesuatu yang terjadi dari *perspektif pengguna.* Misalnya, `onMessage`, `onTick`, `onVisit`, atau `onConnected` adalah nama Effect Event yang baik. Kode di dalamnya mungkin tidak perlu bersifat reaktif. Di sisi lain, `onMount`, `onUpdate`, `onUnmount`, atau `onAfterRender` terlalu generik sehingga mudah untuk secara tidak sengaja menambahkan kode yang *harus* bersifat reaktif ke dalamnya. Oleh karena itu, kamu harus memberikan nama pada Effect Event sesuai terhadap *apa yang pengguna pikirkan telah terjadi,* dan bukan pada saat kapan kode dijalankan.

</Solution>

#### Memperbaiki notifikasi yang terlambat {/*fix-a-delayed-notification*/}

Ketika kamu bergabung dengan *chatroom*, komponen ini menampilkan notifikasi. Namun, notifikasi tersebut tidak ditampilkan secara langsung. Sebaliknya, notifikasi tertunda selama dua detik agar pengguna memiliki kesempatan untuk melihat-lihat UI.

Ini hampir berhasil, tetapi terdapat *bug*. Cobalah untuk mengubah *dropdown* dari "general" menjadi "travel" kemudian ke "music" dengan sangat cepat. Jika kamu melakukannya dengan cepat, kamu akan melihat dua notifikasi (seperti yang diharapkan!) tetapi *keduanya* akan mengatakan "Selamat Datang di music".

Perbaikilah, sehingga ketika kamu beralih dari "general" ke "travel" dan kemudian ke "music" dengan sangat cepat, kamu akan melihat dua notifikasi, yang pertama adalah "Selamat datang di travel" dan yang kedua adalah "Selamat datang di music". (Untuk tantangan tambahan, jika kamu *sudah* membuat notifikasi agar menampilkan ruangan yang tepat, ubahlah kode agar hanya notifikasi terakhir yang ditampilkan.)

<Hint>

Effect-mu mengetahui ruangan mana yang terhubung. Adakah informasi yang mungkin ingin kamu *pass* ke dalam *Effect Event*-mu?

</Hint>

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(() => {
    showNotification('Selamat datang di ' + roomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected();
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Selamat datang di room {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi sebenarnya akan menggunakan koneksi server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

<Solution>

Di dalam Effect Event-mu, `roomId` adalah nilai *pada saat Effect Event dipanggil.*

Effect Event-mu dipanggil dengan jeda dua detik. Jika kamu dengan cepat beralih dari ruangan travel ke ruangan music, pada saat notifikasi ruangan travel ditampilkan, `roomId` sudah menjadi "music". Inilah alasan mengapa kedua notifikasi akan mengatakan "Selamat Datang di music".

Untuk memperbaiki masalahnya, ketimbang membaca nilai `roomId` *terbaru* di dalam Effect Event-mu, jadikan `roomId` sebagai parameter dari Effect Event-mu, seperti `connectedRoomId` di bawah ini. Lalu *pass* `roomId` dari Effect dengan memanggil `onConnected(roomId)`:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Selamat Datang di ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Selamat datang di room {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi sebenarnya akan menggunakan koneksi server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Effect yang menghubungkan ke ruangan `"travel"` (sehingga mengubah nilai `roomId` menjadi `"travel"`) akan menampilkan notifikasi untuk ruangan `"travel"`. Effect yang menghubungkan ke ruangan `"music"` (sehingga mengubah nilai `roomId` menjadi `"music"`) akan menampilkan notifikasi untuk ruangan `"music"`. Dengan kata lain, `connectedRoomId` berasal dari Effect-mu (yang bersifat reaktif), sedangkan `theme` selalu menggunakan nilai terbaru.

Untuk menyelesaikan tantangan tambahan, simpan ID *timeout* notifikasi dan bersihkan di dalam fungsi *cleanup* Effect-mu:

<Sandpack>

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

```js
import { useState, useEffect } from 'react';
import { experimental_useEffectEvent as useEffectEvent } from 'react';
import { createConnection, sendMessage } from './chat.js';
import { showNotification } from './notifications.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId, theme }) {
  const onConnected = useEffectEvent(connectedRoomId => {
    showNotification('Selamat Datang di ' + connectedRoomId, theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    let notificationTimeoutId;
    connection.on('connected', () => {
      notificationTimeoutId = setTimeout(() => {
        onConnected(roomId);
      }, 2000);
    });
    connection.connect();
    return () => {
      connection.disconnect();
      if (notificationTimeoutId !== undefined) {
        clearTimeout(notificationTimeoutId);
      }
    };
  }, [roomId]);

  return <h1>Selamat datang di room {roomId}!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
  return (
    <>
      <label>
        Pilih chat room:{' '}
        <select
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
      </label>
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Gunakan dark theme
      </label>
      <hr />
      <ChatRoom
        roomId={roomId}
        theme={isDark ? 'dark' : 'light'}
      />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi sesungguhnya akan menggunakan koneksi server
  let connectedCallback;
  let timeout;
  return {
    connect() {
      timeout = setTimeout(() => {
        if (connectedCallback) {
          connectedCallback();
        }
      }, 100);
    },
    on(event, callback) {
      if (connectedCallback) {
        throw Error('Cannot add the handler twice.');
      }
      if (event !== 'connected') {
        throw Error('Only "connected" event is supported.');
      }
      connectedCallback = callback;
    },
    disconnect() {
      clearTimeout(timeout);
    }
  };
}
```

```js notifications.js hidden
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export function showNotification(message, theme) {
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

```css
label { display: block; margin-top: 10px; }
```

</Sandpack>

Langkah ini memastikan bahwa pemberitahuan yang sudah dijadwalkan (namun belum ditampilkan) akan dibatalkan ketika kamu mengubah ruangan.

</Solution>

</Challenges>
