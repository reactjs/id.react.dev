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

## Separating events from Effects {/*separating-events-from-effects*/}

<Wip>

This section describes an **experimental API that has not yet been released** in a stable version of React.

</Wip>

Event handlers only re-run when you perform the same interaction again. Unlike event handlers, Effects re-synchronize if any of the values they read, like props or state, are different than during last render. Sometimes, you want a mix of both behaviors: an Effect that re-runs in response to some values but not others.

All code inside Effects is *reactive.* It will run again if some reactive value it reads has changed due to a re-render. For example, this Effect will re-connect to the chat if either `roomId` or `theme` have changed:

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

This is not ideal. You want to re-connect to the chat only if the `roomId` has changed. Switching the `theme` shouldn't re-connect to the chat! Move the code reading `theme` out of your Effect into an *Effect Event*:

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

Code inside Effect Events isn't reactive, so changing the `theme` no longer makes your Effect re-connect.

<LearnMore path="/learn/separating-events-from-effects">

Read **[Separating Events from Effects](/learn/separating-events-from-effects)** to learn how to prevent some values from re-triggering Effects.

</LearnMore>

## Removing Effect dependencies {/*removing-effect-dependencies*/}

When you write an Effect, the linter will verify that you've included every reactive value (like props and state) that the Effect reads in the list of your Effect's dependencies. This ensures that your Effect remains synchronized with the latest props and state of your component. Unnecessary dependencies may cause your Effect to run too often, or even create an infinite loop. The way you remove them depends on the case.

For example, this Effect depends on the `options` object which gets re-created every time you edit the input:

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

You don't want the chat to re-connect every time you start typing a message in that chat. To fix this problem, move creation of the `options` object inside the Effect so that the Effect only depends on the `roomId` string:

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

Notice that you didn't start by editing the dependency list to remove the `options` dependency. That would be wrong. Instead, you changed the surrounding code so that the dependency became *unnecessary.* Think of the dependency list as a list of all the reactive values used by your Effect's code. You don't intentionally choose what to put on that list. The list describes your code. To change the dependency list, change the code.

<LearnMore path="/learn/removing-effect-dependencies">

Read **[Removing Effect Dependencies](/learn/removing-effect-dependencies)** to learn how to make your Effect re-run less often.

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
