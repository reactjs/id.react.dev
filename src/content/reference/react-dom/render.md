---
title: render
---

<Deprecated>

API ini akan dihapus di versi utama React yang akan datang.

Pada React 18, `render` digantikan oleh [`createRoot`.](/reference/react-dom/client/createRoot) Menggunakan `render` pada React 18 akan memperingatkan bahwa aplikasi Anda akan berperilaku seolah-olah menjalankan React 17. Pelajari lebih lanjut [di sini.](/blog/2022/03/08/react-18-upgrade-guide#updates-to-client-rendering-apis)

</Deprecated>

<Intro>

`render` me-*render* bagian dari [JSX](/learn/writing-markup-with-jsx) ("Simpul React") ke dalam simpul DOM peramban.

```js
render(reactNode, domNode, callback?)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `render(reactNode, domNode, callback?)` {/*render*/}

Panggil `render` untuk menampilkan komponen React di dalam elemen DOM peramban.

```js
import { render } from 'react-dom';

const domNode = document.getElementById('root');
render(<App />, domNode);
```

React akan menampilkan `<App />` di dalam `domNode`, dan mengambil alih pengelolaan DOM di dalamnya.

Sebuah aplikasi yang sepenuhnya dibangun dengan React biasanya hanya akan memiliki satu pemanggilan `render` dengan komponen akarnya.  Sebuah halaman yang menggunakan "campuran" dari React untuk beberapa bagian dari halaman dapat memiliki panggilan `render` sebanyak yang dibutuhkan.

[Lihat contoh lebih lanjut di bawah ini.](#penggunaan)

#### Parameter {/*parameters*/}

* `reactNode`: Sebuah *React node* yang ingin Anda tampilkan. Ini biasanya berupa bagian dari JSX seperti `<App />`, tetapi Anda juga dapat mengoperkan sebuah elemen React yang dibangun dengan [`createElement()`](/reference/react/createElement), sebuah `string`, sebuah `number`, `null`, atau `undefined`. 

* `domNode`: Sebuah [elemen DOM.](https://developer.mozilla.org/en-US/docs/Web/API/Element) React akan menampilkan `reactNode` yang Anda berikan di dalam elemen DOM ini. Mulai saat ini, React akan mengelola DOM di dalam `domNode` dan memperbaruinya ketika pohon React (*React tree*) Anda berubah.

* **opsional** `callback`: Sebuah fungsi. Jika dilewatkan, React akan memanggilnya setelah komponen Anda ditempatkan ke dalam DOM.


#### Kembalian {/*returns*/}

`render` biasanya mengembalikan nilai `null`. Namun, jika `reactNode` yang Anda berikan adalah sebuah komponen *class*, maka ia akan mengembalikan sebuah *instance* dari komponen tersebut.

#### Peringatan {/*caveats*/}

* Pada React 18, `render` digantikan oleh [`createRoot`.](/reference/react-dom/client/createRoot) Silakan gunakan `createRoot` untuk React 18 dan seterusnya.

* Pertama kali Anda memanggil `render`, React akan menghapus semua konten HTML yang ada di dalam `domNode` sebelum me-*render* komponen React ke dalamnya. Jika `domNode` Anda berisi HTML yang dihasilkan oleh React di server atau selama proses membangun, gunakan [`hydrate()`](/reference/react-dom/hydrate) sebagai gantinya, yang akan melampirkan *event handler* ke HTML yang ada.

* Jika Anda memanggil `render` pada `domNode` yang sama lebih dari satu kali, React akan memperbarui DOM seperlunya untuk merefleksikan JSX terbaru yang Anda berikan. React akan memutuskan bagian mana dari DOM yang dapat digunakan kembali dan mana yang perlu dibuat ulang dengan ["mencocokkannya"](/learn/preserving-and-resetting-state) dengan pohon (*tree*) yang sebelumnya di-*render*. Memanggil `render` berkali-kali pada `domNode` itu serupa dengan memanggil fungsi [`set`](/reference/react/useState#setstate) pada komponen root: React menghindari pembaruan DOM yang tidak perlu.

* Jika aplikasi Anda sepenuhnya dibangun dengan React, kemungkinan besar Anda hanya akan memiliki satu pemanggilan `render` dalam aplikasi Anda. (Jika Anda menggunakan framework, framework tersebut mungkin akan melakukan pemanggilan ini untuk Anda.) Ketika Anda ingin me-*render* sebuah bagian dari JSX di bagian yang berbeda dari pohon DOM (*DOM tree*) yang bukan merupakan turunan dari komponen Anda (misalnya, sebuah *modal* atau *tooltip*), gunakan [`createPortal`](/reference/react-dom/createPortal) sebagai pengganti `render`.

---

## Penggunaan {/*usage*/}

Panggil `render` untuk menampilkan <CodeStep step={1}>komponen React</CodeStep> di dalam <CodeStep step={2}>simpul DOM peramban</CodeStep>.

```js [[1, 4, "<App />"], [2, 4, "document.getElementById('root')"]]
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

### Me-render komponen akar {/*rendering-the-root-component*/}

Pada aplikasi yang sepenuhnya dibangun dengan React, **Anda biasanya hanya akan melakukan hal ini sekali saja pada saat memulai** - untuk me-*render* komponen "akar" (*the root componen

<Sandpack>

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import App from './App.js';

render(<App />, document.getElementById('root'));
```

```js src/App.js
export default function App() {
  return <h1>Halo, dunia!</h1>;
}
```

</Sandpack>

Biasanya Anda tidak perlu memanggil `render` lagi atau memanggilnya di banyak tempat. Mulai saat ini, React akan mengelola DOM aplikasi Anda. Untuk memperbarui UI, komponen Anda akan [use state.](/reference/react/useState)

---

### Me-render beberapa akar {/*rendering-multiple-roots*/}

Jika halaman Anda [tidak sepenuhnya dibangun dengan React](/learn/add-react-to-an-existing-project#using-react-for-a-part-of-your-existing-page), panggil `render` untuk setiap bagian teratas dari UI yang dikelola oleh React.

<Sandpack>

```html public/index.html
<nav id="navigation"></nav>
<main>
  <p>Paragraf ini tidak di-render oleh React (buka index.html untuk memverifikasi).</p>
  <section id="comments"></section>
</main>
```

```js src/index.js active
import './styles.css';
import { render } from 'react-dom';
import { Comments, Navigation } from './Components.js';

render(
  <Navigation />,
  document.getElementById('navigation')
);

render(
  <Comments />,
  document.getElementById('comments')
);
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
      <h2>Comments</h2>
      <Comment text="Halo!" author="Sophie" />
      <Comment text="Apa kabar?" author="Sunil" />
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

Anda dapat menghancurkan pohon yang di-*render* dengan [`unmountComponentAtNode()`.](/reference/react-dom/unmountComponentAtNode)

---

### Memperbarui pohon yang di-render {/*updating-the-rendered-tree*/}

Anda dapat memanggil `render` lebih dari satu kali pada simpul DOM yang sama. Selama struktur pohon komponen sesuai dengan apa yang sebelumnya di-*render*, React akan [mempertahankan state](/learn/preserving-and-resetting-state) Perhatikan bagaimana Anda dapat mengetik masukan (*input*), yang berarti pembaruan dari pemanggilan `render` yang berulang-ulang setiap detiknya tidak bersifat destruktif:

<Sandpack>

```js src/index.js active
import { render } from 'react-dom';
import './styles.css';
import App from './App.js';

let i = 0;
setInterval(() => {
  render(
    <App counter={i} />,
    document.getElementById('root')
  );
  i++;
}, 1000);
```

```js src/App.js
export default function App({counter}) {
  return (
    <>
      <h1>Halo, dunia! {counter}</h1>
      <input placeholder="Ketik sesuatu disini" />
    </>
  );
}
```

</Sandpack>

Tidak umum untuk memanggil `render` beberapa kali. Biasanya, Anda akan [update state](/reference/react/useState) di dalam komponen Anda.
