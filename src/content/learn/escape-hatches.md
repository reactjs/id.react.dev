---
title: Escape Hatches
---

<Intro>

Beberapa komponen-komponen Anda mungkin membutuhkan kendali dan sinkronisasi dengan sistem di luar React. Misalkan, Anda mungkin ingin memfokuskan sebuah input dengan menggunakan API peramban, memutar dan menjeda sebuah pemutar video yang diimplementasi tanpa React, atau menghubungkan dan mendengarkan pesan-pesan dari sebuah *remote server*. Pada bab ini, Anda akan mempelajari jalan keluar (*escape hatches*) yang membiarkan Anda "melangkah keluar" dari aturan React dan menghubungkannya ke sistem luar. Sebagian besar logika aplikasi dan aliran data Anda sebaiknya tidak bergantung pada fitur-fitur ini.

</Intro>

<YouWillLearn isChapter={true}>

* [Bagaimana cara "mengingat" informasi tanpa harus melakukan rendering kembali](/learn/referencing-values-with-refs)
* [Bagaimana cara mengakses elemen DOM yang dikelola oleh React](/learn/manipulating-the-dom-with-refs)
* [Bagaimana cara menyinkronkan komponen dengan sistem eksternal](/learn/synchronizing-with-effects)
* [Bagaimana cara menghapus efek yang tidak perlu dari komponen Anda](/learn/you-might-not-need-an-effect)
* [Bagaimana sebuah siklus hidup efek berbeda dari komponen](/learn/lifecycle-of-reactive-effects)
* [Bagaimana mencegah beberapa nilai dari pemanggilan *Effects* kembali](/learn/separating-events-from-effects)
* [Bagaiaman membuat efek Anda berjalan kembali lebih sering](/learn/removing-effect-dependencies)
* [Bagaimana membagi logika antara komponen](/learn/reusing-logic-with-custom-hooks)

</YouWillLearn>

## Mereferensikan nilai menggunakan refs {/*referencing-values-with-refs*/}

Ketika Anda ingin sebuah komponen "mengingat" beberapa informasi, tapi Anda tidak ingin informasi tersebut [memicu *render* baru](/learn/render-and-commit), Anda dapat menggunakan *ref*:

```js
const ref = useRef(0);
```

Sama seperti *state*, *refs* disimpan oleh React diantara pe-*render*-an ulang. Namun, mengatur *state* menyebabkan komponen di-*render* ulang. Mengganti sebuah *ref* tidak! Anda dapat mengakses nilai saat ini dari *ref* tersebut melalui properti `ref.current`.

<Sandpack>

```js
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('Anda mengeklik ' + ref.current + ' kali!');
  }

  return (
    <button onClick={handleClick}>
      Klik saya!
    </button>
  );
}
```

</Sandpack>

*Ref* seperti sebuah kantong rahasia dari komponen Anda yang tidak dilacak oleh React. Misalkan, Anda dapat menggunakan *refs* untuk menyimpan [*timeout IDs*](https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#return_value), [elemen-elemen DOM](https://developer.mozilla.org/en-US/docs/Web/API/Element), dan objek lainnya yang tidak memengaruhi hasil *render* sebuah komponen.

<LearnMore path="/learn/referencing-values-with-refs">

Baca **[Mereferensikan Nilai menggunakan Refs](/learn/referencing-values-with-refs)** untuk mempelajari bagaimana menggunakan *refs* untuk mengingat informasi.

</LearnMore>

## Manipulasi DOM dengan Refs {/*manipulating-the-dom-with-refs*/}

React secara otomatis memperbarui DOM agar sesuai dengan keluaran *render*, sehingga komponen Anda tidak perlu sering memanipulasinya. Namun, terkadang Anda mungkin perlu mengakses elemen DOM yang dikelola oleh React—misalnya, memberikan fokus pada sebuah simpul (*node*), menggulir ke sana, atau mengukur ukuran dan posisinya. Tidak ada cara bawaan untuk melakukan hal-hal tersebut di React, sehingga Anda memerlukan *ref* ke simpul DOM. Sebagai contoh, mengklik tombol akan memfokuskan input menggunakan sebuah *ref*:

<Sandpack>

```js
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Memfokuskan Input
      </button>
    </>
  );
}
```

</Sandpack>

<LearnMore path="/learn/manipulating-the-dom-with-refs">

Baca **[Manipulasi DOM dengan Refs](/learn/manipulating-the-dom-with-refs)** untuk mempelajari bagaimana cara mengakses elemen DOM yang dikelola oleh React.

</LearnMore>

## Menyinkronkan dengan *Effects* {/*synchronizing-with-effects*/}

Beberapa komponen perlu menyinkronkan dengan sistem eksternal. Misalkan, Anda mungkin ingin mengontrol komponen *non-React* berdasarkan *state* React, mengatur koneksi server, atau mengirim log analitik ketika sebuah komponen muncul di layar. Tidak seperti *event handlers*, yang memungkinkan Anda menangani *events* tertentu, *Effects* memungkinkan Anda menjalankan beberapa kode setelah *render*. Gunakan *Effects* ini untuk menyinkronkan komponen Anda dengan sistem di luar React.

Menekan tombol *Play*/*Pause* beberapa kali dan lihat bagaimana pemutar video tetep disinkronkan dengan nilai prop `isPlaying`:

<Sandpack>

```js
import { useState, useRef, useEffect } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <VideoPlayer
        isPlaying={isPlaying}
        src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
      />
    </>
  );
}
```

```css
button { display: block; margin-bottom: 20px; }
video { width: 250px; }
```

</Sandpack>

Banyak *Effects* juga melakukan "pemberishan" setelah mereka selesai. Misalkan, sebuah *Effect* yang mengatur koneksi ke *chat server* harus mengembalikan fungsi pembersih (*cleanup function*) yang memberi tahu React bagaimana cara memutuskan koneksi komponen Anda dari *server* tersebut:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, []);
  return <h1>Welcome to the chat!</h1>;
}
```

```js chat.js
export function createConnection() {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting...');
    },
    disconnect() {
      console.log('❌ Disconnected.');
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
```

</Sandpack>

Di mode pengembangan (*development*), React akan segera menjalankan dan membersihkan *Effect* Anda dengan satu kali tambahan. Inilah mengapa Anda melihat `"✅ Connecting..."` tercetak dua kali. Ini memastikan Anda tidak lupa untuk mengimplementasikan fungsi pembersih.

<LearnMore path="/learn/synchronizing-with-effects">

Baca **[Menyinkronkan dengan *Effects*](/learn/synchronizing-with-effects)** untuk mempelajari bagaimana menyinkronkan komponen dengan sistem eksternal.

</LearnMore>

## Anda mungkin tidak membutuhkan *Effect* {/*you-might-not-need-an-effect*/}

*Effects* adalah sebuah jalan keluar dari paradigma React. Mereka membiarkan Anda untuk "keluar" dari React dan menyinkronkan komponen Anda dengan beberapa sistem eksternal. Jika tidak ada sistem eksternal yang terlibat (misalkan, jika Anda ingin memperbarui *state* komponen dengan beberapa *props* atau perubahan *state*), Anda seharusnya tidak perlu menggunakan sebuah *Effect*. Hilangkan *Effects* yang tidak pelu akan membuat kode Anda lebih mudah untuk diikuti, lebih cepat untuk dijalankan, dan lebih sedikit berpotensi galat.

Ada dua kasus umum di mana Anda tidak memerlukan *Effects*:
- **Anda tidak perlu menggunakan *Effects* untuk mengubah data saat pe-*render*-an.**
- **Anda tidak perlu menggunakan *Effects* untuk menangani *events* pengguna.**

Sebagai contoh, Anda tidak perlu menggunakan *Effect* untuk menyesuaikan beberapa *state* berdasarkan *state* lainnya:

```js {5-9}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');

  // 🔴 Avoid: redundant state and unnecessary Effect
  const [fullName, setFullName] = useState('');
  useEffect(() => {
    setFullName(firstName + ' ' + lastName);
  }, [firstName, lastName]);
  // ...
}
```

Sebaliknya, lakukan perhitungan sebanyak mungkin saat *render*:

```js {4-5}
function Form() {
  const [firstName, setFirstName] = useState('Taylor');
  const [lastName, setLastName] = useState('Swift');
  // ✅ Good: Melakukan perhitungan selama render
  const fullName = firstName + ' ' + lastName;
  // ...
}
```

Namun, anda perlu menggunakan *Effects* untuk menyinkronkannya dengan sistem eksternal.

<LearnMore path="/learn/you-might-not-need-an-effect">

Baca **[Anda mungkin tidak membutuhkan *Effect*](/learn/you-might-not-need-an-effect)** untuk memplejari bagaimana menghilangkan *Effects* yang tidak perlu.

</LearnMore>

## Siklus hidup *effects* yang reaktif {/*lifecycle-of-reactive-effects*/}

*Effects* mempunyai siklus hidup yang berbeda dari komponen. Komponen dapat *mount*, memperbarui (*update), or *unmount*. Sebuah *Effect* hanya dapat melakukan dua hal: memulai menyinkronkan sesuatu, dan kemudian berhenti menyinkronkannya. Siklus ini dapat terjadi berkali-kali jika *Effect* anda bergantung pada *props* dan *state* yang berubah setiap saat.

*Effect* ini bergantung pada nilai prop `roomId`. *Props* adalah *nilai yang reaktif,* yang artinya mereka dapat berubah saat pe-*render*-an ulang. Perhatikan bahwa *Effect* *menyinkronkan ulang* (dan menghubungkan kembali ke *server*) jika `roomId` berubah:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
  // Implementasi yang sebenarnya akan benar-benar terhubung ke server.
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

*React* menyediakan aturan *linter* untuk memeriksa apakah Anda telah menetapkan dependensi *Effect* dengan benar. Jika anda lupa untuk menyantumkan `roomId` dalam daftar dependensi dalam contoh di atas, *linter* akan menemukan *bug* secara otomatis.

<LearnMore path="/learn/lifecycle-of-reactive-effects">

Baca **[Siklus hidup *effects* yang reaktif](/learn/lifecycle-of-reactive-effects)** untuk mempelajari bagaimana siklus hidup *Effect* berbeda dari komponen.

</LearnMore>

## Memisahkan *events* dari *Effects* {/*separating-events-from-effects*/}

<Wip>

Bagian ini mendeskripsikan sebuah **eksperimen API yang belum dirilis** di versi stabil React.

</Wip>

*Event handlers* hanya berjalan ulang ketika Anda melakukan interaksi yang sama lagi. Tidak seperti *event handlers*, *Effects* menyinkronkan ulang jika nilai apapun yang mereka baca, seperti *props* atau *state*, berbeda dari saat *render* terakhir. Kadang, Anda ingin campuran kedua perilaku tersebut: sebuah *Effect* yang berjalan ulang sebagai respon terhadap beberapa nilai tetapi tidak pada nilai lainnya.

Semua kode di dalam *Effects* adalah *reactive.* *Effects* tersebut akan berjalan lagi jika beberapa nilai *reactive* yang dibacanya telah berubah karena *render* ulang. Misalkan, *Effect* ini akan menghubungkan kembali ke *chat* jika `roomId` atau `theme` telah berubah:

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
      showNotification('Connected!', theme);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, theme]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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
  // A real implementation would actually connect to the server
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

Ini tidak ideal. Anda ingin menghubungkan kembali ke *chat* jika hanya `roomId` yang berubah. Mengganti `theme` seharusnya tidak menghubungkan kembali ke *chat*! Pindahkan pembacaan kode `theme` dari *Effect* anda ke dalam *Effect Event*:

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
    showNotification('Connected!', theme);
  });

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.on('connected', () => {
      onConnected();
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [isDark, setIsDark] = useState(false);
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
      <label>
        <input
          type="checkbox"
          checked={isDark}
          onChange={e => setIsDark(e.target.checked)}
        />
        Use dark theme
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
  // A real implementation would actually connect to the server
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

Kode di dalam *Effect Events* tidak bersifat *reactive*, sehingga mengubah `theme` tidak lagi membuat *Effect* Anda terhubung kembali.

<LearnMore path="/learn/separating-events-from-effects">

Baca **[Memisahkan *Events* dari *Effects*](/learn/separating-events-from-effects)** untuk mempelajari bagaimana mencegah beberapa nilai dari memicu ulang *Effects*.

</LearnMore>

## Menghapus *Effect dependencies* {/*removing-effect-dependencies*/}

Ketika Anda menulis sebuah *Effect*, linter akan memverifikasi bahwa Anda telah menyertakan setiap nilai *reactive* (seperti *props* dan *state*) yang *Effect* baca di daftar *Effect dependencies* Anda. Ini memastikan bahwa *Effect* Anda tetap selaras dengan *props* dan *state* terbaru dari komponen Anda. *Dependencies* yang tidak perlu dapat menyebabkan *Effect* Anda berjalan terlalu sering, atau bahkan membuat perulangan tak terhingga. Cara Anda menghapusnya tergantung pada kasusnya.

Sebagai contoh, *Effect* ini bergantung pada objek `options` yang dibuat ulang setiap kali Anda mengedit input:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = {
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [options]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Anda tidak ingin *chat* terhubung kembali setiap kali Anda memulai mengetik sebuah pesan di dalam *chat*. Untuk memperbaiki masalah ini, pindahkan pembuatan objek `options` ke dalam *Effect* sehingga *Effect* hanya bergantung pada string `roomId`:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <input value={message} onChange={e => setMessage(e.target.value)} />
    </>
  );
}

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
      <ChatRoom roomId={roomId} />
    </>
  );
}
```

```js chat.js
export function createConnection({ serverUrl, roomId }) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Perhatikan bahwa Anda tidak memulai dengan mengedit daftar *dependency* untuk menghapus `options` *dependency*. Itu akan salah. Sebaliknya, Anda mengubah kode sekitarnya sehingga *dependency*-nya menjadi *tidak perlu.* Anggaplah daftar *dependency* sebagai daftar semua nilai *reactive* yang digunakan oleh kode *Effect* Anda. Anda tidak memilih dengan sengaja apa yang harus dimasukan dalam daftar. Daftar tersebut menjelaskan kode Anda. Untuk mengubah daftar *dependency*, ubahlah kode.

<LearnMore path="/learn/removing-effect-dependencies">

Baca **[Menghapus *Effect Dependencies*](/learn/removing-effect-dependencies)** untuk mempelajari bagaimana membuat *Effect* Anda berjalan ulang lebih jarang.

</LearnMore>

## Reusing logic with custom Hooks {/*reusing-logic-with-custom-hooks*/}

React comes with built-in Hooks like `useState`, `useContext`, and `useEffect`. Sometimes, you’ll wish that there was a Hook for some more specific purpose: for example, to fetch data, to keep track of whether the user is online, or to connect to a chat room. To do this, you can create your own Hooks for your application's needs.

In this example, the `usePointerPosition` custom Hook tracks the cursor position, while `useDelayedValue` custom Hook returns a value that's "lagging behind" the value you passed by a certain number of milliseconds. Move the cursor over the sandbox preview area to see a moving trail of dots following the cursor:

<Sandpack>

```js
import { usePointerPosition } from './usePointerPosition.js';
import { useDelayedValue } from './useDelayedValue.js';

export default function Canvas() {
  const pos1 = usePointerPosition();
  const pos2 = useDelayedValue(pos1, 100);
  const pos3 = useDelayedValue(pos2, 200);
  const pos4 = useDelayedValue(pos3, 100);
  const pos5 = useDelayedValue(pos4, 50);
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

```js usePointerPosition.js
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

```js useDelayedValue.js
import { useState, useEffect } from 'react';

export function useDelayedValue(value, delay) {
  const [delayedValue, setDelayedValue] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setDelayedValue(value);
    }, delay);
  }, [value, delay]);

  return delayedValue;
}
```

```css
body { min-height: 300px; }
```

</Sandpack>

You can create custom Hooks, compose them together, pass data between them, and reuse them between components. As your app grows, you will write fewer Effects by hand because you'll be able to reuse custom Hooks you already wrote. There are also many excellent custom Hooks maintained by the React community.

<LearnMore path="/learn/reusing-logic-with-custom-hooks">

Read **[Reusing Logic with Custom Hooks](/learn/reusing-logic-with-custom-hooks)** to learn how to share logic between components.

</LearnMore>

## What's next? {/*whats-next*/}

Head over to [Referencing Values with Refs](/learn/referencing-values-with-refs) to start reading this chapter page by page!
