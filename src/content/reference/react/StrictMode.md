---
title: <StrictMode>
---


<Intro>

`<StrictMode>` memungkinkan Anda menemukan bug umum di komponen Anda lebih awal selama pengembangan.


```js
<StrictMode>
  <App />
</StrictMode>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `<StrictMode>` {/*strictmode*/}

Gunakan `StrictMode` untuk mengaktifkan perilaku pengembangan dan peringatan tambahan untuk pohon komponen di dalamnya:

```js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

[Lihat contoh lainnya dibawah.](#usage)

Strict Mode mengaktifkan perilaku-perilaku pengembangan berikut:

- Komponen Anda akan [me-render ulang tambahan satu kali](#fixing-bugs-found-by-double-rendering-in-development) untuk mencari bug yang disebabkan oleh rendering yang tidak murni.
- Komponen Anda akan [menjalankan kembali Efek tambahan satu kali](#fixing-bugs-found-by-re-running-effects-in-development) untuk menemukan bug yang disebabkan oleh tidak adanya pembersihan Efek.
- Komponen Anda akan [memeriksa penggunaan API yang tidak digunakan lagi.](#fixing-deprecation-warnings-enabled-by-strict-mode)

#### Props {/*props*/}

`StrictMode` tidak menerima props.

#### Peringatan {/*caveats*/}

* Tidak ada cara untuk keluar dari Strict Mode di dalam pohon yang terbungkus dalam `<StrictMode>`. Ini memberi Anda keyakinan bahwa semua komponen di dalam `<StrictMode>` telah diperiksa. Jika dua tim yang bekerja pada suatu produk tidak setuju apakah mereka menganggap pemeriksaan itu berharga, mereka harus mencapai konsensus atau memindahkan `<StrictMode>` ke bawah dalam hierarki.

---

## Penggunaan {/*usage*/}

### Mengaktifkan Strict Mode untuk seluruh aplikasi {/*enabling-strict-mode-for-entire-app*/}

Strict Mode memungkinkan pemeriksaan tambahan khusus pengembangan untuk seluruh pohon komponen di dalam komponen `<StrictMode>`. Pemeriksaan ini membantu Anda menemukan bug umum di komponen Anda di awal proses pengembangan.


Untuk mengaktifkan Strict Mode pada seluruh aplikasi Anda, bungkus komponen akar Anda dengan `<StrictMode>` ketika Anda me-render:

```js {6,8}
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Kami merekomendasikan untuk membungkus seluruh aplikasi Anda dalam Strict Mode, terutama untuk aplikasi yang baru dibuat. Jika Anda menggunakan framework yang memanggil [`createRoot`](/reference/react-dom/client/createRoot) untuk Anda, periksa dokumentasinya untuk cara mengaktifkan Strict Mode.

Meskipun pemeriksaan Strict Mode **hanya berjalan dalam pengembangan,**, pemeriksaan ini membantu Anda menemukan bug yang sudah ada dalam kode Anda, tetapi sulit untuk direproduksi secara andal dalam produksi. Mode Ketat memungkinkan Anda memperbaiki bug sebelum pengguna melaporkannya.

<Note>

Strict Mode mengaktifkan perilaku-perilaku pengembangan berikut:

- Komponen Anda akan [me-render ulang tambahan satu kali](#fixing-bugs-found-by-double-rendering-in-development) untuk mencari bug yang disebabkan oleh rendering yang tidak murni.
- Komponen Anda akan [menjalankan kembali Efek tambahan satu kali](#fixing-bugs-found-by-re-running-effects-in-development) untuk menemukan bug yang disebabkan oleh tidak adanya pembersihan Efek.
- Komponen Anda akan [memeriksa penggunaan API yang tidak digunakan lagi.](#fixing-deprecation-warnings-enabled-by-strict-mode)

**Semua pemeriksaan ini hanya untuk pengembangan dan tidak memengaruhi build produksi.**

</Note>

---

### Mengaktifkan mode ketat untuk bagian dari aplikasi {/*enabling-strict-mode-for-a-part-of-the-app*/}

Anda juga dapat mengaktifkan Strict Mode untuk setiap bagian dari aplikasi Anda:

```js {7,12}
import { StrictMode } from 'react';

function App() {
  return (
    <>
      <Header />
      <StrictMode>
        <main>
          <Sidebar />
          <Content />
        </main>
      </StrictMode>
      <Footer />
    </>
  );
}
```

Dalam contoh ini, pemeriksaan Strict Mode tidak akan dijalankan terhadap komponen `Header` dan `Footer`. Namun, mereka akan berjalan di `Sidebar` dan `Content`, serta semua komponen di dalamnya, tidak peduli seberapa dalam.

---

### Memperbaiki bug yang ditemukan oleh rendering ganda dalam pengembangan {/*fixing-bugs-found-by-double-rendering-in-development*/}

[React mengasumsikan bahwa setiap komponen yang Anda tulis adalah fungsi murni.](/learn/keeping-components-pure) Ini berarti bahwa komponen React yang Anda tulis harus selalu mengembalikan JSX yang sama dengan masukan yang sama (props, state, and context).

Komponen yang melanggar aturan ini berperilaku tidak terduga dan menyebabkan bug. Untuk membantu Anda menemukan kode tidak murni secara tidak sengaja, Strict Mode memanggil beberapa fungsi Anda (hanya yang seharusnya murni) **dua kali dalam pengembangan.** Ini termasuk:

- Badan fungsi komponen Anda (hanya logika tingkat atas, jadi ini tidak termasuk kode di dalam event handler)
- Fungsi yang anda teruskan [`useState`](/reference/react/useState), [`set` functions](/reference/react/useState#setstate), [`useMemo`](/reference/react/useMemo), or [`useReducer`](/reference/react/useReducer)
- Beberapa metode komponen kelas seperti [`constructor`](/reference/react/Component#constructor), [`render`](/reference/react/Component#render), [`shouldComponentUpdate`](/reference/react/Component#shouldcomponentupdate) ([lihat seluruh daftar](https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects))

Jika fungsi murni, menjalankannya dua kali tidak mengubah perilakunya karena fungsi murni menghasilkan hasil yang sama setiap waktu. Namun, jika suatu fungsi tidak murni (misalnya, memutasikan data yang diterimanya), menjalankannya dua kali cenderung terlihat (itulah yang membuatnya tidak murni!) Ini membantu Anda menemukan dan memperbaiki bug lebih awal.

**Berikut adalah contoh untuk mengilustrasikan bagaimana rendering ganda dalam Strict Mode membantu Anda menemukan bug lebih awal.**

Komponen `StoryTray` mengambil larik `stories` dan menambahkan satu item terakhir "Create Story" di bagian akhir:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Ada kesalahan pada kode di atas. Namun, mudah untuk terlewatkan karena hasil awal terlih benar.

Kesalahan ini akan semakin terlihat jika komponen `StoryTray` me-render ulang beberapa kali. Misalnya, mari buat `StoryTray` dirender ulang dengan warna latar berbeda setiap kali Anda mengarahkan kursor ke atasnya:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Perhatikan bagaimana setiap kali Anda mengarahkan kursor ke komponen `StoryTray`, "Buat Cerita" akan ditambahkan ke daftar lagi. Maksud dari kode tersebut adalah untuk menambahkannya sekali di bagian akhir. Tapi `StoryTray` secara langsung memodifikasi larik `stories` dari props. Setiap kali `StoryTray` me-render, ia menambahkan "Buat Cerita" lagi di akhir larik yang sama. Dengan kata lain, `StoryTray` bukan fungsi murni--menjalankannya berkali-kali menghasilkan hasil yang berbeda.

Untuk memperbaiki masalah ini, Anda dapat membuat salinan larik, dan memodifikasi salinan tersebut, bukan yang asli:

```js {2}
export default function StoryTray({ stories }) {
  const items = stories.slice(); // Clone the array
  // ✅ Good: Pushing into a new array
  items.push({ id: 'create', label: 'Create Story' });
```

Ini akan [membuat fungsi `StoryTray` murni.](/learn/keeping-components-pure) Setiap kali dipanggil, ini hanya akan memodifikasi salinan baru dari larik, dan tidak akan memengaruhi objek atau variabel eksternal apa pun. Ini menyelesaikan bug, tetapi Anda harus membuat komponen dirender ulang lebih sering sebelum menjadi jelas bahwa ada yang salah dengan perilakunya.

**Dalam contoh aslinya, bug itu tidak terlihat jelas. Sekarang mari kita bungkus kode asli (penuh dengan bug) `<StrictMode>`:**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
export default function StoryTray({ stories }) {
  const items = stories;
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul>
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

**Strict Mode *always* calls your rendering function twice, so you can see the mistake right away** ("Create Story" appears twice). This lets you notice such mistakes early in the process. When you fix your component to render in Strict Mode, you *also* fix many possible future production bugs like the hover functionality from before:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js App.js
import { useState } from 'react';
import StoryTray from './StoryTray.js';

let initialStories = [
  {id: 0, label: "Ankit's Story" },
  {id: 1, label: "Taylor's Story" },
];

export default function App() {
  let [stories, setStories] = useState(initialStories)
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        textAlign: 'center',
      }}
    >
      <StoryTray stories={stories} />
    </div>
  );
}
```

```js StoryTray.js active
import { useState } from 'react';

export default function StoryTray({ stories }) {
  const [isHover, setIsHover] = useState(false);
  const items = stories.slice(); // Clone the array
  items.push({ id: 'create', label: 'Create Story' });
  return (
    <ul
      onPointerEnter={() => setIsHover(true)}
      onPointerLeave={() => setIsHover(false)}
      style={{
        backgroundColor: isHover ? '#ddd' : '#fff'
      }}
    >
      {items.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```

```css
ul {
  margin: 0;
  list-style-type: none;
  height: 100%;
}

li {
  border: 1px solid #aaa;
  border-radius: 6px;
  float: left;
  margin: 5px;
  margin-bottom: 20px;
  padding: 5px;
  width: 70px;
  height: 100px;
}
```

</Sandpack>

Without Strict Mode, it was easy to miss the bug until you added more re-renders. Strict Mode made the same bug appear right away. Strict Mode helps you find bugs before you push them to your team and to your users.

[Read more about keeping components pure.](/learn/keeping-components-pure)

<Note>

If you have [React DevTools](/learn/react-developer-tools) installed, any `console.log` calls during the second render call will appear slightly dimmed. React DevTools also offers a setting (off by default) to suppress them completely.

</Note>

---

### Fixing bugs found by re-running Effects in development {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode can also help find bugs in [Effects.](/learn/synchronizing-with-effects)

Every Effect has some setup code and may have some cleanup code. Normally, React calls setup when the component *mounts* (is added to the screen) and calls cleanup when the component *unmounts* (is removed from the screen). React then calls cleanup and setup again if its dependencies changed since the last render.

When Strict Mode is on, React will also run **one extra setup+cleanup cycle in development for every Effect.** This may feel surprising, but it helps reveal subtle bugs that are hard to catch manually.

**Here is an example to illustrate how re-running Effects in Strict Mode helps you find bugs early.**

Consider this example that connects a component to a chat:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

There is an issue with this code, but it might not be immediately clear.

To make the issue more obvious, let's implement a feature. In the example below, `roomId` is not hardcoded. Instead, the user can select the `roomId` that they want to connect to from a dropdown. Click "Open chat" and then select different chat rooms one by one. Keep track of the number of active connections in the console:

<Sandpack>

```js index.js
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(<App />);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, [roomId]);

  return <h1>Welcome to the {roomId} room!</h1>;
}

export default function App() {
  const [roomId, setRoomId] = useState('general');
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

You'll notice that the number of open connections always keeps growing. In a real app, this would cause performance and network problems. The issue is that [your Effect is missing a cleanup function:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Now that your Effect "cleans up" after itself and destroys the outdated connections, the leak is solved. However, notice that the problem did not become visible until you've added more features (the select box).

**In the original example, the bug wasn't obvious. Now let's wrap the original (buggy) code in `<StrictMode>`:**

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'general';

export default function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
  }, []);
  return <h1>Welcome to the {roomId} room!</h1>;
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

**With Strict Mode, you immediately see that there is a problem** (the number of active connections jumps to 2). Strict Mode runs an extra setup+cleanup cycle for every Effect. This Effect has no cleanup logic, so it creates an extra connection but doesn't destroy it. This is a hint that you're missing a cleanup function.

Strict Mode lets you notice such mistakes early in the process. When you fix your Effect by adding a cleanup function in Strict Mode, you *also* fix many possible future production bugs like the select box from before:

<Sandpack>

```js index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

import App from './App';

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

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
  const [show, setShow] = useState(false);
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
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId} />}
    </>
  );
}
```

```js chat.js
let connections = 0;

export function createConnection(serverUrl, roomId) {
  // A real implementation would actually connect to the server
  return {
    connect() {
      console.log('✅ Connecting to "' + roomId + '" room at ' + serverUrl + '...');
      connections++;
      console.log('Active connections: ' + connections);
    },
    disconnect() {
      console.log('❌ Disconnected from "' + roomId + '" room at ' + serverUrl);
      connections--;
      console.log('Active connections: ' + connections);
    }
  };
}
```

```css
input { display: block; margin-bottom: 20px; }
button { margin-left: 10px; }
```

</Sandpack>

Notice how the active connection count in the console doesn't keep growing anymore.

Without Strict Mode, it was easy to miss that your Effect needed cleanup. By running *setup → cleanup → setup* instead of *setup* for your Effect in development, Strict Mode made the missing cleanup logic more noticeable.

[Read more about implementing Effect cleanup.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Fixing deprecation warnings enabled by Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}

React memperingatkan jika beberapa komponen dimana pun di dalam tree `<StrictMode>` menggunakan salah satu API yang telah usang:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [See alternatives.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [See alternatives.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)
* Legacy context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), and [`getChildContext`](/reference/react/Component#getchildcontext)). [See alternatives.](/reference/react/createContext)
* Legacy string refs ([`this.refs`](/reference/react/Component#refs)). [See alternatives.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

These APIs are primarily used in older [class components](/reference/react/Component) so they rarely appear in modern apps.
