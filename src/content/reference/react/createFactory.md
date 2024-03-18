---
title: createFactory
---

<Deprecated>

API ini akan dihapus pada versi mayor React berikutnya. [Lihat beberapa alternatifnya.](#alternatives)

</Deprecated>

<Intro>

`createFactory` memungkinkan Anda membuat fungsi yang menghasilkan elemen-elemen React dengan tipe yang ditentukan

```js
const factory = createFactory(type)
```

</Intro>

<InlineToc />

---

## Referensi {/*reference*/}

### `createFactory(type)` {/*createfactory*/}

Panggil `createFactory(type)` untuk membuat sebuah fungsi pabrik (*factory function*) yang menghasilkan elemen-elemen React dengan `type` yang ditentukan.

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Lalu Anda dapat menggunakannya untuk membuat elemen-elemen React tanpa JSX :

```js
export default function App() {
  return button({
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

[Lihat contoh-contoh lainnya di bawah ini.](#usage)

#### Parameter {/*parameters*/}

* `type`: Argumen `type` harus merupakan tipe komponen React yang valid. Misalnya, bisa berupa string nama tag (seperti `'div'` atau `'span'`), atau komponen React (fungsi, kelas, atau komponen khusus seperti [`Fragment`](/reference/react/Fragment)).

#### Kembalian {/*returns*/}

Mengembalikan sebuah fungsi pabrik. Fungsi pabrik tersebut menerima objek `props` sebagai argumen pertama, diikuti oleh daftar argumen `...children`, dan mengembalikan elemen React dengan `type`, `props`, dan `children` yang diberikan.

---

## Penggunaan {/*usage*/}

### Membuat elemen-elemen React dengan menggunakan fungsi pabrik {/*creating-react-elements-with-a-factory*/}

Meskipun sebagian besar proyek React menggunakan [JSX](/learn/writing-markup-with-jsx) untuk mendeskripsikan antarmuka pengguna, JSX tidak diperlukan. Di masa lalu, `createFactory` digunakan sebagai salah satu cara untuk mendeskripsikan antarmuka pengguna tanpa menggunakan JSX

Panggil `createFactory` untuk membuat sebuah fungsi pabrik untuk tipe elemen tertentu seperti `'button'`:

```js
import { createFactory } from 'react';

const button = createFactory('button');
```

Memanggil fungsi pabrik tersebut akan menghasilkan elemen-elemen React dengan props dan children yang telah Anda berikan:

<Sandpack>

```js src/App.js
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

</Sandpack>

Berikut adalah bagaimana `createFactory` digunakan sebagai alternatif untuk JSX. Namun, `createFactory` sudah tidak digunakan lagi (deprecated), dan Anda sebaiknya tidak menggunakan `createFactory` dalam kode baru. Berikut adalah cara melakukan migrasi dari `createFactory`:

---

## Alternatif {/*alternatives*/}

### Menyalin `createFactory` ke dalam proyek Anda {/*copying-createfactory-into-your-project*/}

Jika proyek Anda memiliki banyak panggilan `createFactory`, salin implementasi `createFactory.js` ini ke dalam proyek Anda:

<Sandpack>

```js src/App.js
import { createFactory } from './createFactory.js';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

```js src/createFactory.js
import { createElement } from 'react';

export function createFactory(type) {
  return createElement.bind(null, type);
}
```

</Sandpack>

Ini memungkinkan Anda menjaga semua kode Anda tetap tidak berubah kecuali impor-impornya.

---

### Mengganti `createFactory` dengan `createElement` {/*replacing-createfactory-with-createelement*/}

Jika Anda memiliki beberapa panggilan `createFactory` yang tidak masalah untuk dipindahkan secara manual, dan Anda tidak ingin menggunakan JSX, Anda dapat menggantikan setiap panggilan fungsi pabrik dengan panggilan [`createElement`](/reference/react/createElement). Sebagai contoh, Anda dapat menggantikan kode ini:

```js {1,3,6}
import { createFactory } from 'react';

const button = createFactory('button');

export default function App() {
  return button({
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

dengan kode ini:


```js {1,4}
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

Berikut ini adalah contoh lengkap penggunaan React tanpa JSX:

<Sandpack>

```js src/App.js
import { createElement } from 'react';

export default function App() {
  return createElement('button', {
    onClick: () => {
      alert('Sudah diklik!')
    }
  }, 'Klik saya');
}
```

</Sandpack>

---

### Mengganti `createFactory` dengan JSX {/*replacing-createfactory-with-jsx*/}

Akhirnya, Anda dapat menggunakan JSX sebagai pengganti `createFactory`. Ini adalah cara yang paling umum digunakan dalam penggunaan React:

<Sandpack>

```js src/App.js
export default function App() {
  return (
    <button onClick={() => {
      alert('Sudah diklik!');
    }}>
      Klik saya
    </button>
  );
};
```

</Sandpack>

<Pitfall>


Terkadang, kode yang ada mungkin mengirimkan beberapa variabel sebagai `type` daripada konstan seperti `'button'`:

```js {3}
function Heading({ isSubheading, ...props }) {
  const type = isSubheading ? 'h2' : 'h1';
  const factory = createFactory(type);
  return factory(props);
}
```

Untuk melakukan hal yang sama dalam JSX, Anda perlu mengganti nama variabel Anda agar diawali dengan huruf kapital seperti `Type`:

```js {2,3}
function Heading({ isSubheading, ...props }) {
  const Type = isSubheading ? 'h2' : 'h1';
  return <Type {...props} />;
}
```

Sebaliknya, React akan menafsirkan `<type>` sebagai tag HTML bawaan karena ditulis dengan huruf kecil.

</Pitfall>
