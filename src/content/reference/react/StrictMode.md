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

- Komponen Anda akan [me-*render* ulang tambahan satu kali](#fixing-bugs-found-by-double-rendering-in-development) untuk mencari bug yang disebabkan oleh rendering yang tidak murni.
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

**Strict Mode *selalu* memanggil fungsi rendering Anda dua kali, sehingga Anda dapat langsung melihat kesalahannya** ("Create Story" muncul dua kali). Ini memungkinkan Anda melihat kesalahan seperti itu di awal proses. Saat Anda memperbaiki komponen untuk dirender dalam Strict Mode, Anda *juga* memperbaiki banyak kemungkinan  memproduksi bug di masa mendatang seperti fungsi hover sebelumnya:

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

Tanpa Strict Mode, mudah untuk melewatkan bug sampai Anda menambahkan lebih banyak render ulang. Strict Mode membuat bug yang sama segera muncul. Strict Mode membantu Anda menemukan bug sebelum mendorongnya ke tim dan pengguna Anda.

[Baca lebih lanjut tentang menjaga kemurnian komponen.](/learn/keeping-components-pure)

<Note>

Jika Anda telah menginstal [React DevTools](/learn/react-developer-tools), setiap panggilan `console.log` selama panggilan render kedua akan tampak sedikit redup. React DevTools juga menawarkan pengaturan (dinonaktifkan secara default) untuk menekannya sepenuhnya.

</Note>

---

### Memperbaiki bug yang ditemukan dengan menjalankan kembali Efek dalam pengembangan {/*fixing-bugs-found-by-re-running-effects-in-development*/}

Strict Mode juga dapat membantu menemukan bug di [Effects.](/learn/synchronizing-with-effects)

Setiap Efek memiliki beberapa setup code dan mungkin memiliki beberapa kode pembersihan. Biasanya, React memanggil setup ketika komponen *mounts* (ditambahkan ke layar) dan memanggil pembersihan ketika komponen *unmounts* (dihapus dari layar). React kemudian memanggil pembersihan dan setup lagi jika dependensinya berubah setelah render terakhir.

Saat Strict Mode aktif, React juga akan menjalankan **satu siklus setup+pembersihan tambahan dalam pengembangan untuk setiap Efek.** Ini mungkin terasa mengejutkan, tetapi membantu mengungkapkan bug tak kentara yang sulit ditangkap secara manual.

**Berikut adalah contoh untuk mengilustrasikan bagaimana menjalankan kembali Efek dalam Strict Mode membantu Anda menemukan bug lebih awal.**

Pertimbangkan contoh ini yang menghubungkan komponen ke obrolan:

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

Ada masalah dengan kode ini, tetapi mungkin tidak segera jelas.

Untuk memperjelas masalah, mari terapkan sebuah fitur. Pada contoh di bawah, `roomId` tidak di-hardcode. Sebagai gantinya, pengguna dapat memilih `roomId` yang ingin mereka sambungkan dari dropdown. Klik "Buka obrolan" lalu pilih ruang obrolan yang berbeda satu per satu. Lacak jumlah koneksi aktif di konsol:

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

Anda akan melihat bahwa jumlah koneksi aktif selalu terus bertambah. Dalam aplikasi nyata, ini akan menyebabkan masalah kinerja dan jaringan. Masalahnya adalah [Efek Anda tidak memiliki fungsi pembersihan:](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed)

```js {4}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
```

Sekarang Efek Anda "membersihkan" setelahnya sendiri dan menghancurkan koneksi yang sudah tidak digunakan, kebocorannya teratasi. Namun, perhatikan bahwa masalahnya tidak terlihat hingga Anda menambahkan lebih banyak fitur (select box).

**Dalam contoh aslinya, bug itu tidak terlihat jelas. Sekarang mari bungkus kode asli (buggy) dalam `<StrictMode>`:**

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

**Dengan Strict Mode, Anda segera melihat bahwa ada masalah** (jumlah koneksi aktif melonjak menjadi 2). Strict Mode menjalankan siklus setup+pembersihan ekstra untuk setiap Efek. Efek ini tidak memiliki logika pembersihan, sehingga membuat koneksi ekstra tetapi tidak menghancurkan. Ini adalah petunjuk bahwa Anda melewatkan fungsi pembersihan.

Strict Mode memungkinkan Anda melihat kesalahan seperti itu di awal proses. Saat Anda memperbaiki Efek dengan menambahkan fungsi pembersihan dalam Strict Mode, Anda *juga* memperbaiki banyak kemungkinan memproduksi bug di masa mendatang seperti select box sebelumnya:

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

Perhatikan bagaimana jumlah koneksi aktif di konsol tidak bertambah lagi.

Tanpa Strict Mode, mudah untuk luput bahwa Efek Anda perlu dibersihkan. Dengan menjalankan *setup → cleanup → setup* alih-alih *setup* untuk Efek Anda dalam pengembangan, Strict Mode membuat logika pembersihan yang hilang menjadi lebih terlihat.

[Baca lebih lanjut tentang menerapkan pembersihan Efek.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### Memperbaiki peringatan penghentian yang diaktifkan oleh Strict Mode {/*fixing-deprecation-warnings-enabled-by-strict-mode*/}
React memperingatkan jika beberapa komponen dimana pun di dalam tree `<StrictMode>` menggunakan salah satu API yang telah usang:

* [`findDOMNode`](/reference/react-dom/findDOMNode). [Lihat alternatif.](https://reactjs.org/docs/strict-mode.html#warning-about-deprecated-finddomnode-usage)
* `UNSAFE_` class lifecycle methods like [`UNSAFE_componentWillMount`](/reference/react/Component#unsafe_componentwillmount). [Lihat alternatif.](https://reactjs.org/blog/2018/03/27/update-on-async-rendering.html#migrating-from-legacy-lifecycles)
* Legacy context ([`childContextTypes`](/reference/react/Component#static-childcontexttypes), [`contextTypes`](/reference/react/Component#static-contexttypes), dan [`getChildContext`](/reference/react/Component#getchildcontext)). [Lihat alternatif.](/reference/react/createContext)
* Legacy string refs ([`this.refs`](/reference/react/Component#refs)). [Lihat alternatif.](https://reactjs.org/docs/strict-mode.html#warning-about-legacy-string-ref-api-usage)

API ini terutama digunakan di masa lalu [class components](/reference/react/Component) jadi jarang muncul di aplikasi modern.
