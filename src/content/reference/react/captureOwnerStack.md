---
title: captureOwnerStack
---

<Intro>

`captureOwnerStack` membaca *Owner Stack* saat ini dalam mode pengembangan (*development*) dan mengembalikannya sebagai *string* jika tersedia.

```js
const stack = captureOwnerStack();
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `captureOwnerStack()` {/*captureownerstack*/}

Panggil `captureOwnerStack` untuk mendapatkan *Owner Stack* saat ini.

```js {5,5}
import * as React from 'react';

function Component() {
  if (process.env.NODE_ENV !== 'production') {
    const ownerStack = React.captureOwnerStack();
    console.log(ownerStack);
  }
}
```

#### Parameter {/*parameters*/}

`captureOwnerStack` tidak menerima parameter apa pun.

#### Nilai Kembalian {/*returns*/}

`captureOwnerStack` mengembalikan `string | null`.

*Owner Stack* tersedia pada:
- *Render* Komponen
- *Effects* (misalnya `useEffect`)
- *Event handler* bawaan React (misalnya `<button onClick={...} />`)
- Penangan galat React ([Opsi React Root](/reference/react-dom/client/createRoot#parameters) `onCaughtError`, `onRecoverableError`, dan `onUncaughtError`)

Jika tidak ada *Owner Stack* yang tersedia, `null` akan dikembalikan (lihat [Pemecahan Masalah: *Owner Stack* bernilai `null`](#the-owner-stack-is-null)).

#### Peringatan {/*caveats*/}

- *Owner Stack* hanya tersedia dalam mode pengembangan (*development*). `captureOwnerStack` akan selalu mengembalikan nilai `null` di luar lingkungan pengembangan.

<DeepDive>

#### Owner Stack vs Component Stack {/*owner-stack-vs-component-stack*/}

*Owner Stack* berbeda dari *Component Stack* yang tersedia pada penangan galat React seperti [`errorInfo.componentStack` pada `onUncaughtError`](/reference/react-dom/client/hydrateRoot#error-logging-in-production).

Sebagai contoh, perhatikan kode berikut:

<Sandpack>

```js src/App.js
import {Suspense} from 'react';

function SubComponent({disabled}) {
  if (disabled) {
    throw new Error('disabled');
  }
}

export function Component({label}) {
  return (
    <fieldset>
      <legend>{label}</legend>
      <SubComponent key={label} disabled={label === 'disabled'} />
    </fieldset>
  );
}

function Navigation() {
  return null;
}

export default function App({children}) {
  return (
    <Suspense fallback="loading...">
      <main>
        <Navigation />
        {children}
      </main>
    </Suspense>
  );
}
```

```js src/index.js
import {captureOwnerStack} from 'react';
import {createRoot} from 'react-dom/client';
import App, {Component} from './App.js';
import './styles.css';

createRoot(document.createElement('div'), {
  onUncaughtError: (error, errorInfo) => {
    // Stack dicatat ke log alih-alih menampilkannya langsung di UI
    // untuk menegaskan bahwa peramban akan menerapkan sourcemaps pada stack yang dicatat.
    // Perhatikan bahwa sourcemapping hanya diterapkan di konsol peramban asli,
    // bukan pada konsol tiruan yang ditampilkan di halaman ini.
    // Tekan "fork" untuk melihat stack dengan sourcemap di konsol nyata.
    console.log(errorInfo.componentStack);
    console.log(captureOwnerStack());
  },
}).render(
  <App>
    <Component label="disabled" />
  </App>
);
```

```html public/index.html hidden
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <p>Check the console output.</p>
  </body>
</html>
```

</Sandpack>

`SubComponent` akan melempar galat (*error*).
*Component Stack* dari galat tersebut adalah:

```
at SubComponent
at fieldset
at Component
at main
at React.Suspense
at App
```

Namun, *Owner Stack* hanya akan berisi:

```
at Component
```

Baik `App` maupun komponen DOM (misalnya `fieldset`) tidak dianggap sebagai *Owners* dalam *Stack* ini karena mereka tidak berkontribusi dalam "membuat" simpul (*node*) yang memuat `SubComponent`. `App` dan komponen DOM hanya meneruskan simpul tersebut. `App` hanya me-*render* simpul `children`, berbeda dengan `Component` yang membuat simpul berisi `SubComponent` melalui `<SubComponent />`.

Baik `Navigation` maupun `legend` sama sekali tidak berada di dalam *stack* karena keduanya hanya merupakan saudara kandung (*sibling*) dari simpul yang berisi `<SubComponent />`.

`SubComponent` dihilangkan karena sudah menjadi bagian dari *callstack*.

</DeepDive>

## Penggunaan {/*usage*/}

### Meningkatkan overlay galat kustom {/*enhance-a-custom-error-overlay*/}

```js [[1, 5, "console.error"], [4, 7, "captureOwnerStack"]]
import { captureOwnerStack } from "react";
import { instrumentedConsoleError } from "./errorOverlay";

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Perlu diingat bahwa pada aplikasi nyata, console.error dapat
    // dipanggil dengan beberapa argumen yang perlu Anda perhitungkan.
    consoleMessage: args[0],
    ownerStack,
  });
};
```

Jika Anda mencegat pemanggilan <CodeStep step={1}>`console.error`</CodeStep> untuk menyorotnya pada *overlay* galat, Anda dapat memanggil <CodeStep step={2}>`captureOwnerStack`</CodeStep> untuk menyertakan *Owner Stack*.

<Sandpack>

```css src/styles.css
* {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  margin: 20px;
  padding: 0;
}

h1 {
  margin-top: 0;
  font-size: 22px;
}

h2 {
  margin-top: 0;
  font-size: 20px;
}

code {
  font-size: 1.2em;
}

ul {
  padding-inline-start: 20px;
}

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

```html public/index.html hidden
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
  <h1 id="error-title" class="text-red">Error</h1>
  <p>
    <pre id="error-body"></pre>
  </p>
  <h2 class="-mb-20">Owner Stack:</h4>
  <pre id="error-owner-stack" class="nowrap"></pre>
  <button
    id="error-close"
    class="mb-10"
    onclick="document.getElementById('error-dialog').classList.add('hidden')"
  >
    Close
  </button>
</div>
<!-- This is the DOM node -->
<div id="root"></div>
</body>
</html>

```

```js src/errorOverlay.js

export function onConsoleError({ consoleMessage, ownerStack }) {
  const errorDialog = document.getElementById("error-dialog");
  const errorBody = document.getElementById("error-body");
  const errorOwnerStack = document.getElementById("error-owner-stack");

  // Tampilkan pesan console.error()
  errorBody.innerText = consoleMessage;

  // Tampilkan owner stack
  errorOwnerStack.innerText = ownerStack;

  // Tampilkan dialog
  errorDialog.classList.remove("hidden");
}
```

```js src/index.js active
import { captureOwnerStack } from "react";
import { createRoot } from "react-dom/client";
import App from './App';
import { onConsoleError } from "./errorOverlay";
import './styles.css';

const originalConsoleError = console.error;
console.error = function patchedConsoleError(...args) {
  originalConsoleError.apply(console, args);
  const ownerStack = captureOwnerStack();
  onConsoleError({
    // Perlu diingat bahwa pada aplikasi nyata, console.error dapat
    // dipanggil dengan beberapa argumen yang perlu Anda perhitungkan.
    consoleMessage: args[0],
    ownerStack,
  });
};

const container = document.getElementById("root");
createRoot(container).render(<App />);
```

```js src/App.js
function Component() {
  return <button onClick={() => console.error('Some console error')}>Trigger console.error()</button>;
}

export default function App() {
  return <Component />;
}
```

</Sandpack>

## Pemecahan Masalah {/*troubleshooting*/}

### *Owner Stack* bernilai `null` {/*the-owner-stack-is-null*/}

Pemanggilan `captureOwnerStack` terjadi di luar fungsi yang dikendalikan oleh React, misalnya di dalam *callback* `setTimeout`, setelah pemanggilan `fetch`, atau di dalam penangan *event* DOM kustom. Selama proses *render*, *Effects*, penangan *event* React, dan penangan galat React (misalnya `hydrateRoot#options.onCaughtError`), *Owner Stack* seharusnya tersedia.

Pada contoh di bawah ini, mengklik tombol akan mencatat *Owner Stack* yang kosong karena `captureOwnerStack` dipanggil di dalam penangan *event* DOM kustom. *Owner Stack* harus ditangkap lebih awal, misalnya dengan memindahkan pemanggilan `captureOwnerStack` ke dalam badan *Effect*.
<Sandpack>

```js
import {captureOwnerStack, useEffect} from 'react';

export default function App() {
  useEffect(() => {
    // Seharusnya memanggil `captureOwnerStack` di sini.
    function handleEvent() {
      // Memanggilnya di dalam event handler DOM kustom sudah terlambat.
      // Owner Stack akan bernilai `null` pada titik ini.
      console.log('Owner Stack: ', captureOwnerStack());
    }

    document.addEventListener('click', handleEvent);

    return () => {
      document.removeEventListener('click', handleEvent);
    }
  })

  return <button>Click me to see that Owner Stacks are not available in custom DOM event handlers</button>;
}
```

</Sandpack>

### `captureOwnerStack` tidak tersedia {/*captureownerstack-is-not-available*/}

`captureOwnerStack` hanya diekspor pada *build* pengembangan (*development*). Fungsi ini akan bernilai `undefined` pada *build* produksi. Jika `captureOwnerStack` digunakan pada berkas yang di-*bundle* untuk produksi dan pengembangan, Anda sebaiknya mengaksesnya secara kondisional melalui *namespace import*.

```js
// Jangan gunakan named imports untuk `captureOwnerStack` pada berkas yang di-bundle untuk produksi dan pengembangan.
import {captureOwnerStack} from 'react';
// Gunakan namespace import dan akses `captureOwnerStack` secara kondisional.
import * as React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const ownerStack = React.captureOwnerStack();
  console.log('Owner Stack', ownerStack);
}
```
