---
title: use
---

<Intro>

`use` adalah API React yang memungkinkan Anda membaca nilai dari sumber daya seperti [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau [context](/learn/passing-data-deeply-with-context).

```js
const value = use(resource);
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `use(resource)` {/*use*/}

Panggil `use` di komponen Anda untuk membaca nilai dari sumber daya seperti [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau [context](/learn/passing-data-deeply-with-context).

```jsx
import { use } from 'react';

function MessageComponent({ messagePromise }) {
  const message = use(messagePromise);
  const theme = use(ThemeContext);
  // ...
```

Tidak seperti React Hooks, `use` dapat dipanggil di dalam loop dan pernyataan kondisional seperti `if`. Seperti React Hooks, fungsi yang memanggil `use` harus berupa Komponen atau Hook.

Saat dipanggil dengan Promise, API `use` terintegrasi dengan [`Suspense`](/reference/react/Suspense) dan [batas kesalahan](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Komponen yang memanggil `use` akan *tersuspensi* selama Promise yang diberikan ke `use` masih tertunda. Jika komponen yang memanggil `use` dibungkus dalam batas Suspense, tampilan cadangan akan ditampilkan. Setelah Promise diselesaikan, tampilan cadangan Suspense digantikan oleh komponen yang dirender menggunakan data yang dikembalikan oleh API `use`. Jika Promise yang diberikan ke `use` ditolak, tampilan cadangan dari batas kesalahan terdekat akan ditampilkan.

[Lihat lebih banyak contoh di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `resource`: ini adalah sumber data tempat Anda ingin membaca nilai. Sumber daya bisa berupa [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau [context](/learn/passing-data-deeply-with-context).

#### Nilai kembali {/*returns*/}

API `use` mengembalikan nilai yang dibaca dari sumber daya seperti nilai hasil penyelesaian dari [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) atau [context](/learn/passing-data-deeply-with-context).

#### Catatan {/*caveats*/}

* API `use` harus dipanggil di dalam Komponen atau Hook.
* Saat mengambil data di [Server Component](/reference/rsc/server-components), gunakan `async` dan `await` sebagai pilihan utama dibanding `use`. `async` dan `await` melanjutkan perenderan dari titik ketika `await` dipanggil, sedangkan `use` merender ulang komponen setelah data terselesaikan.
* Lebih disarankan membuat Promise di [Server Components](/reference/rsc/server-components) dan meneruskannya ke [Client Components](/reference/rsc/use-client) daripada membuat Promise di Client Components. Promise yang dibuat di Client Components dibuat ulang pada setiap perenderan. Promise yang diteruskan dari Server Component ke Client Component stabil di seluruh perenderan ulang. [Lihat contoh ini](#streaming-data-from-server-to-client).

---

## Penggunaan {/*usage*/}

### Membaca context dengan `use` {/*reading-context-with-use*/}

Saat [context](/learn/passing-data-deeply-with-context) diberikan ke `use`, perilakunya mirip dengan [`useContext`](/reference/react/useContext). Sementara `useContext` harus dipanggil di level teratas komponen Anda, `use` dapat dipanggil di dalam kondisional seperti `if` dan loop seperti `for`. `use` lebih disarankan daripada `useContext` karena lebih fleksibel.

```js [[2, 4, "theme"], [1, 4, "ThemeContext"]]
import { use } from 'react';

function Button() {
  const theme = use(ThemeContext);
  // ... 
```

`use` mengembalikan <CodeStep step={2}>nilai context</CodeStep> untuk <CodeStep step={1}>context</CodeStep> yang Anda berikan. Untuk menentukan nilai context, React menelusuri pohon komponen dan menemukan **penyedia context terdekat di atasnya** untuk context tersebut.

Untuk memberikan context ke `Button`, bungkus `Button` atau salah satu komponen induknya ke dalam penyedia context yang sesuai.

```js [[1, 3, "ThemeContext"], [2, 3, "\\"dark\\""], [1, 5, "ThemeContext"]]
function MyPage() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  );
}

function Form() {
  // ... tampilkan buttons di dalam ...
}
```

Tidak masalah berapa banyak lapisan komponen di antara penyedia dan `Button`. Saat `Button` *di mana pun* di dalam `Form` memanggil `use(ThemeContext)`, nilai yang diterima adalah `"dark"`.

Tidak seperti [`useContext`](/reference/react/useContext), <CodeStep step={2}>`use`</CodeStep> dapat dipanggil di dalam kondisional dan loop seperti <CodeStep step={1}>`if`</CodeStep>.

```js [[1, 2, "if"], [2, 3, "use"]]
function HorizontalRule({ show }) {
  if (show) {
    const theme = use(ThemeContext);
    return <hr className={theme} />;
  }
  return false;
}
```

<CodeStep step={2}>`use`</CodeStep> dipanggil dari dalam pernyataan <CodeStep step={1}>`if`</CodeStep>, sehingga Anda bisa membaca nilai dari Context secara kondisional.

<Pitfall>

Seperti `useContext`, `use(context)` selalu mencari penyedia context terdekat *di atas* komponen yang memanggilnya. React menelusuri ke atas dan **tidak** mempertimbangkan penyedia context di dalam komponen tempat Anda memanggil `use(context)`.

</Pitfall>

<Sandpack>

```js
import { createContext, use } from 'react';

const ThemeContext = createContext(null);

export default function MyApp() {
  return (
    <ThemeContext value="dark">
      <Form />
    </ThemeContext>
  )
}

function Form() {
  return (
    <Panel title="Selamat Datang">
      <Button show={true}>Daftar</Button>
      <Button show={false}>Masuk</Button>
    </Panel>
  );
}

function Panel({ title, children }) {
  const theme = use(ThemeContext);
  const className = 'panel-' + theme;
  return (
    <section className={className}>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

function Button({ show, children }) {
  if (show) {
    const theme = use(ThemeContext);
    const className = 'button-' + theme;
    return (
      <button className={className}>
        {children}
      </button>
    );
  }
  return false
}
```

```css
.panel-light,
.panel-dark {
  border: 1px solid black;
  border-radius: 4px;
  padding: 20px;
}
.panel-light {
  color: #222;
  background: #fff;
}

.panel-dark {
  color: #fff;
  background: rgb(23, 32, 42);
}

.button-light,
.button-dark {
  border: 1px solid #777;
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
}

.button-dark {
  background: #222;
  color: #fff;
}

.button-light {
  background: #fff;
  color: #222;
}
```

</Sandpack>

### Men-stream data dari server ke klien {/*streaming-data-from-server-to-client*/}

Data dapat di-stream dari server ke klien dengan meneruskan Promise sebagai prop dari <CodeStep step={1}>Server Component</CodeStep> ke <CodeStep step={2}>Client Component</CodeStep>.

```js [[1, 4, "App"], [2, 2, "Message"], [3, 7, "Suspense"], [4, 8, "messagePromise", 30], [4, 5, "messagePromise"]]
import { fetchMessage } from './lib.js';
import { Message } from './message.js';

export default function App() {
  const messagePromise = fetchMessage();
  return (
    <Suspense fallback={<p>menunggu pesan...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

<CodeStep step={2}>Client Component</CodeStep> kemudian mengambil <CodeStep step={4}>Promise yang diterima sebagai prop</CodeStep> dan meneruskannya ke API <CodeStep step={5}>`use`</CodeStep>. Ini memungkinkan <CodeStep step={2}>Client Component</CodeStep> membaca nilai dari <CodeStep step={4}>Promise</CodeStep> yang awalnya dibuat oleh Server Component.

```js [[2, 6, "Message"], [4, 6, "messagePromise"], [4, 7, "messagePromise"], [5, 7, "use"]]
// message.js
'use client';

import { use } from 'react';

export function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Berikut adalah pesannya: {messageContent}</p>;
}
```
Karena <CodeStep step={2}>`Message`</CodeStep> dibungkus dalam <CodeStep step={3}>[`Suspense`](/reference/react/Suspense)</CodeStep>, tampilan cadangan akan ditampilkan sampai Promise terselesaikan. Ketika Promise terselesaikan, nilai akan dibaca oleh API <CodeStep step={5}>`use`</CodeStep> dan komponen <CodeStep step={2}>`Message`</CodeStep> akan menggantikan tampilan cadangan Suspense.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";

function Message({ messagePromise }) {
  const messageContent = use(messagePromise);
  return <p>Berikut adalah pesannya: {messageContent}</p>;
}

export function MessageContainer({ messagePromise }) {
  return (
    <Suspense fallback={<p>⌛Mengunduh pesan...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve) => setTimeout(resolve, 1000, "⚛️"));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Unduh pesan</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

</Sandpack>

<Note>

Saat meneruskan Promise dari Server Component ke Client Component, nilai hasil penyelesaian harus dapat diserialisasi agar bisa dikirim antara server dan klien. Tipe data seperti fungsi tidak dapat diserialisasi dan tidak bisa menjadi nilai hasil penyelesaian dari Promise tersebut.

</Note>


<DeepDive>

#### Haruskah saya menyelesaikan Promise di Server atau Client Component? {/*resolve-promise-in-server-or-client-component*/}

Promise dapat diteruskan dari Server Component ke Client Component dan diselesaikan di Client Component dengan API `use`. Anda juga dapat menyelesaikan Promise di Server Component dengan `await` dan meneruskan data yang dibutuhkan ke Client Component sebagai prop.

```js
export default async function App() {
  const messageContent = await fetchMessage();
  return <Message messageContent={messageContent} />
}
```

Namun menggunakan `await` di [Server Component](/reference/rsc/server-components) akan memblokir perenderan sampai pernyataan `await` selesai. Meneruskan Promise dari Server Component ke Client Component mencegah Promise tersebut memblokir perenderan Server Component.

</DeepDive>

### Menangani Promise yang ditolak {/*dealing-with-rejected-promises*/}

Dalam beberapa kasus Promise yang diberikan ke `use` bisa ditolak. Anda dapat menangani Promise yang ditolak dengan salah satu cara berikut:

1. [Menampilkan kesalahan kepada pengguna dengan batas kesalahan.](#displaying-an-error-to-users-with-error-boundary)
2. [Memberikan nilai alternatif dengan `Promise.catch`](#providing-an-alternative-value-with-promise-catch)

<Pitfall>
`use` tidak dapat dipanggil di dalam blok try-catch. Alih-alih menggunakan try-catch, [bungkus komponen Anda dengan batas kesalahan](#displaying-an-error-to-users-with-error-boundary), atau [berikan nilai alternatif untuk digunakan melalui metode `.catch` pada Promise](#providing-an-alternative-value-with-promise-catch).
</Pitfall>

#### Menampilkan kesalahan kepada pengguna dengan batas kesalahan {/*displaying-an-error-to-users-with-error-boundary*/}

Jika Anda ingin menampilkan kesalahan kepada pengguna saat Promise ditolak, Anda bisa menggunakan [batas kesalahan](/reference/react/Component#catching-rendering-errors-with-an-error-boundary). Untuk menggunakan batas kesalahan, bungkus komponen tempat Anda memanggil API `use` dengan batas kesalahan. Jika Promise yang diberikan ke `use` ditolak, tampilan cadangan untuk batas kesalahan akan ditampilkan.

<Sandpack>

```js src/message.js active
"use client";

import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export function MessageContainer({ messagePromise }) {
  return (
    <ErrorBoundary fallback={<p>⚠️Terjadi kesalahan</p>}>
      <Suspense fallback={<p>⌛Mengunduh pesan...</p>}>
        <Message messagePromise={messagePromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Message({ messagePromise }) {
  const content = use(messagePromise);
  return <p>Berikut adalah pesannya: {content}</p>;
}
```

```js src/App.js hidden
import { useState } from "react";
import { MessageContainer } from "./message.js";

function fetchMessage() {
  return new Promise((resolve, reject) => setTimeout(reject, 1000));
}

export default function App() {
  const [messagePromise, setMessagePromise] = useState(null);
  const [show, setShow] = useState(false);
  function download() {
    setMessagePromise(fetchMessage());
    setShow(true);
  }

  if (show) {
    return <MessageContainer messagePromise={messagePromise} />;
  } else {
    return <button onClick={download}>Unduh pesan</button>;
  }
}
```

```js src/index.js hidden
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

// TODO: update this example to use
// the Codesandbox Server Component
// demo environment once it is created
import App from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```json package.json hidden
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```
</Sandpack>

#### Memberikan nilai alternatif dengan `Promise.catch` {/*providing-an-alternative-value-with-promise-catch*/}

Jika Anda ingin memberikan nilai alternatif ketika Promise yang diberikan ke `use` ditolak, Anda dapat menggunakan metode <CodeStep step={1}>[`catch`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)</CodeStep> pada Promise.

```js [[1, 6, "catch"],[2, 7, "return"]]
import { Message } from './message.js';

export default function App() {
  const messagePromise = new Promise((resolve, reject) => {
    reject();
  }).catch(() => {
    return "tidak ada pesan baru yang ditemukan.";
  });

  return (
    <Suspense fallback={<p>menunggu pesan...</p>}>
      <Message messagePromise={messagePromise} />
    </Suspense>
  );
}
```

Untuk menggunakan metode <CodeStep step={1}>`catch`</CodeStep> pada Promise, panggil <CodeStep step={1}>`catch`</CodeStep> pada objek Promise. <CodeStep step={1}>`catch`</CodeStep> menerima satu argumen: sebuah fungsi yang menerima pesan kesalahan sebagai argumen. Apa pun yang <CodeStep step={2}>dikembalikan</CodeStep> oleh fungsi yang diberikan ke <CodeStep step={1}>`catch`</CodeStep> akan digunakan sebagai nilai hasil penyelesaian dari Promise.

---

## Pemecahan masalah {/*troubleshooting*/}

### "Suspense Exception: This is not a real error!" {/*suspense-exception-error*/}

Anda memanggil `use` di luar Komponen React atau fungsi Hook, atau memanggil `use` di dalam blok try-catch. Jika Anda memanggil `use` di dalam blok try-catch, bungkus komponen Anda dengan batas kesalahan, atau panggil `catch` pada Promise untuk menangkap kesalahan dan menyelesaikan Promise dengan nilai lain. [Lihat contoh ini](#dealing-with-rejected-promises).

Jika Anda memanggil `use` di luar Komponen React atau fungsi Hook, pindahkan pemanggilan `use` ke Komponen React atau fungsi Hook.

```jsx
function MessageComponent({messagePromise}) {
  function download() {
    // ❌ Fungsi yang memanggil `use` bukan Komponen atau Hook.
    const message = use(messagePromise);
    // ...
```

Sebagai gantinya, panggil `use` di dalam komponen, yaitu ketika fungsi yang memanggil `use` adalah Komponen atau Hook.

```jsx
function MessageComponent({messagePromise}) {
  // ✅ `use` dipanggil di dalam Komponen.
  const message = use(messagePromise);
  // ...
```
