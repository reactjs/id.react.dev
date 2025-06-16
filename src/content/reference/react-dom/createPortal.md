---
title: createPortal
---

<Intro>

`createPortal` memungkinkan Anda me-*render* beberapa anak (*children*) ke bagian yang berbeda dari DOM.


```js
<div>
  <SomeComponent />
  {createPortal(children, domNode, key?)}
</div>
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createPortal(children, domNode, key?)` {/*createportal*/}

Untuk membuat sebuah portal, panggil `createPortal`, dengan mengoper beberapa JSX, dan simpul DOM dimana tempat portal tersebut harus di-*render*:

```js
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

[Lihat contoh selengkapnya di bawah ini.](#usage)

Sebuah portal hanya mengubah penempatan kerangka dari simpul DOM. Dalam hal lain, JSX yang Anda *render* ke dalam portal bertindak sebagai simpul anaknya (*node child*) dari komponen React yang me-*render*-nya. Sebagai contoh, anaknya (*children*) dapat mengakses konteks yang disediakan oleh pohon induknya (*parent tree*), dan kejadian yang bertambah dari anak (*children*) ke induk (*parent*) sesuai dengan susunan React.

#### Parameters {/*parameters*/}

* `children`: Apa pun yang dapat di-*render* dengan React, seperti bagian dari JSX (misalnya `<div />` atau `<SomeComponent />`), sebuah [Fragment](/reference/react/Fragment) (`<>...</>`), sebuah *string* atau angka, ataupun sebuah larik.

* `domNode`: Beberapa simpul DOM, seperti yang dikembalikan oleh `document.getElementById()`. Simpul tersebut harus sudah ada. Melewatkan simpul DOM yang berbeda selama pembaruan akan menyebabkan konten portal dibuat ulang.

* **opsional** `key`: Sebuah *string* atau angka unik yang akan digunakan sebagai [kunci](/learn/rendering-lists/#keeping-list-items-in-order-with-key) portal.

#### Returns {/*returns*/}

`createPortal` mengembalikan sebuah simpul React yang dapat disertakan ke dalam JSX atau dikembalikan dari komponen React. Jika React mendapatinya dalam keluaran *render*, React akan menempatkan `children` yang disediakan di dalam `domNode`.

#### Peringatan {/*caveats*/}

* Kejadian dari portal menyebar sesuai dengan susunan React, bukan susunan DOM. Sebagai contoh, jika Anda mengklik di dalam sebuah portal, dan portal tersebut dibungkus dengan `<div onClick>`, maka *handler* `onClick` akan dijalankan. Jika hal ini menyebabkan masalah, hentikan perambatan kejadian dari dalam portal, atau pindahkan portal itu sendiri ke atas dalam susunan React.

---

## Penggunaan {/*usage*/}

### Me-*render* ke bagian yang berbeda dari DOM {/*rendering-to-a-different-part-of-the-dom*/}

*Portal* memungkinkan komponen Anda me-*render* beberapa komponen anaknya (*children*) ke tempat yang berbeda dalam DOM. Hal ini memungkinkan bagian dari komponen Anda "keluar" dari wadah apa pun yang ada. Sebagai contoh, sebuah komponen dapat menampilkan modal dialog atau *tooltip* yang muncul di atas dan di luar halaman lainnya.

Untuk membuat portal, *render* hasil dari `createPortal` dengan <CodeStep step={1}>beberapa JSX</CodeStep> dan <CodeStep step={2}>simpul DOM ke tempat yang seharusnya</CodeStep>:

```js [[1, 8, "<p>This child is placed in the document body.</p>"], [2, 9, "document.body"]]
import { createPortal } from 'react-dom';

function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

React akan meletakkan simpul DOM untuk <CodeStep step={1}>JSX yang Anda berikan</CodeStep> di dalam <CodeStep step={2}>simpul DOM yang Anda sediakan</CodeStep>.

Tanpa portal, elemen `<p>` yang kedua akan ditempatkan di dalam induk (*parent*) `<div>`, tetapi portal memindahkannya ke dalam [`document.body`:](https://developer.mozilla.org/en-US/docs/Web/API/Document/body)

<Sandpack>

```js
import { createPortal } from 'react-dom';

export default function MyComponent() {
  return (
    <div style={{ border: '2px solid black' }}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
}
```

</Sandpack>

Perhatikan bagaimana paragraf kedua secara visual muncul di luar induk `<div>` dengan *border*. Jika Anda memeriksa struktur DOM dengan *developer tools*, Anda akan melihat bahwa elemen `<p>` kedua ditempatkan langsung ke dalam `<body>`:

```html {4-6,9}
<body>
  <div id="root">
    ...
      <div style="border: 2px solid black">
        <p>This child is placed inside the parent div.</p>
      </div>
    ...
  </div>
  <p>This child is placed in the document body.</p>
</body>
```

Portal hanya mengubah penempatan kerangka dari simpul DOM. Dalam hal lain, JSX yang Anda *render* ke dalam portal bertindak sebagai simpul anaknya (*node child*) dari komponen React yang me-*render*-nya. Sebagai contoh, anaknya (*children*) dapat mengakses konteks yang disediakan oleh pohon induknya (*parent tree*), dan kejadian yang bertambah dari anak (*children*) ke induk (*parent*) sesuai dengan susunan React.

---

### Me-*render* modal dialog dengan portal {/*rendering-a-modal-dialog-with-a-portal*/}

Anda dapat menggunakan portal untuk membuat modal dialog yang mengapung di atas bagian halaman lainnya, bahkan jika komponen yang memanggil dialog berada di dalam wadah dengan `overflow: hidden` atau *style* lain yang bercampur dialog.

Pada contoh ini, dua kontainer memiliki *style* yang bercampur modal dialog, tetapi yang di-*render* ke dalam portal tidak terpengaruh karena, di dalam DOM, modal tidak terkandung di dalam elemen induk (*parent*) JSX.

<Sandpack>

```js src/App.js active
import NoPortalExample from './NoPortalExample';
import PortalExample from './PortalExample';

export default function App() {
  return (
    <>
      <div className="clipping-container">
        <NoPortalExample  />
      </div>
      <div className="clipping-container">
        <PortalExample />
      </div>
    </>
  );
}
```

```js src/NoPortalExample.js
import { useState } from 'react';
import ModalContent from './ModalContent.js';

export default function NoPortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal without a portal
      </button>
      {showModal && (
        <ModalContent onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
```

```js src/PortalExample.js active
import { useState } from 'react';
import { createPortal } from 'react-dom';
import ModalContent from './ModalContent.js';

export default function PortalExample() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

```js src/ModalContent.js
export default function ModalContent({ onClose }) {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```


```css src/styles.css
.clipping-container {
  position: relative;
  border: 1px solid #aaa;
  margin-bottom: 12px;
  padding: 12px;
  width: 250px;
  height: 80px;
  overflow: hidden;
}

.modal {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  box-shadow: rgba(100, 100, 111, 0.3) 0px 7px 29px 0px;
  background-color: white;
  border: 2px solid rgb(240, 240, 240);
  border-radius: 12px;
  position:  absolute;
  width: 250px;
  top: 70px;
  left: calc(50% - 125px);
  bottom: 70px;
}
```

</Sandpack>

<Pitfall>

Penting untuk memastikan bahwa aplikasi Anda dapat diakses saat menggunakan portal. Misalnya, Anda mungkin perlu mengatur fokus *keyboard* agar pengguna dapat memindahkan fokus ke dalam dan ke luar portal secara alami.

<<<<<<< HEAD
Ikuti [Praktik Penulisan Modal WAI-ARIA](https://www.w3.org/WAI/ARIA/apg/#dialog_modal) saat membuat modal. Jika Anda menggunakan paket komunitas, pastikan paket tersebut dapat diakses dan mengikuti panduan ini.
=======
Follow the [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal) when creating modals. If you use a community package, ensure that it is accessible and follows these guidelines.
>>>>>>> 50d6991ca6652f4bc4c985cf0c0e593864f2cc91

</Pitfall>

---

### Me-*render* komponen React ke dalam non-React *server markup* {/*rendering-react-components-into-non-react-server-markup*/}

Portal dapat berguna jika *root* React Anda hanya merupakan bagian dari halaman statis atau halaman yang di-*render* oleh *server* yang tidak dibangun dengan React. Sebagai contoh, jika halaman Anda dibangun dengan kerangka kerja *server* seperti Rails, Anda dapat membuat area interaktivitas di dalam area statis seperti *sidebar*. Dibandingkan dengan memiliki [beberapa *root* React yang terpisah,](/reference/react-dom/client/createRoot#rendering-a-page-partially-built-with-react) portal memungkinkan Anda memperlakukan aplikasi sebagai satu susunan React dengan *state* yang sama meskipun bagian-bagiannya di-render ke bagian yang berbeda di dalam DOM.

<Sandpack>

```html public/index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <h1>Welcome to my hybrid app</h1>
    <div class="parent">
      <div class="sidebar">
        This is server non-React markup
        <div id="sidebar-content"></div>
      </div>
      <div id="root"></div>
    </div>
  </body>
</html>
```

```js src/index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```js src/App.js active
import { createPortal } from 'react-dom';

const sidebarContentEl = document.getElementById('sidebar-content');

export default function App() {
  return (
    <>
      <MainContent />
      {createPortal(
        <SidebarContent />,
        sidebarContentEl
      )}
    </>
  );
}

function MainContent() {
  return <p>This part is rendered by React</p>;
}

function SidebarContent() {
  return <p>This part is also rendered by React!</p>;
}
```

```css
.parent {
  display: flex;
  flex-direction: row;
}

#root {
  margin-top: 12px;
}

.sidebar {
  padding:  12px;
  background-color: #eee;
  width: 200px;
  height: 200px;
  margin-right: 12px;
}

#sidebar-content {
  margin-top: 18px;
  display: block;
  background-color: white;
}

p {
  margin: 0;
}
```

</Sandpack>

---

### Me-*render* komponen React ke dalam non-React simpul DOM {/*rendering-react-components-into-non-react-dom-nodes*/}

Anda juga dapat menggunakan portal untuk mengelola konten simpul DOM yang dikelola di luar React. Sebagai contoh, misalkan Anda mengintegrasikan dengan *widget* peta non-React dan Anda ingin me-*render* konten React di dalam *popup*. Untuk melakukan ini, deklarasikan variabel *state* `popupContainer` untuk menyimpan simpul DOM yang akan Anda *render*:

```js
const [popupContainer, setPopupContainer] = useState(null);
```

Saat Anda membuat *widget* pihak ketiga, simpan simpul DOM yang dikembalikan oleh *widget* agar Anda dapat me-*render*-nya:

```js {5-6}
useEffect(() => {
  if (mapRef.current === null) {
    const map = createMapWidget(containerRef.current);
    mapRef.current = map;
    const popupDiv = addPopupToMapWidget(map);
    setPopupContainer(popupDiv);
  }
}, []);
```

Hal ini memungkinkan Anda menggunakan `createPortal` untuk me-*render* konten React ke dalam `popupContainer` setelah konten tersebut tersedia:

```js {3-6}
return (
  <div style={{ width: 250, height: 250 }} ref={containerRef}>
    {popupContainer !== null && createPortal(
      <p>Hello from React!</p>,
      popupContainer
    )}
  </div>
);
```

Berikut ini contoh lengkap yang bisa Anda mainkan:

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

```js src/App.js
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { createMapWidget, addPopupToMapWidget } from './map-widget.js';

export default function Map() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [popupContainer, setPopupContainer] = useState(null);

  useEffect(() => {
    if (mapRef.current === null) {
      const map = createMapWidget(containerRef.current);
      mapRef.current = map;
      const popupDiv = addPopupToMapWidget(map);
      setPopupContainer(popupDiv);
    }
  }, []);

  return (
    <div style={{ width: 250, height: 250 }} ref={containerRef}>
      {popupContainer !== null && createPortal(
        <p>Hello from React!</p>,
        popupContainer
      )}
    </div>
  );
}
```

```js src/map-widget.js
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';

export function createMapWidget(containerDomNode) {
  const map = L.map(containerDomNode);
  map.setView([0, 0], 0);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(map);
  return map;
}

export function addPopupToMapWidget(map) {
  const popupDiv = document.createElement('div');
  L.popup()
    .setLatLng([0, 0])
    .setContent(popupDiv)
    .openOn(map);
  return popupDiv;
}
```

```css
button { margin: 5px; }
```

</Sandpack>
