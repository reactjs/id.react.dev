---
title: createRoot
---

<Intro>

`createRoot` memungkinkan Anda untuk membuat sebuah akar untuk menampikan komponen React dalam node DOM pada peramban.

```js
const root = createRoot(domNode, options?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createRoot(domNode, options?)` {/*createroot*/}

Panggil `createRoot` untuk membuat akar React untuk menampilkan konten di elemen DOM pada peramban.

```js
import { createRoot } from 'react-dom/client';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
```

React akan membuat sebuah akar untuk `domNode` dan mengambil alih pengelolaan DOMnya. Setelah Anda membuat akar, Anda harus memanggil [`root.render`](#root-render) untuk menampilkan komponen React di dalam DOM tersebut:

```js
root.render(<App />);
```

Aplikasi yang sepenuhnya dibuat dengan React biasanya cukup memanggil `createRoot` sekali saja untuk komponen akarnya. Sedangkan untuk halaman yang "dihiasi" oleh bagian yang menggunakan React mungkin dapat memiliki akar sebanyak yang diperlukan.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `domNode`: Sebuah [elemen DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React akan membuat akar untuk elemen DOM ini dan memungkinkan Anda untuk memanggil fungsi lain pada akar, seperti `render` untuk menampilkan konten React yang sudah di-*render*.

* **opsional** `options`: Sebuah objek dengan opsi-opsi berikut untuk akar React ini.
  * <CanaryBadge title="Fitur ini hanya tersedia di kanal Canary" /> **opsional** `onCaughtError`: Callback called when React catches an error in an Error Boundary. Called with the `error` caught by the Error Boundary, and an `errorInfo` object containing the `componentStack`.
  * <CanaryBadge title="Fitur ini hanya tersedia di kanal Canary" /> **opsional** `onUncaughtError`: Callback called when an error is thrown and not caught by an Error Boundary. Called with the `error` that was thrown, and an `errorInfo` object containing the `componentStack`.
  * **opsional** `onRecoverableError`: *Callback* yang dipanggil saat React berhasil pulih secara otomatis dari kesalahan. Dipanggil dengan `error` yang dikembalikan React, dan obyek `errorInfo` berisi `componentStack`. Beberapa kesalahan yang dapat dipulihkan mungkin akan berisi kesalahan aslinya sebagai `error.cause`.
  * **opsional** `identifierPrefix`: Awalan string yang digunakan React untuk ID yang dihasilkan oleh [`useId`.](/reference/react/useId) Berguna untuk mencegah konflik saat menggunakan banyak akar pada halaman yang sama.

#### Kembalian {/*returns*/}

`createRoot` mengembalikan sebuah objek dengan dua *method*: [`render`](#root-render) dan [`unmount`.](#root-unmount)

#### Catatan Penting {/*caveats*/}
* Jika aplikasi Anda di-*render* oleh server, penggunaan `createRoot()` tidak didukung. Sebagai gantinya, gunakan [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot).
* Anda mungkin hanya akan memiliki satu panggilan `createRoot` pada aplikasi Anda. Jika Anda menggunakan *framework*, biasanya pemanggilan fungsi ini sudah dilakukan oleh *framework* tersebut.
* Saat Anda ingin me-*render* sebagian JSX pada bagian lain dari pohon DOM yang bukan turunan dari komponen Anda (contohnya *modal* atau *tooltip*), gunakan [`createPortal`](/reference/react-dom/createPortal), bukan `createRoot`.

---

### `root.render(reactNode)` {/*root-render*/}

Panggil `root.render` untuk menampilkan sebuah [JSX](/learn/writing-markup-with-jsx) ("*React node*") dalam node DOM milik akar React pada peramban.

```js
root.render(<App />);
```

React akan menampilkan `<App />` dalam `root`, dan mengambil alih pengelolaan DOM di dalamnya.

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*root-render-parameters*/}

* `reactNode`: Sebuah *React Node* yang Anda ingin tampilkan. Biasanya berupa sebuah JSX seperti `<App />`, namun Ada juga dapat memberikan sebuah elemen React yang dibuat dengan [`createElement()`](/reference/react/createElement), sebuah *string*, sebuah angka (*number*), `null` atau `undefined`.

#### Kembalian {/*root-render-returns*/}

`root.render` mengembalikan `undefined`.

#### Catatan Penting {/*root-render-caveats*/}

* Pada pemanggilan `root.render` pertama kali, React akan menghapus seluruh konten HTML yang ada pada akar React, sebelum me-*render* komponen React di dalamnya.

* Jika node DOM akar Anda memiliki HTML yang dibuat oleh React pada server, atau proses *build*, gunakan [`hydrateRoot()`](/reference/react-dom/client/hydrateRoot) agar *event handler* dapat dikaitkan dengan HTML yang ada.

* Jika Anda memanggil `render` pada akar yang sama berulang kali, React akan memperbarui DOM sebisa mungkin hingga menyamai JSX terakhir yang Anda berikan. React akan memutuskan bagian mana dari DOM yang dapat digunakan kembali dan bagian mana yang perlu dibuat ulang, dengan melakukan ["pencocokan"](/learn/preserving-and-resetting-state) dengan pohon yang telah di-*render* sebelumnya. Pemanggilan kembali `render` di akar yang sama mirip dengan memanggil [fungsi `set`](/reference/react/useState#setstate) pada komponen akar: React menghindari pembaharuan DOM yang tidak diperlukan.

---

### `root.unmount()` {/*root-unmount*/}

Panggil `root.unmount` untuk memusnakan pohon yang telah di-*render* dalam akar React.

```js
root.unmount();
```

Sebuah aplikasi yang dibuat sepenuhnya dengan React biasanya tidak perlu memanggil `root.unmount`.

Fungsi ini biasanya berguna saat node DOM pada akar React (atau turunan lainnya) mungkin dapat terhapus dari DOM oleh kode lain. Sebagai contoh, bayangkan sebuah panel tab jQuery yang menghapus tab nonaktif dari DOM. Jika tab tersebut terhapus, seluruh isi dari DOM tersebut (termasuk akar React) juga akan ikut terhapus. Pada kasus ini, Anda perlu memberitahukan React untuk "stop" mengelola konten DOM akar yang terhapus dengan memanggil `root.unmount`. Jika tidak, komponen yang ada di dalam akar tersebut tidak tahu kalau mereka harus membersihkan dan membebaskan *resources* global seperti *subscriptions*.

Memanggil `root.unmount` akan meng-*unmount* seluruh komponen di dalam akar, dan "melepaskan" React dari dalam node DOM akar, termasuk menghapus *event handlers* dan *state* yang ada pada pohon. 


#### Parameter {/*root-unmount-parameters*/}

`root.unmount` tidak menerima parameter apapun.


#### Kembalian {/*root-unmount-returns*/}

`root.unmount` mengembalikan `undefined`.

#### Catatan penting {/*root-unmount-caveats*/}

* Pemanggilan `root.unmount` akan meng-*unmount* seluruh komponen pada pohon dan "melepaskan" React dari node DOM akar.

* Begitu Anda memanggil `root.unmount`, Anda tidak dapat memanggil `root.render` kembali pada akar yang sama. Percobaan memanggil `root.render` pada akar yang sudah di-*unmount* akan menyebabkan kesalahan "*Cannot update an unmounted root*". Walaupun begitu, Anda dapat membuat akar yang baru untuk node DOM yang sama setelah node pada akar sebelumnya telah di-*unmount*.

---

## Penggunaan {/*usage*/}

### Me-*render* aplikasi yang dibuat sepenuhnya dengan React {/*rendering-an-app-fully-built-with-react*/}

Jika aplikasi Anda dibuat sepenuhnya dengan React, buatlah sebuah akar untuk seluruh bagian aplikasi Anda.

```js [[1, 3, "document.getElementById('root')"], [2, 4, "<App />"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Biasanya, Anda cukup menjalankan kode ini sekali saja pada *startup*. Kode ini akan:

1. Mencari <CodeStep step={1}>node DOM pada peramban</CodeStep>, yang didefinisikan di HTML Anda.
2. Menampilkan <CodeStep step={2}>komponen React</CodeStep> untuk aplikasi Anda didalamnya.

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <!-- Ini adalah node DOMnya -->
    <div id="root"></div>
  </body>
</html>
```

```js src/index.js active
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  return (
    <>
      <h1>Halo, dunia!</h1>
      <Counter />
    </>
  );
}

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Anda mengklik saya {count} kali
    </button>
  );
}
```

</Sandpack>

**Jika aplikasi Anda dibuat sepenuhnya dengan React, Anda seharusnya tidak perlu membuat akar-akar lainnya, atau memanggil [`root.render`](#root-render) kembali.**

Kedepannya, React akan mengelola DOM tersebut untuk seluruh aplikasi Anda. Untuk menambahkan komponen-komponen lain, [pasangkan mereka di dalam komponen `App`.](/learn/importing-and-exporting-components) Saat Anda perlu memperbarui UI tersebut, Anda dapat melakukannya [dengan menggunakan *state*.](/reference/react/useState) Saat Anda ingin menampilkan konten ekstra seperti *modal* atau *tooltip* diluar dari node DOM, [*render* komponen tersebut dengan sebuah portal.](/reference/react-dom/createPortal)

<Note>

Saat HTML Anda kosong, pengguna akan melihat sebuah halaman kosong sampai kode JavaScript aplikasi selesai dimuat dan berjalan.

```html
<div id="root"></div>
```

Ini dapat terasa sangat lambat! Untuk mengatasi masalah ini, Anda dapat membuat HTML awal dari komponen Anda [pada server atau saat proses *build*](/reference/react-dom/server) Sehingga pengunjung dapat membaca teks, melihat gambar dan mengklik tautan sebelum kode JavaScript apapun selesai dimuat. Kami merekomendasikan untuk [menggunakan sebuah *framework*](/learn/start-a-new-react-project#production-grade-react-frameworks) yang telah melakukan optimisasi ini sejak awal. Bergantung dari kapan proses ini berjalan, ini dapat dipanggil sebagai *server-side rendering (SSR)* atau *static site generation (SSG).*

</Note>

<Pitfall>

**Aplikasi yang di-*render* pada server atau pembuatan statis harus memanggil [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), bukan `createRoot`.** React kemudian akan meng-*hydrate* (menggunakan ulang) node-node DOM dari HTML Anda, alih-alih menghancurkan dan membuat ulang node tersebut.

</Pitfall>

---

### Me-*render* halaman yang sebagian dibuat dengan React {/*rendering-a-page-partially-built-with-react*/}

Jika halaman Anda [tidak dibuat sepenuhnya dengan React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), Anda dapat memanggil `createRoot` lebih dari sekali untuk membuat akar dari setiap bagian level teratas yang dikelola React. Anda dapat menampilkan konten yang berbeda untuk setip akar dengan memanggil [`root.render`.](#root-render)

Di sini, dua komponen React yang berbeda di-*render* kedalam dua node DOM yang didefinisikan dalam file `index.html`.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <nav id="navigation"></nav>
    <main>
      <p>Paragraf ini tidak di-*render* oleh React (buka index.html untuk memastikan).</p>
      <section id="comments"></section>
    </main>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { createRoot } from 'react-dom/client';
import { Comments, Navigation } from './Components.js';

const navDomNode = document.getElementById('navigation');
const navRoot = createRoot(navDomNode); 
navRoot.render(<Navigation />);

const commentDomNode = document.getElementById('comments');
const commentRoot = createRoot(commentDomNode); 
commentRoot.render(<Comments />);
```

```js src/Components.js
export function Navigation() {
  return (
    <ul>
      <NavLink href="/">Beranda</NavLink>
      <NavLink href="/about">Tentang</NavLink>
    </ul>
  );
}

function NavLink({ href, children }) {
  return (
    <li>
      <a href={href}>{children}</a>
    </li>
  );
}

export function Comments() {
  return (
    <>
      <h2>Komentar</h2>
      <Comment text="Halo!" author="Sophie" />
      <Comment text="Gimana kabarnya?" author="Sunil" />
    </>
  );
}

function Comment({ text, author }) {
  return (
    <p>{text} — <i>{author}</i></p>
  );
}
```

```css
nav ul { padding: 0; margin: 0; }
nav ul li { display: inline-block; margin-right: 20px; }
```

</Sandpack>

Anda dapat juga membuat node DOM baru dengan [`document.createElement()`](https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement) dan menambahkannya ke dalam dokumen secara langsung.

```js
const domNode = document.createElement('div');
const root = createRoot(domNode); 
root.render(<Comment />);
document.body.appendChild(domNode); // Anda dapat menambahkan kode ini di manapun dalam dokumen
```

Untuk memusnahkan pohon React dari node DOM dan membersihkan seluruh *resources* yang digunakan, panggil [`root.unmount`.](#root-unmount)

```js
root.unmount();
```

Hal ini biasanya berguna saat komponen React Anda berada dalam aplikasi yang menggunakan *framework* yang berbeda.

---

### Memperbarui komponen akar {/*updating-a-root-component*/}

Anda dapat memanggil `render` lebih dari sekali untuk akar yang sama. Selama pohon komponen tersebut sama dengan yang sebelumnya telah di-*render*, React akan [menjaga statenya.](/learn/preserving-and-resetting-state) Perhatikan bagaimana Anda dapat mengetik pada *input*, yang berarti pembaruan dari pemanggilan `render` yang berulang setiap detik pada contoh ini tidak desktruktif.

<Sandpack>

```js src/index.js active
import { createRoot } from 'react-dom/client';
import './styles.css';
import App from './App.js';

const root = createRoot(document.getElementById('root'));

let i = 0;
setInterval(() => {
  root.render(<App counter={i} />);
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Halo dunia! {counter}</h1>
      <input placeholder="Type something here" />
    </>
  );
}
```

</Sandpack>

Pemanggilan `render` berulang kali biasanya tidak wajar. Pada umumnya komponen Anda akan [memperbarui *state*](/reference/react/useState).

### Menampilkan dialog untuk *error* yang tidak ditangkap {/*show-a-dialog-for-uncaught-errors*/}

<Canary>

`onCaughtError` hanya tersedia di rilis Canary React terbaru.

</Canary>

Secara bawaan, React akan me-log semua *error* yang tidak ditangkap ke konsol. Untuk mengimplementasikan pelaporan *error* Anda sendiri, Anda dapat menyediakan opsi *root* `onUncaughtError` opsional:

```js [[1, 6, "onUncaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onUncaughtError: (error, errorInfo) => {
      console.error(
        'Uncaught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

Pengaturan <CodeStep step={1}>onUncaughtError</CodeStep> adalah fungsi yang dipanggil dengan dua argumen:

1. The <CodeStep step={2}>error</CodeStep> yang dilempar.
2. Obyek <CodeStep step={3}>errorInfo</CodeStep> yang berisi <CodeStep step={4}>componentStack</CodeStep> dari *error* tersebut.

Anda dapat menggunakan opsi *root* `onUncaughtError` untuk menampilkan dialog *error*:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");
  
  // Set the title
  errorTitle.innerText = title;
  
  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];
  
  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }
  
  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportUncaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onUncaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportUncaughtError({
        error,
        componentStack: errorInfo.componentStack
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';

export default function App() {
  const [throwError, setThrowError] = useState(false);
  
  if (throwError) {
    foo.bar = 'baz';
  }
  
  return (
    <div>
      <span>This error shows the error dialog:</span>
      <button onClick={() => setThrowError(true)}>
        Throw error
      </button>
    </div>
  );
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0"
  },
  "main": "/index.js"
}
```

</Sandpack>


### Menampilkan kesalahan dari *Error Boundary* {/*displaying-error-boundary-errors*/}

<Canary>

`onCaughtError` hanya tersedia di rilis Canary React terbaru.

</Canary>

Secara bawaan, React akan me-log semua *error* yang ditangkap di *Error Boundary* ke `console.error`. Untuk mengesampingkan perilaku ini, Anda dapat memberikan opsi root `onCaughtError` opsional untuk kesalahan yang ditangkap oleh [*Error Boundary*](/reference/react/Component#catching-rendering-errors-with-an-error-boundary):

```js [[1, 6, "onCaughtError"], [2, 6, "error", 1], [3, 6, "errorInfo"], [4, 10, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onCaughtError: (error, errorInfo) => {
      console.error(
        'Caught error',
        error,
        errorInfo.componentStack
      );
    }
  }
);
root.render(<App />);
```

Pengaturan <CodeStep step={1}>onUncaughtError</CodeStep> adalah fungsi yang dipanggil dengan dua argumen:

1. <CodeStep step={2}>error</CodeStep> yang ditangkap oleh *boundary*.
2. Obyek <CodeStep step={3}>errorInfo</CodeStep> yang berisi <CodeStep step={4}>componentStack</CodeStep> dari *error* tersebut.

Anda dapat menggunakan opsi *root* `onUncaughtError` untuk menunjukkan dialog *error* atau memfilter *error* yang diketahui dari *logging*:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  errorTitle.innerText = title;

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportCaughtError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onCaughtError: (error, errorInfo) => {
    if (error.message !== 'Known error') {
      reportCaughtError({
        error, 
        componentStack: errorInfo.componentStack,
      });
    }
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

export default function App() {
  const [error, setError] = useState(null);
  
  function handleUnknown() {
    setError("unknown");
  }

  function handleKnown() {
    setError("known");
  }
  
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
        onReset={(details) => {
          setError(null);
        }}
      >
        {error != null && <Throw error={error} />}
        <span>This error will not show the error dialog:</span>
        <button onClick={handleKnown}>
          Throw known error
        </button>
        <span>This error will show the error dialog:</span>
        <button onClick={handleUnknown}>
          Throw unknown error
        </button>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender({ resetErrorBoundary }) {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  );
}

function Throw({error}) {
  if (error === "known") {
    throw new Error('Known error')
  } else {
    foo.bar = 'baz';
  }
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>

### Menampilkan dialog untuk *error* yang dapat dipulihkan {/*displaying-a-dialog-for-recoverable-errors*/}

React dapat secara otomatis me-*render* komponen untuk kedua kalinya guna mencoba memulihkan dari *error* yang terjadi saat me-*render*. Jika berhasil, React akan me-log *error* yang dapat dipulihkan ke konsol untuk memberi tahu pengembang aplikasi. Untuk mengatasi perilaku ini, Anda dapat memberikan opsi *root* `onRecoverableError` opsional:

```js [[1, 6, "onRecoverableError"], [2, 6, "error", 1], [3, 10, "error.cause"], [4, 6, "errorInfo"], [5, 11, "componentStack"]]
import { createRoot } from 'react-dom/client';

const root = createRoot(
  document.getElementById('root'),
  {
    onRecoverableError: (error, errorInfo) => {
      console.error(
        'Recoverable error',
        error,
        error.cause,
        errorInfo.componentStack,
      );
    }
  }
);
root.render(<App />);
```

Pengaturan <CodeStep step={1}>onRecoverableError</CodeStep> adalah fungsi yang dipanggil dengan dua argumen:

1. <CodeStep step={2}>error</CodeStep> yang dilempar React. Beberapa *error* mungkin mengandung penyebab awal sebagai <CodeStep step={3}>error.cause</CodeStep>. 
2. Obyek <CodeStep step={4}>errorInfo</CodeStep> yang mengandung <CodeStep step={5}>componentStack</CodeStep> dari *error* tersebut.

Anda dapat menggunakan opsi *root* `onRecoverableError` untuk menampilkan dialog *error*:

<Sandpack>

```html index.html hidden
<!DOCTYPE html>
<html>
<head>
  <title>My app</title>
</head>
<body>
<!--
  Error dialog in raw HTML
  since an error in the React app may crash.
-->
<div id="error-dialog" class="hidden">
  <h1 id="error-title" class="text-red"></h1>
  <h3>
    <pre id="error-message"></pre>
  </h3>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h4 class="-mb-20">This error occurred at:</h4>
  <pre id="error-component-stack" class="nowrap"></pre>
  <h4 class="mb-0">Call stack:</h4>
  <pre id="error-stack" class="nowrap"></pre>
  <div id="error-cause">
    <h4 class="mb-0">Caused by:</h4>
    <pre id="error-cause-message"></pre>
    <pre id="error-cause-stack" class="nowrap"></pre>
  </div>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
  <h3 id="error-not-dismissible">This error is not dismissible.</h3>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>
```

```css src/styles.css active
label, button { display: block; margin-bottom: 20px; }
html, body { min-height: 300px; }

#error-dialog {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
  padding: 15px;
  opacity: 0.9;
  text-wrap: wrap;
  overflow: scroll;
}

.text-red {
  color: red;
}

.-mb-20 {
  margin-bottom: -20px;
}

.mb-0 {
  margin-bottom: 0;
}

.mb-10 {
  margin-bottom: 10px;
}

pre {
  text-wrap: wrap;
}

pre.nowrap {
  text-wrap: nowrap;
}

.hidden {
 display: none;  
}
```

```js src/reportError.js hidden
function reportError({ title, error, componentStack, dismissable }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorTitle = document.getElementById("error-title");
  const errorMessage = document.getElementById("error-message");
  const errorBody = document.getElementById("error-body");
  const errorComponentStack = document.getElementById("error-component-stack");
  const errorStack = document.getElementById("error-stack");
  const errorClose = document.getElementById("error-close");
  const errorCause = document.getElementById("error-cause");
  const errorCauseMessage = document.getElementById("error-cause-message");
  const errorCauseStack = document.getElementById("error-cause-stack");
  const errorNotDismissible = document.getElementById("error-not-dismissible");

  // Set the title
  errorTitle.innerText = title;

  // Display error message and body
  const [heading, body] = error.message.split(/\n(.*)/s);
  errorMessage.innerText = heading;
  if (body) {
    errorBody.innerText = body;
  } else {
    errorBody.innerText = '';
  }

  // Display component stack
  errorComponentStack.innerText = componentStack;

  // Display the call stack
  // Since we already displayed the message, strip it, and the first Error: line.
  errorStack.innerText = error.stack.replace(error.message, '').split(/\n(.*)/s)[1];

  // Display the cause, if available
  if (error.cause) {
    errorCauseMessage.innerText = error.cause.message;
    errorCauseStack.innerText = error.cause.stack;
    errorCause.classList.remove('hidden');
  } else {
    errorCause.classList.add('hidden');
  }
  // Display the close button, if dismissible
  if (dismissable) {
    errorNotDismissible.classList.add('hidden');
    errorClose.classList.remove("hidden");
  } else {
    errorNotDismissible.classList.remove('hidden');
    errorClose.classList.add("hidden");
  }

  // Show the dialog
  errorDialog.classList.remove("hidden");
}

export function reportCaughtError({error, cause, componentStack}) {
  reportError({ title: "Caught Error", error, componentStack,  dismissable: true});
}

export function reportUncaughtError({error, cause, componentStack}) {
  reportError({ title: "Uncaught Error", error, componentStack, dismissable: false });
}

export function reportRecoverableError({error, cause, componentStack}) {
  reportError({ title: "Recoverable Error", error, componentStack,  dismissable: true });
}
```

```js src/index.js active
import { createRoot } from "react-dom/client";
import App from "./App.js";
import {reportRecoverableError} from "./reportError";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container, {
  onRecoverableError: (error, errorInfo) => {
    reportRecoverableError({
      error,
      cause: error.cause,
      componentStack: errorInfo.componentStack,
    });
  }
});
root.render(<App />);
```

```js src/App.js
import { useState } from 'react';
import { ErrorBoundary } from "react-error-boundary";

// 🚩 Bug: Never do this. This will force an error.
let errorThrown = false;
export default function App() {
  return (
    <>
      <ErrorBoundary
        fallbackRender={fallbackRender}
      >
        {!errorThrown && <Throw />}
        <p>This component threw an error, but recovered during a second render.</p>
        <p>Since it recovered, no Error Boundary was shown, but <code>onRecoverableError</code> was used to show an error dialog.</p>
      </ErrorBoundary>
      
    </>
  );
}

function fallbackRender() {
  return (
    <div role="alert">
      <h3>Error Boundary</h3>
      <p>Something went wrong.</p>
    </div>
  );
}

function Throw({error}) {
  // Simulate an external value changing during concurrent render.
  errorThrown = true;
  foo.bar = 'baz';
}
```

```json package.json hidden
{
  "dependencies": {
    "react": "canary",
    "react-dom": "canary",
    "react-scripts": "^5.0.0",
    "react-error-boundary": "4.0.3"
  },
  "main": "/index.js"
}
```

</Sandpack>


---
## Pemecahan masalah {/*troubleshooting*/}

### Saya telah membuat sebuah akar, namun tidak ada yang tampil {/*ive-created-a-root-but-nothing-is-displayed*/}

Pastikan Anda tidak lupa untuk me-*render* aplikasi Anda dalam akarnya:

```js {5}
import { createRoot } from 'react-dom/client';
import App from './App.js';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
```

Tidak akan ada yang tampil sampai hal tersebut Anda lakukan.

---
### Saya mendapatkan pesan kesalahan: "*You passed a second argument to root.render*" {/*im-getting-an-error-you-passed-a-second-argument-to-root-render*/}

Kesalahan umum adalah mengoper opsi untuk `createRoot` ke `root.render(...)`:

<ConsoleBlock level="error">

Warning: You passed a second argument to root.render(...) but it only accepts one argument.

</ConsoleBlock>

Untuk memperbaikinya, oper opsi akar ke `createRoot(...)`, bukan `root.render(...)`:
```js {2,5}
// 🚩 Wrong: root.render only takes one argument.
root.render(App, {onUncaughtError});

// ✅ Correct: pass options to createRoot.
const root = createRoot(container, {onUncaughtError}); 
root.render(<App />);
```

---


### Saya mendapatkan pesan kesalahan: "*Target container is not a DOM element*" {/*im-getting-an-error-target-container-is-not-a-dom-element*/}

Pesan kesalahan ini menyatakan apapun yang Anda berikan ke `createRoot` bukan sebuah simpul DOM.

Jika Anda tidak yakin apa yang terjadi, cobalah me-*log* variabel tersebut:

```js {2}
const domNode = document.getElementById('root');
console.log(domNode); // ???
const root = createRoot(domNode);
root.render(<App />);
```

Sebagai contoh, jika `domNode` tersebut `null`, artinya [`getElementById`](https://developer.mozilla.org/en-US/docs/Web/API/Document/getElementById) mengembalikan `null`. Hal ini terjadi jika tidak ada node dalam dokumen yang memiliki ID yang Anda coba cari. Ada beberapa alasan yang memungkinkan:

1. ID yang Anda cari mungkin berbeda dengan ID yang Anda gunakan pada file HTML Anda. Cek *typo*!
2. Tag `<script>` pada *bundle* Anda tidak dapat "melihat" node DOM apapun yang muncul *setelahnya* dalam HTML.

Kesalahan umum lainnya untuk pesan kesalahan ini adalah penulisan `createRoot(<App />)` yang seharusnya `createRoot(domNode)`.

---

### Saya mendapatkan pesan kesalahan: "*Functions are not valid as a React child.*" {/*im-getting-an-error-functions-are-not-valid-as-a-react-child*/}

Pesan kesalahan ini menyatakan bahwa apapun yang Anda berikan pada `root.render` bukan sebuah komponen React.

Hal ini mungkin terjadi jika Anda memanggil `root.render` dengan `Component`, yang seharusnya `<Component />`.

```js {2,5}
// 🚩 Salah: App adalah fungsi, bukan komponen.
root.render(App);

// ✅ Benar: <App /> adalah komponen.
root.render(<App />);
```

Kemungkinan lainnya, saat Anda memberikan sebuah fungsi ke `root.render`, yang seharusnya hasil dari pemanggilannya.

```js {2,5}
// 🚩 Salah: createApp adalah fungsi, bukan komponen.
root.render(createApp);

// ✅ Benar: panggil createApp untuk mengembalikan sebuah komponen.
root.render(createApp());
```

---

### HTML yang di-*render* oleh server selalu dibuat ulang dari awal {/*my-server-rendered-html-gets-re-created-from-scratch*/}

Jika aplikasi Anda adalah aplikasi yang di-*render* oleh server dan menggunakan HTML awal yang dibuat oleh React, Anda mungkin akan menyadari bahwa dengan membuat akar dan memanggil `root.render` menghapus seluruh HTML tersebut dan membuat ulang node-node DOM dari awal. Hal ini dapat memperlambat, mereset fokus dan posisi *scroll*, dan mungkin menghilangkan *input* dari pengguna.

Aplikasi yang di-*render* oleh server harus menggunakan [`hydrateRoot`](/reference/react-dom/client/hydrateRoot), bukan `createRoot`:

```js {1,4-7}
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(
  document.getElementById('root'),
  <App />
);
```

Mohon dicatat bahwa APInya berbeda. Lebih spesifiknya, biasanya tidak akan ada lagi panggilan `root.render`.
