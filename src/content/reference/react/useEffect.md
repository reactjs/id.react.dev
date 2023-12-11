---
title: useEffect
---

<Intro>

`useEffect` adalah Hook React yang memungkinkan Anda [menyinkronkan komponen dengan sistem eksternal.](/learn/synchronizing-with-effects)

```js
useEffect(setup, dependencies?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `useEffect(setup, dependencies?)` {/*useeffect*/}

Panggil `useEffect` di level atas komponen Anda untuk mendeklarasikan sebuah *Effect*:

```js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
  // ...
}
```

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `setup`: Fungsi dengan logika *Effect* Anda. Fungsi *setup* Anda juga dapat secara opsional mengembalikan fungsi *cleanup*. Ketika komponen Anda pertama kali ditambahkan ke DOM, React akan menjalankan fungsi *setup* Anda. Setelah setiap re-*render* dengan dependensi yang berubah, React akan pertama-tama menjalankan fungsi *cleanup* (jika Anda menyediakannya) dengan nilai lama, dan kemudian menjalankan fungsi *setup* Anda dengan nilai baru. Setelah komponen Anda dihapus dari DOM, React akan menjalankan fungsi *cleanup* Anda untuk terakhir kalinya.
 
* `dependensi` **opsional**: Daftar semua nilai reaktif yang direferensikan di dalam kode `setup`. Nilai reaktif meliputi *props*, *state*, dan semua variabel dan fungsi yang dideklarasikan langsung di dalam *body* komponen Anda. Jika *linter* Anda [dikonfigurasi untuk React](/learn/editor-setup#linting), itu akan memverifikasi bahwa setiap nilai reaktif dijelaskan dengan benar sebagai dependensi. Daftar dependensi harus memiliki jumlah item yang konstan dan ditulis secara *inline* seperti `[dep1, dep2, dep3]`. React akan membandingkan setiap dependensi dengan nilai sebelumnya menggunakan perbandingan [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is) . Jika Anda mengabaikan argumen ini, *Effect* Anda akan berjalan ulang setelah setiap re-*render* dari komponen. [Lihat perbedaan antara melewatkan array dependensi, array kosong, dan tidak ada dependensi sama sekali.](#examples-dependencies)

#### Kembalian {/*returns*/}

`useEffect` mengembalikan `undefined`.

#### Catatan Penting {/*caveats*/}

* `useEffect` adalah Hook, sehingga Anda hanya dapat memanggilnya **di level atas komponen Anda** atau Hook Anda sendiri. Anda tidak dapat memanggilnya di dalam *loop* atau kondisi. Jika Anda membutuhkannya, ekstraklah komponen baru dan pindahkan *state* ke dalamnya.

* Jika Anda **tidak mencoba untuk menyinkronkan dengan sistem eksternal tertentu,** [kemungkinan Anda tidak memerlukan sebuah *Effect*.](/learn/you-might-not-need-an-effect)

* Ketika Strict Mode diaktifkan, React akan **menjalankan satu siklus *setup+cleanup* tambahan hanya untuk pengembangan** sebelum *setup* sebenarnya yang pertama. Ini adalah *stress-test* yang memastikan bahwa logika *cleanup* Anda "mencerminkan" logika *setup* Anda dan menghentikan atau membatalkan apa pun yang dilakukan *setup*. Jika ini menyebabkan masalah, [implementasikan fungsi *cleanup*.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

* Jika beberapa dependensi Anda adalah objek atau fungsi yang didefinisikan di dalam komponen, ada risiko bahwa mereka akan **membuat *Effect* berjalan ulang lebih sering dari yang diperlukan.** Untuk mengatasinya, hapus dependensi [objek](#removing-unnecessary-object-dependencies) dan [fungsi](#removing-unnecessary-function-dependencies) yang tidak diperlukan. Anda juga dapat [mengekstrak pembaruan *state*](#updating-state-based-on-previous-state-from-an-effect) dan [logika non-reaktif](#reading-the-latest-props-and-state-from-an-effect) di luar *Effect* Anda.

* Jika *Effect* Anda tidak disebabkan oleh interaksi (seperti klik), React akan membiarkan browser **menampilkan layar yang diperbarui terlebih dahulu sebelum menjalankan *Effect* Anda.** Jika *Effect* Anda melakukan sesuatu yang visual (misalnya, menempatkan tooltip), dan penundaannya terasa (misalnya, berkedip), gantilah `useEffect` dengan [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* Meskipun *Effect* Anda disebabkan oleh interaksi (seperti klik), **browser mungkin akan memperbarui tampilan layar sebelum memproses pembaruan *state* di dalam Efek Anda.** Biasanya, itu adalah yang Anda inginkan. Namun, jika Anda harus mencegah browser memperbarui tampilan layar, Anda perlu mengganti `useEffect` dengan [`useLayoutEffect`.](/reference/react/useLayoutEffect)

* *Effects* **hanya berjalan di sisi klien.** Mereka tidak berjalan selama server *rendering*.

---

## Penggunaan {/*usage*/}

### Menghubungkan ke sistem eksternal {/*connecting-to-an-external-system*/}

Beberapa komponen perlu terhubung dengan jaringan, beberapa API browser, atau perpustakaan pihak ketiga, saat ditampilkan pada halaman. Sistem-sistem ini tidak dikendalikan oleh React, sehingga disebut sebagai sistem *eksternal.*

Untuk [menghubungkan komponen Anda ke sistem eksternal,](/learn/synchronizing-with-effects) panggil `useEffect` pada level atas komponen Anda:

```js [[1, 8, "const connection = createConnection(serverUrl, roomId);"], [1, 9, "connection.connect();"], [2, 11, "connection.disconnect();"], [3, 13, "[serverUrl, roomId]"]]
import { useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
  	const connection = createConnection(serverUrl, roomId);
    connection.connect();
  	return () => {
      connection.disconnect();
  	};
  }, [serverUrl, roomId]);
  // ...
}
```

Anda perlu melewatkan dua argumen ke `useEffect`:

1. Sebuah *fungsi setup* dengan  <CodeStep step={1}>kode setup</CodeStep> yang menghubungkan ke sistem tersebut.
   - Fungsi tersebut harus mengembalikan sebuah *fungsi cleanup* dengan <CodeStep step={2}>kode cleanup</CodeStep> yang memutus koneksi dari sistem tersebut.
2. Sebuah <CodeStep step={3}>daftar dependensi</CodeStep> termasuk setiap nilai dari komponen Anda yang digunakan di dalam fungsi-fungsi tersebut.

**React memanggil fungsi *setup* dan *cleanup* Anda kapan saja diperlukan, yang mungkin terjadi beberapa kali:**

1. <CodeStep step={1}>Kode setup</CodeStep> Anda dijalankan ketika komponen Anda ditambahkan ke halaman *(mounts)*.
2. Setelah setiap re-*render* dari komponen Anda di mana <CodeStep step={3}>dependensi</CodeStep> telah berubah:
   - Pertama, <CodeStep step={2}>kode cleanup</CodeStep> Anda dijalankan dengan *props* dan *state* yang lama.
   - Kemudian, <CodeStep step={1}>kode setup</CodeStep> Anda dijalankan dengan *props* dan *state* yang baru.
3. <CodeStep step={2}>Kode cleanup</CodeStep> Anda dijalankan satu kali terakhir setelah komponen Anda dihapus dari halaman *(unmounts).*

**Mari ilustrasikan urutan ini untuk contoh di atas.**

Ketika komponen `ChatRoom` di atas ditambahkan ke halaman, itu akan terhubung ke ruang obrolan dengan `serverUrl` dan `roomId` awal. Jika salah satu dari `serverUrl` atau `roomId` berubah sebagai hasil dari re-*render* (misalnya, jika pengguna memilih ruang obrolan yang berbeda dalam dropdown), *Effect* Anda akan *memutuskan koneksi dari ruang sebelumnya, dan terhubung ke yang berikutnya.* Ketika komponen `ChatRoom` dihapus dari halaman, *Effect* Anda akan memutuskan koneksi satu kali terakhir.

**Untuk [membantu Anda menemukan bug,](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) dalam pengembangan React menjalankan <CodeStep step={1}>setup</CodeStep> dan <CodeStep step={2}>cleanup</CodeStep> satu kali ekstra sebelum <CodeStep step={1}>setup</CodeStep>.** Ini adalah pengujian *stress-test* yang memverifikasi logika *Effect* Anda diimplementasikan dengan benar. Jika ini menyebabkan masalah yang terlihat, fungsi *cleanup* Anda kekurangan beberapa logika. Fungsi *cleanup* harus menghentikan atau membatalkan apa yang dilakukan oleh fungsi *setup*. Aturan praktisnya adalah bahwa pengguna tidak boleh dapat membedakan antara *setup* yang dipanggil sekali (seperti di produksi) dan urutan *setup* → *cleanup* → *setup* (seperti di pengembangan). [Lihat solusi umum.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

**Cobalah untuk [menulis setiap *Effect* sebagai proses independen](/learn/lifecycle-of-reactive-effects#each-effect-represents-a-separate-synchronization-process) dan [berpikir tentang satu siklus *setup/cleanup* pada suatu waktu.](/learn/lifecycle-of-reactive-effects#thinking-from-the-effects-perspective)** Tidak harus masalah apakah komponen Anda sedang *mounting*, *updating*, atau *unmounting*. Ketika logika *cleanup* Anda "mencerminkan" logika *setup* dengan benar, *Effect* Anda tangguh terhadap menjalankan *setup* dan *cleanup* sesering yang diperlukan.

<Note>

Sebuah *Effect* memungkinkan Anda [menjaga sinkronisasi komponen Anda](/learn/synchronizing-with-effects) dengan beberapa sistem eksternal (seperti layanan obrolan). Di sini, *sistem eksternal* berarti setiap kode yang tidak dikontrol oleh React, seperti:

* A timer managed with <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> and <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Timer yang dikelola dengan <CodeStep step={1}>[`setInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval)</CodeStep> dan <CodeStep step={2}>[`clearInterval()`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval)</CodeStep>.
* Langganan *event* menggunakan <CodeStep step={1}>[`window.addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)</CodeStep> dan <CodeStep step={2}>[`window.removeEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener)</CodeStep>.
* Pustaka animasi pihak ketiga dengan API seperti <CodeStep step={1}>`animation.start()`</CodeStep> dan <CodeStep step={2}>`animation.reset()`</CodeStep>.

**Jika Anda tidak terhubung ke sistem eksternal apa pun, [kemungkinan Anda tidak memerlukan *Effect*.](/learn/you-might-not-need-an-effect)**

</Note>

<Recipes titleText="Contoh-contoh menghubungkan ke sistem eksternal" titleId="examples-connecting">

#### Menghubungkan ke server obrolan {/*connecting-to-a-chat-server*/}

Pada contoh ini, komponen `ChatRoom` menggunakan sebuah *Effect* untuk tetap terhubung ke sistem eksternal yang didefinisikan dalam `chat.js`. Tekan "Buka obrolan" untuk membuat komponen `ChatRoom` muncul. Sandbox ini berjalan dalam mode pengembangan, sehingga terdapat siklus koneksi-dan-putus tambahan, seperti yang [dijelaskan di sini.](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) Cobalah mengubah `roomId` dan `serverUrl` menggunakan `dropdown` dan input, dan lihat bagaimana *Effect* terhubung kembali ke obrolan. Tekan "Tutup obrolan" untuk melihat *Effect* memutuskan koneksi untuk terakhir kalinya.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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
export function createConnection(serverUrl, roomId) {
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

<Solution />

#### Mendengarkan sebuah *event* global pada browser {/*listening-to-a-global-browser-event*/}

Pada contoh ini, sistem eksternalnya adalah DOM browser itu sendiri. Biasanya, Anda akan menentukan *event listeners* dengan JSX, tetapi Anda tidak dapat mendengarkan objek [`window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) global dengan cara ini. Sebuah Effect memungkinkan Anda terhubung ke objek `window` dan mendengarkan *event*nya. Mendengarkan *event*` pointermove` memungkinkan Anda melacak posisi kursor (atau jari) dan memperbarui titik merah agar bergerak mengikuti kursor.

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      setPosition({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('pointermove', handleMove);
    return () => {
      window.removeEventListener('pointermove', handleMove);
    };
  }, []);

  return (
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
  );
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Memicu animasi {/*triggering-an-animation*/}

Pada contoh ini, sistem eksternal adalah perpustakaan animasi di `animation.js`. Perpustakaan ini menyediakan kelas JavaScript bernama `FadeInAnimation` yang membutuhkan sebuah node DOM sebagai argumen dan mengekspos metode `start()` dan `stop()` untuk mengontrol animasi. Komponen ini [menggunakan sebuah *ref*](/learn/manipulating-the-dom-with-refs) untuk mengakses node DOM yang mendasarinya. *Effect* membaca node DOM dari *ref* dan secara otomatis memulai animasi untuk node tersebut ketika komponen muncul.

<Sandpack>

```js
import { useState, useEffect, useRef } from 'react';
import { FadeInAnimation } from './animation.js';

function Welcome() {
  const ref = useRef(null);

  useEffect(() => {
    const animation = new FadeInAnimation(ref.current);
    animation.start(1000);
    return () => {
      animation.stop();
    };
  }, []);

  return (
    <h1
      ref={ref}
      style={{
        opacity: 0,
        color: 'white',
        padding: 50,
        textAlign: 'center',
        fontSize: 50,
        backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
      }}
    >
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

```js animation.js
export class FadeInAnimation {
  constructor(node) {
    this.node = node;
  }
  start(duration) {
    this.duration = duration;
    if (this.duration === 0) {
      // Jump to end immediately
      this.onProgress(1);
    } else {
      this.onProgress(0);
      // Start animating
      this.startTime = performance.now();
      this.frameId = requestAnimationFrame(() => this.onFrame());
    }
  }
  onFrame() {
    const timePassed = performance.now() - this.startTime;
    const progress = Math.min(timePassed / this.duration, 1);
    this.onProgress(progress);
    if (progress < 1) {
      // We still have more frames to paint
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
```

</Sandpack>

<Solution />

#### Mengontrol dialog modal {/*controlling-a-modal-dialog*/}

Pada contoh ini, sistem eksternalnya adalah DOM browser. Komponen `ModalDialog` me*render* elemen [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog). Ini menggunakan *Effect* untuk mensinkronkan `isOpen` *prop* dengan pemanggilan metode [`showModal()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) dan [`close()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/close).

<Sandpack>

```js
import { useState } from 'react';
import ModalDialog from './ModalDialog.js';

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(true)}>
        Open dialog
      </button>
      <ModalDialog isOpen={show}>
        Hello there!
        <br />
        <button onClick={() => {
          setShow(false);
        }}>Close</button>
      </ModalDialog>
    </>
  );
}
```

```js ModalDialog.js active
import { useEffect, useRef } from 'react';

export default function ModalDialog({ isOpen, children }) {
  const ref = useRef();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const dialog = ref.current;
    dialog.showModal();
    return () => {
      dialog.close();
    };
  }, [isOpen]);

  return <dialog ref={ref}>{children}</dialog>;
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Melacak visibilitas elemen {/*tracking-element-visibility*/}

Pada contoh ini, sistem eksternalnya kembali adalah DOM browser. Komponen `App` menampilkan daftar panjang, diikuti oleh komponen `Box`, dan kemudian daftar panjang lagi. Gulir daftar ke bawah. Perhatikan bahwa ketika komponen `Box` muncul di *viewport*, warna latar belakangnya berubah menjadi hitam. Untuk mengimplementasikan hal ini, komponen `Box` menggunakan *Effect* untuk mengelola [`IntersectionObserver`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). API browser ini memberi tahu Anda ketika elemen DOM terlihat di *viewport*.

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';

export default function Box() {
  const ref = useRef(null);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
      } else {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
      }
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, []);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Membungkus *Effect* dalam Hook kustom {/*wrapping-effects-in-custom-hooks*/}

Effects adalah ["pintu darurat":](/learn/escape-hatches) Anda menggunakannya ketika Anda perlu "keluar dari React" dan ketika tidak ada solusi bawaan yang lebih baik untuk kasus penggunaan Anda. Jika Anda sering perlu menulis *Effects* secara manual, itu biasanya menjadi tanda bahwa Anda perlu mengekstrak beberapa [*custom Hooks*](/learn/reusing-logic-with-custom-hooks) untuk perilaku umum yang dibutuhkan komponen Anda.

Misalnya, custom Hook `useChatRoom` ini "menyembunyikan" logika *Effect* Anda di balik API yang lebih deklaratif:

```js {1,11}
function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```

Lalu kamu bisa menggunakannya dari komponen mana pun seperti ini:

```js {4-7}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });
  // ...
````

Ada juga banyak *custom Hooks* yang sangat bagus untuk setiap tujuan yang tersedia di ekosistem React.

[Pelajari lebih lanjut tentang cara mengelompokkan *Effects* ke dalam *Custom Hooks.*](/learn/reusing-logic-with-custom-hooks)

<Recipes titleText="Contoh-contoh *Effect* pembungkusan di *custom Hooks*" titleId="examples-custom-hooks">

#### Custom `useChatRoom` Hook {/*custom-usechatroom-hook*/}

Contoh ini sama dengan salah satu [contoh sebelumnya,](#examples-connecting) tetapi logikanya diekstraksi ke dalam *custom Hook.*

<Sandpack>

```js
import { useState } from 'react';
import { useChatRoom } from './useChatRoom.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
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

```js useChatRoom.js
import { useEffect } from 'react';
import { createConnection } from './chat.js';

export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [roomId, serverUrl]);
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
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

<Solution />

#### Custom `useWindowListener` Hook {/*custom-usewindowlistener-hook*/}

Contoh ini sama dengan salah satu [contoh sebelumnya,](#examples-connecting) tetapi logikanya diekstrak ke dalam sebuah *custom Hook.*

<Sandpack>

```js
import { useState } from 'react';
import { useWindowListener } from './useWindowListener.js';

export default function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useWindowListener('pointermove', (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  });

  return (
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
  );
}
```

```js useWindowListener.js
import { useState, useEffect } from 'react';

export function useWindowListener(eventType, listener) {
  useEffect(() => {
    window.addEventListener(eventType, listener);
    return () => {
      window.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);
}
```

```css
body {
  min-height: 300px;
}
```

</Sandpack>

<Solution />

#### Custom `useIntersectionObserver` Hook {/*custom-useintersectionobserver-hook*/}

Contoh ini sama dengan salah satu [contoh sebelumnya,](#examples-connecting) tetapi logikanya sebagian diekstraksi ke dalam sebuah *custom Hook.*

<Sandpack>

```js
import Box from './Box.js';

export default function App() {
  return (
    <>
      <LongSection />
      <Box />
      <LongSection />
      <Box />
      <LongSection />
    </>
  );
}

function LongSection() {
  const items = [];
  for (let i = 0; i < 50; i++) {
    items.push(<li key={i}>Item #{i} (keep scrolling)</li>);
  }
  return <ul>{items}</ul>
}
```

```js Box.js active
import { useRef, useEffect } from 'react';
import { useIntersectionObserver } from './useIntersectionObserver.js';

export default function Box() {
  const ref = useRef(null);
  const isIntersecting = useIntersectionObserver(ref);

  useEffect(() => {
   if (isIntersecting) {
      document.body.style.backgroundColor = 'black';
      document.body.style.color = 'white';
    } else {
      document.body.style.backgroundColor = 'white';
      document.body.style.color = 'black';
    }
  }, [isIntersecting]);

  return (
    <div ref={ref} style={{
      margin: 20,
      height: 100,
      width: 100,
      border: '2px solid black',
      backgroundColor: 'blue'
    }} />
  );
}
```

```js useIntersectionObserver.js
import { useState, useEffect } from 'react';

export function useIntersectionObserver(ref) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const div = ref.current;
    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      setIsIntersecting(entry.isIntersecting);
    }, {
       threshold: 1.0
    });
    observer.observe(div);
    return () => {
      observer.disconnect();
    }
  }, [ref]);

  return isIntersecting;
}
```

</Sandpack>

<Solution />

</Recipes>

---

### Mengontrol widget non-React {/*controlling-a-non-react-widget*/}

Terkadang, Anda ingin menjaga sistem eksternal tetap disinkronkan dengan beberapa *prop* atau *state* dari komponen React Anda.

Misalnya, jika Anda memiliki widget peta pihak ketiga atau komponen pemutar video yang ditulis tanpa React, Anda dapat menggunakan *Effect* untuk memanggil metode pada widget tersebut yang membuat *state* sesuai dengan *state* saat ini dari komponen React Anda. *Effect* ini menciptakan sebuah instance dari kelas `MapWidget` yang didefinisikan dalam `map-widget.js`. Ketika Anda mengubah *prop* `zoomLevel` dari komponen `Map`, *Effect* memanggil `setZoom()` pada instance kelas untuk menjaganya tetap disinkronkan:

<Sandpack>

```json package.json hidden
{
  "dependencies": {
    "leaflet": "1.9.1",
    "react": "latest",
    "react-dom": "latest",
    "react-scripts": "latest",
    "remarkable": "2.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test --env=jsdom",
    "eject": "react-scripts eject"
  }
}
```

```js App.js
import { useState } from 'react';
import Map from './Map.js';

export default function App() {
  const [zoomLevel, setZoomLevel] = useState(0);
  return (
    <>
      Zoom level: {zoomLevel}x
      <button onClick={() => setZoomLevel(zoomLevel + 1)}>+</button>
      <button onClick={() => setZoomLevel(zoomLevel - 1)}>-</button>
      <hr />
      <Map zoomLevel={zoomLevel} />
    </>
  );
}
```

```js Map.js active
import { useRef, useEffect } from 'react';
import { MapWidget } from './map-widget.js';

export default function Map({ zoomLevel }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current === null) {
      mapRef.current = new MapWidget(containerRef.current);
    }

    const map = mapRef.current;
    map.setZoom(zoomLevel);
  }, [zoomLevel]);

  return (
    <div
      style={{ width: 200, height: 200 }}
      ref={containerRef}
    />
  );
}
```

```js map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export class MapWidget {
  constructor(domNode) {
    this.map = L.map(domNode, {
      zoomControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      scrollWheelZoom: false,
      zoomAnimation: false,
      touchZoom: false,
      zoomSnap: 0.1
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
    this.map.setView([0, 0], 0);
  }
  setZoom(level) {
    this.map.setZoom(level);
  }
}
```

```css
button { margin: 5px; }
```

</Sandpack>

Pada contoh ini, sebuah fungsi *cleanup* tidak diperlukan karena kelas `MapWidget` hanya mengelola node DOM yang diberikan kepadanya. Setelah komponen `Map` React dihapus dari pohon(*tree*), baik node DOM maupun instance kelas `MapWidget` akan otomatis dihapus oleh mesin JavaScript pada browser.

---

### Mengambil data dengan *Effects* {/*fetching-data-with-effects*/}

Anda dapat menggunakan sebuah *Effect* untuk mengambil data untuk komponen Anda. Perlu diingat bahwa [jika Anda menggunakan sebuah *framework*,](/learn/start-a-new-react-project#production-grade-react-frameworks) menggunakan mekanisme pengambilan data dari *framework* Anda akan jauh lebih efisien daripada menulis *Effects* secara manual.

Jika Anda ingin mengambil data dari sebuah *Effect* secara manual, kode Anda mungkin akan terlihat seperti ini:

```js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);

  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [person]);

  // ...
```

Perhatikan variabel `ignore` yang diinisialisasi dengan nilai `false` dan diatur menjadi `true` selama *cleanup*. Ini memastikan [kode Anda tidak mengalami "race conditions":](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect) respon jaringan dapat tiba dalam urutan yang berbeda dari yang Anda kirimkan.

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    let ignore = false;
    setBio(null);
    fetchBio(person).then(result => {
      if (!ignore) {
        setBio(result);
      }
    });
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Anda juga dapat menulis kode dengan menggunakan sintaksis [`async` / `await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function), namun Anda masih perlu menyediakan fungsi *cleanup*:

<Sandpack>

```js App.js
import { useState, useEffect } from 'react';
import { fetchBio } from './api.js';

export default function Page() {
  const [person, setPerson] = useState('Alice');
  const [bio, setBio] = useState(null);
  useEffect(() => {
    async function startFetching() {
      setBio(null);
      const result = await fetchBio(person);
      if (!ignore) {
        setBio(result);
      }
    }

    let ignore = false;
    startFetching();
    return () => {
      ignore = true;
    }
  }, [person]);

  return (
    <>
      <select value={person} onChange={e => {
        setPerson(e.target.value);
      }}>
        <option value="Alice">Alice</option>
        <option value="Bob">Bob</option>
        <option value="Taylor">Taylor</option>
      </select>
      <hr />
      <p><i>{bio ?? 'Loading...'}</i></p>
    </>
  );
}
```

```js api.js hidden
export async function fetchBio(person) {
  const delay = person === 'Bob' ? 2000 : 200;
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('This is ' + person + '’s bio.');
    }, delay);
  })
}
```

</Sandpack>

Menulis pengambilan data langsung di *Effects* menjadi repetitif dan sulit untuk menambahkan optimasi seperti *caching* dan server *rendering* nanti. [Lebih mudah untuk menggunakan *Custom Hook* - baik yang Anda buat sendiri atau yang dipelihara oleh komunitas.](/learn/reusing-logic-with-custom-hooks#when-to-use-custom-hooks)

<DeepDive>

#### Apa alternatif yang bagus untuk pengambilan data di *Effects*? {/*what-are-good-alternatives-to-data-fetching-in-effects*/}

Menulis panggilan `fetch` di dalam *Effects* adalah [cara yang populer untuk mengambil data](https://www.robinwieruch.de/react-hooks-fetch-data/), terutama dalam aplikasi yang sepenuhnya berbasis klien. Namun, ini adalah pendekatan yang sangat manual dan memiliki beberapa kekurangan:

- ***Effects* tidak berjalan di server.** Ini berarti HTML yang di*render* oleh server hanya akan berisi *state* loading tanpa data. Komputer klien harus mengunduh semua JavaScript dan me*render* aplikasi Anda hanya untuk menemukan bahwa sekarang ia perlu memuat data. Ini tidak efisien.
- **Mengambil data secara langsung dalam *Effects* membuatnya mudah untuk membuat "*waterfalls* jaringan".** Anda me*render* komponen induk(*parent*), ia mengambil beberapa data, me*render* komponen anak(*child*), dan kemudian mereka mulai mengambil data mereka. Jika jaringannya tidak terlalu cepat, ini jauh lebih lambat daripada mengambil semua data secara paralel.
- **Mengambil data secara langsung dalam *Effects* biasanya berarti Anda tidak memuat atau menyimpan data di cache.** Misalnya, jika komponen di-*unmount* dan kemudian di-*mount* lagi, maka ia harus mengambil data lagi.
- **Tidak ergonomis.** Ada cukup banyak kode *boilerplate* yang terlibat saat menulis panggilan `fetch` dengan cara yang tidak menderita dari bug seperti [race condition.](https://maxrozen.com/race-conditions-fetching-data-react-with-useeffect)

Daftar kekurangan ini tidak spesifik untuk React. Ini berlaku untuk mengambil data saat *mount* dengan *library* manapun. Seperti dengan *routing*, pengambilan data tidak mudah dilakukan dengan baik, jadi kami sarankan pendekatan berikut:

<<<<<<< HEAD
- **Jika Anda menggunakan [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), gunakan mekanisme pengambilan data bawaannya.** *Framework* React modern memiliki mekanisme pengambilan data terintegrasi yang efisien dan tidak menderita dari masalah di atas.
- **Jika tidak, pertimbangkan untuk menggunakan atau membangun cache sisi klien. Solusi *open source* populer termasuk [React Query](https://react-query.tanstack.com/), [useSWR](https://swr.vercel.app/), dan [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) Anda juga dapat membangun solusi Anda sendiri, dalam hal ini Anda akan menggunakan *Effects* di bawah kap, tetapi juga menambahkan logika untuk mendeduplikasi permintaan, *caching respons*, dan menghindari air terjun(*waterfalls*) jaringan (dengan memuat data atau mengangkat persyaratan data ke *route*).
=======
- **If you use a [framework](/learn/start-a-new-react-project#production-grade-react-frameworks), use its built-in data fetching mechanism.** Modern React frameworks have integrated data fetching mechanisms that are efficient and don't suffer from the above pitfalls.
- **Otherwise, consider using or building a client-side cache.** Popular open source solutions include [React Query](https://tanstack.com/query/latest/), [useSWR](https://swr.vercel.app/), and [React Router 6.4+.](https://beta.reactrouter.com/en/main/start/overview) You can build your own solution too, in which case you would use Effects under the hood but also add logic for deduplicating requests, caching responses, and avoiding network waterfalls (by preloading data or hoisting data requirements to routes).
>>>>>>> af54fc873819892f6050340df236f33a18ba5fb8

Anda dapat terus mengambil data secara langsung dalam *Effects* jika kedua pendekatan ini tidak cocok untuk Anda.

</DeepDive>

---

### Menentukan dependensi yang responsif {/*specifying-reactive-dependencies*/}

**Perhatikan bahwa Anda tidak dapat "memilih" dependensi dari *Effect* Anda.** Setiap <CodeStep step={2}>nilai reaktif</CodeStep> yang digunakan oleh kode *Effect* Anda harus dideklarasikan sebagai dependensi. Daftar dependensi *Effect* Anda ditentukan oleh kode sekitarnya:

```js [[2, 1, "roomId"], [2, 2, "serverUrl"], [2, 5, "serverUrl"], [2, 5, "roomId"], [2, 8, "serverUrl"], [2, 8, "roomId"]]
function ChatRoom({ roomId }) { // This is a reactive value
  const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // This is a reactive value too

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId); // This Effect reads these reactive values
    connection.connect();
    return () => connection.disconnect();
  }, [serverUrl, roomId]); // ✅ So you must specify them as dependencies of your Effect
  // ...
}
```

Jika `serverUrl` atau `roomId` berubah, *Effect* Anda akan menyambung kembali ke obrolan menggunakan nilai baru.

**[Nilai reaktif](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values) mencakup *props* dan semua variabel dan fungsi yang dideklarasikan langsung di dalam komponen Anda.** Karena `roomId` dan `serverUrl` adalah nilai reaktif, Anda tidak dapat menghapusnya dari dependensi. Jika Anda mencoba menghilangkannya dan [*linter* Anda dikonfigurasi dengan benar untuk React,](/learn/editor-setup#linting) *linter* akan menandai ini sebagai kesalahan yang perlu Anda perbaiki:

```js {8}
function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // 🔴 React Hook useEffect has missing dependencies: 'roomId' and 'serverUrl'
  // ...
}
```

**Untuk menghapus sebuah dependensi, Anda perlu ["membuktikan" pada *linter* bahwa itu *tidak perlu* menjadi sebuah dependensi.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)** Misalnya, Anda dapat memindahkan `serverUrl` keluar dari komponen Anda untuk membuktikan bahwa itu tidak reaktif dan tidak akan berubah pada saat re-*render*:

```js {1,8}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore

function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]); // ✅ All dependencies declared
  // ...
}
```

**Sekarang `serverUrl` bukan lagi sebuah nilai yang reaktif (dan tidak bisa berubah pada re-*render*), sehingga tidak perlu menjadi dependensi. Jika kode *Effect* Anda tidak menggunakan nilai yang reaktif, daftar dependensinya harus kosong (`[]`):**

```js {1,2,9}
const serverUrl = 'https://localhost:1234'; // Not a reactive value anymore
const roomId = 'music'; // Not a reactive value anymore

function ChatRoom() {
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []); // ✅ All dependencies declared
  // ...
}
```

[Sebuah *Effect* dengan daftar dependencies kosong](/learn/lifecycle-of-reactive-effects#what-an-effect-with-empty-dependencies-means) tidak akan dijalankan ulang ketika *props* atau *state* dari komponen berubah.

<Pitfall>

Jika Anda memiliki basis kode yang sudah ada, mungkin Anda memiliki beberapa *Effect* yang menekan *linter* seperti ini:

```js {3-4}
useEffect(() => {
  // ...
  // 🔴 Avoid suppressing the linter like this:
  // eslint-ignore-next-line react-hooks/exhaustive-deps
}, []);
```

**Ketika dependensi tidak cocok dengan kode, risiko mengenalkan bug cukup tinggi.** Dengan menekan *linter*, Anda "berbohong" pada React tentang nilai-nilai yang dibutuhkan oleh *Effect* Anda. [Sebaliknya, buktikan bahwa dependensi tersebut tidak diperlukan.](/learn/removing-effect-dependencies#removing-unnecessary-dependencies)

</Pitfall>

<Recipes titleText="Examples of passing reactive dependencies" titleId="examples-dependencies">

#### Mengoper sebuah array dependensi {/*passing-a-dependency-array*/}

Jika kamu menentukan dependensi, *Effect* kamu akan dijalankan **setelah *render* pertama dan setelah re-*render* dengan dependensi yang berubah.**

```js {3}
useEffect(() => {
  // ...
}, [a, b]); // Runs again if a or b are different
```

Dalam contoh di bawah ini, `serverUrl` dan `roomId` adalah [nilai reaktif](/learn/lifecycle-of-reactive-effects#effects-react-to-reactive-values), sehingga keduanya harus disebutkan sebagai dependensi. Sebagai hasilnya, memilih ruangan yang berbeda dalam *dropdown* atau mengedit input URL server menyebabkan obrolan terhubung kembali. Namun, karena `pesan` tidak digunakan dalam *Effect* (dan karena itu bukan dependensi), mengedit pesan tidak menyebabkan obrolan terhubung kembali.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

#### Mengoper array dependensi kosong {/*passing-an-empty-dependency-array*/}

Jika **Effect** Anda benar-benar tidak menggunakan nilai reaktif apapun, maka hanya akan dijalankan **setelah *render* awal.**

```js {3}
useEffect(() => {
  // ...
}, []); // Does not run again (except once in development)
```

**Meskipun tidak ada dependensi, pengaturan dan *cleanup* akan berjalan [satu kali ekstra dalam pengembangan](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development) untuk membantu Anda menemukan bug.**

Pada contoh ini, baik `serverUrl` dan `roomId` dideklarasikan secara kaku. Karena dideklarasikan di luar komponen, keduanya bukan nilai reaktif, sehingga mereka bukanlah dependensi. Daftar dependensi kosong, sehingga *Effect* tidak berjalan ulang pada re-*render*.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';
const roomId = 'music';

function ChatRoom() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => connection.disconnect();
  }, []);

  return (
    <>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
  return (
    <>
      <button onClick={() => setShow(!show)}>
        {show ? 'Close chat' : 'Open chat'}
      </button>
      {show && <hr />}
      {show && <ChatRoom />}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
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

</Sandpack>

<Solution />


#### Tidak Mengoper Array Dependensi Sama Sekali {/*passing-no-dependency-array-at-all*/}

Jika Anda tidak mengoper array dependensi sama sekali, *Effect* Anda akan berjalan **setelah setiap *render* (dan re-*render*)** dari komponen Anda.

```js {3}
useEffect(() => {
  // ...
}); // Always runs again
```

Pada contoh ini, **Effect** akan dijalankan ulang saat Anda mengubah `serverUrl` dan `roomId`, yang cukup masuk akal. Namun, *Effect* ini *juga* akan dijalankan ulang saat Anda mengubah `pesan`, yang mungkin tidak diinginkan. Oleh karena itu, biasanya Anda akan menentukan *array* dependensi.

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }); // No dependency array at all

  return (
    <>
      <label>
        Server URL:{' '}
        <input
          value={serverUrl}
          onChange={e => setServerUrl(e.target.value)}
        />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
      <label>
        Your message:{' '}
        <input value={message} onChange={e => setMessage(e.target.value)} />
      </label>
    </>
  );
}

export default function App() {
  const [show, setShow] = useState(false);
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
        <button onClick={() => setShow(!show)}>
          {show ? 'Close chat' : 'Open chat'}
        </button>
      </label>
      {show && <hr />}
      {show && <ChatRoom roomId={roomId}/>}
    </>
  );
}
```

```js chat.js
export function createConnection(serverUrl, roomId) {
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
input { margin-bottom: 10px; }
button { margin-left: 5px; }
```

</Sandpack>

<Solution />

</Recipes>

---

### Memperbarui *state* berdasarkan *state* sebelumnya dari sebuah *Effect* {/*updating-state-based-on-previous-state-from-an-effect*/}

Ketika Anda ingin memperbarui *state* berdasarkan *state* sebelumnya dari sebuah *Effect*, Anda mungkin akan menghadapi masalah:

```js {6,9}
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(count + 1); // You want to increment the counter every second...
    }, 1000)
    return () => clearInterval(intervalId);
  }, [count]); // 🚩 ... but specifying `count` as a dependency always resets the interval.
  // ...
}
```

Karena `count` adalah nilai reaktif, ia harus disebutkan dalam daftar dependensi. Namun, hal ini menyebabkan *Effect* *cleanup* dan mengatur ulang setiap kali `count` berubah. Ini tidak ideal.

Untuk mengatasinya, [oper pembaruan status `c => c + 1`](/reference/react/useState#updating-state-based-on-the-previous-state) ke `setCount`:

<Sandpack>

```js
import { useState, useEffect } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCount(c => c + 1); // ✅ Pass a state updater
    }, 1000);
    return () => clearInterval(intervalId);
  }, []); // ✅ Now count is not a dependency

  return <h1>{count}</h1>;
}
```

```css
label {
  display: block;
  margin-top: 20px;
  margin-bottom: 20px;
}

body {
  min-height: 150px;
}
```

</Sandpack>

Sekarang bahwa Anda mengoper `c => c + 1` bukan `count + 1`, [*Effect* Anda tidak lagi perlu tergantung pada `count`.](/learn/removing-effect-dependencies#are-you-reading-some-state-to-calculate-the-next-state) Sebagai hasil dari perbaikan ini, ia tidak perlu *cleanup* dan mengatur *interval* lagi setiap kali `count` berubah.

---


### Menghapus dependensi objek yang tidak diperlukan {/*removing-unnecessary-object-dependencies*/}

Jika *Effect* Anda bergantung pada objek atau fungsi yang dibuat selama *rendering*, mungkin berjalan terlalu sering. Misalnya, *Effect* ini terhubung kembali setelah setiap *render* karena objek `opsi` [berbeda untuk setiap render:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {6-9,12,15}
const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  const options = { // 🚩 This object is created from scratch on every re-render
    serverUrl: serverUrl,
    roomId: roomId
  };

  useEffect(() => {
    const connection = createConnection(options); // It's used inside the Effect
    connection.connect();
    return () => connection.disconnect();
  }, [options]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

Hindari menggunakan objek yang dibuat selama *rendering* sebagai dependensi. Sebaliknya, buat objek di dalam *Effect*:

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

Sekarang setelah Anda membuat objek `opsi` di dalam *Effect*, *Effect* itu sendiri hanya tergantung pada *string* `roomId`.

Dengan perbaikan ini, mengetik ke dalam input tidak akan menyambungkan kembali ke chat. Berbeda dengan objek yang dibuat ulang, string seperti `roomId` tidak berubah kecuali Anda menetapkannya ke nilai lain. [Baca lebih lanjut tentang menghapus dependensi.](/learn/removing-effect-dependencies)

---

### Menghapus dependensi fungsi yang tidak perlu {/*removing-unnecessary-function-dependencies*/}

Jika *Effect* Anda bergantung pada objek atau fungsi yang dibuat selama *rendering*, maka *Effect* tersebut mungkin akan berjalan terlalu sering. Misalnya, *Effect* ini akan terhubung kembali setelah setiap *rendering* karena fungsi `createOptions` [berbeda untuk setiap rendering:](/learn/removing-effect-dependencies#does-some-reactive-value-change-unintentionally)

```js {4-9,12,16}
function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  function createOptions() { // 🚩 This function is created from scratch on every re-render
    return {
      serverUrl: serverUrl,
      roomId: roomId
    };
  }

  useEffect(() => {
    const options = createOptions(); // It's used inside the Effect
    const connection = createConnection();
    connection.connect();
    return () => connection.disconnect();
  }, [createOptions]); // 🚩 As a result, these dependencies are always different on a re-render
  // ...
```

Jika hanya membuat sebuah fungsi dari awal pada setiap re-*render*, itu bukan masalah yang perlu dioptimalkan. Namun, jika Anda menggunakannya sebagai dependensi dari *Effect* Anda, maka akan menyebabkan *Effect* Anda berjalan kembali setelah setiap re-*render*.

Hindari menggunakan sebuah fungsi yang dibuat selama *rendering* sebagai dependensi. Sebaiknya, deklarasikan fungsi tersebut di dalam *Effect*:

<Sandpack>

```js
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';

const serverUrl = 'https://localhost:1234';

function ChatRoom({ roomId }) {
  const [message, setMessage] = useState('');

  useEffect(() => {
    function createOptions() {
      return {
        serverUrl: serverUrl,
        roomId: roomId
      };
    }

    const options = createOptions();
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

Sekarang, Anda mendefinisikan fungsi `createOptions` di dalam *Effect*, sehingga *Effect* itu sendiri hanya tergantung pada *string* `roomId`. Dengan perbaikan ini, mengetik ke dalam input tidak akan membuat chat terhubung kembali. Berbeda dengan sebuah fungsi yang selalu dibuat ulang, sebuah *string* seperti `roomId` tidak berubah kecuali jika Anda menetapkannya ke nilai lain. [Baca lebih lanjut tentang cara menghapus dependensi.](/learn/removing-effect-dependencies)

---

### Membaca *props* dan *state* terbaru dari sebuah *Effect* {/*reading-the-latest-props-and-state-from-an-effect*/}

<Wip>

Bagian ini menjelaskan sebuah **API eksperimental yang belum dirilis** dalam versi stabil React.

</Wip>

Secara *default*, ketika Anda membaca sebuah nilai reaktif dari sebuah *Effect*, Anda harus menambahkannya sebagai sebuah dependensi. Hal ini memastikan bahwa *Effect Anda "bereaksi" terhadap setiap perubahan dari nilai tersebut. Untuk sebagian besar dependensi, itulah perilaku yang Anda inginkan.

**Namun, terkadang Anda akan ingin membaca *props* dan *state* terbaru dari sebuah *Effect* tanpa "bereaksi" terhadapnya.** Sebagai contoh, bayangkan Anda ingin mencatat jumlah item dalam keranjang belanja untuk setiap kunjungan halaman:

```js {3}
function Page({ url, shoppingCart }) {
  useEffect(() => {
    logVisit(url, shoppingCart.length);
  }, [url, shoppingCart]); // ✅ All dependencies declared
  // ...
}
```

**Bagaimana jika Anda ingin mencatat kunjungan halaman baru setelah setiap perubahan `url`, tetapi *tidak* jika hanya `shoppingCart` yang berubah?** Anda tidak dapat mengabaikan `shoppingCart` dari dependensi tanpa melanggar [aturan reaktivitas.](#specifying-reactive-dependencies) Namun, Anda dapat menyatakan bahwa Anda "tidak ingin" suatu kode "bereaksi" terhadap perubahan meskipun itu dipanggil dari dalam sebuah *Effect*. [Deklarasikan sebuah *Effect Event*](/learn/separating-events-from-effects#declaring-an-effect-event) dengan [`useEffectEvent`](/reference/react/experimental_useEffectEvent) Hook, dan pindahkan kode yang membaca `shoppingCart` ke dalamnya:

```js {2-4,7,8}
function Page({ url, shoppingCart }) {
  const onVisit = useEffectEvent(visitedUrl => {
    logVisit(visitedUrl, shoppingCart.length)
  });

  useEffect(() => {
    onVisit(url);
  }, [url]); // ✅ All dependencies declared
  // ...
}
```

***Effect Events* tidak bersifat reaktif dan selalu harus diabaikan dari ketergantungan *Effect* Anda.** Inilah yang memungkinkan Anda menempatkan kode non-reaktif (di mana Anda dapat membaca nilai terbaru dari beberapa *props* dan *state*) di dalamnya. Dengan membaca `shoppingCart` di dalam `onVisit`, Anda memastikan bahwa `shoppingCart` tidak akan menjalankan kembali *Effect* Anda.

[Baca lebih lanjut tentang bagaimana *Effect Events* memungkinkan Anda memisahkan kode yang reaktif dan non-reaktif.](/learn/separating-events-from-effects#reading-latest-props-and-state-with-effect-events)


---

### Menampilkan konten yang berbeda di server dan klien {/*displaying-different-content-on-the-server-and-the-client*/}

Jika aplikasi Anda menggunakan server *rendering* (baik [langsung](/reference/react-dom/server) maupun melalui [framework](/learn/start-a-new-react-project#production-grade-react-frameworks)), komponen Anda akan di*render* di dua lingkungan yang berbeda. Di server, komponen akan di*render* untuk menghasilkan HTML awal. Di klien, React akan menjalankan kode *rendering* lagi sehingga ia dapat melekatkan *event handler* Anda ke HTML tersebut. Oleh karena itu, agar [hydrasi](/reference/react-dom/client/hydrateRoot#hydrating-server-rendered-html) berfungsi, output *render* awal Anda harus identik di klien dan server.

Dalam kasus yang jarang terjadi, Anda mungkin perlu menampilkan konten yang berbeda di klien. Misalnya, jika aplikasi Anda membaca beberapa data dari [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage), maka hal itu tidak mungkin dilakukan di server. Berikut adalah cara mengimplementasikannya:

```js
function MyComponent() {
  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    setDidMount(true);
  }, []);

  if (didMount) {
    // ... return client-only JSX ...
  }  else {
    // ... return initial JSX ...
  }
}
```

Ketika aplikasi sedang dimuat, pengguna akan melihat output *render* awal. Kemudian, setelah aplikasi selesai dimuat dan di*hydrate*, *Effect* akan berjalan dan mengatur `didMount` menjadi `true`, memicu re-*render*. Ini akan beralih ke output *render* khusus client. *Effect* tidak berjalan di server, itulah sebabnya `didMount` bernilai `false` selama *render* awal di server.

Gunakan pola ini dengan bijak. Ingatlah bahwa pengguna dengan koneksi lambat akan melihat konten awal untuk waktu yang cukup lama - potensial, beberapa detik - jadi Anda tidak ingin membuat perubahan yang terlalu drastis pada tampilan komponen Anda. Dalam banyak kasus, Anda dapat menghindari kebutuhan ini dengan menunjukkan hal-hal yang berbeda secara kondisional dengan CSS.

---

## Penyelesaian masalah {/*troubleshooting*/}

### *Effect* Anda berjalan dua kali saat komponen terpasang {/*my-effect-runs-twice-when-the-component-mounts*/}

Ketika Strict Mode aktif di pengembangan, React menjalankan *setup* dan *cleanup* satu kali ekstra sebelum *setup* sebenarnya.

Ini adalah *stress-test* yang memverifikasi logika *Effect* Anda diimplementasikan dengan benar. Jika ini menyebabkan masalah yang terlihat, fungsi *cleanup* Anda kehilangan beberapa logika. Fungsi *cleanup* harus menghentikan atau membatalkan apa pun yang dilakukan fungsi *setup*. Aturan praktisnya adalah pengguna tidak boleh dapat membedakan antara *setup* yang dipanggil sekali (seperti dalam produksi) dan urutan *setup* → *cleanup* → *setup* (seperti dalam pengembangan).

Baca lebih lanjut tentang [bagaimana ini membantu menemukan bug](/learn/synchronizing-with-effects#step-3-add-cleanup-if-needed) dan [cara memperbaiki logika Anda.](/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)

---

### *Effect* Anda berjalan setelah setiap *render* ulang {/*my-effect-runs-after-every-re-render*/}

Pertama, periksa apakah Anda telah lupa untuk menentukan *array* dependensi:

```js {3}
useEffect(() => {
  // ...
}); // 🚩 No dependency array: re-runs after every render!
```

Jika Anda telah menentukan *array* dependensi tetapi *Effect* Anda masih berjalan dalam *loop*, itu karena salah satu dependensi Anda berbeda pada setiap re-*render*.

Anda dapat men-*debug* masalah ini dengan secara manual mencatat dependensi Anda ke konsol:

```js {5}
  useEffect(() => {
    // ..
  }, [serverUrl, roomId]);

  console.log([serverUrl, roomId]);
```

Anda dapat mengklik kanan pada *array* dari re-*render* yang berbeda di konsol dan pilih "Simpan sebagai variabel global" untuk keduanya. Anda kemudian dapat menggunakan konsol browser untuk memeriksa apakah setiap dependensi dalam kedua *array* tersebut sama:

```js
Object.is(temp1[0], temp2[0]); // Is the first dependency the same between the arrays?
Object.is(temp1[1], temp2[1]); // Is the second dependency the same between the arrays?
Object.is(temp1[2], temp2[2]); // ... and so on for every dependency ...
```

Ketika Anda menemukan dependensi yang berbeda pada setiap re-*render*, biasanya Anda bisa memperbaikinya dengan salah satu cara berikut:

- [Memperbarui *state* berdasarkan *state* sebelumnya dari sebuah *Effect*](#updating-state-based-on-previous-state-from-an-effect)
- [Menghapus dependensi objek yang tidak diperlukan](#removing-unnecessary-object-dependencies)
- [Menghapus dependensi fungsi yang tidak diperlukan](#removing-unnecessary-function-dependencies)
- [Membaca *props* dan *state* terbaru dari sebuah *Effect*](#reading-the-latest-props-and-state-from-an-effect)

Sebagai upaya terakhir (jika metode-metode ini tidak membantu), bungkus pembuatannya dengan [`useMemo`](/reference/react/useMemo#memoizing-a-dependency-of-another-hook) atau [`useCallback`](/reference/react/useCallback#preventing-an-effect-from-firing-too-often) (untuk fungsi).

---

### *Effect* Anda terus berjalan dalam siklus tak terbatas {/*my-effect-keeps-re-running-in-an-infinite-cycle*/}

Jika *Effect* Anda berjalan dalam siklus tak terbatas, dua hal ini harus benar:

- Effect Anda memperbarui beberapa *state*.
- *State* tersebut menyebabkan re-*render*, yang menyebabkan dependensi *Effect* berubah.

Sebelum Anda mulai memperbaiki masalah, tanyakan pada diri sendiri apakah *Effect* Anda terhubung ke sistem eksternal tertentu (seperti DOM, jaringan, widget pihak ketiga, dan sebagainya). Mengapa *Effect* Anda perlu menetapkan *state*? Apakah itu disinkronkan dengan sistem eksternal tersebut? Atau apakah Anda mencoba mengelola aliran data aplikasi Anda dengannya?

Jika tidak ada sistem eksternal, pertimbangkan untuk [menghapus *Effect* sama sekali](/learn/you-might-not-need-an-effect) untuk menyederhanakan logika Anda.

Jika Anda benar-benar menyinkronkan dengan sistem eksternal, pertimbangkan mengapa dan dalam kondisi apa *Effect* Anda harus memperbarui *state*. Apakah ada sesuatu yang berubah yang mempengaruhi output visual komponen Anda? Jika Anda perlu melacak beberapa data yang tidak digunakan untuk me*render*, [ref](/reference/react/useRef#referencing-a-value-with-a-ref)(yang tidak memicu re-*render*) mungkin lebih sesuai. Verifikasi bahwa *Effect* Anda tidak memperbarui *state* (dan memicu re-*render*) lebih dari yang dibutuhkan.

Akhirnya, jika *Effect* Anda memperbarui *state* pada waktu yang tepat, tetapi masih ada *loop*, itu karena pembaruan *state* tersebut menyebabkan salah satu dependensi *Effect* berubah. [Baca cara memecahkan masalah perubahan dependensi.](/reference/react/useEffect#my-effect-runs-after-every-re-render)

---

### Logika *cleanup* Anda berjalan meskipun komponen Anda tidak dilepas {/*my-cleanup-logic-runs-even-though-my-component-didnt-unmount*/}

Fungsi *cleanup* berjalan tidak hanya saat bongkar pasang, tetapi sebelum setiap re-*render* dengan dependensi yang berubah. Selain itu, dalam pengembangan, React [menjalankan *setup* + *cleanup* satu kali tambahan segera setelah komponen dipasang.](#my-effect-runs-twice-when-the-component-mounts)

Jika Anda memiliki kode *cleanup* tanpa kode *setup* yang sesuai, biasanya itu adalah tanda masalah dalam kode:

```js {2-5}
useEffect(() => {
  // 🔴 Avoid: Cleanup logic without corresponding setup logic
  return () => {
    doSomething();
  };
}, []);
```

Logika *cleanup* Anda harus "simetris" dengan logika *setup* awal, dan harus menghentikan atau mengembalikan apa yang dilakukan oleh *setup* awal:

```js {2-3,5}
  useEffect(() => {
    const connection = createConnection(serverUrl, roomId);
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, [serverUrl, roomId]);
```

[Pelajari bagaimana siklus hidup *Effect* berbeda dari siklus hidup komponen.](/learn/lifecycle-of-reactive-effects#the-lifecycle-of-an-effect)

---

### *Effect* Anda melakukan sesuatu yang visual, dan Anda melihat kedipan sebelum berjalan {/*my-effect-does-something-visual-and-i-see-a-flicker-before-it-runs*/}

Jika *Effect* Anda harus menghalangi browser agar tidak [mengecat layar,](/learn/render-and-commit#epilogue-browser-paint) ganti `useEffect` dengan [`useLayoutEffect`](/reference/react/useLayoutEffect). Perhatikan bahwa **ini seharusnya tidak diperlukan untuk sebagian besar *Effect*.** Anda hanya memerlukannya jika sangat penting untuk menjalankan *Effect* Anda sebelum browser melukis: misalnya, untuk mengukur dan memposisikan tooltip sebelum pengguna melihatnya.
