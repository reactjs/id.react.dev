---
title: unmountComponentAtNode
---

<Deprecated>

API ini akan dihapus pada versi mayor React yang akan datang.

Pada React 18, `unmountComponentAtNode` sudah digantikan oleh [`root.unmount()`](/reference/react-dom/client/createRoot#root-unmount).

</Deprecated>

<Intro>

`unmountComponentAtNode` menghapus komponen React yang telah terpasang dari DOM.

```js
unmountComponentAtNode(domNode)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `unmountComponentAtNode(domNode)` {/*unmountcomponentatnode*/}

Panggil `unmountComponentAtNode` untuk menghapus komponen React yang telah terpasang dari DOM dan membersihkan *event handler* beserta *state*-nya.

```js
import { unmountComponentAtNode } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);

unmountComponentAtNode(domNode);
```

[Lihat contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `domNode`: Sebuah [elemen DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React akan menghapus komponen React yang terpasang dari elemen ini.

#### Kembalian {/*returns*/}

`unmountComponentAtNode` mengembalikan `true` jika komponen tersebut telah berhasil dilepas dan `false` jika tidak.

---

## Penggunaan {/*usage*/}

Panggil `unmountComponentAtNode` untuk menghapus <CodeStep step={1}>komponen React yang sudah terpasang</CodeStep> dari <CodeStep step={2}>simpul DOM peramban</CodeStep> dan bersihkan *event handler* beserta *state*-nya.

```js [[1, 5, "<App />"], [2, 5, "rootNode"], [2, 8, "rootNode"]]
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const rootNode = document.getElementById('root');
render(<App />, rootNode);

// ...
unmountComponentAtNode(rootNode);
```


### Menghapus aplikasi React dari elemen DOM {/*removing-a-react-app-from-a-dom-element*/}

Terkadang, Anda mungkin ingin "menghiasi" dengan React halaman yang sudah ada, atau halaman yang tidak sepenuhnya ditulis dalam React. Dalam kasus tersebut, Anda mungkin perlu "menghentikan" aplikasi React, dengan menghapus semua UI, *state*, dan *listener* dari simpul DOM yang di-*render*.

Pada contoh ini, mengklik "*Render* Aplikasi React" akan me-*render* aplikasi React. Klik "Lepas Aplikasi React" untuk menghancurkannya:

<Sandpack>

```html index.html
<!DOCTYPE html>
<html>
  <head><title>My app</title></head>
  <body>
    <button id='render'><i>Render</i> Aplikasi React</button>
    <button id='unmount'>Lepas Aplikasi React</button>
    <!-- This is the React App node -->
    <div id='root'></div>
  </body>
</html>
```

```js src/index.js active
import './styles.css';
import { render, unmountComponentAtNode } from 'react-dom';
import App from './App.js';

const domNode = document.getElementById('root');

document.getElementById('render').addEventListener('click', () => {
  render(<App />, domNode);
});

document.getElementById('unmount').addEventListener('click', () => {
  unmountComponentAtNode(domNode);
});
```

```js src/App.js
export default function App() {
  return <h1>Hello, world!</h1>;
}
```

</Sandpack>
